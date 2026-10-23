import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import CameraModal from './CameraModal';

export default function MediaUploader({ 
  onFileSelect, 
  onSampleSelect, 
  samples = [], 
  selectedSample, 
  title = "Upload Food Image", 
  subtitle = "Drop JPG, PNG, or capture using camera" 
}) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect(file, url);
  };

  const handleCameraCapture = (file, previewUrl) => {
    setPreview(previewUrl);
    onFileSelect(file, previewUrl);
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileSelect(null, null);
  };

  const handleSampleClick = (sampleId) => {
    setPreview(null);
    onSampleSelect(sampleId);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-6 transition-all text-center ${
          dragActive 
            ? 'border-emerald-400 bg-emerald-500/10' 
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*"
          onChange={handleChange}
          className="hidden" 
        />

        {preview ? (
          <div className="relative group max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
            <img src={preview} alt="Upload preview" className="w-full h-48 object-cover" />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors shadow-lg"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-2 bg-slate-950/90 text-[11px] text-slate-300 font-mono truncate">
              Uploaded ready for AI analysis
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 mb-3 border border-emerald-500/30">
              <UploadCloud className="w-7 h-7" />
            </div>

            <h4 className="text-sm font-semibold text-slate-200 mb-1">{title}</h4>
            <p className="text-xs text-slate-400 max-w-xs mb-4">{subtitle}</p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Browse File</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-transform active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Camera</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preset Samples Selector */}
      {samples.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Pre-Loaded Demo Samples:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samples.map((sample) => {
              const isSelected = selectedSample === sample.id && !preview;
              return (
                <button
                  key={sample.id}
                  onClick={() => handleSampleClick(sample.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{sample.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Camera Modal */}
      <CameraModal 
        isOpen={showCamera} 
        onClose={() => setShowCamera(false)} 
        onCapture={handleCameraCapture} 
      />
    </div>
  );
}
