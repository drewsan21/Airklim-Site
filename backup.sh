#!/bin/bash

# AIRKLIM Backup Script
# Crea backup completo del progetto

echo "=================================================="
echo "💾 AIRKLIM Backup Script"
echo "=================================================="
echo ""

# Colori
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups/backup_${TIMESTAMP}"

# Crea directory backup
mkdir -p "$BACKUP_DIR"

echo "📦 Creazione backup in: $BACKUP_DIR"
echo ""

# Backup database
echo "📊 Backup database..."
if [ -d "data" ]; then
    tar -czf "$BACKUP_DIR/data.tar.gz" data/
    echo -e "${GREEN}✓ Database backup creato${NC}"
else
    echo -e "${YELLOW}⚠️  Directory data non trovata${NC}"
fi

echo ""

# Backup uploads
echo "📁 Backup uploads..."
if [ -d "public/uploads" ]; then
    tar -czf "$BACKUP_DIR/uploads.tar.gz" public/uploads/
    echo -e "${GREEN}✓ Uploads backup creato${NC}"
else
    echo -e "${YELLOW}⚠️  Directory uploads non trovata${NC}"
fi

echo ""

# Backup scripts
echo "🛠️  Backup scripts..."
if [ -d "scripts" ]; then
    tar -czf "$BACKUP_DIR/scripts.tar.gz" scripts/
    echo -e "${GREEN}✓ Scripts backup creato${NC}"
else
    echo -e "${YELLOW}⚠️  Directory scripts non trovata${NC}"
fi

echo ""

# Backup configurazione
echo "⚙️  Backup configurazione..."
if [ -f ".env" ]; then
    cp .env "$BACKUP_DIR/"
    echo -e "${GREEN}✓ File .env backup creato${NC}"
else
    echo -e "${YELLOW}⚠️  File .env non trovato${NC}"
fi

if [ -f "package.json" ]; then
    cp package.json "$BACKUP_DIR/"
    echo -e "${GREEN}✓ package.json backup creato${NC}"
fi

if [ -f "requirements.txt" ]; then
    cp requirements.txt "$BACKUP_DIR/"
    echo -e "${GREEN}✓ requirements.txt backup creato${NC}"
fi

echo ""

# Backup logs
echo "📋 Backup logs..."
if [ -d "logs" ]; then
    tar -czf "$BACKUP_DIR/logs.tar.gz" logs/
    echo -e "${GREEN}✓ Logs backup creato${NC}"
else
    echo -e "${YELLOW}⚠️  Directory logs non trovata${NC}"
fi

echo ""

# Crea file info
echo "📝 Creazione file info..."
cat > "$BACKUP_DIR/INFO.txt" << EOF
AIRKLIM Backup
==============

Data: $(date)
Timestamp: $TIMESTAMP

Contenuto:
- data/ (database prodotti estratti)
- public/uploads/ (immagini e PDF caricati)
- scripts/ (script di analisi)
- logs/ (log e report)
- Configurazione (.env, package.json, requirements.txt)

Per ripristinare:
1. Estrai i file tar.gz
2. Copia nella directory del progetto
3. Esegui: npm install
4. Esegui: pip install -r requirements.txt

EOF

echo -e "${GREEN}✓ File info creato${NC}"

echo ""

# Calcola dimensione backup
echo "📊 Dimensione backup..."
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo -e "${GREEN}✓ Dimensione totale: $BACKUP_SIZE${NC}"

echo ""

# Cleanup vecchi backup (mantieni ultimi 5)
echo "🧹 Cleanup vecchi backup..."
BACKUP_COUNT=$(ls -1 backups/ | grep "backup_" | wc -l)
if [ $BACKUP_COUNT -gt 5 ]; then
    echo -e "${YELLOW}Trovati $BACKUP_COUNT backup, mantengo solo gli ultimi 5${NC}"
    ls -1 backups/ | grep "backup_" | head -n -5 | while read old_backup; do
        rm -rf "backups/$old_backup"
        echo -e "${GREEN}✓ Eliminato: $old_backup${NC}"
    done
else
    echo -e "${GREEN}✓ Nessun cleanup necessario${NC}"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Backup completato con successo!${NC}"
echo "=================================================="
echo ""
echo "📁 Backup salvato in: $BACKUP_DIR"
echo "📊 Dimensione: $BACKUP_SIZE"
echo ""
echo "📋 Contenuto:"
ls -lh "$BACKUP_DIR"
echo ""
