import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  X,
  Smile,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  EMOJI_CATEGORIES,
  SKIN_TONE_MODIFIERS,
  EMOJIBASE_DATASET,
  searchEmojibase,
  getEmojiWithSkinTone,
} from '../utils/emojibaseData';
import { EmojiCategory, EmojiSkinTone, EmojibaseItem } from '../types';
import { PremiumEmoji } from './PremiumEmoji';

interface EmojibasePickerProps {
  onSelectEmoji: (emojiStr: string, item?: EmojibaseItem) => void;
  onClose?: () => void;
  compact?: boolean;
}

export const EmojibasePicker: React.FC<EmojibasePickerProps> = ({
  onSelectEmoji,
  onClose,
  compact = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EmojiCategory>('smileys_emotion');
  const [searchQuery, setSearchQuery] = useState('');
  const [skinTone, setSkinTone] = useState<EmojiSkinTone>('default');
  const [activeItemPreview, setActiveItemPreview] = useState<EmojibaseItem | null>(null);

  const displayedEmojis = searchEmojibase(searchQuery, searchQuery ? undefined : selectedCategory);

  return (
    <div
      className={`bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col z-50 animate-fade-in text-neutral-900 ${
        compact ? 'w-72 max-h-80' : 'w-80 sm:w-96 max-h-96'
      }`}
    >
      {/* Header with Search and Skin Tone Selector */}
      <div className="p-3 border-b border-black/[0.06] bg-neutral-50/80 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search premium emojis & shortcodes..."
              className="w-full bg-white border border-black/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black/30 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-black/[0.05] text-neutral-500 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Skin Tone Palette & Info */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-neutral-500 font-mono font-medium">Tone:</span>
            <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-black/[0.06] shadow-sm">
              {SKIN_TONE_MODIFIERS.map((st) => (
                <button
                  key={st.tone}
                  onClick={() => setSkinTone(st.tone)}
                  title={st.label}
                  className={`text-xs px-1 py-0.5 rounded hover:bg-black/[0.04] transition-all flex items-center justify-center ${
                    skinTone === st.tone ? 'ring-1 ring-black bg-black/[0.08]' : ''
                  }`}
                >
                  <PremiumEmoji emoji={st.swatch} className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Premium Vector HD
          </span>
        </div>
      </div>

      {/* Category Icons Navigation */}
      {!searchQuery && (
        <div className="flex items-center justify-around px-2 py-1.5 border-b border-black/[0.06] bg-neutral-50/40 overflow-x-auto no-scrollbar">
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              title={cat.name}
              className={`p-1.5 rounded-xl transition-all flex items-center justify-center ${
                selectedCategory === cat.id
                  ? 'bg-black text-white shadow-sm scale-110'
                  : 'opacity-70 hover:opacity-100 hover:bg-black/[0.04]'
              }`}
            >
              <PremiumEmoji emoji={cat.icon} className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="p-3 overflow-y-auto max-h-56 grid grid-cols-7 sm:grid-cols-8 gap-1.5 select-none custom-scrollbar">
        {displayedEmojis.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-neutral-400">
            No emojis match &quot;{searchQuery}&quot;
          </div>
        ) : (
          displayedEmojis.map((item) => {
            const finalEmoji = getEmojiWithSkinTone(item, skinTone);
            return (
              <button
                key={item.hexcode}
                onClick={() => onSelectEmoji(finalEmoji, item)}
                onMouseEnter={() => setActiveItemPreview(item)}
                title={`:${item.shortcodes[0]}:`}
                className={`flex items-center justify-center p-2 rounded-2xl hover:bg-black/[0.06] hover:scale-120 active:scale-95 transition-all ${
                  item.isCustomMatrix
                    ? 'col-span-3 text-xs font-mono font-bold bg-black text-white px-2 py-1 shadow-sm'
                    : ''
                }`}
              >
                <PremiumEmoji emoji={finalEmoji} className="w-6 h-6 pointer-events-none" />
              </button>
            );
          })
        )}
      </div>

      {/* Footer Preview / Shortcode Metadata */}
      <div className="px-3 py-2 bg-neutral-50 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-neutral-600 font-mono">
        {activeItemPreview ? (
          <div className="flex items-center gap-2 truncate">
            <PremiumEmoji
              emoji={getEmojiWithSkinTone(activeItemPreview, skinTone)}
              className="w-5 h-5 shrink-0"
            />
            <span className="font-bold text-neutral-900 truncate">
              :{activeItemPreview.shortcodes[0]}:
            </span>
            <span className="text-neutral-500 text-[10px] truncate hidden sm:inline">
              ({activeItemPreview.label})
            </span>
          </div>
        ) : (
          <span className="text-neutral-400">Hover emoji to view shortcode</span>
        )}

        <span className="text-[10px] text-neutral-500 font-bold shrink-0">
          m.reaction
        </span>
      </div>
    </div>
  );
};
