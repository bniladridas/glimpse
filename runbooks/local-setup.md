# Local setup

## Requirements

- Node.js 20 or newer
- npm

For Android builds:

- Android Studio
- Android SDK
- JDK 21

For macOS desktop builds:

- macOS
- Electron Builder dependencies installed by `npm ci`

## Install

```bash
npm ci
```

## Environment

Create `.env` from `.env.example`.

```bash
cp .env.example .env
```

Set local values in `.env`.

```bash
VITE_SUPABASE_URL=https://<supabase-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_SUPABASE_DESKTOP_REDIRECT_URL=glimpse://auth/callback
VITE_SUPABASE_ANDROID_REDIRECT_URL=com.niladridas.glimpse://auth/callback
```

Do not commit `.env`.

## Web app

```bash
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```
