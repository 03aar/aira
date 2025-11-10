# AIRA — The Living Blueprint

**See your software come alive.**

Aira is a next-generation intelligence platform that allows organizations to see, understand, and evolve their entire digital ecosystem. It transforms fragmented systems into a single, living map — a calm, visual representation of every product, service, and connection that powers the company.

## ✨ Features

### 🔐 **Production-Grade Authentication**
- Beautiful glassmorphism login/signup UI
- JWT-based authentication with refresh tokens
- Email verification and password reset flows
- Rate limiting and security best practices
- Protected routes with automatic redirects

### 🗄️ **Enterprise Database System**
- Alembic migrations for schema version control
- Production connection pooling (20+ concurrent connections)
- Automated backups with 30-day retention
- Health checks and monitoring
- CLI tools for database management
- SQLite (dev) and PostgreSQL (production) support

### 🎨 **Beautiful, Calming Interface**
- Organic geometry with rounded edges and soft glows
- Breathing animations that make your system feel alive
- White space-first design philosophy
- Responsive glassmorphism design throughout

### 🗺️ **Living System Map**
- Automatic visualization of your entire architecture
- Real-time updates as your system evolves
- Interactive node exploration with smooth animations
- Color-coded services (Frontend, Backend, Database, AI, Integrations)

### 🎯 **Interactive Onboarding**
- Personalized setup flow
- Role-based customization
- Multiple theme options (Light Flow, Dark Pulse, Focus Mode)

### 🧠 **AI-Powered Insights**
- Automatic detection of system issues
- Performance recommendations
- Architectural improvements
- Risk identification

### 📊 **Key Components**
- **Top Navigation**: Search/Ask anything, zoom controls, quick actions
- **Left Toolbar**: Mode switching and tool selection
- **Main Canvas**: Living map with animated connections
- **Right Panel**: Detailed node information and metrics
- **Bottom Timeline**: Evolution history and version control
- **Insights Panel**: AI-generated recommendations

## 🚀 Getting Started

### 📖 **Complete Setup Guide**

👉 **See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed step-by-step instructions**

The setup guide includes:
- ✅ Prerequisites checklist
- ✅ Clone to running app in 5 minutes
- ✅ Database initialization explained
- ✅ Troubleshooting common issues
- ✅ What each file does
- ✅ Production deployment guide

### Quick Start

**Prerequisites:**
- Node.js 18+ and npm
- Python 3.10+ and pip
- Git

**Installation:**
```bash
# 1. Clone repository
git clone <repository-url>
cd aira

# 2. Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env

# 3. Initialize database
alembic upgrade head
python scripts/db_manager.py seed  # Optional: create test users

# 4. Frontend setup
cd ..
npm install

# 5. Run application (2 terminals)
# Terminal 1 - Backend:
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend:
npm run dev
```

**Open:** http://localhost:5173

**Test Login:**
- Email: `admin@aira.dev` / Password: `admin123`
- Email: `user@aira.dev` / Password: `user123`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Design System

### Color Palette

```css
/* Brand Colors */
--aira-white: #FFFFFF
--aira-gray: #F5F6F8
--aira-blue: #4B9EFF       /* Frontend */
--aira-violet: #9A7AFF      /* Backend */
--aira-yellow: #F8D66E      /* Database */
--aira-cyan: #42F0F5        /* AI Models */
--aira-coral: #FF5A64       /* Integrations */
--aira-purple: #9B5CFF      /* Primary Accent */
```

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Animation Principles

- **Organic Easing**: Smooth, elastic transitions
- **Breathing**: Gentle pulse animations (2-3s cycles)
- **Motion**: Elements glide, not jump
- **Timing**: 250-400ms for UI transitions

## 📁 Project Structure

