#!/usr/bin/env node

/**
 * Script per importare prodotti estratti nel database principale
 * 
 * Utilizzo:
 *   npm run import-products
 *   npm run import-products -- --merge
 *   npm run import-products -- --replace
 */

const fs = require('fs');
const path = require('path');

// Configurazione
const config = {
  extractedFile: path.join(__dirname, '../data/extracted-products.json'),
  mainProductsFile: path.join(__dirname, '../src/data/completeProducts2026.ts'),
  backupDir: path.join(__dirname, '../backups'),
  logsDir: path.join(__dirname, '../logs'),
  mode: process.argv.includes('--replace') ? 'replace' : 'merge'
};

// Logger
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
  console.log(logMessage);
  
  if (!fs.existsSync(config.logsDir)) {
    fs.mkdirSync(config.logsDir, { recursive: true });
  }
  
  fs.appendFileSync(
    path.join(config.logsDir, 'import-products.log'),
    logMessage + '\n'
  );
}

// Backup del file esistente
function backupExistingFile() {
  if (!fs.existsSync(config.mainProductsFile)) {
    log('Nessun file esistente da backuppare');
    return;
  }
  
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir, { recursive: true });
  }
  
  const backupPath = path.join(
    config.backupDir,
    `completeProducts2026-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.ts`
  );
  
  fs.copyFileSync(config.mainProductsFile, backupPath);
  log(`Backup creato: ${backupPath}`);
}

// Carica prodotti estratti
function loadExtractedProducts() {
  if (!fs.existsSync(config.extractedFile)) {
    log(`File estratti non trovato: ${config.extractedFile}`, 'error');
    log('Esegui prima: npm run extract-products', 'error');
    process.exit(1);
  }
  
  const products = JSON.parse(fs.readFileSync(config.extractedFile, 'utf8'));
  log(`Caricati ${products.length} prodotti estratti`);
  return products;
}

// Carica prodotti esistenti
function loadExistingProducts() {
  if (!fs.existsSync(config.mainProductsFile)) {
    log('Nessun file prodotti esistente');
    return [];
  }
  
  try {
    const content = fs.readFileSync(config.mainProductsFile, 'utf8');
    
    // Estrai array prodotti dal file TypeScript
    const match = content.match(/export const extractedProducts = (\[[\s\S]*?\]);/);
    if (match) {
      // Nota: questo è un parsing semplificato
      // In produzione, usa un parser TypeScript appropriato
      log('File esistente trovato, ma parsing complesso - usa modalità --replace');
      return [];
    }
    
    return [];
  } catch (error) {
    log(`Errore nel caricamento file esistente: ${error.message}`, 'error');
    return [];
  }
}

// Merge prodotti
function mergeProducts(existing, extracted) {
  const merged = [...existing];
  let added = 0;
  let updated = 0;
  
  extracted.forEach(newProduct => {
    const existingIndex = merged.findIndex(p => p.model === newProduct.model);
    
    if (existingIndex >= 0) {
      // Aggiorna prodotto esistente
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...newProduct,
        // Mantieni dati esistenti se non presenti nei nuovi
        price: newProduct.price || merged[existingIndex].price,
        stock: newProduct.stock || merged[existingIndex].stock
      };
      updated++;
    } else {
      // Aggiungi nuovo prodotto
      merged.push(newProduct);
      added++;
    }
  });
  
  log(`Merge completato: ${added} aggiunti, ${updated} aggiornati`);
  return merged;
}

// Genera file TypeScript
function generateTypeScriptFile(products) {
  const timestamp = new Date().toISOString();
  
  const content = `/**
 * Catalogo completo prodotti AIRKLIM 2026
 * Generato automaticamente il: ${timestamp}
 * 
 * ATTENZIONE: Verifica manualmente i dati prima di utilizzare in produzione!
 * 
 * Brand inclusi:
 * - Panasonic (Etherea, TZ, Console, Canalizzata, Professionale, Multi-Split)
 * - TCL (BreezeIN, Unitary)
 * 
 * Totale prodotti: ${products.length}
 */

export interface Product {
  id: string;
  model: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  type: string;
  power: number;
  btu?: string;
  price: number | null;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  color?: string;
  image: string;
  features: string[];
  specifications: {
    coolingCapacity?: string;
    heatingCapacity?: string;
    seer?: number;
    scop?: number;
    energyClassCooling?: string;
    energyClassHeating?: string;
    noiseLevel?: string;
    dimensions?: string;
    weight?: string;
    refrigerant?: string;
    compressor?: string;
    warranty?: string;
    [key: string]: any;
  };
  outdoorUnit?: string;
  compatibleWith?: string[];
  description: string;
  units?: number; // Per multi-split
}

export const extractedProducts: Product[] = ${JSON.stringify(products, null, 2)};

// Helper functions
export const getAllProducts = (): Product[] => extractedProducts;

export const getProductsByCategory = (category: string): Product[] => 
  extractedProducts.filter(p => p.category === category);

export const getProductsByBrand = (brand: string): Product[] => 
  extractedProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase());

export const getProductById = (id: string): Product | undefined => 
  extractedProducts.find(p => p.id === id);

export const getProductByModel = (model: string): Product | undefined => 
  extractedProducts.find(p => p.model === model);

export const getTotalProductsCount = (): number => extractedProducts.length;

export default extractedProducts;
`;
  
  return content;
}

// Salva file TypeScript
function saveTypeScriptFile(products) {
  const content = generateTypeScriptFile(products);
  fs.writeFileSync(config.mainProductsFile, content);
  log(`File TypeScript salvato: ${config.mainProductsFile}`);
}

// Genera report import
function generateReport(products, stats) {
  const report = {
    timestamp: new Date().toISOString(),
    mode: config.mode,
    totalProducts: products.length,
    stats: stats,
    file: config.mainProductsFile
  };
  
  const reportPath = path.join(
    config.logsDir,
    `import-report-${new Date().toISOString().split('T')[0]}.json`
  );
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Report salvato: ${reportPath}`);
  
  return reportPath;
}

// Main
function main() {
  log('=== INIZIO IMPORT PRODOTTI ===');
  log(`Modalità: ${config.mode}`);
  
  // Backup file esistente
  backupExistingFile();
  
  // Carica prodotti
  const extractedProducts = loadExtractedProducts();
  const existingProducts = loadExistingProducts();
  
  // Merge o replace
  let finalProducts;
  let stats;
  
  if (config.mode === 'replace') {
    finalProducts = extractedProducts;
    stats = {
      replaced: extractedProducts.length,
      added: 0,
      updated: 0
    };
    log(`Modalità replace: ${extractedProducts.length} prodotti`);
  } else {
    finalProducts = mergeProducts(existingProducts, extractedProducts);
    stats = {
      replaced: 0,
      added: finalProducts.length - existingProducts.length,
      updated: existingProducts.length
    };
  }
  
  // Salva file
  saveTypeScriptFile(finalProducts);
  
  // Genera report
  const reportPath = generateReport(finalProducts, stats);
  
  log('=== IMPORT COMPLETATO ===');
  log(`Prodotti totali: ${finalProducts.length}`);
  log(`File: ${config.mainProductsFile}`);
  log(`Report: ${reportPath}`);
  log('\nProssimi step:');
  log('1. Verifica il file generato');
  log('2. Aggiungi prezzi ufficiali');
  log('3. Aggiungi stock reale');
  log('4. Verifica immagini');
  log('5. Esegui: npm run build');
}

// Esegui
main();
