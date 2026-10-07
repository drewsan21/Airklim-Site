#!/bin/bash

# AIRKLIM Restore Script
# Ripristina backup precedente

echo "=================================================="
echo "🔄 AIRKLIM Restore Script"
echo "=================================================="
echo ""

# Colori
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verifica directory backups
if [ ! -d "backups" ]; then
    echo -e "${RED}✗ Directory backups non trovata${NC}"
    exit 1
fi

# Lista backup disponibili
echo "📋 Backup disponibili:"
echo ""

backups=($(ls -1 backups/ | grep "backup_" | sort -r))

if [ ${#backups[@]} -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Nessun backup trovato${NC}"
    exit 1
fi

for i in "${!backups[@]}"; do
    backup="${backups[$i]}"
    backup_date=$(echo $backup | sed 's/backup_//' | sed 's/_/ /')
    backup_size=$(du -sh "backups/$backup" | cut -f1)
    echo "  $((i+1)). $backup_date ($backup_size)"
done

echo ""
read -p "Seleziona backup da ripristinare (1-${#backups[@]}): " choice

# Verifica scelta
if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt ${#backups[@]} ]; then
    echo -e "${RED}✗ Scelta non valida${NC}"
    exit 1
fi

selected_backup="${backups[$((choice-1))]}"
backup_path="backups/$selected_backup"

echo ""
echo -e "${YELLOW}⚠️  Attenzione: Questo sovrascriverà i dati attuali!${NC}"
read -p "Sei sicuro di voler continuare? (s/N): " confirm

if [[ ! $confirm =~ ^[Ss]$ ]]; then
    echo "Operazione annullata"
    exit 0
fi

echo ""
echo "🔄 Ripristino backup: $selected_backup"
echo ""

# Backup attuale prima di ripristinare
echo "💾 Backup dati attuali..."
CURRENT_BACKUP="backups/pre_restore_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$CURRENT_BACKUP"

if [ -d "data" ]; then
    tar -czf "$CURRENT_BACKUP/data.tar.gz" data/
fi

if [ -d "public/uploads" ]; then
    tar -czf "$CURRENT_BACKUP/uploads.tar.gz" public/uploads/
fi

if [ -d "logs" ]; then
    tar -czf "$CURRENT_BACKUP/logs.tar.gz" logs/
fi

echo -e "${GREEN}✓ Backup attuale salvato in: $CURRENT_BACKUP${NC}"
echo ""

# Ripristina database
echo "📊 Ripristino database..."
if [ -f "$backup_path/data.tar.gz" ]; then
    rm -rf data/
    tar -xzf "$backup_path/data.tar.gz"
    echo -e "${GREEN}✓ Database ripristinato${NC}"
else
    echo -e "${YELLOW}⚠️  Nessun backup database trovato${NC}"
fi

echo ""

# Ripristina uploads
echo "📁 Ripristino uploads..."
if [ -f "$backup_path/uploads.tar.gz" ]; then
    rm -rf public/uploads/
    tar -xzf "$backup_path/uploads.tar.gz"
    echo -e "${GREEN}✓ Uploads ripristinati${NC}"
else
    echo -e "${YELLOW}⚠️  Nessun backup uploads trovato${NC}"
fi

echo ""

# Ripristina logs
echo "📋 Ripristino logs..."
if [ -f "$backup_path/logs.tar.gz" ]; then
    rm -rf logs/
    tar -xzf "$backup_path/logs.tar.gz"
    echo -e "${GREEN}✓ Logs ripristinati${NC}"
else
    echo -e "${YELLOW}⚠️  Nessun backup logs trovato${NC}"
fi

echo ""

# Ripristina configurazione
echo "⚙️  Ripristino configurazione..."
if [ -f "$backup_path/.env" ]; then
    cp "$backup_path/.env" .env
    echo -e "${GREEN}✓ File .env ripristinato${NC}"
else
    echo -e "${YELLOW}⚠️  Nessun backup .env trovato${NC}"
fi

echo ""

# Reinstalla dipendenze se necessario
echo "📦 Verifica dipendenze..."
if [ -f "$backup_path/package.json" ]; then
    if ! diff -q "$backup_path/package.json" package.json > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  package.json cambiato, reinstallazione dipendenze...${NC}"
        npm install
    fi
fi

if [ -f "$backup_path/requirements.txt" ]; then
    if ! diff -q "$backup_path/requirements.txt" requirements.txt > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  requirements.txt cambiato, reinstallazione dipendenze...${NC}"
        if [ -d "venv" ]; then
            source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
            pip3 install -r requirements.txt
        fi
    fi
fi

echo ""

# Rebuild
echo "🏗️  Rebuild..."
if confirm "Eseguire build del sito?"; then
    npm run build
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Ripristino completato con successo!${NC}"
echo "=================================================="
echo ""
echo "📁 Backup ripristinato da: $selected_backup"
echo "💾 Backup pre-restore salvato in: $CURRENT_BACKUP"
echo ""
echo "🌐 Avvia il server:"
echo "   ./start_server.sh"
echo ""

# Funzione confirm
confirm() {
    read -p "$1 (s/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        return 0
    fi
    return 1
}
