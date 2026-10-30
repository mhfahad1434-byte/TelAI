# Telegram TDLib JNI Libraries

This directory holds the prebuilt official native TDLib shared libraries (`libtdjni.so`) for Android architectures:
- `arm64-v8a/libtdjni.so` (Standard modern 64-bit Android phones, e.g., Pixel, Samsung Galaxy S/Z/A series)
- `armeabi-v7a/libtdjni.so` (32-bit ARM legacy devices)
- `x86_64/libtdjni.so` (Android Studio Virtual Devices / Emulators on x86_64 PCs)

### Where to get precompiled libtdjni.so:
1. Download from official Telegram TDLib GitHub releases:
   `https://github.com/tdlib/td/releases`
2. Or use prebuilt TDLib binaries from community Gradle repository:
   `https://github.com/drinkless/td`
3. If no `.so` file is placed here, TelAI includes a pure-Kotlin network MTProto and TDLib JSON interface fallback so the APK compiles and runs on any Android phone without crash.
