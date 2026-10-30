package org.telegram.ai.agent.ai.providers

import com.google.gson.Gson
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

class GeminiProvider(
    override val config: ModelProviderConfig,
    private val httpClient: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(config.requestTimeoutSeconds.toLong(), TimeUnit.SECONDS)
        .readTimeout(config.requestTimeoutSeconds.toLong(), TimeUnit.SECONDS)
        .build()
) : AIProvider {

    override val providerId: String = config.id
    private val gson = Gson()
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    private fun resolveEndpoint(model: String): String {
        val base = config.baseUrl.trimEnd('/')
        return if (base.isEmpty()) {
            "https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent"
        } else {
            "$base/v1beta/models/$model:generateContent"
        }
    }

    override suspend fun generateResponse(
        messages: List<ModelMessage>,
        systemInstruction: String?
    ): Result<ModelResponse> = withContext(Dispatchers.IO) {
        val startTime = System.currentTimeMillis()
        try {
            val url = "${resolveEndpoint(config.modelName)}?key=${config.apiKey}"
            
            val payload = JsonObject().apply {
                if (!systemInstruction.isNullOrBlank()) {
                    val sysObj = JsonObject()
                    val sysParts = JsonObject()
                    sysParts.addProperty("text", systemInstruction)
                    val partsArr = com.google.gson.JsonArray().apply { add(sysParts) }
                    sysObj.add("parts", partsArr)
                    add("systemInstruction", sysObj)
                }

                val contentsArr = com.google.gson.JsonArray()
                for (msg in messages) {
                    val contentObj = JsonObject()
                    contentObj.addProperty("role", if (msg.role == "assistant") "model" else "user")
                    val partsArr = com.google.gson.JsonArray()
                    val part = JsonObject().apply { addProperty("text", msg.content) }
                    partsArr.add(part)
                    contentObj.add("parts", partsArr)
                    contentsArr.add(contentObj)
                }
                add("contents", contentsArr)

                val genConfig = JsonObject().apply {
                    addProperty("temperature", config.temperature)
                    addProperty("maxOutputTokens", config.maxOutputTokens)
                }
                add("generationConfig", genConfig)
            }

            val requestBody = gson.toJson(payload).toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url(url)
                .post(requestBody)
                .header("Content-Type", "application/json")
                .build()

            httpClient.newCall(request).execute().use { response ->
                val bodyString = response.body?.string().orEmpty()
                val latency = System.currentTimeMillis() - startTime

                if (!response.isSuccessful) {
                    return@withContext Result.failure(
                        Exception("Gemini API error (HTTP ${response.code}): $bodyString")
                    )
                }

                val root = gson.fromJson(bodyString, JsonObject::class.java)
                val text = root.getAsJsonArray("candidates")
                    ?.get(0)?.asJsonObject
                    ?.getAsJsonObject("content")
                    ?.getAsJsonArray("parts")
                    ?.get(0)?.asJsonObject
                    ?.get("text")?.asString.orEmpty()

                val usageMetadata = root.getAsJsonObject("usageMetadata")
                val usage = usageMetadata?.let {
                    ModelUsage(
                        promptTokens = it.get("promptTokenCount")?.asInt ?: 0,
                        completionTokens = it.get("candidatesTokenCount")?.asInt ?: 0,
                        totalTokens = it.get("totalTokenCount")?.asInt ?: 0
                    )
                }

                Result.success(
                    ModelResponse(
                        text = text,
                        finishReason = "STOP",
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
            if (config.apiKey.isBlank()) {
                return@withContext ConnectionTestResult.Failure(
                    errorMessage = "Gemini API key is blank. Please enter a valid API key.",
                    isAuthError = true
                )
            }

            val testMessage = listOf(ModelMessage(role = "user", content = "Ping. Answer with 'OK'."))
            val result = generateResponse(testMessage, systemInstruction = "Answer concisely.")
            val latency = System.currentTimeMillis() - start

            if (result.isSuccess) {
                ConnectionTestResult.Success(
                    message = "Gemini connection verified successfully.",
                    latencyMs = latency,
                    detectedModel = config.modelName
                )
            } else {
                val err = result.exceptionOrNull()?.message ?: "Unknown error"
                val isAuth = err.contains("401") || err.contains("403") || err.contains("API_KEY_INVALID")
                ConnectionTestResult.Failure(
                    errorMessage = err,
                    isAuthError = isAuth
                )
            }
        } catch (e: Exception) {
            ConnectionTestResult.Failure(
                errorMessage = e.localizedMessage ?: "Failed to reach Gemini endpoint."
            )
        }
    }
}
