@echo off
setlocal
cd /d "%~dp0"

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js and npm were not found.
  pause
  exit /b 1
)

echo Portfolio editor preview:
echo http://127.0.0.1:5173/
echo.
echo Keep this window running for live editing.
echo You can restart it later with the one-click launcher.
echo.
call npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort

if errorlevel 1 (
  echo.
  echo ERROR: The server stopped. Port 5173 may be in use.
  pause
)
