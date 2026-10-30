package org.telegram.ai.agent.feature.activity

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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.telegram.ai.agent.core.design.CardNavySurface
import org.telegram.ai.agent.core.design.CyanSecondary
import org.telegram.ai.agent.core.design.DeepNavyBackground
import org.telegram.ai.agent.core.design.EmeraldSuccess
import org.telegram.ai.agent.core.design.RedDanger
import org.telegram.ai.agent.core.design.TextPrimary
import org.telegram.ai.agent.core.design.TextSecondary

data class ActivityLogUi(
    val id: String,
    val actionType: String,
    val status: String,
    val details: String,
    val actor: String,
    val time: String
)

val SampleLogs = listOf(
    ActivityLogUi("1", "SEARCH_MESSAGES", "EXECUTED", "Searched 24 local TDLib chat caches for 'Keystore GCM'", "Search Agent", "17:15"),
    ActivityLogUi("2", "SEND_MESSAGE", "EXECUTED", "Sent security confirmation to Sarah Jenkins after approval", "Action Executor", "16:45"),
    ActivityLogUi("3", "DELETE_MESSAGE", "REJECTED", "Declined request to delete message #894 from team channel", "Human User", "16:10")
)

@Composable
fun ActivityScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBackground)
            .padding(16.dp)
    ) {
        Text(
            text = "Activity & Audit Trail",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )
        Text(
            text = "Chronological record of every proposed and executed Telegram action",
            fontSize = 12.sp,
            color = TextSecondary
        )

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(SampleLogs) { log ->
                val isExecuted = log.status == "EXECUTED"
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(CardNavySurface)
                        .padding(14.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = log.actionType,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(if (isExecuted) EmeraldSuccess else RedDanger)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = log.status,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = DeepNavyBackground
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = log.details,
                            fontSize = 12.sp,
                            color = TextPrimary
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Actor: ${log.actor}", fontSize = 10.sp, color = CyanSecondary)
                            Text(text = log.time, fontSize = 10.sp, color = TextSecondary)
                        }
                    }
                }
            }
        }
    }
}
