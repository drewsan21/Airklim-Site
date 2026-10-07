#!/usr/bin/env python3
"""
AIRKLIM Image Analyzer
Analisi automatica di immagini prodotti con OCR e riconoscimento pattern
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import Dict, List, Any
from PIL import Image
import pytesseract
import cv2
import numpy as np
from tqdm import tqdm
from colorama import Fore, Style, init

init(autoreset=True)

class ImageAnalyzer:
    """Analizzatore intelligente di immagini prodotti"""
    
    def __init__(self, images_dir: str = "public/uploads/images"):
        self.images_dir = Path(images_dir)
        self.output_dir = Path("data/extracted/images")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Pattern per codici modello nelle immagini
        self.model_patterns = [
            r'CS-[A-Z0-9\-]+',
            r'CU-[A-Z0-9\-]+',
            r'PAW-[A-Z0-9\-]+',
            r'CZ-[A-Z0-9\-]+',
            r'[A-Z]\d{2}[A-Z0-9]+'
        ]
        
        # Pattern per specifiche tecniche
        self.spec_patterns = {
            'power_kw': r'(\d+[\.,]?\d*)\s*kW',
            'power_btu': r'(\d{4,5})\s*BTU',
            'seer': r'SEER[:\s]*(\d+[\.,]?\d*)',
            'scop': r'SCOP[:\s]*(\d+[\.,]?\d*)',
            'noise': r'(\d{2})\s*dB',
            'dimensions': r'(\d+)\s*[x×]\s*(\d+)\s*[x×]\s*(\d+)\s*mm',
            'weight': r'(\d+[\.,]?\d*)\s*kg'
        }
        
    def find_all_images(self) -> List[Path]:
        """Trova tutte le immagini nella directory"""
        print(f"{Fore.CYAN}🔍 Ricerca immagini in {self.images_dir}...{Style.RESET_ALL}")
        
        extensions = ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.bmp', '*.tiff']
        images = []
        
        for ext in extensions:
            images.extend(self.images_dir.rglob(ext))
        
        # Escludi directory optimized e thumbnails
        images = [img for img in images if 'optimized' not in str(img) and 'thumbnails' not in str(img)]
        
        if not images:
            print(f"{Fore.YELLOW}⚠️  Nessuna immagine trovata{Style.RESET_ALL}")
            return []
        
        print(f"{Fore.GREEN}✓ Trovate {len(images)} immagini{Style.RESET_ALL}")
        return images
    
    def preprocess_image(self, img_path: Path) -> np.ndarray:
        """Preprocessa l'immagine per migliorare OCR"""
        # Leggi immagine
        img = cv2.imread(str(img_path))
        
        if img is None:
            return None
        
        # Converti in grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Applica thresholding adattivo
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        # Rimuovi rumore
        denoised = cv2.fastNlMeansDenoising(thresh, None, 10, 7, 21)
        
        return denoised
    
    def extract_text_from_image(self, img_path: Path) -> str:
        """Estrae testo da un'immagine usando OCR"""
        try:
            # Preprocessa immagine
            processed = self.preprocess_image(img_path)
            
            if processed is None:
                return ""
            
            # Esegui OCR
            text = pytesseract.image_to_string(processed, lang='ita+eng')
            
            return text
        except Exception as e:
            print(f"{Fore.RED}  ✗ Errore OCR per {img_path.name}: {e}{Style.RESET_ALL}")
            return ""
    
    def extract_models_from_text(self, text: str) -> List[str]:
        """Estrae codici modello dal testo"""
        models = set()
        
        for pattern in self.model_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            models.update(matches)
        
        return sorted(list(models))
    
    def extract_specs_from_text(self, text: str) -> Dict[str, Any]:
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
    
    def analyze_image(self, img_path: Path) -> Dict[str, Any]:
        """Analizza completamente un'immagine"""
        # Estrai testo con OCR
        text = self.extract_text_from_image(img_path)
        
        if not text.strip():
            return {
                'filename': img_path.name,
                'path': str(img_path),
                'text': '',
                'models': [],
                'specifications': {},
                'has_content': False
            }
        
        # Estrai modelli
        models = self.extract_models_from_text(text)
        
        # Estrai specifiche
        specs = self.extract_specs_from_text(text)
        
        return {
            'filename': img_path.name,
            'path': str(img_path),
            'text': text,
            'models': models,
            'specifications': specs,
            'has_content': bool(text.strip())
        }
    
    def save_results(self, analysis_results: List[Dict]):
        """Salva i risultati dell'analisi"""
        output_file = self.output_dir / "image_analysis.json"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis_results, f, indent=2, ensure_ascii=False)
        
        print(f"\n{Fore.GREEN}✓ Risultati salvati in {output_file}{Style.RESET_ALL}")
    
    def run(self):
        """Esegue l'analisi completa"""
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}🖼️  AIRKLIM Image Analyzer{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        # Trova tutte le immagini
        images = self.find_all_images()
        
        if not images:
            print(f"\n{Fore.YELLOW}⚠️  Nessuna immagine da analizzare{Style.RESET_ALL}")
            return
        
        # Analizza ogni immagine
        results = []
        for img_path in tqdm(images, desc="Analisi immagini", ncols=80):
            try:
                result = self.analyze_image(img_path)
                results.append(result)
            except Exception as e:
                print(f"{Fore.RED}✗ Errore nell'analisi di {img_path.name}: {e}{Style.RESET_ALL}")
                continue
        
        # Salva risultati
        if results:
            self.save_results(results)
            
            # Stampa summary
            print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
            print(f"{Fore.CYAN}📊 Summary Analisi Immagini{Style.RESET_ALL}")
            print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
            
            total_models = sum(len(r['models']) for r in results)
            images_with_text = sum(1 for r in results if r['has_content'])
            
            print(f"{Fore.GREEN}✓ Immagini analizzate: {len(results)}{Style.RESET_ALL}")
            print(f"{Fore.GREEN}✓ Immagini con testo: {images_with_text}{Style.RESET_ALL}")
            print(f"{Fore.GREEN}✓ Modelli identificati: {total_models}{Style.RESET_ALL}")
            print(f"\n{Fore.CYAN}📁 Risultati salvati in: data/extracted/images/{Style.RESET_ALL}\n")

def main():
    """Funzione principale"""
    analyzer = ImageAnalyzer()
    analyzer.run()

if __name__ == "__main__":
    main()
