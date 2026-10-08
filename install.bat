@echo off
REM ============================================================
REM  AIRKLIM - Windows Installation Script
REM  Installs frontend + backend dependencies (Node.js required)
REM  Usage: double-click install.bat  OR  run from cmd: install
REM ============================================================
setlocal
chcp 65001 >nul
title AIRKLIM - Install

echo.
echo  ==============================================
echo    AIRKLIM HVAC Distributor - INSTALL
echo  ==============================================
echo.

REM --- Check Node.js is installed ---
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js LTS from https://nodejs.org and re-run this script.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node --version') do echo [OK] Node.js version: %%v

REM --- Check npm is available ---
where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm not found! Reinstall Node.js including npm.
    pause
    exit /b 1
)

echo.
echo [1/3] Installing FRONTEND dependencies (package.json)...
call npm install --no-audit --no-fund
if errorlevel 1 (
    echo [ERROR] Frontend install failed. Check your internet connection.
    pause
    exit /b 1
)

echo.
echo [2/3] Installing BACKEND dependencies (server\package.json)...
pushd server
call npm install --no-audit --no-fund
popd

echo.
echo [3/3] Creating .env files if missing...
if not exist ".env" (
    > .env echo VITE_API_URL=http://localhost:3000/api
    echo       created .env
) else echo       .env already exists, skipping
if not exist "server\.env" (
    if exist "server\.env.example" (
        copy /Y "server\.env.example" "server\.env" >nul
        echo       created server\.env from .env.example
    )
) else echo       server\.env already exists, skipping

echo.
echo  ==============================================
echo    INSTALL COMPLETE!
echo    Run "start.bat" to launch the site.
echo  ==============================================
echo.
pause
endlocal
