package org.telegram.ai.agent

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.telegram.ai.agent.core.security.SecretRedactor

class SecretRedactorTest {

    @Test
    fun testMaskKeyForDisplay() {
        val apiKey = "AIzaSyD-DummyGoogleApiKeySample1234"
        val masked = SecretRedactor.maskKeyForDisplay(apiKey)
        assertTrue(masked.startsWith("AIza"))
        assertTrue(masked.endsWith("1234"))
        assertTrue(masked.contains("••••••••"))
        assertFalse(masked.contains("DummyGoogleApiKeySample"))
    }

    @Test
    fun testShortKeyMasking() {
        val shortKey = "secret"
        val masked = SecretRedactor.maskKeyForDisplay(shortKey)
        assertTrue(masked == "••••••••")
    }
}
