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
    <div className="space-y-8 animate-fade-in text-neutral-900">
      {/* Broadcast Campaigns Header */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Broadcast & Marketing Campaigns</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Send promotional offers, seasonal product drops, and flash sales to targeted customer segments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="px-3.5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? 'Cancel' : 'New Broadcast Campaign'}</span>
          </button>
        </div>

        {/* Create Campaign Form */}
        {isCreating && (
          <form onSubmit={handleCreateCampaign} className="p-4 rounded-2xl bg-white shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Schedule Broadcast Campaign</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-neutral-600 font-bold">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. End of Month Flash Sale"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-xs text-neutral-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-600 font-bold">Campaign Template</label>
                <select
                  value={templateType}
                  onChange={(e: any) => setTemplateType(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-xs text-neutral-900 outline-none"
                >
                  <option value="promotional">Promotional Discount</option>
                  <option value="product_launch">Product Collection Launch</option>
                  <option value="re_engagement">Customer Re-engagement</option>
                  <option value="flash_sale">Flash Sale Countdown</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-600 font-bold">Target Segment</label>
                <select
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-xs text-neutral-900 outline-none"
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
              className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm"
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
              className="p-4 rounded-2xl bg-white shadow-sm transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">{camp.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        camp.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {camp.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                    <span>Segment: <strong className="text-neutral-700">{camp.targetSegment}</strong></span>
                    <span>•</span>
                    <span>{camp.recipientsCount} recipients</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-500 font-mono">
                  {camp.scheduledTime}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-white shadow-xs">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Delivery Rate</div>
                  <div className="text-xs font-bold text-neutral-900">{camp.stats.deliveryRate}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white shadow-xs">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Read Rate</div>
                  <div className="text-xs font-bold text-neutral-900">{camp.stats.readRate}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white shadow-xs">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Response Rate</div>
                  <div className="text-xs font-bold text-neutral-900">{camp.stats.responseRate}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white shadow-xs">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Conversion Rate</div>
                  <div className="text-xs font-bold text-neutral-900">{camp.stats.conversionRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
