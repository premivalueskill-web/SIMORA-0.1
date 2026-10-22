import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone / native app mode, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <div className="bg-[#0b6623] text-white p-3 sm:px-4 rounded-2xl shadow-sm flex items-center justify-between gap-3 border border-emerald-500/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="text-left text-xs">
              <span className="font-bold text-yellow-300 block">Get SIMORA on Android</span>
              <span className="text-emerald-100 text-[11px]">Install app for faster 1-tap checkout & real-time GPS tracking</span>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        </div>

        {/* iOS Guide */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-900">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold">Install SIMORA on iPhone / iPad</h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-600 space-y-2">
                1. Tap the <strong>Share</strong> button (square with arrow) in Safari.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
                3. Tap <strong>Add</strong> at the top right to install SIMORA!
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2 bg-[#0b6623] text-white text-xs font-bold rounded-xl"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Header compact button
  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-slate-950 transition-all shadow-xs active:scale-95"
        title="Install SIMORA on Android or iOS"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Install App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold">Install SIMORA on iPhone / iPad</h3>
              <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 space-y-2">
              1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
              3. Tap <strong>Add</strong> to place the SIMORA app on your device!
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full py-2 bg-[#0b6623] text-white text-xs font-bold rounded-xl"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