```
aira/
├── src/
│   ├── components/
│   │   ├── canvas/          # Canvas and node visualization
│   │   │   ├── Canvas.tsx
│   │   │   ├── Node.tsx
│   │   │   └── Connection.tsx
│   │   ├── layout/          # Main layout components
│   │   │   ├── TopNav.tsx
│   │   │   ├── LeftToolbar.tsx
│   │   │   ├── RightPanel.tsx
│   │   │   └── BottomTimeline.tsx
│   │   ├── onboarding/      # Onboarding flow
│   │   │   ├── Splash.tsx
│   │   │   ├── Onboarding.tsx
│   │   │   └── steps/
│   │   ├── insights/        # AI insights panel
│   │   ├── common/          # Reusable components
│   │   └── modes/           # View mode components
│   ├── contexts/            # React contexts for state
│   │   ├── AppContext.tsx
│   │   └── OnboardingContext.tsx
│   ├── pages/               # Page components
│   │   └── Dashboard.tsx
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Public assets
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json
```

## 🎭 Key Interactions

### Node Selection
- Click any node to view detailed information
- Connected paths highlight automatically
- Right panel slides in with metrics and connections

### Timeline Navigation
- Drag the timeline slider to explore system evolution
- Watch nodes appear and disappear over time
- Play button for automated playback

### Insights
- Click the Insights icon to view AI recommendations
- Color-coded by severity (Critical, Warning, Info)
- Click "View on Map" to center on affected nodes

### Search & Ask
- Natural language queries in the top search bar
- "Show me which service handles authentication"
- "Highlight AI-driven features"

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Canvas**: React Flow
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State**: Zustand + Context API
- **Forms**: React Hook Form + Zod
- **Auth**: JWT with automatic refresh

### Backend
- **Framework**: FastAPI + Python 3.10+
- **Database**: SQLAlchemy ORM (SQLite/PostgreSQL)
- **Migrations**: Alembic
- **Authentication**: JWT (python-jose) + Bcrypt
- **Email**: SMTP with Jinja2 templates
- **AI**: OpenAI GPT-4
- **Git**: GitPython
- **Server**: Uvicorn
- **Validation**: Pydantic
- **CLI**: Click (database management)

## 🔧 Backend Features

### Authentication System
- **JWT Tokens**: Access (30min) + Refresh (30 days) tokens
- **Email Verification**: Required for account activation
- **Password Reset**: Secure token-based reset flow
- **Rate Limiting**: 5 failed attempts per 15 minutes
- **Security**: Bcrypt hashing, token refresh, device tracking
- **API Endpoints**: 11+ auth endpoints (signup, login, verify, reset, etc.)

### Database System
- **Migrations**: Alembic for schema version control
- **Connection Pooling**: 20+ permanent connections (PostgreSQL)
- **Health Monitoring**: Real-time pool statistics
- **Automated Backups**: Timestamped backups with 30-day retention
- **CLI Tools**: 15+ commands (init, migrate, backup, restore, seed, etc.)
- **Production Ready**: SQLite (dev) → PostgreSQL (prod)
- **See**: [backend/DATABASE_SETUP.md](backend/DATABASE_SETUP.md) for full guide

### GitHub Repository Analysis
- Automatically clones and analyzes any public GitHub repository
- Detects languages, frameworks, and architecture patterns
- Extracts APIs, databases, and integrations
- Supports Node.js/TypeScript and Python (more coming)

### AI Chat Integration
- Natural language architecture commands
- Context-aware responses
- Automatic graph modifications
- Best practice recommendations

### Simulation Engine
- **Removal Simulation**: Impact analysis when removing components
- **Scaling Simulation**: Bottleneck detection at scale
- **Failure Simulation**: Cascade effect analysis
- **Performance Modeling**: Latency and capacity estimation

### API Documentation
Visit `http://localhost:8000/docs` for interactive Swagger UI documentation.

For more backend details, see [backend/README.md](backend/README.md)

## 🎯 Roadmap

### Phase 1: See (v1.0) ✅
- [x] Automatic system mapping
- [x] Interactive visualization
- [x] Onboarding flow
- [x] Basic insights

### Phase 2: Understand (v2.0)
- [ ] AI-driven analysis
- [ ] Deep explanations
- [ ] Performance optimization suggestions
- [ ] Integration with real data sources

### Phase 3: Evolve (v3.0)
- [ ] Predictive modeling
- [ ] Autonomous optimization
- [ ] Simulation sandbox
- [ ] Collaboration features

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 📄 License

[Your License Here]

## 🌟 Acknowledgments

Built with calm intelligence and attention to detail.

---

**AIRA** — *The living blueprint of your digital world.*
