# Releases

## macOS

Workflow:

```text
.github/workflows/release-macos.yml
```

Manual run:

```text
Actions > Release macOS DMG > Run workflow
```

Tag release:

```bash
git tag v0.0.0
git push origin v0.0.0
```

Artifact:

```text
release/*.dmg
```

## Android

Workflow:

```text
.github/workflows/release-android.yml
```

Manual run:

```text
Actions > Release Android APK > Run workflow
```

Tag release:

```bash
git tag v0.0.0
git push origin v0.0.0
```

Artifact:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Nightly

Workflow:

```text
.github/workflows/nightly.yml
```

Schedule:

```text
daily at 02:20 UTC
```

Prerelease:

```text
nightly
```

After publishing, the workflow refreshes the marked nightly note in `README.md` with the release note summary and model.

When `GEMINI_API_KEY` or `VESPER_GEMINI_API_KEY` is set, the workflow drafts quiet prerelease notes from recent commits. Set `GEMINI_RELEASE_MODEL` to override the default `gemini-3.5-flash` model. Incomplete generated summaries fall back to a static note. The release body does not repeat asset filenames because GitHub lists uploaded assets separately.

When `GLIMPSE_APP_CLIENT_ID` and `GLIMPSE_APP_PRIVATE_KEY` are set, the publish job uses a GitHub App installation token for the nightly tag, prerelease, and README commit. `GLIMPSE_APP_ID` is kept as a fallback. Without an app secret pair, it uses the default Actions token.

Assets:

```text
glimpse-web-nightly.zip
glimpse-macos-nightly.dmg
glimpse-android-nightly.apk
```

## GitHub secrets

Set these repository secrets:

```bash
VITE_SUPABASE_URL=https://<supabase-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_SUPABASE_DESKTOP_REDIRECT_URL=glimpse://auth/callback
VITE_SUPABASE_ANDROID_REDIRECT_URL=com.niladridas.glimpse://auth/callback
```

Optional GitHub App secrets:

```bash
GLIMPSE_APP_CLIENT_ID=<github-app-client-id>
GLIMPSE_APP_ID=<github-app-id>
GLIMPSE_APP_PRIVATE_KEY=<github-app-private-key>
```

Use `GLIMPSE_APP_CLIENT_ID` for new setup. `GLIMPSE_APP_ID` is only a fallback for older configuration. The GitHub App needs repository contents read and write access and must be installed on this repository.

Do not add service role keys, OAuth client secrets, signing passwords, keystores, or GitHub App private keys as plain files.

## Triage app

Workflow:

```text
.github/workflows/triage.yml
```

Schedule:

```text
daily at 02:35 UTC
```

The workflow labels issues and pull requests, marks stale work, closes stale work after no new activity, and closes duplicates when another open item has the same normalized title.

GitHub App repository permissions:

```text
Contents: Read and write
Issues: Read and write
Pull requests: Read and write
Metadata: Read-only
```

`Contents: Read and write` is needed because the same app also publishes the nightly release.
