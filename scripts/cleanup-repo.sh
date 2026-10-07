#!/bin/bash

# ============================================================================
# AIRKLIM - Script per pulire il repository Git
# ============================================================================
# Questo script rimuove dal repository i file che non dovrebbero essere committati
# ma che potrebbero essere stati aggiunti accidentalmente.
#
# UTILIZZO:
#   chmod +x scripts/cleanup-repo.sh
#   ./scripts/cleanup-repo.sh
# ============================================================================

echo "🧹 AIRKLIM Repository Cleanup"
echo "================================"
echo ""

# Colori
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica se siamo in un repository Git
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Errore: Questo non è un repository Git${NC}"
    echo "Esegui questo script dalla root del progetto."
    exit 1
fi

echo "📋 File da rimuovere dal repository:"
echo ""

# Lista dei file/directory da rimuovere
FILES_TO_REMOVE=(
    # Uploads - File caricati dall'utente
    "public/uploads/images/optimized/"
    "public/uploads/images/thumbnails/"
    "public/uploads/images/extracted/"
    "public/uploads/images/uploaded/"
    "public/uploads/catalogs/*.pdf"
    "public/uploads/catalogs/uploaded/"
    
    # Dati estratti
    "data/extracted-products.json"
    "data/extractedProducts2026.ts"
    "data/categorized_products.json"
    "data/categorizedProducts2026.ts"
    "data/extracted/"
    
    # Log e report
    "logs/"
    "*.log"
    
    # Backup
    "backups/"
    
    # Node modules
    "node_modules/"
    
    # Build
    "dist/"
    "build/"
    ".next/"
    
    # Python
    "venv/"
    "__pycache__/"
    "*.pyc"
    "*.pyo"
    
    # Environment
    ".env.local"
    ".env.*.local"
    
    # IDE
    ".vscode/"
    ".idea/"
    
    # OS
    ".DS_Store"
    "Thumbs.db"
    
    # Testing
    "coverage/"
    ".nyc_output/"
    
    # Temporary
    "*.tmp"
    "*.temp"
)

# Conta file da rimuovere
TOTAL_FILES=0
for pattern in "${FILES_TO_REMOVE[@]}"; do
    COUNT=$(git ls-files --cached "$pattern" 2>/dev/null | wc -l)
    if [ $COUNT -gt 0 ]; then
        echo -e "${YELLOW}  📁 $pattern ($COUNT file)${NC}"
        TOTAL_FILES=$((TOTAL_FILES + COUNT))
    fi
done

echo ""

if [ $TOTAL_FILES -eq 0 ]; then
    echo -e "${GREEN}✅ Nessun file da rimuovere! Il repository è pulito.${NC}"
    exit 0
fi

echo -e "${YELLOW}Totale file da rimuovere: $TOTAL_FILES${NC}"
echo ""

# Chiedi conferma
read -p "Vuoi procedere con la rimozione? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Operazione annullata."
    exit 0
fi

echo ""
echo "🗑️  Rimozione file dal repository..."
echo ""

# Rimuovi i file dal repository (ma non dal filesystem)
for pattern in "${FILES_TO_REMOVE[@]}"; do
    git ls-files --cached "$pattern" 2>/dev/null | while read -r file; do
        echo -e "${GREEN}  ✓ Rimuovo: $file${NC}"
        git rm --cached "$file" 2>/dev/null
    done
done

echo ""
echo "✅ File rimossi dal repository!"
echo ""
echo "📝 Prossimi passi:"
echo "  1. Verifica le modifiche: git status"
echo "  2. Committa le modifiche: git commit -m 'chore: remove files from repository'"
echo "  3. Push su GitHub: git push"
echo ""
echo -e "${YELLOW}⚠️  I file sono stati rimossi dal repository ma non dal filesystem.${NC}"
echo -e "${YELLOW}   I file locali rimangono intacti.${NC}"
echo ""
