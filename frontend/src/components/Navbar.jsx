import React from 'react';
import { 
  Sparkles, 
  UtensilsCrossed, 
  ShieldCheck, 
  Apple, 
  ChefHat, 
  CalendarRange, 
  History, 
  Key, 
  LayoutDashboard,
  Cpu
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenKeyModal, geminiActive }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'nutrition', label: 'Nutrition AI', icon: Apple, badge: 'Epic 2' },
    { id: 'freshness', label: 'Freshness Radar', icon: UtensilsCrossed, badge: 'Epic 3' },
    { id: 'hygiene', label: 'Kitchen Hygiene', icon: ShieldCheck, badge: 'Epic 4' },
    { id: 'cooking', label: 'AI Chef & Audio', icon: ChefHat, badge: 'Epic 5' },
    { id: 'meal-planner', label: 'Meal Planner', icon: CalendarRange },
    { id: 'history', label: 'Audit Vault', icon: History }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  FoodVerse AI
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Multimodal Agent
                </span>
              </div>
              <p className="text-xs text-slate-400">Computer Vision • Video • Reasoning</p>
            </div>
          </div>

          {/* Quick status pill for mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={onOpenKeyModal}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* AI Engine Status & Key Modal Trigger */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-mono text-[11px]">
              Engine: <strong className={geminiActive ? "text-emerald-400" : "text-amber-400"}>
                {geminiActive ? "Gemini 1.5/2.0 Vision" : "Hybrid Heuristic Vision"}
              </strong>
            </span>
          </div>

          <button
            onClick={onOpenKeyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all shadow-sm"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>API Config</span>
          </button>
        </div>

      </div>
    </header>
  );
}
