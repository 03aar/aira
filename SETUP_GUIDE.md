# 🚀 AIRA Setup Guide - Complete Installation

## From Clone to Running Application in 5 Minutes

This guide takes you from cloning the repository to having AIRA fully running with authentication, database, and UI.

---

## 📋 Prerequisites

Before starting, make sure you have:

- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **VSCode** (recommended) - [Download](https://code.visualstudio.com/)

Check your versions:
```bash
python --version   # Should be 3.10 or higher
node --version     # Should be 18 or higher
npm --version      # Should be 8 or higher
git --version      # Any recent version
```

---

## 🔥 Quick Start (5 Minutes)

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/aira.git

# Navigate into the project
cd aira

# Open in VSCode
code .
```

### Step 2: Backend Setup (Python/FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Initialize database (creates tables)
alembic upgrade head

# Optional: Seed with test users
python scripts/db_manager.py seed
```

**✅ Backend is ready!** Database created with all tables.

### Step 3: Frontend Setup (React/TypeScript)

Open a **new terminal** (keep backend terminal open):

```bash
# Navigate to frontend directory (from project root)
cd ../   # Go back to root if in backend/
# or just: cd /path/to/aira

# Install Node.js dependencies
npm install

# Copy environment template (if exists)
# cp .env.example .env  # Optional, for frontend config
```

**✅ Frontend is ready!** All dependencies installed.

### Step 4: Run the Application

You need **TWO terminals** - one for backend, one for frontend.

#### Terminal 1: Start Backend Server

```bash
# Make sure you're in backend/ directory
cd backend

# Make sure virtual environment is activated
# (you should see (venv) in your prompt)

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**✅ Backend running at http://localhost:8000**

#### Terminal 2: Start Frontend Dev Server

```bash
# Make sure you're in project root directory
# (where package.json is)

# Start Vite dev server
npm run dev
```

**Expected output:**
```
  VITE v7.1.12  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**✅ Frontend running at http://localhost:5173**

### Step 5: Open the Application

1. **Open browser:** http://localhost:5173
2. **You'll see:** Login page (beautiful glassmorphism UI)
3. **Test login:** Use seeded credentials (if you ran seed command):
   - Email: `admin@aira.dev` / Password: `admin123`
   - Email: `user@aira.dev` / Password: `user123`

**🎉 AIRA is running!**

---

## 📁 Project Structure

```
aira/
├── backend/                    # FastAPI backend
│   ├── main.py                # Backend entry point (START HERE)
│   ├── models/                # Database models
│   │   ├── database.py        # Database connection & pool
│   │   └── user.py            # User, RefreshToken, LoginAttempt models
│   ├── routers/               # API endpoints
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── analyze.py         # GitHub analysis
│   │   ├── chat.py            # AI chat
│   │   └── simulate.py        # Architecture simulation
│   ├── services/              # Business logic
│   │   └── auth/              # Auth services
│   ├── alembic/               # Database migrations
│   ├── scripts/               # Database management tools
│   │   ├── db_manager.py      # CLI tool (health, migrate, backup, etc.)
│   │   ├── db_backup.py       # Backup script
│   │   └── db_restore.py      # Restore script
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (YOU CREATE THIS)
│   └── aira.db               # SQLite database (AUTO-CREATED)
│
├── src/                       # React frontend
│   ├── main.tsx              # Frontend entry point
│   ├── App.tsx               # Main app component with routing
│   ├── pages/
│   │   ├── auth/             # Authentication pages
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   ├── VerifyEmailPage.tsx
│   │   │   └── VerifyEmailNoticePage.tsx
│   │   └── DashboardRefined.tsx  # Main dashboard
│   ├── contexts/
│   │   ├── AuthContext.tsx   # Authentication state management
│   │   └── AppContext.tsx    # Global app state
│   ├── components/           # React components
│   └── lib/                  # Utilities
│
├── package.json              # Node.js dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

---

## 🗄️ Database Explained

### How the Database Works

1. **Database Type:** SQLite (development) - a file-based database
2. **Location:** `backend/aira.db` (created automatically)
3. **Tables:** Users, RefreshTokens, LoginAttempts
4. **Migrations:** Managed by Alembic (version control for database)

### Database is Created When You Run:

```bash
alembic upgrade head
```

This command:
- ✅ Creates `backend/aira.db` file
- ✅ Creates all tables (users, refresh_tokens, login_attempts)
- ✅ Adds indexes for performance
- ✅ Sets up foreign key relationships

### Database Commands You Can Use:

```bash
cd backend

# Check if database is healthy
python scripts/db_manager.py health

# View all available commands
python scripts/db_manager.py --help

# Create backup
python scripts/db_manager.py backup

# Seed test users (admin & user accounts)
python scripts/db_manager.py seed

# Reset database (WARNING: deletes all data)
python scripts/db_manager.py reset
```

---

## ⚙️ Environment Variables Explained

### Backend `.env` File

Create `backend/.env` from `backend/.env.example`:

```env
# Database (SQLite for development - NO SETUP NEEDED)
DATABASE_URL=sqlite:///./aira.db

# Authentication
SECRET_KEY=your-super-secret-key-change-this-in-production
FRONTEND_URL=http://localhost:5173

# Email (Optional - needed for password reset emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@aira.app

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-openai-key-here

# Server
PORT=8000
HOST=0.0.0.0
DEBUG=True
ENV=development

# CORS (allow frontend to connect)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Required immediately:**
- `SECRET_KEY` - Generate with: `openssl rand -hex 32`
- `DATABASE_URL` - Already set to SQLite (works immediately)
- `FRONTEND_URL` - Already set correctly

**Optional (can add later):**
- `SMTP_*` - For email verification/password reset
- `OPENAI_API_KEY` - For AI chat features

---

## 🧪 Testing the Setup

### 1. Test Backend API

Backend should be running on http://localhost:8000

Open browser and visit:
- http://localhost:8000/docs - **API Documentation** (interactive)
- http://localhost:8000/health - Health check endpoint

You should see Swagger UI with all API endpoints.

### 2. Test Frontend

Frontend should be running on http://localhost:5173

You should see:
- Beautiful login page with glassmorphism design
- Animated gradient background
- Email and password fields

### 3. Test Authentication

**If you ran `python scripts/db_manager.py seed`:**

Try logging in with:
- Email: `admin@aira.dev`
- Password: `admin123`

**If you didn't run seed:**

Click "Create account" and sign up with:
- Email: your-email@example.com
- Username: yourname
- Password: (at least 8 characters, uppercase, lowercase, number)

### 4. Test Database

```bash
cd backend

# Check database health
python scripts/db_manager.py health
# Should show: ✅ Database is healthy!

# Show connection pool status
python scripts/db_manager.py pool
# Should show: Connection pooling not available (using SQLite)
```

---

## 🐛 Troubleshooting

### Problem: "ModuleNotFoundError" (Python)

**Solution:**
```bash
cd backend
# Make sure virtual environment is activated
source venv/bin/activate  # Mac/Linux
# or
venv\Scripts\activate  # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Problem: "Command not found: npm" or "node"

**Solution:** Install Node.js from https://nodejs.org/
```bash
# Verify installation
node --version
npm --version
```

### Problem: "Port 8000 already in use"

**Solution:** Kill the process using port 8000
```bash
# Find process
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill it or use different port
uvicorn main:app --reload --port 8001
```

### Problem: "Port 5173 already in use"

**Solution:** Kill the process or Vite will auto-suggest another port
```bash
# Kill process on 5173
lsof -i :5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows

# Or just accept Vite's suggested port
```

### Problem: Database migration error

**Solution:** Reset and recreate database
```bash
cd backend
rm aira.db  # Delete old database
alembic upgrade head  # Recreate
python scripts/db_manager.py seed  # Add test users
```

### Problem: "Cannot connect to backend"

**Checklist:**
1. Backend server is running? (Check Terminal 1)
2. Running on port 8000? (Check terminal output)
3. CORS configured? (Check `.env` has `CORS_ORIGINS`)
4. Frontend `.env` has correct API URL?

### Problem: Login doesn't work

**Checklist:**
1. Did you seed the database? `python scripts/db_manager.py seed`
2. Or did you create an account via signup?
3. Check backend logs for errors
4. Try opening http://localhost:8000/docs and test API directly

---

## 📊 What Each File Does

### Backend Entry Points

| File | What It Does | When It Runs |
|------|--------------|--------------|
| `main.py` | Main FastAPI app, starts server | `uvicorn main:app` |
| `models/database.py` | Database connection & pool setup | On import |
| `alembic/env.py` | Migration configuration | `alembic` commands |
| `scripts/db_manager.py` | Database CLI tool | Manual commands |

### Frontend Entry Points

| File | What It Does | When It Runs |
|------|--------------|--------------|
| `main.tsx` | React app entry point | `npm run dev` |
| `App.tsx` | Main app with routing | On load |
| `index.html` | HTML template | On load |

### How It All Connects

```
1. You run: uvicorn main:app --reload
   ↓
2. main.py loads and starts FastAPI
   ↓
3. FastAPI loads routers (auth, analyze, etc.)
   ↓
4. Routers use database models and services
   ↓
5. Database is ready at backend/aira.db
   ↓
6. API available at http://localhost:8000

---

1. You run: npm run dev
   ↓
2. Vite starts and loads main.tsx
   ↓
3. main.tsx renders App.tsx
   ↓
4. App.tsx sets up routing and auth
   ↓
5. User sees Login page
   ↓
6. UI calls backend API for authentication
```

---

## 🚀 Production Deployment

See `backend/DATABASE_SETUP.md` for:
- PostgreSQL setup
- Railway/Supabase deployment
- Production environment variables
- Backup strategies
- Monitoring setup

---

## 📱 Available Pages & Routes

### Public Routes (No Login Required)
- `/login` - Login page
- `/signup` - Create account
- `/forgot-password` - Request password reset
- `/reset-password?token=...` - Reset password with token
- `/verify-email?token=...` - Verify email address
- `/verify-email-notice` - Check email notice

### Protected Routes (Login Required)
- `/dashboard` - Main dashboard with architecture visualization
- More routes coming as you build features!

---

## 🎯 Next Steps After Setup

1. **Explore the Dashboard** - Login and see the main interface
2. **Read API Docs** - Visit http://localhost:8000/docs
3. **Check Database** - Run `python scripts/db_manager.py health`
4. **Try Features** - Test authentication, GitHub analysis, AI chat
5. **Build More** - Add new features to the dashboard!

---

## 💡 Pro Tips

1. **Use VSCode Terminal Split:**
   - Split terminal (Ctrl+Shift+5 / Cmd+Shift+5)
   - Left: Backend (uvicorn)
   - Right: Frontend (npm run dev)

2. **Auto-Save in VSCode:**
   - File → Preferences → Settings
   - Search "Auto Save"
   - Set to "afterDelay"

3. **Install VSCode Extensions:**
   - Python
   - Pylance
   - ESLint
   - Prettier
   - Thunder Client (for testing APIs)

4. **Database GUI Tools:**
   - SQLite: DB Browser for SQLite (free)
   - Or use VSCode extension: "SQLite Viewer"

5. **Hot Reload:**
   - Backend: `--reload` flag enables auto-restart on code changes
   - Frontend: Vite auto-reloads on save

---

## 📞 Getting Help

- **Database issues:** Check `backend/DATABASE_SETUP.md`
- **API errors:** Check backend terminal output
- **UI errors:** Check browser console (F12)
- **Health check:** `python scripts/db_manager.py health`

---

## ✅ Setup Checklist

Use this checklist to verify everything is working:

- [ ] Cloned repository
- [ ] Python 3.10+ installed
- [ ] Node.js 18+ installed
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Backend `.env` file created
- [ ] Database initialized (`alembic upgrade head`)
- [ ] Test users seeded (`python scripts/db_manager.py seed`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server running (http://localhost:8000)
- [ ] Frontend server running (http://localhost:5173)
- [ ] Can access login page
- [ ] Can log in successfully
- [ ] Can see dashboard

---

**🎉 You're all set! Welcome to AIRA!**

If you followed all steps, you should have:
✅ Backend API running on port 8000
✅ Frontend UI running on port 5173
✅ Database created and seeded
✅ Authentication working
✅ Beautiful dashboard loaded

**Happy coding! 🚀**
