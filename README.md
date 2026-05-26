<p align="center">
  <img src="docs/assets/glimpse-desktop-app.png" alt="glimpse macos app" width="76%">
</p>

# glimpse

[![web](https://img.shields.io/badge/web-app-64748b?style=flat-square)](https://glimpsehosting.vercel.app)
[![macos](https://img.shields.io/badge/macos-app-737373?style=flat-square)](runbooks/macos-desktop.md)
[![android](https://img.shields.io/badge/android-app-5f7661?style=flat-square)](runbooks/android.md)

glimpse creates simple marks from icons, shapes, text, and images.

<!-- nightly:start -->
nightly: [2026-05-26](https://github.com/bniladridas/glimpse/releases/tag/nightly) · `d89e10d` · gemini-3.5-flash
note: this nightly build includes a minor update to the release scripting.
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
