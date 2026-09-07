import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  Plus,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const StatusViewerModal: React.FC = () => {
  const {
    isStoryViewerOpen,
    setIsStoryViewerOpen,
    stories,
    selectedStoryIndex,
    setSelectedStoryIndex,
    markStoryViewed,
    sendMessage,
    addStory,
    currentUser,
  } = useChat();

  const [replyText, setReplyText] = useState('');
  const [progress, setProgress] = useState(0);
  const [isPostingStory, setIsPostingStory] = useState(false);
  const [newStoryMediaUrl, setNewStoryMediaUrl] = useState('');
  const [newStoryCaption, setNewStoryCaption] = useState('');

  const currentStory = stories[selectedStoryIndex] || stories[0];

  // Mark current story as viewed and reset progress on story index change
  useEffect(() => {
    if (!isStoryViewerOpen || !currentStory) return;
    if (!currentStory.viewed) {
      markStoryViewed(currentStory.id);
    }
    setProgress(0);
  }, [isStoryViewerOpen, selectedStoryIndex, currentStory?.id]);

  // Story progress timer increment
  useEffect(() => {
    if (!isStoryViewerOpen || !currentStory || isPostingStory) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isStoryViewerOpen, selectedStoryIndex, isPostingStory, currentStory?.id]);

  // Advance to next story when progress reaches 100%
  useEffect(() => {
    if (progress < 100 || !isStoryViewerOpen) return;

    if (selectedStoryIndex < stories.length - 1) {
      setSelectedStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      setIsStoryViewerOpen(false);
    }
  }, [progress, isStoryViewerOpen, selectedStoryIndex, stories.length, setSelectedStoryIndex, setIsStoryViewerOpen]);

  if (!isStoryViewerOpen || !currentStory) return null;

  const handleNext = () => {
    if (selectedStoryIndex < stories.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
    } else {
      setIsStoryViewerOpen(false);
    }
  };

  const handlePrev = () => {
    if (selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    sendMessage({
      text: `Replied to status: "${currentStory.caption || 'Photo'}": ${replyText.trim()}`,
      type: 'text',
    });
    setReplyText('');
    setIsStoryViewerOpen(false);
  };

  const handleCreateStory = () => {
    if (!newStoryMediaUrl && !newStoryCaption) return;
    addStory({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: 'image',
      contentUrl: newStoryMediaUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      caption: newStoryCaption || 'Working on WAT matrix node 🚀',
    });
    setIsPostingStory(false);
    setNewStoryMediaUrl('');
    setNewStoryCaption('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 md:p-6 animate-fade-in select-none">
      {/* Story Stage Container */}
      <div className="relative w-full max-w-sm md:max-w-md h-[85vh] md:h-[90vh] bg-neutral-900 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl border border-neutral-800">
        {/* Top Progress Bar & Header */}
        <div className="absolute top-0 inset-x-0 p-4 z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
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

          {/* User Profile Info & Close Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.userAvatar}
                alt={currentStory.userName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight">
                  {currentStory.userName}
                </span>
                <span className="text-[10px] text-neutral-300 font-mono">
                  Today at {new Date(currentStory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPostingStory(true)}
                className="px-2.5 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-1 shadow-md"
                title="Post new story"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>

              <button
                onClick={() => setIsStoryViewerOpen(false)}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Story Background / Media */}
        <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
          {currentStory.contentUrl || (currentStory as any).mediaUrl ? (
            <img
              src={currentStory.contentUrl || (currentStory as any).mediaUrl}
              alt="Story media"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-8 text-center text-xl font-bold text-white">
              {currentStory.caption}
            </div>
          )}

          {/* Left / Right click navigation tap zones */}
          <button
            onClick={handlePrev}
            className="absolute left-0 inset-y-0 w-1/3 z-10 cursor-pointer opacity-0 hover:opacity-30 transition-opacity flex items-center pl-2"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 inset-y-0 w-1/3 z-10 cursor-pointer opacity-0 hover:opacity-30 transition-opacity flex items-center justify-end pr-2"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Bottom Story Caption & Reply Input */}
        <div className="absolute bottom-0 inset-x-0 p-4 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2.5">
          {currentStory.caption && (
            <p className="text-sm text-white font-medium text-center bg-black/30 backdrop-blur px-3 py-1.5 rounded-xl">
              {currentStory.caption}
            </p>
          )}

          {/* Reply input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendReply();
              }}
              placeholder={`Reply to ${currentStory?.userName ? currentStory.userName.split(' ')[0] : 'story'}...`}
              className="flex-1 bg-neutral-900/90 border border-neutral-700/80 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-400 backdrop-blur"
            />
            <button
              onClick={handleSendReply}
              className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-transform active:scale-95 shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add Story Modal inside viewer */}
        {isPostingStory && (
          <div className="absolute inset-0 z-40 bg-neutral-950/95 p-6 flex flex-col justify-between animate-scale">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-100">
                Post to Status
              </h3>
              <button
                onClick={() => setIsPostingStory(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={newStoryMediaUrl}
                  onChange={(e) => setNewStoryMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400">
                  Caption
                </label>
                <textarea
                  value={newStoryCaption}
                  onChange={(e) => setNewStoryCaption(e.target.value)}
                  placeholder="What's happening?"
                  rows={3}
                  className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleCreateStory}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg"
            >
              Share Status (24 Hours)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
