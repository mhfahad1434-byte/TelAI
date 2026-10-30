import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Shield,
  Zap,
  Cloud,
  Database,
  Trash2,
  LogOut,
  ChevronRight,
  ExternalLink,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { ModelProviderConfig, ScreenId } from '../../types';

interface SettingsScreenProps {
  activeModel: ModelProviderConfig | undefined;
  onNavigate: (screen: ScreenId) => void;
  onLogoutTelegram: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  activeModel,
  onNavigate,
  onLogoutTelegram,
}) => {
  const [cacheSize, setCacheSize] = useState('42.8 MB');
  const [cloudflareUrl, setCloudflareUrl] = useState('https://telai-cloud-worker.workers.dev');
  const [supabaseStatus, setSupabaseStatus] = useState('Active (RLS Enforced)');
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    setCacheSize('0.0 MB');
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col p-4 select-none overflow-y-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>Application Settings</span>
        </h1>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Configure model providers, cloud integration, security, and local caches.
        </p>
      </div>

      {/* Navigation Group: AI Models & Core Features */}
      <div className="space-y-1.5">
        <div
          onClick={() => onNavigate('ai_models')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#121B32] to-[#0E1528] border border-indigo-700/60 hover:border-cyan-500/80 transition-all flex items-center justify-between cursor-pointer group shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                AI Models Architecture
              </div>
              <div className="text-[10px] text-slate-400">
                Active: {activeModel?.displayName || 'Gemini 3.8 Flash'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        <div
          onClick={() => onNavigate('automations')}
          className="p-3 rounded-2xl bg-[#0E1528] border border-indigo-950/70 hover:border-indigo-800/60 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                Agent Automations
              </div>
              <div className="text-[10px] text-slate-400">WorkManager local tasks & schedules</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        <div
          onClick={() => onNavigate('security')}
          className="p-3 rounded-2xl bg-[#0E1528] border border-indigo-950/70 hover:border-indigo-800/60 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                Security & Keystore
              </div>
              <div className="text-[10px] text-slate-400">AES-256-GCM hardware key & session status</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Cloud Integration */}
      <div className="p-3.5 rounded-2xl bg-[#0E1528] border border-indigo-950/80 space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
          Cloud Gateway & Metadata
        </span>

        <div>
          <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <Cloud className="w-3 h-3 text-cyan-400" />
            <span>Cloudflare Workers API Gateway</span>
          </label>
          <input
            type="url"
            value={cloudflareUrl}
            onChange={(e) => setCloudflareUrl(e.target.value)}
            className="w-full bg-[#080C16] border border-indigo-950 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Supabase Sync</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">{supabaseStatus}</span>
        </div>
      </div>

      {/* Local Storage & Cache */}
      <div className="p-3.5 rounded-2xl bg-[#0E1528] border border-indigo-950/80 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-200">TDLib Cached Media & Database</div>
          <div className="text-[10px] text-slate-400">Current local size: {cacheSize}</div>
        </div>
        <button
          onClick={handleClearCache}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
        >
          {cacheCleared ? 'Cleared!' : 'Clear Cache'}
        </button>
      </div>

      {/* Telegram Logout */}
      <div className="pt-2">
        <button
          onClick={onLogoutTelegram}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-red-950/60 border border-slate-700/80 hover:border-red-800/60 text-slate-300 hover:text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Disconnect Telegram Session</span>
        </button>
      </div>

      {/* Build Info */}
      <div className="text-center pt-2 text-[10px] text-slate-500 font-mono">
        <div>TelAI v1.0.0 (Build 2026-10-29)</div>
        <div>TDLib Native 1.8.35 · Jetpack Compose BOM 2024.10</div>
      </div>
    </div>
  );
};
