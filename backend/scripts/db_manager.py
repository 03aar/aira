#!/usr/bin/env python3
"""
Database Management CLI
Comprehensive database operations for AIRA
"""

import os
import sys
from pathlib import Path
import click

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv()


@click.group()
def cli():
    """AIRA Database Management CLI"""
    pass


@cli.command()
def init():
    """Initialize database (create all tables)"""
    click.echo("🗄️  Initializing database...")
    from models.database import init_db
    try:
        init_db()
        click.echo("✅ Database initialized successfully!")
    except Exception as e:
        click.echo(f"❌ Failed to initialize database: {e}", err=True)
        sys.exit(1)


@cli.command()
@click.confirmation_option(prompt="Are you sure you want to drop all tables?")
def drop():
    """Drop all database tables (DANGEROUS!)"""
    click.echo("⚠️  Dropping all tables...")
    from models.database import drop_db
    try:
        drop_db()
        click.echo("✅ All tables dropped!")
    except Exception as e:
        click.echo(f"❌ Failed to drop tables: {e}", err=True)
        sys.exit(1)


@cli.command()
def reset():
    """Reset database (drop and recreate all tables)"""
    click.echo("♻️  Resetting database...")
    from models.database import drop_db, init_db
    try:
        drop_db()
        init_db()
        click.echo("✅ Database reset successfully!")
    except Exception as e:
        click.echo(f"❌ Failed to reset database: {e}", err=True)
        sys.exit(1)


@cli.command()
def health():
    """Check database health"""
    click.echo("🏥 Checking database health...")
    from models.database import check_db_health
    status = check_db_health()

    if status["status"] == "healthy":
        click.echo("✅ Database is healthy!")
        click.echo(f"   Database type: {status.get('database', 'unknown')}")
        if "pool_size" in status:
            click.echo(f"   Pool size: {status['pool_size']}")
            click.echo(f"   Pool overflow: {status['pool_overflow']}")
            click.echo(f"   Checked out connections: {status['connections_checked_out']}")
    else:
        click.echo(f"❌ Database is unhealthy: {status.get('error', 'unknown error')}", err=True)
        sys.exit(1)


@cli.command()
def pool():
    """Show connection pool status"""
    click.echo("🔗 Connection Pool Status:")
    from models.database import get_pool_status
    status = get_pool_status()

    for key, value in status.items():
        click.echo(f"   {key}: {value}")


@cli.command()
def migrate():
    """Run database migrations (upgrade to latest)"""
    click.echo("📦 Running database migrations...")
    import subprocess
    try:
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            cwd=Path(__file__).parent.parent,
            check=True,
            capture_output=True,
            text=True
        )
        click.echo(result.stdout)
        click.echo("✅ Migrations applied successfully!")
    except subprocess.CalledProcessError as e:
        click.echo(f"❌ Migration failed: {e.stderr}", err=True)
        sys.exit(1)


@cli.command()
@click.argument("message")
def create_migration(message):
    """Create a new migration"""
    click.echo(f"📝 Creating migration: {message}")
    import subprocess
    try:
        result = subprocess.run(
            ["alembic", "revision", "--autogenerate", "-m", message],
            cwd=Path(__file__).parent.parent,
            check=True,
            capture_output=True,
            text=True
        )
        click.echo(result.stdout)
        click.echo("✅ Migration created successfully!")
    except subprocess.CalledProcessError as e:
        click.echo(f"❌ Failed to create migration: {e.stderr}", err=True)
        sys.exit(1)


@cli.command()
def rollback():
    """Rollback last migration"""
    click.echo("↩️  Rolling back last migration...")
    import subprocess
    try:
        result = subprocess.run(
            ["alembic", "downgrade", "-1"],
            cwd=Path(__file__).parent.parent,
            check=True,
            capture_output=True,
            text=True
        )
        click.echo(result.stdout)
        click.echo("✅ Migration rolled back successfully!")
    except subprocess.CalledProcessError as e:
        click.echo(f"❌ Rollback failed: {e.stderr}", err=True)
        sys.exit(1)


