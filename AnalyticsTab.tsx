import React from 'react';
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Users,
  DollarSign,
  Send,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { WATBusinessSettings } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const AnalyticsTab: React.FC<Props> = ({ settings, showToast, onNavigateSection }) => {
  const analytics = settings.analytics;

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* 17. Analytics Overview */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-neutral-100">17. 📊 Business Performance & Conversion Analytics</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">UPDATED REAL-TIME</span>
        </div>

        {/* Big KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {analytics.sales.revenueFormatted}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +24.8% vs last month
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400">Settled Orders</span>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-100">
              {analytics.sales.totalOrders}
            </div>
            <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> {analytics.sales.conversionRatePercent}% conversion
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400">New Customers</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-100">
              {analytics.customers.newCustomersThisMonth}
            </div>
            <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +{analytics.customers.customerGrowthPercent}% MoM
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400">Avg Response Time</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-100">
              {analytics.messaging.avgResponseTimeMinutes} mins
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              Fastest in category
            </div>
          </div>
        </div>

        {/* Message Deliverability Breakdown */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Messaging Funnel Deliverability
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Total Sent</div>
              <div className="text-sm font-bold font-mono text-neutral-200 mt-0.5">
                {analytics.messaging.sent.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Delivered (99.3%)</div>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                {analytics.messaging.delivered.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Read / Opened (91.1%)</div>
              <div className="text-sm font-bold font-mono text-cyan-400 mt-0.5">
                {analytics.messaging.read.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Customer Replies</div>
              <div className="text-sm font-bold font-mono text-amber-400 mt-0.5">
                {analytics.messaging.received.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
