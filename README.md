<p align="center">
  <img src="docs/assets/glimpse-desktop-app.png" alt="glimpse macos app" width="80%">
</p>

# glimpse

[![web](https://img.shields.io/badge/web-app-64748b?style=flat-square)](https://glimpsehosting.vercel.app)
[![macos](https://img.shields.io/badge/macos-app-737373?style=flat-square)](runbooks/macos-desktop.md)
[![android](https://img.shields.io/badge/android-app-5f7661?style=flat-square)](runbooks/android.md)

glimpse creates simple marks from icons, shapes, text, and images.

recent updates: browser symbols, quieter symbol browsing, rust export output, and app builds for web, macos, and android.

<!-- nightly:start -->
nightly: pending first prerelease with web, macos, and android assets.
<!-- nightly:end -->

## exports

```jsx
import { Workflow } from "lucide-react";

<Workflow size={24} strokeWidth={1.5} />
```

## notes

| area | file |
| --- | --- |
| setup | [`runbooks/local-setup.md`](runbooks/local-setup.md) |
| auth | [`runbooks/supabase-google-auth.md`](runbooks/supabase-google-auth.md) |
| desktop | [`runbooks/macos-desktop.md`](runbooks/macos-desktop.md) |
| android | [`runbooks/android.md`](runbooks/android.md) |
| release | [`runbooks/releases.md`](runbooks/releases.md) |
| commits | [`runbooks/commits.md`](runbooks/commits.md) |

## license

apache-2.0.
