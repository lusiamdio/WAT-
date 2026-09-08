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
    <div className="space-y-8 animate-fade-in text-neutral-900">
      {/* Analytics Overview */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-base font-bold text-neutral-900">Performance & Conversion Analytics</h3>
          <span className="text-xs font-mono text-neutral-600 font-semibold">UPDATED REAL-TIME</span>
        </div>

        {/* Big KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900">
              {analytics.sales.revenueFormatted}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +24.8% vs last month
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500">Settled Orders</span>
              <CheckCircle2 className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900">
              {analytics.sales.totalOrders}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> {analytics.sales.conversionRatePercent}% conversion
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500">New Customers</span>
              <Users className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900">
              {analytics.customers.newCustomersThisMonth}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +{analytics.customers.customerGrowthPercent}% MoM
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500">Avg Response Time</span>
              <Clock className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900">
              {analytics.messaging.avgResponseTimeMinutes} mins
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              Fastest in category
            </div>
          </div>
        </div>

        {/* Message Deliverability Breakdown */}
        <div className="p-5 rounded-2xl bg-white shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Messaging Funnel Deliverability
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white shadow-xs">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Total Sent</div>
              <div className="text-sm font-bold font-mono text-neutral-900 mt-0.5">
                {analytics.messaging.sent.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white shadow-xs">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Delivered (99.3%)</div>
              <div className="text-sm font-bold font-mono text-emerald-700 mt-0.5">
                {analytics.messaging.delivered.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white shadow-xs">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Read / Opened (91.1%)</div>
              <div className="text-sm font-bold font-mono text-neutral-900 mt-0.5">
                {analytics.messaging.read.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white shadow-xs">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Customer Replies</div>
              <div className="text-sm font-bold font-mono text-neutral-900 mt-0.5">
                {analytics.messaging.received.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
