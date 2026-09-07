import React from 'react';
import { WATUserSettings } from '../../types/watUserSettings';
import { useChat } from '../../context/ChatContext';
import { NetworkMode } from '../../types';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const StorageDataMediaTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const {
    networkMode,
    setNetworkMode,
    outboxQueue,
    flushOutboxQueue,
    clearAllAppData,
  } = useChat();

  const st = settings.storage;
  const auto = st.mediaAutoDownload;

  const handleAutoDownloadToggle = (
    network: 'mobileData' | 'wifi' | 'roaming',
    mediaType: 'photos' | 'audio' | 'videos' | 'documents'
  ) => {
    updateSettings((prev) => ({
      ...prev,
      storage: {
        ...prev.storage,
        mediaAutoDownload: {
          ...prev.storage.mediaAutoDownload,
          [network]: {
            ...prev.storage.mediaAutoDownload[network],
            [mediaType]: !prev.storage.mediaAutoDownload[network][mediaType],
          },
        },
      },
    }));
    showToast(`Updated auto-download for ${mediaType}`);
  };

  const handleLowDataToggle = () => {
    updateSettings((prev) => ({
      ...prev,
      storage: {
        ...prev.storage,
        useLessDataForCalls: !prev.storage.useLessDataForCalls,
      },
    }));
    showToast(`Low data mode ${!st.useLessDataForCalls ? 'enabled' : 'disabled'}`);
  };

  const handleClearCache = (type: string) => {
    showToast(`Cleared temporary ${type} cache`);
  };

  const handleSaveTab = () => {
    showToast('Storage & data settings saved');
  };

  return (
    <div className="space-y-6 text-neutral-900 bg-white">
      {/* Storage Visualizer */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Storage Usage
          </h2>
          <span className="text-[11px] font-mono text-neutral-500 font-semibold">
            {(st.storageUsedMB / 1024).toFixed(1)} GB of {(st.totalStorageMB / 1024).toFixed(0)} GB used
          </span>
        </div>

        <div className="space-y-2">
          <div className="w-full h-3 rounded-full bg-neutral-100 border border-black/[0.06] overflow-hidden flex">
            <div style={{ width: '45%' }} className="bg-neutral-900 h-full" />
            <div style={{ width: '30%' }} className="bg-neutral-600 h-full" />
            <div style={{ width: '15%' }} className="bg-neutral-400 h-full" />
            <div style={{ width: '10%' }} className="bg-neutral-300 h-full" />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="text-neutral-700">Photos ({st.photosMB} MB)</span>
            <span className="text-neutral-700">Videos ({st.videosMB} MB)</span>
            <span className="text-neutral-700">Audio ({st.audioMB} MB)</span>
            <span className="text-neutral-700">Documents ({st.docsMB} MB)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleClearCache('duplicate media')}
            className="p-3 rounded-xl border border-black/[0.08] bg-white hover:bg-black/[0.02] text-left transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900">Review Large Files</div>
            <div className="text-[11px] text-neutral-500">Free up local device space</div>
          </button>

          <button
            type="button"
            onClick={() => handleClearCache('cached stickers')}
            className="p-3 rounded-xl border border-black/[0.08] bg-white hover:bg-black/[0.02] text-left transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900">Clear Cache</div>
            <div className="text-[11px] text-neutral-500">Remove temporary cached data</div>
          </button>
        </div>
      </section>

      {/* Auto-Download Settings */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900">
          Media Auto-Download
        </h2>

        <div className="space-y-3">
          {(['mobileData', 'wifi', 'roaming'] as const).map((network) => {
            const netLabel =
              network === 'mobileData'
                ? 'When using mobile data'
                : network === 'wifi'
                ? 'When connected on Wi-Fi'
                : 'When roaming';

            return (
              <div key={network} className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
                <div className="text-xs font-bold text-neutral-900">{netLabel}</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['photos', 'audio', 'videos', 'documents'] as const).map((media) => {
                    const isChecked = auto[network][media];
                    return (
                      <button
                        key={media}
                        type="button"
                        onClick={() => handleAutoDownloadToggle(network, media)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                          isChecked
                            ? 'bg-black text-white border-black'
                            : 'bg-white border-black/[0.12] text-neutral-700 hover:bg-black/[0.02]'
                        }`}
                      >
                        {media}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Optimization & Network Simulation */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900">
          Network Connectivity & Outbox Queue
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-neutral-900">Network Simulation Mode</div>
                <div className="text-[11px] text-neutral-500">
                  Simulate Matrix message behavior across different connectivity environments
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/[0.05] text-neutral-800 font-semibold uppercase">
                {networkMode}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['online', 'slow-3g', 'offline'] as NetworkMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setNetworkMode(mode);
                    showToast(`Network mode set to ${mode.toUpperCase()}`);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    networkMode === mode
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white border-black/[0.10] text-neutral-700 hover:bg-black/[0.02]'
                  }`}
                >
                  {mode === 'online' ? 'Online (Fast)' : mode === 'slow-3g' ? 'Slow 3G' : 'Offline Mode'}
                </button>
              ))}
            </div>

            {outboxQueue.length > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-black/[0.06] mt-2">
                <span className="text-xs text-amber-700 font-medium">
                  {outboxQueue.length} message{outboxQueue.length > 1 ? 's' : ''} queued locally in outbox
                </span>
                <button
                  type="button"
                  onClick={() => {
                    flushOutboxQueue();
                    showToast('Outbox queue flushed to Matrix homeserver');
                  }}
                  className="px-3 py-1 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Flush Outbox Now
                </button>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Use Less Data for Calls</span>
              <p className="text-[11px] text-neutral-500">
                Reduces bandwidth consumption during audio and video calls
              </p>
            </div>
            <button
              type="button"
              onClick={handleLowDataToggle}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                st.useLessDataForCalls ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  st.useLessDataForCalls ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-red-50/50 border border-red-200/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-red-900">Reset Local Storage & Cache</span>
              <p className="text-[11px] text-red-700">
                Clear all cached Matrix state, rooms, messages, and restore default state
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset local storage cache?')) {
                  clearAllAppData();
                  showToast('App state and storage cache reset');
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
            >
              Reset Storage
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
