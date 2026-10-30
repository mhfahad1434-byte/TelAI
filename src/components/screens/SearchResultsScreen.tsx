import React from 'react';
import { ArrowLeft, MessageSquare, FileText, Image, Link2, Sparkles, ChevronRight } from 'lucide-react';
import { TelegramMessage } from '../../types';

interface SearchResultsScreenProps {
  query: string;
  results: TelegramMessage[];
  onSelectMessage: (msg: TelegramMessage) => void;
  onBack: () => void;
  onAskAiAboutMessage: (msg: TelegramMessage) => void;
}

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  query,
  results,
  onSelectMessage,
  onBack,
  onAskAiAboutMessage,
}) => {
  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col p-4 select-none overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-indigo-950/60">
        <button
          onClick={onBack}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xs font-bold text-slate-100 tracking-tight">Search Results</h2>
          <p className="text-[10px] text-slate-400">
            Query: <span className="text-cyan-300 font-mono">"{query}"</span> ({results.length} hit
            {results.length !== 1 ? 's' : ''})
          </p>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-2 flex-1">
        {results.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No matching messages found in local TDLib cache.
          </div>
        ) : (
          results.map((msg) => (
            <div
              key={msg.id}
              className="p-3 rounded-2xl bg-[#0E1528] border border-indigo-950/70 hover:border-indigo-600/50 transition-all space-y-2"
            >
              <div
                onClick={() => onSelectMessage(msg)}
                className="cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-cyan-300 group-hover:underline">
                    {msg.chatTitle}
                  </span>
                  <span className="font-mono">{msg.date}</span>
                </div>

                <div className="text-xs text-slate-200">
                  <span className="font-medium text-indigo-300">{msg.senderName}: </span>
                  <span>{msg.text}</span>
                </div>

                {msg.fileName && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 bg-[#080C16] px-2 py-1 rounded-lg border border-slate-800/80 w-fit">
                    <FileText className="w-3 h-3" />
                    <span>{msg.fileName}</span>
                  </div>
                )}
              </div>

              {/* Action shortcuts */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                <button
                  onClick={() => onSelectMessage(msg)}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>Jump to message context</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onAskAiAboutMessage(msg)}
                  className="px-2 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-800/50 text-indigo-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Draft AI Reply</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
