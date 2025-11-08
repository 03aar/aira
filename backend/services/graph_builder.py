"""
Graph Builder
Converts analysis results into visual graph structure
"""

from typing import Dict, Any, List
import uuid

class GraphBuilder:
    def build_from_analysis(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert analysis results into a graph structure for the frontend
        """
        services = analysis.get('services', [])
        connections_data = analysis.get('connections', [])

        # Convert services to nodes
        nodes = []
        node_positions = self._calculate_layout(len(services))

        for i, service in enumerate(services):
            node = {
                "id": service.get('id', f"node-{uuid.uuid4().hex[:8]}"),
                "name": service.get('name', 'Unknown Service'),
                "type": service.get('type', 'service'),
                "subType": service.get('subType'),
                "x": node_positions[i]['x'],
                "y": node_positions[i]['y'],
                "connections": [],
                "status": "healthy",
                "description": service.get('description', ''),
                "techStack": service.get('tech', []) if isinstance(service.get('tech'), list) else [service.get('tech', '')],
                "endpoints": service.get('endpoints', []),
                "metrics": {
                    "uptime": 95 + (hash(service.get('name', '')) % 5),
                    "latency": 50 + (hash(service.get('name', '')) % 100)
                }
            }
            nodes.append(node)

        # Convert to connections
        connections = []
        for conn in connections_data:
            connection = {
                "id": f"conn-{uuid.uuid4().hex[:8]}",
                "source": conn.get('source'),
                "target": conn.get('target'),
                "type": conn.get('type', 'dependency'),
                "active": True
            }
            connections.append(connection)

            # Update node connections list
            for node in nodes:
                if node['id'] == conn['source'] or node['id'] == conn['target']:
                    if conn['target'] not in node['connections']:
                        node['connections'].append(conn['target'])

        return {
            "nodes": nodes,
            "connections": connections,
            "metadata": {
                "total_nodes": len(nodes),
                "total_connections": len(connections),
                "languages": analysis.get('languages', [])
            }
        }

    def _calculate_layout(self, num_nodes: int) -> List[Dict[str, float]]:
        """
        Calculate initial positions for nodes using a circular layout
        """
        import math

        positions = []
        radius = 200 + (num_nodes * 20)  # Larger radius for more nodes
        center_x, center_y = 400, 300

        for i in range(num_nodes):
            angle = (2 * math.pi * i) / num_nodes
            x = center_x + radius * math.cos(angle)
            y = center_y + radius * math.sin(angle)
            positions.append({"x": x, "y": y})

        return positions

    def add_node_to_graph(
        self,
        graph: Dict[str, Any],
        node_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Add a new node to an existing graph
        """
        nodes = graph.get('nodes', [])

        new_node = {
            "id": node_data.get('id', f"node-{uuid.uuid4().hex[:8]}"),
            "name": node_data.get('name', 'New Node'),
            "type": node_data.get('type', 'service'),
            "x": node_data.get('x', 0),
            "y": node_data.get('y', 0),
            "connections": [],
            "status": "healthy",
            "description": node_data.get('description', ''),
            "metrics": {"uptime": 100, "latency": 50}
        }

        nodes.append(new_node)
        graph['nodes'] = nodes

        return graph

    def add_connection_to_graph(
        self,
        graph: Dict[str, Any],
        source: str,
        target: str,
        conn_type: str = "dependency"
    ) -> Dict[str, Any]:
        """
        Add a connection between two nodes
        """
        connections = graph.get('connections', [])

        new_connection = {
            "id": f"conn-{uuid.uuid4().hex[:8]}",
            "source": source,
            "target": target,
            "type": conn_type,
            "active": True
        }

        connections.append(new_connection)
        graph['connections'] = connections

        # Update node connections
        for node in graph.get('nodes', []):
            if node['id'] == source:
                if target not in node['connections']:
                    node['connections'].append(target)

        return graph
