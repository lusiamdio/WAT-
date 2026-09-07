import React, { useState } from 'react';
import {
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  ShieldCheck,
  Plus,
  Server,
  Terminal,
  ExternalLink,
  Smartphone,
  QrCode,
  Users,
  Copy,
  Check,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const CallsView: React.FC = () => {
  const {
    rooms,
    startCall,
    startJitsiConference,
    users,
    currentUser,
    setIsJitsiDevOpsOpen,
    jitsiServerConfig,
  } = useChat();

  const [customRoomName, setCustomRoomName] = useState('');

  const callHistory = [
    {
      id: 'call_h1',
      room: rooms.find((r) => r.id === 'room_kwame') || rooms[0],
      type: 'video' as const,
      direction: 'incoming' as const,
      status: 'answered' as const,
      time: 'Today, 2:15 PM',
      duration: '14m 32s',
    },
    {
      id: 'call_h2',
      room: rooms.find((r) => r.id === 'room_brian') || rooms[1],
      type: 'voice' as const,
      direction: 'outgoing' as const,
      status: 'answered' as const,
      time: 'Yesterday, 6:40 PM',
      duration: '5m 12s',
    },
    {
      id: 'call_h3',
      room: rooms.find((r) => r.id === 'room_zainab') || rooms[2],
      type: 'voice' as const,
      direction: 'incoming' as const,
      status: 'missed' as const,
      time: 'May 12, 11:20 AM',
      duration: '0s',
    },
  ];

  const handleStartCustomMeeting = () => {
    const name = customRoomName.trim() || `wat-conference-${Date.now().toString().slice(-4)}`;
    startJitsiConference(name, 'video');
  };

  return (
    <div className="flex-1 bg-neutral-100 flex flex-col h-full overflow-y-auto select-none p-4 md:p-8 pb-20 md:pb-8 text-neutral-900">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center gap-2">
                <span>Calls & Video Conferences</span>
                <span className="px-2 py-0.5 rounded-full bg-black/[0.05] text-neutral-800 text-[10px] font-mono border border-black/[0.08] font-bold">
                  JITSI MEET SFU
                </span>
              </h1>
              <p className="text-xs text-neutral-500">
                Connected to sovereign server: <span className="text-neutral-900 font-mono font-bold">{jitsiServerConfig.serverDomain}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsJitsiDevOpsOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white text-neutral-800 border border-black/[0.08] rounded-2xl text-xs font-bold shadow-sm transition-all active:scale-95 self-start md:self-auto"
          >
            <Server className="w-4 h-4 text-neutral-800" />
            <span>Jitsi DevOps & Self-Hosting</span>
          </button>
        </div>

        {/* Premium Voice & Video Call Spotlight */}
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/[0.04] text-neutral-800 border border-black/[0.08] text-[10px] font-mono font-bold">
                  ✨ HD VOICE & VIDEO CALLS
                </span>
                <span className="text-xs text-emerald-600 font-bold">End-to-End Encrypted</span>
              </div>
              <h2 className="text-base font-bold text-neutral-900">
                Experience the Next-Gen Voice Calling Suite
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Featuring real-time multi-language translation, live bilingual captions, acoustic waveform visualizer, floating video PiP, in-call chat drawer, and tactile feedback.
              </p>
            </div>

            <button
              onClick={() => {
                const defaultRoom = rooms[0];
                if (defaultRoom) startCall(defaultRoom.id, 'voice');
              }}
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>Launch Voice Call</span>
            </button>
          </div>
        </div>

        {/* Video Conference Banner */}
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/[0.04] text-neutral-800 border border-black/[0.08] text-[10px] font-mono font-bold">
                  SECURE & SCALABLE
                </span>
                <span className="text-xs text-neutral-500 font-medium">Web & Mobile Compatible</span>
              </div>
              <h2 className="text-base font-bold text-neutral-900">
                Create an Instant Jitsi Video Conference
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Launch end-to-end encrypted multi-user video meetings powered by Jitsi Meet. Seamlessly connect from your web browser or scan to join on the Jitsi Meet mobile app.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={customRoomName}
                onChange={(e) => setCustomRoomName(e.target.value)}
                placeholder="Room name (optional)"
                className="px-4 py-2.5 rounded-2xl bg-black/[0.03] border border-black/[0.08] text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black min-w-[180px]"
              />
              <button
                onClick={handleStartCustomMeeting}
                className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
              >
                <Video className="w-4 h-4" />
                <span>Start Meeting</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Dial Matrix Contacts */}
        <div>
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
            Quick Connect Contacts
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {users
              .filter((u) => u.id !== currentUser.id && u.id !== 'user_ai')
              .map((contact) => {
                const targetRoom = rooms.find((r) => r.memberIds.includes(contact.id)) || rooms[0];
                return (
                  <div
                    key={contact.id}
                    className="p-4 rounded-3xl bg-white/90 border border-black/[0.08] flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-black/10"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                          contact.isOnline ? 'bg-emerald-500' : 'bg-neutral-400'
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 truncate w-28">
                        {contact.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-mono">
                        {contact.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => startCall(targetRoom.id, 'voice')}
                        className="p-2 rounded-2xl bg-black/[0.04] hover:bg-black hover:text-white text-neutral-800 transition-all border border-black/[0.06]"
                        title="Voice Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startCall(targetRoom.id, 'video')}
                        className="p-2 rounded-2xl bg-black/[0.04] hover:bg-black hover:text-white text-neutral-800 transition-all border border-black/[0.06]"
                        title="Jitsi Video Call"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Call History */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
            Recent Call Activity
          </h3>
          <div className="bg-white/90 border border-black/[0.08] rounded-3xl divide-y divide-black/[0.06] overflow-hidden shadow-sm">
            {callHistory.map((call) => (
              <div
                key={call.id}
                className="p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={call.room.avatar}
                    alt={call.room.name}
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-black/10"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      {call.room.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                      {call.status === 'missed' ? (
                        <PhoneMissed className="w-3.5 h-3.5 text-rose-500" />
                      ) : call.direction === 'incoming' ? (
                        <PhoneIncoming className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <PhoneOutgoing className="w-3.5 h-3.5 text-neutral-800" />
                      )}
                      <span>{call.time}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] font-semibold">{call.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startCall(call.room.id, call.type)}
                    className="p-2.5 rounded-2xl bg-black/[0.04] hover:bg-black hover:text-white text-neutral-800 transition-all border border-black/[0.06]"
                    title={`Call back (${call.type})`}
                  >
                    {call.type === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
