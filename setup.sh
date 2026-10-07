#!/bin/bash

# ============================================================================
# AIRKLIM - UNICO SCRIPT DI SETUP COMPLETO
# ============================================================================
# Questo script installa TUTTO in un unico comando:
# - Dipendenze Node.js
# - Virtual environment Python
# - Dipendenze Python
# - Directory necessarie
# - Configurazione ambiente
# - Build iniziale
#
# UTILIZZO:
#   chmod +x setup.sh
#   ./setup.sh
# ============================================================================

echo "=================================================="
echo "🚀 AIRKLIM - Setup Completo"
echo "=================================================="
echo ""

# Colori
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per step
step() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# ============================================================================
# STEP 1: Verifica dipendenze di sistema
# ============================================================================
step "📋 STEP 1/7: Verifica dipendenze di sistema"

# Verifica Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js non trovato${NC}"
    echo "   Installa Node.js 18+ da: https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js $NODE_VERSION${NC}"
fi

# Verifica npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm non trovato${NC}"
    exit 1
else
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm v$NPM_VERSION${NC}"
fi

# Verifica Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 non trovato${NC}"
    echo "   Installa Python 3.8+ da: https://www.python.org/"
    exit 1
else
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✅ $PYTHON_VERSION${NC}"
fi

# Verifica pip
if ! command -v pip3 &> /dev/null; then
    echo -e "${YELLOW}⚠️  pip3 non trovato, verrà installato${NC}"
else
    PIP_VERSION=$(pip3 --version)
    echo -e "${GREEN}✅ $PIP_VERSION${NC}"
fi

# Verifica Tesseract OCR (opzionale)
if command -v tesseract &> /dev/null; then
    TESSERACT_VERSION=$(tesseract --version 2>&1 | head -n1)
    echo -e "${GREEN}✅ $TESSERACT_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Tesseract OCR non trovato (opzionale ma raccomandato)${NC}"
    echo "   Installa con:"
    echo "   - macOS: brew install tesseract tesseract-lang"
    echo "   - Ubuntu: sudo apt-get install tesseract-ocr tesseract-ocr-ita"
    echo "   - Windows: https://github.com/UB-Mannheim/tesseract/wiki"
fi

# Verifica Poppler (opzionale)
if command -v pdftoppm &> /dev/null; then
    echo -e "${GREEN}✅ Poppler installato${NC}"
else
    echo -e "${YELLOW}⚠️  Poppler non trovato (opzionale ma raccomandato)${NC}"
    echo "   Installa con:"
    echo "   - macOS: brew install poppler"
    echo "   - Ubuntu: sudo apt-get install poppler-utils"
fi

# ============================================================================
# STEP 2: Installa dipendenze Node.js
# ============================================================================
step "📦 STEP 2/7: Installa dipendenze Node.js"

echo "Esecuzione: npm install"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dipendenze Node.js installate con successo${NC}"
else
    echo -e "${RED}❌ Errore nell'installazione delle dipendenze Node.js${NC}"
    exit 1
fi

# ============================================================================
# STEP 3: Crea virtual environment Python
# ============================================================================
step "🐍 STEP 3/7: Crea virtual environment Python"

