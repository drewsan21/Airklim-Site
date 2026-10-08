@echo off
REM ============================================================
REM  AIRKLIM - Avvio sito (server di sviluppo locale)
REM  Uso: doppio clic su start.bat  →  http://localhost:5173
REM ============================================================
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo [ERRORE] Node.js non trovato. Esegui prima install.bat (dopo aver installato Node.js).
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Dipendenze non ancora installate: eseguo install.bat...
    call install.bat
)

echo.
echo ============================================================
echo   AIRKLIM in avvio su http://localhost:5173
echo   (il browser verra aperto automaticamente)
echo   Premi CTRL+C in questa finestra per fermare il sito
echo ============================================================
echo.

start "" cmd /c "timeout /t 4 >nul & start http://localhost:5173"
call npm run dev -- --host
