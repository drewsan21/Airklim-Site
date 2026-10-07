#!/usr/bin/env python3
"""
AIRKLIM File Organizer
Organizza automaticamente file caricati in base al contenuto analizzato
"""

import os
import sys
import json
import re
import shutil
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime
from colorama import Fore, Style, init

init(autoreset=True)

class FileOrganizer:
    """Organizzatore automatico di file"""
    
    def __init__(self):
        self.uploads_dir = Path("public/uploads")
        self.images_dir = self.uploads_dir / "images"
        self.catalogs_dir = self.uploads_dir / "catalogs"
        self.data_dir = Path("data/extracted")
        
    def load_analysis_data(self) -> Dict[str, Any]:
        """Carica i dati dell'analisi"""
        analysis_file = self.data_dir / "advanced_pdf_analysis.json"
        
        if not analysis_file.exists():
            print(f"{Fore.YELLOW}⚠️  File analisi non trovato. Esegui prima analyze_pdfs.py{Style.RESET_ALL}")
            return {}
        
        with open(analysis_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def organize_images_by_product(self):
        """Organizza immagini per prodotto"""
        print(f"\n{Fore.CYAN}📁 Organizzazione immagini per prodotto...{Style.RESET_ALL}")
        
        # Trova tutte le immagini estratte
        extracted_dir = self.images_dir / "extracted"
        if not extracted_dir.exists():
            print(f"{Fore.YELLOW}⚠️  Nessuna immagine estratta trovata{Style.RESET_ALL}")
            return
        
        images = list(extracted_dir.glob("*.*"))
        
        if not images:
            print(f"{Fore.YELLOW}⚠️  Nessuna immagine da organizzare{Style.RESET_ALL}")
            return
        
        # Carica dati analisi
        analysis_data = self.load_analysis_data()
        
        # Crea mapping modello -> categoria
        model_to_category = {}
        for pdf_data in analysis_data:
            for product in pdf_data.get('products', []):
                model = product.get('model', '').upper()
                category = product.get('category', 'uncategorized')
                brand = product.get('brand', 'unknown')
                
                if model:
                    model_to_category[model] = {
                        'category': category,
                        'brand': brand
                    }
        
        # Organizza immagini
        organized = 0
        for img_path in images:
            img_name = img_path.stem.upper()
            
            # Cerca modello nel nome file
            matched_model = None
            for model in model_to_category.keys():
                if model in img_name:
                    matched_model = model
                    break
            
            if matched_model:
                category_info = model_to_category[matched_model]
                brand = category_info['brand'].lower()
                category = category_info['category']
                
                # Crea directory di destinazione
                dest_dir = self.images_dir / brand / category
                dest_dir.mkdir(parents=True, exist_ok=True)
                
                # Sposta immagine
                dest_path = dest_dir / img_path.name
                shutil.move(str(img_path), str(dest_path))
                
                print(f"{Fore.GREEN}  ✓ {img_path.name} -> {brand}/{category}/{Style.RESET_ALL}")
                organized += 1
            else:
                # Sposta in directory unknown
                unknown_dir = self.images_dir / "unknown"
                unknown_dir.mkdir(exist_ok=True)
                dest_path = unknown_dir / img_path.name
                shutil.move(str(img_path), str(dest_path))
                print(f"{Fore.YELLOW}  ? {img_path.name} -> unknown/{Style.RESET_ALL}")
        
        print(f"\n{Fore.GREEN}✓ Organizzate {organized} immagini{Style.RESET_ALL}")
    
    def organize_catalogs_by_brand_year(self):
        """Organizza cataloghi per brand e anno"""
        print(f"\n{Fore.CYAN}📁 Organizzazione cataloghi per brand e anno...{Style.RESET_ALL}")
        
        # Trova tutti i PDF caricati
        uploaded_dir = self.catalogs_dir / "uploaded"
        if not uploaded_dir.exists():
            print(f"{Fore.YELLOW}⚠️  Directory uploaded non trovata{Style.RESET_ALL}")
            return
        
        pdfs = list(uploaded_dir.glob("*.pdf"))
        
        if not pdfs:
            print(f"{Fore.YELLOW}⚠️  Nessun PDF da organizzare{Style.RESET_ALL}")
            return
        
        # Carica dati analisi
        analysis_data = self.load_analysis_data()
        
        # Crea mapping filename -> brand/year
        file_info = {}
        for pdf_data in analysis_data:
            filename = pdf_data.get('filename', '')
            brand = pdf_data.get('brand', 'unknown')
            
            # Estrai anno dal nome file o dal contenuto
            year_match = re.search(r'(20\d{2})', filename)
            if year_match:
                year = year_match.group(1)
            else:
                year = datetime.now().strftime('%Y')
            
            file_info[filename] = {
                'brand': brand,
                'year': year
            }
        
        # Organizza PDF
        organized = 0
        for pdf_path in pdfs:
            pdf_name = pdf_path.name
            
            if pdf_name in file_info:
                info = file_info[pdf_name]
                brand = info['brand'].lower()
                year = info['year']
                
                # Crea directory di destinazione
                dest_dir = self.catalogs_dir / brand / year
                dest_dir.mkdir(parents=True, exist_ok=True)
                
                # Sposta PDF
                dest_path = dest_dir / pdf_name
                shutil.move(str(pdf_path), str(dest_path))
                
                print(f"{Fore.GREEN}  ✓ {pdf_name} -> {brand}/{year}/{Style.RESET_ALL}")
                organized += 1
            else:
                # Sposta in directory unknown
                unknown_dir = self.catalogs_dir / "unknown"
                unknown_dir.mkdir(exist_ok=True)
                dest_path = unknown_dir / pdf_name
                shutil.move(str(pdf_path), str(dest_path))
                print(f"{Fore.YELLOW}  ? {pdf_name} -> unknown/{Style.RESET_ALL}")
        
        print(f"\n{Fore.GREEN}✓ Organizzati {organized} cataloghi{Style.RESET_ALL}")
    
    def rename_files_with_model(self):
        """Rinomina file includendo il modello identificato"""
        print(f"\n{Fore.CYAN}📝 Rinomina file con modello identificato...{Style.RESET_ALL}")
        
        # Carica dati analisi
        analysis_data = self.load_analysis_data()
        
        # Crea mapping modello -> info
        model_info = {}
        for pdf_data in analysis_data:
            for product in pdf_data.get('products', []):
                model = product.get('model', '')
                if model:
                    model_info[model.upper()] = {
                        'category': product.get('category', 'unknown'),
                        'brand': product.get('brand', 'unknown'),
                        'power': product.get('specifications', {}).get('power_cooling', '')
                    }
        
        # Trova immagini nelle directory organized
        renamed = 0
        for img_path in self.images_dir.rglob("*.*"):
            if img_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
                img_name = img_path.stem.upper()
                
                # Cerca modello nel nome
                matched_model = None
                for model in model_info.keys():
                    if model in img_name:
                        matched_model = model
                        break
                
                if matched_model and not img_name.startswith(matched_model):
                    # Rinomina file
                    info = model_info[matched_model]
                    new_name = f"{matched_model}_{info['category']}_{info['brand']}{img_path.suffix}"
                    new_path = img_path.parent / new_name
                    
                    try:
                        img_path.rename(new_path)
                        print(f"{Fore.GREEN}  ✓ {img_path.name} -> {new_name}{Style.RESET_ALL}")
                        renamed += 1
                    except Exception as e:
                        print(f"{Fore.RED}  ✗ Errore rinomina {img_path.name}: {e}{Style.RESET_ALL}")
        
        print(f"\n{Fore.GREEN}✓ Rinominati {renamed} file{Style.RESET_ALL}")
    
    def generate_organization_report(self):
        """Genera report dell'organizzazione"""
        print(f"\n{Fore.CYAN}📊 Generazione report organizzazione...{Style.RESET_ALL}")
        
        report_file = Path("logs/organization_report.md")
        report_file.parent.mkdir(exist_ok=True)
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("# 📁 Report Organizzazione File\n\n")
            f.write(f"**Data:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            
            # Conta file per directory
            f.write("## 📊 Statistiche\n\n")
            
            # Immagini
            f.write("### Immagini\n\n")
            for brand_dir in self.images_dir.iterdir():
                if brand_dir.is_dir() and brand_dir.name not in ['optimized', 'thumbnails', 'extracted', 'uploaded']:
                    count = len(list(brand_dir.rglob("*.*")))
                    f.write(f"- **{brand_dir.name.upper()}:** {count} immagini\n")
                    
                    for category_dir in brand_dir.iterdir():
                        if category_dir.is_dir():
                            cat_count = len(list(category_dir.glob("*.*")))
                            f.write(f"  - {category_dir.name}: {cat_count}\n")
            
            # Cataloghi
            f.write("\n### Cataloghi PDF\n\n")
            for brand_dir in self.catalogs_dir.iterdir():
                if brand_dir.is_dir() and brand_dir.name != 'uploaded':
                    count = len(list(brand_dir.rglob("*.pdf")))
                    f.write(f"- **{brand_dir.name.upper()}:** {count} cataloghi\n")
                    
                    for year_dir in brand_dir.iterdir():
                        if year_dir.is_dir():
                            year_count = len(list(year_dir.glob("*.pdf")))
                            f.write(f"  - {year_dir.name}: {year_count}\n")
            
            f.write("\n---\n\n")
            f.write("**Generato automaticamente da File Organizer**\n")
        
        print(f"{Fore.GREEN}✓ Report salvato in {report_file}{Style.RESET_ALL}")
    
    def run(self):
        """Esegue l'organizzazione completa"""
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}📁 AIRKLIM File Organizer{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        # Organizza immagini
        self.organize_images_by_product()
        
        # Organizza cataloghi
        self.organize_catalogs_by_brand_year()
        
        # Rinomina file
        self.rename_files_with_model()
        
        # Genera report
        self.generate_organization_report()
        
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}✅ Organizzazione Completata{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")

def main():
    """Funzione principale"""
    organizer = FileOrganizer()
    organizer.run()

if __name__ == "__main__":
    main()
