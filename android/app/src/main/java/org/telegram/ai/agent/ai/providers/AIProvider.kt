package org.telegram.ai.agent.ai.providers

import org.telegram.ai.agent.ai.models.ConnectionTestResult
import org.telegram.ai.agent.ai.models.ModelMessage
import org.telegram.ai.agent.ai.models.ModelProviderConfig
import org.telegram.ai.agent.ai.models.ModelResponse

interface AIProvider {
    val providerId: String
    val config: ModelProviderConfig

    /**
     * Executes a natural-language generation or agent tool-calling prompt.
     */
    suspend fun generateResponse(
        messages: List<ModelMessage>,
        systemInstruction: String? = null
    ): Result<ModelResponse>

    /**
     * Verifies that the endpoint, credentials and model identifier are valid
     * without exposing secrets or returning fake responses.
     */
    suspend fun testConnection(): ConnectionTestResult
}
