#!/usr/bin/env python3
"""
AIRKLIM Local Server
Server locale per sviluppo e testing con hot reload
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import shutil
from datetime import datetime

# Crea app FastAPI
app = FastAPI(title="AIRKLIM Local Server", version="1.0.0")

# Configura CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory paths
BASE_DIR = Path(__file__).parent.parent
UPLOADS_DIR = BASE_DIR / "public" / "uploads"
DATA_DIR = BASE_DIR / "data"
SCRIPTS_DIR = BASE_DIR / "scripts"

# Monta directory statiche
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")

@app.get("/", response_class=HTMLResponse)
async def root():
    """Pagina principale"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>AIRKLIM Local Server</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            h1 { color: #0ea5e9; }
            .card { background: #1e293b; color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .btn { background: #0ea5e9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; margin: 5px; }
            .btn:hover { background: #0284c7; }
            a { color: #0ea5e9; }
        </style>
    </head>
    <body>
        <h1>🚀 AIRKLIM Local Server</h1>
        <div class="card">
            <h2>📊 Status</h2>
            <p>Server attivo e funzionante</p>
            <p>Timestamp: <span id="timestamp"></span></p>
        </div>
        
        <div class="card">
            <h2>🔗 Link Rapidi</h2>
            <a href="http://localhost:5173" class="btn">🌐 Sito Frontend</a>
            <a href="http://localhost:5173/#admin" class="btn">🔐 Admin Dashboard</a>
            <a href="/docs" class="btn">📚 API Documentation</a>
            <a href="/uploads" class="btn">📁 File Uploads</a>
            <a href="/data" class="btn">📊 Data Files</a>
        </div>
        
        <div class="card">
            <h2>🛠️ Script Disponibili</h2>
            <a href="/run/extract-products" class="btn">🔍 Estrai Prodotti PDF</a>
            <a href="/run/analyze-images" class="btn">🖼️ Analizza Immagini</a>
            <a href="/run/auto-categorize" class="btn">🏷️ Categorizza Automaticamente</a>
            <a href="/run/optimize-images" class="btn">⚡ Ottimizza Immagini</a>
            <a href="/run/check-missing" class="btn">🔍 Verifica Mancanti</a>
            <a href="/run/import-products" class="btn">📥 Importa Prodotti</a>
            <a href="/run/build" class="btn">🏗️ Build Sito</a>
        </div>
        
        <script>
            document.getElementById('timestamp').textContent = new Date().toLocaleString('it-IT');
        </script>
    </body>
    </html>
    """

@app.get("/status")
async def get_status():
    """Status del server"""
    return {
        "status": "active",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/files/images")
async def list_images():
    """Lista tutte le immagini caricate"""
    images_dir = UPLOADS_DIR / "images"
    if not images_dir.exists():
        return {"images": []}
    
    images = []
    for img_path in images_dir.rglob("*"):
        if img_path.is_file() and img_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
            images.append({
                "name": img_path.name,
                "path": str(img_path.relative_to(BASE_DIR)),
                "size": img_path.stat().st_size,
                "modified": datetime.fromtimestamp(img_path.stat().st_mtime).isoformat()
            })
    
    return {"images": images, "total": len(images)}

@app.get("/files/pdfs")
async def list_pdfs():
    """Lista tutti i PDF caricati"""
    catalogs_dir = UPLOADS_DIR / "catalogs"
    if not catalogs_dir.exists():
        return {"pdfs": []}
    
    pdfs = []
    for pdf_path in catalogs_dir.rglob("*.pdf"):
        if pdf_path.is_file():
            pdfs.append({
                "name": pdf_path.name,
                "path": str(pdf_path.relative_to(BASE_DIR)),
                "size": pdf_path.stat().st_size,
                "modified": datetime.fromtimestamp(pdf_path.stat().st_mtime).isoformat()
            })
    
    return {"pdfs": pdfs, "total": len(pdfs)}

@app.post("/upload/images")
async def upload_images(files: list[UploadFile] = File(...)):
    """Upload immagini prodotti"""
    uploaded = []
    
    for file in files:
        # Determina percorso di upload
        filename = file.filename
        ext = Path(filename).suffix.lower()
        
        if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
            continue
        
        # Salva in directory images
        save_path = UPLOADS_DIR / "images" / "uploaded" / filename
        save_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(save_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        uploaded.append({
            "filename": filename,
            "path": str(save_path.relative_to(BASE_DIR)),
            "size": save_path.stat().st_size
        })
    
    return {"uploaded": uploaded, "total": len(uploaded)}

@app.post("/upload/pdfs")
async def upload_pdfs(files: list[UploadFile] = File(...)):
    """Upload cataloghi PDF"""
    uploaded = []
    
    for file in files:
        filename = file.filename
        ext = Path(filename).suffix.lower()
        
        if ext != '.pdf':
            continue
        
        # Salva in directory catalogs
        save_path = UPLOADS_DIR / "catalogs" / "uploaded" / filename
        save_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(save_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        uploaded.append({
            "filename": filename,
            "path": str(save_path.relative_to(BASE_DIR)),
            "size": save_path.stat().st_size
        })
    
    return {"uploaded": uploaded, "total": len(uploaded)}

def run_script(script_name: str) -> dict:
    """Esegue uno script Python"""
    script_path = SCRIPTS_DIR / script_name
    
    if not script_path.exists():
        return {"error": f"Script non trovato: {script_name}"}
    
    try:
        result = subprocess.run(
            [sys.executable, str(script_path)],
            capture_output=True,
            text=True,
            cwd=str(BASE_DIR),
            timeout=300  # 5 minuti timeout
        )
        
        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr,
            "returncode": result.returncode
        }
    except subprocess.TimeoutExpired:
        return {"error": "Timeout: script eseguito per più di 5 minuti"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/run/{script_name}")
async def run_script_endpoint(script_name: str):
    """Esegue uno script"""
    script_map = {
        "extract-products": "analyze_pdfs.py",
        "analyze-images": "analyze_images.py",
        "auto-categorize": "auto_categorize.py",
        "optimize-images": "optimize-images.js",
        "check-missing": "check-missing-images.js",
        "import-products": "import-products.js",
        "build": None  # Speciale
    }
    
    if script_name not in script_map:
        raise HTTPException(status_code=404, detail="Script non trovato")
    
    if script_name == "build":
        # Esegui build npm
        try:
            result = subprocess.run(
                ["npm", "run", "build"],
                capture_output=True,
                text=True,
                cwd=str(BASE_DIR),
                timeout=120
            )
            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr
            }
        except Exception as e:
            return {"error": str(e)}
    
    script_file = script_map[script_name]
    
    if script_file.endswith('.py'):
        result = run_script(script_file)
    else:
        # Script Node.js
        try:
            result = subprocess.run(
                ["node", f"scripts/{script_file}"],
                capture_output=True,
                text=True,
                cwd=str(BASE_DIR),
                timeout=300
            )
            result = {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr,
                "returncode": result.returncode
            }
        except Exception as e:
            result = {"error": str(e)}
    
    return result

@app.get("/data/extracted")
async def get_extracted_data():
    """Restituisce i dati estratti"""
    extracted_dir = DATA_DIR / "extracted"
    
    if not extracted_dir.exists():
        return {"files": []}
    
    files = []
    for file_path in extracted_dir.glob("*.json"):
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                files.append({
                    "name": file_path.name,
                    "path": str(file_path.relative_to(BASE_DIR)),
                    "size": file_path.stat().st_size,
                    "preview": data if isinstance(data, list) and len(data) < 10 else None
                })
            except:
                files.append({
                    "name": file_path.name,
                    "path": str(file_path.relative_to(BASE_DIR)),
                    "size": file_path.stat().st_size,
                    "preview": None
                })
    
    return {"files": files}

def main():
    """Avvia il server"""
    print(f"\n{'='*60}")
    print(f"🚀 AIRKLIM Local Server")
    print(f"{'='*60}\n")
    
    print(f"📂 Directory base: {BASE_DIR}")
    print(f"📁 Uploads: {UPLOADS_DIR}")
    print(f"📊 Data: {DATA_DIR}")
    print(f"🛠️  Scripts: {SCRIPTS_DIR}\n")
    
    print(f"🌐 Server URLs:")
    print(f"   - Main: http://localhost:8000")
    print(f"   - API Docs: http://localhost:8000/docs")
    print(f"   - Frontend: http://localhost:5173\n")
    
    print(f"⚡ Avvio server...\n")
    
    uvicorn.run(
        "local_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
