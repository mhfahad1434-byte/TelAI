import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
  Clock,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { ActionApprovalRequest, ActionRiskLevel } from '../../types';

interface ApprovalCenterScreenProps {
  requests: ActionApprovalRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onUpdateParameters: (id: string, updatedParams: Record<string, string>) => void;
}

export const ApprovalCenterScreen: React.FC<ApprovalCenterScreenProps> = ({
  requests,
  onApprove,
  onReject,
  onUpdateParameters,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editParamKey, setEditParamKey] = useState('');
  const [editParamVal, setEditParamVal] = useState('');

  const handleStartEdit = (req: ActionApprovalRequest) => {
    setEditingId(req.id);
    const firstKey = Object.keys(req.payloadParameters)[0] || 'text';
    setEditParamKey(firstKey);
    setEditParamVal(req.payloadParameters[firstKey] || '');
  };

  const handleSaveEdit = (id: string) => {
    onUpdateParameters(id, { [editParamKey]: editParamVal });
    setEditingId(null);
  };

  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col p-4 select-none overflow-y-auto">
      {/* Top Banner */}
      <div className="pb-3 mb-3 border-b border-indigo-950/60">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Action Approval Center</span>
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono border border-amber-800/40">
            {requests.length} Pending
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Explicit approval required for Telegram mutations. Telegram messages cannot approve actions.
        </p>
      </div>

      {/* Requests Queue */}
      <div className="space-y-3 flex-1">
        {requests.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-200">All Approvals Clear</h3>
            <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
              No actions pending human confirmation. The agent is in passive listening mode.
            </p>
          </div>
        ) : (
          requests.map((req) => {
            const isHigh = req.riskLevel === 'HIGH';
            const isEditing = editingId === req.id;

            return (
              <div
                key={req.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isHigh
                    ? 'bg-gradient-to-br from-[#1C0F12] to-[#140A0D] border-red-800/70 shadow-lg shadow-red-950/20'
                    : 'bg-gradient-to-br from-[#12182B] to-[#0E1424] border-indigo-900/60 shadow-lg shadow-indigo-950/30'
                }`}
              >
                {/* Card Header: Type + Risk Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {isHigh ? (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-xs font-bold text-slate-100 tracking-tight">
                      {req.actionType}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                      isHigh
                        ? 'bg-red-950 text-red-300 border border-red-800/50'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                    }`}
                  >
                    {req.riskLevel} Risk
                  </span>
                </div>

                {/* Human summary */}
                <p className="text-xs text-slate-200 leading-snug mb-2 font-medium">
                  {req.summary}
                </p>

                {/* Target & Payload bound hash */}
                <div className="bg-[#080C16] rounded-xl p-2.5 mb-3 text-[11px] font-mono space-y-1 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Target Chat:</span>
                    <span className="text-cyan-300 font-semibold">{req.targetChatTitle}</span>
                  </div>

                  {isEditing ? (
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <span className="text-amber-400 text-[10px]">
                        Warning: Editing parameters invalidates prior token and forces re-verification.
                      </span>
                      <textarea
                        value={editParamVal}
                        onChange={(e) => setEditParamVal(e.target.value)}
                        className="w-full bg-[#0E1528] border border-amber-600 rounded p-1.5 text-xs text-white"
                        rows={2}
                      />
                      <button
                        onClick={() => handleSaveEdit(req.id)}
                        className="px-2.5 py-1 rounded bg-amber-600 text-slate-950 font-bold text-[10px]"
                      >
                        Save & Invalidate Prior Hash
                      </button>
                    </div>
                  ) : (
                    Object.entries(req.payloadParameters).map(([k, v]) => (
                      <div key={k} className="text-[10px] break-all">
                        <span className="text-slate-500">{k}: </span>
                        <span className="text-slate-300">{v}</span>
                      </div>
                    ))
                  )}

                  <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500">
                    <span>Hash: {req.payloadHash}</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Expires in 8m</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onApprove(req.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
                      isHigh
                        ? 'bg-red-600 hover:bg-red-500 shadow-red-900/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isHigh ? 'Explicitly Confirm & Execute' : 'Approve & Execute'}</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(req)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    title="Edit parameters"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onReject(req.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 text-xs transition-colors"
                    title="Reject action"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
