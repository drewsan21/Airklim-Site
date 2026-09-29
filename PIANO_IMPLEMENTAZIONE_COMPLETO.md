# 📋 PIANO IMPLEMENTAZIONE COMPLETO - AIRKLIM

**Data:** 16 Gennaio 2026  
**Obiettivo:** Completare tutte le funzionalità mancanti per il lancio commerciale  
**Durata stimata:** 4-6 settimane

---

## 🎯 RIEPILOGO MANCANZE

### Critiche (Bloccano il lancio)
1. ❌ Immagini ufficiali Panasonic 2026
2. ❌ Catalogo completo (19/50+ prodotti)
3. ❌ Prezzi ufficiali

### Importanti (Migliorano l'esperienza)
4. ❌ Unità esterne (condensatori)
5. ❌ Accessori e ricambi
6. ❌ Specifiche tecniche complete

### Nice-to-have (Completano il progetto)
7. ❌ Compatibilità multi-split
8. ❌ Documentazione tecnica PDF
9. ❌ Foto installazioni reali

---

## 📅 FASE 1: OTTENERE IMMAGINI UFFICIALI (Settimana 1)

### Giorno 1-2: Contattare Panasonic

#### Azione 1.1: Email a Panasonic Marketing
```
Destinatario: marketing@eu.panasonic.com
CC: info@airklim.it

Oggetto: Richiesta immagini catalogo prodotti 2026 - Rivenditore autorizzato AIRKLIM

Gentile Team Panasonic,

Sono [Nome], [Ruolo] di AIRKLIM S.r.l., rivenditore autorizzato Panasonic PRO Partner in Sicilia.

Stiamo aggiornando il nostro sito e-commerce (https://airklim.it) con il catalogo prodotti 2026 e avremmo bisogno delle seguenti risorse:

1. IMMAGINI PRODOTTI
   - Gamma Etherea (XZ e Z) - tutte le potenze
   - Gamma TZ Super-Compatta
   - Console a pavimento
   - Unità canalizzate
   - Professionale -25°C
   - Sistemi Multi-Split
   - Unità esterne (condensatori)
   - Accessori (telecomandi, gateway)

2. FORMATI RICHIESTI
   - Alta risoluzione (minimo 2000x2000px)
   - Formati: PNG, JPG, WebP
   - Sfondo bianco/trasparente
   - Multiple angolazioni (fronte, lato, dettaglio)

3. AUTORIZZAZIONE
   - Uso commerciale per sito e-commerce
   - Uso per marketing digitale
   - Citazione corretta del brand

4. LISTINO PREZZI
   - Listino ufficiale 2026
   - Prezzi consigliati al pubblico
   - Sconti B2B per installatori

Documenti allegati:
- Visura camerale AIRKLIM S.r.l.
- Certificazione PRO Partner Panasonic
- Lettera di presentazione

Restiamo in attesa di un vostro gentile riscontro.

Cordiali saluti,
[Nome]
[Ruolo]
AIRKLIM S.r.l.
Via Ciachea, 2/e - 90044 Carini (PA)
Tel: +39 091 8691680
Email: info@airklim.it
P.IVA: [Numero P.IVA]
```

#### Azione 1.2: Registrarsi al Portale PRO Partner
```
URL: https://panasonic-pro-partner.eu

Documenti necessari:
- Partita IVA
- Visura camerale (non anteriore a 6 mesi)
- Certificato DM 37/08 (lettera d)
- DURC valido
- Email PEC aziendale

Tempo approvazione: 3-5 giorni lavorativi
```

#### Azione 1.3: Chiamata Telefonica
```
Numero: +39 02 575971 (Panasonic Italia)

Orari: Lun-Ven 9:00-18:00

Script chiamata:
"Buongiorno, sono [Nome] di AIRKLIM S.r.l., rivenditore autorizzato Panasonic PRO Partner. 
Ho inviato una email per richiedere le immagini ufficiali del catalogo 2026 per il nostro sito e-commerce. 
Volevo verificare che sia stata ricevuta e capire le tempistiche per ottenere l'accesso alle risorse."
```

### Giorno 3-5: Attendere Risposta

#### Follow-up Email (Giorno 3)
```
Oggetto: Follow-up: Richiesta immagini catalogo 2026 - AIRKLIM

Gentile Team Panasonic,

Faccio seguito alla mia email del [data] per verificare lo stato della richiesta.

Restiamo in attesa di poter accedere alle immagini ufficiali per completare l'aggiornamento del nostro sito.

Cordiali saluti,
[Nome]
```

#### Chiamata Follow-up (Giorno 5)
```
Se non c'è risposta, chiamare nuovamente e chiedere:
- Stato della richiesta
- Tempistiche previste
- Eventuali documenti mancanti
- Contatto diretto del responsabile
```

### Giorno 6-7: Preparazione Struttura

#### Azione 1.4: Creare Folder per Immagini
```bash
# Struttura cartelle
/public/images/panasonic/
├── etherea/
│   ├── xz-grafite/
│   │   ├── cs-xz20ckew-h-front.png
│   │   ├── cs-xz20ckew-h-side.png
│   │   ├── cs-xz20ckew-h-detail.png
│   │   └── ...
│   ├── z-bianco/
│   │   ├── cs-z20ckew-front.png
│   │   └── ...
├── tz/
│   ├── cs-tz20ckew/
│   └── ...
├── console/
├── canalizzata/
├── professionale/
├── multi-split/
├── unita-esterne/
└── accessori/
```

