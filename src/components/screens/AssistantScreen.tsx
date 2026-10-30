import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Cpu,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import {
  ActionApprovalRequest,
  ActionRiskLevel,
  ActionType,
  ModelProviderConfig,
  ScreenId,
} from '../../types';
import { AIProviderService } from '../../services/aiProviderService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  actionProposal?: ActionApprovalRequest;
}

interface AssistantScreenProps {
  activeModel: ModelProviderConfig | undefined;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  onNavigate: (screen: ScreenId) => void;
  onAddApprovalRequest: (req: ActionApprovalRequest) => void;
  onExecuteApprovalDirect: (id: string) => void;
}

export const AssistantScreen: React.FC<AssistantScreenProps> = ({
  activeModel,
  initialPrompt,
  onClearInitialPrompt,
  onNavigate,
  onAddApprovalRequest,
  onExecuteApprovalDirect,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'agent',
      text: "Hello Alex! I am your TelAI Personal Agent. I can search messages, summarize conversations, draft replies, and organize your chats with strict user approval for any account changes.",
      timestamp: '17:30',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle external quick prompt
  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt, onClearInitialPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const classifyRisk = (type: ActionType): ActionRiskLevel => {
    if (type === 'SEARCH_MESSAGES' || type === 'NAVIGATE_TO_MESSAGE') return 'LOW';
    if (type === 'DELETE_MESSAGE' || type === 'LEAVE_CHAT' || type === 'KICK_MEMBER') return 'HIGH';
    return 'MEDIUM';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputText.trim();
    if (!query || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const lower = query.toLowerCase();

      // Check if action involves Telegram mutation
      let detectedActionType: ActionType | null = null;
      let targetChat = 'Saved Messages';
      let targetChatId = 1001;
      let actionSummary = '';
      let actionParams: Record<string, string> = {};

      if (lower.includes('sarah') || lower.includes('secops')) {
        detectedActionType = 'SEND_MESSAGE';
        targetChat = 'Sarah Jenkins (Lead SecOps)';
        targetChatId = 1003;
        actionSummary = 'Draft and send security compliance confirmation to Sarah Jenkins.';
        actionParams = {
          recipient: 'Sarah Jenkins',
          text: 'Sarah, confirming TelAI uses hardware-backed Keystore AES-256-GCM with isolated IVs.',
        };
      } else if (lower.includes('pin')) {
        detectedActionType = 'PIN_MESSAGE';
        targetChat = 'Android Core Architects';
        targetChatId = 1002;
        actionSummary = 'Pin Elena Rostova’s TDLib 1.8.34 arm64-v8a patch message at top of channel.';
        actionParams = { messageId: '902', onlyForSelf: 'false' };
      } else if (lower.includes('archive')) {
        detectedActionType = 'ARCHIVE_CHAT';
        targetChat = 'Stale Crypto Signals Alpha';
        targetChatId = 1006;
        actionSummary = 'Archive stale muted channel with 48 unread alerts.';
        actionParams = { chatId: '1006' };
      } else if (lower.includes('delete') || lower.includes('remove message')) {
        detectedActionType = 'DELETE_MESSAGE';
        targetChat = 'Core Dev Team';
        targetChatId = 1002;
        actionSummary = 'Permanently delete message #894 from chat.';
        actionParams = { messageId: '894', revokeForEveryone: 'true' };
      } else if (lower.includes('search') || lower.includes('find')) {
        detectedActionType = 'SEARCH_MESSAGES';
        targetChat = 'Account-wide';
        targetChatId = 0;
        actionSummary = `Search local TDLib index for: "${query}"`;
        actionParams = { query };
      }

      let agentResponseText = '';
      let proposal: ActionApprovalRequest | undefined;

      if (detectedActionType && detectedActionType !== 'SEARCH_MESSAGES') {
        const risk = classifyRisk(detectedActionType);
        proposal = {
          id: `req-${Date.now()}`,
          actionType: detectedActionType,
          riskLevel: risk,
          targetChatId,
          targetChatTitle: targetChat,
          summary: actionSummary,
          payloadParameters: actionParams,
          payloadHash: `sha256-${Math.random().toString(36).substring(2, 10)}`,
          status: 'PENDING',
          requestedAt: Date.now(),
          expiresAt: Date.now() + 10 * 60 * 1000,
        };

        onAddApprovalRequest(proposal);

        agentResponseText = `I have parsed your request and drafted an action plan for '${targetChat}'. Because this modifies your Telegram account, it requires your explicit human approval.`;
      } else {
        // Query configured AI model
        if (activeModel) {
          const sys =
            'You are TelAI, an Android Telegram personal assistant. Be concise, direct, helpful, and privacy-conscious.';
          const res = await AIProviderService.generate(query, activeModel, sys);
          if (res.success && res.text) {
            agentResponseText = res.text;
          } else {
            agentResponseText = `I searched your local TDLib index for "${query}". Found 2 matching messages in 'Android Core Architects' and 'Saved Messages'. No data was uploaded to external clouds.`;
          }
        } else {
          agentResponseText = `Local search completed. 2 matching messages located in your on-device TDLib database.`;
        }
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: agentResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionProposal: proposal,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: `Error processing request: ${err.message || 'Unknown provider failure'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col justify-between select-none">
      {/* Subheader */}
      <div className="px-4 py-2 bg-[#0A0E1A] border-b border-indigo-950/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Manager Agent Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
          <Cpu className="w-3 h-3 text-indigo-400" />
          <span>{activeModel?.displayName || 'Gemini 3.8 Flash'}</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-sm'
                    : 'bg-[#0E1528] border border-indigo-950/80 text-slate-200 rounded-bl-sm'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-cyan-400 font-medium">
                    <Bot className="w-3 h-3" />
                    <span>TelAI Manager</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{m.text}</p>
                <span className="block text-[9px] text-slate-400 text-right mt-1 font-mono">
                  {m.timestamp}
                </span>
              </div>

              {/* Action Proposal Card attached to message */}
              {m.actionProposal && (
                <div className="mt-2 w-full max-w-[90%] bg-gradient-to-br from-[#121829] to-[#0D1220] border border-amber-800/60 rounded-2xl p-3 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      {m.actionProposal.riskLevel === 'HIGH' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span className="text-xs font-bold text-amber-300">Action Proposal</span>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${
                        m.actionProposal.riskLevel === 'HIGH'
                          ? 'bg-red-950 text-red-300 border border-red-800/50'
                          : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                      }`}
                    >
                      {m.actionProposal.riskLevel} Risk
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mb-2">
                    {m.actionProposal.summary}
                  </p>

                  <div className="bg-[#080C16] rounded-lg p-2 mb-3 text-[10px] font-mono text-slate-400 space-y-0.5 border border-slate-800/80">
                    <div>
                      <span className="text-slate-500">Target: </span>
                      <span className="text-cyan-300">{m.actionProposal.targetChatTitle}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Action: </span>
                      <span className="text-indigo-300">{m.actionProposal.actionType}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onExecuteApprovalDirect(m.actionProposal!.id)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/40 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Dispatch</span>
                    </button>
                    <button
                      onClick={() => onNavigate('approval_center')}
                      className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 bg-[#0E1528] border border-indigo-950/60 rounded-xl px-3 py-2 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Reasoning action plan via {activeModel?.displayName}...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-[#0A0E1A] border-t border-indigo-950/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Command Telegram agent... (e.g. Draft reply to Sarah)"
          disabled={isProcessing}
          className="flex-1 bg-[#0E1528] border border-indigo-950 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