if [ -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment già esistente${NC}"
    echo "   Rimuovilo con: rm -rf venv"
    echo "   Oppure continua con l'installazione esistente"
else
    echo "Creazione virtual environment..."
    python3 -m venv venv
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Virtual environment creato${NC}"
    else
        echo -e "${RED}❌ Errore nella creazione del virtual environment${NC}"
        exit 1
    fi
fi

# Attiva virtual environment
echo "Attivazione virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

echo -e "${GREEN}✅ Virtual environment attivato${NC}"

# ============================================================================
# STEP 4: Installa dipendenze Python
# ============================================================================
step "📦 STEP 4/7: Installa dipendenze Python"

echo "Aggiornamento pip..."
pip install --upgrade pip

echo "Installazione dipendenze Python..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dipendenze Python installate con successo${NC}"
else
    echo -e "${RED}❌ Errore nell'installazione delle dipendenze Python${NC}"
    exit 1
fi

# ============================================================================
# STEP 5: Crea directory necessarie
# ============================================================================
step "📁 STEP 5/7: Crea directory necessarie"

DIRECTORIES=(
    "public/uploads/images/panasonic/etherea/xz-grafite"
    "public/uploads/images/panasonic/etherea/z-bianco"
    "public/uploads/images/panasonic/tz"
    "public/uploads/images/panasonic/console"
    "public/uploads/images/panasonic/canalizzata"
    "public/uploads/images/panasonic/professionale"
    "public/uploads/images/panasonic/multi-split"
    "public/uploads/images/panasonic/unita-esterne"
    "public/uploads/images/tcl/breezein"
    "public/uploads/images/accessori/telecomandi"
    "public/uploads/images/accessori/gateway"
    "public/uploads/images/accessori/filtri"
    "public/uploads/images/optimized"
    "public/uploads/images/thumbnails"
    "public/uploads/images/extracted"
    "public/uploads/images/uploaded"
    "public/uploads/catalogs/panasonic/2026"
    "public/uploads/catalogs/tcl/2026"
    "public/uploads/catalogs/uploaded"
    "data/extracted/images"
    "logs"
    "backups"
    "docs/technical_specs"
)

for dir in "${DIRECTORIES[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo -e "${GREEN}  ✓ Creata: $dir${NC}"
    fi
done

echo -e "${GREEN}✅ Tutte le directory create${NC}"

# ============================================================================
# STEP 6: Configura ambiente
# ============================================================================
step "⚙️  STEP 6/7: Configura ambiente"

if [ ! -f ".env" ]; then
    echo "Creazione file .env da .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✅ File .env creato${NC}"
    echo -e "${YELLOW}⚠️  Modifica .env con le tue credenziali prima di usare il backend${NC}"
else
    echo -e "${YELLOW}⚠️  File .env già esistente${NC}"
fi

# Rendi eseguibili gli script
echo "Impostazione permessi script..."
chmod +x setup.sh 2>/dev/null
chmod +x run_all.sh 2>/dev/null
chmod +x start_server.sh 2>/dev/null
chmod +x cleanup.sh 2>/dev/null
chmod +x backup.sh 2>/dev/null
chmod +x restore.sh 2>/dev/null
chmod +x scripts/*.sh 2>/dev/null
chmod +x scripts/*.py 2>/dev/null

echo -e "${GREEN}✅ Permessi script impostati${NC}"

# ============================================================================
# STEP 7: Build iniziale
# ============================================================================
step "🏗️  STEP 7/7: Build iniziale"

echo "Esecuzione build..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completato con successo${NC}"
else
    echo -e "${RED}❌ Errore nel build${NC}"
    exit 1
fi

# ============================================================================
# SUMMARY
# ============================================================================
echo ""
echo "=================================================="
echo -e "${GREEN}✅ SETUP COMPLETATO CON SUCCESSO!${NC}"
echo "=================================================="
echo ""
echo "📊 Riepilogo:"
echo "   ✅ Dipendenze Node.js installate"
echo "   ✅ Virtual environment Python creato"
echo "   ✅ Dipendenze Python installate"
echo "   ✅ Directory create"
echo "   ✅ Ambiente configurato"
echo "   ✅ Build completato"
echo ""
echo "🚀 Prossimi step:"
echo ""
echo "   1. Modifica .env con le tue credenziali (opzionale)"
echo "      nano .env"
echo ""
echo "   2. Carica file in public/uploads/"
echo "      - Immagini: public/uploads/images/"
echo "      - PDF: public/uploads/catalogs/"
echo ""
echo "   3. Avvia il server"
echo "      ./start_server.sh"
echo ""
echo "   4. Apri il browser"
echo "      - Frontend: http://localhost:5173"
echo "      - Admin: http://localhost:5173/#admin"
echo "      - Login: admin@example.com / Admin@123!"
echo ""
echo "📚 Documentazione:"
echo "   - README.md - Documentazione principale"
echo "   - QUICKSTART.md - Guida rapida"
echo "   - GITHUB_PUBLISHING_GUIDE.md - Guida publishing"
echo ""
echo "🎉 Pronto per l'uso!"
echo ""
