# 📁 Sistema Upload e Gestione Media - AIRKLIM

## 🎯 Panoramica

Questo sistema ti permette di:
1. **Caricare immagini prodotti** ufficiali Panasonic/TCL
2. **Caricare cataloghi PDF** per estrazione automatica prodotti
3. **Ottimizzare automaticamente** le immagini per il web
4. **Estrarre automaticamente** i dati dai PDF
5. **Importare i prodotti** nel database del sito

---

## 🚀 Guida Rapida (5 Minuti)

### Passo 1: Ottieni le Risorse Ufficiali

**Da Panasonic PRO Partner Portal:**
```
URL: https://panasonic-pro-partner.eu
Cosa scaricare:
- Immagini prodotti (alta risoluzione)
- Cataloghi PDF 2026
- Listino prezzi ufficiale
```

**Se non hai accesso:**
```
Email: marketing@eu.panasonic.com
Telefono: +39 02 575971
Richiedi: Accesso PRO Partner + risorse marketing
```

### Passo 2: Carica i File nel Sito

**Opzione A: Interfaccia Web (Consigliata)**
1. Vai su: `https://airklim.it/#admin`
2. Login: `admin@example.com` / `Admin@123!`
3. Clicca su **"📁 Media"** nella sidebar
4. Trascina le immagini o PDF nell'area di upload
5. Clicca su "Ottimizza" o "Estrai Prodotti"

**Opzione B: Cartelle Locali**
```bash
# Copia immagini
cp ~/Downloads/panasonic-images/* public/uploads/images/panasonic/

# Copia PDF
cp ~/Downloads/cataloghi-pdf/* public/uploads/catalogs/panasonic/2026/
```

### Passo 3: Esegui gli Script

```bash
# 1. Estrai prodotti dai PDF
node scripts/extract-products.js

# 2. Ottimizza immagini
node scripts/optimize-images.js

# 3. Verifica immagini mancanti
node scripts/check-missing-images.js

# 4. Importa prodotti nel database
node scripts/import-products.js

# 5. Build del sito
npm run build
```

### Passo 4: Verifica e Pubblica

1. Controlla i prodotti estratti in `data/extracted-products.json`
2. Verifica le immagini in `public/uploads/images/optimized/`
3. Aggiungi prezzi ufficiali (se non presenti)
4. Deploy del sito

---

## 📂 Struttura Cartelle

```
public/uploads/
├── images/
│   ├── README.md                    # Guida immagini
│   ├── panasonic/
│   │   ├── etherea/
│   │   │   ├── xz-grafite/         # Immagini Etherea XZ Grigio
│   │   │   │   ├── cs-xz20ckew-h-front.jpg
│   │   │   │   ├── cs-xz20ckew-h-side.jpg
│   │   │   │   └── cs-xz20ckew-h-detail.jpg
│   │   │   └── z-bianco/           # Immagini Etherea Z Bianco
│   │   ├── tz/                     # Immagini TZ Super-Compatta
│   │   ├── console/                # Immagini Console
│   │   ├── canalizzata/            # Immagini Canalizzate
│   │   ├── professionale/          # Immagini Professionale
│   │   ├── multi-split/            # Immagini Multi-Split
│   │   └── unita-esterne/          # Immagini Unità Esterne
│   ├── tcl/
│   │   └── breezein/               # Immagini TCL BreezeIN
│   ├── accessori/
│   │   ├── telecomandi/
│   │   ├── gateway/
│   │   └── filtri/
│   ├── optimized/                  # ⚡ Generate automaticamente
│   ├── thumbnails/                 # ⚡ Generate automaticamente
│   └── extracted/                  # ⚡ Estratte dai PDF
│
└── catalogs/
    ├── README.md                    # Guida PDF
    ├── panasonic/
    │   ├── 2026/
    │   │   ├── catalogo-residenziale-2026.pdf
    │   │   ├── catalogo-commerciale-2026.pdf
    │   │   └── catalogo-aquarea-2026.pdf
    │   └── tecnico/
    │       ├── manuali-installazione/
    │       └── schede-tecniche/
    └── tcl/
        └── 2026/
            └── catalogo-breezein-2026.pdf

data/
├── extracted-products.json         # ⚡ Generato da extract-products.js
└── extractedProducts2026.ts        # ⚡ Generato da extract-products.js

scripts/
├── README.md                        # Guida script
├── extract-products.js             # 🔍 Estrae prodotti dai PDF
├── optimize-images.js              # ⚡ Ottimizza immagini
├── check-missing-images.js         # 🔍 Verifica immagini mancanti
└── import-products.js              # 📥 Importa prodotti nel DB

logs/
├── extraction.log                   # Log estrazione PDF
├── extraction-report-*.md          # Report estrazione
├── image-optimization.log          # Log ottimizzazione
├── optimization-report-*.json      # Report ottimizzazione
├── missing-images.log              # Log immagini mancanti
├── missing-images-list.txt         # Lista immagini da scaricare
├── import-products.log             # Log import prodotti
└── import-report-*.json            # Report import
```