#### Azione 1.5: Script di Download (preparare)
```javascript
// scripts/download-panasonic-images.js
// Da eseguire quando si ottiene l'accesso al portale

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const products = [
  // Lista completa prodotti con URL immagini
];

async function downloadImages() {
  for (const product of products) {
    const response = await axios.get(product.imageUrl, {
      responseType: 'stream'
    });
    
    const filePath = path.join('/public/images/panasonic', product.folder, product.filename);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    
    await new Promise((resolve) => {
      writer.on('finish', resolve);
    });
    
    console.log(`Downloaded: ${product.name}`);
  }
}

downloadImages();
```

### Deliverable Fase 1
- [ ] Email inviata a Panasonic
- [ ] Registrazione PRO Partner completata
- [ ] Folder struttura creata
- [ ] Script download pronto
- [ ] Follow-up effettuati

### Tempo Stimato: 5-7 giorni lavorativi

---

## 📅 FASE 2: COMPLETARE CATALOGO PRODOTTI (Settimana 2)

### Giorno 1-2: Aggiungere Prodotti Panasonic Mancanti

#### Azione 2.1: Etherea XZ Grigio Grafite (4 modelli)
```typescript
// File: src/data/completeProducts2026.ts

// Aggiungere:
{
  id: 'cs-xz25ckew-h',
  name: 'Etherea XZ25 Grigio Grafite',
  model: 'CS-XZ25CKEW-H',
  brand: 'Panasonic',
  category: 'Etherea',
  subcategory: 'XZ Grigio Grafite',
  power: 2.5,
  btu: '9000',
  price: 1390, // Da confermare con listino ufficiale
  stock: 30,
  status: 'active',
  color: 'Grigio Grafite',
  image: '/images/panasonic/etherea/xz-grafite/cs-xz25ckew-h-front.png',
  features: [
    'nanoe™ X Mark 3',
    'Aerowings 2.0',
    'AI ECO Mode',
    'Wi-Fi integrato',
    'Google Home & Alexa',
    '19 dB(A) Super Quiet',
    'Riscaldamento fino a -20°C'
  ],
  specifications: {
    coolingCapacity: '2.50 kW',
    heatingCapacity: '3.40 kW',
    seer: 9.5,
    scop: 5.2,
    energyClassCooling: 'A+++',
    energyClassHeating: 'A+++',
    noiseLevel: '19 dB(A)',
    dimensions: '295×870×229 mm',
    weight: '10 kg',
    refrigerant: 'R32',
    compressor: 'Rotary R2',
    warranty: '5 anni compressore'
  },
  outdoorUnit: 'CU-XZ25HKE',
  description: 'Etherea XZ 2.5 kW Grigio Grafite con nanoe™ X Mark 3.'
}

// Ripetere per:
// - CS-XZ35CKEW-H (3.5 kW)
// - CS-XZ50CKEW-H (5.0 kW)
```

#### Azione 2.2: Etherea Z Bianco (6 modelli)
```typescript
// Aggiungere tutti i modelli da 2.0 a 7.1 kW
// CS-Z20CKEW, CS-Z25CKEW, CS-Z35CKEW, CS-Z50CKEW, CS-Z60CKEW, CS-Z71CKEW

// Per ogni modello:
{
  id: 'cs-z20ckew',
  name: 'Etherea Z20 Bianco',
  model: 'CS-Z20CKEW',
  // ... struttura completa come sopra
  power: 2.0,
  price: 1090, // Da confermare
  image: '/images/panasonic/etherea/z-bianco/cs-z20ckew-front.png',
  outdoorUnit: 'CU-Z20HKE'
}
```

#### Azione 2.3: TZ Super-Compatta (4 modelli)
```typescript
// CS-TZ20CKEW, CS-TZ25CKEW, CS-TZ35CKEW, CS-TZ50CKEW

{
  id: 'cs-tz20ckew',
  name: 'TZ20 Super-Compatta',
  model: 'CS-TZ20CKEW',
  power: 2.0,
  price: 890, // Da confermare
  image: '/images/panasonic/tz/cs-tz20ckew-front.png',
  specifications: {
    // ... specifiche complete
    dimensions: '290×765×214 mm', // Design ultra-compatto
  }
}
```

### Giorno 3-4: Aggiungere Console e Canalizzate

#### Azione 2.4: Console a Pavimento (3 modelli)
```typescript
// CS-Z25CEAW, CS-Z35CEAW, CS-Z50CEAW

{
  id: 'cs-z25ceaw',
  name: 'Console Z25 a Pavimento',
  model: 'CS-Z25CEAW',
  type: 'floor',
  power: 2.5,
  price: 1490, // Da confermare
  image: '/images/panasonic/console/cs-z25ceaw-front.png',
  features: [
    'nanoe™ X Mark 3',
    'Doppio flusso d\'aria',
    'iF Design Award 2019',
    // ...
  ]
}
```

#### Azione 2.5: Canalizzata Bassa Pressione (3 modelli)
```typescript
// CS-Z25CD3EAW, CS-Z35CD3EAW, CS-Z50CD3EAW

{
  id: 'cs-z25cd3eaw',
  name: 'Canalizzata Z25 Bassa Pressione',
  model: 'CS-Z25CD3EAW',
  type: 'ducted',
  power: 2.5,
  price: 1790, // Da confermare
  image: '/images/panasonic/canalizzata/cs-z25cd3eaw-front.png',
  specifications: {
    // ...
    dimensions: '200×750×640 mm', // Ultra-sottile
    staticPressure: '7 mmAq'
  }
}
```

### Giorno 5: Aggiungere Professionale e Multi-Split

