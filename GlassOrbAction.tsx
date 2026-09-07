import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Camera,
  Mic,
  UserPlus,
  MessageSquarePlus,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { soundEngine } from '../utils/audioSynth';

export const GlassOrbAction: React.FC = () => {
  const {
    activeTab,
    activeRoomId,
    activeCall,
    isWebRTCCallOpen,
    setIsNewChatModalOpen,
    setActiveTab,
    startCall,
  } = useChat();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // The WAT Crystal Orb must only appear in Chats.
  // It must disappear when user clicks on a specific chat to start a conversation, and during calls.
  if (activeTab !== 'chats' || !!activeRoomId || !!activeCall || isWebRTCCallOpen) {
    return null;
  }

  const toggleOrb = () => {
    setIsOpen(!isOpen);
    soundEngine.playPop();
  };

  const handleAction = (type: 'camera' | 'voice' | 'contact' | 'message') => {
    soundEngine.playChime();
    setIsOpen(false);

    if (type === 'message' || type === 'contact') {
      setIsNewChatModalOpen(true);
    } else if (type === 'voice') {
      startCall('room_kwame', 'Kwame Mensah', 'audio');
    } else if (type === 'camera') {
      setActiveTab('stories');
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-20 md:bottom-7 left-1/2 -translate-x-1/2 z-50 select-none flex flex-col items-center"
    >
      {/* Expanded Vertical Crystal Stack Options (Expands smoothly vertically upwards from the center) */}
      {isOpen && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center gap-2.5 z-50 animate-fade-in pointer-events-auto min-w-[200px]">
          {/* Ambient crystal glow aura */}
          <div className="absolute -inset-4 bg-white/70 backdrop-blur-2xl rounded-3xl -z-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-black/[0.08]" />

          {/* 1. New Message */}
          <button
            onClick={() => handleAction('message')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:scale-103 active:scale-95 transition-all duration-200 group text-left"
            title="Start New Chat"
          >
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <MessageSquarePlus className="w-4 h-4 text-white group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide">New Chat</span>
              <span className="text-[10px] text-neutral-400">Direct & encrypted</span>
            </div>
          </button>

          {/* 2. Add Contact */}
          <button
            onClick={() => handleAction('contact')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:scale-103 active:scale-95 transition-all duration-200 group text-left"
            title="Add Sovereign Contact"
          >
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <UserPlus className="w-4 h-4 text-white group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide">Add Contact</span>
              <span className="text-[10px] text-neutral-400">Phone or Matrix ID</span>
            </div>
          </button>

          {/* 3. Instant Voice & Calls */}
          <button
            onClick={() => handleAction('voice')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:scale-103 active:scale-95 transition-all duration-200 group text-left"
            title="Instant Voice & Calls"
          >
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Mic className="w-4 h-4 text-white group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide">Voice & Calls</span>
              <span className="text-[10px] text-neutral-400">HD SFU Conference</span>
            </div>
          </button>

          {/* 4. Camera & Stories */}
          <button
            onClick={() => handleAction('camera')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:scale-103 active:scale-95 transition-all duration-200 group text-left"
            title="Camera & Stories"
          >
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Camera className="w-4 h-4 text-white group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide">Camera & Stories</span>
              <span className="text-[10px] text-neutral-400">Ephemeral status updates</span>
            </div>
          </button>
        </div>
      )}

      {/* Central Signature WAT Crystal Orb Action Button */}
      <button
        id="wat-glass-orb-btn"
        onClick={toggleOrb}
        className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-[0_16px_40px_rgba(0,0,0,0.28)] border transition-all duration-300 active:scale-90 ${
          isOpen
            ? 'bg-black text-white border-white/40 rotate-45 scale-105 ring-4 ring-black/10'
            : 'bg-black text-white border-white/25 hover:scale-108 ring-4 ring-black/5 hover:ring-black/15'
        }`}
        title="WAT Crystal Orb (Quick Actions)"
      >
        {/* Subtle crystal refraction gradient inside */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-emerald-400/20 pointer-events-none" />

        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5]" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-black animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
};
