# 📁 Cartella Upload Cataloghi PDF

## 📋 Come Usare Questa Cartella

Questa cartella è destinata a contenere i **cataloghi PDF ufficiali** dei prodotti Panasonic, TCL e altri brand.

### Struttura Organizzata

```
catalogs/
├── panasonic/
│   ├── 2026/
│   │   ├── catalogo-residenziale-2026.pdf
│   │   ├── catalogo-commerciale-2026.pdf
│   │   └── catalogo-aquarea-2026.pdf
│   ├── 2025/
│   │   └── ...
│   └── tecnico/
│       ├── manuali-installazione/
│       └── schede-tecniche/
├── tcl/
│   ├── 2026/
│   │   └── catalogo-breezein-2026.pdf
│   └── ...
└── altri-brand/
    └── ...
```

### 📐 Specifiche PDF

**Formati supportati:**
- PDF (standard)
- PDF/A (archivio)

**Dimensioni file:**
- Massimo consigliato: 50MB per file
- PDF ottimizzati per web sono preferibili

### 🚀 Flusso di Lavoro

1. **Scarica cataloghi** dal portale PRO Partner Panasonic
2. **Posiziona** nella cartella corretta (brand/anno)
3. **Esegui script** per estrarre prodotti:
   ```bash
   npm run extract-products
   ```
4. **Verifica dati estratti** nel file generato
5. **Importa nel database** prodotti

### 📝 Script Utili

```bash
# Estrai prodotti da tutti i PDF
npm run extract-products

# Estrai da un PDF specifico
npm run extract-products -- --file=catalogs/panasonic/2026/catalogo-residenziale-2026.pdf

# Verifica PDF processati
npm run check-processed-pdfs

# Rigenera database prodotti
npm run regenerate-products-db
```

### 🔍 Cosa Viene Estratto

Lo script di estrazione identifica automaticamente:

- ✅ **Codici modello** (es: CS-XZ20CKEW-H)
- ✅ **Nomi prodotti** (es: Etherea XZ20)
- ✅ **Potenza** (kW e BTU)
- ✅ **Specifiche tecniche** (SEER, SCOP, dimensioni, peso)
- ✅ **Caratteristiche** (nanoe™ X, Wi-Fi, ecc.)
- ✅ **Prezzi** (se presenti nel PDF)
- ✅ **Immagini** (se embedded nel PDF)
- ✅ **Compatibilità** (unità interne/esterne)

### 📊 Output Generato

Lo script genera:

1. **File JSON** con tutti i prodotti estratti:
   ```
   data/extracted-products.json
   ```

2. **File TypeScript** pronto per l'import:
   ```
   src/data/extractedProducts2026.ts
   ```

3. **Report di estrazione**:
   ```
   reports/extraction-report-2026-01-16.md
   ```

4. **Immagini estratte** (se presenti nel PDF):
   ```
   public/uploads/images/extracted/
   ```

### ⚠️ Note Importanti

- I PDF devono essere **ufficiali** e non modificati
- Alcuni PDF potrebbero richiedere **OCR** (testo non selezionabile)
- L'estrazione automatica potrebbe richiedere **verifica manuale**
- Per PDF complessi, considera l'estrazione **manuale** o semi-automatica

### 🔧 Troubleshooting

**Problema:** PDF non leggibile
- **Soluzione:** Verifica che il PDF non sia protetto da password
- **Soluzione:** Usa PDF con testo selezionabile (non scansionato)

**Problema:** Dati estratti incompleti
- **Soluzione:** Verifica il formato del PDF
- **Soluzione:** Usa lo script con opzione `--verbose` per debug

**Problema:** Immagini non estratte
- **Soluzione:** Alcune immagini potrebbero essere vettoriali
- **Soluzione:** Estrai manualmente con Adobe Acrobat o simile

### 📞 Supporto

Per problemi con l'estrazione PDF:
- Verifica la documentazione dello script: `scripts/extract-products.js`
- Controlla i log: `logs/extraction.log`
- Apri issue su GitHub con il PDF problematico

---

**Ultimo aggiornamento:** 16 Gennaio 2026