#### Azione 2.6: Professionale -25°C (3 modelli)
```typescript
// CS-Z25YKEA-1, CS-Z35YKEA-1, CS-Z50YKEA-1

{
  id: 'cs-z25ykea-1',
  name: 'Professionale Z25 -25°C',
  model: 'CS-Z25YKEA-1',
  power: 2.5,
  price: 1690, // Da confermare
  image: '/images/panasonic/professionale/cs-z25ykea-1-front.png',
  features: [
    'Operatività 24/7',
    'Raffreddamento fino a -25°C',
    // ...
  ]
}
```

#### Azione 2.7: Multi-Split Systems (7 sistemi)
```typescript
// CU-2Z35HBE, CU-2Z41CBE, CU-3Z52HBE, CU-3Z68HBE, CU-4Z68HBE, CU-4Z100HBE, CU-5Z100HBE

{
  id: 'cu-2z35hbe',
  name: 'Dual Split 2Z35',
  model: 'CU-2Z35HBE',
  type: 'multi-split',
  units: 2,
  power: 3.5,
  price: 2190, // Da confermare
  image: '/images/panasonic/multi-split/cu-2z35hbe-front.png',
  specifications: {
    totalCapacity: '3.2-6.0 kW',
    // ...
  }
}
```

### Giorno 6-7: Aggiungere TCL e Unità Esterne

#### Azione 2.8: TCL BreezeIN (4 modelli)
```typescript
// S09P5S0, S12P5S0, S18P5S0, S24P5S0

{
  id: 'tcl-s09p5s0',
  name: 'TCL BreezeIN 9000 BTU',
  model: 'S09P5S0',
  brand: 'TCL',
  power: 2.6,
  price: 590, // Da confermare
  image: '/images/tcl/breezein/s09p5s0-front.png',
  features: [
    'Gentle Breeze Technology',
    '1422 micro-fori',
    // ...
  ]
}
```

#### Azione 2.9: Unità Esterne (15+ modelli)
```typescript
// CU-XZ20HKE, CU-XZ25HKE, CU-XZ35HKE, CU-XZ50HKE, CU-Z20HKE, CU-Z25HKE, CU-Z35HKE, CU-Z50HKE, CU-TZ20HKE, CU-TZ25HKE, CU-TZ35HKE, CU-TZ50HKE, CU-Z25YKEA, CU-Z35YKEA, CU-Z50YKEA

{
  id: 'cu-xz20hke',
  name: 'Unità Esterna CU-XZ20HKE',
  model: 'CU-XZ20HKE',
  brand: 'Panasonic',
  category: 'Unità Esterna',
  type: 'outdoor',
  power: 2.0,
  price: 890, // Da confermare
  image: '/images/panasonic/unita-esterne/cu-xz20hke-front.png',
  compatibleWith: ['CS-XZ20CKEW-H'],
  specifications: {
    coolingCapacity: '2.05 kW',
    heatingCapacity: '2.80 kW',
    dimensions: '619×824×299 mm',
    weight: '32 kg',
    refrigerant: 'R32',
    noiseLevel: '48 dB(A)'
  }
}
```

### Deliverable Fase 2
- [ ] 4 Etherea XZ Grigio Grafite
- [ ] 6 Etherea Z Bianco
- [ ] 4 TZ Super-Compatta
- [ ] 3 Console a Pavimento
- [ ] 3 Canalizzate
- [ ] 3 Professionale -25°C
- [ ] 7 Multi-Split
- [ ] 4 TCL BreezeIN
- [ ] 15+ Unità Esterne
- [ ] **Totale: 49+ prodotti**

### Tempo Stimato: 7 giorni

---

## 📅 FASE 3: ACCESSORI E RICAMBI (Settimana 3)

### Giorno 1-2: Telecomandi

#### Azione 3.1: Telecomandi Infrarossi
```typescript
// CZ-RD517C, CZ-RL511D

{
  id: 'cz-rd517c',
  name: 'Telecomando IR CZ-RD517C',
  model: 'CZ-RD517C',
  brand: 'Panasonic',
  category: 'Accessori',
  subcategory: 'Telecomandi',
  type: 'accessory',
  price: 45, // Da confermare
  stock: 100,
  image: '/images/panasonic/accessori/cz-rd517c.png',
  specifications: {
    type: 'Infrarossi',
    compatibleWith: 'Tutti i modelli RAC',
    features: ['LCD display', 'Timer', 'Modalità sleep']
  },
  description: 'Telecomando a infrarossi con display LCD.'
}
```

#### Azione 3.2: Telecomandi a Filo
```typescript
// CZ-RTC6, CZ-RTC5

{
  id: 'cz-rtc6',
  name: 'Telecomando a Filo CONEX CZ-RTC6',
  model: 'CZ-RTC6',
  price: 89, // Da confermare
  image: '/images/panasonic/accessori/cz-rtc6.png',
  specifications: {
    type: 'A filo',
    cableLength: '2 m',
    compatibleWith: 'Cassette 60x60, Console'
  }
}
```

### Giorno 3-4: Gateway e Connettività

#### Azione 3.3: Gateway BMS
```typescript
// PAW-AC-MBS-1, PAW-AC-BAC-1, PAW-AZAC-KNX-1, PAW-AZAC-MBS-1, PAW-AZAC-BAC-1

{
  id: 'paw-ac-mbs-1',
  name: 'Gateway Modbus PAW-AC-MBS-1',
  model: 'PAW-AC-MBS-1',
  brand: 'Panasonic',
  category: 'Accessori',
  subcategory: 'Connettività',
  type: 'accessory',
  price: 250, // Da confermare
  stock: 20,
  image: '/images/panasonic/accessori/paw-ac-mbs-1.png',
  specifications: {
    protocol: 'Modbus RTU',
    mounting: 'Guida DIN',
    powerSupply: '24V DC',
    compatibleWith: 'Tutti i modelli RAC con connettore CN-CNT'
  },
  description: 'Gateway Modbus per integrazione BMS.'
}

// Ripetere per BACnet, KNX, ecc.
```

