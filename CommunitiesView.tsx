import React, { useState } from 'react';
import {
  Compass,
  Users,
  Hash,
  ArrowRight,
  Shield,
  Search,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const CommunitiesView: React.FC = () => {
  const { communities, createRoom, setActiveTab, setActiveRoomId } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinChannel = (channel: { id: string; name: string; topic: string }) => {
    const room = createRoom(channel.name, 'group', ['user_amara', 'user_kwame', 'user_brian'], channel.topic);
    setActiveRoomId(room.id);
    setActiveTab('chats');
  };

  return (
    <div className="flex-1 bg-neutral-100 flex flex-col h-full overflow-y-auto select-none p-4 md:p-8 pb-20 md:pb-8 text-neutral-900">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center gap-2">
                  <span>Communities & Spaces</span>
                  <span className="px-2 py-0.5 rounded-full bg-black/[0.05] text-neutral-800 text-[10px] font-mono border border-black/[0.08] font-bold">
                    FEDERATED
                  </span>
                </h1>
                <p className="text-xs text-neutral-500">
                  Discover public channels, developer spaces, and tech hubs across the Matrix federation
                </p>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Matrix Spaces..."
              className="w-full bg-white/90 border border-black/[0.08] rounded-2xl pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black shadow-sm"
            />
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] overflow-hidden flex flex-col justify-between hover:border-black/20 transition-all shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
            >
              {/* Cover / Banner */}
              <div className="relative h-32 bg-neutral-100 overflow-hidden">
                <img
                  src={community.avatar}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-mono text-neutral-900 font-bold border border-black/[0.08] shadow-sm">
                  {community.membersCount.toLocaleString()} Members
                </span>
              </div>

              {/* Body info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-neutral-900">
                      {community.name}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {community.description}
                  </p>

                  {/* Channel list */}
                  <div className="mt-4 space-y-1.5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Active Channels ({community.channels.length})
                    </span>
                    {community.channels.map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => handleJoinChannel(ch)}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.06] cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Hash className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                          <span className="text-xs font-semibold text-neutral-800 group-hover:text-black truncate">
                            {ch.name}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-black/[0.06] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400 font-medium">
                    matrix.wat.chat
                  </span>
                  <button
                    onClick={() => handleJoinChannel(community.channels[0])}
                    className="px-4 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                  >
                    Enter Space
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
