"""
Database Configuration and Connection
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from typing import Generator
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL (SQLite for development, PostgreSQL for production)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./aira.db"  # Default to SQLite for local dev
)

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    pool_pre_ping=True,
    echo=False  # Set to True for SQL debugging
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """
    Dependency for getting database session
    Usage: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    from models.user import Base as UserBase
    UserBase.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")

def drop_db():
    """Drop all database tables (use with caution!)"""
    from models.user import Base as UserBase
    UserBase.metadata.drop_all(bind=engine)
    print("⚠️  Database tables dropped")
