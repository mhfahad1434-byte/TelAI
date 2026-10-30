package org.telegram.ai.agent.core.design

import androidx.compose.material3.darkColorScheme
import androidx.compose.ui.graphics.Color

// Premium Dark Navy Theme Colors
val DeepNavyBackground = Color(0xFF080C16)
val DeepNavySurface = Color(0xFF0A0E1A)
val CardNavySurface = Color(0xFF0E1528)
val IndigoPrimary = Color(0xFF6366F1)
val IndigoVariant = Color(0xFF4F46E5)
val CyanSecondary = Color(0xFF06B6D4)
val CyanAccent = Color(0xFF38BDF8)
val EmeraldSuccess = Color(0xFF10B981)
val AmberWarning = Color(0xFFF59E0B)
val RedDanger = Color(0xFFEF4444)

val TextPrimary = Color(0xFFF8FAFC)
val TextSecondary = Color(0xFF94A3B8)
val TextTertiary = Color(0xFF64748B)
val BorderSubtle = Color(0xFF1E293B)

val TelAIDarkColorScheme = darkColorScheme(
    primary = IndigoPrimary,
    onPrimary = Color.White,
    primaryContainer = Color(0xFF1E1B4B),
    onPrimaryContainer = Color(0xFFC7D2FE),
    secondary = CyanSecondary,
    onSecondary = Color(0xFF080C16),
    secondaryContainer = Color(0xFF083344),
    onSecondaryContainer = CyanAccent,
    background = DeepNavyBackground,
    onBackground = TextPrimary,
    surface = DeepNavySurface,
    onSurface = TextPrimary,
    surfaceVariant = CardNavySurface,
    onSurfaceVariant = TextSecondary,
    error = RedDanger,
    onError = Color.White,
    outline = BorderSubtle
)
