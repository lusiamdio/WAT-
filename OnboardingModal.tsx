import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Search,
  Camera,
  Check,
  Lock,
  ArrowLeft,
  Smartphone,
  RefreshCw,
  Sparkles,
  Key,
  Globe,
  User,
  CheckCircle2,
  X,
} from 'lucide-react';
import { COUNTRIES, PRESET_AVATARS, STATUS_PRESETS, Country } from '../data/countries';
import { useChat } from '../context/ChatContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { completeOnboarding, currentUser } = useChat();

  // Steps: 1 = Welcome, 2 = Phone Input, 3 = OTP Verification, 4 = Profile Info, 5 = Initializing Keys
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form states
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showConfirmNumberDialog, setShowConfirmNumberDialog] = useState(false);

  // OTP state
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(45);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Profile setup
  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);
  const [statusMessage, setStatusMessage] = useState('Available');
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Initialization progress
  const [initStage, setInitStage] = useState(0);

  // Resend timer countdown
  useEffect(() => {
    let interval: any = null;
    if (step === 3 && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 5: Sequential initialization animation
  useEffect(() => {
    if (step === 5) {
      const timers = [
        setTimeout(() => setInitStage(1), 700),
        setTimeout(() => setInitStage(2), 1500),
        setTimeout(() => setInitStage(3), 2300),
        setTimeout(() => {
          setInitStage(4);
          setTimeout(() => {
            const cleanPhone = `${selectedCountry.dialCode} ${phoneNumber.trim() || '802 345 6789'}`;
            completeOnboarding({
              name: name.trim() || 'WAT User',
              phone: cleanPhone,
              avatar: avatar,
              statusMessage: statusMessage,
              countryCode: selectedCountry.code,
            });
            if (onClose) onClose();
          }, 800);
        }, 3200),
      ];

      return () => timers.forEach(clearTimeout);
    }
  }, [step, name, avatar, statusMessage, selectedCountry, phoneNumber]);

  if (!isOpen) return null;

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setShowConfirmNumberDialog(true);
  };

  const handleConfirmNumber = () => {
    setShowConfirmNumberDialog(false);
    setStep(3);
    setResendTimer(45);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste handling
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      otpInputsRef.current[nextIdx]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setIsOtpVerifying(true);
    setTimeout(() => {
      setIsOtpVerifying(false);
      setStep(4);
    }, 800);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(5);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl shadow-[0_24px_48px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col min-h-[540px] max-h-[92vh] relative text-neutral-900">
        {/* Step 1: Welcome & Terms */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 text-center animate-fade-in">
            {/* Top Branding */}
            <div className="space-y-4 pt-4">
              <div className="relative mx-auto w-24 h-24 rounded-3xl bg-black text-white flex items-center justify-center shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-white text-neutral-950 flex items-center justify-center font-black text-2xl tracking-tighter shadow-md">
                  WAT
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Welcome to WAT
                </h1>
                <p className="text-xs text-neutral-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Simple, reliable, private messaging and high-definition voice & video calling.
                </p>
              </div>
            </div>

            {/* Privacy Guarantee Card */}
            <div className="my-6 p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] text-left space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>End-to-End Encrypted</span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Your personal messages and calls are secured with Olm/Megolm encryption. No one outside of your chats, not even WAT, can read or listen to them.
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-4 bg-black hover:bg-neutral-800 active:scale-[0.98] text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Agree & Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-neutral-400">
                By tapping Agree & Continue, you accept the{' '}
                <span className="text-neutral-800 underline font-semibold cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-neutral-800 underline font-semibold cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Phone Number Entry */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 animate-fade-in">
            <div>
              {/* Header */}
              <div className="text-center space-y-1 mb-6">
                <h2 className="text-lg font-black text-neutral-900">
                  Verify your phone number
                </h2>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  WAT will send an SMS to verify your sovereign identity. Carrier SMS charges may apply.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                {/* Country selector button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryPicker(true)}
                    className="w-full p-3 bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.08] rounded-2xl flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <span className="text-xs font-bold text-neutral-900">{selectedCountry.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <span className="text-xs font-mono font-semibold">{selectedCountry.dialCode}</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                </div>

                {/* Phone number input */}
                <div className="flex items-center gap-2">
                  <div className="p-3 bg-black/[0.02] border border-black/[0.08] rounded-2xl text-xs font-mono font-bold text-neutral-700 w-20 text-center">
                    {selectedCountry.dialCode}
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone number"
                    autoFocus
                    className="flex-1 p-3 bg-black/[0.02] border border-black/[0.08] rounded-2xl text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-black"
                  />
                </div>
              </form>
            </div>

            {/* Next button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={() => {
                  if (phoneNumber.trim()) {
                    setShowConfirmNumberDialog(true);
                  }
                }}
                disabled={!phoneNumber.trim()}
                className="w-full py-3.5 px-4 bg-black hover:bg-neutral-800 disabled:opacity-40 active:scale-[0.98] text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: OTP Verification */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 animate-fade-in">
            <div>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-black mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Wrong number?</span>
              </button>

              <div className="text-center space-y-1 mb-6">
                <h2 className="text-lg font-black text-neutral-900">
                  Verifying {selectedCountry.dialCode} {phoneNumber}
                </h2>
                <p className="text-xs text-neutral-500">
                  Waiting to automatically detect an SMS sent to your number.
                </p>
              </div>

              {/* 6-Digit OTP Inputs */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-6">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 bg-black/[0.02] border border-black/[0.12] rounded-2xl text-center text-xl font-mono font-bold text-neutral-900 focus:outline-none focus:border-black"
                  />
                ))}
              </div>

              {/* Resend timer */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <span className="text-xs text-neutral-400">
                    Resend SMS in <span className="font-mono font-bold text-neutral-700">{resendTimer}s</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setResendTimer(45)}
                    className="text-xs text-neutral-900 font-bold hover:underline"
                  >
                    Resend SMS Code
                  </button>
                )}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleVerifyOtp}
                disabled={otp.some((d) => !d) || isOtpVerifying}
                className="w-full py-3.5 px-4 bg-black hover:bg-neutral-800 disabled:opacity-40 active:scale-[0.98] text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isOtpVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Sovereign OTP</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Profile Info Setup */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 animate-fade-in">
            <div>
              <div className="text-center space-y-1 mb-6">
                <h2 className="text-lg font-black text-neutral-900">
                  Profile Info
                </h2>
                <p className="text-xs text-neutral-500">
                  Please provide your name and an optional profile photo.
                </p>
              </div>

              {/* Avatar Selector */}
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="relative group">
                  <img
                    src={avatar}
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-3xl object-cover ring-2 ring-black/10 shadow-md bg-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="absolute inset-0 bg-black/60 rounded-3xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                  >
                    <Camera className="w-5 h-5 mb-1" />
                    <span>Change</span>
                  </button>
                </div>

                {/* Preset Avatars Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(url)}
                      className={`w-10 h-10 rounded-2xl overflow-hidden ring-2 shrink-0 transition-all ${
                        avatar === url ? 'ring-black scale-105 shadow-sm' : 'ring-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Status */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                    Type your name here
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full p-3 bg-black/[0.02] border border-black/[0.08] rounded-2xl text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                    Status Message
                  </label>
                  <input
                    type="text"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="Available"
                    className="w-full p-3 bg-black/[0.02] border border-black/[0.08] rounded-2xl text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => {
                  if (name.trim()) setStep(5);
                }}
                disabled={!name.trim()}
                className="w-full py-3.5 px-4 bg-black hover:bg-neutral-800 disabled:opacity-40 active:scale-[0.98] text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Complete Setup</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Initializing Keys & Protocol */}
        {step === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center animate-fade-in space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center shadow-xl">
              <RefreshCw className="w-10 h-10 animate-spin" />
            </div>

            <div>
              <h2 className="text-lg font-black text-neutral-900">
                Initializing Matrix Sovereign Keys
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Please wait a moment while we provision your Ed25519 identity...
              </p>
            </div>

            {/* Stage Progress List */}
            <div className="w-full max-w-xs space-y-2.5 text-left bg-black/[0.02] p-4 rounded-2xl border border-black/[0.06]">
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                {initStage >= 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-black/20 animate-spin shrink-0" />
                )}
                <span className={initStage >= 1 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}>
                  1. Generating Vodozemac Keys
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-semibold">
                {initStage >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-black/20 shrink-0" />
                )}
                <span className={initStage >= 2 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}>
                  2. Establishing Matrix Homeserver
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-semibold">
                {initStage >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-black/20 shrink-0" />
                )}
                <span className={initStage >= 3 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}>
                  3. Synchronizing African Regional SFUs
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-semibold">
                {initStage >= 4 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-black/20 shrink-0" />
                )}
                <span className={initStage >= 4 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}>
                  4. Matrix Session Ready
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Country Picker Modal Overlay */}
        {showCountryPicker && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl z-20 flex flex-col p-4 animate-fade-in text-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <h3 className="text-sm font-black text-neutral-900">Choose a country</h3>
              <button
                type="button"
                onClick={() => setShowCountryPicker(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search country or code"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-black/[0.03] border border-black/[0.08] rounded-xl text-xs text-neutral-900 outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(c);
                    setShowCountryPicker(false);
                    setCountrySearch('');
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-black/[0.04] flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{c.flag}</span>
                    <span className="text-xs font-semibold text-neutral-900">{c.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-500">{c.dialCode}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Number Dialog Overlay */}
        {showConfirmNumberDialog && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 border border-black/[0.08] shadow-2xl max-w-xs text-center space-y-4">
              <h3 className="text-base font-black text-neutral-900">
                Is this phone number correct?
              </h3>
              <p className="text-sm font-mono font-bold text-neutral-800">
                {selectedCountry.dialCode} {phoneNumber}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmNumberDialog(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-xs font-bold text-neutral-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleConfirmNumber}
                  className="flex-1 py-2 px-3 rounded-xl bg-black hover:bg-neutral-800 text-xs font-bold text-white shadow-sm"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
