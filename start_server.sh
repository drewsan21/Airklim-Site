#!/bin/bash

# AIRKLIM Start Server Script
# Avvia il server locale e il frontend

echo "=================================================="
echo "🚀 AIRKLIM - Avvio Server Locale"
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

# Funzione per cleanup
cleanup() {
    echo ""
    echo -e "${YELLOW}⚠️  Arresto server...${NC}"
    
    # Kill server Python
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
        echo -e "${GREEN}✓ Server Python arrestato${NC}"
    fi
    
    # Kill frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✓ Frontend arrestato${NC}"
    fi
    
    exit 0
}

# Trap SIGINT (CTRL+C)
trap cleanup SIGINT

echo ""
echo "🌐 Avvio server locale..."
echo ""

# Avvia server Python in background
python3 scripts/local_server.py &
SERVER_PID=$!

# Attendi che il server sia pronto
sleep 3

# Verifica che il server sia attivo
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${RED}✗ Errore nell'avvio del server${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Server Python avviato (PID: $SERVER_PID)${NC}"
echo ""

echo "🎨 Avvio frontend..."
echo ""

# Avvia frontend in background
npm run dev &
FRONTEND_PID=$!

# Attendi che il frontend sia pronto
sleep 5

# Verifica che il frontend sia attivo
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}✗ Errore nell'avvio del frontend${NC}"
    cleanup
    exit 1
fi

echo -e "${GREEN}✓ Frontend avviato (PID: $FRONTEND_PID)${NC}"
echo ""

echo "=================================================="
echo -e "${GREEN}🎉 Server avviato con successo!${NC}"
echo "=================================================="
echo ""
echo "🌐 URLs:"
echo "   - Local Server: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo "   - Frontend: http://localhost:5173"
echo "   - Admin: http://localhost:5173/#admin"
echo ""
echo "🔐 Credenziali Admin:"
echo "   - Email: admin@example.com"
echo "   - Password: Admin@123!"
echo ""
echo "⚠️  Premi CTRL+C per arrestare il server"
echo ""

# Attendi che l'utente prema CTRL+C
wait $SERVER_PID $FRONTEND_PID
