import React, { useState } from 'react';
import { WATUserSettings, LinkedDeviceSession } from '../../types/watUserSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const LinkedDevicesTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const devices = settings.linkedDevices;
  const [showQRModal, setShowQRModal] = useState(false);

  const handleLogoutDevice = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      linkedDevices: prev.linkedDevices.filter((d) => d.id !== id),
    }));
    showToast('Device logged out');
  };

  const handleSimulateNewLink = () => {
    const newSession: LinkedDeviceSession = {
      id: `dev-${Date.now()}`,
      name: 'Firefox on Linux (Ubuntu 24.04)',
      deviceType: 'desktop',
      os: 'Linux x86_64',
      browser: 'Mozilla Firefox 129.0',
      lastActive: 'Just linked',
      location: 'Nairobi, Kenya',
      ipAddress: '197.232.88.14',
      isCurrent: false,
    };
    updateSettings((prev) => ({
      ...prev,
      linkedDevices: [...prev.linkedDevices, newSession],
    }));
    setShowQRModal(false);
    showToast('New device paired');
  };

  const handleSaveTab = () => {
    showToast('Linked devices settings saved');
  };

  return (
    <div className="space-y-6 text-neutral-900 bg-white">
      {/* Linked Devices */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Active Devices ({devices.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
          >
            Link a Device
          </button>
        </div>

        {/* QR Linking Modal */}
        {showQRModal && (
          <div className="p-4 rounded-xl bg-white border border-black/[0.12] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900">Link New Device</h3>
              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="text-xs text-neutral-500 hover:text-black font-semibold"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-neutral-600">
              Point your camera at the QR code on your second device to link.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSimulateNewLink}
                className="px-4 py-2 rounded-lg bg-black text-white font-semibold text-xs hover:bg-neutral-800"
              >
                Simulate Device Pairing
              </button>
              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="px-4 py-2 rounded-lg border border-black/[0.15] text-neutral-700 font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {devices.map((dev) => (
            <div
              key={dev.id}
              className={`p-4 rounded-xl border transition-colors flex items-center justify-between ${
                dev.isCurrent
                  ? 'bg-neutral-50 border-black/[0.15]'
                  : 'bg-white border-black/[0.08]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900">{dev.name}</span>
                  {dev.isCurrent && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black text-white">
                      Current Device
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {dev.os} • {dev.browser} • Last active: {dev.lastActive}
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  {dev.location} • {dev.ipAddress}
                </div>
              </div>

              {!dev.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleLogoutDevice(dev.id)}
                  className="px-3 py-1.5 rounded-lg border border-black/[0.12] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04] transition-colors"
                >
                  Log Out
                </button>
              )}
            </div>
          ))}

          {devices.length === 0 && (
            <div className="p-4 text-center text-xs text-neutral-400">
              No linked devices
            </div>
          )}
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
