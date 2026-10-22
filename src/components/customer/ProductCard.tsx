import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Plus, Minus, Clock, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateCartQuantity, setSelectedProductForDetail } = useApp();

  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5">
      {/* Product Image Area */}
      <div 
        className="relative bg-slate-50 cursor-pointer overflow-hidden aspect-4/3 flex items-center justify-center p-3"
        onClick={() => setSelectedProductForDetail(product)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-104 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback container if image fails */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center text-xs text-slate-400 font-medium">
          {product.name}
        </div>

        {/* Delivery Time Badge */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-slate-200/60">
          <Clock className="w-2.5 h-2.5 text-emerald-600" />
          <span>{product.deliveryTimeMins} MINS</span>
        </div>

        {/* Badge or Discount Tag */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </div>
        )}

        {product.badge && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs uppercase tracking-tight">
            {product.badge}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div 
          className="cursor-pointer"
          onClick={() => setSelectedProductForDetail(product)}
        >
          {/* Unit / Weight */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">{product.unit}</span>
            {product.rating > 0 && (
              <span className="flex items-center gap-0.5 font-bold text-slate-700 text-[11px]">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount})</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Hindi subname */}
          {product.hindiName && (
            <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5">
              {product.hindiName}
            </p>
          )}
        </div>

        {/* Price and Add to Cart Stepper */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 font-mono tabular-nums">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {product.originalPrice > product.price && (
              <span className="text-[10px] text-emerald-700 font-semibold">
                Save ₹{product.originalPrice - product.price}
              </span>
            )}
          </div>

          {/* Add to Cart Button or Stepper */}
          {!product.inStock ? (
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
              Out of Stock
            </span>
          ) : quantity === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="px-3.5 py-1.5 rounded-xl border border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-150 flex items-center gap-1 shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center bg-[#0b6623] text-white rounded-xl shadow-xs overflow-hidden">
              <button
                onClick={() => updateCartQuantity(product.id, quantity - 1)}
                className="px-2 py-1.5 hover:bg-emerald-800 transition-colors"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-bold font-mono min-w-[20px] text-center text-yellow-300">
                {quantity}
              </span>
              <button
                onClick={() => updateCartQuantity(product.id, quantity + 1)}
                className="px-2 py-1.5 hover:bg-emerald-800 transition-colors"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
