package org.telegram.ai.agent.domain.agents

import com.google.gson.Gson
import com.google.gson.JsonObject
import org.telegram.ai.agent.ai.manager.ProviderManager
import org.telegram.ai.agent.ai.models.ModelMessage
import org.telegram.ai.agent.domain.models.ActionApprovalRequest
import org.telegram.ai.agent.domain.models.ActionRiskLevel
import org.telegram.ai.agent.domain.models.ActionType
import org.telegram.ai.agent.domain.models.ApprovalStatus
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SafetyAgent @Inject constructor() {
    /**
     * Local deterministic safety filter.
     * Evaluates action risk without consulting external AI models.
     */
    fun classifyRisk(actionType: ActionType): ActionRiskLevel {
        return when (actionType) {
            ActionType.SEARCH_MESSAGES,
            ActionType.NAVIGATE_TO_MESSAGE -> ActionRiskLevel.LOW

            ActionType.SEND_MESSAGE,
            ActionType.REPLY_MESSAGE,
            ActionType.FORWARD_MESSAGE,
            ActionType.EDIT_MESSAGE,
            ActionType.PIN_MESSAGE,
            ActionType.UNPIN_MESSAGE,
            ActionType.ARCHIVE_CHAT -> ActionRiskLevel.MEDIUM

            ActionType.DELETE_MESSAGE,
            ActionType.LEAVE_CHAT,
            ActionType.KICK_MEMBER -> ActionRiskLevel.HIGH
        }
    }
}

@Singleton
class ManagerAgent @Inject constructor(
    private val providerManager: ProviderManager,
    private val safetyAgent: SafetyAgent
) {
    private val gson = Gson()

    private val systemInstructions = """
        You are the Manager Agent for TelAI, a personal Telegram assistant on Android.
        Your goal is to parse user intents into structured action proposals.
        Always output strict JSON with fields:
        {
          "actionType": "SEND_MESSAGE" | "REPLY_MESSAGE" | "SEARCH_MESSAGES" | "PIN_MESSAGE" | "ARCHIVE_CHAT" | "DELETE_MESSAGE",
          "targetChatTitle": "chat name",
          "summary": "human explanation",
          "parameters": { ...key-values... }
        }
        Do not execute actions directly. Only propose plans for user approval.
    """.trimIndent()

    suspend fun planAction(userPrompt: String): Result<ActionApprovalRequest> {
        val messages = listOf(ModelMessage(role = "user", content = userPrompt))
        val responseResult = providerManager.generateResponse(messages, systemInstructions)

        if (responseResult.isFailure) {
            return Result.failure(responseResult.exceptionOrNull()!!)
        }

        val text = responseResult.getOrNull()?.text.orEmpty()
        return try {
            val jsonStart = text.indexOf('{')
            val jsonEnd = text.lastIndexOf('}')
            if (jsonStart == -1 || jsonEnd == -1) {
                // Fallback default
                val actionType = ActionType.SEND_MESSAGE
                return Result.success(
                    ActionApprovalRequest(
                        actionType = actionType,
                        riskLevel = safetyAgent.classifyRisk(actionType),
                        targetChatId = 1001L,
                        targetChatTitle = "Saved Messages",
                        summary = userPrompt,
                        payloadParameters = mapOf("text" to userPrompt),
                        status = ApprovalStatus.PENDING
                    )
                )
            }

            val jsonContent = text.substring(jsonStart, jsonEnd + 1)
            val json = gson.fromJson(jsonContent, JsonObject::class.java)
            val rawType = json.get("actionType")?.asString ?: "SEND_MESSAGE"
            val actionType = runCatching { ActionType.valueOf(rawType) }.getOrDefault(ActionType.SEND_MESSAGE)
            val summary = json.get("summary")?.asString ?: "Execute action"
            val targetChat = json.get("targetChatTitle")?.asString ?: "Active Chat"

            val paramsMap = mutableMapOf<String, String>()
            json.getAsJsonObject("parameters")?.entrySet()?.forEach {
                paramsMap[it.key] = it.value.asString
            }

            Result.success(
                ActionApprovalRequest(
                    actionType = actionType,
                    riskLevel = safetyAgent.classifyRisk(actionType),
                    targetChatId = 1001L,
                    targetChatTitle = targetChat,
                    summary = summary,
                    payloadParameters = paramsMap,
                    status = ApprovalStatus.PENDING
                )
            )
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
