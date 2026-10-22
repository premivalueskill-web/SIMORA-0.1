import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  Check, 
  ShoppingBag, 
  MapPin, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  Heart
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotalCount,
    selectedAddress,
    setIsLocationModalOpen,
    coupons,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    setIsCheckoutModalOpen,
    setIsAuthModalOpen,
    user
  } = useApp();

  const [enteredCoupon, setEnteredCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; text: string } | null>(null);
  const [selectedTip, setSelectedTip] = useState<number>(20);

  if (!isCartDrawerOpen) return null;

  const deliveryFee = cartSubtotal > 199 || activeCoupon?.code === 'FREEDEL' ? 0 : 25;
  const handlingFee = 5;
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee + handlingFee + selectedTip - discountAmount);

  const handleApply = (codeToApply: string) => {
    const res = applyCoupon(codeToApply);
    if (res.success) {
      setCouponFeedback({ success: true, text: res.message });
      setEnteredCoupon('');
    } else {
      setCouponFeedback({ success: false, text: res.message });
    }
  };

  const handleProceed = () => {
    if (!user.isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!selectedAddress) {
      setIsLocationModalOpen(true);
      return;
    }
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold font-display text-slate-800">
              My SIMORA Cart ({cartTotalCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Delivery Address Pill */}
        <div className="bg-emerald-50/70 px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 max-w-[280px]">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-slate-800">Deliver to {selectedAddress?.label || 'Address'}: </span>
              <span className="text-slate-600 truncate">{selectedAddress ? `${selectedAddress.houseFlat}, ${selectedAddress.areaStreet}` : 'Select Address'}</span>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 shrink-0"
          >
            Change
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Your kitchen is waiting! Explore fresh veggies, morning milk, snacks & kitchen staples delivered in 10 mins.
                </p>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="mt-2 px-5 py-2.5 bg-[#0b6623] hover:bg-[#09521c] text-white text-xs font-bold rounded-xl"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <>
              {/* Delivery ETA Alert */}
              <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200/80 flex items-center gap-2 text-xs text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">Lightning delivery in <strong>10-12 mins</strong> once placed!</span>
              </div>

              {/* Items */}
              <div className="space-y-3 divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200/60"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-400">{item.product.unit}</p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xs font-black font-mono text-slate-900">₹{item.product.price}</span>
                        {item.product.originalPrice > item.product.price && (
                          <span className="text-[10px] text-slate-400 line-through font-mono">₹{item.product.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center bg-[#0b6623] text-white rounded-lg shadow-xs overflow-hidden shrink-0">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-emerald-800 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold font-mono text-yellow-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-emerald-800 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear cart option */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={clearCart}
                  className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Entire Cart</span>
                </button>
              </div>

              {/* Coupons & Promo Codes */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Coupons & Offers</span>
                  </span>
                  {activeCoupon && (
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] text-red-600 font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {activeCoupon ? (
                  <div className="bg-emerald-100/70 border border-emerald-300 text-emerald-900 px-3 py-2 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold uppercase tracking-wider">{activeCoupon.code}</span>
                      <p className="text-[11px] text-emerald-800">You saved ₹{discountAmount} with this offer!</p>
                    </div>
                    <Check className="w-4 h-4 text-emerald-700" />
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={enteredCoupon}
                        onChange={(e) => setEnteredCoupon(e.target.value.toUpperCase())}
                        placeholder="Enter coupon (e.g. SIMORA50)"
                        className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 uppercase font-mono focus:border-emerald-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleApply(enteredCoupon)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {couponFeedback && (
                      <p className={`text-[11px] ${couponFeedback.success ? 'text-emerald-700 font-semibold' : 'text-red-600'}`}>
                        {couponFeedback.text}
                      </p>
                    )}

                    {/* Quick suggestion pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {coupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleApply(c.code)}
                          className="px-2 py-0.5 rounded border border-emerald-300 bg-white text-[10px] font-bold text-emerald-800 hover:bg-emerald-50 transition-colors"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Delivery Partner Tip */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                    <span>Tip Delivery Partner</span>
                  </span>
                  <span className="text-[10px] text-slate-500">100% goes to your rider</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 10, 20, 30].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTip(t)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        selectedTip === t
                          ? 'bg-[#0b6623] text-white border-[#0b6623]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t === 0 ? 'No tip' : `₹${t}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                  Bill Summary
                </h4>
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-mono text-slate-800">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span className="font-mono">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[10px] text-emerald-700">Add ₹{200 - cartSubtotal} more for FREE delivery!</p>
                )}
                <div className="flex justify-between">
                  <span>Handling & Packaging Fee</span>
                  <span className="font-mono text-slate-800">₹{handlingFee}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount ({activeCoupon?.code})</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}
                {selectedTip > 0 && (
                  <div className="flex justify-between">
                    <span>Rider Tip</span>
                    <span className="font-mono text-slate-800">₹{selectedTip}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>To Pay</span>
                  <span className="font-mono text-base text-[#0b6623]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Trust badge */}
              <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg text-[10px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Zero cancellation fee if dark store hasn't dispatched. No questions asked return at delivery.</span>
              </div>
            </>
          )}
        </div>

        {/* Drawer Bottom Action */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <button
              onClick={handleProceed}
              className="w-full py-3.5 bg-[#0b6623] hover:bg-[#09521c] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-between px-5 active:scale-98"
            >
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-wider text-emerald-200">Total Payable</span>
                <span className="text-base font-black font-mono text-yellow-300">₹{grandTotal}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
