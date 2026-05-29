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

Uses Gemini to draft quiet prerelease notes from recent commits when `GEMINI_API_KEY` or `VESPER_GEMINI_API_KEY` is set. Falls back to a static body when no key is configured or the generated summary is incomplete.

Refreshes the marked nightly note in `README.md` after the prerelease is published, using the release note summary and model.

The release page already lists uploaded assets, so the generated body does not repeat asset filenames.

If `GLIMPSE_APP_CLIENT_ID` and `GLIMPSE_APP_PRIVATE_KEY` are set, the publish job uses a GitHub App installation token for the moving tag, prerelease, and README nightly note commit. `GLIMPSE_APP_ID` is kept as a fallback. If neither app secret pair is set, it uses the default Actions token.

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
GEMINI_API_KEY
```

Optional repository variable:

```text
GEMINI_RELEASE_MODEL
```

Optional GitHub App secrets:

```text
GLIMPSE_APP_CLIENT_ID
GLIMPSE_APP_ID
GLIMPSE_APP_PRIVATE_KEY
```

Use `GLIMPSE_APP_CLIENT_ID` for new setup. `GLIMPSE_APP_ID` is only a fallback for older configuration. The GitHub App needs repository contents read and write access and must be installed on this repository. Do not commit the private key.

Default:

```text
gemini-3.5-flash
```

## `triage.yml`

Runs on issues, pull requests, a manual run, and every day at 02:35 UTC.

Uses the GitHub App token when `GLIMPSE_APP_CLIENT_ID` and `GLIMPSE_APP_PRIVATE_KEY` are set. `GLIMPSE_APP_ID` is kept as a fallback. Otherwise it uses the default Actions token.

It can:

```text
create missing labels
label issues and pull requests
create a linked issue for a pull request
fix escaped markdown line breaks in issue and pull request bodies
mark stale issues and pull requests
close stale issues and pull requests after no new activity
close duplicate issues and pull requests when the normalized title matches an older open item
```

When `GEMINI_API_KEY` or `VESPER_GEMINI_API_KEY` is set, linked PR issues are drafted with Gemini. Without a key, the workflow creates a short fallback issue.

Optional repository variable:

```text
GEMINI_TRIAGE_MODEL
```

Default:

```text
gemini-3.5-flash
```

Workflow permissions:

```text
contents: read
issues: write
pull-requests: write
```

GitHub App repository permissions:

```text
Contents: Read and write
Issues: Read and write
Pull requests: Read and write
Metadata: Read-only
```

`Contents: Read and write` is needed when the same GitHub App also publishes the nightly release.

## Release tags

Use version tags for release uploads.

```bash
git tag v0.0.0
git push origin v0.0.0
```

## Secrets

Do not store secret values in workflow files.

Use GitHub repository secrets for deployment values. Do not commit service role keys, Google OAuth client secrets, signing passwords, keystores, access tokens, refresh tokens, or provider tokens.
