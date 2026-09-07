import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Key,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { PremiumEmoji } from './PremiumEmoji';

export const E2EEVerificationModal: React.FC = () => {
  const { isE2EEOpen, setIsE2EEOpen, currentUser, activeRoom } = useChat();
  const [isVerified, setIsVerified] = useState(true);

  if (!isE2EEOpen) return null;

  // Emoji SAS Verification list
  const sasEmojis = [
    { emoji: '🦊', label: 'Fox' },
    { emoji: '🎸', label: 'Guitar' },
    { emoji: '💎', label: 'Diamond' },
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '🍕', label: 'Pizza' },
    { emoji: '🌴', label: 'Palm Tree' },
    { emoji: '⚡', label: 'Lightning' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl w-full max-w-lg shadow-[0_24px_48px_rgba(0,0,0,0.14)] overflow-hidden text-neutral-900">
        {/* Header */}
        <div className="px-6 py-4 bg-white/80 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900">
                End-to-End Encryption (E2EE)
              </h3>
              <p className="text-xs text-neutral-500">
                Matrix Vodozemac (Rust) • Olm & Megolm Ratchet
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsE2EEOpen(false)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-black hover:bg-black/[0.04] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Room Security Status */}
          <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.08] flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-neutral-900 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-neutral-900">
                Room Encrypted: {activeRoom?.name || 'Active Session'}
              </h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Session ID: <span className="font-mono text-neutral-800 font-semibold">{activeRoom?.e2eeSessionId || 'megolm_sess_8912'}</span>
              </p>
            </div>
          </div>

          {/* Interactive Emoji SAS Match */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Cross-Signing Verification (SAS Emojis)
              </label>
              <span className="text-[10px] text-neutral-800 font-bold">
                Compare with recipient
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-3 leading-relaxed">
              Verify that the 7 emoji symbols shown below match exactly on your recipient's screen to guarantee no man-in-the-middle interception:
            </p>

            <div className="grid grid-cols-7 gap-1.5 bg-black/[0.02] p-3 rounded-2xl border border-black/[0.06]">
              {sasEmojis.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-2 rounded-xl bg-white border border-black/[0.06] shadow-2xs hover:border-black/30 transition-colors"
                >
                  <PremiumEmoji emoji={item.emoji} className="w-7 h-7 mb-1" />
                  <span className="text-[9px] text-neutral-600 truncate font-mono font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Verified Devices */}
          <div>
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-2">
              Cryptographic Devices & Keys
            </label>
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-neutral-800" />
                  <div>
                    <div className="text-xs font-bold text-neutral-900">
                      Primary Matrix Device (This Session)
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500">
                      ID: {currentUser.deviceId || 'DEV_AFRICA_01'} • Ed25519 Verified
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-black text-white text-[10px] font-bold">
                  Verified
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-neutral-800" />
                  <div>
                    <div className="text-xs font-bold text-neutral-900">
                      Master Key (Recovery Key Backup)
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500">
                      SHA256: 7f8a...9c21 (Encrypted in secure local storage)
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-black/[0.05] text-neutral-700 text-[10px] font-bold">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/80 border-t border-black/[0.06] flex items-center justify-between">
          <button
            onClick={() => setIsE2EEOpen(false)}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-neutral-600 hover:text-black hover:bg-black/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsVerified(true);
              setIsE2EEOpen(false);
            }}
            className="px-5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>They Match (Verify Keys)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
