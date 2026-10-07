#!/bin/bash

# ============================================================================
# AIRKLIM - Script per verificare e risolvere problemi di publishing GitHub
# ============================================================================
# Questo script verifica tutti i problemi comuni che impediscono il publishing
# su GitHub e fornisce soluzioni automatiche.
#
# UTILIZZO:
#   chmod +x scripts/verify-github-ready.sh
#   ./scripts/verify-github-ready.sh
# ============================================================================

echo "🔍 AIRKLIM GitHub Readiness Checker"
echo "======================================"
echo ""

# Colori
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contatori
ISSUES=0
WARNINGS=0

# ============================================================================
# 1. Verifica .gitignore
# ============================================================================
echo -e "${BLUE}📋 Verifica .gitignore...${NC}"

if [ ! -f ".gitignore" ]; then
    echo -e "${RED}  ❌ .gitignore non trovato!${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}  ✅ .gitignore presente${NC}"
    
    # Verifica regole importanti
    RULES_OK=true
    
    if ! grep -q "node_modules/" .gitignore; then
        echo -e "${RED}  ❌ node_modules/ non in .gitignore${NC}"
        RULES_OK=false
        ISSUES=$((ISSUES + 1))
    fi
    
    if ! grep -q "dist/" .gitignore; then
        echo -e "${RED}  ❌ dist/ non in .gitignore${NC}"
        RULES_OK=false
        ISSUES=$((ISSUES + 1))
    fi
    
    if ! grep -q "public/uploads/catalogs/.*\.pdf" .gitignore; then
        echo -e "${YELLOW}  ⚠️  PDF catalogs non in .gitignore${NC}"
        RULES_OK=false
        WARNINGS=$((WARNINGS + 1))
    fi
    
    if [ "$RULES_OK" = true ]; then
        echo -e "${GREEN}  ✅ Regole .gitignore corrette${NC}"
    fi
fi

echo ""

# ============================================================================
# 2. Verifica .gitattributes
# ============================================================================
echo -e "${BLUE}📋 Verifica .gitattributes...${NC}"

if [ ! -f ".gitattributes" ]; then
    echo -e "${YELLOW}  ⚠️  .gitattributes non trovato (opzionale ma raccomandato)${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}  ✅ .gitattributes presente${NC}"
fi

echo ""

# ============================================================================
# 3. Verifica file committati non necessari
# ============================================================================
echo -e "${BLUE}📋 Verifica file committati non necessari...${NC}"

# Verifica node_modules
if git ls-files | grep -q "^node_modules/"; then
    echo -e "${RED}  ❌ node_modules/ committato nel repository!${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}  ✅ node_modules/ non committato${NC}"
fi

# Verifica dist
if git ls-files | grep -q "^dist/"; then
    echo -e "${RED}  ❌ dist/ committato nel repository!${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}  ✅ dist/ non committato${NC}"
fi

# Verifica logs
if git ls-files | grep -q "^logs/"; then
    echo -e "${RED}  ❌ logs/ committato nel repository!${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}  ✅ logs/ non committato${NC}"
fi

# Verifica backups
if git ls-files | grep -q "^backups/"; then
    echo -e "${RED}  ❌ backups/ committato nel repository!${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}  ✅ backups/ non committato${NC}"
fi

# Verifica PDF
if git ls-files | grep -q "\.pdf$"; then
    echo -e "${RED}  ❌ File PDF committati nel repository!${NC}"
    git ls-files | grep "\.pdf$" | head -5
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}  ✅ Nessun file PDF committato${NC}"
fi

# Verifica venv
if git ls-files | grep -q "^venv/"; then
    echo -e "${RED}  ❌ venv/ committato nel repository!${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}  ✅ venv/ non committato${NC}"
fi

echo ""

# ============================================================================
# 4. Verifica dimensione file
# ============================================================================
echo -e "${BLUE}📋 Verifica dimensione file...${NC}"

