import React, { useState } from 'react';
import { Send, KeyRound, Shield, CheckCircle2, Lock, AlertCircle, RefreshCw } from 'lucide-react';

interface TelegramAuthScreenProps {
  onAuthenticated: () => void;
}

export const TelegramAuthScreen: React.FC<TelegramAuthScreenProps> = ({ onAuthenticated }) => {
  const [authState, setAuthState] = useState<'phone' | 'code' | '2fa' | 'ready'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-8920');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      setErrorMessage('Please enter a valid international phone number.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setAuthState('code');
    }, 700);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (authCode.length < 5) {
      setErrorMessage('Please enter the 5-digit verification code.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (authCode === '22222') {
        // Trigger 2FA password flow
        setAuthState('2fa');
      } else {
        setAuthState('ready');
        setTimeout(() => onAuthenticated(), 1000);
      }
    }, 800);
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Please enter your Telegram Cloud Password.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setAuthState('ready');
      setTimeout(() => onAuthenticated(), 1000);
    }, 800);
  };

  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col justify-between p-5 select-none overflow-y-auto">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-indigo-950/60 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
              <Send className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-tight">TDLib Auth</h2>
              <p className="text-[10px] text-slate-400">Device-Held MTProto Session</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-mono border border-emerald-800/40">
            Encrypted
          </span>
        </div>

        {/* Security Assurance Banner */}
        <div className="bg-[#0E1528] border border-indigo-900/40 rounded-xl p-3 mb-5 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-300 leading-snug">
            <span className="font-semibold text-slate-100">Local TDLib Invariant:</span> Your
            session keys and Telegram authorization state are stored strictly in Android app-private
            storage. No keys are ever transmitted to cloud servers.
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 bg-red-950/40 border border-red-800/50 rounded-lg p-2.5 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Phone Number */}
        {authState === 'phone' && (
          <form onSubmit={handleSendPhone} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Telegram Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full bg-[#0E1528] border border-indigo-950 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Enter phone number registered with Telegram
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting TDLib Client...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Telegram Code</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Verification Code */}
        {authState === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="bg-[#0E1528]/80 p-3 rounded-xl border border-slate-800/60 mb-2">
              <span className="text-[11px] text-slate-400">Code sent to Telegram app on: </span>
              <span className="text-xs font-mono font-medium text-cyan-300">{phoneNumber}</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                5-Digit Authentication Code
              </label>
              <input
                type="text"
                maxLength={5}
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="12345"
                className="w-full bg-[#0E1528] border border-indigo-950 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-base tracking-widest text-center text-white placeholder-slate-600 focus:outline-none transition-colors font-mono font-bold"
              />
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                <span>Demo shortcuts:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthCode('12345')}
                    className="text-cyan-400 hover:underline"
                  >
                    12345 (Direct)
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setAuthCode('22222')}
                    className="text-amber-400 hover:underline"
                  >
                    22222 (2FA test)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthState('phone')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Change Phone
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Authorize Device</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Two-Step Verification Password */}
        {authState === '2fa' && (
          <form onSubmit={handleVerifyPassword} className="space-y-4">
            <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-900/40 mb-2">
              <span className="text-[11px] text-amber-200">
                Two-Step Verification active. Enter your Telegram Cloud Password.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Telegram Cloud Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0E1528] border border-indigo-950 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Password...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Complete TDLib Authorization</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 4: Ready Success */}
        {authState === 'ready' && (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40 animate-pulse">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Telegram Authorized!</h3>
            <p className="text-xs text-slate-400 max-w-[220px] mx-auto">
              Device-held TDLib session established as <span className="text-cyan-300 font-medium">Alex Hunter</span> (ID: 819203918).
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-indigo-950/40 text-[10px] text-slate-500 text-center">
        <span>Official Telegram Database Library (TDLib v1.8.35)</span>
      </div>
    </div>
  );
};
