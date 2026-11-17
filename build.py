#!/usr/bin/env python3
"""Compatibility entry point for the EJS static build."""
from pathlib import Path
import subprocess
subprocess.run(['npm', 'run', 'build'], cwd=Path(__file__).resolve().parent, check=True)
