import React from 'react';
import {
  PackagePlus,
  Users,
  Calendar,
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  onListProduct: () => void;
  onFindPeople: () => void;
  onDiscoverEvents: () => void;
  onExploreMarketplace: () => void;
}

export const BusinessActionCards: React.FC<Props> = ({
  onListProduct,
  onFindPeople,
  onDiscoverEvents,
  onExploreMarketplace,
}) => {
  const cards = [
    {
      id: 'list_product',
      title: 'List a Product or Service',
      description: 'Create catalog inventory, set Mobile Money pricing & publish to chat.',
      badge: 'Merchant Hub',
      icon: PackagePlus,
      color: 'emerald',
      iconBg: 'bg-emerald-500 text-white',
      accentBg: 'hover:border-emerald-300',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      onClick: onListProduct,
    },
    {
      id: 'find_people',
      title: 'Find People & Businesses',
      description: 'Discover verified entrepreneurs, suppliers & collaborative B2B partners.',
      badge: 'Social Discovery',
      icon: Users,
      color: 'purple',
      iconBg: 'bg-purple-600 text-white',
      accentBg: 'hover:border-purple-300',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      onClick: onFindPeople,
    },
    {
      id: 'discover_events',
      title: 'Discover Events & Summits',
      description: 'Explore trade expos, craft exhibitions & Pan-African founder workshops.',
      badge: 'Community',
      icon: Calendar,
      color: 'blue',
      iconBg: 'bg-blue-600 text-white',
      accentBg: 'hover:border-blue-300',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      onClick: onDiscoverEvents,
    },
    {
      id: 'explore_marketplace',
      title: 'Explore Marketplace',
      description: 'Access multi-vendor trade, wholesale orders & cross-border goods.',
      badge: 'Wholesale & Retail',
      icon: ShoppingBag,
      color: 'orange',
      iconBg: 'bg-amber-600 text-white',
      accentBg: 'hover:border-amber-300',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      onClick: onExploreMarketplace,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Quick Actions & High-Value Tasks
        </h3>
        <span className="text-[11px] text-neutral-400 font-medium hidden sm:inline">
          One-tap access
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              type="button"
              onClick={card.onClick}
              className={`p-5 rounded-3xl bg-white border border-black/[0.06] shadow-sm hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between group active:scale-[0.98] relative overflow-hidden ${card.accentBg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeBg}`}>
                    {card.badge}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-black text-neutral-900 leading-snug group-hover:text-black">
                  {card.title}
                </h4>

                <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed line-clamp-2">
                  {card.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs font-bold text-neutral-700 group-hover:text-black">
                <span>Launch</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
