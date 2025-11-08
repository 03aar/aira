"""
Python Parser
Analyzes Python projects
"""

import os
import re
from pathlib import Path
from typing import Dict, Any, List
from .base import LanguageParser
import uuid

class PythonParser(LanguageParser):
    async def parse(self, repo_path: Path) -> List[Dict[str, Any]]:
        """
        Parse Python repository
        """
        services = []

        # Check for requirements or pyproject.toml
        requirements_path = repo_path / 'requirements.txt'
        pyproject_path = repo_path / 'pyproject.toml'

        dependencies = []

        if requirements_path.exists():
            dependencies = self._parse_requirements(requirements_path)
        elif pyproject_path.exists():
            # Basic parsing - full TOML parsing would need tomli
            try:
                with open(pyproject_path) as f:
                    content = f.read()
                    # Extract dependencies from [project] or [tool.poetry.dependencies]
                    deps = re.findall(r'([a-zA-Z0-9\-_]+)\s*=\s*["\']', content)
                    dependencies = deps
            except Exception:
                pass

        # Detect framework
        framework = self._detect_framework(dependencies)

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
                "dependencies": dependencies[:10]
            })

        # Detect databases
        db_services = self._detect_databases(dependencies)
        services.extend(db_services)

        return services

    def _parse_requirements(self, requirements_path: Path) -> List[str]:
        """Parse requirements.txt"""
        dependencies = []

        try:
            with open(requirements_path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        # Extract package name (before ==, >=, etc.)
                        package = re.split(r'[=<>!]', line)[0].strip()
                        dependencies.append(package)
        except Exception:
            pass

        return dependencies

    def _detect_framework(self, dependencies: List[str]) -> str:
        """Detect web framework"""
        for dep in dependencies:
            if 'fastapi' in dep.lower():
                return 'FastAPI'
            elif 'flask' in dep.lower():
                return 'Flask'
            elif 'django' in dep.lower():
                return 'Django'

        return 'Python'

    def _find_routes(self, repo_path: Path, framework: str) -> List[str]:
        """Find API routes"""
        routes = set()

        route_patterns = [
            r"@app\.(get|post|put|delete|patch)\(['\"]([^'\"]+)['\"]",  # FastAPI
            r"@router\.(get|post|put|delete|patch)\(['\"]([^'\"]+)['\"]",  # FastAPI
            r"@app\.route\(['\"]([^'\"]+)['\"]",  # Flask
        ]

        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if not self._should_ignore_dir(d)]

            for file in files:
                if file.endswith('.py'):
                    file_path = Path(root) / file

                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()

                        for pattern in route_patterns:
                            matches = re.finditer(pattern, content)
                            for match in matches:
                                # Extract route path (last group)
                                route = match.groups()[-1]
                                routes.add(route)
                    except Exception:
                        continue

        return list(routes)[:20]

    def _detect_databases(self, dependencies: List[str]) -> List[Dict[str, Any]]:
        """Detect database connections"""
        databases = []

        db_map = {
            'psycopg2': {'name': 'PostgreSQL', 'type': 'data'},
            'pymongo': {'name': 'MongoDB', 'type': 'data'},
            'redis': {'name': 'Redis', 'type': 'cache'},
            'sqlalchemy': {'name': 'SQL Database', 'type': 'data'},
        }

        for dep in dependencies:
            for db_key, db_info in db_map.items():
                if db_key in dep.lower():
                    databases.append({
                        "id": f"db-{uuid.uuid4().hex[:8]}",
                        "name": db_info['name'],
                        "type": db_info['type'],
                        "tech": db_info['name'],
                        "dependencies": []
                    })
                    break

        return databases
