/**
 * AIRKLIM Backend - Scanner Service
 * Servizio per esecuzione automatica scanner PDF/immagini
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ScannerService {
  constructor() {
    this.isRunning = false;
    this.currentStep = '';
    this.progress = 0;
    this.logs = [];
    this.results = null;
    this.startTime = null;
    this.endTime = null;
    this.process = null;
  }

  /**
   * Avvia scansione completa
   */
  async startScan() {
    if (this.isRunning) {
      throw new Error('Scansione già in corso');
    }

    this.isRunning = true;
    this.progress = 0;
    this.logs = [];
    this.results = null;
    this.startTime = new Date();
    this.endTime = null;

    try {
      // Step 1: Analisi PDF
      await this.executeStep('Analisi PDF in corso...', 'scripts/analyze_pdfs.py', 20);

      // Step 2: Analisi Immagini
      await this.executeStep('Analisi immagini in corso...', 'scripts/analyze_images.py', 40);

      // Step 3: Categorizzazione
      await this.executeStep('Categorizzazione prodotti...', 'scripts/auto_categorize.py', 60);

      // Step 4: Organizzazione File
      await this.executeStep('Organizzazione file...', 'scripts/file_organizer.py', 75);

      // Step 5: Validazione
      await this.executeStep('Validazione dati...', 'scripts/data_validator.py', 85);

      // Step 6: Generazione Documentazione
      await this.executeStep('Generazione documentazione...', 'scripts/documentation_generator.py', 95);

      // Step 7: Import Prodotti
      await this.executeStep('Import prodotti nel database...', 'scripts/import_products.js', 100);

      // Carica risultati
      this.results = this.loadResults();
      
      this.isRunning = false;
      this.currentStep = 'Completato';
      this.endTime = new Date();

      return {
        success: true,
        results: this.results
      };

    } catch (error) {
      this.isRunning = false;
      this.currentStep = 'Errore';
      this.endTime = new Date();
      this.addLog(`ERRORE: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Esegue uno step della scansione
   */
  executeStep(stepName, scriptPath, targetProgress) {
    return new Promise((resolve, reject) => {
      this.currentStep = stepName;
      this.addLog(stepName, 'info');

      const isPython = scriptPath.endsWith('.py');
      const command = isPython ? 'python3' : 'node';
      
      this.process = spawn(command, [scriptPath], {
        cwd: process.cwd(),
        shell: true
      });

      let output = '';

      this.process.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        this.addLog(text.trim(), 'info');
      });

      this.process.stderr.on('data', (data) => {
        const text = data.toString();
        this.addLog(text.trim(), 'warning');
      });

      this.process.on('close', (code) => {
        if (code === 0) {
          this.progress = targetProgress;
          this.addLog(`✓ ${stepName} completato`, 'success');
          resolve(output);
        } else {
          reject(new Error(`Script ${scriptPath} fallito con codice ${code}`));
        }
      });

      this.process.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Ferma scansione in corso
   */
  stopScan() {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
    this.isRunning = false;
    this.currentStep = 'Fermato';
    this.addLog('Scansione fermata dall\'utente', 'warning');
  }

  /**
   * Aggiungi log
   */
  addLog(message, type = 'info') {
    this.logs.push({
      timestamp: new Date().toISOString(),
      message,
      type
    });

    // Mantieni solo ultimi 100 log
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
  }

  /**
   * Carica risultati da file
   */
  loadResults() {
    const results = {
      pdfs: [],
      images: [],
      products: [],
      statistics: {}
    };

    // Carica analisi PDF
    const pdfPath = 'data/extracted/pdf_analysis_complete.json';
    if (fs.existsSync(pdfPath)) {
      try {
        results.pdfs = JSON.parse(fs.readFileSync(pdfPath, 'utf8'));
      } catch (e) {
        this.addLog(`Errore caricamento PDF: ${e.message}`, 'error');
      }
    }

    // Carica analisi immagini
    const imagePath = 'data/extracted/images/image_analysis.json';
    if (fs.existsSync(imagePath)) {
      try {
        results.images = JSON.parse(fs.readFileSync(imagePath, 'utf8'));
      } catch (e) {
        this.addLog(`Errore caricamento immagini: ${e.message}`, 'error');
      }
    }

    // Carica prodotti categorizzati
    const productsPath = 'data/extracted/categorized_products.json';
    if (fs.existsSync(productsPath)) {
      try {
        results.products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      } catch (e) {
        this.addLog(`Errore caricamento prodotti: ${e.message}`, 'error');
      }
    }

    // Calcola statistiche
    results.statistics = {
      totalPdfs: results.pdfs.length,
      totalImages: results.images.length,
      totalProducts: results.products.length,
      categories: [...new Set(results.products.map(p => p.category))],
      brands: [...new Set(results.products.map(p => p.brand))],
      duration: this.endTime ? (this.endTime - this.startTime) / 1000 : 0
    };

    return results;
  }

  /**
   * Ottieni stato corrente
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      currentStep: this.currentStep,
      progress: this.progress,
      logs: this.logs.slice(-20), // Ultimi 20 log
      results: this.results,
      startTime: this.startTime,
      endTime: this.endTime
    };
  }

  /**
   * Ottieni risultati completi
   */
  getResults() {
    return this.results || this.loadResults();
  }
}

// Singleton instance
const scannerService = new ScannerService();

module.exports = scannerService;
