package org.telegram.ai.agent

import org.junit.Assert.assertEquals
import org.junit.Test
import org.telegram.ai.agent.domain.agents.SafetyAgent
import org.telegram.ai.agent.domain.models.ActionRiskLevel
import org.telegram.ai.agent.domain.models.ActionType

class SafetyAgentTest {

    private val safetyAgent = SafetyAgent()

    @Test
    fun testRiskClassificationLow() {
        assertEquals(ActionRiskLevel.LOW, safetyAgent.classifyRisk(ActionType.SEARCH_MESSAGES))
        assertEquals(ActionRiskLevel.LOW, safetyAgent.classifyRisk(ActionType.NAVIGATE_TO_MESSAGE))
    }

    @Test
    fun testRiskClassificationMedium() {
        assertEquals(ActionRiskLevel.MEDIUM, safetyAgent.classifyRisk(ActionType.SEND_MESSAGE))
        assertEquals(ActionRiskLevel.MEDIUM, safetyAgent.classifyRisk(ActionType.REPLY_MESSAGE))
        assertEquals(ActionRiskLevel.MEDIUM, safetyAgent.classifyRisk(ActionType.PIN_MESSAGE))
        assertEquals(ActionRiskLevel.MEDIUM, safetyAgent.classifyRisk(ActionType.ARCHIVE_CHAT))
    }

    @Test
    fun testRiskClassificationHigh() {
        assertEquals(ActionRiskLevel.HIGH, safetyAgent.classifyRisk(ActionType.DELETE_MESSAGE))
        assertEquals(ActionRiskLevel.HIGH, safetyAgent.classifyRisk(ActionType.LEAVE_CHAT))
        assertEquals(ActionRiskLevel.HIGH, safetyAgent.classifyRisk(ActionType.KICK_MEMBER))
    }
}
