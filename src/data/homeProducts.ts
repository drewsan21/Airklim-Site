// Home landing product catalog (extracted from App.tsx for code-splitting)
import {
  panasonicEthereaGrafiteImg,
  panasonicEthereaBiancoImg,
  panasonicTZImg,
  panasonicConsoleImg,
  panasonicOutdoorImg,
  panasonicRemoteImg,
  tclBreezeInImg,
  panasonicDuctedImg,
  panasonicMultiSplitImg,
  panasonicProfessionalImg,
  aquareaImg,
  ecoiVrfImg,
} from './productImages';

// ===== TYPES =====
export interface Product {
  name: string;
  power: string;
  series: string;
  stock: number;
  brand: string;
  variant: 'indoor' | 'outdoor';
  desc: string;
  features: string[];
  price?: string;
  image?: string;
  category: string;
}

// ===== CATALOGO COMPLETO PANASONIC 2026 - Tutti i prodotti dal PDF =====
export const panasonicProducts: Product[] = [
  // ETHEREA XZ GRIGIO GRAFITE (4 modelli)
  { name: 'Etherea XZ20 Grigio Grafite', power: '2,0 kW', series: 'CS-XZ20CKEW-H', stock: 25, brand: 'Panasonic', variant: 'indoor', desc: 'Etherea XZ 2.0 kW Grigio Grafite con nanoe™ X Mark 3: 48 trilioni di radicali ossidrilici al secondo.', features: ['nanoe™ X Mark 3', 'Aerowings 2.0', 'AI ECO', 'Wi-Fi', '19 dB(A)', '-20°C'], price: '€ 1.290', image: panasonicEthereaGrafiteImg, category: 'panasonic' },
  { name: 'Etherea XZ25 Grigio Grafite', power: '2,5 kW', series: 'CS-XZ25CKEW-H', stock: 30, brand: 'Panasonic', variant: 'indoor', desc: 'Etherea XZ 2.5 kW Grigio Grafite. SEER 9.5 A+++ e 19 dB(A) di silenziosità.', features: ['nanoe™ X Mark 3', 'Aerowings 2.0', 'AI ECO', 'Wi-Fi', '19 dB(A)', '-20°C'], price: '€ 1.390', image: panasonicEthereaGrafiteImg, category: 'panasonic' },
  { name: 'Etherea XZ35 Grigio Grafite', power: '3,5 kW', series: 'CS-XZ35CKEW-H', stock: 35, brand: 'Panasonic', variant: 'indoor', desc: 'Etherea XZ 3.5 kW Grigio Grafite. Top di gamma per efficienza e comfort.', features: ['nanoe™ X Mark 3', 'Aerowings 2.0', 'AI ECO', 'Wi-Fi', '19 dB(A)', '-20°C'], price: '€ 1.590', image: panasonicEthereaGrafiteImg, category: 'panasonic' },
  { name: 'Etherea XZ50 Grigio Grafite', power: '5,0 kW', series: 'CS-XZ50CKEW-H', stock: 20, brand: 'Panasonic', variant: 'indoor', desc: 'Etherea XZ 5.0 kW Grigio Grafite per ambienti medio-grandi.', features: ['nanoe™ X Mark 3', 'Aerowings 2.0', 'AI ECO', 'Wi-Fi', '21 dB(A)', '-20°C'], price: '€ 1.890', image: panasonicEthereaGrafiteImg, category: 'panasonic' },
  
  // ETHEREA Z BIANCO (6 modelli)
  { name: 'Etherea Z20 Bianco', power: '2,0 kW', series: 'CS-Z20CKEW', stock: 40, brand: 'Panasonic', variant: 'indoor', desc: 'Etherea Z 2.0 kW Bianco Opaco. Eleganza e prestazioni.', features: ['nanoe™ X Mark 3', 'Aerowings 2.0', 'AI ECO', 'Wi-Fi', '19 dB(A)', '-20°C'], price: '€ 1.090', image: panasonicEthereaBiancoImg, category: 'panasonic' },
  { name: 'Etherea Z25 Bianco', power: '2,5 kW', series: 'CS-Z25CKEW', stock: 45, brand: 'Panasonic', variant: 'indoor', desc: 'Etherea Z 2.5 kW Bianco. Best seller per efficienza A+++.', features: ['nanoe™ X Mark 3', 'Aerowings 2.0', 'AI ECO', 'Wi-Fi', '19 dB(A)', '-20°C'], price: '€ 1.190', image: panasonicEthereaBiancoImg, category: 'panasonic' },
  { name: 'Etherea Z35 Bianco', power: '3,5 kW', series: 'CS-Z35CKEW', stock: 50, brand: 'Panasonic', variant: 'indoor', desc: 'Etherea Z 3.5 kW Bianco. Il modello più venduto.', features: ['nanoe™ X Mark 3', 'Aerowings 2.0', 'AI ECO', 'Wi-Fi', '19 dB(A)', '-20°C'], price: '€ 1.390', image: panasonicEthereaBiancoImg, category: 'panasonic' },
  { name: 'Etherea Z50 Bianco', power: '5,0 kW', series: 'CS-Z50CKEW', stock: 25, brand: 'Panasonic', variant: 'indoor', desc: 'Etherea Z 5.0 kW Bianco per ambienti grandi.', features: ['nanoe™ X Mark 3', 'Aerowings 2.0', 'AI ECO', 'Wi-Fi', '21 dB(A)', '-20°C'], price: '€ 1.690', image: panasonicEthereaBiancoImg, category: 'panasonic' },
  { name: 'Etherea Z60 Bianco', power: '6,0 kW', series: 'CS-Z60CKEW', stock: 15, brand: 'Panasonic', variant: 'indoor', desc: 'Etherea Z 6.0 kW Bianco per open space.', features: ['nanoe™ X Mark 3', 'Aerowings 2.0', 'AI ECO', 'Wi-Fi', '23 dB(A)', '-20°C'], price: '€ 1.990', image: panasonicEthereaBiancoImg, category: 'panasonic' },
  { name: 'Etherea Z71 Bianco', power: '7,1 kW', series: 'CS-Z71CKEW', stock: 10, brand: 'Panasonic', variant: 'indoor', desc: 'Etherea Z 7.1 kW Bianco. Massima potenza residenziale.', features: ['nanoe™ X Mark 3', 'Aerowings 2.0', 'AI ECO', 'Wi-Fi', '25 dB(A)', '-20°C'], price: '€ 2.290', image: panasonicEthereaBiancoImg, category: 'panasonic' },
  
  // TZ SUPER-COMPATTA (4 modelli)
  { name: 'TZ20 Super-Compatta', power: '2,0 kW', series: 'CS-TZ20CKEW', stock: 50, brand: 'Panasonic', variant: 'indoor', desc: 'TZ 2.0 kW super-compatta. Solo 765mm di larghezza.', features: ['nanoe™ X Mark 2', 'Aerowings', 'Wi-Fi', '20 dB(A)', '765mm', '-15°C'], price: '€ 890', image: panasonicTZImg, category: 'panasonic' },
  { name: 'TZ25 Super-Compatta', power: '2,5 kW', series: 'CS-TZ25CKEW', stock: 55, brand: 'Panasonic', variant: 'indoor', desc: 'TZ 2.5 kW super-compatta. Ideale per spazi ridotti.', features: ['nanoe™ X Mark 2', 'Aerowings', 'Wi-Fi', '20 dB(A)', '765mm', '-15°C'], price: '€ 990', image: panasonicTZImg, category: 'panasonic' },
  { name: 'TZ35 Super-Compatta', power: '3,5 kW', series: 'CS-TZ35CKEW', stock: 60, brand: 'Panasonic', variant: 'indoor', desc: 'TZ 3.5 kW super-compatta. Best seller per rapporto qualità-prezzo.', features: ['nanoe™ X Mark 2', 'Aerowings', 'Wi-Fi', '20 dB(A)', '765mm', '-15°C'], price: '€ 1.190', image: panasonicTZImg, category: 'panasonic' },
  { name: 'TZ50 Super-Compatta', power: '5,0 kW', series: 'CS-TZ50CKEW', stock: 30, brand: 'Panasonic', variant: 'indoor', desc: 'TZ 5.0 kW super-compatta. Potenza in formato compatto.', features: ['nanoe™ X Mark 2', 'Aerowings', 'Wi-Fi', '22 dB(A)', '765mm', '-15°C'], price: '€ 1.390', image: panasonicTZImg, category: 'panasonic' },
  
  // CONSOLE A PAVIMENTO (3 modelli)
  { name: 'Console Z25 a Pavimento', power: '2,5 kW', series: 'CS-Z25CEAW', stock: 20, brand: 'Panasonic', variant: 'indoor', desc: 'Console 2.5 kW a pavimento. Design elegante premiato con iF Design Award.', features: ['nanoe™ X Mark 3', 'Doppio flusso', 'Wi-Fi', '20 dB(A)', 'iF Award', '-15°C'], price: '€ 1.490', image: panasonicConsoleImg, category: 'panasonic' },
  { name: 'Console Z35 a Pavimento', power: '3,5 kW', series: 'CS-Z35CEAW', stock: 25, brand: 'Panasonic', variant: 'indoor', desc: 'Console 3.5 kW a pavimento. Ideale per ristrutturazioni.', features: ['nanoe™ X Mark 3', 'Doppio flusso', 'Wi-Fi', '20 dB(A)', 'iF Award', '-15°C'], price: '€ 1.690', image: panasonicConsoleImg, category: 'panasonic' },
  { name: 'Console Z50 a Pavimento', power: '5,0 kW', series: 'CS-Z50CEAW', stock: 15, brand: 'Panasonic', variant: 'indoor', desc: 'Console 5.0 kW a pavimento. Sostituzione termosifoni.', features: ['nanoe™ X Mark 3', 'Doppio flusso', 'Wi-Fi', '22 dB(A)', 'iF Award', '-15°C'], price: '€ 1.990', image: panasonicConsoleImg, category: 'panasonic' },
  
  // CANALIZZATA BASSA PRESSIONE (3 modelli)
  { name: 'Canalizzata Z25 Bassa Pressione', power: '2,5 kW', series: 'CS-Z25CD3EAW', stock: 15, brand: 'Panasonic', variant: 'indoor', desc: 'Canalizzata 2.5 kW ultra-sottile (200mm). Per controsoffitti ridotti.', features: ['200mm altezza', '7 mmAq', 'KNX/Modbus', 'Pompa scarico', 'Timer', 'A++'], price: '€ 1.790', image: panasonicDuctedImg, category: 'panasonic' },
  { name: 'Canalizzata Z35 Bassa Pressione', power: '3,5 kW', series: 'CS-Z35CD3EAW', stock: 18, brand: 'Panasonic', variant: 'indoor', desc: 'Canalizzata 3.5 kW ultra-sottile. Per applicazioni commerciali.', features: ['200mm altezza', '7 mmAq', 'KNX/Modbus', 'Pompa scarico', 'Timer', 'A++'], price: '€ 1.990', image: panasonicDuctedImg, category: 'panasonic' },
  { name: 'Canalizzata Z50 Bassa Pressione', power: '5,0 kW', series: 'CS-Z50CD3EAW', stock: 12, brand: 'Panasonic', variant: 'indoor', desc: 'Canalizzata 5.0 kW ultra-sottile. Per grandi ambienti.', features: ['200mm altezza', '7 mmAq', 'KNX/Modbus', 'Pompa scarico', 'Timer', 'A++'], price: '€ 2.290', image: panasonicDuctedImg, category: 'panasonic' },
  
  // PROFESSIONALE -25°C (3 modelli)
  { name: 'Professionale Z25 -25°C', power: '2,5 kW', series: 'CS-Z25YKEA-1', stock: 12, brand: 'Panasonic', variant: 'indoor', desc: 'Professionale 2.5 kW per sale server. Operatività 24/7 fino a -25°C.', features: ['24/7 operation', '-25°C', 'Comando filo', 'BMS', 'SEER 9.5', 'A+++'], price: '€ 1.690', image: panasonicProfessionalImg, category: 'panasonic' },
  { name: 'Professionale Z35 -25°C', power: '3,5 kW', series: 'CS-Z35YKEA-1', stock: 10, brand: 'Panasonic', variant: 'indoor', desc: 'Professionale 3.5 kW per sale server. Massima affidabilità.', features: ['24/7 operation', '-25°C', 'Comando filo', 'BMS', 'SEER 9.5', 'A+++'], price: '€ 1.890', image: panasonicProfessionalImg, category: 'panasonic' },
  { name: 'Professionale Z50 -25°C', power: '5,0 kW', series: 'CS-Z50YKEA-1', stock: 8, brand: 'Panasonic', variant: 'indoor', desc: 'Professionale 5.0 kW per data center. Potenza e affidabilità.', features: ['24/7 operation', '-25°C', 'Comando filo', 'BMS', 'SEER 8.5', 'A+++'], price: '€ 2.190', image: panasonicProfessionalImg, category: 'panasonic' },
  
  // MULTI-SPLIT (7 sistemi)
  { name: 'Dual Split 2Z35', power: '3,5 kW', series: 'CU-2Z35HBE', stock: 15, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema Dual Split per 2 ambienti con controllo indipendente.', features: ['2 unità', '6.0 kW max', 'Indipendente', 'R32', 'A++', '5 anni'], price: '€ 2.190', image: panasonicMultiSplitImg, category: 'panasonic' },
  { name: 'Dual Split 2Z41', power: '4,1 kW', series: 'CU-2Z41CBE', stock: 12, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema Dual Split 4.1 kW per appartamenti.', features: ['2 unità', '7.0 kW max', 'Indipendente', 'R32', 'A++', '5 anni'], price: '€ 2.390', image: panasonicMultiSplitImg, category: 'panasonic' },
  { name: 'Trial Split 3Z52', power: '5,2 kW', series: 'CU-3Z52HBE', stock: 10, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema Trial Split per 3 ambienti.', features: ['3 unità', '9.5 kW max', 'Indipendente', 'R32', 'A++', '5 anni'], price: '€ 2.990', image: panasonicMultiSplitImg, category: 'panasonic' },
  { name: 'Trial Split 3Z68', power: '6,8 kW', series: 'CU-3Z68HBE', stock: 8, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema Trial Split 6.8 kW per ville.', features: ['3 unità', '10.5 kW max', 'Indipendente', 'R32', 'A++', '5 anni'], price: '€ 3.290', image: panasonicMultiSplitImg, category: 'panasonic' },
  { name: 'Quad Split 4Z68', power: '6,8 kW', series: 'CU-4Z68HBE', stock: 8, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema Quad Split per 4 ambienti.', features: ['4 unità', '11.5 kW max', 'Indipendente', 'R32', 'A++', '5 anni'], price: '€ 3.790', image: panasonicMultiSplitImg, category: 'panasonic' },
  { name: 'Quad Split 4Z100', power: '10,0 kW', series: 'CU-4Z100HBE', stock: 5, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema Quad Split 10 kW per grandi appartamenti.', features: ['4 unità', '14.0 kW max', 'Indipendente', 'R32', 'A++', '5 anni'], price: '€ 4.490', image: panasonicMultiSplitImg, category: 'panasonic' },
  { name: 'Penta Split 5Z100', power: '10,0 kW', series: 'CU-5Z100HBE', stock: 4, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema Penta Split per 5 ambienti. Massima flessibilità.', features: ['5 unità', '15.0 kW max', 'Indipendente', 'R32', 'A++', '5 anni'], price: '€ 4.990', image: panasonicMultiSplitImg, category: 'panasonic' },
];
// ===== CATALOGO COMPLETO TCL 2026 - Tutti i prodotti =====
export const tclProducts: Product[] = [
  // TCL BREEZEIN (4 modelli)
  { name: 'TCL BreezeIN 9000 BTU', power: '2,6 kW', series: 'S09P5S0', stock: 60, brand: 'TCL', variant: 'indoor', desc: 'TCL BreezeIN 9000 BTU con Gentle Breeze: 1422 micro-fori per flusso delicato.', features: ['Gentle Breeze', 'Wi-Fi', 'A++', 'Self-Clean', 'Google/Alexa', 'R32'], price: '€ 590', image: tclBreezeInImg, category: 'tcl' },
  { name: 'TCL BreezeIN 12000 BTU', power: '3,5 kW', series: 'S12P5S0', stock: 70, brand: 'TCL', variant: 'indoor', desc: 'TCL BreezeIN 12000 BTU. Best seller per rapporto qualità-prezzo.', features: ['Gentle Breeze', 'Wi-Fi', 'A++', 'Self-Clean', 'Google/Alexa', 'R32'], price: '€ 690', image: tclBreezeInImg, category: 'tcl' },
  { name: 'TCL BreezeIN 18000 BTU', power: '5,0 kW', series: 'S18P5S0', stock: 40, brand: 'TCL', variant: 'indoor', desc: 'TCL BreezeIN 18000 BTU per ambienti medio-grandi.', features: ['Gentle Breeze', 'Wi-Fi', 'A++', 'Self-Clean', 'Google/Alexa', 'R32'], price: '€ 890', image: tclBreezeInImg, category: 'tcl' },
  { name: 'TCL BreezeIN 24000 BTU', power: '7,0 kW', series: 'S24P5S0', stock: 25, brand: 'TCL', variant: 'indoor', desc: 'TCL BreezeIN 24000 BTU per grandi ambienti.', features: ['Gentle Breeze', 'Wi-Fi', 'A++', 'Self-Clean', 'Google/Alexa', 'R32'], price: '€ 1.090', image: tclBreezeInImg, category: 'tcl' },
];
export const heaterProducts: Product[] = [
  { name: 'Aquarea Monoblocco L 9kW', power: '9 kW', series: 'L Series', stock: 10, brand: 'Panasonic', variant: 'outdoor', desc: 'Pompa di calore aria-acqua monoblocco. Riscaldamento, raffrescamento e ACS. SCOP 5.12. Funziona fino a -28°C.', features: ['Monoblocco', 'SCOP 5.12', '-28°C', 'R32', 'A+++', 'Wi-Fi'], price: '€ 4.990', image: aquareaImg, category: 'heaters' },
  { name: 'Aquarea Monoblocco L 12kW', power: '12 kW', series: 'L Series', stock: 8, brand: 'Panasonic', variant: 'outdoor', desc: 'Potenza superiore per abitazioni più grandi. Riscaldamento a pavimento o radiatori.', features: ['Monoblocco', 'SCOP 5.12', '-28°C', 'R32', 'A+++', 'Wi-Fi'], price: '€ 5.990', image: aquareaImg, category: 'heaters' },
  { name: 'Aquarea Split K 9kW', power: '9 kW', series: 'K Series', stock: 10, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema split con unità interna ed esterna. Installazione flessibile, massimo comfort.', features: ['Split', 'SCOP 4.8', '-20°C', 'R32', 'A+++', 'Aquarea Smart'], price: '€ 4.490', category: 'heaters' },
  { name: 'Aquarea Big M 25kW', power: '25 kW', series: 'M Series', stock: 5, brand: 'Panasonic', variant: 'outdoor', desc: 'Per grandi edifici e applicazioni commerciali. R290 refrigerante naturale. SCOP 5.22.', features: ['Big Capacity', 'SCOP 5.22', 'R290', 'Cascadabile', 'A+++', 'Commerciale'], price: '€ 12.900', category: 'heaters' },
];
export const commercialProducts: Product[] = [
  { name: 'ECOi EX VRF 8HP', power: '22,4 kW', series: 'ECOi EX', stock: 5, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema VRF 3 tubi R32. Fino a 64 unità interne collegate. 41% meno refrigerante vs R410A.', features: ['VRF 3 tubi', 'R32', '64 UI max', 'A++', 'Autonomo', 'BMS'], image: ecoiVrfImg, category: 'commercial' },
  { name: 'ECOi EX VRF 16HP', power: '45 kW', series: 'ECOi EX', stock: 3, brand: 'Panasonic', variant: 'outdoor', desc: 'Massima potenza per grandi edifici. Funzionamento simultaneo caldo/freddo.', features: ['VRF 3 tubi', 'R32', '128 UI max', 'A++', 'Heat Recovery', 'BMS'], image: ecoiVrfImg, category: 'commercial' },
  { name: 'Cassette 600x600 12000 BTU', power: '3,5 kW', series: 'CS-3UBE', stock: 20, brand: 'Panasonic', variant: 'indoor', desc: 'Cassette compatta per controsoffitti standard. nanoe™ X, flusso a 360°.', features: ['Cassette 60x60', 'nanoe™ X', '360°', 'Inverter', 'R32', 'A++'], category: 'commercial' },
  { name: 'Canalizzato Slim 18000 BTU', power: '5,0 kW', series: 'CS-SE', stock: 15, brand: 'Panasonic', variant: 'indoor', desc: 'Altezza solo 200mm. Ideale per installazione in spazi ridotti sopra controsoffitto.', features: ['Slim 200mm', 'Inverter', 'R32', 'A++', 'Silenzioso'], category: 'commercial' },
];
