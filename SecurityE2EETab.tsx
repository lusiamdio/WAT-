import React from 'react';
import { WATUserSettings } from '../../types/watUserSettings';
import { useChat } from '../../context/ChatContext';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const SecurityE2EETab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const { currentUser, setIsE2EEOpen } = useChat();
  const sec = settings.security;

  const handleSecurityToggle = (key: keyof typeof sec) => {
    updateSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: !(prev.security as any)[key],
      },
    }));
    showToast(`Updated ${String(key)}`);
  };

  const copyToClipboard = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt);
    showToast(`Copied ${label}`);
  };

  const handleSaveTab = () => {
    showToast('Security settings saved');
  };

  return (
    <div className="space-y-6 text-neutral-900 bg-white">
      {/* Encryption Status */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            End-to-End Encryption
          </h2>
          <span className="text-[11px] font-mono text-neutral-500">
            Active
          </span>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">
          Messages and calls are encrypted end-to-end. Only you and the recipient can read or listen to them.
        </p>

        <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-neutral-900">Device Identity Key</div>
            <div className="font-mono text-xs text-neutral-700">
              {currentUser.e2eeFingerprint || 'ed25519:7x8a+WAT...k92M/matrix'}
            </div>
            <div className="text-[11px] text-neutral-500">Device ID: {currentUser.deviceId || 'WAT_WEB_01'}</div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(currentUser.e2eeFingerprint, 'Identity Key')}
              className="px-3 py-1.5 rounded-lg border border-black/[0.12] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04]"
            >
              Copy Key
            </button>
            <button
              type="button"
              onClick={() => setIsE2EEOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800"
            >
              Verify Keys
            </button>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900">
          Account Protection
        </h2>

        <div className="space-y-3">
          {/* Encrypted Backups */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Encrypted Cloud Backups</span>
              <p className="text-[11px] text-neutral-500">
                Protect backup archives with a 64-digit encryption key
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSecurityToggle('encryptedBackups')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                sec.encryptedBackups ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  sec.encryptedBackups ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Passkeys */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Passkeys</span>
              <p className="text-[11px] text-neutral-500">
                Sign in with biometric hardware authentication
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSecurityToggle('passkeyRegistered')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                sec.passkeyRegistered ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  sec.passkeyRegistered ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Biometric App Lock */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Biometric App Lock</span>
              <p className="text-[11px] text-neutral-500">
                Require authentication each time the app is opened
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSecurityToggle('biometricLock')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                sec.biometricLock ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  sec.biometricLock ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Security Code Change Alerts */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Security Notifications</span>
              <p className="text-[11px] text-neutral-500">
                Alerts when security code changes with contacts
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSecurityToggle('securityCodeAlerts')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                sec.securityCodeAlerts ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  sec.securityCodeAlerts ? 'translate-x-5' : 'translate-x-1'
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
