# Commit message format

Use this format when a change touches more than one target.

```text
<type>: <short summary>

- web: <what changed>
- desktop: <what changed>
- android: <what changed>
```

Use lowercase in the summary and body.

Examples:

```text
feat: include native app builds

- web: include supabase auth redirect cleanup
- desktop: include dmg packaging and protocol callback handling
- android: include capacitor shell and debug apk workflow
```

```text
fix: align auth callback handling

- web: clean callback query after session exchange
- desktop: forward protocol callback into the renderer
- android: close browser after native auth callback
```
