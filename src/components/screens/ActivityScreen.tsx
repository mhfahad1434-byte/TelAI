import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Shield,
} from 'lucide-react';
import { ActionLogItem, ScreenId } from '../../types';

interface ActivityScreenProps {
  logs: ActionLogItem[];
  pendingApprovalsCount: number;
  onNavigate: (screen: ScreenId) => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({
  logs,
  pendingApprovalsCount,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'EXECUTED' | 'REJECTED'>('ALL');

  const filteredLogs = logs.filter((l) => (filter === 'ALL' ? true : l.status === filter));

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `telai_action_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col p-4 select-none overflow-y-auto space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Activity & Audit Trail</span>
          </h1>
          <button
            onClick={handleExportJson}
            className="text-[10px] px-2 py-1 rounded-lg bg-[#0E1528] hover:bg-[#141E38] text-slate-300 border border-slate-800 flex items-center gap-1 transition-colors"
            title="Download audit log JSON"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>Export JSON</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Auditable chronological record of every Telegram action proposed or executed.
        </p>
      </div>

      {/* Pending Approvals Quick Banner */}
      {pendingApprovalsCount > 0 && (
        <div
          onClick={() => onNavigate('approval_center')}
          className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between cursor-pointer hover:bg-amber-950/60 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{pendingApprovalsCount} Pending Approval Request(s)</span>
          </div>
          <span className="text-[10px] text-amber-400 underline">View Queue →</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0E1528] rounded-xl border border-indigo-950/80">
        {(['ALL', 'EXECUTED', 'REJECTED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'ALL' ? 'All Logs' : tab === 'EXECUTED' ? 'Executed' : 'Rejected'}
          </button>
        ))}
      </div>

      {/* Log Feed */}
      <div className="space-y-2 flex-1">
        {filteredLogs.map((log) => {
          const isExecuted = log.status === 'EXECUTED';

          return (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-[#0E1528]/80 border border-indigo-950/70 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  {isExecuted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                  )}
                  <span>{log.actionType}</span>
                </div>

                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                    isExecuted
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                      : 'bg-red-950 text-red-300 border border-red-800/40'
                  }`}
                >
                  {log.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-300">{log.details}</p>

              <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Actor: {log.executedByAgent}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
