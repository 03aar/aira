"""
Authentication API Endpoints
Complete auth flow with login, signup, verification, password reset
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional

from models.database import get_db
from models.user import User
from services.auth.auth_service import AuthService
from services.auth.security import decode_token
from schemas.auth import (
    UserCreate,
    UserResponse,
    UserUpdate,
    LoginRequest,
    LoginResponse,
    TokenRefreshRequest,
    TokenResponse,
    PasswordResetRequest,
    PasswordResetConfirm,
    PasswordChangeRequest,
    EmailVerificationRequest,
    ResendVerificationRequest,
    MessageResponse,
    ErrorResponse
)

router = APIRouter()
security = HTTPBearer()

# ============================================================================
# DEPENDENCIES
# ============================================================================

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get current authenticated user from JWT token
    Usage: current_user: User = Depends(get_current_user)
    """
    token = credentials.credentials
    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    auth_service = AuthService(db)
    user = auth_service.get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return user

async def get_current_active_verified_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Require email verification"""
    if not current_user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified"
        )
    return current_user

# ============================================================================
# SIGNUP & LOGIN
# ============================================================================

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new user account

    - **email**: Valid email address
    - **username**: 3-50 characters, alphanumeric + underscores
    - **password**: Minimum 8 characters, must include uppercase, lowercase, and number
    - **full_name**: Optional full name

    Returns the created user (without password)
    Sends verification email automatically
    """
    auth_service = AuthService(db)
    user = await auth_service.create_user(user_data)
    return user

@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Login with email and password

    Returns:
    - **access_token**: Short-lived JWT (30 minutes)
    - **refresh_token**: Long-lived JWT (30 days)
    - **user**: User information

    Access token should be sent in Authorization header: `Bearer <token>`
    """
    auth_service = AuthService(db)

    # Get client IP
    client_ip = request.client.host if request.client else "unknown"

    # Authenticate
    user = auth_service.authenticate_user(
        email=login_data.email,
        password=login_data.password,
        ip_address=client_ip
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Generate tokens
    user_agent = request.headers.get("user-agent", "unknown")
    tokens = auth_service.create_user_tokens(
        user_id=user.id,
        device_info=user_agent,
        ip_address=client_ip
    )

    return LoginResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type=tokens["token_type"],
        user=user
    )

@router.post("/logout")
async def logout(
    refresh_token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Logout user by revoking refresh token

    Requires:
    - Valid access token in Authorization header
    - Refresh token in request body
    """
    auth_service = AuthService(db)
    auth_service.revoke_refresh_token(refresh_token)
    return MessageResponse(message="Logged out successfully")

# ============================================================================
# TOKEN MANAGEMENT
# ============================================================================

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    token_data: TokenRefreshRequest,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token

    When access token expires, use this endpoint with refresh token
    to get a new access token without re-login
    """
    auth_service = AuthService(db)
    new_access_token = auth_service.refresh_access_token(token_data.refresh_token)

    return TokenResponse(
        access_token=new_access_token,
        token_type="bearer"
    )

# ============================================================================
# EMAIL VERIFICATION
# ============================================================================

@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(
    verification_data: EmailVerificationRequest,
    db: Session = Depends(get_db)
):
    """
    Verify email address with token

    Token is sent to user's email after signup
    """
    auth_service = AuthService(db)
    await auth_service.verify_email(verification_data.token)
    return MessageResponse(message="Email verified successfully")

@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification(
    email_data: ResendVerificationRequest,
    db: Session = Depends(get_db)
):
    """
    Resend verification email

    Use this if user didn't receive verification email
    """
    auth_service = AuthService(db)
    await auth_service.resend_verification_email(email_data.email)
    return MessageResponse(message="Verification email sent")

# ============================================================================
# PASSWORD RESET
# ============================================================================

@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    reset_data: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """
    Request password reset

    Sends reset link to user's email
    """
    auth_service = AuthService(db)
    await auth_service.request_password_reset(reset_data.email)
    return MessageResponse(message="Password reset email sent")

@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    reset_data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """
    Reset password with token

    Token is sent to user's email from forgot-password endpoint
    """
    auth_service = AuthService(db)
    auth_service.reset_password(reset_data.token, reset_data.new_password)
    return MessageResponse(message="Password reset successfully")

@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    password_data: PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Change password (requires current password)

    For authenticated users who want to change their password
    """
    auth_service = AuthService(db)
    auth_service.change_password(
        user_id=current_user.id,
        current_password=password_data.current_password,
        new_password=password_data.new_password
    )
    return MessageResponse(message="Password changed successfully")

# ============================================================================
# USER PROFILE
# ============================================================================

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user's profile

    Requires valid access token in Authorization header
    """
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update current user's profile

    Can update:
    - full_name
    - avatar_url
    - theme
    """
    auth_service = AuthService(db)
    updated_user = auth_service.update_user(current_user.id, user_data)
    return updated_user

# ============================================================================
# HEALTH CHECK
# ============================================================================

@router.get("/health")
async def auth_health_check():
    """Check if auth service is running"""
    return {
        "status": "healthy",
        "service": "authentication",
        "features": [
            "signup",
            "login",
            "email_verification",
            "password_reset",
            "token_refresh"
        ]
    }
