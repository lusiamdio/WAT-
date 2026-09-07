import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CreditCard,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  CheckCircle2,
  Phone,
  Video,
  ExternalLink,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { soundEngine } from '../utils/audioSynth';

export const PriorityHub: React.FC = () => {
  const {
    currentUser,
    rooms,
    priorityUrgent,
    priorityMeetings,
    priorityPayments,
    priorityAIBrief,
    dismissPriorityUrgent,
    dismissPriorityPayment,
    setActiveRoomId,
    setActiveTab,
    startCall,
    setIsUniversalSearchOpen,
    setIsUserSwitcherOpen,
    toggleBusinessMode,
    businessMode,
  } = useChat();

  const [activeCard, setActiveCard] = useState<'none' | 'urgent' | 'meetings' | 'payments' | 'aibrief'>('none');
  const totalUnread = rooms.reduce((acc, r) => acc + (r.unreadCount || 0), 0);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const toggleCard = (card: 'urgent' | 'meetings' | 'payments' | 'aibrief') => {
    setActiveCard((prev) => (prev === card ? 'none' : card));
    soundEngine.playChime();
  };

  return (
    <div className="p-4 pb-2 border-b border-neutral-800/80 bg-gradient-to-b from-neutral-900/90 to-neutral-950 select-none">
      {/* Header with Search & Profile */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-sm text-white shadow-md shadow-emerald-900/30">
            WAT
          </div>
          <span className="font-extrabold text-lg text-neutral-100 tracking-tight">
            WAT
          </span>
          <button
            onClick={toggleBusinessMode}
            className={`ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
              businessMode === 'business'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
            }`}
            title="Switch between Personal and Business workspace"
          >
            {businessMode === 'business' ? 'Business Mode' : 'Personal'}
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUniversalSearchOpen(true)}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Universal Search (⌘K)"
          >
            <span className="text-xs">🔍</span>
          </button>

          <button
            onClick={() => setIsUserSwitcherOpen(true)}
            className="p-0.5 rounded-full ring-2 ring-emerald-500/40 hover:ring-emerald-400 transition-all"
            title="Switch Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Intelligent Greeting */}
      <div className="mb-3">
        <h2 className="text-base sm:text-lg font-bold text-neutral-100 tracking-tight">
          {greeting}, <span className="text-emerald-400">{currentUser.name.split(' ')[0]}</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          You have <strong className="text-emerald-300">{totalUnread || 8} unread conversations</strong> and 3 priority items.
        </p>
      </div>

      {/* 4 Priority Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
        {/* 1. 🔴 3 Urgent */}
        <button
          type="button"
          onClick={() => toggleCard('urgent')}
          className={`p-2.5 rounded-2xl border text-left transition-all ${
            activeCard === 'urgent'
              ? 'bg-rose-950/40 border-rose-500/50 shadow-md shadow-rose-950/40'
              : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {priorityUrgent.length} Urgent
            </span>
            {activeCard === 'urgent' ? (
              <ChevronUp className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 truncate">
            Needs attention
          </p>
        </button>

        {/* 2. 📅 2 Meetings */}
        <button
          type="button"
          onClick={() => toggleCard('meetings')}
          className={`p-2.5 rounded-2xl border text-left transition-all ${
            activeCard === 'meetings'
              ? 'bg-blue-950/40 border-blue-500/50 shadow-md shadow-blue-950/40'
              : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
              <Calendar className="w-3.5 h-3.5" />
              {priorityMeetings.length} Meetings
            </span>
            {activeCard === 'meetings' ? (
              <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 truncate">
            Upcoming calls
          </p>
        </button>

        {/* 3. 💰 1 Payment */}
        <button
          type="button"
          onClick={() => toggleCard('payments')}
          className={`p-2.5 rounded-2xl border text-left transition-all ${
            activeCard === 'payments'
              ? 'bg-amber-950/40 border-amber-500/50 shadow-md shadow-amber-950/40'
              : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <CreditCard className="w-3.5 h-3.5" />
              {priorityPayments.length} Payment
            </span>
            {activeCard === 'payments' ? (
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 truncate">
            Action required
          </p>
        </button>

        {/* 4. ✦ AI Brief */}
        <button
          type="button"
          onClick={() => toggleCard('aibrief')}
          className={`p-2.5 rounded-2xl border text-left transition-all ${
            activeCard === 'aibrief'
              ? 'bg-purple-950/40 border-purple-500/50 shadow-md shadow-purple-950/40'
              : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              AI Brief
            </span>
            {activeCard === 'aibrief' ? (
              <ChevronUp className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 truncate">
            5 key events
          </p>
        </button>
      </div>

      {/* Expanded Priority Detail Panels */}
      {activeCard === 'urgent' && (
        <div className="mt-2 p-3 bg-rose-950/20 border border-rose-800/40 rounded-2xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              Urgent Messages Requiring Quick Response
            </span>
            <button
              onClick={() => setActiveCard('none')}
              className="text-neutral-500 hover:text-neutral-300 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5">
            {priorityUrgent.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveRoomId(item.roomId);
                  setActiveCard('none');
                }}
                className="p-2 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.senderAvatar}
                    alt={item.senderName}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-200 truncate">
                        {item.senderName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-semibold">
                        {item.priorityTag}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {item.previewText}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissPriorityUrgent(item.id);
                  }}
                  className="text-neutral-500 hover:text-neutral-300 p-1 shrink-0"
                  title="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCard === 'meetings' && (
        <div className="mt-2 p-3 bg-blue-950/20 border border-blue-800/40 rounded-2xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Scheduled Calls & WebRTC Sessions
            </span>
            <button
              onClick={() => setActiveCard('none')}
              className="text-neutral-500 hover:text-neutral-300 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5">
            {priorityMeetings.map((m) => (
              <div
                key={m.id}
                className="p-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">{m.title}</h4>
                  <p className="text-[11px] text-blue-300 font-medium mt-0.5">
                    ⏰ {m.time}
                  </p>
                </div>
                <button
                  onClick={() => startCall(m.roomId, m.type)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-900/30 transition-all"
                >
                  {m.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                  Join Call
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCard === 'payments' && (
        <div className="mt-2 p-3 bg-amber-950/20 border border-amber-800/40 rounded-2xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              Pending Payment Settlement
            </span>
            <button
              onClick={() => setActiveCard('none')}
              className="text-neutral-500 hover:text-neutral-300 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {priorityPayments.map((p) => (
            <div
              key={p.id}
              className="p-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-200">
                    {p.counterpartyName}
                  </span>
                  <span className="text-xs font-extrabold text-amber-400">
                    {p.currency} {p.amount.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                  {p.description} • Due: {p.dueDate}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('you');
                  setActiveCard('none');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-md transition-all shrink-0"
              >
                Pay via Wallet
              </button>
            </div>
          ))}
        </div>
      )}

      {activeCard === 'aibrief' && (
        <div className="mt-2 p-3.5 bg-purple-950/20 border border-purple-800/40 rounded-2xl space-y-2.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              ✦ 24-Hour AI Ecosystem Intelligence
            </span>
            <button
              onClick={() => setActiveCard('none')}
              className="text-neutral-500 hover:text-neutral-300 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-neutral-300">
            {priorityAIBrief.summary}
          </p>
          <ul className="space-y-1.5 text-xs text-neutral-400">
            {priorityAIBrief.bulletPoints.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-purple-400 text-xs mt-0.5">•</span>
                <span className="flex-1">{b}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2 border-t border-purple-800/30 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-purple-400">
              Suggested next action: Reply to John Smith
            </span>
            <button
              onClick={() => {
                setActiveTab('ai');
                setActiveCard('none');
              }}
              className="text-xs font-bold text-purple-300 hover:underline flex items-center gap-1"
            >
              Open AI Workspace
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