---

## 🛠️ Script Disponibili

### 1. `extract-products.js`
**Cosa fa:** Estrae automaticamente i prodotti dai cataloghi PDF

**Utilizzo:**
```bash
# Estrai da tutti i PDF
node scripts/extract-products.js

# Estrai da un PDF specifico
node scripts/extract-products.js --file=path/to/catalog.pdf

# Modalità verbose (mostra dettagli)
node scripts/extract-products.js --verbose
```

**Output:**
- `data/extracted-products.json` - Prodotti in formato JSON
- `data/extractedProducts2026.ts` - File TypeScript pronto per l'import
- `logs/extraction-report-*.md` - Report dettagliato

**Cosa estrae:**
- ✅ Codici modello (es: CS-XZ20CKEW-H)
- ✅ Nomi prodotti
- ✅ Specifiche tecniche (SEER, SCOP, dimensioni, peso)
- ✅ Caratteristiche (nanoe™ X, Wi-Fi, ecc.)
- ✅ Compatibilità unità interne/esterne

---

### 2. `optimize-images.js`
**Cosa fa:** Ottimizza le immagini per il web (ridimensiona, comprime, converte)

**Utilizzo:**
```bash
# Ottimizza tutte le immagini
node scripts/optimize-images.js

# Modalità verbose
node scripts/optimize-images.js --verbose
```

**Output:**
- `public/uploads/images/optimized/` - Immagini ottimizzate
- `public/uploads/images/thumbnails/` - Thumbnail automatici
- `logs/optimization-report-*.json` - Report ottimizzazione

**Versioni generate:**
- Large: 1200x1200px (per galleria)
- Medium: 800x800px (per schede prodotto)
- Small: 400x400px (per liste)
- Thumbnail: 200x200px (per anteprime)
- WebP: Versione compressa (migliore performance)

---

### 3. `check-missing-images.js`
**Cosa fa:** Verifica quali prodotti non hanno immagini

**Utilizzo:**
```bash
node scripts/check-missing-images.js
```

**Output:**
- `logs/missing-images.log` - Log con lista immagini mancanti
- `logs/missing-images-list.txt` - Lista semplice per download
- `logs/images-report-*.json` - Report dettagliato

**Utilizzo:**
1. Esegui lo script
2. Apri `logs/missing-images-list.txt`
3. Scarica le immagini mancanti dal portale Panasonic
4. Caricale nella cartella corretta
5. Riesegui `optimize-images.js`

---

### 4. `import-products.js`
**Cosa fa:** Importa i prodotti estratti nel database principale

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
- `logs/import-report-*.json` - Report import

**Cosa fa:**
- ✅ Crea backup automatico del file esistente
- ✅ Merge o replace dei prodotti
- ✅ Genera file TypeScript con tipi corretti
- ✅ Mantiene prezzi e stock esistenti (in modalità merge)

---

## 📋 Flusso di Lavoro Completo

### Scenario 1: Primo Caricamento Catalogo

```bash
# 1. Carica PDF nella cartella catalogs
cp ~/Downloads/catalogo-panasonic-2026.pdf public/uploads/catalogs/panasonic/2026/

# 2. Estrai prodotti
node scripts/extract-products.js

# 3. Verifica dati estratti
cat data/extracted-products.json | less

# 4. Carica immagini
cp ~/Downloads/immagini-panasonic/* public/uploads/images/panasonic/

# 5. Ottimizza immagini
node scripts/optimize-images.js

# 6. Verifica immagini mancanti
node scripts/check-missing-images.js

# 7. Se ci sono immagini mancanti, scaricale e ripeti dal passo 4

# 8. Importa prodotti
node scripts/import-products.js

# 9. Build del sito
npm run build
```

### Scenario 2: Aggiornamento Prezzi

```bash
# 1. Modifica manualmente data/extracted-products.json
# Aggiungi prezzi ufficiali e stock reale

# 2. Reimporta prodotti
node scripts/import-products.js --replace

# 3. Build del sito
npm run build
```

### Scenario 3: Aggiunta Nuovi Prodotti

```bash
# 1. Carica nuovo PDF
cp ~/Downloads/nuovo-catalogo.pdf public/uploads/catalogs/panasonic/2026/

# 2. Estrai prodotti (merge con esistenti)
node scripts/extract-products.js

# 3. Importa prodotti (merge, non replace)
node scripts/import-products.js

# 4. Build del sito
npm run build
```

---

## 🎨 Interfaccia Web (Dashboard Admin)

### Accesso
```
URL: https://airklim.it/#admin
Login: admin@example.com / Admin@123!
```

### Sezione Media

**Tab "Immagini Prodotti":**
1. Trascina immagini nell'area di upload
2. Clicca "⚡ Ottimizza Immagini"
3. Clicca "🔍 Verifica Mancanti"

**Tab "Cataloghi PDF":**
1. Trascina PDF nell'area di upload
2. Clicca "🔍 Estrai Prodotti dai PDF"
3. Verifica il report di estrazione
4. Importa i prodotti

