import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ApiKeyModal from './components/ApiKeyModal';
import DashboardView from './views/DashboardView';
import NutritionView from './views/NutritionView';
import FreshnessView from './views/FreshnessView';
import HygieneView from './views/HygieneView';
import CookingView from './views/CookingView';
import MealPlannerView from './views/MealPlannerView';
import HistoryView from './views/HistoryView';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [geminiActive, setGeminiActive] = useState(false);
  const [backendHealth, setBackendHealth] = useState({ status: 'checking', gemini_configured: false });

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const health = await api.checkHealth();
      setBackendHealth(health);
      setGeminiActive(health.gemini_configured || false);
    } catch (e) {
      setBackendHealth({ status: 'offline', gemini_configured: false });
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'nutrition':
        return <NutritionView />;
      case 'freshness':
        return <FreshnessView />;
      case 'hygiene':
        return <HygieneView />;
      case 'cooking':
        return <CookingView />;
      case 'meal-planner':
        return <MealPlannerView />;
      case 'history':
        return <HistoryView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        geminiActive={geminiActive}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">FoodVerse AI</span>
            <span>•</span>
            <span>Multimodal Food Intelligence Agent</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Powered by Computer Vision, Multimodal LLMs & FastAPI
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={isKeyModalOpen} 
        onClose={() => setIsKeyModalOpen(false)} 
        currentStatus={geminiActive}
        onKeyUpdated={(active) => setGeminiActive(active)}
      />
    </div>
  );
}
