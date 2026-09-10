import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Send,
  Users,
  MessageCircle,
  Radio,
  Search,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { ProductInfo, Room } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

interface Props {
  product: ProductInfo;
  onBack: () => void;
}

export const ShareProductPage: React.FC<Props> = ({ product, onBack }) => {
  const {
    rooms,
    users,
    currentUser,
    shareProductToRooms,
    shareProductToStatus,
    setActiveTab,
    setActiveRoomId,
  } = useChat();

  const [activeShareTab, setActiveShareTab] = useState<'contacts' | 'groups' | 'status'>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
  const [statusCaption, setStatusCaption] = useState(
    `Now in Stock: ${product.name} (${product.isFree ? 'FREE' : `${product.currency} ${product.price}`})\n${product.description}`
  );
  const [sharedToast, setSharedToast] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Filter 1-on-1 vs Group rooms
  const directRooms = rooms.filter(
    (r) => !r.isGroup && r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const groupRooms = rooms.filter(
    (r) => r.isGroup && r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRoomSelect = (roomId: string) => {
    if (selectedRoomIds.includes(roomId)) {
      setSelectedRoomIds(selectedRoomIds.filter((id) => id !== roomId));
    } else {
      setSelectedRoomIds([...selectedRoomIds, roomId]);
    }
    soundEngine.playPop();
  };

  const handleShareToRooms = () => {
    if (selectedRoomIds.length === 0) return;
    shareProductToRooms(product, selectedRoomIds);
    soundEngine.playMessageSent();
    setSharedToast(`Shared "${product.name}" to ${selectedRoomIds.length} conversations!`);
    setSelectedRoomIds([]);
    setTimeout(() => {
      setSharedToast(null);
    }, 2800);
  };

  const handleShareToStatus = () => {
    shareProductToStatus(product, statusCaption);
    soundEngine.playMessageSent();
    setSharedToast(`Published "${product.name}" to your 24h Business Status story!`);
    setTimeout(() => {
      setSharedToast(null);
    }, 2800);
  };

  const copyProductLink = () => {
    navigator.clipboard?.writeText(
      `${window.location.origin}/#catalog/${product.id}`
    );
    setIsCopied(true);
    soundEngine.playPop();
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-black/[0.08] hover:bg-neutral-100 text-neutral-800 transition-colors shadow-xs group"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400">
              <span>Business Suite</span>
              <span>/</span>
              <span>Catalog</span>
              <span>/</span>
              <span className="text-purple-600">Share Product</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Share Catalog Item
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyProductLink}
            className="px-4 py-2 rounded-2xl bg-white border border-black/[0.08] hover:bg-neutral-50 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
            <span>{isCopied ? 'Link Copied' : 'Copy Direct Link'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {sharedToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-sm animate-scale">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{sharedToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('chats')}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-xl text-[11px] font-black"
          >
            Go to Chats →
          </button>
        </div>
      )}

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Summary & External Links */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-4">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Selected Item for Broadcast
            </div>

            <div className="flex gap-4 items-start">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded-2xl object-cover ring-1 ring-black/10 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700 mb-1">
                  {product.category}
                </span>
                <h4 className="text-base font-black text-neutral-900 leading-snug">
                  {product.name}
                </h4>
                <div className="text-sm font-black font-mono text-neutral-900 mt-1">
                  {product.isFree ? 'FREE' : `${product.currency} ${product.price}`}
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed pt-2 border-t border-black/[0.04]">
              {product.description}
            </p>
          </div>

          {/* Quick External Broadcast Cards */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              External Broadcast
            </h4>

            <div className="space-y-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out ${product.name} on WAT: ${window.location.origin}/#catalog/${product.id}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
              >
                <span>Share via WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  `${window.location.origin}/#catalog/${product.id}`
                )}&text=${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors"
              >
                <span>Share via Telegram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: In-App Target Selector */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-5">
          {/* Tabs: Contacts | Groups | Status */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveShareTab('contacts')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeShareTab === 'contacts'
                  ? 'bg-white text-black shadow-xs font-black'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct Clients</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveShareTab('groups')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeShareTab === 'groups'
                  ? 'bg-white text-black shadow-xs font-black'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Group Channels</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveShareTab('status')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeShareTab === 'status'
                  ? 'bg-white text-black shadow-xs font-black'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>24h Status Story</span>
            </button>
          </div>

          {activeShareTab === 'status' ? (
            /* Status Story Mode */
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.06] space-y-3">
                <div className="text-xs font-bold text-neutral-800">
                  Status Story Caption
                </div>
                <textarea
                  rows={4}
                  value={statusCaption}
                  onChange={(e) => setStatusCaption(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border border-black/[0.08] text-xs font-medium focus:outline-none focus:border-black resize-none"
                />
                <p className="text-[11px] text-neutral-400">
                  Visible to all your contacts for 24 hours with one-tap inquiry link.
                </p>
              </div>

              <button
                type="button"
                onClick={handleShareToStatus}
                className="w-full py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Post to Business Status Stories</span>
              </button>
            </div>
          ) : (
            /* Contacts / Groups Selector Mode */
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeShareTab === 'contacts' ? 'contacts' : 'channels'}...`}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 border border-black/[0.08] focus:bg-white text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {(activeShareTab === 'contacts' ? directRooms : groupRooms).map((room) => {
                  const isSelected = selectedRoomIds.includes(room.id);
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => toggleRoomSelect(room.id)}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all text-left ${
                        isSelected
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-neutral-50 border-black/[0.04] text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={room.avatar}
                          alt={room.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{room.name}</div>
                          <div className={`text-[11px] truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            {room.lastMessage || 'Active chat room'}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-white text-black border-white'
                            : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between gap-3">
                <span className="text-xs font-mono font-bold text-neutral-500">
                  {selectedRoomIds.length} selected
                </span>

                <button
                  type="button"
                  disabled={selectedRoomIds.length === 0}
                  onClick={handleShareToRooms}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-xs transition-all disabled:opacity-40 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Selected ({selectedRoomIds.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
