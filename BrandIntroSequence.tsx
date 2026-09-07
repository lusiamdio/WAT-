import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface BrandIntroSequenceProps {
  onComplete: () => void;
  logoSrc?: string;
  reducedMotion?: boolean;
}

export const BrandIntroSequence: React.FC<BrandIntroSequenceProps> = ({
  onComplete,
  logoSrc = '/assets/image/ChatGPT Image Sep 4, 2026, 04_52_47 PM (1)-1.png',
  reducedMotion = false,
}) => {
  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => clearTimeout(timer);
  }, [reducedMotion, onComplete]);

  // Click or keypress to skip
  useEffect(() => {
    const handleKey = () => {
      onComplete();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-white flex items-center justify-center cursor-pointer select-none"
    >
      {/* Only the logo appears and animates. All other animations, graphics, AI labels, and texts are removed. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 1],
          scale: [0.8, 1.05, 1],
        }}
        transition={{
          duration: 1.8,
          times: [0, 0.6, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
        className="flex items-center justify-center bg-transparent"
      >
        <img
          src={logoSrc}
          alt="WAT"
          className="w-28 h-28 sm:w-36 sm:h-36 object-contain bg-transparent pointer-events-none select-none"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/wat-logo.png') {
              target.src = '/wat-logo.png';
            }
          }}
        />
      </motion.div>
    </div>
  );
};
