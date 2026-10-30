package org.telegram.ai.agent.ai.providers

import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonObject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.telegram.ai.agent.ai.models.ConnectionTestResult
import org.telegram.ai.agent.ai.models.ModelMessage
import org.telegram.ai.agent.ai.models.ModelProviderConfig
import org.telegram.ai.agent.ai.models.ModelResponse
import org.telegram.ai.agent.ai.models.ModelUsage
import java.util.concurrent.TimeUnit

class OpenAICompatibleProvider(
    override val config: ModelProviderConfig,
    private val httpClient: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(config.requestTimeoutSeconds.toLong(), TimeUnit.SECONDS)
        .readTimeout(config.requestTimeoutSeconds.toLong(), TimeUnit.SECONDS)
        .build()
) : AIProvider {

    override val providerId: String = config.id
    private val gson = Gson()
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    private fun resolveEndpoint(): String {
        val base = config.baseUrl.trimEnd('/')
        return if (base.endsWith("/chat/completions")) {
            base
        } else if (base.endsWith("/v1")) {
            "$base/chat/completions"
        } else {
            "$base/v1/chat/completions"
        }
    }

    override suspend fun generateResponse(
        messages: List<ModelMessage>,
        systemInstruction: String?
    ): Result<ModelResponse> = withContext(Dispatchers.IO) {
        val startTime = System.currentTimeMillis()
        try {
            val endpoint = resolveEndpoint()
            val payload = JsonObject().apply {
                addProperty("model", config.modelName)
                addProperty("temperature", config.temperature)
                addProperty("max_tokens", config.maxOutputTokens)

                val msgsArray = JsonArray()
                if (!systemInstruction.isNullOrBlank()) {
                    val sysMsg = JsonObject().apply {
                        addProperty("role", "system")
                        addProperty("content", systemInstruction)
                    }
                    msgsArray.add(sysMsg)
                }

                for (msg in messages) {
                    val m = JsonObject().apply {
                        addProperty("role", msg.role)
                        addProperty("content", msg.content)
                    }
                    msgsArray.add(m)
                }
                add("messages", msgsArray)
            }

            val requestBody = gson.toJson(payload).toRequestBody(jsonMediaType)
            val requestBuilder = Request.Builder()
                .url(endpoint)
                .post(requestBody)
                .header("Content-Type", "application/json")

            if (config.apiKey.isNotBlank()) {
                requestBuilder.header("Authorization", "Bearer ${config.apiKey}")
            }

            httpClient.newCall(requestBuilder.build()).execute().use { response ->
                val bodyString = response.body?.string().orEmpty()
                val latency = System.currentTimeMillis() - startTime

                if (!response.isSuccessful) {
                    return@withContext Result.failure(
                        Exception("OpenAI API error (HTTP ${response.code}): $bodyString")
                    )
                }

                val root = gson.fromJson(bodyString, JsonObject::class.java)
                val choices = root.getAsJsonArray("choices")
                val firstChoice = choices?.get(0)?.asJsonObject
                val text = firstChoice?.getAsJsonObject("message")?.get("content")?.asString.orEmpty()
                val finishReason = firstChoice?.get("finish_reason")?.asString

                val usageObj = root.getAsJsonObject("usage")
                val usage = usageObj?.let {
                    ModelUsage(
                        promptTokens = it.get("prompt_tokens")?.asInt ?: 0,
                        completionTokens = it.get("completion_tokens")?.asInt ?: 0,
                        totalTokens = it.get("total_tokens")?.asInt ?: 0
                    )
                }

                Result.success(
                    ModelResponse(
                        text = text,
                        finishReason = finishReason,
                        usage = usage,
                        rawJson = bodyString,
                        latencyMs = latency
                    )
                )
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun testConnection(): ConnectionTestResult = withContext(Dispatchers.IO) {
        val start = System.currentTimeMillis()
        try {
            if (config.baseUrl.isBlank()) {
                return@withContext ConnectionTestResult.Failure("Base URL cannot be blank.")
            }
            if (config.modelName.isBlank()) {
                return@withContext ConnectionTestResult.Failure("Model identifier cannot be blank.")
            }

            val testMessage = listOf(ModelMessage(role = "user", content = "Ping. Answer with 'OK'."))
            val result = generateResponse(testMessage, systemInstruction = "Answer strictly with 'OK'.")
            val latency = System.currentTimeMillis() - start

            if (result.isSuccess) {
                ConnectionTestResult.Success(
                    message = "Connected to ${config.displayName} successfully.",
                    latencyMs = latency,
                    detectedModel = config.modelName
                )
            } else {
                val err = result.exceptionOrNull()?.message ?: "Unknown provider error."
                val isAuth = err.contains("401") || err.contains("403") || err.contains("Unauthorized")
                ConnectionTestResult.Failure(
                    errorMessage = err,
                    isAuthError = isAuth
                )
            }
        } catch (e: Exception) {
            ConnectionTestResult.Failure(
                errorMessage = e.localizedMessage ?: "Failed to reach endpoint."
            )
        }
    }
}
