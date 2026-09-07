import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  CreditCard,
  Settings as SettingsIcon,
  Shield,
  ShieldCheck,
  Smartphone,
  Bell,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  ArrowRight,
  Building2,
  Users,
  MessageSquare,
  Phone,
  Video,
  Share2,
  ExternalLink,
  Lock,
  Layers,
  Repeat,
  Calendar,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Zap,
  Search,
  Compass,
  Store,
  UserCheck,
  Laptop,
  X,
  Sun,
  Moon,
  ArrowLeftRight,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { soundEngine } from '../utils/audioSynth';
import { paymentService } from '../services/paymentService';

type PersonalSubTab = 'overview' | 'wallet' | 'priority' | 'businesses' | 'profile' | 'security';

export const WelcomeDashboardView: React.FC = () => {
  const {
    currentUser,
    rooms,
    setActiveRoomId,
    setActiveTab,
    setIsUniversalSearchOpen,
    setIsCommandCenterOpen,
    setIsSettingsOpen,
    setIsE2EEOpen,
    setIsUVSModalOpen,
    setIsUserSwitcherOpen,
    isDarkMode,
    toggleTheme,
    openExchangeModal,
    priorityUrgent,
    priorityMeetings,
    priorityPayments,
    priorityAIBrief,
    dismissUrgentItem,
    settlePriorityPayment,
    startCall,
    walletBalance,
    walletCurrency,
    setWalletCurrency,
    walletTransactions,
    sendMoney,
    requestMoney,
    openBusinessSettings,
  } = useChat();

  const [activeSubTab, setActiveSubTab] = useState<PersonalSubTab>('overview');
  const [greeting, setGreeting] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [copiedHandle, setCopiedHandle] = useState(false);

  // Send Money Modal State
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendRecipient, setSendRecipient] = useState('Amara Okonkwo');
  const [sendHandle, setSendHandle] = useState('@amara:wat.chat');
  const [sendAmount, setSendAmount] = useState('500');
  const [sendNote, setSendNote] = useState('Consulting advisory payment');
  const [sendTransferLoading, setSendTransferLoading] = useState(false);
  const [sendTransferSuccess, setSendTransferSuccess] = useState<string | null>(null);

  // Request Money Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestPayer, setRequestPayer] = useState('Apex Capital Partners');
  const [requestAmount, setRequestAmount] = useState('1200');
  const [requestNote, setRequestNote] = useState('Consulting retainer tranche');
  const [copiedPaymentLink, setCopiedPaymentLink] = useState(false);

  // QR Modal State
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Contact list for quick Matrix handle money transfer
  const quickMatrixContacts = [
    { name: 'Amara Okonkwo', handle: '@amara:wat.chat', link: 'https://wat.chat/@amara:wat.chat', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Kwame Mensah', handle: '@kwame:wat.chat', link: 'https://wat.chat/@kwame:wat.chat', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Zara Patel', handle: '@zara:wat.chat', link: 'https://wat.chat/@zara:wat.chat', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    { name: 'Brian Ndlovu', handle: '@brian:wat.chat', link: 'https://wat.chat/@brian:wat.chat', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { name: 'Nia Adebayo', handle: '@nia:wat.chat', link: 'https://wat.chat/@nia:wat.chat', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  ];

  const handleSelectQuickContact = (contact: typeof quickMatrixContacts[0]) => {
    setSendRecipient(contact.name);
    setSendHandle(contact.handle);
  };

  const handleHandleInput = (inputVal: string) => {
    setSendHandle(inputVal);
    // If user pastes a wat.chat link (e.g. https://wat.chat/@amara:wat.chat or wat.chat/@amara)
    const match = quickMatrixContacts.find(
      (c) =>
        inputVal.toLowerCase().includes(c.handle.toLowerCase().replace('@', '')) ||
        inputVal.toLowerCase().includes(c.name.toLowerCase())
    );
    if (match) {
      setSendRecipient(match.name);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');

      setCurrentDateTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }) +
          ' • ' +
          now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const totalUnread = rooms.reduce((acc, r) => acc + (r.unreadCount || 0), 0);
  const recentRooms = rooms.slice(0, 6);

  const handleCopyHandle = () => {
    navigator.clipboard.writeText(currentUser.handle);
    setCopiedHandle(true);
    soundEngine.playChime();
    setTimeout(() => setCopiedHandle(false), 1500);
  };

  const handleOpenRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setActiveTab('chats');
    soundEngine.playChime();
  };

  const handleJoinMeeting = (meeting: typeof priorityMeetings[0]) => {
    const room = rooms.find((r) => r.id === meeting.roomId) || rooms[0];
    startCall(room.id, meeting.type);
  };

  const handleExecuteSend = async () => {
    const val = parseFloat(sendAmount);
    if (!val || val <= 0) return;
    if (val > walletBalance) {
      alert(`Insufficient funds. Your current balance is ${walletCurrency} ${walletBalance.toFixed(2)}`);
      return;
    }
    setSendTransferLoading(true);

    try {
      await paymentService.transferViaMatrixHandle({
        senderHandle: currentUser.handle,
        recipientHandle: sendHandle,
        amount: val,
        currency: walletCurrency,
        note: sendNote,
      });
    } catch (e) {
      console.warn('Matrix handle transfer error:', e);
    }

    sendMoney(val, sendRecipient, sendHandle, sendNote);
    setSendTransferLoading(false);
    setSendTransferSuccess(`Successfully sent ${walletCurrency} ${val.toLocaleString()} to ${sendRecipient} via ${sendHandle}`);
    soundEngine.playChime();

    setTimeout(() => {
      setSendTransferSuccess(null);
      setIsSendModalOpen(false);
    }, 1200);
  };

  const handleExecuteRequest = () => {
    const val = parseFloat(requestAmount);
    if (!val || val <= 0) return;
    requestMoney(val, requestPayer, requestNote);
    setIsRequestModalOpen(false);
  };

  const currencySymbol =
    walletCurrency === 'ZAR' ? 'R' : walletCurrency === 'USD' ? '$' : walletCurrency === 'KES' ? 'KSh ' : '₦';

  return (
    <div className="flex-1 h-full overflow-y-auto bg-neutral-100 text-neutral-900 p-4 sm:p-6 lg:p-8 custom-scrollbar pb-24 md:pb-12 select-none">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
        
        {/* ========================================================================= */}
        {/* 1. EXECUTIVE PERSONAL IDENTITY & HERO BANNER                              */}
        {/* ========================================================================= */}
        <header className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* User Profile Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative group">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-black/10 shadow-xl"
                />
                <span className="absolute bottom-0.5 right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                    {greeting}, {currentUser.name.split(' ')[0]}
                  </h1>
                </div>

                {/* Handle & Quick Copy */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-1 text-xs text-neutral-500 flex-wrap">
                  <button
                    onClick={handleCopyHandle}
                    className="inline-flex items-center gap-1.5 font-mono text-neutral-800 hover:text-black font-semibold transition-colors"
                    title="Click to copy Matrix handle"
                  >
                    <span>{currentUser.handle}</span>
                    {copiedHandle ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-70" />
                    )}
                  </button>
                  <span>•</span>
                  <span>{currentUser.location || 'Johannesburg & Cape Town'}</span>
                  <span>•</span>
                  <span className="text-neutral-500 font-mono">{currentDateTime}</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-medium">
                  {currentUser.statusMessage || 'Founder • Technology Entrepreneur • Consultant'}
                </p>

                {/* Quick Action Pills */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                  <button
                    onClick={() => {
                      setActiveRoomId('room_kwame');
                      setActiveTab('chats');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('calls')}
                    className="px-3.5 py-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 border border-black/[0.08] font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </button>

                  <button
                    onClick={() => setIsQRModalOpen(true)}
                    className="p-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-700 border border-black/[0.08] transition-colors"
                    title="Share Identity QR"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsUserSwitcherOpen(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-black/[0.04] text-neutral-800 border border-black/[0.08] hover:bg-black/[0.08] text-xs font-bold transition-all"
                  >
                    Switch User
                  </button>
                </div>
              </div>
            </div>

            {/* Right Command & Quick Tools */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-2">
                {/* Real-Time Currency Exchange Quick Trigger */}
                <button
                  id="dashboard-exchange-btn"
                  onClick={() => openExchangeModal('USD', 'ZAR')}
                  className="p-2 sm:p-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
                  title="Real-Time Currency Exchange & Forex"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span className="hidden sm:inline">Exchange</span>
                </button>

                {/* Global Native Dark / Light Mode Toggle */}
                <button
                  id="dashboard-theme-toggle-btn"
                  onClick={toggleTheme}
                  className="p-2 sm:p-2.5 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-neutral-700 dark:text-neutral-200 border border-black/[0.08] dark:border-white/[0.12] transition-all active:scale-95"
                  title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-neutral-600" />
                  )}
                </button>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 sm:p-2.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-700 border border-black/[0.08] transition-all active:scale-95"
                  title="WAT Settings Ecosystem"
                >
                  <SettingsIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Wallet Summary Chip */}
              <div
                onClick={() => setActiveSubTab('wallet')}
                className="cursor-pointer px-4 py-2 rounded-2xl bg-black/[0.03] border border-black/[0.08] hover:border-black/20 flex items-center gap-3 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono uppercase block">WAT Wallet</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-neutral-900">
                    {currencySymbol}{walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. PERSONAL DASHBOARD SUB-NAVIGATION BAR                                  */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-black/[0.06] overflow-x-auto no-scrollbar shadow-sm">
          {[
            { id: 'overview', label: 'Dashboard Overview' },
            { id: 'wallet', label: 'Wallet & Fintech', count: `${currencySymbol}${walletBalance.toLocaleString()}` },
            { id: 'priority', label: 'Priority Hub', count: priorityUrgent.length > 0 ? `${priorityUrgent.length} Urgent` : undefined },
            { id: 'businesses', label: 'Businesses & Ventures' },
            { id: 'profile', label: 'Bio & Identity' },
            { id: 'security', label: 'Security & E2EE' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveSubTab(t.id as PersonalSubTab);
                soundEngine.playChime();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSubTab === t.id
                  ? 'bg-black text-white shadow-sm font-bold'
                  : 'text-neutral-600 hover:text-black hover:bg-black/[0.04]'
              }`}
            >
              <span>{t.label}</span>
              {t.count && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    activeSubTab === t.id
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-black/[0.05] text-neutral-700'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 3. TAB CONTENT: OVERVIEW (Default Unified View)                            */}
        {/* ========================================================================= */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Primary Call-to-Action: Chat Portal Banner */}
            <section className="bg-white/90 backdrop-blur-2xl p-5 sm:p-6 rounded-3xl border border-black/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 shadow-md">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                      Ready to connect with your contacts?
                    </h2>
                    {totalUnread > 0 && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white font-bold text-xs rounded-full">
                        {totalUnread} New
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                    Switch to the full chat interface to message, call, share media, or collaborate in secure channels.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('chats');
                  soundEngine.playChime();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0"
              >
                <span>Open Chats & Messages</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </section>

            {/* 4 Quick Portal Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <button
                onClick={() => {
                  setActiveTab('chats');
                  soundEngine.playChime();
                }}
                className="p-4 rounded-3xl bg-white/90 hover:bg-white border border-black/[0.08] shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-2xl bg-black/[0.04] text-neutral-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-black/[0.06]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900 group-hover:text-black transition-colors">
                    Chats
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {rooms.length} rooms • {totalUnread} unread
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('business');
                  soundEngine.playChime();
                }}
                className="p-4 rounded-3xl bg-white/90 hover:bg-white border border-black/[0.08] shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-2xl bg-black/[0.04] text-neutral-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-black/[0.06]">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900 group-hover:text-black transition-colors">
                    Business Suite
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    POS, Invoicing & CRM
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('discover');
                  soundEngine.playChime();
                }}
                className="p-4 rounded-3xl bg-white/90 hover:bg-white border border-black/[0.08] shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-2xl bg-black/[0.04] text-neutral-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-black/[0.06]">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900 group-hover:text-black transition-colors">
                    Discover
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Trending hubs & stores
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveSubTab('wallet');
                  soundEngine.playChime();
                }}
                className="p-4 rounded-3xl bg-white/90 hover:bg-white border border-black/[0.08] shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-2xl bg-black/[0.04] text-neutral-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-black/[0.06]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900 group-hover:text-black transition-colors">
                    WAT Wallet
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {currencySymbol}{walletBalance.toLocaleString()}
                  </div>
                </div>
              </button>
            </div>

            {/* Fintech Balance Hero & Priority Hub Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Columns: Priority Urgent & Meetings & Payments */}
              <div className="lg:col-span-2 space-y-5">
                {/* Urgent Direct Messages */}
                <div className="bg-white/90 border border-black/[0.08] rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <h3 className="text-sm font-bold text-neutral-900">
                        Urgent & Action Required ({priorityUrgent.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-neutral-500 font-mono">PRIORITY HIGH</span>
                  </div>

                  {priorityUrgent.length === 0 ? (
                    <div className="py-6 text-center text-xs text-neutral-500">
                      🎉 All urgent tasks and VIP messages are cleared!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {priorityUrgent.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06] rounded-2xl flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.senderAvatar}
                              alt={item.senderName}
                              className="w-9 h-9 rounded-xl object-cover shrink-0 border border-black/10"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-neutral-900 truncate">
                                  {item.senderName}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                  {item.priorityTag}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500 truncate mt-0.5">
                                {item.previewText}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleOpenRoom(item.roomId)}
                              className="px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => dismissUrgentItem(item.id)}
                              className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg"
                              title="Dismiss"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scheduled Meetings & Conferences */}
                <div className="bg-white/90 border border-black/[0.08] rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-800" />
                      <h3 className="text-sm font-bold text-neutral-900">
                        Scheduled Meetings & Jitsi Calls ({priorityMeetings.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-neutral-500 font-mono">WEBRTC SFU</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {priorityMeetings.map((m) => (
                      <div
                        key={m.id}
                        className="p-3.5 bg-black/[0.02] border border-black/[0.06] rounded-2xl flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-neutral-900 font-mono">
                              {m.time}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/[0.05] text-neutral-700">
                              {m.type === 'video' ? '📹 Video SFU' : '🎙️ Audio Mesh'}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-neutral-900 mt-1">
                            {m.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {m.participants.map((p, idx) => (
                              <img
                                key={idx}
                                src={p.avatar}
                                alt={p.name}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                title={p.name}
                              />
                            ))}
                          </div>
                          <button
                            onClick={() => handleJoinMeeting(m)}
                            className="px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                          >
                            <Video className="w-3 h-3" />
                            <span>Join Call</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Payments & Settlement */}
                {priorityPayments.length > 0 && (
                  <div className="bg-white/90 border border-black/[0.08] rounded-3xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-neutral-800" />
                        <h3 className="text-sm font-bold text-neutral-900">
                          Pending Invoices & Settlements ({priorityPayments.length})
                        </h3>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono">FINTECH ESCROW</span>
                    </div>

                    {priorityPayments.map((pay) => (
                      <div
                        key={pay.id}
                        className="p-3.5 bg-black/[0.02] border border-black/[0.06] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-neutral-900">
                            {pay.counterpartyName} — {pay.description}
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            Invoice ID: <span className="font-mono text-neutral-800">{pay.invoiceId}</span> • Due: {pay.dueDate}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-sm font-black text-neutral-900 font-mono">
                            {pay.currency} {pay.amount.toLocaleString()}
                          </div>
                          <button
                            onClick={() => settlePriorityPayment(pay.id)}
                            className="px-4 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                          >
                            Settle Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: AI 24h Intelligence Digest & System Status */}
              <div className="space-y-5">
                {/* AI Workspace Brief */}
                <div className="bg-white/90 border border-black/[0.08] rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-neutral-800" />
                      <h3 className="text-sm font-bold text-neutral-900">
                        24h AI Intelligence Brief
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-700 bg-black/[0.05] px-2 py-0.5 rounded-full">
                      Gemini Live
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {priorityAIBrief.summary}
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      Key Workspace Signals
                    </span>
                    <ul className="space-y-1.5 text-xs text-neutral-700">
                      {priorityAIBrief.bulletPoints.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-black font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-black/[0.06] space-y-2">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      Suggested Actions
                    </span>
                    <div className="space-y-1.5">
                      {priorityAIBrief.keyActions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsCommandCenterOpen(true);
                            soundEngine.playChime();
                          }}
                          className="w-full p-2 rounded-xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06] text-left text-xs text-neutral-800 flex items-center justify-between group transition-all"
                        >
                          <span className="truncate">{act}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* System Status & E2EE Cryptographic Verification */}
                <div className="bg-white/90 border border-black/[0.08] rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-neutral-900" />
                      <h3 className="text-sm font-bold text-neutral-900">
                        Matrix Security & Trust
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-600 bg-black/[0.05] px-2 py-0.5 rounded">VERIFIED</span>
                  </div>

                  <div className="space-y-2.5 text-xs text-neutral-700">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/[0.02] border border-black/[0.06]">
                      <span className="text-neutral-500">E2EE Ratchet</span>
                      <span className="font-mono text-neutral-900 font-bold">Olm / Megolm</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/[0.02] border border-black/[0.06]">
                      <span className="text-neutral-500">Cross-Signing</span>
                      <span className="font-mono text-neutral-900 font-bold">UVS Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/[0.02] border border-black/[0.06]">
                      <span className="text-neutral-500">Homeserver</span>
                      <span className="font-mono text-neutral-900">matrix.wat.chat</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setIsE2EEOpen(true)}
                      className="flex-1 py-2 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 text-xs font-semibold border border-black/[0.08] transition-colors"
                    >
                      Verify Keys
                    </button>
                    <button
                      onClick={() => setIsUVSModalOpen(true)}
                      className="flex-1 py-2 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 text-xs font-semibold border border-black/[0.08] transition-colors"
                    >
                      UVS Service
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Conversations Carousel */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Recent Conversations & Channels
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Click any contact or channel to enter the chat workspace
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('chats');
                    soundEngine.playChime();
                  }}
                  className="text-xs text-neutral-800 hover:text-black hover:underline flex items-center gap-1 font-bold"
                >
                  <span>View All ({rooms.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleOpenRoom(room.id)}
                    className="p-3.5 bg-white/90 hover:bg-white border border-black/[0.08] hover:border-black/20 rounded-3xl text-left transition-all group flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={room.avatar}
                          alt={room.name}
                          className="w-11 h-11 rounded-2xl object-cover ring-1 ring-black/10"
                        />
                        {room.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-emerald-500 text-white font-bold text-[9px] rounded-full">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 truncate group-hover:text-black transition-colors">
                            {room.name}
                          </span>
                          {room.isEncrypted && (
                            <Lock className="w-3 h-3 text-neutral-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {room.lastMessage?.text || 'No messages yet'}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. TAB CONTENT: WALLET & FINTECH HUB                                      */}
        {/* ========================================================================= */}
        {activeSubTab === 'wallet' && (
          <div className="space-y-6 animate-fade-in">
            {/* Fintech Balance Hero Card */}
            <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase font-mono tracking-wider">
                  <Wallet className="w-4 h-4" />
                  <span>WAT Verified Balance</span>
                </div>
                <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-xl border border-black/[0.06]">
                  {(['ZAR', 'USD', 'KES', 'NGN'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setWalletCurrency(curr)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-colors ${
                        walletCurrency === curr
                          ? 'bg-black text-white font-bold'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Amount Display */}
              <div className="mt-4">
                <span className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight font-mono">
                  {currencySymbol}
                  {walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <p className="text-xs text-neutral-500 mt-1">
                  Instant zero-fee settlement across Matrix federation & mobile money gateways
                </p>
              </div>

              {/* Quick 4 Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <button
                  onClick={() => setIsSendModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex flex-col items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <ArrowUpRight className="w-5 h-5" />
                  <span>Send Money</span>
                </button>

                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-900 border border-black/[0.08] font-bold text-xs flex flex-col items-center gap-1.5 active:scale-95 transition-all"
                >
                  <ArrowDownLeft className="w-5 h-5" />
                  <span>Receive Money</span>
                </button>

                <button
                  onClick={() => setIsQRModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-900 border border-black/[0.08] font-bold text-xs flex flex-col items-center gap-1.5 active:scale-95 transition-all"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Pay / QR</span>
                </button>

                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-900 border border-black/[0.08] font-bold text-xs flex flex-col items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Repeat className="w-5 h-5" />
                  <span>Request Link</span>
                </button>
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="rounded-3xl bg-white/90 border border-black/[0.08] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 uppercase font-mono tracking-wider">
                  Live Ledger & Transaction History
                </h3>
                <span className="text-xs text-neutral-500 font-mono">Immutable Log</span>
              </div>

              <div className="space-y-2">
                {walletTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06] flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          tx.type === 'incoming'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : tx.type === 'outgoing'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-black/[0.05] text-neutral-700 border border-black/[0.08]'
                        }`}
                      >
                        {tx.type === 'incoming' ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : tx.type === 'outgoing' ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <Repeat className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                          {tx.counterpartyName}
                        </h4>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {tx.note || tx.category} • {new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs sm:text-sm font-black font-mono ${
                          tx.type === 'incoming'
                            ? 'text-emerald-700'
                            : tx.type === 'outgoing'
                            ? 'text-rose-700'
                            : 'text-neutral-900'
                        }`}
                      >
                        {tx.type === 'incoming' ? '+' : tx.type === 'outgoing' ? '-' : ''}
                        {tx.currency} {tx.amount.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-neutral-400 capitalize">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. TAB CONTENT: PRIORITY HUB & AI BRIEF                                   */}
        {/* ========================================================================= */}
        {activeSubTab === 'priority' && (
          <div className="space-y-6 animate-fade-in">
            {/* Urgent Items */}
            <div className="bg-white/90 border border-black/[0.08] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span>Urgent Direct Actions ({priorityUrgent.length})</span>
                </h3>
                <span className="text-xs text-neutral-500 font-mono">PRIORITY QUEUE</span>
              </div>

              {priorityUrgent.length === 0 ? (
                <div className="py-8 text-center text-sm text-neutral-500">
                  🎉 No pending urgent actions. You are completely caught up!
                </div>
              ) : (
                <div className="space-y-3">
                  {priorityUrgent.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-black/[0.02] border border-black/[0.06] rounded-2xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.senderAvatar}
                          alt={item.senderName}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-black/10"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-neutral-900">{item.senderName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              {item.priorityTag}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">{item.previewText}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenRoom(item.roomId)}
                          className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-sm"
                        >
                          Reply in Chat
                        </button>
                        <button
                          onClick={() => dismissUrgentItem(item.id)}
                          className="p-2 text-neutral-400 hover:text-black"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Summary Card */}
            <div className="bg-white/90 border border-black/[0.08] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neutral-800" />
                  <span>24-Hour Executive AI Briefing</span>
                </h3>
                <span className="text-xs font-mono text-neutral-700 bg-black/[0.05] px-2.5 py-1 rounded-full">
                  Synthesized via Gemini
                </span>
              </div>

              <p className="text-sm text-neutral-700 leading-relaxed">
                {priorityAIBrief.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                    Key Intelligence Signals
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-700">
                    {priorityAIBrief.bulletPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-black font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                    Recommended Actions
                  </h4>
                  <div className="space-y-2">
                    {priorityAIBrief.keyActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsCommandCenterOpen(true);
                          soundEngine.playChime();
                        }}
                        className="w-full p-2.5 rounded-xl bg-white hover:bg-black/[0.02] border border-black/[0.08] text-left text-xs text-neutral-900 flex items-center justify-between group transition-all shadow-sm"
                      >
                        <span className="truncate">{act}</span>
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. TAB CONTENT: BUSINESSES & VENTURES                                     */}
        {/* ========================================================================= */}
        {activeSubTab === 'businesses' && (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-3xl bg-white/90 border border-black/[0.08] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-neutral-800" />
                  <span>Managed Businesses & Enterprises</span>
                </h3>
                <button
                  onClick={() => setActiveTab('business')}
                  className="text-xs text-neutral-800 hover:text-black hover:underline font-bold"
                >
                  Open Business Suite →
                </button>
              </div>

              <div className="p-5 bg-black/[0.02] border border-black/[0.06] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-neutral-900">Lusimadio Strategic Consulting</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    Enterprise architecture, Matrix protocol design, fintech integrations & advisory
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="px-3 py-1 bg-black/[0.05] text-neutral-800 rounded-lg text-xs font-bold font-mono border border-black/[0.08]">
                      R127,450 Monthly Revenue
                    </span>
                    <span className="px-3 py-1 bg-black/[0.05] text-neutral-800 rounded-lg text-xs font-bold font-mono border border-black/[0.08]">
                      17 Active Orders
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
                      Verified Business ID
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => openBusinessSettings('profile_account')}
                    className="px-4 py-2.5 rounded-xl bg-black/[0.05] hover:bg-black/[0.1] text-neutral-900 border border-black/[0.08] font-bold text-xs shadow-sm shrink-0 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Business Settings</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('business')}
                    className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm shrink-0 active:scale-95 transition-all"
                  >
                    Manage CRM & Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. TAB CONTENT: BIO & IDENTITY                                            */}
        {/* ========================================================================= */}
        {activeSubTab === 'profile' && (
          <div className="rounded-3xl bg-white/90 border border-black/[0.08] p-6 space-y-4 shadow-sm animate-fade-in">
            <h3 className="text-base font-bold text-neutral-900">About Lusimadio Simao</h3>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              Founder, Technology Entrepreneur & Enterprise Consultant with deep expertise in decentralized communications, Matrix 2.0 protocol infrastructure, pan-African mobile money integration, and AI workflow automation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-black/[0.06]">
              <div className="p-3.5 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Location</span>
                <p className="text-xs font-bold text-neutral-900 mt-0.5">Johannesburg & Cape Town, South Africa</p>
              </div>
              <div className="p-3.5 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Matrix ID</span>
                <p className="text-xs font-bold text-neutral-900 mt-0.5">@lusimadio:wat.chat</p>
              </div>
              <div className="p-3.5 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Verified Device</span>
                <p className="text-xs font-bold text-neutral-900 mt-0.5">Apple Silicon M3 • E2EE Active</p>
              </div>
              <div className="p-3.5 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Trust Score</span>
                <p className="text-xs font-bold text-emerald-700 mt-0.5">99.4% (Cross-Signing Verified)</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. TAB CONTENT: SECURITY & E2EE                                           */}
        {/* ========================================================================= */}
        {activeSubTab === 'security' && (
          <div className="rounded-3xl bg-white/90 border border-black/[0.08] p-6 space-y-4 shadow-sm animate-fade-in">
            <h3 className="text-base font-bold text-neutral-900">Cryptographic Identity & Security</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setIsE2EEOpen(true)}
                className="p-4 bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06] rounded-2xl flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-neutral-900" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">E2EE Cryptography</p>
                    <p className="text-[11px] text-neutral-500">Olm / Megolm key ratcheting</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => setIsUVSModalOpen(true)}
                className="p-4 bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06] rounded-2xl flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Matrix UVS Service</p>
                    <p className="text-[11px] text-neutral-500">OpenID cross-signing verification</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-4 bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06] rounded-2xl flex items-center justify-between text-left col-span-full transition-colors"
              >
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-6 h-6 text-neutral-900" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Full Application Settings</p>
                    <p className="text-[11px] text-neutral-500">Notifications, chats, privacy, devices & storage</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 9. MODALS: SEND MONEY, REQUEST MONEY, QR IDENTIFY                         */}
      {/* ========================================================================= */}

      {/* Send Money Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl p-6 shadow-[0_24px_48px_rgba(0,0,0,0.14)] space-y-4 animate-scale text-neutral-900">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                  <Send className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Send Money via Matrix Handle</h3>
                  <p className="text-[11px] text-neutral-500">Direct zero-fee P2P settlement across wat.chat handles</p>
                </div>
              </div>
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/[0.06] text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Select Contacts */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Select WAT Contact or Enter Handle
              </label>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {quickMatrixContacts.map((contact) => (
                  <button
                    key={contact.handle}
                    type="button"
                    onClick={() => handleSelectQuickContact(contact)}
                    className={`shrink-0 px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                      sendHandle === contact.handle
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-neutral-50 border-black/[0.08] hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <img src={contact.avatar} alt={contact.name} className="w-4 h-4 rounded-full object-cover" />
                    <span className="font-semibold">{contact.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono opacity-70">{contact.handle.split(':')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Recipient Matrix Handle or wat.chat Link
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sendHandle}
                  onChange={(e) => handleHandleInput(e.target.value)}
                  placeholder="e.g. @amara:wat.chat or https://wat.chat/@amara:wat.chat"
                  className="w-full bg-black/[0.03] border border-black/[0.10] rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black pl-8"
                />
                <span className="absolute left-2.5 top-2.5 text-xs text-neutral-400 font-mono">@</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                Paste any federated Matrix ID or sovereign <span className="font-mono text-neutral-700">wat.chat/@handle</span> payment link.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                  className="w-full bg-black/[0.03] border border-black/[0.10] rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Amount ({walletCurrency})
                </label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full bg-black/[0.03] border border-black/[0.10] rounded-xl px-3 py-2 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Note (Optional)</label>
              <input
                type="text"
                value={sendNote}
                onChange={(e) => setSendNote(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.10] rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            {sendTransferSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{sendTransferSuccess}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
              <div className="text-[11px] text-neutral-500 font-mono">
                Balance: {currencySymbol}{walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSendModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteSend}
                  disabled={sendTransferLoading}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendTransferLoading ? 'Settling...' : 'Send via Matrix Handle'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Money Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl p-6 shadow-[0_24px_48px_rgba(0,0,0,0.14)] space-y-4 animate-scale text-neutral-900">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Receive Money via wat.chat Link</h3>
                  <p className="text-[11px] text-neutral-500">Your automatically generated Matrix payment link</p>
                </div>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/[0.06] text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Permanent Profile Payment Link Card */}
            <div className="bg-neutral-50 border border-black/[0.08] rounded-2xl p-3.5 space-y-2">
              <div className="text-[11px] font-bold text-neutral-500 uppercase font-mono">
                Your Sovereign wat.chat Payment Link
              </div>
              <div className="flex items-center justify-between bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs">
                <span className="font-mono text-emerald-700 font-bold truncate">
                  https://wat.chat/{currentUser.handle}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://wat.chat/${currentUser.handle}`);
                    setCopiedPaymentLink(true);
                    soundEngine.playChime();
                    setTimeout(() => setCopiedPaymentLink(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 shrink-0 ml-2"
                >
                  {copiedPaymentLink ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500">
                Share this link with any buyer or client. Anyone clicking it can send money directly to your WAT Wallet.
              </p>
            </div>

            {/* Generate Specific Request / Invoice Link */}
            <div className="space-y-3 pt-1">
              <div className="text-xs font-bold text-neutral-900">Generate Custom Amount Invoice Link</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Payer Name</label>
                  <input
                    type="text"
                    value={requestPayer}
                    onChange={(e) => setRequestPayer(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/[0.10] rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Amount ({walletCurrency})</label>
                  <input
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/[0.10] rounded-xl px-3 py-2 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Reason / Invoice Note</label>
                <input
                  type="text"
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  className="w-full bg-black/[0.03] border border-black/[0.10] rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              {/* Dynamic Invoice Link Display */}
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-[11px] font-mono text-emerald-900 truncate">
                https://wat.chat/{currentUser.handle}?amount={requestAmount}&curr={walletCurrency}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://wat.chat/${currentUser.handle}?amount=${requestAmount}&currency=${walletCurrency}&note=${encodeURIComponent(
                      requestNote
                    )}`
                  );
                  alert('Custom invoice payment link copied to clipboard!');
                }}
                className="px-3 py-2 rounded-xl border border-black/[0.10] text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Invoice Link</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteRequest}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Send Matrix Request</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Identity & Pay Modal */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl p-6 shadow-[0_24px_48px_rgba(0,0,0,0.14)] space-y-4 text-center animate-scale text-neutral-900">
            <h3 className="text-base font-bold text-neutral-900">
              WAT QR Pay & Connect
            </h3>
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl flex items-center justify-center shadow-md border border-black/[0.08]">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=wat://pay/lusimadio:wat.chat"
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs font-mono text-neutral-900 font-semibold">
              {currentUser.handle}
            </p>
            <p className="text-[11px] text-neutral-500">
              Scan this QR to initiate instant zero-fee peer payments or verified Matrix room invitations.
            </p>
            <button
              onClick={() => setIsQRModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
