import React from 'react';
import {
  Shield,
  Lock,
  Eye,
  Key,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { WATBusinessSettings } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const PrivacySecurityTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const privacy = settings.privacy;
  const security = settings.security;

  const handlePrivacyToggle = (key: keyof typeof privacy) => {
    updateSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !(prev.privacy as any)[key],
      },
    }));
    showToast(`Privacy option updated: ${String(key)}`);
  };

  const handleSecurityToggle = (key: keyof typeof security) => {
    updateSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: !(prev.security as any)[key],
      },
    }));
    showToast(`Security option updated: ${String(key)}`);
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* 10. Privacy Settings */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-neutral-100">10. 🛡️ Customer Privacy & Read Receipts</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">ENCRYPTED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'readReceipts', label: 'Blue Read Receipts (Ticks)', desc: 'Show customers when messages are read' },
            { key: 'typingIndicator', label: 'Typing Indicator in Chat', desc: 'Display "typing..." to active shoppers' },
            { key: 'recordingIndicator', label: 'Voice Recording Indicator', desc: 'Display audio wave while recording' },
            { key: 'screenshotProtection', label: 'Screenshot Protection', desc: 'Prevent screenshots of invoices' },
            { key: 'appLockEnabled', label: 'Biometric App Lock', desc: 'Require FaceID / TouchID on idle' },
          ].map((item) => {
            const active = (privacy as any)[item.key];
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
                  onClick={() => handlePrivacyToggle(item.key as any)}
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

      {/* 11. Security Settings */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">11. 🔐 Security & Two-Step Verification</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">HARDENED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'twoStepVerification', label: '2-Step Verification PIN', desc: 'Mandatory PIN for account migration' },
            { key: 'biometricLock', label: 'Biometric Staff Authentication', desc: 'Fingerprint or FaceID login' },
            { key: 'loginAlerts', label: 'New Device Login Alerts', desc: 'SMS & Email alert upon new web session' },
            { key: 'backupEncryption', label: 'End-to-End Encrypted Backups', desc: 'Cloud storage encrypted with custom key' },
            { key: 'trustedDevicesOnly', label: 'Trusted Devices Restriction', desc: 'Disallow logins from unverified IPs' },
          ].map((item) => {
            const active = (security as any)[item.key];
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
                  onClick={() => handleSecurityToggle(item.key as any)}
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
