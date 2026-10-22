import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search,
  Tag,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Bike,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Power,
  PhoneCall,
  MapPin,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw,
  LogOut,
  UserCheck
} from 'lucide-react';
import { ProductCategory, Product, OrderStatus } from '../../types';
import { CATEGORIES } from '../../data/initialData';

export const ShopkeeperDashboardView: React.FC = () => {
  const { 
    products, 
    orders, 
    riders, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleStock,
    updateOrderStatus,
    assignOrderToRider,
    setRole,
    storeInfo,
    updateStoreInfo,
    toggleStoreOpen,
    shopkeeperUser,
    logoutShopkeeper,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'analytics' | 'store_settings'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [orderFilter, setOrderFilter] = useState<'all' | 'placed' | 'packed' | 'out_for_delivery' | 'delivered'>('all');
  
  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showStoreEditModal, setShowStoreEditModal] = useState(false);
  
  // Add Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductHindi, setNewProductHindi] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>('vegetables_fruits');
  const [newProductPrice, setNewProductPrice] = useState(40);
  const [newProductOriginalPrice, setNewProductOriginalPrice] = useState(55);
  const [newProductUnit, setNewProductUnit] = useState('1 kg');
  const [newProductStock, setNewProductStock] = useState(25);
  const [newProductDescription, setNewProductDescription] = useState('Fresh local grocery stock sourced directly for fast fulfillment.');

  // Store profile edit form
  const [editStoreName, setEditStoreName] = useState(storeInfo.storeName);
  const [editOwnerName, setEditOwnerName] = useState(storeInfo.ownerName);
  const [editPhone, setEditPhone] = useState(storeInfo.phone);
  const [editAddress, setEditAddress] = useState(storeInfo.address);
  const [editGst, setEditGst] = useState(storeInfo.gstNumber || '29AABCS1429B1Z2');
  const [editFssai, setEditFssai] = useState(storeInfo.fssaiNumber || '11223334000129');

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
  const pendingPackOrders = orders.filter(o => o.status === 'placed');
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const lowStockProducts = products.filter(p => p.stockCount <= 10 || !p.inStock);

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.hindiName && p.hindiName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    // Pick a representative image from category
    const catImages: Record<string, string> = {
      vegetables_fruits: products.find(p => p.category === 'vegetables_fruits')?.image || products[0]?.image,
      dairy_breakfast: products.find(p => p.category === 'dairy_breakfast')?.image || products[4]?.image,
      snacks_munchies: products.find(p => p.category === 'snacks_munchies')?.image || products[8]?.image,
      cold_drinks_juices: products.find(p => p.category === 'cold_drinks_juices')?.image || products[10]?.image,
      staples_kitchen: products.find(p => p.category === 'staples_kitchen')?.image || products[14]?.image,
      personal_care: products.find(p => p.category === 'personal_care')?.image || products[18]?.image,
    };

    addProduct({
      name: newProductName.trim(),
      hindiName: newProductHindi.trim() || undefined,
      category: newProductCategory,
      price: Number(newProductPrice),
      originalPrice: Number(newProductOriginalPrice),
      unit: newProductUnit,
      image: catImages[newProductCategory] || products[0]?.image || '',
      inStock: true,
      stockCount: Number(newProductStock),
      deliveryTimeMins: 10,
      description: newProductDescription,
      badge: 'Fresh Stock'
    });

    setShowAddProductModal(false);
    setNewProductName('');
    setNewProductHindi('');
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      hindiName: editingProduct.hindiName,
      price: Number(editingProduct.price),
      originalPrice: Number(editingProduct.originalPrice),
      stockCount: Number(editingProduct.stockCount),
      unit: editingProduct.unit,
      inStock: editingProduct.stockCount > 0,
    });
    setEditingProduct(null);
  };

  const handleSaveStoreProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreInfo({
      storeName: editStoreName,
      ownerName: editOwnerName,
      phone: editPhone,
      address: editAddress,
      gstNumber: editGst,
      fssaiNumber: editFssai
    });
    setShowStoreEditModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Shopkeeper Header Banner */}
      <div className="bg-gradient-to-r from-[#0b6623] via-[#08521c] to-[#044b20] text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-emerald-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Store className="w-6 h-6 text-[#0b6623]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black font-display tracking-tight">{storeInfo.storeName}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/20 text-emerald-100 font-bold">
                  {storeInfo.storeCode}
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  storeInfo.isOpen ? 'bg-emerald-400 text-slate-950' : 'bg-red-400 text-slate-950'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${storeInfo.isOpen ? 'bg-slate-950 animate-pulse' : 'bg-slate-950'}`}></span>
                  <span>{storeInfo.isOpen ? 'Store Open & Accepting Orders' : 'Store Offline (Closed)'}</span>
                </span>
              </div>
              <p className="text-xs text-yellow-300 mt-0.5">
                Managed by {storeInfo.ownerName} · {storeInfo.address}
              </p>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Toggle Store Status */}
            <button
              onClick={toggleStoreOpen}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                storeInfo.isOpen 
                  ? 'bg-red-500/90 hover:bg-red-600 text-white' 
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{storeInfo.isOpen ? 'Pause Orders' : 'Open Store'}</span>
            </button>

            {/* Switch to Customer Storefront */}
            <button
              onClick={() => setRole('customer')}
              className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-white/20"
            >
              <ExternalLink className="w-3.5 h-3.5 text-yellow-300" />
              <span>View Customer Storefront</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today's Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-emerald-800 mt-2 block">₹{totalRevenue}</span>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>From {orders.filter(o => o.status !== 'cancelled').length} orders</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Orders to Pack</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              pendingPackOrders.length > 0 ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-100 text-slate-600'
            }`}>
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-amber-700 mt-2 block">{pendingPackOrders.length}</span>
          <p className="text-[11px] text-amber-700 mt-1">
            {pendingPackOrders.length > 0 ? 'Needs immediate store packing' : 'All current orders packed'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Deliveries</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-blue-700 mt-2 block">{activeOrdersCount}</span>
          <p className="text-[11px] text-blue-600 mt-1">En route to customers</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Low Stock SKUs</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-red-700 mt-2 block">{lowStockProducts.length}</span>
          <p className="text-[11px] text-red-600 mt-1">Items below 10 units</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'orders' 
              ? 'bg-[#0b6623] text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Live Store Orders ({orders.length})</span>
          {pendingPackOrders.length > 0 && (
            <span className="bg-yellow-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
              {pendingPackOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'inventory' 
              ? 'bg-[#0b6623] text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog & Stock ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'analytics' 
              ? 'bg-[#0b6623] text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Sales & Insights</span>
        </button>

        <button
          onClick={() => setActiveTab('store_settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'store_settings' 
              ? 'bg-[#0b6623] text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Store Info & KYC</span>
        </button>
      </div>

      {/* TAB 1: Live Store Orders & Packing Pipeline */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order sub-filters */}
          <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  orderFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter('placed')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  orderFilter === 'placed' ? 'bg-amber-500 text-white' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                Needs Packing ({orders.filter(o => o.status === 'placed').length})
              </button>
              <button
                onClick={() => setOrderFilter('packed')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  orderFilter === 'packed' ? 'bg-blue-600 text-white' : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                }`}
              >
                Packed & Ready ({orders.filter(o => o.status === 'packed').length})
              </button>
              <button
                onClick={() => setOrderFilter('out_for_delivery')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  orderFilter === 'out_for_delivery' ? 'bg-purple-600 text-white' : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                }`}
              >
                Out for Delivery ({orders.filter(o => o.status === 'out_for_delivery').length})
              </button>
              <button
                onClick={() => setOrderFilter('delivered')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  orderFilter === 'delivered' ? 'bg-emerald-600 text-white' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                Delivered ({orders.filter(o => o.status === 'delivered').length})
              </button>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Auto-synced with Customer App</span>
          </div>

          {/* Orders Grid / Cards */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No orders in this status</h4>
              <p className="text-xs text-slate-400">New customer orders will automatically appear here for packing.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOrders.map((order) => {
                const isPlaced = order.status === 'placed';
                const isPacked = order.status === 'packed';
                const isOut = order.status === 'out_for_delivery';
                const isDelivered = order.status === 'delivered';

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    {/* Order Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 text-sm">#{order.orderNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isDelivered ? 'bg-emerald-100 text-emerald-800' :
                            isPlaced ? 'bg-amber-100 text-amber-900' :
                            isPacked ? 'bg-blue-100 text-blue-900' :
                            'bg-purple-100 text-purple-900'
                          }`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Delivery PIN OTP: <strong className="font-mono text-slate-800">{order.deliveryPin}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black font-mono text-slate-900">₹{order.total}</span>
                        <span className="block text-[10px] uppercase font-bold text-slate-500">
                          {order.paymentMethod.replace('razorpay_', '')} · {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-tight">
                        <p className="font-bold text-slate-800">{order.customerName} · <span className="font-normal text-slate-500">{order.customerPhone}</span></p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{order.address.houseFlat}, {order.address.areaStreet}, {order.address.city} - {order.address.pincode}</p>
                        {order.instructions && (
                          <p className="text-[10px] text-amber-700 italic mt-1 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                            Note: "{order.instructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Items checklist */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Items to Pack ({order.items.length})</span>
                      <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto pr-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {item.quantity}×
                              </span>
                              <div>
                                <p className="font-semibold text-slate-800 leading-tight">{item.product.name}</p>
                                <p className="text-[10px] text-slate-400">{item.product.unit}</p>
                              </div>
                            </div>
                            <span className="font-mono text-slate-700 font-medium">₹{item.product.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shopkeeper Fulfillment Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                      {/* Rider assignment */}
                      <div className="flex items-center gap-2">
                        <Bike className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          value={order.assignedRiderId || ''}
                          onChange={(e) => assignOrderToRider(order.id, e.target.value)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-emerald-600 font-medium text-slate-700"
                        >
                          {riders.map(r => (
                            <option key={r.id} value={r.id}>{r.name} ({r.isOnline ? 'Active' : 'Offline'})</option>
                          ))}
                        </select>
                      </div>

                      {/* Packing State transitions */}
                      <div className="flex items-center gap-2">
                        {isPlaced && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'packed', 'Store staff packed all items')}
                            className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Mark Items Packed</span>
                          </button>
                        )}

                        {isPacked && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'out_for_delivery', 'Dispatched with delivery partner')}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Bike className="w-3.5 h-3.5" />
                            <span>Dispatch with Rider</span>
                          </button>
                        )}

                        {isOut && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered', 'Delivery confirmed by OTP')}
                            className="w-full sm:w-auto px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Delivered</span>
                          </button>
                        )}

                        {isDelivered && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Order Fulfilled</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Product Catalog & Inventory Management */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Action & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search store inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none text-slate-700"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Add product button */}
            <button
              onClick={() => setShowAddProductModal(true)}
              className="w-full md:w-auto px-4 py-2 bg-[#0b6623] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-yellow-300" />
              <span>Add New Product to Store</span>
            </button>
          </div>

          {/* Product Inventory Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price / MRP</th>
                    <th className="p-3.5">In Stock?</th>
                    <th className="p-3.5">Units Available</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const isLow = p.stockCount <= 10;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0" 
                            />
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{p.name}</p>
                              {p.hindiName && <p className="text-[10px] text-slate-500">{p.hindiName}</p>}
                              <span className="text-[10px] font-mono text-slate-400">{p.unit}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {p.category.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="font-mono">
                            <span className="font-bold text-slate-900">₹{p.price}</span>
                            {p.originalPrice > p.price && (
                              <span className="text-[10px] text-slate-400 line-through ml-1.5">₹{p.originalPrice}</span>
                            )}
                          </div>
                        </td>

                        {/* Instant 1-tap stock switch */}
                        <td className="p-3.5">
                          <button
                            onClick={() => toggleStock(p.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                              p.inStock 
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                            title="Click to toggle availability in Customer Storefront"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                            <span>{p.inStock ? 'IN STOCK' : 'OUT OF STOCK'}</span>
                          </button>
                        </td>

                        {/* Quantity Counter */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                const newCount = Math.max(0, p.stockCount - 5);
                                updateProduct(p.id, { 
                                  stockCount: newCount,
                                  inStock: newCount > 0 
                                });
                              }}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center"
                            >
                              -5
                            </button>
                            <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                              isLow ? 'bg-red-50 text-red-700 font-extrabold' : 'text-slate-800'
                            }`}>
                              {p.stockCount}
                            </span>
                            <button
                              onClick={() => {
                                const newCount = p.stockCount + 10;
                                updateProduct(p.id, { 
                                  stockCount: newCount,
                                  inStock: true 
                                });
                              }}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center"
                            >
                              +10
                            </button>
                          </div>
                        </td>

                        {/* Edit & Delete actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Edit product details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete from inventory"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Store Analytics & Insights */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fastest Moving Categories</h4>
              <div className="space-y-2">
                {CATEGORIES.slice(0, 4).map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{c.name}</span>
                    <span className="font-mono text-emerald-700 font-bold">{40 - i * 8}% sales</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Store Packing Speed</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Avg. Pack Time:</span>
                  <span className="font-bold text-emerald-700 font-mono">1.8 Mins</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Rider Handover:</span>
                  <span className="font-bold text-blue-700 font-mono">2.2 Mins</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Accuracy Rate:</span>
                  <span className="font-bold text-slate-900 font-mono">99.4%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Settlement</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Razorpay UPI & Cards:</span>
                  <span className="font-bold text-emerald-800 font-mono">₹{Math.round(totalRevenue * 0.75)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Cash on Delivery:</span>
                  <span className="font-bold text-slate-800 font-mono">₹{Math.round(totalRevenue * 0.25)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Next Payout:</span>
                  <span className="text-xs font-bold text-emerald-600">Tomorrow, 10:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Store Info & KYC */}
      {activeTab === 'store_settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">SIMORA Merchant Store Profile</h3>
              <p className="text-xs text-slate-500">Official merchant registration credentials</p>
            </div>
            <button
              onClick={() => setShowStoreEditModal(true)}
              className="px-3 py-1.5 bg-[#0b6623] text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Edit Store Profile
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 block mb-0.5">Store Registered Name</span>
              <span className="font-bold text-slate-800 text-sm">{storeInfo.storeName}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 block mb-0.5">Dark Store Code</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">{storeInfo.storeCode}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 block mb-0.5">Store Manager / Owner</span>
              <span className="font-bold text-slate-800 text-sm">{storeInfo.ownerName}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 block mb-0.5">Contact Phone</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{storeInfo.phone}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 sm:col-span-2">
              <span className="text-slate-400 block mb-0.5">Physical Hub Address</span>
              <span className="font-medium text-slate-800">{storeInfo.address}, {storeInfo.city} - {storeInfo.pincode}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 block mb-0.5">GST Identification Number</span>
              <span className="font-mono font-bold text-slate-800">{storeInfo.gstNumber || '29AABCS1429B1Z2'}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 block mb-0.5">FSSAI Food License</span>
              <span className="font-mono font-bold text-slate-800">{storeInfo.fssaiNumber || '11223334000129'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Product to Store</h3>
                <p className="text-xs text-slate-500">Will appear in customer storefront immediately</p>
              </div>
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Farm Fresh Spinach (Palak)"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Local / Hindi Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., ताज़ा पालक"
                  value={newProductHindi}
                  onChange={(e) => setNewProductHindi(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit / Pack</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 500 g, 1 kg, 1 L"
                    value={newProductUnit}
                    onChange={(e) => setNewProductUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP / Orig. (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductOriginalPrice}
                    onChange={(e) => setNewProductOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0b6623] hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit Product: {editingProduct.name}</h3>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">MRP / Original Price (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editingProduct.originalPrice}
                  onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stock Count (Units)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editingProduct.stockCount}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit</label>
                <input
                  type="text"
                  required
                  value={editingProduct.unit}
                  onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0b6623] hover:bg-emerald-800 text-white font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Store Profile Modal */}
      {showStoreEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Update Store Profile</h3>
              <button 
                onClick={() => setShowStoreEditModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStoreProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Store Name</label>
                <input
                  type="text"
                  required
                  value={editStoreName}
                  onChange={(e) => setEditStoreName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Owner / Manager Name</label>
                <input
                  type="text"
                  required
                  value={editOwnerName}
                  onChange={(e) => setEditOwnerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStoreEditModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0b6623] hover:bg-emerald-800 text-white font-bold rounded-xl"
                >
                  Save Store Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
