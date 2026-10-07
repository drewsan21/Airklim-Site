#!/usr/bin/env python3
"""
AIRKLIM Pipeline Orchestrator
Esegue l'intera pipeline di analisi e import in sequenza
"""

import os
import sys
import subprocess
import json
from pathlib import Path
from datetime import datetime
from colorama import Fore, Style, init

init(autoreset=True)

class PipelineOrchestrator:
    """Orchestratore della pipeline completa"""
    
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.scripts_dir = self.base_dir / "scripts"
        self.logs_dir = self.base_dir / "logs"
        self.logs_dir.mkdir(exist_ok=True)
        
        self.pipeline_log = []
        
    def log(self, message: str, level: str = "info"):
        """Log con timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}"
        
        self.pipeline_log.append(log_entry)
        
        if level == "error":
            print(f"{Fore.RED}{log_entry}{Style.RESET_ALL}")
        elif level == "success":
            print(f"{Fore.GREEN}{log_entry}{Style.RESET_ALL}")
        elif level == "warning":
            print(f"{Fore.YELLOW}{log_entry}{Style.RESET_ALL}")
        else:
            print(f"{Fore.CYAN}{log_entry}{Style.RESET_ALL}")
    
    def run_python_script(self, script_name: str, args: list = None) -> bool:
        """Esegue uno script Python"""
        script_path = self.scripts_dir / script_name
        
        if not script_path.exists():
            self.log(f"Script non trovato: {script_path}", "error")
            return False
        
        self.log(f"Esecuzione: python3 {script_name}", "info")
        
        try:
            cmd = [sys.executable, str(script_path)]
            if args:
                cmd.extend(args)
            
            result = subprocess.run(
                cmd,
                cwd=str(self.base_dir),
                capture_output=True,
                text=True,
                timeout=600  # 10 minuti timeout
            )
            
            if result.returncode == 0:
                self.log(f"✓ {script_name} completato con successo", "success")
                if result.stdout:
                    print(result.stdout)
                return True
            else:
                self.log(f"✗ {script_name} fallito", "error")
                if result.stderr:
                    print(f"{Fore.RED}{result.stderr}{Style.RESET_ALL}")
                return False
                
        except subprocess.TimeoutExpired:
            self.log(f"✗ {script_name} timeout (>10 minuti)", "error")
            return False
        except Exception as e:
            self.log(f"✗ Errore nell'esecuzione di {script_name}: {e}", "error")
            return False
    
    def run_node_script(self, script_name: str, args: list = None) -> bool:
        """Esegue uno script Node.js"""
        script_path = self.scripts_dir / script_name
        
        if not script_path.exists():
            self.log(f"Script non trovato: {script_path}", "error")
            return False
        
        self.log(f"Esecuzione: node {script_name}", "info")
        
        try:
            cmd = ["node", str(script_path)]
            if args:
                cmd.extend(args)
            
            result = subprocess.run(
                cmd,
                cwd=str(self.base_dir),
                capture_output=True,
                text=True,
                timeout=300  # 5 minuti timeout
            )
            
            if result.returncode == 0:
                self.log(f"✓ {script_name} completato con successo", "success")
                if result.stdout:
                    print(result.stdout)
                return True
            else:
                self.log(f"✗ {script_name} fallito", "error")
                if result.stderr:
                    print(f"{Fore.RED}{result.stderr}{Style.RESET_ALL}")
                return False
                
        except subprocess.TimeoutExpired:
            self.log(f"✗ {script_name} timeout (>5 minuti)", "error")
            return False
        except Exception as e:
            self.log(f"✗ Errore nell'esecuzione di {script_name}: {e}", "error")
            return False
    
    def check_prerequisites(self) -> bool:
        """Verifica i prerequisiti"""
        self.log("Verifica prerequisiti...", "info")
        
        # Verifica directory uploads
        images_dir = self.base_dir / "public" / "uploads" / "images"
        catalogs_dir = self.base_dir / "public" / "uploads" / "catalogs"
        
        if not images_dir.exists():
            self.log(f"Directory non trovata: {images_dir}", "warning")
            images_dir.mkdir(parents=True, exist_ok=True)
        
        if not catalogs_dir.exists():
            self.log(f"Directory non trovata: {catalogs_dir}", "warning")
            catalogs_dir.mkdir(parents=True, exist_ok=True)
        
        # Conta file
        image_count = len(list(images_dir.rglob("*.*")))
        pdf_count = len(list(catalogs_dir.rglob("*.pdf")))
        
        self.log(f"Immagini trovate: {image_count}", "info")
        self.log(f"PDF trovati: {pdf_count}", "info")
        
        if image_count == 0 and pdf_count == 0:
            self.log("Nessun file da processare!", "warning")
            self.log("Carica file in public/uploads/ prima di continuare", "warning")
            return False
        
        return True
    
    def run_pipeline(self, steps: list = None):
        """Esegue la pipeline completa"""
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}🚀 AIRKLIM Pipeline Orchestrator{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        self.log("Inizio pipeline", "info")
        start_time = datetime.now()
        
        # Step default
        if steps is None:
            steps = [
                "analyze_pdfs",
                "analyze_images",
                "auto_categorize",
                "organize_files",
                "validate_data",
                "generate_docs",
                "optimize_images",
                "check_missing",
                "import_products",
                "build"
            ]
        
        # Verifica prerequisiti
        if not self.check_prerequisites():
            self.log("Pipeline interrotta: prerequisiti non soddisfatti", "error")
            return False
        
        # Esegui ogni step
        results = {}
        
        for step in steps:
            self.log(f"\n{'='*60}", "info")
            self.log(f"Step: {step}", "info")
            self.log(f"{'='*60}", "info")
            
            success = False
            
            if step == "analyze_pdfs":
                success = self.run_python_script("advanced_pdf_analyzer.py")
            
            elif step == "analyze_images":
                success = self.run_python_script("analyze_images.py")
            
            elif step == "auto_categorize":
                success = self.run_python_script("auto_categorize.py")
            
            elif step == "organize_files":
                success = self.run_python_script("file_organizer.py")
            
            elif step == "validate_data":
                success = self.run_python_script("data_validator.py")
            
            elif step == "generate_docs":
                success = self.run_python_script("documentation_generator.py")
            
            elif step == "optimize_images":
                success = self.run_node_script("optimize-images.js")
            
            elif step == "check_missing":
                success = self.run_node_script("check-missing-images.js")
            
            elif step == "import_products":
                success = self.run_node_script("import-products.js")
            
            elif step == "build":
                self.log("Esecuzione: npm run build", "info")
                try:
                    result = subprocess.run(
                        ["npm", "run", "build"],
                        cwd=str(self.base_dir),
                        capture_output=True,
                        text=True,
                        timeout=120
                    )
                    success = result.returncode == 0
                    if success:
                        self.log("✓ Build completato con successo", "success")
                    else:
                        self.log("✗ Build fallito", "error")
                        if result.stderr:
                            print(f"{Fore.RED}{result.stderr}{Style.RESET_ALL}")
                except Exception as e:
                    self.log(f"✗ Errore build: {e}", "error")
                    success = False
            
            results[step] = success
            
            if not success:
                self.log(f"Step {step} fallito, continuando...", "warning")
        
        # Summary finale
        end_time = datetime.now()
        duration = end_time - start_time
        
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}📊 Pipeline Summary{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
        
        self.log(f"Durata totale: {duration}", "info")
        
        for step, success in results.items():
            status = f"{Fore.GREEN}✓{Style.RESET_ALL}" if success else f"{Fore.RED}✗{Style.RESET_ALL}"
            self.log(f"{status} {step}", "info")
        
        # Salva log
        log_file = self.logs_dir / f"pipeline_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.pipeline_log))
        
        self.log(f"\nLog salvato in: {log_file}", "success")
        
        # Verifica successo complessivo
        all_success = all(results.values())
        
        if all_success:
            self.log("\n🎉 Pipeline completata con successo!", "success")
        else:
            failed_steps = [step for step, success in results.items() if not success]
            self.log(f"\n⚠️  Pipeline completata con errori: {', '.join(failed_steps)}", "warning")
        
        return all_success

def main():
    """Funzione principale"""
    import argparse
    
    parser = argparse.ArgumentParser(description="AIRKLIM Pipeline Orchestrator")
    parser.add_argument(
        "--steps",
        nargs="+",
        choices=["analyze_pdfs", "analyze_images", "auto_categorize", "organize_files", "validate_data", "generate_docs", "optimize_images", "check_missing", "import_products", "build"],
        help="Step da eseguire (default: tutti)"
    )
    
    args = parser.parse_args()
    
    orchestrator = PipelineOrchestrator()
    orchestrator.run_pipeline(args.steps)

if __name__ == "__main__":
    main()
