import { useState } from 'react';

// ===== 1. CONTO TERMICO 3.0 CALCULATOR =====
export function ContoTermicoCalculator() {
  const [potenza, setPotenza] = useState(3.5);
  const [tipo, setTipo] = useState('pompa-calore');
  const [zona, setZona] = useState('zona-1');

  const calcolaIncentivo = () => {
    // Simulated Conto Termico 3.0 calculation
    const baseIncentive = tipo === 'pompa-calore' ? 1200 : 800;
    const powerMultiplier = potenza / 3.5;
    const zoneMultiplier = zona === 'zona-1' ? 1.2 : zona === 'zona-2' ? 1.0 : 0.8;
    return Math.round(baseIncentive * powerMultiplier * zoneMultiplier);
  };

  const incentivo = calcolaIncentivo();

  return (
    <section id="conto-termico" className="py-24 bg-gradient-to-b from-slate-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-green-400 font-semibold text-sm uppercase tracking-wider">Incentivi Statali</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Conto Termico 3.0<br />
            <span className="text-gradient">Risparmia fino al 65%</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Calcola subito l'incentivo statale per la sostituzione del tuo vecchio impianto con uno ad alta efficienza.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-8 space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Tipologia Impianto</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-green-500 outline-none"
                >
                  <option value="pompa-calore">Pompa di Calore</option>
                  <option value="caldaia">Caldaia a Condensazione</option>
                  <option value="climatizzatore">Climatizzatore Inverter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Potenza (kW)</label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="0.5"
                  value={potenza}
                  onChange={(e) => setPotenza(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-2xl font-bold text-green-400 mt-2">{potenza} kW</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Zona Climatica</label>
                <select
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-green-500 outline-none"
                >
                  <option value="zona-1">Zona 1 (Nord Italia)</option>
                  <option value="zona-2">Zona 2 (Centro Italia)</option>
                  <option value="zona-3">Zona 3 (Sud Italia)</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-8 border border-green-500/20">
              <div className="text-center">
                <div className="text-sm text-green-400 mb-2">Incentivo Stimato Conto Termico 3.0</div>
                <div className="text-5xl font-bold text-white mb-2">€ {incentivo.toLocaleString()}</div>
                <div className="text-white/50 text-sm">Detrazione fiscale applicabile in 5 anni</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-2xl font-bold text-green-400">65%</div>
                <div className="text-xs text-white/40 mt-1">Detrazione massima</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-2xl font-bold text-green-400">5 anni</div>
                <div className="text-xs text-white/40 mt-1">Rate detrazione</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-2xl font-bold text-green-400">2026</div>
                <div className="text-xs text-white/40 mt-1">Validità incentivo</div>
              </div>
            </div>

            <a href="#contatti" className="block w-full text-center px-8 py-4 bg-green-500 hover:bg-green-400 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-green-500/25">
              Richiedi Consulenza Gratuita
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== 2. BTU ROOM CALCULATOR =====
export function BTUCalculator() {
  const [larghezza, setLarghezza] = useState(4);
  const [lunghezza, setLunghezza] = useState(5);
  const [altezza, setAltezza] = useState(2.7);
  const [esposizione, setEsposizione] = useState('sud');
  const [persone, setPersone] = useState(2);

  const calcolaBTU = () => {
    const volume = larghezza * lunghezza * altezza;
    const baseBTU = volume * 340; // 340 BTU per m³
    
    const esposizioneMultiplier = esposizione === 'sud' ? 1.3 : esposizione === 'ovest' ? 1.2 : esposizione === 'est' ? 1.1 : 1.0;
    const personeMultiplier = 1 + (persone - 1) * 0.1;
    
    return Math.round(baseBTU * esposizioneMultiplier * personeMultiplier);
  };

  const btu = calcolaBTU();
  const kw = (btu / 3412).toFixed(1);

  const getProductRecommendation = () => {
    if (btu <= 9000) return 'Climatizzatore 9000 BTU';
    if (btu <= 12000) return 'Climatizzatore 12000 BTU';
    if (btu <= 18000) return 'Climatizzatore 18000 BTU';
    if (btu <= 24000) return 'Climatizzatore 24000 BTU';
    return 'Sistema Multi-Split';
  };

  return (
    <section id="btu-calculator" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Strumento Intelligente</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Calcolatore BTU<br />
            <span className="text-gradient">Trova la Potenza Ideale</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Inserisci le dimensioni della stanza e ti consiglieremo il climatizzatore perfetto.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Larghezza Stanza (m)</label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={larghezza}
                    onChange={(e) => setLarghezza(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-sky-400">{larghezza} m</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Lunghezza Stanza (m)</label>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="0.5"
                    value={lunghezza}
                    onChange={(e) => setLunghezza(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-sky-400">{lunghezza} m</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Altezza Soffitto (m)</label>
                  <input
                    type="range"
                    min="2.4"
                    max="4"
                    step="0.1"
                    value={altezza}
                    onChange={(e) => setAltezza(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-sky-400">{altezza} m</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Esposizione Solare</label>
                  <select
                    value={esposizione}
                    onChange={(e) => setEsposizione(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                  >
                    <option value="nord">Nord (meno soleggiata)</option>
                    <option value="est">Est</option>
                    <option value="ovest">Ovest</option>
                    <option value="sud">Sud (più soleggiata)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Numero Persone Abituali</label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={persone}
                    onChange={(e) => setPersone(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-sky-400">{persone} persone</div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 rounded-2xl p-6 border border-sky-500/20">
                  <div className="text-center space-y-4">
                    <div>
                      <div className="text-sm text-sky-400 mb-1">Superficie Stanza</div>
                      <div className="text-3xl font-bold text-white">{(larghezza * lunghezza).toFixed(1)} m²</div>
                    </div>
                    <div>
                      <div className="text-sm text-sky-400 mb-1">Volume Stanza</div>
                      <div className="text-3xl font-bold text-white">{(larghezza * lunghezza * altezza).toFixed(1)} m³</div>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <div className="text-sm text-sky-400 mb-1">BTU Necessari</div>
                      <div className="text-4xl font-bold text-white">{btu.toLocaleString()} BTU</div>
                      <div className="text-lg text-sky-400 mt-1">{kw} kW</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="text-sm text-white/60 mb-2">Prodotto Consigliato:</div>
                  <div className="text-xl font-bold text-white mb-4">{getProductRecommendation()}</div>
                  <a href="#prodotti" className="block w-full text-center px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all">
                    Vedi Prodotti
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== 3. PRODUCT COMPARISON TOOL =====
export function ProductComparison() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const products = [
    { id: 'panasonic-z35', name: 'Panasonic Etherea Z35', btu: '12000', kw: '3.5', seer: '8.5', scop: '5.1', db: '19', price: '€1.190', features: ['nanoe™ X', 'Wi-Fi', 'A+++'] },
    { id: 'tcl-breezein-12', name: 'TCL BreezeIN 12000', btu: '12000', kw: '3.5', seer: '6.3', scop: '4.0', db: '24', price: '€590', features: ['Gentle Breeze', 'Wi-Fi', 'A++'] },
    { id: 'panasonic-z25', name: 'Panasonic Etherea Z25', btu: '9000', kw: '2.5', seer: '8.5', scop: '5.1', db: '19', price: '€990', features: ['nanoe™ X', 'Wi-Fi', 'A+++'] },
    { id: 'tcl-breezein-18', name: 'TCL BreezeIN 18000', btu: '18000', kw: '5.0', seer: '6.1', scop: '4.0', db: '26', price: '€790', features: ['Gentle Breeze', 'Wi-Fi', 'A++'] },
  ];

  const toggleProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id));
    } else if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const selectedData = products.filter(p => selectedProducts.includes(p.id));

  return (
    <section id="confronta" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Strumento di Confronto</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Confronta i Prodotti<br />
            <span className="text-gradient">Scegli il Migliore per Te</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Seleziona fino a 3 prodotti e confronta caratteristiche, efficienza e prezzo.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedProducts.includes(product.id)
                  ? 'bg-sky-500/10 border-sky-500/50'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-sm font-semibold text-white mb-2">{product.name}</div>
              <div className="text-xs text-white/50">{product.btu} BTU • {product.kw} kW</div>
              <div className="text-lg font-bold text-sky-400 mt-2">{product.price}</div>
            </div>
          ))}
        </div>

        {selectedData.length > 0 && (
          <div className="bg-white/[0.03] rounded-3xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Caratteristica</th>
                    {selectedData.map(p => (
                      <th key={p.id} className="px-6 py-4 text-center text-sm font-bold text-white">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/60">Potenza</td>
                    {selectedData.map(p => <td key={p.id} className="px-6 py-4 text-center text-white">{p.kw} kW</td>)}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/60">BTU</td>
                    {selectedData.map(p => <td key={p.id} className="px-6 py-4 text-center text-white">{p.btu}</td>)}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/60">SEER (Raffrescamento)</td>
                    {selectedData.map(p => <td key={p.id} className="px-6 py-4 text-center text-green-400 font-semibold">{p.seer}</td>)}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/60">SCOP (Riscaldamento)</td>
                    {selectedData.map(p => <td key={p.id} className="px-6 py-4 text-center text-green-400 font-semibold">{p.scop}</td>)}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/60">Rumorosità</td>
                    {selectedData.map(p => <td key={p.id} className="px-6 py-4 text-center text-white">{p.db} dB(A)</td>)}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/60">Caratteristiche</td>
                    {selectedData.map(p => (
                      <td key={p.id} className="px-6 py-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {p.features.map((f, i) => <span key={i} className="text-xs px-2 py-1 rounded-full bg-sky-500/10 text-sky-400">{f}</span>)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-white/5">
                    <td className="px-6 py-4 text-sm font-semibold text-white">Prezzo</td>
                    {selectedData.map(p => <td key={p.id} className="px-6 py-4 text-center text-xl font-bold text-sky-400">{p.price}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ===== 4. WHATSAPP CHAT BUTTON =====
export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/390918691680?text=Ciao!%20Vorrei%20informazioni%20sui%20vostri%20prodotti."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25 transition-all hover:scale-110 lg:right-8"
      aria-label="Contattaci su WhatsApp"
    >
      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

// ===== 5. ENERGY SAVINGS SIMULATOR =====
export function EnergySavingsSimulator() {
  const [oreUso, setOreUso] = useState(8);
  const [mesiAnno, setMesiAnno] = useState(6);
  const [costoKWh, setCostoKWh] = useState(0.25);
  const [vecchioConsumo, setVecchioConsumo] = useState(1.5);
  const [nuovoConsumo, setNuovoConsumo] = useState(0.8);

  const consumoAnnuoVecchio = vecchioConsumo * oreUso * mesiAnno * 30;
  const consumoAnnuoNuovo = nuovoConsumo * oreUso * mesiAnno * 30;
  const risparmioAnnuo = (consumoAnnuoVecchio - consumoAnnuoNuovo) * costoKWh;
  const risparmio5Anni = risparmioAnnuo * 5;
  const risparmio10Anni = risparmioAnnuo * 10;

  return (
    <section id="risparmio" className="py-24 bg-gradient-to-b from-black to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-green-400 font-semibold text-sm uppercase tracking-wider">Simulatore Risparmio</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Quanto Risparmierai<br />
            <span className="text-gradient">con un Nuovo Impianto?</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Calcola il risparmio energetico ed economico passando a un climatizzatore ad alta efficienza.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Ore di Uso Giornaliero</label>
                  <input
                    type="range"
                    min="2"
                    max="16"
                    step="1"
                    value={oreUso}
                    onChange={(e) => setOreUso(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-green-400">{oreUso} ore/giorno</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Mesi di Utilizzo all'Anno</label>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="1"
                    value={mesiAnno}
                    onChange={(e) => setMesiAnno(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-green-400">{mesiAnno} mesi</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Costo Energia (€/kWh)</label>
                  <input
                    type="range"
                    min="0.15"
                    max="0.50"
                    step="0.05"
                    value={costoKWh}
                    onChange={(e) => setCostoKWh(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-green-400">€ {costoKWh.toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Consumo Vecchio Impianto (kW)</label>
                  <input
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.1"
                    value={vecchioConsumo}
                    onChange={(e) => setVecchioConsumo(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-red-400">{vecchioConsumo.toFixed(1)} kW</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Consumo Nuovo Impianto (kW)</label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={nuovoConsumo}
                    onChange={(e) => setNuovoConsumo(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-green-400">{nuovoConsumo.toFixed(1)} kW</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 text-center">
                <div className="text-sm text-green-400 mb-2">Risparmio Annuo</div>
                <div className="text-3xl font-bold text-white">€ {risparmioAnnuo.toFixed(0)}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 text-center">
                <div className="text-sm text-green-400 mb-2">Risparmio 5 Anni</div>
                <div className="text-3xl font-bold text-white">€ {risparmio5Anni.toFixed(0)}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 text-center">
                <div className="text-sm text-green-400 mb-2">Risparmio 10 Anni</div>
                <div className="text-3xl font-bold text-white">€ {risparmio10Anni.toFixed(0)}</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/60 mb-1">Riduzione Consumi</div>
                  <div className="text-2xl font-bold text-green-400">{(((vecchioConsumo - nuovoConsumo) / vecchioConsumo) * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">CO₂ Risparmiata/Anno</div>
                  <div className="text-2xl font-bold text-green-400">{((consumoAnnuoVecchio - consumoAnnuoNuovo) * 0.233).toFixed(0)} kg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== 6. PROMOTIONS SECTION =====
export function PromotionsSection() {
  const promotions = [
    {
      title: 'Panasonic Etherea -20%',
      description: 'Sconto dedicato sulla gamma Etherea Z e XZ. Offerta valida fino al 31 Marzo 2026.',
      badge: 'LIMITED',
      color: 'from-sky-500 to-blue-600',
      cta: 'Scopri di più'
    },
    {
      title: 'Conto Termico 3.0',
      description: 'Fino al 65% di detrazione per pompe di calore e caldaie ad alta efficienza.',
      badge: 'NEW',
      color: 'from-green-500 to-emerald-600',
      cta: 'Calcola incentivo'
    },
    {
      title: 'TCL BreezeIN Promo',
      description: 'Prezzi speciali sulla serie BreezeIN. Wi-Fi incluso e Gentle Breeze technology.',
      badge: 'HOT',
      color: 'from-amber-500 to-orange-600',
      cta: 'Vedi offerte'
    }
  ];

  return (
    <section id="offerte" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Offerte Speciali</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Promozioni in Corso<br />
            <span className="text-gradient">Non Perdere Queste Occasioni</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {promotions.map((promo, i) => (
            <div key={i} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${promo.color} text-white text-xs font-bold`}>
                {promo.badge}
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white">{promo.title}</h3>
                <p className="text-white/60">{promo.description}</p>
                <button className={`w-full px-6 py-3 bg-gradient-to-r ${promo.color} hover:opacity-90 text-white rounded-xl font-semibold transition-all`}>
                  {promo.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== 7. KNOWLEDGE BASE / VIDEO GUIDES =====
export function KnowledgeBase() {
  const articles = [
    {
      title: 'Come Scegliere il Climatizzatore Giusto',
      category: 'Guida all\'Acquisto',
      readTime: '5 min',
      icon: '📖'
    },
    {
      title: 'Manutenzione Ordinaria: Cosa Fare',
      category: 'Manutenzione',
      readTime: '3 min',
      icon: '🔧'
    },
    {
      title: 'Conto Termico 3.0: Guida Completa',
      category: 'Incentivi',
      readTime: '7 min',
      icon: '💰'
    },
    {
      title: 'nanoe™ X: Come Funziona',
      category: 'Tecnologia',
      readTime: '4 min',
      icon: '🔬'
    },
    {
      title: 'Installazione Fai-da-te: Cosa Sapere',
      category: 'Installazione',
      readTime: '6 min',
      icon: '🛠️'
    },
    {
      title: 'Risparmio Energetico: 10 Consigli',
      category: 'Efficienza',
      readTime: '4 min',
      icon: '⚡'
    }
  ];

  return (
    <section id="guide" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Centro Risorse</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Guide e Tutorial<br />
            <span className="text-gradient">Impara Tutto sui Climatizzatori</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Articoli, video e guide pratiche per scegliere, installare e mantenere il tuo impianto.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl mb-4">{article.icon}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-sky-500/10 text-sky-400">{article.category}</span>
                <span className="text-xs text-white/40">{article.readTime}</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">{article.title}</h3>
              <div className="mt-4 flex items-center text-sky-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Leggi l'articolo →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== 8. FINANCING CALCULATOR =====
export function FinancingCalculator() {
  const [prezzo, setPrezzo] = useState(1200);
  const [anticipo, setAnticipo] = useState(20);
  const [mesi, setMesi] = useState(12);
  const [taeg, setTaeg] = useState(8.5);

  const importoFinanziato = prezzo * (1 - anticipo / 100);
  const tassoMensile = taeg / 100 / 12;
  const rataMensile = (importoFinanziato * tassoMensile * Math.pow(1 + tassoMensile, mesi)) / (Math.pow(1 + tassoMensile, mesi) - 1);
  const totalePagato = rataMensile * mesi;
  const interessiTotali = totalePagato - importoFinanziato;

  return (
    <section id="finanziamento" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-purple-400 font-semibold text-sm uppercase tracking-wider">Soluzioni di Pagamento</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Calcolatore Finanziamento<br />
            <span className="text-gradient">Rate Personalizzate per Te</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Simula il tuo finanziamento e scopri quanto costa al mese il tuo nuovo climatizzatore.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Prezzo Prodotto (€)</label>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={prezzo}
                    onChange={(e) => setPrezzo(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-purple-400">€ {prezzo.toLocaleString()}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Anticipo (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={anticipo}
                    onChange={(e) => setAnticipo(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-purple-400">{anticipo}%</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Durata (mesi)</label>
                  <input
                    type="range"
                    min="6"
                    max="36"
                    step="6"
                    value={mesi}
                    onChange={(e) => setMesi(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-purple-400">{mesi} mesi</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">TAEG (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={taeg}
                    onChange={(e) => setTaeg(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-lg font-semibold text-purple-400">{taeg}%</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-sm text-purple-400 mb-2">Rata Mensile</div>
                  <div className="text-4xl font-bold text-white">€ {rataMensile.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-purple-400 mb-2">Importo Finanziato</div>
                  <div className="text-4xl font-bold text-white">€ {importoFinanziato.toFixed(0)}</div>
                </div>
                <div>
                  <div className="text-sm text-purple-400 mb-2">Interessi Totali</div>
                  <div className="text-4xl font-bold text-white">€ {interessiTotali.toFixed(0)}</div>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-white/40">
              * Simulazione indicativa. TAEG e condizioni definitive soggette a valutazione dell'istituto finanziario.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== 9. ORDER TRACKING (B2B) =====
export function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleTrack = () => {
    if (orderNumber.trim()) {
      setShowResult(true);
    }
  };

  return (
    <section id="tracking" className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Area Professionisti</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Tracciamento Ordini<br />
            <span className="text-gradient">Segui le Tue Forniture</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Inserisci il numero d'ordine per verificare lo stato della spedizione.
          </p>
        </div>

        <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Es: ORD-2026-001234"
              className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none"
            />
            <button
              onClick={handleTrack}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold transition-all"
            >
              Traccia
            </button>
          </div>

          {showResult && (
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div>
                  <div className="text-sm text-green-400 mb-1">Stato Ordine</div>
                  <div className="text-2xl font-bold text-white">In Consegna</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60">Arrivo previsto</div>
                  <div className="text-lg font-semibold text-white">Oggi, 14:00-18:00</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">Ordine Confermato</div>
                    <div className="text-xs text-white/40">15 Gen 2026, 09:30</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">Preparazione in Magazzino</div>
                    <div className="text-xs text-white/40">15 Gen 2026, 14:15</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center animate-pulse">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">In Transito</div>
                    <div className="text-xs text-white/40">16 Gen 2026, 08:00</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 opacity-40">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white/60">Consegnato</div>
                    <div className="text-xs text-white/40">In attesa</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ===== 10. INSTALLER MAP =====
export function InstallerMap() {
  const installers = [
    { name: 'Airklim PRO Partner', city: 'Carini (PA)', phone: '+39 091 8691680', certified: true },
    { name: 'ClimaTech Solutions', city: 'Palermo', phone: '+39 091 1234567', certified: true },
    { name: 'ThermoSystem Srl', city: 'Catania', phone: '+39 095 7654321', certified: true },
    { name: 'EcoClima Messina', city: 'Messina', phone: '+39 090 9876543', certified: false },
  ];

  return (
    <section id="installatori" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Rete di Installatori</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Trova un Installatore<br />
            <span className="text-gradient">Certificato nella Tua Zona</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Collaboriamo con installatori qualificati in tutta la Sicilia per garantirti un servizio professionale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-8">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <div className="text-white/60">Mappa Interattiva</div>
                <div className="text-xs text-white/40 mt-2">Disponibile prossimamente</div>
              </div>
            </div>
            <div className="text-center">
              <a href="#contatti" className="inline-block px-8 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all">
                Richiedi Installatore
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {installers.map((installer, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-500/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{installer.name}</h3>
                    <p className="text-sm text-white/50">{installer.city}</p>
                  </div>
                  {installer.certified && (
                    <span className="px-2 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-medium border border-sky-500/20">
                      ✓ Certificato
                    </span>
                  )}
                </div>
                <a href={`tel:${installer.phone}`} className="text-sky-400 hover:text-sky-300 text-sm font-medium">
                  {installer.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
