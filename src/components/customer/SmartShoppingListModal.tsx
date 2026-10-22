import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  X, 
  Check, 
  Plus, 
  ShoppingBag, 
  Clock, 
  RefreshCw, 
  AlertCircle, 
  Calendar,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product } from '../../types';

interface SmartRecommendation {
  productId: string;
  suggestedQuantity: number;
  urgency: 'Overdue Refill' | 'Running Low' | 'Habitual Favorite' | 'Perfect Pairing' | string;
  aiReason: string;
  smartCategory: string;
}

interface SmartShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartShoppingListModal: React.FC<SmartShoppingListModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { orders, products, addToCart, setIsCartDrawerOpen } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<'weekly_routine' | 'breakfast_dairy' | 'healthy_fresh' | 'weekend_snacks'>('weekly_routine');
  const [customPrompt, setCustomPrompt] = useState('');
  const [summary, setSummary] = useState<string>('');
  const [source, setSource] = useState<'gemini' | 'heuristic' | 'heuristic_fallback'>('gemini');
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Record<string, boolean>>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Fetch Smart Recommendations
  const fetchSmartList = async (preset: string = selectedPreset, customText: string = customPrompt) => {
    setIsLoading(true);
    setAddedSuccess(false);

    try {
      const response = await fetch('/api/ai/smart-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orders,
          availableProducts: products,
          promptTone: customText ? `${preset}: ${customText}` : preset,
        }),
      });

      const data = await response.json();
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
        setSummary(data.summary || 'AI has analyzed your past order intervals to suggest timely replenishments.');
        setSource(data.source || 'gemini');

        // Pre-select all recommendations by default
        const initialSelected: Record<string, boolean> = {};
        data.recommendations.forEach((rec: SmartRecommendation) => {
          initialSelected[rec.productId] = true;
        });
        setSelectedProductIds(initialSelected);
      }
    } catch (err) {
      console.error('Failed to generate smart list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSmartList();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleProduct = (id: string) => {
    setSelectedProductIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = (select: boolean) => {
    const updated: Record<string, boolean> = {};
    recommendations.forEach(r => {
      updated[r.productId] = select;
    });
    setSelectedProductIds(updated);
  };

  const handleAddSelectedToCart = () => {
    let count = 0;
    recommendations.forEach(rec => {
      if (selectedProductIds[rec.productId]) {
        const prod = products.find(p => p.id === rec.productId);
        if (prod && prod.inStock) {
          addToCart(prod, rec.suggestedQuantity || 1);
          count++;
        }
      }
    });

    if (count > 0) {
      setAddedSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onClose();
        setIsCartDrawerOpen(true);
      }, 700);
    }
  };

  // Calculate total price of selected items
  const selectedTotal = recommendations.reduce((sum, rec) => {
    if (!selectedProductIds[rec.productId]) return sum;
    const prod = products.find(p => p.id === rec.productId);
    if (!prod) return sum;
    return sum + (prod.price * (rec.suggestedQuantity || 1));
  }, 0);

  const selectedCount = Object.values(selectedProductIds).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with AI Gradient Brand */}
        <div className="bg-gradient-to-r from-[#044b20] via-[#0b6623] to-[#0e793c] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center shadow-md">
              <BrainCircuit className="w-7 h-7 text-[#044b20]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-display tracking-tight">
                  SIMORA Smart Shopping List
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  <span>Gemini AI</span>
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Predictive replenishment powered by your past purchase history & order intervals
              </p>
            </div>
          </div>
        </div>

        {/* Filter Presets Toolbar */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'weekly_routine', label: '📅 Weekly Routine' },
              { id: 'breakfast_dairy', label: '🥛 Daily Dairy & Breakfast' },
              { id: 'healthy_fresh', label: '🥗 Taaza Farm Veggies' },
              { id: 'weekend_snacks', label: '🍿 Weekend Munchies' },
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset.id as any);
                  fetchSmartList(preset.id, customPrompt);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap text-xs ${
                  selectedPreset === preset.id
                    ? 'bg-[#0b6623] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchSmartList(selectedPreset, customPrompt)}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 ml-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Regenerate AI Analysis</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Summary Callout Banner */}
          {summary && (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <span className="font-bold text-emerald-900 block mb-0.5">
                  AI Replenishment Analysis:
                </span>
                <p className="leading-relaxed">{summary}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                  <span>Based on <strong>{orders.length} past orders</strong></span>
                  <span>·</span>
                  <span>Average cycle: <strong>3-4 days</strong></span>
                  <span>·</span>
                  <span className="text-emerald-800 font-medium">Model: Gemini 3.8 Flash</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Select All / Deselect All */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Suggested Items ({recommendations.length})
            </span>
            <div className="flex gap-3 text-xs">
              <button
                onClick={() => handleSelectAll(true)}
                className="text-emerald-700 font-bold hover:underline"
              >
                Select All
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => handleSelectAll(false)}
                className="text-slate-500 font-semibold hover:underline"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white animate-pulse flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="w-20 h-8 bg-slate-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <BrainCircuit className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No suggestions generated yet</h4>
              <p className="text-xs text-slate-400">Click "Regenerate AI Analysis" to calculate your replenishment list.</p>
            </div>
          ) : (
            /* Recommendations Cards */
            <div className="space-y-3">
              {recommendations.map((rec) => {
                const product = products.find(p => p.id === rec.productId);
                if (!product) return null;
                const isSelected = !!selectedProductIds[rec.productId];

                const getUrgencyBadge = (urgency: string) => {
                  switch (urgency) {
                    case 'Overdue Refill':
                      return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">⚡ Overdue Refill</span>;
                    case 'Running Low':
                      return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">⏳ Running Low</span>;
                    case 'Habitual Favorite':
                      return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">★ Regular Habit</span>;
                    default:
                      return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">✨ Pairs Well</span>;
                  }
                };

                return (
                  <div
                    key={rec.productId}
                    onClick={() => handleToggleProduct(rec.productId)}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/30 shadow-xs ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 opacity-70'
                    }`}
                  >
                    {/* Left: Checkbox + Image + Details */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-2 sm:mt-0 transition-colors ${
                        isSelected 
                          ? 'bg-[#0b6623] border-[#0b6623] text-white' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {/* Product Image */}
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          {getUrgencyBadge(rec.urgency)}
                          <span className="text-[10px] text-slate-400 font-medium">
                            {rec.smartCategory}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {product.name}
                        </h4>

                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="font-medium">{product.unit}</span>
                          <span>·</span>
                          <span className="font-mono font-bold text-slate-900">₹{product.price}</span>
                          <span>·</span>
                          <span className="font-semibold text-emerald-800">
                            Suggest: {rec.suggestedQuantity}x
                          </span>
                        </div>

                        {/* AI Reasoning explanation */}
                        <p className="text-[11px] text-slate-600 mt-1 italic leading-tight">
                          💡 {rec.aiReason}
                        </p>
                      </div>
                    </div>

                    {/* Right: Price Subtotal for this recommendation */}
                    <div className="text-right shrink-0 self-end sm:self-center pl-8 sm:pl-0">
                      <span className="text-sm font-black font-mono text-slate-900">
                        ₹{product.price * (rec.suggestedQuantity || 1)}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        ({rec.suggestedQuantity} x ₹{product.price})
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Checkout CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">
              Selected ({selectedCount} items)
            </span>
            <span className="text-lg font-black font-mono text-[#0b6623]">
              ₹{selectedTotal}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleAddSelectedToCart}
              disabled={selectedCount === 0 || isLoading}
              className="py-3 px-6 bg-[#0b6623] hover:bg-[#09521c] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 active:scale-98"
            >
              <ShoppingBag className="w-4 h-4 text-yellow-300" />
              <span>Add {selectedCount} Items to Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
