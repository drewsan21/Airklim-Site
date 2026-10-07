#!/usr/bin/env python3
"""
AIRKLIM Auto Categorizer
Categorizzazione automatica intelligente dei prodotti basata su NLP e ML
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import Dict, List, Any, Tuple
from collections import defaultdict
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from colorama import Fore, Style, init

init(autoreset=True)

class AutoCategorizer:
    """Categorizzatore automatico intelligente"""
    
    def __init__(self):
        self.data_dir = Path("data/extracted")
        self.output_dir = Path("src/data")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Categorie predefinite con pattern
        self.predefined_categories = {
            'etherea_xz_grafite': {
                'keywords': ['etherea', 'xz', 'grafite', 'grey', 'grigio'],
                'model_pattern': r'CS-XZ\d{2,3}.*H',
                'priority': 1
            },
            'etherea_z_bianco': {
                'keywords': ['etherea', 'z', 'bianco', 'white'],
                'model_pattern': r'CS-Z\d{2,3}(?!CD|CE|YK)',
                'priority': 2
            },
            'tz_super_compact': {
                'keywords': ['tz', 'compact', 'compatta', 'super'],
                'model_pattern': r'CS-TZ\d{2,3}',
                'priority': 3
            },
            'console_floor': {
                'keywords': ['console', 'floor', 'pavimento'],
                'model_pattern': r'CS-Z\d{2,3}CE',
                'priority': 4
            },
            'ducted': {
                'keywords': ['ducted', 'canalizzat'],
                'model_pattern': r'CS-Z\d{2,3}CD',
                'priority': 5
            },
            'professional': {
                'keywords': ['professional', 'professionale', '-25'],
                'model_pattern': r'CS-Z\d{2,3}YK',
                'priority': 6
            },
            'outdoor_unit': {
                'keywords': ['outdoor', 'unita esterna', 'condensatore', 'cu-'],
                'model_pattern': r'CU-[A-Z0-9]+',
                'priority': 7
            },
            'multi_split': {
                'keywords': ['multi', 'dual', 'trial', 'quad', 'penta'],
                'model_pattern': r'CU-\dZ\d{2,3}',
                'priority': 8
            },
            'heat_pump': {
                'keywords': ['aquarea', 'pompa di calore', 'heat pump'],
                'model_pattern': r'(S|H|T).*Aquarea',
                'priority': 9
            },
            'accessory': {
                'keywords': ['telecomando', 'gateway', 'filtro', 'accessorio'],
                'model_pattern': r'(CZ|PAW)-[A-Z0-9]+',
                'priority': 10
            },
            'tcl_breezein': {
                'keywords': ['tcl', 'breezein', 'breeze'],
                'model_pattern': r'S\d{2}[A-Z0-9]*',
                'priority': 11
            }
        }
        
    def load_extracted_data(self) -> Dict[str, Any]:
        """Carica i dati estratti dai PDF"""
        print(f"{Fore.CYAN}📂 Caricamento dati estratti...{Style.RESET_ALL}")
        
        data_file = self.data_dir / "pdf_analysis_complete.json"
        
        if not data_file.exists():
            print(f"{Fore.RED}✗ File non trovato: {data_file}{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}⚠️  Esegui prima: python scripts/analyze_pdfs.py{Style.RESET_ALL}")
            return {}
        
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"{Fore.GREEN}✓ Dati caricati: {len(data)} PDF analizzati{Style.RESET_ALL}")
        return data
    
    def extract_all_products(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Estrae tutti i prodotti dai dati"""
        all_products = []
        
        for pdf_data in data:
            for product in pdf_data.get('products', []):
                product['source_pdf'] = pdf_data['filename']
                all_products.append(product)
        
        print(f"{Fore.GREEN}✓ Estratti {len(all_products)} prodotti{Style.RESET_ALL}")
        return all_products
    
    def categorize_by_model(self, model: str) -> str:
        """Categorizza in base al modello usando pattern"""
        model_upper = model.upper()
        
        for category, config in self.predefined_categories.items():
            pattern = config['model_pattern']
            if re.search(pattern, model_upper, re.IGNORECASE):
                return category
        
        return 'uncategorized'
    
    def categorize_by_keywords(self, text: str) -> str:
        """Categorizza in base alle parole chiave"""
        text_lower = text.lower()
        
        # Calcola score per ogni categoria
        scores = {}
        for category, config in self.predefined_categories.items():
            score = 0
            for keyword in config['keywords']:
                if keyword.lower() in text_lower:
                    score += 1
            
            # Applica priorità (più bassa = più importante)
            scores[category] = score / config['priority']
        
        # Restituisce categoria con score più alto
        if scores:
            best_category = max(scores, key=scores.get)
            if scores[best_category] > 0:
                return best_category
        
        return 'uncategorized'
    
    def categorize_by_context(self, product: Dict[str, Any]) -> str:
        """Categorizza usando contesto completo"""
        # Combina tutte le informazioni disponibili
        context_parts = []
        
        if 'model' in product:
            context_parts.append(product['model'])
        
        if 'context_snippet' in product:
            context_parts.append(product['context_snippet'])
        
        if 'features' in product:
            context_parts.extend(product['features'])
        
        context = ' '.join(context_parts)
        
        # Prova prima con modello
        if 'model' in product:
            model_category = self.categorize_by_model(product['model'])
            if model_category != 'uncategorized':
                return model_category
        
        # Poi con keywords
        keyword_category = self.categorize_by_keywords(context)
        if keyword_category != 'uncategorized':
            return keyword_category
        
        return 'uncategorized'
    
    def cluster_similar_products(self, products: List[Dict[str, Any]]) -> Dict[str, List[Dict]]:
        """Clusterizza prodotti simili usando TF-IDF"""
        print(f"\n{Fore.CYAN}🔍 Clustering prodotti simili...{Style.RESET_ALL}")
        
        # Prepara testi per clustering
        texts = []
        for product in products:
            text_parts = [
                product.get('model', ''),
                product.get('category', ''),
                product.get('context_snippet', ''),
                ' '.join(product.get('features', []))
            ]
            texts.append(' '.join(text_parts))
        
        if len(texts) < 2:
            return {'cluster_0': products}
        
        # TF-IDF Vectorization
        vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(texts)
        
        # Clustering
        n_clusters = min(10, len(products))
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        labels = kmeans.fit_predict(tfidf_matrix)
        
        # Raggruppa prodotti per cluster
        clusters = defaultdict(list)
        for i, label in enumerate(labels):
            clusters[f'cluster_{label}'].append(products[i])
        
        print(f"{Fore.GREEN}✓ Creati {len(clusters)} cluster{Style.RESET_ALL}")
        return dict(clusters)
    
    def merge_categorizations(self, products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Unisce tutte le categorizzazioni"""
        print(f"\n{Fore.CYAN}🔄 Unione categorizzazioni...{Style.RESET_ALL}")
        
        categorized_products = []
        
        for product in products:
            # Categorizza con tutti i metodi
            model_cat = self.categorize_by_model(product.get('model', ''))
            keyword_cat = self.categorize_by_keywords(product.get('context_snippet', ''))
            context_cat = self.categorize_by_context(product)
            
            # Scegli la categoria migliore (priorità)
            final_category = 'uncategorized'
            
            if model_cat != 'uncategorized':
                final_category = model_cat
            elif context_cat != 'uncategorized':
                final_category = context_cat
            elif keyword_cat != 'uncategorized':
                final_category = keyword_cat
            
            # Aggiungi categoria finale al prodotto
            product['final_category'] = final_category
            product['categorization_methods'] = {
                'model': model_cat,
                'keyword': keyword_cat,
                'context': context_cat
            }
            
            categorized_products.append(product)
        
        # Statistiche
        category_counts = defaultdict(int)
        for product in categorized_products:
            category_counts[product['final_category']] += 1
        
        print(f"{Fore.GREEN}✓ Categorizzazione completata{Style.RESET_ALL}")
        print(f"\n{Fore.CYAN}📊 Distribuzione categorie:{Style.RESET_ALL}")
        for category, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
            print(f"  {category}: {count} prodotti")
        
        return categorized_products
    
    def generate_product_entries(self, products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Genera entry complete per i prodotti"""
        print(f"\n{Fore.CYAN}📝 Generazione entry prodotti...{Style.RESET_ALL}")
        
        entries = []
        
        for product in products:
            entry = {
                'id': product.get('model', '').lower().replace('-', '_').replace('.', '_'),
                'model': product.get('model', ''),
                'name': f"{product.get('final_category', 'Product').replace('_', ' ').title()} {product.get('model', '')}",
                'brand': product.get('brand', 'Unknown').upper(),
                'category': product.get('final_category', 'uncategorized'),
                'subcategory': product.get('final_category', 'uncategorized'),
                'type': 'indoor' if 'CU-' not in product.get('model', '') else 'outdoor',
                'power': product.get('specifications', {}).get('power_kw', 0),
                'btu': str(product.get('specifications', {}).get('power_btu', '')),
                'price': None,  # Da definire manualmente
                'stock': 0,  # Da definire manualmente
                'status': 'active',
                'color': 'Bianco',  # Default
                'features': product.get('features', []),
                'specifications': product.get('specifications', {}),
                'image': f"/uploads/images/extracted/{product.get('model', '').lower()}.jpg",
                'description': f"Prodotto {product.get('brand', '')} {product.get('model', '')}"
            }
            
            entries.append(entry)
        
        print(f"{Fore.GREEN}✓ Generate {len(entries)} entry prodotti{Style.RESET_ALL}")
        return entries
    
    def save_categorized_products(self, products: List[Dict[str, Any]]):
        """Salva i prodotti categorizzati"""
        # Salva come JSON
        json_file = self.output_dir / "categorized_products.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        
        print(f"\n{Fore.GREEN}✓ Prodotti salvati in {json_file}{Style.RESET_ALL}")
        
        # Salva come TypeScript
        ts_file = self.output_dir / "categorizedProducts2026.ts"
        
        with open(ts_file, 'w', encoding='utf-8') as f:
            f.write("/**\n")
            f.write(" * Prodotti categorizzati automaticamente\n")
            f.write(" * Generato da Auto Categorizer\n")
            f.write(f" * Data: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}\n")
            f.write(f" * Totale prodotti: {len(products)}\n")
            f.write(" */\n\n")
            
            f.write("export const categorizedProducts = ")
            f.write(json.dumps(products, indent=2, ensure_ascii=False))
            f.write(";\n\n")
            
            f.write("export default categorizedProducts;\n")
        
        print(f"{Fore.GREEN}✓ File TypeScript generato in {ts_file}{Style.RESET_ALL}")
    
    def generate_category_report(self, products: List[Dict[str, Any]]):
        """Genera report per categoria"""
        report_file = self.data_dir / "category_report.md"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("# 📊 Report Categorizzazione Automatica\n\n")
            f.write(f"**Data:** {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            
            # Raggruppa per categoria
            by_category = defaultdict(list)
            for product in products:
                by_category[product['final_category']].append(product)
            
            f.write("## 📈 Riepilogo\n\n")
            f.write(f"- **Totale prodotti:** {len(products)}\n")
            f.write(f"- **Categorie identificate:** {len(by_category)}\n\n")
            
            f.write("## 📂 Prodotti per Categoria\n\n")
            
            for category, prods in sorted(by_category.items()):
                f.write(f"### {category.replace('_', ' ').title()} ({len(prods)} prodotti)\n\n")
                f.write("| Modello | Brand | Potenza | SEER | SCOP |\n")
                f.write("|---------|-------|---------|------|------|\n")
                
                for prod in prods:
                    model = prod.get('model', 'N/A')
                    brand = prod.get('brand', 'N/A')
                    power = prod.get('specifications', {}).get('power_kw', 'N/A')
                    seer = prod.get('specifications', {}).get('seer', 'N/A')
                    scop = prod.get('specifications', {}).get('scop', 'N/A')
                    
                    f.write(f"| {model} | {brand} | {power} kW | {seer} | {scop} |\n")
                
                f.write("\n")
            
            f.write("---\n\n")
            f.write("**Generato automaticamente da Auto Categorizer**\n")
        
        print(f"{Fore.GREEN}✓ Report categorie generato in {report_file}{Style.RESET_ALL}")
    
    def run(self):
        """Esegue la categorizzazione completa"""
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}🏷️  AIRKLIM Auto Categorizer{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        # Carica dati
        data = self.load_extracted_data()
        
        if not data:
            return
        
        # Estrai tutti i prodotti
        products = self.extract_all_products(data)
        
        if not products:
            print(f"\n{Fore.YELLOW}⚠️  Nessun prodotto da categorizzare{Style.RESET_ALL}")
            return
        
        # Clusterizza prodotti simili
        clusters = self.cluster_similar_products(products)
        
        # Unisci categorizzazioni
        categorized = self.merge_categorizations(products)
        
        # Genera entry complete
        entries = self.generate_product_entries(categorized)
        
        # Salva risultati
        self.save_categorized_products(entries)
        
        # Genera report
        self.generate_category_report(entries)
        
        # Summary finale
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}✅ Categorizzazione Completata{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        print(f"{Fore.GREEN}✓ Prodotti categorizzati: {len(entries)}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}✓ File JSON: data/extracted/categorized_products.json{Style.RESET_ALL}")
        print(f"{Fore.GREEN}✓ File TypeScript: src/data/categorizedProducts2026.ts{Style.RESET_ALL}")
        print(f"{Fore.GREEN}✓ Report: data/extracted/category_report.md{Style.RESET_ALL}\n")
        
        print(f"{Fore.CYAN}📋 Prossimi step:{Style.RESET_ALL}")
        print(f"  1. Verifica i prodotti in data/extracted/categorized_products.json")
        print(f"  2. Aggiungi prezzi ufficiali")
        print(f"  3. Aggiungi stock reale")
        print(f"  4. Verifica immagini")
        print(f"  5. Esegui: npm run build\n")

def main():
    """Funzione principale"""
    categorizer = AutoCategorizer()
    categorizer.run()

if __name__ == "__main__":
    main()
