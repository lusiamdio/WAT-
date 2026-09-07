import { EmojibaseItem, EmojiCategory, EmojiSkinTone } from '../types';

export const EMOJI_CATEGORIES: { id: EmojiCategory; name: string; icon: string }[] = [
  { id: 'smileys_emotion', name: 'Smileys & Emotion', icon: '😀' },
  { id: 'people_body', name: 'People & Body', icon: '👋' },
  { id: 'animals_nature', name: 'Animals & Nature', icon: '🌿' },
  { id: 'food_drink', name: 'Food & Drink', icon: '☕' },
  { id: 'activities_travel', name: 'Activities & Travel', icon: '🚀' },
  { id: 'objects_symbols', name: 'Objects & Symbols', icon: '💡' },
  { id: 'flags', name: 'Flags', icon: '🏁' },
  { id: 'matrix_custom', name: 'Matrix Custom & Africa', icon: '⚡' },
];

export const SKIN_TONE_MODIFIERS: { tone: EmojiSkinTone; hex: string; label: string; swatch: string }[] = [
  { tone: 'default', hex: '', label: 'Default Yellow', swatch: '🟨' },
  { tone: 'light', hex: '1F3FB', label: 'Light', swatch: '🏻' },
  { tone: 'medium-light', hex: '1F3FC', label: 'Medium-Light', swatch: '🏼' },
  { tone: 'medium', hex: '1F3FD', label: 'Medium', swatch: '🏽' },
  { tone: 'medium-dark', hex: '1F3FE', label: 'Medium-Dark', swatch: '🏾' },
  { tone: 'dark', hex: '1F3FF', label: 'Dark', swatch: '🏿' },
];

