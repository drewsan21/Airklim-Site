#!/usr/bin/env node

/**
 * Script per verificare immagini mancanti
 * 
 * Utilizzo:
 *   npm run check-missing-images
 */

const fs = require('fs');
const path = require('path');

// Configurazione
const config = {
  productsFile: path.join(__dirname, '../data/extracted-products.json'),
  imagesDir: path.join(__dirname, '../public/uploads/images'),
  logsDir: path.join(__dirname, '../logs')
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
    path.join(config.logsDir, 'missing-images.log'),
    logMessage + '\n'
  );
}

// Verifica immagini mancanti
function checkMissingImages() {
  if (!fs.existsSync(config.productsFile)) {
    log(`File prodotti non trovato: ${config.productsFile}`, 'error');
    log('Esegui prima: npm run extract-products', 'error');
    return;
  }
  
  const products = JSON.parse(fs.readFileSync(config.productsFile, 'utf8'));
  const missing = [];
  const found = [];
  
  products.forEach(product => {
    if (product.image) {
      const imagePath = path.join(__dirname, '..', 'public', product.image);
      
      if (fs.existsSync(imagePath)) {
        found.push({
          product: product.model,
          path: imagePath
        });
      } else {
        missing.push({
          product: product.model,
          expectedPath: imagePath,
          relativePath: product.image
        });
      }
    } else {
      missing.push({
        product: product.model,
        expectedPath: null,
        relativePath: null
      });
    }
  });
  
  log(`=== REPORT IMMAGINI ===`);
  log(`Prodotti totali: ${products.length}`);
  log(`Immagini trovate: ${found.length}`);
  log(`Immagini mancanti: ${missing.length}`);
  
  if (missing.length > 0) {
    log(`\n=== IMMAGINI MANCANTI ===`);
    missing.forEach(m => {
      log(`- ${m.product}`);
      if (m.relativePath) {
        log(`  Path atteso: ${m.relativePath}`);
      } else {
        log(`  Nessuna immagine definita`);
      }
    });
    
    // Genera lista per download
    const downloadList = missing
      .filter(m => m.relativePath)
      .map(m => m.relativePath)
      .join('\n');
    
    const listPath = path.join(config.logsDir, 'missing-images-list.txt');
    fs.writeFileSync(listPath, downloadList);
    log(`\nLista immagini mancanti salvata in: ${listPath}`);
  }
  
  // Genera report dettagliato
  const report = {
    timestamp: new Date().toISOString(),
    totalProducts: products.length,
    imagesFound: found.length,
    imagesMissing: missing.length,
    missing: missing,
    found: found
  };
  
  const reportPath = path.join(
    config.logsDir,
    `images-report-${new Date().toISOString().split('T')[0]}.json`
  );
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Report dettagliato salvato in: ${reportPath}`);
  
  return report;
}

// Main
function main() {
  log('=== VERIFICA IMMAGINI MANCANTI ===');
  checkMissingImages();
  log('=== VERIFICA COMPLETATA ===');
}

// Esegui
main();
