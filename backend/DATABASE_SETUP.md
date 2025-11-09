# 🗄️ AIRA Production Database System

Complete production-grade database system with migrations, backups, and management tools.

## Table of Contents
- [Features](#features)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Database Management](#database-management)
- [Migrations](#migrations)
- [Backup & Restore](#backup--restore)
- [Production Deployment](#production-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Features

✅ **Alembic Migrations** - Version control for database schema
✅ **Connection Pooling** - Optimized for high-traffic (20+ permanent connections, 40+ overflow)
✅ **Health Checks** - Monitor database status and pool statistics
✅ **Automatic Backups** - Scheduled backups with retention policy
✅ **Foreign Keys & Constraints** - Data integrity enforcement
✅ **Composite Indexes** - Optimized queries for common operations
✅ **Transaction Management** - Automatic commit/rollback
✅ **CLI Tools** - Comprehensive database management commands

---

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Database

Create `.env` file in `backend/` directory:

```env
# Database Configuration
DATABASE_URL=sqlite:///./aira.db  # Development (SQLite)
# DATABASE_URL=postgresql://user:password@localhost:5432/aira  # Production

# Connection Pool (PostgreSQL only)
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=40
DB_POOL_TIMEOUT=30
DB_POOL_RECYCLE=3600

# Environment
ENV=development  # or "production"

# Backup Configuration
BACKUP_DIR=./backups
```

### 3. Run Initial Migration

```bash
# Run migrations to create tables
alembic upgrade head

# OR use the CLI tool
python scripts/db_manager.py migrate
```

### 4. Verify Setup

```bash
# Check database health
python scripts/db_manager.py health

# Seed with sample data (optional, for development)
python scripts/db_manager.py seed
```

---

## Configuration

### SQLite (Development)

```env
DATABASE_URL=sqlite:///./aira.db
ENV=development
```

**Pros:** Simple, no setup required
**Cons:** Not suitable for production, no connection pooling

### PostgreSQL (Production)

```env
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
ENV=production
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=40
```

**Connection Pool Settings:**

| Setting | Description | Default | Recommended |
|---------|-------------|---------|-------------|
| `DB_POOL_SIZE` | Permanent connections | 20 | 20-50 depending on load |
| `DB_MAX_OVERFLOW` | Additional connections | 40 | 40-100 for burst traffic |
| `DB_POOL_TIMEOUT` | Wait for connection (seconds) | 30 | 30 |
| `DB_POOL_RECYCLE` | Recycle connections (seconds) | 3600 | 3600 (1 hour) |

---

## Database Management

### CLI Tool (`db_manager.py`)

Comprehensive management tool for all database operations:

```bash
# Navigate to backend directory
cd backend

# Show all available commands
python scripts/db_manager.py --help
```

#### Available Commands:

| Command | Description |
|---------|-------------|
| `init` | Initialize database (create tables) |
| `drop` | Drop all tables (DANGEROUS!) |
| `reset` | Drop and recreate all tables |
| `health` | Check database health |
| `pool` | Show connection pool status |
| `migrate` | Run migrations (upgrade to latest) |
| `create-migration <message>` | Create new migration |
| `rollback` | Rollback last migration |
| `history` | Show migration history |
| `backup` | Create database backup |
| `list-backups` | List all backups |
| `restore [file]` | Restore from backup (interactive or specific file) |
| `shell` | Open database shell |
| `seed` | Seed with sample data |

#### Examples:

```bash
# Check database health
python scripts/db_manager.py health

# Create database backup
python scripts/db_manager.py backup

# List all backups
python scripts/db_manager.py list-backups

# Restore from backup (interactive)
python scripts/db_manager.py restore

# Show connection pool status
python scripts/db_manager.py pool

# Seed database with test users
python scripts/db_manager.py seed
```

---

## Migrations

### Creating Migrations

When you modify models, create a new migration:

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "Add new column to users"

# OR use the CLI
python scripts/db_manager.py create-migration "Add new column to users"
```

### Applying Migrations

```bash
# Upgrade to latest version
alembic upgrade head

# Upgrade to specific version
alembic upgrade <revision_id>

# OR use CLI
python scripts/db_manager.py migrate
```

### Rolling Back Migrations

```bash
# Rollback one migration
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision_id>

# OR use CLI
python scripts/db_manager.py rollback
```

### Viewing Migration History

```bash
# Show all migrations
alembic history

# Show current version
alembic current

# OR use CLI
python scripts/db_manager.py history
```

---

## Backup & Restore

### Automatic Backups

Create timestamped backups of your database:

```bash
# Create backup
python scripts/db_backup.py

# List all backups
python scripts/db_backup.py --list
```

**Backup Location:** `./backups/aira_backup_YYYYMMDD_HHMMSS.db` (or `.sql` for PostgreSQL)

**Retention Policy:** Keeps last 30 backups, automatically deletes older ones.

### Restore from Backup

```bash
# Interactive restore (choose from list)
python scripts/db_restore.py

# Restore specific file
python scripts/db_restore.py --file backups/aira_backup_20251109_123045.db
```

### Setting Up Scheduled Backups

#### Linux/Mac (cron):

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/aira/backend && python scripts/db_backup.py
```

#### Windows (Task Scheduler):

1. Open Task Scheduler
2. Create New Task
3. Trigger: Daily at 2 AM
4. Action: `python C:\path\to\aira\backend\scripts\db_backup.py`

---

## Production Deployment

### PostgreSQL Setup

#### 1. Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Mac
brew install postgresql
```

#### 2. Create Database and User

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE aira;
CREATE USER aira_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE aira TO aira_user;
\q
```

#### 3. Update Environment Variables

```env
DATABASE_URL=postgresql://aira_user:your_secure_password@localhost:5432/aira
ENV=production
DB_POOL_SIZE=30
DB_MAX_OVERFLOW=60
```

#### 4. Run Migrations

```bash
alembic upgrade head
```

### Cloud Database Options

| Provider | Pros | Pricing |
|----------|------|---------|
| **Railway** | Easiest setup, auto-provisioning | $5/month |
| **Supabase** | PostgreSQL + extras (auth, storage) | Free tier available |
| **AWS RDS** | Enterprise-grade, highly scalable | Pay per use |
| **Render** | Simple deployment | Free tier available |
| **Neon** | Serverless PostgreSQL | Generous free tier |

#### Example: Railway Setup

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Copy `DATABASE_URL` from Railway
5. Update `.env` with Railway DATABASE_URL

---

## Monitoring

### Health Checks

Add health check endpoint to your FastAPI app:

```python
from fastapi import APIRouter
from models.database import check_db_health

health_router = APIRouter(prefix="/health", tags=["health"])

@health_router.get("/db")
async def database_health():
    return check_db_health()
```

### Connection Pool Monitoring

```python
from models.database import get_pool_status

@health_router.get("/db/pool")
async def pool_status():
    return get_pool_status()
```

### Response Example:

```json
{
  "status": "healthy",
  "database": "postgresql",
  "pool_size": 20,
  "pool_overflow": 5,
  "connections_checked_out": 3
}
```

### Logging

Database operations are automatically logged:

- 🔗 New connections
- ↪️  Connection checkout
- ↩️  Connection checkin
- ❌ Errors and rollbacks
- ✅ Successful operations

Enable debug logging in production:

```python
import logging
logging.basicConfig(level=logging.INFO)
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
```

---

## Troubleshooting

### Common Issues

#### 1. "Too many connections" Error

**Cause:** Connection pool exhausted

**Solution:**
```env
# Increase pool size
DB_POOL_SIZE=50
DB_MAX_OVERFLOW=100
```

#### 2. "Connection timeout" Error

**Cause:** Database not responding or pool timeout too low

**Solution:**
```env
# Increase timeout
DB_POOL_TIMEOUT=60
```

#### 3. Migrations Not Running

**Cause:** Database not initialized or migration version mismatch

**Solution:**
```bash
# Check current version
alembic current

# Force stamp to specific version (if needed)
alembic stamp head

# Then upgrade
alembic upgrade head
```

#### 4. Slow Queries

**Cause:** Missing indexes or inefficient queries

**Solution:**
- Check query execution plan
- Add composite indexes for common queries
- Use connection pooling (PostgreSQL)
- Enable query logging to identify bottlenecks

#### 5. Foreign Key Errors

**Cause:** Trying to delete record with dependent records

**Solution:**
- Foreign keys are set to `CASCADE` delete
- Ensure parent records are deleted properly
- Check relationship definitions in models

### Database Shell

For debugging, open database shell:

```bash
# SQLite
python scripts/db_manager.py shell

# Or directly
sqlite3 aira.db

# PostgreSQL
python scripts/db_manager.py shell

# Or directly
psql -h hostname -U username -d database_name
```

---

## Database Schema

### Tables

#### **users**
- User accounts with authentication
- Email verification and password reset
- GitHub integration
- Preferences and profile

#### **refresh_tokens**
- JWT refresh tokens
- Device tracking
- Automatic cleanup of expired tokens

#### **login_attempts**
- Rate limiting and security
- Track failed login attempts
- IP-based throttling

### Indexes

All tables have optimized indexes for:
- Unique constraints (email, username, tokens)
- Foreign key lookups
- Common query patterns (user + active status, token + expiry)
- Rate limiting queries (email + time, IP + time)

---

## Performance Tips

1. **Use Connection Pooling** (PostgreSQL only)
   - Reduces connection overhead
   - Handles burst traffic efficiently

2. **Regular Backups**
   - Automated daily backups
   - Keep multiple versions
   - Test restore process periodically

3. **Monitor Pool Status**
   - Watch for pool exhaustion
   - Adjust pool size based on traffic

4. **Index Optimization**
   - Composite indexes for common queries
   - Regular VACUUM (PostgreSQL)

5. **Query Optimization**
   - Use select only needed columns
   - Batch operations when possible
   - Use database transactions properly

---

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong database passwords
   - Rotate credentials regularly

2. **Access Control**
   - Restrict database access by IP
   - Use least-privilege principle
   - Separate read/write users if possible

3. **Backups**
   - Encrypt backup files
   - Store backups in secure location
   - Test restore process regularly

4. **Monitoring**
   - Set up alerts for failed connections
   - Monitor unusual query patterns
   - Log all database errors

---

## Support

For issues or questions:
- Check [Troubleshooting](#troubleshooting) section
- Review database logs
- Test database health: `python scripts/db_manager.py health`

---

**Built with ❤️ for AIRA - Production-Ready Database System**
