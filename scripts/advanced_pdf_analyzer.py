#!/usr/bin/env python3
"""
AIRKLIM Advanced PDF Analyzer
Analisi avanzata con NLP e machine learning per estrazione intelligente
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
from PIL import Image, ImageEnhance, ImageFilter
import cv2
import numpy as np
import pandas as pd
from tqdm import tqdm
from colorama import Fore, Style, init
from collections import defaultdict
import spacy

init(autoreset=True)

class AdvancedPDFAnalyzer:
    """Analizzatore avanzato con NLP e ML"""
    
    def __init__(self):
        self.catalogs_dir = Path("public/uploads/catalogs")
        self.output_dir = Path("data/extracted")
        self.images_dir = Path("public/uploads/images/extracted")
        
        # Crea directory
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.images_dir.mkdir(parents=True, exist_ok=True)
        
        # Carica modello NLP (se disponibile)
        try:
            self.nlp = spacy.load("it_core_news_sm")
            print(f"{Fore.GREEN}✓ Modello NLP italiano caricato{Style.RESET_ALL}")
        except:
            print(f"{Fore.YELLOW}⚠️  Modello NLP non disponibile, uso analisi base{Style.RESET_ALL}")
            self.nlp = None
        
        # Pattern avanzati per codici modello
        self.advanced_patterns = {
            'panasonic_indoor': [
                r'CS-[A-Z]{1,3}\d{2,3}[A-Z0-9\-]*',
                r'CS\-[A-Z0-9]{5,15}',
            ],
            'panasonic_outdoor': [
                r'CU-[A-Z]{1,3}\d{2,3}[A-Z0-9\-]*',
                r'CU\-[A-Z0-9]{5,15}',
            ],
            'panasonic_accessory': [
                r'(CZ|PAW|PKZ|PCZ)-[A-Z0-9\-]+',
            ],
            'tcl': [
                r'[A-Z]\d{2}[A-Z0-9]{2,5}',
                r'TCL-[A-Z0-9\-]+',
            ],
            'generic': [
                r'[A-Z]{2,4}-?\d{2,5}[A-Z0-9\-]*',
            ]
        }
        
        # Pattern per specifiche tecniche avanzate
        self.advanced_specs = {
            'power_cooling': [
                r'(?:capacità|potenza|cooling)[:\s]*(\d+[\.,]?\d*)\s*kW',
                r'(\d+[\.,]?\d*)\s*kW\s*(?:raffrescamento|cooling)',
            ],
            'power_heating': [
                r'(?:riscaldamento|heating)[:\s]*(\d+[\.,]?\d*)\s*kW',
                r'(\d+[\.,]?\d*)\s*kW\s*(?:riscaldamento|heating)',
            ],
            'seer': [
                r'SEER[:\s]*(\d+[\.,]?\d*)',
                r'efficiency\s*\(cooling\)[:\s]*(\d+[\.,]?\d*)',
            ],
            'scop': [
                r'SCOP[:\s]*(\d+[\.,]?\d*)',
                r'efficiency\s*\(heating\)[:\s]*(\d+[\.,]?\d*)',
            ],
            'noise_indoor': [
                r'(?:unità interna|indoor)[:\s]*(\d{2})\s*dB',
                r'noise\s*\(indoor\)[:\s]*(\d{2})\s*dB',
            ],
            'noise_outdoor': [
                r'(?:unità esterna|outdoor)[:\s]*(\d{2})\s*dB',
                r'noise\s*\(outdoor\)[:\s]*(\d{2})\s*dB',
            ],
            'airflow': [
                r'(?:portata|airflow)[:\s]*(\d+)\s*m³/h',
                r'(\d+)\s*m³/h\s*(?:airflow|portata)',
            ],
            'voltage': [
                r'(\d{3})\s*V',
                r'alimentazione[:\s]*(\d{3})\s*V',
            ],
            'refrigerant': [
                r'(R32|R290|R410A|R134a|R407C)',
                r'refrigerant[:\s]*(R\d{3,4}[A-Z]?)',
            ],
            'dimensions': [
                r'(\d+)\s*[x×]\s*(\d+)\s*[x×]\s*(\d+)\s*mm',
                r'dimensions?[:\s]*(\d+)\s*[x×]\s*(\d+)\s*[x×]\s*(\d+)',
            ],
            'weight': [
                r'(\d+[\.,]?\d*)\s*kg',
                r'weight[:\s]*(\d+[\.,]?\d*)\s*kg',
            ],
            'pipe_size': [
                r'liquid[:\s]*(\d+/\d+)"',
                r'gas[:\s]*(\d+/\d+)"',
                r'tubo\s*liquido[:\s]*(\d+/\d+)"',
                r'tubo\s*gas[:\s]*(\d+/\d+)"',
            ]
        }
        
        # Pattern per caratteristiche avanzate
        self.advanced_features = {
            'nanoe_x_mark_3': r'nanoe[™]?\s*X\s*Mark\s*3',
            'nanoe_x_mark_2': r'nanoe[™]?\s*X\s*Mark\s*2',
            'nanoe_x': r'nanoe[™]?\s*X',
            'aerowings_2': r'Aerowings?\s*2\.0',
            'aerowings': r'Aerowings?',
            'wifi': r'Wi-?Fi',
            'google_home': r'Google\s*Home',
            'alexa': r'Alexa',
            'apple_homekit': r'Apple\s*HomeKit',
            'inverter': r'Inverter',
            'eco_mode': r'ECO\s*Mode|AI\s*ECO',
            'silent_mode': r'Silent|Quiet|Ultra-?silent',
            'heat_pump': r'Pompa\s*di\s*calore|Heat\s*pump',
            'dual_flow': r'Doppio\s*flusso|Dual\s*flow',
            'auto_swing': r'Auto\s*Swing|Oscillazione\s*automatica',
            'timer': r'Timer|Programmabile',
            'self_clean': r'Self-?Clean|Auto-?pulizia',
            'antibacterial': r'Antibatterico|Antibacterial',
            'energy_saving': r'Energy\s*Saving|Risparmio\s*energetico',
            'turbo': r'Turbo|Potente|Powerful',
            'sleep_mode': r'Sleep|Notte',
            'auto_restart': r'Auto\s*Restart|Riavvio\s*automatico',
            'diagnostic': r'Diagnostic|Autodiagnosi'
        }
        
        # Pattern per categorie
        self.advanced_categories = {
            'etherea_xz_grafite': {
                'keywords': ['etherea', 'xz', 'grafite', 'grey', 'grigio', 'anthracite'],
                'model_pattern': r'CS-XZ\d{2,3}.*H',
                'priority': 1
            },
            'etherea_z_bianco': {
                'keywords': ['etherea', 'z', 'bianco', 'white'],
                'model_pattern': r'CS-Z\d{2,3}(?!CD|CE|YK)',
                'priority': 2
            },
            'tz_super_compact': {
                'keywords': ['tz', 'compact', 'compatta', 'super', 'slim'],
                'model_pattern': r'CS-TZ\d{2,3}',
                'priority': 3
            },
            'console_floor': {
                'keywords': ['console', 'floor', 'pavimento', 'vertical'],
                'model_pattern': r'CS-Z\d{2,3}CE',
                'priority': 4
            },
            'ducted_low_pressure': {
                'keywords': ['ducted', 'canalizzat', 'low pressure', 'bassa pressione'],
                'model_pattern': r'CS-Z\d{2,3}CD',
                'priority': 5
            },
            'professional_extreme': {
                'keywords': ['professional', 'professionale', '-25', 'extreme', 'server'],
                'model_pattern': r'CS-Z\d{2,3}YK',
                'priority': 6
            },
            'outdoor_unit': {
                'keywords': ['outdoor', 'unita esterna', 'condensatore', 'cu-'],
                'model_pattern': r'CU-[A-Z0-9]+',
                'priority': 7
            },
            'multi_split_dual': {
                'keywords': ['dual', '2 unità', 'doppio'],
                'model_pattern': r'CU-2Z\d{2,3}',
                'priority': 8
            },
            'multi_split_trial': {
                'keywords': ['trial', '3 unità', 'triplo'],
                'model_pattern': r'CU-3Z\d{2,3}',
                'priority': 9
            },
            'multi_split_quad': {
                'keywords': ['quad', '4 unità', 'quadruplo'],
                'model_pattern': r'CU-4Z\d{2,3}',
                'priority': 10
            },
            'multi_split_penta': {
                'keywords': ['penta', '5 unità'],
                'model_pattern': r'CU-5Z\d{2,3}',
                'priority': 11
            },
            'heat_pump_aquarea': {
                'keywords': ['aquarea', 'pompa di calore', 'heat pump'],
                'model_pattern': r'(S|H|T).*Aquarea',
                'priority': 12
            },
            'accessory_remote': {
                'keywords': ['telecomando', 'remote', 'controllo'],
                'model_pattern': r'CZ-R[A-Z0-9]+',
                'priority': 13
            },
            'accessory_gateway': {
                'keywords': ['gateway', 'interface', 'interfaccia'],
                'model_pattern': r'(PAW|CZ)-[A-Z0-9]+',
                'priority': 14
            },
            'tcl_breezein': {
                'keywords': ['tcl', 'breezein', 'breeze', 'gentle'],
                'model_pattern': r'S\d{2}[A-Z0-9]*',
                'priority': 15
            }
        }
    
    def find_all_pdfs(self) -> List[Path]:
        """Trova tutti i PDF, indipendentemente dal nome"""
        print(f"{Fore.CYAN}🔍 Ricerca PDF in {self.catalogs_dir}...{Style.RESET_ALL}")
        
        pdfs = list(self.catalogs_dir.rglob("*.pdf"))
        
        if not pdfs:
            print(f"{Fore.YELLOW}⚠️  Nessun PDF trovato{Style.RESET_ALL}")
            return []
        
        print(f"{Fore.GREEN}✓ Trovati {len(pdfs)} PDF{Style.RESET_ALL}")
        for pdf in pdfs:
            size_mb = pdf.stat().st_size / (1024 * 1024)
            print(f"  - {pdf.relative_to(self.catalogs_dir)} ({size_mb:.1f} MB)")
        
        return pdfs
    
    def enhance_image_for_ocr(self, img: Image.Image) -> Image.Image:
        """Migliora l'immagine per OCR"""
        # Converti in grayscale
        if img.mode != 'L':
            img = img.convert('L')
        
        # Aumenta contrasto
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(2.0)
        
        # Aumenta nitidezza
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(2.0)
        
        # Riduci rumore
        img = img.filter(ImageFilter.MedianFilter(size=3))
        
        return img
    
    def extract_text_advanced(self, pdf_path: Path) -> Tuple[str, List[Dict]]:
        """Estrazione avanzata con preprocessing"""
        print(f"\n{Fore.CYAN}📄 Analisi avanzata: {pdf_path.name}{Style.RESET_ALL}")
        
        doc = fitz.open(pdf_path)
        full_text = ""
        pages_data = []
        
        for page_num in tqdm(range(len(doc)), desc="  Estrazione pagine", ncols=80):
            page = doc[page_num]
            
            # Estrai testo nativo
            text = page.get_text("text")
            full_text += f"\n--- PAGE {page_num + 1} ---\n{text}"
            
            # Estrai immagini
            images = page.get_images()
            page_images = []
            
            for img_index, img in enumerate(images):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Salva immagine originale
                img_filename = f"{pdf_path.stem}_page{page_num+1}_img{img_index+1}.{image_ext}"
                img_path = self.images_dir / img_filename
                
                with open(img_path, "wb") as f:
                    f.write(image_bytes)
                
                # Esegui OCR con preprocessing
                try:
                    pil_img = Image.open(img_path)
                    enhanced_img = self.enhance_image_for_ocr(pil_img)
                    
                    # Salva immagine migliorata
                    enhanced_path = self.images_dir / f"enhanced_{img_filename}"
                    enhanced_img.save(enhanced_path)
                    
                    # OCR
                    ocr_text = pytesseract.image_to_string(enhanced_img, lang='ita+eng', config='--psm 6')
                    
                    page_images.append({
                        'page': page_num + 1,
                        'original_path': str(img_path),
                        'enhanced_path': str(enhanced_path),
                        'filename': img_filename,
                        'ocr_text': ocr_text
                    })
                    
                    # Aggiungi testo OCR al testo completo
                    if ocr_text.strip():
                        full_text += f"\n[OCR: {img_filename}]\n{ocr_text}"
                
                except Exception as e:
                    print(f"{Fore.RED}    ✗ Errore OCR: {e}{Style.RESET_ALL}")
                    page_images.append({
                        'page': page_num + 1,
                        'original_path': str(img_path),
                        'filename': img_filename,
                        'ocr_text': ''
                    })
            
            pages_data.append({
                'page': page_num + 1,
                'text': text,
                'images': page_images
            })
        
        doc.close()
        
        print(f"{Fore.GREEN}  ✓ Estratte {len(pages_data)} pagine e {sum(len(p['images']) for p in pages_data)} immagini{Style.RESET_ALL}")
        
        return full_text, pages_data
    
    def extract_models_advanced(self, text: str) -> List[Dict[str, str]]:
        """Estrazione avanzata codici modello"""
        models = []
        
        for category, patterns in self.advanced_patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    model = match.group(0)
                    models.append({
                        'model': model,
                        'category': category,
                        'position': match.start()
                    })
        
        # Rimuovi duplicati
        unique_models = []
        seen = set()
        for m in models:
            if m['model'] not in seen:
                seen.add(m['model'])
                unique_models.append(m)
        
        return sorted(unique_models, key=lambda x: x['position'])
    
    def extract_specifications_advanced(self, text: str) -> Dict[str, Any]:
        """Estrazione avanzata specifiche tecniche"""
        specs = {}
        
        for spec_name, patterns in self.advanced_specs.items():
            for pattern in patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    if spec_name == 'dimensions':
                        specs[spec_name] = f"{match.group(1)}×{match.group(2)}×{match.group(3)} mm"
                    elif spec_name == 'pipe_size':
                        specs[spec_name] = match.group(1)
                    else:
                        value = match.group(1).replace(',', '.')
                        try:
                            specs[spec_name] = float(value)
                        except:
                            specs[spec_name] = value
                    break  # Usa solo il primo match
        
        return specs
    
    def extract_features_advanced(self, text: str) -> List[str]:
        """Estrazione avanzata caratteristiche"""
        features = []
        
        for feature_name, pattern in self.advanced_features.items():
            if re.search(pattern, text, re.IGNORECASE):
                features.append(feature_name)
        
        return features
    
    def categorize_product_advanced(self, text: str, model: str) -> str:
        """Categorizzazione avanzata con NLP"""
        text_lower = text.lower()
        model_lower = model.lower()
        
        # Calcola score per ogni categoria
        scores = {}
        for category, config in self.advanced_categories.items():
            score = 0
            
            # Score da keywords
            for keyword in config['keywords']:
                if keyword.lower() in text_lower:
                    score += 2
            
            # Score da pattern modello
            if re.search(config['model_pattern'], model, re.IGNORECASE):
                score += 5
            
            # Applica priorità
            scores[category] = score / config['priority']
        
        # Se abbiamo NLP, usa analisi semantica
        if self.nlp and scores:
            doc = self.nlp(text)
            
            # Estrai entità
            for ent in doc.ents:
                if ent.label_ in ['PRODUCT', 'ORG']:
                    for category in scores:
                        if ent.text.lower() in category.replace('_', ' '):
                            scores[category] += 1
        
        # Restituisce categoria con score più alto
        if scores:
            best_category = max(scores, key=scores.get)
            if scores[best_category] > 0:
                return best_category
        
        return 'uncategorized'
    
    def extract_product_context_advanced(self, text: str, model: str, context_size: int = 1000) -> str:
        """Estrazione contesto avanzata"""
        # Trova tutte le occorrenze del modello
        matches = list(re.finditer(re.escape(model), text, re.IGNORECASE))
        
        if not matches:
            return ""
        
        # Usa l'occorrenza con più contesto attorno
        best_context = ""
        best_score = 0
        
        for match in matches:
            start = max(0, match.start() - context_size)
            end = min(len(text), match.end() + context_size)
            context = text[start:end]
            
            # Calcola score basato sulla presenza di specifiche
            score = 0
            for spec_pattern in self.advanced_specs.values():
                for pattern in spec_pattern:
                    if re.search(pattern, context, re.IGNORECASE):
                        score += 1
            
            if score > best_score:
                best_score = score
                best_context = context
        
        return best_context
    
    def analyze_pdf_advanced(self, pdf_path: Path) -> Dict[str, Any]:
        """Analisi avanzata completa di un PDF"""
        # Estrai testo e immagini
        full_text, pages_data = self.extract_text_advanced(pdf_path)
        
        # Identifica brand
        brand = self.identify_brand(full_text, pdf_path.name)
        
        # Estrai modelli
        models = self.extract_models_advanced(full_text)
        
        # Per ogni modello, estrai dettagli
        products = []
        for model_data in models:
            model = model_data['model']
            context = self.extract_product_context_advanced(full_text, model)
            
            if context:
                specs = self.extract_specifications_advanced(context)
                features = self.extract_features_advanced(context)
                category = self.categorize_product_advanced(context, model)
                
                products.append({
                    'model': model,
                    'model_category': model_data['category'],
                    'brand': brand,
                    'category': category,
                    'specifications': specs,
                    'features': features,
                    'context_snippet': context[:300] + "...",
                    'page_references': []
                })
        
        return {
            'filename': pdf_path.name,
            'path': str(pdf_path),
            'brand': brand,
            'total_pages': len(pages_data),
            'total_images': sum(len(p['images']) for p in pages_data),
            'models_found': len(models),
            'products': products,
            'pages_data': pages_data,
            'analysis_timestamp': pd.Timestamp.now().isoformat()
        }
    
    def identify_brand(self, text: str, filename: str) -> str:
        """Identifica il brand"""
        text_lower = text.lower()
        filename_lower = filename.lower()
        
        brands = ['panasonic', 'tcl', 'daikin', 'mitsubishi', 'lg', 'samsung', 'fujitsu']
        
        for brand in brands:
            if brand in text_lower or brand in filename_lower:
                return brand
        
        return 'unknown'
    
    def save_results(self, analysis_results: List[Dict]):
        """Salva i risultati"""
        # Salva risultati completi
        output_file = self.output_dir / "advanced_pdf_analysis.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis_results, f, indent=2, ensure_ascii=False)
        
        print(f"\n{Fore.GREEN}✓ Risultati salvati in {output_file}{Style.RESET_ALL}")
        
        # Genera report avanzato
        self.generate_advanced_report(analysis_results)
    
    def generate_advanced_report(self, analysis_results: List[Dict]):
        """Genera report avanzato"""
        report_file = self.output_dir / "advanced_analysis_report.md"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("# 📊 Report Analisi Avanzata PDF\n\n")
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
                    f.write("| Modello | Categoria | Brand | SEER | SCOP | Potenza |\n")
                    f.write("|---------|-----------|-------|------|------|--------|\n")
                    
                    for product in result['products']:
                        model = product['model']
                        category = product['category']
                        brand = product['brand']
                        seer = product['specifications'].get('seer', 'N/A')
                        scop = product['specifications'].get('scop', 'N/A')
                        power = product['specifications'].get('power_cooling', 'N/A')
                        
                        f.write(f"| {model} | {category} | {brand} | {seer} | {scop} | {power} kW |\n")
                    
                    f.write("\n")
            
            f.write("---\n\n")
            f.write("**Generato automaticamente da Advanced PDF Analyzer**\n")
        
        print(f"{Fore.GREEN}✓ Report avanzato generato in {report_file}{Style.RESET_ALL}")
    
    def run(self):
        """Esegue l'analisi avanzata"""
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}🔍 AIRKLIM Advanced PDF Analyzer{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        # Trova tutti i PDF
        pdfs = self.find_all_pdfs()
        
        if not pdfs:
            return
        
        # Analizza ogni PDF
        results = []
        for pdf_path in pdfs:
            try:
                result = self.analyze_pdf_advanced(pdf_path)
                results.append(result)
            except Exception as e:
                print(f"{Fore.RED}✗ Errore nell'analisi di {pdf_path.name}: {e}{Style.RESET_ALL}")
                continue
        
        # Salva risultati
        if results:
            self.save_results(results)
            
            # Summary
            print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
            print(f"{Fore.CYAN}📊 Summary Analisi Avanzata{Style.RESET_ALL}")
            print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
            
            total_products = sum(len(r['products']) for r in results)
            total_images = sum(r['total_images'] for r in results)
            
            print(f"{Fore.GREEN}✓ PDF analizzati: {len(results)}{Style.RESET_ALL}")
            print(f"{Fore.GREEN}✓ Prodotti identificati: {total_products}{Style.RESET_ALL}")
            print(f"{Fore.GREEN}✓ Immagini estratte: {total_images}{Style.RESET_ALL}")
            print(f"\n{Fore.CYAN}📁 Risultati salvati in: data/extracted/{Style.RESET_ALL}\n")

def main():
    """Funzione principale"""
    analyzer = AdvancedPDFAnalyzer()
    analyzer.run()

if __name__ == "__main__":
    main()
