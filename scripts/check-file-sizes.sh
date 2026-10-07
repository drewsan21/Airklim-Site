#!/bin/bash

# ============================================================================
# AIRKLIM - Script per verificare la dimensione dei file
# ============================================================================
# Questo script identifica i file grandi che potrebbero causare problemi
# con GitHub (limite 100MB per file, 1GB per repository).
#
# UTILIZZO:
#   chmod +x scripts/check-file-sizes.sh
#   ./scripts/check-file-sizes.sh
# ============================================================================

echo "📊 AIRKLIM File Size Checker"
echo "================================"
echo ""

# Colori
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Limite GitHub: 100MB per file
LIMIT_MB=100
LIMIT_BYTES=$((LIMIT_MB * 1024 * 1024))

echo "🔍 Ricerca file grandi (> ${LIMIT_MB}MB)..."
echo ""

# Trova file grandi
LARGE_FILES=$(find . -type f -size +${LIMIT_MB}M -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./venv/*" 2>/dev/null)

if [ -z "$LARGE_FILES" ]; then
    echo -e "${GREEN}✅ Nessun file grande trovato!${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  File grandi trovati:${NC}"
    echo ""
    
    TOTAL_SIZE=0
    while IFS= read -r file; do
        SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        SIZE_MB=$(echo "scale=2; $SIZE / 1024 / 1024" | bc)
        
        echo -e "${RED}  📁 $file ($SIZE_MB MB)${NC}"
        TOTAL_SIZE=$((TOTAL_SIZE + SIZE))
    done <<< "$LARGE_FILES"
    
    TOTAL_SIZE_MB=$(echo "scale=2; $TOTAL_SIZE / 1024 / 1024" | bc)
    echo ""
    echo -e "${RED}Dimensione totale: $TOTAL_SIZE_MB MB${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Questi file potrebbero causare problemi con GitHub!${NC}"
    echo -e "${YELLOW}   Limite GitHub: 100MB per file, 1GB per repository${NC}"
    echo ""
fi

# Verifica dimensione repository
echo "📦 Verifica dimensione repository..."
echo ""

REPO_SIZE=$(du -sh .git 2>/dev/null | cut -f1)
echo "Dimensione .git: $REPO_SIZE"
echo ""

# Verifica file binari committati
echo "🔍 Ricerca file binari committati..."
echo ""

BINARY_FILES=$(git ls-files | grep -E '\.(jpg|jpeg|png|gif|pdf|zip|tar|gz|mp3|mp4|avi|mov)$' 2>/dev/null)

if [ -z "$BINARY_FILES" ]; then
    echo -e "${GREEN}✅ Nessun file binario committato!${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  File binari committati:${NC}"
    echo ""
    
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            SIZE_KB=$(echo "scale=2; $SIZE / 1024" | bc)
            echo -e "${YELLOW}  📁 $file ($SIZE_KB KB)${NC}"
        fi
    done <<< "$BINARY_FILES"
    
    echo ""
    echo -e "${YELLOW}⚠️  Considera di rimuovere questi file dal repository!${NC}"
    echo ""
fi

# Summary
echo "================================"
echo "📊 Summary"
echo "================================"
echo ""

if [ -z "$LARGE_FILES" ] && [ -z "$BINARY_FILES" ]; then
    echo -e "${GREEN}✅ Repository pulito! Pronto per GitHub.${NC}"
else
    echo -e "${YELLOW}⚠️  Problemi rilevati. Esegui ./scripts/cleanup-repo.sh per pulire.${NC}"
fi

echo ""
