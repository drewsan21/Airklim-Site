# 🤝 Guida per Contribuire ad AIRKLIM

Grazie per il tuo interesse nel contribuire al progetto AIRKLIM! Questa guida ti aiuterà a capire come contribuire in modo efficace e mantenere il repository pulito.

---

## 📋 Indice

1. [Setup Iniziale](#setup-iniziale)
2. [Struttura del Progetto](#struttura-del-progetto)
3. [Cosa NON Committare](#cosa-non-committare)
4. [Workflow di Sviluppo](#workflow-di-sviluppo)
5. [Commit Messages](#commit-messages)
6. [Pull Requests](#pull-requests)
7. [Code Style](#code-style)
8. [Testing](#testing)
9. [Documentazione](#documentazione)
10. [Supporto](#supporto)

---

## 🚀 Setup Iniziale

### 1. Clona il Repository

```bash
git clone https://github.com/tuo-username/airklim.git
cd airklim
```

### 2. Installa le Dipendenze

```bash
# Dipendenze Node.js
npm install

# Dipendenze Python (opzionale, per script di analisi)
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### 3. Configura l'Ambiente

```bash
# Copia il file .env.example
cp .env.example .env

# Modifica .env con le tue configurazioni
nano .env
```

### 4. Avvia il Progetto

```bash
# Avvia il server di sviluppo
npm run dev

# Oppure usa lo script di avvio
./start_server.sh
```

---

## 📁 Struttura del Progetto

```
airklim/
├── public/                    # File statici
│   └── uploads/              # File caricati dall'utente
│       ├── images/           # Immagini prodotti
│       └── catalogs/         # Cataloghi PDF
├── src/                      # Codice sorgente
│   ├── components/           # Componenti React
│   ├── data/                 # Database prodotti
│   ├── management/           # Dashboard admin
│   └── App.tsx               # App principale
├── scripts/                  # Script di automazione
├── server/                   # Backend Node.js
├── data/                     # Dati estratti (NON committare)
├── logs/                     # Log (NON committare)
├── backups/                  # Backup (NON committare)
└── docs/                     # Documentazione
```

---

## ⚠️ COSA NON COMMITTARE

### File e Directory da Ignorare

**NON committare MAI questi file:**

#### 1. File Caricati dall'Utente
```
public/uploads/images/optimized/
public/uploads/images/thumbnails/
public/uploads/images/extracted/
public/uploads/images/uploaded/
public/uploads/catalogs/*.pdf
public/uploads/catalogs/uploaded/
```

**Motivo:** Questi file sono specifici per ogni installazione e possono essere molto grandi.

#### 2. Dati Estratti
```
data/extracted/
data/extracted-products.json
data/extractedProducts2026.ts
data/categorized_products.json
data/categorizedProducts2026.ts
```

**Motivo:** Questi file vengono generati automaticamente dagli script e possono cambiare frequentemente.

#### 3. Log e Report
```
logs/
*.log
*.log.*
```

**Motivo:** I log contengono informazioni sensibili e possono diventare molto grandi.

#### 4. Backup
```
backups/
*.backup
*.bak
*.tmp
```

**Motivo:** I backup sono file temporanei e non devono essere nel repository.

#### 5. Dipendenze
```
node_modules/
venv/
__pycache__/
```

**Motivo:** Le dipendenze devono essere installate localmente, non committate.

#### 6. Build Output
```
dist/
build/
.next/
```

**Motivo:** I file di build vengono generati automaticamente e non devono essere committati.

#### 7. File di Configurazione Locali
```
.env.local
.env.*.local
*.local
```

**Motivo:** Questi file contengono configurazioni specifiche per ogni sviluppatore.

#### 8. File di Sistema
```
.DS_Store
Thumbs.db
*.swp
*.swo
```

**Motivo:** Questi file sono specifici del sistema operativo e dell'editor.

### Come Verificare

Prima di committare, esegui:

```bash
# Verifica lo stato del repository
git status

# Verifica quali file verranno committati
git diff --cached --name-only
```

Se vedi file nella lista sopra, **NON committarli**!

---

## 🔄 Workflow di Sviluppo

### 1. Crea un Branch

```bash
# Aggiorna il branch principale
git checkout main
git pull origin main

# Crea un nuovo branch per la tua feature
git checkout -b feature/nome-feature
```

### 2. Sviluppa

```bash
# Fai le tue modifiche
# ...

# Testa localmente
npm run dev
```

### 3. Commit

```bash
# Aggiungi i file modificati
git add .

# Verifica cosa stai committando
git status

# Committa con un messaggio chiaro
git commit -m "feat: aggiungi nuova funzionalità"
```

### 4. Push

```bash
# Push del branch
git push origin feature/nome-feature
```

### 5. Pull Request

```bash
# Crea una Pull Request su GitHub
# Vai su: https://github.com/tuo-username/airklim/pulls
```

---

## 💬 Commit Messages

### Formato

Usa il formato **Conventional Commits**:

```
<tipo>(<scope>): <descrizione>

[corpo opzionale]

[footer opzionale]
```

### Tipi

- **feat**: Nuova funzionalità
- **fix**: Correzione bug
- **docs**: Solo documentazione
- **style**: Formattazione, punti, virgole (nessun cambiamento di codice)
- **refactor**: Refactoring del codice (nessuna nuova funzionalità)
- **perf**: Miglioramento performance
- **test**: Aggiunta o modifica test
- **chore**: Manutenzione, configurazione (nessun cambiamento di codice)

### Esempi

```bash
# Buona
git commit -m "feat: aggiungi filtro prodotti per categoria"
git commit -m "fix: correggi errore calcolo prezzo"
git commit -m "docs: aggiorna README con istruzioni setup"
git commit -m "refactor: semplifica logica carrello"
git commit -m "perf: ottimizza caricamento immagini"

# Cattiva
git commit -m "aggiunto filtro"  # Troppo vago
git commit -m "fix"              # Non dice cosa
git commit -m "WIP"              # Non committare work in progress
```

---

## 🔀 Pull Requests

### Prima di Creare una PR

1. **Assicurati che il codice funzioni**
   ```bash
   npm run build
   npm run test
   ```

2. **Verifica che non ci siano file da ignorare**
   ```bash
   git status
   ```

3. **Aggiorna il branch principale**
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/nome-feature
   git rebase main
   ```

### Creare la PR

1. Vai su GitHub
2. Clicca su "New Pull Request"
3. Seleziona il branch
4. Compila il template:

```markdown
## Descrizione
Descrivi brevemente cosa fa questa PR.

## Tipo di Cambiamento
- [ ] Bug fix
- [ ] Nuova funzionalità
- [ ] Breaking change
- [ ] Documentazione

## Testing
Descrivi come hai testato le modifiche.

## Checklist
- [ ] Il codice compila senza errori
- [ ] I test passano
- [ ] La documentazione è aggiornata
- [ ] Non ho committato file da ignorare
```

---

## 🎨 Code Style

### JavaScript/TypeScript

- Usa **TypeScript** per tutti i nuovi file
- Segui le convenzioni di naming:
  - `camelCase` per variabili e funzioni
  - `PascalCase` per componenti React e classi
  - `UPPER_SNAKE_CASE` per costanti

### React

- Usa **functional components** con hooks
- Separa la logica in hook custom
- Usa **TypeScript interfaces** per le props

### CSS

- Usa **Tailwind CSS** per lo styling
- Segui il design system esistente
- Usa classi utility invece di CSS custom

### Python

- Segui **PEP 8**
- Usa type hints
- Documenta le funzioni con docstrings

---

## 🧪 Testing

### Eseguire i Test

```bash
# Test unitari
npm run test

# Test con coverage
npm run test:coverage

# Test E2E
npm run test:e2e
```

### Scrivere Test

- Scrivi test per ogni nuova funzionalità
- Mantieni i test semplici e leggibili
- Usa nomi descrittivi per i test

---

## 📚 Documentazione

### Aggiornare la Documentazione

Se modifichi una funzionalità, aggiorna anche la documentazione:

- `README.md` - Documentazione principale
- `docs/` - Documentazione dettagliata
- Commenti nel codice - Per funzioni complesse

### Formato Documentazione

Usa Markdown per la documentazione:

```markdown
# Titolo

## Sezione

### Sottosezione

- Punto 1
- Punto 2

```bash
# Codice
npm run dev
```
```

---

## 🆘 Supporto

### Problemi Comuni

#### 1. File non vengono ignorati da Git

```bash
# Rimuovi i file dal cache
git rm -r --cached <file-o-directory>

# Committa la rimozione
git commit -m "chore: remove cached files"
```

#### 2. Conflitti di Merge

```bash
# Aggiorna il branch
git pull origin main

# Risolvi i conflitti
# ...

# Committa la risoluzione
git commit -m "merge: risolvi conflitti con main"
```

#### 3. Commit Sbagliato

```bash
# Annulla l'ultimo commit (mantieni le modifiche)
git reset --soft HEAD~1

# Annulla l'ultimo commit (perdi le modifiche)
git reset --hard HEAD~1
```

### Contatti

- **Email:** support@airklim.it
- **GitHub Issues:** https://github.com/tuo-username/airklim/issues

---

## 🎉 Grazie!

Grazie per contribuire al progetto AIRKLIM! Il tuo aiuto è fondamentale per migliorare il progetto.

Se hai domande o dubbi, non esitare a aprire una issue o contattare il team.

---

**Ultimo aggiornamento:** 16 Gennaio 2026
