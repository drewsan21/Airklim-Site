#!/bin/bash

# AIRKLIM Run All Script
# Esegue l'intera pipeline di analisi e import

echo "=================================================="
echo "🚀 AIRKLIM - Esecuzione Pipeline Completa"
echo "=================================================="
echo ""

# Colori
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verifica virtual environment
if [ -d "venv" ]; then
    echo -e "${GREEN}✓ Attivazione virtual environment...${NC}"
    source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
else
    echo -e "${YELLOW}⚠️  Virtual environment non trovato${NC}"
    echo "   Esegui prima: ./setup.sh"
    exit 1
fi

# Esegui pipeline completa
echo ""
echo "🔄 Esecuzione pipeline completa..."
echo ""

python3 scripts/pipeline.py

# Controlla exit code
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=================================================="
    echo "✅ Pipeline completata con successo!"
    echo -e "==================================================${NC}"
    echo ""
    echo "🌐 Avvio server locale..."
    echo ""
    
    # Avvia server locale in background
    python3 scripts/local_server.py &
    SERVER_PID=$!
    
    # Attendi che il server sia pronto
    sleep 3
    
    echo ""
    echo -e "${GREEN}=================================================="
    echo "🚀 Server avviato!"
    echo -e "==================================================${NC}"
    echo ""
    echo "🌐 URLs:"
    echo "   - Local Server: http://localhost:8000"
    echo "   - API Docs: http://localhost:8000/docs"
    echo "   - Frontend: http://localhost:5173"
    echo "   - Admin: http://localhost:5173/#admin"
    echo ""
    echo "⚠️  Premi CTRL+C per fermare il server"
    echo ""
    
    # Avvia frontend in un altro terminale
    echo "🎨 Avvio frontend..."
    npm run dev &
    FRONTEND_PID=$!
    
    # Attendi che il frontend sia pronto
    sleep 5
    
    echo ""
    echo -e "${GREEN}=================================================="
    echo "🎉 Tutto pronto!"
    echo -e "==================================================${NC}"
    echo ""
    echo "🌐 Apri nel browser:"
    echo "   http://localhost:5173"
    echo ""
    echo "⚠️  Premi CTRL+C per fermare tutto"
    echo ""
    
    # Attendi input utente
    wait $SERVER_PID $FRONTEND_PID
else
    echo ""
    echo -e "${RED}=================================================="
    echo "✗ Pipeline fallita!"
    echo -e "==================================================${NC}"
    echo ""
    echo "Controlla i log in: logs/"
    exit 1
fi
