import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  Star,
  ExternalLink,
  MessageCircle,
  Truck,
  Sparkles,
  DollarSign,
  Package,
} from 'lucide-react';
import { INITIAL_MARKETPLACE_ITEMS } from './businessData';
import { MarketplaceItem } from './businessTypes';
import { useChat } from '../../context/ChatContext';

interface Props {
  onBack: () => void;
}

export const BusinessMarketplacePage: React.FC<Props> = ({ onBack }) => {
  const { setActiveTab } = useChat();
  const [items, setItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE_ITEMS);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Art & Collectibles', 'Beauty & Skincare', 'Bags & Home Goods', 'Gourmet & Coffee'];

  const filtered = items.filter((item) => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (
      search &&
      !item.title.toLowerCase().includes(search.toLowerCase()) &&
      !item.seller.toLowerCase().includes(search.toLowerCase()) &&
      !item.country.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Top Page Header */}
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
              <span className="text-amber-600">Wholesale Marketplace</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Pan-African Wholesale & Artisan Marketplace
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            {filtered.length} Wholesale Listings
          </span>
        </div>
      </div>

      {/* Wholesale Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-amber-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Artisan & Producer Supply</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black">Direct B2B Sourcing with Escrow & Zero Border Tariffs</h3>
          <p className="text-xs text-amber-100/80 leading-relaxed">
            Order certified organic materials, handcrafted textiles, and packaged food items with clear Minimum Order Quantities (MOQ) and integrated Mobile Money escrow.
          </p>
        </div>
        <div className="z-10 flex items-center gap-3">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
            <div className="text-lg font-black font-mono">100%</div>
            <div className="text-[10px] text-amber-200 uppercase font-bold">Escrow Protected</div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wholesale products, artisans, or producers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-black/[0.08] focus:border-black text-xs font-medium focus:outline-none transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white border border-black/[0.06] text-neutral-600 hover:text-black hover:bg-neutral-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-black/[0.06] p-5 flex flex-col justify-between bg-white hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div>
              <div className="relative h-48 rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{item.country}</span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-neutral-900">
                    MOQ: {item.minOrder}
                  </span>
                </div>

                <h4 className="text-base font-black text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                  {item.title}
                </h4>

                <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Wholesale Price</span>
                  <span className="text-base font-black font-mono text-neutral-900">
                    {item.price}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="truncate max-w-[140px] font-medium text-neutral-700">
                    By {item.seller}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Truck className="w-3 h-3" />
                    {item.shippingDays}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-black/[0.04] flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Inquiry sent to ${item.seller} for ${item.title}. In-chat wholesale negotiation room started.`);
                  setActiveTab('chats');
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Bulk Inquiry</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`Order specifications for ${item.title} saved to procurement cart.`);
                }}
                className="py-2.5 px-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all border border-black/[0.06] active:scale-95"
                title="Save for Later"
              >
                <Package className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
