import React from 'react';
import { LOGO_IMAGE } from '../../data/initialData';
import { ShieldCheck, Zap, RotateCcw, HeartHandshake, PhoneCall, Mail, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setIsPlayStoreModalOpen } = useApp();
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      {/* Guarantees Strip */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center shrink-0 text-emerald-400">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">10-Minute Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dispatched instantly from your nearest dark store.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Quality Guaranteed</h4>
              <p className="text-xs text-slate-400 mt-0.5">Directly sourced harvest, verified hygiene standards.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center shrink-0 text-emerald-400">
              <RotateCcw className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instant Returns at Door</h4>
              <p className="text-xs text-slate-400 mt-0.5">Not satisfied with an item? Hand it back on delivery.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center shrink-0 text-emerald-400">
              <HeartHandshake className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Your Need Our Deed</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated 24/7 customer support whenever you need.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={LOGO_IMAGE} 
                alt="SIMORA Logo" 
                className="h-12 w-auto object-contain rounded-lg bg-emerald-900/40 p-1"
              />
              <div>
                <span className="text-2xl font-black text-white font-display tracking-tight">SIMORA</span>
                <p className="text-xs text-yellow-400 italic font-semibold">Your Need Our Deed</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              SIMORA is India's next-generation quick commerce network delivering fresh farm vegetables, daily dairy, breakfast essentials, and home staples right to your doorstep in 10-12 minutes.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 1800-SIMORA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@simora.in</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Popular Categories</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-emerald-400 cursor-pointer">Vegetables & Fruits</li>
              <li className="hover:text-emerald-400 cursor-pointer">Dairy, Bread & Eggs</li>
              <li className="hover:text-emerald-400 cursor-pointer">Atta, Rice & Dals</li>
              <li className="hover:text-emerald-400 cursor-pointer">Snacks & Munchies</li>
              <li className="hover:text-emerald-400 cursor-pointer">Cold Drinks & Juices</li>
              <li className="hover:text-emerald-400 cursor-pointer">Personal Care</li>
            </ul>
          </div>

          {/* Deliveries & Cities */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Service Cities</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-emerald-400 cursor-pointer">Bengaluru (Electronic City to Hebbal)</li>
              <li className="hover:text-emerald-400 cursor-pointer">Delhi NCR (Noida & Gurgaon)</li>
              <li className="hover:text-emerald-400 cursor-pointer">Mumbai (Bandra to Andheri)</li>
              <li className="hover:text-emerald-400 cursor-pointer">Pune (Hinjewadi & Viman Nagar)</li>
              <li className="hover:text-emerald-400 cursor-pointer">Hyderabad (Hitech City)</li>
            </ul>
          </div>

          {/* Partner & Play Store */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Mobile & Store</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setIsPlayStoreModalOpen(true)}
                  className="text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Publish to Play Store</span>
                </button>
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">Ride with SIMORA (Delivery Partner)</li>
              <li className="hover:text-emerald-400 cursor-pointer">Partner as a Dark Store Hub</li>
              <li className="hover:text-emerald-400 cursor-pointer">Terms of Service & Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SIMORA Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Secured by Razorpay</span>
            <span>·</span>
            <span>Powered by Google Maps Platform</span>
            <span>·</span>
            <span>Fast Hub Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
