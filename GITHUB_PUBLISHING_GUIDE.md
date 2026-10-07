# 🚀 Guida al Publishing su GitHub

Questa guida ti aiuterà a risolvere i problemi di publishing su GitHub e a mantenere il repository pulito.

---

## 📋 Indice

1. [Problemi Comuni](#problemi-comuni)
2. [Soluzione Rapida](#soluzione-rapida)
3. [Soluzione Completa](#soluzione-completa)
4. [Verifica Repository](#verifica-repository)
5. [Publishing su GitHub](#publishing-su-github)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## ⚠️ Problemi Comuni

### 1. File Troppo Grandi
**Errore:** `remote: error: File X is Y MB; this exceeds GitHub's file size limit of 100.00 MB`

**Causa:** File binari (PDF, immagini, video) troppo grandi committati nel repository.

### 2. Repository Troppo Grande
**Errore:** `remote: error: GH001: Large files detected. You may want to try Git Large File Storage.`

**Causa:** Repository supera il limite di 1GB.

### 3. File da Ignorare Committati
**Problema:** File come `node_modules/`, `dist/`, `logs/` sono nel repository.

**Causa:** `.gitignore` non configurato correttamente o file committati prima di configurarlo.

---

## 🚀 Soluzione Rapida

Se hai solo bisogno di una soluzione veloce:

```bash
# 1. Esegui lo script di pulizia
chmod +x scripts/cleanup-repo.sh
./scripts/cleanup-repo.sh

# 2. Verifica la dimensione dei file
chmod +x scripts/check-file-sizes.sh
./scripts/check-file-sizes.sh

# 3. Committa le modifiche
git add .gitignore .gitattributes CONTRIBUTING.md
git add scripts/cleanup-repo.sh scripts/check-file-sizes.sh
git commit -m "chore: add git configuration and cleanup scripts"

# 4. Push su GitHub
git push origin main
```

---

## 🔧 Soluzione Completa

### Passo 1: Verifica lo Stato del Repository

```bash
# Verifica quali file sono committati
git status

# Verifica la dimensione del repository
du -sh .git

# Verifica file grandi
find . -type f -size +50M -not -path "./node_modules/*" -not -path "./.git/*"
```

### Passo 2: Rimuovi File Non Necessari dal Repository

```bash
# Rimuovi file dal repository (ma non dal filesystem)
git rm -r --cached public/uploads/images/optimized/
git rm -r --cached public/uploads/images/thumbnails/
git rm -r --cached public/uploads/images/extracted/
git rm -r --cached public/uploads/catalogs/*.pdf
git rm -r --cached data/extracted/
git rm -r --cached logs/
git rm -r --cached backups/
git rm -r --cached node_modules/
git rm -r --cached dist/
git rm -r --cached venv/
git rm -r --cached __pycache__/

# Committa la rimozione
git commit -m "chore: remove cached files from repository"
```

### Passo 3: Aggiorna .gitignore

Il file `.gitignore` è già stato aggiornato con tutte le regole necessarie. Verifica che sia corretto:

```bash
cat .gitignore
```

### Passo 4: Aggiungi .gitattributes

Il file `.gitattributes` è già stato creato per gestire correttamente i file di testo e binari.

### Passo 5: Pulisci la Cronologia Git (Opzionale)

Se il repository è ancora troppo grande, puoi pulire la cronologia:

**⚠️ ATTENZIONE:** Questo comando riscrive la storia del repository!

```bash
# Installa git-filter-repo
pip install git-filter-repo

# Rimuovi file grandi dalla storia
git filter-repo --strip-blobs-with-ids <(git rev-list --objects --all | grep -E '\.(pdf|jpg|png|zip)$' | cut -d' ' -f1)

# Forza il push
git push --force origin main
```

### Passo 6: Verifica la Dimensione

```bash
# Verifica dimensione repository
du -sh .git

# Verifica file committati
git ls-files | wc -l

# Verifica dimensione file committati
git ls-files | xargs du -ch | tail -1
```

---

## ✅ Verifica Repository

Prima di pubblicare su GitHub, verifica che il repository sia pulito:

```bash
# 1. Verifica .gitignore
git check-ignore -v public/uploads/images/optimized/test.jpg
# Dovrebbe mostrare che il file è ignorato

# 2. Verifica file committati
git ls-files | grep -E '(node_modules|dist|logs|backups|venv)'
# Non dovrebbe mostrare nulla

# 3. Verifica dimensione
du -sh .git
# Dovrebbe essere < 100MB

# 4. Verifica file grandi
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '/^blob/ {print substr($0,6)}' | sort -rnk2 | head -10
# Mostra i 10 file più grandi
```

---

## 🌐 Publishing su GitHub

### 1. Crea il Repository su GitHub

Vai su [GitHub](https://github.com) e crea un nuovo repository:
- Nome: `airklim`
- Visibilità: Public o Private
- **NON** inizializzare con README, .gitignore, o license

### 2. Configura il Repository Locale

```bash
# Aggiungi il remote
git remote add origin https://github.com/tuo-username/airklim.git

# Verifica il remote
git remote -v
```

### 3. Push su GitHub

```bash
# Push del branch principale
git push -u origin main

# Se hai altri branch
git push origin feature/nome-feature
```

### 4. Verifica su GitHub

Vai su `https://github.com/tuo-username/airklim` e verifica che:
- Il repository sia stato creato correttamente
- I file siano presenti
- Non ci siano errori

---

## 📚 Best Practices

### 1. Usa .gitignore Correttamente

Aggiungi sempre i file da ignorare al `.gitignore` **prima** di committarli:

```bash
# Aggiungi al .gitignore
echo "nuovo-file-da-ignorare/" >> .gitignore

# Verifica che sia ignorato
git check-ignore -v nuovo-file-da-ignorare/test.txt
```

### 2. Committa Spesso

Fai commit piccoli e frequenti con messaggi chiari:

```bash
# Buona pratica
git add src/components/NuovoComponente.tsx
git commit -m "feat: aggiungi nuovo componente per prodotti"

# Cattiva pratica
git add .
git commit -m "aggiornamenti"
```

### 3. Usa Branch per le Feature

```bash
# Crea un branch per la feature
git checkout -b feature/nuova-funzionalita

# Sviluppa la feature
# ...

# Torna al main e merge
git checkout main
git merge feature/nuova-funzionalita
```

### 4. Mantieni il Repository Pulito

Periodicamente, verifica e pulisci il repository:

```bash
# Verifica file non tracciati
git status

# Verifica file grandi
./scripts/check-file-sizes.sh

# Pulisci se necessario
./scripts/cleanup-repo.sh
```

### 5. Usa Git LFS per File Grandi (Opzionale)

Se hai bisogno di committare file grandi (immagini, video):

```bash
# Installa Git LFS
git lfs install

# Traccia i file grandi
git lfs track "*.psd"
git lfs track "*.zip"

# Committa il file .gitattributes
git add .gitattributes
git commit -m "chore: configure Git LFS"
```

---

## 🐛 Troubleshooting

### Problema: "rejected - non-fast-forward"

**Causa:** Il repository remoto ha commit che non hai localmente.

**Soluzione:**
```bash
# Pull delle modifiche remote
git pull origin main --rebase

# Risolvi eventuali conflitti
# ...

# Push di nuovo
git push origin main
```

### Problema: "error: failed to push some refs"

**Causa:** Hai forzato il push ma il remoto ha cambiato.

**Soluzione:**
```bash
# Pull delle modifiche remote
git pull origin main

# Risolvi eventuali conflitti
# ...

# Push di nuovo
git push origin main
```

### Problema: "fatal: The remote end hung up unexpectedly"

**Causa:** File troppo grande o connessione instabile.

**Soluzione:**
```bash
# Aumenta il buffer HTTP
git config http.postBuffer 524288000

# Prova di nuovo
git push origin main
```

### Problema: "error: RPC failed; curl 92 HTTP/2 stream 0 was not closed cleanly"

**Causa:** Problema di rete o file troppo grande.

**Soluzione:**
```bash
# Usa HTTP/1.1 invece di HTTP/2
git config --global http.version HTTP/1.1

# Aumenta il buffer
git config http.postBuffer 524288000

# Prova di nuovo
git push origin main
```

### Problema: File grandi ancora nel repository

**Causa:** I file sono nella storia Git anche se rimossi.

**Soluzione:**
```bash
# Installa BFG Repo-Cleaner
brew install bfg  # macOS
# o
sudo apt install bfg  # Ubuntu

# Rimuovi file grandi dalla storia
bfg --strip-blobs-with-ids large-files.txt

# Pulisci e forza il push
git reflog expire --expire=now --all
git gc --prune=now
git push --force origin main
```

---

## 📞 Supporto

Se hai problemi con il publishing su GitHub:

1. **Verifica la documentazione GitHub:** https://docs.github.com/en/repositories
2. **Controlla lo stato di GitHub:** https://www.githubstatus.com/
3. **Apri una issue:** https://github.com/tuo-username/airklim/issues
4. **Contatta il supporto:** support@airklim.it

---

## ✅ Checklist Pre-Publishing

Prima di pubblicare su GitHub, verifica:

- [ ] `.gitignore` configurato correttamente
- [ ] `.gitattributes` configurato correttamente
- [ ] File non necessari rimossi dal repository
- [ ] Dimensione repository < 1GB
- [ ] Nessun file > 100MB
- [ ] `node_modules/` non committato
- [ ] `dist/` non committato
- [ ] `logs/` non committato
- [ ] `backups/` non committato
- [ ] File PDF non committati
- [ ] README.md presente e aggiornato
- [ ] CONTRIBUTING.md presente
- [ ] Licenza aggiunta (opzionale)

---

## 🎉 Fatto!

Il tuo repository è ora pronto per GitHub!

**Prossimi passi:**
1. Crea il repository su GitHub
2. Configura il remote
3. Push del codice
4. Verifica su GitHub
5. Configura GitHub Actions (opzionale)
6. Configura GitHub Pages (opzionale)

---

**Ultimo aggiornamento:** 16 Gennaio 2026