# Verifica file > 50MB
LARGE_FILES=$(find . -type f -size +50M -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./venv/*" 2>/dev/null | wc -l)

if [ $LARGE_FILES -gt 0 ]; then
    echo -e "${RED}  ❌ Trovati $LARGE_FILES file > 50MB!${NC}"
    find . -type f -size +50M -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./venv/*" 2>/dev/null | head -5
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}  ✅ Nessun file > 50MB${NC}"
fi

# Verifica dimensione repository
REPO_SIZE=$(du -sh .git 2>/dev/null | cut -f1)
echo -e "${BLUE}  ℹ️  Dimensione .git: $REPO_SIZE${NC}"

echo ""

# ============================================================================
# 5. Verifica file committati totali
# ============================================================================
echo -e "${BLUE}📋 Verifica file committati...${NC}"

TOTAL_FILES=$(git ls-files | wc -l)
echo -e "${BLUE}  ℹ️  File committati: $TOTAL_FILES${NC}"

if [ $TOTAL_FILES -gt 1000 ]; then
    echo -e "${YELLOW}  ⚠️  Molti file committati (>1000)${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}  ✅ Numero file ragionevole${NC}"
fi

echo ""

# ============================================================================
# 6. Verifica README e documentazione
# ============================================================================
echo -e "${BLUE}📋 Verifica documentazione...${NC}"

if [ -f "README.md" ]; then
    echo -e "${GREEN}  ✅ README.md presente${NC}"
else
    echo -e "${RED}  ❌ README.md non trovato!${NC}"
    ISSUES=$((ISSUES + 1))
fi

if [ -f "CONTRIBUTING.md" ]; then
    echo -e "${GREEN}  ✅ CONTRIBUTING.md presente${NC}"
else
    echo -e "${YELLOW}  ⚠️  CONTRIBUTING.md non trovato (opzionale)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================================================
# 7. Verifica conflitti e stato Git
# ============================================================================
echo -e "${BLUE}📋 Verifica stato Git...${NC}"

# Verifica conflitti di merge
if git ls-files -u | grep -q .; then
    echo -e "${RED}  ❌ Conflitti di merge non risolti!${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}  ✅ Nessun conflitto di merge${NC}"
fi

# Verifica modifiche non committate
CHANGES=$(git status --porcelain | wc -l)
if [ $CHANGES -gt 0 ]; then
    echo -e "${YELLOW}  ⚠️  $CHANGES modifiche non committate${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}  ✅ Working directory pulito${NC}"
fi

echo ""

# ============================================================================
# 8. Summary
# ============================================================================
echo "======================================"
echo -e "${BLUE}📊 Summary${NC}"
echo "======================================"
echo ""

if [ $ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Repository pronto per GitHub!${NC}"
    echo ""
    echo "Prossimi passi:"
    echo "  1. git push origin main"
    echo ""
    exit 0
elif [ $ISSUES -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Repository pronto con $WARNINGS avvertimenti${NC}"
    echo ""
    echo "Puoi procedere con il push, ma ti consiglio di risolvere gli avvertimenti."
    echo ""
    exit 0
else
    echo -e "${RED}❌ Repository NON pronto per GitHub!${NC}"
    echo ""
    echo -e "${RED}Problemi critici: $ISSUES${NC}"
    echo -e "${YELLOW}Avvertimenti: $WARNINGS${NC}"
    echo ""
    echo "Risolvi i problemi prima di pubblicare su GitHub."
    echo ""
    echo "Soluzione rapida:"
    echo "  1. Esegui: ./scripts/cleanup-repo.sh"
    echo "  2. Esegui: git add .gitignore .gitattributes"
    echo "  3. Esegui: git commit -m 'chore: fix git configuration'"
    echo "  4. Esegui: git push origin main"
    echo ""
    echo "Per aiuto completo, consulta: GITHUB_PUBLISHING_GUIDE.md"
    echo ""
    exit 1
fi
