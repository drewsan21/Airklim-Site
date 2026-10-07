#!/usr/bin/env node

/**
 * Script per estrarre prodotti dai cataloghi PDF
 * 
 * Utilizzo:
 *   npm run extract-products
 *   npm run extract-products -- --file=path/to/catalog.pdf
 *   npm run extract-products -- --verbose
 */

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Configurazione
const config = {
  catalogsDir: path.join(__dirname, '../public/uploads/catalogs'),
  outputDir: path.join(__dirname, '../data'),
  imagesDir: path.join(__dirname, '../public/uploads/images/extracted'),
  logsDir: path.join(__dirname, '../logs'),
  verbose: process.argv.includes('--verbose'),
  specificFile: null
};

// Parsing argomenti
const fileArg = process.argv.find(arg => arg.startsWith('--file='));
if (fileArg) {
  config.specificFile = fileArg.split('=')[1];
}

// Pattern per identificare codici modello Panasonic
const panasonicPatterns = {
  ethereaXZ: /CS-XZ\d{2,3}[A-Z0-9-]*/g,
  ethereaZ: /CS-Z\d{2,3}[A-Z0-9-]*/g,
  tz: /CS-TZ\d{2,3}[A-Z0-9-]*/g,
  console: /CS-Z\d{2,3}CE[A-Z0-9-]*/g,
  canalizzata: /CS-Z\d{2,3}CD[A-Z0-9-]*/g,
  professionale: /CS-Z\d{2,3}YK[A-Z0-9-]*/g,
  outdoor: /CU-[A-Z0-9-]+/g,
  multiSplit: /CU-\dZ\d{2,3}[A-Z0-9-]*/g
};

// Pattern per identificare codici modello TCL
const tclPatterns = {
  breezein: /S\d{2}[A-Z0-9]*/g,
  unitary: /M\d{2}[A-Z0-9]*/g
};

// Pattern per estrarre specifiche tecniche
const specsPatterns = {
  power: /(\d+[\.,]?\d*)\s*kW/gi,
  btu: /(\d{4,5})\s*BTU/gi,
  seer: /SEER[:\s]*(\d+[\.,]?\d*)/gi,
  scop: /SCOP[:\s]*(\d+[\.,]?\d*)/gi,
  noise: /(\d{2})\s*dB/gi,
  dimensions: /(\d+)\s*[x×]\s*(\d+)\s*[x×]\s*(\d+)\s*mm/gi,
  weight: /(\d+[\.,]?\d*)\s*kg/gi,
  refrigerant: /R32|R290|R410A/gi
};

// Pattern per identificare caratteristiche
const featuresPatterns = {
  nanoeX: /nanoe[™]?X/gi,
  aerowings: /Aerowings/gi,
  wifi: /Wi-?Fi/gi,
  googleHome: /Google\s*Home/gi,
  alexa: /Alexa/gi,
  inverter: /Inverter/gi,
  ecoMode: /ECO|AI\s*ECO/gi
};

// Logger
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
  
  if (config.verbose || type === 'error') {
    console.log(logMessage);
  }
  
  // Scrivi su file di log
  if (!fs.existsSync(config.logsDir)) {
    fs.mkdirSync(config.logsDir, { recursive: true });
  }
  
  fs.appendFileSync(
    path.join(config.logsDir, 'extraction.log'),
    logMessage + '\n'
  );
}

// Estrai testo da PDF
async function extractTextFromPDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    log(`Errore nell'estrazione del PDF ${pdfPath}: ${error.message}`, 'error');
    return null;
  }
}

// Identifica prodotti nel testo
function identifyProducts(text, brand = 'panasonic') {
  const products = [];
  const patterns = brand === 'panasonic' ? panasonicPatterns : tclPatterns;
  
  for (const [category, pattern] of Object.entries(patterns)) {
    const matches = text.match(pattern);
    if (matches) {
      const uniqueMatches = [...new Set(matches)];
      uniqueMatches.forEach(model => {
        products.push({
          model,
          category,
          brand,
          rawText: text.substring(
            Math.max(0, text.indexOf(model) - 200),
            Math.min(text.length, text.indexOf(model) + 200)
          )
        });
      });
    }
  }
  
  return products;
}

