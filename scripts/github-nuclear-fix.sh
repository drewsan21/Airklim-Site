#!/bin/bash

# ============================================================================
# AIRKLIM - Soluzione NUCLEARE per GitHub
# ============================================================================
# Questo script risolve TUTTI i problemi di publishing su GitHub
# Rimuove file grandi dalla storia Git e riduce la dimensione del repository
#
# UTILIZZO:
#   chmod +x scripts/github-nuclear-fix.sh
#   ./scripts/github-nuclear-fix.sh
# ============================================================================

echo "=================================================="
echo "☢️  AIRKLIM - GitHub Nuclear Fix"
echo "=================================================="
echo ""
echo "Questo script risolverà TUTTI i problemi di publishing su GitHub"
echo ""

# Colori
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verifica Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git non installato${NC}"
    exit 1
fi

if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Questo non è un repository Git${NC}"
    exit 1
fi

# ============================================================================
# STEP 1: Backup
# ============================================================================
echo -e "${BLUE}📋 STEP 1: Backup del repository${NC}"
echo ""

BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Creazione backup in: $BACKUP_DIR"
git bundle create "$BACKUP_DIR/repository.bundle" --all

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup creato con successo${NC}"
else
    echo -e "${RED}❌ Errore nella creazione del backup${NC}"
    exit 1
fi

echo ""

# ============================================================================
# STEP 2: Rimuovi file grandi dalla storia
# ============================================================================
echo -e "${BLUE}📋 STEP 2: Rimuovi file grandi dalla storia Git${NC}"
echo ""

# Lista di pattern da rimuovere
PATTERNS=(
    "node_modules"
    "dist"
    "build"
    ".next"
    "venv"
    "__pycache__"
    "logs"
    "backups"
    "public/uploads/images/optimized"
    "public/uploads/images/thumbnails"
    "public/uploads/images/extracted"
    "public/uploads/images/uploaded"
    "public/uploads/catalogs"
    "data/extracted"
    "*.log"
    "*.zip"
    "*.tar"
    "*.gz"
    "*.pdf"
    "*.mp4"
    "*.avi"
    "*.mov"
    "*.mp3"
    "*.wav"
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
)

echo "Rimozione file dalla storia Git..."
echo ""

for pattern in "${PATTERNS[@]}"; do
    echo -n "  Rimuovo: $pattern ... "
    
    git filter-branch --force --index-filter \
        "git rm -r --cached --ignore-unmatch $pattern" \
        --prune-empty --tag-name-filter cat -- --all 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠${NC}"
    fi
done

echo ""

# ============================================================================
# STEP 3: Pulizia completa
# ============================================================================
echo -e "${BLUE}📋 STEP 3: Pulizia completa Git${NC}"
echo ""

echo "Rimozione riferimenti originali..."
rm -rf .git/refs/original/

echo "Expire reflog..."
git reflog expire --expire=now --all

echo "Garbage collection aggressivo..."
git gc --prune=now --aggressive

echo -e "${GREEN}✅ Pulizia completata${NC}"
echo ""

# ============================================================================
# STEP 4: Verifica dimensione
# ============================================================================
echo -e "${BLUE}📋 STEP 4: Verifica dimensione repository${NC}"
echo ""

REPO_SIZE=$(du -sh .git | cut -f1)
echo "Dimensione repository: $REPO_SIZE"

# Converti in MB per il controllo
SIZE_MB=$(du -sm .git | cut -f1)

if [ $SIZE_MB -lt 100 ]; then
    echo -e "${GREEN}✅ Dimensione OK (< 100MB)${NC}"
else
    echo -e "${YELLOW}⚠️  Repository ancora grande ($REPO_SIZE)${NC}"
    echo "   Considera di usare Git LFS per file grandi"
fi

echo ""

# ============================================================================
# STEP 5: Verifica file committati
# ============================================================================
echo -e "${BLUE}📋 STEP 5: Verifica file committati${NC}"
echo ""

TOTAL_FILES=$(git ls-files | wc -l)
echo "File totali nel repository: $TOTAL_FILES"

# Verifica presenza di file problematici
PROBLEM_FILES=0

if git ls-files | grep -q "node_modules"; then
    echo -e "${RED}  ❌ node_modules ancora presente!${NC}"
    PROBLEM_FILES=$((PROBLEM_FILES + 1))
fi

if git ls-files | grep -q "dist/"; then
    echo -e "${RED}  ❌ dist/ ancora presente!${NC}"
    PROBLEM_FILES=$((PROBLEM_FILES + 1))
fi

if git ls-files | grep -q "\.pdf$"; then
    echo -e "${RED}  ❌ File PDF ancora presenti!${NC}"
    PROBLEM_FILES=$((PROBLEM_FILES + 1))
fi

if [ $PROBLEM_FILES -eq 0 ]; then
    echo -e "${GREEN}✅ Nessun file problematico trovato${NC}"
else
    echo -e "${YELLOW}⚠️  Trovati $PROBLEM_FILES problemi${NC}"
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
echo "   - Dimensione repository: $REPO_SIZE"
echo "   - File committati: $TOTAL_FILES"
echo "   - Backup creato: $BACKUP_DIR/repository.bundle"
echo ""
echo "🚀 Prossimi step:"
echo ""
echo "   1. Crea un repository su GitHub:"
echo "      https://github.com/new"
echo ""
echo "   2. Aggiungi il remote:"
echo "      git remote add origin https://github.com/TUO-USERNAME/airklim.git"
echo ""
echo "   3. Forza il push (necessario dopo filter-branch):"
echo "      git push origin main --force"
echo ""
echo "   4. Verifica su GitHub:"
echo "      https://github.com/TUO-USERNAME/airklim"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Il push deve essere forzato (--force) perché abbiamo riscritto la storia"
echo "   - Se hai collaboratori, avvisali di fare re-clone del repository"
echo "   - Il backup è in: $BACKUP_DIR/repository.bundle"
echo ""
echo "🆘 Se il push fallisce ancora:"
echo "   - Verifica la dimensione del repository su GitHub"
echo "   - Contatta il supporto GitHub: https://support.github.com/"
echo "   - Considera di usare Git LFS per file grandi"
echo ""
