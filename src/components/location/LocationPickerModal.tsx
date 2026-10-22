import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Navigation, 
  Search, 
  Home, 
  Briefcase, 
  Plus, 
  Check, 
  Trash2,
  Compass,
  Building,
  CheckCircle2
} from 'lucide-react';
import { DeliveryAddress } from '../../types';

export const LocationPickerModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    deleteAddress,
    user
  } = useApp();

  const [mode, setMode] = useState<'select' | 'new'>('select');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // New address form state
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [recipientName, setRecipientName] = useState(user.name || 'Shree Kumar');
  const [phone, setPhone] = useState(user.phone || '+91 98765 43210');
  const [houseFlat, setHouseFlat] = useState('');
  const [areaStreet, setAreaStreet] = useState('80 Feet Road, 4th Block, Koramangala');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560034');
  
  // Interactive Pin Position on map (normalized 0-100% inside container)
  const [pinPos, setPinPos] = useState({ x: 50, y: 50 });
  const [isPinAdjusted, setIsPinAdjusted] = useState(false);

  if (!isLocationModalOpen) return null;

  const handleDetectCurrentLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetectingLocation(false);
          setMode('new');
          setPinPos({ x: 52, y: 48 });
          setIsPinAdjusted(true);
          setAreaStreet('Near Sony World Junction, 100ft Road');
          setCity('Bengaluru');
          setPincode('560034');
        },
        (error) => {
          // Fallback simulation
          setIsDetectingLocation(false);
          setMode('new');
          setPinPos({ x: 48, y: 54 });
          setIsPinAdjusted(true);
          setAreaStreet('Indiranagar 12th Main Road');
          setCity('Bengaluru');
          setPincode('560038');
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingLocation(false);
      setMode('new');
      setPinPos({ x: 50, y: 50 });
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    setPinPos({ x, y });
    setIsPinAdjusted(true);

    // Update simulated street name based on position
    if (x > 60) {
      setAreaStreet('Outer Ring Road, Near HSR Sector 1');
      setPincode('560102');
    } else if (y < 40) {
      setAreaStreet('Indiranagar HAL 2nd Stage, Double Road');
      setPincode('560008');
    } else {
      setAreaStreet('Koramangala 5th Block, Jyoti Nivas College Road');
      setPincode('560095');
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseFlat.trim()) {
      alert('Please enter House / Flat / Floor details');
      return;
    }

    addAddress({
      label,
      recipientName: recipientName || 'Customer',
      phone: phone || '+91 98765 43210',
      houseFlat,
      areaStreet,
      landmark,
      city,
      pincode,
      latitude: 12.9352 + (pinPos.y - 50) * 0.001,
      longitude: 77.6245 + (pinPos.x - 50) * 0.001,
      isDefault: true,
    });

    setMode('select');
    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-display text-slate-800">
              {mode === 'select' ? 'Select Delivery Address' : 'Pin Location on Google Maps'}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'select' ? 'Choose where you want your 10-minute order delivered' : 'Drag or click on the map to pin your exact entrance'}
            </p>
          </div>
          <button 
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-1 p-5">
          {mode === 'select' ? (
            <div className="space-y-4">
              {/* Detect Location Button */}
              <button
                onClick={handleDetectCurrentLocation}
                disabled={isDetectingLocation}
                className="w-full p-3.5 rounded-xl border border-emerald-500/80 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Navigation className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-emerald-900">
                      {isDetectingLocation ? 'Detecting your GPS location...' : 'Use Current Location'}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-normal">Using Google Maps Geolocation & Device GPS</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 underline">Enable GPS</span>
              </button>

              {/* Add New Address via Map */}
              <button
                onClick={() => setMode('new')}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address on Google Map</span>
              </button>

              {/* Saved Addresses List */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Saved Delivery Addresses ({addresses.length})
                </h4>
                <div className="space-y-2.5">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddress(addr);
                          setIsLocationModalOpen(false);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {addr.label === 'Home' ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                          </div>
                          <div className="text-left leading-tight">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">{addr.label}</span>
                              {addr.isDefault && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">Default</span>
                              )}
                            </div>
                            <p className="text-xs font-medium text-slate-700 mt-1">{addr.houseFlat}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{addr.areaStreet}, {addr.city} - {addr.pincode}</p>
                            {addr.landmark && (
                              <p className="text-[10px] text-slate-400 mt-0.5">Landmark: {addr.landmark}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                          {addresses.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAddress(addr.id);
                              }}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Map Picker & Address Form */
            <div className="space-y-4">
              {/* Google Maps Interactive Container */}
              <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-[#e5e3df]">
                {/* Search overlay inside map */}
                <div className="absolute top-3 left-3 right-3 z-10 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search area, landmark or society name..."
                      defaultValue="Koramangala 5th Block"
                      className="w-full pl-8 pr-3 py-1.5 bg-white/95 backdrop-blur-xs text-xs rounded-lg shadow-sm border border-slate-200 focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleDetectCurrentLocation}
                    className="p-2 bg-white text-emerald-700 rounded-lg shadow-sm hover:bg-slate-50"
                    title="Recenter GPS"
                  >
                    <Compass className="w-4 h-4" />
                  </button>
                </div>

                {/* SVG Rendered Street Map Canvas with click to adjust pin */}
                <div 
                  className="h-56 sm:h-64 w-full relative cursor-crosshair select-none overflow-hidden"
                  onClick={handleMapClick}
                  title="Click anywhere to move the delivery pin"
                >
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Background terrain */}
                    <rect width="100%" height="100%" fill="#e8ece9" />
                    {/* Parks & Greenery */}
                    <path d="M 0,0 L 140,0 L 120,80 L 20,90 Z" fill="#cbe7cd" />
                    <path d="M 400,200 L 600,210 L 590,300 L 380,280 Z" fill="#cbe7cd" />
                    {/* Water Canal / Lake */}
                    <path d="M 280,0 Q 300,100 290,300" stroke="#aadaff" strokeWidth="18" fill="none" opacity="0.8" />
                    {/* Secondary streets */}
                    <line x1="0" y1="60" x2="100%" y2="60" stroke="#ffffff" strokeWidth="4" />
                    <line x1="0" y1="130" x2="100%" y2="130" stroke="#ffffff" strokeWidth="5" />
                    <line x1="0" y1="200" x2="100%" y2="200" stroke="#ffffff" strokeWidth="4" />
                    <line x1="90" y1="0" x2="90" y2="100%" stroke="#ffffff" strokeWidth="4" />
                    <line x1="210" y1="0" x2="210" y2="100%" stroke="#ffffff" strokeWidth="5" />
                    <line x1="360" y1="0" x2="360" y2="100%" stroke="#ffffff" strokeWidth="4" />
                    <line x1="480" y1="0" x2="480" y2="100%" stroke="#ffffff" strokeWidth="4" />
                    {/* Major Avenue / Highway */}
                    <line x1="0" y1="110" x2="100%" y2="150" stroke="#fcd34d" strokeWidth="7" />
                    <line x1="160" y1="0" x2="260" y2="100%" stroke="#fcd34d" strokeWidth="7" />
                    {/* Building Blocks */}
                    <rect x="25" y="70" width="55" height="40" fill="#dedede" rx="2" />
                    <rect x="100" y="70" width="45" height="35" fill="#dedede" rx="2" />
                    <rect x="220" y="70" width="50" height="40" fill="#dedede" rx="2" />
                    <rect x="100" y="150" width="50" height="40" fill="#dedede" rx="2" />
                    <rect x="230" y="150" width="45" height="35" fill="#dedede" rx="2" />
                    <rect x="375" y="75" width="70" height="40" fill="#dedede" rx="2" />
                  </svg>

                  {/* Dark Store Hub Marker */}
                  <div className="absolute top-[28%] left-[24%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <div className="flex items-center gap-1 bg-[#0b6623] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
                      <Building className="w-2.5 h-2.5 text-yellow-300" />
                      <span>SIMORA Hub (Dark Store #12)</span>
                    </div>
                  </div>

                  {/* Dynamic Draggable / Clicked Pin Marker */}
                  <div 
                    className="absolute z-20 -translate-x-1/2 -translate-y-full transition-all duration-200 pointer-events-none"
                    style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
                  >
                    {/* Radar Pulse */}
                    <div className="w-12 h-12 -mb-6 -ml-3 rounded-full radar-pulse border border-emerald-500/50"></div>
                    <div className="relative flex flex-col items-center">
                      <div className="bg-red-600 text-white p-2 rounded-full shadow-xl border-2 border-white animate-bounce">
                        <MapPin className="w-5 h-5 fill-white text-red-600" />
                      </div>
                      <div className="w-2 h-2 bg-black rounded-full opacity-40 blur-[1px]"></div>
                    </div>
                  </div>

                  {/* Map Hint Footer */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2.5 py-1 rounded-md backdrop-blur-xs">
                    📍 Tap map to adjust pin to your gate
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white/90 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">
                    Google Maps Platform
                  </div>
                </div>
              </div>

              {/* Pin Address Preview */}
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Delivery Location Pin</p>
                  <p className="text-xs font-semibold text-slate-800">{areaStreet}, {city}</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700">10-12 Mins Away</span>
              </div>

              {/* Detailed Address Form */}
              <form onSubmit={handleSaveAddress} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      House / Flat / Floor / Apartment *
                    </label>
                    <input
                      type="text"
                      required
                      value={houseFlat}
                      onChange={(e) => setHouseFlat(e.target.value)}
                      placeholder="e.g. Flat 301, Tower A, Sterling Apts"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opposite Sony Center / Near Metro"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tag as Home, Work, Other */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Save As:
                  </label>
                  <div className="flex gap-2">
                    {(['Home', 'Work', 'Other'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setLabel(t)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                          label === t
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t === 'Home' && <Home className="w-3.5 h-3.5" />}
                        {t === 'Work' && <Briefcase className="w-3.5 h-3.5" />}
                        <span>{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('select')}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
                  >
                    Back to Saved
                  </button>
                  <button
                    type="submit"
                    className="flex-2 py-2.5 px-4 rounded-xl bg-[#0b6623] hover:bg-[#09521c] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Address & Deliver Here</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