@cli.command()
def history():
    """Show migration history"""
    click.echo("📜 Migration History:")
    import subprocess
    try:
        result = subprocess.run(
            ["alembic", "history"],
            cwd=Path(__file__).parent.parent,
            check=True,
            capture_output=True,
            text=True
        )
        click.echo(result.stdout)
    except subprocess.CalledProcessError as e:
        click.echo(f"❌ Failed to get history: {e.stderr}", err=True)
        sys.exit(1)


@cli.command()
def backup():
    """Create database backup"""
    click.echo("💾 Creating database backup...")
    from scripts.db_backup import create_backup
    if create_backup():
        click.echo("✅ Backup created successfully!")
    else:
        click.echo("❌ Backup failed!", err=True)
        sys.exit(1)


@cli.command()
def list_backups():
    """List all available backups"""
    from scripts.db_backup import list_backups
    list_backups()


@cli.command()
@click.argument("backup_file", required=False)
def restore(backup_file):
    """Restore database from backup"""
    if backup_file:
        from scripts.db_restore import restore_backup
        backup_path = Path(backup_file)
        if restore_backup(backup_path):
            click.echo("✅ Restore completed successfully!")
        else:
            click.echo("❌ Restore failed!", err=True)
            sys.exit(1)
    else:
        from scripts.db_restore import interactive_restore
        interactive_restore()


@cli.command()
def shell():
    """Open database shell (SQLite or psql)"""
    database_url = os.getenv("DATABASE_URL", "sqlite:///./aira.db")
    click.echo("🐚 Opening database shell...")

    if "sqlite" in database_url:
        db_path = database_url.replace("sqlite:///", "")
        os.system(f"sqlite3 {db_path}")
    elif "postgresql" in database_url:
        import urllib.parse
        parsed = urllib.parse.urlparse(database_url)
        os.environ['PGPASSWORD'] = parsed.password
        os.system(f"psql -h {parsed.hostname} -p {parsed.port or 5432} -U {parsed.username} -d {parsed.path[1:]}")
    else:
        click.echo("❌ Unsupported database type", err=True)


@cli.command()
def seed():
    """Seed database with sample data (for development)"""
    click.echo("🌱 Seeding database with sample data...")

    from models.database import SessionLocal
    from models.user import User
    from services.auth.security import hash_password
    import uuid

    db = SessionLocal()
    try:
        # Check if admin user exists
        admin = db.query(User).filter(User.email == "admin@aira.dev").first()
        if admin:
            click.echo("   Admin user already exists.")
        else:
            # Create admin user
            admin = User(
                id=str(uuid.uuid4()),
                email="admin@aira.dev",
                username="admin",
                full_name="Admin User",
                hashed_password=hash_password("admin123"),
                email_verified=True,
                is_active=True,
                is_superuser=True,
                role="admin"
            )
            db.add(admin)
            db.commit()
            click.echo("✅ Admin user created:")
            click.echo("   Email: admin@aira.dev")
            click.echo("   Password: admin123")

        # Create test user
        test_user = db.query(User).filter(User.email == "user@aira.dev").first()
        if test_user:
            click.echo("   Test user already exists.")
        else:
            test_user = User(
                id=str(uuid.uuid4()),
                email="user@aira.dev",
                username="testuser",
                full_name="Test User",
                hashed_password=hash_password("user123"),
                email_verified=True,
                is_active=True,
                role="user"
            )
            db.add(test_user)
            db.commit()
            click.echo("✅ Test user created:")
            click.echo("   Email: user@aira.dev")
            click.echo("   Password: user123")

        click.echo("✅ Database seeded successfully!")

    except Exception as e:
        db.rollback()
        click.echo(f"❌ Seeding failed: {e}", err=True)
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    cli()
