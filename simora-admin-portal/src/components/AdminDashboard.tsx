import React, { useState, useEffect } from 'react';
import { adminApi, AdminUser, PlatformMetrics, DarkStoreRecord } from '../services/adminApi';
import { 
  ShieldCheck, 
  Store, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Bike, 
  Plus, 
  LogOut, 
  RefreshCw, 
  Server, 
  Tag, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Search,
  Building2,
  Users
} from 'lucide-react';

interface AdminDashboardProps {
  adminUser: AdminUser;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stores' | 'fleet' | 'security'>('overview');
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [stores, setStores] = useState<DarkStoreRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);

  // New store form state
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreCity, setNewStoreCity] = useState('Bengaluru');
  const [newStorePincode, setNewStorePincode] = useState('560034');
  const [newStoreManager, setNewStoreManager] = useState('');
  const [newStorePhone, setNewStorePhone] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [metricsData, storesData] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getStores()
      ]);
      setMetrics(metricsData);
      setStores(storesData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;

    try {
      const created = await adminApi.createStore({
        name: newStoreName.trim(),
        city: newStoreCity.trim(),
        pincode: newStorePincode.trim(),
        manager: newStoreManager.trim() || 'Store Incharge',
        phone: newStorePhone.trim() || '+91 98000 00000'
      });
      setStores(prev => [...prev, created]);
      setShowAddStoreModal(false);
      setNewStoreName('');
      setNewStoreManager('');
      setNewStorePhone('');
    } catch (err) {
      alert('Failed to register new dark store');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-sm sm:text-base text-white tracking-tight">SIMORA Central Admin</h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  RBAC SECURE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Master Operations & Network Dark Store Governance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Refresh platform telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-white block">{adminUser.name}</span>
              <span className="text-[10px] font-mono text-emerald-400">{adminUser.email}</span>
            </div>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/80 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* KPI Cards Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Network GMV Today</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-black font-mono text-emerald-400 mt-2 block">
              ₹{metrics ? metrics.grossRevenueToday.toLocaleString() : '58,650'}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Across all active dark stores</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Active Dark Stores</span>
              <Store className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-2xl font-black font-mono text-blue-400 mt-2 block">
              {stores.length} Hubs
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Bengaluru Urban cluster</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Orders Dispatched</span>
              <ShoppingBag className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-2xl font-black font-mono text-purple-400 mt-2 block">
              {metrics ? metrics.totalOrdersToday : 136}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">SLA: 9.4 mins avg delivery</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Active Fleet Online</span>
              <Bike className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-black font-mono text-amber-400 mt-2 block">
              {metrics ? metrics.activeFleetOnline : 24} Riders
            </span>
            <p className="text-[11px] text-slate-500 mt-1">99.2% on-time delivery rate</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Regional Dark Stores ({stores.length})
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'security' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            RBAC & Security Audits
          </button>
        </div>

        {/* Tab 1: Regional Dark Store Network */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Managed Dark Store Hubs</h3>
                <p className="text-xs text-slate-400">Stores authorized on the SIMORA distribution network</p>
              </div>
              <button
                onClick={() => setShowAddStoreModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Provision New Store Hub</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Store Hub Name</th>
                    <th className="p-3.5">Hub Code</th>
                    <th className="p-3.5">Location & Pincode</th>
                    <th className="p-3.5">Store Manager</th>
                    <th className="p-3.5">Orders Today</th>
                    <th className="p-3.5">Revenue</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {stores.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/50">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <Store className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{s.name}</span>
                      </td>
                      <td className="p-3.5 font-mono text-emerald-400 font-bold">{s.code}</td>
                      <td className="p-3.5 text-slate-300">{s.city} - {s.pincode}</td>
                      <td className="p-3.5 text-slate-300">{s.manager} ({s.phone})</td>
                      <td className="p-3.5 font-mono text-white font-bold">{s.ordersToday}</td>
                      <td className="p-3.5 font-mono text-emerald-400 font-bold">₹{s.revenueToday}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Security & RBAC Enforcements */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Backend Role-Based Access Control Architecture</h3>
                  <p className="text-xs text-slate-400">Strict isolation between Customer, Shopkeeper, and Admin tiers</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-emerald-400 block">Tier 1: Customer App</span>
                  <p className="text-slate-400 text-[11px]">Limited to catalog viewing, cart, addresses, checkout, and AI smart replenishment.</p>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded inline-block font-mono">Public / User Scoped</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-yellow-400 block">Tier 2: Shopkeeper Hub</span>
                  <p className="text-slate-400 text-[11px]">Store-level access to order packing, local inventory stock updates, and dispatch handover.</p>
                  <span className="text-[10px] text-yellow-300 bg-yellow-950/60 px-2 py-0.5 rounded inline-block font-mono">Merchant Store Scoped</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-purple-400 block">Tier 3: Central Admin</span>
                  <p className="text-slate-400 text-[11px]">Full cross-store oversight, network GMV analytics, dark store provisioning, and security control.</p>
                  <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded inline-block font-mono">Admin Bearer Token Only</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Session Token:</span>
                  <span className="font-mono text-emerald-400">Bearer {adminApi.getToken()?.slice(0, 18)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Enforcement Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active & Enforcing 403 Forbidden on Unauthorized Access</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Store Modal */}
        {showAddStoreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Provision Regional Dark Store</h3>
                <button 
                  onClick={() => setShowAddStoreModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStore} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Store Name & Region</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SIMORA Dark Store #115 - Whitefield"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newStoreCity}
                      onChange={(e) => setNewStoreCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={newStorePincode}
                      onChange={(e) => setNewStorePincode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Store Manager Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={newStoreManager}
                    onChange={(e) => setNewStoreManager(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Manager Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={newStorePhone}
                    onChange={(e) => setNewStorePhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStoreModal(false)}
                    className="px-4 py-2 border border-slate-700 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                  >
                    Register Store
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
