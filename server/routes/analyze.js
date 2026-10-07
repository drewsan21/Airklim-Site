/**
 * AIRKLIM Backend - Analisi Automatica PDF e Immagini
 * Endpoint API per upload e analisi automatica in background
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Configurazione upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = file.mimetype.includes('pdf') 
      ? 'public/uploads/catalogs/uploaded'
      : 'public/uploads/images/uploaded';
    
    // Crea directory se non esiste
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

// Stato analisi in background
let analysisStatus = {
  isRunning: false,
  progress: 0,
  currentStep: '',
  results: null,
  error: null,
  startTime: null,
  endTime: null
};

/**
 * POST /api/analyze/upload
 * Upload file e avvia analisi automatica
 */
router.post('/upload', upload.array('files', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nessun file caricato'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    // Avvia analisi in background
    startBackgroundAnalysis(uploadedFiles);

    res.json({
      success: true,
      message: 'File caricati. Analisi avviata in background.',
      files: uploadedFiles,
      analysisId: Date.now()
    });

  } catch (error) {
    console.error('Errore upload:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analyze/status
 * Stato analisi in background
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: analysisStatus
  });
});

/**
 * POST /api/analyze/start
 * Avvia analisi manuale
 */
router.post('/start', (req, res) => {
  if (analysisStatus.isRunning) {
    return res.status(400).json({
      success: false,
      error: 'Analisi già in corso'
    });
  }

  startBackgroundAnalysis([]);

  res.json({
    success: true,
    message: 'Analisi avviata'
  });
});

/**
 * POST /api/analyze/stop
 * Ferma analisi in corso
 */
router.post('/stop', (req, res) => {
  if (!analysisStatus.isRunning) {
    return res.status(400).json({
      success: false,
      error: 'Nessuna analisi in corso'
    });
  }

  // TODO: Implementare stop reale
  analysisStatus.isRunning = false;
  analysisStatus.currentStep = 'Fermato';

  res.json({
    success: true,
    message: 'Analisi fermata'
  });
});

/**
 * GET /api/analyze/results
 * Risultati ultima analisi
 */
router.get('/results', (req, res) => {
  if (!analysisStatus.results) {
    return res.status(404).json({
      success: false,
      error: 'Nessun risultato disponibile'
    });
  }

  res.json({
    success: true,
    results: analysisStatus.results
  });
});

/**
 * Funzione per avviare analisi in background
 */
function startBackgroundAnalysis(files) {
  analysisStatus = {
    isRunning: true,
    progress: 0,
    currentStep: 'Inizio analisi',
    results: null,
    error: null,
    startTime: new Date(),
    endTime: null
  };

  // Esegui script Python in sequenza
  runAnalysisPipeline(files);
}

/**
 * Pipeline di analisi completa
 */
async function runAnalysisPipeline(files) {
  const steps = [
    { script: 'scripts/analyze_pdfs.py', name: 'Analisi PDF', progress: 20 },
    { script: 'scripts/analyze_images.py', name: 'Analisi Immagini', progress: 40 },
    { script: 'scripts/auto_categorize.py', name: 'Categorizzazione', progress: 60 },
    { script: 'scripts/file_organizer.py', name: 'Organizzazione File', progress: 75 },
    { script: 'scripts/data_validator.py', name: 'Validazione Dati', progress: 85 },
    { script: 'scripts/documentation_generator.py', name: 'Generazione Documentazione', progress: 95 },
    { script: 'scripts/import_products.js', name: 'Import Prodotti', progress: 100 }
  ];

  try {
    for (const step of steps) {
      analysisStatus.currentStep = step.name;
      analysisStatus.progress = step.progress - 5;

      await runPythonScript(step.script);

      analysisStatus.progress = step.progress;
    }

    // Carica risultati
    const results = loadAnalysisResults();
    
    analysisStatus.results = results;
    analysisStatus.isRunning = false;
    analysisStatus.currentStep = 'Completato';
    analysisStatus.endTime = new Date();

    console.log('✅ Analisi completata con successo');

  } catch (error) {
    console.error('❌ Errore durante l\'analisi:', error);
    analysisStatus.error = error.message;
    analysisStatus.isRunning = false;
    analysisStatus.currentStep = 'Errore';
    analysisStatus.endTime = new Date();
  }
}

/**
 * Esegue uno script Python
 */
function runPythonScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const python = process.platform === 'win32' ? 'python' : 'python3';
    const process = spawn(python, [scriptPath], {
      cwd: process.cwd(),
      shell: true
    });

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log(`[${scriptPath}]`, data.toString());
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(`[${scriptPath}]`, data.toString());
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Script ${scriptPath} fallito con codice ${code}: ${stderr}`));
      }
    });

    process.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Carica i risultati dell'analisi
 */
function loadAnalysisResults() {
  const results = {
    pdfs: [],
    images: [],
    products: [],
    categories: [],
    statistics: {}
  };

  // Carica analisi PDF
  const pdfAnalysisPath = 'data/extracted/pdf_analysis_complete.json';
  if (fs.existsSync(pdfAnalysisPath)) {
    results.pdfs = JSON.parse(fs.readFileSync(pdfAnalysisPath, 'utf8'));
  }

  // Carica analisi immagini
  const imageAnalysisPath = 'data/extracted/images/image_analysis.json';
  if (fs.existsSync(imageAnalysisPath)) {
    results.images = JSON.parse(fs.readFileSync(imageAnalysisPath, 'utf8'));
  }

  // Carica prodotti categorizzati
  const productsPath = 'data/extracted/categorized_products.json';
  if (fs.existsSync(productsPath)) {
    results.products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  }

  // Calcola statistiche
  results.statistics = {
    totalPdfs: results.pdfs.length,
    totalImages: results.images.length,
    totalProducts: results.products.length,
    categories: [...new Set(results.products.map(p => p.category))],
    brands: [...new Set(results.products.map(p => p.brand))]
  };

  return results;
}

module.exports = router;
