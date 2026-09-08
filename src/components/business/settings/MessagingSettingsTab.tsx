import React, { useState } from 'react';
import {
  Plus,
  Trash2,
} from 'lucide-react';
import { WATBusinessSettings, QuickReply } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const MessagingSettingsTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const messaging = settings.messaging;

  const [newShortcut, setNewShortcut] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newCategory, setNewCategory] = useState('Sales');
  const [isAddingReply, setIsAddingReply] = useState(false);

  const handleGreetingToggle = () => {
    updateSettings((prev) => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        greeting: {
          ...prev.messaging.greeting,
          enabled: !prev.messaging.greeting.enabled,
        },
      },
    }));
    showToast(`Greeting Message: ${!messaging.greeting.enabled ? 'Enabled' : 'Disabled'}`);
  };

  const handleGreetingText = (text: string) => {
    updateSettings((prev) => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        greeting: {
          ...prev.messaging.greeting,
          text,
        },
      },
    }));
  };

  const handleGreetingRecipient = (recipientFilter: any) => {
    updateSettings((prev) => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        greeting: {
          ...prev.messaging.greeting,
          recipientFilter,
        },
      },
    }));
  };

  const handleAwayToggle = () => {
    updateSettings((prev) => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        away: {
          ...prev.messaging.away,
          enabled: !prev.messaging.away.enabled,
        },
      },
    }));
    showToast(`Away Message: ${!messaging.away.enabled ? 'Enabled' : 'Disabled'}`);
  };

  const handleAwayText = (text: string) => {
    updateSettings((prev) => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        away: {
          ...prev.messaging.away,
          text,
        },
      },
    }));
  };

  const handleAwaySchedule = (schedule: any) => {
    updateSettings((prev) => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        away: {
          ...prev.messaging.away,
          schedule,
        },
      },
    }));
  };

  const handleAddQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShortcut.trim() || !newMessage.trim()) return;

    const formattedShortcut = newShortcut.startsWith('/') ? newShortcut : `/${newShortcut}`;
    const newQR: QuickReply = {
      id: `qr-${Date.now()}`,
      shortcut: formattedShortcut,
      message: newMessage.trim(),
      keywords: newKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      category: newCategory,
    };

    updateSettings((prev) => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        quickReplies: [...prev.messaging.quickReplies, newQR],
      },
    }));

    setNewShortcut('');
    setNewMessage('');
    setNewKeywords('');
    setIsAddingReply(false);
    showToast(`Quick reply ${formattedShortcut} added!`);
  };

  const handleDeleteQuickReply = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        quickReplies: prev.messaging.quickReplies.filter((qr) => qr.id !== id),
      },
    }));
    showToast('Quick reply deleted');
  };

  const handleDefaultTemplateChange = (key: keyof typeof messaging.defaultTemplates, val: string) => {
    updateSettings((prev) => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        defaultTemplates: {
          ...prev.messaging.defaultTemplates,
          [key]: val,
        },
      },
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-900">
      {/* Greeting Message */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Greeting Message</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Automatically greet customers when they first message you or after 14 days of no activity.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGreetingToggle}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              messaging.greeting.enabled
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {messaging.greeting.enabled ? 'Greeting ACTIVE' : 'DISABLED'}
          </button>
        </div>

        {messaging.greeting.enabled && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Greeting Message Text
              </label>
              <textarea
                rows={3}
                value={messaging.greeting.text}
                onChange={(e) => handleGreetingText(e.target.value)}
                className="w-full mt-1.5 bg-white shadow-sm rounded-2xl p-3.5 text-xs text-neutral-900 outline-none transition-colors leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Send Greeting To:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                {[
                  { key: 'everyone', label: 'Everyone' },
                  { key: 'not_in_contacts', label: 'Not in Contacts' },
                  { key: 'everyone_except', label: 'Everyone Except...' },
                  { key: 'only_send_to', label: 'Only Send To...' },
                ].map((rec) => (
                  <button
                    key={rec.key}
                    type="button"
                    onClick={() => handleGreetingRecipient(rec.key)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      messaging.greeting.recipientFilter === rec.key
                        ? 'bg-black text-white'
                        : 'bg-white shadow-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    {rec.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Away Message */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Away Message</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Reply automatically when you are unavailable or outside operational business hours.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAwayToggle}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              messaging.away.enabled
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {messaging.away.enabled ? 'Away ACTIVE' : 'DISABLED'}
          </button>
        </div>

        {messaging.away.enabled && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Away Message Text
              </label>
              <textarea
                rows={3}
                value={messaging.away.text}
                onChange={(e) => handleAwayText(e.target.value)}
                className="w-full mt-1.5 bg-white shadow-sm rounded-2xl p-3.5 text-xs text-neutral-900 outline-none transition-colors leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Away Schedule Trigger
                </label>
                <div className="flex flex-col gap-1.5 mt-1.5">
                  {[
                    { key: 'outside_business_hours', label: 'Outside of Business Hours' },
                    { key: 'always', label: 'Always Send' },
                    { key: 'custom_schedule', label: 'Custom Schedule Window' },
                  ].map((sch) => (
                    <button
                      key={sch.key}
                      type="button"
                      onClick={() => handleAwaySchedule(sch.key)}
                      className={`py-2 px-3 rounded-xl text-xs text-left font-semibold transition-all ${
                        messaging.away.schedule === sch.key
                          ? 'bg-black text-white'
                          : 'bg-white shadow-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                      }`}
                    >
                      {sch.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Recipients Filter
                </label>
                <div className="p-3.5 rounded-2xl bg-white shadow-sm space-y-2 mt-1.5">
                  <div className="text-xs text-neutral-800 font-medium">
                    Sends to: <strong className="text-black">{messaging.away.recipients}</strong>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Contacts outside contacts list will get informed automatically when sending outside business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Quick Replies */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Quick Replies ({messaging.quickReplies.length})</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Reuse frequently sent messages in chat by typing <span className="font-mono text-black font-bold">/</span> shortcut.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingReply(!isAddingReply)}
            className="px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:bg-neutral-800"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingReply ? 'Cancel' : 'New Quick Reply'}</span>
          </button>
        </div>

        {/* Add Quick Reply Form */}
        {isAddingReply && (
          <form onSubmit={handleAddQuickReply} className="p-4 rounded-2xl bg-white shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Create Quick Reply</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-neutral-600 font-bold">Shortcut (e.g. /shipping)</label>
                <input
                  type="text"
                  placeholder="/discount"
                  value={newShortcut}
                  onChange={(e) => setNewShortcut(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-600 font-bold">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-xs text-neutral-900 outline-none"
                >
                  <option value="Sales">Sales</option>
                  <option value="Billing">Billing & Mobile Money</option>
                  <option value="Logistics">Shipping & Logistics</option>
                  <option value="General">General Inquiries</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] text-neutral-600 font-bold">Keywords (comma-separated tags)</label>
                <input
                  type="text"
                  placeholder="promo, discount, sale, coupon"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-xs text-neutral-900 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] text-neutral-600 font-bold">Message Content</label>
                <textarea
                  rows={2}
                  placeholder="Here is our 15% discount coupon for your order..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl p-3 text-xs text-neutral-900 outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm"
            >
              Save Shortcut
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {messaging.quickReplies.map((qr) => (
            <div
              key={qr.id}
              className="p-4 rounded-2xl bg-white shadow-sm flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold text-neutral-900 bg-white px-2 py-0.5 rounded-md shadow-xs">
                    {qr.shortcut}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-md shadow-xs">
                    {qr.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-700 mt-2 leading-relaxed">
                  "{qr.message}"
                </p>
                {qr.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {qr.keywords.map((kw, i) => (
                      <span key={i} className="text-[9px] font-mono text-neutral-600 bg-white px-1.5 py-0.5 rounded shadow-xs">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2.5 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">Tap / to insert in chat</span>
                <button
                  type="button"
                  onClick={() => handleDeleteQuickReply(qr.id)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Default Message Templates */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
        <div className="pb-3">
          <h3 className="text-base font-bold text-neutral-900">Default Transactional & Lifecycle Messages</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'orderConfirmation', label: 'Order Confirmation Message' },
            { key: 'paymentConfirmation', label: 'Payment Confirmation Message' },
            { key: 'appointmentConfirmation', label: 'Appointment Booking Confirmation' },
            { key: 'deliveryConfirmation', label: 'Delivery Completed Confirmation' },
            { key: 'followUpMessage', label: 'Customer Follow-Up Message' },
            { key: 'firstContactMessage', label: 'First Contact Response' },
          ].map((item) => (
            <div key={item.key} className="p-3.5 rounded-2xl bg-white shadow-sm">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                {item.label}
              </label>
              <textarea
                rows={2}
                value={(messaging.defaultTemplates as any)[item.key]}
                onChange={(e) =>
                  handleDefaultTemplateChange(item.key as any, e.target.value)
                }
                className="w-full bg-neutral-50 rounded-xl p-2.5 text-xs text-neutral-900 outline-none"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
