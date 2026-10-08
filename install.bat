@echo off
REM ============================================================
REM  AIRKLIM - Setup Windows (dipendenze + build)
REM  Uso: doppio clic su install.bat
REM ============================================================
cd /d "%~dp0"

echo ============================================================
echo   AIRKLIM - Setup Windows
echo ============================================================

where node >nul 2>nul
if errorlevel 1 (
    echo [ERRORE] Node.js non trovato nel PATH.
    echo Installa Node.js 18+ da https://nodejs.org/ e riavvia il terminale.
    pause
    exit /b 1
)

for /f "delims=" %%v in ('node --version') do echo [OK] Node.js %%v

echo.
echo [1/3] Installazione dipendenze Node.js... (puo richiedere alcuni minuti)
call npm install --no-audit --no-fund
if errorlevel 1 (
    echo [ERRORE] npm install fallito. Controlla la connessione internet e riprova.
    pause
    exit /b 1
)

echo.
echo [2/3] Build di produzione...
call npm run build
if errorlevel 1 (
    echo [ATTENZIONE] Build fallita: puoi comunque usare il server di sviluppo con start.bat
)

echo.
echo [3/3] Creazione cartelle dati...
if not exist "uploads\images" mkdir "uploads\images"
if not exist "uploads\catalogs" mkdir "uploads\catalogs"
if not exist "data" mkdir "data"

echo.
echo ============================================================
echo   SETUP COMPLETATO! Avvia il sito con start.bat
echo ============================================================
pause
