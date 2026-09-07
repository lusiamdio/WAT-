import React, { useState, useRef, useEffect } from 'react';
import {
  Archive,
  ArchiveRestore,
  Pin,
  PinOff,
  VolumeX,
  Volume2,
  Lock,
  Check,
  CheckCheck,
  Mic,
  Image as ImageIcon,
  FileText,
  MapPin,
  CreditCard,
  ShoppingBag,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import { Room, User } from '../types';
import { useChat } from '../context/ChatContext';

interface SwipeableChatItemProps {
  room: Room;
  isActive: boolean;
  isArchivedView?: boolean;
  currentUser: User;
  peer: User | null | undefined;
  onSelect: (roomId: string) => void;
  onToggleArchive: (roomId: string) => void;
  onTogglePin: (roomId: string) => void;
  onToggleMute: (roomId: string) => void;
  formatTimestamp: (timestamp?: number) => string;
}

export const SwipeableChatItem: React.FC<SwipeableChatItemProps> = ({
  room,
  isActive,
  isArchivedView = false,
  currentUser,
  peer,
  onSelect,
  onToggleArchive,
  onTogglePin,
  onToggleMute,
  formatTimestamp,
}) => {
  const { openUserProfile } = useChat();
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasCrossedThreshold, setHasCrossedThreshold] = useState(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const currentOffsetRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 90; // Pixels needed to trigger auto-action on release
  const MAX_LEFT_SWIPE = -170; // Max reveal distance on left swipe
  const MAX_RIGHT_SWIPE = 110; // Max reveal distance on right swipe

  // Update currentOffsetRef
  useEffect(() => {
    currentOffsetRef.current = offsetX;
  }, [offsetX]);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    isHorizontalSwipeRef.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startXRef.current;
    const deltaY = currentY - startYRef.current;

    // Detect if the user is scrolling vertically or swiping horizontally
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 6) {
        isHorizontalSwipeRef.current = false;
        return;
      } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 6) {
        isHorizontalSwipeRef.current = true;
      }
    }

    if (isHorizontalSwipeRef.current === false) {
      return;
    }

    // Apply damping if dragging past limits
    let newOffset = deltaX;
    if (deltaX < MAX_LEFT_SWIPE) {
      newOffset = MAX_LEFT_SWIPE + (deltaX - MAX_LEFT_SWIPE) * 0.25;
    } else if (deltaX > MAX_RIGHT_SWIPE) {
      newOffset = MAX_RIGHT_SWIPE + (deltaX - MAX_RIGHT_SWIPE) * 0.25;
    }

    setOffsetX(newOffset);

    // Haptic pulse when crossing archive threshold
    const crossed = Math.abs(newOffset) >= SWIPE_THRESHOLD;
    if (crossed !== hasCrossedThreshold) {
      setHasCrossedThreshold(crossed);
      if (crossed && typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(12);
        } catch {
          // ignore
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const finalOffset = currentOffsetRef.current;

    if (finalOffset <= -SWIPE_THRESHOLD) {
      // Swiped left past threshold -> Trigger Archive / Unarchive
      onToggleArchive(room.id);
      setOffsetX(0);
    } else if (finalOffset >= SWIPE_THRESHOLD) {
      // Swiped right past threshold -> Trigger Pin / Unpin
      onTogglePin(room.id);
      setOffsetX(0);
    } else if (finalOffset < -40) {
      // Snap to revealed action drawer
      setOffsetX(MAX_LEFT_SWIPE);
    } else if (finalOffset > 40) {
      // Snap to right reveal
      setOffsetX(MAX_RIGHT_SWIPE);
    } else {
      // Snap back to closed
      setOffsetX(0);
    }
    setHasCrossedThreshold(false);
    isHorizontalSwipeRef.current = null;
  };

  const handleItemClick = (e: React.MouseEvent) => {
    // If the drawer was open and user taps, close it instead of selecting room
    if (Math.abs(offsetX) > 10) {
      e.stopPropagation();
      setOffsetX(0);
      return;
    }
    onSelect(room.id);
  };

  const isOnline = peer ? peer.isOnline : false;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden group select-none transition-colors"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Background Left Action Area (Revealed on Right Swipe) */}
      <div
        className={`absolute inset-y-0 left-0 flex items-center px-4 transition-colors z-0 ${
          offsetX > SWIPE_THRESHOLD ? 'bg-indigo-600' : 'bg-indigo-700/80'
        }`}
        style={{ width: `${Math.max(0, offsetX + 10)}px` }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(room.id);
            setOffsetX(0);
          }}
          className="flex flex-col items-center justify-center text-white text-[10px] font-bold gap-0.5 whitespace-nowrap min-w-[50px]"
        >
          {room.isPinned ? <PinOff className="w-5 h-5" /> : <Pin className="w-5 h-5 rotate-45" />}
          <span>{room.isPinned ? 'Unpin' : 'Pin'}</span>
        </button>
      </div>

      {/* Background Right Action Area (Revealed on Left Swipe) */}
      <div
        className={`absolute inset-y-0 right-0 flex items-center justify-end transition-colors z-0 ${
          offsetX <= -SWIPE_THRESHOLD ? 'bg-emerald-600' : 'bg-neutral-800'
        }`}
        style={{ width: `${Math.max(0, -offsetX + 10)}px` }}
      >
        <div className="flex items-center h-full">
          {/* Mute action */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute(room.id);
              setOffsetX(0);
            }}
            className="w-14 h-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors"
            title={room.isMuted ? 'Unmute chat' : 'Mute chat'}
          >
            {room.isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{room.isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* Archive / Unarchive action */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleArchive(room.id);
              setOffsetX(0);
            }}
            className={`w-16 h-full text-white flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors ${
              offsetX <= -SWIPE_THRESHOLD ? 'bg-black' : 'bg-neutral-800 hover:bg-neutral-900'
            }`}
            title={isArchivedView ? 'Unarchive chat' : 'Archive chat'}
          >
            {isArchivedView ? (
              <ArchiveRestore className="w-5 h-5" />
            ) : (
              <Archive className="w-5 h-5" />
            )}
            <span>{isArchivedView ? 'Unarchive' : 'Archive'}</span>
          </button>
        </div>
      </div>

      {/* Foreground Swipeable Content Card */}
      <div
        onClick={handleItemClick}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)',
        }}
        className={`relative z-10 flex items-center gap-3 p-3.5 cursor-pointer bg-white transition-all ${
          isActive
            ? 'bg-black/[0.04] border-l-4 border-black'
            : 'hover:bg-neutral-50/90 active:bg-neutral-100/70'
        }`}
      >
        {/* Avatar with status badge & business ring */}
        <div
          onClick={(e) => {
            if (peer) {
              e.stopPropagation();
              openUserProfile(peer);
            }
          }}
          className={`relative shrink-0 ${peer ? 'hover:opacity-90 active:scale-95 transition-all' : ''}`}
          title={peer ? `View ${peer.name}'s Profile` : undefined}
        >
          <img
            src={room.avatar}
            alt={room.name}
            className="w-12 h-12 rounded-2xl object-cover ring-1 ring-black/10 shadow-sm"
          />
          {room.type === 'direct' && (
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${
                isOnline ? 'bg-emerald-500' : 'bg-neutral-300'
              }`}
            />
          )}
        </div>

        {/* Info & Last Message */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-sm font-semibold text-neutral-900 truncate">
                {room.name}
              </h3>
              {room.isEncrypted && (
                <Lock className="w-3 h-3 text-emerald-600 shrink-0" title="E2EE Encrypted" />
              )}
              {room.businessInfo && (
                <span className="px-1.5 py-0.2 bg-black text-white rounded text-[9px] font-mono font-bold shrink-0">
                  BIZ
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
              {formatTimestamp(room.lastMessage?.timestamp || room.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500">
            {/* Last message preview */}
            <div className="flex items-center gap-1 min-w-0 pr-2 truncate">
              {room.lastMessage?.senderId === currentUser.id && (
                <span className="text-neutral-400 shrink-0">
                  {room.lastMessage.status === 'read' ? (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                  ) : room.lastMessage.status === 'delivered' ? (
                    <CheckCheck className="w-3.5 h-3.5 text-neutral-400 inline" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-neutral-300 inline" />
                  )}
                </span>
              )}

              {/* Icon for media type */}
              {room.lastMessage?.type === 'audio' && (
                <Mic className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              )}
              {room.lastMessage?.type === 'image' && (
                <ImageIcon className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              )}
              {room.lastMessage?.type === 'file' && (
                <FileText className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              )}
              {room.lastMessage?.type === 'location' && (
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              {room.lastMessage?.type === 'invoice' && (
                <CreditCard className="w-3.5 h-3.5 text-black shrink-0" />
              )}
              {room.lastMessage?.type === 'product_card' && (
                <ShoppingBag className="w-3.5 h-3.5 text-black shrink-0" />
              )}

              <span className="truncate text-neutral-600 font-normal">
                {room.lastMessage
                  ? room.lastMessage.text || 'Media attachment'
                  : room.topic || 'No messages yet'}
              </span>
            </div>

            {/* Right badges & Desktop Quick Action buttons on hover */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Desktop quick action buttons shown on hover */}
              <div className="hidden sm:group-hover:flex items-center gap-1 bg-white py-0.5 px-1 rounded-lg border border-black/[0.08] shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleArchive(room.id);
                  }}
                  className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded transition-colors"
                  title={isArchivedView ? 'Unarchive chat' : 'Archive chat'}
                >
                  {isArchivedView ? (
                    <ArchiveRestore className="w-3.5 h-3.5" />
                  ) : (
                    <Archive className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(room.id);
                  }}
                  className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded transition-colors"
                  title={room.isPinned ? 'Unpin' : 'Pin'}
                >
                  {room.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5 rotate-45" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMute(room.id);
                  }}
                  className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded transition-colors"
                  title={room.isMuted ? 'Unmute' : 'Mute'}
                >
                  {room.isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Badges when not hovering */}
              <div className="flex items-center gap-1.5 sm:group-hover:hidden">
                {room.isMuted && <VolumeX className="w-3 h-3 text-neutral-400" />}
                {room.disappearingTimer > 0 && (
                  <Clock className="w-3 h-3 text-amber-500" title="Disappearing timer active" />
                )}
                {room.isPinned && <Pin className="w-3 h-3 text-black rotate-45" />}
                {room.unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-black text-white font-bold text-[10px] rounded-full min-w-[18px] text-center shadow-sm">
                    {room.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
