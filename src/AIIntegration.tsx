/**
 * AIRKLIM AI/ML Integration
 * Chatbot avanzato, raccomandazioni prodotti, ricerca intelligente
 */

import { useState, useEffect } from 'react';

// ===== CHATBOT AI AVANZATO =====
export function AdvancedChatbot() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Ciao! Sono l\'assistente AI di AIRKLIM. Posso aiutarti con prodotti, prezzi, installazione, garanzia e incentivi. Come posso assisterti oggi?',
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState({
    userPreferences: {},
    conversationHistory: [],
    intent: null
  });

  // Intent recognition
  const recognizeIntent = (text: string) => {
    const lowerText = text.toLowerCase();
    
    const intents = {
      'product_inquiry': ['prodotto', 'climatizzatore', 'panasonic', 'tcl', 'etherea', 'breezein'],
      'price_inquiry': ['prezzo', 'costo', 'quanto costa', 'tariffa'],
      'installation': ['installazione', 'installare', 'montaggio', 'sopralluogo'],
      'warranty': ['garanzia', 'assistenza', 'riparazione'],
      'incentive': ['conto termico', 'incentivo', 'detrazione', 'bonus'],
      'comparison': ['confronto', 'differenza', 'quale scegliere', 'migliore'],
      'technical_specs': ['specifiche', 'potenza', 'btu', 'seer', 'scop', 'rumore'],
      'availability': ['disponibilità', 'stock', 'quando arriva', 'tempi'],
      'payment': ['pagamento', 'rate', 'finanziamento', 'carta'],
      'contact': ['contatto', 'telefono', 'email', 'indirizzo']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return intent;
      }
    }
    return 'general';
  };

  // Generate AI response
  const generateResponse = async (query, intent) => {
    setIsTyping(true);

    // Simula elaborazione AI
    await new Promise(resolve => setTimeout(resolve, 1000));

    const responses = {
      'product_inquiry': {
        text: `Abbiamo una vasta gamma di climatizzatori Panasonic e TCL. I modelli più popolari sono:\n\n• **Panasonic Etherea** (da €1.190) - Top di gamma con nanoe™ X\n• **Panasonic TZ** (da €890) - Compatto ed efficiente\n• **TCL BreezeIN** (da €590) - Miglior rapporto qualità-prezzo\n\nVuoi saperne di più su un modello specifico?`,
        suggestions: ['Vedi Etherea', 'Confronta modelli', 'Calcola BTU']
      },
      'price_inquiry': {
        text: `I nostri prezzi partono da:\n\n• TCL BreezeIN 9000: **€590**\n• Panasonic TZ 20: **€890**\n• Panasonic Etherea Z25: **€1.190**\n• Panasonic Etherea XZ35: **€1.590**\n\nTutti i prezzi includono IVA. Offriamo anche finanziamenti a tasso zero. Vuoi calcolare un preventivo personalizzato?`,
        suggestions: ['Calcola preventivo', 'Vedi finanziamenti', 'Conto Termico']
      },
      'installation': {
        text: `Offriamo installazione certificata DM 37/08 in tutta la Sicilia. I costi variano da €300 a €600 in base alla complessità.\n\n**Cosa include:**\n• Sopralluogo gratuito\n• Installazione professionale\n• Collaudo e messa in funzione\n• 2 anni di garanzia sull'installazione\n\nVuoi prenotare un sopralluogo?`,
        suggestions: ['Prenota sopralluogo', 'Trova installatore', 'Costi installazione']
      },
      'warranty': {
        text: `Tutti i nostri prodotti includono:\n\n• **5 anni** di garanzia sul compressore\n• **2 anni** di garanzia sulle parti\n• **2 anni** di garanzia sull'installazione\n\nSei un PRO Partner? Hai accesso a garanzie estese e supporto prioritario!\n\nHai bisogno di assistenza per un prodotto?`,
        suggestions: ['Richiedi assistenza', 'Garanzia estesa', 'Ricambi originali']
      },
      'incentive': {
        text: `Con il **Conto Termico 3.0** puoi ottenere fino al **65% di detrazione**!\n\n**Esempio:**\n• Pompa di calore 9kW: €4.990\n• Incentivo 65%: €3.243\n• **Costo finale: €1.747**\n\nTi aiutiamo noi con tutta la burocrazia. Vuoi calcolare il tuo incentivo?`,
        suggestions: ['Calcola incentivo', 'Documenti necessari', 'Tempistiche']
      },
      'comparison': {
        text: `Confronto modelli popolari:\n\n**Panasonic Etherea XZ35** (€1.590)\n✓ nanoe™ X Mark 3\n✓ SEER 9.5 A+++\n✓ 19 dB(A)\n\n**TCL BreezeIN 12000** (€690)\n✓ Gentle Breeze\n✓ SEER 6.1 A++\n✓ 26 dB(A)\n\n**Differenza principale:** Etherea ha aria purificata nanoe™ X e maggiore efficienza. TCL è più economico.\n\nQuale priorità hai: efficienza o budget?`,
        suggestions: ['Vedi tutti i modelli', 'Calcola risparmio', 'Richiedi preventivo']
      },
      'technical_specs': {
        text: `Specifiche tecniche principali:\n\n**Potenza:** 2.0-5.0 kW (7.000-18.000 BTU)\n**SEER:** 6.1-9.5 (efficienza raffrescamento)\n**SCOP:** 4.0-5.2 (efficienza riscaldamento)\n**Rumore:** 19-28 dB(A)\n**Refrigerante:** R32 (ecologico)\n\nVuoi le specifiche complete di un modello?`,
        suggestions: ['Calcola BTU necessari', 'Confronta efficienze', 'Scheda tecnica']
      },
      'availability': {
        text: `Disponibilità attuale:\n\n• Panasonic Etherea: **35 unità** in stock\n• Panasonic TZ: **60 unità** in stock\n• TCL BreezeIN: **70 unità** in stock\n\nTempi di consegna: **24-48 ore** in Sicilia.\n\nVuoi verificare la disponibilità di un modello specifico?`,
        suggestions: ['Verifica stock', 'Prenota prodotto', 'Tempi consegna']
      },
      'payment': {
        text: `Opzioni di pagamento disponibili:\n\n• **Bonifico bancario** (5% sconto)\n• **Carta di credito** (rateale disponibile)\n• **Finanziamento** fino a 36 mesi a tasso zero\n• **PayPal**\n\nPer ordini superiori a €500, spedizione gratuita!\n\nQuale metodo preferisci?`,
        suggestions: ['Calcola rate', 'Vedi finanziamenti', 'Richiedi preventivo']
      },
      'contact': {
        text: `Contatti AIRKLIM:\n\n📍 **Indirizzo:** Via Ciachea, 2/e - 90044 Carini (PA)\n📞 **Telefono:** +39 091 8691680\n📧 **Email:** info@airklim.it\n🕐 **Orari:** Lun-Ven 8:30-18:00, Sab 8:30-12:00\n\nVuoi essere ricontattato?`,
        suggestions: ['Richiedi chiamata', 'Manda email', 'WhatsApp']
      },
      'general': {
        text: `Posso aiutarti con:\n\n• 📦 Informazioni prodotti\n• 💰 Prezzi e preventivi\n• 🔧 Installazione\n• 🛡️ Garanzia e assistenza\n• 💸 Incentivi e detrazioni\n• 📊 Confronto modelli\n• 📞 Contatti\n\nCosa ti interessa?`,
        suggestions: ['Vedi prodotti', 'Calcola preventivo', 'Parla con operatore']
      }
    };

    const response = responses[intent] || responses['general'];
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: response.text,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      suggestions: response.suggestions
    }]);

    setIsTyping(false);
    
    // Aggiorna contesto conversazione
    setContext(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, { query, intent }],
      intent
    }));
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    
    const intent = recognizeIntent(inputText);
    generateResponse(inputText, intent);
    
    setInputText('');
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:right-8">
      <div className="w-96 h-[600px] bg-slate-900 rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="flex-1">
            <div className="font-bold text-white">Assistente AI AIRKLIM</div>
            <div className="text-xs text-white/80">Online • Risponde immediatamente</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div key={message.id}>
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  message.sender === 'user'
                    ? 'bg-sky-500 text-white'
                    : 'bg-white/5 text-white border border-white/10'
                }`}>
                  <div className="whitespace-pre-line text-sm">{message.text}</div>
                  <div className="text-xs opacity-60 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              
              {/* Suggestions */}
              {message.suggestions && message.sender === 'bot' && (
                <div className="flex flex-wrap gap-2 mt-2 ml-2">
                  {message.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-full text-xs font-medium transition-all border border-sky-500/20"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Scrivi un messaggio..."
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-sky-500 outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl font-semibold transition-all"
            >
              Invia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SISTEMA RACCOMANDAZIONI PRODOTTI =====
export function useProductRecommendations() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    // Simula algoritmo di raccomandazione basato su:
    // - Cronologia acquisti
    // - Prodotti visualizzati
    // - Preferenze utente
    // - Popolarità prodotti
    
    const userHistory = JSON.parse(localStorage.getItem('userHistory') || '[]');
    const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
    
    // Algoritmo semplificato di collaborative filtering
    const allProducts = [
      { id: 'etherea-xz35', name: 'Panasonic Etherea XZ35', price: 1590, category: 'premium', rating: 4.9 },
      { id: 'etherea-z25', name: 'Panasonic Etherea Z25', price: 1190, category: 'premium', rating: 4.8 },
      { id: 'tz35', name: 'Panasonic TZ35', price: 1190, category: 'compact', rating: 4.7 },
      { id: 'breezein-12', name: 'TCL BreezeIN 12000', price: 690, category: 'value', rating: 4.6 },
      { id: 'aquarea-9', name: 'Panasonic Aquarea 9kW', price: 4990, category: 'heatpump', rating: 4.9 }
    ];

    // Calcola score per ogni prodotto
    const scored = allProducts.map(product => {
      let score = product.rating * 10;
      
      // Boost per prodotti nella stessa categoria di quelli visualizzati
      if (viewedProducts.some(p => p.category === product.category)) {
        score += 20;
      }
      
      // Boost per prodotti acquistati in passato (cross-selling)
      if (userHistory.some(p => p.category !== product.category)) {
        score += 10;
      }
      
      return { ...product, score };
    });

    // Ordina per score e prendi i top 5
    const topRecommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setRecommendations(topRecommendations);
  };

  const trackProductView = (productId) => {
    const viewed = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
    viewed.push({ id: productId, timestamp: Date.now() });
    localStorage.setItem('viewedProducts', JSON.stringify(viewed.slice(-50))); // Mantieni ultimi 50
  };

  const trackPurchase = (productId) => {
    const history = JSON.parse(localStorage.getItem('userHistory') || '[]');
    history.push({ id: productId, timestamp: Date.now() });
    localStorage.setItem('userHistory', JSON.stringify(history));
  };

  return { recommendations, trackProductView, trackPurchase };
}

// ===== RICERCA INTELLIGENTE =====
export function IntelligentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const allProducts = [
    { id: '1', name: 'Panasonic Etherea XZ35', brand: 'Panasonic', category: 'Etherea', price: 1590, power: 3.5 },
    { id: '2', name: 'Panasonic Etherea Z25', brand: 'Panasonic', category: 'Etherea', price: 1190, power: 2.5 },
    { id: '3', name: 'Panasonic TZ35', brand: 'Panasonic', category: 'TZ', price: 1190, power: 3.5 },
    { id: '4', name: 'TCL BreezeIN 12000', brand: 'TCL', category: 'BreezeIN', price: 690, power: 3.5 },
    { id: '5', name: 'Panasonic Aquarea 9kW', brand: 'Panasonic', category: 'Aquarea', price: 4990, power: 9.0 }
  ];

  useEffect(() => {
    if (query.length > 2) {
      performSearch(query);
      generateSuggestions(query);
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setIsSearching(true);
    
    // Simula ricerca con NLP
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = searchQuery.toLowerCase();
    
    // Ricerca fuzzy
    const filtered = allProducts.filter(product => {
      const searchableText = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
      
      // Match esatto
      if (searchableText.includes(lowerQuery)) return true;
      
      // Match parziale (token)
      const tokens = lowerQuery.split(' ');
      return tokens.some(token => searchableText.includes(token));
    });

    // Calcola relevance score
    const scored = filtered.map(product => {
      let score = 0;
      const name = product.name.toLowerCase();
      
      if (name.includes(lowerQuery)) score += 100;
      if (name.startsWith(lowerQuery)) score += 50;
      
      // Boost per brand match
      if (product.brand.toLowerCase().includes(lowerQuery)) score += 30;
      
      // Boost per category match
      if (product.category.toLowerCase().includes(lowerQuery)) score += 20;
      
      return { ...product, score };
    });

    // Ordina per relevance
    const sorted = scored.sort((a, b) => b.score - a.score);
    
    setResults(sorted);
    setIsSearching(false);
  };

  const generateSuggestions = (searchQuery) => {
    // Genera suggerimenti basati su query parziali
    const allSuggestions = [
      'Panasonic Etherea',
      'TCL BreezeIN',
      'Climatizzatore 12000 BTU',
      'Pompa di calore',
      'Nanoex X',
      'Inverter',
      'Silenzioso',
      'Efficiente'
    ];

    const filtered = allSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Cerca prodotti, brand, caratteristiche..."
          className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-sky-500 outline-none"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-10">
          <div className="p-2">
            <div className="text-xs text-white/40 px-2 py-1">Suggerimenti</div>
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setQuery(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-white text-sm transition-all"
              >
                🔍 {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search results */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-10 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-white/40 px-2 py-1">{results.length} risultati</div>
            {results.map(product => (
              <button
                key={product.id}
                onClick={() => {
                  setQuery(product.name);
                  setResults([]);
                }}
                className="w-full text-left p-3 hover:bg-white/5 rounded-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{product.name}</div>
                    <div className="text-xs text-white/50">{product.brand} • {product.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sky-400">€{product.price}</div>
                    <div className="text-xs text-white/40">{product.power} kW</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white/60 text-sm">Ricerca in corso...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== ANALISI SENTIMENT RECENSIONI =====
export function useSentimentAnalysis() {
  const analyzeSentiment = (text) => {
    const positiveWords = ['ottimo', 'eccellente', 'perfetto', 'fantastico', 'consiglio', 'soddisfatto', 'qualità', 'silenzioso', 'efficiente'];
    const negativeWords = ['pessimo', 'terribile', 'problema', 'rumoroso', 'lento', 'deluso', 'difetto', 'guasto'];
    
    const lowerText = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 1;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 1;
    });
    
    if (score > 0) return { sentiment: 'positive', confidence: Math.min(score * 20, 100) };
    if (score < 0) return { sentiment: 'negative', confidence: Math.min(Math.abs(score) * 20, 100) };
    return { sentiment: 'neutral', confidence: 50 };
  };

  const analyzeReviews = (reviews) => {
    const sentiments = reviews.map(review => ({
      ...review,
      sentiment: analyzeSentiment(review.text)
    }));

    const positive = sentiments.filter(r => r.sentiment.sentiment === 'positive').length;
    const negative = sentiments.filter(r => r.sentiment.sentiment === 'negative').length;
    const neutral = sentiments.filter(r => r.sentiment.sentiment === 'neutral').length;

    return {
      sentiments,
      summary: {
        positive: (positive / sentiments.length) * 100,
        negative: (negative / sentiments.length) * 100,
        neutral: (neutral / sentiments.length) * 100
      }
    };
  };

  return { analyzeSentiment, analyzeReviews };
}

// ===== PREDIZIONE DEMANDA =====
export function useDemandForecasting() {
  const forecastDemand = (productId, historicalData) => {
    // Algoritmo semplificato di previsione basato su:
    // - Vendite storiche
    // - Stagionalità
    // - Trend
    
    const currentMonth = new Date().getMonth();
    const isSummer = currentMonth >= 5 && currentMonth <= 8;
    const isWinter = currentMonth >= 11 || currentMonth <= 2;
    
    // Calcola media mobile
    const recentSales = historicalData.slice(-3);
    const averageSales = recentSales.reduce((sum, sale) => sum + sale.quantity, 0) / recentSales.length;
    
    // Applica fattore stagionale
    let seasonalFactor = 1.0;
    if (isSummer) seasonalFactor = 1.5; // +50% in estate
    if (isWinter) seasonalFactor = 1.3; // +30% in inverno
    
    // Calcola trend
    const trend = recentSales.length > 1 
      ? (recentSales[recentSales.length - 1].quantity - recentSales[0].quantity) / recentSales.length
      : 0;
    
    const forecast = Math.round((averageSales * seasonalFactor) + trend);
    
    return {
      productId,
      forecast,
      confidence: 75, // % di confidenza
      factors: {
        seasonal: seasonalFactor,
        trend: trend,
        historical: averageSales
      }
    };
  };

  return { forecastDemand };
}

export default {
  AdvancedChatbot,
  useProductRecommendations,
  IntelligentSearch,
  useSentimentAnalysis,
  useDemandForecasting
};
