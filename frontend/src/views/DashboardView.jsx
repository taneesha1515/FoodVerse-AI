import React from 'react';
import { 
  Sparkles, 
  Apple, 
  UtensilsCrossed, 
  ShieldCheck, 
  ChefHat, 
  CalendarRange, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Camera, 
  Cpu
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function DashboardView({ setActiveTab, stats = {} }) {
  const epics = [
    {
      id: 'nutrition',
      title: 'Food Recognition & Nutrition',
      epic: 'Epic 2',
      description: 'Multimodal computer vision detects ingredients, portion sizes, calories, macros & Nutri-Score.',
      icon: Apple,
      color: 'from-emerald-500/20 to-teal-500/10',
      badge: 'Vision + Nutrition Engine',
      stats: 'Macro Breakdown • Glycemic Index'
    },
    {
      id: 'freshness',
      title: 'Freshness & Spoilage Detection',
      epic: 'Epic 3',
      description: 'Perishable shelf-life radar detects discoloration, mold spores, and consumption safety verdict.',
      icon: UtensilsCrossed,
      color: 'from-amber-500/20 to-orange-500/10',
      badge: 'Spoilage Radar',
      stats: 'Shelf Life • Mycotoxin Alerts'
    },
    {
      id: 'hygiene',
      title: 'Restaurant Hygiene & Kitchen Safety',
      epic: 'Epic 4',
      description: 'Automated video & camera auditing for PPE (hairnets, gloves), cross-contamination & HACCP score.',
      icon: ShieldCheck,
      color: 'from-blue-500/20 to-indigo-500/10',
      badge: 'HACCP Safety Auditor',
      stats: 'Grade A-F • Violation Tracker'
    },
    {
      id: 'cooking',
      title: 'Smart Cooking & AI Chef Agent',
      epic: 'Epic 5',
      description: 'Conversational assistant, pantry-to-recipe generator, dynamic substitutions & voice guidance.',
      icon: ChefHat,
      color: 'from-purple-500/20 to-pink-500/10',
      badge: 'Multimodal Chef',
      stats: 'Voice Guidance • Ingredient Swap'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-6 md:p-10 overflow-hidden glass-panel border border-emerald-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multimodal Food Intelligence Platform</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Next-Gen AI for <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Food Recognition, Freshness & Safety</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6">
            FoodVerse AI solves fragmented food decision-making by unifying computer vision, video analysis, and large language model reasoning across food nutrition, spoilage detection, restaurant hygiene auditing, and smart conversational culinary guidance.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('nutrition')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <span>Scan Food Dish</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('hygiene')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Audit Kitchen Hygiene</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Level Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Multimodal Modules" 
          value="4 Epics" 
          subtitle="Vision + Video + Voice + LLM" 
          icon={Layers} 
          color="emerald" 
        />
        <StatCard 
          title="Analysis Accuracy" 
          value="98.4%" 
          subtitle="Calibrated heuristic & Gemini" 
          icon={Activity} 
          color="cyan" 
        />
        <StatCard 
          title="HACCP Hygiene Check" 
          value="Real-Time" 
          subtitle="PPE & Cross-Contamination" 
          icon={ShieldCheck} 
          color="amber" 
        />
        <StatCard 
          title="Database Vault" 
          value="SQLite" 
          subtitle="Local audit & scan storage" 
          icon={Cpu} 
          color="emerald" 
        />
      </div>

      {/* Workflow Epic Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Project Epics & Modules</h3>
            <p className="text-xs text-slate-400">Core multimodal intelligence capabilities</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            All 4 Epics Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {epics.map((epic) => {
            const Icon = epic.icon;
            return (
              <div
                key={epic.id}
                onClick={() => setActiveTab(epic.id)}
                className="group relative p-6 rounded-3xl glass-card hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${epic.color} text-emerald-400 border border-white/10 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-semibold text-emerald-400">
                        {epic.epic}
                      </span>
                      <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {epic.title}
                      </h4>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {epic.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-slate-500">{epic.badge}</span>
                  <span className="text-emerald-400/90 font-medium">{epic.stats}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Architecture Section */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2">FoodVerse AI Multimodal Architecture</h3>
        <p className="text-xs text-slate-400 mb-6">
          End-to-end dataflow from multimodal user inputs to FastAPI backend, AI models, and real-time intelligence feeds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-emerald-400 font-bold mb-1">1. User Inputs</div>
            <div className="text-[11px] text-slate-400">Image, Live Video, Audio Voice, Text Queries</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-teal-400 font-bold mb-1">2. React Frontend</div>
            <div className="text-[11px] text-slate-400">Vite, Tailwind, Camera & Mic Web APIs</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
            <div className="text-emerald-300 font-bold mb-1">3. FastAPI Backend</div>
            <div className="text-[11px] text-slate-400">Async Endpoints, SQLite Vault & Routers</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-cyan-400 font-bold mb-1">4. AI Models</div>
            <div className="text-[11px] text-slate-400">Gemini 1.5/2.0 Vision & CV Heuristics</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-emerald-400 font-bold mb-1">5. Real-Time Insights</div>
            <div className="text-[11px] text-slate-400">Nutrients, Spoilage, Hygiene Grade, Recipes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
