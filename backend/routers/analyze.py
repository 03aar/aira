"""
GitHub Repository Analyzer Router
Handles repository cloning, parsing, and architecture graph generation
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
import asyncio
from services.github_parser import GitHubAnalyzer
from services.graph_builder import GraphBuilder

router = APIRouter()

class AnalyzeRequest(BaseModel):
    github_url: HttpUrl
    depth: Optional[str] = "shallow"  # "shallow" or "deep"
    include_tests: Optional[bool] = False
    include_docs: Optional[bool] = False

class AnalyzeResponse(BaseModel):
    graph: Dict[str, Any]
    analysis_time: float
    confidence: float
    metadata: Dict[str, Any]

# In-memory job storage (use Redis in production)
analysis_jobs: Dict[str, Dict[str, Any]] = {}

@router.post("/", response_model=AnalyzeResponse)
async def analyze_repository(request: AnalyzeRequest):
    """
    Analyze a GitHub repository and generate architecture graph

    This endpoint:
    1. Clones the repository (shallow clone for speed)
    2. Detects languages and frameworks
    3. Parses code to find services, APIs, databases
    4. Builds a graph representation
    5. Returns structured JSON for visualization
    """
    try:
        # Initialize analyzer
        analyzer = GitHubAnalyzer()

        # Analyze repository
        result = await analyzer.analyze(
            repo_url=str(request.github_url),
            depth=request.depth,
            include_tests=request.include_tests
        )

        # Build graph structure
        graph_builder = GraphBuilder()
        graph = graph_builder.build_from_analysis(result)

        return AnalyzeResponse(
            graph=graph,
            analysis_time=result.get("analysis_time", 0),
            confidence=result.get("confidence", 0.8),
            metadata=result.get("metadata", {})
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@router.post("/async")
async def analyze_repository_async(
    request: AnalyzeRequest,
    background_tasks: BackgroundTasks
):
    """
    Start asynchronous repository analysis
    Returns a job ID that can be polled for progress
    """
    import uuid
    job_id = str(uuid.uuid4())

    # Create job entry
    analysis_jobs[job_id] = {
        "status": "queued",
        "progress": 0,
        "result": None,
        "error": None
    }

    # Start analysis in background
    background_tasks.add_task(
        run_analysis_background,
        job_id,
        request
    )

    return {
        "job_id": job_id,
        "status": "queued",
        "poll_url": f"/api/analyze/status/{job_id}"
    }

@router.get("/status/{job_id}")
async def get_analysis_status(job_id: str):
    """
    Check status of an asynchronous analysis job
    """
    if job_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    return analysis_jobs[job_id]

async def run_analysis_background(job_id: str, request: AnalyzeRequest):
    """
    Background task for repository analysis
    """
    try:
        analysis_jobs[job_id]["status"] = "running"

        analyzer = GitHubAnalyzer()

        # Update progress callback
        def update_progress(progress: int, message: str):
            analysis_jobs[job_id]["progress"] = progress
            analysis_jobs[job_id]["message"] = message

        analyzer.set_progress_callback(update_progress)

        # Run analysis
        result = await analyzer.analyze(
            repo_url=str(request.github_url),
            depth=request.depth
        )

        # Build graph
        graph_builder = GraphBuilder()
        graph = graph_builder.build_from_analysis(result)

        # Update job with result
        analysis_jobs[job_id]["status"] = "completed"
        analysis_jobs[job_id]["progress"] = 100
        analysis_jobs[job_id]["result"] = {
            "graph": graph,
            "analysis_time": result.get("analysis_time", 0),
            "confidence": result.get("confidence", 0.8),
            "metadata": result.get("metadata", {})
        }

    except Exception as e:
        analysis_jobs[job_id]["status"] = "failed"
        analysis_jobs[job_id]["error"] = str(e)

@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    """
    Delete a completed job
    """
    if job_id in analysis_jobs:
        del analysis_jobs[job_id]
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Job not found")
