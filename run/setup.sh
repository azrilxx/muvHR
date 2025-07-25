#!/bin/bash
set -euxo pipefail

# Install Python backend deps
pip install -r requirements.txt

# Install frontend deps (optional: if you use npm packages for frontend)
npm install

# Launch server (Codex runs on port 8080 by default)
python backend/app.py
