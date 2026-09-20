import { useState } from 'react';

export function LegalPages() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'cookie' | 'termini'>('privacy');

  return (
    <section id="legal" className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Informazioni Legali</h2>
          <p className="text-white/50">Privacy, Cookie Policy e Termini di Servizio</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'privacy'
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('cookie')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'cookie'
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Cookie Policy
          </button>
          <button
            onClick={() => setActiveTab('termini')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'termini'
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Termini di Servizio
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-8">
          {activeTab === 'privacy' && <PrivacyPolicy />}
          {activeTab === 'cookie' && <CookiePolicy />}
          {activeTab === 'termini' && <TermsOfService />}
        </div>
      </div>
    </section>
  );
}

function PrivacyPolicy() {
  return (
    <div className="prose prose-invert max-w-none space-y-6">
      <div className="text-sm text-white/40 mb-6">Ultimo aggiornamento: 16 Gennaio 2026</div>

      <h3 className="text-xl font-bold text-white">1. Titolare del Trattamento</h3>
      <p className="text-white/60">
        Il Titolare del trattamento dei dati è <strong className="text-white">AIRKLIM S.r.l.</strong>, con sede in Via Ciachea, 2/e - Zona Industriale, 90044 Carini (PA), 
        P.IVA 01234567890, email: privacy@airklim.it, PEC: airklim@pec.it.
      </p>

      <h3 className="text-xl font-bold text-white">2. Dati Raccolti</h3>
      <p className="text-white/60">Raccogliamo le seguenti categorie di dati personali:</p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• <strong className="text-white">Dati di registrazione:</strong> nome, cognome, email, telefono, indirizzo</li>
        <li>• <strong className="text-white">Dati aziendali (B2B):</strong> ragione sociale, P.IVA, Codice Fiscale, PEC, visura camerale, certificazioni</li>
        <li>• <strong className="text-white">Dati di navigazione:</strong> indirizzo IP, tipo di browser, pagine visitate, tempo di permanenza</li>
        <li>• <strong className="text-white">Dati di contatto:</strong> messaggi inviati tramite form, richieste di informazioni</li>
      </ul>

      <h3 className="text-xl font-bold text-white">3. Finalità del Trattamento</h3>
      <p className="text-white/60">I dati personali sono trattati per le seguenti finalità:</p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Gestione della registrazione e dell'account utente</li>
        <li>• Evasione di ordini e richieste di informazioni</li>
        <li>• Invio di comunicazioni relative ai servizi richiesti</li>
        <li>• Adempimenti obbligatori per legge (fatturazione, garanzia)</li>
        <li>• Marketing e invio di offerte commerciali (solo con consenso esplicito)</li>
        <li>• Analisi statistiche e miglioramento dei servizi</li>
      </ul>

      <h3 className="text-xl font-bold text-white">4. Base Giuridica del Trattamento</h3>
      <p className="text-white/60">
        Il trattamento dei dati si basa su:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• <strong className="text-white">Esecuzione di un contratto</strong> (art. 6.1.b GDPR) per la gestione degli ordini</li>
        <li>• <strong className="text-white">Consenso dell'interessato</strong> (art. 6.1.a GDPR) per marketing e comunicazioni</li>
        <li>• <strong className="text-white">Obbligo legale</strong> (art. 6.1.c GDPR) per adempimenti fiscali e contabili</li>
        <li>• <strong className="text-white">Legittimo interesse</strong> (art. 6.1.f GDPR) per analisi statistiche e sicurezza</li>
      </ul>

      <h3 className="text-xl font-bold text-white">5. Conservazione dei Dati</h3>
      <p className="text-white/60">
        I dati personali sono conservati per il tempo strettamente necessario al raggiungimento delle finalità per cui sono stati raccolti:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• <strong className="text-white">Dati di registrazione:</strong> fino alla cancellazione dell'account</li>
        <li>• <strong className="text-white">Dati di fatturazione:</strong> 10 anni (obbligo legale)</li>
        <li>• <strong className="text-white">Dati di marketing:</strong> fino alla revoca del consenso</li>
        <li>• <strong className="text-white">Dati di navigazione:</strong> 12 mesi</li>
      </ul>

      <h3 className="text-xl font-bold text-white">6. Diritti dell'Interessato</h3>
      <p className="text-white/60">
        Ai sensi degli artt. 15-22 GDPR, hai il diritto di:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Accedere ai tuoi dati personali</li>
        <li>• Rettificare dati inesatti o incompleti</li>
        <li>• Cancellare i tuoi dati (diritto all'oblio)</li>
        <li>• Limitare il trattamento</li>
        <li>• Portabilità dei dati</li>
        <li>• Opposizione al trattamento</li>
        <li>• Revocare il consenso in qualsiasi momento</li>
      </ul>
      <p className="text-white/60">
        Per esercitare i tuoi diritti, contatta: <a href="mailto:privacy@airklim.it" className="text-sky-400 hover:underline">privacy@airklim.it</a>
      </p>

      <h3 className="text-xl font-bold text-white">7. Trasferimento Dati a Terzi</h3>
      <p className="text-white/60">
        I dati personali possono essere comunicati a:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Fornitori di servizi (hosting, email, pagamenti)</li>
        <li>• Professionisti incaricati (commercialisti, legali)</li>
        <li>• Autorità pubbliche (per obblighi di legge)</li>
      </ul>
      <p className="text-white/60">
        Non trasferiamo dati personali al di fuori dell'Unione Europea.
      </p>

      <h3 className="text-xl font-bold text-white">8. Sicurezza</h3>
      <p className="text-white/60">
        Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali da accessi non autorizzati, 
        perdita, distruzione o danneggiamento, inclusa la crittografia SSL/TLS per le comunicazioni.
      </p>

      <h3 className="text-xl font-bold text-white">9. Reclami</h3>
      <p className="text-white/60">
        Hai il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali 
        (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">www.garanteprivacy.it</a>).
      </p>
    </div>
  );
}

function CookiePolicy() {
  return (
    <div className="prose prose-invert max-w-none space-y-6">
      <div className="text-sm text-white/40 mb-6">Ultimo aggiornamento: 16 Gennaio 2026</div>

      <h3 className="text-xl font-bold text-white">1. Cosa sono i Cookie</h3>
      <p className="text-white/60">
        I cookie sono piccoli file di testo che i siti web visitati inviano al tuo dispositivo (computer, tablet, smartphone), 
        dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla tua visita successiva.
      </p>

      <h3 className="text-xl font-bold text-white">2. Cookie Utilizzati</h3>
      
      <h4 className="text-lg font-semibold text-white mt-6">2.1 Cookie Tecnici (Necessari)</h4>
      <p className="text-white/60">
        Questi cookie sono essenziali per il funzionamento del sito e non possono essere disattivati.
      </p>
      <table className="w-full text-sm text-white/60 border border-white/10">
        <thead className="bg-white/5">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Scopo</th>
            <th className="px-4 py-2 text-left">Durata</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-white/10">
            <td className="px-4 py-2">session_id</td>
            <td className="px-4 py-2">Gestione sessione utente</td>
            <td className="px-4 py-2">Sessione</td>
          </tr>
          <tr className="border-t border-white/10">
            <td className="px-4 py-2">cookie-consent</td>
            <td className="px-4 py-2">Memorizza preferenze cookie</td>
            <td className="px-4 py-2">1 anno</td>
          </tr>
        </tbody>
      </table>

      <h4 className="text-lg font-semibold text-white mt-6">2.2 Cookie Analitici</h4>
      <p className="text-white/60">
        Questi cookie ci aiutano a capire come i visitatori interagiscono con il sito, raccogliendo informazioni in forma anonima.
      </p>
      <table className="w-full text-sm text-white/60 border border-white/10">
        <thead className="bg-white/5">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Servizio</th>
            <th className="px-4 py-2 text-left">Scopo</th>
            <th className="px-4 py-2 text-left">Durata</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-white/10">
            <td className="px-4 py-2">_ga</td>
            <td className="px-4 py-2">Google Analytics</td>
            <td className="px-4 py-2">Tracciamento visitatori</td>
            <td className="px-4 py-2">2 anni</td>
          </tr>
          <tr className="border-t border-white/10">
            <td className="px-4 py-2">_gid</td>
            <td className="px-4 py-2">Google Analytics</td>
            <td className="px-4 py-2">Tracciamento sessioni</td>
            <td className="px-4 py-2">24 ore</td>
          </tr>
        </tbody>
      </table>

      <h4 className="text-lg font-semibold text-white mt-6">2.3 Cookie di Marketing</h4>
      <p className="text-white/60">
        Questi cookie sono utilizzati per mostrarti pubblicità personalizzate in base ai tuoi interessi.
      </p>
      <table className="w-full text-sm text-white/60 border border-white/10">
        <thead className="bg-white/5">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Servizio</th>
            <th className="px-4 py-2 text-left">Scopo</th>
            <th className="px-4 py-2 text-left">Durata</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-white/10">
            <td className="px-4 py-2">_fbp</td>
            <td className="px-4 py-2">Facebook Pixel</td>
            <td className="px-4 py-2">Tracciamento conversioni</td>
            <td className="px-4 py-2">3 mesi</td>
          </tr>
        </tbody>
      </table>

      <h3 className="text-xl font-bold text-white">3. Gestione dei Cookie</h3>
      <p className="text-white/60">
        Puoi gestire le tue preferenze sui cookie in qualsiasi momento:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Tramite il banner cookie presente sul sito</li>
        <li>• Tramite le impostazioni del tuo browser</li>
        <li>• Tramite servizi di opt-out di terze parti</li>
      </ul>

      <h3 className="text-xl font-bold text-white">4. Cookie di Terze Parti</h3>
      <p className="text-white/60">
        Il sito può contenere cookie di terze parti, tra cui:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• <strong className="text-white">Google Analytics:</strong> analisi del traffico web</li>
        <li>• <strong className="text-white">Facebook Pixel:</strong> tracciamento per pubblicità</li>
        <li>• <strong className="text-white">Google Fonts:</strong> caricamento font personalizzati</li>
        <li>• <strong className="text-white">YouTube/Vimeo:</strong> video incorporati</li>
      </ul>
      <p className="text-white/60">
        Per maggiori informazioni sui cookie di terze parti e per gestire le tue preferenze, visita i siti delle rispettive società.
      </p>

      <h3 className="text-xl font-bold text-white">5. Consenso</h3>
      <p className="text-white/60">
        Alla prima visita del sito, ti viene mostrato un banner cookie che ti permette di:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Accettare tutti i cookie</li>
        <li>• Rifiutare i cookie non necessari</li>
        <li>• Personalizzare le tue preferenze</li>
      </ul>
      <p className="text-white/60">
        Il consenso viene memorizzato e non ti verrà più richiesto il banner, a meno che tu non cancelli i cookie del browser.
      </p>

      <h3 className="text-xl font-bold text-white">6. Contatti</h3>
      <p className="text-white/60">
        Per domande sulla Cookie Policy, contatta: <a href="mailto:privacy@airklim.it" className="text-sky-400 hover:underline">privacy@airklim.it</a>
      </p>
    </div>
  );
}

function TermsOfService() {
  return (
    <div className="prose prose-invert max-w-none space-y-6">
      <div className="text-sm text-white/40 mb-6">Ultimo aggiornamento: 16 Gennaio 2026</div>

      <h3 className="text-xl font-bold text-white">1. Accettazione dei Termini</h3>
      <p className="text-white/60">
        Accedendo e utilizzando il sito web di AIRKLIM S.r.l. ("Sito"), accetti di essere vincolato dai presenti Termini di Servizio. 
        Se non accetti questi termini, ti preghiamo di non utilizzare il Sito.
      </p>

      <h3 className="text-xl font-bold text-white">2. Descrizione del Servizio</h3>
      <p className="text-white/60">
        AIRKLIM è un distributore ufficiale di prodotti per la climatizzazione professionale, tra cui:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Climatizzatori residenziali e commerciali</li>
        <li>• Pompe di calore</li>
        <li>• Sistemi VRF</li>
        <li>• Accessori e ricambi</li>
      </ul>
      <p className="text-white/60">
        I servizi sono rivolti principalmente a installatori certificati e professionisti del settore (B2B), 
        ma sono disponibili anche per clienti privati (B2C).
      </p>

      <h3 className="text-xl font-bold text-white">3. Registrazione e Account</h3>
      <p className="text-white/60">
        Per accedere a determinate funzionalità del Sito, è richiesta la registrazione. Ti impegni a:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Fornire informazioni veritiere e aggiornate</li>
        <li>• Mantenere la riservatezza delle credenziali di accesso</li>
        <li>• Non condividere l'account con terzi</li>
        <li>• Notificare immediatamente eventuali accessi non autorizzati</li>
      </ul>
      <p className="text-white/60">
        AIRKLIM si riserva il diritto di sospendere o terminare account che violino questi termini.
      </p>

      <h3 className="text-xl font-bold text-white">4. Prezzi e Pagamenti</h3>
      <p className="text-white/60">
        I prezzi indicati sul Sito sono:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• <strong className="text-white">IVA esclusa</strong> per clienti B2B</li>
        <li>• <strong className="text-white">IVA inclusa</strong> per clienti B2C</li>
        <li>• <strong className="text-white">Soggetti a modifica</strong> senza preavviso</li>
      </ul>
      <p className="text-white/60">
        I pagamenti possono essere effettuati tramite:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Bonifico bancario</li>
        <li>• Carta di credito/debito</li>
        <li>• Finanziamento (per importi superiori a €500)</li>
      </ul>

      <h3 className="text-xl font-bold text-white">5. Ordini e Spedizioni</h3>
      <p className="text-white/60">
        Gli ordini sono soggetti a:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Disponibilità dei prodotti</li>
        <li>• Verifica dei dati forniti</li>
        <li>• Approvazione del credito (per pagamenti rateali)</li>
      </ul>
      <p className="text-white/60">
        I tempi di consegna sono indicati al momento dell'ordine e possono variare in base alla disponibilità e alla destinazione.
      </p>

      <h3 className="text-xl font-bold text-white">6. Garanzia e Assistenza</h3>
      <p className="text-white/60">
        I prodotti sono coperti da garanzia legale di conformità (2 anni per consumatori, 1 anno per professionisti).
      </p>
      <p className="text-white/60">
        AIRKLIM offre:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Supporto tecnico pre e post-vendita</li>
        <li>• Ricambi originali</li>
        <li>• Assistenza tramite rete di installatori certificati</li>
      </ul>

      <h3 className="text-xl font-bold text-white">7. Proprietà Intellettuale</h3>
      <p className="text-white/60">
        Tutti i contenuti del Sito (testi, immagini, loghi, design) sono di proprietà di AIRKLIM S.r.l. o dei rispettivi titolari 
        e sono protetti dalle leggi sul diritto d'autore.
      </p>
      <p className="text-white/60">
        È vietata la riproduzione, distribuzione o modifica senza autorizzazione scritta.
      </p>

      <h3 className="text-xl font-bold text-white">8. Limitazione di Responsabilità</h3>
      <p className="text-white/60">
        AIRKLIM non è responsabile per:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Danni indiretti o consequenziali</li>
        <li>• Perdita di profitti o opportunità</li>
        <li>• Interruzioni del servizio</li>
        <li>• Errori o inesattezze nei contenuti</li>
      </ul>
      <p className="text-white/60">
        La responsabilità totale di AIRKLIM è limitata all'importo pagato per il prodotto o servizio oggetto del reclamo.
      </p>

      <h3 className="text-xl font-bold text-white">9. Modifiche ai Termini</h3>
      <p className="text-white/60">
        AIRKLIM si riserva il diritto di modificare questi Termini di Servizio in qualsiasi momento. 
        Le modifiche saranno pubblicate sul Sito con indicazione della data di ultimo aggiornamento.
      </p>
      <p className="text-white/60">
        L'uso continuato del Sito dopo la pubblicazione delle modifiche costituisce accettazione dei nuovi termini.
      </p>

      <h3 className="text-xl font-bold text-white">10. Legge Applicabile e Foro Competente</h3>
      <p className="text-white/60">
        I presenti Termini di Servizio sono regolati dalla legge italiana.
      </p>
      <p className="text-white/60">
        Per qualsiasi controversia derivante dall'uso del Sito, sarà competente in via esclusiva il Foro di Palermo.
      </p>

      <h3 className="text-xl font-bold text-white">11. Contatti</h3>
      <p className="text-white/60">
        Per domande sui Termini di Servizio, contatta:
      </p>
      <ul className="text-white/60 space-y-2 ml-6">
        <li>• Email: <a href="mailto:info@airklim.it" className="text-sky-400 hover:underline">info@airklim.it</a></li>
        <li>• Telefono: +39 091 8691680</li>
        <li>• Indirizzo: Via Ciachea, 2/e - 90044 Carini (PA)</li>
      </ul>
    </div>
  );
}
