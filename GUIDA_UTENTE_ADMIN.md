# 📚 GUIDA UTENTE ADMIN - AIRKLIM Management Dashboard

**Versione:** 1.0  
**Data:** 16 Gennaio 2026  
**Destinatari:** Amministratori del sistema AIRKLIM

---

## 🎯 INTRODUZIONE

Benvenuto nella guida utente del Management Dashboard di AIRKLIM. Questo documento ti guiderà attraverso tutte le funzionalità disponibili per gestire la piattaforma.

### Accesso al Dashboard

**URL:** `https://airklim.it/#admin`

**Credenziali di Test:**
- **Admin:** admin@example.com / Admin@123!
- **Professionista:** professionist@example.com / Pro@123!
- **Utente:** user@example.com / User@123!

⚠️ **Nota:** Solo gli utenti con ruolo "admin" possono accedere al dashboard.

---

## 📊 DASHBOARD PRINCIPALE

### Panoramica
La dashboard principale mostra una panoramica completa della piattaforma con:

#### 📈 Stats Cards (6 metriche)
1. **Utenti Totali** - Numero totale di utenti registrati
2. **Ordini Totali** - Numero totale di ordini
3. **Fatturato Totale** - Somma di tutti gli ordini (€)
4. **Ordini in Attesa** - Ordini con stato "pending"
5. **Sessioni Attive** - Utenti attualmente online
6. **Prodotti Stock Basso** - Prodotti con stock < 10

#### ⚡ Quick Actions
4 azioni rapide per operazioni comuni:
- Gestisci Utenti
- Gestisci Ordini
- Gestisci Prodotti
- Visualizza Analytics

#### 📋 Recent Activity
Lista delle ultime attività con:
- Icona tipo evento
- Descrizione
- Tempo relativo

---

## 👥 GESTIONE UTENTI

### Accesso
Sidebar → **Utenti**

### Funzionalità

#### 🔍 Filtri
- **Ricerca:** per nome, cognome o email
- **Ruolo:** Admin, Professionista, Privato
- **Stato:** Attivo, Sospeso, In attesa

#### 📊 Statistiche
- Utenti Totali
- Utenti Attivi
- Professionisti
- Fatturato Totale

#### 📋 Tabella Utenti
Colonne:
- **Utente:** Avatar + Nome + Email
- **Ruolo:** Badge colorato
- **Ordini:** Numero ordini
- **Spesa:** Totale speso (€)
- **Stato:** Badge colorato
- **Azioni:** Dettagli, Sospendi/Attiva, Elimina

#### 📄 Modal Dettagli
Click su "Dettagli" per vedere:
- Info complete utente
- Telefono, Azienda, P.IVA
- Data registrazione
- Statistiche personali
- Azioni rapide

#### ⚡ Azioni
1. **Dettagli:** Visualizza info complete
2. **Sospendi/Attiva:** Cambia stato utente
3. **Elimina:** Rimuovi utente (con conferma)

#### 📥 Esportazione
Click su "Esporta CSV" per scaricare lista utenti filtrata.

---

## 📦 GESTIONE ORDINI

### Accesso
Sidebar → **Ordini**

### Funzionalità

#### 🔍 Filtri
- **Ricerca:** per ID ordine o email utente
- **Stato:** 6 stati disponibili
- **Data:** Oggi, Ultima settimana, Ultimo mese

#### 📊 Statistiche
- Ordini Totali
- Ordini in Attesa
- Fatturato Totale
- Valore Medio

#### 📋 Tabella Ordini
Colonne:
- **ID Ordine:** Codice univoco
- **Utente:** Email utente
- **Totale:** Importo + numero articoli
- **Stato:** Badge colorato
- **Data:** Data e ora
- **Azioni:** Dettagli, Conferma, Lavora, Spedisci

