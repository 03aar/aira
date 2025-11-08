"""
Node.js/TypeScript Parser
Analyzes JavaScript and TypeScript projects
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, Any, List
from .base import LanguageParser
import uuid

class NodeJSParser(LanguageParser):
    async def parse(self, repo_path: Path) -> List[Dict[str, Any]]:
        """
        Parse Node.js/TypeScript repository
        """
        services = []

        # Check for package.json
        package_json_path = repo_path / 'package.json'
        if not package_json_path.exists():
            return services

        with open(package_json_path) as f:
            package_data = json.load(f)

        # Detect framework
        dependencies = package_data.get('dependencies', {})
        dev_dependencies = package_data.get('devDependencies', {})
        all_deps = {**dependencies, **dev_dependencies}

        framework = self._detect_framework(all_deps)

        # Find API routes
        routes = self._find_routes(repo_path, framework)

        if routes:
            services.append({
                "id": f"api-{uuid.uuid4().hex[:8]}",
                "name": f"API Server ({framework})",
                "type": "backend",
                "subType": "api-server",
                "tech": framework,
                "endpoints": routes,
                "dependencies": list(all_deps.keys())[:10]  # First 10
            })

        # Detect databases
        db_services = self._detect_databases(all_deps)
        services.extend(db_services)

        # Detect external integrations
        integrations = self._detect_integrations(repo_path)
        services.extend(integrations)

        return services

    def _detect_framework(self, dependencies: Dict[str, str]) -> str:
        """Detect web framework"""
        if 'express' in dependencies:
            return 'Express'
        elif 'fastify' in dependencies:
            return 'Fastify'
        elif '@nestjs/core' in dependencies:
            return 'NestJS'
        elif 'next' in dependencies:
            return 'Next.js'
        elif 'koa' in dependencies:
            return 'Koa'
        else:
            return 'Node.js'

    def _find_routes(self, repo_path: Path, framework: str) -> List[str]:
        """Find API routes"""
        routes = set()

        # Express patterns
        route_patterns = [
            r"app\.(get|post|put|delete|patch)\(['\"]([^'\"]+)['\"]",
            r"router\.(get|post|put|delete|patch)\(['\"]([^'\"]+)['\"]",
            r"@(Get|Post|Put|Delete|Patch)\(['\"]([^'\"]+)['\"]",  # NestJS
        ]

        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if not self._should_ignore_dir(d)]

            for file in files:
                if file.endswith(('.js', '.ts', '.jsx', '.tsx')):
                    file_path = Path(root) / file

                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()

                        for pattern in route_patterns:
                            matches = re.finditer(pattern, content)
                            for match in matches:
                                route = match.group(2) if len(match.groups()) > 1 else match.group(1)
                                routes.add(route)
                    except Exception:
                        continue

        return list(routes)[:20]  # Limit to 20 routes

    def _detect_databases(self, dependencies: Dict[str, str]) -> List[Dict[str, Any]]:
        """Detect database connections"""
        databases = []

        db_map = {
            'pg': {'name': 'PostgreSQL', 'type': 'data'},
            'postgres': {'name': 'PostgreSQL', 'type': 'data'},
            'mysql': {'name': 'MySQL', 'type': 'data'},
            'mysql2': {'name': 'MySQL', 'type': 'data'},
            'mongodb': {'name': 'MongoDB', 'type': 'data'},
            'mongoose': {'name': 'MongoDB', 'type': 'data'},
            'redis': {'name': 'Redis', 'type': 'cache'},
            'ioredis': {'name': 'Redis', 'type': 'cache'},
        }

        for dep, db_info in db_map.items():
            if dep in dependencies:
                databases.append({
                    "id": f"db-{uuid.uuid4().hex[:8]}",
                    "name": db_info['name'],
                    "type": db_info['type'],
                    "tech": db_info['name'],
                    "dependencies": []
                })

        return databases

    def _detect_integrations(self, repo_path: Path) -> List[Dict[str, Any]]:
        """Detect external integrations"""
        integrations = []

        # Common integration patterns
        integration_patterns = {
            r"stripe": "Stripe",
            r"sendgrid": "SendGrid",
            r"twilio": "Twilio",
            r"aws-sdk": "AWS",
            r"@aws-sdk": "AWS",
        }

        found_integrations = set()

        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if not self._should_ignore_dir(d)]

            for file in files:
                if file.endswith(('.js', '.ts')):
                    file_path = Path(root) / file

                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()

                        for pattern, name in integration_patterns.items():
                            if re.search(pattern, content, re.IGNORECASE):
                                found_integrations.add(name)
                    except Exception:
                        continue

        for integration_name in found_integrations:
            integrations.append({
                "id": f"integration-{uuid.uuid4().hex[:8]}",
                "name": f"{integration_name} Integration",
                "type": "integration",
                "tech": integration_name,
                "dependencies": []
            })

        return integrations
