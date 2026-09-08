import React, { useState, useRef } from 'react';
import {
  X,
  Smile,
  Send,
  Camera,
  Mic,
  FileText,
  Palette,
  RotateCw,
  Play,
  Pause,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { StoryContentType } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

const WHATSAPP_BG_COLORS = [
  { id: 'teal', color: '#00a884' },
  { id: 'purple', color: '#7b1fa2' },
  { id: 'red', color: '#e53935' },
  { id: 'blue', color: '#1976d2' },
  { id: 'orange', color: '#f57c00' },
  { id: 'green', color: '#2e7d32' },
  { id: 'dark', color: '#1f2c34' },
  { id: 'brown', color: '#5d4037' },
  { id: 'indigo', color: '#3949ab' },
  { id: 'pink', color: '#c2185b' },
];

const WHATSAPP_FONTS = [
  { id: 'sans', fontClass: 'font-sans font-bold' },
  { id: 'serif', fontClass: 'font-serif italic font-bold' },
  { id: 'mono', fontClass: 'font-mono font-medium' },
  { id: 'handwriting', fontClass: 'italic font-sans tracking-wide' },
  { id: 'heavy', fontClass: 'font-sans font-black tracking-tight uppercase' },
];

interface StatusUploadUIProps {
  onClose?: () => void;
  initialMode?: 'media' | 'text';
  standalone?: boolean;
}

export const StatusUploadUI: React.FC<StatusUploadUIProps> = ({
  onClose,
  initialMode = 'media',
  standalone = false,
}) => {
  const { currentUser, addStory, setSelectedStoryIndex, setIsStoryViewerOpen } = useChat();

  const [mode, setMode] = useState<'media' | 'text'>(initialMode);
  const [mediaCategory, setMediaCategory] = useState<'photo_video' | 'audio' | 'pdf'>('photo_video');

  // Text Status state
  const [textContent, setTextContent] = useState('');
  const [bgIndex, setBgIndex] = useState(0);
  const [fontIndex, setFontIndex] = useState(0);

  // Photo & Video state
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaFileName, setMediaFileName] = useState('');
  const [mediaFileSize, setMediaFileSize] = useState('');
  const [mediaRotation, setMediaRotation] = useState<number>(0);
  const [isHdQuality, setIsHdQuality] = useState<boolean>(true);

  // Audio state
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioFileName, setAudioFileName] = useState('');
  const [audioFileSize, setAudioFileSize] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // PDF Document state
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('');
  const [pdfError, setPdfError] = useState('');

  // Drag state
  const [isDragging, setIsDragging] = useState(false);

  // Privacy: private = view only (cannot download), public = downloadable
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  // Caption & Emojis
  const [caption, setCaption] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const quickEmojis = ['❤️', '😂', '🔥', '👏', '😍', '🎉', '✨', '🙌', '💯', '🚀'];

  const processMediaFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) return;

    setMediaCategory('photo_video');
    setMediaType(isImage ? 'image' : 'video');
    setMediaFileName(file.name);
    setMediaFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMediaUrl(event.target.result as string);
        soundEngine.playPop();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processMediaFile(file);
  };

  const processAudioFile = (file: File) => {
    if (!file.type.startsWith('audio/')) return;

    setMediaCategory('audio');
    setAudioFileName(file.name);
    setAudioFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAudioUrl(event.target.result as string);
        soundEngine.playPop();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processAudioFile(file);
  };

  const processPdfFile = (file: File) => {
    setPdfError('');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setPdfError('PDF only');
      return;
    }

    setMediaCategory('pdf');
    setPdfFileName(file.name);
    setPdfFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPdfUrl(event.target.result as string);
        soundEngine.playPop();
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processPdfFile(file);
  };

  const handlePublish = () => {
    soundEngine.playMessageSent();

    let storyType: StoryContentType = 'image';
    let contentUrl = '';
    let finalFileName = '';
    let finalFileSize = '';
    let finalMimeType = '';
    let finalBg = '';
    const finalCaption = caption.trim();

    if (mode === 'text') {
      if (!textContent.trim()) return;
      storyType = 'text';
      finalBg = WHATSAPP_BG_COLORS[bgIndex].color;
    } else {
      if (mediaCategory === 'photo_video') {
        if (!mediaUrl) return;
        storyType = mediaType;
        contentUrl = mediaUrl;
        finalFileName = mediaFileName || (mediaType === 'image' ? 'Status_Image.jpg' : 'Status_Video.mp4');
        finalFileSize = mediaFileSize || '2.0 MB';
        finalMimeType = mediaType === 'image' ? 'image/jpeg' : 'video/mp4';
      } else if (mediaCategory === 'audio') {
        if (!audioUrl) return;
        storyType = 'audio';
        contentUrl = audioUrl;
        finalFileName = audioFileName || 'Voice_Note.ogg';
        finalFileSize = audioFileSize || '500 KB';
        finalMimeType = 'audio/ogg';
        finalBg = WHATSAPP_BG_COLORS[bgIndex].color;
      } else if (mediaCategory === 'pdf') {
        if (!pdfUrl) return;
        storyType = 'file';
        contentUrl = pdfUrl;
        finalFileName = pdfFileName || 'Document.pdf';
        finalFileSize = pdfFileSize || '1.0 MB';
        finalMimeType = 'application/pdf';
        finalBg = '#111b21';
      }
    }

    addStory({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: storyType,
      contentUrl: contentUrl || undefined,
      fileName: finalFileName || undefined,
      fileSize: finalFileSize || undefined,
      mimeType: finalMimeType || undefined,
      text: mode === 'text' ? textContent.trim() : undefined,
      caption: finalCaption || undefined,
      bgColor: finalBg || undefined,
      isPrivate: isPrivate,
    });

    if (onClose) {
      onClose();
    } else {
      // Reset state for standalone page
      setMediaUrl('');
      setAudioUrl('');
      setPdfUrl('');
      setTextContent('');
      setCaption('');
    }

    setSelectedStoryIndex(0);
    setIsStoryViewerOpen(true);
  };

  const activeBgColor = WHATSAPP_BG_COLORS[bgIndex].color;
  const activeFont = WHATSAPP_FONTS[fontIndex];

  return (
    <div
      className={`relative w-full h-full ${
        standalone ? 'max-w-xl mx-auto rounded-3xl my-4' : 'md:max-w-md md:h-[94vh] md:rounded-[32px]'
      } overflow-hidden flex flex-col justify-between shadow-2xl transition-colors duration-300 select-none ${
        mode === 'text' ? '' : 'bg-[#0b141a]'
      }`}
      style={mode === 'text' ? { backgroundColor: activeBgColor } : undefined}
    >
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleMediaUpload}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleAudioUpload}
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handlePdfUpload}
      />

      {/* Top action toolbar (NO text/labels) */}
      <div className="relative z-30 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white"
          >
            <X className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex items-center gap-1">
          {mode === 'text' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setMode('media');
                  soundEngine.playPop();
                }}
                className="p-2.5 rounded-full hover:bg-white/20 active:scale-95 text-white transition-all"
              >
                <Camera className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setFontIndex((prev) => (prev + 1) % WHATSAPP_FONTS.length);
                  soundEngine.playPop();
                }}
                className="p-2.5 rounded-full hover:bg-white/20 active:scale-95 text-white transition-all font-serif font-black text-lg w-10 h-10 flex items-center justify-center"
              >
                T
              </button>

              <button
                type="button"
                onClick={() => {
                  setBgIndex((prev) => (prev + 1) % WHATSAPP_BG_COLORS.length);
                  soundEngine.playPop();
                }}
                className="p-2.5 rounded-full hover:bg-white/20 active:scale-95 text-white transition-all"
              >
                <Palette className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setMode('text');
                  soundEngine.playPop();
                }}
                className="p-2.5 rounded-full hover:bg-white/15 active:scale-95 text-white transition-all font-serif font-bold text-base w-9 h-9 flex items-center justify-center"
              >
                T
              </button>

              {mediaCategory === 'photo_video' && mediaUrl && (
                <button
                  type="button"
                  onClick={() => setMediaRotation((prev) => (prev + 90) % 360)}
                  className="p-2.5 rounded-full hover:bg-white/15 active:scale-95 text-white transition-all"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              )}

              {mediaCategory === 'photo_video' && mediaUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setIsHdQuality(!isHdQuality);
                    soundEngine.playPop();
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-black tracking-wider transition-all border ${
                    isHdQuality
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/70 border-white/40'
                  }`}
                >
                  HD
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main stage (NO text labels, purely upload UI) */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4">
        {mode === 'text' ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 select-none">
            <textarea
              ref={textInputRef}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder=""
              rows={5}
              className={`w-full bg-transparent text-center text-2xl md:text-3xl placeholder-white/40 text-white focus:outline-none resize-none shadow-text transition-all ${activeFont.fontClass}`}
              autoFocus
            />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* PHOTO / VIDEO */}
            {mediaCategory === 'photo_video' && (
              <>
                {mediaUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {mediaType === 'image' ? (
                      <img
                        src={mediaUrl}
                        alt=""
                        style={{ transform: `rotate(${mediaRotation}deg)` }}
                        className="max-w-full max-h-[66vh] object-contain transition-transform duration-200 rounded-xl"
                      />
                    ) : (
                      <video
                        src={mediaUrl}
                        controls
                        autoPlay
                        loop
                        className="max-w-full max-h-[66vh] object-contain rounded-xl"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMediaUrl('');
                        setMediaFileName('');
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) processMediaFile(file);
                    }}
                    className={`w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                      isDragging
                        ? 'border-[#00a884] bg-[#00a884]/20 scale-105'
                        : 'border-[#00a884]/60 bg-[#202c33]/80 hover:border-[#00a884] hover:bg-[#202c33]'
                    }`}
                  >
                    <Camera className="w-16 h-16 text-[#00a884]" />
                  </div>
                )}
              </>
            )}

            {/* AUDIO VOICE NOTE */}
            {mediaCategory === 'audio' && (
              <>
                {!audioUrl ? (
                  <div
                    onClick={() => audioInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) processAudioFile(file);
                    }}
                    className={`w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                      isDragging
                        ? 'border-[#00a884] bg-[#00a884]/20 scale-105'
                        : 'border-[#00a884]/60 bg-[#202c33]/80 hover:border-[#00a884] hover:bg-[#202c33]'
                    }`}
                  >
                    <Mic className="w-16 h-16 text-[#00a884]" />
                  </div>
                ) : (
                  <div className="w-full max-w-xs space-y-4 p-4 rounded-3xl bg-[#1f2c34] border border-[#2a3942]">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setAudioUrl('');
                          setAudioFileName('');
                        }}
                        className="p-1 rounded-full text-neutral-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#202c33] flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (!audioPreviewRef.current) return;
                          if (isAudioPlaying) {
                            audioPreviewRef.current.pause();
                            setIsAudioPlaying(false);
                          } else {
                            audioPreviewRef.current.play();
                            setIsAudioPlaying(true);
                          }
                        }}
                        className="w-12 h-12 rounded-full bg-[#00a884] text-[#111b21] flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-all"
                      >
                        {isAudioPlaying ? (
                          <Pause className="w-5 h-5 fill-[#111b21]" />
                        ) : (
                          <Play className="w-5 h-5 fill-[#111b21] ml-0.5" />
                        )}
                      </button>

                      <audio
                        ref={audioPreviewRef}
                        src={audioUrl}
                        onEnded={() => setIsAudioPlaying(false)}
                        className="hidden"
                      />

                      <div className="flex-1 flex items-center justify-center gap-1 h-10 py-1 bg-[#111b21] rounded-xl px-3 border border-[#202c33]">
                        {[10, 24, 36, 18, 28, 40, 22, 14, 30, 42, 18, 12, 26, 38, 24, 16].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-300 ${
                              isAudioPlaying ? 'bg-[#00a884] animate-pulse' : 'bg-[#8696a0]/40'
                            }`}
                            style={{ height: isAudioPlaying ? `${h}px` : '10px' }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* PDF DOCUMENT */}
            {mediaCategory === 'pdf' && (
              <>
                {pdfError && (
                  <div className="absolute top-4 inset-x-4 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{pdfError}</span>
                  </div>
                )}

                {!pdfUrl ? (
                  <div
                    onClick={() => pdfInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) processPdfFile(file);
                    }}
                    className={`w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                      isDragging
                        ? 'border-rose-500 bg-rose-500/20 scale-105'
                        : 'border-rose-500/60 bg-[#202c33]/80 hover:border-rose-500 hover:bg-[#202c33]'
                    }`}
                  >
                    <FileText className="w-16 h-16 text-rose-500" />
                  </div>
                ) : (
                  <div className="w-full max-w-xs space-y-4 p-4 rounded-3xl bg-[#111b21] border border-[#222d34]">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setPdfUrl('');
                          setPdfFileName('');
                        }}
                        className="p-1 rounded-full text-neutral-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#202c33] border border-[#2a3942] flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-rose-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {pdfFileName || 'Document.pdf'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom controls: icons only, no text labels */}
      <div className="relative z-30 p-3 md:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-2.5">
        {/* Format Switcher (Pure icons) */}
        <div className="flex items-center justify-center gap-2 pb-1">
          <button
            type="button"
            onClick={() => {
              setMode('media');
              setMediaCategory('photo_video');
              soundEngine.playPop();
            }}
            className={`p-2.5 rounded-full transition-all ${
              mode === 'media' && mediaCategory === 'photo_video'
                ? 'bg-[#00a884] text-[#111b21] shadow-lg scale-110'
                : 'bg-[#202c33]/90 text-[#8696a0] hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('media');
              setMediaCategory('audio');
              soundEngine.playPop();
            }}
            className={`p-2.5 rounded-full transition-all ${
              mode === 'media' && mediaCategory === 'audio'
                ? 'bg-[#00a884] text-[#111b21] shadow-lg scale-110'
                : 'bg-[#202c33]/90 text-[#8696a0] hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('media');
              setMediaCategory('pdf');
              soundEngine.playPop();
            }}
            className={`p-2.5 rounded-full transition-all ${
              mode === 'media' && mediaCategory === 'pdf'
                ? 'bg-rose-600 text-white shadow-lg scale-110'
                : 'bg-[#202c33]/90 text-[#8696a0] hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Emoji Strip */}
        {showEmojiPicker && (
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#202c33] border border-[#2a3942] overflow-x-auto">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  if (mode === 'text') {
                    setTextContent((prev) => prev + emoji);
                  } else {
                    setCaption((prev) => prev + ' ' + emoji);
                  }
                  soundEngine.playPop();
                }}
                className="text-lg hover:scale-125 transition-transform p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Caption typing bar for media mode */}
        {mode === 'media' && (
          <div className="flex items-center gap-2 bg-[#202c33] border border-[#2a3942] rounded-full pl-3 pr-1.5 py-1.5 shadow-lg">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-[#8696a0] hover:text-white transition-colors p-1"
            >
              <Smile className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder=""
              className="flex-1 bg-transparent text-sm text-white placeholder-[#8696a0] focus:outline-none py-1"
            />

            {/* One time view button */}
            <button
              type="button"
              onClick={() => {
                setIsPrivate(!isPrivate);
                soundEngine.playPop();
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                isPrivate
                  ? 'bg-[#00a884] text-[#111b21] ring-2 ring-[#00a884]/40 font-black'
                  : 'bg-transparent text-[#8696a0] hover:text-white border border-[#8696a0]/40'
              }`}
              title="View once"
            >
              <span className="font-mono text-xs">1</span>
            </button>

            {/* Send button moved inside the typing bar next to one time view button */}
            <button
              type="button"
              onClick={handlePublish}
              className="w-8 h-8 rounded-full bg-[#00a884] hover:bg-[#008f6f] active:scale-95 text-[#111b21] flex items-center justify-center shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4 fill-[#111b21] -rotate-12 translate-x-0.5" />
            </button>
          </div>
        )}

        {/* In text mode, send button positioned cleanly at bottom right */}
        {mode === 'text' && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handlePublish}
              className="w-12 h-12 rounded-full bg-[#00a884] hover:bg-[#008f6f] active:scale-95 text-[#111b21] flex items-center justify-center shadow-xl shadow-[#00a884]/20 transition-all font-bold group"
            >
              <Send className="w-5 h-5 fill-[#111b21] -rotate-12 translate-x-0.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
