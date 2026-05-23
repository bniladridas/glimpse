# Security Policy

## Supported Versions

The project undergoes regular maintenance to address core security vulnerabilities. Only the latest release version is actively supported with security updates.

## Browser Security Architecture

Logo settings, scale adjustments, custom styles, canvas state, and raw vector export flows are kept client-side in the browser. Glimpse does not send SVG definitions, exported string parameters, or design state to a custom application server.

Google sign-in is handled through Supabase Auth. Supabase receives the authentication data required to create and maintain the user session, including provider identity details returned by Google. The browser client uses the public Supabase anon key and PKCE auth flow.

## Reporting a Vulnerability

If you identify a security issue or vulnerability within this application, please do not file a public repository issue. Instead, log into the hosting repository platform and open a private draft security advisory under the security channel. This allows the maintainers to analyze, resolve, and distribute a fix before details are publicly disclosed. Thank you for helping keep the ecosystem secure.
