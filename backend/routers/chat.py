"""
AI Chat Router
Handles natural language interactions with OpenAI GPT-4
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from services.ai_engine import AIEngine

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    graph: Optional[Dict[str, Any]] = None
    conversation_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str
    graph_operations: List[Dict[str, Any]]
    updated_graph: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[str]] = None

@router.post("/", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    Send a message to the AI and get architectural advice or graph modifications

    Examples:
    - "Add a backend API with Redis cache"
    - "Show me all services that use PostgreSQL"
    - "What happens if I remove the payment service?"
    - "Explain the data flow from frontend to database"
    """
    try:
        # Check for OpenAI API key
        if not os.getenv("OPENAI_API_KEY"):
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured"
            )

        # Initialize AI engine
        ai_engine = AIEngine()

        # Process the request
        result = await ai_engine.process_message(
            message=request.message,
            current_graph=request.graph,
            history=request.conversation_history
        )

        return ChatResponse(
            response=result["response"],
            graph_operations=result.get("operations", []),
            updated_graph=result.get("updated_graph"),
            suggestions=result.get("suggestions", [])
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI request failed: {str(e)}"
        )

@router.post("/suggestions")
async def get_suggestions(graph: Dict[str, Any]):
    """
    Get AI suggestions for improving the architecture
    """
    try:
        ai_engine = AIEngine()
        suggestions = await ai_engine.generate_suggestions(graph)

        return {
            "suggestions": suggestions,
            "categories": ["performance", "security", "scalability", "cost"]
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Suggestion generation failed: {str(e)}"
        )

@router.post("/explain")
async def explain_architecture(graph: Dict[str, Any]):
    """
    Get a natural language explanation of the architecture
    """
    try:
        ai_engine = AIEngine()
        explanation = await ai_engine.explain_architecture(graph)

        return {
            "explanation": explanation,
            "key_components": explanation.get("key_components", []),
            "data_flows": explanation.get("data_flows", []),
            "potential_issues": explanation.get("potential_issues", [])
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Explanation failed: {str(e)}"
        )
