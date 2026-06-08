# Spotify Stats Dashboard

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SyrymAbdikhan/spotify-stats)

A client-side Spotify statistics dashboard built with Vue 3, showing your top artists, top tracks, and listening history. Powered by the Spotify Web API with OAuth 2.0 PKCE flow (no backend required).

## Features

- **OAuth 2.0 PKCE** — secure client-only auth, no backend, no secrets
- **Overview dashboard** — top 5 artists, top 5 tracks, recently played
- **Top Artists** — top 50 artists with 3 time-range filters
- **Top Tracks** — top 50 tracks with same 3 time-range filters
- **Recently Played** — last 50 tracks with timestamps
- **Artist Detail** — your top tracks of specific artist
- **Skeleton loaders** on all async data
- **Dark theme** with Spotify green accents, fully responsive

## Tech Stack

- [Vue 3](https://vuejs.org/) (Composition API)
- [Pinia](https://pinia.vuejs.org/) — state management with caching
- [Vue Router 5](https://router.vuejs.org/) — protected routes
- [Vite 8](https://vitejs.dev/) — build tool
- [Tailwind CSS v4](https://tailwindcss.com/) — styling

## Local Setup

### 1. Register a Spotify App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **Create app**
3. Fill in any name/description
4. Set **Redirect URI** to `http://localhost:5173/callback`
5. Select **Web API** under APIs used
6. Copy your **Client ID**

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy to Vercel

1. [Fork this repo](https://github.com/SyrymAbdikhan/spotify-stats/fork)
2. Import on [vercel.com/new](https://vercel.com/new)
3. Add environment variables in the Vercel dashboard:
   - `VITE_SPOTIFY_CLIENT_ID` — your Spotify Client ID
   - `VITE_SPOTIFY_REDIRECT_URI` — e.g. `https://your-app.vercel.app/callback`
4. Add the production redirect URI to your Spotify app's **Redirect URIs**
5. Deploy

The `vercel.json` SPA rewrite is already included so deep links work correctly.

## Project Structure

```
src/
├── assets/         # Global CSS (Tailwind entry)
├── components/     # Shared UI components + icons
├── router/         # Vue Router with auth guards
├── stores/
│   ├── auth.js     # PKCE flow, token storage, Spotify API helper
│   └── stats.js    # Top artists/tracks/recent, audio features, caching
├── utils/
│   └── pkce.js     # Code verifier, challenge, state generators
└── views/          # Route-level page components
```
