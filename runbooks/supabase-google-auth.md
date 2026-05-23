# Supabase Google auth

## Repo values

Keep only placeholders in the repo.

```bash
VITE_SUPABASE_URL=https://<supabase-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_SUPABASE_DESKTOP_REDIRECT_URL=glimpse://auth/callback
VITE_SUPABASE_ANDROID_REDIRECT_URL=com.niladridas.glimpse://auth/callback
```

The anon key is public for browser clients. Do not commit service role keys.

## Supabase

Authentication > Sign In / Providers > Google:

```text
client id: <google-oauth-client-id>
client secret: <google-oauth-client-secret>
```

Authentication > URL Configuration > Site URL:

```text
https://<production-domain>
```

Authentication > URL Configuration > Redirect URLs:

```text
http://localhost:3000
http://localhost:3000/
https://<production-domain>
https://<production-domain>/
glimpse://auth/callback
com.niladridas.glimpse://auth/callback
```

## Google Cloud

OAuth client type:

```text
Web application
```

Authorized JavaScript origins:

```text
http://localhost:3000
https://<production-domain>
```

Authorized redirect URIs:

```text
https://<supabase-project-ref>.supabase.co/auth/v1/callback
```

Do not put `glimpse://auth/callback` or `com.niladridas.glimpse://auth/callback` in Google redirect URIs. Google returns to Supabase first. Supabase returns to the app.

## Vercel environment

Set these in Vercel:

```bash
VITE_SUPABASE_URL=https://<supabase-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
```

Desktop and Android redirect env values are only needed in builds that package those targets.
