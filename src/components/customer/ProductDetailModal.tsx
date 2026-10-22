import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock, Star, ShieldCheck, Plus, Minus, Check, ArrowRight } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductForDetail, 
    setSelectedProductForDetail, 
    cart, 
    addToCart, 
    updateCartQuantity,
    setIsCartDrawerOpen 
  } = useApp();

  if (!selectedProductForDetail) return null;
  const product = selectedProductForDetail;

  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image Showcase */}
        <div className="md:w-1/2 bg-slate-50 relative p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
          <button
            onClick={() => setSelectedProductForDetail(null)}
            className="md:hidden absolute top-4 right-4 p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center my-auto">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="flex items-center gap-1 font-semibold text-emerald-800">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Delivered in {product.deliveryTimeMins} mins</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Quality Checked</span>
            </span>
          </div>
        </div>

        {/* Right: Info & Purchase Module */}
        <div className="md:w-1/2 flex flex-col justify-between p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700">
                  {product.category.replace('_', ' & ')}
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 leading-snug mt-0.5">
                  {product.name}
                </h2>
                {product.hindiName && (
                  <p className="text-xs text-slate-400 font-medium">{product.hindiName}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedProductForDetail(null)}
                className="hidden md:block p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Weight & Rating */}
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 bg-slate-100 font-bold text-slate-700 rounded-md">
                {product.unit}
              </span>
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-slate-100 pt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Product Details
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Nutrition or Ingredients */}
            {product.nutrition && (
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Nutritional Values (Approx. per 100g)
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="block font-bold text-slate-800">{product.nutrition.calories}</span>
                    <span className="text-[10px] text-slate-400">Energy</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="block font-bold text-slate-800">{product.nutrition.protein}</span>
                    <span className="text-[10px] text-slate-400">Protein</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="block font-bold text-slate-800">{product.nutrition.carbs}</span>
                    <span className="text-[10px] text-slate-400">Carbs</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="block font-bold text-slate-800">{product.nutrition.fat}</span>
                    <span className="text-[10px] text-slate-400">Fat</span>
                  </div>
                </div>
              </div>
            )}

            {product.ingredients && (
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Key Ingredients
                </h4>
                <p className="text-xs text-slate-600">{product.ingredients}</p>
              </div>
            )}
          </div>

          {/* Bottom Sticky Purchase Bar */}
          <div className="border-t border-slate-200 pt-4 mt-6 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900 font-mono">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through font-mono">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500">Inclusive of all taxes</span>
            </div>

            {quantity === 0 ? (
              <button
                onClick={() => addToCart(product, 1)}
                className="px-6 py-3 bg-[#0b6623] hover:bg-[#09521c] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#0b6623] text-white rounded-xl shadow-xs overflow-hidden">
                  <button
                    onClick={() => updateCartQuantity(product.id, quantity - 1)}
                    className="p-2.5 hover:bg-emerald-800 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-bold font-mono text-yellow-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(product.id, quantity + 1)}
                    className="p-2.5 hover:bg-emerald-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSelectedProductForDetail(null);
                    setIsCartDrawerOpen(true);
                  }}
                  className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <span>View Cart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
