#!/usr/bin/env python3
"""
AIRKLIM Data Validator
Valida i dati estratti e genera report di qualità
"""

import os
import sys
import json
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime
from colorama import Fore, Style, init

init(autoreset=True)

class DataValidator:
    """Validatore dati estratti"""
    
    def __init__(self):
        self.data_dir = Path("data/extracted")
        self.logs_dir = Path("logs")
        self.logs_dir.mkdir(exist_ok=True)
        
    def load_extracted_data(self) -> Dict[str, Any]:
        """Carica i dati estratti"""
        print(f"{Fore.CYAN}📂 Caricamento dati estratti...{Style.RESET_ALL}")
        
        data_file = self.data_dir / "advanced_pdf_analysis.json"
        
        if not data_file.exists():
            print(f"{Fore.RED}✗ File non trovato: {data_file}{Style.RESET_ALL}")
            return {}
        
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"{Fore.GREEN}✓ Dati caricati: {len(data)} PDF analizzati{Style.RESET_ALL}")
        return data
    
    def validate_models(self, data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Valida i codici modello"""
        print(f"\n{Fore.CYAN}🔍 Validazione codici modello...{Style.RESET_ALL}")
        
        issues = {
            'missing_model': [],
            'invalid_format': [],
            'duplicates': []
        }
        
        all_models = []
        
        for pdf_data in data:
            for product in pdf_data.get('products', []):
                model = product.get('model', '')
                
                if not model:
                    issues['missing_model'].append(f"{pdf_data['filename']}: prodotto senza modello")
                    continue
                
                # Verifica formato
                if not re.match(r'^[A-Z0-9\-]{5,20}$', model):
                    issues['invalid_format'].append(f"{model} in {pdf_data['filename']}")
                
                all_models.append(model)
        
        # Verifica duplicati
        from collections import Counter
        model_counts = Counter(all_models)
        for model, count in model_counts.items():
            if count > 1:
                issues['duplicates'].append(f"{model}: trovato {count} volte")
        
        # Report
        total_issues = sum(len(v) for v in issues.values())
        
        if total_issues == 0:
            print(f"{Fore.GREEN}✓ Nessun problema trovato{Style.RESET_ALL}")
        else:
            print(f"{Fore.YELLOW}⚠️  Trovati {total_issues} problemi{Style.RESET_ALL}")
            
            if issues['missing_model']:
                print(f"{Fore.YELLOW}  - {len(issues['missing_model'])} prodotti senza modello{Style.RESET_ALL}")
            
            if issues['invalid_format']:
                print(f"{Fore.YELLOW}  - {len(issues['invalid_format'])} formati invalidi{Style.RESET_ALL}")
            
            if issues['duplicates']:
                print(f"{Fore.YELLOW}  - {len(issues['duplicates'])} duplicati{Style.RESET_ALL}")
        
        return issues
    
    def validate_specifications(self, data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Valida le specifiche tecniche"""
        print(f"\n{Fore.CYAN}🔍 Validazione specifiche tecniche...{Style.RESET_ALL}")
        
        issues = {
            'missing_power': [],
            'invalid_power': [],
            'missing_seer': [],
            'invalid_seer': []
        }
        
        for pdf_data in data:
            for product in pdf_data.get('products', []):
                model = product.get('model', 'unknown')
                specs = product.get('specifications', {})
                
                # Verifica potenza
                power = specs.get('power_cooling')
                if not power:
                    issues['missing_power'].append(model)
                elif not (0.5 <= power <= 20):
                    issues['invalid_power'].append(f"{model}: {power} kW")
                
                # Verifica SEER
                seer = specs.get('seer')
                if not seer:
                    issues['missing_seer'].append(model)
                elif not (3.0 <= seer <= 10.0):
                    issues['invalid_seer'].append(f"{model}: {seer}")
        
        # Report
        total_issues = sum(len(v) for v in issues.values())
        
        if total_issues == 0:
            print(f"{Fore.GREEN}✓ Nessun problema trovato{Style.RESET_ALL}")
        else:
            print(f"{Fore.YELLOW}⚠️  Trovati {total_issues} problemi{Style.RESET_ALL}")
            
            if issues['missing_power']:
                print(f"{Fore.YELLOW}  - {len(issues['missing_power'])} prodotti senza potenza{Style.RESET_ALL}")
            
            if issues['invalid_power']:
                print(f"{Fore.YELLOW}  - {len(issues['invalid_power'])} potenze invalide{Style.RESET_ALL}")
            
            if issues['missing_seer']:
                print(f"{Fore.YELLOW}  - {len(issues['missing_seer'])} prodotti senza SEER{Style.RESET_ALL}")
            
            if issues['invalid_seer']:
                print(f"{Fore.YELLOW}  - {len(issues['invalid_seer'])} SEER invalidi{Style.RESET_ALL}")
        
        return issues
    
    def validate_categories(self, data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Valida le categorie"""
        print(f"\n{Fore.CYAN}🔍 Validazione categorie...{Style.RESET_ALL}")
        
        issues = {
            'uncategorized': [],
            'invalid_category': []
        }
        
        valid_categories = [
            'etherea_xz_grafite', 'etherea_z_bianco', 'tz_super_compact',
            'console_floor', 'ducted_low_pressure', 'professional_extreme',
            'outdoor_unit', 'multi_split_dual', 'multi_split_trial',
            'multi_split_quad', 'multi_split_penta', 'heat_pump_aquarea',
            'accessory_remote', 'accessory_gateway', 'tcl_breezein'
        ]
        
        for pdf_data in data:
            for product in pdf_data.get('products', []):
                model = product.get('model', 'unknown')
                category = product.get('category', '')
                
                if category == 'uncategorized':
                    issues['uncategorized'].append(model)
                elif category not in valid_categories:
                    issues['invalid_category'].append(f"{model}: {category}")
        
        # Report
        total_issues = sum(len(v) for v in issues.values())
        
        if total_issues == 0:
            print(f"{Fore.GREEN}✓ Nessun problema trovato{Style.RESET_ALL}")
        else:
            print(f"{Fore.YELLOW}⚠️  Trovati {total_issues} problemi{Style.RESET_ALL}")
            
            if issues['uncategorized']:
                print(f"{Fore.YELLOW}  - {len(issues['uncategorized'])} prodotti non categorizzati{Style.RESET_ALL}")
            
            if issues['invalid_category']:
                print(f"{Fore.YELLOW}  - {len(issues['invalid_category'])} categorie invalide{Style.RESET_ALL}")
        
        return issues
    
    def validate_images(self) -> Dict[str, List[str]]:
        """Valida le immagini"""
        print(f"\n{Fore.CYAN}🔍 Validazione immagini...{Style.RESET_ALL}")
        
        issues = {
            'missing_images': [],
            'invalid_format': [],
            'too_large': []
        }
        
        images_dir = Path("public/uploads/images")
        
        if not images_dir.exists():
            print(f"{Fore.YELLOW}⚠️  Directory immagini non trovata{Style.RESET_ALL}")
            return issues
        
        # Conta immagini per prodotto
        image_files = list(images_dir.rglob("*.*"))
        image_files = [f for f in image_files if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']]
        
        print(f"{Fore.GREEN}✓ Trovate {len(image_files)} immagini{Style.RESET_ALL}")
        
        # Verifica formato e dimensione
        for img_path in image_files:
            # Verifica formato
            if img_path.suffix.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
                issues['invalid_format'].append(str(img_path))
            
            # Verifica dimensione (max 5MB)
            size_mb = img_path.stat().st_size / (1024 * 1024)
            if size_mb > 5:
                issues['too_large'].append(f"{img_path.name}: {size_mb:.1f} MB")
        
        # Report
        total_issues = sum(len(v) for v in issues.values())
        
        if total_issues == 0:
            print(f"{Fore.GREEN}✓ Nessun problema trovato{Style.RESET_ALL}")
        else:
            print(f"{Fore.YELLOW}⚠️  Trovati {total_issues} problemi{Style.RESET_ALL}")
            
            if issues['invalid_format']:
                print(f"{Fore.YELLOW}  - {len(issues['invalid_format'])} formati invalidi{Style.RESET_ALL}")
            
            if issues['too_large']:
                print(f"{Fore.YELLOW}  - {len(issues['too_large'])} immagini troppo grandi{Style.RESET_ALL}")
        
        return issues
    
    def generate_validation_report(self, all_issues: Dict[str, Dict[str, List[str]]]):
        """Genera report di validazione"""
        print(f"\n{Fore.CYAN}📊 Generazione report validazione...{Style.RESET_ALL}")
        
        report_file = self.logs_dir / "validation_report.md"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("# 🔍 Report Validazione Dati\n\n")
            f.write(f"**Data:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            
            # Summary
            total_issues = sum(len(issues) for category in all_issues.values() for issues in category.values())
            
            f.write("## 📈 Riepilogo\n\n")
            f.write(f"- **Totale problemi:** {total_issues}\n")
            
            for category, issues in all_issues.items():
                category_total = sum(len(v) for v in issues.values())
                f.write(f"- **{category.replace('_', ' ').title()}:** {category_total} problemi\n")
            
            f.write("\n")
            
            # Dettagli per categoria
            for category, issues in all_issues.items():
                f.write(f"## {category.replace('_', ' ').title()}\n\n")
                
                for issue_type, issue_list in issues.items():
                    if issue_list:
                        f.write(f"### {issue_type.replace('_', ' ').title()}\n\n")
                        for issue in issue_list[:10]:  # Mostra solo primi 10
                            f.write(f"- {issue}\n")
                        
                        if len(issue_list) > 10:
                            f.write(f"\n*... e altri {len(issue_list) - 10}*\n")
                        
                        f.write("\n")
            
            f.write("---\n\n")
            f.write("**Generato automaticamente da Data Validator**\n")
        
        print(f"{Fore.GREEN}✓ Report salvato in {report_file}{Style.RESET_ALL}")
    
    def run(self):
        """Esegue la validazione completa"""
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}🔍 AIRKLIM Data Validator{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        # Carica dati
        data = self.load_extracted_data()
        
        if not data:
            return
        
        # Valida ogni aspetto
        all_issues = {}
        
        all_issues['models'] = self.validate_models(data)
        all_issues['specifications'] = self.validate_specifications(data)
        all_issues['categories'] = self.validate_categories(data)
        all_issues['images'] = self.validate_images()
        
        # Genera report
        self.generate_validation_report(all_issues)
        
        # Summary finale
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}✅ Validazione Completata{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        total_issues = sum(len(issues) for category in all_issues.values() for issues in category.values())
        
        if total_issues == 0:
            print(f"{Fore.GREEN}✓ Tutti i dati sono validi!{Style.RESET_ALL}")
        else:
            print(f"{Fore.YELLOW}⚠️  Trovati {total_issues} problemi totali{Style.RESET_ALL}")
            print(f"{Fore.CYAN}📁 Report completo in: logs/validation_report.md{Style.RESET_ALL}\n")

def main():
    """Funzione principale"""
    import re
    validator = DataValidator()
    validator.run()

if __name__ == "__main__":
    main()