#### 🎨 Stati Ordine
1. 🟡 **In Attesa** (pending) - Nuovo ordine
2. 🔵 **Confermato** (confirmed) - Ordine verificato
3. 🟣 **In Lavorazione** (processing) - Preparazione
4. 🔷 **Spedito** (shipped) - In transito
5. 🟢 **Consegnato** (delivered) - Completato
6. 🔴 **Annullato** (cancelled) - Cancellato

#### 📄 Modal Dettagli
Click su "Dettagli" per vedere:
- Info ordine complete
- Indirizzo spedizione
- Lista articoli con quantità e prezzi
- Totale ordine
- Azioni per cambio stato

#### ⚡ Azioni Rapide
- **Conferma:** Da "In Attesa" a "Confermato"
- **Lavora:** Da "Confermato" a "In Lavorazione"
- **Spedisci:** Da "In Lavorazione" a "Spedito"
- **Consegna:** Da "Spedito" a "Consegnato"

#### 📥 Esportazione
Click su "Esporta CSV" per scaricare lista ordini filtrata.

---

## 🏷️ GESTIONE PRODOTTI

### Accesso
Sidebar → **Prodotti**

### Funzionalità

#### 🔍 Filtri
- **Ricerca:** per nome o brand
- **Brand:** Tutti i brand disponibili
- **Stato:** Attivo, Inattivo, Esaurito

#### 📊 Statistiche
- Prodotti Totali
- Prodotti Attivi
- Prodotti Esauriti
- Prodotti Stock Basso (<10)

#### 🎴 Griglia Prodotti
Card con:
- Nome prodotto
- Brand e categoria
- Stato con badge
- Prezzo
- Controllo stock (+/-)
- Azioni: Modifica, Elimina

#### ⚡ Controllo Stock
- Bottone **-** per decrementare
- Bottone **+** per incrementare
- Aggiornamento automatico stato

#### ➕ Aggiungi Prodotto
Click su "Aggiungi Prodotto" per:
- Nome prodotto
- Brand
- Categoria
- Prezzo (€)
- Stock
- Stato

#### ✏️ Modifica Prodotto
Click su "Modifica" per aprire form con tutti i campi.

#### 🗑️ Elimina Prodotto
Click su "Elimina" con conferma.

#### 📥 Esportazione
Click su "Esporta CSV" per scaricare lista prodotti filtrata.

---

## 📝 GESTIONE CONTENUTI

### Accesso
Sidebar → **Contenuti**

### Funzionalità

#### 📑 4 Tab Contenuti
1. **📝 Blog** - Articoli con categoria e immagine
2. **🎥 Video** - Link YouTube/Vimeo
3. **🖼️ Galleria** - Immagini con descrizione
4. **⭐ Testimonianze** - Recensioni clienti

#### 🔍 Filtri
- Per tipo contenuto (tab)
- Per stato (pubblicato/bozza)

#### 📊 Statistiche
- Contenuti Totali
- Contenuti Pubblicati
- Bozze
- Contenuti nella tab attiva

#### 🎴 Griglia Contenuti
Card con:
- Immagine copertina
- Titolo
- Descrizione
- Categoria
- Data creazione
- Stato (pubblicato/bozza)

#### ⚡ Azioni
- **Pubblica/Annulla:** Cambia stato pubblicazione
- **Elimina:** Rimuovi contenuto (con conferma)

#### ➕ Aggiungi Contenuto
Click su "Aggiungi Contenuto" per:
- Titolo
- Descrizione
- Campi specifici per tipo:
  - Blog: categoria, immagine copertina
  - Video: URL video
  - Galleria: URL immagine
  - Testimonianze: categoria (privato/professionista/azienda)
- Checkbox "Pubblica immediatamente"

---

## 📈 ANALYTICS AVANZATI

### Accesso
Sidebar → **Analytics**

### Funzionalità

#### 📊 KPI Cards (4 metriche)
1. **💰 Fatturato Totale** - Somma vendite nel periodo
2. **📦 Ordini Totali** - Numero ordini
3. **👥 Utenti Totali** - Utenti registrati
4. **📈 Tasso Conversione** - % utenti che hanno ordinato

