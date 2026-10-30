import React, { useState } from 'react';
import {
  Shield,
  Lock,
  KeyRound,
  FileCheck,
  AlertTriangle,
  RefreshCw,
  Eye,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { AIProviderService } from '../../services/aiProviderService';

interface SecurityScreenProps {
  onWipeSession: () => void;
}

export const SecurityScreen: React.FC<SecurityScreenProps> = ({ onWipeSession }) => {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [testPlaintext, setTestPlaintext] = useState('MySecretTelegramApiKey_99341');
  const [encryptedOutput, setEncryptedOutput] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [showWipeDialog, setShowWipeDialog] = useState(false);

  const handleTestKeystoreEncrypt = async () => {
    setIsEncrypting(true);
    const cipher = await AIProviderService.simulateKeystoreEncrypt(testPlaintext);
    setEncryptedOutput(cipher);
    setIsEncrypting(false);
  };

  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col p-4 select-none overflow-y-auto space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Security & Keystore</span>
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800/40">
            Hardware Root of Trust
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Zero session keys uploaded to cloud. Android Keystore AES-256-GCM encryption.
        </p>
      </div>

      {/* Security Architecture Cards */}
      <div className="space-y-2">
        <div className="p-3 rounded-2xl bg-[#0E1528] border border-indigo-950/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Android Keystore</span>
            <span className="text-[10px] text-emerald-400 font-mono">ENFORCED</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 space-y-1 bg-[#080C16] p-2 rounded-xl border border-slate-900">
            <div>Alias: TelAI_Master_Secret_Key</div>
            <div>Cipher: AES/GCM/NoPadding (256-bit)</div>
            <div>IV Spec: 12-byte random per operation</div>
            <div>Auth Required: Biometric / Device Credential</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#0E1528] border border-indigo-950/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">TDLib MTProto Session</span>
            <span className="text-[10px] text-emerald-400 font-mono">DEVICE ONLY</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 space-y-1 bg-[#080C16] p-2 rounded-xl border border-slate-900">
            <div>Storage: /data/user/0/.../files/tdlib_data</div>
            <div>Network: Official Telegram MTProto v2</div>
            <div>Cloud Uploads: ZERO (Strict Invariant)</div>
          </div>
        </div>
      </div>

      {/* Biometric Toggle */}
      <div className="p-3 rounded-2xl bg-[#0E1528] border border-indigo-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-200">Biometric App Lock</div>
            <div className="text-[10px] text-slate-400">Require fingerprint or face on launch</div>
          </div>
        </div>
        <input
          type="checkbox"
          checked={biometricEnabled}
          onChange={(e) => setBiometricEnabled(e.target.checked)}
          className="rounded accent-cyan-400"
        />
      </div>

      {/* Live Keystore Encryption Simulator */}
      <div className="p-3.5 rounded-2xl bg-[#0E1528] border border-indigo-950/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Hardware Cipher Test</span>
          <button
            onClick={handleTestKeystoreEncrypt}
            disabled={isEncrypting}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            {isEncrypting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />}
            <span>Encrypt with AES-GCM</span>
          </button>
        </div>

        <input
          type="text"
          value={testPlaintext}
          onChange={(e) => setTestPlaintext(e.target.value)}
          placeholder="Plaintext API Key to encrypt..."
          className="w-full bg-[#080C16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
        />

        {encryptedOutput && (
          <div className="p-2 bg-[#080C16] rounded-xl border border-slate-900 space-y-1">
            <span className="text-[10px] text-slate-500 font-mono">Keystore Ciphertext (IV + AuthTag):</span>
            <p className="text-[10px] text-cyan-300 font-mono break-all">{encryptedOutput}</p>
          </div>
        )}
      </div>

      {/* Emergency Wipe Button */}
      <div className="pt-2">
        <button
          onClick={() => setShowWipeDialog(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Emergency Wipe TDLib Session & Keystore</span>
        </button>
      </div>

      {showWipeDialog && (
        <div className="p-3.5 rounded-2xl bg-red-950 border border-red-700 text-xs space-y-2 text-white">
          <div className="flex items-center gap-2 font-bold text-red-200">
            <AlertTriangle className="w-4 h-4" />
            <span>Confirm Factory Wipe</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            This permanently deletes all local TDLib databases, logs out from Telegram, and purges all hardware Keystore keys.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                onWipeSession();
                setShowWipeDialog(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 font-bold text-xs"
            >
              Destroy All Local Data
            </button>
            <button
              onClick={() => setShowWipeDialog(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
