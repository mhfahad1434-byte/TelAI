package org.telegram.ai.agent.ai.manager

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import org.telegram.ai.agent.ai.models.ApiFormat
import org.telegram.ai.agent.ai.models.ConnectionTestResult
import org.telegram.ai.agent.ai.models.ModelMessage
import org.telegram.ai.agent.ai.models.ModelProviderConfig
import org.telegram.ai.agent.ai.models.ModelResponse
import org.telegram.ai.agent.ai.models.ProviderType
import org.telegram.ai.agent.ai.providers.AIProvider
import org.telegram.ai.agent.ai.providers.GeminiProvider
import org.telegram.ai.agent.ai.providers.OpenAICompatibleProvider
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ProviderManager @Inject constructor() {

    private val mutex = Mutex()
    private val _configurations = MutableStateFlow<List<ModelProviderConfig>>(emptyList())
    val configurations: StateFlow<List<ModelProviderConfig>> = _configurations.asStateFlow()

    private val _activeConfigId = MutableStateFlow<String?>(null)
    val activeConfigId: StateFlow<String?> = _activeConfigId.asStateFlow()

    private val providerInstances = mutableMapOf<String, AIProvider>()

    init {
        // Initialize with default Google Gemini Provider configuration
        val defaultGemini = ModelProviderConfig(
            id = "gemini-default",
            providerName = "Google Gemini",
            providerType = ProviderType.GEMINI_NATIVE,
            displayName = "Gemini Flash (Default)",
            baseUrl = "https://generativelanguage.googleapis.com",
            apiKey = "", // Loaded from Keystore by caller
            modelName = "gemini-3.8-flash",
            apiFormat = ApiFormat.GEMINI_REST_V1BETA,
            temperature = 0.4f,
            maxOutputTokens = 2048,
            enabled = true,
            isDefault = true
        )

        val openAIExample = ModelProviderConfig(
            id = "openai-compatible-sample",
            providerName = "OpenAI-Compatible Gateway",
            providerType = ProviderType.OPENAI_COMPATIBLE,
            displayName = "Custom LLM Endpoint",
            baseUrl = "https://api.openai.com/v1",
            apiKey = "",
            modelName = "gpt-4o-mini",
            apiFormat = ApiFormat.OPENAI_CHAT_COMPLETIONS,
            temperature = 0.5f,
            maxOutputTokens = 2048,
            enabled = true,
            isDefault = false
        )

        _configurations.value = listOf(defaultGemini, openAIExample)
        _activeConfigId.value = defaultGemini.id
    }

    private fun instantiateProvider(config: ModelProviderConfig): AIProvider {
        return when (config.providerType) {
            ProviderType.GEMINI_NATIVE -> GeminiProvider(config)
            ProviderType.OPENAI_COMPATIBLE -> OpenAICompatibleProvider(config)
        }
    }

    suspend fun getActiveProvider(): AIProvider? = mutex.withLock {
        val activeId = _activeConfigId.value ?: return null
        val config = _configurations.value.find { it.id == activeId } ?: return null

        var instance = providerInstances[activeId]
        if (instance == null || instance.config != config) {
            instance = instantiateProvider(config)
            providerInstances[activeId] = instance
        }
        return instance
    }

    suspend fun addConfiguration(config: ModelProviderConfig) = mutex.withLock {
        val updatedList = _configurations.value.toMutableList().apply { add(config) }
        _configurations.value = updatedList
        if (config.isDefault || _activeConfigId.value == null) {
            _activeConfigId.value = config.id
        }
    }

    suspend fun updateConfiguration(config: ModelProviderConfig) = mutex.withLock {
        val current = _configurations.value.toMutableList()
        val index = current.indexOfFirst { it.id == config.id }
        if (index != -1) {
            current[index] = config
            _configurations.value = current
            providerInstances.remove(config.id)
        }
    }

    suspend fun deleteConfiguration(configId: String): Boolean = mutex.withLock {
        if (_activeConfigId.value == configId) {
            val remaining = _configurations.value.filter { it.id != configId }
            if (remaining.isEmpty()) return false
            _activeConfigId.value = remaining.first().id
        }
        _configurations.value = _configurations.value.filter { it.id != configId }
        providerInstances.remove(configId)
        return true
    }

    suspend fun setDefaultProvider(configId: String) = mutex.withLock {
        val updated = _configurations.value.map {
            it.copy(isDefault = it.id == configId)
        }
        _configurations.value = updated
        _activeConfigId.value = configId
    }

    suspend fun testConnection(config: ModelProviderConfig): ConnectionTestResult {
        val provider = instantiateProvider(config)
        return provider.testConnection()
    }

    suspend fun generateResponse(
        messages: List<ModelMessage>,
        systemInstruction: String? = null
    ): Result<ModelResponse> {
        val provider = getActiveProvider()
            ?: return Result.failure(IllegalStateException("No active AI provider configured. Please configure a provider in Settings > AI Models."))
        return provider.generateResponse(messages, systemInstruction)
    }
}
