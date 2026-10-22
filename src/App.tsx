import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/customer/HeroBanner';
import { CategoryBar } from './components/customer/CategoryBar';
import { ProductCard } from './components/customer/ProductCard';
import { AuthModal } from './components/auth/AuthModal';
import { LocationPickerModal } from './components/location/LocationPickerModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { LiveTrackingModal } from './components/customer/LiveTrackingModal';
import { OrdersModal } from './components/customer/OrdersModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { SmartShoppingListModal } from './components/customer/SmartShoppingListModal';
import { PlayStorePublishModal } from './components/common/PlayStorePublishModal';
import { PWAInstallButton } from './components/common/PWAInstallButton';
import { ShopkeeperDashboardView } from './components/shopkeeper/ShopkeeperDashboardView';
import { RiderAppView } from './components/rider/RiderAppView';
import { StartingLoginView } from './components/auth/StartingLoginView';
import { 
  Sparkles, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Bike, 
  Clock, 
  CheckCircle2,
  PackageX
} from 'lucide-react';
import { CATEGORIES } from './data/initialData';

const MainContent: React.FC = () => {
  const { 
    role, 
    products, 
    activeCategory, 
    searchQuery, 
    setSearchQuery,
    orders,
    setActiveTrackingOrderId,
    isSmartListModalOpen,
    setIsSmartListModalOpen,
    isPlayStoreModalOpen,
    setIsPlayStoreModalOpen,
    showLoginScreen
  } = useApp();

  // If user is not yet logged in with OTP, show Starting Login Screen first
  if (showLoginScreen) {
    return <StartingLoginView />;
  }

  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'offers'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc'>('popular');

  // Filter products based on category, search and dietary
  const filteredProducts = products.filter((product) => {
    // Category match
    if (activeCategory !== 'all' && product.category !== activeCategory) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = product.name.toLowerCase().includes(q);
      const matchesHindi = product.hindiName?.toLowerCase().includes(q);
      const matchesCategory = product.category.toLowerCase().includes(q);
      if (!matchesTitle && !matchesHindi && !matchesCategory) {
        return false;
      }
    }
    // Offers filter
    if (dietaryFilter === 'offers' && product.price >= product.originalPrice) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return b.rating - a.rating; // default popular
  });

  const activeCategoryTitle = activeCategory === 'all' 
    ? 'All Daily Essentials & Groceries' 
    : CATEGORIES.find(c => c.id === activeCategory)?.name || 'Products';

  const liveOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-500 selection:text-white">
      <Header />

      {/* Floating Active Order Notice Strip for Customer */}
      {role === 'customer' && liveOrders.length > 0 && (
        <div className="bg-[#0b6623] text-white px-4 py-2 border-b border-emerald-800 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping"></span>
              <span>Order <strong>#{liveOrders[0].orderNumber}</strong> is {liveOrders[0].status.replace(/_/g, ' ')}!</span>
              <span className="hidden sm:inline text-emerald-200">· OTP: {liveOrders[0].deliveryPin}</span>
            </div>
            <button
              onClick={() => setActiveTrackingOrderId(liveOrders[0].id)}
              className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-xs"
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Track Live on Map</span>
            </button>
          </div>
        </div>
      )}

      {/* Main View Switcher: Customer vs Delivery Partner vs Shopkeeper */}
      <main className="flex-1">
        {role === 'rider' ? (
          <RiderAppView />
        ) : role === 'shopkeeper' ? (
          <ShopkeeperDashboardView />
        ) : (
          /* Customer Storefront */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
            {/* Install banner on mobile */}
            <div className="md:hidden">
              <PWAInstallButton variant="banner" />
            </div>

            {/* Hero Promotion Carousel */}
            {!searchQuery && <HeroBanner />}

            {/* Quick Category Navigation */}
            <div className="my-3">
              <CategoryBar />
            </div>

            {/* Product Section Header & Filters */}
            <div id="products-section" className="mt-6 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{activeCategoryTitle}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                    {filteredProducts.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Handpicked & packed in under 2 minutes at your local SIMORA dark store.
                </p>
              </div>

              {/* Sorting & Filter controls */}
              <div className="flex items-center gap-2 text-xs">
                {/* Offer Toggle */}
                <button
                  onClick={() => setDietaryFilter(dietaryFilter === 'offers' ? 'all' : 'offers')}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                    dietaryFilter === 'offers'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ⚡ Discounts Only
                </button>

                {/* Sort dropdown */}
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700">
                  <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent font-semibold focus:outline-none text-xs"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <PackageX className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No matching items found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  We couldn't find any products matching "{searchQuery}". Try searching for tomatoes, milk, atta, or bread.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setDietaryFilter('all');
                  }}
                  className="px-4 py-2 bg-[#0b6623] text-white text-xs font-bold rounded-xl"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <AuthModal />
      <LocationPickerModal />
      <CartDrawer />
      <CheckoutModal />
      <LiveTrackingModal />
      <OrdersModal />
      <NotificationDrawer />
      <ProductDetailModal />
      <SmartShoppingListModal 
        isOpen={isSmartListModalOpen} 
        onClose={() => setIsSmartListModalOpen(false)} 
      />
      <PlayStorePublishModal 
        isOpen={isPlayStoreModalOpen} 
        onClose={() => setIsPlayStoreModalOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
