/**
 * AIRKLIM Installer Network
 * HVAC installers partnered with the distributor, used to automatically
 * match individual customers with the best installer based on location/proximity.
 */

export interface Installer {
  id: string;
  name: string;
  company: string;
  city: string;
  province: string;
  region: string;
  lat: number;
  lon: number;
  phone: string;
  email: string;
  certified: boolean;
  rating: number;          // 0..5
  jobsCompleted: number;
  specializations: string[];
  serviceRadiusKm: number;
  active: boolean;
}

export const installers: Installer[] = [
  {
    id: 'inst-001', name: 'Giuseppe Ferrara', company: 'Airklim PRO Partner',
    city: 'Palermo', province: 'PA', region: 'Sicilia', lat: 38.1157, lon: 13.3615,
    phone: '+39 091 8691680', email: 'palermo@airklim-partners.it', certified: true,
    rating: 4.9, jobsCompleted: 412, specializations: ['Split residenziali', 'Multi-split', 'Pompe di calore'],
    serviceRadiusKm: 40, active: true,
  },
  {
    id: 'inst-002', name: 'Antonio Lo Bianco', company: 'ClimaTech Solutions Srl',
    city: 'Catania', province: 'CT', region: 'Sicilia', lat: 37.5079, lon: 15.0830,
    phone: '+39 095 7654321', email: 'catania@airklim-partners.it', certified: true,
    rating: 4.8, jobsCompleted: 356, specializations: ['Canalizzati', 'PACi commerciali', 'VRF'],
    serviceRadiusKm: 45, active: true,
  },
  {
    id: 'inst-003', name: 'Marco Russo', company: 'ThermoSystem Srl',
    city: 'Messina', province: 'ME', region: 'Sicilia', lat: 38.1938, lon: 15.5540,
    phone: '+39 090 9876543', email: 'messina@airklim-partners.it', certified: true,
    rating: 4.6, jobsCompleted: 198, specializations: ['Split residenziali', 'Riscaldamento'],
    serviceRadiusKm: 35, active: true,
  },
  {
    id: 'inst-004', name: 'Salvatore Greco', company: 'EcoClima Trapani',
    city: 'Trapani', province: 'TP', region: 'Sicilia', lat: 38.0176, lon: 12.5365,
    phone: '+39 0923 445566', email: 'trapani@airklim-partners.it', certified: false,
    rating: 4.4, jobsCompleted: 122, specializations: ['Split residenziali'],
    serviceRadiusKm: 30, active: true,
  },
  {
    id: 'inst-005', name: 'Francesco Costa', company: 'FrigorService Siracusa',
    city: 'Siracusa', province: 'SR', region: 'Sicilia', lat: 37.0755, lon: 15.2866,
    phone: '+39 0931 223344', email: 'siracusa@airklim-partners.it', certified: true,
    rating: 4.7, jobsCompleted: 240, specializations: ['Commerciale', 'Hotel mode', 'Manutenzione'],
    serviceRadiusKm: 40, active: true,
  },
  {
    id: 'inst-006', name: 'Luca Marino', company: 'Climatech Caltanissetta',
    city: 'Caltanissetta', province: 'CL', region: 'Sicilia', lat: 37.4901, lon: 14.0627,
    phone: '+39 0922 556677', email: 'nissa@airklim-partners.it', certified: true,
    rating: 4.5, jobsCompleted: 156, specializations: ['Split', 'Pompe di calore'],
    serviceRadiusKm: 35, active: true,
  },
  {
    id: 'inst-007', name: 'Davide Incarbona', company: 'Sud Clima Agrigento',
    city: 'Agrigento', province: 'AG', region: 'Sicilia', lat: 37.3111, lon: 13.5766,
    phone: '+39 0922 778899', email: 'agrigento@airklim-partners.it', certified: true,
    rating: 4.3, jobsCompleted: 98, specializations: ['Residenziale', 'Detrazioni fiscali'],
    serviceRadiusKm: 30, active: true,
  },
  {
    id: 'inst-008', name: 'Roberto Vaccara', company: 'Ragusa Condizionamenti',
    city: 'Ragusa', province: 'RG', region: 'Sicilia', lat: 36.9250, lon: 14.7167,
    phone: '+39 0932 101010', email: 'ragusa@airklim-partners.it', certified: false,
    rating: 4.2, jobsCompleted: 74, specializations: ['Split residenziali'],
    serviceRadiusKm: 25, active: true,
  },
  {
    id: 'inst-009', name: 'Andrea Ferraro', company: 'Enna Clima Service',
    city: 'Enna', province: 'EN', region: 'Sicilia', lat: 37.5675, lon: 14.2795,
    phone: '+39 0935 202020', email: 'enna@airklim-partners.it', certified: true,
    rating: 4.6, jobsCompleted: 131, specializations: ['Pompe di calore', 'Teleriscaldamento'],
    serviceRadiusKm: 30, active: true,
  },
];

/** Haversine distance in km between two coordinates */
export function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Approximate coordinates from an Italian city/province name (fallback grid for common cities) */
const CITY_COORDS: Record<string, [number, number]> = {
  palermo: [38.1157, 13.3615], trapani: [38.0176, 12.5365], agrigento: [37.3111, 13.5766],
  caltanissetta: [37.4901, 14.0627], enna: [37.5675, 14.2795], catania: [37.5079, 15.0830],
  messina: [38.1938, 15.5540], siracusa: [37.0755, 15.2866], ragusa: [36.9250, 14.7167],
  marsala: [37.7991, 12.5877], gela: [37.0713, 14.2427], bagheria: [38.0876, 13.5550],
  mazara: [37.6579, 12.5850], victor: [37.6497, 15.1631], milazzo: [38.2249, 15.2350],
  calamino: [37.4275, 15.0675], acireale: [37.6189, 15.1339], paterno: [37.4962, 15.0052],
  carini: [38.1700, 13.3500], monreale: [38.0778, 13.2920], termini: [38.0350, 14.0970],
  cerda: [37.5500, 13.7830], corleone: [37.8000, 13.3000], alcamo: [38.0967, 12.4859],
};

export function coordsFromAddress(address: string): [number, number] | null {
  const norm = address.toLowerCase();
  // try known city names
  for (const key of Object.keys(CITY_COORDS)) {
    if (norm.includes(key)) return CITY_COORDS[key];
  }
  // try CAP-based rough mapping (first 3 digits of Sicilian CAPs 90xxx-98xxx)
  const cap = norm.match(/\b(\d{5})\b/);
  if (cap) {
    const p = parseInt(cap[1].slice(0, 2), 10);
    if (p >= 90 && p <= 98) {
      // deterministic pseudo-position around Sicily based on CAP prefix
      const base: [number, number] = [37.5 + (p - 90) * 0.08, 13.5 + (p - 90) * 0.25];
      return base;
    }
  }
  return null;
}

/** Score installers by proximity, certification and rating; returns best matches */
export function findBestInstallers(address: string, maxResults = 3): { installer: Installer; distanceKm: number }[] {
  const coords = coordsFromAddress(address);
  const list = installers.filter(i => i.active);
  const scored = list.map(installer => {
    const dist = coords ? distanceKm(coords[0], coords[1], installer.lat, installer.lon) : 9999;
    // score: lower is better. distance dominant, small bonus for certified & rating
    const score = dist - (installer.certified ? 5 : 0) - installer.rating * 2;
    return { installer, distanceKm: Math.round(dist * 10) / 10, score };
  });
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, maxResults).map(({ installer, distanceKm }) => ({ installer, distanceKm }));
}
