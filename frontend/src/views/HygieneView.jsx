import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Video, 
  Play, 
  Pause, 
  RefreshCw, 
  Flame, 
  Sparkles,
  ClipboardCheck,
  Building2
} from 'lucide-react';
import MediaUploader from '../components/MediaUploader';
import { api } from '../services/api';

export default function HygieneView() {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isSimulatingStream, setIsSimulatingStream] = useState(false);
  const [streamFrameCount, setStreamFrameCount] = useState(0);

  useEffect(() => {
    loadSamples();
  }, []);

  // Simulated live kitchen camera video stream loop
  useEffect(() => {
    let interval = null;
    if (isSimulatingStream) {
      interval = setInterval(() => {
        setStreamFrameCount(prev => prev + 1);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isSimulatingStream]);

  const loadSamples = async () => {
    try {
      const data = await api.getHygieneSamples();
      setSamples(data);
      if (data.length > 0) {
        handleSampleSelect(data[0].id);
      }
    } catch (e) {
      console.warn("Could not load hygiene samples:", e);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setSelectedSample(null);
    if (selectedFile) {
      runAudit({ file: selectedFile });
    }
  };

  const handleSampleSelect = (sampleId) => {
    setSelectedSample(sampleId);
    setFile(null);
    runAudit({ sampleId });
  };

  const runAudit = async ({ file: f, sampleId: s }) => {
    setLoading(true);
    try {
      const data = await api.auditHygiene({ file: f, sampleId: s });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade.includes("Grade A")) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (grade.includes("Grade B") || grade.includes("Grade C")) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Module Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Epic 4 — Restaurant Hygiene & Smart Kitchen Safety Module</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Real-Time Restaurant Kitchen & PPE Compliance Auditor
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          Automated vision monitoring for food-grade hairnets, gloves, face masks, cross-contamination vectors, and HACCP sanitation compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media / Live Video Stream */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Simulated CCTV Stream Bar */}
          <div className="p-4 rounded-3xl glass-card border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-200">Simulated Kitchen CCTV Feed</span>
              </div>
              <button
                onClick={() => setIsSimulatingStream(!isSimulatingStream)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isSimulatingStream 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isSimulatingStream ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isSimulatingStream ? "Stop Feed" : "Stream Live"}</span>
              </button>
            </div>

            {isSimulatingStream && (
              <div className="p-3 bg-black/60 rounded-2xl border border-slate-800 mb-2 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>REC • CAM-02 PREP LINE</span>
                </div>
                <span className="text-slate-400">Frames Audited: {streamFrameCount}</span>
              </div>
            )}

            <MediaUploader
              title="Audit Kitchen Frame"
              subtitle="Upload station image or select standard HACCP test zones"
              samples={samples}
              selectedSample={selectedSample}
              onFileSelect={handleFileSelect}
              onSampleSelect={handleSampleSelect}
            />
          </div>

          {loading && (
            <div className="p-8 rounded-3xl glass-card text-center space-y-3 border border-blue-500/30">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-400 rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-blue-400 animate-pulse">
                FoodVerse AI verifying PPE mandates and bacterial transfer pathways...
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Audit Scorecard & Violations */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6">
              {/* Score & Grade Header Card */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      <span>Inspected Zone</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {result.zone_or_station}
                    </h3>
                  </div>

                  {/* Hygiene Grade Badge */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Sanitation Score</span>
                      <span className="text-2xl font-extrabold text-white">{result.hygiene_score}%</span>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl border font-black text-lg ${getGradeColor(result.grade)}`}>
                      {result.grade.split(" ")[0]}
                    </div>
                  </div>
                </div>

                {/* Verdict Summary */}
                <div className={`p-4 rounded-2xl border flex items-start gap-3 mb-6 ${getGradeColor(result.grade)}`}>
                  <ClipboardCheck className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider">{result.grade}</div>
                    <p className="text-xs opacity-90 mt-1 leading-relaxed">{result.overall_verdict}</p>
                  </div>
                </div>

                {/* PPE Checklist Grid */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    Mandatory PPE Compliance Checklist
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {Object.entries(result.ppe_compliance || {}).map(([ppe, passed]) => (
                      <div 
                        key={ppe}
                        className={`p-3 rounded-2xl border flex items-center gap-2 text-xs font-medium ${
                          passed 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                        }`}
                      >
                        {passed ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                        <span className="capitalize">{ppe.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Vectors (Cross-contamination & Sanitization) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Cross-Contamination Risk</span>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {result.cross_contamination_risk}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Surface Sanitization Level</span>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {result.sanitization_level}
                    </div>
                  </div>
                </div>

                {/* Violations Ledger */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Identified Violations & HACCP Corrective Actions
                    </h4>
                    <span className="text-xs font-mono text-slate-400">
                      {result.violations.length} issue(s) detected
                    </span>
                  </div>

                  {result.violations.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Zero safety violations detected! Station meets commercial restaurant food safety standards.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {result.violations.map((violation, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white flex items-center gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              {violation.category}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              violation.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                              'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {violation.severity}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300">{violation.description}</p>

                          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-emerald-400 font-mono">
                            <strong>Action Required:</strong> {violation.suggested_action}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl glass-card text-center text-slate-400">
              <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium">Select a station sample or upload an image to audit kitchen hygiene.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
