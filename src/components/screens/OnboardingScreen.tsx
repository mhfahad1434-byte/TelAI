import React, { useState } from 'react';
import { Shield, Cpu, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      icon: Lock,
      title: 'Device-Held Telegram Session',
      subtitle: 'Zero Cloud Storage for Auth Keys',
      description:
        'TelAI runs the official Telegram TDLib directly on your Android device. Your session keys, database, and OTP credentials remain securely in hardware-encrypted device storage.',
      accent: 'from-blue-600 to-indigo-600',
    },
    {
      icon: Cpu,
      title: 'Provider-Independent AI',
      subtitle: 'Gemini Default + Any OpenAI Endpoint',
      description:
        'You are never locked into one model. Use Google Gemini by default or configure custom Base URLs, private endpoints, or local LLMs without rebuilding the application.',
      accent: 'from-indigo-600 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Strict Action Approval',
      subtitle: 'You Retain Full Control',
      description:
        'AI agents cannot perform actions autonomously. Low-risk searches are passive; medium and high-risk actions (sending messages, pinning, archiving, deleting) require explicit human approval.',
      accent: 'from-cyan-600 to-teal-600',
    },
  ];

  const current = slides[slide];
  const Icon = current.icon;

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-full w-full bg-[#080C16] flex flex-col justify-between p-6 select-none">
      {/* Top indicator dots */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
          Architecture Protocol {slide + 1}/3
        </span>
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? 'w-5 bg-cyan-400' : 'w-1.5 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="my-auto py-6">
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${current.accent} p-[1.5px] shadow-xl mb-6 mx-auto flex items-center justify-center`}
        >
          <div className="w-full h-full bg-[#0A0E1A] rounded-[14px] flex items-center justify-center">
            <Icon className="w-8 h-8 text-cyan-300" />
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-100 text-center tracking-tight mb-1">
          {current.title}
        </h2>
        <p className="text-xs font-medium text-cyan-400 text-center mb-4">
          {current.subtitle}
        </p>
        <p className="text-xs text-slate-400 text-center leading-relaxed max-w-[280px] mx-auto">
          {current.description}
        </p>

        {/* Feature Highlights */}
        <div className="mt-8 space-y-2 bg-[#0E1528]/60 border border-indigo-950/60 rounded-xl p-3 text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Encrypted local Room database & DataStore</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>No bulk chat uploading or unauthorized AI indexing</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="space-y-3 pb-2">
        <button
          onClick={handleNext}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{slide === slides.length - 1 ? 'Connect Telegram Session' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {slide < slides.length - 1 && (
          <button
            onClick={onComplete}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-300 py-1 transition-colors"
          >
            Skip to Telegram Connect
          </button>
        )}
      </div>
    </div>
  );
};
