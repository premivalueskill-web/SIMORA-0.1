import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bike, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  KeyRound, 
  Wallet, 
  Star, 
  ShieldCheck, 
  Building, 
  AlertCircle,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RiderAppView: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    verifyDeliveryPin, 
    activeRider, 
    toggleRiderOnline,
    setRole,
    riderProfile,
    logout
  } = useApp();

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [selectedOrderIdForDelivery, setSelectedOrderIdForDelivery] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assigned' | 'completed'>('assigned');
  const [simulatedCall, setSimulatedCall] = useState<string | null>(null);

  const assignedOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedOrders = orders.filter(o => o.status === 'delivered');

  const todayEarnings = 420 + completedOrders.length * 45;

  const handleVerifyDelivery = (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    const verified = verifyDeliveryPin(orderId, enteredPin);
    if (!verified) {
      setPinError('Incorrect PIN. Please ask customer for their 4-digit SIMORA Delivery OTP.');
    } else {
      setPinError('');
      setEnteredPin('');
      setSelectedOrderIdForDelivery(null);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Rider Profile & Status Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0b6623] text-yellow-300 flex items-center justify-center font-bold text-xl border-2 border-yellow-400 shrink-0">
            <Bike className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-display">{riderProfile.name || activeRider.name}</h2>
              <span className="flex items-center gap-0.5 text-xs font-bold text-yellow-400 bg-black/40 px-2 py-0.5 rounded">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{riderProfile.rating || activeRider.rating}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {riderProfile.vehicle || activeRider.vehicle} · {riderProfile.vehiclePlate || activeRider.vehiclePlate}
            </p>
            <p className="text-[11px] text-emerald-400">Mobile: {riderProfile.phone || activeRider.phone} · Koramangala Hub #12</p>
          </div>
        </div>

        {/* Online/Offline Toggle & Quick switch back */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          <button
            onClick={() => toggleRiderOnline(activeRider.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeRider.isOnline
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeRider.isOnline ? 'bg-yellow-300 animate-pulse' : 'bg-slate-500'}`}></span>
            <span>{activeRider.isOnline ? 'ONLINE & RECEIVING ORDERS' : 'OFFLINE'}</span>
          </button>

          <button
            onClick={() => setRole('customer')}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            Storefront
          </button>

          <button
            onClick={logout}
            className="px-3 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold transition-colors"
            title="Sign out & return to Starting Login Screen"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Rider KPI Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold">Today's Earnings</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
            ₹{todayEarnings}
          </span>
          <p className="text-[10px] text-emerald-700 mt-0.5">₹45 / trip + instant tips</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold">Active Deliveries</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
            {assignedOrders.length}
          </span>
          <p className="text-[10px] text-amber-700 mt-0.5">Target: 10-12 mins SLA</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold">Completed Today</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
            {completedOrders.length}
          </span>
          <p className="text-[10px] text-blue-700 mt-0.5">100% on-time record</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'assigned'
              ? 'bg-[#0b6623] text-white'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Assigned Tasks ({assignedOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'completed'
              ? 'bg-[#0b6623] text-white'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Completed History ({completedOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {activeTab === 'assigned' ? (
          assignedOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
              <Bike className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No pending orders assigned</h4>
              <p className="text-xs text-slate-400">
                You are online! New orders placed by customers in the Customer App will appear here in real time.
              </p>
            </div>
          ) : (
            assignedOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-slate-900">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold uppercase">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-800">
                      Collect: {order.paymentMethod === 'cod' ? `₹${order.total} (COD)` : '₹0 (Prepaid Online)'}
                    </span>
                  </div>
                </div>

                {/* Pickup & Drop Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Pickup */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px]">
                      <Building className="w-3.5 h-3.5 text-emerald-700" />
                      <span>1. Pickup Store</span>
                    </div>
                    <p className="font-bold text-slate-800">SIMORA Dark Store #12</p>
                    <p className="text-slate-500 text-[11px]">80 Feet Road, 4th Block, Koramangala</p>
                  </div>

                  {/* Drop */}
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase text-[10px]">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>2. Customer Drop Location</span>
                    </div>
                    <p className="font-bold text-slate-800">{order.customerName} ({order.address.label})</p>
                    <p className="text-slate-600 text-[11px]">{order.address.houseFlat}, {order.address.areaStreet}</p>
                    {order.instructions && (
                      <p className="text-[10px] text-amber-800 font-medium bg-amber-50 p-1 rounded mt-1">
                        Note: {order.instructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block mb-1">Order Items ({order.items.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {order.items.map(item => (
                      <span key={item.product.id} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {item.quantity}x {item.product.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons for Rider */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSimulatedCall(order.customerPhone)}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Customer</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${order.address.latitude},${order.address.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>Google Maps Turn-by-Turn</span>
                    </a>
                  </div>

                  {/* Status update steps */}
                  <div className="flex items-center gap-2">
                    {order.status === 'placed' || order.status === 'packed' || order.status === 'assigned' ? (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'out_for_delivery', 'Rider picked up order and is on the way')}
                        className="px-4 py-2 bg-[#0b6623] hover:bg-[#09521c] text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Start Delivery (Picked Up)
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedOrderIdForDelivery(order.id)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Confirm Delivery (Enter OTP)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* PIN Prompt Modal / Inline if this order selected */}
                {selectedOrderIdForDelivery === order.id && (
                  <div className="mt-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-3 animate-in fade-in">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-emerald-800" />
                        <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                          Enter Customer 4-Digit Delivery PIN
                        </h5>
                      </div>
                      <button
                        onClick={() => setSelectedOrderIdForDelivery(null)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>

                    <p className="text-[11px] text-emerald-800">
                      Ask the customer for their secret OTP (displayed on their live tracking screen: <strong>{order.deliveryPin}</strong>)
                    </p>

                    <form onSubmit={(e) => handleVerifyDelivery(e, order.id)} className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={enteredPin}
                        onChange={(e) => setEnteredPin(e.target.value)}
                        placeholder="Enter 4-digit PIN"
                        className="w-44 px-3 py-2 text-center text-base font-bold font-mono rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-600"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Verify & Complete
                      </button>
                    </form>

                    {pinError && (
                      <p className="text-xs text-red-600 font-semibold">{pinError}</p>
                    )}
                  </div>
                )}
              </div>
            ))
          )
        ) : (
          /* Completed Orders */
          completedOrders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="font-bold font-mono text-slate-800">Order #{order.orderNumber}</span>
                <p className="text-slate-500 mt-0.5">{order.address.areaStreet} · {order.customerName}</p>
              </div>
              <div className="text-right">
                <span className="text-emerald-700 font-bold block">+₹45 Earned</span>
                <span className="text-[10px] text-slate-400">Delivered with OTP</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Simulated Call Modal */}
      {simulatedCall && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-900 text-white rounded-2xl w-full max-w-xs p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl font-bold animate-pulse">
              <PhoneCall className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold">Calling Customer</h4>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">{simulatedCall}</p>
              <p className="text-[11px] text-slate-400 mt-2">SIMORA Masked Partner Call Connected</p>
            </div>
            <button
              onClick={() => setSimulatedCall(null)}
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
