import React from 'react';
import { Compass, Sparkles, ArrowRight, Plus, QrCode } from 'lucide-react';

interface Props {
  onExploreDiscovery: () => void;
  onAddProduct: () => void;
  onScanQR?: () => void;
}

export const BusinessHeroCard: React.FC<Props> = ({
  onExploreDiscovery,
  onAddProduct,
  onScanQR,
}) => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-neutral-950 text-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-black/10 group">
      {/* Background Image Layer with Gradient Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=1400&auto=format&fit=crop&q=80"
          alt="African Commerce & Artisan Craft"
          className="w-full h-full object-cover object-center brightness-75 scale-100 group-hover:scale-105 transition-transform duration-700 ease-out opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-[300px] sm:min-h-[340px] max-w-2xl">
        <div>
          {/* Top Brand Pill & Context */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pan-African Commerce & Discovery Network</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Discover people, businesses, events & products
          </h2>

          {/* Supporting Copy */}
          <p className="mt-3 text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
            Connect with over 14,000 verified merchants, trade cross-border with instant Mobile Money, and grow your artisan brand across Africa.
          </p>

          {/* Closed Loop Steps / UX Principles */}
          <div className="mt-4 flex items-center gap-2 sm:gap-4 text-xs font-semibold text-neutral-400 flex-wrap">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Connect
            </span>
            <span className="text-neutral-600">→</span>
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Discover
            </span>
            <span className="text-neutral-600">→</span>
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Trade
            </span>
            <span className="text-neutral-600">→</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Grow
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {onScanQR && (
            <button
              type="button"
              onClick={onScanQR}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
            >
              <QrCode className="w-4 h-4 text-neutral-950" />
              <span>Scan QR to Accept Pay</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExploreDiscovery}
            className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Discovery Gateway</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onAddProduct}
            className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>List Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};
