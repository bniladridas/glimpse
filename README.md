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

The application has three color modes: light, dark, and grey. You can toggle background transparency to export images with a clear background. The resulting graphics can be downloaded directly from the browser. Glimpse is built with React, Vite, and Tailwind CSS and runs entirely in the client browser with no external database requirements.
