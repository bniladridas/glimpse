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

When `GEMINI_API_KEY` or `VESPER_GEMINI_API_KEY` is set, the workflow drafts quiet prerelease notes from recent commits. Set `GEMINI_RELEASE_MODEL` to override the default `gemini-3.5-flash` model; `gemini-2.5-flash` is the recommended override for structured release notes. Incomplete generated summaries fall back to a static note. The release body does not repeat asset filenames because GitHub lists uploaded assets separately.

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

Do not add service role keys, OAuth client secrets, signing passwords, or keystores as plain files.
