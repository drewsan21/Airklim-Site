import { useState } from 'react';

// ===== BLOG ARTICLE TYPE =====
interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
}

// ===== BLOG DATA =====
const blogArticles: BlogArticle[] = [
  {
    id: 'guida-scelta-climatizzatore',
    title: 'Come Scegliere il Climatizzatore Giusto per la Tua Casa',
    excerpt: 'Guida completa alla scelta del climatizzatore: potenza, efficienza energetica, funzionalità e budget. Tutto quello che devi sapere prima di acquistare.',
    content: `
      <h2>Introduzione</h2>
      <p>Scegliere il climatizzatore giusto non è solo una questione di prezzo. Ci sono diversi fattori da considerare per garantire il massimo comfort e il miglior rapporto qualità-prezzo.</p>
      
      <h2>1. Calcola la Potenza Necessaria</h2>
      <p>La potenza del climatizzatore si misura in BTU (British Thermal Units) o kW. Per calcolare la potenza necessaria:</p>
      <ul>
        <li>Moltiplica la superficie della stanza (m²) per 340 BTU/m²</li>
        <li>Aggiungi il 20% se la stanza è molto soleggiata</li>
        <li>Aggiungi il 10% per ogni persona aggiuntiva</li>
      </ul>
      <p><strong>Esempio:</strong> Stanza 20m² × 340 = 6.800 BTU → Climatizzatore da 9.000 BTU</p>
      
      <h2>2. Efficienza Energetica</h2>
      <p>La classe energetica indica quanto consuma il climatizzatore:</p>
      <ul>
        <li><strong>A+++:</strong> Massima efficienza, risparmio fino al 60%</li>
        <li><strong>A++:</strong> Ottima efficienza, risparmio fino al 40%</li>
        <li><strong>A+:</strong> Buona efficienza, risparmio fino al 25%</li>
      </ul>
      <p>Un climatizzatore A+++ costa di più all'acquisto ma si ripaga in 2-3 anni grazie al risparmio energetico.</p>
      
      <h2>3. Funzionalità Importanti</h2>
      <ul>
        <li><strong>Inverter:</strong> Regola la potenza in base alla temperatura, risparmiando energia</li>
        <li><strong>Wi-Fi:</strong> Controllo remoto tramite smartphone</li>
        <li><strong>nanoe™ X (Panasonic):</strong> Purifica l'aria eliminando batteri e virus</li>
        <li><strong>Gentle Breeze (TCL):</strong> Flusso d'aria delicato e confortevole</li>
        <li><strong>Modalità silenziosa:</strong> Ideale per la camera da letto (19-24 dB)</li>
      </ul>
      
      <h2>4. Tipologie di Climatizzatori</h2>
      <h3>Monosplit</h3>
      <p>Un'unità esterna + un'unità interna. Ideale per una singola stanza.</p>
      
      <h3>Multi-Split</h3>
      <p>Un'unità esterna + 2-5 unità interne. Perfetto per climatizzare più ambienti con un solo motore esterno.</p>
      
      <h3>Portatile</h3>
      <p>Soluzione temporanea, meno efficiente ma facile da installare.</p>
      
      <h2>5. Budget e Incentivi</h2>
      <p>I prezzi variano da €500 a €2.000+ in base a potenza e funzionalità. Ricorda che puoi usufruire del:</p>
      <ul>
        <li><strong>Conto Termico 3.0:</strong> Detrazione fino al 65%</li>
        <li><strong>Bonus Casa:</strong> Detrazione 50% in 10 anni</li>
        <li><strong>Finanziamento:</strong> Rate mensili personalizzate</li>
      </ul>
      
      <h2>6. Installazione Professionale</h2>
      <p>L'installazione deve essere eseguita da un tecnico certificato (DM 37/08). Un'installazione corretta garantisce:</p>
      <ul>
        <li>Massima efficienza</li>
        <li>Durata nel tempo</li>
        <li>Validità della garanzia</li>
        <li>Sicurezza</li>
      </ul>
      
      <h2>Conclusione</h2>
      <p>Scegliere il climatizzatore giusto richiede attenzione a potenza, efficienza, funzionalità e budget. Con la nostra guida e i nostri strumenti di calcolo, puoi trovare la soluzione perfetta per le tue esigenze.</p>
    `,
    category: 'Guida all\'Acquisto',
    readTime: '8 min',
    date: '2026-01-15',
    author: 'Team AIRKLIM',
    image: 'https://images.unsplash.com/photo-1631545308456-7b5e2e990a5e?w=800&h=600&fit=crop',
    tags: ['guida', 'acquisto', 'climatizzatore', 'efficienza']
  },
  {
    id: 'manutenzione-climatizzatore',
    title: 'Manutenzione del Climatizzatore: Cosa Fare e Quando',
    excerpt: 'Guida completa alla manutenzione ordinaria e straordinaria del climatizzatore. Filtri, pulizia, controllo gas e consigli per allungare la vita del tuo impianto.',
    content: `
      <h2>Perché la Manutenzione è Importante</h2>
      <p>Una manutenzione regolare del climatizzatore garantisce:</p>
      <ul>
        <li>Massima efficienza energetica</li>
        <li>Aria più pulita e salubre</li>
        <li>Durata prolungata dell'impianto</li>
        <li>Minori costi di riparazione</li>
        <li>Validità della garanzia</li>
      </ul>
      
      <h2>Manutenzione Ordinaria (Fai-da-te)</h2>
      
      <h3>1. Pulizia dei Filtri (Ogni 2-4 settimane)</h3>
      <p>I filtri accumulano polvere e allergeni. Per pulirli:</p>
      <ol>
        <li>Spegni il climatizzatore</li>
        <li>Apri il pannello frontale</li>
        <li>Estrai i filtri</li>
        <li>Lavali con acqua tiepida e sapone neutro</li>
        <li>Lasciali asciugare completamente</li>
        <li>Rimontali</li>
      </ol>
      
      <h3>2. Pulizia Esterna (Ogni mese)</h3>
      <p>Pulisci la scocca esterna con un panno umido. Non usare prodotti abrasivi.</p>
      
      <h3>3. Controllo Unità Esterna (Ogni 3 mesi)</h3>
      <p>Verifica che l'unità esterna sia libera da foglie, polvere e ostacoli. Assicurati che ci sia almeno 30cm di spazio intorno.</p>
      
      <h2>Manutenzione Straordinaria (Tecnico Certificato)</h2>
      
      <h3>1. Controllo Gas Refrigerante (Ogni anno)</h3>
      <p>Un tecnico deve verificare la pressione del gas e l'eventuale presenza di perdite.</p>
      
      <h3>2. Pulizia Profonda (Ogni anno)</h3>
      <p>Pulizia professionale di evaporatore, condensatore e batteria.</p>
      
      <h3>3. Controllo Elettrico (Ogni 2 anni)</h3>
      <p>Verifica di cablaggi, connessioni e componenti elettrici.</p>
      
      <h2>Segnali che Indicano la Necessità di Manutenzione</h2>
      <ul>
        <li>Raffredda/riscalda meno del solito</li>
        <li>Rumori strani o vibrazioni</li>
        <li>Cattivo odore</li>
        <li>Consumi elettrici aumentati</li>
        <li>Perdite d'acqua</li>
      </ul>
      
      <h2>Quanto Costa la Manutenzione?</h2>
      <ul>
        <li><strong>Manutenzione ordinaria:</strong> Gratuita (fai-da-te)</li>
        <li><strong>Manutenzione straordinaria:</strong> €80-150</li>
        <li><strong>Contratto annuale:</strong> €120-200 (include 2 interventi)</li>
      </ul>
      
      <h2>Consigli per Allungare la Vita del Climatizzatore</h2>
      <ol>
        <li>Non impostare temperature estreme (22-26°C è ideale)</li>
        <li>Usa la modalità "Auto" invece di "Cool" o "Heat"</li>
        <li>Pulisci i filtri regolarmente</li>
        <li>Non coprire le unità</li>
        <li>Fai manutenzione annuale</li>
      </ol>
      
      <h2>Conclusione</h2>
      <p>La manutenzione regolare è essenziale per garantire prestazioni ottimali e durata nel tempo. Con pochi minuti ogni mese e un intervento annuale professionale, il tuo climatizzatore funzionerà perfettamente per 10-15 anni.</p>
    `,
    category: 'Manutenzione',
    readTime: '6 min',
    date: '2026-01-10',
    author: 'Team AIRKLIM',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop',
    tags: ['manutenzione', 'filtri', 'pulizia', 'guida']
  },
  {
    id: 'conto-termico-3',
    title: 'Conto Termico 3.0: Guida Completa agli Incentivi 2026',
    excerpt: 'Tutto quello che devi sapere sul Conto Termico 3.0: chi può richiederlo, come funziona, quali impianti sono incentivati e come ottenere la detrazione fino al 65%.',
    content: `
      <h2>Cos'è il Conto Termico 3.0?</h2>
      <p>Il Conto Termico 3.0 è un incentivo statale che premia la sostituzione di vecchi impianti di climatizzazione con nuovi sistemi ad alta efficienza energetica. Offre detrazioni fino al 65% della spesa sostenuta.</p>
      
      <h2>Chi Può Richiederlo?</h2>
      <ul>
        <li><strong>Privati:</strong> Proprietari di abitazioni</li>
        <li><strong>Condomini:</strong> Per parti comuni</li>
        <li><strong>Imprese:</strong> Per sedi operative</li>
        <li><strong>Enti pubblici:</strong> Scuole, ospedali, uffici</li>
      </ul>
      
      <h2>Quali Impianti Sono Incentivati?</h2>
      
      <h3>Pompe di Calore</h3>
      <ul>
        <li>Pompe di calore aria-acqua (es. Panasonic Aquarea)</li>
        <li>Pompe di calore aria-aria (climatizzatori inverter)</li>
        <li>Pompe di calore geotermiche</li>
      </ul>
      
      <h3>Caldaie a Condensazione</h3>
      <ul>
        <li>Caldaie a condensazione classe A</li>
        <li>Sistemi ibridi (caldaia + pompa di calore)</li>
      </ul>
      
      <h3>Altri Impianti</h3>
      <ul>
        <li>Scaldabagni a pompa di calore</li>
        <li>Sistemi di ventilazione meccanica controllata</li>
        <li>Pannelli solari termici</li>
      </ul>
      
      <h2>Quanto Puoi Risparmiare?</h2>
      <table>
        <tr><th>Tipo Impianto</th><th>Detrazione</th></tr>
        <tr><td>Pompa di calore aria-acqua</td><td>Fino al 65%</td></tr>
        <tr><td>Pompa di calore aria-aria</td><td>Fino al 50%</td></tr>
        <tr><td>Caldaia a condensazione</td><td>Fino al 50%</td></tr>
        <tr><td>Sistema ibrido</td><td>Fino al 65%</td></tr>
      </table>
      
      <h2>Come Funziona la Detrazione?</h2>
      <ol>
        <li><strong>Acquisto e installazione:</strong> Paghi l'intero importo</li>
        <li><strong>Richiesta incentivo:</strong> Presenti la domanda online</li>
        <li><strong>Verifica:</strong> GSE verifica i requisiti (30-60 giorni)</li>
        <li><strong>Erogazione:</strong> Ricevi l'incentivo in 5 rate annuali</li>
      </ol>
      
      <h2>Requisiti Tecnici</h2>
      <ul>
        <li>Efficienza energetica minima richiesta (SEER/SCOP)</li>
        <li>Installazione da parte di tecnico certificato</li>
        <li>Dichiarazione di conformità (DM 37/08)</li>
        <li>Sostituzione di impianto esistente (non nuova installazione)</li>
      </ul>
      
      <h2>Documenti Necessari</h2>
      <ul>
        <li>Fattura di acquisto e installazione</li>
        <li>Dichiarazione di conformità</li>
        <li>Scheda tecnica del prodotto</li>
        <li>Attestato di prestazione energetica (APE)</li>
        <li>Certificato di idoneità statica (se richiesto)</li>
      </ul>
      
      <h2>Come Richiederlo con AIRKLIM</h2>
      <ol>
        <li><strong>Consulenza gratuita:</strong> Ti aiutiamo a scegliere l'impianto giusto</li>
        <li><strong>Preventivo dettagliato:</strong> Con indicazione dell'incentivo spettante</li>
        <li><strong>Installazione certificata:</strong> Da nostri tecnici PRO Partner</li>
        <li><strong>Pratica completa:</strong> Ci occupiamo noi della documentazione</li>
        <li><strong>Assistenza post-vendita:</strong> Ti seguiamo fino all'erogazione</li>
      </ol>
      
      <h2>Esempio Pratico</h2>
      <p><strong>Impianto:</strong> Pompa di calore Panasonic Aquarea 9kW</p>
      <p><strong>Costo:</strong> €4.990 + installazione €1.500 = €6.490</p>
      <p><strong>Incentivo 65%:</strong> €4.218</p>
      <p><strong>Costo finale:</strong> €2.272 (risparmio del 35%)</p>
      <p><strong>Erogazione:</strong> €843,60 per 5 anni</p>
      
      <h2>Tempistiche</h2>
      <ul>
        <li><strong>Installazione:</strong> 1-3 giorni</li>
        <li><strong>Presentazione domanda:</strong> Entro 60 giorni</li>
        <li><strong>Verifica GSE:</strong> 30-60 giorni</li>
        <li><strong>Erogazione:</strong> 5 rate annuali</li>
      </ul>
      
      <h2>Consigli Utili</h2>
      <ol>
        <li>Conserva tutte le fatture e i documenti</li>
        <li>Verifica che l'installatore sia certificato</li>
        <li>Controlla che i prodotti rispettino i requisiti minimi</li>
        <li>Presenta la domanda entro i termini</li>
        <li>Richiedi assistenza a professionisti esperti</li>
      </ol>
      
      <h2>Conclusione</h2>
      <p>Il Conto Termico 3.0 è un'opportunità imperdibile per migliorare l'efficienza energetica della tua casa risparmiando fino al 65%. Con AIRKLIM hai un partner esperto che ti guida in ogni fase, dalla scelta dell'impianto all'ottenimento dell'incentivo.</p>
    `,
    category: 'Incentivi',
    readTime: '10 min',
    date: '2026-01-08',
    author: 'Team AIRKLIM',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    tags: ['conto-termico', 'incentivi', 'detrazione', 'risparmio']
  },
  {
    id: 'nanoe-x-panasonic',
    title: 'nanoe™ X: La Tecnologia Panasonic che Purifica l\'Aria',
    excerpt: 'Scopri come funziona la tecnologia nanoe™ X di Panasonic, capace di eliminare il 99% di batteri, virus e allergeni dall\'aria che respiri.',
    content: `
      <h2>Cos'è nanoe™ X?</h2>
      <p>nanoe™ X è una tecnologia brevettata da Panasonic che genera nanoparticelle di acqua cariche elettricamente, capaci di neutralizzare batteri, virus, muffe e allergeni presenti nell'aria.</p>
      
      <h2>Come Funziona?</h2>
      <ol>
        <li><strong>Raccolta umidità:</strong> Il sistema raccoglie l'umidità dall'aria</li>
        <li><strong>Generazione nanoparticelle:</strong> L'acqua viene trasformata in nanoparticelle cariche elettricamente</li>
        <li><strong>Distribuzione:</strong> Le nanoparticelle vengono diffuse nell'ambiente</li>
        <li><strong>Azione purificante:</strong> Le nanoparticelle si legano a batteri, virus e allergeni, neutralizzandoli</li>
      </ol>
      
      <h2>Cosa Elimina?</h2>
      <ul>
        <li><strong>Batteri:</strong> 99% in 2 ore</li>
        <li><strong>Virus:</strong> 99% in 2 ore (inclusi coronavirus)</li>
        <li><strong>Muffe:</strong> 99% in 2 ore</li>
        <li><strong>Allergeni:</strong> 99% in 2 ore (pollini, acari)</li>
        <li><strong>Odori:</strong> 99% in 2 ore</li>
      </ul>
      
      <h2>Vantaggi Rispetto ad Altri Sistemi</h2>
      <table>
        <tr><th>Caratteristica</th><th>nanoe™ X</th><th>Ionizzatore</th><th>Filtro HEPA</th></tr>
        <tr><td>Elimina batteri</td><td>✓</td><td>Parziale</td><td>✓</td></tr>
        <tr><td>Elimina virus</td><td>✓</td><td>✗</td><td>Parziale</td></tr>
        <tr><td>Elimina odori</td><td>✓</td><td>Parziale</td><td>✗</td></tr>
        <tr><td>Funziona a climatizzatore spento</td><td>✓</td><td>✗</td><td>✗</td></tr>
        <tr><td>Non richiede filtri da sostituire</td><td>✓</td><td>✓</td><td>✗</td></tr>
      </table>
      
      <h2>Quando Usarlo?</h2>
      <ul>
        <li><strong>Tutto l'anno:</strong> Anche quando il climatizzatore è spento</li>
        <li><strong>In inverno:</strong> Per purificare l'aria quando le finestre sono chiuse</li>
        <li><strong>In estate:</strong> Per eliminare odori e allergeni</li>
        <li><strong>In primavera:</strong> Per combattere i pollini</li>
        <li><strong>Dopo malattia:</strong> Per sanificare l'ambiente</li>
      </ul>
      
      <h2>È Sicuro?</h2>
      <p>Sì, nanoe™ X è assolutamente sicuro:</p>
      <ul>
        <li>Le nanoparticelle sono fatte di acqua</li>
        <li>Non produce ozono</li>
        <li>Non emette sostanze chimiche</li>
        <li>Certificato da laboratori indipendenti</li>
        <li>Sicuro per bambini, anziani e animali</li>
      </ul>
      
      <h2>Quanto Costa?</h2>
      <p>nanoe™ X è incluso nei climatizzatori Panasonic di gamma media e alta:</p>
      <ul>
        <li><strong>Etherea Z:</strong> nanoe™ X incluso</li>
        <li><strong>Etherea XZ:</strong> nanoe™ X incluso</li>
        <li><strong>TZ:</strong> Non incluso</li>
      </ul>
      <p>Non ci sono costi aggiuntivi di manutenzione o filtri da sostituire.</p>
      
      <h2>Test e Certificazioni</h2>
      <p>nanoe™ X è stato testato e certificato da:</p>
      <ul>
        <li>Università di Osaka (Giappone)</li>
        <li>Laboratori indipendenti europei</li>
        <li>Enti di certificazione internazionali</li>
      </ul>
      
      <h2>Confronto: nanoe™ X vs nanoe™ G</h2>
      <table>
        <tr><th>Caratteristica</th><th>nanoe™ X</th><th>nanoe™ G</th></tr>
        <tr><td>Efficacia batteri</td><td>99% in 2h</td><td>99% in 4h</td></tr>
        <tr><td>Efficacia virus</td><td>99% in 2h</td><td>99% in 4h</td></tr>
        <tr><td>Efficacia odori</td><td>99% in 2h</td><td>99% in 4h</td></tr>
        <tr><td>Quantità nanoparticelle</td><td>4.800 miliardi/h</td><td>480 miliardi/h</td></tr>
      </table>
      
      <h2>Conclusione</h2>
      <p>nanoe™ X rappresenta la massima evoluzione nella purificazione dell'aria. Grazie a questa tecnologia, i climatizzatori Panasonic non solo raffreddano e riscaldano, ma purificano l'aria che respiri, garantendo un ambiente più sano e confortevole per te e la tua famiglia.</p>
    `,
    category: 'Tecnologia',
    readTime: '7 min',
    date: '2026-01-05',
    author: 'Team AIRKLIM',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
    tags: ['nanoe', 'panasonic', 'tecnologia', 'purificazione']
  },
  {
    id: 'risparmio-energetico',
    title: '10 Consigli per Risparmiare Energia con il Climatizzatore',
    excerpt: 'Scopri come ridurre i consumi elettrici del climatizzatore fino al 40% con questi semplici consigli pratici. Risparmia sulla bolletta senza rinunciare al comfort.',
    content: `
      <h2>Introduzione</h2>
      <p>Il climatizzatore può rappresentare fino al 30% dei consumi elettrici estivi. Con questi 10 consigli puoi ridurre significativamente i consumi senza rinunciare al comfort.</p>
      
      <h2>1. Imposta la Temperatura Giusta</h2>
      <p><strong>Estate:</strong> 24-26°C (non 18-20°C)<br/>
      <strong>Inverno:</strong> 20-22°C (non 25-28°C)</p>
      <p>Ogni grado in meno/meno fa risparmiare il 7-10% di energia.</p>
      
      <h2>2. Usa la Modalità "Auto" o "Eco"</h2>
      <p>La modalità "Auto" regola automaticamente la potenza in base alla temperatura. La modalità "Eco" limita i consumi massimi.</p>
      
      <h2>3. Attiva la Funzione Inverter</h2>
      <p>I climatizzatori inverter regolano la potenza in base alle necessità, consumando fino al 40% in meno rispetto ai modelli on/off.</p>
      
      <h2>4. Pulisci i Filtri Regolarmente</h2>
      <p>Filtri sporchi riducono l'efficienza del 15-20%. Puliscili ogni 2-4 settimane.</p>
      
      <h2>5. Usa le Tende e gli Oscuranti</h2>
      <p>D'estate, chiudi tende e oscuranti nelle ore più calde. D'inverno, aprili nelle ore di sole per sfruttare il calore naturale.</p>
      
      <h2>6. Isola Bene l'Ambiente</h2>
      <p>Chiudi porte e finestre quando il climatizzatore è acceso. Usa paraspifferi per evitare dispersioni.</p>
      
      <h2>7. Programma gli Orari</h2>
      <p>Usa il timer per accendere il climatizzatore solo quando necessario. Molti modelli hanno funzioni di programmazione settimanale.</p>
      
      <h2>8. Mantieni l'Unità Esterna all'Ombra</h2>
      <p>L'unità esterna esposta al sole consuma fino al 10% in più. Se possibile, installala in una zona ombreggiata.</p>
      
      <h2>9. Usa un Ventilatore di Supporto</h2>
      <p>Un ventilatore a soffitto o da tavolo distribuisce meglio l'aria, permettendoti di impostare una temperatura più alta (e risparmiare).</p>
      
      <h2>10. Fai Manutenzione Annuale</h2>
      <p>Un climatizzatore ben mantenuto consuma fino al 25% in meno. Fai controllare l'impianto almeno una volta all'anno.</p>
      
      <h2>Bonus: Scegli un Climatizzatore ad Alta Efficienza</h2>
      <p>Un climatizzatore A+++ consuma fino al 60% in meno rispetto a un modello A. L'investimento iniziale si ripaga in 2-3 anni.</p>
      
      <h2>Quanto Puoi Risparmiare?</h2>
      <table>
        <tr><th>Azione</th><th>Risparmio</th></tr>
        <tr><td>Temperatura corretta</td><td>10-15%</td></tr>
        <tr><td>Modalità Eco</td><td>5-10%</td></tr>
        <tr><td>Filtri puliti</td><td>15-20%</td></tr>
        <tr><td>Tende chiuse</td><td>5-10%</td></tr>
        <tr><td>Manutenzione annuale</td><td>10-15%</td></tr>
        <tr><td><strong>Totale</strong></td><td><strong>45-70%</strong></td></tr>
      </table>
      
      <h2>Esempio Pratico</h2>
      <p><strong>Consumo annuo senza accorgimenti:</strong> €600<br/>
      <strong>Consumo annuo con accorgimenti:</strong> €240<br/>
      <strong>Risparmio annuo:</strong> €360</p>
      
      <h2>Conclusione</h2>
      <p>Con questi semplici accorgimenti puoi ridurre i consumi del climatizzatore fino al 70%, risparmiando centinaia di euro all'anno sulla bolletta. Il segreto è combinare buone abitudini con un impianto efficiente e ben mantenuto.</p>
    `,
    category: 'Efficienza',
    readTime: '5 min',
    date: '2026-01-03',
    author: 'Team AIRKLIM',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    tags: ['risparmio', 'energia', 'efficienza', 'bolletta']
  },
  {
    id: 'installazione-fai-da-te',
    title: 'Installazione Climatizzatore: Cosa Devi Sapere',
    excerpt: 'L\'installazione del climatizzatore può essere fatta fai-da-te? Scopri cosa dice la legge, i rischi e perché conviene affidarsi a un professionista certificato.',
    content: `
      <h2>L'Installazione Fai-da-te è Legale?</h2>
      <p><strong>No.</strong> Secondo il DM 37/08, l'installazione di impianti di climatizzazione deve essere eseguita esclusivamente da imprese abilitate con tecnico responsabile in possesso dei requisiti professionali.</p>
      
      <h2>Perché Serve un Installatore Certificato?</h2>
      
      <h3>1. Obbligo di Legge</h3>
      <p>L'installazione deve essere certificata con dichiarazione di conformità. Senza questo documento:</p>
      <ul>
        <li>L'impianto non è a norma</li>
        <li>La garanzia decade</li>
        <li>Non puoi accedere agli incentivi</li>
        <li>In caso di incidente, sei responsabile</li>
      </ul>
      
      <h3>2. Sicurezza</h3>
      <p>L'installazione coinvolge:</p>
      <ul>
        <li>Impianto elettrico (rischio folgorazione)</li>
        <li>Gas refrigerante (rischio esplosione se maneggiato male)</li>
        <li>Lavori in quota (rischio cadute)</li>
      </ul>
      
      <h3>3. Efficienza</h3>
      <p>Un'installazione errata può ridurre l'efficienza del 20-30%, aumentando i consumi e riducendo la durata dell'impianto.</p>
      
      <h2>Cosa Deve Fare l'Installatore?</h2>
      <ol>
        <li><strong>Sopralluogo:</strong> Valuta il posizionamento ottimale</li>
        <li><strong>Calcolo carico termico:</strong> Verifica la potenza necessaria</li>
        <li><strong>Installazione unità interna:</strong> Fissaggio, collegamenti</li>
        <li><strong>Installazione unità esterna:</strong> Supporto, collegamenti</li>
        <li><strong>Collegamento frigorifero:</strong> Tubi, isolamento, vuoto</li>
        <li><strong>Collegamento elettrico:</strong> Cablaggio, protezioni</li>
        <li><strong>Scarico condensa:</strong> Tubo di scarico</li>
        <li><strong>Collaudo:</strong> Test funzionamento, verifica perdite</li>
        <li><strong>Dichiarazione di conformità:</strong> Documento obbligatorio</li>
      </ol>
      
      <h2>Quanto Costa l'Installazione?</h2>
      <table>
        <tr><th>Tipo Impianto</th><th>Costo Installazione</th></tr>
        <tr><td>Monosplit 9000-12000 BTU</td><td>€300-500</td></tr>
        <tr><td>Monosplit 18000-24000 BTU</td><td>€400-600</td></tr>
        <tr><td>Dual Split</td><td>€600-900</td></tr>
        <tr><td>Trial Split</td><td>€800-1.200</td></tr>
      </table>
      
      <h2>Cosa Rischi con il Fai-da-Te?</h2>
      <ul>
        <li><strong>Mancata garanzia:</strong> Il produttore non copre danni da installazione errata</li>
        <li><strong>Multe:</strong> Da €1.000 a €10.000 per impianto non certificato</li>
        <li><strong>Responsabilità civile:</strong> In caso di danni a persone o cose</li>
        <li><strong>Niente incentivi:</strong> Non puoi accedere a Conto Termico o Bonus Casa</li>
        <li><strong>Vendita difficile:</strong> Senza certificazione, l'immobile vale meno</li>
      </ul>
      
      <h2>Come Scegliere un Installatore?</h2>
      <ol>
        <li><strong>Verifica certificazione:</strong> Deve essere iscritto alla Camera di Commercio con abilitazione DM 37/08 lettera d)</li>
        <li><strong>Richiedi referenze:</strong> Chiedi esempi di lavori precedenti</li>
        <li><strong>Preventivo dettagliato:</strong> Deve includere tutti i costi</li>
        <li><strong>Garanzia:</strong> Almeno 2 anni sull'installazione</li>
        <li><strong>Assistenza post-vendita:</strong> Per manutenzione e riparazioni</li>
      </ol>
      
      <h2>Cosa Puoi Fare Tu?</h2>
      <p>Puoi occuparti di:</p>
      <ul>
        <li>Scegliere il climatizzatore giusto</li>
        <li>Decidere il posizionamento (con consiglio del tecnico)</li>
        <li>Preparare l'area di lavoro</li>
        <li>Manutenzione ordinaria (pulizia filtri)</li>
      </ul>
      
      <h2>Con AIRKLIM</h2>
      <p>AIRKLIM è distributore ufficiale Panasonic PRO Partner con installatori certificati in tutta la Sicilia. Offriamo:</p>
      <ul>
        <li>Installazione professionale certificata</li>
        <li>Garanzia 2 anni sull'installazione</li>
        <li>Assistenza post-vendita</li>
        <li>Gestione pratiche incentivi</li>
      </ul>
      
      <h2>Conclusione</h2>
      <p>L'installazione fai-da-te del climatizzatore è illegale, pericolosa e controproducente. Affidati sempre a un professionista certificato per garantire sicurezza, efficienza e validità della garanzia. Con AIRKLIM hai la certezza di un lavoro a regola d'arte.</p>
    `,
    category: 'Installazione',
    readTime: '6 min',
    date: '2026-01-01',
    author: 'Team AIRKLIM',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop',
    tags: ['installazione', 'certificazione', 'sicurezza', 'legge']
  }
];

