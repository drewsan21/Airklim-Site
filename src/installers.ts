/**
 * AIRKLIM Installer Network
 * ---------------------------------------------------------------------------
 * The certified HVAC installer network used to automatically connect
 * Individual (privato) customers with the BEST MATCHING installer when they
 * make a purchase. Matching is based on location / proximity (haversine
 * distance) plus certification level and rating.
 *
 * Businesses (installers) that sign up through the "Business" registration
 * flow are added to this same network at runtime (localStorage), so the
 * matching engine takes newly-registered installers into account too.
 */

export interface InstallerProfile {
  id: string;
  name: string;              // company / business name
  contactName?: string;      // referente aziendale
  city: string;
  province: string;          // e.g. "PA"
  lat: number;
  lng: number;
  phone: string;
  email: string;
  certified: boolean;        // Panasonic PRO Partner / DM 37/08 certified
  rating: number;            // 0..5
  jobs: number;              // completed installs
  specialties: string[];     // e.g. ['Split residenziali', 'VRF commerciali']
  serviceRadiusKm: number;
  vatNumber?: string;
  image?: string;
}

// ===== SICILY INSTALLER NETWORK (seed data) =====
export const seedInstallers: InstallerProfile[] = [
  {
    id: 'inst-airklim-carini', name: 'AIRKLIM PRO Partner', city: 'Carini', province: 'PA',
    lat: 38.140, lng: 13.033, phone: '+39 091 8691680', email: 'installazioni@airklim.it',
    certified: true, rating: 4.9, jobs: 412, specialties: ['Split residenziali', 'Pompe di calore Aquarea', 'Multi-Split'],
    serviceRadiusKm: 80,
  },
  {
    id: 'inst-climatech-palermo', name: 'ClimaTech Solutions', city: 'Palermo', province: 'PA',
    lat: 38.118, lng: 13.359, phone: '+39 091 1234567', email: 'info@climatechpa.it',
    certified: true, rating: 4.8, jobs: 287, specialties: ['Split residenziali', 'Canalizzati'],
    serviceRadiusKm: 60,
  },
  {
    id: 'inst-thermosystem-catania', name: 'ThermoSystem Srl', city: 'Catania', province: 'CT',
    lat: 37.499, lng: 15.092, phone: '+39 095 7654321', email: 'tecnico@thermosystemct.it',
    certified: true, rating: 4.7, jobs: 331, specialties: ['Pompe di calore', 'VRF commerciali', 'Manutenzione'],
    serviceRadiusKm: 70,
  },
  {
    id: 'inst-ecoclima-messina', name: 'EcoClima Messina', city: 'Messina', province: 'ME',
    lat: 38.189, lng: 15.563, phone: '+39 090 9876543', email: 'contatti@ecoclimame.it',
    certified: false, rating: 4.5, jobs: 158, specialties: ['Split residenziali', 'TCL BreezeIN'],
    serviceRadiusKm: 50,
  },
  {
    id: 'inst-frigo-trapani', name: 'Frigotecnica Trapani', city: 'Trapani', province: 'TP',
    lat: 38.018, lng: 12.526, phone: '+39 0923 555112', email: 'info@frigotecnica-tp.it',
    certified: true, rating: 4.6, jobs: 121, specialties: ['Commerciale PACi', 'Cassettone'],
    serviceRadiusKm: 55,
  },
  {
    id: 'inst-clima.siracusa', name: 'ClimaService Siracusa', city: 'Siracusa', province: 'SR',
    lat: 37.075, lng: 15.286, phone: '+39 0931 447722', email: 'work@climaservicesr.it',
    certified: true, rating: 4.8, jobs: 203, specialties: ['Pompe di calore', 'Riscaldamento a pavimento'],
    serviceRadiusKm: 60,
  },
  {
    id: 'inst-agrigento-caldo', name: 'CaldoFreddo Agrigento', city: 'Agrigento', province: 'AG',
    lat: 37.302, lng: 13.586, phone: '+39 0922 138845', email: 'info@caldofreddoag.it',
    certified: false, rating: 4.4, jobs: 96, specialties: ['Split residenziali', 'Deumidificazione'],
    serviceRadiusKm: 45,
  },
  {
    id: 'inst-ragusa-hvac', name: 'Iblea Clima Ragusa', city: 'Ragusa', province: 'RG',
    lat: 36.925, lng: 14.725, phone: '+39 0932 661177', email: 'tech@ibleaclima.it',
    certified: true, rating: 4.7, jobs: 145, specialties: ['Multi-Split', 'Hotel Mode TCL'],
    serviceRadiusKm: 55,
  },
  {
    id: 'inst-caltanissetra', name: 'Nissa Clima', city: 'Caltanissetta', province: 'CL',
    lat: 37.491, lng: 14.064, phone: '+39 0934 225588', email: 'info@nissaclima.it',
    certified: false, rating: 4.3, jobs: 78, specialties: ['Split residenziali', 'Manutenzione'],
    serviceRadiusKm: 45,
  },
  {
    id: 'inst-enna-centro', name: 'Enna Clima Center', city: 'Enna', province: 'EN',
    lat: 37.567, lng: 14.280, phone: '+39 0935 822441', email: 'contatti@ennaclima.it',
    certified: true, rating: 4.6, jobs: 112, specialties: ['Pompe di calore', 'Riscaldamento'],
    serviceRadiusKm: 50,
  },
];

