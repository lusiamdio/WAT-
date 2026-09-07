import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Camera,
  RefreshCw,
  Upload,
} from 'lucide-react';
import { COUNTRIES, Country, PRESET_AVATARS } from '../../data/countries';
import { soundEngine } from '../../utils/audioSynth';

interface PersonalSignUpFlowProps {
  onComplete: (personalData: {
    name: string;
    email: string;
    phone: string;
    username: string;
    avatar: string;
    bio: string;
  }) => void;
  onBackToAccountType: () => void;
  logoSrc?: string;
}

export const PersonalSignUpFlow: React.FC<PersonalSignUpFlowProps> = ({
  onComplete,
  onBackToAccountType,
  logoSrc = '/assets/image/ChatGPT Image Sep 4, 2026, 04_52_47 PM (1)-1.png',
}) => {
  // Steps: 1: Details, 2: Verify (OTP), 3: Build Profile
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Your Details
  const [firstName, setFirstName] = useState('Kwame');
  const [lastName, setLastName] = useState('Mensah');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('802 456 7890');
  const [emailAddress, setEmailAddress] = useState('kwame.mensah@wat.chat');
  const [password, setPassword] = useState('watSecure2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [step1Error, setStep1Error] = useState('');

  // Step 2: Verify OTP
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [, setResendTimer] = useState(45);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3: Build Profile
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [displayName, setDisplayName] = useState('Kwame Mensah');
  const [username, setUsername] = useState('kwamemensah');
  const [shortBio, setShortBio] = useState('Product Architect & Explorer');
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setAvatar(e.target.result);
        soundEngine.playChime();
      }
    };
    reader.readAsDataURL(file);
  };

  // Step 1 Submission
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setStep1Error('Please provide your first and last name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setStep1Error('Please enter a valid phone number.');
      return;
    }
    if (!emailAddress.trim() || !emailAddress.includes('@')) {
      setStep1Error('Please provide a valid email address.');
      return;
    }
    if (password.length < 8) {
      setStep1Error('Password must be at least 8 characters long.');
      return;
    }

    setStep1Error('');
    soundEngine.playChime();
    setDisplayName(`${firstName} ${lastName}`);
    setUsername(`${firstName.toLowerCase()}${lastName.toLowerCase()}`);
    setCurrentStep(2);
  };

  // OTP Digits Handling
  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    const updated = [...otpDigits];
    updated[index] = cleaned;
    setOtpDigits(updated);

    if (cleaned && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(''));
      otpInputs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }
    setOtpError('');
    setIsVerifying(true);
    soundEngine.playMessageSent();

    setTimeout(() => {
      setIsVerifying(false);
      soundEngine.playChime();
      setCurrentStep(3);
    }, 850);
  };

  // Step 3 Submission
  const handleCreateMyWat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setIsFinalizing(true);
    soundEngine.playChime();

    setTimeout(() => {
      setIsFinalizing(false);
      onComplete({
        name: displayName,
        email: emailAddress,
        phone: `${selectedCountry.dialCode} ${phoneNumber}`,
        username: username.startsWith('@') ? username : `@${username}:wat.chat`,
        avatar,
        bio: shortBio,
      });
    }, 900);
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-20">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.99 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl text-neutral-900 overflow-hidden"
      >
        {/* Top Bar with Transparent Logo (No border) & Back option */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <img
              src={logoSrc}
              alt="WAT"
              className="w-7 h-7 object-contain bg-transparent select-none pointer-events-none"
              onError={(e) => {
                e.currentTarget.src = '/wat-logo.png';
              }}
            />
            <span className="text-xs font-semibold text-neutral-500">
              Step {currentStep} of 3
            </span>
          </div>

          <button
            type="button"
            onClick={onBackToAccountType}
            className="text-[11px] text-neutral-500 hover:text-black flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Change Type</span>
          </button>
        </div>

        {/* Minimal Progress Line - 10% Grey Track, 30% Black Fill (No Border) */}
        <div className="w-full h-1 bg-neutral-100 rounded-full mb-5 overflow-hidden">
          <motion.div
            className="h-full bg-black rounded-full"
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step 1: Your Details */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                Your details
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Enter your details to create your personal profile
              </p>
            </div>

            {step1Error && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-neutral-100 text-xs text-neutral-800">
                {step1Error}
              </div>
            )}

            <form onSubmit={handleStep1Submit} className="space-y-3">
              {/* Name Fields Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Kwame"
                    required
                    className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Mensah"
                    required
                    className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number with Country Code */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const found = COUNTRIES.find((c) => c.code === e.target.value);
                      if (found) setSelectedCountry(found);
                    }}
                    className="w-24 px-2.5 py-2 bg-neutral-100 rounded-xl text-xs text-black focus:outline-none focus:bg-neutral-200/80 transition-colors"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.dialCode}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="802 456 7890"
                    required
                    className="flex-1 px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="kwame.mensah@wat.chat"
                  required
                  className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="w-full px-3 py-2 pr-10 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* CTA: Continue - 30% Black */}
              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 2: Verify Your Number */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                Verify phone number
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Sent 6-digit code to{' '}
                <span className="font-semibold text-black">
                  {selectedCountry.dialCode} {phoneNumber}
                </span>
              </p>
            </div>

            {otpError && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-neutral-100 text-xs text-neutral-800">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* 6-Digit OTP Field - No Border Lines */}
              <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-12 text-center text-base font-bold bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-black focus:outline-none focus:bg-neutral-200/90 transition-all"
                  />
                ))}
              </div>

              {/* Demo Fill & Resend Controls */}
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(['7', '4', '2', '9', '1', '8']);
                    soundEngine.playChime();
                  }}
                  className="text-[11px] text-neutral-700 hover:text-black font-medium hover:underline"
                >
                  Auto-fill code (742918)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playChime();
                    setResendTimer(45);
                  }}
                  className="hover:text-black flex items-center gap-1 text-[11px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend</span>
                </button>
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-2.5 px-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-800 transition-colors"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Build Your Profile */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                Profile details
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Customize your display name and avatar
              </p>
            </div>

            <form onSubmit={handleCreateMyWat} className="space-y-3">
              {/* Profile Photo Selector with Upload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-neutral-600">
                    Profile Photo
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-neutral-700 hover:text-black font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload photo</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                <div className="flex items-center gap-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className={`relative group cursor-pointer shrink-0 rounded-xl overflow-hidden transition-all ${
                      isDragging ? 'ring-2 ring-black scale-105' : ''
                    }`}
                    title="Click or drag image to upload"
                  >
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black/45 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                      <span className="text-[8px] text-white font-medium mt-0.5">Change</span>
                    </div>
                  </div>

                  {/* Preset Avatars Scroll */}
                  <div className="flex-1 overflow-x-auto pb-1 flex gap-1.5 items-center">
                    {PRESET_AVATARS.slice(0, 5).map((pic, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setAvatar(pic);
                          soundEngine.playChime();
                        }}
                        className={`w-8 h-8 rounded-lg overflow-hidden shrink-0 transition-transform ${
                          avatar === pic ? 'ring-2 ring-black scale-105' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={pic} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Kwame Mensah"
                  required
                  className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Username
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-neutral-400">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                    placeholder="kwamemensah"
                    required
                    className="w-full pl-7 pr-16 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                  />
                  <span className="absolute right-3 text-[11px] text-neutral-400">
                    :wat.chat
                  </span>
                </div>
              </div>

              {/* Short Bio */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Bio
                </label>
                <textarea
                  rows={2}
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  placeholder="Tell contacts about yourself..."
                  className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 resize-none transition-colors"
                />
              </div>

              {/* CTA: Complete Profile */}
              <button
                type="submit"
                disabled={isFinalizing}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
              >
                {isFinalizing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Configuring Account...</span>
                  </div>
                ) : (
                  <>
                    <span>Complete Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
