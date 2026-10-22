import React from 'react';
import { useApp } from '../../context/AppContext';
import { HERO_IMAGE, FRESH_PRODUCE_IMAGE, DAIRY_IMAGE } from '../../data/initialData';
import { ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActiveCategory, applyCoupon, setIsCartDrawerOpen, setIsSmartListModalOpen } = useApp();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4">
      {/* Primary Hero Showcase (2 Cols) */}
      <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-slate-900 min-h-[260px] sm:min-h-[300px] flex items-center shadow-md group">
        <img 
          src={HERO_IMAGE} 
          alt="SIMORA Fresh Groceries Delivered in 10 Minutes"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:scale-102 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark scrim for high contrast typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>

        <div className="relative z-10 p-6 sm:p-8 max-w-lg space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-slate-950 text-xs font-black rounded-md tracking-wider uppercase">
            <span>⚡ Lightning Quick Commerce</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight leading-tight">
            Your Need Our Deed.<br />
            <span className="text-yellow-400">Delivered in 10-12 Mins.</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2">
            Fresh harvest farm vegetables, daily dairy, breakfast staples, and munchies delivered right to your doorstep.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveCategory('all');
                const target = document.getElementById('products-section');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-[#fedc00] hover:bg-[#ffe53b] text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSmartListModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-800/90 hover:bg-emerald-700 text-yellow-300 text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5 border border-emerald-500/50"
            >
              <Sparkles className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>AI Smart List</span>
            </button>

            <button
              onClick={() => {
                applyCoupon('SIMORA50');
                setIsCartDrawerOpen(true);
              }}
              className="px-3.5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-yellow-300" />
              <span>Code SIMORA50</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side Promos (1 Col Split) */}
      <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
        {/* Farm Fresh Card */}
        <div 
          onClick={() => {
            setActiveCategory('vegetables_fruits');
            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative flex-1 rounded-2xl overflow-hidden bg-emerald-950 p-5 cursor-pointer shadow-sm group min-h-[140px] flex flex-col justify-end"
        >
          <img 
            src={FRESH_PRODUCE_IMAGE} 
            alt="Farm Fresh Veggies"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
          
          <div className="relative z-10 text-white">
            <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-wider">Direct From Farmers</span>
            <h3 className="text-base font-extrabold font-display leading-tight mt-0.5">Taaza Sabzi & Fruits</h3>
            <p className="text-[11px] text-slate-300">Washed, sorted & chemical-free · Up to 25% Off</p>
          </div>
        </div>

        {/* Morning Dairy Card */}
        <div 
          onClick={() => {
            setActiveCategory('dairy_breakfast');
            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative flex-1 rounded-2xl overflow-hidden bg-amber-950 p-5 cursor-pointer shadow-sm group min-h-[140px] flex flex-col justify-end"
        >
          <img 
            src={DAIRY_IMAGE} 
            alt="Dairy and Breakfast"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
          
          <div className="relative z-10 text-white">
            <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-wider">Fresh Batch Today</span>
            <h3 className="text-base font-extrabold font-display leading-tight mt-0.5">Pure Dairy & Bakery</h3>
            <p className="text-[11px] text-slate-300">Milk, fresh paneer, brown eggs & breads</p>
          </div>
        </div>
      </div>
    </div>
  );
};
