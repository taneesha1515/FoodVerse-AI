import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CameraModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      setCameraError("Camera unavailable or permission denied. You can use file upload or preset samples.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], `scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
      setCapturedImage({
        file,
        previewUrl: canvas.toDataURL('image/jpeg')
      });
    }, 'image/jpeg', 0.92);
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage.file, capturedImage.previewUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Live Camera Scanner</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-slate-400 max-w-xs">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <p className="text-xs">{cameraError}</p>
            </div>
          ) : capturedImage ? (
            <img 
              src={capturedImage.previewUrl} 
              alt="Snapshot" 
              className="w-full h-full object-contain"
            />
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
          )}

          {/* Crosshair guide */}
          {!capturedImage && !cameraError && (
            <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-12 h-12 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0 rounded-tl-xl" />
              <div className="w-12 h-12 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0 rounded-tr-xl" />
              <div className="w-12 h-12 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0 rounded-bl-xl" />
              <div className="w-12 h-12 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0 rounded-br-xl" />
              <span className="text-[10px] text-white/50 tracking-wider uppercase font-mono">Align Food or Prep Station</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          {capturedImage ? (
            <>
              <button
                onClick={() => setCapturedImage(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake</span>
              </button>
              <button
                onClick={confirmCapture}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Use Snapshot</span>
              </button>
            </>
          ) : (
            <>
              <div className="text-xs text-slate-400">Position target in frame</div>
              <button
                onClick={takeSnapshot}
                disabled={!!cameraError}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Frame</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
