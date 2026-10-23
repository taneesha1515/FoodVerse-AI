import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ThermometerSnowflake, 
  Clock, 
  Gauge,
  Sparkles
} from 'lucide-react';
import MediaUploader from '../components/MediaUploader';
import { api } from '../services/api';

export default function FreshnessView() {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadSamples();
  }, []);

  const loadSamples = async () => {
    try {
      const data = await api.getFreshnessSamples();
      setSamples(data);
      if (data.length > 0) {
        handleSampleSelect(data[0].id);
      }
    } catch (e) {
      console.warn("Could not load freshness samples:", e);
    }
  };

  const handleFileSelect = (selectedFile, preview) => {
    setFile(selectedFile);
    setPreviewUrl(preview);
    setSelectedSample(null);
    if (selectedFile) {
      runInspection({ file: selectedFile });
    }
  };

  const handleSampleSelect = (sampleId) => {
    setSelectedSample(sampleId);
    setFile(null);
    setPreviewUrl(null);
    runInspection({ sampleId });
  };

  const runInspection = async ({ file: f, sampleId: s }) => {
    setLoading(true);
    try {
      const data = await api.inspectFreshness({ file: f, sampleId: s });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Module Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Epic 3 — Food Freshness & Spoilage Detection Module</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Perishable Freshness Radar & Spoilage Diagnostics
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          Evaluates surface pigmentation, fungal hyphae growth, moisture turgor, and derives shelf-life countdowns with HACCP safety guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media Uploader */}
        <div className="lg:col-span-5 space-y-4">
          <MediaUploader
            title="Inspect Produce or Food Item"
            subtitle="Upload perishable photo or test with preset samples"
            samples={samples}
            selectedSample={selectedSample}
            onFileSelect={handleFileSelect}
            onSampleSelect={handleSampleSelect}
          />

          {loading && (
            <div className="p-8 rounded-3xl glass-card text-center space-y-3 border border-amber-500/30">
              <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-amber-400 animate-pulse">
                FoodVerse Computer Vision analyzing microbial markers & discoloration...
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Freshness Metrics */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6">
              {/* Score & Verdict Card */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Produce Item
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {result.item_name}
                    </h3>
                  </div>

                  {/* Freshness Meter */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Freshness Score</span>
                      <span className="text-2xl font-extrabold text-white">{result.freshness_score}%</span>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-bold text-lg ${getStatusColor(result.freshness_score)}`}>
                      <Gauge className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                {/* Status Alert Banner */}
                <div className={`p-4 rounded-2xl border flex items-center gap-3 mb-6 ${getStatusColor(result.freshness_score)}`}>
                  {result.freshness_score >= 80 ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : result.freshness_score >= 50 ? (
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-sm">{result.status}</div>
                    <p className="text-xs opacity-90 mt-0.5">{result.consumption_safety_verdict}</p>
                  </div>
                </div>

                {/* Shelf life & Risk Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Shelf Life</span>
                      <div className="text-base font-bold text-white">
                        {result.estimated_shelf_life_days > 0 ? `${result.estimated_shelf_life_days} Days` : "Expired / 0 Days"}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Spoilage Risk Level</span>
                      <div className="text-base font-bold text-white">
                        {result.spoilage_risk} Risk
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spoilage Visual Indicators List */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    Computer Vision Spoilage Indicators
                  </h4>
                  <div className="space-y-2.5">
                    {result.indicators.map((ind, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                        <div>
                          <div className="font-semibold text-slate-200">{ind.name}</div>
                          <p className="text-slate-400 text-[11px] mt-0.5">{ind.details}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold shrink-0 ${
                          ind.severity === 'None' ? 'bg-emerald-500/15 text-emerald-400' :
                          ind.severity === 'Mild' ? 'bg-amber-500/15 text-amber-400' :
                          'bg-rose-500/15 text-rose-400'
                        }`}>
                          {ind.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Storage Recommendation */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                  <ThermometerSnowflake className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Optimal Preservation & Storage Protocol
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.storage_recommendation}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl glass-card text-center text-slate-400">
              <UtensilsCrossed className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium">Select a sample or upload an item image to inspect freshness and spoilage.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
