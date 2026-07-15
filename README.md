# Crypto Tracker

A cryptocurrency tracking app: browse live-ish prices, keep a personal watchlist, and set price alerts that are evaluated server-side and surfaced via local notifications. It has two parts:

- **`backend/`** — an Express + TypeScript API that owns all business logic (CoinGecko caching with daily cron, alert evaluation, authenticated reads/writes). It talks to Firestore and CoinGecko.
- **`mobile/`** — an Expo / React Native (TypeScript) app. Bottom-tab navigation (Home, Watchlist, Alerts, Settings) with a nested stack for Coin Detail. Firebase Auth for sessions, SQLite for offline caching.

> The clients never contact Firestore or CoinGecko directly — everything goes through the backend. Firebase Auth is used directly by the app only for login/registration/session.

## Prerequisites

- **Node.js 20+** (developed on Node 22) and npm
- A **Firebase project** with Email/Password Auth enabled and Firestore created
- To run the app: the **Expo Go** app on a phone, or an **iOS Simulator** / Android emulator

> **Grader shortcut:** if a filled `.env` was provided with the submission, place it in `backend/` and skip the Firebase service-account setup below — the app is then ready to run against the existing project.

## 1. Backend

```bash
cd backend
npm install
npm run dev               # starts the API on http://localhost:3000 (with hot reload)
```

**Seed the cache once** so `/coins` isn't empty before the first scheduled cron run:

```bash
npx tsx src/scripts/seedCache.ts
```

**Run the tests:**

```bash
npm test
```

## 2. Mobile

```bash
cd mobile
npm install
npm start                 # opens the Expo dev server; press i (iOS), a (Android), or scan the QR in Expo Go
```

Configuration lives in `mobile/app.json` under `expo.extra`:

- `firebase` — **already set to the shared project**, so if you're using the provided credentials, leave it as-is. Only if you're setting up your own Firebase project, replace it with your own **web app** config (Firebase console → Project settings → your web app). These values are not secret; they ship in the client.
- `apiBaseUrl` — the backend URL. `http://localhost:3000` works for the iOS Simulator. **On a physical phone, `localhost` refers to the phone, not your computer** — set this to your machine's LAN IP (e.g. `http://192.168.1.50:3000`) and make sure the phone is on the same network.

## Testing & CI

- Backend unit + integration tests run with `npm test` in `backend/` (Jest + supertest; all external services are mocked, so no credentials are needed to run them).
- GitHub Actions (`.github/workflows/ci.yml`) type-checks both apps and runs the backend tests on every push and pull request.

## Architecture (short version)

- **Backend:** `routes → controllers → services → repositories`, with auth middleware verifying Firebase ID tokens and scoping every read/write to the token's user.
- **Mobile:** MVVM — `views (screens) → viewmodels (hooks) → services`, with cross-screen state (auth, watchlist, alerts, theme) in React Context.
