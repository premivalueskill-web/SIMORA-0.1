import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, User, ArrowRight, ShieldCheck, LogOut, Phone, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { LOGO_IMAGE } from '../../data/initialData';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    user, 
    logout,
    loginWithVerifiedOtp,
    setRole
  } = useApp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(user.phone ? user.phone.replace('+91 ', '') : '');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState(user.name !== 'Guest' ? user.name : '');
  const [devHint, setDevHint] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  if (!isAuthModalOpen) return null;

  const validatePhone = (p: string) => {
    const clean = p.replace(/\D/g, '').slice(-10);
    return clean.length === 10 && /^[6-9]\d{9}$/.test(clean);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
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
        setErrorMessage(data.error || 'Failed to dispatch OTP. Please try again.');
        return;
      }

      setStep('otp');
      setResendTimer(data.resendAfterSeconds || 30);
      if (data.devHintOtp) {
        setDevHint(data.devHintOtp);
      } else {
        setDevHint(null);
      }
    } catch (err) {
      setIsSending(false);
      setErrorMessage('Network connection error. Please try again.');
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean && val !== '') return;
    const singleDigit = clean.slice(-1);

    const updated = [...otpValues];
    updated[index] = singleDigit;
    setOtpValues(updated);
    setErrorMessage('');

    if (singleDigit && index < 5) {
      const nextInput = document.getElementById(`modal-otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpValues.join('');
    if (entered.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP verification code');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    setIsVerifying(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          otp: entered,
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

      setRole('customer');
      loginWithVerifiedOtp(
        data.token,
        `+91 ${cleanPhone}`,
        'customer',
        data.user?.name || name.trim() || 'SIMORA Customer'
      );
      setIsAuthModalOpen(false);
    } catch (err) {
      setIsVerifying(false);
      setErrorMessage('Verification failed due to network error.');
    }
  };

  const handleAutofill = () => {
    if (devHint) {
      const digits = devHint.split('').slice(0, 6);
      setOtpValues(digits);
      setErrorMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b6623] to-[#044b20] p-6 text-white relative">
          <button 
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <img 
              src={LOGO_IMAGE} 
              alt="SIMORA Logo" 
              className="h-11 w-11 object-contain rounded-xl bg-white/10 p-1.5 border border-white/20" 
            />
            <div>
              <h3 className="text-xl font-black font-display tracking-tight">Welcome to SIMORA</h3>
              <p className="text-xs text-yellow-300 font-medium italic">Your Need Our Deed · Customer Grocery Login</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {user.isLoggedIn ? (
            /* Logged in view */
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0b6623] flex items-center justify-center mx-auto text-2xl font-black border-2 border-emerald-300">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-800">{user.name}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{user.phone}</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-[#0b6623] text-xs font-semibold rounded-full mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified SIMORA Customer</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-left border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Role:</span>
                  <span className="font-semibold text-slate-700">Grocery Customer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Tier:</span>
                  <span className="font-bold text-[#0b6623]">SIMORA Express (10 Minutes)</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={logout}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#0b6623] hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Customer Login with Real OTP */
            <>
              {step === 'phone' && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Enter Mobile Number
                    </label>
                    <div className="relative flex rounded-xl border border-slate-300 overflow-hidden focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                      <span className="bg-slate-100 text-slate-700 px-3.5 py-2.5 text-sm font-semibold flex items-center border-r border-slate-200 shrink-0 select-none">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full px-3 py-2.5 text-sm font-semibold font-mono tracking-wide focus:outline-none placeholder:text-slate-400"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>We will send a 6-digit SMS OTP to verify your customer account.</span>
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSending || phoneNumber.replace(/\D/g, '').length < 10}
                    className="w-full py-3 bg-[#0b6623] hover:bg-[#09521c] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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
              )}

              {step === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {devHint && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">SMS Gateway Sandbox Code:</p>
                        <p className="text-sm font-mono font-black text-[#0b6623] tracking-widest">{devHint}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutofill}
                        className="px-2.5 py-1 bg-[#0b6623] text-white rounded text-xs font-bold hover:bg-emerald-800 shadow-xs cursor-pointer"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setStep('phone');
                          setErrorMessage('');
                        }}
                        className="text-xs text-[#0b6623] hover:underline font-bold"
                      >
                        Change (+91 {phoneNumber.replace(/\D/g, '').slice(-10)})
                      </button>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {otpValues.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`modal-otp-input-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          className="h-12 text-center text-lg font-bold font-mono rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                        />
                      ))}
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    {resendTimer > 0 ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Resend code in <strong className="text-slate-800">{resendTimer}s</strong></span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#0b6623] font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP Now
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || otpValues.join('').length < 6}
                    className="w-full py-3 bg-[#0b6623] hover:bg-[#09521c] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-yellow-300" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Start Shopping</span>
                        <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
