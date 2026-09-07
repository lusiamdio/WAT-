import React, { useState, useMemo } from 'react';
import {
  X,
  Send,
  Users,
  MessageCircle,
  Radio,
  CheckCircle2,
  Sparkles,
  Search,
  Share2,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { ProductInfo, Room } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

interface ShareProductModalProps {
  product: ProductInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareProductModal: React.FC<ShareProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const {
    rooms,
    users,
    currentUser,
    shareProductToRooms,
    shareProductToStatus,
    setActiveTab,
    setActiveRoomId,
  } = useChat();

  const [activeTab, setActiveShareTab] = useState<'contacts' | 'groups' | 'status'>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusCaption, setStatusCaption] = useState('');
  const [sharedToast, setSharedToast] = useState<string | null>(null);

  // Initialize caption when product changes
  React.useEffect(() => {
    if (product) {
      const priceDisplay = product.isFree
        ? 'FREE'
        : `${product.currency} ${product.price}`;
      setStatusCaption(
        `🛍️ Now in Stock: ${product.name} (${priceDisplay})\n${product.description}`
      );
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const priceTag = product.isFree
    ? 'FREE'
    : `${product.currency} ${product.price}`;

  // Direct contacts rooms
  const contactRooms = rooms.filter((r) => r.type === 'direct');
  // Group rooms
  const groupRooms = rooms.filter((r) => r.type === 'group' || r.type === 'channel' || r.type === 'community');

  const filteredContacts = contactRooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groupRooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShareToSingleRoom = (room: Room) => {
    shareProductToRooms(product, [room.id]);
    soundEngine.playMessageSent();
    setSharedToast(`Shared "${product.name}" with ${room.name}!`);

    setTimeout(() => {
      setSharedToast(null);
      onClose();
      setActiveRoomId(room.id);
      setActiveTab('chats');
    }, 1000);
  };

  const handleShareToStatus = () => {
    shareProductToStatus(product);
    soundEngine.playChime();
    setSharedToast(`Product successfully posted to your Status!`);

    setTimeout(() => {
      setSharedToast(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in text-neutral-900">
      <div
        id="share-product-modal"
        className="bg-white rounded-3xl border border-black/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.16)] w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]"
      >
        {/* Header */}
        <header className="p-4 sm:p-5 border-b border-black/[0.06] bg-white/90 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900">
                Share Catalogue Product
              </h2>
              <p className="text-xs text-neutral-500">
                Broadcast to direct contacts, group networks, or your 24h Status story.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-neutral-400 hover:text-black hover:bg-black/[0.04] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Product Snapshot Bar */}
        <div className="p-3.5 mx-4 mt-4 rounded-2xl bg-black/[0.03] border border-black/[0.06] flex items-center gap-3 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-xl object-cover border border-black/10 shadow-xs shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-neutral-900 truncate">{product.name}</h4>
              <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-mono font-bold shrink-0">
                {priceTag}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 truncate mt-0.5">{product.category}</p>
          </div>
        </div>

        {/* Share Channel Tabs */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-1 border-b border-black/[0.06] shrink-0">
          <button
            type="button"
            onClick={() => setActiveShareTab('contacts')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'contacts'
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-black/[0.04]'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Contacts ({contactRooms.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveShareTab('groups')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'groups'
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-black/[0.04]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Groups ({groupRooms.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveShareTab('status')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'status'
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-black/[0.04]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Status (Story)</span>
          </button>
        </div>

        {/* Feedback Toast */}
        {sharedToast && (
          <div className="m-3 p-2.5 rounded-2xl bg-black text-white text-xs font-bold flex items-center justify-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{sharedToast}</span>
          </div>
        )}

        {/* Tab 1: Contacts */}
        {activeTab === 'contacts' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search direct contacts..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-black/[0.03] border border-black/[0.08] text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              {filteredContacts.map((room) => (
                <div
                  key={room.id}
                  className="p-2.5 rounded-2xl border border-black/[0.06] hover:border-black/20 bg-white hover:bg-black/[0.02] flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={room.avatar}
                      alt={room.name}
                      className="w-9 h-9 rounded-xl object-cover border border-black/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">{room.name}</h4>
                      <p className="text-[10px] text-neutral-500 truncate">{room.topic || 'Direct conversation'}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleShareToSingleRoom(room)}
                    className="px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95 transition-all"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Groups & Channels */}
        {activeTab === 'groups' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search group networks..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-black/[0.03] border border-black/[0.08] text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              {filteredGroups.map((room) => (
                <div
                  key={room.id}
                  className="p-2.5 rounded-2xl border border-black/[0.06] hover:border-black/20 bg-white hover:bg-black/[0.02] flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={room.avatar}
                      alt={room.name}
                      className="w-9 h-9 rounded-xl object-cover border border-black/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">{room.name}</h4>
                        <span className="px-1.5 py-0.2 rounded bg-black/[0.05] text-[9px] font-mono uppercase text-neutral-600">
                          {room.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500 truncate">{room.memberIds.length} members</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleShareToSingleRoom(room)}
                    className="px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95 transition-all"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Status / Story */}
        {activeTab === 'status' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Status Story Visual Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-neutral-900 h-56 flex flex-col justify-end p-4 border border-black/10 shadow-md">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-mono font-black uppercase shadow-xs">
                    {priceTag}
                  </span>
                  <span className="text-[11px] font-bold text-white/90 drop-shadow-sm">
                    {product.name}
                  </span>
                </div>
                <p className="text-xs text-white/95 line-clamp-2 leading-relaxed drop-shadow-sm">
                  {statusCaption}
                </p>
              </div>
            </div>

            {/* Editable Caption */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">Status Story Caption</label>
              <textarea
                rows={3}
                value={statusCaption}
                onChange={(e) => setStatusCaption(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] border border-black/[0.08] text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white resize-none"
              />
            </div>

            <button
              type="button"
              onClick={handleShareToStatus}
              className="w-full py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Post to My WAT Status (24h)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
