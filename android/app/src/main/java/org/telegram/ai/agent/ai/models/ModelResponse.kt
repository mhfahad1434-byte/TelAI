package org.telegram.ai.agent.ai.models

data class ModelMessage(
    val role: String, // "system", "user", "assistant"
    val content: String
)

data class ModelUsage(
    val promptTokens: Int = 0,
    val completionTokens: Int = 0,
    val totalTokens: Int = 0
)

data class ModelResponse(
    val text: String,
    val finishReason: String? = null,
    val usage: ModelUsage? = null,
    val rawJson: String? = null,
    val latencyMs: Long = 0L
)

sealed class ConnectionTestResult {
    data class Success(
        val message: String,
        val latencyMs: Long,
        val detectedModel: String
    ) : ConnectionTestResult()

    data class Failure(
        val errorMessage: String,
        val httpCode: Int? = null,
        val isAuthError: Boolean = false
    ) : ConnectionTestResult()
}
