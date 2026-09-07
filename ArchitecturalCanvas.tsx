import React from 'react';

interface ArchitecturalCanvasProps {
  reducedMotion?: boolean;
  intensity?: 'subtle' | 'normal' | 'focused';
  accentColor?: string;
  showMetrics?: boolean;
}

export const ArchitecturalCanvas: React.FC<ArchitecturalCanvasProps> = () => {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#FAFAFA]"
      aria-hidden="true"
    >
      {/* Subtle soft neutral ambient light respecting 60% white and 10% grey */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-neutral-200/40 rounded-full blur-3xl" />
    </div>
  );
};
