import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  Play,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  Sliders,
  Radio,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { ModelProviderConfig, ProviderType, ApiFormat } from '../../types';
import { AIProviderService } from '../../services/aiProviderService';

interface AIModelsScreenProps {
  models: ModelProviderConfig[];
  activeModelId: string;
  onSetActiveModel: (id: string) => void;
  onSetDefaultModel: (id: string) => void;
  onAddModel: (model: ModelProviderConfig) => void;
  onUpdateModel: (model: ModelProviderConfig) => void;
  onDeleteModel: (id: string) => void;
}

export const AIModelsScreen: React.FC<AIModelsScreenProps> = ({
  models,
  activeModelId,
  onSetActiveModel,
  onSetDefaultModel,
  onAddModel,
  onUpdateModel,
  onDeleteModel,
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, { success: boolean; message: string; latency?: number }>
  >({});
  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});

  // Section 3: Add new provider state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newProviderType, setNewProviderType] = useState<ProviderType>('OPENAI_COMPATIBLE');
  const [newBaseUrl, setNewBaseUrl] = useState('https://api.openai.com/v1');
  const [newApiKey, setNewApiKey] = useState('');
  const [newModelName, setNewModelName] = useState('gpt-4o-mini');
  const [newApiFormat, setNewApiFormat] = useState<ApiFormat>('OPENAI_CHAT_COMPLETIONS');
  const [newShowKey, setNewShowKey] = useState(false);
  const [newTemperature, setNewTemperature] = useState(0.5);
  const [newMaxTokens, setNewMaxTokens] = useState(2048);
  const [newTimeout, setNewTimeout] = useState(30);
  const [newStreaming, setNewStreaming] = useState(true);

  // Deletion warning modal state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const activeModel = models.find((m) => m.id === activeModelId) || models[0];

  const handleTestConnection = async (model: ModelProviderConfig) => {
    setTestingId(model.id);
    const result = await AIProviderService.testConnection(model);
    setTestResults((prev) => ({
      ...prev,
      [model.id]: {
        success: result.success,
        message: result.message,
        latency: result.latencyMs,
      },
    }));
    setTestingId(null);
  };

  const handleProviderTypeChange = (type: ProviderType) => {
    setNewProviderType(type);
    if (type === 'GEMINI_NATIVE') {
      setNewDisplayName('Google Gemini Custom');
      setNewBaseUrl('https://generativelanguage.googleapis.com');
      setNewModelName('gemini-3.8-flash');
      setNewApiFormat('GEMINI_REST_V1BETA');
    } else {
      setNewDisplayName('OpenAI Endpoint');
      setNewBaseUrl('https://api.openai.com/v1');
      setNewModelName('gpt-4o-mini');
      setNewApiFormat('OPENAI_CHAT_COMPLETIONS');
    }
  };

  const handleSaveNewProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName || !newModelName) return;

    const newConfig: ModelProviderConfig = {
      id: `model-${Date.now()}`,
      providerName: newProviderType === 'GEMINI_NATIVE' ? 'Google Gemini' : 'Custom Provider',
      providerType: newProviderType,
      displayName: newDisplayName,
      baseUrl: newBaseUrl,
      apiKey: newApiKey,
      modelName: newModelName,
      apiFormat: newApiFormat,
      temperature: newTemperature,
      maxOutputTokens: newMaxTokens,
      enabled: true,
      isDefault: false,
      requestTimeoutSeconds: newTimeout,
      streamingPreferred: newStreaming,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onAddModel(newConfig);
    setShowAddForm(false);
    // Reset form
    setNewDisplayName('');
    setNewApiKey('');
  };

  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col p-4 select-none overflow-y-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>AI Models</span>
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-800/40">
            Provider Independent
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Switch models without rebuilding the APK. Gemini is default; OpenAI-compatible endpoints fully supported.
        </p>
      </div>

      {/* SECTION 1 — Active Model */}
      <section className="bg-gradient-to-br from-[#121B32] to-[#0E1528] border-2 border-indigo-600/70 rounded-2xl p-4 shadow-xl shadow-indigo-950/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Section 1 — Active Model
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-[10px] text-emerald-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>In Use by All Agents</span>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100 tracking-tight">
              {activeModel?.displayName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
              <span className="text-slate-400">Model:</span>
              <span className="font-mono text-cyan-300 font-semibold">{activeModel?.modelName}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {activeModel?.providerType === 'GEMINI_NATIVE' ? 'Gemini Native' : 'OpenAI-Compatible'}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleTestConnection(activeModel)}
            disabled={testingId === activeModel.id}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {testingId === activeModel.id ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Test Connection</span>
          </button>
        </div>

        {/* Test Result Message */}
        {testResults[activeModel.id] && (
          <div
            className={`mt-3 p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
              testResults[activeModel.id].success
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-red-950/40 border-red-800/60 text-red-300'
            }`}
          >
            {testResults[activeModel.id].success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">{testResults[activeModel.id].message}</p>
              {testResults[activeModel.id].latency && (
                <span className="text-[10px] font-mono text-slate-400">
                  Roundtrip latency: {testResults[activeModel.id].latency}ms
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2 — Saved Providers */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Section 2 — Saved Providers ({models.length})
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Provider</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {models.map((model) => {
            const isActive = model.id === activeModelId;
            const isShowingKey = showKeyMap[model.id] || false;
            const res = testResults[model.id];

            return (
              <div
                key={model.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-[#0E1528] border-indigo-500/80 shadow-md'
                    : 'bg-[#0A0E1A] border-slate-800/60 hover:border-slate-700'
                }`}
              >
                {/* Header of provider card */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSetActiveModel(model.id)}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isActive
                          ? 'border-cyan-400 bg-cyan-400'
                          : 'border-slate-600 hover:border-cyan-400'
                      }`}
                      title={isActive ? 'Active model' : 'Click to activate this model'}
                    >
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </button>
                    <span className="text-xs font-bold text-slate-100 tracking-tight">
                      {model.displayName}
                    </span>
                    {model.isDefault && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-800/40">
                        Default
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-mono font-medium ${
                      isActive ? 'text-cyan-400 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Metadata details */}
                <div className="bg-[#080C16] rounded-xl p-2.5 mb-2.5 text-[11px] font-mono space-y-1 border border-slate-900">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Model:</span>
                    <span className="text-cyan-300 font-semibold">{model.modelName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Type:</span>
                    <span className="text-slate-300">
                      {model.providerType === 'GEMINI_NATIVE' ? 'Gemini Native' : 'OpenAI Compatible'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Base URL:</span>
                    <span className="text-slate-300 truncate max-w-[180px]">{model.baseUrl}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>API Key:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-300">
                        {isShowingKey
                          ? model.apiKey || '(Environment Key)'
                          : AIProviderService.maskKey(model.apiKey)}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setShowKeyMap((prev) => ({ ...prev, [model.id]: !isShowingKey }))
                        }
                        className="text-slate-500 hover:text-slate-300"
                      >
                        {isShowingKey ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Test Feedback banner */}
                {res && (
                  <div
                    className={`mb-2.5 p-2 rounded-lg text-[11px] flex items-center justify-between border ${
                      res.success
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                        : 'bg-red-950/30 border-red-800/40 text-red-300'
                    }`}
                  >
                    <span className="truncate">{res.message}</span>
                    {res.latency && <span className="font-mono shrink-0 ml-1">{res.latency}ms</span>}
                  </div>
                )}

                {/* Card actions: Activate, Set Default, Test, Delete */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <button
                        onClick={() => onSetActiveModel(model.id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 font-medium transition-colors"
                      >
                        Activate
                      </button>
                    )}
                    {!model.isDefault && (
                      <button
                        onClick={() => onSetDefaultModel(model.id)}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestConnection(model)}
                      disabled={testingId === model.id}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1 transition-colors"
                    >
                      {testingId === model.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                      <span>Test</span>
                    </button>

                    <button
                      onClick={() => setConfirmDeleteId(model.id)}
                      className="p-1 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                      title="Delete provider profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3 — Add New Provider Form (Collapsible / Toggleable) */}
      {showAddForm && (
        <section className="bg-[#0E1528] border border-cyan-800/50 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Section 3 — Add New Provider
            </span>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveNewProvider} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Provider Display Name
              </label>
              <input
                type="text"
                required
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="e.g. Together AI DeepSeek, Groq Llama, Private Gateway"
                className="w-full bg-[#080C16] border border-indigo-950 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Provider Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleProviderTypeChange('GEMINI_NATIVE')}
                  className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    newProviderType === 'GEMINI_NATIVE'
                      ? 'bg-indigo-950 border-cyan-500 text-cyan-300'
                      : 'bg-[#080C16] border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Gemini Native</div>
                  <div className="text-[10px] text-slate-500">Google v1beta REST</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleProviderTypeChange('OPENAI_COMPATIBLE')}
                  className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    newProviderType === 'OPENAI_COMPATIBLE'
                      ? 'bg-indigo-950 border-cyan-500 text-cyan-300'
                      : 'bg-[#080C16] border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold">OpenAI-Compatible</div>
                  <div className="text-[10px] text-slate-500">Custom Base URL</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Base URL</label>
              <input
                type="url"
                required
                value={newBaseUrl}
                onChange={(e) => setNewBaseUrl(e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="w-full bg-[#080C16] border border-indigo-950 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">API Key</label>
                <button
                  type="button"
                  onClick={() => setNewShowKey(!newShowKey)}
                  className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                >
                  {newShowKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{newShowKey ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={newShowKey ? 'text' : 'password'}
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                placeholder="sk-... or Google AIza..."
                className="w-full bg-[#080C16] border border-indigo-950 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Saved encrypted in Android Keystore AES-256-GCM.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Model Identifier
              </label>
              <input
                type="text"
                required
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="e.g. gemini-3.8-flash, gpt-4o, llama-3.3-70b-versatile"
                className="w-full bg-[#080C16] border border-indigo-950 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
              />
            </div>

            {/* SECTION 5 — Advanced Parameters */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Section 5 — Advanced Parameters
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                    <span>Temperature</span>
                    <span className="font-mono text-cyan-400">{newTemperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={newTemperature}
                    onChange={(e) => setNewTemperature(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                    <span>Max Tokens</span>
                    <span className="font-mono text-cyan-400">{newMaxTokens}</span>
                  </div>
                  <input
                    type="number"
                    min="256"
                    max="8192"
                    step="256"
                    value={newMaxTokens}
                    onChange={(e) => setNewMaxTokens(parseInt(e.target.value))}
                    className="w-full bg-[#080C16] border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Streaming response preference</span>
                <input
                  type="checkbox"
                  checked={newStreaming}
                  onChange={(e) => setNewStreaming(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 text-white text-xs font-semibold shadow-md transition-all cursor-pointer mt-2"
            >
              Save Model Configuration
            </button>
          </form>
        </section>
      )}

      {/* Warning Modal on Deleting Active Provider */}
      {confirmDeleteId && (
        <div className="p-3.5 rounded-2xl bg-red-950/50 border border-red-800/80 text-xs space-y-2">
          <div className="flex items-center gap-2 text-red-300 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Confirm Provider Deletion</span>
          </div>
          <p className="text-slate-300">
            {confirmDeleteId === activeModelId
              ? 'Warning: You are deleting the ACTIVE AI provider! If no other provider is configured, the assistant will become unavailable.'
              : 'Are you sure you want to permanently delete this provider configuration?'}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                onDeleteModel(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
