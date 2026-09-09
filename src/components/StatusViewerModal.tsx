import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { downloadStatusMedia, downloadTextStatus } from '../utils/statusDownloadHelper';
import { soundEngine } from '../utils/audioSynth';

export const StatusViewerModal: React.FC = () => {
  const {
    isStoryViewerOpen,
    setIsStoryViewerOpen,
    stories,
    selectedStoryIndex,
    setSelectedStoryIndex,
    markStoryViewed,
    sendMessage,
    deleteStory,
    setIsPublishStatusModalOpen,
    currentUser,
    reactToStory,
    reshareStory,
    remixStory,
    rooms,
    createRoom,
  } = useChat();

  const [replyText, setReplyText] = useState('');
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const [downloadToast, setDownloadToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentStory = stories[selectedStoryIndex] || stories[0];
  const isAuthor = currentStory?.userId === currentUser?.id;
  const isPrivate = currentStory?.isPrivate;

  // Mark current story as viewed and reset progress on story index change
  useEffect(() => {
    if (!isStoryViewerOpen || !currentStory) return;
    if (!currentStory.viewed) {
      markStoryViewed(currentStory.id);
    }
    setProgress(0);
    setIsAudioPlaying(true);
  }, [isStoryViewerOpen, selectedStoryIndex, currentStory?.id]);

  // Story progress timer increment
  useEffect(() => {
    if (!isStoryViewerOpen || !currentStory || isPaused) return;

    // Timer speed: normal ~ 7 seconds per slide
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isStoryViewerOpen, selectedStoryIndex, isPaused, currentStory?.id]);

  // Advance to next story when progress reaches 100%
  useEffect(() => {
    if (progress < 100 || !isStoryViewerOpen || isPaused) return;

    if (selectedStoryIndex < stories.length - 1) {
      setSelectedStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      setIsStoryViewerOpen(false);
    }
  }, [progress, isStoryViewerOpen, isPaused, selectedStoryIndex, stories.length, setSelectedStoryIndex, setIsStoryViewerOpen]);

  if (!isStoryViewerOpen || !currentStory) return null;

  const handleNext = () => {
    if (selectedStoryIndex < stories.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
      setProgress(0);
    } else {
      setIsStoryViewerOpen(false);
    }
  };

  const handlePrev = () => {
    if (selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !currentStory) return;

    let targetRoom = rooms.find(
      (r) => r.type === 'direct' && r.memberIds.includes(currentStory.userId)
    );
    if (!targetRoom) {
      targetRoom = createRoom(currentStory.userName, 'direct', [currentStory.userId]);
    }

    const snippet = currentStory.caption || currentStory.fileName || currentStory.type;
    sendMessage({
      text: `Replied to your status "${snippet}":\n${replyText.trim()}`,
      type: 'text',
      targetRoomId: targetRoom.id,
    });
    setReplyText('');
    soundEngine.playMessageSent();
    setDownloadToast({
      message: `Direct reply sent to ${currentStory.userName}!`,
      isError: false,
    });
    setTimeout(() => setDownloadToast(null), 2500);
  };

  const handleEmojiReaction = (emoji: string) => {
    if (!currentStory) return;
    soundEngine.playPop();
    reactToStory(currentStory.id, emoji);

    if (currentStory.userId !== currentUser.id) {
      let targetRoom = rooms.find(
        (r) => r.type === 'direct' && r.memberIds.includes(currentStory.userId)
      );
      if (!targetRoom) {
        targetRoom = createRoom(currentStory.userName, 'direct', [currentStory.userId]);
      }
      const snippet = currentStory.caption || currentStory.fileName || currentStory.type;
      sendMessage({
        text: `${emoji} Reacted to your status: "${snippet}"`,
        type: 'text',
        targetRoomId: targetRoom.id,
      });
    }

    setDownloadToast({
      message: `Reacted with ${emoji} to ${currentStory.userName}!`,
      isError: false,
    });
    setTimeout(() => setDownloadToast(null), 2000);
  };

  const handleReshare = () => {
    if (!currentStory) return;
    soundEngine.playChime();
    reshareStory(currentStory.id);
    setDownloadToast({
      message: '🔁 Reshared to your status!',
      isError: false,
    });
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleRemix = () => {
    if (!currentStory) return;
    soundEngine.playChime();
    remixStory(currentStory.id, {
      caption: `✨ Remixed status from @${currentStory.userName}`,
      userReaction: '🔥',
    });
    setDownloadToast({
      message: '✨ Remixed and published to your status!',
      isError: false,
    });
    setTimeout(() => setDownloadToast(null), 3000);
  };

  // Handle Save to Device Storage
  const handleSaveToDevice = async () => {
    if (isPrivate) {
      // Show clear notification that saving is restricted
      soundEngine.playPop();
      setDownloadToast({
        message: '🔒 Protected: Author made this status private. Saving to device is disabled.',
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

  const handleDeleteStory = () => {
    if (!confirm('Are you sure you want to delete this status update?')) return;
    deleteStory(currentStory.id);
    if (stories.length <= 1) {
      setIsStoryViewerOpen(false);
    } else {
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 md:p-6 animate-fade-in select-none">
      {/* Story Stage Container */}
      <div
        className="relative w-full max-w-sm md:max-w-md h-[88vh] md:h-[92vh] bg-neutral-950 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl border border-neutral-800"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top Progress Bar & Header */}
        <div className="absolute top-0 inset-x-0 p-4 z-30 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-auto">
          {/* Multi-story progress bars */}
          <div className="flex items-center gap-1 mb-3">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all"
                  style={{
                    width:
                      idx < selectedStoryIndex
                        ? '100%'
                        : idx === selectedStoryIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Profile Info & Action Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.userAvatar}
                alt={currentStory.userName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white leading-tight">
                    {currentStory.userName}
                  </span>
                  {isPrivate && (
                    <span
                      className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      title="View-Only Status"
                    >
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-neutral-300 font-mono">
                  Today at {new Date(currentStory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {currentStory.viewsCount || 1} views
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Remix Status */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemix();
                }}
                className="p-2 rounded-full bg-purple-600/50 hover:bg-purple-600 text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                title="Remix this status"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
              </button>

              {/* Reshare Status */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReshare();
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                title="Reshare to your status"
              >
                <Repeat className="w-4 h-4" />
              </button>

              {/* SAVE TO DEVICE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveToDevice();
                }}
                className={`p-2 rounded-full transition-all flex items-center justify-center ${
                  isPrivate
                    ? 'bg-amber-950/60 text-amber-300/80 border border-amber-500/30 hover:bg-amber-900/80'
                    : 'bg-white/20 hover:bg-white/40 text-white hover:scale-105 active:scale-95 shadow-md'
                }`}
                title={
                  isPrivate
                    ? 'Protected: Author made this status private. Downloads are disabled.'
                    : 'Save / Download to Device Storage'
                }
              >
                {isPrivate ? <Lock className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              </button>

              {/* Author Delete Action */}
              {isAuthor && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStory();
                  }}
                  className="p-2 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 transition-colors"
                  title="Delete this status update"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStoryViewerOpen(false);
                }}
                className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Download Feedback Toast / Warning Banner */}
        {downloadToast && (
          <div className="absolute top-24 inset-x-4 z-40 animate-scale flex justify-center pointer-events-none">
            <div
              className={`px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold backdrop-blur-xl border ${
                downloadToast.isError
                  ? 'bg-amber-950/90 text-amber-200 border-amber-500/50'
                  : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
              }`}
            >
              {downloadToast.isError ? (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{downloadToast.message}</span>
            </div>
          </div>
        )}

        {/* STORY BODY RENDERER (BASED ON CONTENT TYPE) */}
        <div
          className="relative w-full h-full flex items-center justify-center bg-neutral-950 overflow-hidden"
          onContextMenu={(e) => {
            if (isPrivate) {
              e.preventDefault();
              setDownloadToast({
                message: '🔒 Protected content: Saving or copying is restricted by author.',
                isError: true,
              });
              setTimeout(() => setDownloadToast(null), 3000);
            }
          }}
        >
          {/* 1. IMAGE STATUS */}
          {currentStory.type === 'image' && (
            <img
              src={currentStory.contentUrl || (currentStory as any).mediaUrl}
              alt="Story media"
              draggable={!isPrivate}
              className={`w-full h-full object-cover select-none ${isPrivate ? 'pointer-events-none' : ''}`}
            />
          )}

          {/* 2. VIDEO STATUS */}
          {currentStory.type === 'video' && (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                src={currentStory.contentUrl}
                autoPlay
                loop
                playsInline
                muted={isVideoMuted}
                className="w-full h-full object-contain"
                onContextMenu={(e) => isPrivate && e.preventDefault()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVideoMuted(!isVideoMuted);
                }}
                className="absolute top-20 right-4 z-30 p-2.5 rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80"
                title={isVideoMuted ? 'Unmute video' : 'Mute video'}
              >
                {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* 3. AUDIO STATUS */}
          {currentStory.type === 'audio' && (
            <div
              className={`w-full h-full bg-gradient-to-tr ${
                currentStory.bgColor || 'from-purple-950 via-indigo-950 to-black'
              } flex flex-col items-center justify-center p-8 text-center text-white space-y-6`}
            >
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-xl">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!audioRef.current) return;
                      if (isAudioPlaying) {
                        audioRef.current.pause();
                        setIsAudioPlaying(false);
                      } else {
                        audioRef.current.play();
                        setIsAudioPlaying(true);
                      }
                    }}
                    className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  >
                    {isAudioPlaying ? (
                      <Pause className="w-7 h-7 fill-black" />
                    ) : (
                      <Play className="w-7 h-7 fill-black ml-1" />
                    )}
                  </button>
                </div>
              </div>

              <audio
                ref={audioRef}
                src={currentStory.contentUrl}
                autoPlay
                onEnded={() => setIsAudioPlaying(false)}
                className="hidden"
              />

              {/* Sound Equalizer visualizer */}
              <div className="flex items-center justify-center gap-1.5 h-12 py-1">
                {[14, 28, 44, 24, 38, 50, 30, 20, 36, 48, 22, 16, 32, 42, 28, 18, 34, 46].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full bg-white transition-all duration-300 ${
                      isAudioPlaying ? 'animate-pulse' : 'opacity-30'
                    }`}
                    style={{
                      height: isAudioPlaying ? `${h}px` : '10px',
                    }}
                  />
                ))}
              </div>

              <div className="space-y-1 max-w-xs">
                <h3 className="text-base font-bold truncate">
                  {currentStory.fileName || 'Audio Voice Note'}
                </h3>
                <p className="text-xs text-white/70">
                  {currentStory.fileSize || 'Voice Message'} • {isPrivate ? 'Protected Audio' : 'Direct Audio'}
                </p>
              </div>
            </div>
          )}

          {/* 4. TEXT STATUS */}
          {currentStory.type === 'text' && (
            <div
              className={`w-full h-full bg-gradient-to-tr ${
                currentStory.bgColor || 'from-emerald-900 via-teal-950 to-black'
              } flex flex-col items-center justify-center p-8 text-center text-white select-none`}
            >
              <div className="max-w-xs space-y-4">
                <p className="text-xl md:text-2xl font-bold leading-relaxed tracking-wide shadow-text">
                  {currentStory.text}
                </p>
              </div>
            </div>
          )}

          {/* 5. PDF DOCUMENT STATUS (PDF ONLY) */}
          {currentStory.type === 'file' && (
            <div className="w-full h-full bg-gradient-to-b from-neutral-900 to-black flex flex-col items-center justify-center p-6 text-white space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-rose-600/20 border-2 border-rose-500/40 flex items-center justify-center shadow-2xl">
                <FileText className="w-10 h-10 text-rose-500" />
              </div>

              <div className="text-center space-y-1 max-w-xs">
                <span className="inline-block bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                  PDF Document
                </span>
                <h3 className="text-sm md:text-base font-bold truncate">
                  {currentStory.fileName || 'Attached Document.pdf'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {currentStory.fileSize || 'PDF File'} • {isPrivate ? '🔒 Protected View' : '💾 Direct Download'}
                </p>
              </div>

              {/* Document Excerpt / Reader Simulation */}
              <div className="w-full max-w-xs p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-left space-y-2 text-xs text-neutral-300 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-neutral-400 pb-1.5 border-b border-white/10 font-mono">
                  <span>PAGE 1 OF 1</span>
                  <span>ENCRYPTED PDF</span>
                </div>
                <p className="font-mono text-[11px] text-neutral-200">
                  📄 {currentStory.caption || 'Document attached by user'}
                </p>
                <p className="text-[10px] text-neutral-400">
                  {isPrivate
                    ? 'Author has disabled downloads for this document. It can be viewed here.'
                    : 'Tap "Save to Device" in the header or below to download this PDF file.'}
                </p>
              </div>

              {/* Quick Action in PDF View */}
              {!isPrivate && currentStory.contentUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveToDevice();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Save PDF to Device</span>
                </button>
              )}
            </div>
          )}

          {/* Left / Right click navigation tap zones */}
          <button
            onClick={handlePrev}
            className="absolute left-0 inset-y-0 w-1/3 z-20 cursor-pointer opacity-0 hover:opacity-20 transition-opacity flex items-center pl-2"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 inset-y-0 w-1/3 z-20 cursor-pointer opacity-0 hover:opacity-20 transition-opacity flex items-center justify-end pr-2"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Bottom Story Caption & Reply Input */}
        <div className="absolute bottom-0 inset-x-0 p-4 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2.5 pointer-events-auto">
          {currentStory.caption && (
            <p className="text-xs md:text-sm text-white font-medium text-center bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-lg">
              {currentStory.caption}
            </p>
          )}

          {/* Quick One-Click Emoji Reactions */}
          <div className="flex items-center justify-center gap-2 py-1">
            {['❤️', '🔥', '😂', '😮', '😢', '👏', '🎉', '💯'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmojiReaction(emoji);
                }}
                className="p-1.5 rounded-full hover:bg-white/20 hover:scale-125 active:scale-95 transition-all text-xl"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendReply();
              }}
              placeholder={`Reply to ${currentStory?.userName ? currentStory.userName.split(' ')[0] : 'status'}...`}
              className="flex-1 bg-neutral-900/90 border border-neutral-700/80 rounded-full px-4 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-400 backdrop-blur"
            />
            <button
              onClick={handleSendReply}
              className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-transform active:scale-95 shadow-lg"
              title="Send reply"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
