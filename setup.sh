#!/bin/bash

# AIRKLIM Setup Script
# Configura l'ambiente di sviluppo locale

echo "=================================================="
echo "🚀 AIRKLIM Setup Script"
echo "=================================================="
echo ""

# Colori
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funzione per verificare comandi
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}✗ $1 non trovato${NC}"
        return 1
    else
        echo -e "${GREEN}✓ $1 trovato${NC}"
        return 0
    fi
}

# Verifica dipendenze di sistema
echo "🔍 Verifica dipendenze di sistema..."
echo ""

check_command "node"
check_command "npm"
check_command "python3"
check_command "pip3"

# Verifica Tesseract OCR
if check_command "tesseract"; then
    echo -e "${GREEN}✓ Tesseract OCR installato${NC}"
else
    echo -e "${YELLOW}⚠️  Tesseract OCR non trovato${NC}"
    echo "   Installa con:"
    echo "   - macOS: brew install tesseract tesseract-lang"
    echo "   - Ubuntu: sudo apt-get install tesseract-ocr tesseract-ocr-ita tesseract-ocr-eng"
    echo "   - Windows: https://github.com/UB-Mannheim/tesseract/wiki"
fi

# Verifica poppler (per pdf2image)
if check_command "pdftoppm"; then
    echo -e "${GREEN}✓ Poppler installato${NC}"
else
    echo -e "${YELLOW}⚠️  Poppler non trovato${NC}"
    echo "   Installa con:"
    echo "   - macOS: brew install poppler"
    echo "   - Ubuntu: sudo apt-get install poppler-utils"
    echo "   - Windows: https://github.com/oschwartz10612/poppler-windows/releases"
fi

echo ""
echo "📦 Installazione dipendenze Node.js..."
echo ""

npm install

echo ""
echo "🐍 Installazione dipendenze Python..."
echo ""

# Crea virtual environment se non esiste
if [ ! -d "venv" ]; then
    echo "Creazione virtual environment..."
    python3 -m venv venv
fi

# Attiva virtual environment
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

# Installa dipendenze Python
pip3 install --upgrade pip
pip3 install -r requirements.txt

echo ""
echo "📁 Creazione directory..."
echo ""

# Crea directory necessarie
mkdir -p public/uploads/images/panasonic
mkdir -p public/uploads/images/tcl
mkdir -p public/uploads/images/accessori
mkdir -p public/uploads/images/optimized
mkdir -p public/uploads/images/thumbnails
mkdir -p public/uploads/images/extracted
mkdir -p public/uploads/images/uploaded
mkdir -p public/uploads/catalogs/panasonic/2026
mkdir -p public/uploads/catalogs/tcl/2026
mkdir -p public/uploads/catalogs/uploaded
mkdir -p data/extracted/images
mkdir -p logs
mkdir -p backups

echo -e "${GREEN}✓ Directory create${NC}"

echo ""
echo "🔧 Configurazione ambiente..."
echo ""

# Crea file .env se non esiste
if [ ! -f ".env" ]; then
    cat > .env << EOF
# AIRKLIM Environment Variables

# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/airklim

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Email
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@airklim.it

# Payments
STRIPE_SECRET_KEY=your_stripe_secret_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=eu-south-1
AWS_S3_BUCKET=airklim-backups

# Analytics
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
FACEBOOK_PIXEL_ID=XXXXXXXXXXXXXXXX
EOF
    echo -e "${GREEN}✓ File .env creato${NC}"
    echo -e "${YELLOW}⚠️  Modifica .env con le tue credenziali${NC}"
else
    echo -e "${GREEN}✓ File .env già esistente${NC}"
fi

echo ""
echo "🏗️  Build iniziale..."
echo ""

npm run build

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Setup completato con successo!${NC}"
echo "=================================================="
echo ""
echo "📋 Prossimi step:"
echo ""
echo "1. Modifica .env con le tue credenziali"
echo "2. Carica immagini e PDF in public/uploads/"
echo "3. Esegui gli script di analisi:"
echo "   python3 scripts/analyze_pdfs.py"
echo "   python3 scripts/analyze_images.py"
echo "   python3 scripts/auto_categorize.py"
echo "4. Avvia il server locale:"
echo "   python3 scripts/local_server.py"
echo "5. Avvia il frontend:"
echo "   npm run dev"
echo ""
echo "🌐 URLs:"
echo "   - Frontend: http://localhost:5173"
echo "   - Admin: http://localhost:5173/#admin"
echo "   - Local Server: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "📚 Documentazione:"
echo "   - README_UPLOAD_SYSTEM.md"
echo "   - UPLOAD_SYSTEM_GUIDE.md"
echo "   - scripts/README.md"
echo ""
