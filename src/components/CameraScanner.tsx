import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, X, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface CameraScannerProps {
  onCapture: (base64Image: string) => void;
  onClose: () => void;
}

export default function CameraScanner({ onCapture, onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("No se pudo acceder a la cámara. Por favor, asegúrate de dar permisos.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup will run on unmount. We need to access the latest stream.
      // Since stream is in state, we can just use a ref or clean up the videoRef's srcObject
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(base64Image);
      }
    }
  }, [onCapture]);

  const startCountdown = () => {
    if (countdown !== null) return;
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown === 0) {
      handleCapture();
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, handleCapture]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4"
    >
      <div className="absolute top-4 right-4 z-10 flex gap-4">
        <button 
          onClick={startCamera}
          className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <RefreshCcw size={24} />
        </button>
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {error ? (
        <div className="text-white text-center p-6 bg-red-500/20 rounded-2xl border border-red-500/50">
          <p>{error}</p>
          <button 
            onClick={startCamera}
            className="mt-4 px-6 py-2 bg-white text-black rounded-full font-medium"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-md aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Countdown Overlay */}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <motion.span
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                className="text-8xl font-bold text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              >
                {countdown}
              </motion.span>
            </div>
          )}

          {/* Overlay guides */}
          <div className="absolute inset-0 border-2 border-white/20 m-8 rounded-xl pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-white/50 rounded-full" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-1 bg-white/50 rounded-full" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-16 bg-white/50 rounded-full" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1 h-16 bg-white/50 rounded-full" />
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <button 
              onClick={startCountdown}
              disabled={countdown !== null}
              className={`w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_0_4px_rgba(255,255,255,0.3)] transition-all ${countdown !== null ? 'opacity-50 scale-95' : 'hover:scale-105 active:scale-95'}`}
            >
              <div className="w-16 h-16 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                <Camera size={32} className="text-zinc-900" />
              </div>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