export const EMOJIBASE_DATASET: EmojibaseItem[] = [
  // --- Smileys & Emotion ---
  {
    hexcode: '1F600',
    emoji: '😀',
    label: 'grinning face',
    shortcodes: ['grinning', 'smile', 'happy'],
    category: 'smileys_emotion',
    tags: ['face', 'grin', 'joy'],
  },
  {
    hexcode: '1F602',
    emoji: '😂',
    label: 'face with tears of joy',
    shortcodes: ['joy', 'lol', 'laugh', 'crying_laughing'],
    category: 'smileys_emotion',
    tags: ['tears', 'funny', 'hilarious'],
  },
  {
    hexcode: '1F923',
    emoji: '🤣',
    label: 'rolling on the floor laughing',
    shortcodes: ['rofl', 'rolling_laughing'],
    category: 'smileys_emotion',
    tags: ['floor', 'laugh', 'humor'],
  },
  {
    hexcode: '1F60D',
    emoji: '😍',
    label: 'smiling face with heart-eyes',
    shortcodes: ['heart_eyes', 'love', 'crush'],
    category: 'smileys_emotion',
    tags: ['affection', 'infatuation', 'eyes'],
  },
  {
    hexcode: '1F970',
    emoji: '🥰',
    label: 'smiling face with hearts',
    shortcodes: ['smiling_face_with_3_hearts', 'love_face'],
    category: 'smileys_emotion',
    tags: ['warmth', 'blush', 'adore'],
  },
  {
    hexcode: '1F60E',
    emoji: '😎',
    label: 'smiling face with sunglasses',
    shortcodes: ['sunglasses', 'cool', 'chill'],
    category: 'smileys_emotion',
    tags: ['slick', 'awesome', 'sun'],
  },
  {
    hexcode: '1F929',
    emoji: '🤩',
    label: 'star-struck',
    shortcodes: ['star_struck', 'stars'],
    category: 'smileys_emotion',
    tags: ['eyes', 'famous', 'amazed'],
  },
  {
    hexcode: '1F973',
    emoji: '🥳',
    label: 'partying face',
    shortcodes: ['partying_face', 'party', 'celebrate'],
    category: 'smileys_emotion',
    tags: ['hat', 'horn', 'confetti'],
  },
  {
    hexcode: '1F914',
    emoji: '🤔',
    label: 'thinking face',
    shortcodes: ['thinking', 'hmm', 'ponder'],
    category: 'smileys_emotion',
    tags: ['wonder', 'curious', 'doubt'],
  },
  {
    hexcode: '1FAE1',
    emoji: '🫡',
    label: 'saluting face',
    shortcodes: ['salute', 'saluting_face', 'respect'],
    category: 'smileys_emotion',
    tags: ['honor', 'yes_sir', 'military'],
  },
  {
    hexcode: '1F609',
    emoji: '😉',
    label: 'winking face',
    shortcodes: ['wink', 'winking'],
    category: 'smileys_emotion',
    tags: ['flirt', 'joke', 'playful'],
  },
  {
    hexcode: '1F60A',
    emoji: '😊',
    label: 'smiling face with smiling eyes',
    shortcodes: ['blush', 'proud', 'pleasant'],
    category: 'smileys_emotion',
    tags: ['happiness', 'cheerful'],
  },
  {
    hexcode: '1F642',
    emoji: '🙂',
    label: 'slightly smiling face',
    shortcodes: ['slight_smile', 'fine'],
    category: 'smileys_emotion',
    tags: ['calm', 'friendly'],
  },
  {
    hexcode: '1F928',
    emoji: '🤨',
    label: 'face with raised eyebrow',
    shortcodes: ['raised_eyebrow', 'suspicious'],
    category: 'smileys_emotion',
    tags: ['skeptical', 'disbelief'],
  },
  {
    hexcode: '1F60B',
    emoji: '😋',
    label: 'face savoring food',
    shortcodes: ['yum', 'delicious', 'tasty'],
    category: 'smileys_emotion',
    tags: ['tongue', 'nom'],
  },
  {
    hexcode: '1F605',
    emoji: '😅',
    label: 'grinning face with sweat',
    shortcodes: ['sweat_smile', 'whew', 'relief'],
    category: 'smileys_emotion',
    tags: ['nervous', 'close_call'],
  },
  {
    hexcode: '1F92F',
    emoji: '🤯',
    label: 'exploding head',
    shortcodes: ['exploding_head', 'mind_blown'],
    category: 'smileys_emotion',
    tags: ['shocked', 'unbelievable'],
  },
  {
    hexcode: '1F631',
    emoji: '😱',
    label: 'face screaming in fear',
    shortcodes: ['scream', 'fear', 'scared'],
    category: 'smileys_emotion',
    tags: ['munch', 'omg'],
  },
  {
    hexcode: '1F480',
    emoji: '💀',
    label: 'skull',
    shortcodes: ['skull', 'dead', 'skeleton'],
    category: 'smileys_emotion',
    tags: ['death', 'dying_laughing'],
  },
  {
    hexcode: '1F525',
    emoji: '🔥',
    label: 'fire',
    shortcodes: ['fire', 'flame', 'lit'],
    category: 'smileys_emotion',
    tags: ['hot', 'trendy', 'epic'],
  },
  {
    hexcode: '2728',
    emoji: '✨',
    label: 'sparkles',
    shortcodes: ['sparkles', 'magic', 'clean'],
    category: 'smileys_emotion',
    tags: ['stars', 'shiny', 'gemini'],
  },

  // --- People & Body ---
  {
    hexcode: '1F44D',
    emoji: '👍',
    label: 'thumbs up',
    shortcodes: ['thumbsup', '+1', 'like', 'approve'],
    category: 'people_body',
    tags: ['hand', 'yes', 'good'],
    skins: [
      { tone: 'light', emoji: '👍🏻', hexcode: '1F44D-1F3FB' },
      { tone: 'medium-light', emoji: '👍🏼', hexcode: '1F44D-1F3FC' },
      { tone: 'medium', emoji: '👍🏽', hexcode: '1F44D-1F3FD' },
      { tone: 'medium-dark', emoji: '👍🏾', hexcode: '1F44D-1F3FE' },
      { tone: 'dark', emoji: '👍🏿', hexcode: '1F44D-1F3FF' },
    ],
  },
  {
    hexcode: '1F44E',
    emoji: '👎',
    label: 'thumbs down',
    shortcodes: ['thumbsdown', '-1', 'dislike'],
    category: 'people_body',
    tags: ['hand', 'no', 'bad'],
    skins: [
      { tone: 'light', emoji: '👎🏻', hexcode: '1F44E-1F3FB' },
      { tone: 'medium-light', emoji: '👎🏼', hexcode: '1F44E-1F3FC' },
      { tone: 'medium', emoji: '👎🏽', hexcode: '1F44E-1F3FD' },
      { tone: 'medium-dark', emoji: '👎🏾', hexcode: '1F44E-1F3FE' },
      { tone: 'dark', emoji: '👎🏿', hexcode: '1F44E-1F3FF' },
    ],
  },
  {
    hexcode: '1F44F',
    emoji: '👏',
    label: 'clapping hands',
    shortcodes: ['clap', 'applause', 'bravo'],
    category: 'people_body',
    tags: ['congrats', 'cheer'],
    skins: [
      { tone: 'light', emoji: '👏🏻', hexcode: '1F44F-1F3FB' },
      { tone: 'medium-light', emoji: '👏🏼', hexcode: '1F44F-1F3FC' },
      { tone: 'medium', emoji: '👏🏽', hexcode: '1F44F-1F3FD' },
      { tone: 'medium-dark', emoji: '👏🏾', hexcode: '1F44F-1F3FE' },
      { tone: 'dark', emoji: '👏🏿', hexcode: '1F44F-1F3FF' },
    ],
  },
  {
    hexcode: '1F64F',
    emoji: '🙏',
    label: 'folded hands',
    shortcodes: ['pray', 'thanks', 'namaste', 'please'],
    category: 'people_body',
    tags: ['gratitude', 'bless'],
    skins: [
      { tone: 'light', emoji: '🙏🏻', hexcode: '1F64F-1F3FB' },
      { tone: 'medium-light', emoji: '🙏🏼', hexcode: '1F64F-1F3FC' },
      { tone: 'medium', emoji: '🙏🏽', hexcode: '1F64F-1F3FD' },
      { tone: 'medium-dark', emoji: '🙏🏾', hexcode: '1F64F-1F3FE' },
      { tone: 'dark', emoji: '🙏🏿', hexcode: '1F64F-1F3FF' },
    ],
  },
  {
    hexcode: '1F44B',
    emoji: '👋',
    label: 'waving hand',
    shortcodes: ['wave', 'hello', 'bye'],
    category: 'people_body',
    tags: ['greeting', 'welcome'],
    skins: [
      { tone: 'light', emoji: '👋🏻', hexcode: '1F44B-1F3FB' },
      { tone: 'medium-light', emoji: '👋🏼', hexcode: '1F44B-1F3FC' },
      { tone: 'medium', emoji: '👋🏽', hexcode: '1F44B-1F3FD' },
      { tone: 'medium-dark', emoji: '👋🏾', hexcode: '1F44B-1F3FE' },
      { tone: 'dark', emoji: '👋🏿', hexcode: '1F44B-1F3FF' },
    ],
  },
  {
    hexcode: '1FAF6',
    emoji: '🫶',
    label: 'heart hands',
    shortcodes: ['heart_hands', 'love_hands'],
    category: 'people_body',
    tags: ['love', 'appreciation'],
    skins: [
      { tone: 'light', emoji: '🫶🏻', hexcode: '1FAF6-1F3FB' },
      { tone: 'medium-light', emoji: '🫶🏼', hexcode: '1FAF6-1F3FC' },
      { tone: 'medium', emoji: '🫶🏽', hexcode: '1FAF6-1F3FD' },
      { tone: 'medium-dark', emoji: '🫶🏾', hexcode: '1FAF6-1F3FE' },
      { tone: 'dark', emoji: '🫶🏿', hexcode: '1FAF6-1F3FF' },
    ],
  },
  {
    hexcode: '1F4AA',
    emoji: '💪',
    label: 'flexed biceps',
    shortcodes: ['muscle', 'strong', 'flex'],
    category: 'people_body',
    tags: ['power', 'gym', 'resilience'],
    skins: [
      { tone: 'light', emoji: '💪🏻', hexcode: '1F4AA-1F3FB' },
      { tone: 'medium-light', emoji: '💪🏼', hexcode: '1F4AA-1F3FC' },
      { tone: 'medium', emoji: '💪🏽', hexcode: '1F4AA-1F3FD' },
      { tone: 'medium-dark', emoji: '💪🏾', hexcode: '1F4AA-1F3FE' },
      { tone: 'dark', emoji: '💪🏿', hexcode: '1F4AA-1F3FF' },
    ],
  },
  {
    hexcode: '1F91D',
    emoji: '🤝',
    label: 'handshake',
    shortcodes: ['handshake', 'deal', 'agreement'],
    category: 'people_body',
    tags: ['partner', 'meeting', 'contract'],
  },

  // --- Animals & Nature ---
  {
    hexcode: '1F981',
    emoji: '🦁',
    label: 'lion',
    shortcodes: ['lion', 'lion_face', 'safari'],
    category: 'animals_nature',
    tags: ['king', 'africa', 'wild'],
  },
  {
    hexcode: '1F418',
    emoji: '🐘',
    label: 'elephant',
    shortcodes: ['elephant', 'tembo'],
    category: 'animals_nature',
    tags: ['wildlife', 'savanna', 'nature'],
  },
  {
    hexcode: '1F334',
    emoji: '🌴',
    label: 'palm tree',
    shortcodes: ['palm_tree', 'palm', 'tropical'],
    category: 'animals_nature',
    tags: ['beach', 'oasis', 'sun'],
  },
  {
    hexcode: '1F33F',
    emoji: '🌿',
    label: 'herb',
    shortcodes: ['herb', 'leaf', 'green'],
    category: 'animals_nature',
    tags: ['botanical', 'flora', 'eco'],
  },
  {
    hexcode: '1F41D',
    emoji: '🐝',
    label: 'honeybee',
    shortcodes: ['bee', 'honeybee'],
    category: 'animals_nature',
    tags: ['insect', 'sweet', 'buzz'],
  },
  {
    hexcode: '1F30D',
    emoji: '🌍',
    label: 'globe showing Europe-Africa',
    shortcodes: ['earth_africa', 'globe', 'world'],
    category: 'animals_nature',
    tags: ['continent', 'planet', 'federation'],
  },

  // --- Food & Drink ---
  {
    hexcode: '2615',
    emoji: '☕',
    label: 'hot beverage',
    shortcodes: ['coffee', 'tea', 'espresso'],
    category: 'food_drink',
    tags: ['cafe', 'morning', 'ethiopian_coffee'],
  },
  {
    hexcode: '1F355',
    emoji: '🍕',
    label: 'pizza',
    shortcodes: ['pizza', 'slice'],
    category: 'food_drink',
    tags: ['cheese', 'fastfood', 'dinner'],
  },
  {
    hexcode: '1F951',
    emoji: '🥑',
    label: 'avocado',
    shortcodes: ['avocado', 'avo'],
    category: 'food_drink',
    tags: ['fruit', 'healthy'],
  },
  {
    hexcode: '1F965',
    emoji: '🥥',
    label: 'coconut',
    shortcodes: ['coconut'],
    category: 'food_drink',
    tags: ['palm', 'tropical'],
  },

  // --- Activities & Travel ---
  {
    hexcode: '1F680',
    emoji: '🚀',
    label: 'rocket',
    shortcodes: ['rocket', 'launch', 'speed'],
    category: 'activities_travel',
    tags: ['space', 'matrix2.0', 'scale'],
  },
  {
    hexcode: '26A1',
    emoji: '⚡',
    label: 'high voltage',
    shortcodes: ['zap', 'lightning', 'fast'],
    category: 'activities_travel',
    tags: ['speed', 'sliding_sync', 'power'],
  },
  {
    hexcode: '1F3C6',
    emoji: '🏆',
    label: 'trophy',
    shortcodes: ['trophy', 'winner', 'champion'],
    category: 'activities_travel',
    tags: ['prize', 'victory'],
  },
  {
    hexcode: '1F3B8',
    emoji: '🎸',
    label: 'guitar',
    shortcodes: ['guitar', 'music', 'rock'],
    category: 'activities_travel',
    tags: ['instrument', 'afrobeats'],
  },

  // --- Objects & Symbols ---
  {
    hexcode: '1F512',
    emoji: '🔒',
    label: 'locked',
    shortcodes: ['lock', 'locked', 'secure'],
    category: 'objects_symbols',
    tags: ['security', 'e2ee', 'megolm'],
  },
  {
    hexcode: '1F511',
    emoji: '🔑',
    label: 'key',
    shortcodes: ['key', 'cryptokey', 'passphrase'],
    category: 'objects_symbols',
    tags: ['cross_signing', 'olm', 'decrypt'],
  },
  {
    hexcode: '1F4B3',
    emoji: '💳',
    label: 'credit card',
    shortcodes: ['credit_card', 'momo', 'payment'],
    category: 'objects_symbols',
    tags: ['money', 'mpesa', 'checkout'],
  },
  {
    hexcode: '1F4B5',
    emoji: '💵',
    label: 'dollar banknote',
    shortcodes: ['dollar', 'money', 'cash'],
    category: 'objects_symbols',
    tags: ['currency', 'settlement'],
  },
  {
    hexcode: '1F48E',
    emoji: '💎',
    label: 'gem stone',
    shortcodes: ['gem', 'diamond', 'crystal'],
    category: 'objects_symbols',
    tags: ['precious', 'valuable'],
  },
  {
    hexcode: '1F4E6',
    emoji: '📦',
    label: 'package',
    shortcodes: ['package', 'box', 'order'],
    category: 'objects_symbols',
    tags: ['delivery', 'commerce', 'shipping'],
  },
  {
    hexcode: '2764',
    emoji: '❤️',
    label: 'red heart',
    shortcodes: ['heart', 'red_heart', 'love'],
    category: 'objects_symbols',
    tags: ['affection', 'like'],
  },
  {
    hexcode: '1F49A',
    emoji: '💚',
    label: 'green heart',
    shortcodes: ['green_heart', 'matrix_heart'],
    category: 'objects_symbols',
    tags: ['matrix', 'emerald', 'wat'],
  },
  {
    hexcode: '1F4AF',
    emoji: '💯',
    label: 'hundred points',
    shortcodes: ['100', 'hundred', 'score'],
    category: 'objects_symbols',
    tags: ['perfect', 'facts'],
  },

  // --- Flags ---
  {
    hexcode: '1F1F3-1F1EC',
    emoji: '🇳🇬',
    label: 'flag: Nigeria',
    shortcodes: ['flag_ng', 'nigeria'],
    category: 'flags',
    tags: ['lagos', 'abuja', 'africa'],
  },
  {
    hexcode: '1F1EC-1F1ED',
    emoji: '🇬🇭',
    label: 'flag: Ghana',
    shortcodes: ['flag_gh', 'ghana'],
    category: 'flags',
    tags: ['accra', 'kumasi', 'africa'],
  },
  {
    hexcode: '1F1F0-1F1EA',
    emoji: '🇰🇪',
    label: 'flag: Kenya',
    shortcodes: ['flag_ke', 'kenya'],
    category: 'flags',
    tags: ['nairobi', 'mombasa', 'africa'],
  },
  {
    hexcode: '1F1FF-1F1E6',
    emoji: '🇿🇦',
    label: 'flag: South Africa',
    shortcodes: ['flag_za', 'south_africa'],
    category: 'flags',
    tags: ['johannesburg', 'cape_town'],
  },
  {
    hexcode: '1F1EA-1F1EC',
    emoji: '🇪🇬',
    label: 'flag: Egypt',
    shortcodes: ['flag_eg', 'egypt'],
    category: 'flags',
    tags: ['cairo', 'alexandria'],
  },
  {
    hexcode: '1F1EA-1F1F9',
    emoji: '🇪🇹',
    label: 'flag: Ethiopia',
    shortcodes: ['flag_et', 'ethiopia'],
    category: 'flags',
    tags: ['addis_ababa'],
  },
  {
    hexcode: '1F1F7-1F1FC',
    emoji: '🇷🇼',
    label: 'flag: Rwanda',
    shortcodes: ['flag_rw', 'rwanda'],
    category: 'flags',
    tags: ['kigali'],
  },

  // --- Matrix Custom Stickers & Emotes ---
  {
    hexcode: 'matrix_logo',
    emoji: '🟩 [matrix]',
    label: 'Matrix Protocol Emote',
    shortcodes: ['matrix', 'matrix_org', 'matrix_logo'],
    category: 'matrix_custom',
    tags: ['protocol', 'federation', 'synapse'],
    isCustomMatrix: true,
    customPack: 'Matrix Foundation Emote Pack',
  },
  {
    hexcode: 'matrix_rust',
    emoji: '🦀 [vodozemac]',
    label: 'Vodozemac Rust Crypto',
    shortcodes: ['vodozemac', 'rust_crypto', 'olm_rust'],
    category: 'matrix_custom',
    tags: ['crypto', 'rust', 'ratchet'],
    isCustomMatrix: true,
    customPack: 'Matrix Foundation Emote Pack',
  },
  {
    hexcode: 'sliding_sync',
    emoji: '⚡ [sliding_sync]',
    label: 'Matrix 2.0 Sliding Sync',
    shortcodes: ['sliding_sync', 'syncv3', 'matrix2'],
    category: 'matrix_custom',
    tags: ['speed', 'matrix2', 'fast_sync'],
    isCustomMatrix: true,
    customPack: 'Matrix 2.0 Pack',
  },
  {
    hexcode: 'mpesa_badge',
    emoji: '🟢 [m-pesa]',
    label: 'Safaricom M-Pesa Rails',
    shortcodes: ['mpesa', 'safaricom', 'm_pesa'],
    category: 'matrix_custom',
    tags: ['payment', 'kenya', 'mobile_money'],
    isCustomMatrix: true,
    customPack: 'WAT African Commerce Pack',
  },
  {
    hexcode: 'mtn_momo_badge',
    emoji: '🟡 [mtn-momo]',
    label: 'MTN Mobile Money Emote',
    shortcodes: ['momo', 'mtn_momo', 'mtn'],
    category: 'matrix_custom',
    tags: ['payment', 'ghana', 'nigeria', 'uganda'],
    isCustomMatrix: true,
    customPack: 'WAT African Commerce Pack',
  },
  {
    hexcode: 'uvs_verified_badge',
    emoji: '🛡️ [uvs-verified]',
    label: 'Matrix UVS Verified Badge',
    shortcodes: ['uvs_verified', 'verified_token', 'matrix_uvs'],
    category: 'matrix_custom',
    tags: ['security', 'openid', 'trust'],
    isCustomMatrix: true,
    customPack: 'Matrix Trust & Security Pack',
  },
];