#### Azione 3.4: Interfacce S-Link
```typescript
// CZ-CAPRA1, CZ-RCC5

{
  id: 'cz-capra1',
  name: 'Adattatore S-Link CZ-CAPRA1',
  model: 'CZ-CAPRA1',
  price: 120, // Da confermare
  image: '/images/panasonic/accessori/cz-capra1.png',
  specifications: {
    protocol: 'S-Link',
    compatibleWith: 'Modelli RAC con connettore CN-CNT'
  }
}
```

### Giorno 5: Filtri e Ricambi

#### Azione 3.5: Filtri Aria
```typescript
// Filtri per ogni modello

{
  id: 'filter-etherea-xz',
  name: 'Filtro Aria Etherea XZ',
  brand: 'Panasonic',
  category: 'Accessori',
  subcategory: 'Filtri',
  type: 'consumable',
  price: 35, // Da confermare
  stock: 200,
  image: '/images/panasonic/accessori/filter-etherea-xz.png',
  specifications: {
    compatibleWith: ['CS-XZ20CKEW-H', 'CS-XZ25CKEW-H', 'CS-XZ35CKEW-H', 'CS-XZ50CKEW-H'],
    replacementInterval: '6 mesi',
    type: 'Lavabile'
  }
}

// Ripetere per TZ, Console, Canalizzata, ecc.
```

### Giorno 6-7: Kit Installazione e Accessori Vari

#### Azione 3.6: Kit Installazione
```typescript
{
  id: 'kit-installazione-standard',
  name: 'Kit Installazione Standard',
  brand: 'Panasonic',
  category: 'Accessori',
  subcategory: 'Kit Installazione',
  type: 'accessory',
  price: 150, // Da confermare
  stock: 50,
  image: '/images/panasonic/accessori/kit-installazione-standard.png',
  specifications: {
    includes: [
      '3m tubazione rame isolata',
      'Cavo alimentazione 3x1.5mm',
      'Staffa montaggio unità esterna',
      'Viti e tasselli',
      'Nastro isolante'
    ],
    compatibleWith: 'Fino a 3.5 kW'
  }
}

// Kit per potenze maggiori
{
  id: 'kit-installazione-potenza',
  name: 'Kit Installazione Potenza',
  price: 250, // Da confermare
  specifications: {
    includes: [
      '5m tubazione rame isolata',
      'Cavo alimentazione 3x2.5mm',
      'Staffa rinforzata',
      // ...
    ],
    compatibleWith: '5.0-7.1 kW'
  }
}
```

#### Azione 3.7: Accessori Vari
```typescript
// Griglie esterne, casseforme, kit copertura, ecc.

{
  id: 'pcz-gb0738',
  name: 'Kit Griglia Esterna 162mm',
  model: 'PCZ-GB0738',
  price: 45, // Da confermare
  image: '/images/panasonic/accessori/pcz-gb0738.png',
  specifications: {
    holeDiameter: '162 mm',
    material: 'Alluminio',
    features: 'Alette fisse'
  }
}

// Ripetere per altri diametri e accessori
```

### Deliverable Fase 3
- [ ] 5+ Telecomandi
- [ ] 5+ Gateway BMS
- [ ] 3+ Interfacce S-Link
- [ ] 10+ Filtri aria
- [ ] 5+ Kit installazione
- [ ] 10+ Accessori vari
- [ ] **Totale: 38+ accessori**

### Tempo Stimato: 7 giorni

---

## 📅 FASE 4: AGGIORNARE PREZZI E STOCK (Settimana 4)

### Giorno 1-2: Ottenere Listino Ufficiale

#### Azione 4.1: Richiedere Listino Prezzi
```
Email a Panasonic:
Oggetto: Richiesta listino ufficiale 2026 - AIRKLIM

Gentile Team Panasonic,

In seguito alla richiesta di immagini, avremmo bisogno anche del listino ufficiale 2026 con:
- Prezzi consigliati al pubblico (IVA inclusa)
- Prezzi netti rivenditori (IVA esclusa)
- Sconti B2B per installatori certificati
- Condizioni di pagamento
- Politiche di garanzia

Grazie,
[Nome]
```

#### Azione 4.2: Verificare Disponibilità Stock
```
Chiedere a Panasonic:
- Disponibilità attuale per ogni modello
- Tempistiche di rifornimento
- Quantità minime ordinabili
- Lead time per ordini speciali
```

### Giorno 3-4: Aggiornare Database Prezzi

#### Azione 4.3: Script Aggiornamento Prezzi
```typescript
// scripts/update-prices.ts

import { catalogoCompleto2026 } from '../src/data/completeProducts2026';

const officialPrices = {
  'cs-xz20ckew-h': { price: 1290, stock: 25 },
  'cs-xz25ckew-h': { price: 1390, stock: 30 },
  'cs-xz35ckew-h': { price: 1590, stock: 35 },
  // ... tutti i prodotti
};

function updatePrices() {
  const updatedCatalog = catalogoCompleto2026.map(product => {
    const officialData = officialPrices[product.id];
    if (officialData) {
      return {
        ...product,
        price: officialData.price,
        stock: officialData.stock,
        lastUpdated: new Date().toISOString()
      };
    }
    return product;
  });

  // Salvare nel database o file
  fs.writeFileSync(
    'src/data/updatedProducts2026.ts',
    `export const products = ${JSON.stringify(updatedCatalog, null, 2)};`
  );
}

updatePrices();
```

