"""
GitHub Repository Analyzer
Clones and analyzes repositories to extract architecture
"""

import os
import json
import time
import tempfile
import shutil
from pathlib import Path
from typing import Dict, Any, List, Optional, Callable
from git import Repo
from parsers.nodejs import NodeJSParser
from parsers.python_parser import PythonParser
from parsers.base import LanguageParser

class GitHubAnalyzer:
    def __init__(self):
        self.temp_dir = tempfile.mkdtemp(prefix="aira_")
        self.progress_callback: Optional[Callable[[int, str], None]] = None

        # Initialize parsers
        self.parsers = {
            'javascript': NodeJSParser(),
            'typescript': NodeJSParser(),
            'python': PythonParser(),
            # Add more parsers as needed
        }

    def set_progress_callback(self, callback: Callable[[int, str], None]):
        """Set a callback for progress updates"""
        self.progress_callback = callback

    def _update_progress(self, progress: int, message: str):
        """Update progress if callback is set"""
        if self.progress_callback:
            self.progress_callback(progress, message)

    async def analyze(
        self,
        repo_url: str,
        depth: str = "shallow",
        include_tests: bool = False
    ) -> Dict[str, Any]:
        """
        Main analysis method
        """
        start_time = time.time()

        try:
            # Step 1: Clone repository
            self._update_progress(10, "Cloning repository...")
            repo_path = await self._clone_repository(repo_url, depth)

            # Step 2: Detect languages
            self._update_progress(30, "Detecting languages...")
            languages = self._detect_languages(repo_path)

            # Step 3: Analyze dependencies
            self._update_progress(50, "Analyzing dependencies...")
            dependencies = await self._analyze_dependencies(repo_path, languages)

            # Step 4: Find services
            self._update_progress(70, "Discovering services...")
            services = await self._discover_services(repo_path, languages)

            # Step 5: Map connections
            self._update_progress(90, "Building architecture graph...")
            connections = self._map_connections(services, dependencies)

            analysis_time = time.time() - start_time

            self._update_progress(100, "Analysis complete!")

            return {
                "repo_url": repo_url,
                "languages": languages,
                "services": services,
                "dependencies": dependencies,
                "connections": connections,
                "analysis_time": analysis_time,
                "confidence": self._calculate_confidence(services),
                "metadata": {
                    "total_files": self._count_files(repo_path),
                    "total_services": len(services),
                    "total_connections": len(connections)
                }
            }

        finally:
            # Cleanup
            self._cleanup()

    async def _clone_repository(self, repo_url: str, depth: str) -> Path:
        """Clone the repository"""
        clone_depth = 1 if depth == "shallow" else None

        try:
            repo = Repo.clone_from(
                repo_url,
                self.temp_dir,
                depth=clone_depth
            )
            return Path(self.temp_dir)
        except Exception as e:
            raise Exception(f"Failed to clone repository: {str(e)}")

    def _detect_languages(self, repo_path: Path) -> List[str]:
        """Detect programming languages used in the repository"""
        languages = set()

        # Language file extensions
        lang_extensions = {
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.py': 'python',
            '.go': 'go',
            '.java': 'java',
            '.rs': 'rust',
            '.php': 'php',
            '.rb': 'ruby'
        }

        # Scan files
        for root, dirs, files in os.walk(repo_path):
            # Skip common directories
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build', '__pycache__', 'venv']]

            for file in files:
                ext = Path(file).suffix
                if ext in lang_extensions:
                    languages.add(lang_extensions[ext])

        return list(languages)

    async def _analyze_dependencies(
        self,
        repo_path: Path,
        languages: List[str]
    ) -> Dict[str, List[str]]:
        """Extract dependencies from package files"""
        dependencies = {}

        # JavaScript/TypeScript
        if 'javascript' in languages or 'typescript' in languages:
            package_json = repo_path / 'package.json'
            if package_json.exists():
                with open(package_json) as f:
                    data = json.load(f)
                    deps = list(data.get('dependencies', {}).keys())
                    dev_deps = list(data.get('devDependencies', {}).keys())
                    dependencies['npm'] = deps + dev_deps

        # Python
        if 'python' in languages:
            requirements = repo_path / 'requirements.txt'
            if requirements.exists():
                with open(requirements) as f:
                    deps = [
                        line.split('==')[0].split('>=')[0].strip()
                        for line in f
                        if line.strip() and not line.startswith('#')
                    ]
                    dependencies['pip'] = deps

        return dependencies

    async def _discover_services(
        self,
        repo_path: Path,
        languages: List[str]
    ) -> List[Dict[str, Any]]:
        """Discover services, APIs, databases in the codebase"""
        services = []

        for lang in languages:
            if lang in self.parsers:
                parser = self.parsers[lang]
                lang_services = await parser.parse(repo_path)
                services.extend(lang_services)

        return services

    def _map_connections(
        self,
        services: List[Dict[str, Any]],
        dependencies: Dict[str, List[str]]
    ) -> List[Dict[str, Any]]:
        """Map connections between services"""
        connections = []

        # Create service ID map
        service_ids = {s['name']: s['id'] for s in services}

        # Map dependencies to connections
        for service in services:
            if 'dependencies' in service:
                for dep in service['dependencies']:
                    if dep in service_ids:
                        connections.append({
                            'source': service['id'],
                            'target': service_ids[dep],
                            'type': 'dependency'
                        })

        return connections

    def _calculate_confidence(self, services: List[Dict[str, Any]]) -> float:
        """Calculate confidence score of the analysis"""
        if not services:
            return 0.5

        # Base confidence on number of services found
        if len(services) > 10:
            return 0.9
        elif len(services) > 5:
            return 0.8
        else:
            return 0.7

    def _count_files(self, repo_path: Path) -> int:
        """Count total files in repository"""
        count = 0
        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build']]
            count += len(files)
        return count

    def _cleanup(self):
        """Clean up temporary files"""
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir, ignore_errors=True)
