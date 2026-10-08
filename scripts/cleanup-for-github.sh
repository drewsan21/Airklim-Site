#!/bin/bash

# ============================================================================
# AIRKLIM - Script di Pulizia Repository per GitHub
# ============================================================================
# Questo script rimuove tutti i file non necessari dal repository Git
# e prepara il progetto per il push su GitHub
#
# UTILIZZO:
#   chmod +x scripts/cleanup-for-github.sh
#   ./scripts/cleanup-for-github.sh
# ============================================================================

echo "=================================================="
echo "🧹 AIRKLIM - Pulizia Repository per GitHub"
echo "=================================================="
echo ""

# Colori
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verifica se siamo in un repository Git
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Errore: Questo non è un repository Git${NC}"
    echo "Esegui questo script dalla root del progetto."
    exit 1
fi

echo -e "${BLUE}📊 Analisi repository in corso...${NC}"
echo ""

# Mostra dimensione attuale
REPO_SIZE=$(du -sh .git | cut -f1)
echo -e "${YELLOW}Dimensione attuale .git: $REPO_SIZE${NC}"
echo ""

# ============================================================================
# STEP 1: Rimuovi file dal repository (ma non dal filesystem)
# ============================================================================
echo -e "${BLUE}📋 STEP 1: Rimuovi file non necessari dal repository${NC}"
echo ""

# Lista di pattern da rimuovere
PATTERNS=(
    # Dipendenze
    "node_modules/"
    
    # Build output
    "dist/"
    "build/"
    ".next/"
    "out/"
    
    # Python
    "venv/"
    "__pycache__/"
    "*.pyc"
    "*.pyo"
    
    # Uploads
    "public/uploads/images/optimized/"
    "public/uploads/images/thumbnails/"
    "public/uploads/images/extracted/"
    "public/uploads/images/uploaded/"
    "public/uploads/catalogs/*.pdf"
    "public/uploads/catalogs/uploaded/"
    
    # Dati estratti
    "data/extracted/"
    "data/extracted-products.json"
    "data/extractedProducts2026.ts"
    "data/categorized_products.json"
    "data/categorizedProducts2026.ts"
    
    # Log
    "logs/"
    "*.log"
    
    # Backup
    "backups/"
    
    # Documentazione ridondante
    "FASE*_COMPLETATA.md"
    "PRIORITA_*_COMPLETATA.md"
    "PROGETTO_*.md"
    "REPORT_*.md"
    "SISTEMA_*.md"
    "STATO_*.md"
    "PIANO_*.md"
    "GUIDA_*.md"
    "MANUALE_*.md"
    "QUICK_*.md"
    "COMPLETAMENTO_*.md"
    "ISTRUZIONI_*.md"
    "GITHUB_*.md"
    "UPLOAD_*.md"
    "SOLUZIONE_*.md"
    "SCANSIONE_*.md"
    
    # Environment
    ".env.local"
    ".env.*.local"
    
    # IDE
    ".vscode/"
    ".idea/"
    
    # OS
    ".DS_Store"
    "Thumbs.db"
    
    # File grandi
    "*.zip"
    "*.tar"
    "*.gz"
    "*.rar"
    "*.7z"
    "*.mp4"
    "*.avi"
    "*.mov"
    "*.mp3"
    "*.wav"
)

TOTAL_REMOVED=0

for pattern in "${PATTERNS[@]}"; do
    # Rimuovi file committati che corrispondono al pattern
    FILES=$(git ls-files --cached "$pattern" 2>/dev/null)
    
    if [ -n "$FILES" ]; then
        COUNT=$(echo "$FILES" | wc -l)
        echo -e "${YELLOW}  🗑️  Rimuovo $COUNT file: $pattern${NC}"
        
        # Rimuovi dalla cache Git (non dal filesystem)
        git rm -r --cached $pattern 2>/dev/null || true
        
        TOTAL_REMOVED=$((TOTAL_REMOVED + COUNT))
    fi
done

echo ""
echo -e "${GREEN}✅ Totale file rimossi dal repository: $TOTAL_REMOVED${NC}"
echo ""

