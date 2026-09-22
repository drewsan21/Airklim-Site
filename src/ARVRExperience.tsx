/**
 * AIRKLIM AR/VR Experience
 * Visualizzatore AR, showroom virtuale, modelli 3D
 */

import { useState, useEffect, useRef } from 'react';

// ===== AR PRODUCT VIEWER =====
export function ARProductViewer({ product, onClose }: { product: any; onClose: () => void }) {
  const [arSupported, setArSupported] = useState(false);
  const [arActive, setArActive] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check WebXR support
    if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setArSupported(supported);
      });
    }

    // Simulate model loading
    setTimeout(() => setModelLoaded(true), 1500);
  }, []);

  const startARSession = async () => {
    if (!arSupported) {
      alert('AR non supportato su questo dispositivo. Usa un dispositivo mobile compatibile.');
      return;
    }

    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.getElementById('ar-overlay') }
      });

      setArActive(true);
      
      session.addEventListener('end', () => {
        setArActive(false);
      });

      // Setup WebGL context
      const canvas = canvasRef.current;
      if (canvas) {
        const gl = canvas.getContext('webgl2', { xrCompatible: true });
        if (gl) {
          await session.updateRenderState({
            baseLayer: new (window as any).XRRigidTransform(gl)
          });
        }
      }
    } catch (error) {
      console.error('Error starting AR session:', error);
      alert('Impossibile avviare la sessione AR');
    }
  };

  const handleRotate = (axis: 'x' | 'y' | 'z', delta: number) => {
    setRotation(prev => ({
      ...prev,
      [axis]: prev[axis] + delta
    }));
  };

  const handleScale = (delta: number) => {
    setScale(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Visualizza in AR</h2>
          <p className="text-sm text-white/50">{product.name}</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* AR Viewport */}
      <div id="ar-overlay" className="flex-1 relative">
        {!modelLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60">Caricamento modello 3D...</p>
            </div>
          </div>
        ) : (
          <>
            {/* 3D Model Placeholder */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) scale(${scale})`
              }}
            >
              <div className="w-64 h-64 bg-gradient-to-br from-sky-500/20 to-blue-600/20 rounded-2xl border-2 border-sky-500/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <div className="text-white font-bold">{product.name}</div>
                  <div className="text-white/50 text-sm mt-2">{product.power} kW</div>
                </div>
              </div>
            </div>

            {/* AR Instructions */}
            {!arActive && (
              <div className="absolute bottom-24 left-4 right-4 bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2">Come usare la visualizzazione AR</h3>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• Punta la fotocamera verso una superficie piana</li>
                  <li>• Tocca per posizionare il prodotto</li>
                  <li>• Usa i gesti per ruotare e ridimensionare</li>
                  <li>• Tocca "Avvia AR" per iniziare</li>
                </ul>
              </div>
            )}
          </>
        )}

        {/* Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-3">
          <button
            onClick={startARSession}
            disabled={!arSupported || arActive}
            className="flex-1 px-6 py-4 bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl font-semibold transition-all"
          >
            {arActive ? '🔴 Sessione AR Attiva' : '📱 Avvia AR'}
          </button>
        </div>

        {/* Rotation Controls */}
        <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-xl rounded-xl p-3 border border-white/10 space-y-2">
          <button
            onClick={() => handleRotate('y', 45)}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
          >
            ↻
          </button>
          <button
            onClick={() => handleRotate('y', -45)}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
          >
            ↺
          </button>
          <button
            onClick={() => handleScale(0.1)}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
          >
            +
          </button>
          <button
            onClick={() => handleScale(-0.1)}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
          >
            −
          </button>
        </div>
      </div>

      {/* Canvas for WebGL */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// ===== VIRTUAL SHOWROOM =====
export function VirtualShowroom() {
  const [currentRoom, setCurrentRoom] = useState('living');
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const rooms = [
    { id: 'living', name: 'Soggiorno', icon: '🛋️', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop' },
    { id: 'bedroom', name: 'Camera', icon: '🛏️', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop' },
    { id: 'office', name: 'Ufficio', icon: '💼', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop' },
    { id: 'kitchen', name: 'Cucina', icon: '🍳', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop' }
  ];

  const products = [
    { id: 'etherea-z35', name: 'Panasonic Etherea Z35', price: 1390, category: 'wall' },
    { id: 'tz35', name: 'Panasonic TZ35', price: 1190, category: 'wall' },
    { id: 'console-z35', name: 'Console Z35', price: 1690, category: 'floor' },
    { id: 'ducted-z35', name: 'Canalizzata Z35', price: 1990, category: 'ceiling' }
  ];

  const currentRoomData = rooms.find(r => r.id === currentRoom);

  const addProductToRoom = (product: any) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  return (
    <section id="showroom" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Showroom Virtuale 3D
          </h2>
          <p className="text-white/50 text-lg">
            Visualizza i prodotti nel tuo ambiente prima di acquistare
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Room Selector */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
              <img
                src={currentRoomData?.image}
                alt={currentRoomData?.name}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with products */}
              <div className="absolute inset-0 flex items-center justify-center">
                {selectedProducts.map((product, i) => (
                  <div
                    key={i}
                    className="absolute bg-sky-500/20 border-2 border-sky-500 rounded-lg p-4 backdrop-blur-sm"
                    style={{
                      top: `${30 + i * 10}%`,
                      left: `${40 + i * 5}%`
                    }}
                  >
                    <div className="text-white text-sm font-semibold">{product.name}</div>
                    <div className="text-sky-400 text-xs">€{product.price}</div>
                  </div>
                ))}
              </div>

              {/* Room name overlay */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-white font-semibold">{currentRoomData?.icon} {currentRoomData?.name}</div>
              </div>
            </div>

            {/* Room selector buttons */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {rooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(room.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    currentRoom === room.id
                      ? 'bg-sky-500/10 border-sky-500/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{room.icon}</div>
                  <div className="text-xs text-white font-medium">{room.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Selector */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Scegli Prodotti</h3>
            <div className="space-y-3">
              {products.map(product => (
                <div
                  key={product.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-sky-500/30 transition-all cursor-pointer"
                  onClick={() => addProductToRoom(product)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{product.name}</div>
                      <div className="text-xs text-white/50">{product.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sky-400">€{product.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedProducts([])}
              className="w-full mt-4 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
            >
              🗑️ Pulisci Stanza
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== 3D MODEL VIEWER =====
export function Model3DViewer({ modelUrl }: { modelUrl: string }) {
  const [isRotating, setIsRotating] = useState(true);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
      {/* 3D Model Placeholder */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `scale(${zoom}) ${isRotating ? 'rotateY(360deg)' : ''}`,
          animation: isRotating ? 'spin 10s linear infinite' : 'none'
        }}
      >
        <div className="w-48 h-48 bg-gradient-to-br from-sky-500/30 to-blue-600/30 rounded-2xl border-2 border-sky-500/50 flex items-center justify-center">
          <div className="text-6xl">📦</div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all"
        >
          {isRotating ? '⏸️ Pausa' : '▶️ Ruota'}
        </button>
        <button
          onClick={() => setZoom(z => Math.min(2, z + 0.2))}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all"
        >
          🔍+
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all"
        >
          🔍−
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotateY(0deg) scale(${zoom}); }
          to { transform: rotateY(360deg) scale(${zoom}); }
        }
      `}</style>
    </div>
  );
}

export default {
  ARProductViewer,
  VirtualShowroom,
  Model3DViewer
};
