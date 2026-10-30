export type ProviderType = 'GEMINI_NATIVE' | 'OPENAI_COMPATIBLE';

export type ApiFormat = 'GEMINI_REST_V1BETA' | 'OPENAI_CHAT_COMPLETIONS';

export interface ModelProviderConfig {
  id: string;
  providerName: string;
  providerType: ProviderType;
  displayName: string;
  baseUrl: string;
  apiKey: string;
  modelName: string;
  apiFormat: ApiFormat;
  temperature: number;
  maxOutputTokens: number;
  enabled: boolean;
  isDefault: boolean;
  requestTimeoutSeconds: number;
  streamingPreferred: boolean;
  createdAt: number;
  updatedAt: number;
  lastTestedAt?: number;
  lastTestSuccess?: boolean;
  lastTestLatencyMs?: number;
}

export type ActionRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type ActionType =
  | 'SEARCH_MESSAGES'
  | 'NAVIGATE_TO_MESSAGE'
  | 'SEND_MESSAGE'
  | 'REPLY_MESSAGE'
  | 'FORWARD_MESSAGE'
  | 'EDIT_MESSAGE'
  | 'PIN_MESSAGE'
  | 'UNPIN_MESSAGE'
  | 'ARCHIVE_CHAT'
  | 'DELETE_MESSAGE'
  | 'LEAVE_CHAT'
  | 'KICK_MEMBER';

export type ApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXECUTED'
  | 'INVALIDATED'
  | 'EXPIRED';

export interface ActionApprovalRequest {
  id: string;
  actionType: ActionType;
  riskLevel: ActionRiskLevel;
  targetChatId: number;
  targetChatTitle: string;
  targetMessageId?: number;
  summary: string;
  payloadParameters: Record<string, string>;
  payloadHash: string;
  status: ApprovalStatus;
  requestedAt: number;
  expiresAt: number;
}

export interface ActionLogItem {
  id: string;
  actionType: ActionType;
  riskLevel: ActionRiskLevel;
  targetChatTitle: string;
  status: 'EXECUTED' | 'REJECTED' | 'FAILED' | 'INVALIDATED';
  executedByAgent: string;
  timestamp: number;
  details: string;
}

export interface TelegramChat {
  id: number;
  title: string;
  unreadCount: number;
  lastMessageText: string;
  lastMessageTime: string;
  isGroup: boolean;
  isChannel: boolean;
  isArchived: boolean;
  isPinned: boolean;
  avatarColor: string;
}

export interface TelegramMessage {
  id: number;
  chatId: number;
  chatTitle: string;
  senderName: string;
  senderId: number;
  text: string;
  date: string;
  timestamp: number;
  mediaType?: 'photo' | 'document' | 'voice' | 'link';
  fileName?: string;
  isOutgoing: boolean;
}

export interface AutomationItem {
  id: string;
  name: string;
  triggerType: 'SCHEDULE' | 'KEYWORD_MATCH' | 'NEW_MESSAGE';
  triggerDetails: string;
  actionSummary: string;
  enabled: boolean;
  lastRun?: string;
  runCount: number;
}

export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'telegram_auth'
  | 'home'
  | 'assistant'
  | 'search'
  | 'search_results'
  | 'message_nav'
  | 'approval_center'
  | 'automations'
  | 'activity'
  | 'ai_models'
  | 'security'
  | 'settings';
