# GLIMPSE

Glimpse is an application for creating logos and compositions of shapes, icons, and text.

It provides a canvas where you can choose an icon, set text, and customize fonts, weights, colors, and sizes. The icon catalog is stored in a panel on the side that can be toggled open to let you search and filter symbols by categories like mobile, computer, academic, and corporate layouts.

You can copy the underlying React or SVG source code of the active icon directly to your clipboard to use in other developments.

For reference, the copied React code imports the selected icon component from `lucide-react` and renders it as an SVG icon. For example:

```jsx
import { NodeTree } from 'lucide-react';

<NodeTree size={24} strokeWidth={1.5} />
```

In this snippet:
- `NodeTree` is a React component for a node/tree-style icon.
- `size={24}` makes the icon 24px wide and tall.
- `strokeWidth={1.5}` makes the SVG line thickness thinner than the default, which is usually 2.

This yields a 24px NodeTree icon with a 1.5px outline stroke.

For other programming environments, Glimpse provides raw SVG string exports.

### Rust SVG Representation

```rust
pub const NODE_TREE_ICON: &str = r##"<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>"##;
```

In this snippet:
- `pub const` makes the icon a public compile-time constant.
- `&str` represents a string slice.
- `r##"..."##` is a raw string literal, avoiding manual escaping of double quotes in the SVG.
- Dimensions (`width="24" height="24"`) and lines match the active canvas editor state.

### Kotlin (Jetpack Compose) SVG Representation

```kotlin
const val NODE_TREE_SVG_ASSET = """
<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>
""".trimIndent()
```

In this snippet:
- `const val` declares a compile-time constant string.
- Triple-quotes `""" ... """` define a raw multiline string representation, preventing quotes from breaking the compilation.
- `.trimIndent()` removes leading spacer characters and formats formatting alignment.

### Dart (Flutter) SVG Representation

```dart
const String nodeTreeIconSvg = r'''<svg viewBox="0 0 24 24" width="24" height="24" stroke="#fafaf9" fill="none" stroke-width="1.5">...</svg>''';
```

In this snippet:
- `const String` declares a compile-time constant string value.
- `r'''...'''` defines a raw multiline string literal supporting unmatched quotes.
- The exported SVG can be rendered in Flutter using packages like `flutter_svg`:
  ```dart
  SvgPicture.string(
    nodeTreeIconSvg,
    width: 24,
    height: 24,
  )
  ```

The application has three color modes: light, dark, and grey. You can toggle background transparency to export images with a clear background. The resulting graphics can be downloaded directly from the browser. Glimpse is built with React, Vite, and Tailwind CSS and runs entirely in the client browser with no external database requirements.

## License

This software is licensed under the Apache License, Version 2.0 (the "License"). You may not use this software except in compliance with the License. You can obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License for the specific language governing permissions and regulations.

## Security

This application runs entirely in your local browser environment. All icon data, custom styles, scale levels, and custom layout states are handled client-side. No remote servers receive, process, or store your configuration options or exported SVG streams.

To report security vulnerabilities or concerns, please open a private security advisory or file a draft security report directly through the repository platform hosting this project. To maintain user safety, do not publish exploit methods or code publicly before a resolution is released.

## Contributing

External contributors should raise an issue using the [`issue_proposal.yml`](.github/ISSUE_TEMPLATE/issue_proposal.yml) template or submit a formal design proposal before making functional modifications or submitting pull requests. This ensures alignment with the project's minimal aesthetic. Discussions regarding new features or enhancements must occur first in these issues to keep the codebase focused and avoid uncoordinated updates. Code submissions must adhere to the established typescript and linting guidelines and are reviewed according to repository assignments in [`CODEOWNERS`](.github/CODEOWNERS).

## Development and Compilation Requirements

To compile and execute this application locally, you must have Node.js (version 18 or higher) and npm installed on your system. The build pipeline compiles the frontend assets via Vite and packs the custom backend server into a single CJS bundle using esbuild, as defined in [`build-and-lint.yml`](.github/workflows/build-and-lint.yml).

For local development inside Visual Studio Code (VS Code), we recommend using the standard workspace configuration. It is expected that you have the official Tailwind CSS IntelliSense and TypeScript extension packs enabled to support auto-completions and type-safety diagnostics. Code formatting should be handled automatically before committing to maintain consistent code spacing and styling. Run `npm run lint` regularly to verify the codebase contains no syntax errors or type discrepancies.