// Common Sicilian cities -> coordinates (used for proximity matching from a typed city)
export const sicilyCities: Record<string, { lat: number; lng: number }> = {
  palermo: { lat: 38.118, lng: 13.359 }, trapani: { lat: 38.018, lng: 12.526 },
  marsala: { lat: 37.799, lng: 12.592 }, agrigento: { lat: 37.302, lng: 13.586 },
  caltanissetta: { lat: 37.491, lng: 14.064 }, enna: { lat: 37.567, lng: 14.280 },
  messina: { lat: 38.189, lng: 15.563 }, catania: { lat: 37.499, lng: 15.092 },
  siracusa: { lat: 37.075, lng: 15.286 }, ragusa: { lat: 36.925, lng: 14.725 },
  gela: { lat: 37.071, lng: 14.247 }, mazara: { lat: 37.652, lng: 12.585 },
  bagheria: { lat: 38.086, lng: 13.285 }, monreale: { lat: 38.082, lng: 13.288 },
  carini: { lat: 38.140, lng: 13.033 }, partanna: { lat: 37.908, lng: 12.883 },
  alcamo: { lat: 37.977, lng: 12.967 }, cefalu: { lat: 38.039, lng: 14.021 },
  acireale: { lat: 37.537, lng: 15.171 }, caltagirone: { lat: 37.239, lng: 14.514 },
  vittoria: { lat: 36.992, lng: 14.535 }, modica: { lat: 36.860, lng: 14.770 },
  notaro: { lat: 36.895, lng: 14.956 }, milazzo: { lat: 38.221, lng: 15.234 },
  barcellona: { lat: 38.190, lng: 15.300 }, termini: { lat: 37.989, lng: 14.092 },
  licata: { lat: 37.102, lng: 13.952 }, canicatti: { lat: 37.369, lng: 13.855 },
};

/** Haversine distance in km */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 10) / 10;
}

/** Resolve a free-text city / address into coordinates */
export function geocodeCity(input: string): { lat: number; lng: number; matched: string } | null {
  if (!input) return null;
  const norm = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // direct match on known cities
  for (const key of Object.keys(sicilyCities)) {
    if (norm.includes(key)) return { ...sicilyCities[key], matched: key };
  }
  // province codes
  const provMap: Record<string, keyof typeof sicilyCities> = {
    pa: 'palermo', tp: 'trapani', ag: 'agrigento', cl: 'caltanissetta',
    en: 'enna', me: 'messina', ct: 'catania', sr: 'siracusa', rg: 'ragusa',
  };
  for (const code of Object.keys(provMap)) {
    if (new RegExp(`\\b${code}\\b`).test(norm)) return { ...sicilyCities[provMap[code]], matched: provMap[code] };
  }
  // ZIP fallback — first digit identifies the Sicilian province area
  const zipMatch = norm.match(/\b9[0-5]\d{3}\b/);
  if (zipMatch) {
    const z = zipMatch[0][1];
    const byZip: Record<string, keyof typeof sicilyCities> = {
      '0': 'palermo', '1': 'trapani', '2': 'agrigento', '3': 'caltanissetta',
      '4': 'enna', '5': 'messina', '6': 'catania', '7': 'siracusa', '8': 'ragusa', '9': 'messina',
    };
    const city = byZip[z] || 'palermo';
    return { ...sicilyCities[city], matched: city };
  }
  return null;
}

/** All installers: seed list + any installer businesses registered on this device */
export function getAllInstallers(): InstallerProfile[] {
  let extra: InstallerProfile[] = [];
  try {
    extra = JSON.parse(localStorage.getItem('airklim-installer-network') || '[]');
  } catch {
    extra = [];
  }
  return [...seedInstallers, ...extra];
}

/** Register a verified installer business into the public network */
export function addInstallerToNetwork(installer: InstallerProfile) {
  const all = getAllInstallers();
  if (all.some(i => i.id === installer.id)) return;
  const extra = all.filter(i => !seedInstallers.some(s => s.id === i.id));
  localStorage.setItem('airklim-installer-network', JSON.stringify([...extra, installer]));
}

export interface MatchResult {
  installer: InstallerProfile;
  distanceKm: number;
  score: number;
}

/**
 * Rank installers by best match for a customer location:
 *   score = proximity (60%) + certification (25%) + rating (15%)
 */
export function matchInstallers(location: string, count = 3): MatchResult[] {
  const geo = geocodeCity(location);
  const all = getAllInstallers();
  const results: MatchResult[] = all.map(inst => {
    const dist = geo ? distanceKm(geo, inst) : 999;
    const proximityScore = Math.max(0, 1 - dist / 150);           // closer = better
    const certScore = inst.certified ? 1 : 0.5;
    const ratingScore = inst.rating / 5;
    const score = proximityScore * 0.6 + certScore * 0.25 + ratingScore * 0.15;
    return { installer: inst, distanceKm: dist, score: Math.round(score * 100) };
  });
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, count);
}
