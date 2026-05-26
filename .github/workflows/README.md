# Workflows

## `build-and-lint.yml`

Runs on pushes and pull requests for `main` and `master`.

Steps:

```text
node 22
npm ci
npm run lint
npm run build
```

## `release-macos.yml`

Runs manually or when a `v*` tag is pushed.

Builds:

```text
node 22
release/*.dmg
release/*.dmg.blockmap
release/latest-mac.yml
```

Required GitHub secrets:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_DESKTOP_REDIRECT_URL
```

## `release-android.yml`

Runs manually or when a `v*` tag is pushed.

Builds:

```text
node 22
android/app/build/outputs/apk/debug/app-debug.apk
```

Required GitHub secrets:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_ANDROID_REDIRECT_URL
```

## `nightly.yml`

Runs manually or every day at 02:20 UTC.

Publishes a prerelease on the moving `nightly` tag.

Refreshes the marked nightly note in `README.md` after the prerelease is published.

Builds:

```text
node 22
glimpse-web-nightly.zip
glimpse-macos-nightly.dmg
glimpse-android-nightly.apk
```

Required GitHub secrets:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_DESKTOP_REDIRECT_URL
VITE_SUPABASE_ANDROID_REDIRECT_URL
```

## Release tags

Use version tags for release uploads.

```bash
git tag v0.0.0
git push origin v0.0.0
```

## Secrets

Do not store secret values in workflow files.

Use GitHub repository secrets for deployment values. Do not commit service role keys, Google OAuth client secrets, signing passwords, keystores, access tokens, refresh tokens, or provider tokens.
