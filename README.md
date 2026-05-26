# glimpse

[![web](https://img.shields.io/badge/web-app-64748b?style=flat-square)](https://glimpsehosting.vercel.app)
[![macos](https://img.shields.io/badge/macos-app-737373?style=flat-square)](runbooks/macos-desktop.md)
[![android](https://img.shields.io/badge/android-app-5f7661?style=flat-square)](runbooks/android.md)

<br>

<p align="center">
  <img src="docs/assets/glimpse-desktop-app.png" alt="glimpse macos app" width="86%">
</p>

<br>

logo symbols.

## app

[`glimpsehosting.vercel.app`](https://glimpsehosting.vercel.app)

## use

glimpse creates simple marks from icons, shapes, text, and images.

settings stay on the client. exported svg text is copied from the editor.

## exports

```jsx
import { Workflow } from "lucide-react";

<Workflow size={24} strokeWidth={1.5} />
```

```rust
pub const WORKFLOW_ICON: &str = r##"<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>"##;
```

```kotlin
const val WORKFLOW_SVG_ASSET = """
<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>
""".trimIndent()
```

```dart
const String workflowIconSvg = r'''<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>''';
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

## security

do not commit secrets.

local values belong in `.env`. deployment values belong in vercel or github actions secrets.

## license

apache-2.0.
