import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  User,
  MessageSquare,
  Building2,
  FileText,
  CreditCard,
  Sparkles,
  ArrowRight,
  Send,
  Clock,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { Message } from '../types';

interface SearchResultItem {
  id: string;
  category: 'people' | 'messages' | 'businesses' | 'files' | 'payments' | 'ai';
  title: string;
  subtitle: string;
  metadata?: string;
  avatar?: string;
  action: () => void;
}

export const UniversalSearchModal: React.FC = () => {
  const {
    isUniversalSearchOpen,
    setIsUniversalSearchOpen,
    users,
    rooms,
    createRoom,
    allMessages,
    setActiveRoomId,
    setActiveTab,
    setIsCommandCenterOpen,
    walletTransactions,
    discoverItems,
  } = useChat();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'people' | 'messages' | 'businesses' | 'files' | 'payments' | 'ai'
  >('all');

  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    const list: SearchResultItem[] = [];

    // Always include Ask WAT AI if query is present
    if (q) {
      list.push({
        id: 'ai-prompt',
        category: 'ai',
        title: `Ask WAT AI: "${query}"`,
        subtitle: 'Synthesize chats, analyze documents, calculate financials & execute actions',
        action: () => {
          setIsUniversalSearchOpen(false);
          setIsCommandCenterOpen(true);
        },
      });
    }

    // 1. People
    users.forEach((u) => {
      if (!q || u.name.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q) || u.statusMessage.toLowerCase().includes(q)) {
        list.push({
          id: `person-${u.id}`,
          category: 'people',
          title: u.name,
          subtitle: `${u.handle} • ${u.statusMessage}`,
          avatar: u.avatar,
          metadata: u.isOnline ? '🟢 Online' : 'Last seen recently',
          action: () => {
            const matchingRoom = rooms.find((r) => r.type === 'direct' && r.memberIds.includes(u.id));
            if (matchingRoom) {
              setActiveRoomId(matchingRoom.id);
            } else {
              const newRoom = createRoom(u.name, 'direct', [u.id]);
              setActiveRoomId(newRoom.id);
            }
            setActiveTab('chats');
            setIsUniversalSearchOpen(false);
          },
        });
      }
    });

    // 2. Messages
    Object.entries(allMessages).forEach(([roomId, msgs]) => {
      const room = rooms.find((r) => r.id === roomId);
      const messageList = msgs as Message[];
      messageList.forEach((m) => {
        if (q && m.text && m.text.toLowerCase().includes(q)) {
          list.push({
            id: `msg-${m.id}`,
            category: 'messages',
            title: m.text,
            subtitle: `In ${room ? room.name : 'Direct Chat'} • from ${m.senderName}`,
            metadata: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: () => {
              setActiveRoomId(roomId);
              setActiveTab('chats');
              setIsUniversalSearchOpen(false);
            },
          });
        }
      });
    });

    // 3. Businesses & Commerce
    discoverItems.forEach((item) => {
      const titleMatches = item.title?.toLowerCase().includes(q);
      const subMatches = item.subtitle?.toLowerCase().includes(q);
      const descMatches = item.description?.toLowerCase().includes(q);
      const authorMatches = item.authorName?.toLowerCase().includes(q);
      const tagMatches = item.tags?.some((t) => t.toLowerCase().includes(q));
      const locMatches = item.location?.toLowerCase().includes(q);

      if (!q || titleMatches || subMatches || descMatches || authorMatches || tagMatches || locMatches) {
        list.push({
          id: `biz-${item.id}`,
          category: 'businesses',
          title: item.title,
          subtitle: `${item.authorName || item.subtitle} • ${item.location || item.category}`,
          avatar: item.image || item.authorAvatar,
          metadata: item.priceTag || 'Artisan Business',
          action: () => {
            setActiveTab('discover');
            setIsUniversalSearchOpen(false);
          },
        });
      }
    });

    // 4. Payments
    walletTransactions.forEach((tx) => {
      if (
        !q ||
        tx.counterpartyName.toLowerCase().includes(q) ||
        tx.note?.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
      ) {
        list.push({
          id: `tx-${tx.id}`,
          category: 'payments',
          title: `${tx.type === 'incoming' ? 'Received from' : 'Sent to'} ${tx.counterpartyName}`,
          subtitle: `${tx.currency} ${tx.amount.toLocaleString()} • ${tx.note || tx.category}`,
          metadata: new Date(tx.timestamp).toLocaleDateString(),
          action: () => {
            setActiveTab('you');
            setIsUniversalSearchOpen(false);
          },
        });
      }
    });

    return list;
  }, [
    query,
    users,
    rooms,
    allMessages,
    walletTransactions,
    discoverItems,
    createRoom,
    setActiveRoomId,
    setActiveTab,
    setIsCommandCenterOpen,
    setIsUniversalSearchOpen,
  ]);

  const filteredResults = useMemo(() => {
    if (activeFilter === 'all') return results;
    return results.filter((r) => r.category === activeFilter);
  }, [results, activeFilter]);

  if (!isUniversalSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-16 bg-black/40 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl shadow-[0_24px_48px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col max-h-[85vh] animate-scale text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] flex items-center gap-3 bg-white/80">
          <Search className="w-5 h-5 text-neutral-800 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Universal Search (e.g. John, invoice, proposal, coffee, R2,500)..."
            className="flex-1 bg-transparent text-neutral-900 placeholder-neutral-400 text-base sm:text-lg focus:outline-none font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-black rounded-full hover:bg-black/[0.05]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsUniversalSearchOpen(false)}
            className="px-2.5 py-1 text-xs font-semibold text-neutral-600 hover:text-black bg-black/[0.05] hover:bg-black/[0.1] rounded-xl transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-black/[0.02] border-b border-black/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'people', label: 'People' },
            { id: 'messages', label: 'Messages' },
            { id: 'businesses', label: 'Businesses' },
            { id: 'files', label: 'Files & Docs' },
            { id: 'payments', label: 'Payments' },
            { id: 'ai', label: '✦ Ask AI' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === f.id
                  ? 'bg-black text-white font-bold shadow-sm'
                  : 'bg-white border border-black/[0.06] text-neutral-600 hover:text-black shadow-2xs'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-neutral-400" />
              <p className="text-sm font-medium text-neutral-700">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching for a person&apos;s name, message keyword, invoice ID, or file name.
              </p>
            </div>
          ) : (
            filteredResults.map((res) => {
              const getIcon = () => {
                switch (res.category) {
                  case 'ai':
                    return <Sparkles className="w-4 h-4 text-neutral-800" />;
                  case 'people':
                    return <User className="w-4 h-4 text-neutral-800" />;
                  case 'messages':
                    return <MessageSquare className="w-4 h-4 text-neutral-800" />;
                  case 'businesses':
                    return <Building2 className="w-4 h-4 text-neutral-800" />;
                  case 'files':
                    return <FileText className="w-4 h-4 text-neutral-800" />;
                  case 'payments':
                    return <CreditCard className="w-4 h-4 text-neutral-800" />;
                }
              };

              return (
                <div
                  key={res.id}
                  onClick={res.action}
                  className="p-3 rounded-2xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06] cursor-pointer flex items-center justify-between gap-3 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {res.avatar ? (
                      <img
                        src={res.avatar}
                        alt={res.title}
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-black/10"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-black/[0.04] text-neutral-800 flex items-center justify-center shrink-0 border border-black/[0.06]">
                        {getIcon()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-neutral-900 truncate group-hover:text-black">
                          {res.title}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/[0.04] text-neutral-600 font-mono capitalize shrink-0">
                          {res.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        {res.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {res.metadata && (
                      <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                        {res.metadata}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white/80 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span>Search scope: Matrix Federated Index + African Commerce</span>
          <span>Press ↵ to open selected result</span>
        </div>
      </div>
    </div>
  );
};
