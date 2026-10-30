package org.telegram.ai.agent.feature.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import org.telegram.ai.agent.feature.activity.ActivityScreen
import org.telegram.ai.agent.feature.ai_models.AIModelsScreen
import org.telegram.ai.agent.feature.approvals.ApprovalCenterScreen
import org.telegram.ai.agent.feature.assistant.AssistantScreen
import org.telegram.ai.agent.feature.auth.TelegramAuthScreen
import org.telegram.ai.agent.feature.home.HomeScreen
import org.telegram.ai.agent.feature.onboarding.OnboardingScreen
import org.telegram.ai.agent.feature.search.SearchScreen
import org.telegram.ai.agent.feature.security.SecurityScreen
import org.telegram.ai.agent.feature.settings.SettingsScreen
import org.telegram.ai.agent.feature.splash.SplashScreen

@Composable
fun TelAINavHost(
    navController: NavHostController = rememberNavController()
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val shouldShowBottomBar = currentRoute in BottomNavItems.map { it.route } ||
            currentRoute == Screen.AIModels.route ||
            currentRoute == Screen.Security.route

    Scaffold(
        bottomBar = {
            if (shouldShowBottomBar) {
                BottomNavigationBar(
                    navController = navController,
                    pendingApprovalsCount = 2
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Splash.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Splash.route) {
                SplashScreen(onFinished = {
                    navController.navigate(Screen.Onboarding.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                })
            }
            composable(Screen.Onboarding.route) {
                OnboardingScreen(onContinue = {
                    navController.navigate(Screen.TelegramAuth.route) {
                        popUpTo(Screen.Onboarding.route) { inclusive = true }
                    }
                })
            }
            composable(Screen.TelegramAuth.route) {
                TelegramAuthScreen(onAuthenticated = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.TelegramAuth.route) { inclusive = true }
                    }
                })
            }
            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToAssistant = { navController.navigate(Screen.Assistant.route) },
                    onNavigateToSearch = { navController.navigate(Screen.Search.route) },
                    onNavigateToApprovals = { navController.navigate(Screen.Approvals.route) },
                    onNavigateToAIModels = { navController.navigate(Screen.AIModels.route) }
                )
            }
            composable(Screen.Assistant.route) {
                AssistantScreen(
                    onNavigateToApprovals = { navController.navigate(Screen.Approvals.route) }
                )
            }
            composable(Screen.Search.route) {
                SearchScreen(
                    onNavigateToMessage = { msgId ->
                        navController.navigate(Screen.MessageNav.createRoute(msgId))
                    }
                )
            }
            composable(Screen.Approvals.route) {
                ApprovalCenterScreen()
            }
            composable(Screen.AIModels.route) {
                AIModelsScreen(onBack = { navController.popBackStack() })
            }
            composable(Screen.Security.route) {
                SecurityScreen(onBack = { navController.popBackStack() })
            }
            composable(Screen.Settings.route) {
                SettingsScreen(
                    onNavigateToAIModels = { navController.navigate(Screen.AIModels.route) },
                    onNavigateToSecurity = { navController.navigate(Screen.Security.route) },
                    onLogout = {
                        navController.navigate(Screen.TelegramAuth.route) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}
