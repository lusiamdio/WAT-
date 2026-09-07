import React from 'react';
import { X, Command, Search, Sparkles, MessageSquare, Plus, ArrowRight, ShieldCheck, Phone, Zap } from 'lucide-react';
import { useChat } from '../context/ChatContext';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { setActiveTab, setIsUniversalSearchOpen, setIsCommandCenterOpen, setIsNewChatModalOpen } = useChat();

  if (!isOpen) return null;

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl+';

  const shortcutGroups = [
    {
      title: 'Global Navigation & Overlays',
      items: [
        {
          keys: [`${modKey}K`],
          description: 'Open Universal Search across chats, contacts, businesses, & calls',
          icon: Search,
          action: () => {
            onClose();
            setIsUniversalSearchOpen(true);
          },
        },
        {
          keys: [`${modKey}J`],
          description: 'Launch WAT AI Copilot & Voice Command Center',
          icon: Sparkles,
          action: () => {
            onClose();
            setIsCommandCenterOpen(true);
          },
        },
        {
          keys: [`${modKey}N`],
          description: 'Start a new conversation or create a Matrix encrypted room',
          icon: Plus,
          action: () => {
            onClose();
            setIsNewChatModalOpen(true);
          },
        },
        {
          keys: [`${modKey}/`, '?'],
          description: 'Open this Keyboard Shortcuts cheat sheet',
          icon: Command,
          action: () => {},
        },
        {
          keys: ['ESC'],
          description: 'Dismiss current modal, overlay, active call, or image viewer',
          icon: X,
          action: () => onClose(),
        },
      ],
    },
    {
      title: 'Tab Quick Switch',
      items: [
        {
          keys: [`${modKey}1`],
          description: 'Switch to Welcome Dashboard',
          action: () => {
            onClose();
            setActiveTab('dashboard');
          },
        },
        {
          keys: [`${modKey}2`],
          description: 'Switch to Encrypted Matrix Chats',
          action: () => {
            onClose();
            setActiveTab('chats');
          },
        },
        {
          keys: [`${modKey}3`],
          description: 'Switch to WAT Discover Layer',
          action: () => {
            onClose();
            setActiveTab('discover');
          },
        },
        {
          keys: [`${modKey}4`],
          description: 'Switch to Business Suite & Catalog',
          action: () => {
            onClose();
            setActiveTab('business');
          },
        },
        {
          keys: [`${modKey}5`],
          description: 'Switch to You Profile & Revolut Wallet',
          action: () => {
            onClose();
            setActiveTab('you');
          },
        },
      ],
    },
    {
      title: 'Chat & Messaging',
      items: [
        { keys: ['Enter'], description: 'Send current message' },
        { keys: ['Shift + Enter'], description: 'Insert new line in message compose area' },
        { keys: [':emoji_name'], description: 'Trigger inline Emojibase auto-completer' },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
              <Command className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Keyboard Shortcuts</h2>
              <p className="text-xs text-neutral-500">Fast navigation & pro power keys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {group.title}
              </h3>
              <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-100 bg-neutral-50/30 overflow-hidden">
                {group.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    onClick={item.action}
                    className={`flex items-center justify-between px-4 py-2.5 transition-colors ${
                      item.action ? 'hover:bg-neutral-100/70 cursor-pointer' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-neutral-800 flex items-center gap-2">
                      {item.icon && <item.icon className="w-4 h-4 text-neutral-400" />}
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-1 text-xs font-semibold font-mono bg-white border border-neutral-200 text-neutral-700 rounded-lg shadow-xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>Press <kbd className="px-1.5 py-0.5 font-mono text-[11px] bg-white border border-neutral-200 rounded">ESC</kbd> to dismiss any active modal</span>
          <span className="font-semibold text-neutral-900">WAT Desktop Hub</span>
        </div>
      </div>
    </div>
  );
};
