package org.telegram.ai.agent.feature.search

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Link
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.telegram.ai.agent.core.design.CardNavySurface
import org.telegram.ai.agent.core.design.CyanSecondary
import org.telegram.ai.agent.core.design.DeepNavyBackground
import org.telegram.ai.agent.core.design.TextPrimary
import org.telegram.ai.agent.core.design.TextSecondary

data class SearchResultUi(
    val id: Long,
    val chatTitle: String,
    val senderName: String,
    val text: String,
    val date: String,
    val type: String
)

val SampleSearchResults = listOf(
    SearchResultUi(902, "Android Core Architects", "Elena Rostova", "Merged TDLib 1.8.34 arm64-v8a JNI binding patch.", "Today 17:15", "document"),
    SearchResultUi(903, "Sarah Jenkins (SecOps)", "Sarah Jenkins", "Can you confirm the Keystore GCM IV size is exactly 12 bytes?", "Today 16:42", "message"),
    SearchResultUi(905, "AI Studio Engineering", "David Chen", "Here is the architecture blueprint for configurable AI providers.", "Today 14:18", "photo")
)

@Composable
fun SearchScreen(
    onNavigateToMessage: (Long) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("All") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBackground)
            .padding(16.dp)
    ) {
        Text(
            text = "Telegram Account Search",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )
        Text(
            text = "Local TDLib offline message & media index",
            fontSize = 12.sp,
            color = TextSecondary
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier.fillMaxWidth(),
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = null,
                    tint = TextSecondary
                )
            },
            placeholder = { Text("Search messages, senders, files...", color = TextSecondary) },
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = CyanSecondary,
                unfocusedBorderColor = CardNavySurface,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary
            )
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Filter chips (All, Documents, Photos, Links)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("All", "Documents", "Media", "Links").forEach { filter ->
                val selected = selectedFilter == filter
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(if (selected) CyanSecondary else CardNavySurface)
                        .clickable { selectedFilter = filter }
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = filter,
                        fontSize = 12.sp,
                        fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
                        color = if (selected) DeepNavyBackground else TextSecondary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(SampleSearchResults) { result ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(CardNavySurface)
                        .clickable { onNavigateToMessage(result.id) }
                        .padding(14.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = result.chatTitle,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = CyanSecondary
                            )
                            Text(
                                text = result.date,
                                fontSize = 10.sp,
                                color = TextSecondary
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "${result.senderName}: ${result.text}",
                            fontSize = 13.sp,
                            color = TextPrimary,
                            maxLines = 2
                        )
                    }
                }
            }
        }
    }
}
