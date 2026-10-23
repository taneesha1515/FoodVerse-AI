import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  Apple, 
  UtensilsCrossed, 
  ShieldCheck, 
  Calendar,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export default function HistoryView() {
  const [historyList, setHistoryList] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [activeFilter]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const moduleParam = activeFilter === "all" ? null : activeFilter;
      const data = await api.getHistory(50, moduleParam);
      setHistoryList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteHistory(id);
      setHistoryList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(historyList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `foodverse_audit_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getModuleBadge = (module) => {
    switch (module) {
      case 'nutrition':
        return { label: 'Nutrition', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: Apple };
      case 'freshness':
        return { label: 'Freshness', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: UtensilsCrossed };
      case 'hygiene':
        return { label: 'Hygiene', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', icon: ShieldCheck };
      default:
        return { label: module, color: 'bg-slate-800 text-slate-300 border-slate-700', icon: Layers };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>SQLite Audit Vault</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Audit Records & Scan Vault
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Historical logs of nutrition scans, spoilage diagnostics, and commercial kitchen inspections.
          </p>
        </div>

        <button
          onClick={exportToJson}
          disabled={historyList.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export JSON</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'nutrition', 'freshness', 'hygiene'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
              activeFilter === f
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {f === 'all' ? 'All Modules' : f}
          </button>
        ))}
      </div>

      {/* History Items List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Loading audit vault records...</p>
        </div>
      ) : historyList.length === 0 ? (
        <div className="p-12 rounded-3xl glass-card text-center text-slate-400 border border-slate-800">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-medium">No records saved yet. Perform an analysis in any module to record entries!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {historyList.map((item) => {
            const badge = getModuleBadge(item.module);
            const Icon = badge.icon;
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start md:items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${badge.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{item.title}</span>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.2 rounded-md border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.summary}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.created_at}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
