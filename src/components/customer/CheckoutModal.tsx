import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethod } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    selectedAddress,
    setIsLocationModalOpen,
    cartSubtotal,
    cartTotalCount,
    activeCoupon,
    discountAmount,
    placeOrder,
    setActiveTrackingOrderId,
    setIsOrdersModalOpen
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay_upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred'>('gpay');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const deliveryFee = cartSubtotal > 199 || activeCoupon?.code === 'FREEDEL' ? 0 : 25;
  const handlingFee = 5;
  const tip = 20;
  const totalAmount = Math.max(0, cartSubtotal + deliveryFee + handlingFee + tip - discountAmount);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (paymentMethod === 'cod') {
      // Direct COD order placement
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        const order = placeOrder({
          address: selectedAddress,
          paymentMethod: 'cod',
          tip,
          instructions: deliveryNote,
        });

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        setIsCheckoutModalOpen(false);
        setActiveTrackingOrderId(order.id);
      }, 700);
    } else {
      // Trigger Razorpay simulated payment gateway
      setShowRazorpayModal(true);
    }
  };

  const handleRazorpaySuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowRazorpayModal(false);
      setPaymentSuccess(true);

      const order = placeOrder({
        address: selectedAddress!,
        paymentMethod,
        tip,
        instructions: deliveryNote,
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setIsCheckoutModalOpen(false);
        setActiveTrackingOrderId(order.id);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-display text-slate-800">
              SIMORA Express Checkout
            </h3>
            <p className="text-xs text-slate-500">
              Deliver in 10-12 minutes · Safe & contactless
            </p>
          </div>
          <button 
            onClick={() => setIsCheckoutModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Delivery Address Summary */}
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xs leading-tight">
                <span className="font-bold text-slate-800">Deliver to {selectedAddress?.label}</span>
                <p className="text-slate-600 mt-0.5">{selectedAddress?.houseFlat}, {selectedAddress?.areaStreet}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{selectedAddress?.city} - {selectedAddress?.pincode}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCheckoutModalOpen(false);
                setIsLocationModalOpen(true);
              }}
              className="text-xs font-bold text-emerald-800 underline shrink-0 hover:text-emerald-950"
            >
              Change
            </button>
          </div>

          {/* Delivery Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Delivery Instructions (Optional)
            </label>
            <input
              type="text"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="e.g. Leave with security, do not ring bell, landmark near gate"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Payment Method
            </label>

            {/* UPI Option */}
            <div 
              onClick={() => setPaymentMethod('razorpay_upi')}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                paymentMethod === 'razorpay_upi'
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-600/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">UPI (Instant & Fastest)</h4>
                    <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, CRED</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'razorpay_upi' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'razorpay_upi' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>

              {/* Sub-apps if UPI selected */}
              {paymentMethod === 'razorpay_upi' && (
                <div className="mt-3 pt-2.5 border-t border-emerald-200/60 grid grid-cols-4 gap-2">
                  {[
                    { id: 'gpay', name: 'Google Pay' },
                    { id: 'phonepe', name: 'PhonePe' },
                    { id: 'paytm', name: 'Paytm' },
                    { id: 'cred', name: 'CRED' }
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUpiApp(app.id as any);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                        upiApp === app.id
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {app.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cards Option */}
            <div 
              onClick={() => setPaymentMethod('razorpay_card')}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                paymentMethod === 'razorpay_card'
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-600/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Credit / Debit Card</h4>
                    <p className="text-[11px] text-slate-500">Visa, MasterCard, RuPay, Maestro</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'razorpay_card' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'razorpay_card' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>
            </div>

            {/* Net Banking Option */}
            <div 
              onClick={() => setPaymentMethod('razorpay_netbanking')}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                paymentMethod === 'razorpay_netbanking'
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-600/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Net Banking</h4>
                    <p className="text-[11px] text-slate-500">HDFC, ICICI, SBI, Axis & all major banks</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'razorpay_netbanking' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'razorpay_netbanking' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>
            </div>

            {/* Cash on Delivery (COD) */}
            <div 
              onClick={() => setPaymentMethod('cod')}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                paymentMethod === 'cod'
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-600/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-slate-500">Pay cash or scan QR on arrival at your doorstep</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Payments secured via Razorpay 256-bit encryption. 100% money-back guarantee.</span>
          </div>
        </div>

        {/* Footer Payment Action */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Amount Payable</span>
            <span className="text-lg font-black font-mono text-[#0b6623]">₹{totalAmount}</span>
          </div>

          <button
            onClick={handleStartPayment}
            disabled={isProcessing}
            className="flex-1 py-3 px-5 bg-[#0b6623] hover:bg-[#09521c] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isProcessing ? (
              <span>Securing Order...</span>
            ) : paymentMethod === 'cod' ? (
              <>
                <span>Place COD Order</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Pay ₹{totalAmount} via Razorpay</span>
                <Lock className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Realistic Razorpay Simulated Gateway Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-blue-500 animate-in zoom-in-95">
            {/* Razorpay Branded Top Header */}
            <div className="bg-[#0c2340] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                  R
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-tight">Razorpay Secure</h4>
                  <p className="text-[10px] text-blue-200">Merchant: SIMORA Quick Commerce</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black font-mono text-yellow-300">₹{totalAmount}</span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900">
                <p className="font-bold">Test Sandbox Payment Mode</p>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Simulating payment through <strong>{paymentMethod.replace('razorpay_', '').toUpperCase()}</strong> ({upiApp.toUpperCase()}).
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-semibold">order_sim_{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Customer Phone:</span>
                  <span className="font-mono">{selectedAddress?.phone || '+91 98765 43210'}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRazorpayModal(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleRazorpaySuccess}
                  className="flex-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  {isProcessing ? 'Authorizing...' : 'Simulate Success (Pay)'}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200">
              🔒 PCI-DSS Compliant 256-bit SSL Transaction
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
