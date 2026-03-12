import React, { useState } from 'react';
import { OutfitAnalysis } from '../services/geminiService';
import { SavedOutfit } from '../types';
import { motion } from 'motion/react';
import { Star, CheckCircle, ChevronLeft, Save, Sparkles, Palette, Shirt } from 'lucide-react';

interface AnalysisResultProps {
  image: string;
  analysis: OutfitAnalysis;
  onClose: () => void;
  onSave: (outfit: SavedOutfit) => void;
}

export default function AnalysisResult({ image, analysis, onClose, onSave }: AnalysisResultProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (saved) return;
    const newOutfit: SavedOutfit = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      image,
      analysis,
    };
    onSave(newOutfit);
    setSaved(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed inset-0 z-40 bg-zinc-50 overflow-y-auto pb-24"
    >
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-zinc-100 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-semibold text-lg">Resultado</h2>
        <button 
          onClick={handleSave}
          disabled={saved}
          className={`p-2 -mr-2 rounded-full transition-colors flex items-center gap-2 ${saved ? 'text-emerald-600' : 'hover:bg-zinc-100'}`}
        >
          {saved ? <CheckCircle size={24} /> : <Save size={24} />}
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Image Preview */}
        <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-lg border border-zinc-200">
          <img src={image} alt="Outfit" className="w-full h-full object-cover" />
          
          {/* Style Badge */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-3 rounded-2xl">
            <p className="text-xs text-white/70 uppercase tracking-wider font-semibold mb-1">Estilo Detectado</p>
            <p className="font-medium text-lg capitalize">{analysis.style}</p>
          </div>
        </div>

        {/* Prominent Rating Section */}
        <div className="bg-gradient-to-br from-zinc-900 to-black text-white rounded-3xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-zinc-400 font-medium uppercase tracking-wider text-sm mb-1">Calificación del Estilista</h3>
            <p className="text-zinc-300 text-sm">Basado en armonía, ajuste y tendencia</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10">
            <Star className="text-yellow-400 fill-yellow-400" size={28} />
            <div className="flex items-baseline">
              <span className="font-black text-4xl text-white">{analysis.rating}</span>
              <span className="text-zinc-400 font-bold text-xl">/10</span>
            </div>
          </div>
        </div>

        {/* Clothing Items */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="text-blue-500" size={20} />
            <h3 className="font-semibold text-lg">Prendas Detectadas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.clothingDetected.map((item, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-zinc-100 text-zinc-800 rounded-full text-sm font-medium capitalize">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-xl px-2">Sugerencias de Estilo</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Combinations */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-amber-500" size={20} />
                <h4 className="font-semibold">Combinaciones</h4>
              </div>
              <ul className="space-y-3">
                {analysis.suggestions.combinations.map((combo, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-zinc-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{combo}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="text-indigo-500" size={20} />
                <h4 className="font-semibold">Colores</h4>
              </div>
              <ul className="space-y-3">
                {analysis.suggestions.colors.map((color, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-zinc-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span className="capitalize">{color}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Style Tips */}
          <div className="bg-zinc-900 text-white rounded-3xl p-6 shadow-lg">
            <h4 className="font-semibold mb-4 text-lg">Consejos Pro</h4>
            <ul className="space-y-4">
              {analysis.suggestions.styleTips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-zinc-300">
                  <span className="text-amber-400 font-bold">0{idx + 1}</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
