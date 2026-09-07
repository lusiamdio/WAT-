import React, { useState } from 'react';
import { WATUserSettings } from '../../types/watUserSettings';
import { useChat } from '../../context/ChatContext';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const CallsTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const { jitsiServerConfig, setJitsiServerConfig, setIsJitsiDevOpsOpen } = useChat();
  const c = settings.calls;
  const [jitsiInput, setJitsiInput] = useState(jitsiServerConfig.serverDomain || c.jitsiServerDomain);

  const handleToggle = (key: keyof typeof c) => {
    updateSettings((prev) => ({
      ...prev,
      calls: {
        ...prev.calls,
        [key]: !(prev.calls as any)[key],
      },
    }));
    showToast(`Updated ${String(key)}`);
  };

  const handleSaveJitsiDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const domain = jitsiInput.trim() || 'meet.wat.chat';
    setJitsiServerConfig((prev) => ({
      ...prev,
      serverDomain: domain,
      isCustomServer: true,
    }));
    updateSettings((prev) => ({
      ...prev,
      calls: {
        ...prev.calls,
        jitsiServerDomain: domain,
      },
    }));
    showToast(`Configured domain: ${domain}`);
  };

  const handleSaveTab = () => {
    showToast('Calls & audio settings saved');
  };

  return (
    <div className="space-y-6 text-neutral-900 bg-white">
      {/* Server Domain */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Calling Server
          </h2>
          <button
            type="button"
            onClick={() => setIsJitsiDevOpsOpen(true)}
            className="text-xs font-semibold text-neutral-600 hover:text-black"
          >
            Server Config
          </button>
        </div>

        <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-3">
          <div className="text-xs font-bold text-neutral-900">Calling Server Domain</div>
          <form onSubmit={handleSaveJitsiDomain} className="flex gap-2">
            <input
              type="text"
              value={jitsiInput}
              onChange={(e) => setJitsiInput(e.target.value)}
              placeholder="meet.wat.chat"
              className="flex-1 bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-black"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-black text-white font-semibold text-xs hover:bg-neutral-800"
            >
              Update
            </button>
          </form>
        </div>
      </section>

      {/* Audio & Video Controls */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900">
          Audio & Video Controls
        </h2>

        <div className="space-y-3">
          {/* Noise Suppression */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Noise Suppression</span>
              <p className="text-[11px] text-neutral-500">
                Filter ambient background noise during calls
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('noiseSuppression')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                c.noiseSuppression ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  c.noiseSuppression ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Echo Cancellation */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Echo Cancellation</span>
              <p className="text-[11px] text-neutral-500">
                Prevent speaker audio loopback
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('echoCancellation')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                c.echoCancellation ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  c.echoCancellation ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Silence Unknown Callers */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Silence Unknown Callers</span>
              <p className="text-[11px] text-neutral-500">
                Auto-silence calls from unknown contacts
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('silenceUnknownCallers')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                c.silenceUnknownCallers ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  c.silenceUnknownCallers ? 'translate-x-5' : 'translate-x-1'
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
