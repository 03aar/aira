#!/usr/bin/env python3
"""
Database Restore Script
Restores database from backup
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


def list_backups():
    """List all available backups and return them"""
    backup_dir = Path(BACKUP_DIR)

    if not backup_dir.exists():
        return []

    backups = sorted(backup_dir.glob("aira_backup_*"), key=lambda x: x.stat().st_mtime, reverse=True)
    return backups


def restore_backup(backup_file: Path):
    """Restore database from backup"""

    if not backup_file.exists():
        print(f"❌ Backup file not found: {backup_file}")
        return False

    print(f"⚠️  WARNING: This will overwrite your current database!")
    print(f"   Restoring from: {backup_file.name}")

    # Ask for confirmation
    response = input("   Are you sure? (yes/no): ")
    if response.lower() != "yes":
        print("❌ Restore cancelled.")
        return False

    if "sqlite" in DATABASE_URL:
        # SQLite restore
        db_path = DATABASE_URL.replace("sqlite:///", "")
        db_file = Path(db_path)

        # Create backup of current database before restoring
        if db_file.exists():
            backup_current = db_file.with_suffix(".db.backup")
            shutil.copy2(db_file, backup_current)
            print(f"📦 Current database backed up to: {backup_current}")

        # Restore from backup
        shutil.copy2(backup_file, db_file)
        print(f"✅ SQLite database restored from: {backup_file}")

    elif "postgresql" in DATABASE_URL:
        # PostgreSQL restore using pg_restore
        import urllib.parse
        parsed = urllib.parse.urlparse(DATABASE_URL)

        env = os.environ.copy()
        env['PGPASSWORD'] = parsed.password

        # Drop and recreate database (requires superuser or database owner)
        cmd = [
            "pg_restore",
            "-h", parsed.hostname,
            "-p", str(parsed.port or 5432),
            "-U", parsed.username,
            "-d", parsed.path[1:],  # Remove leading /
            "-c",  # Clean (drop) database objects before recreating
            "-F", "c",  # Custom format
            str(backup_file)
        ]

        try:
            subprocess.run(cmd, env=env, check=True)
            print(f"✅ PostgreSQL database restored from: {backup_file}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Restore failed: {e}")
            return False
        except FileNotFoundError:
            print("❌ pg_restore not found. Install PostgreSQL client tools.")
            return False

    else:
        print(f"❌ Unsupported database type: {DATABASE_URL}")
        return False

    return True


def interactive_restore():
    """Interactive restore with backup selection"""
    backups = list_backups()

    if not backups:
        print("No backups found.")
        return

    print("\n📦 Available Backups:")
    print("-" * 70)
    for i, backup in enumerate(backups, 1):
        size = backup.stat().st_size
        size_str = f"{size / (1024*1024):.2f} MB" if size > 1024*1024 else f"{size / 1024:.2f} KB"
        mtime = datetime.fromtimestamp(backup.stat().st_mtime).strftime("%Y-%m-%d %H:%M:%S")
        print(f"{i:2d}. {backup.name:40s} {size_str:>12s}  {mtime}")
    print("-" * 70)

    try:
        choice = int(input(f"\nSelect backup to restore (1-{len(backups)}): "))
        if 1 <= choice <= len(backups):
            selected_backup = backups[choice - 1]
            restore_backup(selected_backup)
        else:
            print("❌ Invalid selection.")
    except ValueError:
        print("❌ Invalid input.")
    except KeyboardInterrupt:
        print("\n❌ Restore cancelled.")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Database restore utility")
    parser.add_argument("--file", type=str, help="Backup file to restore")
    args = parser.parse_args()

    print("🗄️  Database Restore Utility")

    if args.file:
        backup_file = Path(args.file)
        if restore_backup(backup_file):
            print("✅ Restore completed successfully!")
        else:
            print("❌ Restore failed!")
            sys.exit(1)
    else:
        interactive_restore()
