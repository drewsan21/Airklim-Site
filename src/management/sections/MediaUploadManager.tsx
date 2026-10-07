import { useState, useRef } from 'react';

export function MediaUploadManager() {
  const [activeTab, setActiveTab] = useState<'images' | 'pdfs'>('images');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadedFiles([]);

    const fileArray = Array.from(files);
    const totalFiles = fileArray.length;
    let processedFiles = 0;

    for (const file of fileArray) {
      try {
        // Simula upload (in produzione, usa API reale)
        await simulateUpload(file);
        processedFiles++;
        setUploadProgress((processedFiles / totalFiles) * 100);
        setUploadedFiles(prev => [...prev, file.name]);
      } catch (error) {
        console.error(`Errore upload ${file.name}:`, error);
      }
    }

    setUploading(false);
  };

  const simulateUpload = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In produzione: upload reale al server
        console.log(`File caricato: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        resolve();
      }, 500);
    });
  };

  const handleExtractProducts = async () => {
    setExtracting(true);
    setExtractionStatus('Inizio estrazione prodotti dai PDF...');

    // Simula estrazione (in produzione, esegui script reale)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setExtractionStatus('Analisi PDF in corso...');

    await new Promise(resolve => setTimeout(resolve, 2000));
    setExtractionStatus('Identificazione prodotti...');

    await new Promise(resolve => setTimeout(resolve, 1500));
    setExtractionStatus('Estrazione specifiche tecniche...');

    await new Promise(resolve => setTimeout(resolve, 1000));
    setExtractionStatus('Estrazione completata!');

    await new Promise(resolve => setTimeout(resolve, 500));
    setExtracting(false);
    setExtractionStatus('');

    // In produzione:
    // 1. Esegui: node scripts/extract-products.js
    // 2. Mostra risultati estrazione
    // 3. Permetti verifica manuale
    // 4. Importa nel database
  };

  const handleOptimizeImages = async () => {
    setUploading(true);
    setUploadProgress(0);
    setExtractionStatus('Ottimizzazione immagini in corso...');

    // Simula ottimizzazione
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    setExtractionStatus('Ottimizzazione completata!');
    setUploading(false);

    setTimeout(() => setExtractionStatus(''), 2000);

    // In produzione:
    // Esegui: node scripts/optimize-images.js
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestione Media</h1>
          <p className="text-white/50">Carica immagini prodotti e cataloghi PDF</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab('images')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'images'
              ? 'text-sky-400 border-b-2 border-sky-400'
              : 'text-white/50 hover:text-white'
          }`}
        >
          🖼️ Immagini Prodotti
        </button>
        <button
          onClick={() => setActiveTab('pdfs')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'pdfs'
              ? 'text-sky-400 border-b-2 border-sky-400'
              : 'text-white/50 hover:text-white'
          }`}
        >
          📄 Cataloghi PDF
        </button>
      </div>

      {/* Upload Area */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-8">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-sky-500/50 hover:bg-sky-500/5 transition-all"
        >
          <div className="text-6xl mb-4">
            {activeTab === 'images' ? '🖼️' : '📄'}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {activeTab === 'images'
              ? 'Carica Immagini Prodotti'
              : 'Carica Cataloghi PDF'}
          </h3>
          <p className="text-white/50 mb-4">
            {activeTab === 'images'
              ? 'Trascina qui le immagini o clicca per selezionarle'
              : 'Trascina qui i PDF o clicca per selezionarli'}
          </p>
          <p className="text-sm text-white/40">
            {activeTab === 'images'
              ? 'Formati supportati: JPG, PNG, WebP (max 5MB)'
              : 'Formati supportati: PDF (max 50MB)'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={activeTab === 'images' ? 'image/*' : '.pdf'}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">Caricamento in corso...</span>
              <span className="text-sm text-white/70">{uploadProgress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-white mb-3">
              File caricati ({uploadedFiles.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadedFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="text-2xl">
                    {activeTab === 'images' ? '🖼️' : '📄'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">{file}</div>
                    <div className="text-xs text-green-400">✓ Caricato</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {activeTab === 'images' && uploadedFiles.length > 0 && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Azioni Immagini</h3>
          <div className="flex gap-3">
            <button
              onClick={handleOptimizeImages}
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl font-semibold transition-all"
            >
              {uploading ? 'Ottimizzazione...' : '⚡ Ottimizza Immagini'}
            </button>
            <button
              onClick={() => {
                // In produzione: esegui script check-missing-images
                alert('Verifica immagini mancanti...\n\nEsegui: node scripts/check-missing-images.js');
              }}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
            >
              🔍 Verifica Mancanti
            </button>
          </div>
        </div>
      )}

      {activeTab === 'pdfs' && uploadedFiles.length > 0 && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Azioni PDF</h3>
          <div className="space-y-4">
            <button
              onClick={handleExtractProducts}
              disabled={extracting}
              className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl font-semibold transition-all"
            >
              {extracting ? 'Estrazione in corso...' : '🔍 Estrai Prodotti dai PDF'}
            </button>

            {extractionStatus && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✅</div>
                  <div className="text-green-400 font-medium">{extractionStatus}</div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-semibold text-white mb-2">Cosa fa l'estrazione:</h4>
              <ul className="space-y-1 text-sm text-white/60">
                <li>• Identifica codici modello (es: CS-XZ20CKEW-H)</li>
                <li>• Estrae specifiche tecniche (SEER, SCOP, dimensioni)</li>
                <li>• Identifica caratteristiche (nanoe™ X, Wi-Fi, ecc.)</li>
                <li>• Genera file JSON e TypeScript</li>
                <li>• Crea report di estrazione dettagliato</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 rounded-2xl border border-sky-500/20 p-6">
        <h3 className="text-lg font-bold text-white mb-3">💡 Istruzioni</h3>
        <div className="space-y-2 text-sm text-white/70">
          {activeTab === 'images' ? (
            <>
              <p><strong>1.</strong> Scarica le immagini ufficiali dal portale PRO Partner Panasonic</p>
              <p><strong>2.</strong> Organizza le immagini nelle cartelle corrette (es: panasonic/etherea/xz-grafite/)</p>
              <p><strong>3.</strong> Carica le immagini usando il box sopra</p>
              <p><strong>4.</strong> Clicca "Ottimizza Immagini" per generare thumbnail e versioni ottimizzate</p>
              <p><strong>5.</strong> Verifica che tutte le immagini siano caricate con "Verifica Mancanti"</p>
            </>
          ) : (
            <>
              <p><strong>1.</strong> Scarica i cataloghi PDF dal portale PRO Partner Panasonic</p>
              <p><strong>2.</strong> Assicurati che i PDF abbiano testo selezionabile (non scansionati)</p>
              <p><strong>3.</strong> Carica i PDF usando il box sopra</p>
              <p><strong>4.</strong> Clicca "Estrai Prodotti dai PDF" per estrarre automaticamente i dati</p>
              <p><strong>5.</strong> Verifica i dati estratti nel file <code className="bg-black/30 px-2 py-1 rounded">data/extracted-products.json</code></p>
              <p><strong>6.</strong> Importa i prodotti nel database con <code className="bg-black/30 px-2 py-1 rounded">npm run import-products</code></p>
            </>
          )}
        </div>
      </div>

      {/* Quick Commands */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-3">⌨️ Comandi Rapidi (Terminale)</h3>
        <div className="space-y-2 text-sm font-mono">
          <div className="p-3 rounded-lg bg-black/30 text-white/80">
            <span className="text-green-400">$</span> node scripts/extract-products.js
          </div>
          <div className="p-3 rounded-lg bg-black/30 text-white/80">
            <span className="text-green-400">$</span> node scripts/optimize-images.js
          </div>
          <div className="p-3 rounded-lg bg-black/30 text-white/80">
            <span className="text-green-400">$</span> node scripts/check-missing-images.js
          </div>
          <div className="p-3 rounded-lg bg-black/30 text-white/80">
            <span className="text-green-400">$</span> node scripts/import-products.js
          </div>
        </div>
      </div>
    </div>
  );
}
