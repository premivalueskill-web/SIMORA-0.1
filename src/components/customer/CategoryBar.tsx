import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/initialData';
import { ProductCategory } from '../../types';
import { 
  Sparkles, 
  Apple, 
  Milk, 
  Cookie, 
  CupSoda, 
  Wheat, 
  Layers
} from 'lucide-react';

export const CategoryBar: React.FC = () => {
  const { activeCategory, setActiveCategory, products } = useApp();

  const getCategoryCount = (catId: ProductCategory | 'all') => {
    if (catId === 'all') return products.length;
    return products.filter(p => p.category === catId).length;
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'vegetables_fruits': return <Apple className="w-4 h-4 text-emerald-600" />;
      case 'dairy_breakfast': return <Milk className="w-4 h-4 text-blue-600" />;
      case 'snacks_munchies': return <Cookie className="w-4 h-4 text-amber-600" />;
      case 'cold_drinks_juices': return <CupSoda className="w-4 h-4 text-red-500" />;
      case 'staples_kitchen': return <Wheat className="w-4 h-4 text-yellow-600" />;
      case 'personal_care': return <Sparkles className="w-4 h-4 text-purple-600" />;
      default: return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="py-2 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {/* All Products Tab */}
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-[#0b6623] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Items</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeCategory === 'all' ? 'bg-emerald-800 text-yellow-300' : 'bg-slate-100 text-slate-500'
          }`}>
            {getCategoryCount('all')}
          </span>
        </button>

        {/* Categories */}
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#0b6623] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                {getCategoryIcon(cat.id)}
              </div>
              <div className="text-left">
                <span>{cat.name}</span>
                {cat.hindiName && (
                  <span className={`block text-[10px] font-normal leading-none ${isActive ? 'text-yellow-200' : 'text-slate-400'}`}>
                    {cat.hindiName}
                  </span>
                )}
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isActive ? 'bg-emerald-800 text-yellow-300' : 'bg-slate-100 text-slate-500'
              }`}>
                {getCategoryCount(cat.id)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