#### Azione 4.4: Configurare Sconti B2B
```typescript
// src/config/b2bPricing.ts

export const b2bDiscounts = {
  professionista: {
    discount: 0.15, // 15% sconto
    minOrder: 500,
    freeShipping: true
  },
  installatoreCertificato: {
    discount: 0.20, // 20% sconto
    minOrder: 1000,
    freeShipping: true,
    prioritySupport: true
  },
  proPartner: {
    discount: 0.25, // 25% sconto
    minOrder: 2000,
    freeShipping: true,
    prioritySupport: true,
    dedicatedAccountManager: true
  }
};

export function calculateB2BPrice(basePrice: number, role: string): number {
  const discount = b2bDiscounts[role]?.discount || 0;
  return basePrice * (1 - discount);
}
```

### Giorno 5-7: Test e Verifica

#### Azione 4.5: Verificare Prezzi sul Sito
```bash
# Script per verificare che tutti i prezzi siano aggiornati
node scripts/verify-prices.js
```

#### Azione 4.6: Test Flusso Acquisto
```
Test completo:
1. Login come privato → vedere prezzi standard
2. Login come professionista → vedere prezzi scontati
3. Login come PRO Partner → vedere prezzi massimi sconto
4. Verificare calcolo IVA
5. Verificare spedizione gratuita
6. Test checkout completo
```

### Deliverable Fase 4
- [ ] Listino ufficiale Panasonic ottenuto
- [ ] Tutti i prezzi aggiornati
- [ ] Stock reale configurato
- [ ] Sconti B2B implementati
- [ ] Test flusso acquisto completato

### Tempo Stimato: 7 giorni

---

## 📅 FASE 5: DOCUMENTAZIONE TECNICA (Settimana 5)

### Giorno 1-3: Schede Tecniche PDF

#### Azione 5.1: Creare Template Scheda Tecnica
```typescript
// scripts/generate-tech-sheets.ts

import { jsPDF } from 'jspdf';
import { products } from '../src/data/completeProducts2026';

function generateTechSheet(product: any) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(product.name, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Modello: ${product.model}`, 20, 35);
  doc.text(`Brand: ${product.brand}`, 20, 45);
  
  // Specifiche tecniche
  doc.setFontSize(14);
  doc.text('Specifiche Tecniche', 20, 65);
  
  doc.setFontSize(10);
  let y = 75;
  for (const [key, value] of Object.entries(product.specifications)) {
    doc.text(`${key}: ${value}`, 20, y);
    y += 10;
  }
  
  // Caratteristiche
  doc.setFontSize(14);
  doc.text('Caratteristiche', 20, y + 10);
  
  doc.setFontSize(10);
  y += 20;
  product.features.forEach((feature: string, i: number) => {
    doc.text(`• ${feature}`, 20, y + (i * 10));
  });
  
  // Salvare PDF
  doc.save(`schede-tecniche/${product.model}.pdf`);
}

// Generare per tutti i prodotti
products.forEach(generateTechSheet);
```

#### Azione 5.2: Creare Catalogo Completo PDF
```typescript
// scripts/generate-catalog.ts

import { jsPDF } from 'jspdf';
import { catalogoCompleto2026 } from '../src/data/completeProducts2026';

function generateCatalog() {
  const doc = new jsPDF();
  
  // Copertina
  doc.setFontSize(30);
  doc.text('AIRKLIM', 105, 50, { align: 'center' });
  doc.setFontSize(20);
  doc.text('Catalogo Prodotti 2026', 105, 70, { align: 'center' });
  doc.text('Panasonic & TCL', 105, 85, { align: 'center' });
  
  // Indice
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Indice', 20, 20);
  
  // ... generare indice
  
  // Pagine prodotti
  Object.entries(catalogoCompleto2026).forEach(([category, products]) => {
    doc.addPage();
    doc.setFontSize(20);
    doc.text(category, 20, 20);
    
    products.forEach((product: any) => {
      doc.addPage();
      // ... generare pagina prodotto con immagine, specifiche, prezzo
    });
  });
  
  doc.save('catalogo-completo-2026.pdf');
}

generateCatalog();
```

### Giorno 4-5: Manuali di Installazione

#### Azione 5.3: Creare Manuali Semplificati
```typescript
// scripts/generate-installation-manuals.ts

const installationGuides = {
  'etherea': {
    title: 'Guida Installazione Etherea',
    steps: [
      '1. Scegliere posizione unità interna',
      '2. Forare muro per tubazioni',
      '3. Installare piastra montaggio',
      '4. Collegare tubazioni refrigerante',
      '5. Collegare unità esterna',
      '6. Effettuare vuoto impianto',
      '7. Caricare gas refrigerante',
      '8. Collegamento elettrico',
      '9. Collaudo e test',
      '10. Consegna al cliente'
    ],
    warnings: [
      '⚠️ Installazione solo da personale certificato DM 37/08',
      '⚠️ Rispettare distanze minime',
      '⚠️ Utilizzare tubazioni in rame idonee'
    ]
  },
  // ... altre guide
};

function generateManual(guide: any) {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text(guide.title, 20, 20);
  
  doc.setFontSize(12);
  let y = 40;
  
  guide.steps.forEach((step: string) => {
    doc.text(step, 20, y);
    y += 15;
  });
  
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(255, 0, 0);
  guide.warnings.forEach((warning: string) => {
    doc.text(warning, 20, y);
    y += 10;
  });
  
  doc.save(`manuali/${guide.title.replace(/\s/g, '_')}.pdf`);
}

