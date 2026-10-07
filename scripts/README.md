# 📁 Scripts AIRKLIM

Questa cartella contiene gli script per automatizzare l'estrazione e l'ottimizzazione dei contenuti.

## 🚀 Script Disponibili

### 1. `extract-products.js`
Estrae i prodotti dai cataloghi PDF.

**Utilizzo:**
```bash
# Estrai da tutti i PDF nella cartella catalogs
node scripts/extract-products.js

# Estrai da un PDF specifico
node scripts/extract-products.js --file=public/uploads/catalogs/panasonic/2026/catalogo-residenziale-2026.pdf

# Modalità verbose
node scripts/extract-products.js --verbose
```

**Output:**
- `data/extracted-products.json` - Prodotti estratti in formato JSON
- `data/extractedProducts2026.ts` - File TypeScript pronto per l'import
- `logs/extraction-report-YYYY-MM-DD.md` - Report di estrazione
- `logs/extraction.log` - Log dettagliato

---

### 2. `optimize-images.js`
Ottimizza le immagini per il web.

**Utilizzo:**
```bash
# Ottimizza tutte le immagini
node scripts/optimize-images.js

# Modalità verbose
node scripts/optimize-images.js --verbose
```

**Output:**
- `public/uploads/images/optimized/` - Immagini ottimizzate (multiple dimensioni)
- `public/uploads/images/thumbnails/` - Thumbnail automatici
- `logs/optimization-report-YYYY-MM-DD.json` - Report di ottimizzazione
- `logs/image-optimization.log` - Log dettagliato

**Dimensioni generate:**
- Large: 1200x1200px
- Medium: 800x800px
- Small: 400x400px
- Thumbnail: 200x200px
- WebP: Versione compressa

---

### 3. `check-missing-images.js`
Verifica le immagini mancanti per i prodotti.

**Utilizzo:**
```bash
# Verifica immagini mancanti
node scripts/check-missing-images.js
```

**Output:**
- `logs/missing-images.log` - Log con lista immagini mancanti
- `logs/missing-images-list.txt` - Lista semplice per download
- `logs/images-report-YYYY-MM-DD.json` - Report dettagliato

---

### 4. `import-products.js`
Importa i prodotti estratti nel database principale.

**Utilizzo:**
```bash
# Importa in modalità merge (aggiunge/aggiorna)
node scripts/import-products.js

# Importa in modalità replace (sostituisce tutto)
node scripts/import-products.js --replace
```

**Output:**
- `src/data/completeProducts2026.ts` - Database prodotti aggiornato
- `backups/completeProducts2026-backup-*.ts` - Backup automatico
- `logs/import-report-YYYY-MM-DD.json` - Report di import
- `logs/import-products.log` - Log dettagliato

---

## 📋 Flusso di Lavoro Completo

### Passo 1: Carica i PDF
```bash
# Copia i PDF dei cataloghi nella cartella catalogs
cp ~/Downloads/catalogo-panasonic-2026.pdf public/uploads/catalogs/panasonic/2026/
```

### Passo 2: Estrai i prodotti
```bash
node scripts/extract-products.js
```

### Passo 3: Verifica i dati estratti
```bash
# Apri il file JSON generato
cat data/extracted-products.json | less

# Oppure apri il report
cat logs/extraction-report-*.md
```

### Passo 4: Carica le immagini
```bash
# Copia le immagini nella cartella images
cp ~/Downloads/immagini-panasonic/*.jpg public/uploads/images/panasonic/etherea/
```

### Passo 5: Ottimizza le immagini
```bash
node scripts/optimize-images.js
```

### Passo 6: Verifica immagini mancanti
```bash
node scripts/check-missing-images.js

# Se ci sono immagini mancanti, scaricale e ripeti dal passo 4
```

### Passo 7: Importa i prodotti
```bash
node scripts/import-products.js
```

### Passo 8: Build del progetto
```bash
npm run build
```

---

## 🔧 Comandi Rapidi (da aggiungere a package.json)

Aggiungi questi script al `package.json`:

```json
{
  "scripts": {
    "extract-products": "node scripts/extract-products.js",
    "optimize-images": "node scripts/optimize-images.js",
    "check-missing-images": "node scripts/check-missing-images.js",
    "import-products": "node scripts/import-products.js",
    "import-products:replace": "node scripts/import-products.js --replace",
    "process-all": "npm run extract-products && npm run optimize-images && npm run import-products"
  }
}
```

Poi puoi usare:
```bash
npm run extract-products
npm run optimize-images
npm run check-missing-images
npm run import-products
npm run process-all  # Esegue tutto in sequenza
```

---

## 📊 Dipendenze Necessarie

Gli script richiedono queste dipendenze (già installate):

```json
{
  "dependencies": {
    "pdf-parse": "^2.4.5",
    "sharp": "^0.35.5",
    "pdf-lib": "^1.17.1",
    "pdf2json": "^4.1.0"
  }
}
```

Se mancano, installale con:
```bash
npm install pdf-parse sharp pdf-lib pdf2json
```

---

## ⚠️ Note Importanti

### Per l'estrazione PDF
- I PDF devono avere **testo selezionabile** (non scansionati)
- Per PDF scansionati, usa prima un software OCR (es: Adobe Acrobat)
- Alcuni dati potrebbero richiedere **verifica manuale**

### Per le immagini
- Usa solo immagini **ufficiali** o di tua proprietà
- Rispetta i **diritti d'autore**
- Ottimizza sempre le immagini prima del caricamento

### Per l'import
- Fai sempre un **backup** prima di importare
- Verifica i dati estratti prima dell'import
- Usa la modalità `--replace` con cautela

---

## 🐛 Troubleshooting

### Problema: "pdf-parse not found"
**Soluzione:**
```bash
npm install pdf-parse
```

### Problema: "sharp not found"
**Soluzione:**
```bash
npm install sharp
```

### Problema: "Nessun PDF trovato"
**Soluzione:**
- Verifica che i PDF siano in `public/uploads/catalogs/`
- Controlla che l'estensione sia `.pdf` (minuscolo)

### Problema: "Estrazione incompleta"
**Soluzione:**
- Usa `--verbose` per vedere i dettagli
- Verifica che il PDF abbia testo selezionabile
- Controlla il log in `logs/extraction.log`

### Problema: "Immagini non ottimizzate"
**Soluzione:**
- Verifica che le immagini siano in `public/uploads/images/`
- Controlla i formati supportati (jpg, png, webp)
- Verifica i permessi di scrittura

---

## 📞 Supporto

Per problemi con gli script:
1. Controlla i log in `logs/`
2. Usa l'opzione `--verbose`
3. Verifica le dipendenze installate
4. Controlla i permessi dei file

---

**Ultimo aggiornamento:** 16 Gennaio 2026