/**
 * Searches the standardized Emojibase dataset by keyword, shortcode, or tag
 */
export function searchEmojibase(query: string = '', category?: EmojiCategory): EmojibaseItem[] {
  if (!query && !category) return EMOJIBASE_DATASET;
  const cleanQuery = (query || '').toLowerCase().trim().replace(/^:/, '').replace(/:$/, '');
  
  return EMOJIBASE_DATASET.filter((item) => {
    if (category && item.category !== category) return false;
    if (!cleanQuery) return true;

    return (
      (item.label && item.label.toLowerCase().includes(cleanQuery)) ||
      (item.shortcodes && item.shortcodes.some((sc) => sc.toLowerCase().includes(cleanQuery))) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(cleanQuery))) ||
      (item.emoji && item.emoji.includes(cleanQuery))
    );
  });
}

/**
 * Returns emoji string with skin tone applied if supported
 */
export function getEmojiWithSkinTone(item: EmojibaseItem, tone: EmojiSkinTone): string {
  if (tone === 'default' || !item.skins) {
    return item.emoji;
  }
  const match = item.skins.find((s) => s.tone === tone);
  return match ? match.emoji : item.emoji;
}

/**
 * Checks if the text ends with an unclosed shortcode trigger like ':smi'
 */
export function extractActiveShortcode(text: string): { activeQuery: string; startIndex: number } | null {
  if (!text || typeof text !== 'string') return null;
  const match = text.match(/:([a-zA-Z0-9_\-+]{1,20})$/);
  if (match && match.index !== undefined) {
    return {
      activeQuery: match[1],
      startIndex: match.index,
    };
  }
  return null;
}

/**
 * Format Matrix m.reaction event payload
 */
export function createMatrixReactionEvent(roomId: string, targetEventId: string, emojiKey: string) {
  return {
    type: 'm.reaction',
    roomId,
    content: {
      'm.relates_to': {
        rel_type: 'm.annotation',
        event_id: targetEventId,
        key: emojiKey,
      },
    },
  };
}