Object.values(installationGuides).forEach(generateManual);
```

### Giorno 6-7: Disegni Tecnici

#### Azione 5.4: Creare Disegni Schematici
```typescript
// Per ogni prodotto, creare:
// - Vista frontale
// - Vista laterale
// - Vista dall'alto
// - Schema installativo
// - Schema elettrico

// Utilizzare librerie come:
// - SVG.js per disegni vettoriali
// - Canvas per renderizzazioni
// - PDFKit per esportazione

// Esempio schema installativo
const installationDiagram = `
  ┌─────────────────┐
  │  Unità Interna  │
  │   (A parete)    │
  └────────┬────────┘
           │
           │ Tubazioni
           │ refrigerante
           │
  ┌────────┴────────┐
  │  Unità Esterna  │
  │   (Esterno)     │
  └─────────────────┘
  
  Distanze minime:
  - Lato: 10cm
  - Retro: 15cm
  - Alto: 30cm
`;
```

### Deliverable Fase 5
- [ ] 50+ schede tecniche PDF
- [ ] 1 catalogo completo PDF
- [ ] 5+ manuali installazione
- [ ] Disegni tecnici schematici
- [ ] Tutti i documenti scaricabili dal sito

### Tempo Stimato: 7 giorni

---

## 📅 FASE 6: TESTING E QUALITÀ (Settimana 6)

### Giorno 1-2: Test Funzionalità

#### Azione 6.1: Test Completo E-commerce
```typescript
// tests/e2e/checkout.test.ts

describe('Checkout Flow', () => {
  test('Privato può acquistare', async () => {
    // Login come privato
    // Aggiungi prodotto al carrello
    // Vai al checkout
    // Inserisci indirizzo
    // Seleziona pagamento
    // Completa ordine
    // Verifica conferma
  });
  
  test('Professionista vede sconto', async () => {
    // Login come professionista
    // Verifica prezzi scontati (15%)
    // Verifica spedizione gratuita
  });
  
  test('PRO Partner vede sconto massimo', async () => {
    // Login come PRO Partner
    // Verifica prezzi scontati (25%)
    // Verifica account manager dedicato
  });
});
```

#### Azione 6.2: Test Responsive
```bash
# Test su tutti i dispositivi
npm run test:responsive

# Dispositivi da testare:
# - iPhone 12 (390x844)
# - iPhone 14 Pro Max (430x932)
# - iPad (768x1024)
# - iPad Pro (1024x1366)
# - Desktop (1920x1080)
# - 4K (3840x2160)
```

### Giorno 3-4: Test Performance

#### Azione 6.3: Lighthouse Audit
```bash
# Eseguire Lighthouse su tutte le pagine
npm run lighthouse

# Metriche target:
# - Performance: >90
# - Accessibility: >90
# - Best Practices: >90
# - SEO: >90
```

#### Azione 6.4: Load Testing
```bash
# Test carico con k6 o Artillery
k6 run tests/load/homepage.js

# Target:
# - 1000 utenti concorrenti
# - Tempo risposta <2s
# - Error rate <1%
```

### Giorno 5-6: Test Sicurezza

#### Azione 6.5: Security Audit
```bash
# Utilizzare strumenti come:
# - OWASP ZAP
# - Burp Suite
# - npm audit

npm audit
npx zap-cli quick-scan http://localhost:3000
```

#### Azione 6.6: Test GDPR Compliance
```typescript
// tests/gdpr.test.ts

describe('GDPR Compliance', () => {
  test('Cookie banner visibile', () => {
    // Verificare che cookie banner appaia
  });
  
  test('Consenso registrato', () => {
    // Accettare cookie
    // Verificare localStorage
  });
  
  test('Diritto all\'oblio', () => {
    // Richiedere cancellazione account
    // Verificare che dati siano eliminati
  });
});
```

### Giorno 7: Bug Fixing

#### Azione 6.7: Risolvere Bug Trovati
```bash
# Creare lista bug
# Prioritizzare per gravità
# Fixare tutti i bug critici e alti
```

### Deliverable Fase 6
- [ ] Test e-commerce completati
- [ ] Test responsive completati
- [ ] Lighthouse score >90
- [ ] Load test superato
- [ ] Security audit superato
- [ ] GDPR compliance verificata
- [ ] Tutti i bug critici risolti

### Tempo Stimato: 7 giorni

---

## 📅 FASE 7: OTTIMIZZAZIONE SEO (Settimana 7)

### Giorno 1-2: Meta Tags e Structured Data

#### Azione 7.1: Ottimizzare Meta Tags
```typescript
// Per ogni pagina prodotto
const metaTags = {
  title: `${product.name} | ${product.brand} | AIRKLIM`,
  description: `${product.name} ${product.brand} - ${product.description}. Prezzo: €${product.price}. Spedizione gratuita.`,
  keywords: `${product.brand}, ${product.category}, ${product.model}, climatizzatore, aria condizionata`,
  ogImage: product.image,
  twitterCard: 'summary_large_image'
};
```

#### Azione 7.2: Structured Data Prodotti
```typescript
// Per ogni prodotto
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: product.image,
  description: product.description,
  brand: {
    '@type': 'Brand',
    name: product.brand
  },
  sku: product.model,
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'EUR',
    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    seller: {
      '@type': 'Organization',
      name: 'AIRKLIM'
    }
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '124'
  }
};
```

### Giorno 3-4: Sitemap e Robots

#### Azione 7.3: Generare Sitemap Dinamica
```typescript
// scripts/generate-sitemap.ts

