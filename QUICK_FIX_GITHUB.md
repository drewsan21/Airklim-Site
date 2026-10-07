# 🚀 Guida Rapida - Risoluzione Problemi GitHub

## ⚡ Soluzione in 3 Step

### 1. Verifica i Problemi
```bash
chmod +x scripts/verify-github-ready.sh
./scripts/verify-github-ready.sh
```

### 2. Pulisci il Repository
```bash
chmod +x scripts/cleanup-repo.sh
./scripts/cleanup-repo.sh
```

### 3. Committa e Push
```bash
git add .gitignore .gitattributes CONTRIBUTING.md
git add scripts/*.sh
git commit -m "chore: fix GitHub publishing issues"
git push origin main
```

---

## 📋 Problemi Comuni e Soluzioni

### ❌ Errore: "File X is Y MB; exceeds GitHub's file size limit"

**Soluzione:**
```bash
# Rimuovi file grandi dal repository
git rm -r --cached public/uploads/catalogs/*.pdf
git rm -r --cached public/uploads/images/optimized/
git rm -r --cached public/uploads/images/thumbnails/
git commit -m "chore: remove large files"
git push
```

### ❌ Errore: "node_modules committato"

**Soluzione:**
```bash
git rm -r --cached node_modules/
git commit -m "chore: remove node_modules"
git push
```

### ❌ Errore: "dist/ committato"

**Soluzione:**
```bash
git rm -r --cached dist/
git commit -m "chore: remove dist"
git push
```

### ❌ Errore: "File PDF committati"

**Soluzione:**
```bash
git rm -r --cached public/uploads/catalogs/*.pdf
git commit -m "chore: remove PDF files"
git push
```

---

## ✅ Checklist Pre-Publishing

Prima di pubblicare su GitHub, verifica:

- [ ] `.gitignore` configurato correttamente
- [ ] `.gitattributes` presente
- [ ] `node_modules/` non committato
- [ ] `dist/` non committato
- [ ] `logs/` non committato
- [ ] `backups/` non committato
- [ ] File PDF non committati
- [ ] Nessun file > 100MB
- [ ] README.md presente
- [ ] CONTRIBUTING.md presente

---

## 📚 Documentazione Completa

Per una guida dettagliata, consulta:
- **GITHUB_PUBLISHING_GUIDE.md** - Guida completa al publishing
- **CONTRIBUTING.md** - Guida per contribuire
- **README.md** - Documentazione principale

---

## 🆘 Supporto

Se hai ancora problemi:
1. Esegui `./scripts/verify-github-ready.sh` per un report dettagliato
2. Consulta `GITHUB_PUBLISHING_GUIDE.md` per soluzioni avanzate
3. Apri una issue su GitHub

---

**Repository pronto per GitHub!** 🎉
