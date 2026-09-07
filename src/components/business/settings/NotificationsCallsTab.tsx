import React from 'react';
import {
  Bell,
  Phone,
  Video,
  Volume2,
  Mic,
  Moon,
  AlertCircle,
} from 'lucide-react';
import { WATBusinessSettings } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const NotificationsCallsTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const notifs = settings.notifications;
  const calls = settings.calls;

  const handleOrderNotifToggle = (key: keyof typeof notifs.orders) => {
    updateSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        orders: {
          ...prev.notifications.orders,
          [key]: !prev.notifications.orders[key],
        },
      },
    }));
    showToast(`Order notification preference updated: ${String(key)}`);
  };

  const handleCallSettingToggle = (key: keyof typeof calls) => {
    updateSettings((prev) => ({
      ...prev,
      calls: {
        ...prev.calls,
        [key]: !(prev.calls as any)[key],
      },
    }));
    showToast(`Call preference updated: ${String(key)}`);
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* 9. Notifications Settings */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-neutral-100">9. 🔔 Business Alerts & Order Push Notifications</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'newOrder', label: 'New Order Placed in Cart' },
            { key: 'paymentReceived', label: 'Mobile Money Payment Settled' },
            { key: 'paymentFailed', label: 'Failed Transaction Alert' },
            { key: 'orderCancelled', label: 'Order Cancellation Notice' },
            { key: 'deliveryUpdate', label: 'Courier Dispatch Confirmation' },
          ].map((item) => {
            const active = (notifs.orders as any)[item.key];
            return (
              <div
                key={item.key}
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
              >
                <div className="text-xs font-bold text-neutral-200">{item.label}</div>
                <button
                  type="button"
                  onClick={() => handleOrderNotifToggle(item.key as any)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    active ? 'bg-amber-500' : 'bg-neutral-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 14. Calls Settings */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">14. 📞 HD Voice & Video Call Controls</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">WebRTC / MATRIX STUN</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'voiceCallsEnabled', label: 'Accept Inbound Voice Calls', desc: 'Customers can voice call directly' },
            { key: 'videoCallsEnabled', label: 'Showroom Video Consultations', desc: 'Enable 1080p HD showroom video' },
            { key: 'echoCancellation', label: 'Acoustic Echo Cancellation', desc: 'Optimized for studio headsets' },
            { key: 'noiseSuppression', label: 'AI Noise Suppression', desc: 'Filters showroom background audio' },
            { key: 'hardwareAcceleration', label: 'GPU Hardware Video Acceleration', desc: 'Lower CPU load on video stream' },
          ].map((item) => {
            const active = (calls as any)[item.key];
            return (
              <div
                key={item.key}
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-neutral-200">{item.label}</div>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCallSettingToggle(item.key as any)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    active ? 'bg-emerald-500' : 'bg-neutral-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
