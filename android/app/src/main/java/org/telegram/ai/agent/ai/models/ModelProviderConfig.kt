package org.telegram.ai.agent.ai.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

enum class ProviderType {
    GEMINI_NATIVE,
    OPENAI_COMPATIBLE
}

enum class ApiFormat {
    GEMINI_REST_V1BETA,
    OPENAI_CHAT_COMPLETIONS
}

@Entity(tableName = "model_provider_configs")
data class ModelProviderConfig(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val providerName: String,
    val providerType: ProviderType,
    val displayName: String,
    val baseUrl: String,
    val apiKey: String, // Stored encrypted via Android Keystore
    val modelName: String,
    val apiFormat: ApiFormat,
    val temperature: Float = 0.7f,
    val maxOutputTokens: Int = 2048,
    val enabled: Boolean = true,
    val isDefault: Boolean = false,
    val requestTimeoutSeconds: Int = 30,
    val streamingPreferred: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
