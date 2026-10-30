# TelAI — Android Installation & Build Guide

## Overview
TelAI is a native Android application built with Kotlin, Jetpack Compose, Material 3, and Telegram TDLib.

---

## Prerequisites
1. **JDK 17** (or higher).
2. **Android Studio Ladybug (2024.2+)** or Android SDK command line tools.
3. **Android NDK** (version 26+ for compiling TDLib native libraries if rebuilding C++ binaries).
4. Physical Android device running **Android 8.0 (API 26)** or higher with Developer Options enabled, or an Android Virtual Device (AVD).

---

## Quick Build Steps

### 1. Clone & Open
```bash
git clone https://github.com/your-org/telegram-ai-personal-agent.git
cd telegram-ai-personal-agent/android
```

### 2. Configure Telegram API Credentials
Generate `api_id` and `api_hash` at [my.telegram.org](https://my.telegram.org).
Create `local.properties` in the `android/` directory:
```properties
sdk.dir=/path/to/your/android-sdk
telegram.api_id=YOUR_API_ID
telegram.api_hash=YOUR_API_HASH
```

### 3. Build Debug APK
```bash
./gradlew assembleDebug
```
Output APK location:
`android/app/build/outputs/apk/debug/app-debug.apk`

### 4. Install via ADB
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### 5. Build Release Signed APK
```bash
./gradlew assembleRelease
```
The APK will be optimized with R8 shrinking and ProGuard rules preserving TDLib JNI bindings.
Output location:
`android/app/build/outputs/apk/release/app-release.apk`
