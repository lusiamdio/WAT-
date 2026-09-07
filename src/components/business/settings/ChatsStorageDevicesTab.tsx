import React from 'react';
import {
  HardDrive,
  Laptop,
  Smartphone,
  Cloud,
  CheckCircle2,
  Trash2,
  LogOut,
  Plus,
} from 'lucide-react';
import { WATBusinessSettings } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const ChatsStorageDevicesTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const chatsStorage = settings.chatsStorage;
  const linkedDevices = settings.linkedDevices;

  const handleBackupToggle = (key: keyof typeof chatsStorage) => {
    updateSettings((prev) => ({
      ...prev,
      chatsStorage: {
        ...prev.chatsStorage,
        [key]: !(prev.chatsStorage as any)[key],
      },
    }));
    showToast(`Storage setting changed: ${String(key)}`);
  };

  const handleDisconnectDevice = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      linkedDevices: prev.linkedDevices.filter((d) => d.id !== id),
    }));
    showToast('Device session terminated');
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* 13. Linked Devices */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-neutral-100">13. 💻 Linked Devices & Multi-Device Sync</h3>
          </div>
          <button
            type="button"
            onClick={() => showToast('Scan QR code with mobile phone to link terminal')}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Link New Device</span>
          </button>
        </div>

        <div className="space-y-3">
          {linkedDevices.map((dev) => (
            <div
              key={dev.id}
              className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                  {dev.deviceType === 'desktop' ? <Laptop className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-100">{dev.deviceName}</span>
                    {dev.isCurrent && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {dev.os} • {dev.location} (IP: {dev.ipAddress})
                  </div>
                </div>
              </div>

              {!dev.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleDisconnectDevice(dev.id)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-rose-500/20 hover:text-rose-400 text-neutral-400 text-xs font-semibold border border-neutral-800 flex items-center gap-1 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 12. Chats & Storage Management */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">12. 💾 Cloud Storage & Encrypted Backups</h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {chatsStorage.storageUsedMB} MB / {(chatsStorage.totalAvailableMB / 1024).toFixed(0)} GB USED
          </span>
        </div>

        <div className="w-full bg-neutral-950 rounded-full h-2.5 overflow-hidden border border-neutral-800">
          <div
            className="bg-emerald-500 h-full rounded-full"
            style={{ width: `${(chatsStorage.storageUsedMB / chatsStorage.totalAvailableMB) * 100 * 15}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {[
            { key: 'encryptedCloudBackup', label: 'End-to-End Encrypted Cloud Backup' },
            { key: 'includeVideosInBackup', label: 'Include Showroom Video Recordings' },
            { key: 'autoDownloadPhotos', label: 'Auto-Download Product Photos' },
            { key: 'archiveChatsKeepArchived', label: 'Keep Inactive Inquiries Archived' },
          ].map((item) => {
            const active = (chatsStorage as any)[item.key];
            return (
              <div
                key={item.key}
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
              >
                <div className="text-xs font-bold text-neutral-200">{item.label}</div>
                <button
                  type="button"
                  onClick={() => handleBackupToggle(item.key as any)}
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
