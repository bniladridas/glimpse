# GLIMPSE

Glimpse is an application for creating logos and compositions from shapes, icons, text, and isolated images.

It provides a canvas for choosing an icon, setting text, adjusting fonts, weights, colors, and sizes, then exporting the result. The icon panel can be opened when needed to search and filter symbols by category.

The same codebase can run on the web, as a macOS desktop app, and as an Android app. The web surface is built with React, Vite, and Tailwind CSS. Supabase Auth handles Google sign-in. Electron packages the macOS app, and Capacitor packages the Android app.

Glimpse keeps the editing flow local to the client. Logo settings, image cleanup work, canvas state, and exported SVG strings are not sent to a custom application server.

<br>

## App

Web: [`https://glimpsehosting.vercel.app`](https://glimpsehosting.vercel.app)

<br>

<details>
<summary>media</summary>

<br>

| Hosted app |
| --- |
| [![Open on Vercel](https://img.shields.io/badge/vercel-open%20app-000000?logo=vercel&logoColor=white)](https://glimpsehosting.vercel.app) |

<br>

| Web |
| --- |
| <img src="docs/assets/glimpse-web-app.png?v=2026-05-24-0526" alt="Glimpse web app preview" width="920"> |

<br>

| Desktop |
| --- |
| <img src="docs/assets/glimpse-desktop-app.png?v=2026-05-24-0526" alt="Glimpse desktop app preview" width="920"> |

<br>

| Mobile |
| --- |
| <img src="docs/assets/glimpse-mobile-app.png?v=2026-05-24-0526" alt="Glimpse mobile app preview" width="320"> |

</details>

<br>
<br>

## Syntax Exports

Glimpse can copy the active icon as React syntax or as raw SVG text for other environments.

React:

```jsx
import { Workflow } from 'lucide-react';

<Workflow size={24} strokeWidth={1.5} />
```

Rust:

```rust
pub const WORKFLOW_ICON: &str = r##"<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>"##;
```

Kotlin:

```kotlin
const val WORKFLOW_SVG_ASSET = """
<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>
""".trimIndent()
```

Dart:

```dart
const String workflowIconSvg = r'''<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>''';
```

<br>

## Runbooks

Setup and release notes live in runbooks so this page can stay short.

| Area | Runbook |
| --- | --- |
| Local setup | [`runbooks/local-setup.md`](runbooks/local-setup.md) |
| Supabase Google auth | [`runbooks/supabase-google-auth.md`](runbooks/supabase-google-auth.md) |
| macOS desktop build | [`runbooks/macos-desktop.md`](runbooks/macos-desktop.md) |
| Android build | [`runbooks/android.md`](runbooks/android.md) |
| Release workflows | [`runbooks/releases.md`](runbooks/releases.md) |
| Commit messages | [`runbooks/commits.md`](runbooks/commits.md) |

<br>

## Security

Do not commit secrets. Local values belong in `.env`, deployment values belong in Vercel or GitHub Actions secrets, and the repository should only keep placeholders in `.env.example`.

The public Supabase anon key and redirect URL examples can be documented. Supabase service role keys, Google OAuth client secrets, access tokens, refresh tokens, provider tokens, signing keys, keystores, and passwords should stay out of the repo.

More detail is in [`SECURITY.md`](SECURITY.md) and [`runbooks/supabase-google-auth.md`](runbooks/supabase-google-auth.md).

<br>

## License

Apache License, Version 2.0.

Copyright 2026 Niladri Das.