// Estrai specifiche tecniche dal contesto
function extractSpecifications(contextText) {
  const specs = {};
  
  // Potenza
  const powerMatch = contextText.match(specsPatterns.power);
  if (powerMatch) {
    specs.power = powerMatch[0];
  }
  
  // BTU
  const btuMatch = contextText.match(specsPatterns.btu);
  if (btuMatch) {
    specs.btu = btuMatch[0];
  }
  
  // SEER
  const seerMatch = contextText.match(specsPatterns.seer);
  if (seerMatch) {
    specs.seer = parseFloat(seerMatch[1].replace(',', '.'));
  }
  
  // SCOP
  const scopMatch = contextText.match(specsPatterns.scop);
  if (scopMatch) {
    specs.scop = parseFloat(scopMatch[1].replace(',', '.'));
  }
  
  // Rumore
  const noiseMatch = contextText.match(specsPatterns.noise);
  if (noiseMatch) {
    specs.noiseLevel = `${noiseMatch[1]} dB(A)`;
  }
  
  // Dimensioni
  const dimMatch = contextText.match(specsPatterns.dimensions);
  if (dimMatch) {
    specs.dimensions = `${dimMatch[1]}×${dimMatch[2]}×${dimMatch[3]} mm`;
  }
  
  // Peso
  const weightMatch = contextText.match(specsPatterns.weight);
  if (weightMatch) {
    specs.weight = `${weightMatch[1]} kg`;
  }
  
  // Refrigerante
  const refMatch = contextText.match(specsPatterns.refrigerant);
  if (refMatch) {
    specs.refrigerant = refMatch[0];
  }
  
  return specs;
}

// Estrai caratteristiche dal contesto
function extractFeatures(contextText) {
  const features = [];
  
  for (const [feature, pattern] of Object.entries(featuresPatterns)) {
    if (contextText.match(pattern)) {
      features.push(feature);
    }
  }
  
  return features;
}

// Genera nome prodotto dal modello
function generateProductName(model, category) {
  const nameMap = {
    'ethereaXZ': 'Etherea XZ',
    'ethereaZ': 'Etherea Z',
    'tz': 'TZ Super-Compatta',
    'console': 'Console a Pavimento',
    'canalizzata': 'Canalizzata',
    'professionale': 'Professionale',
    'outdoor': 'Unità Esterna',
    'multiSplit': 'Multi-Split',
    'breezein': 'BreezeIN',
    'unitary': 'Unitary'
  };
  
  const baseName = nameMap[category] || category;
  const powerMatch = model.match(/\d{2}/);
  const power = powerMatch ? powerMatch[0] : '';
  
  return `${baseName} ${power}`;
}

// Processa un singolo PDF
async function processPDF(pdfPath) {
  log(`Processando: ${pdfPath}`);
  
  const text = await extractTextFromPDF(pdfPath);
  if (!text) {
    return [];
  }
  
  // Identifica brand dal path del file
  const brand = pdfPath.toLowerCase().includes('tcl') ? 'tcl' : 'panasonic';
  
  // Identifica prodotti
  const products = identifyProducts(text, brand);
  log(`Trovati ${products.length} prodotti`);
  
  // Estrai dettagli per ogni prodotto
  const detailedProducts = products.map(product => {
    const specs = extractSpecifications(product.rawText);
    const features = extractFeatures(product.rawText);
    const name = generateProductName(product.model, product.category);
    
    return {
      id: product.model.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      model: product.model,
      name: `${name} ${product.model}`,
      brand: product.brand.toUpperCase(),
      category: product.category,
      specifications: specs,
      features: features,
      price: null, // Da definire manualmente o da listino
      stock: 0, // Da definire manualmente
      status: 'active',
      image: `/uploads/images/extracted/${product.model.toLowerCase()}.jpg`,
      description: `Prodotto ${product.brand} ${name} modello ${product.model}`
    };
  });
  
  return detailedProducts;
}

