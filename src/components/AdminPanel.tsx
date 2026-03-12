import React, { useState } from 'react';
import { SavedOutfit } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Trash2, Edit3, Save, X, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  key?: React.Key;
  outfits: SavedOutfit[];
  onDeleteAll: () => void;
  onDeleteOutfit: (id: string) => void;
  onUpdateOutfit: (updatedOutfit: SavedOutfit) => void;
}

export default function AdminPanel({ outfits, onDeleteAll, onDeleteOutfit, onUpdateOutfit }: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [editingOutfit, setEditingOutfit] = useState<SavedOutfit | null>(null);
  const [outfitToDelete, setOutfitToDelete] = useState<string | null>(null);
  
  // Local state for robust form editing (prevents typing issues with arrays)
  const [editForm, setEditForm] = useState({
    style: '',
    rating: 1,
    clothingDetected: '',
    combinations: '',
    colors: '',
    styleTips: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Acceso denegado. Clave incorrecta.');
    }
  };

  const handleEditClick = (outfit: SavedOutfit) => {
    setEditingOutfit(outfit);
    setEditForm({
      style: outfit.analysis.style,
      rating: outfit.analysis.rating,
      clothingDetected: outfit.analysis.clothingDetected.join(', '),
      combinations: outfit.analysis.suggestions.combinations.join(', '),
      colors: outfit.analysis.suggestions.colors.join(', '),
      styleTips: outfit.analysis.suggestions.styleTips.join(', ')
    });
  };

  const handleSaveEdit = () => {
    if (editingOutfit) {
      const updatedOutfit: SavedOutfit = {
        ...editingOutfit,
        analysis: {
          ...editingOutfit.analysis,
          style: editForm.style,
          rating: editForm.rating,
          clothingDetected: editForm.clothingDetected.split(',').map(s => s.trim()).filter(Boolean),
          suggestions: {
            combinations: editForm.combinations.split(',').map(s => s.trim()).filter(Boolean),
            colors: editForm.colors.split(',').map(s => s.trim()).filter(Boolean),
            styleTips: editForm.styleTips.split(',').map(s => s.trim()).filter(Boolean),
          }
        }
      };
      onUpdateOutfit(updatedOutfit);
      setEditingOutfit(null);
    }
  };

  const confirmDelete = () => {
    if (outfitToDelete) {
      onDeleteOutfit(outfitToDelete);
      setOutfitToDelete(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[70vh] p-4"
      >
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-zinc-100 text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} className="text-zinc-900" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Panel de Admin</h2>
          <p className="text-zinc-500 mb-8">Ingresa la clave para continuar</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Clave de acceso"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
              {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-4 pb-24 space-y-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Panel de Administración</h2>
          <p className="text-zinc-500">Gestiona los outfits analizados</p>
        </div>
        <button
          onClick={onDeleteAll}
          disabled={outfits.length === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${outfits.length === 0 ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
        >
          <Trash2 size={18} />
          Borrar Todo
        </button>
      </div>

      <div className="space-y-4">
        {outfits.map((outfit) => (
          <div key={outfit.id} className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 flex gap-4 items-start">
            <img src={outfit.image} alt="Outfit" className="w-24 h-32 object-cover rounded-xl shrink-0" />
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg capitalize truncate">{outfit.analysis.style}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditClick(outfit)}
                    className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => setOutfitToDelete(outfit.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Borrar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-zinc-500 mb-2">
                Calificación: <span className="font-bold text-zinc-900">{outfit.analysis.rating}/10</span>
              </p>
              
              <div className="flex flex-wrap gap-1">
                {outfit.analysis.clothingDetected.map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md text-xs capitalize">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {outfits.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            No hay datos para mostrar.
          </div>
        )}
      </div>

      <AnimatePresence>
        {/* Delete Confirmation Modal */}
        {outfitToDelete && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Confirmar acción</h3>
              <p className="text-zinc-600 mb-6">¿Estás seguro de que deseas borrar este outfit? Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button onClick={() => setOutfitToDelete(null)} className="flex-1 py-3 bg-zinc-100 text-zinc-900 rounded-xl font-medium hover:bg-zinc-200 transition-colors">Cancelar</button>
                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">Sí, borrar</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {editingOutfit && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Editar Análisis Completo</h3>
                <button onClick={() => setEditingOutfit(null)} className="p-2 hover:bg-zinc-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Estilo</label>
                    <input 
                      type="text"
                      value={editForm.style}
                      onChange={(e) => setEditForm({ ...editForm, style: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Calificación</label>
                    <input 
                      type="number"
                      min="1" max="10"
                      value={editForm.rating}
                      onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Prendas Detectadas (separadas por coma)</label>
                  <textarea 
                    rows={2}
                    value={editForm.clothingDetected}
                    onChange={(e) => setEditForm({ ...editForm, clothingDetected: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Combinaciones Sugeridas (separadas por coma)</label>
                  <textarea 
                    rows={2}
                    value={editForm.combinations}
                    onChange={(e) => setEditForm({ ...editForm, combinations: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Paleta de Colores (separados por coma)</label>
                  <textarea 
                    rows={2}
                    value={editForm.colors}
                    onChange={(e) => setEditForm({ ...editForm, colors: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Consejos de Estilo (separados por coma)</label>
                  <textarea 
                    rows={3}
                    value={editForm.styleTips}
                    onChange={(e) => setEditForm({ ...editForm, styleTips: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  onClick={() => setEditingOutfit(null)}
                  className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  Guardar Cambios
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
