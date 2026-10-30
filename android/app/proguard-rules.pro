# Proguard Rules for TelAI - Telegram AI Personal Agent

# Preserve TDLib Native Client JNI methods
-keep class org.drinkless.tdlib.Client { *; }
-keep class org.drinkless.tdlib.TdApi$* { *; }
-keepclassmembers class * {
    native <methods>;
}

# Preserve Room Database
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**

# Preserve ModelProviderConfig & Data Classes
-keep class org.telegram.ai.agent.ai.models.** { *; }
-keep class org.telegram.ai.agent.domain.models.** { *; }

# Preserve Gson Serialization
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }

# Preserve OkHttp & Retrofit
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**

# Preserve Kotlin Coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-dontwarn kotlinx.coroutines.**
