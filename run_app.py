#!/usr/bin/env python3
"""
Simple script to run the MuvHR Flask application
"""
import sys
import os

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import and run the Flask app
from backend.app import app

if __name__ == "__main__":
    print("🚀 Starting MuvHR Flask Application...")
    print("📍 Access the application at: http://localhost:5000")
    print("🔧 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        app.run(host="0.0.0.0", port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n👋 MuvHR application stopped.")
    except Exception as e:
        print(f"❌ Error starting application: {e}")
        sys.exit(1)