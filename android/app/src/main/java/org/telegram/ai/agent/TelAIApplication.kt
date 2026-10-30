package org.telegram.ai.agent

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import dagger.hilt.android.HiltAndroidApp
import org.telegram.ai.agent.core.security.KeystoreManager

@HiltAndroidApp
class TelAIApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        initializeNotificationChannels()
        initializeSecuritySubsystems()
    }

    private fun initializeNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val approvalsChannel = NotificationChannel(
                CHANNEL_APPROVALS_ID,
                "Action Approvals",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "High-priority requests requiring human confirmation"
                enableVibration(true)
            }

            val agentChannel = NotificationChannel(
                CHANNEL_AGENT_ID,
                "Agent Status",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Background tasks and Telegram sync updates"
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager?.createNotificationChannel(approvalsChannel)
            notificationManager?.createNotificationChannel(agentChannel)
        }
    }

    private fun initializeSecuritySubsystems() {
        // Pre-warm Android Keystore AES-256 master key
        try {
            val testCipher = KeystoreManager.encrypt("INIT_HEALTH_CHECK")
            KeystoreManager.decrypt(testCipher)
        } catch (e: Exception) {
            // Log redacted exception
        }
    }

    companion object {
        const val CHANNEL_APPROVALS_ID = "telai_approvals_channel"
        const val CHANNEL_AGENT_ID = "telai_agent_channel"
    }
}
