import React, { useEffect, useState } from 'react';
import { ShieldCheck, Check, Cpu, Lock } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1200);
    const t3 = setTimeout(() => setStep(3), 1800);
    const t4 = setTimeout(() => onComplete(), 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Animated Brand Emblem */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[2px] shadow-2xl shadow-indigo-500/30 animate-pulse">
          <div className="w-full h-full bg-[#0A0E1A] rounded-[22px] flex items-center justify-center">
            <span className="font-black text-3xl tracking-tighter bg-gradient-to-r from-indigo-300 via-cyan-300 to-white bg-clip-text text-transparent">
              T
            </span>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0A0E1A] flex items-center justify-center">
          <Lock className="w-3 h-3 text-slate-950 stroke-[3]" />
        </div>
      </div>

      <h1 className="text-xl font-bold text-slate-100 tracking-tight mb-1">TelAI</h1>
      <p className="text-xs text-slate-400 mb-8 max-w-[240px]">
        Telegram AI Personal Agent · Native Android Architecture
      </p>

      {/* Security Initialization Checklist */}
      <div className="w-full max-w-[260px] space-y-2.5 text-left text-xs bg-[#0E1528]/80 border border-indigo-950/80 rounded-2xl p-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'
            }`}
          >
            {step >= 1 ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '1'}
          </div>
          <span className={step >= 1 ? 'text-slate-200 font-medium' : 'text-slate-500'}>
            Android Keystore AES-256
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'
            }`}
          >
            {step >= 2 ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '2'}
          </div>
          <span className={step >= 2 ? 'text-slate-200 font-medium' : 'text-slate-500'}>
            TDLib In-Process Session
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'
            }`}
          >
            {step >= 3 ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '3'}
          </div>
          <span className={step >= 3 ? 'text-slate-200 font-medium' : 'text-slate-500'}>
            Configurable AI Provider Ready
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>Initializing local environment...</span>
      </div>
    </div>
  );
};
