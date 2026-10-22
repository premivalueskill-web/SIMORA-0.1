import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCw, 
  Receipt,
  Bike
} from 'lucide-react';

export const OrdersModal: React.FC = () => {
  const {
    isOrdersModalOpen,
    setIsOrdersModalOpen,
    orders,
    setActiveTrackingOrderId,
    addToCart,
    setIsCartDrawerOpen
  } = useApp();

  if (!isOrdersModalOpen) return null;

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    setIsOrdersModalOpen(false);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-display text-slate-800">
              My Order History & Live Deliveries
            </h3>
            <p className="text-xs text-slate-500">
              Track live shipments and view previous receipts
            </p>
          </div>
          <button 
            onClick={() => setIsOrdersModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Clock className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No orders placed yet</h4>
              <p className="text-xs text-slate-400">Your placed orders will show up here with live GPS tracking.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isLive = order.status !== 'delivered' && order.status !== 'cancelled';
                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border transition-all p-4 ${
                      isLive 
                        ? 'border-emerald-500/80 bg-emerald-50/20 shadow-xs ring-1 ring-emerald-500/30' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Top Order Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">
                            #{order.orderNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-amber-900 animate-pulse'
                          }`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black font-mono text-slate-900">
                          ₹{order.total}
                        </span>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">
                          {order.paymentMethod.replace('razorpay_', '').toUpperCase()} ({order.paymentStatus})
                        </p>
                      </div>
                    </div>

                    {/* Address & Items */}
                    <div className="py-3 text-xs space-y-2">
                      <div className="flex items-start gap-2 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{order.address.houseFlat}, {order.address.areaStreet}, {order.address.city}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {order.items.map(item => (
                          <span 
                            key={item.product.id}
                            className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {item.quantity}x {item.product.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                      {isLive && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-800 font-bold">
                            Delivery PIN: <strong className="font-mono text-sm bg-emerald-100 px-1.5 py-0.5 rounded">{order.deliveryPin}</strong>
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>Reorder All</span>
                        </button>

                        {isLive ? (
                          <button
                            onClick={() => {
                              setIsOrdersModalOpen(false);
                              setActiveTrackingOrderId(order.id);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-[#0b6623] hover:bg-[#09521c] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                          >
                            <Bike className="w-3.5 h-3.5 text-yellow-300" />
                            <span>Track on Google Maps</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setIsOrdersModalOpen(false);
                              setActiveTrackingOrderId(order.id);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>View Details</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
