#!/usr/bin/env node

/**
 * Script per ottimizzare immagini prodotti
 * 
 * Utilizzo:
 *   npm run optimize-images
 *   npm run optimize-images -- --input=path/to/images
 *   npm run optimize-images -- --verbose
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configurazione
const config = {
  inputDir: path.join(__dirname, '../public/uploads/images'),
  outputDir: path.join(__dirname, '../public/uploads/images/optimized'),
  thumbnailsDir: path.join(__dirname, '../public/uploads/images/thumbnails'),
  logsDir: path.join(__dirname, '../logs'),
  verbose: process.argv.includes('--verbose'),
  
  // Dimensioni
  sizes: {
    large: { width: 1200, height: 1200 },
    medium: { width: 800, height: 800 },
    small: { width: 400, height: 400 },
    thumbnail: { width: 200, height: 200 }
  },
  
  // Qualità
  quality: {
    jpeg: 85,
    webp: 80,
    png: 80
  }
};

// Logger
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
  
  if (config.verbose || type === 'error') {
    console.log(logMessage);
  }
  
  if (!fs.existsSync(config.logsDir)) {
    fs.mkdirSync(config.logsDir, { recursive: true });
  }
  
  fs.appendFileSync(
    path.join(config.logsDir, 'image-optimization.log'),
    logMessage + '\n'
  );
}

// Crea cartelle se non esistono
function ensureDirectories() {
  const dirs = [config.outputDir, config.thumbnailsDir];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`Creata cartella: ${dir}`);
    }
  });
}

// Trova tutte le immagini
function findImages(dir) {
  const images = [];
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  if (!fs.existsSync(dir)) {
    log(`Cartella non trovata: ${dir}`, 'error');
    return images;
  }
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory() && item.name !== 'optimized' && item.name !== 'thumbnails') {
      images.push(...findImages(fullPath));
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (extensions.includes(ext)) {
        images.push(fullPath);
      }
    }
  }
  
  return images;
}

// Ottimizza singola immagine
async function optimizeImage(imagePath) {
  try {
    const relativePath = path.relative(config.inputDir, imagePath);
    const outputPath = path.join(config.outputDir, relativePath);
    const thumbnailPath = path.join(config.thumbnailsDir, relativePath);
    
    // Crea cartelle di output se necessario
    const outputDir = path.dirname(outputPath);
    const thumbnailDir = path.dirname(thumbnailPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }
    
    // Ottieni metadata immagine
    const metadata = await sharp(imagePath).metadata();
    log(`Processando: ${relativePath} (${metadata.width}x${metadata.height})`);
    
    // Genera versione grande (1200x1200)
    await sharp(imagePath)
      .resize(config.sizes.large.width, config.sizes.large.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: config.quality.jpeg })
      .toFile(outputPath.replace(/\.[^.]+$/, '-large.jpg'));
    
    // Genera versione media (800x800)
    await sharp(imagePath)
      .resize(config.sizes.medium.width, config.sizes.medium.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: config.quality.jpeg })
      .toFile(outputPath.replace(/\.[^.]+$/, '-medium.jpg'));
    
    // Genera versione piccola (400x400)
    await sharp(imagePath)
      .resize(config.sizes.small.width, config.sizes.small.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: config.quality.jpeg })
      .toFile(outputPath.replace(/\.[^.]+$/, '-small.jpg'));
    
    // Genera thumbnail (200x200)
    await sharp(imagePath)
      .resize(config.sizes.thumbnail.width, config.sizes.thumbnail.height, {
        fit: 'cover'
      })
      .jpeg({ quality: config.quality.jpeg })
      .toFile(thumbnailPath.replace(/\.[^.]+$/, '-thumb.jpg'));
    
    // Genera versione WebP (migliore compressione)
    await sharp(imagePath)
      .resize(config.sizes.large.width, config.sizes.large.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: config.quality.webp })
      .toFile(outputPath.replace(/\.[^.]+$/, '.webp'));
    
    // Copia originale ottimizzata
    await sharp(imagePath)
      .jpeg({ quality: config.quality.jpeg })
      .toFile(outputPath);
    
    log(`✓ Ottimizzata: ${relativePath}`);
    
    return {
      original: imagePath,
      optimized: outputPath,
      thumbnail: thumbnailPath,
      success: true
    };
  } catch (error) {
    log(`Errore nell'ottimizzazione di ${imagePath}: ${error.message}`, 'error');
    return {
      original: imagePath,
      success: false,
      error: error.message
    };
  }
}

// Genera report di ottimizzazione
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    totalImages: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results: results
  };
  
  const reportPath = path.join(
    config.logsDir,
    `optimization-report-${new Date().toISOString().split('T')[0]}.json`
  );
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Report salvato in: ${reportPath}`);
  
  return reportPath;
}

// Verifica immagini mancanti
function checkMissingImages(products) {
  const missing = [];
  
  products.forEach(product => {
    if (product.image) {
      const imagePath = path.join(__dirname, '..', 'public', product.image);
      if (!fs.existsSync(imagePath)) {
        missing.push({
          product: product.model,
          expectedPath: imagePath
        });
      }
    }
  });
  
  return missing;
}

// Main
async function main() {
  log('=== INIZIO OTTIMIZZAZIONE IMMAGINI ===');
  
  // Crea cartelle
  ensureDirectories();
  
  // Trova tutte le immagini
  const images = findImages(config.inputDir);
  
  if (images.length === 0) {
    log('Nessuna immagine trovata', 'error');
    log(`Verifica che le immagini siano in: ${config.inputDir}`, 'error');
    return;
  }
  
  log(`Trovate ${images.length} immagini da ottimizzare`);
  
  // Ottimizza ogni immagine
  const results = [];
  
  for (const image of images) {
    const result = await optimizeImage(image);
    results.push(result);
  }
  
  // Genera report
  const reportPath = generateReport(results);
  
  // Verifica immagini mancanti
  try {
    const productsPath = path.join(__dirname, '../data/extracted-products.json');
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      const missing = checkMissingImages(products);
      
      if (missing.length > 0) {
        log(`Attenzione: ${missing.length} immagini mancanti per i prodotti`);
        missing.forEach(m => {
          log(`  - ${m.product}: ${m.expectedPath}`);
        });
      }
    }
  } catch (error) {
    log(`Impossibile verificare immagini mancanti: ${error.message}`, 'error');
  }
  
  log('=== OTTIMIZZAZIONE COMPLETATA ===');
  log(`Immagini processate: ${results.length}`);
  log(`Successo: ${results.filter(r => r.success).length}`);
  log(`Fallite: ${results.filter(r => !r.success).length}`);
  log(`Report: ${reportPath}`);
}

// Esegui
main().catch(error => {
  log(`Errore fatale: ${error.message}`, 'error');
  process.exit(1);
});
