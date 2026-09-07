import React, { useState, useRef } from 'react';
import {
  Check,
  CheckCheck,
  Lock,
  Download,
  FileText,
  MapPin,
  ExternalLink,
  CreditCard,
  ShoppingBag,
  MoreVertical,
  Reply,
  Smile,
  Star,
  Pin,
  Edit2,
  Trash2,
  Globe,
  Clock,
  CheckCircle2,
  Plus,
  Info,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Message, InvoiceInfo } from '../types';
import { useChat } from '../context/ChatContext';
import { EmojibasePicker } from './EmojibasePicker';
import { AudioVoicePlayer } from './AudioVoicePlayer';
import { soundEngine } from '../utils/audioSynth';
import { PremiumEmoji } from './PremiumEmoji';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  onReply: (msg: Message) => void;
  onStartEdit: (msg: Message) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwn,
  onReply,
  onStartEdit,
}) => {
  const {
    users,
    currentUser,
    activeRoom,
    toggleReaction,
    toggleStar,
    togglePinMessage,
    deleteMessage,
    translateMessage,
    transcribeMessage,
    payInvoice,
    openUserProfile,
    retryMessage,
    openInvoiceCheckout,
    openCheckout,
  } = useChat();

  const [showActions, setShowActions] = useState(false);
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showReactionTray, setShowReactionTray] = useState(false);
  const [showReceiptDetails, setShowReceiptDetails] = useState(false);
  const [hoveredReactionEmoji, setHoveredReactionEmoji] = useState<string | null>(null);

  const longPressTimerRef = useRef<any>(null);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleTranslate = async (lang: string) => {
    setIsTranslating(true);
    setShowTranslateMenu(false);
    await translateMessage(message.id, lang);
    setIsTranslating(false);
  };

  const handleTranscribe = async () => {
    setIsTranscribing(true);
    await transcribeMessage(message.id);
    setIsTranscribing(false);
  };

  // Quick reactions array
  const quickReactions = ['❤️', '👍', '🔥', '😂', '🚀', '💡', '🎉', '🙏'];

  // Long-press detection for touch & desktop click-and-hold
  const startLongPress = () => {
    longPressTimerRef.current = setTimeout(() => {
      setShowReactionTray(true);
      soundEngine.playReactionPop();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }
    }, 420);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleSelectReaction = (emoji: string) => {
    soundEngine.playReactionPop();
    toggleReaction(message.id, emoji);
    setShowReactionTray(false);
    setShowReactionPicker(false);
  };

  // Format who reacted for tooltip
  const getReactionUserNames = (userIds: string[] = []) => {
    if (!userIds || userIds.length === 0) return 'No reactions yet';
    return userIds
      .map((uid) => {
        if (uid === currentUser.id) return 'You';
        const u = users.find((usr) => usr.id === uid);
        return u ? u.name : uid;
      })
      .join(', ');
  };

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowTranslateMenu(false);
        setShowReceiptDetails(false);
      }}
      className={`group relative flex flex-col mb-3.5 ${
        isOwn ? 'items-end' : 'items-start'
      }`}
    >
      {/* Sender name for group chats if not own */}
      {!isOwn && (
        <button
          type="button"
          onClick={() => {
            const sender =
              users.find((u) => u.id === message.senderId) ||
              users.find((u) => u.name === message.senderName);
            if (sender) openUserProfile(sender);
          }}
          className="text-[11px] font-bold text-neutral-800 mb-1 ml-1 flex items-center gap-1 hover:underline cursor-pointer text-left"
          title="View profile"
        >
          {message.senderName}
        </button>
      )}

      <div className="relative max-w-[90%] md:max-w-[72%]">
        {/* Floating Quick Action Bar on Hover (Desktop) */}
        {showActions && !showReactionTray && (
          <div
            className={`absolute -top-9 z-20 flex items-center gap-1 bg-white/95 border border-black/[0.08] rounded-full px-2 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md animate-fade-in ${
              isOwn ? 'right-0' : 'left-0'
            }`}
          >
            {/* Quick emoji reacts */}
            {quickReactions.slice(0, 5).map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelectReaction(emoji)}
                className="hover:scale-130 transition-transform text-xs p-1 active:scale-95"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}

            {/* Reaction Picker Button */}
            <button
              type="button"
              onClick={() => setShowReactionTray(true)}
              className="p-1 text-neutral-500 hover:text-black transition-colors"
              title="Add reaction"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onReply(message)}
              className="p-1 text-neutral-500 hover:text-black transition-colors"
              title="Reply"
            >
              <Reply className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => toggleStar(message.id)}
              className={`p-1 transition-colors ${
                message.isStarred
                  ? 'text-amber-500'
                  : 'text-neutral-500 hover:text-amber-500'
              }`}
              title={message.isStarred ? 'Unstar' : 'Star message'}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  message.isStarred ? 'fill-current' : ''
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => togglePinMessage(message.id)}
              className={`p-1 transition-colors ${
                message.isPinned
                  ? 'text-black'
                  : 'text-neutral-500 hover:text-black'
              }`}
              title={message.isPinned ? 'Unpin' : 'Pin message'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTranslateMenu(!showTranslateMenu)}
                className="p-1 text-neutral-500 hover:text-black transition-colors"
                title="Translate"
              >
                <Globe className="w-3.5 h-3.5" />
              </button>

              {showTranslateMenu && (
                <div
                  className={`absolute bottom-8 z-30 w-32 bg-white border border-black/[0.08] rounded-2xl shadow-2xl p-1.5 text-xs text-neutral-800 ${
                    isOwn ? 'right-0' : 'left-0'
                  }`}
                >
                  <div className="text-[10px] font-semibold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                    Translate to
                  </div>
                  {['English', 'Swahili', 'Yoruba', 'French', 'Arabic', 'Spanish'].map(
                    (lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleTranslate(lang)}
                        className="w-full text-left px-2 py-1 rounded-xl hover:bg-black/[0.05] hover:text-black flex items-center justify-between"
                      >
                        <span>{lang}</span>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {isOwn && (
              <>
                <button
                  type="button"
                  onClick={() => onStartEdit(message)}
                  className="p-1 text-neutral-500 hover:text-black transition-colors"
                  title="Edit message"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteMessage(message.id)}
                  className="p-1 text-neutral-500 hover:text-rose-500 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Long-Press & Full Reaction Tray Popup Overlay */}
        {showReactionTray && (
          <div
            className={`absolute -top-12 z-40 flex items-center gap-1.5 bg-white/95 border border-black/[0.08] rounded-2xl p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-md animate-in zoom-in-95 duration-150 ${
              isOwn ? 'right-0' : 'left-0'
            }`}
          >
            {quickReactions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelectReaction(emoji)}
                className="hover:scale-135 active:scale-95 transition-transform p-1 flex items-center justify-center"
                title={`React ${emoji}`}
              >
                <PremiumEmoji emoji={emoji} className="w-5 h-5" />
              </button>
            ))}

            {/* Custom Emoji Picker Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className="w-7 h-7 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-neutral-800 flex items-center justify-center transition-colors shadow-sm"
                title="More Emojis"
              >
                <Plus className="w-4 h-4" />
              </button>

              {showReactionPicker && (
                <div className="absolute bottom-10 right-0 z-50">
                  <EmojibasePicker
                    compact
                    onSelectEmoji={(emoji) => handleSelectReaction(emoji)}
                    onClose={() => {
                      setShowReactionPicker(false);
                      setShowReactionTray(false);
                    }}
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowReactionTray(false)}
              className="text-neutral-400 hover:text-black text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* The Message Bubble with Long-Press Handlers */}
        <div
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
          onTouchMove={cancelLongPress}
          onMouseDown={startLongPress}
          onMouseUp={cancelLongPress}
          onMouseLeave={cancelLongPress}
          className={`relative rounded-2xl px-3.5 py-2.5 select-text transition-all ${
            isOwn
              ? 'bg-black text-white rounded-tr-sm shadow-[0_4px_16px_rgba(0,0,0,0.12)]'
              : 'bg-white text-neutral-900 border border-black/[0.06] rounded-tl-sm shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
          }`}
        >
          {/* Quoted message if replied */}
          {message.replyTo && (
            <div
              className={`mb-2 p-2 rounded-xl text-xs border-l-2 ${
                isOwn
                  ? 'bg-white/10 border-white/80 text-white/90'
                  : 'bg-black/[0.04] border-black/60 text-neutral-700'
              }`}
            >
              <div className={`font-bold text-[11px] ${isOwn ? 'text-white' : 'text-neutral-900'}`}>
                {message.replyTo.senderName}
              </div>
              <div className="truncate opacity-90">{message.replyTo.text}</div>
            </div>
          )}

          {/* 1. Image Media */}
          {message.type === 'image' && message.mediaUrl && (
            <div className="my-1 rounded-xl overflow-hidden max-w-sm border border-black/10">
              <img
                src={message.mediaUrl}
                alt="Shared attachment"
                className="w-full h-auto max-h-72 object-cover"
                referrerPolicy="no-referrer"
              />
              {message.text && (
                <p className="p-2 text-xs md:text-sm font-medium">
                  {message.text}
                </p>
              )}
            </div>
          )}

          {/* 1b. Document / File Media */}
          {message.type === 'file' && (
            <div className="my-1 max-w-sm">
              <div
                className={`p-3 rounded-2xl shadow-sm border flex items-center justify-between gap-3 ${
                  isOwn
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-black/[0.03] border-black/[0.08] text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isOwn
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-500/10 text-emerald-600'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs truncate">
                      {message.mediaInfo?.fileName || 'Document'}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 font-mono ${
                        isOwn ? 'text-white/70' : 'text-neutral-500'
                      }`}
                    >
                      {message.mediaInfo?.fileSize || 'File attachment'}
                    </div>
                  </div>
                </div>
                {message.mediaUrl && message.mediaUrl !== '#' && (
                  <a
                    href={message.mediaUrl}
                    download={message.mediaInfo?.fileName || 'download'}
                    className={`p-2 rounded-xl transition-colors shrink-0 ${
                      isOwn
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : 'bg-black/[0.06] hover:bg-black/10 text-neutral-800'
                    }`}
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
              {message.text && message.text !== message.mediaInfo?.fileName && (
                <p className="p-1.5 text-xs md:text-sm font-medium">
                  {message.text}
                </p>
              )}
            </div>
          )}

          {/* 2. Voice Note / Audio Player (Custom Audio Player UI) */}
          {message.type === 'audio' && (
            <AudioVoicePlayer
              message={message}
              isOwn={isOwn}
              onTranscribe={handleTranscribe}
              isTranscribing={isTranscribing}
            />
          )}

          {/* 3. Invoice & Payment Card */}
          {message.type === 'invoice' && message.invoiceInfo && (
            <div
              className={`my-1 p-3.5 rounded-2xl w-72 md:w-80 shadow-md border ${
                isOwn
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-black/[0.02] border-black/[0.08] text-neutral-900'
              }`}
            >
              <div className={`flex items-center justify-between pb-2 border-b ${isOwn ? 'border-white/15' : 'border-black/[0.06]'}`}>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <CreditCard className="w-4 h-4" />
                  <span>Invoice {message.invoiceInfo.invoiceId}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    message.invoiceInfo.status === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-600 border border-amber-500/30'
                  }`}
                >
                  {message.invoiceInfo.status}
                </span>
              </div>

              <div className="py-2.5">
                <div className="text-2xl font-black">
                  ${message.invoiceInfo.amount}{' '}
                  <span className={`text-xs font-normal ${isOwn ? 'text-white/70' : 'text-neutral-500'}`}>
                    {message.invoiceInfo.currency}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isOwn ? 'text-white/80' : 'text-neutral-600'}`}>
                  {message.invoiceInfo.description}
                </p>
              </div>

              {message.invoiceInfo.status === 'unpaid' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (message.invoiceInfo) {
                      openInvoiceCheckout(message.invoiceInfo);
                    }
                  }}
                  className={`w-full mt-1 py-2 px-3 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95 ${
                    isOwn
                      ? 'bg-white text-black hover:bg-neutral-100'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pay Invoice (WAT Checkout)</span>
                </button>
              ) : (
                <div className="mt-1 py-1 px-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Paid via {message.invoiceInfo.paymentMethod || 'WAT Checkout'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 4. Product Showcase Card */}
          {(message.type === 'product' || message.type === 'product_card') && message.productInfo && (
            <div
              className={`my-1 rounded-2xl overflow-hidden w-64 md:w-72 shadow-md border ${
                isOwn
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-black/[0.02] border-black/[0.08] text-neutral-900'
              }`}
            >
              <img
                src={message.productInfo.image}
                alt={message.productInfo.name}
                className="w-full h-36 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-3">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="truncate">{message.productInfo.name}</span>
                  <span className={`shrink-0 ml-1 font-extrabold ${isOwn ? 'text-white' : 'text-neutral-900'}`}>
                    {message.productInfo.isFree
                      ? 'FREE'
                      : `${message.productInfo.currency || '$'} ${message.productInfo.price}`}
                  </span>
                </div>
                <p className={`text-[11px] line-clamp-2 mb-2 ${isOwn ? 'text-white/70' : 'text-neutral-500'}`}>
                  {message.productInfo.description}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (message.productInfo) {
                        openCheckout([
                          {
                            id: `item_${message.productInfo.id || message.id}`,
                            productId: message.productInfo.id || message.id,
                            name: message.productInfo.name,
                            description: message.productInfo.description,
                            price: message.productInfo.price || 0,
                            currency: message.productInfo.currency || 'ZAR',
                            quantity: 1,
                            image: message.productInfo.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
                            category: 'goods',
                            sellerName: 'WAT Verified Merchant',
                          },
                        ]);
                      }
                    }}
                    className="flex-1 py-1.5 rounded-xl text-[11px] font-bold text-center transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Buy (WAT Checkout)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReply(message)}
                    className={`py-1.5 px-2.5 rounded-xl text-[11px] font-semibold text-center transition-colors ${
                      isOwn
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : 'bg-black/[0.05] hover:bg-black/[0.1] text-neutral-900'
                    }`}
                  >
                    Inquire
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Location Card */}
          {message.type === 'location' && message.locationInfo && (
            <div
              className={`my-1 p-3 rounded-2xl w-64 md:w-72 shadow-sm border ${
                isOwn
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-black/[0.02] border-black/[0.08] text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <MapPin className="w-4 h-4" />
                <span>{message.locationInfo.name}</span>
              </div>
              <p className={`text-[11px] mb-2 ${isOwn ? 'text-white/80' : 'text-neutral-600'}`}>
                {message.locationInfo.address}
              </p>
              <div className={`w-full h-24 rounded-xl flex items-center justify-center text-xs font-mono border ${
                isOwn ? 'bg-white/10 border-white/20 text-white/70' : 'bg-black/[0.04] border-black/[0.06] text-neutral-500'
              }`}>
                GPS: {message.locationInfo.latitude.toFixed(4)},{' '}
                {message.locationInfo.longitude.toFixed(4)}
              </div>
            </div>
          )}

          {/* Primary Text Content */}
          {message.text &&
            message.type !== 'invoice' &&
            message.type !== 'location' &&
            message.type !== 'audio' &&
            message.type !== 'file' && (
              <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words select-text">
                {message.text}
              </p>
            )}

          {/* AI Translated Text Box if present */}
          {message.translatedText && (
            <div className={`mt-2 pt-2 border-t text-xs ${isOwn ? 'border-white/20' : 'border-black/[0.06]'}`}>
              <div className={`flex items-center gap-1 text-[10px] font-semibold mb-1 ${isOwn ? 'text-white/80' : 'text-neutral-500'}`}>
                <Globe className="w-3 h-3" />
                <span>
                  Translated into {message.translatedLang || 'Language'}:
                </span>
              </div>
              <p className={`italic leading-relaxed p-2 rounded-xl ${isOwn ? 'bg-white/10 text-white' : 'bg-black/[0.04] text-neutral-800'}`}>
                {message.translatedText}
              </p>
            </div>
          )}

          {/* Metadata Footer: Timestamp, Edited badge, Star, Disappearing, Read status */}
          <div
            className={`flex items-center gap-1.5 mt-1 text-[10px] select-none ${
              isOwn
                ? 'text-white/70 justify-end'
                : 'text-neutral-400 justify-start'
            }`}
          >
            {message.isEdited && (
              <span className="italic text-[9px] font-mono opacity-80">
                (edited)
              </span>
            )}
            {message.isStarred && (
              <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
            )}
            {message.isPinned && (
              <Pin className="w-2.5 h-2.5 rotate-45 opacity-80" />
            )}
            {message.expiresAt && (
              <Clock
                className="w-2.5 h-2.5"
                title="Disappearing message"
              />
            )}
            <span className="font-mono">{formatTime(message.timestamp)}</span>
            {message.isEncrypted && (
              <Lock
                className="w-2.5 h-2.5 opacity-80"
                title="Megolm Encrypted"
              />
            )}

            {/* Visual Read Receipt Markers for Outgoing Messages */}
            {isOwn && (
              <div className="relative inline-flex items-center ml-0.5">
                {message.status === 'failed' ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      retryMessage(message.id);
                    }}
                    className="flex items-center gap-1 text-red-200 hover:text-white bg-red-900/60 hover:bg-red-800/80 px-1.5 py-0.5 rounded text-[10px] font-medium transition-all"
                    title="Queued in Outbox (Offline). Click to retry"
                  >
                    <AlertCircle className="w-3 h-3 text-red-300" />
                    <span>Retry</span>
                    <RefreshCw className="w-2.5 h-2.5 ml-0.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowReceiptDetails(!showReceiptDetails)}
                    className="hover:opacity-80 transition-opacity focus:outline-none"
                    title={
                      message.status === 'read'
                        ? 'Read by recipient (Matrix m.receipt)'
                        : message.status === 'delivered'
                        ? 'Delivered to recipient device'
                        : message.status === 'sent'
                        ? 'Sent to Synapse homeserver'
                        : 'Sending message...'
                    }
                  >
                    {message.status === 'read' ? (
                      <span className="flex items-center text-white font-bold">
                        <CheckCheck className="w-3.5 h-3.5 inline" />
                      </span>
                    ) : message.status === 'delivered' ? (
                      <span className="flex items-center text-white/70">
                        <CheckCheck className="w-3.5 h-3.5 inline" />
                      </span>
                    ) : message.status === 'sent' ? (
                      <span className="flex items-center text-white/50">
                        <Check className="w-3.5 h-3.5 inline" />
                      </span>
                    ) : (
                      <span className="flex items-center text-amber-300 animate-pulse">
                        <Clock className="w-3 h-3 inline" />
                      </span>
                    )}
                  </button>
                )}

                {/* Interactive Read Receipt Details Popover */}
                {showReceiptDetails && (
                  <div className="absolute bottom-6 right-0 z-40 w-52 p-2.5 bg-white border border-black/[0.08] rounded-2xl shadow-2xl backdrop-blur text-left text-neutral-800 text-[11px] animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between font-bold text-neutral-900 pb-1.5 mb-1.5 border-b border-black/[0.06]">
                      <div className="flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>Matrix Read Receipt</span>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-black/[0.05] text-neutral-700 rounded-md">
                        m.receipt
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Status:</span>
                        <span className="font-bold text-neutral-900 capitalize">
                          {message.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Sent:</span>
                        <span className="font-mono text-[10px]">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      {message.status === 'read' && (
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Read by:</span>
                          <span className="text-neutral-900 font-medium">
                            {activeRoom?.name || 'Recipient'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reaction Chips Underneath the Bubble */}
        <div
          className={`flex flex-wrap items-center gap-1.5 mt-1 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}
        >
          {Object.values(message.reactions || {}).map((reaction: any) => {
            const hasReacted = reaction?.userIds?.includes(currentUser.id);
            const userNames = getReactionUserNames(reaction.userIds);

            return (
              <div key={reaction.emoji} className="relative group/react">
                <button
                  type="button"
                  onClick={() => handleSelectReaction(reaction.emoji)}
                  onMouseEnter={() => setHoveredReactionEmoji(reaction.emoji)}
                  onMouseLeave={() => setHoveredReactionEmoji(null)}
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs transition-all shadow-sm active:scale-90 ${
                    hasReacted
                      ? 'bg-black text-white font-bold shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
                      : 'bg-white border border-black/[0.08] text-neutral-800 hover:bg-black/[0.04]'
                  }`}
                  title={userNames}
                >
                  <PremiumEmoji emoji={reaction.emoji} className="w-4 h-4 inline-block" />
                  <span className="text-[11px] font-mono font-bold">{reaction.count}</span>
                </button>

                {/* Tooltip on hover showing names of who reacted */}
                {hoveredReactionEmoji === reaction.emoji && (
                  <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 z-30 bg-white border border-black/[0.08] text-neutral-800 text-[10px] px-2 py-1 rounded-xl shadow-xl whitespace-nowrap pointer-events-none">
                    {userNames}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Plus Reaction Button when message already has reactions */}
          {Object.keys(message.reactions || {}).length > 0 && (
            <button
              type="button"
              onClick={() => setShowReactionTray(true)}
              className="w-6 h-6 rounded-full bg-white hover:bg-black/[0.04] border border-black/[0.08] text-neutral-500 hover:text-black flex items-center justify-center text-xs transition-colors shadow-sm"
              title="Add another reaction"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