#### 📈 Grafico Vendite
- **3 visualizzazioni:**
  - Giornaliero (ultimi 30 giorni)
  - Settimanale (ultime 12 settimane)
  - Mensile (ultimi 12 mesi)
- **Bar chart interattivo** con hover tooltip
- **Dettagli:** data, fatturato, ordini

#### 👥 Utenti per Ruolo
- Admin (rosso)
- Professionista (ambra)
- Privato (sky blue)
- Barre di progresso con percentuali

#### 🏆 Prodotti Più Venduti
- Top 5 prodotti
- Nome, quantità venduta, fatturato
- Ranking numerato

#### 🎯 Conversioni per Sorgente
- Organico (40% ordini, 2.5% rate)
- Social (30% ordini, 1.8% rate)
- Email (20% ordini, 3.2% rate)
- Diretto (10% ordini, 5.1% rate)

#### 📦 Statistiche Prodotti
- Prodotti Totali
- Prodotti Attivi
- Prodotti Esauriti
- Prodotti Inattivi

#### 📥 Esportazione
3 pulsanti per esportare:
- Vendite (CSV)
- Utenti (CSV)
- Prodotti (CSV)

---

## ⚙️ IMPOSTAZIONI

### Accesso
Sidebar → **Impostazioni**

### Funzionalità

#### 📑 6 Tab Impostazioni

**1. ⚙️ Generali**
- Nome sito
- Descrizione sito
- Email contatto
- Telefono contatto
- Indirizzo
- Valuta (EUR, USD, GBP)
- Fuso orario
- Modalità manutenzione (on/off)

**2. 📧 Email**
- SMTP Host
- SMTP Port
- SMTP User
- SMTP Password
- Email mittente
- Nome mittente

**3. 💳 Pagamenti**
- **Stripe:** enable/disable + API key
- **PayPal:** enable/disable + email
- **Bonifico Bancario:** enable/disable + dettagli IBAN

**4. 🚚 Spedizioni**
- Soglia spedizione gratuita (€)
- Costo spedizione standard (€)
- Costo spedizione express (€)
- Giorni consegna stimati

**5. 👥 Ruoli**
- Visualizzazione ruoli
- Permessi per ogni ruolo
- Badge colorati

**6. 🔑 API Keys**
- Google Analytics
- Facebook Pixel
- SendGrid API
- Pulsanti "Configura"

#### 💾 Salvataggio
Click su "Salva Impostazioni" per salvare tutte le modifiche.
Feedback visivo "✅ Salvato!" per 3 secondi.

---

## 📋 AUDIT LOG

### Accesso
Sidebar → **Audit Log**

### Funzionalità

#### 📊 Statistiche
- Log Totali
- Log Info (blu)
- Log Warning (ambra)
- Log Error/Critical (rosso)

#### 🔍 Filtri Avanzati
- **Ricerca:** per utente, email, dettagli, ID risorsa
- **Azione:** login, create, update, delete, export, backup, security
- **Severità:** info, warning, error, critical
- **Data:** oggi, ultima settimana, ultimo mese

#### 📋 Lista Log
- Icona severità colorata
- Azione con emoji
- Risorsa e ID risorsa
- Dettagli evento
- Info utente (nome, email)
- Indirizzo IP
- Tempo relativo

#### 📄 Modal Dettagli
Click su un log per vedere:
- Timestamp completo
- Severità con badge
- Info utente complete
- Azione e risorsa
- Dettagli evento
- Indirizzo IP

#### 📥 Esportazione
Click su "Esporta CSV" per scaricare tutti i log filtrati.

#### 🗑️ Pulisci Log
Click su "Pulisci Log" per eliminare tutti i log (con conferma).

---

## 💾 BACKUP

### Accesso
Sidebar → **Backup**

### Funzionalità

