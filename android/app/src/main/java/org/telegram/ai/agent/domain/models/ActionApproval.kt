package org.telegram.ai.agent.domain.models

import java.util.UUID

enum class ActionRiskLevel {
    LOW,      // Search, Navigate, Filter (auto-permitted / preview)
    MEDIUM,   // Send, Reply, Forward, Edit, Pin, Archive (requires preview & approval)
    HIGH      // Delete, Leave Group, Kick, Change Admin (requires explicit double confirmation)
}

enum class ActionType {
    SEARCH_MESSAGES,
    NAVIGATE_TO_MESSAGE,
    SEND_MESSAGE,
    REPLY_MESSAGE,
    FORWARD_MESSAGE,
    EDIT_MESSAGE,
    PIN_MESSAGE,
    UNPIN_MESSAGE,
    ARCHIVE_CHAT,
    DELETE_MESSAGE,
    LEAVE_CHAT,
    KICK_MEMBER
}

enum class ApprovalStatus {
    PENDING,
    APPROVED,
    REJECTED,
    EXECUTED,
    INVALIDATED,
    EXPIRED
}

data class ActionApprovalRequest(
    val id: String = UUID.randomUUID().toString(),
    val actionType: ActionType,
    val riskLevel: ActionRiskLevel,
    val targetChatId: Long,
    val targetChatTitle: String,
    val targetMessageId: Long? = null,
    val summary: String,
    val payloadParameters: Map<String, String>, // Exact hash-bound parameters
    val status: ApprovalStatus = ApprovalStatus.PENDING,
    val requestedAt: Long = System.currentTimeMillis(),
    val expiresAt: Long = System.currentTimeMillis() + (10 * 60 * 1000) // 10 minutes expiry
)
