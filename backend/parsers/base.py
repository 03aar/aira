"""
Base Language Parser
Abstract interface for language-specific parsers
"""

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Dict, Any, List

class LanguageParser(ABC):
    @abstractmethod
    async def parse(self, repo_path: Path) -> List[Dict[str, Any]]:
        """
        Parse a repository and extract services/components

        Returns a list of service dictionaries:
        [
            {
                "id": "unique-id",
                "name": "Service Name",
                "type": "backend" | "frontend" | "database" | "api",
                "tech": "Technology stack",
                "endpoints": ["list of endpoints"],
                "dependencies": ["list of dependencies"]
            }
        ]
        """
        pass

    def _should_ignore_dir(self, dirname: str) -> bool:
        """Check if directory should be ignored"""
        ignore_dirs = {
            'node_modules', '.git', 'dist', 'build', '__pycache__',
            'venv', '.venv', 'env', '.env', 'vendor', 'target'
        }
        return dirname in ignore_dirs
