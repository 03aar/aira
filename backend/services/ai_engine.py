"""
AI Engine - OpenAI Integration
Handles natural language processing for architecture commands
"""

import os
import json
from typing import Dict, Any, List, Optional
from openai import AsyncOpenAI

class AIEngine:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4-turbo-preview"

    async def process_message(
        self,
        message: str,
        current_graph: Optional[Dict[str, Any]] = None,
        history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Process a user message and generate response with graph operations
        """
        system_prompt = self._build_system_prompt(current_graph)

        messages = [{"role": "system", "content": system_prompt}]

        # Add conversation history
        if history:
            messages.extend(history[-5:])  # Last 5 messages for context

        # Add current message
        messages.append({"role": "user", "content": message})

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                response_format={"type": "json_object"}
            )

            result = json.loads(response.choices[0].message.content)

            return {
                "response": result.get("response", ""),
                "operations": result.get("operations", []),
                "updated_graph": result.get("updated_graph"),
                "suggestions": result.get("suggestions", [])
            }

        except Exception as e:
            return {
                "response": f"I encountered an error: {str(e)}",
                "operations": [],
                "updated_graph": current_graph,
                "suggestions": []
            }

    def _build_system_prompt(self, current_graph: Optional[Dict[str, Any]]) -> str:
        """Build the system prompt with context"""
        graph_context = ""
        if current_graph:
            nodes = current_graph.get("nodes", [])
            edges = current_graph.get("connections", [])
            graph_context = f"""
Current Architecture:
- {len(nodes)} services/nodes
- {len(edges)} connections
- Node types: {', '.join(set(n.get('type', 'unknown') for n in nodes))}
"""

        return f"""You are Aira, an AI architect assistant that helps visualize and analyze software systems.

{graph_context}

Your capabilities:
1. CREATE: Add new nodes and connections to the architecture
2. QUERY: Find and highlight specific components
3. MODIFY: Change existing architecture elements
4. EXPLAIN: Describe system components and data flows
5. SUGGEST: Recommend architectural improvements

When responding, always return valid JSON with this structure:
{{
  "response": "Natural language explanation for the user",
  "operations": [
    {{
      "type": "add_node" | "update_node" | "delete_node" | "add_connection" | "delete_connection",
      "data": {{...}}
    }}
  ],
  "updated_graph": {{...}} (optional, if modifications were made),
  "suggestions": ["suggestion1", "suggestion2"] (optional)
}}

Examples:

User: "Add a backend API with Redis cache"
Response:
{{
  "response": "I've added a Backend API service connected to a Redis cache. The API will use Redis for session storage and caching frequently accessed data.",
  "operations": [
    {{
      "type": "add_node",
      "data": {{
        "id": "backend-api-1",
        "name": "Backend API",
        "type": "backend",
        "tech": "Node.js + Express"
      }}
    }},
    {{
      "type": "add_node",
      "data": {{
        "id": "redis-cache-1",
        "name": "Redis Cache",
        "type": "cache"
      }}
    }},
    {{
      "type": "add_connection",
      "data": {{
        "source": "backend-api-1",
        "target": "redis-cache-1",
        "type": "cache_access"
      }}
    }}
  ],
  "suggestions": ["Consider adding Redis persistence for critical data", "Add backup cache layer for redundancy"]
}}

User: "Show me all services using PostgreSQL"
Response:
{{
  "response": "I found 3 services connected to PostgreSQL: User Service, Payment Service, and Analytics Service.",
  "operations": [
    {{
      "type": "highlight",
      "data": {{
        "node_ids": ["user-service", "payment-service", "analytics-service"]
      }}
    }}
  ]
}}

Be helpful, concise, and focus on architectural best practices.
Always think about scalability, reliability, and maintainability.
"""

    async def generate_suggestions(self, graph: Dict[str, Any]) -> List[str]:
        """Generate architectural improvement suggestions"""
        prompt = f"""Analyze this architecture and provide 3-5 specific improvement suggestions:

{json.dumps(graph, indent=2)}

Focus on:
- Performance bottlenecks
- Single points of failure
- Security concerns
- Scalability issues
- Cost optimization

Return JSON: {{"suggestions": ["suggestion1", ...]}}
"""

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                response_format={"type": "json_object"}
            )

            result = json.loads(response.choices[0].message.content)
            return result.get("suggestions", [])

        except Exception as e:
            return [f"Error generating suggestions: {str(e)}"]

    async def explain_architecture(self, graph: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a natural language explanation of the architecture"""
        prompt = f"""Explain this software architecture in simple terms:

{json.dumps(graph, indent=2)}

Return JSON with:
- explanation: Overall system description
- key_components: List of important services
- data_flows: Main data paths through the system
- potential_issues: Concerns or risks
"""

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                response_format={"type": "json_object"}
            )

            return json.loads(response.choices[0].message.content)

        except Exception as e:
            return {
                "explanation": f"Error: {str(e)}",
                "key_components": [],
                "data_flows": [],
                "potential_issues": []
            }
