"""
Database Models for Authentication
SQLAlchemy ORM models
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)

    # Password (hashed)
    hashed_password = Column(String, nullable=False)

    # Email verification
    email_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    verification_token_expires = Column(DateTime, nullable=True)

    # Password reset
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)

    # Account status
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime, nullable=True)

    # Profile
    avatar_url = Column(String, nullable=True)
    github_id = Column(String, nullable=True)
    github_username = Column(String, nullable=True)

    # Preferences
    theme = Column(String, default="light")
    role = Column(String, default="user")  # user, admin, etc.

    def __repr__(self):
        return f"<User {self.email}>"


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    token = Column(String, unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    revoked = Column(Boolean, default=False)

    # Device info (for security)
    device_info = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)

    def __repr__(self):
        return f"<RefreshToken {self.user_id}>"


class LoginAttempt(Base):
    """Track failed login attempts for rate limiting"""
    __tablename__ = "login_attempts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, index=True)
    ip_address = Column(String, index=True)
    success = Column(Boolean, default=False)
    attempted_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<LoginAttempt {self.email} at {self.attempted_at}>"