# ============================================================================
# STEP 2: Pulisci la cache Git
# ============================================================================
echo -e "${BLUE}📋 STEP 2: Pulisci la cache Git${NC}"
echo ""

# Rimuovi oggetti non referenziati
git gc --aggressive --prune=now

echo -e "${GREEN}✅ Cache Git pulita${NC}"
echo ""

# ============================================================================
# STEP 3: Mostra nuova dimensione
# ============================================================================
echo -e "${BLUE}📋 STEP 3: Verifica nuova dimensione${NC}"
echo ""

NEW_REPO_SIZE=$(du -sh .git | cut -f1)
echo -e "${YELLOW}Dimensione .git prima: $REPO_SIZE${NC}"
echo -e "${GREEN}Dimensione .git dopo: $NEW_REPO_SIZE${NC}"
echo ""

# ============================================================================
# STEP 4: Verifica file rimanenti
# ============================================================================
echo -e "${BLUE}📋 STEP 4: File rimanenti nel repository${NC}"
echo ""

REMAINING_FILES=$(git ls-files | wc -l)
echo -e "${YELLOW}File totali nel repository: $REMAINING_FILES${NC}"
echo ""

# Mostra i primi 20 file
echo "Primi 20 file:"
git ls-files | head -20 | while read file; do
    echo "  - $file"
done

if [ $REMAINING_FILES -gt 20 ]; then
    echo "  ... e altri $((REMAINING_FILES - 20)) file"
fi

echo ""

# ============================================================================
# STEP 5: Commit delle modifiche
# ============================================================================
echo -e "${BLUE}📋 STEP 5: Commit delle modifiche${NC}"
echo ""

# Verifica se ci sono modifiche
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  Nessuna modifica da committare${NC}"
else
    echo "Modifiche da committare:"
    git diff --cached --stat
    echo ""
    
    read -p "Vuoi committare queste modifiche? (s/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        git commit -m "chore: cleanup repository for GitHub publishing

- Removed node_modules, dist, logs, backups
- Removed uploaded files (images, PDFs)
- Removed extracted data files
- Removed redundant documentation
- Cleaned Git cache

Repository is now ready for GitHub publishing."
        
        echo ""
        echo -e "${GREEN}✅ Modifiche committate${NC}"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Commit annullato${NC}"
        echo "Puoi committare manualmente con:"
        echo "  git commit -m 'chore: cleanup repository'"
    fi
fi

echo ""

# ============================================================================
# STEP 6: Istruzioni per il push
# ============================================================================
echo "=================================================="
echo -e "${GREEN}✅ PULIZIA COMPLETATA!${NC}"
echo "=================================================="
echo ""
echo "📊 Riepilogo:"
echo "   - File rimossi: $TOTAL_REMOVED"
echo "   - Dimensione prima: $REPO_SIZE"
echo "   - Dimensione dopo: $NEW_REPO_SIZE"
echo "   - File rimanenti: $REMAINING_FILES"
echo ""
echo "🚀 Prossimi step per pubblicare su GitHub:"
echo ""
echo "   1. Crea un repository su GitHub:"
echo "      https://github.com/new"
echo ""
echo "   2. Aggiungi il remote:"
echo "      git remote add origin https://github.com/TUO-USERNAME/airklim.git"
echo ""
echo "   3. Push del codice:"
echo "      git push -u origin main"
echo ""
echo "   4. Se il push fallisce per dimensione:"
echo "      git filter-branch --force --index-filter \\"
echo "        'git rm -r --cached --ignore-unmatch node_modules dist logs backups' \\"
echo "        --prune-empty --tag-name-filter cat -- --all"
echo "      git push origin main --force"
echo ""
echo "💡 Suggerimenti:"
echo "   - Usa GitHub Desktop per un'esperienza più semplice"
echo "   - Controlla la dimensione del repository prima del push"
echo "   - Se il repository è ancora troppo grande, considera Git LFS"
echo ""
echo "📚 Documentazione:"
echo "   - README.md - Documentazione principale"
echo "   - CONTRIBUTING.md - Guida per contribuire"
echo "   - QUICKSTART.md - Guida rapida"
echo ""
