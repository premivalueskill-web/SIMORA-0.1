import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Bike, 
  Building, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  AlertTriangle, 
  Play, 
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';

export const LiveTrackingModal: React.FC = () => {
  const { 
    activeTrackingOrderId, 
    setActiveTrackingOrderId, 
    orders, 
    updateOrderStatus, 
    cancelOrder,
    verifyDeliveryPin 
  } = useApp();

  const [simulatedProgress, setSimulatedProgress] = useState(55); // 0 to 100% of route
  const [showCallModal, setShowCallModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  const order = orders.find(o => o.id === activeTrackingOrderId);

  // Auto tick rider movement when out for delivery
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (order && order.status === 'out_for_delivery' && simulatedProgress < 95) {
      interval = setInterval(() => {
        setSimulatedProgress(prev => Math.min(95, prev + 2));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [order?.status, simulatedProgress]);

  if (!order) return null;

  const rider = order.assignedRider || {
    name: 'Rahul Sharma',
    phone: '+91 98111 22334',
    rating: 4.9,
    vehicle: 'Honda Activa 6G',
    vehiclePlate: 'KA 01 EK 4482',
  };

  const steps = [
    { key: 'placed', label: 'Order Placed', time: '10:02 AM' },
    { key: 'packed', label: 'Packed at Hub', time: '10:04 AM' },
    { key: 'assigned', label: 'Rider Assigned', time: '10:05 AM' },
    { key: 'out_for_delivery', label: 'Out for Delivery', time: '10:07 AM' },
    { key: 'delivered', label: 'Delivered', time: '10:14 AM' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'placed': return 0;
      case 'packed': return 1;
      case 'assigned': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  // Compute rider SVG coords based on route and progress
  // Start (Store): 80, 200. End (Customer): 440, 90.
  const routeStartX = 90;
  const routeStartY = 200;
  const routeEndX = 440;
  const routeEndY = 90;

  const currentRiderX = routeStartX + ((routeEndX - routeStartX) * (simulatedProgress / 100));
  const currentRiderY = routeStartY + ((routeEndY - routeStartY) * (simulatedProgress / 100));

  const handleManualPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verified = verifyDeliveryPin(order.id, enteredPin);
    if (!verified) {
      setPinError('Invalid PIN! Correct code is ' + order.deliveryPin);
    } else {
      setPinError('');
      setSimulatedProgress(100);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-display text-slate-800 flex items-center gap-2">
                <span>Live Google Maps Tracking</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 font-mono">
                  #{order.orderNumber}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Estimated Delivery in <strong className="text-emerald-700">{order.estimatedDeliveryTime}</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTrackingOrderId(null)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Interactive Google Map Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-[#e9ece9] h-60 sm:h-72">
            <svg 
              viewBox="0 0 540 280" 
              className="w-full h-full object-cover" 
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Map background grids and land */}
              <rect width="100%" height="100%" fill="#e8ebe8" />
              <path d="M 0,40 L 160,0 L 140,120 L 0,110 Z" fill="#d7ead8" />
              <path d="M 360,180 L 540,160 L 540,280 L 320,280 Z" fill="#d7ead8" />
              
              {/* Secondary roads */}
              <line x1="0" y1="120" x2="540" y2="120" stroke="#ffffff" strokeWidth="6" />
              <line x1="0" y1="200" x2="540" y2="200" stroke="#ffffff" strokeWidth="6" />
              <line x1="160" y1="0" x2="160" y2="280" stroke="#ffffff" strokeWidth="6" />
              <line x1="320" y1="0" x2="320" y2="280" stroke="#ffffff" strokeWidth="6" />
              <line x1="450" y1="0" x2="450" y2="280" stroke="#ffffff" strokeWidth="6" />

              {/* Delivery Route Path */}
              <path 
                d="M 90,200 L 220,200 L 220,90 L 440,90" 
                stroke="#0b6623" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none" 
              />
              <path 
                d="M 90,200 L 220,200 L 220,90 L 440,90" 
                stroke="#fedc00" 
                strokeWidth="3" 
                strokeDasharray="6,4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none" 
              />

              {/* Start: SIMORA Dark Store Hub */}
              <g transform="translate(90, 200)">
                <circle r="14" fill="#0b6623" stroke="#ffffff" strokeWidth="3" />
                <circle r="6" fill="#fedc00" />
                <text x="0" y="26" textAnchor="middle" fill="#0b6623" fontSize="10" fontWeight="bold">
                  SIMORA Hub #12
                </text>
              </g>

              {/* End: Customer Delivery Address */}
              <g transform="translate(440, 90)">
                <circle r="14" fill="#dc2626" stroke="#ffffff" strokeWidth="3" />
                <circle r="6" fill="#ffffff" />
                <text x="0" y="-18" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold">
                  {order.address.label} ({order.address.houseFlat.slice(0, 15)})
                </text>
              </g>

              {/* Dynamic Animated Delivery Rider */}
              {!isDelivered && !isCancelled && (
                <g transform={`translate(${currentRiderX}, ${currentRiderY})`} className="transition-all duration-700 ease-out">
                  <circle r="18" fill="#0b6623" stroke="#fedc00" strokeWidth="3" className="shadow-lg" />
                  {/* Scooter rider graphic */}
                  <g transform="translate(-10, -10) scale(0.9)">
                    <circle cx="6" cy="16" r="3" fill="#ffffff" />
                    <circle cx="16" cy="16" r="3" fill="#ffffff" />
                    <path d="M 6,16 L 10,12 L 14,12 L 16,16" stroke="#ffffff" strokeWidth="2" fill="none" />
                    <circle cx="13" cy="8" r="2.5" fill="#fedc00" />
                    <rect x="3" y="9" width="5" height="5" fill="#fedc00" rx="1" />
                  </g>
                </g>
              )}
            </svg>

            {/* Live Status Overlay inside Map */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 shadow-md max-w-[240px]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Bike className="w-4 h-4 text-[#0b6623]" />
                <span className="capitalize">{order.status.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                {isDelivered 
                  ? 'Delivered securely to customer' 
                  : `${rider.name} is on the way to ${order.address.areaStreet}`}
              </p>
            </div>

            <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-mono px-2.5 py-1 rounded-md">
              Google Maps Live Sync
            </div>
          </div>

          {/* Customer Secret Delivery OTP / PIN */}
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
                  Customer Delivery OTP
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black font-mono tracking-widest text-yellow-300">
                    {order.deliveryPin}
                  </span>
                  <span className="text-[11px] text-emerald-100">
                    (Share with delivery partner upon arrival)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:block text-right text-xs text-emerald-200">
              <ShieldCheck className="w-5 h-5 ml-auto text-yellow-300 mb-0.5" />
              <span>Contactless & Safe</span>
            </div>
          </div>

          {/* Delivery Partner Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-base border-2 border-emerald-400 shrink-0">
                {rider.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800">{rider.name}</h4>
                  <span className="flex items-center gap-0.5 px-1.5 py-0.2 bg-yellow-100 text-slate-800 text-[10px] font-bold rounded">
                    <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                    <span>{rider.rating}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {rider.vehicle} · {rider.vehiclePlate}
                </p>
                <p className="text-[10px] text-emerald-700 font-medium">SIMORA Verified Delivery Champion</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCallModal(true)}
                className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold transition-colors"
                title="Call Rider"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Order Timeline
            </h4>
            <div className="grid grid-cols-5 gap-1 text-center">
              {steps.map((s, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={s.key} className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                      isCurrent 
                        ? 'bg-[#0b6623] text-yellow-300 ring-2 ring-emerald-300 shadow-xs' 
                        : isPassed 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] font-semibold leading-tight line-clamp-1 ${
                      isPassed ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200/80 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Play className="w-3.5 h-3.5 text-emerald-700" />
                <span>Simulate Order Flow (Demo Control):</span>
              </span>
              <span className="text-[10px] text-slate-500">Fast-forward steps</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  updateOrderStatus(order.id, 'packed', 'Packed at Hub');
                  setSimulatedProgress(25);
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded text-[11px] font-semibold text-slate-700"
              >
                1. Hub Packed
              </button>
              <button
                onClick={() => {
                  updateOrderStatus(order.id, 'out_for_delivery', 'Rider speeding to your address');
                  setSimulatedProgress(60);
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded text-[11px] font-semibold text-slate-700"
              >
                2. Out for Delivery
              </button>
              <button
                onClick={() => {
                  updateOrderStatus(order.id, 'delivered', 'Order successfully received');
                  setSimulatedProgress(100);
                }}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold"
              >
                3. Mark Delivered
              </button>

              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-[11px] font-bold ml-auto"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Order items quick summary */}
          <div className="border-t border-slate-200 pt-3">
            <h5 className="text-xs font-bold text-slate-700 mb-2">
              Items in this Delivery ({order.items.length})
            </h5>
            <div className="space-y-1.5 text-xs text-slate-600">
              {order.items.map(item => (
                <div key={item.product.id} className="flex justify-between">
                  <span>{item.quantity}x {item.product.name} ({item.product.unit})</span>
                  <span className="font-mono text-slate-800">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-900 text-white rounded-2xl w-full max-w-xs p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl font-bold animate-pulse">
              {rider.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-base font-bold">{rider.name}</h4>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">{rider.phone}</p>
              <p className="text-[11px] text-slate-400 mt-2">Connecting SIMORA masked call...</p>
            </div>
            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
