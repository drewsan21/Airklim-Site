# 🚀 QUICKSTART - Guida Rapida AIRKLIM

## ⚡ In 5 Minuti

### 1. Setup (1 minuto)
```bash
./setup.sh
```

### 2. Carica File (1 minuto)
```bash
# Copia PDF
cp ~/Downloads/*.pdf public/uploads/catalogs/panasonic/2026/

# Copia immagini
cp ~/Downloads/*.jpg public/uploads/images/panasonic/
```

### 3. Esegui Pipeline (2 minuti)
```bash
./run_all.sh
```

### 4. Apri Browser (10 secondi)
```
http://localhost:5173
```

**Fatto!** 🎉

---

## 📋 Comandi Principali

### Setup Completo
```bash
./setup.sh              # Installa tutto
```

### Analisi PDF
```bash
python3 scripts/advanced_pdf_analyzer.py
```

### Analisi Immagini
```bash
python3 scripts/analyze_images.py
```

### Categorizzazione
```bash
python3 scripts/auto_categorize.py
```

### Ottimizzazione Immagini
```bash
node scripts/optimize-images.js
```

### Import Prodotti
```bash
node scripts/import-products.js
```

### Pipeline Completa
```bash
./run_all.sh            # Tutto in uno
```

### Server Locale
```bash
./start_server.sh       # Avvia server
```

### Backup
```bash
./backup.sh             # Crea backup
./restore.sh            # Ripristina backup
```

### Cleanup
```bash
./cleanup.sh            # Pulizia file
```

### Verifica Sistema
```bash
python3 scripts/system_checker.py
```

---

## 🌐 URLs

```
Frontend:      http://localhost:5173
Admin:         http://localhost:5173/#admin
Server:        http://localhost:8000
API Docs:      http://localhost:8000/docs
```

---

## 🔐 Credenziali

```
Email:    admin@example.com
Password: Admin@123!
```

---

## 📁 Dove Caricare i File

### Immagini Prodotti
```
public/uploads/images/panasonic/etherea/
public/uploads/images/panasonic/tz/
public/uploads/images/panasonic/console/
public/uploads/images/tcl/breezein/
```

### Cataloghi PDF
```
public/uploads/catalogs/panasonic/2026/
public/uploads/catalogs/tcl/2026/
```

**Nota:** I nomi dei file possono essere qualsiasi! Il sistema li analizza automaticamente.

---

## 🎯 Scenari Comuni

### Scenario 1: Primo Caricamento
```bash
./setup.sh
cp ~/Downloads/catalogo.pdf public/uploads/catalogs/panasonic/2026/
./run_all.sh
open http://localhost:5173
```

### Scenario 2: Aggiungere Nuovi Prodotti
```bash
cp ~/Downloads/nuovi.pdf public/uploads/catalogs/panasonic/2026/
python3 scripts/pipeline.py --steps analyze_pdfs auto_categorize import_products build
```

### Scenario 3: Aggiungere Immagini
```bash
cp ~/Downloads/immagini/* public/uploads/images/panasonic/
node scripts/optimize-images.js
npm run build
```

### Scenario 4: Backup
```bash
./backup.sh
```

### Scenario 5: Ripristino
```bash
./restore.sh
```

---

## 🐛 Troubleshooting

### Problema: "Tesseract non trovato"
```bash
# macOS
brew install tesseract tesseract-lang

# Ubuntu
sudo apt-get install tesseract-ocr tesseract-ocr-ita
```

### Problema: "ModuleNotFoundError"
```bash
source venv/bin/activate
pip3 install -r requirements.txt
```

### Problema: "Porta già in uso"
```bash
lsof -i :8000
kill -9 <PID>
```

### Verifica Sistema
```bash
python3 scripts/system_checker.py
```

---

## 📚 Documentazione Completa

- **README.md** - Documentazione principale
- **README_SETUP.md** - Setup dettagliato
- **UPLOAD_SYSTEM_GUIDE.md** - Guida upload
- **scripts/README.md** - Guida script
- **SISTEMA_COMPLETO_RIEPILOGO.md** - Riepilogo completo

---

## 🎉 Fatto!

Il sistema è pronto. Carica i tuoi file e inizia!

**Prossima azione:**
```bash
./setup.sh
```

---

**Hai bisogno di aiuto?**
- Email: support@airklim.it
- Telefono: +39 091 8691680