// Trova tutti i PDF nella cartella catalogs
function findPDFs(dir) {
  const pdfs = [];
  
  if (config.specificFile) {
    if (fs.existsSync(config.specificFile)) {
      pdfs.push(config.specificFile);
    }
    return pdfs;
  }
  
  if (!fs.existsSync(dir)) {
    log(`Cartella non trovata: ${dir}`, 'error');
    return pdfs;
  }
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      pdfs.push(...findPDFs(fullPath));
    } else if (item.name.toLowerCase().endsWith('.pdf')) {
      pdfs.push(fullPath);
    }
  }
  
  return pdfs;
}

// Salva prodotti estratti
function saveProducts(products) {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  
  // Salva come JSON
  const jsonPath = path.join(config.outputDir, 'extracted-products.json');
  fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
  log(`Prodotti salvati in: ${jsonPath}`);
  
  // Salva come TypeScript
  const tsPath = path.join(config.outputDir, 'extractedProducts2026.ts');
  const tsContent = `/**
 * Prodotti estratti automaticamente dai cataloghi PDF
 * Generato il: ${new Date().toISOString()}
 * 
 * ATTENZIONE: Verifica manualmente i dati estratti prima di utilizzarli!
 */

export const extractedProducts = ${JSON.stringify(products, null, 2)};

export default extractedProducts;
`;
  
  fs.writeFileSync(tsPath, tsContent);
  log(`Prodotti salvati in: ${tsPath}`);
  
  return { jsonPath, tsPath };
}

// Genera report di estrazione
function generateReport(products, pdfs) {
  if (!fs.existsSync(config.logsDir)) {
    fs.mkdirSync(config.logsDir, { recursive: true });
  }
  
  const report = `# Report Estrazione Prodotti
**Data:** ${new Date().toISOString()}

## PDF Processati
${pdfs.map(pdf => `- ${pdf}`).join('\n')}

## Totale Prodotti Estratti
**${products.length}** prodotti

## Breakdown per Brand
- Panasonic: ${products.filter(p => p.brand === 'PANASONIC').length}
- TCL: ${products.filter(p => p.brand === 'TCL').length}

## Breakdown per Categoria
${Object.entries(
  products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {})
).map(([cat, count]) => `- ${cat}: ${count}`).join('\n')}

## Prossimi Step
1. Verifica manualmente i dati estratti
2. Aggiungi prezzi ufficiali
3. Aggiungi stock reale
4. Carica immagini ufficiali
5. Importa nel database principale

## File Generati
- JSON: data/extracted-products.json
- TypeScript: data/extractedProducts2026.ts
- Log: logs/extraction.log
`;
  
  const reportPath = path.join(
    config.logsDir,
    `extraction-report-${new Date().toISOString().split('T')[0]}.md`
  );
  
  fs.writeFileSync(reportPath, report);
  log(`Report salvato in: ${reportPath}`);
  
  return reportPath;
}

// Main
async function main() {
  log('=== INIZIO ESTRAZIONE PRODOTTI ===');
  
  // Trova tutti i PDF
  const pdfs = findPDFs(config.catalogsDir);
  
  if (pdfs.length === 0) {
    log('Nessun PDF trovato nella cartella catalogs', 'error');
    log(`Verifica che i PDF siano in: ${config.catalogsDir}`, 'error');
    return;
  }
  
  log(`Trovati ${pdfs.length} PDF da processare`);
  
  // Processa ogni PDF
  const allProducts = [];
  
  for (const pdf of pdfs) {
    const products = await processPDF(pdf);
    allProducts.push(...products);
  }
  
  log(`Totale prodotti estratti: ${allProducts.length}`);
  
  // Rimuovi duplicati
  const uniqueProducts = allProducts.filter(
    (product, index, self) =>
      index === self.findIndex(p => p.model === product.model)
  );
  
  log(`Prodotti unici: ${uniqueProducts.length}`);
  
  // Salva prodotti
  const paths = saveProducts(uniqueProducts);
  
  // Genera report
  const reportPath = generateReport(uniqueProducts, pdfs);
  
  log('=== ESTRAZIONE COMPLETATA ===');
  log(`Prodotti estratti: ${uniqueProducts.length}`);
  log(`File JSON: ${paths.jsonPath}`);
  log(`File TypeScript: ${paths.tsPath}`);
  log(`Report: ${reportPath}`);
}

// Esegui
main().catch(error => {
  log(`Errore fatale: ${error.message}`, 'error');
  process.exit(1);
});
