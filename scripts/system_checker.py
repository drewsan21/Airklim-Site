#!/usr/bin/env python3
"""
AIRKLIM System Checker
Verifica lo stato del sistema e le dipendenze
"""

import os
import sys
import subprocess
import json
from pathlib import Path
from typing import Dict, List, Tuple
from colorama import Fore, Style, init

init(autoreset=True)

class SystemChecker:
    """Verificatore di sistema"""
    
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.checks = []
        
    def check(self, name: str, condition: bool, message: str = ""):
        """Registra un check"""
        status = "✓" if condition else "✗"
        color = Fore.GREEN if condition else Fore.RED
        
        self.checks.append({
            'name': name,
            'status': condition,
            'message': message
        })
        
        print(f"{color}{status} {name}{Style.RESET_ALL}", end="")
        if message:
            print(f" - {message}")
        else:
            print()
        
        return condition
    
    def check_python_version(self) -> bool:
        """Verifica versione Python"""
        version = sys.version_info
        return self.check(
            "Python Version",
            version.major >= 3 and version.minor >= 8,
            f"{version.major}.{version.minor}.{version.micro} (richiesto 3.8+)"
        )
    
    def check_node_version(self) -> bool:
        """Verifica versione Node.js"""
        try:
            result = subprocess.run(
                ["node", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            version = result.stdout.strip()
            major = int(version.split('.')[0].replace('v', ''))
            
            return self.check(
                "Node.js Version",
                major >= 18,
                f"{version} (richiesto 18+)"
            )
        except:
            return self.check("Node.js Version", False, "Non installato")
    
    def check_npm(self) -> bool:
        """Verifica npm"""
        try:
            result = subprocess.run(
                ["npm", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            version = result.stdout.strip()
            return self.check("npm", True, f"v{version}")
        except:
            return self.check("npm", False, "Non installato")
    
    def check_tesseract(self) -> bool:
        """Verifica Tesseract OCR"""
        try:
            result = subprocess.run(
                ["tesseract", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            version = result.stdout.split('\n')[0]
            return self.check("Tesseract OCR", True, version)
        except:
            return self.check("Tesseract OCR", False, "Non installato (opzionale)")
    
    def check_poppler(self) -> bool:
        """Verifica Poppler"""
        try:
            result = subprocess.run(
                ["pdftoppm", "-v"],
                capture_output=True,
                text=True,
                timeout=5
            )
            return self.check("Poppler", True, "Installato")
        except:
            return self.check("Poppler", False, "Non installato (opzionale)")
    
    def check_node_modules(self) -> bool:
        """Verifica node_modules"""
        node_modules = self.base_dir / "node_modules"
        return self.check(
            "node_modules",
            node_modules.exists(),
            "" if node_modules.exists() else "Esegui: npm install"
        )
    
    def check_python_venv(self) -> bool:
        """Verifica virtual environment Python"""
        venv = self.base_dir / "venv"
        return self.check(
            "Python venv",
            venv.exists(),
            "" if venv.exists() else "Esegui: ./setup.sh"
        )
    
    def check_python_dependencies(self) -> bool:
        """Verifica dipendenze Python"""
        try:
            # Prova a importare le dipendenze principali
            import fitz
            import pytesseract
            from PIL import Image
            import cv2
            import numpy as np
            
            return self.check("Python Dependencies", True, "Tutte installate")
        except ImportError as e:
            return self.check("Python Dependencies", False, f"Manca: {e.name}")
    
    def check_directories(self) -> bool:
        """Verifica directory necessarie"""
        required_dirs = [
            "public/uploads/images",
            "public/uploads/catalogs",
            "data/extracted",
            "logs",
            "backups"
        ]
        
        missing = []
        for dir_path in required_dirs:
            if not (self.base_dir / dir_path).exists():
                missing.append(dir_path)
        
        if missing:
            return self.check(
                "Directories",
                False,
                f"Mancano: {', '.join(missing)}"
            )
        else:
            return self.check("Directories", True, "Tutte presenti")
    
    def check_environment(self) -> bool:
        """Verifica file .env"""
        env_file = self.base_dir / ".env"
        return self.check(
            ".env file",
            env_file.exists(),
            "" if env_file.exists() else "Copia da .env.example"
        )
    
    def check_extracted_data(self) -> bool:
        """Verifica dati estratti"""
        data_file = self.base_dir / "data/extracted/advanced_pdf_analysis.json"
        
        if data_file.exists():
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            total_products = sum(len(pdf.get('products', [])) for pdf in data)
            return self.check(
                "Extracted Data",
                True,
                f"{len(data)} PDF, {total_products} prodotti"
            )
        else:
            return self.check(
                "Extracted Data",
                False,
                "Esegui: python3 scripts/advanced_pdf_analyzer.py"
            )
    
    def check_uploaded_files(self) -> Tuple[bool, str]:
        """Verifica file caricati"""
        images_dir = self.base_dir / "public/uploads/images"
        catalogs_dir = self.base_dir / "public/uploads/catalogs"
        
        image_count = len(list(images_dir.rglob("*.*"))) if images_dir.exists() else 0
        pdf_count = len(list(catalogs_dir.rglob("*.pdf"))) if catalogs_dir.exists() else 0
        
        message = f"{image_count} immagini, {pdf_count} PDF"
        
        if image_count == 0 and pdf_count == 0:
            return self.check("Uploaded Files", False, "Nessun file caricato")
        else:
            return self.check("Uploaded Files", True, message)
    
    def check_build(self) -> bool:
        """Verifica build"""
        dist_dir = self.base_dir / "dist"
        return self.check(
            "Build",
            dist_dir.exists(),
            "" if dist_dir.exists() else "Esegui: npm run build"
        )
    
    def generate_report(self):
        """Genera report completo"""
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}📊 System Check Report{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        # Conta check
        total = len(self.checks)
        passed = sum(1 for c in self.checks if c['status'])
        failed = total - passed
        
        # Stampa summary
        print(f"{Fore.CYAN}Summary:{Style.RESET_ALL}")
        print(f"  Total checks: {total}")
        print(f"{Fore.GREEN}  Passed: {passed}{Style.RESET_ALL}")
        print(f"{Fore.RED}  Failed: {failed}{Style.RESET_ALL}")
        print()
        
        # Percentuale
        percentage = (passed / total * 100) if total > 0 else 0
        
        if percentage == 100:
            print(f"{Fore.GREEN}✅ Sistema pronto!{Style.RESET_ALL}")
        elif percentage >= 80:
            print(f"{Fore.YELLOW}⚠️  Sistema quasi pronto, alcuni check falliti{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}❌ Sistema non pronto, molti check falliti{Style.RESET_ALL}")
        
        print()
        
        # Salva report
        report_file = self.base_dir / "logs/system_check_report.json"
        report_file.parent.mkdir(exist_ok=True)
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump({
                'timestamp': str(pd.Timestamp.now()),
                'total': total,
                'passed': passed,
                'failed': failed,
                'percentage': percentage,
                'checks': self.checks
            }, f, indent=2, ensure_ascii=False)
        
        print(f"{Fore.CYAN}📁 Report salvato in: {report_file}{Style.RESET_ALL}\n")
        
        return percentage
    
    def run(self):
        """Esegue tutti i check"""
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}🔍 AIRKLIM System Checker{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        # Esegui tutti i check
        print(f"{Fore.CYAN}🔧 Dipendenze di Sistema:{Style.RESET_ALL}")
        self.check_python_version()
        self.check_node_version()
        self.check_npm()
        self.check_tesseract()
        self.check_poppler()
        
        print(f"\n{Fore.CYAN}📦 Dipendenze Progetto:{Style.RESET_ALL}")
        self.check_node_modules()
        self.check_python_venv()
        self.check_python_dependencies()
        
        print(f"\n{Fore.CYAN}📁 Directory e File:{Style.RESET_ALL}")
        self.check_directories()
        self.check_environment()
        self.check_extracted_data()
        self.check_uploaded_files()
        self.check_build()
        
        # Genera report
        self.generate_report()

def main():
    """Funzione principale"""
    import pandas as pd
    checker = SystemChecker()
    checker.run()

if __name__ == "__main__":
    main()
