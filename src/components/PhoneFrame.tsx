import React, { useState, useEffect } from 'react';
import { Wifi, Signal, BatteryCharging, ArrowLeft } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  canGoBack?: boolean;
  onBack?: () => void;
  screenTitle?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  canGoBack,
  onBack,
  screenTitle,
}) => {
  const [time, setTime] = useState('17:33');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Android Device Outer Body */}
      <div className="w-[390px] h-[810px] max-h-[92vh] bg-[#0A0E1A] rounded-[48px] p-[10px] shadow-[0_25px_70px_rgba(3,7,18,0.9),0_0_30px_rgba(99,102,241,0.15)] border-[3px] border-[#1E293B] relative flex flex-col overflow-hidden">
        
        {/* Antenna bands / subtle metallic sheen */}
        <div className="absolute top-20 -left-[3px] w-[3px] h-6 bg-slate-700/60 rounded-r" />
        <div className="absolute top-36 -left-[3px] w-[3px] h-12 bg-slate-700/60 rounded-r" />
        <div className="absolute top-52 -left-[3px] w-[3px] h-12 bg-slate-700/60 rounded-r" />
        <div className="absolute top-28 -right-[3px] w-[3px] h-14 bg-slate-700/60 rounded-l" />

        {/* Screen Bezel & Display Area */}
        <div className="w-full h-full bg-[#080C16] rounded-[38px] overflow-hidden flex flex-col relative border border-slate-800/40">
          
          {/* Android Status Bar */}
          <div className="h-9 px-6 pt-1 flex items-center justify-between text-[11px] font-medium text-slate-300 select-none z-20 bg-[#080C16]/90 backdrop-blur-sm">
            <span>{time}</span>
            {/* Center Front Camera Punch-Hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900/80" />
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px]">98%</span>
            </div>
          </div>

          {/* Sub-header if in secondary screen */}
          {canGoBack && (
            <div className="h-10 px-4 flex items-center gap-2 border-b border-indigo-950/40 bg-[#0A0E1A] z-10">
              <button
                onClick={onBack}
                className="p-1 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-xs font-semibold text-slate-200 tracking-tight truncate">
                {screenTitle || 'Back'}
              </h2>
            </div>
          )}

          {/* Main App Content Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* Android Bottom Navigation Pill */}
          <div className="h-5 flex items-center justify-center bg-[#080C16] z-20">
            <div className="w-28 h-1 bg-slate-600/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
