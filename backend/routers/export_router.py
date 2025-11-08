"""
Export Router
Handles exporting architectures to various formats
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from typing import Dict, Any
import json
import io
from services.export_service import ExportService

router = APIRouter()

class ExportRequest(BaseModel):
    graph: Dict[str, Any]
    format: str  # "png", "svg", "pdf", "markdown", "json"
    options: Dict[str, Any] = {}

@router.post("/")
async def export_graph(request: ExportRequest):
    """
    Export architecture graph to specified format
    """
    try:
        exporter = ExportService()

        if request.format == "json":
            # Return JSON directly
            return {
                "format": "json",
                "data": request.graph
            }

        elif request.format == "markdown":
            # Generate markdown documentation
            markdown = await exporter.to_markdown(request.graph)
            return StreamingResponse(
                io.BytesIO(markdown.encode()),
                media_type="text/markdown",
                headers={"Content-Disposition": "attachment; filename=architecture.md"}
            )

        elif request.format in ["png", "svg", "pdf"]:
            # Generate image (placeholder - would use Puppeteer or similar)
            file_path = await exporter.to_image(
                request.graph,
                request.format,
                request.options
            )
            return FileResponse(
                file_path,
                media_type=f"image/{request.format}",
                filename=f"architecture.{request.format}"
            )

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported format: {request.format}"
            )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Export failed: {str(e)}"
        )
