@echo off
echo.
echo =============================================
echo        MuvHR Backend Server Launcher
echo =============================================
echo.
echo Starting MuvHR server...
echo Server will be available at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
python run_server.py

pause