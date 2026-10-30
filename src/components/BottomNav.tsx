import React from 'react';
import { Home, Bot, Search, Activity, Settings } from 'lucide-react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  pendingApprovalsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  pendingApprovalsCount,
}) => {
  const tabs = [
    { id: 'home' as ScreenId, label: 'Home', icon: Home },
    { id: 'assistant' as ScreenId, label: 'Assistant', icon: Bot },
    { id: 'search' as ScreenId, label: 'Search', icon: Search },
    {
      id: 'activity' as ScreenId,
      label: 'Activity',
      icon: Activity,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { id: 'settings' as ScreenId, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="h-14 bg-[#070A12]/95 backdrop-blur-md border-t border-indigo-950/70 px-2 flex items-center justify-around z-20 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          currentScreen === tab.id ||
          (tab.id === 'search' && currentScreen === 'search_results') ||
          (tab.id === 'home' && currentScreen === 'message_nav') ||
          (tab.id === 'activity' && currentScreen === 'approval_center') ||
          (tab.id === 'settings' &&
            (currentScreen === 'ai_models' || currentScreen === 'security' || currentScreen === 'automations'));

        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {/* Active Glow Bar indicator */}
            {isActive && (
              <div className="absolute -top-[1px] w-6 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
            
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              {tab.badge && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {tab.badge}
                </span>
              )}
            </div>

            <span className={`text-[10px] mt-1 font-medium tracking-tight ${isActive ? 'text-cyan-300 font-semibold' : ''}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
