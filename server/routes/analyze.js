/**
 * AIRKLIM Backend - Analisi Automatica PDF e Immagini
 * Endpoint API per upload e analisi automatica in background
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const scannerService = require('../services/scannerService');

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
    status: scannerService.getStatus()
  });
});

/**
 * POST /api/analyze/start
 * Avvia analisi manuale
 */
router.post('/start', async (req, res) => {
  try {
    if (scannerService.getStatus().isRunning) {
      return res.status(400).json({
        success: false,
        error: 'Analisi già in corso'
      });
    }

    // Avvia scansione in background
    scannerService.startScan().catch(error => {
      console.error('Errore durante la scansione:', error);
    });

    res.json({
      success: true,
      message: 'Analisi avviata'
    });

  } catch (error) {
    console.error('Errore avvio analisi:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/analyze/stop
 * Ferma analisi in corso
 */
router.post('/stop', (req, res) => {
  try {
    if (!scannerService.getStatus().isRunning) {
      return res.status(400).json({
        success: false,
        error: 'Nessuna analisi in corso'
      });
    }

    scannerService.stopScan();

    res.json({
      success: true,
      message: 'Analisi fermata'
    });

  } catch (error) {
    console.error('Errore stop analisi:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analyze/results
 * Risultati ultima analisi
 */
router.get('/results', (req, res) => {
  try {
    const results = scannerService.getResults();
    
    if (!results || results.totalProducts === 0) {
      return res.status(404).json({
        success: false,
        error: 'Nessun risultato disponibile'
      });
    }

    res.json({
      success: true,
      results: results
    });

  } catch (error) {
    console.error('Errore caricamento risultati:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Funzione per avviare analisi in background (usa scannerService)
 */
function startBackgroundAnalysis(files) {
  // Avvia scansione tramite scannerService
  scannerService.startScan().catch(error => {
    console.error('Errore durante la scansione:', error);
  });
}

module.exports = router;
