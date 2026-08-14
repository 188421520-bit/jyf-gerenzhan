@echo off
setlocal
set "PROJECT_DIR=C:\Users\18842.夜未央\Desktop\作品集\个人站"

powershell.exe -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if errorlevel 1 (
  start "JYF Portfolio Server" /min cmd.exe /c ""%PROJECT_DIR%\start-portfolio-server.cmd""
)

powershell.exe -NoProfile -Command "$limit=(Get-Date).AddSeconds(20); do { if (Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue) { exit 0 }; Start-Sleep -Milliseconds 300 } while ((Get-Date) -lt $limit); exit 1"
if errorlevel 1 (
  echo Website service failed to start. Please keep this window open and contact Codex.
  pause
  exit /b 1
)

start "" "http://localhost:5173/#top"