**Vantaggi interfaccia web:**
- ✅ Upload drag & drop
- ✅ Progress bar in tempo reale
- ✅ Anteprima file caricati
- ✅ Feedback visivo
- ✅ Non richiede terminale

---

## ⚠️ Note Importanti

### Diritti d'Autore
- ✅ Usa solo immagini **ufficiali** Panasonic/TCL
- ❌ NON usare immagini da Google o altri siti
- ✅ Ottieni **autorizzazione scritta** per uso commerciale
- ✅ Rispetta le **linee guida brand**

### Qualità PDF
- ✅ PDF con **testo selezionabile** (non scansionati)
- ❌ PDF scansionati richiedono OCR preliminare
- ✅ PDF ottimizzati per web (< 50MB)

### Verifica Dati
- ⚠️ I dati estratti automaticamente richiedono **verifica manuale**
- ⚠️ Controlla prezzi, stock e specifiche
- ⚠️ Verifica che le immagini corrispondano ai prodotti

### Backup
- ✅ Gli script creano **backup automatici**
- ✅ Controlla la cartella `backups/` prima di sovrascrivere
- ✅ Usa `git` per versionare i cambiamenti

---

## 🔧 Risoluzione Problemi

### Problema: "pdf-parse not found"
```bash
npm install pdf-parse
```

### Problema: "sharp not found"
```bash
npm install sharp
```

### Problema: "Nessun PDF trovato"
- Verifica che i PDF siano in `public/uploads/catalogs/`
- Controlla che l'estensione sia `.pdf` (minuscolo)

### Problema: "Estrazione incompleta"
- Usa `--verbose` per vedere i dettagli
- Verifica che il PDF abbia testo selezionabile
- Controlla il log in `logs/extraction.log`

### Problema: "Immagini non ottimizzate"
- Verifica che le immagini siano in `public/uploads/images/`
- Controlla i formati supportati (jpg, png, webp)
- Verifica i permessi di scrittura

---

## 📊 Statistiche e Report

Tutti gli script generano report dettagliati nella cartella `logs/`:

- **Estrazione PDF:** `logs/extraction-report-YYYY-MM-DD.md`
- **Ottimizzazione immagini:** `logs/optimization-report-YYYY-MM-DD.json`
- **Immagini mancanti:** `logs/images-report-YYYY-MM-DD.json`
- **Import prodotti:** `logs/import-report-YYYY-MM-DD.json`

Consulta questi report per:
- Verificare cosa è stato processato
- Identificare errori o problemi
- Tenere traccia delle modifiche

---

## 🚀 Prossimi Step

### Immediato (Oggi)
1. ✅ Contattare Panasonic per immagini ufficiali
2. ✅ Registrarsi come PRO Partner
3. ✅ Scaricare cataloghi PDF 2026
4. ✅ Scaricare immagini prodotti

### Questa Settimana
5. ✅ Caricare PDF e immagini
6. ✅ Eseguire script di estrazione
7. ✅ Verificare dati estratti
8. ✅ Ottimizzare immagini

### Prossima Settimana
9. ✅ Completare catalogo prodotti
10. ✅ Aggiungere prezzi ufficiali
11. ✅ Test completo sito
12. ✅ Lancio produzione

---

## 📞 Supporto

### Documentazione
- `public/uploads/images/README.md` - Guida immagini
- `public/uploads/catalogs/README.md` - Guida PDF
- `scripts/README.md` - Guida script
- `PIANO_IMPLEMENTAZIONE_COMPLETO.md` - Piano completo

### Contatti Panasonic
- Email: marketing@eu.panasonic.com
- Telefono: +39 02 575971
- PRO Partner: https://panasonic-pro-partner.eu

### Contatti AIRKLIM
- Email: info@airklim.it
- Telefono: +39 091 8691680

---

## ✅ Checklist Finale

### Prima di Iniziare
- [ ] Contattato Panasonic per immagini ufficiali
- [ ] Registrato come PRO Partner
- [ ] Scaricato cataloghi PDF 2026
- [ ] Scaricato immagini prodotti
- [ ] Installato dipendenze (`npm install`)

### Durante il Processo
- [ ] Caricato PDF in `public/uploads/catalogs/`
- [ ] Caricato immagini in `public/uploads/images/`
- [ ] Eseguito `extract-products.js`
- [ ] Verificato dati estratti
- [ ] Eseguito `optimize-images.js`
- [ ] Eseguito `check-missing-images.js`
- [ ] Scaricato immagini mancanti
- [ ] Eseguito `import-products.js`

### Prima del Lancio
- [ ] Verificato tutti i prodotti
- [ ] Aggiunto prezzi ufficiali
- [ ] Aggiunto stock reale
- [ ] Testato flusso acquisto
- [ ] Build del sito (`npm run build`)
- [ ] Deploy in produzione

---

**Sistema pronto per l'uso!** 🚀

**Ultimo aggiornamento:** 16 Gennaio 2026
