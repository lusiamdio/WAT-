import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  Download,
  Lock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  Repeat,
  Sparkles,
  Share2,
  Smile,
  MessageSquare,
  Clock,
  ArrowLeft,
  Palette,
  Layers,
  ExternalLink,
  ShieldCheck,
  Heart,
  Flame,
  Laugh,
  PartyPopper,
  ThumbsUp,
  RotateCcw,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { downloadStatusMedia, downloadTextStatus } from '../../utils/statusDownloadHelper';
import { soundEngine } from '../../utils/audioSynth';
import { StoryStatus } from '../../types';

// Fast one-click emoji reactions
const QUICK_EMOJIS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '👏', label: 'Applause' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '💯', label: '100' },
];

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

export const StatusStoriesView: React.FC = () => {
  const {
    currentUser,
    stories,
    markStoryViewed,
    deleteStory,
    reactToStory,
    reshareStory,
    remixStory,
    sendMessage,
    rooms,
    createRoom,
    setActiveRoomId,
    setActiveTab,
  } = useChat();

  // Active story index in the stories array
  const [currentIndex, setCurrentIndex] = useState(0);

  // Viewing duration progress (0 to 100)
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Quick-reply state
  const [replyText, setReplyText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [replyToast, setReplyToast] = useState<{ message: string; isError?: boolean } | null>(null);

  // Reshare & Remix Modals
  const [isReshareModalOpen, setIsReshareModalOpen] = useState(false);
  const [reshareCustomCaption, setReshareCustomCaption] = useState('');

  const [isRemixModalOpen, setIsRemixModalOpen] = useState(false);
  const [remixComment, setRemixComment] = useState('');
  const [remixBgColor, setRemixBgColor] = useState('from-purple-900 via-indigo-950 to-black');
  const [remixSticker, setRemixSticker] = useState('🔥');

  // Floating animation particles
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  // Device storage download toast
  const [downloadToast, setDownloadToast] = useState<{ message: string; isError?: boolean } | null>(null);

  // Audio / Video refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Selected story
  const currentStory: StoryStatus | undefined = stories[currentIndex] || stories[0];

  // Mark story as viewed
  useEffect(() => {
    if (currentStory && !currentStory.viewed) {
      markStoryViewed(currentStory.id);
    }
  }, [currentStory?.id, currentStory?.viewed, markStoryViewed]);

  // Handle story progress timer (approx 5 seconds duration per story)
  useEffect(() => {
    if (!currentStory || isPaused || isInputFocused || isReshareModalOpen || isRemixModalOpen) {
      return;
    }

    const interval = 50; // 50ms tick
    const step = 100 / (5000 / interval); // 5000ms total duration

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((i) => i + 1);
            return 0;
          } else {
            // Loop or hold
            setIsPaused(true);
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, stories.length, isPaused, isInputFocused, isReshareModalOpen, isRemixModalOpen, currentStory]);

  // Reset progress when index changes
  const handleSelectStory = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
    setIsPaused(false);
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused || isReshareModalOpen || isRemixModalOpen) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, stories.length, isInputFocused, isReshareModalOpen, isRemixModalOpen]);

  // Helper to find or create direct room with story author
  const getOrCreateAuthorRoom = (authorUserId: string, authorName: string) => {
    let targetRoom = rooms.find(
      (r) => r.type === 'direct' && r.memberIds.includes(authorUserId)
    );
    if (!targetRoom) {
      targetRoom = createRoom(authorName, 'direct', [authorUserId]);
    }
    return targetRoom;
  };

  // Send Quick Text Reply directly to story author
  const handleSendQuickReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !currentStory) return;

    const trimmed = replyText.trim();
    const authorRoom = getOrCreateAuthorRoom(currentStory.userId, currentStory.userName);

    const storySnippet = currentStory.caption || currentStory.text || currentStory.fileName || currentStory.type;

    sendMessage({
      text: `Replied to your status "${storySnippet}":\n${trimmed}`,
      type: 'text',
      targetRoomId: authorRoom.id,
    });

    soundEngine.playMessageSent();
    setReplyText('');
    setIsInputFocused(false);
    if (inputRef.current) inputRef.current.blur();

    setReplyToast({
      message: `Direct message sent to ${currentStory.userName}!`,
    });
    setTimeout(() => setReplyToast(null), 3000);
  };

  // Single-Click Emoji Reaction
  const handleEmojiReaction = (emoji: string) => {
    if (!currentStory) return;

    soundEngine.playPop();

    // 1. Spawns floating burst particles
    const newParticle: FloatingEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      x: 35 + Math.random() * 30, // center burst
    };
    setFloatingEmojis((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1800);

    // 2. React to story in state
    reactToStory(currentStory.id, emoji);

    // 3. Send direct message notification to the author if not own story
    if (currentStory.userId !== currentUser.id) {
      const authorRoom = getOrCreateAuthorRoom(currentStory.userId, currentStory.userName);
      const snippet = currentStory.caption || currentStory.text || currentStory.fileName || currentStory.type;

      sendMessage({
        text: `${emoji} Reacted to your status: "${snippet}"`,
        type: 'text',
        targetRoomId: authorRoom.id,
      });
    }

    setReplyToast({
      message: `Reacted with ${emoji} to ${currentStory.userName}!`,
    });
    setTimeout(() => setReplyToast(null), 2500);
  };

  // Reshare to My Status
  const handleConfirmReshare = () => {
    if (!currentStory) return;

    soundEngine.playChime();
    reshareStory(currentStory.id, reshareCustomCaption.trim() || undefined);
    setIsReshareModalOpen(false);
    setReshareCustomCaption('');

    setReplyToast({
      message: `🔁 Story reshared to your status!`,
    });
    setTimeout(() => setReplyToast(null), 3500);
  };

  // Remix and Publish Status
  const handleConfirmRemix = () => {
    if (!currentStory) return;

    soundEngine.playChime();
    remixStory(currentStory.id, {
      caption: `✨ Remixed from @${currentStory.userName}: ${remixComment ? `"${remixComment}"` : 'Remixed status'}`,
      userNote: remixComment.trim() || undefined,
      overlayColor: remixBgColor,
      userReaction: remixSticker,
      text: currentStory.type === 'text' ? `${currentStory.text}\n\n💬 ${remixComment}` : undefined,
    });

    setIsRemixModalOpen(false);
    setRemixComment('');

    setReplyToast({
      message: `✨ Remix published to your status!`,
    });
    setTimeout(() => setReplyToast(null), 3500);
  };

  // Save to Device Storage
  const handleSaveToDevice = async () => {
    if (!currentStory) return;

    if (currentStory.isPrivate) {
      soundEngine.playPop();
      setDownloadToast({
        message: '🔒 Protected: Author made this status private. Saving to device is restricted.',
        isError: true,
      });
      setTimeout(() => setDownloadToast(null), 3500);
      return;
    }

    soundEngine.playChime();
    let success = false;
    let fileName = currentStory.fileName || `WAT_Status_${currentStory.userName}_${currentStory.id}`;

    if (currentStory.type === 'text') {
      success = downloadTextStatus(currentStory.text || '', currentStory.userName);
      fileName = `${fileName}.txt`;
    } else if (currentStory.contentUrl) {
      if (currentStory.type === 'image' && !fileName.includes('.')) fileName += '.jpg';
      if (currentStory.type === 'video' && !fileName.includes('.')) fileName += '.mp4';
      if (currentStory.type === 'audio' && !fileName.includes('.')) fileName += '.ogg';
      if (currentStory.type === 'file' && !fileName.includes('.')) fileName += '.pdf';

      success = await downloadStatusMedia(
        currentStory.contentUrl,
        fileName,
        currentStory.mimeType
      );
    }

    if (success) {
      setDownloadToast({
        message: `💾 Saved to device storage: ${fileName}`,
        isError: false,
      });
    } else {
      setDownloadToast({
        message: 'Download error. Please check storage permissions.',
        isError: true,
      });
    }
    setTimeout(() => setDownloadToast(null), 3500);
  };

  // Relative timestamp format
  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 60) return `${Math.max(1, mins)}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Filter user stories vs others
  const myStories = useMemo(() => stories.filter((s) => s.userId === currentUser.id), [stories, currentUser.id]);
  const otherStories = useMemo(() => stories.filter((s) => s.userId !== currentUser.id), [stories, currentUser.id]);

  if (stories.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-950 text-white p-6">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No Status Updates</h3>
        <p className="text-sm text-neutral-400 text-center max-w-sm">
          There are currently no active status stories from your sovereign contacts.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full w-full bg-neutral-950 text-white overflow-hidden select-none relative">
      {/* Toast Notification */}
      {replyToast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4" />
          <span>{replyToast.message}</span>
        </div>
      )}

      {downloadToast && (
        <div
          className={`absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 text-xs font-semibold rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 ${
            downloadToast.isError
              ? 'bg-amber-600/90 text-white border border-amber-400/30'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {downloadToast.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span>{downloadToast.message}</span>
        </div>
      )}

      {/* Floating Reaction Burst Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            style={{ left: `${item.x}%` }}
            className="absolute bottom-28 text-4xl animate-status-float"
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Left Sidebar: Status Rail / Contacts List (Hidden on small screens when focused on story) */}
      <aside className="hidden lg:flex flex-col w-80 bg-neutral-900/70 border-r border-white/10 shrink-0 h-full overflow-y-auto custom-scrollbar p-4">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-wide">Status Stories</h2>
          </div>
          <span className="text-xs text-neutral-400 font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            {stories.length} updates
          </span>
        </div>

        {/* My Status Item */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-1">
            My Status
          </div>
          {myStories.length > 0 ? (
            <div
              onClick={() => {
                const idx = stories.findIndex((s) => s.userId === currentUser.id);
                if (idx >= 0) handleSelectStory(idx);
              }}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all"
            >
              <div className="relative p-0.5 rounded-xl ring-2 ring-emerald-500">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">You</div>
                <div className="text-xs text-neutral-400 flex items-center gap-1 truncate">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{myStories[0].viewsCount || 1} views</span>
                  <span>•</span>
                  <span>{formatTime(myStories[0].timestamp)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/5 text-neutral-400 text-xs">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-11 h-11 rounded-lg object-cover opacity-60"
              />
              <div>
                <div className="font-semibold text-neutral-300">My Status</div>
                <div className="text-[11px] text-neutral-500">No active updates published</div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Status Updates */}
        <div className="flex-1">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-1">
            Recent Updates
          </div>
          <div className="space-y-1.5">
            {stories.map((story, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <div
                  key={story.id}
                  onClick={() => handleSelectStory(idx)}
                  className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border border-emerald-500/40 shadow-sm'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div
                    className={`relative p-0.5 rounded-xl ${
                      story.viewed ? 'ring-2 ring-white/20' : 'ring-2 ring-emerald-400'
                    }`}
                  >
                    <img
                      src={story.userAvatar}
                      alt={story.userName}
                      className="w-11 h-11 rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-semibold text-white truncate">
                        {story.userName}
                      </span>
                      <span className="text-[10px] text-neutral-400 shrink-0">
                        {formatTime(story.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 truncate">
                      {story.isRemix ? '✨ Remixed status' : story.isReshare ? '🔁 Reshared status' : story.caption || story.text || story.fileName || 'Status update'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Return to Chats button */}
        <button
          onClick={() => setActiveTab('chats')}
          className="mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Messages</span>
        </button>
      </aside>

      {/* Main Story Viewing Stage */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-2 sm:p-4 md:p-6 overflow-hidden bg-gradient-to-b from-neutral-900 to-black">
        {/* Mobile top header with Back button */}
        <div className="lg:hidden absolute top-3 left-4 z-30 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chats')}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white hover:bg-black/70"
            title="Back to Chats"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Blurred Backdrop */}
        {currentStory.type === 'image' && currentStory.contentUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 pointer-events-none scale-110"
            style={{ backgroundImage: `url(${currentStory.contentUrl})` }}
          />
        )}

        {/* Centered Story Card Container */}
        <div
          className="relative w-full max-w-md h-[88vh] sm:h-[820px] max-h-[92vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col select-none"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* =========================================================================
              1. TOP PROGRESS BAR VISUALLY TRACKING VIEWING DURATION FOR EACH STORY
             ========================================================================= */}
          <div className="absolute top-0 inset-x-0 z-30 p-3 pt-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            {/* Segmented Progress Bar */}
            <div className="flex items-center gap-1.5 w-full">
              {stories.map((s, idx) => {
                let fillPercent = 0;
                if (idx < currentIndex) {
                  fillPercent = 100;
                } else if (idx === currentIndex) {
                  fillPercent = progress;
                } else {
                  fillPercent = 0;
                }

                return (
                  <div
                    key={s.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectStory(idx);
                    }}
                    className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all"
                    title={`Go to ${s.userName}'s story`}
                  >
                    <div
                      className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Story Header: Author info, timestamp, Remix/Reshare tags & Controls */}
            <div className="flex items-center justify-between mt-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentStory.userAvatar}
                  alt={currentStory.userName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white truncate drop-shadow">
                      {currentStory.userName}
                    </span>
                    {currentStory.isPrivate && (
                      <span
                        className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-0.5 shrink-0"
                        title="Private Status: Saving to device is restricted"
                      >
                        <Lock className="w-2.5 h-2.5" />
                        <span>Private</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-white/70">
                    <span>{formatTime(currentStory.timestamp)}</span>
                    {currentStory.isReshare && (
                      <span className="text-emerald-400 font-medium flex items-center gap-0.5">
                        <Repeat className="w-3 h-3" /> Reshared
                      </span>
                    )}
                    {currentStory.isRemix && (
                      <span className="text-purple-300 font-medium flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" /> Remixed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Icons in Header */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPaused((p) => !p);
                  }}
                  className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 transition-colors"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
                </button>

                {/* Audio/Video Mute Toggle */}
                {(currentStory.type === 'video' || currentStory.type === 'audio') && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted((m) => !m);
                      if (videoRef.current) videoRef.current.muted = !isMuted;
                      if (audioRef.current) audioRef.current.muted = !isMuted;
                    }}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}

                {/* Remix Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPaused(true);
                    setIsRemixModalOpen(true);
                  }}
                  className="p-2 rounded-full bg-purple-600/60 hover:bg-purple-600 text-white transition-colors flex items-center justify-center shadow-md"
                  title="Remix this status"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                </button>

                {/* Reshare Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPaused(true);
                    setIsReshareModalOpen(true);
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
                  title="Reshare this status"
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Save / Download to Device */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveToDevice();
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
                  title={currentStory.isPrivate ? 'Protected' : 'Save to device'}
                >
                  {currentStory.isPrivate ? (
                    <Lock className="w-4 h-4 text-amber-300" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </button>

                {/* Delete if currentUser's status */}
                {currentStory.userId === currentUser.id && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this status story?')) {
                        deleteStory(currentStory.id);
                        if (currentIndex > 0) setCurrentIndex((i) => i - 1);
                      }
                    }}
                    className="p-2 rounded-full bg-red-600/30 hover:bg-red-600/60 text-red-300 transition-colors"
                    title="Delete status"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              2. STORY MEDIA CONTENT BODY (IMAGE, VIDEO, AUDIO, DOCUMENT, TEXT)
             ========================================================================= */}
          <div className="flex-1 relative flex items-center justify-center w-full h-full bg-black overflow-hidden">
            {/* Tap Navigation Zones (Left tap = Prev, Right tap = Next) */}
            <div
              onClick={handlePrev}
              className="absolute left-0 inset-y-0 w-1/4 z-10 cursor-pointer"
              title="Previous"
            />
            <div
              onClick={handleNext}
              className="absolute right-0 inset-y-0 w-1/4 z-10 cursor-pointer"
              title="Next"
            />

            {/* Navigation Chevron Buttons */}
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white/90 backdrop-blur-sm transition-all"
                title="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {currentIndex < stories.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white/90 backdrop-blur-sm transition-all"
                title="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Image Story */}
            {currentStory.type === 'image' && currentStory.contentUrl && (
              <div className="w-full h-full flex items-center justify-center p-0">
                <img
                  src={currentStory.contentUrl}
                  alt={currentStory.caption || 'Status'}
                  className="w-full h-full object-cover sm:object-contain transition-transform duration-700 ease-out"
                />
              </div>
            )}

            {/* Video Story */}
            {currentStory.type === 'video' && currentStory.contentUrl && (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  src={currentStory.contentUrl}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Audio Story */}
            {currentStory.type === 'audio' && (
              <div
                className={`w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br ${
                  currentStory.bgColor || 'from-indigo-950 via-purple-950 to-black'
                }`}
              >
                <audio
                  ref={audioRef}
                  src={currentStory.contentUrl}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                />
                <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 shadow-2xl animate-pulse">
                  <Volume2 className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white text-center mb-2">
                  Voice Note & Audio Brief
                </h4>
                <p className="text-xs text-white/60 text-center mb-6 max-w-xs truncate">
                  {currentStory.fileName || 'Audio Status'}
                </p>
                {/* Audio Waveform Simulation */}
                <div className="flex items-center gap-1 h-12">
                  {[40, 75, 55, 90, 60, 85, 45, 95, 30, 80, 60, 45, 90, 70, 40].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${isPaused ? 20 : h}%` }}
                      className="w-1.5 bg-emerald-400 rounded-full transition-all duration-300"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* PDF / File Story */}
            {currentStory.type === 'file' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black">
                <div className="w-20 h-20 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center mb-4 shadow-xl">
                  <FileText className="w-10 h-10 text-red-400" />
                </div>
                <h4 className="text-base font-bold text-white text-center mb-1 max-w-xs break-words">
                  {currentStory.fileName || 'Document Brief.pdf'}
                </h4>
                <span className="text-xs text-neutral-400 mb-6">
                  {currentStory.fileSize || 'PDF Document'}
                </span>
                <button
                  type="button"
                  onClick={handleSaveToDevice}
                  className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </button>
              </div>
            )}

            {/* Text Story */}
            {currentStory.type === 'text' && (
              <div
                className={`w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br ${
                  currentStory.bgColor || 'from-emerald-900 via-teal-950 to-black'
                }`}
              >
                <div className="max-w-xs space-y-4">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white leading-relaxed tracking-tight drop-shadow-md">
                    {currentStory.text}
                  </p>
                </div>
              </div>
            )}

            {/* Remixed / Reshared Source Attribution Banner */}
            {(currentStory.isRemix || currentStory.isReshare) && (
              <div className="absolute top-20 left-4 right-4 z-20 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-2.5">
                {currentStory.isRemix ? (
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                ) : (
                  <Repeat className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <div className="text-[11px] text-white/90 min-w-0">
                  <span className="font-semibold text-white">
                    {currentStory.isRemix
                      ? `Remix of @${currentStory.remixedFrom?.userName || 'creator'}`
                      : `Reshared from @${currentStory.resharedFrom?.userName || 'creator'}`}
                  </span>
                  {currentStory.remixedFrom?.originalCaption && (
                    <p className="text-white/60 truncate">
                      "{currentStory.remixedFrom.originalCaption}"
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Caption & Metadata Pill */}
            {currentStory.caption && (
              <div className="absolute bottom-24 inset-x-4 z-20 pointer-events-none">
                <div className="p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs sm:text-sm font-medium leading-snug drop-shadow-md shadow-xl text-center">
                  {currentStory.caption}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              3. SINGLE-CLICK EMOJI REACTION FUNCTIONALITY
             ========================================================================= */}
          <div className="absolute bottom-16 inset-x-0 z-30 px-3 py-1.5 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center gap-1 sm:gap-2">
            {QUICK_EMOJIS.map((item) => {
              const count = currentStory.reactions?.[item.emoji] || 0;
              const hasReacted = currentStory.userReaction === item.emoji;

              return (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEmojiReaction(item.emoji);
                  }}
                  className={`relative p-1.5 sm:p-2 rounded-full transition-all duration-150 transform hover:scale-135 active:scale-95 flex items-center justify-center ${
                    hasReacted
                      ? 'bg-white/30 ring-2 ring-emerald-400 scale-110'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  title={`React ${item.label}`}
                >
                  <span className="text-xl sm:text-2xl select-none leading-none">
                    {item.emoji}
                  </span>
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-emerald-500 text-neutral-950 font-black text-[9px] flex items-center justify-center ring-1 ring-black">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* =========================================================================
              4. QUICK-REPLY INPUT FIELD (DIRECT TEXT MESSAGE TO STORY AUTHOR)
             ========================================================================= */}
          <div className="relative z-30 p-2.5 bg-neutral-950/95 border-t border-white/10">
            <form
              onSubmit={handleSendQuickReply}
              className="flex items-center gap-2 bg-neutral-900 border border-white/15 rounded-full px-3.5 py-1.5 focus-within:border-emerald-500/70 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
            >
              <input
                ref={inputRef}
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={() => {
                  setIsInputFocused(true);
                  setIsPaused(true);
                }}
                onBlur={() => {
                  setIsInputFocused(false);
                  setIsPaused(false);
                }}
                placeholder={`Reply directly to ${currentStory.userName.split(' ')[0]}...`}
                className="flex-1 bg-transparent text-white text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none"
              />

              {replyText.trim() ? (
                <button
                  type="submit"
                  className="p-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-all transform active:scale-90"
                  title="Send message directly to author"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEmojiReaction('❤️')}
                  className="text-neutral-400 hover:text-red-400 transition-colors p-1"
                  title="Quick Like"
                >
                  <Heart className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* =========================================================================
          5. RESHARE STATUS MODAL
         ========================================================================= */}
      {isReshareModalOpen && currentStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-neutral-900 border border-white/15 rounded-3xl p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Reshare Status</h3>
              </div>
              <button
                onClick={() => {
                  setIsReshareModalOpen(false);
                  setIsPaused(false);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story Preview Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <img
                src={currentStory.userAvatar}
                alt={currentStory.userName}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {currentStory.userName}
                </div>
                <div className="text-[11px] text-neutral-400 truncate">
                  {currentStory.caption || currentStory.text || currentStory.fileName || 'Story update'}
                </div>
              </div>
            </div>

            {/* Optional Custom commentary */}
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Add your thoughts (optional):
            </label>
            <input
              type="text"
              value={reshareCustomCaption}
              onChange={(e) => setReshareCustomCaption(e.target.value)}
              placeholder="e.g. Check out this update! 🔥"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 mb-4"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsReshareModalOpen(false);
                  setIsPaused(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReshare}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-neutral-950 transition-colors shadow-lg"
              >
                Reshare to My Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. REMIX STATUS STUDIO MODAL
         ========================================================================= */}
      {isRemixModalOpen && currentStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-purple-500/30 rounded-3xl p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold">Remix Status</h3>
              </div>
              <button
                onClick={() => {
                  setIsRemixModalOpen(false);
                  setIsPaused(false);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Split Remix Preview Canvas */}
            <div className={`w-full h-44 rounded-2xl bg-gradient-to-br ${remixBgColor} p-3 mb-4 flex flex-col justify-between relative overflow-hidden border border-white/15`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-black/60 text-purple-300 text-[10px] font-bold border border-purple-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Remixed with @{currentStory.userName}
                </span>
                <span className="text-2xl">{remixSticker}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                <p className="text-xs text-white font-medium">
                  {remixComment || 'Add your reaction or commentary below...'}
                </p>
                <span className="text-[10px] text-neutral-400 block mt-1 truncate">
                  Original: {currentStory.caption || currentStory.text || currentStory.fileName || currentStory.type}
                </span>
              </div>
            </div>

            {/* Remix Commentary input */}
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Your reaction / commentary:
            </label>
            <textarea
              rows={2}
              value={remixComment}
              onChange={(e) => setRemixComment(e.target.value)}
              placeholder="What are your thoughts on this status?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 mb-3 resize-none"
            />

            {/* Background Gradient Palette Picker */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5">
                Choose Canvas Backdrop:
              </label>
              <div className="flex items-center gap-2">
                {[
                  'from-purple-900 via-indigo-950 to-black',
                  'from-emerald-900 via-teal-950 to-black',
                  'from-amber-900 via-rose-950 to-black',
                  'from-blue-900 via-cyan-950 to-black',
                  'from-neutral-900 to-black',
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setRemixBgColor(color)}
                    className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} border-2 transition-all ${
                      remixBgColor === color ? 'border-purple-400 scale-110' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Remix Sticker Picker */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5">
                Sticker Badge:
              </label>
              <div className="flex items-center gap-2">
                {['🔥', '✨', '👑', '💯', '🚀', '❤️', '👏'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRemixSticker(st)}
                    className={`p-1.5 rounded-xl text-lg transition-all ${
                      remixSticker === st ? 'bg-white/20 scale-110 ring-1 ring-purple-400' : 'hover:bg-white/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsRemixModalOpen(false);
                  setIsPaused(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemix}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors shadow-lg shadow-purple-600/30"
              >
                Publish Remix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
