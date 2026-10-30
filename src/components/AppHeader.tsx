import React from 'react';
import {
  Smartphone,
  LayoutDashboard,
  ShieldCheck,
  Cpu,
  DownloadCloud,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { ModelProviderConfig } from '../types';

interface AppHeaderProps {
  viewMode: 'phone' | 'expanded';
  setViewMode: (mode: 'phone' | 'expanded') => void;
  activeModel: ModelProviderConfig | undefined;
  tdlibStatus: 'connected' | 'auth_required' | 'connecting';
  pendingApprovalsCount: number;
  onOpenExportModal: () => void;
  onNavigateToModels: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  viewMode,
  setViewMode,
  activeModel,
  tdlibStatus,
  pendingApprovalsCount,
  onOpenExportModal,
  onNavigateToModels,
}) => {
  return (
    <header className="w-full bg-[#070A12]/90 backdrop-blur-md border-b border-indigo-950/60 px-4 py-3 flex items-center justify-between z-30 select-none">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-600/20">
          <div className="w-full h-full bg-[#0A0E1A] rounded-[10px] flex items-center justify-center">
            <span className="font-black text-sm tracking-tighter bg-gradient-to-r from-indigo-300 via-cyan-300 to-white bg-clip-text text-transparent">
              T
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 tracking-tight text-sm">TelAI</span>
            <span className="text-[11px] text-slate-400 font-normal">
              Telegram AI Personal Agent
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-800/40">
              v1.0 Native Android
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>TDLib Local Session</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Android Keystore AES-256</span>
          </div>
        </div>
      </div>

      {/* Center status indicators */}
      <div className="hidden md:flex items-center gap-3">
        {/* Active AI Model Badge */}
        <button
          onClick={onNavigateToModels}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0E1528] hover:bg-[#141E38] border border-indigo-900/50 text-xs transition-colors cursor-pointer group"
          title="Click to configure AI Models"
        >
          <Cpu className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300" />
          <span className="text-slate-300">Active Model:</span>
          <span className="font-semibold text-cyan-300">
            {activeModel?.displayName || 'Google Gemini Flash'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {activeModel?.providerType === 'GEMINI_NATIVE' ? 'Native' : 'OpenAI-Comp'}
          </span>
        </button>

        {/* TDLib Status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E1528] border border-slate-800/60 text-xs text-slate-300">
          <div
            className={`w-2 h-2 rounded-full ${
              tdlibStatus === 'connected'
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                : 'bg-amber-400'
            }`}
          />
          <span className="text-slate-400">Telegram:</span>
          <span className="font-medium text-slate-200">
            {tdlibStatus === 'connected' ? 'Authorized on Device' : 'Auth Required'}
          </span>
        </div>

        {/* Approvals notification */}
        {pendingApprovalsCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/50 text-xs text-amber-300 animate-pulse">
            <span className="font-bold">{pendingApprovalsCount}</span>
            <span>Pending Approvals</span>
          </div>
        )}
      </div>

      {/* Right Actions: View Mode Switcher + Export */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#0E1528] p-0.5 rounded-lg border border-indigo-950">
          <button
            onClick={() => setViewMode('phone')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'phone'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile Phone Emulator"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phone UI</span>
          </button>
          <button
            onClick={() => setViewMode('expanded')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'expanded'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Studio Developer Console"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expanded Studio</span>
          </button>
        </div>

        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <DownloadCloud className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Android APK / Code</span>
        </button>
      </div>
    </header>
  );
};
