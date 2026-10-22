import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Smartphone, 
  FileText, 
  Globe, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { LOGO_IMAGE } from '../../data/initialData';
import { downloadAndroidProjectZip } from '../../utils/downloadAndroidProject';

interface PlayStorePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStorePublishModal: React.FC<PlayStorePublishModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'native_compose' | 'bubblewrap' | 'pwabuilder' | 'metadata' | 'assetlinks'>('native_compose');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAppUrl = window.location.origin;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const bubblewrapCommands = `# 1. Install Google's official Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize your Android App Bundle (TWA) from your live SIMORA URL:
bubblewrap init --manifest="${currentAppUrl}/manifest.webmanifest"

# 3. Build your signed Android App Bundle (.aab) for Google Play:
bubblewrap build

# The resulting "app-release-signed.aab" in your folder is ready
# to be uploaded directly into the Google Play Console!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#044b20] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img 
              src={LOGO_IMAGE} 
              alt="SIMORA Logo" 
              className="h-12 w-12 object-contain rounded-2xl bg-white/10 p-1"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-display tracking-tight">
                  Publish SIMORA to Google Play Store
                </h3>
                <span className="text-[10px] bg-yellow-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  Android TWA Ready
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Complete deployment guide & Play Store package generator
              </p>
            </div>
          </div>
        </div>

        {/* Readiness Checklist Strip */}
        <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span className="font-bold">Google Play PWA Audit:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 font-medium">
              <Check className="w-3 h-3 text-emerald-700" /> Web App Manifest
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Check className="w-3 h-3 text-emerald-700" /> 512x512 High-Res Icon
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Check className="w-3 h-3 text-emerald-700" /> Maskable Icon
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Check className="w-3 h-3 text-emerald-700" /> Service Worker Offline Cache
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-5 pt-2 text-xs overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('native_compose')}
            className={`py-2 px-3 font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'native_compose'
                ? 'border-[#0b6623] text-[#0b6623]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
            <span>Native Android App (Kotlin & Compose)</span>
          </button>
          <button
            onClick={() => setActiveTab('bubblewrap')}
            className={`py-2 px-3 font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'bubblewrap'
                ? 'border-[#0b6623] text-[#0b6623]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Google Bubblewrap CLI
          </button>
          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`py-2 px-3 font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pwabuilder'
                ? 'border-[#0b6623] text-[#0b6623]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            PWABuilder Package
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`py-2 px-3 font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'metadata'
                ? 'border-[#0b6623] text-[#0b6623]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Store Listing Copy Kit
          </button>
          <button
            onClick={() => setActiveTab('assetlinks')}
            className={`py-2 px-3 font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'assetlinks'
                ? 'border-[#0b6623] text-[#0b6623]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Digital Asset Links
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700">
          {/* TAB 0: Native Kotlin Jetpack Compose Project */}
          {activeTab === 'native_compose' && (
            <div className="space-y-4">
              <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-800/80 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    100% NATIVE KOTLIN
                  </span>
                  <span className="text-emerald-300 font-semibold text-xs">
                    Jetpack Compose · Material 3 · MVVM
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1.5">
                  SIMORA Native Android Studio Project (APK Ready)
                </h4>
                <p className="text-emerald-100/90 leading-relaxed text-xs">
                  The complete native Android source code is fully generated in <code>/simora-android</code>. It contains all Kotlin source files, Jetpack Compose UI screens (Welcome Login, Grocery Catalog, Cart, Checkout, Live Tracking, Support), Gradle build scripts, AndroidManifest.xml, and vector launcher assets.
                </p>

                <div className="mt-4 pt-3 border-t border-emerald-800/60 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => downloadAndroidProjectZip()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>Download Android Studio Project (.zip)</span>
                    </button>
                    <span className="text-[11px] text-emerald-200">
                      37 KB · Instant download
                    </span>
                  </div>

                  {/* Absolute URL display */}
                  <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/60 flex items-center justify-between gap-2">
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-emerald-300 uppercase font-bold block">Direct Full URL:</span>
                      <span className="font-mono text-[11px] text-yellow-300 truncate block">
                        {`${currentAppUrl}/api/download/simora-android-project.zip`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`${currentAppUrl}/api/download/simora-android-project.zip`, 'full_url')}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-bold shrink-0 flex items-center gap-1"
                    >
                      {copiedKey === 'full_url' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'full_url' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Studio Interface Export Option */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <h5 className="font-bold text-amber-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-700" />
                  <span>Alternative: Export Directly via Google AI Studio UI</span>
                </h5>
                <p className="text-amber-900 text-xs leading-relaxed">
                  If your browser blocks popup file downloads from iframes, you can export the full workspace directly through the AI Studio interface:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-amber-900 text-[11px]">
                  <li>In the top right corner of the AI Studio window, click the <strong>three dots menu (⋮)</strong> or the <strong>Share / Export</strong> button.</li>
                  <li>Click <strong>Download Project (.zip)</strong> or <strong>Export to GitHub</strong>.</li>
                  <li>The downloaded archive will contain the complete <code>/simora-android</code> native project folder with all Kotlin and Compose source files.</li>
                </ol>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  How to Build the Installable .apk in Android Studio:
                </h5>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 leading-relaxed">
                  <li>Download and extract <strong>SIMORA-Native-Android-Compose-Project.zip</strong>.</li>
                  <li>Open <strong>Android Studio</strong> and select <strong>Open</strong>, choosing the extracted <code>simora-android</code> folder.</li>
                  <li>Wait for Gradle to finish sync (~1 minute).</li>
                  <li>Click menu <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>.</li>
                  <li>Android Studio compiles the APK in <code>app/build/outputs/apk/debug/app-debug.apk</code>. Transfer it to your phone or share it to install!</li>
                </ol>
              </div>

              {/* Terminal build option */}
              <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-1">
                <div className="text-slate-400 mb-1 font-sans font-bold">Or compile via command line:</div>
                <div className="text-yellow-300 font-bold">./gradlew assembleRelease</div>
                <div className="text-slate-400 text-[10px]">Outputs: app/build/outputs/apk/release/app-release.apk</div>
              </div>
            </div>
          )}

          {/* TAB 1: Bubblewrap CLI */}
          {activeTab === 'bubblewrap' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  What is Google Bubblewrap?
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Bubblewrap is Google's official command-line tool that wraps your live PWA into an Android App Bundle (<strong>.aab</strong>) without requiring you to write Java or Kotlin code. It runs with Trusted Web Activity (TWA) to achieve full native performance, push notifications, and home screen launch without the browser URL bar.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-700" />
                    <span>Run in your terminal to build Android App Bundle:</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(bubblewrapCommands, 'bw_commands')}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-[11px]"
                  >
                    {copiedKey === 'bw_commands' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'bw_commands' ? 'Copied' : 'Copy Commands'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {bubblewrapCommands}
                </pre>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold">💡 Auto-Update Advantage:</p>
                <p className="text-[11px]">
                  Whenever you update your code on your web server, all Play Store users automatically get the newest features instantly without having to wait for Google app reviews!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PWABuilder */}
          {activeTab === 'pwabuilder' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  1-Click Web Packaging via PWABuilder
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  PWABuilder (developed by Microsoft in partnership with Google) automatically analyzes your live SIMORA URL and produces a ready-to-upload signed APK and Google Play <strong>.aab</strong> file with zero terminal setup.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <span className="font-bold text-emerald-950 block">Your App URL to enter into PWABuilder:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentAppUrl}
                    className="flex-1 bg-white font-mono px-3 py-2 rounded-xl border border-emerald-300 text-xs text-slate-800"
                  />
                  <button
                    onClick={() => copyToClipboard(currentAppUrl, 'app_url')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5"
                  >
                    {copiedKey === 'app_url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>Copy</span>
                  </button>
                </div>

                <a
                  href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentAppUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0b6623] hover:bg-[#09521c] text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  <span>Open PWABuilder for SIMORA</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1">
                <li>Paste your URL on PWABuilder and click <strong>Package for Stores</strong>.</li>
                <li>Select <strong>Google Play (Android)</strong>.</li>
                <li>Set package ID to: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">in.simora.quickdelivery</code>.</li>
                <li>Download the generated <strong>.zip</strong> archive containing your <strong>.aab</strong> bundle and assetlinks!</li>
              </ol>
            </div>
          )}

          {/* TAB 3: Store Listing Copy Kit */}
          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Copy and paste these pre-formatted store listing texts into your <strong>Google Play Console &gt; Main Store Listing</strong>:
              </p>

              <div className="space-y-3">
                {/* Title */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">App Name (max 30 chars):</span>
                    <button
                      onClick={() => copyToClipboard('SIMORA: 10-Min Grocery Delivery', 'app_title')}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'app_title' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                    SIMORA: 10-Min Grocery Delivery
                  </p>
                </div>

                {/* Short Description */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">Short Description (max 80 chars):</span>
                    <button
                      onClick={() => copyToClipboard('Your Need Our Deed. Fresh vegetables, dairy & groceries delivered in 10 mins.', 'short_desc')}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'short_desc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                    Your Need Our Deed. Fresh vegetables, dairy & groceries delivered in 10 mins.
                  </p>
                </div>

                {/* Full Description */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">Full Description:</span>
                    <button
                      onClick={() => copyToClipboard(`SIMORA – “Your Need Our Deed”

SIMORA is India's next-generation quick commerce grocery app delivering fresh farm produce, pure dairy, morning breakfast essentials, daily staples, and munchies right to your doorstep in 10 to 12 minutes!

WHY CHOOSE SIMORA?
⚡ 10-Minute Lightning Delivery: Dispatched instantly from your nearest dark store hub.
🥦 Direct-From-Farm Produce: Taaza vegetables and fruits sorted for hygiene and purity.
🥛 Pure Dairy & Bakery: Fresh cow milk pouches, creamy paneer, farm eggs & artisanal breads.
📍 Live Google Maps Tracking: Watch your delivery partner arrive live on the map.
🔐 Secret Handover OTP: 4-digit PIN verification ensures your package is handed only to you.
💳 Flexible Payments: Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm, CRED), and Cards.
✨ AI Smart Shopping List: Predictive refills based on your household's order habits.

Download SIMORA today — Your Need Our Deed!`, 'full_desc')}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'full_desc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Full Text</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded border border-slate-200 whitespace-pre-line max-h-36 overflow-y-auto font-mono">
{`SIMORA – “Your Need Our Deed”

SIMORA is India's next-generation quick commerce grocery app delivering fresh farm produce, pure dairy, morning breakfast essentials, daily staples, and munchies right to your doorstep in 10 to 12 minutes!

WHY CHOOSE SIMORA?
⚡ 10-Minute Lightning Delivery: Dispatched instantly from your nearest dark store hub.
🥦 Direct-From-Farm Produce: Taaza vegetables and fruits sorted for hygiene and purity.
🥛 Pure Dairy & Bakery: Fresh cow milk pouches, creamy paneer, farm eggs & artisanal breads.
📍 Live Google Maps Tracking: Watch your delivery partner arrive live on the map.
🔐 Secret Handover OTP: 4-digit PIN verification ensures your package is handed only to you.
💳 Flexible Payments: Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm, CRED), and Cards.
✨ AI Smart Shopping List: Predictive refills based on your household's order habits.

Download SIMORA today — Your Need Our Deed!`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Digital Asset Links */}
          {activeTab === 'assetlinks' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  What is assetlinks.json?
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Digital Asset Links verify that your live domain belongs to your Google Play Android app. Once verified by Google, the browser URL address bar is removed completely, making SIMORA look 100% like a native Android app!
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Pre-configured at: <code className="text-emerald-700">/.well-known/assetlinks.json</code>
                  </span>
                  <a
                    href="/.well-known/assetlinks.json"
                    target="_blank"
                    className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Live File</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
{`[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "in.simora.quickdelivery",
      "sha256_cert_fingerprints": [
        "14:6D:E9:7F:0F:7D:F7:16:1C:77:D3:2A:7E:6B:44:8D:B8:DF:4A:27:0B:45:90:54:6F:47:D7:0E:6D:44:0E:7F"
      ]
    }
  }
]`}
                </pre>
                <p className="text-[11px] text-slate-500">
                  * Note: Replace the SHA-256 fingerprint with your Play Console App Signing certificate fingerprint from <strong>Play Console &gt; Setup &gt; App Signing</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Close */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            SIMORA Quick Commerce Platform · Ready for Google Play Console
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
