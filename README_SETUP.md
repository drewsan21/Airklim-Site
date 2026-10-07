# 🚀 AIRKLIM - Setup Locale Completo

## 📋 Panoramica

Questo progetto AIRKLIM è un sito e-commerce completo per la distribuzione di climatizzatori Panasonic e TCL in Sicilia. Include:

- ✅ Frontend React con TypeScript
- ✅ Backend Node.js/Express
- ✅ Sistema di analisi automatica PDF e immagini con OCR
- ✅ Categorizzazione automatica prodotti
- ✅ Server locale per sviluppo
- ✅ Dashboard admin completa
- ✅ Sistema upload media

---

## 🎯 Quick Start (5 Minuti)

### 1. Installazione Automatica

```bash
# Clona il repository
git clone <repository-url>
cd airklim

# Esegui setup automatico
chmod +x setup.sh
./setup.sh
```

Questo script:
- ✅ Verifica le dipendenze di sistema
- ✅ Installa dipendenze Node.js
- ✅ Crea virtual environment Python
- ✅ Installa dipendenze Python
- ✅ Crea directory necessarie
- ✅ Configura file .env
- ✅ Esegue build iniziale

### 2. Carica i Tuoi File

```bash
# Copia immagini prodotti
cp ~/Downloads/immagini-panasonic/* public/uploads/images/panasonic/

# Copia cataloghi PDF
cp ~/Downloads/catalogo-panasonic-2026.pdf public/uploads/catalogs/panasonic/2026/
```

**Nota:** I nomi dei file possono essere qualsiasi, il sistema li analizzerà automaticamente!

### 3. Esegui la Pipeline Completa

```bash
# Esegui tutto in un comando
chmod +x run_all.sh
./run_all.sh
```

Questo script:
- ✅ Analizza tutti i PDF con OCR
- ✅ Analizza tutte le immagini con OCR
- ✅ Categorizza automaticamente i prodotti
- ✅ Ottimizza le immagini
- ✅ Verifica immagini mancanti
- ✅ Importa prodotti nel database
- ✅ Build del sito
- ✅ Avvia server locale
- ✅ Avvia frontend

### 4. Apri il Browser

```
🌐 Frontend: http://localhost:5173
🔐 Admin: http://localhost:5173/#admin
📊 Server: http://localhost:8000
📚 API Docs: http://localhost:8000/docs
```

**Credenziali Admin:**
- Email: `admin@example.com`
- Password: `Admin@123!`

---

## 📦 Requisiti di Sistema

### Obbligatori
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://www.python.org/))
- **npm** 9+ (incluso con Node.js)

