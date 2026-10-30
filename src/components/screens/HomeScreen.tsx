import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Sparkles,
  Search,
  Pin,
  Archive,
  ChevronRight,
  MessageSquare,
  Lock,
  ArrowUpRight,
  CheckCircle,
} from 'lucide-react';
import { ActionApprovalRequest, ModelProviderConfig, ScreenId, TelegramChat } from '../../types';

interface HomeScreenProps {
  activeModel: ModelProviderConfig | undefined;
  pendingApprovals: ActionApprovalRequest[];
  chats: TelegramChat[];
  onNavigate: (screen: ScreenId) => void;
  onSelectChat: (chat: TelegramChat) => void;
  onOpenQuickPrompt: (prompt: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeModel,
  pendingApprovals,
  chats,
  onNavigate,
  onSelectChat,
  onOpenQuickPrompt,
}) => {
  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col p-4 space-y-4 select-none overflow-y-auto">
      {/* Top Greeting & Status */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
            Personal Telegram Client
          </span>
          <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
            <span>Welcome, Alex</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </h1>
        </div>

        <button
          onClick={() => onNavigate('security')}
          className="p-1.5 rounded-lg bg-[#0E1528] border border-indigo-950/80 text-slate-400 hover:text-cyan-300 transition-colors"
          title="Security Center"
        >
          <Lock className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Pending Approvals Urgent Card (if any) */}
      {pendingApprovals.length > 0 && (
        <div
          onClick={() => onNavigate('approval_center')}
          className="bg-gradient-to-r from-amber-950/70 to-[#1A1208] border border-amber-800/60 rounded-2xl p-3.5 shadow-lg shadow-amber-950/30 flex items-center justify-between cursor-pointer group hover:border-amber-600/80 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-200">
                  {pendingApprovals.length} Action{pendingApprovals.length > 1 ? 's' : ''} Require Approval
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-300 font-mono">
                  High & Medium Risk
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 line-clamp-1 mt-0.5">
                {pendingApprovals[0].summary}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>
      )}

      {/* Active AI Model Configuration Pill Card */}
      <div className="bg-[#0E1528] border border-indigo-900/50 rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono text-slate-400">Active AI Model</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/40">
                {activeModel?.providerType === 'GEMINI_NATIVE' ? 'Gemini Native' : 'OpenAI-Comp'}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-100 tracking-tight mt-0.5">
              {activeModel?.displayName || 'Google Gemini 3.8 Flash'}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('ai_models')}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-900/60 hover:bg-indigo-900/60 transition-colors"
        >
          Change
        </button>
      </div>

      {/* Quick Agent Actions / Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Command Suggestions</span>
          </span>
          <button
            onClick={() => onNavigate('assistant')}
            className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
          >
            Open Assistant →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-left">
          <button
            onClick={() => onOpenQuickPrompt("Search for Elena's TDLib patch message and summarize")}
            className="p-2.5 rounded-xl bg-[#0E1528]/80 hover:bg-[#141E38] border border-slate-800/60 hover:border-indigo-600/40 text-left transition-all group"
          >
            <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 line-clamp-1">
              Find TDLib Patch
            </div>
            <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
              Search & summarize in chat
            </div>
          </button>

          <button
            onClick={() => onOpenQuickPrompt('Draft a message to Sarah Jenkins confirming Keystore AES-256 compliance')}
            className="p-2.5 rounded-xl bg-[#0E1528]/80 hover:bg-[#141E38] border border-slate-800/60 hover:border-indigo-600/40 text-left transition-all group"
          >
            <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 line-clamp-1">
              Draft Reply to Sarah
            </div>
            <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
              Generates approval proposal
            </div>
          </button>

          <button
            onClick={() => onOpenQuickPrompt('Pin announcement in Android Core Architects')}
            className="p-2.5 rounded-xl bg-[#0E1528]/80 hover:bg-[#141E38] border border-slate-800/60 hover:border-indigo-600/40 text-left transition-all group"
          >
            <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 line-clamp-1">
              Pin Team Message
            </div>
            <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
              Requires human confirmation
            </div>
          </button>

          <button
            onClick={() => onOpenQuickPrompt('Find all messages containing .patch or .pdf in last 7 days')}
            className="p-2.5 rounded-xl bg-[#0E1528]/80 hover:bg-[#141E38] border border-slate-800/60 hover:border-indigo-600/40 text-left transition-all group"
          >
            <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 line-clamp-1">
              Filter Attachments
            </div>
            <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
              Local TDLib document query
            </div>
          </button>
        </div>
      </div>

      {/* Recent Chats Section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">Recent Chats (TDLib Local)</span>
          <button
            onClick={() => onNavigate('search')}
            className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <Search className="w-3 h-3" />
            <span>Search All</span>
          </button>
        </div>

        <div className="space-y-1.5">
          {chats.slice(0, 5).map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className="p-2.5 rounded-xl bg-[#0E1528]/60 hover:bg-[#121B32] border border-slate-800/40 hover:border-indigo-900/60 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-tr ${chat.avatarColor} flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md`}
                >
                  {chat.title.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                      {chat.title}
                    </span>
                    {chat.isPinned && <Pin className="w-3 h-3 text-cyan-400 shrink-0 rotate-45" />}
                    {chat.isArchived && <Archive className="w-3 h-3 text-slate-500 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {chat.lastMessageText}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 ml-2">
                <div className="text-[10px] text-slate-500 font-mono">{chat.lastMessageTime}</div>
                {chat.unreadCount > 0 && (
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px]">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
