import React, { useState, useEffect } from 'react';
import { 
  Apple, 
  Sparkles, 
  Flame, 
  Dna, 
  Wheat, 
  Droplet, 
  CheckCircle, 
  AlertCircle, 
  Share2, 
  HeartHandshake,
  Clock
} from 'lucide-react';
import MediaUploader from '../components/MediaUploader';
import { api } from '../services/api';

export default function NutritionView() {
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
      const data = await api.getNutritionSamples();
      setSamples(data);
      if (data.length > 0) {
        handleSampleSelect(data[0].id);
      }
    } catch (e) {
      console.warn("Could not load samples:", e);
    }
  };

  const handleFileSelect = (selectedFile, preview) => {
    setFile(selectedFile);
    setPreviewUrl(preview);
    setSelectedSample(null);
    if (selectedFile) {
      runAnalysis({ file: selectedFile });
    }
  };

  const handleSampleSelect = (sampleId) => {
    setSelectedSample(sampleId);
    setFile(null);
    setPreviewUrl(null);
    runAnalysis({ sampleId });
  };

  const runAnalysis = async ({ file: f, sampleId: s }) => {
    setLoading(true);
    try {
      const data = await api.analyzeNutrition({ file: f, sampleId: s });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Apple className="w-3.5 h-3.5" />
            <span>Epic 2 — Food Recognition & Nutrition Module</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Multimodal Food Recognition & Calorie Diagnostics
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Identifies meal components, estimates portions, computes macro & micronutrients, and derives clinical Nutri-Score.
          </p>
        </div>
      </div>

      {/* Main Grid: Upload Area & Results Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Uploader */}
        <div className="lg:col-span-5 space-y-4">
          <MediaUploader
            title="Scan or Upload Dish"
            subtitle="Upload plate photo or capture using webcam"
            samples={samples}
            selectedSample={selectedSample}
            onFileSelect={handleFileSelect}
            onSampleSelect={handleSampleSelect}
          />

          {loading && (
            <div className="p-8 rounded-3xl glass-card text-center space-y-3 border border-emerald-500/30">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-emerald-400 animate-pulse">
                FoodVerse Multimodal AI scanning ingredients & calculating nutrients...
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Nutrition Results */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6">
              {/* Dish Overview Card */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Identified Plate
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {result.dish_name}
                    </h3>
                  </div>

                  {/* Nutri-Score Badge */}
                  <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-700/80">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Nutri-Score</span>
                      <span className="text-sm font-bold text-emerald-400">{result.health_rating}</span>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
                      {result.health_rating.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Macronutrient Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                      <Flame className="w-4 h-4" />
                      <span className="text-xs font-semibold">Calories</span>
                    </div>
                    <span className="text-lg font-bold text-white">{result.total_nutrients.calories}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">kcal</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
                      <Dna className="w-4 h-4" />
                      <span className="text-xs font-semibold">Protein</span>
                    </div>
                    <span className="text-lg font-bold text-white">{result.total_nutrients.protein_g}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">grams</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                      <Wheat className="w-4 h-4" />
                      <span className="text-xs font-semibold">Carbs</span>
                    </div>
                    <span className="text-lg font-bold text-white">{result.total_nutrients.carbs_g}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">grams</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                      <Droplet className="w-4 h-4" />
                      <span className="text-xs font-semibold">Fats</span>
                    </div>
                    <span className="text-lg font-bold text-white">{result.total_nutrients.fat_g}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">grams</span>
                  </div>
                </div>

                {/* Dietary Compliance Tags */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                  {Object.entries(result.dietary_compliance || {}).map(([tag, isCompliant]) => (
                    <span
                      key={tag}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                        isCompliant 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-slate-800/60 text-slate-500 border border-slate-700/50'
                      }`}
                    >
                      {isCompliant ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-slate-500" />}
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Identified Sub-Items List */}
              <div className="p-6 rounded-3xl glass-card border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-3">Recognized Dish Components & Portions</h4>
                <div className="space-y-3">
                  {result.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-200">{item.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                            ~{item.estimated_weight_g}g
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {item.dietary_tags.map(t => (
                            <span key={t} className="text-[10px] text-emerald-400 font-mono">#{t}</span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                        <span>{item.nutrients.calories} kcal</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-cyan-400">{item.nutrients.protein_g}g P</span>
                        <span className="text-emerald-400">{item.nutrients.carbs_g}g C</span>
                        <span className="text-purple-400">{item.nutrients.fat_g}g F</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          item.glycemic_index === 'Low' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          GI: {item.glycemic_index}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dietitian Recommendation */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Clinical Dietitian & Metabolic Guidance</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.dietitian_recommendation}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Analyzed at: {result.analyzed_at}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl glass-card text-center text-slate-400">
              <Apple className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium">Select a dish sample or upload an image to view nutritional intelligence.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
