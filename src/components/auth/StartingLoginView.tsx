import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { LOGO_IMAGE } from '../../data/initialData';
import { 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  Sparkles,
  User,
  Phone,
  Download
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../../utils/downloadAndroidProject';

export const StartingLoginView: React.FC = () => {
  const { loginWithVerifiedOtp, setShowLoginScreen, setRole } = useApp();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [devHint, setDevHint] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const validatePhone = (p: string) => {
    const clean = p.replace(/\D/g, '').slice(-10);
    return clean.length === 10 && /^[6-9]\d{9}$/.test(clean);
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!validatePhone(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, role: 'customer' })
      });

      const data = await res.json();
      setIsSending(false);

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to send OTP. Please try again.');
        return;
      }

      setStep('otp');
      setResendTimer(data.resendAfterSeconds || 30);
      setSuccessNotice(`OTP sent successfully to +91 ${cleanPhone}`);
      if (data.devHintOtp) {
        setDevHint(data.devHintOtp);
      } else {
        setDevHint(null);
      }

      // Auto-focus first digit input box
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setIsSending(false);
      setErrorMessage('Network connection error. Unable to reach SIMORA authentication service.');
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean && val !== '') return;

    const singleDigit = clean.slice(-1);
    const updated = [...otpDigits];
    updated[index] = singleDigit;
    setOtpDigits(updated);
    setErrorMessage('');

    // Auto advance to next box
    if (singleDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const updated = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        updated[i] = pasted[i] || '';
      }
      setOtpDigits(updated);
      const focusIndex = Math.min(pasted.length, 5);
      otpInputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullOtp = otpDigits.join('');

    if (fullOtp.length < 6) {
      setErrorMessage('Please enter the complete 6-digit OTP verification code.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    setIsVerifying(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          otp: fullOtp,
          role: 'customer',
          name: name.trim() || undefined
        })
      });

      const data = await res.json();
      setIsVerifying(false);

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Invalid OTP code. Please enter the correct 6-digit code.');
        return;
      }

      // Successful verification -> set customer role, store token, and redirect to customer home page
      setRole('customer');
      loginWithVerifiedOtp(
        data.token,
        `+91 ${cleanPhone}`,
        'customer',
        data.user?.name || name.trim() || 'SIMORA Customer'
      );
      setShowLoginScreen(false);
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMessage('Verification failed due to a network error. Please try again.');
    }
  };

  const handleAutofillDevHint = () => {
    if (devHint) {
      const digits = devHint.split('').slice(0, 6);
      setOtpDigits(digits);
      setErrorMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background glowing ambient elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-gradient-to-b from-[#0b6623]/30 via-emerald-900/15 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-md mx-auto px-4 py-8 sm:py-12 z-10 flex-1 flex flex-col justify-center">
        
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-6">
          {/* Brand Logo */}
          <div className="inline-block relative">
            <img 
              src={LOGO_IMAGE} 
              alt="SIMORA Logo" 
              className="h-16 w-auto object-contain mx-auto rounded-2xl bg-white/10 p-2 border border-white/15 shadow-xl shadow-emerald-950/60"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400 text-[9px] font-black text-slate-950 items-center justify-center">⚡</span>
            </span>
          </div>

          {/* Welcome Headline */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              Welcome to SIMORA
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-yellow-300 italic tracking-wide mt-1">
              Your Need Our Deed
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Order fresh groceries, daily essentials & household items delivered to your doorstep in 10 minutes.
            </p>
          </div>

          {/* Grocery Value Propositions */}
          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-medium text-slate-300">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
              <Zap className="w-3 h-3 text-yellow-300" />
              10-Min Delivery
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              <ShoppingBag className="w-3 h-3 text-emerald-400" />
              Fresh Groceries
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              Best Deals
            </span>
          </div>
        </div>

        {/* Customer Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
          
          {/* Card Title */}
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Customer Login</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Sign in with your mobile number to order groceries & track deliveries live.
            </p>
          </div>

          {step === 'input' ? (
            /* Step 1: Mobile Number Input */
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Optional Name for Customer Personalization */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Name (Optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 placeholder:text-slate-600 transition-all"
                />
              </div>

              {/* Mobile Number Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mobile Number</span>
                </label>
                <div className="relative flex rounded-2xl border border-slate-700 overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 bg-slate-950 transition-all">
                  <span className="bg-slate-900 text-slate-300 px-3.5 py-3 text-xs sm:text-sm font-bold flex items-center border-r border-slate-800 shrink-0 select-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full px-3.5 py-3 text-sm font-semibold font-mono text-white focus:outline-none placeholder:text-slate-600 bg-transparent tracking-wide"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>We'll send a 6-digit verification code (OTP) to this number</span>
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl text-red-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Send OTP Button */}
              <button
                type="submit"
                disabled={isSending || phone.replace(/\D/g, '').length < 10}
                className="w-full py-3.5 bg-gradient-to-r from-[#0b6623] to-[#044b20] hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-yellow-300" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-4 h-4 text-yellow-300" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                <div>
                  <span className="text-[11px] text-slate-400 block">OTP Sent To Mobile</span>
                  <p className="text-xs font-mono font-bold text-emerald-400">+91 {phone.replace(/\D/g, '').slice(-10)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('input');
                    setErrorMessage('');
                  }}
                  className="text-xs text-yellow-300 hover:text-yellow-200 font-bold underline transition-colors"
                >
                  Change Number
                </button>
              </div>

              {/* Dev hint / Testing Box */}
              {devHint && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-emerald-200 text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">
                      SMS Gateway Sandbox Code:
                    </span>
                    <span className="text-sm font-mono font-black text-yellow-300 tracking-widest">{devHint}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutofillDevHint}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {/* 6 Digit Input Boxes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePasteOtp}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpInputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-mono font-black rounded-xl border bg-slate-950 text-white focus:outline-none transition-all ${
                        digit ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-700 focus:border-emerald-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl text-red-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Notice */}
              {successNotice && !errorMessage && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successNotice}</span>
                </div>
              )}

              {/* Verify & Enter Button */}
              <button
                type="submit"
                disabled={isVerifying || otpDigits.join('').length < 6}
                className="w-full py-3.5 bg-gradient-to-r from-[#0b6623] to-[#044b20] hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-yellow-300" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue Shopping</span>
                    <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                  </>
                )}
              </button>

              {/* Resend Timer & Actions */}
              <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                {resendTimer > 0 ? (
                  <span className="flex items-center gap-1 font-mono text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Resend in 00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend OTP</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-slate-400 hover:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Quick Guest Browsing & Android Project Download */}
          <div className="pt-3 border-t border-slate-800 space-y-2 text-center">
            <button
              type="button"
              onClick={() => {
                setRole('customer');
                setShowLoginScreen(false);
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <span>Explore Store as Guest</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => downloadAndroidProjectZip()}
              className="w-full py-2 px-3 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-yellow-300" />
              <span>Download Native Android Studio Project (.zip)</span>
            </button>
          </div>
        </div>

        {/* Security & Authentication Info */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time SMS Authentication</span>
            </span>
            <span>·</span>
            <span>256-Bit Encrypted</span>
            <span>·</span>
            <span>100% Secure</span>
          </div>

          <p className="text-[10px] text-slate-600">
            SIMORA Technologies Pvt. Ltd. · Fast2SMS / Twilio / MSG91 Integration Ready
          </p>
        </div>

      </div>
    </div>
  );
};
