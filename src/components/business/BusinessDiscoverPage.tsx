import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Users,
  Building2,
  ShieldCheck,
  MapPin,
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  Star,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface Props {
  onBack: () => void;
}

export const BusinessDiscoverPage: React.FC<Props> = ({ onBack }) => {
  const { setActiveTab } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'verified' | 'fashion' | 'tech' | 'logistics'>('all');

  const discoverList = [
    {
      id: 'biz_1',
      name: 'AfroArtisan Collective Ltd',
      handle: '@afroartisan:wat.chat',
      avatar: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&auto=format&fit=crop&q=80',
      category: 'Artisan Crafts & Sustainable Fashion',
      location: 'Nairobi, Kenya',
      verified: true,
      bio: 'Curating handmade sustainable African fashion, woven Kiondo totes, organic shea balms, and authentic brass jewelry.',
      rating: 4.9,
      reviewsCount: 142,
      productsCount: 18,
      type: 'fashion',
      primaryGateway: 'M-Pesa Express',
    },
    {
      id: 'biz_2',
      name: 'Pan-African Ledger Lab',
      handle: '@kwame_ledger:wat.chat',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      category: 'Fintech & Mobile Money APIs',
      location: 'Accra, Ghana',
      verified: true,
      bio: 'Connecting Mobile Money gateways (M-Pesa, MTN MoMo, Airtel) into sovereign chat & Matrix federation infrastructure.',
      rating: 5.0,
      reviewsCount: 89,
      productsCount: 6,
      type: 'tech',
      primaryGateway: 'MTN MoMo',
    },
    {
      id: 'biz_3',
      name: 'Sahara Coldchain Logistics',
      handle: '@sahara_logistics:wat.chat',
      avatar: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
      category: 'Cross-Border Freight & Customs',
      location: 'Dakar, Senegal & Abidjan',
      verified: true,
      bio: 'Rapid cross-border fulfillment with real-time temperature tracking for specialty coffee, cocoa, and organic botanicals.',
      rating: 4.8,
      reviewsCount: 63,
      productsCount: 4,
      type: 'logistics',
      primaryGateway: 'Wave & Card',
    },
    {
      id: 'biz_4',
      name: 'East African Creative Weavers',
      handle: '@machakos_weavers:wat.chat',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      category: 'Textiles & Home Decor',
      location: 'Machakos, Kenya',
      verified: true,
      bio: 'Women-led artisan cooperative producing high-tensile sisal baskets, hand-woven table runners, and organic dye fabrics.',
      rating: 4.95,
      reviewsCount: 210,
      productsCount: 24,
      type: 'fashion',
      primaryGateway: 'M-Pesa & Pochi',
    },
    {
      id: 'biz_5',
      name: 'Kilimanjaro Specialty Roasters',
      handle: '@kilicoffee:wat.chat',
      avatar: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&auto=format&fit=crop&q=80',
      category: 'Gourmet Coffee & Spices',
      location: 'Moshi, Tanzania & Kigali',
      verified: true,
      bio: 'Single-origin washed Arabica coffee beans directly traded from smallholder volcanic slopes in northern Tanzania.',
      rating: 4.92,
      reviewsCount: 94,
      productsCount: 11,
      type: 'fashion',
      primaryGateway: 'Vodacom M-Pesa',
    },
    {
      id: 'biz_6',
      name: 'Kigali Tech Innovations Hub',
      handle: '@kigalitech:wat.chat',
      avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150&auto=format&fit=crop&q=80',
      category: 'Software & IoT Solutions',
      location: 'Kigali, Rwanda',
      verified: true,
      bio: 'Smart POS hardware integration, offline-first mesh communications, and solar telemetry systems for rural cooperatives.',
      rating: 4.88,
      reviewsCount: 52,
      productsCount: 8,
      type: 'tech',
      primaryGateway: 'MTN Mobile Money',
    },
  ];

  const filtered = discoverList.filter((biz) => {
    const matchSearch =
      biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.bio.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    if (filterType === 'verified') return biz.verified;
    if (filterType === 'fashion') return biz.type === 'fashion';
    if (filterType === 'tech') return biz.type === 'tech';
    if (filterType === 'logistics') return biz.type === 'logistics';
    return true;
  });

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Top Page Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-black/[0.08] hover:bg-neutral-100 text-neutral-800 transition-colors shadow-xs group"
            title="Back to Business Dashboard"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400">
              <span>Business Suite</span>
              <span>/</span>
              <span className="text-purple-600">People & Businesses</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              People & Businesses Directory
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
            {filtered.length} Businesses Available
          </span>
        </div>
      </div>

      {/* Network Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
            <Sparkles className="w-3 h-3" />
            <span>Pan-African Verified Matrix Identity</span>
          </div>
          <h3 className="text-base font-black">Federated B2B Partner Network</h3>
          <p className="text-xs text-neutral-400 max-w-xl">
            Directly connect, inspect verified credentials, initiate in-chat contracts, and settle via Mobile Money with zero middleman commissions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('chats')}
          className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
        >
          Open Chat Channels
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by merchant name, category, or country..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-black/[0.08] focus:border-black text-xs font-medium focus:outline-none transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Partners' },
            { id: 'verified', label: 'Verified Only' },
            { id: 'fashion', label: 'Artisan & Fashion' },
            { id: 'tech', label: 'Fintech & Tech' },
            { id: 'logistics', label: 'Logistics' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white border border-black/[0.06] text-neutral-600 hover:text-black hover:bg-neutral-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((biz) => (
          <div
            key={biz.id}
            className="rounded-3xl bg-white border border-black/[0.06] p-5 flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <div className="relative">
                  <img
                    src={biz.avatar}
                    alt={biz.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-1 ring-black/10 group-hover:scale-105 transition-transform shrink-0"
                  />
                  {biz.verified && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white">
                      <ShieldCheck className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-black text-neutral-900 truncate">
                      {biz.name}
                    </h4>
                    <span className="flex items-center gap-1 text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {biz.rating}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-400 font-mono mt-0.5 truncate">
                    {biz.handle}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-neutral-700">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {biz.location}
                    </span>
                    <span>•</span>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      {biz.category}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-600 mt-3.5 leading-relaxed">
                {biz.bio}
              </p>

              <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500 pt-3 border-t border-black/[0.04]">
                <span className="font-mono">
                  <strong className="text-neutral-900">{biz.productsCount}</strong> catalog items
                </span>
                <span>•</span>
                <span className="font-mono">
                  <strong className="text-neutral-900">{biz.reviewsCount}</strong> ratings
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold text-[11px]">
                  {biz.primaryGateway}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('chats')}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Message in Chat</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`Connecting with ${biz.name}. Sovereign Matrix room invitation dispatched.`);
                }}
                className="py-2.5 px-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-black/[0.06] active:scale-95"
              >
                <Users className="w-3.5 h-3.5" />
                <span>B2B Partner</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
