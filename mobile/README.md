# AIRKLIM Mobile (Expo / React Native)

Native companion app for the AIRKLIM HVAC catalog: login against the existing
Express/JWT backend (`server/`) and browse the product catalog.

## Prerequisites
- Node.js 18+
- An iOS simulator / Android emulator, or a physical device with Expo Go

## Setup
```bash
cd mobile
npm install
# start the backend locally first (port 3000), then:
npm start          # Expo dev server (scan QR with Expo Go)
```

The API base URL is configured in `app.json` → `expo.extra.apiUrl`.
For a real device use your LAN IP, e.g. `http://192.168.1.20:3000`.

## Structure
- `src/api/client.ts` – typed fetch wrapper (JWT bearer, login/logout/products/orders)
- `src/screens/LoginScreen.tsx` – email/password auth
- `src/screens/CatalogScreen.tsx` – pull-to-refresh product list
- `src/App.tsx` – navigation + session state

## Scripts
- `npm run typecheck` – TypeScript strict check
- `npm run android` / `npm run ios` / `npm run web`
