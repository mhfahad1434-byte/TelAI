import React, { useState } from 'react';
import {
  Code,
  Terminal,
  Cpu,
  Shield,
  FileText,
  Layers,
  Copy,
  Check,
  DownloadCloud,
  ExternalLink,
  ChevronRight,
  Database,
  Cloud,
} from 'lucide-react';
import { ModelProviderConfig, ActionApprovalRequest } from '../../types';

interface StudioConsoleProps {
  activeModel: ModelProviderConfig | undefined;
  pendingApprovals: ActionApprovalRequest[];
  onOpenExportModal: () => void;
}

export const StudioConsole: React.FC<StudioConsoleProps> = ({
  activeModel,
  pendingApprovals,
  onOpenExportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'agent' | 'tdlib' | 'code' | 'cloud'>('agent');
  const [selectedFile, setSelectedFile] = useState<string>('ProviderManager.kt');
  const [copied, setCopied] = useState(false);

  const fileSnippets: Record<string, { path: string; lang: string; content: string }> = {
    'ProviderManager.kt': {
      path: 'android/app/src/main/java/org/telegram/ai/agent/ai/manager/ProviderManager.kt',
      lang: 'kotlin',
      content: `// ProviderManager - Central provider-independent routing
@Singleton
class ProviderManager @Inject constructor() {
    private val _configurations = MutableStateFlow<List<ModelProviderConfig>>(emptyList())
    val configurations: StateFlow<List<ModelProviderConfig>> = _configurations.asStateFlow()

    private val _activeConfigId = MutableStateFlow<String?>("gemini-default")
    val activeConfigId: StateFlow<String?> = _activeConfigId.asStateFlow()

    suspend fun getActiveProvider(): AIProvider? {
        val config = _configurations.value.find { it.id == _activeConfigId.value }
        return when (config?.providerType) {
            ProviderType.GEMINI_NATIVE -> GeminiProvider(config)
            ProviderType.OPENAI_COMPATIBLE -> OpenAICompatibleProvider(config)
            else -> null
        }
    }
}`,
    },
    'KeystoreManager.kt': {
      path: 'android/app/src/main/java/org/telegram/ai/agent/core/security/KeystoreManager.kt',
      lang: 'kotlin',
      content: `// Hardware-backed AES-256-GCM Keystore Encryption
object KeystoreManager {
    private const val ANDROID_KEYSTORE = "AndroidKeyStore"
    private const val KEY_ALIAS = "TelAI_Master_Secret_Key"
    private const val TRANSFORMATION = "AES/GCM/NoPadding"
    private const val GCM_IV_LENGTH = 12

    fun encrypt(plaintext: String): String {
        val cipher = Cipher.getInstance(TRANSFORMATION)
        val secretKey = getOrCreateSecretKey()
        cipher.init(Cipher.ENCRYPT_MODE, secretKey)
        val iv = cipher.iv
        val encryptedBytes = cipher.doFinal(plaintext.toByteArray(Charsets.UTF_8))
        return Base64.encodeToString(iv + encryptedBytes, Base64.NO_WRAP)
    }
}`,
    },
    'TdLibClient.kt': {
      path: 'android/app/src/main/java/org/telegram/ai/agent/telegram/client/TdLibClient.kt',
      lang: 'kotlin',
      content: `// TDLib Native Client - Device-held authorization session
@Singleton
class TdLibClient @Inject constructor(private val context: Context) {
    private val tdlibDirectory = File(context.filesDir, "tdlib_data")
    private val _authState = MutableStateFlow<TdAuthState>(TdAuthState.Initial)

    // Non-negotiable: Session databases remain strictly on device
    fun submitPhoneNumber(phoneNumber: String) { ... }
    fun submitAuthenticationCode(code: String) { ... }
    fun submitPassword(cloudPassword: String) { ... }
}`,
    },
    'ManagerAgent.kt': {
      path: 'android/app/src/main/java/org/telegram/ai/agent/domain/agents/ManagerAgent.kt',
      lang: 'kotlin',
      content: `// Multi-Agent Planner with Strict Deterministic Safety Filter
@Singleton
class ManagerAgent @Inject constructor(
    private val providerManager: ProviderManager,
    private val safetyAgent: SafetyAgent
) {
    suspend fun planAction(userPrompt: String): Result<ActionApprovalRequest> {
        // Formulates JSON action plan -> classifies risk -> creates human approval ticket
        ...
    }
}`,
    },
    'cloudflare_worker.ts': {
      path: 'cloudflare/worker/src/index.ts',
      lang: 'typescript',
      content: `// Cloudflare Workers Gateway - Stateless pass-through proxy
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Redacts headers, never writes secrets to disk or logs
    if (url.pathname === "/v1/ai/gemini") { ... }
    if (url.pathname === "/v1/ai/openai-compatible") { ... }
  }
};`,
    },
    '001_initial_schema.sql': {
      path: 'database/migrations/001_initial_schema.sql',
      lang: 'sql',
      content: `-- 12 Supabase PostgreSQL Migrations with RLS
CREATE TABLE IF NOT EXISTS approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    payload_hash TEXT NOT NULL,
    parameters JSONB NOT NULL,
    status TEXT DEFAULT 'PENDING'
);
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;`,
    },
  };

  const currentFile = fileSnippets[selectedFile] || fileSnippets['ProviderManager.kt'];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 bg-[#0A0E1A] border-l border-indigo-950/80 flex flex-col h-full overflow-hidden select-none">
      {/* Console Top Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#070A12] border-b border-indigo-950/80">
        <div className="flex items-center gap-1.5 bg-[#0E1528] p-1 rounded-xl border border-indigo-950">
          <button
            onClick={() => setActiveTab('agent')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'agent'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agent Brain</span>
          </button>

          <button
            onClick={() => setActiveTab('tdlib')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'tdlib'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>TDLib Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>Android Codebase</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'cloud'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cloud & SQL</span>
          </button>
        </div>

        <button
          onClick={onOpenExportModal}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-900/60 transition-colors"
        >
          <DownloadCloud className="w-3.5 h-3.5" />
          <span>Full Project ZIP</span>
        </button>
      </div>

      {/* Main Console Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: Agent Brain & Routing */}
        {activeTab === 'agent' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#0E1528] border border-indigo-950/80 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400">Current AI Model</span>
                <div className="text-sm font-bold text-slate-100">{activeModel?.displayName}</div>
                <div className="text-xs text-cyan-400 font-mono">
                  {activeModel?.modelName} · {activeModel?.providerType}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0E1528] border border-indigo-950/80 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400">Pending Approvals</span>
                <div className="text-sm font-bold text-amber-300">{pendingApprovals.length} Enqueued</div>
                <div className="text-xs text-slate-400 font-mono">Single-use hash binding enforced</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1528] border border-indigo-950/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Multi-Agent Model Routing Architecture</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#080C16] border border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">Manager Agent:</span>
                    <span className="text-slate-400">Natural-language command parser</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300">Active Model</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#080C16] border border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">Safety Agent:</span>
                    <span className="text-slate-400">Deterministic risk & approval policy</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Local Rules (No LLM)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#080C16] border border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">Search Agent:</span>
                    <span className="text-slate-400">TDLib SQLite offline chat search</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">TDLib In-Process</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#080C16] border border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">Action Executor:</span>
                    <span className="text-slate-400">Authorized Telegram state dispatcher</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400">Human Approval Gate</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1528] border border-indigo-950/80 space-y-2">
              <span className="text-xs font-bold text-slate-200">Active Safety Constraints</span>
              <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4 leading-relaxed">
                <li>No bulk scraping or continuous AI vector embedding of user chats.</li>
                <li>Telegram messages cannot execute or approve agent actions.</li>
                <li>Modifying proposed action parameters strictly invalidates approval token.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: TDLib Telemetry */}
        {activeTab === 'tdlib' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-[#070A12] border border-slate-900 space-y-1 text-slate-300">
              <div className="text-emerald-400 font-bold">[TDLib Core 1.8.35] Client Started</div>
              <div className="text-slate-500">Parameters: use_message_database=true, use_file_database=true</div>
              <div className="text-slate-500">Database encryption: AES-256 enabled with Android Keystore</div>
              <div className="text-cyan-400">AuthorizationStateReady: UserID 819203918 (Alex Hunter)</div>
              <div className="text-slate-400">ConnectionStateReady: MTProto ping 38ms to DC 4</div>
              <div className="text-slate-500">updateChatFolders: 3 active folders synced to Room cache</div>
              <div className="text-slate-500">updateNewMessage: Received message #906 from Saved Messages</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0E1528] border border-indigo-950/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Local Database Health</span>
                <span className="text-[10px] text-emerald-400">SYNCED</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="bg-[#080C16] p-2 rounded-xl border border-slate-900">
                  <div className="text-slate-500">Cached Chats</div>
                  <div className="text-sm font-bold text-cyan-300">28</div>
                </div>
                <div className="bg-[#080C16] p-2 rounded-xl border border-slate-900">
                  <div className="text-slate-500">Messages Indexed</div>
                  <div className="text-sm font-bold text-indigo-300">1,420</div>
                </div>
                <div className="bg-[#080C16] p-2 rounded-xl border border-slate-900">
                  <div className="text-slate-500">Cloud Leaks</div>
                  <div className="text-sm font-bold text-emerald-400">0</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Android Codebase Viewer */}
        {activeTab === 'code' && (
          <div className="space-y-3">
            {/* File Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {Object.keys(fileSnippets).map((fn) => (
                <button
                  key={fn}
                  onClick={() => setSelectedFile(fn)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[11px] whitespace-nowrap transition-all ${
                    selectedFile === fn
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'bg-[#0E1528] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {fn}
                </button>
              ))}
            </div>

            {/* Code View Card */}
            <div className="rounded-2xl bg-[#070A12] border border-indigo-950/80 overflow-hidden">
              <div className="px-3.5 py-2 bg-[#0A0E1A] border-b border-indigo-950/80 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-400 truncate">
                  {currentFile.path}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] font-sans transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed bg-[#060810]">
                <code>{currentFile.content}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: Cloud & SQL */}
        {activeTab === 'cloud' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#0E1528] border border-indigo-950/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Supabase 12 Schema Migrations</span>
                <span className="text-[10px] text-emerald-400 font-mono">APPLIED</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Target: PostgreSQL with Row-Level Security on all 12 tables:
              </p>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-slate-300 bg-[#080C16] p-2.5 rounded-xl border border-slate-900">
                <div>• users</div>
                <div>• user_preferences</div>
                <div>• agent_settings</div>
                <div>• model_profiles</div>
                <div>• permissions</div>
                <div>• approval_requests</div>
                <div>• action_logs</div>
                <div>• automations</div>
                <div>• automation_runs</div>
                <div>• workflow_state</div>
                <div>• consent_records</div>
                <div>• device_sessions</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0E1528] border border-indigo-950/80 space-y-2">
              <span className="font-bold text-slate-200">Cloudflare Workers Gateway</span>
              <p className="text-[11px] text-slate-400">
                Stateless proxy that validates requests, handles Gemini / OpenAI format translation, and redacts Authorization tokens.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
