import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, Bike, Tag, CheckCheck, Clock } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markNotificationRead,
    setActiveTrackingOrderId
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold font-display text-slate-800">
              SIMORA Updates
            </h3>
          </div>
          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No new notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.orderId) {
                    setIsNotificationDrawerOpen(false);
                    setActiveTrackingOrderId(notif.orderId);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  !notif.read 
                    ? 'border-emerald-300 bg-emerald-50/50 shadow-xs' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    notif.type === 'order' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : notif.type === 'promo' 
                      ? 'bg-yellow-100 text-amber-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {notif.type === 'order' && <Bike className="w-4 h-4" />}
                    {notif.type === 'promo' && <Tag className="w-4 h-4" />}
                    {notif.type === 'system' && <Bell className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    {notif.orderId && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 underline">
                        Tap to Track Order →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-400">
          Push alerts active for 10-minute order tracking
        </div>
      </div>
    </div>
  );
};
