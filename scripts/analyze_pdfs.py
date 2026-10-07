#!/usr/bin/env python3
"""
AIRKLIM PDF Analyzer
Analisi automatica di cataloghi PDF con OCR e estrazione intelligente
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import Dict, List, Any, Tuple
import fitz  # PyMuPDF
from pdf2image import convert_from_path
import pytesseract
from PIL import Image
import pandas as pd
from tqdm import tqdm
from colorama import Fore, Style, init

init(autoreset=True)

class PDFAnalyzer:
    """Analizzatore intelligente di cataloghi PDF"""
    
    def __init__(self, catalogs_dir: str = "public/uploads/catalogs"):
        self.catalogs_dir = Path(catalogs_dir)
        self.output_dir = Path("data/extracted")
        self.images_dir = Path("public/uploads/images/extracted")
        
        # Crea directory se non esistono
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.images_dir.mkdir(parents=True, exist_ok=True)
        
        # Pattern per identificare codici modello
        self.model_patterns = {
            'panasonic': [
                r'CS-[A-Z0-9\-]+',  # Unità interne
                r'CU-[A-Z0-9\-]+',  # Unità esterne
                r'PAW-[A-Z0-9\-]+', # Gateway
                r'CZ-[A-Z0-9\-]+'  # Accessori
            ],
            'tcl': [
                r'[A-Z]\d{2}[A-Z0-9]+',  # Modelli TCL
            ],
            'generic': [
                r'[A-Z]{2,4}-?\d{2,5}[A-Z0-9\-]*'  # Pattern generico
            ]
        }
        
        # Pattern per specifiche tecniche
        self.spec_patterns = {
            'power_kw': r'(\d+[\.,]?\d*)\s*kW',
            'power_btu': r'(\d{4,5})\s*BTU',
            'seer': r'SEER[:\s]*(\d+[\.,]?\d*)',
            'scop': r'SCOP[:\s]*(\d+[\.,]?\d*)',
            'noise': r'(\d{2})\s*dB',
            'dimensions': r'(\d+)\s*[x×]\s*(\d+)\s*[x×]\s*(\d+)\s*mm',
            'weight': r'(\d+[\.,]?\d*)\s*kg',
            'refrigerant': r'(R32|R290|R410A|R134a)',
            'voltage': r'(\d+)\s*V',
            'current': r'(\d+[\.,]?\d*)\s*A'
        }
        
        # Pattern per caratteristiche
        self.feature_patterns = {
            'nanoe_x': r'nanoe[™]?\s*X',
            'aerowings': r'Aerowings?',
            'wifi': r'Wi-?Fi',
            'google_home': r'Google\s*Home',
            'alexa': r'Alexa',
            'inverter': r'Inverter',
            'eco_mode': r'ECO|AI\s*ECO',
            'silent': r'Silent|Quiet',
            'heat_pump': r'Pompa\s*di\s*calore|Heat\s*pump'
        }
        
        # Pattern per categorie
        self.category_patterns = {
            'etherea': r'Etherea|XZ|Z\d{2,3}',
            'tz': r'\bTZ\b|Super-?Compatta',
            'console': r'Console|Pavimento|Floor',
            'ducted': r'Canalizzat|Ducted',
            'cassette': r'Cassett|Ceiling',
            'professional': r'Professional|Professionale|-25°C',
            'multi_split': r'Multi-?Split|Dual|Trial|Quad|Penta',
            'outdoor': r'Unità\s*esterna|Outdoor|Condensatore',
            'heat_pump': r'Aquarea|Pompa\s*di\s*calore',
            'accessory': r'Telecomando|Gateway|Filtro|Accessorio'
        }
        
    def find_all_pdfs(self) -> List[Path]:
        """Trova tutti i file PDF nella directory catalogs"""
        print(f"{Fore.CYAN}🔍 Ricerca PDF in {self.catalogs_dir}...{Style.RESET_ALL}")
        
        pdfs = list(self.catalogs_dir.rglob("*.pdf"))
        
        if not pdfs:
            print(f"{Fore.YELLOW}⚠️  Nessun PDF trovato{Style.RESET_ALL}")
            return []
        
        print(f"{Fore.GREEN}✓ Trovati {len(pdfs)} PDF{Style.RESET_ALL}")
        for pdf in pdfs:
            print(f"  - {pdf.relative_to(self.catalogs_dir)}")
        
        return pdfs
    
    def extract_text_from_pdf(self, pdf_path: Path) -> Tuple[str, List[Dict]]:
        """Estrae testo e immagini da un PDF"""
        print(f"\n{Fore.CYAN}📄 Analisi: {pdf_path.name}{Style.RESET_ALL}")
        
        doc = fitz.open(pdf_path)
        full_text = ""
        pages_data = []
        
        for page_num in tqdm(range(len(doc)), desc="  Estrazione pagine", ncols=80):
            page = doc[page_num]
            
            # Estrai testo
            text = page.get_text()
            full_text += f"\n--- PAGE {page_num + 1} ---\n{text}"
            
            # Estrai immagini
            images = page.get_images()
            page_images = []
            
            for img_index, img in enumerate(images):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Salva immagine
                img_filename = f"{pdf_path.stem}_page{page_num+1}_img{img_index+1}.{image_ext}"
                img_path = self.images_dir / img_filename
                
                with open(img_path, "wb") as f:
                    f.write(image_bytes)
                
                page_images.append({
                    'page': page_num + 1,
                    'path': str(img_path),
                    'filename': img_filename
                })
            
            pages_data.append({
                'page': page_num + 1,
                'text': text,
                'images': page_images
            })
        
        doc.close()
        
        print(f"{Fore.GREEN}  ✓ Estratte {len(pages_data)} pagine e {sum(len(p['images']) for p in pages_data)} immagini{Style.RESET_ALL}")
        
        return full_text, pages_data
    
    def perform_ocr_on_images(self, pages_data: List[Dict]) -> List[Dict]:
        """Esegue OCR sulle immagini estratte"""
        print(f"\n{Fore.CYAN}🔍 Esecuzione OCR sulle immagini...{Style.RESET_ALL}")
        
        for page_data in tqdm(pages_data, desc="  OCR", ncols=80):
            for img_data in page_data['images']:
                img_path = Path(img_data['path'])
                
                if img_path.exists():
                    try:
                        # Apri immagine
                        img = Image.open(img_path)
                        
                        # Esegui OCR
                        text = pytesseract.image_to_string(img, lang='ita+eng')
                        
                        # Salva testo OCR
                        img_data['ocr_text'] = text
                        
                        if text.strip():
                            print(f"{Fore.GREEN}    ✓ OCR completato per {img_data['filename']}{Style.RESET_ALL}")
                    except Exception as e:
                        print(f"{Fore.RED}    ✗ Errore OCR per {img_data['filename']}: {e}{Style.RESET_ALL}")
                        img_data['ocr_text'] = ""
        
        return pages_data
    
    def identify_brand(self, text: str, filename: str) -> str:
        """Identifica il brand dal testo o nome file"""
        text_lower = text.lower()
        filename_lower = filename.lower()
        
        if 'panasonic' in text_lower or 'panasonic' in filename_lower:
            return 'panasonic'
        elif 'tcl' in text_lower or 'tcl' in filename_lower:
            return 'tcl'
        elif 'daikin' in text_lower or 'daikin' in filename_lower:
            return 'daikin'
        elif 'mitsubishi' in text_lower or 'mitsubishi' in filename_lower:
            return 'mitsubishi'
        else:
            return 'unknown'
    
    def extract_models(self, text: str, brand: str) -> List[str]:
        """Estrae codici modello dal testo"""
        models = set()
        
        # Usa pattern specifici per brand
        patterns = self.model_patterns.get(brand, self.model_patterns['generic'])
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            models.update(matches)
        
        return sorted(list(models))
    
    def extract_specifications(self, text: str) -> Dict[str, Any]:
        """Estrae specifiche tecniche dal testo"""
        specs = {}
        
        for spec_name, pattern in self.spec_patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                if spec_name == 'dimensions':
                    specs[spec_name] = f"{match.group(1)}×{match.group(2)}×{match.group(3)} mm"
                else:
                    value = match.group(1).replace(',', '.')
                    try:
                        specs[spec_name] = float(value)
                    except:
                        specs[spec_name] = value
        
        return specs
    
    def extract_features(self, text: str) -> List[str]:
        """Estrae caratteristiche dal testo"""
        features = []
        
        for feature_name, pattern in self.feature_patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                features.append(feature_name)
        
        return features
    
    def categorize_product(self, text: str, model: str) -> str:
        """Categorizza il prodotto in base al testo e modello"""
        text_lower = text.lower()
        model_lower = model.lower()
        
        for category, pattern in self.category_patterns.items():
            if re.search(pattern, text_lower) or re.search(pattern, model_lower):
                return category
        
        return 'uncategorized'
    
    def extract_product_context(self, text: str, model: str, context_size: int = 500) -> str:
        """Estrae il contesto attorno a un modello"""
        # Trova posizione del modello
        match = re.search(re.escape(model), text, re.IGNORECASE)
        if not match:
            return ""
        
        # Estrai contesto
        start = max(0, match.start() - context_size)
        end = min(len(text), match.end() + context_size)
        
        return text[start:end]
    
    def analyze_pdf(self, pdf_path: Path) -> Dict[str, Any]:
        """Analizza completamente un PDF"""
        # Estrai testo e immagini
        full_text, pages_data = self.extract_text_from_pdf(pdf_path)
        
        # Esegui OCR sulle immagini
        pages_data = self.perform_ocr_on_images(pages_data)
        
        # Combina tutto il testo (incluso OCR)
        combined_text = full_text
        for page in pages_data:
            for img in page['images']:
                if 'ocr_text' in img and img['ocr_text']:
                    combined_text += f"\n[OCR: {img['filename']}]\n{img['ocr_text']}"
        
        # Identifica brand
        brand = self.identify_brand(combined_text, pdf_path.name)
        
        # Estrai modelli
        models = self.extract_models(combined_text, brand)
        
        # Per ogni modello, estrai dettagli
        products = []
        for model in models:
            context = self.extract_product_context(combined_text, model)
            
            if context:
                specs = self.extract_specifications(context)
                features = self.extract_features(context)
                category = self.categorize_product(context, model)
                
                products.append({
                    'model': model,
                    'brand': brand,
                    'category': category,
                    'specifications': specs,
                    'features': features,
                    'context_snippet': context[:200] + "..."
                })
        
        return {
            'filename': pdf_path.name,
            'path': str(pdf_path),
            'brand': brand,
            'total_pages': len(pages_data),
            'total_images': sum(len(p['images']) for p in pages_data),
            'models_found': len(models),
            'products': products,
            'pages_data': pages_data
        }
    
    def save_results(self, analysis_results: List[Dict]):
        """Salva i risultati dell'analisi"""
        # Salva risultati completi
        output_file = self.output_dir / "pdf_analysis_complete.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis_results, f, indent=2, ensure_ascii=False)
        
        print(f"\n{Fore.GREEN}✓ Risultati salvati in {output_file}{Style.RESET_ALL}")
        
        # Crea summary
        summary = []
        for result in analysis_results:
            summary.append({
                'filename': result['filename'],
                'brand': result['brand'],
                'pages': result['total_pages'],
                'images': result['total_images'],
                'models': result['models_found'],
                'products': len(result['products'])
            })
        
        summary_file = self.output_dir / "pdf_analysis_summary.json"
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print(f"{Fore.GREEN}✓ Summary salvato in {summary_file}{Style.RESET_ALL}")
        
        # Crea report markdown
        self.generate_report(analysis_results)
    
    def generate_report(self, analysis_results: List[Dict]):
        """Genera report in formato markdown"""
        report_file = self.output_dir / "pdf_analysis_report.md"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("# 📊 Report Analisi PDF\n\n")
            f.write(f"**Data:** {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            
            # Summary
            f.write("## 📈 Riepilogo\n\n")
            total_pdfs = len(analysis_results)
            total_products = sum(len(r['products']) for r in analysis_results)
            total_images = sum(r['total_images'] for r in analysis_results)
            
            f.write(f"- **PDF analizzati:** {total_pdfs}\n")
            f.write(f"- **Prodotti identificati:** {total_products}\n")
            f.write(f"- **Immagini estratte:** {total_images}\n\n")
            
            # Per ogni PDF
            for result in analysis_results:
                f.write(f"## 📄 {result['filename']}\n\n")
                f.write(f"- **Brand:** {result['brand']}\n")
                f.write(f"- **Pagine:** {result['total_pages']}\n")
                f.write(f"- **Immagini:** {result['total_images']}\n")
                f.write(f"- **Modelli trovati:** {result['models_found']}\n\n")
                
                if result['products']:
                    f.write("### Prodotti Identificati\n\n")
                    f.write("| Modello | Categoria | Brand |\n")
                    f.write("|---------|-----------|-------|\n")
                    
                    for product in result['products']:
                        f.write(f"| {product['model']} | {product['category']} | {product['brand']} |\n")
                    
                    f.write("\n")
            
            f.write("---\n\n")
            f.write("**Generato automaticamente da PDF Analyzer**\n")
        
        print(f"{Fore.GREEN}✓ Report generato in {report_file}{Style.RESET_ALL}")
    
    def run(self):
        """Esegue l'analisi completa"""
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}🔍 AIRKLIM PDF Analyzer{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        # Trova tutti i PDF
        pdfs = self.find_all_pdfs()
        
        if not pdfs:
            print(f"\n{Fore.YELLOW}⚠️  Nessun PDF da analizzare{Style.RESET_ALL}")
            return
        
        # Analizza ogni PDF
        results = []
        for pdf_path in pdfs:
            try:
                result = self.analyze_pdf(pdf_path)
                results.append(result)
            except Exception as e:
                print(f"{Fore.RED}✗ Errore nell'analisi di {pdf_path.name}: {e}{Style.RESET_ALL}")
                continue
        
        # Salva risultati
        if results:
            self.save_results(results)
            
            # Stampa summary
            print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
            print(f"{Fore.CYAN}📊 Summary Analisi{Style.RESET_ALL}")
            print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
            
            total_products = sum(len(r['products']) for r in results)
            total_images = sum(r['total_images'] for r in results)
            
            print(f"{Fore.GREEN}✓ PDF analizzati: {len(results)}{Style.RESET_ALL}")
            print(f"{Fore.GREEN}✓ Prodotti identificati: {total_products}{Style.RESET_ALL}")
            print(f"{Fore.GREEN}✓ Immagini estratte: {total_images}{Style.RESET_ALL}")
            print(f"\n{Fore.CYAN}📁 Risultati salvati in: data/extracted/{Style.RESET_ALL}")
            print(f"{Fore.CYAN}🖼️  Immagini salvate in: public/uploads/images/extracted/{Style.RESET_ALL}\n")

def main():
    """Funzione principale"""
    analyzer = PDFAnalyzer()
    analyzer.run()

if __name__ == "__main__":
    main()