#### 📊 Statistiche
- Backup Totali
- Spazio Totale (MB/GB)
- Durata Media
- Backup Verificati (X/Y)

#### ⏰ Backup Automatici
- **Toggle:** enable/disable
- **Orario:** time picker
- **Frequenza:** giornaliero, settimanale, mensile
- Salvataggio automatico in localStorage

#### ➕ Backup Manuale
Click su "Crea Backup Manuale" per:
- Creazione backup immediato
- Animazione durante creazione (3 secondi)
- Generazione automatica ID
- Calcolo dimensione e durata
- Salvataggio in localStorage

#### 📦 Lista Backup
- Tipo (manuale/automatico) con icona
- Stato (completato, in corso, fallito) con badge
- Badge "Verificato" se verificato
- Data e ora
- Dimensione (formattata MB/GB)
- Durata (formattata secondi/minuti)
- ID backup
- Note (se presenti)

#### 🔄 Azioni per Backup
- **Ripristina:** con conferma, sovrascrive dati correnti
- **Verifica:** marca backup come verificato
- **Elimina:** con conferma

#### 💡 Info Box
Informazioni sui backup:
- Cosa include (database, file, configurazioni)
- Consigli su verifica e conservazione
- Policy di retention

---

## 🎯 BEST PRACTICES

### Gestione Utenti
1. **Verifica regolarmente** gli utenti sospesi
2. **Esporta la lista** per backup mensile
3. **Controlla i permessi** prima di modificare ruoli

### Gestione Ordini
1. **Processa gli ordini** in attesa quotidianamente
2. **Aggiorna lo stato** tempestivamente
3. **Esporta i dati** per analisi periodiche

### Gestione Prodotti
1. **Monitora lo stock** settimanalmente
2. **Aggiorna i prezzi** in base al mercato
3. **Verifica i prodotti esauriti** per riordino

### Gestione Contenuti
1. **Pubblica regolarmente** nuovi contenuti
2. **Verifica le testimonianze** prima della pubblicazione
3. **Aggiorna la galleria** con nuovi progetti

### Analytics
1. **Controlla i KPI** settimanalmente
2. **Analizza le tendenze** mensili
3. **Esporta i report** per presentazioni

### Impostazioni
1. **Salva le modifiche** dopo ogni aggiornamento
2. **Verifica le configurazioni** email periodicamente
3. **Aggiorna le API keys** quando necessario

### Audit Log
1. **Controlla i log** daily per anomalie
2. **Esporta i dati** per compliance
3. **Pulisci i log** vecchi (> 90 giorni)

### Backup
1. **Crea backup manuali** prima di modifiche importanti
2. **Verifica i backup** settimanalmente
3. **Testa il ripristino** mensilmente

---

## 🔧 TROUBLESHOOTING

### Problemi Comuni

#### Login non funziona
- Verifica email e password
- Controlla che l'account abbia ruolo "admin"
- Prova a resettare la password

#### Dati non si caricano
- Controlla la connessione internet
- Verifica che localStorage non sia pieno
- Prova a ricaricare la pagina

#### Esportazione CSV non funziona
- Verifica che ci siano dati da esportare
- Controlla i permessi del browser
- Prova con un altro browser

#### Backup non si crea
- Verifica lo spazio disponibile
- Controlla i permessi di scrittura
- Prova a creare un backup manuale

#### Impostazioni non si salvano
- Verifica di aver compilato tutti i campi obbligatori
- Controlla che localStorage non sia pieno
- Prova a ricaricare la pagina

### Supporto
Per assistenza tecnica:
- Email: support@airklim.it
- Telefono: +39 091 8691680
- Orari: Lun-Ven 8:30-18:00

---

## 📞 CONTATTI

**Progetto:** AIRKLIM Management Dashboard  
**Versione:** 1.0  
**Data:** 16 Gennaio 2026  
**Autore:** Team AIRKLIM

---

**Guida completata! Buona gestione!** 🚀
