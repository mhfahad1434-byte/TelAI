package org.telegram.ai.agent.core.security

object SecretRedactor {
    private val API_KEY_PATTERNS = listOf(
        Regex("AIza[0-9A-Za-z-_]{35}"), // Google API key
        Regex("sk-[a-zA-Z0-9_-]{32,}"), // OpenAI-style key
        Regex("Bearer\\s+[a-zA-Z0-9._-]+", RegexOption.IGNORE_CASE)
    )

    /**
     * Replaces detected API keys, passwords, and tokens with masked placeholder.
     */
    fun redact(text: String): String {
        var result = text
        for (pattern in API_KEY_PATTERNS) {
            result = result.replace(pattern) { matchResult ->
                val str = matchResult.value
                if (str.length <= 8) "••••••••"
                else "${str.take(4)}••••••••${str.takeLast(4)}"
            }
        }
        return result
    }

    /**
     * Formats API key for UI display (e.g. AIza••••••••9xQ1).
     */
    fun maskKeyForDisplay(key: String): String {
        if (key.length <= 8) return "••••••••"
        return "${key.take(4)}••••••••${key.takeLast(4)}"
    }
}