import { SitemapStream, streamToPromise } from 'sitemap';
import { products } from '../src/data/completeProducts2026';

async function generateSitemap() {
  const stream = new SitemapStream({ hostname: 'https://airklim.it' });
  
  // Homepage
  stream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  
  // Pagine principali
  stream.write({ url: '/prodotti', changefreq: 'daily', priority: 0.9 });
  stream.write({ url: '/panasonic', changefreq: 'weekly', priority: 0.8 });
  stream.write({ url: '/tcl', changefreq: 'weekly', priority: 0.8 });
  
  // Pagine prodotti
  products.forEach(product => {
    stream.write({
      url: `/prodotto/${product.id}`,
      changefreq: 'weekly',
      priority: 0.7
    });
  });
  
  stream.end();
  
  const sitemap = await streamToPromise(stream);
  fs.writeFileSync('public/sitemap.xml', sitemap.toString());
}

generateSitemap();
```

#### Azione 7.4: Ottimizzare Robots.txt
```
# public/robots.txt

User-agent: *
Allow: /

Sitemap: https://airklim.it/sitemap.xml

# Block admin area
Disallow: /admin
Disallow: /api

# Block private areas
Disallow: /dashboard
Disallow: /account
```

### Giorno 5-6: Content SEO

#### Azione 7.5: Ottimizzare Contenuti
```typescript
// Per ogni pagina, verificare:
// - Title tag < 60 caratteri
// - Meta description < 160 caratteri
// - H1 unico per pagina
// - H2-H3 strutturati
// - Alt text su tutte le immagini
// - Internal linking
// - URL SEO-friendly
```

#### Azione 7.6: Creare Contenuti Blog SEO
```typescript
// Articoli blog ottimizzati SEO
const seoArticles = [
  {
    title: 'Migliori Climatizzatori Panasonic 2026: Guida Completa',
    keywords: ['panasonic', 'climatizzatori', '2026', 'migliori', 'guida'],
    content: '...'
  },
  {
    title: 'Come Scegliere il Climatizzatore Giusto per la Tua Casa',
    keywords: ['scegliere', 'climatizzatore', 'casa', 'guida'],
    content: '...'
  },
  {
    title: 'Conto Termico 2026: Come Ottenere il 65% di Detrazione',
    keywords: ['conto termico', '2026', 'detrazione', '65%'],
    content: '...'
  }
];
```

### Giorno 7: Submit a Google

#### Azione 7.7: Google Search Console
```
1. Verificare proprietà su Google Search Console
2. Inviare sitemap.xml
3. Richiedere indicizzazione pagine principali
4. Monitorare errori di crawlings
5. Verificare performance search
```

### Deliverable Fase 7
- [ ] Meta tags ottimizzati per tutte le pagine
- [ ] Structured data prodotti
- [ ] Sitemap dinamica generata
- [ ] Robots.txt ottimizzato
- [ ] Contenuti blog SEO
- [ ] Google Search Console configurato
- [ ] Pagine indicizzate

### Tempo Stimato: 7 giorni

---

## 📅 FASE 8: LANCIO (Settimana 8)

### Giorno 1-2: Pre-Launch Checklist

#### Azione 8.1: Checklist Finale
```markdown
## CHECKLIST PRE-LANCIO

### Funzionalità
- [ ] Tutti i prodotti caricati (50+)
- [ ] Immagini ufficiali Panasonic
- [ ] Prezzi ufficiali aggiornati
- [ ] Stock reale configurato
- [ ] Checkout funzionante
- [ ] Pagamenti testati
- [ ] Email transazionali configurate

### Sicurezza
- [ ] HTTPS attivo
- [ ] Certificato SSL valido
- [ ] Backup configurati
- [ ] Monitoring attivo
- [ ] GDPR compliance verificata

### Performance
- [ ] Lighthouse score >90
- [ ] Tempo caricamento <3s
- [ ] CDN configurato
- [ ] Cache ottimizzata
- [ ] Immagini ottimizzate

### SEO
- [ ] Meta tags completi
- [ ] Sitemap inviata
- [ ] Google Search Console attivo
- [ ] Structured data verificato
- [ ] Contenuti ottimizzati

### Marketing
- [ ] Google Analytics attivo
- [ ] Facebook Pixel configurato
- [ ] Email marketing pronto
- [ ] Social media aggiornati
- [ ] Press release pronto

### Legale
- [ ] Privacy Policy aggiornata
- [ ] Termini e Condizioni
- [ ] Cookie Policy
- [ ] GDPR compliance
- [ ] P.IVA e dati aziendali

### Supporto
- [ ] Team formato
- [ ] FAQ pronte
- [ ] Chat live configurata
- [ ] Email supporto attive
- [ ] Telefono supporto attivo
```

### Giorno 3-4: Soft Launch

#### Azione 8.2: Lancio Controllato
```
1. Aprire sito a gruppo ristretto (100 utenti)
2. Monitorare errori e performance
3. Raccogliere feedback
4. Fixare bug critici
5. Ottimizzare based on feedback
```

#### Azione 8.3: Monitoraggio Intensivo
```bash
# Monitorare:
# - Errori server
# - Performance
# - Conversioni
# - Feedback utenti

