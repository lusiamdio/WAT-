import React, { useState } from 'react';

interface PremiumEmojiProps {
  emoji: string;
  size?: number | string;
  className?: string;
  alt?: string;
}

/**
 * Converts an emoji unicode character or sequence to unified lowercase hex code points for Twemoji SVG
 */
export function getEmojiHex(emojiStr: string): string {
  if (!emojiStr) return '';
  const codePoints: string[] = [];
  for (let i = 0; i < emojiStr.length; i++) {
    const cp = emojiStr.codePointAt(i);
    if (cp !== undefined) {
      if (cp > 0xffff) {
        i++; // skip surrogate pair trail
      }
      codePoints.push(cp.toString(16));
    }
  }
  return codePoints
    .join('-')
    .toLowerCase()
    .replace(/-fe0f$/, '')
    .replace(/-fe0f-/g, '-');
}

export const PremiumEmoji: React.FC<PremiumEmojiProps> = ({
  emoji,
  size,
  className = 'w-5 h-5',
  alt,
}) => {
  const [hasError, setHasError] = useState(false);
  const hex = getEmojiHex(emoji);

  // If no valid hex or error loading SVG, fallback to system emoji font
  if (!hex || hasError) {
    return (
      <span
        className={`inline-flex items-center justify-center select-none font-emoji ${className}`}
        style={size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : undefined}
      >
        {emoji}
      </span>
    );
  }

  const svgUrl = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${hex}.svg`;

  return (
    <img
      src={svgUrl}
      alt={alt || emoji}
      draggable={false}
      onError={() => setHasError(true)}
      className={`inline-block align-middle object-contain pointer-events-none select-none transition-transform ${className}`}
      style={size ? { width: size, height: size } : undefined}
      loading="lazy"
    />
  );
};
