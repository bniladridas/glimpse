# macOS desktop

## Run locally

```bash
npm run desktop:dev
```

## Build DMG

```bash
npm run desktop:dmg
```

Output:

```text
release/
```

## Auth redirect

Supabase redirect URL:

```text
glimpse://auth/callback
```

The Electron shell receives that URL and forwards the callback query to the renderer.

## Signing

Local builds use ad-hoc signing.

For public distribution, use Apple Developer signing and notarization.
