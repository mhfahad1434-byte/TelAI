import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  Image,
  Link2,
  Calendar,
  User,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { ScreenId, TelegramChat, TelegramMessage } from '../../types';

interface SearchScreenProps {
  chats: TelegramChat[];
  messages: TelegramMessage[];
  onExecuteSearch: (query: string, mediaType?: string, chatId?: number) => void;
  onNavigateToMessage: (message: TelegramMessage) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  chats,
  messages,
  onExecuteSearch,
  onNavigateToMessage,
}) => {
  const [query, setQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');
  const [selectedChatId, setSelectedChatId] = useState<number | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState('anytime');

  const mediaFilters = [
    { id: 'all', label: 'All Types', icon: MessageSquare },
    { id: 'document', label: 'Documents', icon: FileText },
    { id: 'photo', label: 'Photos/Media', icon: Image },
    { id: 'link', label: 'Links', icon: Link2 },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteSearch(
      query,
      selectedMediaType === 'all' ? undefined : selectedMediaType,
      selectedChatId
    );
  };

  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col p-4 space-y-4 select-none overflow-y-auto">
      {/* Search Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-sm font-bold text-slate-100 tracking-tight">Telegram Local Search</h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 font-mono border border-indigo-800/40">
            TDLib Offline Index
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Account-wide conventional search without cloud ingestion.
        </p>
      </div>

      {/* Main Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chats, messages, files, links..."
          className="w-full bg-[#0E1528] border border-indigo-950 focus:border-cyan-500 rounded-xl pl-9 pr-20 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Filter Tabs by Type */}
      <div>
        <span className="text-[11px] font-medium text-slate-400 mb-1.5 block">Message Type</span>
        <div className="grid grid-cols-2 gap-1.5">
          {mediaFilters.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedMediaType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedMediaType(tab.id)}
                className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-indigo-950 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-[#0E1528]/80 border-slate-800/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter by Target Chat */}
      <div>
        <span className="text-[11px] font-medium text-slate-400 mb-1.5 block">Scope to Chat</span>
        <select
          value={selectedChatId || ''}
          onChange={(e) =>
            setSelectedChatId(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-full bg-[#0E1528] border border-indigo-950 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
        >
          <option value="">All Account Chats</option>
          {chats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Search Chips */}
      <div>
        <span className="text-[11px] font-medium text-slate-400 mb-1.5 block">Recent Queries</span>
        <div className="flex flex-wrap gap-1.5">
          {['TDLib patch', 'Keystore GCM', 'Sarah Jenkins', 'Elena Rostova', 'architecture.png'].map(
            (term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  onExecuteSearch(term, selectedMediaType === 'all' ? undefined : selectedMediaType);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#0E1528] hover:bg-[#141E38] border border-slate-800 text-[11px] text-slate-300 transition-colors"
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>

      {/* Recent matching hits preview */}
      <div className="flex-1">
        <span className="text-[11px] font-medium text-slate-400 mb-1.5 block">
          Recent Index Hits ({messages.length})
        </span>
        <div className="space-y-1.5">
          {messages.slice(0, 3).map((msg) => (
            <div
              key={msg.id}
              onClick={() => onNavigateToMessage(msg)}
              className="p-2.5 rounded-xl bg-[#0E1528]/80 hover:bg-[#141E38] border border-slate-800/40 hover:border-indigo-900/60 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                <span className="font-semibold text-cyan-300">{msg.chatTitle}</span>
                <span>{msg.date}</span>
              </div>
              <p className="text-xs text-slate-200 line-clamp-2 leading-snug">
                <span className="font-medium text-indigo-300">{msg.senderName}: </span>
                {msg.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
