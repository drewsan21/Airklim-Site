# 📁 Cartella Upload Immagini Prodotti

## 📋 Come Usare Questa Cartella

Questa cartella è destinata a contenere le **immagini ufficiali dei prodotti** che caricherai manualmente.

### Struttura Organizzata

```
images/
├── panasonic/
│   ├── etherea/
│   │   ├── xz-grafite/
│   │   │   ├── cs-xz20ckew-h-front.jpg
│   │   │   ├── cs-xz20ckew-h-side.jpg
│   │   │   └── cs-xz20ckew-h-detail.jpg
│   │   ├── z-bianco/
│   │   │   ├── cs-z20ckew-front.jpg
│   │   │   └── ...
│   ├── tz/
│   │   ├── cs-tz20ckew/
│   │   └── ...
│   ├── console/
│   ├── canalizzata/
│   ├── professionale/
│   ├── multi-split/
│   └── unita-esterne/
├── tcl/
│   └── breezein/
└── accessori/
    ├── telecomandi/
    ├── gateway/
    └── filtri/
```

### 📐 Specifiche Immagini

**Formati supportati:**
- JPG/JPEG (consigliato per foto)
- PNG (consigliato per immagini con trasparenza)
- WebP (migliore compressione)

**Dimensioni consigliate:**
- **Prodotto principale:** 1200x1200px (quadrato)
- **Thumbnail:** 400x400px
- **Galleria:** 1920x1080px (landscape)

**Peso file:**
- Massimo: 500KB per immagine
- Ottimizzare con: https://tinypng.com/ o https://squoosh.app/

### 🚀 Flusso di Lavoro

1. **Scarica immagini** dal portale PRO Partner Panasonic
2. **Rinomina file** seguendo il pattern: `{modello}-{vista}.jpg`
   - Esempio: `cs-xz20ckew-h-front.jpg`
   - Esempio: `cs-xz25ckew-h-side.jpg`
3. **Posiziona** nella cartella corretta
4. **Esegui script** per ottimizzare:
   ```bash
   npm run optimize-images
   ```
5. **Aggiorna database** prodotti con i path delle immagini

### 📝 Script Utili

```bash
# Ottimizza tutte le immagini
npm run optimize-images

# Genera thumbnail automatici
npm run generate-thumbnails

# Verifica immagini mancanti
npm run check-missing-images
```

### ⚠️ Note Importanti

- Le immagini devono essere **ufficiali Panasonic/TCL** o di tua proprietà
- Rispetta i **diritti d'autore** e le **linee guida brand**
- Non usare immagini scaricate da Google o altri siti
- Per uso commerciale, ottieni **autorizzazione scritta**

### 📞 Contatti per Immagini Ufficiali

**Panasonic Marketing Europe**
- Email: marketing@eu.panasonic.com
- Telefono: +39 02 575971
- PRO Partner Portal: https://panasonic-pro-partner.eu

**TCL Italia**
- Email: info@tcl.com
- Telefono: +39 02 953381

---

**Ultimo aggiornamento:** 16 Gennaio 2026
