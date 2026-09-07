import React, { useState } from 'react';
import {
  Calendar,
  Radio,
  Users,
  Video,
  Mic,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Play,
  Volume2,
  Share2,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Send,
  ThumbsUp,
  Tag,
  Server,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { ConferenceSession, ConferenceSpeaker } from '../types';

export const MatrixConferenceView: React.FC = () => {
  const {
    currentUser,
    setActiveTab,
    createRoom,
    startCall,
    startJitsiConference,
    setIsUVSModalOpen,
    setIsJitsiDevOpsOpen,
  } = useChat();

  const [activeTrack, setActiveTrack] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [isLiveStageMuted, setIsLiveStageMuted] = useState(false);
  const [stageQuestions, setStageQuestions] = useState([
    {
      id: 'q1',
      author: '@amara:wat.chat',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      question: 'How does Sliding Sync (Sync v3) optimize battery usage for low-bandwidth mobile devices in Africa?',
      upvotes: 24,
      answered: true,
    },
    {
      id: 'q2',
      author: '@kwame:wat.chat',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      question: 'Can Matrix User Verification Service (UVS) issue verifiable credentials for Mobile Money merchants?',
      upvotes: 18,
      answered: false,
    },
    {
      id: 'q3',
      author: '@brian:wat.chat',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      question: 'What is the latency benchmark for MatrixRTC full mesh vs LiveKit SFU bridges in large conferences?',
      upvotes: 15,
      answered: false,
    },
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');

  const speakers: Record<string, ConferenceSpeaker> = {
    matthew: {
      id: 'spk_matthew',
      name: 'Matthew Hodgson',
      role: 'Technical Co-Founder',
      org: 'Matrix.org Foundation / Element',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      matrixId: '@matthew:matrix.org',
      bio: 'Co-creator of Matrix, leading Matrix 2.0, Native MatrixRTC, and sovereign decentralized communications.',
    },
    kegan: {
      id: 'spk_kegan',
      name: 'Kegan Dougal',
      role: 'Core Architect & Sliding Sync Lead',
      org: 'Matrix.org Foundation',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      matrixId: '@kegan:matrix.org',
      bio: 'Author of the Sliding Sync (MSC3575) specification and high-performance Synapse/Dendrite engines.',
    },
    amara: {
      id: 'spk_amara',
      name: 'Amara Okafor',
      role: 'Principal Decentralization Engineer',
      org: 'WAT Comms & Pan-African Matrix Hub',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      matrixId: '@amara:wat.chat',
      bio: 'Pioneering African cross-border instant messaging, Mobile Money payment bots, and Matrix user verification.',
    },
    hubert: {
      id: 'spk_hubert',
      name: 'Hubert Chathi',
      role: 'Cryptography Lead',
      org: 'Matrix.org Foundation',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      matrixId: '@hubert:matrix.org',
      bio: 'Leading Vodozemac (Rust implementation of Olm/Megolm) and Post-Quantum cryptography in Matrix.',
    },
  };

  const sessions: ConferenceSession[] = [
    {
      id: 'sess_1',
      title: 'Opening Keynote: Matrix 2.0, Sliding Sync & Real-Time MatrixRTC',
      track: 'Matrix 2.0 & Core',
      speakers: [speakers.matthew, speakers.kegan],
      startTime: '10:00 AM UTC',
      durationMinutes: 45,
      abstract:
        'A comprehensive look at the new Matrix 2.0 stack: sub-100ms Sliding Sync, Native MatrixRTC mesh voice/video calls, and OIDC decentralized identity.',
      roomAlias: '#conference-stage:matrix.org',
      isLiveNow: true,
      tags: ['Matrix2.0', 'SlidingSync', 'MatrixRTC'],
    },
    {
      id: 'sess_2',
      title: 'Decentralized Identity & The Matrix User Verification Service (UVS)',
      track: 'User Verification & Trust',
      speakers: [speakers.amara],
      startTime: '11:00 AM UTC',
      durationMinutes: 40,
      abstract:
        'Deep dive into OpenID Connect token verification, Cross-Signing trust levels, and automated room permission validation with the Matrix UVS service.',
      roomAlias: '#uvs-track:matrix.org',
      tags: ['UVS', 'OpenID', 'CrossSigning', 'Security'],
    },
    {
      id: 'sess_3',
      title: 'Vodozemac: High-Performance Rust Cryptography & E2EE Ratchets',
      track: 'Crypto & Vodozemac',
      speakers: [speakers.hubert],
      startTime: '01:30 PM UTC',
      durationMinutes: 45,
      abstract:
        'Exploring the memory-safe Rust Vodozemac engine powering Olm, Megolm, and next-generation MLS (Messaging Layer Security) across web and mobile.',
      roomAlias: '#crypto-track:matrix.org',
      tags: ['Vodozemac', 'Rust', 'E2EE', 'Megolm'],
    },
    {
      id: 'sess_4',
      title: 'Conversational Mobile Money & Matrix Commerce Bots',
      track: 'Mobile Commerce & Bots',
      speakers: [speakers.amara],
      startTime: '02:30 PM UTC',
      durationMinutes: 40,
      abstract:
        'Building sovereign African micro-payments over Matrix events: M-Pesa, MTN MoMo webhooks, and automated inventory sync in end-to-end encrypted rooms.',
      roomAlias: '#commerce-track:matrix.org',
      tags: ['MobileMoney', 'Bots', 'E2EECommerce'],
    },
  ];

  const filteredSessions = sessions.filter(
    (s) => activeTrack === 'all' || s.track === activeTrack
  );

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    setStageQuestions((prev) => [
      ...prev,
      {
        id: `q_${Date.now()}`,
        author: currentUser.name,
        avatar: currentUser.avatar,
        question: newQuestionText.trim(),
        upvotes: 1,
        answered: false,
      },
    ]);
    setNewQuestionText('');
  };

  const handleUpvote = (id: string) => {
    setStageQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  const handleJoinStageRoom = (sess: ConferenceSession) => {
    const room = createRoom(sess.title, 'group', ['user_amara', 'user_kwame', 'user_brian'], sess.abstract);
    setActiveTab('chats');
  };

  return (
    <div className="flex-1 bg-neutral-100 flex flex-col h-full overflow-y-auto select-none p-4 md:p-8 pb-20 md:pb-8 text-neutral-900">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center gap-2">
                <span>WAT Global Summit & Conference</span>
                <span className="px-2 py-0.5 rounded-full bg-black/[0.05] text-neutral-800 text-[10px] font-mono border border-black/[0.08] font-bold">
                  MATRIX 2.0
                </span>
              </h1>
              <p className="text-xs text-neutral-500">
                Sovereign Pan-African & Global Tech Summit • Live broadcasting via Jitsi SFU & MatrixRTC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsUVSModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-neutral-800 border border-black/[0.08] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-800" />
              <span>Verify Attendee (UVS)</span>
            </button>

            <button
              onClick={() => setIsJitsiDevOpsOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Jitsi DevOps</span>
            </button>
          </div>
        </div>

        {/* Live Main Stage Broadcaster Card */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Live Video / Audio Mesh Stream */}
            <div className="lg:col-span-2 relative bg-neutral-900 text-white flex flex-col justify-between min-h-[300px] sm:min-h-[360px] p-6">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    STAGE 1 LIVE
                  </span>
                  <span className="text-xs text-neutral-300 font-mono">
                    #conference-stage:matrix.org
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-xs font-mono text-white border border-white/10">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1,420 Online</span>
                </div>
              </div>

              {/* Center Speaker Graphic */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center space-y-3">
                <div className="relative">
                  <img
                    src={speakers.matthew.avatar}
                    alt={speakers.matthew.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-white/20 shadow-2xl"
                  />
                  <span className="absolute bottom-0 right-0 p-1 bg-white text-black rounded-full ring-2 ring-black">
                    <Mic className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {sessions[0].title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-mono mt-0.5">
                    Matthew Hodgson & Kegan Dougal • Matrix.org Foundation
                  </p>
                </div>

                {/* Animated Audio Equalizer */}
                <div className="flex items-center gap-1 h-6">
                  {[40, 70, 95, 60, 85, 100, 75, 50, 90, 65, 80, 45].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-white rounded-full transition-all duration-300"
                      style={{
                        height: isLiveStageMuted ? '4px' : `${h}%`,
                        opacity: isLiveStageMuted ? 0.3 : 0.9,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Stream Controls */}
              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLiveStageMuted(!isLiveStageMuted)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-neutral-300">
                    {isLiveStageMuted ? 'Audio Muted' : 'High-Definition Audio (Opus)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startJitsiConference('matrix-conf-2026-mainstage', 'video')}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Jitsi Live Stage</span>
                  </button>

                  <button
                    onClick={() => handleJoinStageRoom(sessions[0])}
                    className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/10 flex items-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Discussion</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Q&A and Questions Panel */}
            <div className="bg-white p-5 border-t lg:border-t-0 lg:border-l border-black/[0.06] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] mb-3">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Live Stage Q&A ({stageQuestions.length})</span>
                  </h4>
                  <span className="text-[10px] text-neutral-500 font-mono">UVS Audited</span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {stageQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-2.5 rounded-2xl bg-black/[0.03] border border-black/[0.06] flex items-start justify-between gap-2"
                    >
                      <div className="flex items-start gap-2">
                        <img
                          src={q.avatar}
                          alt={q.author}
                          className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold text-neutral-900 font-mono">
                              {q.author}
                            </span>
                            {q.answered && (
                              <span className="text-[9px] text-emerald-600 font-semibold">
                                ✓ Answered
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                            {q.question}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUpvote(q.id)}
                        className="px-2 py-1 rounded-xl bg-white border border-black/[0.08] text-[10px] font-mono text-neutral-900 font-bold flex items-center gap-1 shrink-0 shadow-sm"
                      >
                        <ThumbsUp className="w-2.5 h-2.5" />
                        <span>{q.upvotes}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Question form */}
              <form onSubmit={handleAskQuestion} className="mt-3 pt-3 border-t border-black/[0.06] flex gap-2">
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Ask speaker a question..."
                  className="flex-1 bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  disabled={!newQuestionText.trim()}
                  className="p-2.5 rounded-2xl bg-black hover:bg-neutral-800 disabled:opacity-40 text-white font-bold transition-all shrink-0 active:scale-95 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Tracks Filter & Conference Agenda */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-800" />
              <span>Full Schedule & Session Tracks</span>
            </h3>

            {/* Track filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Tracks' },
                { id: 'Matrix 2.0 & Core', label: 'Matrix 2.0' },
                { id: 'User Verification & Trust', label: 'UVS & Identity' },
                { id: 'Crypto & Vodozemac', label: 'Rust Vodozemac' },
                { id: 'Mobile Commerce & Bots', label: 'African Commerce' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTrack(t.id)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTrack === t.id
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-white/90 border border-black/[0.08] text-neutral-600 hover:text-black hover:bg-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Session Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((sess) => (
              <div
                key={sess.id}
                className="rounded-3xl bg-white/90 border border-black/[0.08] p-5 flex flex-col justify-between hover:border-black/20 transition-all shadow-sm hover:shadow-md space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/[0.04] border border-black/[0.06] text-neutral-800 font-mono text-[10px] font-bold">
                      {sess.track}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sess.startTime} ({sess.durationMinutes}m)
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900 mb-1.5">
                    {sess.title}
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {sess.abstract}
                  </p>

                  {/* Speaker Info */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-black/[0.06]">
                    {sess.speakers.map((spk) => (
                      <div key={spk.id} className="flex items-center gap-2">
                        <img
                          src={spk.avatar}
                          alt={spk.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-black/10"
                        />
                        <div>
                          <div className="text-xs font-bold text-neutral-900">
                            {spk.name}
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            {spk.role} • {spk.org}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-neutral-400 truncate">
                    {sess.roomAlias}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => startJitsiConference(`wat-matrix-${sess.id}`, 'video')}
                      className="px-3 py-1.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
                      title="Launch Jitsi Video SFU stream"
                    >
                      <Video className="w-3 h-3" />
                      <span>Jitsi Live</span>
                    </button>
                    <button
                      onClick={() => handleJoinStageRoom(sess)}
                      className="px-3 py-1.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 text-xs font-bold flex items-center gap-1 border border-black/[0.06] transition-colors"
                    >
                      <span>Chat</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
