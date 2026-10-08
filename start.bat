@echo off
REM ============================================================
REM  AIRKLIM - Windows Start Script
REM  Launches the Vite dev server (frontend) and optionally the
REM  Express API (backend). Opens the browser automatically.
REM  Usage: double-click start.bat
REM ============================================================
setlocal EnableDelayedExpansion
chcp 65001 >nul
title AIRKLIM - Start

echo.
echo  ==============================================
echo    AIRKLIM HVAC Distributor - START
echo  ==============================================
echo.

REM --- Check Node.js ---
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js not found! Run install.bat prerequisites first:
    echo         download Node.js LTS from https://nodejs.org
    pause
    exit /b 1
)

REM --- Check dependencies installed ---
if not exist "node_modules\" (
    echo [WARN] Dependencies missing. Running "npm install"...
    call npm install --no-audit --no-fund
    if errorlevel 1 (
        echo [ERROR] npm install failed. Run install.bat first.
        pause
        exit /b 1
    )
)

REM --- Ask about backend ---
set /p RUN_BACKEND="Start also the backend API on port 3000? (Y/N, default N): "
if /I "!RUN_BACKEND!"=="Y" (
    if not exist "server\node_modules\" (
        echo [INFO] Installing backend dependencies...
        pushd server && call npm install --no-audit --no-fund && popd
    )
    if not exist "server\.env" if exist "server\.env.example" copy /Y "server\.env.example" "server\.env" >nul
    echo [INFO] Starting backend API in a new window (node server/server.js)...
    start "AIRKLIM Backend API" cmd /k "cd server && node server.js"
    timeout /t 3 /nobreak >nul
)

REM --- Open browser once Vite prints the local URL ---
start "" /b cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:5173"

echo.
echo [INFO] Starting FRONTEND dev server (Vite) at http://localhost:5173
echo        Close this window or press Ctrl+C to stop.
echo.
call npm run dev

endlocal
