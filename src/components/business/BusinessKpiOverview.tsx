import React from 'react';
import {
  DollarSign,
  PackageCheck,
  TrendingUp,
  Users,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';

interface Props {
  onViewDeepAnalytics: () => void;
}

export const BusinessKpiOverview: React.FC<Props> = ({ onViewDeepAnalytics }) => {
  const metrics = [
    {
      id: 'revenue',
      label: '30-Day Revenue',
      value: '$4,850.00',
      change: '+18.4%',
      positive: true,
      subtext: '100% Mobile Money (M-Pesa & MoMo)',
      icon: DollarSign,
      iconBg: 'bg-emerald-500 text-white',
    },
    {
      id: 'orders',
      label: 'Settled Orders',
      value: '84 Invoices',
      change: '+12 today',
      positive: true,
      subtext: 'Instant bank & ledger settlements',
      icon: PackageCheck,
      iconBg: 'bg-black text-white',
    },
    {
      id: 'conversion',
      label: 'Conversion Rate',
      value: '68.4%',
      change: '+4.2%',
      positive: true,
      subtext: 'Conversational chat checkout',
      icon: TrendingUp,
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'customers',
      label: 'Total Customers',
      value: '1.2K',
      change: '+94 new',
      positive: true,
      subtext: 'VIP & recurring directory',
      icon: Users,
      iconBg: 'bg-purple-600 text-white',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-sm font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <span>Your Business Overview</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </h3>
          <p className="text-xs text-neutral-500">Live commerce performance & settlement metrics</p>
        </div>

        <button
          type="button"
          onClick={onViewDeepAnalytics}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group py-1 px-2.5 rounded-xl hover:bg-emerald-50 transition-colors"
        >
          <span>View Deep Analytics</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              className="p-5 rounded-3xl bg-white border border-black/[0.06] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  {metric.label}
                </span>
                <div className={`w-8 h-8 rounded-xl ${metric.iconBg} flex items-center justify-center shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight font-mono">
                    {metric.value}
                  </span>
                  <span className="inline-flex items-center text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ArrowUpRight className="w-3 h-3" />
                    {metric.change}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5 font-medium">
                  {metric.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