### Per OCR (Opzionale ma raccomandato)
- **Tesseract OCR** 4.x+
  - macOS: `brew install tesseract tesseract-lang`
  - Ubuntu: `sudo apt-get install tesseract-ocr tesseract-ocr-ita tesseract-ocr-eng`
  - Windows: [Download](https://github.com/UB-Mannheim/tesseract/wiki)

- **Poppler** (per convertire PDF in immagini)
  - macOS: `brew install poppler`
  - Ubuntu: `sudo apt-get install poppler-utils`
  - Windows: [Download](https://github.com/oschwartz10612/poppler-windows/releases)

---

## 🛠️ Setup Manuale (Alternativo)

Se preferisci configurare manualmente:

### 1. Installa Dipendenze Node.js

```bash
npm install
```

### 2. Crea Virtual Environment Python

```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows
```

### 3. Installa Dipendenze Python

```bash
pip3 install --upgrade pip
pip3 install -r requirements.txt
```

### 4. Configura Environment

```bash
cp .env.example .env
# Modifica .env con le tue credenziali
```

### 5. Crea Directory

```bash
mkdir -p public/uploads/images/{panasonic,tcl,accessori,optimized,thumbnails,extracted,uploaded}
mkdir -p public/uploads/catalogs/{panasonic/2026,tcl/2026,uploaded}
mkdir -p data/extracted/images
mkdir -p logs
mkdir -p backups
```

### 6. Build

```bash
npm run build
```

---

## 📊 Pipeline di Analisi

### Script Disponibili

#### 1. Analisi PDF con OCR
```bash
python3 scripts/analyze_pdfs.py
```
**Cosa fa:**
- Estrae testo e immagini da tutti i PDF
- Esegue OCR sulle immagini
- Identifica codici modello (CS-XZ20CKEW-H, ecc.)
- Estrae specifiche tecniche (SEER, SCOP, dimensioni)
- Identifica caratteristiche (nanoe™ X, Wi-Fi, ecc.)
- Genera report dettagliato

**Output:**
- `data/extracted/pdf_analysis_complete.json`
- `data/extracted/pdf_analysis_summary.json`
- `data/extracted/pdf_analysis_report.md`
- `public/uploads/images/extracted/` (immagini estratte)

#### 2. Analisi Immagini con OCR
```bash
python3 scripts/analyze_images.py
```
**Cosa fa:**
- Analizza tutte le immagini caricate
- Esegue OCR per estrarre testo
- Identifica codici modello nelle immagini
- Estrae specifiche tecniche

**Output:**
- `data/extracted/images/image_analysis.json`

#### 3. Categorizzazione Automatica
```bash
python3 scripts/auto_categorize.py
```
**Cosa fa:**
- Categorizza prodotti in base a modello, keywords e contesto
- Usa machine learning per clustering
- Genera categorie automatiche (etherea_xz_grafite, tz_super_compact, ecc.)
- Crea file TypeScript pronto per l'import

**Output:**
- `data/extracted/categorized_products.json`
- `src/data/categorizedProducts2026.ts`
- `data/extracted/category_report.md`

#### 4. Ottimizzazione Immagini
```bash
node scripts/optimize-images.js
```
**Cosa fa:**
- Ridimensiona immagini (4 dimensioni)
- Converte in WebP
- Genera thumbnail
- Ottimizza per web

**Output:**
- `public/uploads/images/optimized/`
- `public/uploads/images/thumbnails/`

#### 5. Verifica Immagini Mancanti
```bash
node scripts/check-missing-images.js
```
**Cosa fa:**
- Verifica quali prodotti non hanno immagini
- Genera lista per download

**Output:**
- `logs/missing-images-list.txt`

#### 6. Import Prodotti
```bash
node scripts/import-products.js
```
**Cosa fa:**
- Importa prodotti categorizzati nel database
- Crea backup automatico
- Genera file TypeScript

**Output:**
- `src/data/completeProducts2026.ts`

#### 7. Pipeline Completa
```bash
python3 scripts/pipeline.py
```
**Cosa fa:**
- Esegue tutti gli script in sequenza
- Gestisce errori e timeout
- Genera log completo

**Opzioni:**
```bash
# Esegui solo alcuni step
python3 scripts/pipeline.py --steps analyze_pdfs auto_categorize build
```

---

## 🌐 Server Locale

### Avvio Server
```bash
python3 scripts/local_server.py
```

**URLs:**
- Main: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Uploads: http://localhost:8000/uploads
- Data: http://localhost:8000/data

**Endpoints API:**
- `GET /status` - Status server
- `GET /files/images` - Lista immagini
- `GET /files/pdfs` - Lista PDF
- `POST /upload/images` - Upload immagini
- `POST /upload/pdfs` - Upload PDF
- `GET /run/{script}` - Esegui script
- `GET /data/extracted` - Dati estratti

### Avvio Frontend
```bash
npm run dev
```

**URL:** http://localhost:5173

---

## 📁 Struttura Progetto

```
airklim/
├── public/
│   └── uploads/
│       ├── images/              # Immagini prodotti
│       │   ├── panasonic/       # Immagini Panasonic
│       │   ├── tcl/             # Immagini TCL
│       │   ├── accessori/       # Immagini accessori
│       │   ├── optimized/       # ⚡ Generate automaticamente
│       │   ├── thumbnails/      # ⚡ Generate automaticamente
│       │   ├── extracted/       # ⚡ Estratte dai PDF
│       │   └── uploaded/        # ⚡ Caricate via web
│       │
│       └── catalogs/            # Cataloghi PDF
│           ├── panasonic/       # PDF Panasonic
│           ├── tcl/             # PDF TCL
│           └── uploaded/        # ⚡ Caricati via web
│
├── data/
│   └── extracted/               # Dati estratti automaticamente
│       ├── pdf_analysis_complete.json
│       ├── categorized_products.json
│       └── category_report.md
│
├── scripts/
│   ├── analyze_pdfs.py          # 🔍 Analisi PDF con OCR
│   ├── analyze_images.py        # 🖼️ Analisi immagini con OCR
│   ├── auto_categorize.py       # 🏷️ Categorizzazione automatica
│   ├── local_server.py          # 🌐 Server locale
│   ├── pipeline.py              # 🔄 Orchestratore pipeline
│   ├── extract-products.js      # 🔍 Estrazione prodotti (legacy)
│   ├── optimize-images.js       # ⚡ Ottimizzazione immagini
│   ├── check-missing-images.js  # 🔍 Verifica mancanti
│   └── import-products.js       # 📥 Import prodotti
│
├── src/
│   ├── data/
│   │   ├── completeProducts2026.ts      # Database prodotti
│   │   └── categorizedProducts2026.ts   # ⚡ Generato automaticamente
│   │
│   ├── management/
│   │   └── sections/
│   │       └── MediaUploadManager.tsx   # Upload via web
│   │
│   └── App.tsx                          # App principale
│
├── logs/                                # Log e report
├── backups/                             # Backup automatici
├── venv/                                # Virtual environment Python
│
├── requirements.txt                     # Dipendenze Python
├── package.json                         # Dipendenze Node.js
├── setup.sh                             # Setup automatico
├── run_all.sh                           # Esegui tutto
└── README_SETUP.md                      # Questo file
```

---

## 🎯 Flusso di Lavoro Tipico

### Scenario 1: Primo Caricamento

```bash
# 1. Setup iniziale
./setup.sh

# 2. Carica file
cp ~/Downloads/catalogo-panasonic.pdf public/uploads/catalogs/panasonic/2026/
cp ~/Downloads/immagini/* public/uploads/images/panasonic/

# 3. Esegui pipeline
./run_all.sh

# 4. Apri browser
open http://localhost:5173
```

### Scenario 2: Aggiornamento Catalogo

```bash
# 1. Carica nuovo PDF
cp ~/Downloads/nuovo-catalogo.pdf public/uploads/catalogs/panasonic/2026/

# 2. Esegui solo analisi e import
python3 scripts/pipeline.py --steps analyze_pdfs auto_categorize import_products build

# 3. Verifica risultati
cat data/extracted/category_report.md
```

### Scenario 3: Aggiunta Immagini

```bash
# 1. Carica immagini
cp ~/Downloads/nuove-immagini/* public/uploads/images/panasonic/etherea/

# 2. Ottimizza
node scripts/optimize-images.js

# 3. Verifica mancanti
node scripts/check-missing-images.js

# 4. Build
npm run build
```

---

## 🔧 Troubleshooting

### Problema: "Tesseract non trovato"
**Soluzione:**
```bash
# macOS
brew install tesseract tesseract-lang

# Ubuntu
sudo apt-get install tesseract-ocr tesseract-ocr-ita tesseract-ocr-eng

# Windows
# Scarica da: https://github.com/UB-Mannheim/tesseract/wiki
```

### Problema: "pdf2image non funziona"
**Soluzione:**
```bash
# macOS
brew install poppler

# Ubuntu
sudo apt-get install poppler-utils

# Windows
# Scarica da: https://github.com/oschwartz10612/poppler-windows/releases
# Aggiungi al PATH
```

### Problema: "ModuleNotFoundError: No module named 'fitz'"
**Soluzione:**
```bash
source venv/bin/activate
pip3 install -r requirements.txt
```

### Problema: "Porta 8000 già in uso"
**Soluzione:**
```bash
# Trova processo
lsof -i :8000

# Kill processo
kill -9 <PID>
```

### Problema: "OCR non estrae testo"
**Soluzione:**
- Verifica che il PDF abbia testo selezionabile (non scansionato)
- Per PDF scansionati, usa prima un software OCR
- Migliora qualità immagini prima dell'OCR

---

## 📊 Performance

### Tempi di Esecuzione Tipici

| Operazione | Tempo |
|------------|-------|
| Analisi PDF (100 pagine) | 2-5 minuti |
| Analisi immagini (50 immagini) | 1-3 minuti |
| Categorizzazione (200 prodotti) | 30 secondi |
| Ottimizzazione immagini (50 immagini) | 1-2 minuti |
| Import prodotti | 10 secondi |
| Build sito | 3-4 secondi |
| **Pipeline completa** | **5-10 minuti** |

### Requisiti Hardware

- **RAM minima:** 4GB
- **RAM raccomandata:** 8GB+
- **Spazio disco:** 2GB+ (per immagini e PDF)
- **CPU:** Multi-core raccomandato per OCR

---

## 🌐 Deploy in Produzione

### 1. Build Produzione
```bash
npm run build
```

### 2. Deploy Frontend
```bash
# Copia dist/ sul server web
scp -r dist/* user@server:/var/www/airklim/
```

### 3. Deploy Backend
```bash
# Configura variabili d'ambiente
export NODE_ENV=production
export DATABASE_URL=postgresql://...

# Avvia server
node server/server.js
```

### 4. Configura HTTPS
```bash
# Usa Let's Encrypt
certbot --nginx -d airklim.it -d www.airklim.it
```

---

## 📚 Documentazione

### File Principali
- `README_SETUP.md` - Questo file (setup locale)
- `UPLOAD_SYSTEM_GUIDE.md` - Guida sistema upload
- `PIANO_IMPLEMENTAZIONE_COMPLETO.md` - Piano completo
- `scripts/README.md` - Guida script
- `public/uploads/images/README.md` - Guida immagini
- `public/uploads/catalogs/README.md` - Guida PDF

### Report Generati
- `data/extracted/pdf_analysis_report.md` - Report analisi PDF
- `data/extracted/category_report.md` - Report categorizzazione
- `logs/pipeline_log_*.txt` - Log pipeline

---

## 🎉 Successo!

Se vedi questo messaggio, il setup è completato! 🚀

**Prossimi step:**
1. Carica i tuoi file in `public/uploads/`
2. Esegui `./run_all.sh`
3. Apri http://localhost:5173
4. Goditi il tuo sito AIRKLIM!

---

**Ultimo aggiornamento:** 16 Gennaio 2026  
**Versione:** 1.0.0  
**Status:** ✅ Pronto per l'uso
