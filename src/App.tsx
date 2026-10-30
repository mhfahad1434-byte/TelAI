/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { PhoneFrame } from './components/PhoneFrame';
import { BottomNav } from './components/BottomNav';
import { StudioConsole } from './components/console/StudioConsole';
import { ProjectExportModal } from './components/modals/ProjectExportModal';

// Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { TelegramAuthScreen } from './components/screens/TelegramAuthScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { AssistantScreen } from './components/screens/AssistantScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { SearchResultsScreen } from './components/screens/SearchResultsScreen';
import { MessageNavScreen } from './components/screens/MessageNavScreen';
import { ApprovalCenterScreen } from './components/screens/ApprovalCenterScreen';
import { AutomationsScreen } from './components/screens/AutomationsScreen';
import { ActivityScreen } from './components/screens/ActivityScreen';
import { AIModelsScreen } from './components/screens/AIModelsScreen';
import { SecurityScreen } from './components/screens/SecurityScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

// Types & Data
import {
  ActionApprovalRequest,
  ActionLogItem,
  AutomationItem,
  ModelProviderConfig,
  ScreenId,
  TelegramChat,
  TelegramMessage,
} from './types';
import {
  INITIAL_ACTION_LOGS,
  INITIAL_APPROVAL_REQUESTS,
  INITIAL_AUTOMATIONS,
  INITIAL_MESSAGES,
  INITIAL_SAVED_MODELS,
  INITIAL_TELEGRAM_CHATS,
} from './data/mockData';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [navHistory, setNavHistory] = useState<ScreenId[]>([]);
  const [viewMode, setViewMode] = useState<'phone' | 'expanded'>('expanded');

  // Application Data States
  const [models, setModels] = useState<ModelProviderConfig[]>(INITIAL_SAVED_MODELS);
  const [activeModelId, setActiveModelId] = useState<string>('gemini-native-default');
  const [chats, setChats] = useState<TelegramChat[]>(INITIAL_TELEGRAM_CHATS);
  const [messages, setMessages] = useState<TelegramMessage[]>(INITIAL_MESSAGES);
  const [approvalRequests, setApprovalRequests] = useState<ActionApprovalRequest[]>(
    INITIAL_APPROVAL_REQUESTS
  );
  const [automations, setAutomations] = useState<AutomationItem[]>(INITIAL_AUTOMATIONS);
  const [actionLogs, setActionLogs] = useState<ActionLogItem[]>(INITIAL_ACTION_LOGS);

  // Active Contexts
  const [tdlibStatus, setTdlibStatus] = useState<'connected' | 'auth_required' | 'connecting'>(
    'connected'
  );
  const [selectedMessage, setSelectedMessage] = useState<TelegramMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TelegramMessage[]>([]);
  const [initialAssistantPrompt, setInitialAssistantPrompt] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Active AI Model
  const activeModel = models.find((m) => m.id === activeModelId) || models[0];

  // Navigation Helpers
  const navigateTo = (newScreen: ScreenId) => {
    if (newScreen !== currentScreen) {
      setNavHistory((prev) => [...prev, currentScreen]);
      setCurrentScreen(newScreen);
    }
  };

  const handleBack = () => {
    if (navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1];
      setNavHistory((hist) => hist.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen('home');
    }
  };

  // Search Logic
  const handleExecuteSearch = (query: string, mediaType?: string, chatId?: number) => {
    setSearchQuery(query);
    const qLower = query.toLowerCase();
    const hits = messages.filter((m) => {
      const matchText = m.text.toLowerCase().includes(qLower) || m.chatTitle.toLowerCase().includes(qLower) || m.senderName.toLowerCase().includes(qLower);
      const matchMedia = !mediaType || m.mediaType === mediaType;
      const matchChat = !chatId || m.chatId === chatId;
      return matchText && matchMedia && matchChat;
    });

    setSearchResults(hits.length > 0 ? hits : messages.slice(0, 2));
    navigateTo('search_results');
  };

  // Jump to message context
  const handleSelectMessage = (msg: TelegramMessage) => {
    setSelectedMessage(msg);
    navigateTo('message_nav');
  };

  // Approval Handlers
  const handleApproveAction = (id: string) => {
    const req = approvalRequests.find((r) => r.id === id);
    if (!req) return;

    // Add to executed action log
    const newLog: ActionLogItem = {
      id: `log-${Date.now()}`,
      actionType: req.actionType,
      riskLevel: req.riskLevel,
      targetChatTitle: req.targetChatTitle,
      status: 'EXECUTED',
      executedByAgent: 'Android Action Executor',
      timestamp: Date.now(),
      details: `Dispatched to TDLib: ${req.summary}`,
    };

    setActionLogs((prev) => [newLog, ...prev]);
    setApprovalRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRejectAction = (id: string) => {
    const req = approvalRequests.find((r) => r.id === id);
    if (!req) return;

    const newLog: ActionLogItem = {
      id: `log-${Date.now()}`,
      actionType: req.actionType,
      riskLevel: req.riskLevel,
      targetChatTitle: req.targetChatTitle,
      status: 'REJECTED',
      executedByAgent: 'Human User (Alex Hunter)',
      timestamp: Date.now(),
      details: `Declined action: ${req.summary}`,
    };

    setActionLogs((prev) => [newLog, ...prev]);
    setApprovalRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateActionParameters = (id: string, updatedParams: Record<string, string>) => {
    setApprovalRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            payloadParameters: { ...r.payloadParameters, ...updatedParams },
            payloadHash: `sha256-invalidated-${Math.random().toString(36).substring(2, 8)}`,
            summary: `(Edited) ${r.summary}`,
          };
        }
        return r;
      })
    );
  };

  // Quick Action proposal trigger
  const handleProposeMessageAction = (actionType: 'REPLY_MESSAGE' | 'PIN_MESSAGE' | 'DELETE_MESSAGE') => {
    if (!selectedMessage) return;

    const risk = actionType === 'DELETE_MESSAGE' ? 'HIGH' : 'MEDIUM';
    const newReq: ActionApprovalRequest = {
      id: `req-${Date.now()}`,
      actionType,
      riskLevel: risk,
      targetChatId: selectedMessage.chatId,
      targetChatTitle: selectedMessage.chatTitle,
      targetMessageId: selectedMessage.id,
      summary:
        actionType === 'DELETE_MESSAGE'
          ? `Permanently delete message #${selectedMessage.id} from ${selectedMessage.chatTitle}`
          : actionType === 'PIN_MESSAGE'
          ? `Pin message #${selectedMessage.id} in ${selectedMessage.chatTitle}`
          : `Reply to message #${selectedMessage.id} from ${selectedMessage.senderName}`,
      payloadParameters: {
        messageId: String(selectedMessage.id),
        chatId: String(selectedMessage.chatId),
      },
      payloadHash: `sha256-${Math.random().toString(36).substring(2, 10)}`,
      status: 'PENDING',
      requestedAt: Date.now(),
      expiresAt: Date.now() + 600000,
    };

    setApprovalRequests((prev) => [newReq, ...prev]);
    navigateTo('approval_center');
  };

  // Model Management
  const handleSetActiveModel = (id: string) => {
    setActiveModelId(id);
  };

  const handleSetDefaultModel = (id: string) => {
    setModels((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
    setActiveModelId(id);
  };

  const handleAddModel = (newModel: ModelProviderConfig) => {
    setModels((prev) => [...prev, newModel]);
    if (newModel.isDefault) {
      setActiveModelId(newModel.id);
    }
  };

  const handleUpdateModel = (updated: ModelProviderConfig) => {
    setModels((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteModel = (id: string) => {
    if (activeModelId === id) {
      const remaining = models.filter((m) => m.id !== id);
      if (remaining.length > 0) {
        setActiveModelId(remaining[0].id);
      }
    }
    setModels((prev) => prev.filter((m) => m.id !== id));
  };

  // Quick prompt handler
  const handleOpenQuickPrompt = (prompt: string) => {
    setInitialAssistantPrompt(prompt);
    navigateTo('assistant');
  };

  // Automation runner
  const handleToggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleTriggerAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              runCount: a.runCount + 1,
              lastRun: `Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
            }
          : a
      )
    );
  };

  // Screen Title for Subheader
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'search_results':
        return 'Search Results';
      case 'message_nav':
        return 'Message Context';
      case 'approval_center':
        return 'Approval Center';
      case 'automations':
        return 'Automations';
      case 'ai_models':
        return 'AI Models Architecture';
      case 'security':
        return 'Security & Keystore';
      default:
        return undefined;
    }
  };

  const isSecondaryScreen = [
    'search_results',
    'message_nav',
    'approval_center',
    'automations',
    'ai_models',
    'security',
  ].includes(currentScreen);

  const showBottomNav = ![
    'splash',
    'onboarding',
    'telegram_auth',
  ].includes(currentScreen);

  return (
    <div className="w-screen h-screen bg-[#070A12] text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Top Application Bar */}
      <AppHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeModel={activeModel}
        tdlibStatus={tdlibStatus}
        pendingApprovalsCount={approvalRequests.length}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onNavigateToModels={() => navigateTo('ai_models')}
      />

      {/* Main Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Android Device Simulator Viewport */}
        <div
          className={`flex-1 flex items-center justify-center p-2 sm:p-4 overflow-y-auto ${
            viewMode === 'expanded' ? 'max-w-[480px] lg:max-w-[500px]' : 'w-full'
          }`}
        >
          <PhoneFrame
            canGoBack={isSecondaryScreen}
            onBack={handleBack}
            screenTitle={getScreenTitle()}
          >
            {/* Screen Router */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {currentScreen === 'splash' && (
                <SplashScreen onComplete={() => setCurrentScreen('onboarding')} />
              )}

              {currentScreen === 'onboarding' && (
                <OnboardingScreen onComplete={() => setCurrentScreen('telegram_auth')} />
              )}

              {currentScreen === 'telegram_auth' && (
                <TelegramAuthScreen
                  onAuthenticated={() => {
                    setTdlibStatus('connected');
                    setCurrentScreen('home');
                  }}
                />
              )}

              {currentScreen === 'home' && (
                <HomeScreen
                  activeModel={activeModel}
                  pendingApprovals={approvalRequests}
                  chats={chats}
                  onNavigate={navigateTo}
                  onSelectChat={(chat) => {
                    const sample = messages.find((m) => m.chatId === chat.id) || messages[0];
                    handleSelectMessage(sample);
                  }}
                  onOpenQuickPrompt={handleOpenQuickPrompt}
                />
              )}

              {currentScreen === 'assistant' && (
                <AssistantScreen
                  activeModel={activeModel}
                  initialPrompt={initialAssistantPrompt}
                  onClearInitialPrompt={() => setInitialAssistantPrompt('')}
                  onNavigate={navigateTo}
                  onAddApprovalRequest={(req) => setApprovalRequests((prev) => [req, ...prev])}
                  onExecuteApprovalDirect={(id) => handleApproveAction(id)}
                />
              )}

              {currentScreen === 'search' && (
                <SearchScreen
                  chats={chats}
                  messages={messages}
                  onExecuteSearch={handleExecuteSearch}
                  onNavigateToMessage={handleSelectMessage}
                />
              )}

              {currentScreen === 'search_results' && (
                <SearchResultsScreen
                  query={searchQuery}
                  results={searchResults}
                  onSelectMessage={handleSelectMessage}
                  onBack={handleBack}
                  onAskAiAboutMessage={(msg) => {
                    handleOpenQuickPrompt(`Draft a reply to message from ${msg.senderName}: "${msg.text}"`);
                  }}
                />
              )}

              {currentScreen === 'message_nav' && selectedMessage && (
                <MessageNavScreen
                  message={selectedMessage}
                  onBack={handleBack}
                  onProposeAction={handleProposeMessageAction}
                  onSummarizeMessage={() => {
                    handleOpenQuickPrompt(`Summarize conversation thread around: "${selectedMessage.text}"`);
                  }}
                />
              )}

              {currentScreen === 'approval_center' && (
                <ApprovalCenterScreen
                  requests={approvalRequests}
                  onApprove={handleApproveAction}
                  onReject={handleRejectAction}
                  onUpdateParameters={handleUpdateActionParameters}
                />
              )}

              {currentScreen === 'automations' && (
                <AutomationsScreen
                  automations={automations}
                  onToggleAutomation={handleToggleAutomation}
                  onTriggerNow={handleTriggerAutomation}
                />
              )}

              {currentScreen === 'activity' && (
                <ActivityScreen
                  logs={actionLogs}
                  pendingApprovalsCount={approvalRequests.length}
                  onNavigate={navigateTo}
                />
              )}

              {currentScreen === 'ai_models' && (
                <AIModelsScreen
                  models={models}
                  activeModelId={activeModelId}
                  onSetActiveModel={handleSetActiveModel}
                  onSetDefaultModel={handleSetDefaultModel}
                  onAddModel={handleAddModel}
                  onUpdateModel={handleUpdateModel}
                  onDeleteModel={handleDeleteModel}
                />
              )}

              {currentScreen === 'security' && (
                <SecurityScreen
                  onWipeSession={() => {
                    setTdlibStatus('auth_required');
                    setCurrentScreen('telegram_auth');
                  }}
                />
              )}

              {currentScreen === 'settings' && (
                <SettingsScreen
                  activeModel={activeModel}
                  onNavigate={navigateTo}
                  onLogoutTelegram={() => {
                    setTdlibStatus('auth_required');
                    setCurrentScreen('telegram_auth');
                  }}
                />
              )}
            </div>

            {/* Bottom 5-Tab Navigation Bar */}
            {showBottomNav && (
              <BottomNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
                pendingApprovalsCount={approvalRequests.length}
              />
            )}
          </PhoneFrame>
        </div>

        {/* Expanded View: Studio Diagnostic & Source Code Console */}
        {viewMode === 'expanded' && (
          <StudioConsole
            activeModel={activeModel}
            pendingApprovals={approvalRequests}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}
      </div>

      {/* APK & Project Export Modal */}
      <ProjectExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
