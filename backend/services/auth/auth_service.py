"""
Authentication Service
Core business logic for user authentication
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import secrets

from models.user import User, RefreshToken, LoginAttempt
from services.auth.security import (
    hash_password,
    verify_password,
    create_verification_token,
    create_reset_token,
    generate_tokens,
    decode_token
)
from services.auth.email_service import EmailService
from schemas.auth import UserCreate, UserUpdate

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.email_service = EmailService()

    # ========================================================================
    # USER MANAGEMENT
    # ========================================================================

    async def create_user(self, user_data: UserCreate) -> User:
        """
        Create a new user account

        Raises:
            HTTPException: If email or username already exists
        """
        # Check if email exists
        existing_email = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Check if username exists
        existing_username = self.db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

        # Create user
        hashed_pwd = hash_password(user_data.password)
        verification_token = create_verification_token()

        user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            hashed_password=hashed_pwd,
            verification_token=verification_token,
            verification_token_expires=datetime.utcnow() + timedelta(days=1),
            email_verified=False,
            is_active=True
        )

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        # Send verification email
        await self.email_service.send_verification_email(
            to_email=user.email,
            username=user.username,
            verification_token=verification_token
        )

        return user

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()

    def update_user(self, user_id: str, user_data: UserUpdate) -> User:
        """Update user profile"""
        user = self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Update fields
        if user_data.full_name is not None:
            user.full_name = user_data.full_name
        if user_data.avatar_url is not None:
            user.avatar_url = user_data.avatar_url
        if user_data.theme is not None:
            user.theme = user_data.theme

        self.db.commit()
        self.db.refresh(user)
        return user

    # ========================================================================
    # AUTHENTICATION
    # ========================================================================

    def authenticate_user(self, email: str, password: str, ip_address: str) -> Optional[User]:
        """
        Authenticate user credentials

        Returns:
            User if valid, None if invalid
        """
        # Check rate limiting (max 5 failed attempts in 15 minutes)
        recent_attempts = self.db.query(LoginAttempt).filter(
            LoginAttempt.email == email,
            LoginAttempt.attempted_at >= datetime.utcnow() - timedelta(minutes=15),
            LoginAttempt.success == False
        ).count()

        if recent_attempts >= 5:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many failed login attempts. Please try again later."
            )

        user = self.get_user_by_email(email)

        # Log login attempt
        attempt = LoginAttempt(
            email=email,
            ip_address=ip_address,
            success=False
        )

        if not user or not verify_password(password, user.hashed_password):
            self.db.add(attempt)
            self.db.commit()
            return None

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )

        # Successful login
        attempt.success = True
        user.last_login = datetime.utcnow()
        self.db.add(attempt)
        self.db.commit()
        self.db.refresh(user)

        return user

    def create_user_tokens(self, user_id: str, device_info: str = None, ip_address: str = None) -> Dict[str, str]:
        """Create access and refresh tokens for user"""
        tokens = generate_tokens(user_id)

        # Store refresh token in database
        refresh_token_record = RefreshToken(
            user_id=user_id,
            token=tokens["refresh_token"],
            expires_at=datetime.utcnow() + timedelta(days=30),
            device_info=device_info,
            ip_address=ip_address
        )
        self.db.add(refresh_token_record)
        self.db.commit()

        return tokens

    def refresh_access_token(self, refresh_token: str) -> str:
        """
        Generate new access token from refresh token

        Raises:
            HTTPException: If refresh token is invalid or revoked
        """
        # Decode token
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        # Check if token exists in database and not revoked
        token_record = self.db.query(RefreshToken).filter(
            RefreshToken.token == refresh_token,
            RefreshToken.revoked == False
        ).first()

        if not token_record:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token revoked or not found"
            )

        # Check expiration
        if token_record.expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired"
            )

        # Generate new access token
        from services.auth.security import create_access_token
        new_access_token = create_access_token(data={"sub": payload["sub"]})

        return new_access_token

    def revoke_refresh_token(self, refresh_token: str) -> bool:
        """Revoke a refresh token (logout)"""
        token_record = self.db.query(RefreshToken).filter(
            RefreshToken.token == refresh_token
        ).first()

        if token_record:
            token_record.revoked = True
            self.db.commit()
            return True

        return False

    # ========================================================================
    # EMAIL VERIFICATION
    # ========================================================================

    async def verify_email(self, token: str) -> User:
        """
        Verify user email with token

        Raises:
            HTTPException: If token is invalid or expired
        """
        user = self.db.query(User).filter(
            User.verification_token == token
        ).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification token"
            )

        if user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already verified"
            )

        if user.verification_token_expires < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification token expired"
            )

        # Verify email
        user.email_verified = True
        user.verification_token = None
        user.verification_token_expires = None
        self.db.commit()
        self.db.refresh(user)

        # Send welcome email
        await self.email_service.send_welcome_email(
            to_email=user.email,
            username=user.username
        )

        return user

    async def resend_verification_email(self, email: str) -> bool:
        """Resend verification email"""
        user = self.get_user_by_email(email)

        if not user:
            # Don't reveal if email exists
            return True

        if user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already verified"
            )

        # Generate new token
        verification_token = create_verification_token()
        user.verification_token = verification_token
        user.verification_token_expires = datetime.utcnow() + timedelta(days=1)
        self.db.commit()

        # Send email
        await self.email_service.send_verification_email(
            to_email=user.email,
            username=user.username,
            verification_token=verification_token
        )

        return True

    # ========================================================================
    # PASSWORD RESET
    # ========================================================================

    async def request_password_reset(self, email: str) -> bool:
        """Request password reset"""
        user = self.get_user_by_email(email)

        if not user:
            # Don't reveal if email exists
            return True

        # Generate reset token
        reset_token = create_reset_token()
        user.reset_token = reset_token
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        self.db.commit()

        # Send reset email
        await self.email_service.send_password_reset_email(
            to_email=user.email,
            username=user.username,
            reset_token=reset_token
        )

        return True

    def reset_password(self, token: str, new_password: str) -> User:
        """
        Reset password with token

        Raises:
            HTTPException: If token is invalid or expired
        """
        user = self.db.query(User).filter(
            User.reset_token == token
        ).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )

        if user.reset_token_expires < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token expired"
            )

        # Update password
        user.hashed_password = hash_password(new_password)
        user.reset_token = None
        user.reset_token_expires = None
        self.db.commit()
        self.db.refresh(user)

        # Revoke all existing refresh tokens (logout all devices)
        self.db.query(RefreshToken).filter(
            RefreshToken.user_id == user.id,
            RefreshToken.revoked == False
        ).update({"revoked": True})
        self.db.commit()

        return user

    def change_password(self, user_id: str, current_password: str, new_password: str) -> User:
        """
        Change password (requires current password)

        Raises:
            HTTPException: If current password is incorrect
        """
        user = self.get_user_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        if not verify_password(current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )

        # Update password
        user.hashed_password = hash_password(new_password)
        self.db.commit()
        self.db.refresh(user)

        return user
