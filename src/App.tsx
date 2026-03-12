import React, { useState, useEffect } from 'react';
import { Camera, Home, Image as ImageIcon, LayoutGrid, Settings, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CameraScanner from './components/CameraScanner';
import AnalysisResult from './components/AnalysisResult';
import MyOutfits from './components/MyOutfits';
import Inspiration from './components/Inspiration';
import AdminPanel from './components/AdminPanel';
import { analyzeOutfit, OutfitAnalysis } from './services/geminiService';
import { SavedOutfit } from './types';

type Tab = 'home' | 'outfits' | 'inspiration' | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<OutfitAnalysis | null>(null);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string, onConfirm: () => void } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('outfit_ai_saved');
    if (stored) {
      try {
        setSavedOutfits(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading saved outfits", e);
      }
    }
  }, []);

  const saveToStorage = (outfits: SavedOutfit[]) => {
    setSavedOutfits(outfits);
    localStorage.setItem('outfit_ai_saved', JSON.stringify(outfits));
  };

  const handleCapture = async (base64Image: string) => {
    setIsScanning(false);
    setCurrentImage(base64Image);
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeOutfit(base64Image);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Error analyzing outfit:", error);
      const message = error instanceof Error ? error.message : "Hubo un error al analizar el outfit. Intenta de nuevo.";
      setErrorMessage(message);
      setCurrentImage(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveOutfit = (outfit: SavedOutfit) => {
    saveToStorage([outfit, ...savedOutfits]);
  };

  const handleDeleteOutfit = (id: string) => {
    saveToStorage(savedOutfits.filter(o => o.id !== id));
  };

  const handleDeleteAll = () => {
    setConfirmDialog({
      message: '¿Estás seguro de borrar todos los datos guardados?',
      onConfirm: () => {
        saveToStorage([]);
        setConfirmDialog(null);
      }
    });
  };

  const handleUpdateOutfit = (updatedOutfit: SavedOutfit) => {
    saveToStorage(savedOutfits.map(o => o.id === updatedOutfit.id ? updatedOutfit : o));
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-amber-200">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
        >
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <SparklesIcon className="text-amber-400" size={18} />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Outfit AI</h1>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center"
            >
              <div className="max-w-md w-full space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight text-zinc-900">
                    Descubre tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">mejor estilo</span>
                  </h2>
                  <p className="text-zinc-500 text-lg">
                    Usa la inteligencia artificial para analizar tu ropa y recibir recomendaciones personalizadas.
                  </p>
                </div>

                <button
                  onClick={() => setIsScanning(true)}
                  className="group relative w-full overflow-hidden rounded-3xl bg-zinc-900 px-8 py-6 text-white shadow-2xl transition-all hover:scale-[1.02] hover:shadow-amber-500/20 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex items-center justify-center gap-3">
                    <Camera size={28} className="text-amber-400" />
                    <span className="text-xl font-semibold tracking-wide">Analizar Outfit</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'outfits' && (
            <MyOutfits key="outfits" outfits={savedOutfits} onDelete={handleDeleteOutfit} />
          )}

          {activeTab === 'inspiration' && (
            <Inspiration key="inspiration" />
          )}

          {activeTab === 'admin' && (
            <AdminPanel 
              key="admin" 
              outfits={savedOutfits} 
              onDeleteAll={handleDeleteAll} 
              onDeleteOutfit={handleDeleteOutfit}
              onUpdateOutfit={handleUpdateOutfit} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-zinc-200 pb-safe">
        <div className="max-w-md mx-auto px-6 py-3 flex justify-between items-center">
          <NavItem icon={<Home />} label="Inicio" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<LayoutGrid />} label="Mis Outfits" active={activeTab === 'outfits'} onClick={() => setActiveTab('outfits')} />
          <NavItem icon={<ImageIcon />} label="Inspiración" active={activeTab === 'inspiration'} onClick={() => setActiveTab('inspiration')} />
          <NavItem icon={<Settings />} label="Admin" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
        </div>
      </nav>

      {/* Overlays */}
      <AnimatePresence>
        {isScanning && (
          <CameraScanner 
            onCapture={handleCapture} 
            onClose={() => setIsScanning(false)} 
          />
        )}

        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6 relative">
              <Loader2 size={32} className="text-zinc-900 animate-spin absolute" />
              <SparklesIcon size={20} className="text-amber-500 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Analizando tu estilo...</h3>
            <p className="text-zinc-500">Nuestra IA está evaluando colores, texturas y combinaciones.</p>
          </motion.div>
        )}

        {currentImage && analysisResult && !isAnalyzing && (
          <AnalysisResult 
            image={currentImage}
            analysis={analysisResult}
            onClose={() => {
              setCurrentImage(null);
              setAnalysisResult(null);
            }}
            onSave={handleSaveOutfit}
          />
        )}

        {/* Error Modal */}
        {errorMessage && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">¡Ups!</h3>
              <p className="text-zinc-600 mb-6">{errorMessage}</p>
              <button onClick={() => setErrorMessage(null)} className="w-full py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors">Entendido</button>
            </motion.div>
          </div>
        )}

        {/* Confirm Modal */}
        {confirmDialog && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
              <h3 className="text-xl font-bold mb-2">Confirmar acción</h3>
              <p className="text-zinc-600 mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDialog(null)} className="flex-1 py-3 bg-zinc-100 text-zinc-900 rounded-xl font-medium hover:bg-zinc-200 transition-colors">Cancelar</button>
                <button onClick={confirmDialog.onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">Sí, borrar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${active ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
    >
      <div className={`transition-transform duration-300 ${active ? '-translate-y-1' : ''}`}>
        {React.cloneElement(icon as React.ReactElement, { 
          size: 24,
          className: active ? 'stroke-[2.5px]' : 'stroke-2'
        })}
      </div>
      <span className={`text-[10px] font-medium transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute bottom-1 w-1 h-1 bg-zinc-900 rounded-full"
        />
      )}
    </button>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 24, ...rest } = props;
  return (
    <svg
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
