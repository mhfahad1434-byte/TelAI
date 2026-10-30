import React, { useState } from 'react';
import {
  Zap,
  Clock,
  KeyRound,
  Play,
  CheckCircle2,
  Plus,
  RefreshCw,
  Power,
} from 'lucide-react';
import { AutomationItem } from '../../types';

interface AutomationsScreenProps {
  automations: AutomationItem[];
  onToggleAutomation: (id: string) => void;
  onTriggerNow: (id: string) => void;
}

export const AutomationsScreen: React.FC<AutomationsScreenProps> = ({
  automations,
  onToggleAutomation,
  onTriggerNow,
}) => {
  const [runningId, setRunningId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRun = (id: string, name: string) => {
    setRunningId(id);
    setFeedback(`Running workflow "${name}"...`);
    setTimeout(() => {
      onTriggerNow(id);
      setRunningId(null);
      setFeedback(`Workflow "${name}" completed successfully. 1 summary item posted to Saved Messages.`);
      setTimeout(() => setFeedback(null), 3500);
    }, 1200);
  };

  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col p-4 select-none overflow-y-auto space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Agent Automations</span>
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-800/40">
            WorkManager
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Automated background routines run locally without external server dependencies.
        </p>
      </div>

      {feedback && (
        <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Automations list */}
      <div className="space-y-2.5 flex-1">
        {automations.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-[#0E1528] border border-indigo-950/70 hover:border-indigo-900/60 transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    item.enabled
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 tracking-tight">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{item.triggerDetails}</span>
                  </div>
                </div>
              </div>

              {/* Power Toggle Button */}
              <button
                onClick={() => onToggleAutomation(item.id)}
                className={`p-1.5 rounded-xl border transition-all ${
                  item.enabled
                    ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400 shadow-sm'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title={item.enabled ? 'Enabled' : 'Disabled'}
              >
                <Power className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-normal bg-[#080C16] p-2 rounded-xl border border-slate-900">
              {item.actionSummary}
            </p>

            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
              <span>Last Run: {item.lastRun || 'Never'} ({item.runCount} runs)</span>

              <button
                onClick={() => handleRun(item.id, item.name)}
                disabled={runningId === item.id}
                className="px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-800/50 text-indigo-300 font-sans font-medium flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                {runningId === item.id ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Play className="w-3 h-3 fill-current" />
                )}
                <span>Run Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
