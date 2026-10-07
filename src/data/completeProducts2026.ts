/**
 * CATALOGO COMPLETO PANASONIC & TCL 2026
 * Dati estratti dai cataloghi ufficiali:
 * - "Catalogo residenziale 2026"
 * - "Catalogo commerciale PACi 2026"
 * 
 * TOTALE PRODOTTI: 45
 * - Panasonic Residenziale: 18 prodotti
 * - Panasonic Commerciale: 23 prodotti
 * - TCL: 4 prodotti
 * 
 * NOTA: Le immagini sono rappresentazioni AI realistiche.
 * Per le immagini ufficiali del catalogo Panasonic 2026, contattare:
 * - Panasonic Marketing Europe: marketing@eu.panasonic.com
 * - PRO Partner Portal: https://panasonicproclub.com
 * 
 * Prezzi e stock sono STIMATI e devono essere confermati con il listino ufficiale.
 */

// Importa tutti i cataloghi
import { panasonicResidential2026 } from './panasonicResidential2026';
import { panasonicCommercial2026 } from './panasonicCommercial2026';
import { tclProducts2026 } from './tclProducts2026';

// ===== CATALOGO UNIFICATO =====
export const allProducts2026 = [
  ...panasonicResidential2026,
  ...panasonicCommercial2026,
  ...tclProducts2026
];

// ===== FUNZIONI HELPER =====

/**
 * Ottieni tutti i prodotti
 */
export const getAllProducts = () => allProducts2026;

/**
 * Ottieni prodotti per categoria
 */
export const getProductsByCategory = (category: string) => {
  return allProducts2026.filter(p => p.category === category);
};

/**
 * Ottieni prodotti per brand
 */
export const getProductsByBrand = (brand: string) => {
  return allProducts2026.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
};

/**
 * Ottieni prodotto per ID
 */
export const getProductById = (id: string) => {
  return allProducts2026.find(p => p.id === id);
};

/**
 * Ottieni prodotto per modello
 */
export const getProductByModel = (model: string) => {
  return allProducts2026.find(p => p.model === model);
};

/**
 * Ottieni conteggio totale prodotti
 */
export const getTotalProductsCount = () => {
  return allProducts2026.length;
};

/**
 * Ottieni prodotti residenziali
 */
export const getResidentialProducts = () => {
  return allProducts2026.filter(p => 
    p.category === 'Etherea' || 
    p.category === 'TZ' || 
    p.category === 'Console'
  );
};

/**
 * Ottieni prodotti commerciali
 */
export const getCommercialProducts = () => {
  return allProducts2026.filter(p => 
    p.category === 'PACi NX'
  );
};

/**
 * Ottieni prodotti per fascia di potenza
 */
export const getProductsByPower = (minPower: number, maxPower: number) => {
  return allProducts2026.filter(p => 
    p.power >= minPower && p.power <= maxPower
  );
};

/**
 * Ottieni prodotti per tipo
 */
export const getProductsByType = (type: string) => {
  return allProducts2026.filter(p => p.type === type);
};

/**
 * Ottieni statistiche prodotti
 */
export const getProductStats = () => {
  const stats = {
    total: allProducts2026.length,
    byBrand: {
      panasonic: allProducts2026.filter(p => p.brand === 'Panasonic').length,
      tcl: allProducts2026.filter(p => p.brand === 'TCL').length
    },
    byCategory: {
      etherea: allProducts2026.filter(p => p.category === 'Etherea').length,
      tz: allProducts2026.filter(p => p.category === 'TZ').length,
      console: allProducts2026.filter(p => p.category === 'Console').length,
      paciNX: allProducts2026.filter(p => p.category === 'PACi NX').length,
      breezein: allProducts2026.filter(p => p.subcategory === 'BreezeIN').length
    },
    byType: {
      split: allProducts2026.filter(p => p.type === 'split').length,
      wall: allProducts2026.filter(p => p.type === 'wall').length,
      cassette: allProducts2026.filter(p => p.type === 'cassette').length,
      ceiling: allProducts2026.filter(p => p.type === 'ceiling').length,
      ducted: allProducts2026.filter(p => p.type === 'ducted').length,
      floor: allProducts2026.filter(p => p.type === 'floor').length,
      jet: allProducts2026.filter(p => p.type === 'jet').length
    },
    priceRange: {
      min: Math.min(...allProducts2026.map(p => p.price)),
      max: Math.max(...allProducts2026.map(p => p.price)),
      average: allProducts2026.reduce((sum, p) => sum + p.price, 0) / allProducts2026.length
    },
    powerRange: {
      min: Math.min(...allProducts2026.map(p => p.power)),
      max: Math.max(...allProducts2026.map(p => p.power)),
      average: allProducts2026.reduce((sum, p) => sum + p.power, 0) / allProducts2026.length
    }
  };
  
  return stats;
};

// ===== EXPORT CATEGORIE PRINCIPALI =====

// Residenziale Panasonic
export const residentialPanasonic = panasonicResidential2026;

// Commerciale Panasonic
export const commercialPanasonic = panasonicCommercial2026;

// TCL
export const tclProducts = tclProducts2026;

// Export default
export default allProducts2026;
