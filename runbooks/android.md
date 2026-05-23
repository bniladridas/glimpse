# Android

## Sync project

```bash
npm run android:sync
```

## Open Android Studio

```bash
npm run android:open
```

## Build debug APK

Use JDK 21.

```bash
JAVA_HOME=/opt/homebrew/opt/openjdk@21 npm run android:apk
```

Output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Auth redirect

Supabase redirect URL:

```text
com.niladridas.glimpse://auth/callback
```

Android receives the URL through the intent filter in:

```text
android/app/src/main/AndroidManifest.xml
```

## Distribution

The debug APK is for testing.

For public distribution, create a signed release APK or AAB.

Do not commit signing keystores or passwords.
