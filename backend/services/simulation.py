"""
Simulation Engine
Performs "what if" analysis on architecture
"""

from typing import Dict, Any, List, Set

class SimulationEngine:
    async def simulate_removal(
        self,
        graph: Dict[str, Any],
        target_node: str
    ) -> Dict[str, Any]:
        """
        Simulate removing a node and calculate impact
        """
        nodes = {n['id']: n for n in graph.get('nodes', [])}
        connections = graph.get('connections', [])

        if target_node not in nodes:
            return {
                "impact": {"error": "Node not found"},
                "visualization": {},
                "recommendation": "Node does not exist",
                "affected_nodes": []
            }

        # Find all dependent nodes
        affected = self._find_dependents(target_node, connections)

        # Categorize impact
        critical = []
        degraded = []

        for node_id in affected:
            # Check if node has alternative paths
            alternatives = self._find_alternative_paths(
                graph,
                node_id,
                excluding=target_node
            )

            if len(alternatives) == 0:
                critical.append(node_id)
            else:
                degraded.append(node_id)

        recommendation = self._generate_removal_recommendation(
            target_node,
            critical,
            degraded,
            nodes
        )

        return {
            "impact": {
                "critical": critical,
                "degraded": degraded,
                "unaffected": [
                    n['id'] for n in nodes.values()
                    if n['id'] not in affected and n['id'] != target_node
                ]
            },
            "visualization": {
                "removed_node": target_node,
                "critical_nodes": critical,
                "degraded_nodes": degraded,
                "ripple_animation": True
            },
            "recommendation": recommendation,
            "affected_nodes": list(affected)
        }

    async def simulate_scaling(
        self,
        graph: Dict[str, Any],
        multiplier: float
    ) -> Dict[str, Any]:
        """
        Simulate traffic scaling and find bottlenecks
        """
        nodes = {n['id']: n for n in graph.get('nodes', [])}
        connections = graph.get('connections', [])

        # Find entry points (services without incoming connections)
        incoming = {conn['target'] for conn in connections}
        entry_points = [n['id'] for n in nodes.values() if n['id'] not in incoming]

        # Propagate load through graph
        load_map = {}
        for entry in entry_points:
            self._propagate_load(entry, 1000 * multiplier, connections, load_map)

        # Identify bottlenecks (>80% capacity)
        bottlenecks = []
        for node_id, load in load_map.items():
            capacity = self._estimate_capacity(nodes.get(node_id, {}))
            utilization = load / capacity if capacity > 0 else 0

            if utilization > 0.8:
                bottlenecks.append({
                    "node": node_id,
                    "load": load,
                    "capacity": capacity,
                    "utilization": utilization
                })

        bottlenecks.sort(key=lambda x: x['utilization'], reverse=True)

        recommendation = self._generate_scaling_recommendation(bottlenecks, multiplier)

        return {
            "impact": {
                "bottlenecks": bottlenecks,
                "load_map": load_map
            },
            "visualization": {
                "heatmap": True,
                "intensity_map": load_map
            },
            "recommendation": recommendation,
            "affected_nodes": [b['node'] for b in bottlenecks]
        }

    async def simulate_failure(
        self,
        graph: Dict[str, Any],
        failed_node: str
    ) -> Dict[str, Any]:
        """
        Simulate cascading failure
        """
        nodes = {n['id']: n for n in graph.get('nodes', [])}
        connections = graph.get('connections', [])

        cascade = [failed_node]
        visited = set()

        def propagate_failure(node_id: str, depth: int = 0):
            if node_id in visited or depth > 10:
                return

            visited.add(node_id)

            # Find dependents
            dependents = [
                conn['target']
                for conn in connections
                if conn['source'] == node_id
            ]

            for dependent in dependents:
                # Check if this connection is critical
                has_alternatives = len([
                    c for c in connections
                    if c['target'] == dependent and c['source'] != node_id
                ]) > 0

                if not has_alternatives:
                    cascade.append(dependent)
                    propagate_failure(dependent, depth + 1)

        propagate_failure(failed_node)

        return {
            "impact": {
                "cascade_sequence": cascade,
                "total_affected": len(cascade),
                "failure_percentage": len(cascade) / len(nodes) * 100 if nodes else 0
            },
            "visualization": {
                "cascade_animation": True,
                "failed_nodes": cascade
            },
            "recommendation": f"Failure of {failed_node} affects {len(cascade)} services. " +
                             f"Consider adding redundancy or circuit breakers.",
            "affected_nodes": cascade
        }

    async def calculate_latency(self, graph: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate end-to-end latency
        """
        nodes = {n['id']: n for n in graph.get('nodes', [])}
        connections = graph.get('connections', [])

        # Simple latency estimation based on node types
        latencies = {}
        for node in nodes.values():
            node_type = node.get('type', 'service')
            latencies[node['id']] = {
                'frontend': 50,
                'backend': 100,
                'database': 20,
                'cache': 5,
                'api': 150
            }.get(node_type, 100)

        return {
            "impact": {"latencies": latencies},
            "visualization": {},
            "recommendation": "End-to-end latency analysis complete",
            "affected_nodes": []
        }

    async def find_bottlenecks(self, graph: Dict[str, Any]) -> Dict[str, Any]:
        """Find potential bottlenecks in the architecture"""
        connections = graph.get('connections', [])

        # Count connections per node
        connection_count = {}
        for conn in connections:
            connection_count[conn['target']] = connection_count.get(conn['target'], 0) + 1

        # Nodes with many incoming connections are potential bottlenecks
        bottlenecks = [
            {"node": node_id, "connections": count}
            for node_id, count in connection_count.items()
            if count > 5
        ]

        return {"bottlenecks": bottlenecks}

    async def find_spof(self, graph: Dict[str, Any]) -> Dict[str, Any]:
        """Find single points of failure"""
        nodes = graph.get('nodes', [])
        connections = graph.get('connections', [])

        spof_nodes = []

        for node in nodes:
            # A node is SPOF if removing it breaks critical paths
            dependents = self._find_dependents(node['id'], connections)
            if len(dependents) > 3:  # Arbitrary threshold
                spof_nodes.append(node['id'])

        return {"single_points_of_failure": spof_nodes}

    async def check_redundancy(self, graph: Dict[str, Any]) -> Dict[str, Any]:
        """Check for redundancy in the architecture"""
        nodes = graph.get('nodes', [])
        connections = graph.get('connections', [])

        # Group nodes by type
        by_type = {}
        for node in nodes:
            node_type = node.get('type', 'unknown')
            by_type.setdefault(node_type, []).append(node['id'])

        redundancy_report = {
            node_type: {
                "count": len(node_ids),
                "has_redundancy": len(node_ids) > 1
            }
            for node_type, node_ids in by_type.items()
        }

        return {"redundancy": redundancy_report}

    def _find_dependents(
        self,
        node_id: str,
        connections: List[Dict[str, Any]]
    ) -> Set[str]:
        """Find all nodes that depend on this node"""
        dependents = set()
        to_check = [node_id]
        visited = set()

        while to_check:
            current = to_check.pop()
            if current in visited:
                continue
            visited.add(current)

            for conn in connections:
                if conn['source'] == current:
                    target = conn['target']
                    dependents.add(target)
                    to_check.append(target)

        return dependents

    def _find_alternative_paths(
        self,
        graph: Dict[str, Any],
        target_node: str,
        excluding: str
    ) -> List[List[str]]:
        """Find alternative paths to a node, excluding a specific node"""
        # Simplified - just check if there are other incoming connections
        connections = graph.get('connections', [])
        alternatives = [
            conn for conn in connections
            if conn['target'] == target_node and conn['source'] != excluding
        ]
        return alternatives

    def _propagate_load(
        self,
        node_id: str,
        load: float,
        connections: List[Dict[str, Any]],
        load_map: Dict[str, float]
    ):
        """Propagate load through the graph"""
        load_map[node_id] = load_map.get(node_id, 0) + load

        # Propagate to connected nodes
        outgoing = [c for c in connections if c['source'] == node_id]
        if outgoing:
            load_per_connection = load / len(outgoing)
            for conn in outgoing:
                self._propagate_load(
                    conn['target'],
                    load_per_connection,
                    connections,
                    load_map
                )

    def _estimate_capacity(self, node: Dict[str, Any]) -> float:
        """Estimate node capacity (requests per second)"""
        node_type = node.get('type', 'service')

        capacities = {
            'frontend': 10000,
            'backend': 5000,
            'database': 2000,
            'cache': 50000,
            'api': 3000
        }

        return capacities.get(node_type, 5000)

    def _generate_removal_recommendation(
        self,
        target: str,
        critical: List[str],
        degraded: List[str],
        nodes: Dict[str, Any]
    ) -> str:
        """Generate recommendation for node removal"""
        if critical:
            return (
                f"⚠️ Removing {target} will break {len(critical)} critical services: "
                f"{', '.join(critical[:3])}. Do not remove without replacements."
            )
        elif degraded:
            return (
                f"⚡ Removing {target} will degrade {len(degraded)} services. "
                f"Ensure alternatives are in place."
            )
        else:
            return f"✅ {target} can be safely removed with minimal impact."

    def _generate_scaling_recommendation(
        self,
        bottlenecks: List[Dict[str, Any]],
        multiplier: float
    ) -> str:
        """Generate recommendation for scaling"""
        if not bottlenecks:
            return f"✅ System can handle {multiplier}x traffic with current capacity."

        top_bottleneck = bottlenecks[0]
        return (
            f"⚠️ At {multiplier}x traffic, {top_bottleneck['node']} will be at "
            f"{top_bottleneck['utilization']*100:.0f}% capacity. "
            f"Consider horizontal scaling or adding caching layers."
        )
