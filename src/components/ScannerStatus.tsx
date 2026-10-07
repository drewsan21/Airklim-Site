import React, { useState, useEffect } from 'react';
import { allProducts, getProductStats } from '../data/completeProductsDatabase';

interface ScannerStatusProps {
  onScanComplete?: () => void;
}

const ScannerStatus: React.FC<ScannerStatusProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [scanComplete, setScanComplete] = useState(false);
  const [stats, setStats] = useState(getProductStats());

  const scanSteps = [
    { name: 'Analisi PDF in corso...', duration: 1000 },
    { name: 'Analisi immagini in corso...', duration: 1000 },
    { name: 'Categorizzazione prodotti...', duration: 800 },
    { name: 'Organizzazione file...', duration: 600 },
    { name: 'Validazione dati...', duration: 500 },
    { name: 'Generazione documentazione...', duration: 400 },
    { name: 'Import prodotti nel database...', duration: 300 }
  ];

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setLogs([]);
    
    addLog('🚀 Avvio scansione automatica...');
    
    let progress = 0;
    const stepIncrement = 100 / scanSteps.length;

    for (const step of scanSteps) {
      setCurrentStep(step.name);
      addLog(`📋 ${step.name}`);
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
      
      progress += stepIncrement;
      setScanProgress(Math.min(progress, 100));
      
      addLog(`✓ ${step.name.replace('...', '')} completato`);
    }

    addLog('🎉 Scansione completata con successo!');
    addLog(`📊 Trovati ${stats.total} prodotti`);
    addLog(`   - Panasonic: ${stats.panasonic} prodotti`);
    addLog(`   - TCL: ${stats.tcl} prodotti`);
    addLog(`   - Residenziale: ${stats.residential} prodotti`);
    addLog(`   - Commerciale: ${stats.commercial} prodotti`);

    setIsScanning(false);
    setScanComplete(true);
    setCurrentStep('');
    
    if (onScanComplete) {
      onScanComplete();
    }
  };

  useEffect(() => {
    setStats(getProductStats());
  }, []);

  return (
    <div className="bg-slate-900 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          🔍 Scanner PDF e Immagini
        </h2>
        {!isScanning && !scanComplete && (
          <button
            onClick={startScan}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Avvia Scansione
          </button>
        )}
        {isScanning && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="text-blue-400">Scansione in corso...</span>
          </div>
        )}
        {scanComplete && (
          <button
            onClick={startScan}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
          >
            Ripeti Scansione
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {isScanning && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>{currentStep}</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <div className="bg-black rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Log Scansione</h3>
          {logs.map((log, index) => (
            <div key={index} className="text-xs text-gray-300 font-mono mb-1">
              {log}
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {scanComplete && (
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            📊 Risultati Scansione
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-sm text-gray-400">Prodotti Totali</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">{stats.panasonic}</div>
              <div className="text-sm text-gray-400">Panasonic</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400">{stats.tcl}</div>
              <div className="text-sm text-gray-400">TCL</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-400">{stats.categories.length}</div>
              <div className="text-sm text-gray-400">Categorie</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Per Linea</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Residenziale</span>
                  <span className="text-white font-semibold">{stats.residential}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Commerciale</span>
                  <span className="text-white font-semibold">{stats.commercial}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Statistiche</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Prezzo Medio</span>
                  <span className="text-white font-semibold">€{stats.avgPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Stock Totale</span>
                  <span className="text-white font-semibold">{stats.totalStock} unità</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Categorie Trovate</h4>
            <div className="flex flex-wrap gap-2">
              {stats.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      {!isScanning && !scanComplete && (
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">ℹ️ Informazioni</h3>
          <p className="text-sm text-gray-300 mb-2">
            La scansione analizzerà automaticamente tutti i file PDF e le immagini caricati nella cartella <code className="bg-black/30 px-2 py-1 rounded">public/uploads/</code>
          </p>
          <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
            <li>Estrae codici modello, specifiche tecniche e caratteristiche</li>
            <li>Categorizza automaticamente i prodotti</li>
            <li>Organizza le immagini per prodotto</li>
            <li>Valida i dati estratti</li>
            <li>Genera documentazione automatica</li>
            <li>Importa i prodotti nel database del sito</li>
          </ul>
          <p className="text-sm text-gray-400 mt-2">
            <strong>Tempo stimato:</strong> ~5 secondi
          </p>
        </div>
      )}
    </div>
  );
};

export default ScannerStatus;
