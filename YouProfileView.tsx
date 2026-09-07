import React, { useState } from 'react';
import {
  Wallet,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  CreditCard,
  Settings,
  Shield,
  Smartphone,
  Bell,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  ArrowRight,
  MessageSquare,
  Phone,
  Share2,
  ExternalLink,
  Lock,
  Layers,
  Repeat,
  Edit3,
  Globe,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  LogOut,
  AlertTriangle,
  X,
  Building2,
  ArrowLeftRight,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { soundEngine } from '../utils/audioSynth';
import { SocialLink, CareerItem, EducationItem } from '../types';
import { RealTimeCurrencyExchangeCard } from './wallet/RealTimeCurrencyExchangeCard';

type YouTab = 'wallet' | 'profile' | 'posts' | 'settings';

export const YouProfileView: React.FC = () => {
  const {
    currentUser,
    walletBalance,
    walletCurrency,
    setWalletCurrency,
    walletTransactions,
    sendMoney,
    requestMoney,
    openExchangeModal,
    isDarkMode,
    toggleTheme,
    setIsSettingsOpen,
    setIsUserSwitcherOpen,
    setIsE2EEOpen,
    setIsUVSModalOpen,
    setIsEditProfileOpen,
    setActiveTab,
    setActiveRoomId,
    logout,
    startAuthExperience,
    isLogoutConfirmOpen,
    setIsLogoutConfirmOpen,
    openBusinessSettings,
  } = useChat();

  const [activeSubTab, setActiveSubTab] = useState<YouTab>('wallet');
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Send Money Modal State
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendRecipient, setSendRecipient] = useState('John Smith');
  const [sendHandle, setSendHandle] = useState('@johnsmith:wat.chat');
  const [sendAmount, setSendAmount] = useState('500');
  const [sendNote, setSendNote] = useState('Strategy advisory payment');

  // Request Money Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestPayer, setRequestPayer] = useState('Apex Capital Partners');
  const [requestAmount, setRequestAmount] = useState('1200');
  const [requestNote, setRequestNote] = useState('Consulting retainer tranche');

  // QR Modal State
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleCopyHandle = () => {
    navigator.clipboard.writeText(currentUser.handle);
    setCopiedHandle(true);
    soundEngine.playChime();
    setTimeout(() => setCopiedHandle(false), 1500);
  };

  const handleExecuteSend = () => {
    const val = parseFloat(sendAmount);
    if (!val || val <= 0) return;
    sendMoney(val, sendRecipient, sendHandle, sendNote);
    setIsSendModalOpen(false);
  };

  const handleExecuteRequest = () => {
    const val = parseFloat(requestAmount);
    if (!val || val <= 0) return;
    requestMoney(val, requestPayer, requestNote);
    setIsRequestModalOpen(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <div
      id="you-profile-view"
      className="flex-1 bg-neutral-100 dark:bg-[#0b0e14] flex flex-col h-full overflow-y-auto select-none p-4 sm:p-6 md:p-8 pb-20 md:pb-8 text-neutral-900 dark:text-neutral-100"
    >
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Profile Card Hero */}
        <div className="rounded-3xl bg-white/90 dark:bg-black/40 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Large Profile Photo */}
            <div className="relative group">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-black/5 shadow-md bg-neutral-100"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
              <button
                id="you-view-avatar-edit-btn"
                onClick={() => setIsEditProfileOpen(true)}
                className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs"
                title="Change Avatar"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Information */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                      {currentUser.name}
                    </h1>
                    <CheckCircle2 className="w-5 h-5 text-neutral-900" />
                  </div>
                  <button
                    onClick={handleCopyHandle}
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-black font-mono mt-1 transition-colors font-medium"
                  >
                    <span>{currentUser.handle}</span>
                    {copiedHandle ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    id="you-view-edit-profile-btn"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="px-3.5 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    id="you-view-settings-btn"
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-700 hover:text-black transition-colors border border-black/[0.06]"
                    title="Account Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  <button
                    id="you-view-qr-btn"
                    onClick={() => setIsQRModalOpen(true)}
                    className="p-2.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-700 hover:text-black transition-colors border border-black/[0.06]"
                    title="Share Identity QR"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  <button
                    id="you-view-switch-user-btn"
                    onClick={() => setIsUserSwitcherOpen(true)}
                    className="px-3.5 py-2 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 border border-black/[0.08] text-xs font-bold transition-all"
                  >
                    Switch User
                  </button>

                  <button
                    id="you-view-logout-btn"
                    onClick={() => setShowLogoutModal(true)}
                    className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all text-xs font-bold flex items-center gap-1.5"
                    title="Log Out of Account"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Log Out</span>
                  </button>
                </div>
              </div>

              {/* Tagline / Headline */}
              <p className="text-sm font-semibold text-neutral-700 mt-2">
                {currentUser.headline || currentUser.statusMessage || 'Founder • Entrepreneur • Consultant'}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {currentUser.location || 'Johannesburg & Cape Town, South Africa'}
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-5">
                <button
                  id="you-view-message-action-btn"
                  onClick={() => {
                    setActiveRoomId('room_kwame');
                    setActiveTab('chats');
                  }}
                  className="px-4 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Message
                </button>

                <button
                  id="you-view-call-action-btn"
                  onClick={() => setActiveTab('calls')}
                  className="px-4 py-2 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 font-bold text-xs flex items-center gap-2 border border-black/[0.06] transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-white/90 dark:bg-black/40 p-1.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-x-auto no-scrollbar shadow-sm">
          {[
            { id: 'wallet', label: '💳 WAT Wallet', count: `${walletCurrency} ${walletBalance.toLocaleString()}` },
            { id: 'profile', label: '👤 About & Bio' },
            { id: 'posts', label: '✨ Posts & Media' },
            { id: 'settings', label: '🔒 Security & Settings' },
          ].map((t) => (
            <button
              key={t.id}
              id={`you-subtab-${t.id}`}
              onClick={() => {
                setActiveSubTab(t.id as YouTab);
                soundEngine.playChime();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSubTab === t.id
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
              }`}
            >
              <span>{t.label}</span>
              {t.count && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    activeSubTab === t.id
                      ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black font-black'
                      : 'bg-black/[0.05] dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 1. WALLET VIEW */}
        {activeSubTab === 'wallet' && (
          <div className="space-y-6">
            {/* Balance Hero Card */}
            <div className="rounded-3xl bg-white/90 dark:bg-black/40 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase font-mono tracking-wider">
                  <Wallet className="w-4 h-4 text-neutral-900 dark:text-white" />
                  <span>Sovereign Mobile Money & Multi-Currency Vault</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {(['ZAR', 'USD', 'NGN', 'EUR', 'GBP', 'KES', 'GHS', 'EGP', 'WAT'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setWalletCurrency(curr)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                        walletCurrency === curr
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                          : 'bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight font-mono">
                    {walletCurrency === 'ZAR' && 'R'}
                    {walletCurrency === 'USD' && '$'}
                    {walletCurrency === 'NGN' && '₦'}
                    {walletCurrency === 'EUR' && '€'}
                    {walletCurrency === 'GBP' && '£'}
                    {walletCurrency === 'KES' && 'KSh'}
                    {walletCurrency === 'GHS' && 'GH₵'}
                    {walletCurrency === 'EGP' && 'E£'}
                    {walletCurrency === 'XOF' && 'CFA'}
                    {walletCurrency === 'WAT' && '◈'}
                    {walletBalance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    +14.8% this month
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
                  Multi-rail matrix settlement enabled • 0% network gas fees • Real-time forex liquidity
                </p>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <button
                  id="wallet-send-btn"
                  onClick={() => setIsSendModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Send className="w-5 h-5 text-neutral-200 dark:text-neutral-800" />
                  <span>Send Money</span>
                </button>

                <button
                  id="wallet-exchange-btn"
                  onClick={() => openExchangeModal(walletCurrency, walletCurrency === 'USD' ? 'ZAR' : 'USD')}
                  className="p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex flex-col items-center justify-center gap-2 border border-emerald-500/20 transition-all active:scale-95"
                >
                  <ArrowLeftRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Live Exchange</span>
                </button>

                <button
                  id="wallet-request-btn"
                  onClick={() => setIsRequestModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-neutral-900 dark:text-neutral-100 font-bold text-xs flex flex-col items-center justify-center gap-2 border border-black/[0.06] dark:border-white/[0.06] transition-all active:scale-95"
                >
                  <ArrowDownLeft className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                  <span>Request</span>
                </button>

                <button
                  id="wallet-qr-btn"
                  onClick={() => setIsQRModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-neutral-900 dark:text-neutral-100 font-bold text-xs flex flex-col items-center justify-center gap-2 border border-black/[0.06] dark:border-white/[0.06] transition-all active:scale-95"
                >
                  <QrCode className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                  <span>Scan / Pay QR</span>
                </button>

                <button
                  id="wallet-topup-btn"
                  onClick={() => {
                    sendMoney(-1000, 'Top-Up', currentUser.handle, 'Card Top-Up');
                  }}
                  className="p-3.5 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-neutral-900 dark:text-neutral-100 font-bold text-xs flex flex-col items-center justify-center gap-2 border border-black/[0.06] dark:border-white/[0.06] transition-all active:scale-95 col-span-2 sm:col-span-1"
                >
                  <Plus className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                  <span>Top-Up +1,000</span>
                </button>
              </div>
            </div>

            {/* Real-Time Currency Exchange Card with Live Forex Ticker & Converter */}
            <RealTimeCurrencyExchangeCard />

            {/* Recent Transactions List */}
            <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 space-y-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-neutral-800" />
                  Recent Ledger & Settlements
                </h3>
                <span className="text-xs text-neutral-500 font-mono">
                  {walletTransactions.length} recorded operations
                </span>
              </div>

              <div className="divide-y divide-black/[0.06]">
                {walletTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="py-3.5 flex items-center justify-between hover:bg-black/[0.02] px-2 rounded-2xl transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                          tx.type === 'incoming'
                            ? 'bg-emerald-50 text-emerald-600'
                            : tx.type === 'outgoing'
                            ? 'bg-black/[0.05] text-neutral-900'
                            : 'bg-amber-50 text-amber-600'
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
                      <div>
                        <p className="text-xs font-bold text-neutral-900">{tx.counterpartyName}</p>
                        <p className="text-[11px] text-neutral-500">{tx.note || tx.category}</p>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {tx.referenceId}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-xs font-bold font-mono ${
                          tx.type === 'incoming' ? 'text-emerald-600' : 'text-neutral-900'
                        }`}
                      >
                        {tx.type === 'incoming' ? '+' : '-'}
                        {tx.currency === 'ZAR' ? 'R' : '$'}
                        {tx.amount.toLocaleString()}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/[0.05] text-neutral-600 font-mono uppercase font-bold">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. PROFILE TAB (ABOUT & BIO) */}
        {activeSubTab === 'profile' && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 sm:p-8 space-y-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">About & Public Bio</h3>
                <p className="text-xs text-neutral-500">
                  Visible to contacts and peers across federated Matrix rooms
                </p>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>

            {/* Bio text */}
            <div className="p-4 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Executive Biography
              </span>
              <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                {currentUser.bio ||
                  'Principal Enterprise Architect & Decentralized Communications Advisor with 15+ years experience building fintech protocols, resilient mobile networks, and cross-border trade rails.'}
              </p>
            </div>

            {/* Position & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Current Role</span>
                <p className="text-xs font-bold text-neutral-900 mt-0.5">
                  {currentUser.position || 'Principal Architect'}
                </p>
              </div>
              <div className="p-3.5 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Company</span>
                <p className="text-xs font-bold text-neutral-900 mt-0.5">
                  {currentUser.company || 'Lusimadio Strategic Consulting'}
                </p>
              </div>
              <div className="p-3.5 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Industry</span>
                <p className="text-xs font-bold text-neutral-900 mt-0.5">
                  {currentUser.industry || 'Fintech & Communications'}
                </p>
              </div>
            </div>

            {/* Career History */}
            {currentUser.careerHistory && currentUser.careerHistory.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-black/[0.06]">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-neutral-700" />
                  Career Experience
                </span>
                <div className="space-y-2">
                  {currentUser.careerHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-black/[0.02] rounded-2xl border border-black/[0.06]"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-neutral-900">{item.role}</p>
                        <span className="text-[11px] text-neutral-500 font-mono">{item.period}</span>
                      </div>
                      <p className="text-xs text-neutral-700 font-medium">{item.company}</p>
                      {item.description && (
                        <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education History */}
            {currentUser.education && currentUser.education.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-black/[0.06]">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-neutral-700" />
                  Education & Credentials
                </span>
                <div className="space-y-2">
                  {currentUser.education.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-black/[0.02] rounded-2xl border border-black/[0.06] flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-neutral-900">{item.degree}</p>
                        <p className="text-xs text-neutral-600">{item.school}</p>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono">{item.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Website & Links */}
            <div className="space-y-3 pt-2 border-t border-black/[0.06]">
              <span className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-neutral-700" />
                Official Links & Web Presence
              </span>

              {currentUser.website && (
                <a
                  href={
                    currentUser.website.startsWith('http')
                      ? currentUser.website
                      : `https://${currentUser.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] text-xs text-neutral-800 hover:text-black transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-black/[0.04] text-neutral-800">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-neutral-900">{currentUser.website}</span>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        Official Website / Portfolio
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
                </a>
              )}
            </div>

            {/* Verified Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-black/[0.06]">
              <div className="p-3 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Location</span>
                <p className="text-xs font-bold text-neutral-900">
                  {currentUser.location || 'Johannesburg & Cape Town, South Africa'}
                </p>
              </div>
              <div className="p-3 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Matrix ID</span>
                <p className="text-xs font-bold text-neutral-900 font-mono">{currentUser.handle}</p>
              </div>
              <div className="p-3 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Phone & Email</span>
                <p className="text-xs font-bold text-neutral-900">
                  {currentUser.phone || '+27 82 555 0199'} • {currentUser.email || 'lusimadio12@gmail.com'}
                </p>
              </div>
              <div className="p-3 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Verified Device & Security</span>
                <p className="text-xs font-bold text-neutral-900 font-mono">
                  {currentUser.deviceId || 'Apple Silicon M3 • E2EE Active'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. POSTS TAB */}
        {activeSubTab === 'posts' && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 text-center space-y-3 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <Sparkles className="w-8 h-8 text-neutral-800 mx-auto" />
            <h4 className="text-sm font-bold text-neutral-900">24-Hour Stories & Updates</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Share photos, videos, and product launches with your network.
            </p>
            <button
              onClick={() => setActiveTab('stories')}
              className="px-4 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-sm"
            >
              View Stories Feed
            </button>
          </div>
        )}

        {/* 4. SETTINGS TAB */}
        {activeSubTab === 'settings' && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 space-y-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <h3 className="text-base font-bold text-neutral-900">Security & App Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setIsE2EEOpen(true)}
                className="p-3.5 bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] rounded-2xl flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-neutral-800" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">E2EE Cryptography</p>
                    <p className="text-[11px] text-neutral-500">Olm / Megolm verification</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => setIsUVSModalOpen(true)}
                className="p-3.5 bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] rounded-2xl flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-neutral-800" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Matrix UVS Service</p>
                    <p className="text-[11px] text-neutral-500">OpenID cross-signing</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                id="you-settings-business-btn"
                onClick={() => openBusinessSettings('profile_account')}
                className="p-3.5 bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] rounded-2xl flex items-center justify-between text-left col-span-full transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-neutral-800" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">WAT Business Settings</p>
                    <p className="text-[11px] text-neutral-500">
                      African commerce, M-Pesa / MoMo gateways, team roles & AI bot configuration
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-3.5 bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] rounded-2xl flex items-center justify-between text-left col-span-full transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-5 h-5 text-neutral-800" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Full Application Settings</p>
                    <p className="text-[11px] text-neutral-500">
                      Notifications, chats, privacy, devices & storage
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* Architectural Brand Intro & Onboarding Showcase */}
            <div className="pt-4 border-t border-black/[0.06]">
              <div className="p-4 rounded-2xl bg-neutral-900 text-white border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <p className="text-xs font-bold text-white">Architectural Auth & Onboarding</p>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        NEW
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Explore the cinematic Brand Intro, Architectural Sign In, Personal/Business Sign Up & 5-Screen Journey.
                    </p>
                  </div>
                </div>
                <button
                  id="settings-auth-experience-btn"
                  onClick={() => {
                    soundEngine.playChime();
                    startAuthExperience();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-bold text-xs shadow-md transition-all whitespace-nowrap active:scale-95"
                >
                  Experience Flow
                </button>
              </div>
            </div>

            {/* Dedicated Logout Section */}
            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Account Session</p>
                    <p className="text-[11px] text-neutral-600">
                      End active session and unmount cryptographic keys from this browser.
                    </p>
                  </div>
                </div>
                <button
                  id="settings-logout-btn"
                  onClick={() => setShowLogoutModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap active:scale-95"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Log Out Confirmation Dialog */}
      {showLogoutModal && (
        <div
          id="logout-confirmation-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div
            id="logout-confirmation-modal"
            className="w-full max-w-sm bg-white border border-black/[0.08] rounded-3xl p-6 shadow-2xl space-y-4 animate-scale text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900">Log Out of WAT?</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Are you sure you want to log out? Your sovereign keys and active session on this device will be securely closed.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                id="logout-cancel-btn"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-2xl text-xs font-bold text-neutral-700 hover:bg-black/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                id="logout-confirm-btn"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                Confirm Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Money Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-white border border-black/[0.08] rounded-3xl p-6 shadow-2xl space-y-4 animate-scale">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-neutral-900" />
              Send Money via WAT Wallet
            </h3>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                value={sendRecipient}
                onChange={(e) => setSendRecipient(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Matrix Handle
              </label>
              <input
                type="text"
                value={sendHandle}
                onChange={(e) => setSendHandle(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
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
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-sm font-mono text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Note (Optional)
              </label>
              <input
                type="text"
                value={sendNote}
                onChange={(e) => setSendNote(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="px-4 py-2 rounded-2xl text-xs text-neutral-600 hover:text-black font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteSend}
                className="px-5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Money Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-white border border-black/[0.08] rounded-3xl p-6 shadow-2xl space-y-4 animate-scale">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-neutral-900" />
              Request Money / Send Payment Link
            </h3>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Payer Name
              </label>
              <input
                type="text"
                value={requestPayer}
                onChange={(e) => setRequestPayer(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Amount ({walletCurrency})
              </label>
              <input
                type="number"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-sm font-mono text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Reason / Invoice Note
              </label>
              <input
                type="text"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="px-4 py-2 rounded-2xl text-xs text-neutral-600 hover:text-black font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRequest}
                className="px-5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Identity & Pay Modal */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white border border-black/[0.08] rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-scale">
            <h3 className="text-base font-bold text-neutral-900">WAT QR Pay & Connect</h3>
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl flex items-center justify-center border border-black/[0.08] shadow-sm">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=wat://pay/${encodeURIComponent(
                  currentUser.handle
                )}`}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs font-mono text-neutral-900 font-bold">{currentUser.handle}</p>
            <p className="text-[11px] text-neutral-500">
              Scan this QR to initiate instant zero-fee peer payments or verified Matrix room invitations.
            </p>
            <button
              onClick={() => setIsQRModalOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
