import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  MapPin,
  Star,
  Users,
  Calendar,
  Tag,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Share2,
  Building2,
  Radio,
  ShoppingBag,
  Heart,
  TrendingUp,
  Compass,
  MessageSquare,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { DiscoverCategory, DiscoverItem } from '../types';
import { soundEngine } from '../utils/audioSynth';

export const DiscoverView: React.FC = () => {
  const {
    discoverItems,
    savedDiscoverIds,
    toggleSaveDiscoverItem,
    setActiveRoomId,
    setActiveTab,
    openCheckout,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DiscoverCategory | 'all'>('all');

  const categories: { id: DiscoverCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Highlights', icon: <Compass className="w-4 h-4" /> },
    { id: 'trending', label: '🔥 Trending', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'businesses', label: 'Businesses', icon: <Building2 className="w-4 h-4" /> },
    { id: 'nearby', label: '📍 Near You', icon: <MapPin className="w-4 h-4" /> },
    { id: 'products', label: 'Products & Crafts', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'communities', label: 'Communities & Spaces', icon: <Users className="w-4 h-4" /> },
    { id: 'events', label: 'Events & Summits', icon: <Calendar className="w-4 h-4" /> },
    { id: 'channels', label: 'Broadcast Channels', icon: <Radio className="w-4 h-4" /> },
  ];

  const filteredItems = useMemo(() => {
    return discoverItems.filter((item) => {
      const matchCat =
        activeCategory === 'all' ||
        item.category === activeCategory ||
        (activeCategory === 'trending' && item.badge?.includes('Trending'));
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [discoverItems, activeCategory, searchQuery]);

  const handleAction = (item: DiscoverItem) => {
    soundEngine.playChime();
    if (item.category === 'products' || item.category === 'businesses') {
      setActiveRoomId('room_business');
      setActiveTab('chats');
    } else if (item.category === 'communities') {
      setActiveTab('communities');
    } else if (item.category === 'events') {
      setActiveTab('conference');
    } else {
      setActiveRoomId('room_kwame');
      setActiveTab('chats');
    }
  };

  return (
    <div className="flex-1 bg-neutral-100 flex flex-col h-full overflow-y-auto select-none p-4 sm:p-6 md:p-8 pb-20 md:pb-8 text-neutral-900">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Top Header Banner */}
        <div className="relative rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 sm:p-8 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.05] text-neutral-800 border border-black/[0.08] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              WAT Social & Commerce Discovery Engine
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Discover people, businesses, events & products
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
              Combining the visual engagement of media feeds, the precision of directory search, and the convenience of local commerce into your decentralized messenger.
            </p>

            {/* Visual Search Bar */}
            <div className="mt-5 flex items-center bg-black/[0.03] border border-black/[0.08] rounded-2xl p-1.5 focus-within:border-black focus-within:ring-1 focus-within:ring-black shadow-sm transition-all">
              <Search className="w-5 h-5 text-neutral-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people, businesses, coffee, luxury textiles, summits..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-xs text-neutral-500 hover:text-black font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCategory(c.id);
                soundEngine.playChime();
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeCategory === c.id
                  ? 'bg-black text-white shadow-sm scale-105'
                  : 'bg-white/90 text-neutral-600 hover:text-black hover:bg-white border border-black/[0.08]'
              }`}
            >
              {c.icon}
              {c.label}
            </button>
          ))}
        </div>

        {/* Discover Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isSaved = savedDiscoverIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="group rounded-3xl bg-white/90 border border-black/[0.08] hover:border-black/20 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Image Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    {item.badge ? (
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur border border-black/[0.08] text-neutral-900 text-[11px] font-bold shadow-sm">
                        {item.badge}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur border border-black/[0.08] text-neutral-800 text-[11px] font-bold uppercase font-mono tracking-wider shadow-sm">
                        {item.category}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveDiscoverItem(item.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur transition-all ${
                        isSaved
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-white/85 text-neutral-800 hover:text-black hover:bg-white'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Price Tag or Distance Floating */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    {item.priceTag && (
                      <span className="px-3 py-1 rounded-xl bg-black text-white font-black text-xs shadow-md">
                        {item.priceTag}
                      </span>
                    )}
                    {item.rating && (
                      <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur border border-black/[0.08] text-neutral-900 font-bold text-xs flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {item.rating} <span className="text-neutral-500 font-normal">({item.reviewCount})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Author / Host Meta */}
                    {item.authorName && (
                      <div className="flex items-center gap-2 mb-2">
                        {item.authorAvatar && (
                          <img
                            src={item.authorAvatar}
                            alt={item.authorName}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-black/10"
                          />
                        )}
                        <span className="text-xs font-semibold text-neutral-600">
                          {item.authorName}
                        </span>
                        {item.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                    )}

                    <h3 className="text-base font-bold text-neutral-900 group-hover:text-black transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>

                    {/* Metadata indicators */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-neutral-500">
                      {item.location && (
                        <span className="flex items-center gap-1 text-[11px] text-neutral-700 font-medium">
                          <MapPin className="w-3 h-3 text-neutral-800" />
                          {item.location}
                        </span>
                      )}
                      {item.eventDate && (
                        <span className="flex items-center gap-1 text-[11px] text-neutral-700 font-medium">
                          <Calendar className="w-3 h-3 text-neutral-800" />
                          {item.eventDate}
                        </span>
                      )}
                      {item.membersCount && (
                        <span className="flex items-center gap-1 text-[11px] text-neutral-700 font-medium">
                          <Users className="w-3 h-3 text-neutral-800" />
                          {item.membersCount.toLocaleString()} members
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-black/[0.04] text-neutral-600 text-[10px] font-semibold border border-black/[0.05]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2">
                    {item.category === 'products' && (
                      <button
                        type="button"
                        onClick={() =>
                          openCheckout([
                            {
                              id: `item_${item.id}`,
                              productId: item.id,
                              name: item.title,
                              description: item.subtitle,
                              price: 85,
                              currency: 'ZAR',
                              quantity: 1,
                              image: item.image,
                              category: 'goods',
                              sellerName: item.authorName || 'WAT Artisan Marketplace',
                            },
                          ])
                        }
                        className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Instant Buy (WAT Checkout)</span>
                      </button>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleAction(item)}
                        className="flex-1 py-2.5 px-4 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-sm active:scale-95"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
