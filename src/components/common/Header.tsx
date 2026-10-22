import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  User, 
  Bell, 
  Bike, 
  Store, 
  ChevronDown,
  Clock,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { LOGO_IMAGE } from '../../data/initialData';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    user,
    selectedAddress,
    cartTotalCount,
    cartSubtotal,
    setIsAuthModalOpen,
    setIsLocationModalOpen,
    setIsCartDrawerOpen,
    setIsOrdersModalOpen,
    setIsNotificationDrawerOpen,
    setIsSmartListModalOpen,
    setIsPlayStoreModalOpen,
    unreadNotificationsCount,
    searchQuery,
    setSearchQuery,
    orders,
    setShowLoginScreen
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top micro-announcement banner */}
      <div className="bg-[#0b6623] text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-yellow-300">⚡ 10-Minute Delivery</span>
            <span className="text-emerald-200/60 hidden sm:inline">|</span>
            <span className="text-emerald-100 hidden sm:inline">Free delivery on orders above ₹199</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="hidden md:inline text-yellow-300">Code: SIMORA50 for ₹50 OFF</span>
            <div className="relative">
              <button 
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-800 px-2.5 py-0.5 rounded text-white text-[11px] font-medium transition-colors"
                title="Switch between Customer, Delivery Partner, and Shopkeeper Interfaces"
              >
                <span>View: <strong className="capitalize text-yellow-300">
                  {role === 'shopkeeper' ? 'Shopkeeper Hub' : role === 'rider' ? 'Delivery Partner' : 'Customer App'}
                </strong></span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isRoleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-slate-800"
                  onMouseLeave={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Active Interface
                  </div>
                  <button
                    onClick={() => { setRole('customer'); setIsRoleDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 ${role === 'customer' ? 'text-emerald-700 font-bold bg-emerald-50/60' : ''}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                      Customer Storefront
                    </span>
                    {role === 'customer' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  </button>
                  <button
                    onClick={() => { setRole('rider'); setIsRoleDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 ${role === 'rider' ? 'text-emerald-700 font-bold bg-emerald-50/60' : ''}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Bike className="w-3.5 h-3.5 text-blue-600" />
                      Delivery Partner (Rider)
                    </span>
                    {role === 'rider' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                  </button>
                  <button
                    onClick={() => { setRole('shopkeeper'); setIsRoleDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 ${role === 'shopkeeper' ? 'text-emerald-700 font-bold bg-emerald-50/60' : ''}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-amber-600" />
                      Shopkeeper Hub
                    </span>
                    {role === 'shopkeeper' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>}
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => { setShowLoginScreen(true); setIsRoleDropdownOpen(false); }}
                    className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 text-slate-700 font-semibold"
                  >
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                      Mobile OTP Login Screen
                    </span>
                  </button>
                  <button
                    onClick={() => { setIsPlayStoreModalOpen(true); setIsRoleDropdownOpen(false); }}
                    className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 text-emerald-800 font-bold"
                  >
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                      Publish on Play Store
                    </span>
                    <span className="text-[10px] bg-yellow-400 text-slate-900 px-1.5 py-0.2 rounded font-bold">AAB</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsPlayStoreModalOpen(true)}
              className="hidden lg:flex items-center gap-1 text-[11px] bg-yellow-400 text-slate-950 font-black px-2 py-0.5 rounded shadow-xs hover:bg-yellow-300"
            >
              <span>Play Store Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Location */}
        <div className="flex items-center gap-5 shrink-0">
          <button 
            onClick={() => setRole('customer')} 
            className="flex items-center gap-2 group text-left"
          >
            <img 
              src={LOGO_IMAGE} 
              alt="SIMORA - Your Need Our Deed" 
              className="h-10 sm:h-12 w-auto object-contain rounded-md transition-transform group-hover:scale-102"
              onError={(e) => {
                // Fallback styled logo if asset path issues
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden lg:block leading-none">
              <span className="block text-xl font-extrabold tracking-tight text-[#0b6623] font-display">SIMORA</span>
              <span className="text-[10px] italic font-semibold text-slate-500 tracking-wide">Your Need Our Deed</span>
            </div>
          </button>

          {/* Location Picker pill */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200/90 hover:border-emerald-600/60 bg-slate-50 hover:bg-emerald-50/30 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="max-w-[140px] sm:max-w-[190px] leading-tight">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                <span>Deliver in 10-12 Mins</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {selectedAddress 
                  ? `${selectedAddress.label}: ${selectedAddress.houseFlat}, ${selectedAddress.areaStreet}` 
                  : 'Select delivery address'}
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search "milk", "fresh tomatoes", "atta", "chips", "soap"...'
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600"></span>
            )}
          </button>

          {/* AI Smart List Button */}
          <button
            onClick={() => setIsSmartListModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-all hover:scale-102"
            title="AI Smart Shopping List: Suggests refills from past order intervals"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 fill-emerald-600" />
            <span className="hidden sm:inline">Smart List</span>
            <span className="text-[10px] bg-emerald-700 text-yellow-300 px-1 py-0.2 rounded font-mono font-bold">AI</span>
          </button>

          {/* Orders Button */}
          <button
            onClick={() => setIsOrdersModalOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Orders</span>
            {activeOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                {activeOrdersCount}
              </span>
            )}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* User profile / login */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
              {user.isLoggedIn ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="hidden md:inline max-w-[90px] truncate">
              {user.isLoggedIn ? user.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Cart Floating Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2 bg-[#0b6623] hover:bg-[#09521c] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/10 transition-all hover:scale-102 shrink-0 active:scale-98"
          >
            <ShoppingBag className="w-4 h-4 text-yellow-300" />
            <div className="flex items-center gap-1.5">
              <span>{cartTotalCount} {cartTotalCount === 1 ? 'item' : 'items'}</span>
              {cartTotalCount > 0 && (
                <>
                  <span className="text-emerald-300">·</span>
                  <span className="text-yellow-300 font-mono font-bold">₹{cartSubtotal}</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile search bar visible on small devices */}
      <div className="px-4 pb-2.5 pt-0 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search "milk", "vegetables", "atta", "chips"...'
            className="w-full pl-9 pr-4 py-2 bg-slate-100 text-xs text-slate-800 rounded-lg border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
};
