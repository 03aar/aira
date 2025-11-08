"""
Simulation Engine Router
Handles "what if" scenarios and impact analysis
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from services.simulation import SimulationEngine

router = APIRouter()

class SimulationRequest(BaseModel):
    graph: Dict[str, Any]
    simulation_type: str  # "removal", "scaling", "failure", "latency"
    target_node: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = {}

class SimulationResponse(BaseModel):
    impact_analysis: Dict[str, Any]
    visualization_data: Dict[str, Any]
    recommendation: str
    affected_nodes: List[str]

@router.post("/", response_model=SimulationResponse)
async def run_simulation(request: SimulationRequest):
    """
    Run an architecture simulation

    Simulation Types:
    - removal: What happens if we remove a node?
    - scaling: What happens with 10x traffic?
    - failure: What fails if this node goes down?
    - latency: What's the end-to-end latency?
    """
    try:
        engine = SimulationEngine()

        if request.simulation_type == "removal":
            result = await engine.simulate_removal(
                request.graph,
                request.target_node
            )
        elif request.simulation_type == "scaling":
            multiplier = request.parameters.get("multiplier", 10)
            result = await engine.simulate_scaling(
                request.graph,
                multiplier
            )
        elif request.simulation_type == "failure":
            result = await engine.simulate_failure(
                request.graph,
                request.target_node
            )
        elif request.simulation_type == "latency":
            result = await engine.calculate_latency(request.graph)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown simulation type: {request.simulation_type}"
            )

        return SimulationResponse(
            impact_analysis=result["impact"],
            visualization_data=result["visualization"],
            recommendation=result["recommendation"],
            affected_nodes=result.get("affected_nodes", [])
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Simulation failed: {str(e)}"
        )

@router.post("/batch")
async def run_batch_simulations(
    graph: Dict[str, Any],
    simulations: List[str]
):
    """
    Run multiple simulations at once
    Returns combined analysis
    """
    try:
        engine = SimulationEngine()
        results = []

        for sim_type in simulations:
            if sim_type == "bottlenecks":
                result = await engine.find_bottlenecks(graph)
            elif sim_type == "single_points_of_failure":
                result = await engine.find_spof(graph)
            elif sim_type == "redundancy_check":
                result = await engine.check_redundancy(graph)
            else:
                continue

            results.append({
                "type": sim_type,
                "result": result
            })

        return {"simulations": results}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Batch simulation failed: {str(e)}"
        )
