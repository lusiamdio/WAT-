import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  MessageSquare,
  PhoneCall,
  CreditCard,
  Building2,
  Users,
  Radio,
  Check,
  Upload,
  Camera,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import { PRESET_AVATARS } from '../../data/countries';
import confetti from 'canvas-confetti';

interface OnboardingJourneyProps {
  onComplete: (updatedProfile?: { avatar?: string; name?: string; bio?: string }) => void;
  currentUser?: {
    name: string;
    handle: string;
    avatar: string;
    isBusiness?: boolean;
    bio?: string;
  };
  onUpdateAvatar?: (avatar: string) => void;
  logoSrc?: string;
}

export const OnboardingJourney: React.FC<OnboardingJourneyProps> = ({
  onComplete,
  currentUser = {
    name: 'Kwame Mensah',
    handle: '@kwamemensah:wat.chat',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Product Architect & Explorer',
    isBusiness: false,
  },
  onUpdateAvatar,
  logoSrc = '/assets/image/ChatGPT Image Sep 4, 2026, 04_52_47 PM (1)-1.png',
}) => {
  // Screens: 1, 2, 3, 4, 5
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        const newAvatar = e.target.result;
        setAvatar(newAvatar);
        setUploadSuccess(true);
        soundEngine.playChime();
        onUpdateAvatar?.(newAvatar);
        setTimeout(() => setUploadSuccess(false), 2500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    soundEngine.playChime();
    if (currentScreen < 5) {
      setCurrentScreen((prev) => (prev + 1) as any);
    } else {
      handleFinalEnter();
    }
  };

  const handlePrev = () => {
    if (currentScreen > 1) {
      soundEngine.playChime();
      setCurrentScreen((prev) => (prev - 1) as any);
    }
  };

  const handleFinalEnter = () => {
    soundEngine.playMessageSent();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#000000', '#555555', '#999999', '#ffffff'],
      });
    } catch {}
    onComplete({
      avatar,
      name: currentUser.name,
      bio: currentUser.bio,
    });
  };

  return (
    <div className="relative w-full max-w-lg mx-auto z-20">
      <motion.div
        key={currentScreen}
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.99 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl text-neutral-900 overflow-hidden"
      >
        {/* Hidden File Input for Native File Browser Selection across Onboarding Screens */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
            e.target.value = '';
          }}
        />

        {/* Top Bar with Logo & Skip */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <img
              src={logoSrc}
              alt="WAT"
              className="w-6 h-6 object-contain bg-transparent select-none pointer-events-none"
              onError={(e) => {
                e.currentTarget.src = '/wat-logo.png';
              }}
            />
            <span className="text-[10px] font-semibold text-neutral-400">
              {currentScreen} of 5
            </span>
          </div>

          <button
            type="button"
            onClick={handleFinalEnter}
            className="text-[10px] text-neutral-400 hover:text-black transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Minimal Progress Line - 10% Grey Track, 30% Black Fill (No Borders) */}
        <div className="w-full h-1 bg-neutral-100 rounded-full mb-5 overflow-hidden">
          <motion.div
            className="h-full bg-black rounded-full"
            animate={{ width: `${(currentScreen / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* SCREEN 01: Welcome to WAT - Header removed */}
        {currentScreen === 1 && (
          <div className="space-y-4 text-center">
            {/* Visual Hub - No Border Lines */}
            <div className="p-5 rounded-2xl bg-neutral-100 flex items-center justify-around">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-black">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-neutral-600 mt-1.5">People</span>
              </div>

              {/* Logo in center: Transparent, No Borders */}
              <div className="flex flex-col items-center">
                <img
                  src={logoSrc}
                  alt="WAT"
                  className="w-10 h-10 object-contain bg-transparent select-none pointer-events-none"
                  onError={(e) => {
                    e.currentTarget.src = '/wat-logo.png';
                  }}
                />
                <span className="text-[11px] font-bold text-black mt-1">WAT</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-black">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-neutral-600 mt-1.5">Business</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                One platform for seamless communication, connections, and business.
              </p>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-2 px-3.5 rounded-xl bg-black text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* SCREEN 02: Connect Without Limits - Header removed */}
        {currentScreen === 2 && (
          <div className="space-y-4 text-center">
            <div className="p-5 rounded-2xl bg-neutral-100 grid grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-xl bg-white shadow-sm flex flex-col items-center">
                <MessageSquare className="w-4 h-4 text-black mb-1" />
                <span className="text-[11px] font-medium text-neutral-700">Chat</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white shadow-sm flex flex-col items-center">
                <PhoneCall className="w-4 h-4 text-black mb-1" />
                <span className="text-[11px] font-medium text-neutral-700">Calls</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white shadow-sm flex flex-col items-center">
                <Radio className="w-4 h-4 text-black mb-1" />
                <span className="text-[11px] font-medium text-neutral-700">Rooms</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Message, call, and share with contacts across any network.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-800 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-2 px-3.5 rounded-xl bg-black text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 03: Built for Business - Header removed */}
        {currentScreen === 3 && (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-neutral-100 flex items-center justify-around">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-black">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-medium text-neutral-600 mt-1">Chat</span>
              </div>

              <div className="h-0.5 w-6 bg-neutral-300" />

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-black">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-medium text-neutral-600 mt-1">Network</span>
              </div>

              <div className="h-0.5 w-6 bg-neutral-300" />

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-black">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-medium text-neutral-600 mt-1">Orders</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Turn chats into customer relationships, sales, and verified operations.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-800 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-2 px-3.5 rounded-xl bg-black text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 04: Your Identity - Header removed */}
        {currentScreen === 4 && (
          <div className="space-y-3.5 text-center">
            {/* Quick Profile Strip with Upload Action */}
            <div className="p-2.5 rounded-2xl bg-neutral-100 flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer shrink-0 rounded-xl overflow-hidden"
                  title="Upload profile photo"
                >
                  <img
                    src={avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-black block truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-neutral-400 block truncate">{currentUser.handle}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-semibold text-black bg-white hover:bg-neutral-200/80 px-2 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
              >
                <Upload className="w-2.5 h-2.5" />
                <span>Upload</span>
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-100 grid grid-cols-2 gap-1.5 text-left">
              <div className="p-2 rounded-xl bg-white shadow-sm">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-medium">Security</span>
                <span className="text-xs font-medium text-black">End-to-End Encrypted</span>
              </div>
              <div className="p-2 rounded-xl bg-white shadow-sm">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-medium">Directory</span>
                <span className="text-xs font-medium text-black">Global Mesh Reach</span>
              </div>
              <div className="p-2 rounded-xl bg-white shadow-sm">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-medium">Workspace</span>
                <span className="text-xs font-medium text-black">Teams & Channels</span>
              </div>
              <div className="p-2 rounded-xl bg-white shadow-sm">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-medium">Commerce</span>
                <span className="text-xs font-medium text-black">Payments & Invoicing</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Personalized tools configured for your privacy, team, and communication needs.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-800 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-2 px-3.5 rounded-xl bg-black text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 05: Ready / Profile Confirmation - Header removed */}
        {currentScreen === 5 && (
          <div className="space-y-3.5 text-center">
            {/* User Profile Summary Card with Clickable & Drag-and-Drop Photo Upload */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className={`p-3.5 rounded-2xl transition-all text-left max-w-sm mx-auto ${
                isDragging ? 'bg-neutral-200 scale-[1.01]' : 'bg-neutral-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar with Camera Overlay & Click Trigger */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer shrink-0 rounded-xl overflow-hidden shadow-sm"
                  title="Click or drag image to change photo"
                >
                  <img
                    src={avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-3.5 h-3.5 text-white" />
                    <span className="text-[7px] font-medium text-white mt-0.5">Upload</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-tl-md bg-black text-white flex items-center justify-center group-hover:hidden">
                    <Camera className="w-2 h-2" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-black truncate">
                      {currentUser.name}
                    </h3>
                    <span className="w-3.5 h-3.5 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                      <Check className="w-2 h-2" />
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 truncate">
                    {currentUser.handle}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5 truncate">
                    {currentUser.bio || 'Active Member'}
                  </p>

                  {/* Upload photo action button & feedback */}
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-semibold text-black bg-white hover:bg-neutral-200/80 px-2 py-1 rounded-lg transition-colors inline-flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Upload className="w-2.5 h-2.5" />
                      <span>{avatar !== currentUser.avatar ? 'Change photo' : 'Upload photo'}</span>
                    </button>

                    {uploadSuccess && (
                      <span className="text-[9px] font-medium text-black bg-white px-1.5 py-0.5 rounded-md shadow-sm inline-flex items-center gap-1">
                        <Check className="w-2 h-2" /> Saved
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional Quick Preset Avatars Row - No Border Line */}
              <div className="mt-2.5 pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-neutral-400 font-medium">
                    Or choose a preset
                  </span>
                  <span className="text-[9px] text-neutral-400">
                    Drag &amp; drop supported
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  {PRESET_AVATARS.slice(0, 5).map((pic, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setAvatar(pic);
                        soundEngine.playChime();
                        onUpdateAvatar?.(pic);
                      }}
                      className={`w-6 h-6 rounded-lg overflow-hidden shrink-0 transition-transform ${
                        avatar === pic ? 'scale-105 opacity-100' : 'opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={pic} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Welcome to WAT Instant Messenger &amp; Business.
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinalEnter}
              className="w-full py-2 px-4 rounded-xl bg-black text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
            >
              <span>Enter WAT</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
