import React from 'react';
import { WATUserSettings } from '../../types/watUserSettings';
import { soundEngine } from '../../utils/audioSynth';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const NotificationsTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const notif = settings.notifications;

  const handleToggle = (key: keyof typeof notif) => {
    const nextVal = !(notif as any)[key];
    updateSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: nextVal,
      },
    }));

    if (key === 'conversationTones') {
      soundEngine.setMuted(!nextVal);
      if (nextVal) {
        soundEngine.playMessageSent();
      }
    }
    showToast(`Updated ${String(key)}`);
  };

  const handleSelect = (key: keyof typeof notif, val: string) => {
    updateSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: val,
      },
    }));
    showToast(`Updated ${String(key)}`);
  };

  const handleTestSound = () => {
    soundEngine.playMessageReceived();
    showToast('Playing test notification audio');
  };

  const handleSaveTab = () => {
    showToast('Notification settings saved');
  };

  return (
    <div className="space-y-6 text-neutral-900 bg-white">
      {/* Sound Settings */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Audio & Sounds
          </h2>
          <button
            type="button"
            onClick={handleTestSound}
            className="px-3 py-1 rounded-lg border border-black/[0.12] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04]"
          >
            Test Sound
          </button>
        </div>

        <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-neutral-900">Conversation Tones</span>
            <p className="text-[11px] text-neutral-500">
              Play sound for incoming and outgoing messages
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('conversationTones')}
            className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
              notif.conversationTones ? 'bg-black' : 'bg-neutral-300'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                notif.conversationTones ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Tones & Alerts */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900">
          Alert Preferences
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">Message Tone</label>
            <select
              value={notif.messageSound}
              onChange={(e) => handleSelect('messageSound', e.target.value)}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="WAT Chime Pulse (Web Audio Synth)">Default Chime</option>
              <option value="Marimba Drop">Soft Tone</option>
              <option value="Silent">Silent</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">Message Vibration</label>
            <select
              value={notif.messageVibrate}
              onChange={(e) => handleSelect('messageVibrate', e.target.value)}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="default">Default</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
              <option value="off">Off</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">Group Tone</label>
            <select
              value={notif.groupSound}
              onChange={(e) => handleSelect('groupSound', e.target.value)}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="WAT Soft Bell">Soft Bell</option>
              <option value="Gentle Echo">Gentle Echo</option>
              <option value="Silent">Silent</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">Call Ringtone</label>
            <select
              value={notif.callRingtone}
              onChange={(e) => handleSelect('callRingtone', e.target.value)}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="WAT Harmonic Sine Loop">Standard Loop</option>
              <option value="Classic Electronic Ring">Classic Ring</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">High Priority Alerts</span>
              <p className="text-[11px] text-neutral-500">Show notification banners at the top</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('highPriorityAlerts')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                notif.highPriorityAlerts ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  notif.highPriorityAlerts ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Preview Message Text</span>
              <p className="text-[11px] text-neutral-500">Show message content in previews</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('previewText')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                notif.previewText ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  notif.previewText ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Save / Cancel Footer */}
      <div className="flex items-center justify-end gap-2 pt-2 pb-4">
        <button
          type="button"
          onClick={() => showToast('Changes discarded')}
          className="px-4 py-2 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveTab}
          className="px-5 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
