import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

type Category = 'Todos' | 'Mujer' | 'Hombre' | 'Niño';

const INSPIRATION_DATA = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    style: 'Casual Elegante',
    likes: '1.2k',
    category: 'Mujer'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    style: 'Traje Moderno',
    likes: '2.4k',
    category: 'Hombre'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519238263530-99abad67b86e?w=800&q=80',
    style: 'Urbano Infantil',
    likes: '3.1k',
    category: 'Niño'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    style: 'Urbano',
    likes: '856',
    category: 'Mujer'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1516826957135-700dde185527?w=800&q=80',
    style: 'Casual',
    likes: '1.5k',
    category: 'Hombre'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80',
    style: 'Verano Infantil',
    likes: '920',
    category: 'Niño'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
    style: 'Minimalista',
    likes: '2.1k',
    category: 'Mujer'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80',
    style: 'Streetwear',
    likes: '4.2k',
    category: 'Hombre'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&q=80',
    style: 'Estilo Cool',
    likes: '1.8k',
    category: 'Niño'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    style: 'Streetwear',
    likes: '3.4k',
    category: 'Mujer'
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80',
    style: 'Boho Chic',
    likes: '945',
    category: 'Mujer'
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
    style: 'Smart Casual',
    likes: '1.8k',
    category: 'Mujer'
  }
];

const CATEGORIES: Category[] = ['Todos', 'Mujer', 'Hombre', 'Niño'];

export default function Inspiration({ key }: { key?: React.Key }) {
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');

  const filteredData = INSPIRATION_DATA.filter(
    item => activeCategory === 'Todos' || item.category === activeCategory
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-4 pb-24 space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-zinc-900">Inspiración</h2>
        <Sparkles className="text-amber-500" size={24} />
      </div>

      {/* Categories / Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === category 
                ? 'bg-zinc-900 text-white shadow-md' 
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <motion.div layout className="columns-2 md:columns-3 gap-4 space-y-4">
        <AnimatePresence>
          {filteredData.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              whileHover={{ y: -5 }}
              className="group relative rounded-3xl overflow-hidden break-inside-avoid shadow-sm"
            >
              <img 
                src={item.image} 
                alt={item.style} 
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white font-medium text-sm mb-1">{item.style}</p>
                <div className="flex items-center gap-1 text-white/80 text-xs">
                  <Heart size={12} className="fill-white/80" />
                  {item.likes}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
