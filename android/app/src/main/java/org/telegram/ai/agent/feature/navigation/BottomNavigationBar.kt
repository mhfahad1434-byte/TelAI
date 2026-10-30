package org.telegram.ai.agent.feature.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Activity
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import org.telegram.ai.agent.core.design.CardNavySurface
import org.telegram.ai.agent.core.design.CyanSecondary
import org.telegram.ai.agent.core.design.DeepNavyBackground
import org.telegram.ai.agent.core.design.TextSecondary

sealed class Screen(val route: String, val title: String, val icon: ImageVector? = null) {
    object Splash : Screen("splash", "Splash")
    object Onboarding : Screen("onboarding", "Onboarding")
    object TelegramAuth : Screen("telegram_auth", "Telegram Auth")
    object Home : Screen("home", "Home", Icons.Default.Home)
    object Assistant : Screen("assistant", "Assistant", Icons.Default.Psychology)
    object Search : Screen("search", "Search", Icons.Default.Search)
    object SearchResults : Screen("search_results/{query}", "Results") {
        fun createRoute(query: String) = "search_results/$query"
    }
    object MessageNav : Screen("message_nav/{messageId}", "Message Context") {
        fun createRoute(messageId: Long) = "message_nav/$messageId"
    }
    object Approvals : Screen("approvals", "Approvals", Icons.Default.Activity)
    object AIModels : Screen("ai_models", "AI Models")
    object Security : Screen("security", "Security")
    object Settings : Screen("settings", "Settings", Icons.Default.Settings)
}

val BottomNavItems = listOf(
    Screen.Home,
    Screen.Assistant,
    Screen.Search,
    Screen.Approvals,
    Screen.Settings
)

@Composable
fun BottomNavigationBar(
    navController: NavController,
    pendingApprovalsCount: Int = 0
) {
    val navBackStackEntry = navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry.value?.destination?.route

    NavigationBar(
        containerColor = DeepNavyBackground,
        contentColor = TextSecondary
    ) {
        BottomNavItems.forEach { item ->
            val selected = currentRoute == item.route
            NavigationBarItem(
                selected = selected,
                onClick = {
                    if (currentRoute != item.route) {
                        navController.navigate(item.route) {
                            popUpTo(Screen.Home.route) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                icon = {
                    item.icon?.let { icon ->
                        if (item == Screen.Approvals && pendingApprovalsCount > 0) {
                            BadgedBox(badge = { Badge { Text("$pendingApprovalsCount") } }) {
                                Icon(icon, contentDescription = item.title)
                            }
                        } else {
                            Icon(icon, contentDescription = item.title)
                        }
                    }
                },
                label = { Text(item.title) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = CyanSecondary,
                    selectedTextColor = CyanSecondary,
                    indicatorColor = CardNavySurface,
                    unselectedIconColor = TextSecondary,
                    unselectedTextColor = TextSecondary
                )
            )
        }
    }
}
