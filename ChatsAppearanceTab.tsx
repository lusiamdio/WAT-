import React from 'react';
import { WATUserSettings } from '../../types/watUserSettings';
import { useChat } from '../../context/ChatContext';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const ChatsAppearanceTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const { theme, setTheme } = useChat();
  const ch = settings.chats;

  const handleChatSettingChange = (key: keyof typeof ch, val: any) => {
    if (key === 'theme') {
      setTheme(val);
    }
    updateSettings((prev) => ({
      ...prev,
      chats: {
        ...prev.chats,
        [key]: val,
      },
    }));
    showToast(`Updated ${String(key)}`);
  };

  const handleToggle = (key: keyof typeof ch) => {
    updateSettings((prev) => ({
      ...prev,
      chats: {
        ...prev.chats,
        [key]: !(prev.chats as any)[key],
      },
    }));
    showToast(`Updated ${String(key)}`);
  };

  const handleTriggerBackup = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateSettings((prev) => ({
      ...prev,
      chats: {
        ...prev.chats,
        lastBackupTime: `Today at ${timeNow}`,
      },
    }));
    showToast('Backup completed successfully');
  };

  const handleSaveTab = () => {
    showToast('Chat settings saved');
  };

  return (
    <div className="space-y-6 text-neutral-900 bg-white">
      {/* Theme & Display */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Theme & Display
          </h2>
          <span className="text-[11px] font-mono text-neutral-500">
            Appearance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light' },
            { id: 'dark', label: 'Dark' },
            { id: 'system', label: 'System Default' },
          ].map((themeOpt) => (
            <button
              key={themeOpt.id}
              type="button"
              onClick={() => handleChatSettingChange('theme', themeOpt.id)}
              className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                ch.theme === themeOpt.id
                  ? 'border-black bg-black text-white'
                  : 'border-black/[0.12] bg-white text-neutral-800 hover:bg-black/[0.02]'
              }`}
            >
              <span className="text-xs font-semibold">{themeOpt.label}</span>
            </button>
          ))}
        </div>

        {/* Font Size & Wallpaper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">Chat Font Size</label>
            <div className="flex gap-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleChatSettingChange('fontSize', size)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                    ch.fontSize === size
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-black/[0.12] text-neutral-700 hover:bg-black/[0.02]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">Chat Wallpaper</label>
            <select
              value={ch.wallpaper}
              onChange={(e) => handleChatSettingChange('wallpaper', e.target.value)}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="matrix-subtle">Default Neutral</option>
              <option value="solid-dark">Minimal Dark</option>
              <option value="warm-sunset">Clean White</option>
            </select>
          </div>
        </div>
      </section>

      {/* Chat Behavior */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900">
          Chat Controls
        </h2>

        <div className="space-y-3">
          {/* Enter key behavior */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Enter Key Sends</span>
              <p className="text-[11px] text-neutral-500">
                Pressing Enter will send your message
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('enterIsSend')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                ch.enterIsSend ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  ch.enterIsSend ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Media Visibility */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Media Visibility</span>
              <p className="text-[11px] text-neutral-500">
                Save downloaded media to local photo album
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('mediaVisibility')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                ch.mediaVisibility ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  ch.mediaVisibility ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Keep Chats Archived */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Keep Chats Archived</span>
              <p className="text-[11px] text-neutral-500">
                Archived chats remain hidden when new messages arrive
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('keepChatsArchived')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                ch.keepChatsArchived ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  ch.keepChatsArchived ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Chat Backup */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Chat Backup
          </h2>
          <span className="text-[11px] font-mono text-neutral-500">{ch.backupSize}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-neutral-900">Last Backup</div>
            <div className="text-[11px] text-neutral-600 font-mono">{ch.lastBackupTime}</div>
          </div>

          <button
            type="button"
            onClick={handleTriggerBackup}
            className="px-4 py-2 rounded-lg bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
          >
            Back Up Now
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => showToast('Chat export created')}
            className="p-3.5 rounded-xl bg-white border border-black/[0.08] hover:bg-black/[0.02] text-left transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900">Export Chat History</div>
            <div className="text-[11px] text-neutral-500">Download formatted chat logs</div>
          </button>

          <button
            type="button"
            onClick={() => showToast('All inactive chats archived')}
            className="p-3.5 rounded-xl bg-white border border-black/[0.08] hover:bg-black/[0.02] text-left transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900">Archive All Chats</div>
            <div className="text-[11px] text-neutral-500">Organize active inbox list</div>
          </button>
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
