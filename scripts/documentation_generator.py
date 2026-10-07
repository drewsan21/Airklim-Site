#!/usr/bin/env python3
"""
AIRKLIM Documentation Generator
Genera documentazione automatica basata sui dati estratti
"""

import os
import sys
import json
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime
from colorama import Fore, Style, init

init(autoreset=True)

class DocumentationGenerator:
    """Generatore di documentazione automatica"""
    
    def __init__(self):
        self.data_dir = Path("data/extracted")
        self.docs_dir = Path("docs")
        self.docs_dir.mkdir(exist_ok=True)
        
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
    
    def generate_product_catalog(self, data: Dict[str, Any]):
        """Genera catalogo prodotti in markdown"""
        print(f"\n{Fore.CYAN}📖 Generazione catalogo prodotti...{Style.RESET_ALL}")
        
        catalog_file = self.docs_dir / "PRODUCT_CATALOG.md"
        
        with open(catalog_file, 'w', encoding='utf-8') as f:
            f.write("# 📦 Catalogo Prodotti AIRKLIM 2026\n\n")
            f.write(f"**Data generazione:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            
            # Raggruppa prodotti per categoria
            products_by_category = {}
            for pdf_data in data:
                for product in pdf_data.get('products', []):
                    category = product.get('category', 'uncategorized')
                    if category not in products_by_category:
                        products_by_category[category] = []
                    products_by_category[category].append(product)
            
            # Genera sezione per ogni categoria
            for category, products in sorted(products_by_category.items()):
                f.write(f"## {category.replace('_', ' ').title()}\n\n")
                f.write(f"**Prodotti:** {len(products)}\n\n")
                
                f.write("| Modello | Brand | Potenza | SEER | SCOP | Rumore |\n")
                f.write("|---------|-------|---------|------|------|--------|\n")
                
                for product in products:
                    model = product.get('model', 'N/A')
                    brand = product.get('brand', 'N/A')
                    specs = product.get('specifications', {})
                    power = specs.get('power_cooling', 'N/A')
                    seer = specs.get('seer', 'N/A')
                    scop = specs.get('scop', 'N/A')
                    noise = specs.get('noise_indoor', 'N/A')
                    
                    f.write(f"| {model} | {brand} | {power} kW | {seer} | {scop} | {noise} dB |\n")
                
                f.write("\n")
            
            f.write("---\n\n")
            f.write(f"**Totale prodotti:** {sum(len(p) for p in products_by_category.values())}\n")
            f.write(f"**Categorie:** {len(products_by_category)}\n\n")
            f.write("**Generato automaticamente da Documentation Generator**\n")
        
        print(f"{Fore.GREEN}✓ Catalogo generato in {catalog_file}{Style.RESET_ALL}")
    
    def generate_technical_specs(self, data: Dict[str, Any]):
        """Genera scheda tecnica dettagliata per ogni prodotto"""
        print(f"\n{Fore.CYAN}📋 Generazione schede tecniche...{Style.RESET_ALL}")
        
        specs_dir = self.docs_dir / "technical_specs"
        specs_dir.mkdir(exist_ok=True)
        
        count = 0
        for pdf_data in data:
            for product in pdf_data.get('products', []):
                model = product.get('model', 'unknown')
                
                # Crea filename sicuro
                safe_model = model.replace('/', '_').replace('\\', '_')
                spec_file = specs_dir / f"{safe_model}.md"
                
                with open(spec_file, 'w', encoding='utf-8') as f:
                    f.write(f"# 📋 {model}\n\n")
                    f.write(f"**Brand:** {product.get('brand', 'N/A')}\n")
                    f.write(f"**Categoria:** {product.get('category', 'N/A')}\n")
                    f.write(f"**Fonte:** {pdf_data.get('filename', 'N/A')}\n\n")
                    
                    # Specifiche tecniche
                    f.write("## 🔧 Specifiche Tecniche\n\n")
                    specs = product.get('specifications', {})
                    
                    if specs:
                        for key, value in specs.items():
                            f.write(f"- **{key.replace('_', ' ').title()}:** {value}\n")
                    else:
                        f.write("*Nessuna specifica disponibile*\n")
                    
                    f.write("\n")
                    
                    # Caratteristiche
                    f.write("## ✨ Caratteristiche\n\n")
                    features = product.get('features', [])
                    
                    if features:
                        for feature in features:
                            f.write(f"- {feature.replace('_', ' ').title()}\n")
                    else:
                        f.write("*Nessuna caratteristica disponibile*\n")
                    
                    f.write("\n")
                    
                    # Contesto
                    f.write("## 📝 Note\n\n")
                    context = product.get('context_snippet', '')
                    if context:
                        f.write(f"{context}\n")
                    else:
                        f.write("*Nessun contesto disponibile*\n")
                    
                    f.write("\n---\n\n")
                    f.write(f"**Generato:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
                
                count += 1
        
        print(f"{Fore.GREEN}✓ Generate {count} schede tecniche in {specs_dir}{Style.RESET_ALL}")
    
    def generate_brand_summary(self, data: Dict[str, Any]):
        """Genera summary per brand"""
        print(f"\n{Fore.CYAN}🏢 Generazione summary brand...{Style.RESET_ALL}")
        
        summary_file = self.docs_dir / "BRAND_SUMMARY.md"
        
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write("# 🏢 Summary per Brand\n\n")
            f.write(f"**Data generazione:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            
            # Raggruppa per brand
            products_by_brand = {}
            for pdf_data in data:
                brand = pdf_data.get('brand', 'unknown')
                if brand not in products_by_brand:
                    products_by_brand[brand] = []
                
                for product in pdf_data.get('products', []):
                    products_by_brand[brand].append(product)
            
            # Genera sezione per ogni brand
            for brand, products in sorted(products_by_brand.items()):
                f.write(f"## {brand.upper()}\n\n")
                f.write(f"**Totale prodotti:** {len(products)}\n\n")
                
                # Statistiche
                categories = {}
                for product in products:
                    cat = product.get('category', 'unknown')
                    categories[cat] = categories.get(cat, 0) + 1
                
                f.write("### Distribuzione per Categoria\n\n")
                for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
                    f.write(f"- **{cat.replace('_', ' ').title()}:** {count}\n")
                
                f.write("\n")
                
                # Range di potenza
                powers = [p.get('specifications', {}).get('power_cooling', 0) for p in products if p.get('specifications', {}).get('power_cooling')]
                if powers:
                    f.write(f"### Range Potenza\n\n")
                    f.write(f"- **Minima:** {min(powers)} kW\n")
                    f.write(f"- **Massima:** {max(powers)} kW\n")
                    f.write(f"- **Media:** {sum(powers) / len(powers):.1f} kW\n\n")
                
                # Lista prodotti
                f.write("### Lista Prodotti\n\n")
                f.write("| Modello | Categoria | Potenza | SEER |\n")
                f.write("|---------|-----------|---------|------|\n")
                
                for product in products[:20]:  # Mostra solo primi 20
                    model = product.get('model', 'N/A')
                    category = product.get('category', 'N/A')
                    power = product.get('specifications', {}).get('power_cooling', 'N/A')
                    seer = product.get('specifications', {}).get('seer', 'N/A')
                    
                    f.write(f"| {model} | {category} | {power} kW | {seer} |\n")
                
                if len(products) > 20:
                    f.write(f"\n*... e altri {len(products) - 20} prodotti*\n")
                
                f.write("\n")
            
            f.write("---\n\n")
            f.write("**Generato automaticamente da Documentation Generator**\n")
        
        print(f"{Fore.GREEN}✓ Summary brand generato in {summary_file}{Style.RESET_ALL}")
    
    def generate_image_inventory(self):
        """Genera inventario immagini"""
        print(f"\n{Fore.CYAN}🖼️  Generazione inventario immagini...{Style.RESET_ALL}")
        
        inventory_file = self.docs_dir / "IMAGE_INVENTORY.md"
        
        images_dir = Path("public/uploads/images")
        
        with open(inventory_file, 'w', encoding='utf-8') as f:
            f.write("# 🖼️ Inventario Immagini\n\n")
            f.write(f"**Data generazione:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            
            if not images_dir.exists():
                f.write("*Directory immagini non trovata*\n")
                return
            
            # Conta immagini per directory
            total_images = 0
            total_size = 0
            
            f.write("## 📊 Statistiche Generali\n\n")
            
            for brand_dir in sorted(images_dir.iterdir()):
                if brand_dir.is_dir() and brand_dir.name not in ['optimized', 'thumbnails', 'extracted', 'uploaded']:
                    brand_images = list(brand_dir.rglob("*.*"))
                    brand_images = [f for f in brand_images if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']]
                    
                    if brand_images:
                        brand_size = sum(f.stat().st_size for f in brand_images)
                        total_images += len(brand_images)
                        total_size += brand_size
                        
                        f.write(f"### {brand_dir.name.upper()}\n\n")
                        f.write(f"- **Immagini:** {len(brand_images)}\n")
                        f.write(f"- **Dimensione totale:** {brand_size / (1024*1024):.1f} MB\n\n")
                        
                        # Lista per categoria
                        for category_dir in sorted(brand_dir.iterdir()):
                            if category_dir.is_dir():
                                cat_images = list(category_dir.glob("*.*"))
                                cat_images = [f for f in cat_images if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']]
                                
                                if cat_images:
                                    f.write(f"**{category_dir.name}:** {len(cat_images)} immagini\n\n")
            
            f.write(f"\n## 📈 Totali\n\n")
            f.write(f"- **Immagini totali:** {total_images}\n")
            f.write(f"- **Dimensione totale:** {total_size / (1024*1024):.1f} MB\n\n")
            
            f.write("---\n\n")
            f.write("**Generato automaticamente da Documentation Generator**\n")
        
        print(f"{Fore.GREEN}✓ Inventario immagini generato in {inventory_file}{Style.RESET_ALL}")
    
    def generate_main_readme(self, data: Dict[str, Any]):
        """Genera README principale della documentazione"""
        print(f"\n{Fore.CYAN}📚 Generazione README principale...{Style.RESET_ALL}")
        
        readme_file = self.docs_dir / "README.md"
        
        # Conta prodotti totali
        total_products = sum(len(pdf_data.get('products', [])) for pdf_data in data)
        
        with open(readme_file, 'w', encoding='utf-8') as f:
            f.write("# 📚 Documentazione AIRKLIM\n\n")
            f.write(f"**Data generazione:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            
            f.write("## 📖 Indice\n\n")
            f.write("1. [Catalogo Prodotti](PRODUCT_CATALOG.md)\n")
            f.write("2. [Schede Tecniche](technical_specs/)\n")
            f.write("3. [Summary Brand](BRAND_SUMMARY.md)\n")
            f.write("4. [Inventario Immagini](IMAGE_INVENTORY.md)\n")
            f.write("5. [Report Analisi](../data/extracted/advanced_analysis_report.md)\n")
            f.write("6. [Report Categorizzazione](../data/extracted/category_report.md)\n\n")
            
            f.write("## 📊 Statistiche Progetto\n\n")
            f.write(f"- **PDF analizzati:** {len(data)}\n")
            f.write(f"- **Prodotti identificati:** {total_products}\n")
            f.write(f"- **Categorie:** {len(set(p.get('category') for pdf in data for p in pdf.get('products', [])))}\n")
            f.write(f"- **Brand:** {len(set(pdf.get('brand') for pdf in data))}\n\n")
            
            f.write("## 🛠️ Script Disponibili\n\n")
            f.write("### Python\n")
            f.write("- `analyze_pdfs.py` - Analisi base PDF\n")
            f.write("- `advanced_pdf_analyzer.py` - Analisi avanzata con NLP\n")
            f.write("- `analyze_images.py` - Analisi immagini con OCR\n")
            f.write("- `auto_categorize.py` - Categorizzazione automatica\n")
            f.write("- `file_organizer.py` - Organizzazione file\n")
            f.write("- `data_validator.py` - Validazione dati\n")
            f.write("- `local_server.py` - Server locale\n")
            f.write("- `pipeline.py` - Orchestratore pipeline\n\n")
            
            f.write("### Node.js\n")
            f.write("- `extract-products.js` - Estrazione prodotti (legacy)\n")
            f.write("- `optimize-images.js` - Ottimizzazione immagini\n")
            f.write("- `check-missing-images.js` - Verifica immagini mancanti\n")
            f.write("- `import-products.js` - Import prodotti\n\n")
            
            f.write("## 🚀 Quick Start\n\n")
            f.write("```bash\n")
            f.write("# Setup iniziale\n")
            f.write("./setup.sh\n\n")
            f.write("# Esegui pipeline completa\n")
            f.write("./run_all.sh\n\n")
            f.write("# Oppure esegui script individuali\n")
            f.write("python3 scripts/advanced_pdf_analyzer.py\n")
            f.write("python3 scripts/auto_categorize.py\n")
            f.write("python3 scripts/file_organizer.py\n")
            f.write("python3 scripts/data_validator.py\n")
            f.write("```\n\n")
            
            f.write("## 📁 Struttura Documentazione\n\n")
            f.write("```\n")
            f.write("docs/\n")
            f.write("├── README.md                    # Questo file\n")
            f.write("├── PRODUCT_CATALOG.md           # Catalogo prodotti\n")
            f.write("├── BRAND_SUMMARY.md             # Summary per brand\n")
            f.write("├── IMAGE_INVENTORY.md           # Inventario immagini\n")
            f.write("└── technical_specs/             # Schede tecniche\n")
            f.write("    ├── CS-XZ20CKEW-H.md\n")
            f.write("    ├── CS-Z25CKEW.md\n")
            f.write("    └── ...\n")
            f.write("```\n\n")
            
            f.write("---\n\n")
            f.write("**Generato automaticamente da Documentation Generator**\n")
        
        print(f"{Fore.GREEN}✓ README principale generato in {readme_file}{Style.RESET_ALL}")
    
    def run(self):
        """Esegue la generazione documentazione completa"""
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}📚 AIRKLIM Documentation Generator{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        # Carica dati
        data = self.load_extracted_data()
        
        if not data:
            return
        
        # Genera documentazione
        self.generate_product_catalog(data)
        self.generate_technical_specs(data)
        self.generate_brand_summary(data)
        self.generate_image_inventory()
        self.generate_main_readme(data)
        
        # Summary finale
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}✅ Documentazione Generata{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        print(f"{Fore.GREEN}✓ Documentazione disponibile in: docs/{Style.RESET_ALL}")
        print(f"\n{Fore.CYAN}📖 File generati:{Style.RESET_ALL}")
        print(f"  - docs/README.md")
        print(f"  - docs/PRODUCT_CATALOG.md")
        print(f"  - docs/BRAND_SUMMARY.md")
        print(f"  - docs/IMAGE_INVENTORY.md")
        print(f"  - docs/technical_specs/*.md\n")

def main():
    """Funzione principale"""
    generator = DocumentationGenerator()
    generator.run()

if __name__ == "__main__":
    main()
