# AIRA — The Living Blueprint

**See your software come alive.**

Aira is a next-generation intelligence platform that allows organizations to see, understand, and evolve their entire digital ecosystem. It transforms fragmented systems into a single, living map — a calm, visual representation of every product, service, and connection that powers the company.

## ✨ Features

### 🎨 **Beautiful, Calming Interface**
- Organic geometry with rounded edges and soft glows
- Breathing animations that make your system feel alive
- White space-first design philosophy

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

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd aira
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

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

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context API

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
