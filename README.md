# glimpse

[![web](https://img.shields.io/badge/web-app-64748b?style=flat-square)](https://glimpsehosting.vercel.app)
[![macos](https://img.shields.io/badge/macos-app-737373?style=flat-square)](runbooks/macos-desktop.md)
[![android](https://img.shields.io/badge/android-app-5f7661?style=flat-square)](runbooks/android.md)

glimpse creates simple marks from icons, shapes, text, and images.

<br>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/glimpse-dark-app.png">
    <img src="docs/assets/glimpse-light-app.png" alt="glimpse app" width="76%">
  </picture>
</p>

<br>

## open

| target | link |
| --- | --- |
| <img src="docs/assets/icon-web.svg" alt="" width="14"> web | [`open`](https://glimpsehosting.vercel.app) |
| <img src="docs/assets/icon-macos.svg" alt="" width="14"> macos | [`download dmg`](https://github.com/bniladridas/glimpse/releases/download/nightly/glimpse-macos-nightly.dmg) |
| <img src="docs/assets/icon-android.svg" alt="" width="14"> android | [`download apk`](https://github.com/bniladridas/glimpse/releases/download/nightly/glimpse-android-nightly.apk) |

<br>

## facts

| area | note |
| --- | --- |
| network | the web app needs internet.<br>background removal loads model and wasm files from public cdn hosts. |
| runtime | logo state, image work, and exports run in the browser.<br>the app does not add telemetry scripts. |

<br>

<!-- nightly:start -->
nightly: [2026-05-29](https://github.com/bniladridas/glimpse/releases/tag/nightly) · `73061c0` · gemini-2.5-flash
note: nightly app builds were refreshed.
<!-- nightly:end -->

<br>

## exports

```jsx
import { Workflow } from "lucide-react";

<Workflow size={24} strokeWidth={1.5} />
```

<br>

## notes

| area | file |
| --- | --- |
| setup | [`runbooks/local-setup.md`](runbooks/local-setup.md) |
| auth | [`runbooks/supabase-google-auth.md`](runbooks/supabase-google-auth.md) |
| desktop | [`runbooks/macos-desktop.md`](runbooks/macos-desktop.md) |
| android | [`runbooks/android.md`](runbooks/android.md) |
| release | [`runbooks/releases.md`](runbooks/releases.md) |
| commits | [`runbooks/commits.md`](runbooks/commits.md) |

<br>

## license

apache-2.0.
