import React from 'react';
import { SavedOutfit } from '../types';
import { motion } from 'motion/react';
import { Star, Calendar, Trash2 } from 'lucide-react';

interface MyOutfitsProps {
  key?: React.Key;
  outfits: SavedOutfit[];
  onDelete: (id: string) => void;
}

export default function MyOutfits({ outfits, onDelete }: MyOutfitsProps) {
  if (outfits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-400">
        <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
          <Star size={32} className="text-zinc-300" />
        </div>
        <p className="text-lg font-medium">Aún no tienes outfits guardados</p>
        <p className="text-sm mt-2">Analiza tu primer outfit para verlo aquí</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-4 pb-24 space-y-6"
    >
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">Mis Outfits</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {outfits.map((outfit) => (
          <motion.div 
            key={outfit.id}
            layoutId={outfit.id}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-100"
          >
            <div className="aspect-[3/4] w-full overflow-hidden">
              <img 
                src={outfit.image} 
                alt="Saved Outfit" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            {/* Rating Badge */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm flex items-center gap-1 text-xs font-bold">
              <Star className="text-yellow-500 fill-yellow-500" size={12} />
              {outfit.analysis.rating}/10
            </div>

            {/* Delete Button */}
            <button 
              onClick={() => onDelete(outfit.id)}
              className="absolute top-3 left-3 p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>

            <div className="p-4">
              <p className="font-medium text-sm capitalize truncate">
                {outfit.analysis.style}
              </p>
              <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                <Calendar size={12} />
                {new Date(outfit.date).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
