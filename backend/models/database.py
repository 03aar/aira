"""
Production-Grade Database Configuration and Connection Pool
Optimized for high-traffic environments with proper pooling and health checks
"""

from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.pool import QueuePool, NullPool
from typing import Generator
import os
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Database URL (SQLite for development, PostgreSQL for production)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./aira.db"  # Default to SQLite for local dev
)

# Environment
ENV = os.getenv("ENV", "development")
IS_PRODUCTION = ENV == "production"

# Production-grade connection pool configuration
POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "20"))  # Number of permanent connections
MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "40"))  # Additional connections when pool is full
POOL_TIMEOUT = int(os.getenv("DB_POOL_TIMEOUT", "30"))  # Seconds to wait for connection
POOL_RECYCLE = int(os.getenv("DB_POOL_RECYCLE", "3600"))  # Recycle connections after 1 hour

# Create engine with production-optimized settings
if "sqlite" in DATABASE_URL:
    # SQLite-specific configuration (development)
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=NullPool,  # SQLite doesn't need connection pooling
        echo=not IS_PRODUCTION,  # SQL logging in development only
    )
    logger.info("🗄️  Using SQLite database (Development mode)")
else:
    # PostgreSQL production configuration
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=POOL_SIZE,
        max_overflow=MAX_OVERFLOW,
        pool_timeout=POOL_TIMEOUT,
        pool_recycle=POOL_RECYCLE,
        pool_pre_ping=True,  # Test connections before using
        echo=False,  # Disable SQL logging in production
        echo_pool=False,  # Disable pool logging
        connect_args={
            "connect_timeout": 10,
            "options": "-c timezone=utc",
        },
    )
    logger.info(f"🗄️  PostgreSQL connection pool initialized (size={POOL_SIZE}, max_overflow={MAX_OVERFLOW})")

# Connection event listeners for monitoring
@event.listens_for(engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """Log new database connections"""
    logger.debug("🔗 New database connection established")


@event.listens_for(engine, "checkin")
def receive_checkin(dbapi_conn, connection_record):
    """Log when connections are returned to the pool"""
    logger.debug("↩️  Connection returned to pool")


@event.listens_for(engine, "checkout")
def receive_checkout(dbapi_conn, connection_record, connection_proxy):
    """Log when connections are checked out from the pool"""
    logger.debug("↪️  Connection checked out from pool")


# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency for getting database session
    Usage: db: Session = Depends(get_db)

    Provides automatic session management with:
    - Automatic commit on success
    - Automatic rollback on error
    - Automatic connection cleanup
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"❌ Database error: {e}")
        raise
    finally:
        db.close()


def init_db():
    """
    Initialize database tables
    Creates all tables defined in models
    """
    from models.user import Base as UserBase
    try:
        UserBase.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
        print("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {e}")
        raise


def drop_db():
    """
    Drop all database tables (use with caution!)
    WARNING: This will delete all data
    """
    from models.user import Base as UserBase
    try:
        UserBase.metadata.drop_all(bind=engine)
        logger.warning("⚠️  Database tables dropped")
        print("⚠️  Database tables dropped")
    except Exception as e:
        logger.error(f"❌ Failed to drop database tables: {e}")
        raise


def check_db_health() -> dict:
    """
    Check database health and return status

    Returns:
        dict: {
            "status": "healthy" | "unhealthy",
            "database": "postgresql" | "sqlite",
            "pool_size": int,
            "pool_overflow": int,
            "connections": int
        }
    """
    try:
        # Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        # Get pool statistics (if using pooling)
        pool_stats = {}
        if hasattr(engine.pool, 'size'):
            pool_stats = {
                "pool_size": engine.pool.size(),
                "pool_overflow": engine.pool.overflow(),
                "connections_checked_out": engine.pool.checkedout(),
            }

        return {
            "status": "healthy",
            "database": "postgresql" if "postgresql" in DATABASE_URL else "sqlite",
            **pool_stats
        }
    except Exception as e:
        logger.error(f"❌ Database health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }


def get_pool_status() -> dict:
    """
    Get detailed connection pool status

    Returns:
        dict: Pool statistics and configuration
    """
    if not hasattr(engine.pool, 'size'):
        return {"message": "Connection pooling not available (using SQLite)"}

    return {
        "pool_size": POOL_SIZE,
        "max_overflow": MAX_OVERFLOW,
        "pool_timeout": POOL_TIMEOUT,
        "pool_recycle": POOL_RECYCLE,
        "current_connections": engine.pool.size(),
        "overflow_connections": engine.pool.overflow(),
        "checked_out": engine.pool.checkedout(),
        "checked_in": engine.pool.size() - engine.pool.checkedout(),
    }
