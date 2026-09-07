import React, { useState, useRef } from 'react';
import { WATUserSettings } from '../../types/watUserSettings';
import { useChat } from '../../context/ChatContext';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const ProfileAccountTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const { currentUser, updateUserProfile } = useChat();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acc = settings.account;
  const prof = settings.profile;

  const [isChangingNumber, setIsChangingNumber] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfileChange = (key: keyof typeof prof, val: string) => {
    updateSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: val,
      },
    }));
  };

  const handleAccountChange = (key: keyof typeof acc, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        [key]: val,
      },
    }));
    showToast(`Updated ${String(key)}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      handleProfileChange('avatar', dataUrl);
      updateUserProfile(currentUser.id, { avatar: dataUrl });
      showToast('Profile photo updated successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyNewNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoneNumber.trim()) return;
    updateSettings((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        phoneNumber: newPhoneNumber,
      },
      profile: {
        ...prev.profile,
        phoneNumber: newPhoneNumber,
      },
    }));
    showToast(`Phone number updated to ${newPhoneNumber}`);
    setIsChangingNumber(false);
    setNewPhoneNumber('');
  };

  const copyToClipboard = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt);
    showToast(`Copied ${label}`);
  };

  const handleSaveTab = () => {
    updateUserProfile(currentUser.id, {
      name: prof.name,
      avatar: prof.avatar || currentUser.avatar,
      statusMessage: prof.statusMessage,
    });
    showToast('Profile & Account settings saved');
  };

  return (
    <div className="space-y-6 text-neutral-900 bg-white">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Section */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Public Profile
          </h2>
          <span className="text-[11px] font-mono text-neutral-500">
            Account Synced
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="flex flex-col items-center gap-2">
            <img
              src={prof.avatar || currentUser.avatar}
              alt={prof.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-black/[0.12]"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 text-xs font-semibold text-neutral-700 bg-black/[0.05] hover:bg-black/[0.1] rounded-lg transition-colors"
            >
              Upload Photo
            </button>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  type="text"
                  value={prof.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full mt-1 bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-semibold focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                  Username / Handle
                </label>
                <div className="flex items-center gap-1.5 mt-1 bg-white border border-black/[0.12] rounded-lg px-3 py-2">
                  <input
                    type="text"
                    value={prof.handle}
                    onChange={(e) => handleProfileChange('handle', e.target.value)}
                    className="flex-1 bg-transparent text-xs text-neutral-900 font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(prof.handle, 'Handle')}
                    className="text-[11px] font-semibold text-neutral-500 hover:text-black"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                Status Message
              </label>
              <input
                type="text"
                value={prof.statusMessage}
                onChange={(e) => handleProfileChange('statusMessage', e.target.value)}
                placeholder="Available"
                className="w-full mt-1 bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 focus:border-black outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                  Location
                </label>
                <input
                  type="text"
                  value={prof.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  className="w-full mt-1 bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={prof.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full mt-1 bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 focus:border-black outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account & Security Settings */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Account & Security
          </h2>
          <span className="text-[11px] font-mono text-neutral-500">
            Secured
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Phone Number */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">
                Registered Phone Number
              </span>
              <button
                type="button"
                onClick={() => setIsChangingNumber(!isChangingNumber)}
                className="text-[11px] text-neutral-600 hover:text-black font-semibold"
              >
                {isChangingNumber ? 'Cancel' : 'Change'}
              </button>
            </div>
            <div className="text-xs font-mono text-neutral-800 font-semibold">{acc.phoneNumber}</div>
            {isChangingNumber && (
              <form onSubmit={handleApplyNewNumber} className="mt-2 pt-2 border-t border-black/[0.06] space-y-2">
                <input
                  type="text"
                  placeholder="Enter new phone number"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-1.5 text-xs text-neutral-900 outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-black text-white font-semibold text-xs"
                >
                  Update Phone Number
                </button>
              </form>
            )}
          </div>

          {/* Two-Step Verification */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">
                Two-Step Verification
              </span>
              <button
                type="button"
                onClick={() => handleAccountChange('twoStepEnabled', !acc.twoStepEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                  acc.twoStepEnabled ? 'bg-black' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    acc.twoStepEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-neutral-500">
              Require a 6-digit PIN when registering account on new devices.
            </p>
          </div>

          {/* Passkeys */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">
                Passkeys Sign-In
              </span>
              <button
                type="button"
                onClick={() => handleAccountChange('passkeysEnabled', !acc.passkeysEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                  acc.passkeysEnabled ? 'bg-black' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    acc.passkeysEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-neutral-500">
              Sign in with biometric or system passkeys.
            </p>
          </div>

          {/* Security Alerts */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">
                Security Notifications
              </span>
              <button
                type="button"
                onClick={() => handleAccountChange('securityNotifications', !acc.securityNotifications)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                  acc.securityNotifications ? 'bg-black' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    acc.securityNotifications ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-neutral-500">
              Receive alerts when encryption keys change.
            </p>
          </div>
        </div>

        {/* Server Info */}
        <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-neutral-900">Server Connection</span>
            <p className="text-[11px] text-neutral-500 font-mono">{acc.matrixHomeserver}</p>
          </div>
          <span className="text-[11px] font-semibold text-neutral-600">
            Connected
          </span>
        </div>
      </section>

      {/* Account Lifecycle */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900">
          Account Management
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => showToast('Account data export requested.')}
            className="p-3.5 rounded-xl bg-white border border-black/[0.08] hover:bg-black/[0.02] text-left transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900">Export Account Data</div>
            <div className="text-[11px] text-neutral-500">Download report of account information</div>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
            className="p-3.5 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-left transition-colors"
          >
            <div className="text-xs font-bold text-red-600">Delete Account</div>
            <div className="text-[11px] text-neutral-500">Permanently remove credentials and history</div>
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
            <div className="text-xs font-bold text-red-700">
              Are you sure you want to delete your account?
            </div>
            <p className="text-[11px] text-red-600">
              This will permanently delete your account history and encryption keys.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Account deletion simulated.');
                  setShowDeleteConfirm(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-black/[0.15] bg-white text-neutral-700 font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Cancel and Save Section Footer */}
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