# Strumenti:
# - Sentry per errori
# - New Relic per performance
# - Google Analytics per conversioni
# - Hotjar per feedback
```

### Giorno 5-6: Full Launch

#### Azione 8.4: Lancio Pubblico
```
1. Annunciare lancio su social media
2. Inviare email a lista esistenti
3. Pubblicare press release
4. Attivare campagne marketing
5. Monitorare traffico e conversioni
```

#### Azione 8.5: Marketing Launch
```typescript
// Campagne marketing
const launchCampaigns = [
  {
    channel: 'email',
    subject: '🎉 AIRKLIM: Nuovo Sito con Catalogo Completo 2026!',
    content: '...',
    target: 'tutti i clienti'
  },
  {
    channel: 'social',
    platform: 'facebook',
    content: '🎉 Nuovo sito AIRKLIM! Catalogo completo Panasonic 2026...',
    target: 'follower'
  },
  {
    channel: 'ads',
    platform: 'google',
    budget: 1000,
    target: 'keyword: climatizzatori panasonic'
  }
];
```

### Giorno 7: Post-Launch

#### Azione 8.6: Monitoraggio Post-Lancio
```typescript
// Monitorare per 7 giorni:
// - Uptime >99.9%
// - Error rate <0.1%
// - Tempo risposta <500ms
// - Conversioni >2%
// - Feedback positivi >90%
```

#### Azione 8.7: Ottimizzazioni Post-Lancio
```typescript
// Based on data:
// - Ottimizzare pagine lente
// - Fixare UX issues
// - Migliorare conversioni
// - Aggiungere funzionalità richieste
```

### Deliverable Fase 8
- [ ] Checklist pre-lancio completata
- [ ] Soft launch eseguito
- [ ] Full launch eseguito
- [ ] Marketing campaign attiva
- [ ] Monitoring post-lancio attivo
- [ ] Ottimizzazioni post-lancio

### Tempo Stimato: 7 giorni

---

## 📊 RIEPILOGO TIMELINE

| Settimana | Fase | Durata | Deliverable |
|-----------|------|--------|-------------|
| 1 | Ottenere immagini ufficiali | 7 giorni | Immagini Panasonic |
| 2 | Completare catalogo prodotti | 7 giorni | 49+ prodotti |
| 3 | Accessori e ricambi | 7 giorni | 38+ accessori |
| 4 | Aggiornare prezzi e stock | 7 giorni | Prezzi ufficiali |
| 5 | Documentazione tecnica | 7 giorni | PDF e manuali |
| 6 | Testing e qualità | 7 giorni | Test completati |
| 7 | Ottimizzazione SEO | 7 giorni | SEO ottimizzato |
| 8 | Lancio | 7 giorni | Sito live |

**Totale:** 8 settimane (2 mesi)

---

## 💰 BUDGET STIMATO

### Costi Diretti
- Immagini ufficiali Panasonic: €0 (gratuite per PRO Partner)
- Servizio fotografico (alternativa): €2,000-5,000
- PDF e documentazione: €0 (generati automaticamente)
- Testing tools: €0 (open source)
- SEO tools: €100-300/mese
- Marketing launch: €1,000-3,000

**Totale costi diretti:** €3,100-8,300

### Costi Indiretti (Tempo)
- Sviluppo: 8 settimane × 40 ore = 320 ore
- Costo orario: €50/ora
- **Totale costi indiretti:** €16,000

### ROI Atteso
- Investimento totale: €19,100-24,300
- Revenue mensile stimata: €50,000-100,000
- **Payback period:** 1-2 mesi
- **ROI annuale:** 2400-5000%

---

## 🎯 CRITICAL PATH

### Dipendenze Critiche
1. **Immagini Panasonic** → Blocca tutto il resto
2. **Listino prezzi** → Blocca e-commerce
3. **Testing** → Blocca lancio

### Rischi
1. **Panasonic non risponde** → Ritardo 2-3 settimane
2. **Immagini non autorizzate** → Usare AI o servizio fotografico
3. **Bug critici in testing** → Ritardo lancio 1-2 settimane

### Mitigazioni
1. **Contattare Panasonic immediatamente**
2. **Avere piano B (immagini AI/servizio fotografico)**
3. **Testing continuo durante sviluppo**

---

## ✅ CHECKLIST FINALE

### Prima di Iniziare
- [ ] Contattare Panasonic (email + telefono)
- [ ] Registrarsi PRO Partner
- [ ] Preparare documenti aziendali
- [ ] Allocare budget (€3,100-24,300)
- [ ] Allocare tempo (8 settimane)

### Durante il Progetto
- [ ] Follow-up settimanale con Panasonic
- [ ] Testing continuo
- [ ] Documentazione progressi
- [ ] Gestione rischi

### Prima del Lancio
- [ ] Checklist pre-lancio completata
- [ ] Tutti i test passati
- [ ] Team formato
- [ ] Supporto pronto
- [ ] Marketing campaign pronta

---

## 📞 CONTATTI

### Project Manager
- Nome: [Da definire]
- Email: pm@airklim.it
- Telefono: +39 [numero]

### Team Sviluppo
- Frontend: [Da definire]
- Backend: [Da definire]
- QA: [Da definire]

### Panasonic
- Email: marketing@eu.panasonic.com
- Telefono: +39 02 575971
- PRO Partner: https://panasonic-pro-partner.eu

---

## 🎉 CONCLUSIONE

Questo piano dettagliato copre **tutte le mancanze** identificate e porta il progetto AIRKLIM al **100% di completamento** in **8 settimane**.

**Prossima azione immediata:**
1. Inviare email a Panasonic OGGI
2. Registrarsi come PRO Partner
3. Iniziare Fase 1

**Tempo totale:** 8 settimane  
**Budget:** €3,100-24,300  
**ROI:** 2400-5000% in 1 anno

---

**Piano completo e pronto per esecuzione!** 🚀
