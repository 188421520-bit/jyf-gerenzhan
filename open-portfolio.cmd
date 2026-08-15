@echo off
setlocal

set "PROJECT_DIR=%~dp0"
set "SITE_URL=http://127.0.0.1:5173/"

call :is_ready
if not errorlevel 1 goto :open_site

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js and npm were not found.
  echo Install Node.js 20 or newer, then try again.
  pause
  exit /b 1
)

echo Starting the portfolio editor preview...
powershell.exe -NoProfile -Command ^
  "Start-Process -FilePath $env:ComSpec -ArgumentList @('/d','/c','npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort') -WorkingDirectory $env:PROJECT_DIR -WindowStyle Minimized"

for /l %%I in (1,1,50) do (
  call :is_ready
  if not errorlevel 1 goto :open_site
  powershell.exe -NoProfile -Command "Start-Sleep -Milliseconds 300"
)

echo ERROR: The portfolio server did not start within 15 seconds.
echo Another program may already be using port 5173.
pause
exit /b 1

:open_site
start "" "%SITE_URL%#top"
exit /b 0

:is_ready
powershell.exe -NoProfile -Command ^
  "try { $r=Invoke-WebRequest -Uri '%SITE_URL%' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200 -and $r.Content -match 'id=.root.') { exit 0 } } catch {}; exit 1"
exit /b %errorlevel%