// ===== BLOG COMPONENT =====
export function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  const categories = ['all', ...Array.from(new Set(blogArticles.map(a => a.category)))];
  
  const filteredArticles = selectedCategory === 'all' 
    ? blogArticles 
    : blogArticles.filter(a => a.category === selectedCategory);

  if (selectedArticle) {
    return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
  }

  return (
    <section id="blog" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Blog & Guide</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Centro Risorse<br />
            <span className="text-gradient">Guide, Tutorial e Consigli</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Articoli approfonditi per aiutarti a scegliere, installare e mantenere il tuo climatizzatore.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Tutti' : cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(article => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden hover:border-sky-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span className="px-2 py-1 rounded-full bg-sky-500/10 text-sky-400">{article.category}</span>
                  <span>{article.readTime}</span>
                  <span>{new Date(article.date).toLocaleDateString('it-IT')}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-white/50 line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center text-sky-400 text-sm font-medium pt-2">
                  Leggi l'articolo →
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== ARTICLE DETAIL =====
function ArticleDetail({ article, onBack }: { article: BlogArticle; onBack: () => void }) {
  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sky-400 hover:text-sky-300 mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Torna al Blog
        </button>

        <article className="bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
          <div className="aspect-video">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-3 text-sm text-white/40">
              <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400">{article.category}</span>
              <span>{article.readTime} di lettura</span>
              <span>{new Date(article.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{article.title}</h1>
            <div className="flex items-center gap-3 text-sm text-white/50">
              <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
                <span className="text-sky-400 font-bold">{article.author[0]}</span>
              </div>
              <span>{article.author}</span>
            </div>
            <div
              className="prose prose-invert max-w-none space-y-4 text-white/70 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <div className="pt-6 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-white/50 text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
