import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  ShieldCheck,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  X,
  Pin,
  Clock,
  ChevronDown,
  Trash2,
  Check,
  CreditCard,
  Image as ImageIcon,
  FileText,
  MapPin,
  ShoppingBag,
  FileEdit,
  ArrowLeft,
  MessageSquare,
  Layers,
  Settings,
  Archive,
  ArchiveRestore,
  User as UserIcon,
  UploadCloud,
  FileUp,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { MessageItem } from './MessageItem';
import { Message, ProductInfo } from '../types';
import { soundEngine } from '../utils/audioSynth';
import { EmojibasePicker } from './EmojibasePicker';
import { extractActiveShortcode, searchEmojibase } from '../utils/emojibaseData';

export interface PreparedAttachment {
  id: string;
  file: File;
  name: string;
  size: string;
  type: 'image' | 'file';
  mimeType: string;
  previewUrl: string;
}

export const ChatArea: React.FC = () => {
  const {
    activeRoom,
    messages,
    sendMessage,
    currentUser,
    users,
    typingUsers,
    sendTypingNotification,
    simulatePeerTyping,
    startCall,
    setIsE2EEOpen,
    setIsBlueprintOpen,
    updateDisappearingTimer,
    summarizeCurrentRoom,
    generateSmartReplies,
    rewriteText,
    products,
    createInvoiceInChat,
    shareProductInChat,
    jitsiServerConfig,
    setActiveRoomId,
    setIsSettingsOpen,
    toggleArchiveRoom,
    openUserProfile,
  } = useChat();

  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDisappearingMenu, setShowDisappearingMenu] = useState(false);
  const [showSmartReplies, setShowSmartReplies] = useState(true);
  const [smartReplies, setSmartReplies] = useState<string[]>([
    'Sounds great! 👍',
    'Received with thanks',
    'Let me check on this 🚀',
  ]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  // Invoice creation mini-modal
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState('50');
  const [invoiceDesc, setInvoiceDesc] = useState('Consultation & Architecture Review');
  const [invoiceCurrency, setInvoiceCurrency] = useState<'USD' | 'KES' | 'NGN' | 'GHS'>('USD');
  const [invoiceMethod, setInvoiceMethod] = useState<'M-Pesa' | 'MTN MoMo' | 'Card'>('M-Pesa');

  // Product share mini-modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Staged / Prepared attachments
  const [preparedAttachments, setPreparedAttachments] = useState<PreparedAttachment[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounterRef = useRef(0);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const processFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;

    const newItems: PreparedAttachment[] = [];

    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      let previewUrl = '';

      if (isImage) {
        try {
          previewUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve(URL.createObjectURL(file));
            reader.readAsDataURL(file);
          });
        } catch {
          previewUrl = URL.createObjectURL(file);
        }
      } else {
        try {
          previewUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve(URL.createObjectURL(file));
            reader.readAsDataURL(file);
          });
        } catch {
          previewUrl = URL.createObjectURL(file);
        }
      }

      newItems.push({
        id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: isImage ? 'image' : 'file',
        mimeType: file.type || 'application/octet-stream',
        previewUrl,
      });
    }

    setPreparedAttachments((prev) => [...prev, ...newItems]);
    soundEngine.playPop();
  };

  const handleRemoveAttachment = (id: string) => {
    setPreparedAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOver(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDraggingOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files) as File[];
      await processFiles(droppedFiles);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active Emojibase shortcode autocomplete
  const activeShortcode = extractActiveShortcode(inputText || '');
  const shortcodeSuggestions = activeShortcode
    ? (searchEmojibase(activeShortcode.activeQuery) || []).slice(0, 6)
    : [];

  const handleApplyShortcode = (emojiStr: string) => {
    if (!activeShortcode) return;
    const current = inputText || '';
    const newText =
      current.slice(0, activeShortcode.startIndex) + emojiStr + ' ';
    setInputText(newText);
    textareaRef.current?.focus();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  // Voice recording timer
  useEffect(() => {
    let interval: any = null;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Load smart replies when new message arrives
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.senderId !== currentUser.id && lastMsg.type === 'text') {
      generateSmartReplies(lastMsg.text).then((replies) => {
        if (replies && replies.length > 0) {
          setSmartReplies(replies);
          setShowSmartReplies(true);
        }
      });
    }
  }, [messages.length]);

  if (!activeRoom) {
    return (
      <div className="hidden md:flex flex-1 bg-[#FAFAFC] flex-col items-center justify-center text-center p-8 select-none relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-white border border-black/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.06)] flex items-center justify-center text-black mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">WAT Crystal Messenger</h2>
        <p className="text-sm text-neutral-500 max-w-sm mt-1.5 leading-relaxed">
          Select a conversation from your address book to chat with end-to-end encryption.
        </p>
      </div>
    );
  }

  // Find peer user
  const peerId =
    activeRoom.type === 'direct'
      ? activeRoom.memberIds.find((id) => id !== currentUser.id) || activeRoom.memberIds[0]
      : null;
  const peer = peerId ? users.find((u) => u.id === peerId) : null;

  // Pinned message
  const pinnedMessage = messages.find((m) => m.isPinned);

  const handleSend = () => {
    const hasAttachments = preparedAttachments.length > 0;
    const hasText = !!inputText.trim();

    if (!hasText && !hasAttachments) return;

    if (editingMessage) {
      // Edit mode
      // handled via context
      setEditingMessage(null);
    } else if (hasAttachments) {
      // Send prepared attachments via existing attachment system
      preparedAttachments.forEach((att, idx) => {
        sendMessage({
          text: idx === 0 && hasText ? inputText.trim() : (att.type === 'file' ? att.name : ''),
          type: att.type,
          mediaUrl: att.previewUrl,
          mediaInfo: {
            fileName: att.name,
            fileSize: att.size,
            mimeType: att.mimeType,
          },
          replyTo: idx === 0 ? (replyingTo || undefined) : undefined,
        });
      });
      setPreparedAttachments([]);
    } else {
      sendMessage({
        text: inputText.trim(),
        type: 'text',
        replyTo: replyingTo || undefined,
      });
    }

    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
    setShowSmartReplies(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartVoiceRecord = () => {
    soundEngine.playRecordBeep();
    setIsRecordingVoice(true);
  };

  const handleCancelVoiceRecord = () => {
    setIsRecordingVoice(false);
  };

  const handleSendVoiceRecord = () => {
    setIsRecordingVoice(false);
    soundEngine.playMessageSent();
    sendMessage({
      text: 'Voice message',
      type: 'audio',
      mediaUrl: 'simulated_voice_note.mp3',
      mediaInfo: {
        duration: Math.max(3, recordingSeconds),
        waveform: [0.2, 0.5, 0.9, 0.6, 0.8, 1.0, 0.4, 0.7, 0.9, 0.3, 0.6, 0.8, 0.4],
        fileName: `Voice_note_${new Date().toLocaleTimeString().replace(/:/g, '')}.wav`,
        fileSize: `${Math.round(recordingSeconds * 24 + 80)} KB`,
      },
    });
  };

  const handleAIMagicRewrite = async (tone: string) => {
    if (!inputText.trim()) return;
    setIsRewriting(true);
    const rewritten = await rewriteText(inputText, tone);
    setInputText(rewritten);
    setIsRewriting(false);
  };

  const handleOpenSummarize = async () => {
    setIsSummarizing(true);
    setSummaryModalOpen(true);
    const summary = await summarizeCurrentRoom();
    setSummaryText(summary);
    setIsSummarizing(false);
  };

  const handleSendLocation = () => {
    setShowAttachmentMenu(false);
    sendMessage({
      text: '📍 Live location shared',
      type: 'location',
      locationInfo: {
        latitude: -1.2921,
        longitude: 36.8219,
        title: 'WAT Nairobi Engineering Lab',
        address: 'Riverside Drive, Westlands, Nairobi, Kenya',
      },
    });
  };

  const handleSendPhoto = (photoUrl: string, caption: string) => {
    setShowAttachmentMenu(false);
    sendMessage({
      text: caption || 'Shared photo',
      type: 'image',
      mediaUrl: photoUrl,
      mediaInfo: {
        fileName: 'IMG_' + Date.now().toString().slice(-4) + '.jpg',
        fileSize: '1.8 MB',
      },
    });
  };

  return (
    <div
      id="chat-area-container"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 flex flex-col h-full bg-[#FAFAFC] min-w-0 relative"
    >
      {/* Hidden file inputs for manual click-to-upload */}
      <input
        id="chat-image-file-input"
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files) as File[]);
            e.target.value = '';
          }
        }}
      />
      <input
        id="chat-doc-file-input"
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,application/*,text/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files) as File[]);
            e.target.value = '';
          }
        }}
      />

      {/* Visual Drag-and-Drop Target Overlay */}
      {isDraggingOver && (
        <div
          id="chat-drag-drop-zone-overlay"
          className="absolute inset-0 z-50 bg-white/92 backdrop-blur-md flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-500 rounded-3xl m-3 pointer-events-none transition-all shadow-2xl animate-fade-in"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 shadow-xl">
            <UploadCloud className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 tracking-tight">
            Drop files to attach
          </h3>
          <p className="text-sm text-neutral-500 mt-1 max-w-sm text-center leading-relaxed">
            Drop images or documents here to prepare them for sending via the attachment system.
          </p>
          <div className="flex items-center gap-3 mt-5 text-xs font-semibold text-neutral-700 bg-black/[0.04] px-4 py-2 rounded-full border border-black/[0.06]">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-500" /> Images
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-500" /> Documents & PDFs
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1.5">
              <FileUp className="w-4 h-4 text-purple-500" /> Multi-file ready
            </span>
          </div>
        </div>
      )}
      {/* Top Header */}
      <header className="h-16 px-3 md:px-4 bg-white/85 backdrop-blur-2xl border-b border-black/[0.06] flex items-center justify-between z-20 shrink-0 select-none shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        {/* Room Info & Mobile Back Button */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button
            onClick={() => setActiveRoomId('')}
            className="md:hidden p-1.5 -ml-1 text-neutral-500 hover:text-black hover:bg-black/[0.04] rounded-xl"
            title="Back to chats"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Clickable peer info to open Profile */}
          <div
            id="chat-header-user-info"
            onClick={() => {
              if (peer) {
                openUserProfile(peer);
              } else if (activeRoom.type === 'direct') {
                const other = users.find(
                  (u) => activeRoom.memberIds.includes(u.id) && u.id !== currentUser.id
                );
                if (other) openUserProfile(other);
              }
            }}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer p-1.5 -ml-1.5 rounded-2xl hover:bg-black/[0.04] transition-colors group"
            title="View Profile & Contact Info"
          >
            <div className="relative shrink-0">
              <img
                src={activeRoom.avatar}
                alt={activeRoom.name}
                className="w-10 h-10 rounded-2xl object-cover ring-1 ring-black/10 group-hover:ring-black transition-all shadow-sm"
              />
              {activeRoom.type === 'direct' && peer && (
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${
                    peer.isOnline ? 'bg-emerald-500' : 'bg-neutral-300'
                  }`}
                />
              )}
            </div>

            <div className="flex flex-col min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-neutral-900 group-hover:text-black transition-colors truncate">
                  {activeRoom.name}
                </h2>
                {activeRoom.isEncrypted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsE2EEOpen(true);
                    }}
                    className="text-emerald-600 hover:text-emerald-700"
                    title="E2EE Olm/Megolm Encrypted"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Subtitle / typing indicator */}
              <div className="text-[11px] text-neutral-500 truncate flex items-center gap-1">
                {typingUsers.length > 0 ? (
                  <span className="text-emerald-600 font-medium animate-pulse">
                    {typingUsers.join(', ')} is typing...
                  </span>
                ) : activeRoom.type === 'direct' && peer ? (
                  <span>
                    {peer.isOnline
                      ? 'Active now • Tap for profile'
                      : `Last seen ${peer.lastSeen || 'recently'} • Tap for profile`}
                  </span>
                ) : (
                  <span>{activeRoom.memberIds.length} participants</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Voice Call, Video Call, Summary, Menu */}
        <div className="flex items-center gap-1">
          {/* Summarize Button */}
          <button
            onClick={handleOpenSummarize}
            className="px-2.5 py-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 border border-black/[0.06] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="Conversation Summary"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-700" />
            <span className="hidden sm:inline">Summary</span>
          </button>

          {/* WebRTC Voice Call */}
          <button
            onClick={() => startCall(activeRoom.id, 'voice')}
            className="p-2 rounded-xl text-neutral-600 hover:text-black hover:bg-black/[0.04] transition-colors"
            title="Start Voice Call"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* WebRTC Video Call */}
          <button
            onClick={() => startCall(activeRoom.id, 'video')}
            className="p-2 rounded-xl text-neutral-600 hover:text-black hover:bg-black/[0.04] transition-colors"
            title="Start Video Call"
          >
            <Video className="w-4 h-4" />
          </button>

          {/* Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-black/[0.04] transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showOptionsMenu && (
              <div className="absolute right-0 top-11 bg-white border border-black/[0.08] rounded-2xl p-1.5 shadow-2xl min-w-[190px] z-30 flex flex-col gap-0.5">
                {(peer || activeRoom.type === 'direct') && (
                  <button
                    onClick={() => {
                      setShowOptionsMenu(false);
                      if (peer) openUserProfile(peer);
                      else {
                        const other = users.find(
                          (u) => activeRoom.memberIds.includes(u.id) && u.id !== currentUser.id
                        );
                        if (other) openUserProfile(other);
                      }
                    }}
                    className="text-left px-3 py-1.5 text-xs text-neutral-800 hover:bg-black/[0.04] rounded-xl flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-neutral-700" />
                    <span>View User Profile</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowDisappearingMenu(true);
                  }}
                  className="text-left px-3 py-1.5 text-xs text-neutral-800 hover:bg-black/[0.04] rounded-xl flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Disappearing Messages</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {activeRoom.disappearingTimer === 0
                      ? 'Off'
                      : activeRoom.disappearingTimer === 86400
                      ? '24h'
                      : `${activeRoom.disappearingTimer}s`}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setIsE2EEOpen(true);
                  }}
                  className="text-left px-3 py-1.5 text-xs text-neutral-800 hover:bg-black/[0.04] rounded-xl flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Verify Encryption Keys</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    simulatePeerTyping();
                  }}
                  className="text-left px-3 py-1.5 text-xs text-neutral-800 hover:bg-black/[0.04] rounded-xl flex items-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Simulate Typing</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setIsBlueprintOpen(true);
                  }}
                  className="text-left px-3 py-1.5 text-xs text-neutral-800 hover:bg-black/[0.04] rounded-xl flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Session Blueprint</span>
                </button>

                <div className="h-px bg-black/[0.06] my-0.5" />

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    toggleArchiveRoom(activeRoom.id);
                  }}
                  className="text-left px-3 py-1.5 text-xs text-neutral-800 hover:bg-black/[0.04] rounded-xl flex items-center gap-2"
                >
                  {activeRoom.isArchived ? (
                    <>
                      <ArchiveRestore className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Unarchive Chat</span>
                    </>
                  ) : (
                    <>
                      <Archive className="w-3.5 h-3.5 text-teal-400" />
                      <span>Archive Chat</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setIsSettingsOpen(true);
                  }}
                  className="text-left px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Settings & Preferences</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Disappearing timer selector banner if opened */}
      {showDisappearingMenu && (
        <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center justify-between text-xs z-10 animate-fade-in">
          <div className="flex items-center gap-2 text-neutral-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Set Disappearing Messages Timer:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { label: 'Off', seconds: 0 },
              { label: '30s (Demo)', seconds: 30 },
              { label: '24 Hours', seconds: 86400 },
              { label: '7 Days', seconds: 604800 },
            ].map((t) => (
              <button
                key={t.seconds}
                onClick={() => {
                  updateDisappearingTimer(activeRoom.id, t.seconds);
                  setShowDisappearingMenu(false);
                }}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  activeRoom.disappearingTimer === t.seconds
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={() => setShowDisappearingMenu(false)}
              className="p-1 text-neutral-400 hover:text-neutral-200 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Pinned Message Alert Header */}
      {pinnedMessage && (
        <div className="bg-neutral-900/70 border-b border-neutral-800/80 px-4 py-1.5 flex items-center justify-between text-xs text-neutral-300 z-10">
          <div className="flex items-center gap-2 min-w-0">
            <Pin className="w-3.5 h-3.5 text-emerald-400 rotate-45 shrink-0" />
            <span className="font-semibold text-emerald-400 shrink-0 text-[11px]">
              Pinned:
            </span>
            <span className="truncate text-neutral-300 text-[11px]">
              {pinnedMessage.text}
            </span>
          </div>
          <button
            onClick={() => {
              // scroll to pinned message
              scrollToBottom();
            }}
            className="text-[10px] text-emerald-400 hover:underline shrink-0 ml-2 font-mono"
          >
            View
          </button>
        </div>
      )}

      {/* Messages Scroll Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {/* E2EE Security Intro Banner */}
        <div className="my-3 mx-auto max-w-md p-3.5 rounded-2xl bg-white/80 border border-black/[0.06] text-center text-xs text-neutral-600 shadow-[0_4px_20px_rgba(0,0,0,0.03)] select-none">
          <div className="flex items-center justify-center gap-1.5 text-neutral-900 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Matrix End-to-End Encrypted</span>
          </div>
          <p className="text-[11px] leading-relaxed text-neutral-500">
            Messages and calls are encrypted with Olm/Megolm. Only you and recipients hold the cryptographic keys.
          </p>
        </div>

        {/* Render all messages in room */}
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === currentUser.id}
            onReply={(m) => setReplyingTo(m)}
            onStartEdit={(m) => {
              setEditingMessage(m);
              setInputText(m.text);
              textareaRef.current?.focus();
            }}
          />
        ))}

        {/* Subtle Matrix 'is typing...' Animated Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 py-1.5 px-3 rounded-2xl bg-white/90 border border-black/[0.06] shadow-sm w-fit max-w-[90%] select-none animate-in fade-in slide-in-from-bottom-1 duration-200">
            <div className="relative shrink-0">
              {peer?.avatar ? (
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="w-5 h-5 rounded-full object-cover border border-black/10"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-black/[0.06] text-neutral-800 font-bold flex items-center justify-center text-[9px]">
                  {typingUsers[0]?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-neutral-800 font-medium text-[11px] truncate">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing
              </span>

              {/* 3 Bouncing Dots */}
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
              </div>
            </div>

            <span className="text-[9px] font-mono text-neutral-400 ml-1">
              m.typing
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Chip Bar */}
      {showSmartReplies && smartReplies.length > 0 && (
        <div className="px-4 py-1.5 bg-white/80 backdrop-blur-md border-t border-black/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar select-none">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0">
            Suggestions:
          </span>
          {smartReplies.map((replyText, i) => (
            <button
              key={i}
              onClick={() => {
                sendMessage({ text: replyText, type: 'text' });
                setShowSmartReplies(false);
              }}
              className="px-3 py-1 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 text-xs font-medium border border-black/[0.06] whitespace-nowrap transition-transform active:scale-95 shadow-sm"
            >
              {replyText}
            </button>
          ))}
          <button
            onClick={() => setShowSmartReplies(false)}
            className="p-1 text-neutral-400 hover:text-black ml-auto shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quoted reply banner in composer */}
      {replyingTo && (
        <div className="px-4 py-2 bg-black/[0.03] border-t border-black/[0.06] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-1 h-6 bg-black rounded-full" />
            <div className="min-w-0">
              <span className="font-semibold text-neutral-900 text-[11px] block">
                Replying to {replyingTo.senderName}
              </span>
              <span className="text-neutral-500 truncate block text-[11px]">
                {replyingTo.text}
              </span>
            </div>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 text-neutral-400 hover:text-black rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Prepared / Staged Attachments Tray */}
      {preparedAttachments.length > 0 && (
        <div
          id="prepared-attachments-tray"
          className="px-4 py-2.5 bg-neutral-50/95 backdrop-blur-md border-t border-black/[0.08] select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                Prepared Attachments ({preparedAttachments.length})
              </span>
              <span className="text-[10px] text-neutral-500">
                Ready to send with your message
              </span>
            </div>
            <button
              id="discard-all-attachments-btn"
              type="button"
              onClick={() => setPreparedAttachments([])}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Discard all
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {preparedAttachments.map((att) => (
              <div
                key={att.id}
                id={`prepared-attachment-item-${att.id}`}
                className="relative group shrink-0 flex items-center gap-2.5 p-2 bg-white border border-black/[0.08] rounded-2xl shadow-sm hover:shadow-md transition-all max-w-[240px]"
              >
                {att.type === 'image' && att.previewUrl ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5 shrink-0 border border-black/[0.06]">
                    <img
                      src={att.previewUrl}
                      alt={att.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex flex-col items-center justify-center shrink-0 font-bold border border-emerald-500/20">
                    <FileText className="w-5 h-5" />
                    <span className="text-[8px] uppercase tracking-tighter mt-0.5">
                      {att.name.split('.').pop() || 'FILE'}
                    </span>
                  </div>
                )}

                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-xs font-bold text-neutral-900 truncate" title={att.name}>
                    {att.name}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    {att.size}
                  </p>
                </div>

                <button
                  id={`remove-prepared-attachment-${att.id}`}
                  type="button"
                  onClick={() => handleRemoveAttachment(att.id)}
                  title="Remove file"
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-900 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Quick Add More button */}
            <button
              id="add-more-attachments-btn"
              type="button"
              onClick={() => imageInputRef.current?.click()}
              title="Add more files"
              className="shrink-0 w-12 h-12 rounded-2xl border-2 border-dashed border-black/15 hover:border-emerald-500 hover:bg-emerald-50 text-neutral-400 hover:text-emerald-600 flex items-center justify-center transition-all"
            >
              <FileUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Composer Input Bar */}
      <div className="p-3 bg-white/85 backdrop-blur-2xl border-t border-black/[0.06] relative select-none shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        {/* Emojibase Shortcode Autocomplete Dropdown */}
        {shortcodeSuggestions.length > 0 && (
          <div className="absolute bottom-16 left-16 bg-white border border-black/[0.08] rounded-2xl p-1.5 shadow-2xl z-40 flex flex-col gap-1 min-w-[200px] animate-scale">
            <div className="px-2.5 py-1 text-[10px] font-mono text-neutral-700 font-bold border-b border-black/[0.06] flex items-center justify-between">
              <span>Matrix Emojibase</span>
              <span className="text-[9px] text-neutral-400">Tab / Tap to insert</span>
            </div>
            {shortcodeSuggestions.map((item) => (
              <button
                key={item.hexcode}
                type="button"
                onClick={() => handleApplyShortcode(item.emoji)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-black/[0.04] text-left transition-colors"
              >
                <span className="text-base">{item.emoji}</span>
                <span className="text-xs font-mono text-neutral-800">
                  :{item.shortcodes[0]}:
                </span>
                <span className="text-[10px] text-neutral-400 truncate ml-auto">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Full Emojibase Picker Popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 right-4 z-50">
            <EmojibasePicker
              onSelectEmoji={(emoji) => {
                setInputText((prev) => prev + emoji);
                setShowEmojiPicker(false);
              }}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}

        {/* Attachment Drawer Popover */}
        {showAttachmentMenu && (
          <div className="absolute bottom-16 left-4 bg-white border border-black/[0.08] rounded-3xl p-3 shadow-2xl z-30 grid grid-cols-3 gap-2 w-72 animate-scale">
            {/* Photo / Video */}
            <button
              id="attachment-photo-btn"
              onClick={() => {
                setShowAttachmentMenu(false);
                imageInputRef.current?.click();
              }}
              className="flex flex-col items-center p-2.5 rounded-2xl hover:bg-black/[0.04] text-neutral-800 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-2xl bg-black/[0.05] text-neutral-900 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Photo / Media</span>
            </button>

            {/* Document */}
            <button
              id="attachment-document-btn"
              onClick={() => {
                setShowAttachmentMenu(false);
                fileInputRef.current?.click();
              }}
              className="flex flex-col items-center p-2.5 rounded-2xl hover:bg-black/[0.04] text-neutral-800 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-2xl bg-black/[0.05] text-neutral-900 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Document</span>
            </button>

            {/* Live Location */}
            <button
              onClick={handleSendLocation}
              className="flex flex-col items-center p-2.5 rounded-2xl hover:bg-black/[0.04] text-neutral-800 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-2xl bg-black/[0.05] text-neutral-900 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Location</span>
            </button>

            {/* Mobile Money Invoice */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                setIsInvoiceModalOpen(true);
              }}
              className="flex flex-col items-center p-2.5 rounded-2xl hover:bg-black/[0.04] text-neutral-800 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-2xl bg-black/[0.05] text-neutral-900 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Invoice Pay</span>
            </button>

            {/* Product Catalog */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                setIsProductModalOpen(true);
              }}
              className="flex flex-col items-center p-2.5 rounded-2xl hover:bg-black/[0.04] text-neutral-800 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-2xl bg-black/[0.05] text-neutral-900 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Catalog Item</span>
            </button>

            {/* Voice Clip */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                handleStartVoiceRecord();
              }}
              className="flex flex-col items-center p-2.5 rounded-2xl hover:bg-black/[0.04] text-neutral-800 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-2xl bg-black/[0.05] text-neutral-900 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Voice Note</span>
            </button>

            {/* Jitsi Video Meeting Invitation */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                const roomClean = `wat-${activeRoom.id.replace(/[^a-zA-Z0-9]/g, '')}`;
                sendMessage(
                  activeRoom.id,
                  `📹 Jitsi Video Conference Meeting Link: https://${jitsiServerConfig.serverDomain}/${roomClean}\nJoin securely via web or Jitsi Meet mobile app (E2EE Active).`
                );
              }}
              className="flex flex-col items-center p-2.5 rounded-2xl hover:bg-black/[0.04] text-neutral-800 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-2xl bg-black/[0.05] text-neutral-900 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Jitsi Meeting</span>
            </button>
          </div>
        )}

        {/* Voice Recording Active UI Bar */}
        {isRecordingVoice ? (
          <div className="flex items-center justify-between bg-white border border-rose-500/50 rounded-2xl px-4 py-2.5 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-rose-600">
                Recording: 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
              </span>
              <span className="text-[11px] text-neutral-500 italic">
                Live audio capture active...
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelVoiceRecord}
                className="p-2 rounded-xl text-neutral-500 hover:text-rose-500 hover:bg-black/[0.04] transition-colors"
                title="Cancel recording"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleSendVoiceRecord}
                className="px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Voice Note</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            {/* Attachment Button */}
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2.5 rounded-2xl text-neutral-500 hover:text-black hover:bg-black/[0.04] transition-colors"
              title="Add attachment (Photo, Audio, Location, Invoice, Product)"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Input Container */}
            <div className="flex-1 bg-black/[0.03] focus-within:bg-white border border-black/[0.08] focus-within:border-black/30 rounded-2xl px-3 py-2 flex items-center gap-2 transition-all shadow-inner">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (e.target.value.length > 0) {
                    sendTypingNotification(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  editingMessage
                    ? 'Editing message...'
                    : activeRoom.isEncrypted
                    ? 'Type end-to-end encrypted message...'
                    : 'Type a message...'
                }
                rows={1}
                className="flex-1 bg-transparent text-xs md:text-sm text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none max-h-28"
              />

              {/* Tone Formatting Dropdown */}
              {inputText.trim().length > 3 && (
                <div className="relative group">
                  <button
                    onClick={() => handleAIMagicRewrite('professional')}
                    disabled={isRewriting}
                    className="p-1 text-neutral-700 hover:text-black hover:bg-black/[0.05] rounded-lg transition-colors"
                    title="Polish Draft"
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Emojibase Picker Toggle */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-1.5 rounded-xl transition-colors ${
                  showEmojiPicker
                    ? 'text-black bg-black/[0.08]'
                    : 'text-neutral-400 hover:text-black hover:bg-black/[0.04]'
                }`}
                title="Emotes Picker"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            {/* Mic / Send Button */}
            {inputText.trim().length > 0 || preparedAttachments.length > 0 ? (
              <button
                id="chat-send-btn"
                onClick={handleSend}
                className="p-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold transition-transform active:scale-95 shadow-md shadow-black/20 relative"
                title={
                  preparedAttachments.length > 0
                    ? `Send with ${preparedAttachments.length} attachment(s)`
                    : 'Send Message'
                }
              >
                <Send className="w-5 h-5" />
                {preparedAttachments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                    {preparedAttachments.length}
                  </span>
                )}
              </button>
            ) : (
              <button
                id="chat-mic-record-btn"
                onClick={handleStartVoiceRecord}
                className="p-2.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-700 hover:text-black transition-transform active:scale-95"
                title="Hold to record voice note"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary Modal */}
      {summaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-scale">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-neutral-100">
                  Conversation Summary
                </h3>
              </div>
              <button
                onClick={() => setSummaryModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              {isSummarizing ? (
                <div className="py-8 flex flex-col items-center gap-3 text-neutral-400 text-xs">
                  <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span>Generating summary...</span>
                </div>
              ) : (
                <div className="text-xs md:text-sm text-neutral-200 leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap">
                  {summaryText}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-mono">
                Matrix Enterprise Secure Engine
              </span>
              <button
                onClick={() => setSummaryModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Mobile Money Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-neutral-100">
                  Create Mobile Pay Invoice
                </h3>
              </div>
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Amount
                </label>
                <div className="flex gap-2 mt-1">
                  <select
                    value={invoiceCurrency}
                    onChange={(e: any) => setInvoiceCurrency(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="GHS">GHS (GH₵)</option>
                  </select>
                  <input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Description / Service
                </label>
                <input
                  type="text"
                  value={invoiceDesc}
                  onChange={(e) => setInvoiceDesc(e.target.value)}
                  className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Preferred Settlement Gateway
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(['M-Pesa', 'MTN MoMo', 'Card'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setInvoiceMethod(method)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        invoiceMethod === method
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  createInvoiceInChat(
                    parseFloat(invoiceAmount) || 50,
                    invoiceCurrency,
                    invoiceDesc,
                    invoiceMethod
                  );
                  setIsInvoiceModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400"
              >
                Send Invoice to Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-neutral-100">
                  Select Product to Share
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 py-4 max-h-72 overflow-y-auto">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    shareProductInChat(prod);
                    setIsProductModalOpen(false);
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 cursor-pointer transition-colors"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-100 truncate">
                      {prod.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {prod.category}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 shrink-0">
                    ${prod.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
