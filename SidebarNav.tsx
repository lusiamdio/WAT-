import React from 'react';
import {
  Home,
  MessageSquare,
  Compass,
  Store,
  User,
  Radio,
  Layers,
  UserCheck,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { soundEngine } from '../utils/audioSynth';

const watLogo = '/assets/image/ChatGPT Image Sep 4, 2026, 04_52_47 PM (1)-1.png';

export const SidebarNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setIsBlueprintOpen,
    setIsE2EEOpen,
    setIsUVSModalOpen,
    setIsUserSwitcherOpen,
    setIsUniversalSearchOpen,
    rooms,
  } = useChat();

  const totalUnread = rooms.reduce((acc, r) => acc + (r.unreadCount || 0), 0);

  return (
    <aside className="hidden md:flex w-16 md:w-20 bg-white/80 backdrop-blur-2xl border-r border-black/[0.06] shadow-[4px_0_30px_rgba(0,0,0,0.03)] flex-col items-center py-4 justify-between select-none z-30 shrink-0">
      {/* Brand Logo & Search trigger */}
      <div className="flex flex-col items-center gap-2.5">
        <button
          id="menu-header-wat-logo"
          onClick={() => {
            setActiveTab('dashboard');
            soundEngine.playChime();
          }}
          title="WAT Instant Messenger"
          className="relative group bg-transparent hover:scale-105 active:scale-95 transition-transform flex items-center justify-center focus:outline-none"
        >
          <img
            src={watLogo}
            alt="WAT"
            className="w-11 h-11 md:w-12 md:h-12 object-contain bg-transparent select-none pointer-events-none"
            loading="eager"
            decoding="async"
          />
        </button>

        {/* Quick Search Icon */}
        <button
          onClick={() => setIsUniversalSearchOpen(true)}
          className="p-2 text-neutral-500 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Primary System Navigation */}
      <nav className="flex flex-col items-center gap-2.5 my-auto">
        {/* 0. Home Dashboard */}
        <button
          onClick={() => {
            setActiveTab('dashboard');
            soundEngine.playChime();
          }}
          className={`relative p-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'bg-black text-white shadow-lg shadow-black/20'
              : 'text-neutral-500 hover:text-black hover:bg-black/[0.04]'
          }`}
          title="Home"
        >
          <Home className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* 1. Chats Tab */}
        <button
          onClick={() => {
            setActiveTab('chats');
            soundEngine.playChime();
          }}
          className={`relative p-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'chats'
              ? 'bg-black text-white shadow-lg shadow-black/20'
              : 'text-neutral-500 hover:text-black hover:bg-black/[0.04]'
          }`}
          title="Chats"
        >
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
          {totalUnread > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {totalUnread}
            </span>
          )}
        </button>

        {/* 2. Discover Tab */}
        <button
          onClick={() => {
            setActiveTab('discover');
            soundEngine.playChime();
          }}
          className={`relative p-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'discover'
              ? 'bg-black text-white shadow-lg shadow-black/20'
              : 'text-neutral-500 hover:text-black hover:bg-black/[0.04]'
          }`}
          title="Discover"
        >
          <Compass className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white" />
        </button>

        {/* 3. Business Tab */}
        <button
          onClick={() => {
            setActiveTab('business');
            soundEngine.playChime();
          }}
          className={`relative p-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'business'
              ? 'bg-black text-white shadow-lg shadow-black/20'
              : 'text-neutral-500 hover:text-black hover:bg-black/[0.04]'
          }`}
          title="Business"
        >
          <Store className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* 4. You Tab */}
        <button
          onClick={() => {
            setActiveTab('you');
            soundEngine.playChime();
          }}
          className={`relative p-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'you'
              ? 'bg-black text-white shadow-lg shadow-black/20'
              : 'text-neutral-500 hover:text-black hover:bg-black/[0.04]'
          }`}
          title="Profile"
        >
          <User className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="w-8 h-px bg-black/[0.08] my-1" />

        {/* Matrix Conference Hub */}
        <button
          onClick={() => setActiveTab('conference')}
          className={`relative p-2.5 rounded-xl transition-all duration-200 ${
            activeTab === 'conference'
              ? 'bg-black text-white'
              : 'text-neutral-400 hover:text-black hover:bg-black/[0.04]'
          }`}
          title="Matrix Conference Hub"
        >
          <Radio className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* System Architecture Blueprint */}
        <button
          onClick={() => setIsBlueprintOpen(true)}
          className="relative p-2.5 rounded-xl text-neutral-500 hover:text-black hover:bg-black/[0.04] transition-all duration-200"
          title="System Architecture Blueprint"
        >
          <Layers className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </nav>

      {/* Footer Controls */}
      <div className="flex flex-col items-center gap-2 pt-2">
        {/* Matrix UVS */}
        <button
          onClick={() => setIsUVSModalOpen(true)}
          title="Matrix User Verification Service"
          className="p-2 text-neutral-500 hover:text-black hover:bg-black/[0.04] rounded-xl transition-colors"
        >
          <UserCheck className="w-4 h-4" />
        </button>

        {/* E2EE Olm/Megolm */}
        <button
          onClick={() => setIsE2EEOpen(true)}
          title="E2EE Olm/Megolm Active"
          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>

        {/* Active User Avatar */}
        <button
          onClick={() => setIsUserSwitcherOpen(true)}
          className="relative group p-0.5 rounded-full ring-2 ring-black/10 hover:ring-black/30 transition-all"
          title={`Active: ${currentUser.name}`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </aside>
  );
};
