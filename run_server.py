#!/usr/bin/env python3
"""
MuvHR Server Startup Script
"""

import sys
import os
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Import and run the Flask app
from backend.app import app

if __name__ == "__main__":
    print("🚀 Starting MuvHR Backend Server...")
    print("📍 Server will be available at: http://localhost:8080")
    print("🎯 Frontend should be served from: frontend/index.html")
    print("📊 Features available:")
    print("   • Contracts Management (Admin, HR, Manager)")
    print("   • Onboarding Tracking (All roles, Admin/HR can modify)")
    print("   • Resources Library (Role-based access)")
    print("   • File Upload System (All except Intern)")
    print("   • Archive Viewer (All roles)")
    print("\n" + "="*50 + "\n")
    
    try:
        app.run(host="0.0.0.0", port=8080, debug=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)