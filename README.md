# GLIMPSE

Glimpse is an application for creating logos and compositions of shapes, icons, and text.

It provides a canvas where you can choose an icon, set text, and customize fonts, weights, colors, and sizes. The icon catalog is stored in a panel on the side that can be toggled open to let you search and filter symbols by categories like mobile, computer, academic, corporate, social, and hardware layouts.

You can copy the underlying React or SVG source code of the active icon directly to your clipboard to use in other developments.

For reference, the copied React code imports the selected icon component from `lucide-react` and renders it as an SVG icon. For example:

```jsx
import { Workflow } from 'lucide-react';

<Workflow size={24} strokeWidth={1.5} />
```

In this snippet:
- `Workflow` is a React component for a node/tree connection or workflow-style icon.
- `size={24}` makes the icon 24px wide and tall.
- `strokeWidth={1.5}` makes the SVG line thickness thinner than the default, which is usually 2.

This yields a 24px Workflow icon with a 1.5px outline stroke.

For other programming environments, Glimpse provides raw SVG string exports.

### Rust SVG Representation

```rust
pub const WORKFLOW_ICON: &str = r##"<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>"##;
```

In this snippet:
- `pub const` makes the icon a public compile-time constant.
- `&str` represents a string slice.
- `r##"..."##` is a raw string literal, avoiding manual escaping of double quotes in the SVG.
- Dimensions (`width="24" height="24"`) and lines match the active canvas editor state.

### Kotlin (Jetpack Compose) SVG Representation

```kotlin
const val WORKFLOW_SVG_ASSET = """
<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>
""".trimIndent()
```

In this snippet:
- `const val` declares a compile-time constant string.
- Triple-quotes `""" ... """` define a raw multiline string representation, preventing quotes from breaking the compilation.
- `.trimIndent()` removes leading spacer characters and formats formatting alignment.

### Dart (Flutter) SVG Representation

```dart
const String workflowIconSvg = r'''<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>''';
```

In this snippet:
- `const String` declares a compile-time constant string value.
- `r'''...'''` defines a raw multiline string literal supporting unmatched quotes.
- The exported SVG can be rendered in Flutter using packages like `flutter_svg`:
  ```dart
  SvgPicture.string(
    workflowIconSvg,
    width: 24,
    height: 24,
  )
  ```

The application has three color modes: light, dark, and grey. You can toggle background transparency to export images with a clear background. The resulting graphics can be downloaded directly from the browser. Glimpse is built with React, Vite, Tailwind CSS, and Supabase Auth.

## Supabase Google Authentication

Glimpse uses Supabase Auth to let users sign in with Google before opening the workspace. The browser client reads the Supabase project URL and public anon key from local Vite environment variables.

Create a local `.env` file from `.env.example` and provide:

```bash
VITE_SUPABASE_URL=https://<supabase-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
```

In this configuration:
- `VITE_SUPABASE_URL` points to the Supabase project that owns the auth configuration.
- `VITE_SUPABASE_ANON_KEY` is the public browser key used by `@supabase/supabase-js`.
- The Google sign-in button sends users through Supabase, not directly to a custom backend.

In Google Cloud, create an OAuth client with the application type set to `Web application`. Add the app domains under Authorized JavaScript origins using this syntax:

```text
http://<local-host>:<local-port>
https://<production-domain>
```

Add the Supabase auth callback URL under Authorized redirect URIs:

```text
https://<supabase-project-ref>.supabase.co/auth/v1/callback
```

This redirect URI is the endpoint Google returns to after the Google account step. Supabase then completes the auth exchange and returns the user to the app.

In Supabase, enable the Google provider under Authentication > Providers and paste the Google client ID and client secret. In Authentication URL settings, set the local app URL as the Site URL and include both local and production app URLs as allowed redirect URLs:

```text
http://<local-host>:<local-port>
https://<production-domain>
```

## License

This software is licensed under the Apache License, Version 2.0 (the "License"). You may not use this software except in compliance with the License. You can obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Copyright 2026 Niladri Das.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License for the specific language governing permissions and regulations.

## Security

Icon data, custom styles, scale levels, layout state, and exported SVG streams are handled client-side in the browser. Authentication is handled by Supabase Auth when Google sign-in is enabled. Glimpse does not send logo configuration options, generated exports, or canvas state to a custom application server.

To report security vulnerabilities or concerns, please open a private security advisory or file a draft security report directly through the repository platform hosting this project. To maintain user safety, do not publish exploit methods or code publicly before a resolution is released.

## Contributing

External contributors should raise an issue using the [`issue_proposal.yml`](.github/ISSUE_TEMPLATE/issue_proposal.yml) template or submit a formal design proposal before making functional modifications or submitting pull requests. This ensures alignment with the project's minimal aesthetic. Discussions regarding new features or enhancements must occur first in these issues to keep the codebase focused and avoid uncoordinated updates. Code submissions must adhere to the established typescript and linting guidelines and are reviewed according to repository assignments in [`CODEOWNERS`](.github/CODEOWNERS).

## Development and Compilation Requirements

To compile and execute this application locally, you must have Node.js (version 20 or higher) and npm installed on your system. The build pipeline compiles the frontend assets via Vite and packs the custom backend server into a single CJS bundle using esbuild, as defined in [`build-and-lint.yml`](.github/workflows/build-and-lint.yml).

For local development inside Visual Studio Code (VS Code), we recommend using the standard workspace configuration. It is expected that you have the official Tailwind CSS IntelliSense and TypeScript extension packs enabled to support auto-completions and type-safety diagnostics. Code formatting should be handled automatically before committing to maintain consistent code spacing and styling. Run `npm run lint` regularly to verify the codebase contains no syntax errors or type discrepancies.
