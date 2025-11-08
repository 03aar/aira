"""
AIRA Backend Server - FastAPI
Main entry point for the AIRA architecture visualization system
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routers import analyze, chat, simulate, export_router, share

# Create FastAPI app
app = FastAPI(
    title="AIRA API",
    description="AI-powered architecture visualization and analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.vercel.app",
        "https://*.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "AIRA API",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "checks": {
            "api": "ok",
            "openai": "configured" if os.getenv("OPENAI_API_KEY") else "not configured",
            "github": "configured" if os.getenv("GITHUB_TOKEN") else "not required"
        }
    }

# Include routers
app.include_router(analyze.router, prefix="/api/analyze", tags=["analyze"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(simulate.router, prefix="/api/simulate", tags=["simulate"])
app.include_router(export_router.router, prefix="/api/export", tags=["export"])
app.include_router(share.router, prefix="/api/share", tags=["share"])

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
