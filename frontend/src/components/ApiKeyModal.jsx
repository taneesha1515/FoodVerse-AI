import React, { useState } from 'react';
import { X, Key, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function ApiKeyModal({ isOpen, onClose, onKeyUpdated, currentStatus }) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.setApiKey(apiKey);
      setMessage({ type: 'success', text: 'Gemini API key updated successfully!' });
      onKeyUpdated(res.gemini_active);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update key. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Multimodal AI Configuration</h3>
            <p className="text-xs text-slate-400">Gemini 1.5/2.0 API or Built-in Offline Simulation</p>
          </div>
        </div>

        <div className="p-3 mb-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
          <p className="mb-2">
            <strong>Current Mode:</strong>{' '}
            <span className={currentStatus ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
              {currentStatus ? "Google Gemini Multimodal API Active" : "Built-in Vision & Heuristics Simulator (Zero Key Required)"}
            </span>
          </p>
          <p className="text-slate-400">
            FoodVerse AI works out of the box with realistic test dishes, camera frames, and nutrition data. To use live Google Gemini vision generation, enter your Gemini API Key below.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save & Activate"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
