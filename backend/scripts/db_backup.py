#!/usr/bin/env python3
"""
Database Backup Script
Creates timestamped backups of the database
"""

import os
import sys
from pathlib import Path
from datetime import datetime
import subprocess
import shutil

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aira.db")
BACKUP_DIR = os.getenv("BACKUP_DIR", "./backups")


def create_backup():
    """Create database backup"""
    # Create backup directory
    backup_dir = Path(BACKUP_DIR)
    backup_dir.mkdir(parents=True, exist_ok=True)

    # Generate timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    if "sqlite" in DATABASE_URL:
        # SQLite backup
        db_path = DATABASE_URL.replace("sqlite:///", "")
        db_file = Path(db_path)

        if not db_file.exists():
            print(f"❌ Database file not found: {db_file}")
            return False

        backup_file = backup_dir / f"aira_backup_{timestamp}.db"
        shutil.copy2(db_file, backup_file)
        print(f"✅ SQLite backup created: {backup_file}")
        print(f"   Size: {backup_file.stat().st_size / 1024:.2f} KB")

    elif "postgresql" in DATABASE_URL:
        # PostgreSQL backup using pg_dump
        backup_file = backup_dir / f"aira_backup_{timestamp}.sql"

        # Parse DATABASE_URL
        # Format: postgresql://user:password@host:port/dbname
        import urllib.parse
        parsed = urllib.parse.urlparse(DATABASE_URL)

        env = os.environ.copy()
        env['PGPASSWORD'] = parsed.password

        cmd = [
            "pg_dump",
            "-h", parsed.hostname,
            "-p", str(parsed.port or 5432),
            "-U", parsed.username,
            "-d", parsed.path[1:],  # Remove leading /
            "-F", "c",  # Custom format (compressed)
            "-f", str(backup_file)
        ]

        try:
            subprocess.run(cmd, env=env, check=True)
            print(f"✅ PostgreSQL backup created: {backup_file}")
            print(f"   Size: {backup_file.stat().st_size / (1024*1024):.2f} MB")
        except subprocess.CalledProcessError as e:
            print(f"❌ Backup failed: {e}")
            return False
        except FileNotFoundError:
            print("❌ pg_dump not found. Install PostgreSQL client tools.")
            return False

    else:
        print(f"❌ Unsupported database type: {DATABASE_URL}")
        return False

    # Clean old backups (keep last 30)
    cleanup_old_backups(backup_dir)

    return True


def cleanup_old_backups(backup_dir: Path, keep_count: int = 30):
    """Remove old backups, keeping only the most recent ones"""
    backups = sorted(backup_dir.glob("aira_backup_*"), key=lambda x: x.stat().st_mtime)

    if len(backups) > keep_count:
        old_backups = backups[:-keep_count]
        for backup in old_backups:
            backup.unlink()
            print(f"🗑️  Removed old backup: {backup.name}")


def list_backups():
    """List all available backups"""
    backup_dir = Path(BACKUP_DIR)

    if not backup_dir.exists():
        print("No backups directory found.")
        return

    backups = sorted(backup_dir.glob("aira_backup_*"), key=lambda x: x.stat().st_mtime, reverse=True)

    if not backups:
        print("No backups found.")
        return

    print(f"\n📦 Available Backups ({len(backups)}):")
    print("-" * 70)
    for i, backup in enumerate(backups, 1):
        size = backup.stat().st_size
        size_str = f"{size / (1024*1024):.2f} MB" if size > 1024*1024 else f"{size / 1024:.2f} KB"
        mtime = datetime.fromtimestamp(backup.stat().st_mtime).strftime("%Y-%m-%d %H:%M:%S")
        print(f"{i:2d}. {backup.name:40s} {size_str:>12s}  {mtime}")
    print("-" * 70)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Database backup utility")
    parser.add_argument("--list", action="store_true", help="List all backups")
    args = parser.parse_args()

    if args.list:
        list_backups()
    else:
        print("🗄️  Creating database backup...")
        if create_backup():
            print("✅ Backup completed successfully!")
        else:
            print("❌ Backup failed!")
            sys.exit(1)
