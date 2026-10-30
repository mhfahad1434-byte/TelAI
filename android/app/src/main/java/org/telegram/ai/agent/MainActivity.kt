package org.telegram.ai.agent

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import dagger.hilt.android.AndroidEntryPoint
import org.telegram.ai.agent.core.design.TelAITheme
import org.telegram.ai.agent.feature.navigation.TelAINavHost

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            TelAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize()
                ) {
                    TelAINavHost()
                }
            }
        }
    }
}
