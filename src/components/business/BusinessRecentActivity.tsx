import React from 'react';
import {
  ArrowDownLeft,
  CheckCircle2,
  ChevronRight,
  Package,
  UserPlus,
  Truck,
  ArrowUpRight,
  Receipt,
} from 'lucide-react';
import { BusinessActivity } from './businessTypes';

interface Props {
  activities: BusinessActivity[];
  onSelectActivity: (activity: BusinessActivity) => void;
  onViewAll?: () => void;
}

export const BusinessRecentActivity: React.FC<Props> = ({
  activities,
  onSelectActivity,
  onViewAll,
}) => {
  const getActivityIcon = (type: BusinessActivity['type']) => {
    switch (type) {
      case 'payment_received':
        return {
          icon: ArrowDownLeft,
          bg: 'bg-emerald-100 text-emerald-700',
        };
      case 'invoice_paid':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-500 text-white',
        };
      case 'new_customer':
        return {
          icon: UserPlus,
          bg: 'bg-purple-100 text-purple-700',
        };
      case 'order_dispatched':
        return {
          icon: Truck,
          bg: 'bg-blue-100 text-blue-700',
        };
      case 'product_listed':
      default:
        return {
          icon: Package,
          bg: 'bg-amber-100 text-amber-700',
        };
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-black/[0.06] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-black/[0.04]">
        <div>
          <h3 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <span>Recent Activity</span>
            <span className="text-xs font-mono font-normal text-neutral-400">
              ({activities.length} events)
            </span>
          </h3>
          <p className="text-xs text-neutral-500">Live banking & ledger activity feed</p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-bold text-neutral-700 hover:text-black py-1 px-3 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            View Statement
          </button>
        )}
      </div>

      {/* Activity Feed Rows */}
      <div className="divide-y divide-black/[0.04]">
        {activities.map((act) => {
          const { icon: Icon, bg } = getActivityIcon(act.type);
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => onSelectActivity(act)}
              className="w-full py-3.5 px-2 -mx-2 rounded-2xl flex items-center justify-between gap-3 text-left hover:bg-neutral-50 active:bg-neutral-100 transition-colors group"
            >
              {/* Left: Icon & Description */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-bold text-neutral-900 truncate group-hover:text-black">
                    {act.title}
                  </div>
                  <div className="text-xs text-neutral-500 truncate mt-0.5">
                    {act.subtitle}
                  </div>
                </div>
              </div>

              {/* Right: Amount, Status Pill, Timestamp & Chevron */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  {act.amount && (
                    <div className="text-sm font-black text-neutral-900 font-mono">
                      {act.amount}
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      act.status === 'Settled'
                        ? 'bg-emerald-50 text-emerald-700'
                        : act.status === 'Dispatched'
                        ? 'bg-blue-50 text-blue-700'
                        : act.status === 'Active'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {act.status}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {act.timestamp}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
