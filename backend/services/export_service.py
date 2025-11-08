"""
Export Service
Handles exporting architectures to various formats
"""

from typing import Dict, Any
import json

class ExportService:
    async def to_markdown(self, graph: Dict[str, Any]) -> str:
        """
        Convert graph to Markdown documentation
        """
        nodes = graph.get('nodes', [])
        connections = graph.get('connections', [])

        md = "# Architecture Documentation\n\n"

        # Overview
        md += "## Overview\n\n"
        md += f"This architecture contains {len(nodes)} services/components "
        md += f"with {len(connections)} connections.\n\n"

        # Services
        md += "## Services\n\n"
        for node in nodes:
            md += f"### {node.get('name', 'Unknown')}\n\n"
            md += f"- **Type**: {node.get('type', 'service')}\n"
            if node.get('description'):
                md += f"- **Description**: {node.get('description')}\n"
            if node.get('techStack'):
                md += f"- **Technology**: {', '.join(node.get('techStack', []))}\n"
            md += "\n"

        # Connections
        md += "## Connections\n\n"
        for conn in connections:
            source_node = next((n for n in nodes if n['id'] == conn['source']), None)
            target_node = next((n for n in nodes if n['id'] == conn['target']), None)

            if source_node and target_node:
                md += f"- **{source_node['name']}** → **{target_node['name']}** "
                md += f"({conn.get('type', 'dependency')})\n"

        return md

    async def to_image(
        self,
        graph: Dict[str, Any],
        format: str,
        options: Dict[str, Any]
    ) -> str:
        """
        Convert graph to image (PNG/SVG/PDF)
        Placeholder - would use Puppeteer or similar in production
        """
        # In production, this would:
        # 1. Render the graph using headless browser
        # 2. Take screenshot / export as SVG / print to PDF
        # 3. Return file path

        # For now, just save JSON
        import tempfile
        import os

        temp_file = tempfile.NamedTemporaryFile(
            mode='w',
            suffix=f'.{format}',
            delete=False
        )

        with temp_file:
            json.dump(graph, temp_file, indent=2)

        return temp_file.name

    async def to_json(self, graph: Dict[str, Any]) -> str:
        """
        Convert graph to JSON string
        """
        return json.dumps(graph, indent=2)
