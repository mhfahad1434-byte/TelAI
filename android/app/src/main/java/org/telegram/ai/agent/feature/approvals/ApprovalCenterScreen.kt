package org.telegram.ai.agent.feature.approvals

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.telegram.ai.agent.core.design.AmberWarning
import org.telegram.ai.agent.core.design.CardNavySurface
import org.telegram.ai.agent.core.design.CyanSecondary
import org.telegram.ai.agent.core.design.DeepNavyBackground
import org.telegram.ai.agent.core.design.EmeraldSuccess
import org.telegram.ai.agent.core.design.RedDanger
import org.telegram.ai.agent.core.design.TextPrimary
import org.telegram.ai.agent.core.design.TextSecondary
import org.telegram.ai.agent.domain.models.ActionApprovalRequest
import org.telegram.ai.agent.domain.models.ActionRiskLevel
import org.telegram.ai.agent.domain.models.ActionType
import org.telegram.ai.agent.domain.models.ApprovalStatus

@Composable
fun ApprovalCenterScreen() {
    val pendingRequests = remember {
        mutableStateListOf(
            ActionApprovalRequest(
                id = "req-1",
                actionType = ActionType.SEND_MESSAGE,
                riskLevel = ActionRiskLevel.MEDIUM,
                targetChatId = 1003L,
                targetChatTitle = "Sarah Jenkins (SecOps)",
                targetMessageId = 903L,
                summary = "Send reply confirming NIST SP 800-38D AES-GCM compliance to Sarah.",
                payloadParameters = mapOf("text" to "Confirmed: TelAI uses hardware Keystore GCMParameterSpec(128, iv)."),
                status = ApprovalStatus.PENDING
            ),
            ActionApprovalRequest(
                id = "req-2",
                actionType = ActionType.PIN_MESSAGE,
                riskLevel = ActionRiskLevel.MEDIUM,
                targetChatId = 1002L,
                targetChatTitle = "Android Core Architects",
                targetMessageId = 902L,
                summary = "Pin Elena Rostova's TDLib patch at top of team chat.",
                payloadParameters = mapOf("messageId" to "902"),
                status = ApprovalStatus.PENDING
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBackground)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Action Approval Center",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = "Explicit approval required for Telegram mutations",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(CardNavySurface)
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "${pendingRequests.size} Pending",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = AmberWarning
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (pendingRequests.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = null,
                        tint = EmeraldSuccess,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "All Approvals Clear",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "No pending action tickets require human confirmation",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(pendingRequests) { req ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(CardNavySurface)
                            .padding(16.dp)
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = req.actionType.name,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(if (req.riskLevel == ActionRiskLevel.HIGH) RedDanger else AmberWarning)
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = "${req.riskLevel.name} RISK",
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = DeepNavyBackground
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = req.summary,
                                fontSize = 13.sp,
                                color = TextPrimary
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            // Target Chat & Hash binding
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(DeepNavyBackground)
                                    .padding(10.dp)
                            ) {
                                Text(
                                    text = "Target: ${req.targetChatTitle}",
                                    fontSize = 11.sp,
                                    color = CyanSecondary,
                                    fontWeight = FontWeight.Medium
                                )
                                Text(
                                    text = "Hash: ${req.id} (Single-use immutable token)",
                                    fontSize = 10.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = TextSecondary
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = { pendingRequests.remove(req) },
                                    modifier = Modifier.weight(1f),
                                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.size(4.dp))
                                    Text("Approve", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }

                                Button(
                                    onClick = { pendingRequests.remove(req) },
                                    modifier = Modifier.weight(1f),
                                    colors = ButtonDefaults.buttonColors(containerColor = CardNavySurface),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(Icons.Default.Close, contentDescription = null, tint = RedDanger, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.size(4.dp))
                                    Text("Reject", color = RedDanger, fontSize = 12.sp)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
