# AIRA Backend

FastAPI backend server for AIRA - AI-powered architecture visualization.

## Features

- 🔍 **GitHub Repository Analysis**: Automatically analyze codebases and generate architecture diagrams
- 🤖 **AI Chat**: Natural language interactions with GPT-4 for architecture advice
- 🎮 **Simulation Engine**: "What if" scenarios and impact analysis
- 📤 **Export**: Export architectures to PNG, SVG, PDF, Markdown
- 🔗 **Sharing**: Create shareable links with access controls

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 3. Run Server

```bash
python main.py
```

Server will start at `http://localhost:8000`

### 4. Test API

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## API Endpoints

### Analysis

- `POST /api/analyze/` - Analyze a GitHub repository
- `POST /api/analyze/async` - Start async analysis
- `GET /api/analyze/status/{job_id}` - Check analysis status

### AI Chat

- `POST /api/chat/` - Chat with AI about architecture
- `POST /api/chat/suggestions` - Get improvement suggestions
- `POST /api/chat/explain` - Get architecture explanation

### Simulation

- `POST /api/simulate/` - Run simulation (removal/scaling/failure)
- `POST /api/simulate/batch` - Run multiple simulations

### Export

- `POST /api/export/` - Export to various formats (PNG, SVG, PDF, Markdown, JSON)

### Share

- `POST /api/share/` - Create share link
- `GET /api/share/{token}` - Access shared architecture
- `DELETE /api/share/{token}` - Revoke share link

## Example Usage

### Analyze a Repository

```bash
curl -X POST "http://localhost:8000/api/analyze/" \
  -H "Content-Type: application/json" \
  -d '{
    "github_url": "https://github.com/vercel/next.js",
    "depth": "shallow"
  }'
```

### Chat with AI

```bash
curl -X POST "http://localhost:8000/api/chat/" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add a backend API with Redis cache",
    "graph": {...}
  }'
```

### Run Simulation

```bash
curl -X POST "http://localhost:8000/api/simulate/" \
  -H "Content-Type: application/json" \
  -d '{
    "graph": {...},
    "simulation_type": "removal",
    "target_node": "payment-service"
  }'
```

## Architecture

```
backend/
├── main.py                 # FastAPI app entry point
├── routers/               # API route handlers
│   ├── analyze.py         # Repository analysis
│   ├── chat.py            # AI chat
│   ├── simulate.py        # Simulation engine
│   ├── export_router.py   # Export functionality
│   └── share.py           # Sharing features
├── services/              # Core business logic
│   ├── github_parser.py   # GitHub analyzer
│   ├── ai_engine.py       # OpenAI integration
│   ├── simulation.py      # Simulation engine
│   ├── graph_builder.py   # Graph construction
│   └── export_service.py  # Export handler
└── parsers/               # Language parsers
    ├── base.py            # Parser interface
    ├── nodejs.py          # Node.js/TypeScript
    └── python_parser.py   # Python
```

## Supported Languages

- ✅ JavaScript/TypeScript (Express, Next.js, NestJS, Fastify)
- ✅ Python (FastAPI, Flask, Django)
- 🚧 Go, Java, Rust (coming soon)

## Development

### Run with Auto-Reload

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Run Tests

```bash
pytest tests/
```

### Type Checking

```bash
mypy main.py
```

## Deployment

### Docker

```bash
docker build -t aira-backend .
docker run -p 8000:8000 --env-file .env aira-backend
```

### Railway

```bash
railway up
```

### Render

Connect GitHub repo and deploy with:
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Environment Variables

Required:
- `OPENAI_API_KEY` - OpenAI API key for GPT-4

Optional:
- `GITHUB_TOKEN` - For analyzing private repositories
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `PORT` - Server port (default: 8000)

## Performance

- Analysis time: 30-90 seconds for most repositories
- AI response time: 1-3 seconds
- Supports repositories up to 100,000 files

## Rate Limits

- API: 100 requests per minute per IP
- OpenAI: Subject to OpenAI API limits
- GitHub: 60 requests per hour (unauthenticated), 5000 with token

## Security

- CORS configured for allowed origins only
- Input validation on all endpoints
- No sensitive data stored by default
- Rate limiting enabled

## Troubleshooting

**"OpenAI API key not configured"**
- Make sure `.env` file exists and contains `OPENAI_API_KEY`

**"Failed to clone repository"**
- Check repository URL is valid and public
- For private repos, add `GITHUB_TOKEN` to `.env`

**"Analysis timeout"**
- Large repositories may take longer
- Use async endpoint for repositories with 10,000+ files

## License

MIT
