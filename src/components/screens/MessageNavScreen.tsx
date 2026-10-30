import React from 'react';
import {
  ArrowLeft,
  Pin,
  Reply,
  Share2,
  Trash2,
  Sparkles,
  Info,
  FileText,
  Lock,
} from 'lucide-react';
import { ActionApprovalRequest, TelegramMessage } from '../../types';

interface MessageNavScreenProps {
  message: TelegramMessage;
  onBack: () => void;
  onProposeAction: (actionType: 'REPLY_MESSAGE' | 'PIN_MESSAGE' | 'DELETE_MESSAGE') => void;
  onSummarizeMessage: () => void;
}

export const MessageNavScreen: React.FC<MessageNavScreenProps> = ({
  message,
  onBack,
  onProposeAction,
  onSummarizeMessage,
}) => {
  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col justify-between p-4 select-none overflow-y-auto">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-indigo-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xs font-bold text-slate-100 tracking-tight">
                {message.chatTitle}
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Message #{message.id} · Chat #{message.chatId}
              </p>
            </div>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-800/40">
            Local Context
          </span>
        </div>

        {/* Message Thread Simulation with Context */}
        <div className="space-y-3 mb-4">
          {/* Prior context message */}
          <div className="p-2.5 rounded-xl bg-[#0E1528]/40 border border-slate-900 text-[11px] text-slate-400 opacity-70">
            <span className="font-semibold text-slate-300">Previous Message: </span>
            <span>Checking CI status for Linux TDLib builds...</span>
          </div>

          {/* Target Message (Highlighted) */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#121B32] to-[#0E1528] border-2 border-indigo-600/60 shadow-lg shadow-indigo-950/40 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300">{message.senderName}</span>
              <span className="text-[10px] text-slate-400 font-mono">{message.date}</span>
            </div>

            <p className="text-xs text-slate-100 leading-relaxed font-normal">{message.text}</p>

            {message.fileName && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#080C16] border border-indigo-900/40 text-xs text-indigo-300 font-mono">
                <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{message.fileName}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Sender ID: {message.senderId}</span>
              <span>Encrypted on Device</span>
            </div>
          </div>

          {/* Subsequent context */}
          <div className="p-2.5 rounded-xl bg-[#0E1528]/40 border border-slate-900 text-[11px] text-slate-400 opacity-70">
            <span className="font-semibold text-slate-300">Subsequent Message: </span>
            <span>Awaiting test confirmation before tagging release candidate.</span>
          </div>
        </div>
      </div>

      {/* Action Bar for Message Operations */}
      <div className="space-y-2 pt-2 border-t border-indigo-950/60">
        <button
          onClick={onSummarizeMessage}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI to Summarize Thread & Draft Reply</span>
        </button>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onProposeAction('REPLY_MESSAGE')}
            className="p-2 rounded-xl bg-[#0E1528] hover:bg-[#141E38] border border-slate-800 hover:border-indigo-600/50 text-slate-200 text-xs font-medium flex flex-col items-center gap-1 transition-all"
          >
            <Reply className="w-4 h-4 text-cyan-400" />
            <span>Reply</span>
          </button>

          <button
            onClick={() => onProposeAction('PIN_MESSAGE')}
            className="p-2 rounded-xl bg-[#0E1528] hover:bg-[#141E38] border border-slate-800 hover:border-indigo-600/50 text-slate-200 text-xs font-medium flex flex-col items-center gap-1 transition-all"
          >
            <Pin className="w-4 h-4 text-indigo-400 rotate-45" />
            <span>Pin</span>
          </button>

          <button
            onClick={() => onProposeAction('DELETE_MESSAGE')}
            className="p-2 rounded-xl bg-[#0E1528] hover:bg-red-950/40 border border-slate-800 hover:border-red-800/60 text-red-300 text-xs font-medium flex flex-col items-center gap-1 transition-all"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
