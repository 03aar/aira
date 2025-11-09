"""
Database Models for Authentication
Production-grade SQLAlchemy ORM models with indexes, constraints, and relationships
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Index
from sqlalchemy.orm import relationship
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

    # Relationships
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")

    # Composite indexes for common queries
    __table_args__ = (
        Index('idx_user_email_active', 'email', 'is_active'),
        Index('idx_user_github', 'github_id', 'github_username'),
        Index('idx_user_verification', 'verification_token', 'email_verified'),
    )

    def __repr__(self):
        return f"<User {self.email}>"


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    token = Column(String, unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    revoked = Column(Boolean, default=False, index=True)

    # Device info (for security)
    device_info = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)

    # Relationships
    user = relationship("User", back_populates="refresh_tokens")

    # Composite indexes for token validation queries
    __table_args__ = (
        Index('idx_token_valid', 'token', 'revoked', 'expires_at'),
        Index('idx_user_tokens', 'user_id', 'revoked', 'expires_at'),
    )

    def __repr__(self):
        return f"<RefreshToken {self.user_id}>"


class LoginAttempt(Base):
    """Track failed login attempts for rate limiting"""
    __tablename__ = "login_attempts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, index=True, nullable=False)
    ip_address = Column(String, index=True, nullable=False)
    success = Column(Boolean, default=False, index=True)
    attempted_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Composite indexes for rate limiting queries
    __table_args__ = (
        Index('idx_email_time', 'email', 'attempted_at'),
        Index('idx_ip_time', 'ip_address', 'attempted_at'),
        Index('idx_email_ip_time', 'email', 'ip_address', 'attempted_at'),
    )

    def __repr__(self):
        return f"<LoginAttempt {self.email} at {self.attempted_at}>"
