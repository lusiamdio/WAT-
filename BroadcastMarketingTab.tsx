import React, { useState } from 'react';
import {
  Radio,
  Send,
  Plus,
  BarChart3,
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  Percent,
  Sparkles,
} from 'lucide-react';
import { WATBusinessSettings, MarketingCampaign } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const BroadcastMarketingTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const broadcast = settings.broadcastMarketing;

  const [campaignName, setCampaignName] = useState('');
  const [templateType, setTemplateType] = useState<'promotional' | 'product_launch' | 're_engagement' | 'flash_sale'>('promotional');
  const [targetSegment, setTargetSegment] = useState('VIP Customers');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) return;

    const newCamp: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      name: campaignName.trim(),
      templateType,
      targetSegment,
      recipientsCount: 1450,
      scheduledTime: 'Tomorrow at 10:00 AM EAT',
      status: 'scheduled',
      stats: {
        deliveryRate: 99.0,
        readRate: 85.0,
        responseRate: 28.0,
        conversionRate: 12.5,
      },
    };

    updateSettings((prev) => ({
      ...prev,
      broadcastMarketing: {
        ...prev.broadcastMarketing,
        campaigns: [newCamp, ...prev.broadcastMarketing.campaigns],
      },
    }));

    setCampaignName('');
    setIsCreating(false);
    showToast(`Broadcast campaign "${newCamp.name}" scheduled!`);
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* 6. Broadcast Campaigns Header */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-neutral-100">6. 📢 Broadcast & Marketing Engine</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Send promotional offers, seasonal product drops, and flash sales to targeted customer segments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? 'Cancel' : 'New Broadcast Campaign'}</span>
          </button>
        </div>

        {/* Create Campaign Form */}
        {isCreating && (
          <form onSubmit={handleCreateCampaign} className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Schedule Broadcast Campaign</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 font-bold">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. End of Month Flash Sale"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 font-bold">Campaign Template</label>
                <select
                  value={templateType}
                  onChange={(e: any) => setTemplateType(e.target.value)}
                  className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200"
                >
                  <option value="promotional">Promotional Discount</option>
                  <option value="product_launch">Product Collection Launch</option>
                  <option value="re_engagement">Customer Re-engagement</option>
                  <option value="flash_sale">Flash Sale Countdown</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 font-bold">Target Segment</label>
                <select
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value)}
                  className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200"
                >
                  <option value="VIP Customers">VIP Customers (Spend &gt; $500)</option>
                  <option value="Frequent Buyers">Frequent Buyers</option>
                  <option value="New Prospects">New Prospects (Last 30 Days)</option>
                  <option value="All Contacts">All Inbound Contacts</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md"
            >
              Schedule Broadcast Dispatches
            </button>
          </form>
        )}

        {/* Campaigns List */}
        <div className="space-y-3">
          {broadcast.campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-100">{camp.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        camp.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {camp.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                    <span>Segment: <strong className="text-neutral-300">{camp.targetSegment}</strong></span>
                    <span>•</span>
                    <span>{camp.recipientsCount} recipients</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 font-mono">
                  {camp.scheduledTime}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-900">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Delivery Rate</div>
                  <div className="text-xs font-bold text-emerald-400">{camp.stats.deliveryRate}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Read Rate</div>
                  <div className="text-xs font-bold text-cyan-400">{camp.stats.readRate}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Response Rate</div>
                  <div className="text-xs font-bold text-amber-400">{camp.stats.responseRate}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Conversion Rate</div>
                  <div className="text-xs font-bold text-emerald-400">{camp.stats.conversionRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
