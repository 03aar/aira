"""
Share Router
Handles creating shareable links and managing access
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uuid
from datetime import datetime, timedelta

router = APIRouter()

class ShareRequest(BaseModel):
    graph_id: str
    access_level: str  # "view" or "edit"
    expires_in: Optional[int] = None  # seconds, None = never expires

class ShareResponse(BaseModel):
    share_url: str
    share_token: str
    access_level: str
    expires_at: Optional[str] = None

# In-memory storage (use database in production)
shared_links: Dict[str, Dict[str, Any]] = {}

@router.post("/", response_model=ShareResponse)
async def create_share_link(request: ShareRequest):
    """
    Create a shareable link for an architecture
    """
    try:
        # Generate unique token
        token = str(uuid.uuid4())

        # Calculate expiration
        expires_at = None
        if request.expires_in:
            expires_at = (
                datetime.now() + timedelta(seconds=request.expires_in)
            ).isoformat()

        # Store share link
        shared_links[token] = {
            "graph_id": request.graph_id,
            "access_level": request.access_level,
            "created_at": datetime.now().isoformat(),
            "expires_at": expires_at
        }

        return ShareResponse(
            share_url=f"https://aira.app/shared/{token}",
            share_token=token,
            access_level=request.access_level,
            expires_at=expires_at
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Share link creation failed: {str(e)}"
        )

@router.get("/{token}")
async def get_shared_graph(token: str):
    """
    Access a shared architecture
    """
    if token not in shared_links:
        raise HTTPException(status_code=404, detail="Share link not found")

    link_data = shared_links[token]

    # Check expiration
    if link_data.get("expires_at"):
        expires_at = datetime.fromisoformat(link_data["expires_at"])
        if datetime.now() > expires_at:
            raise HTTPException(status_code=410, detail="Share link expired")

    return {
        "graph_id": link_data["graph_id"],
        "access_level": link_data["access_level"]
    }

@router.delete("/{token}")
async def revoke_share_link(token: str):
    """
    Revoke a share link
    """
    if token not in shared_links:
        raise HTTPException(status_code=404, detail="Share link not found")

    del shared_links[token]
    return {"status": "revoked"}
