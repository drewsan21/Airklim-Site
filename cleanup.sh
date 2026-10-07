#!/bin/bash

# AIRKLIM Cleanup Script
# Pulisce file temporanei, log vecchi e cache

echo "=================================================="
echo "🧹 AIRKLIM Cleanup Script"
echo "=================================================="
echo ""

# Colori
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funzione per confermare
confirm() {
    read -p "$1 (s/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        return 0
    fi
    return 1
}

# Cleanup log vecchi
echo "📋 Pulizia log vecchi..."
if [ -d "logs" ]; then
    log_count=$(find logs -name "*.log" -mtime +30 | wc -l)
    if [ $log_count -gt 0 ]; then
        echo -e "${YELLOW}Trovati $log_count log più vecchi di 30 giorni${NC}"
        if confirm "Eliminare log vecchi?"; then
            find logs -name "*.log" -mtime +30 -delete
            echo -e "${GREEN}✓ Log vecchi eliminati${NC}"
        fi
    else
        echo -e "${GREEN}✓ Nessun log vecchio trovato${NC}"
    fi
fi

echo ""

# Cleanup report vecchi
echo "📊 Pulizia report vecchi..."
if [ -d "logs" ]; then
    report_count=$(find logs -name "*report*.md" -mtime +30 | wc -l)
    if [ $report_count -gt 0 ]; then
        echo -e "${YELLOW}Trovati $report_count report più vecchi di 30 giorni${NC}"
        if confirm "Eliminare report vecchi?"; then
            find logs -name "*report*.md" -mtime +30 -delete
            echo -e "${GREEN}✓ Report vecchi eliminati${NC}"
        fi
    else
        echo -e "${GREEN}✓ Nessun report vecchio trovato${NC}"
    fi
fi

echo ""

# Cleanup backup vecchi
echo "💾 Pulizia backup vecchi..."
if [ -d "backups" ]; then
    backup_count=$(find backups -name "*.ts" -mtime +7 | wc -l)
    if [ $backup_count -gt 0 ]; then
        echo -e "${YELLOW}Trovati $backup_count backup più vecchi di 7 giorni${NC}"
        if confirm "Eliminare backup vecchi?"; then
            find backups -name "*.ts" -mtime +7 -delete
            echo -e "${GREEN}✓ Backup vecchi eliminati${NC}"
        fi
    else
        echo -e "${GREEN}✓ Nessun backup vecchio trovato${NC}"
    fi
fi

echo ""

# Cleanup cache npm
echo "📦 Pulizia cache npm..."
if confirm "Eliminare cache npm?"; then
    npm cache clean --force
    echo -e "${GREEN}✓ Cache npm eliminata${NC}"
fi

echo ""

# Cleanup node_modules (opzionale)
echo "📁 Pulizia node_modules..."
if [ -d "node_modules" ]; then
    node_modules_size=$(du -sh node_modules | cut -f1)
    echo -e "${YELLOW}node_modules occupa: $node_modules_size${NC}"
    if confirm "Eliminare node_modules? (dovrai reinstallare con npm install)"; then
        rm -rf node_modules
        echo -e "${GREEN}✓ node_modules eliminato${NC}"
        echo -e "${YELLOW}⚠️  Esegui 'npm install' prima di continuare${NC}"
    fi
fi

echo ""

# Cleanup Python cache
echo "🐍 Pulizia cache Python..."
if [ -d "__pycache__" ]; then
    find . -type d -name "__pycache__" -exec rm -rf {} +
    echo -e "${GREEN}✓ Cache Python eliminata${NC}"
fi

if [ -d ".pytest_cache" ]; then
    rm -rf .pytest_cache
    echo -e "${GREEN}✓ Cache pytest eliminata${NC}"
fi

echo ""

# Cleanup file temporanei
echo "🗑️  Pulizia file temporanei..."
if confirm "Eliminare file temporanei (.tmp, .temp)?"; then
    find . -name "*.tmp" -delete
    find . -name "*.temp" -delete
    echo -e "${GREEN}✓ File temporanei eliminati${NC}"
fi

echo ""

# Cleanup immagini ottimizzate (opzionale)
echo "🖼️  Pulizia immagini ottimizzate..."
if [ -d "public/uploads/images/optimized" ]; then
    opt_count=$(find public/uploads/images/optimized -type f | wc -l)
    if [ $opt_count -gt 0 ]; then
        echo -e "${YELLOW}Trovate $opt_count immagini ottimizzate${NC}"
        if confirm "Eliminare immagini ottimizzate? (verranno rigenerate)"; then
            rm -rf public/uploads/images/optimized/*
            echo -e "${GREEN}✓ Immagini ottimizzate eliminate${NC}"
        fi
    fi
fi

echo ""

# Cleanup thumbnail (opzionale)
echo "🔲 Pulizia thumbnail..."
if [ -d "public/uploads/images/thumbnails" ]; then
    thumb_count=$(find public/uploads/images/thumbnails -type f | wc -l)
    if [ $thumb_count -gt 0 ]; then
        echo -e "${YELLOW}Trovati $thumb_count thumbnail${NC}"
        if confirm "Eliminare thumbnail? (verranno rigenerate)"; then
            rm -rf public/uploads/images/thumbnails/*
            echo -e "${GREEN}✓ Thumbnail eliminati${NC}"
        fi
    fi
fi

echo ""

# Cleanup build (opzionale)
echo "🏗️  Pulizia build..."
if [ -d "dist" ]; then
    dist_size=$(du -sh dist | cut -f1)
    echo -e "${YELLOW}dist occupa: $dist_size${NC}"
    if confirm "Eliminare build? (dovrai rieseguire npm run build)"; then
        rm -rf dist
        echo -e "${GREEN}✓ Build eliminata${NC}"
    fi
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Cleanup completato!${NC}"
echo "=================================================="
echo ""

# Mostra spazio recuperato
echo "📊 Spazio disco:"
df -h . | tail -1 | awk '{print "  Utilizzato: " $3 " / " $2 " (" $5 " usato)"}'
echo ""
