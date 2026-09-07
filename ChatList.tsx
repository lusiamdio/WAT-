import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Settings,
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Undo2,
  CheckCircle2,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { Room } from '../types';
import { SwipeableChatItem } from './SwipeableChatItem';

export const ChatList: React.FC = () => {
  const {
    rooms,
    activeRoomId,
    setActiveRoomId,
    currentUser,
    users,
    stories,
    setIsNewChatModalOpen,
    setIsStoryViewerOpen,
    setSelectedStoryIndex,
    togglePinRoom,
    toggleMuteRoom,
    toggleArchiveRoom,
    archiveRoom,
    unarchiveRoom,
    setIsSettingsOpen,
    setIsUniversalSearchOpen,
    setIsCommandCenterOpen,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'groups' | 'business' | 'e2ee' | 'archived'>('all');
  const [isArchivedView, setIsArchivedView] = useState(false);
  const [undoToast, setUndoToast] = useState<{ message: string; roomId: string; wasArchived: boolean } | null>(null);

  // Count of archived and active rooms
  const archivedRoomsCount = useMemo(() => {
    return rooms.filter((r) => r.isArchived).length;
  }, [rooms]);

  const archivedUnreadCount = useMemo(() => {
    return rooms
      .filter((r) => r.isArchived)
      .reduce((acc, r) => acc + (r.unreadCount || 0), 0);
  }, [rooms]);

  const handleToggleArchiveWithToast = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    const willBeArchived = !room.isArchived;
    toggleArchiveRoom(roomId);

    setUndoToast({
      message: willBeArchived ? `Archived "${room.name}"` : `Unarchived "${room.name}"`,
      roomId,
      wasArchived: willBeArchived,
    });

    setTimeout(() => {
      setUndoToast((current) => (current?.roomId === roomId ? null : current));
    }, 4000);
  };

  const handleUndo = () => {
    if (!undoToast) return;
    if (undoToast.wasArchived) {
      unarchiveRoom(undoToast.roomId);
    } else {
      archiveRoom(undoToast.roomId);
    }
    setUndoToast(null);
  };

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        // Text search
        const matchesSearch =
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (room.topic && room.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (room.lastMessage && room.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        // In search mode, allow searching all rooms
        if (searchQuery.trim().length > 0) {
          return true;
        }

        // When in dedicated Archived view or filter
        if (isArchivedView || filterType === 'archived') {
          return room.isArchived;
        }

        // When in standard views: hide archived rooms
        if (room.isArchived) {
          return false;
        }

        // Filter type
        if (filterType === 'unread') return room.unreadCount > 0;
        if (filterType === 'groups') return room.type === 'group' || room.type === 'community';
        if (filterType === 'business') return room.businessInfo !== undefined || room.id.includes('business');
        if (filterType === 'e2ee') return room.isEncrypted;

        return true;
      })
      .sort((a, b) => {
        // Pinned rooms first, then by last message timestamp
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        const timeA = a.lastMessage?.timestamp || a.createdAt;
        const timeB = b.lastMessage?.timestamp || b.createdAt;
        return timeB - timeA;
      });
  }, [rooms, searchQuery, filterType, isArchivedView]);

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getPeerUser = (room: Room) => {
    if (room.type !== 'direct') return null;
    const peerId = room.memberIds.find((id) => id !== currentUser.id) || room.memberIds[0];
    return users.find((u) => u.id === peerId);
  };

  return (
    <div className={`w-full md:w-80 lg:w-96 bg-white/80 backdrop-blur-2xl border-r border-black/[0.06] flex-col h-full shrink-0 select-none pb-16 md:pb-0 relative overflow-hidden shadow-[2px_0_20px_rgba(0,0,0,0.02)] ${activeRoomId ? 'hidden md:flex' : 'flex'}`}>
      {/* Top Header */}
      <div className="p-3.5 pb-2.5 border-b border-black/[0.06]">
        {isArchivedView ? (
          /* Archived Sub-header */
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsArchivedView(false);
                  if (filterType === 'archived') setFilterType('all');
                }}
                className="p-1.5 -ml-1 text-neutral-500 hover:text-black hover:bg-black/[0.04] rounded-xl transition-colors"
                title="Back to chats"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold tracking-tight text-neutral-900 flex items-center gap-2">
                <span>Archived</span>
                <span className="px-2 py-0.5 rounded-full bg-black/[0.05] text-xs font-mono font-semibold text-neutral-700">
                  {archivedRoomsCount}
                </span>
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-black/[0.04] transition-colors"
              title="Settings & Preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Standard Main Chats Header */
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-neutral-900">
                Chats
              </h1>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Settings Action Button */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-black/[0.04] transition-all active:scale-95"
                title="Manage Settings & Preferences"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Start New Chat */}
              <button
                type="button"
                onClick={() => setIsNewChatModalOpen(true)}
                className="p-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold transition-transform active:scale-95 shadow-md shadow-black/20 flex items-center justify-center"
                title="Start New Chat or Room"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stories / Status Mini Rail (Hidden in Archived View) */}
        {!isArchivedView && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2.5 pt-0.5 no-scrollbar">
            {/* My status trigger */}
            <div
              onClick={() => {
                setSelectedStoryIndex(0);
                setIsStoryViewerOpen(true);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-2xl object-cover p-0.5 ring-2 ring-black/10 group-hover:ring-black transition-all"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white">
                  +
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 group-hover:text-black truncate w-14 text-center">
                Your status
              </span>
            </div>

            {/* Contact stories */}
            {stories.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => {
                  setSelectedStoryIndex(idx);
                  setIsStoryViewerOpen(true);
                }}
                className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
              >
                <div
                  className={`p-0.5 rounded-2xl ${
                    story.viewed
                      ? 'ring-2 ring-black/10'
                      : 'ring-2 ring-emerald-500'
                  }`}
                >
                  <img
                    src={story.userAvatar}
                    alt={story.userName}
                    className="w-11 h-11 rounded-2xl object-cover bg-neutral-100"
                  />
                </div>
                <span className="text-[11px] text-neutral-700 group-hover:text-black truncate w-14 text-center font-medium">
                  {story.userName ? story.userName.split(' ')[0] : 'User'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Search input */}
        <div className="relative mt-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArchivedView ? 'Search archived rooms...' : 'Search contacts & messages...'}
            className="w-full bg-black/[0.03] focus:bg-white border border-black/[0.06] focus:border-black/30 rounded-2xl pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all shadow-inner"
          />
        </div>

        {/* Filter chips */}
        {!isArchivedView && (
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
            {(['all', 'unread', 'groups', 'business', 'e2ee'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium capitalize whitespace-nowrap transition-all ${
                  filterType === type
                    ? 'bg-black text-white shadow-sm font-semibold'
                    : 'bg-black/[0.04] text-neutral-600 hover:text-black hover:bg-black/[0.08]'
                }`}
              >
                {type === 'e2ee' ? 'Encrypted' : type}
              </button>
            ))}

            {/* Archived Filter Chip */}
            {archivedRoomsCount > 0 && (
              <button
                type="button"
                onClick={() => setIsArchivedView(true)}
                className="px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors bg-black/[0.04] hover:bg-black/[0.08] text-neutral-700 flex items-center gap-1"
              >
                <Archive className="w-3 h-3" />
                <span>Archived ({archivedRoomsCount})</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Undo Toast Banner */}
      {undoToast && (
        <div className="bg-white border-b border-black/[0.06] px-4 py-2.5 flex items-center justify-between z-20 animate-fade-in text-xs shadow-md">
          <div className="flex items-center gap-2 text-neutral-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{undoToast.message}</span>
          </div>
          <button
            type="button"
            onClick={handleUndo}
            className="px-2.5 py-1 rounded-lg bg-black text-white hover:bg-neutral-800 font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* Archived Chats Folder Entry Row */}
      {!isArchivedView && archivedRoomsCount > 0 && !searchQuery && (
        <div
          onClick={() => setIsArchivedView(true)}
          className="flex items-center justify-between px-4 py-3 bg-black/[0.02] hover:bg-black/[0.05] border-b border-black/[0.06] cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-black/[0.06] text-neutral-800 flex items-center justify-center">
              <Archive className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-neutral-900 group-hover:text-black transition-colors">
              Archived Chats
            </div>
          </div>

          <div className="flex items-center gap-2">
            {archivedUnreadCount > 0 && (
              <span className="px-1.5 py-0.5 bg-black text-white font-bold text-[10px] rounded-full">
                {archivedUnreadCount}
              </span>
            )}
            <span className="text-xs font-mono font-bold text-neutral-600">
              {archivedRoomsCount}
            </span>
          </div>
        </div>
      )}

      {/* Gesture Hint for Mobile */}
      <div className="px-3 py-1 bg-black/[0.02] text-[10px] text-neutral-400 flex items-center justify-between border-b border-black/[0.04]">
        <span>👈 Swipe left to archive</span>
        <span>Swipe right to pin 👉</span>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredRooms.length === 0 ? (
          <div className="p-8 text-center text-neutral-400 text-xs flex flex-col items-center gap-2">
            <Archive className="w-8 h-8 text-neutral-300 mb-1" />
            <span>
              {isArchivedView
                ? 'No archived chats'
                : searchQuery
                ? `No rooms found matching "${searchQuery}"`
                : 'No conversations in this filter'}
            </span>
            {isArchivedView && (
              <button
                type="button"
                onClick={() => setIsArchivedView(false)}
                className="mt-2 px-3 py-1.5 rounded-xl bg-black text-white text-xs font-medium"
              >
                Return to Active Chats
              </button>
            )}
          </div>
        ) : (
          filteredRooms.map((room) => {
            const isActive = room.id === activeRoomId;
            const peer = getPeerUser(room);

            return (
              <SwipeableChatItem
                key={room.id}
                room={room}
                isActive={isActive}
                isArchivedView={isArchivedView}
                currentUser={currentUser}
                peer={peer}
                onSelect={(id) => setActiveRoomId(id)}
                onToggleArchive={handleToggleArchiveWithToast}
                onTogglePin={(id) => togglePinRoom(id)}
                onToggleMute={(id) => toggleMuteRoom(id)}
                formatTimestamp={formatTimestamp}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
