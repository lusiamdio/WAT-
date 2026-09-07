import React, { useState } from 'react';
import { WATUserSettings, BlockedContact } from '../../types/watUserSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const PrivacyTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const priv = settings.privacy;
  const [newBlockedName, setNewBlockedName] = useState('');
  const [newBlockedPhone, setNewBlockedPhone] = useState('');
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);

  const handlePrivacyChange = (key: keyof typeof priv, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: val,
      },
    }));
    showToast(`Updated ${String(key)}`);
  };

  const handleUnblock = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        blockedContacts: prev.privacy.blockedContacts.filter((c) => c.id !== id),
      },
    }));
    showToast('Contact unblocked');
  };

  const handleAddBlocked = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedName.trim()) return;
    const newContact: BlockedContact = {
      id: `blk-${Date.now()}`,
      name: newBlockedName.trim(),
      phone: newBlockedPhone.trim() || '+000 000 0000',
      handle: `@${newBlockedName.toLowerCase().replace(/\s+/g, '_')}:matrix.org`,
      blockedAt: new Date().toISOString().split('T')[0],
    };
    updateSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        blockedContacts: [...prev.privacy.blockedContacts, newContact],
      },
    }));
    showToast(`Blocked ${newBlockedName}`);
    setNewBlockedName('');
    setNewBlockedPhone('');
    setShowAddBlockModal(false);
  };

  const handleSaveTab = () => {
    showToast('Privacy settings saved');
  };

  return (
    <div className="space-y-6 text-neutral-900 bg-white">
      {/* Profile Visibility */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Profile Visibility
          </h2>
          <span className="text-[11px] font-mono text-neutral-500">
            Privacy Policies
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">Last Seen & Online</label>
            <p className="text-[11px] text-neutral-500">Who can see when you are active</p>
            <select
              value={priv.lastSeenAndOnline}
              onChange={(e) => handlePrivacyChange('lastSeenAndOnline', e.target.value as any)}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">Profile Photo</label>
            <p className="text-[11px] text-neutral-500">Who can view your profile picture</p>
            <select
              value={priv.profilePhoto}
              onChange={(e) => handlePrivacyChange('profilePhoto', e.target.value as any)}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">About & Bio</label>
            <p className="text-[11px] text-neutral-500">Who can view your status description</p>
            <select
              value={priv.about}
              onChange={(e) => handlePrivacyChange('about', e.target.value as any)}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">Status Stories</label>
            <p className="text-[11px] text-neutral-500">Audience for status updates</p>
            <select
              value={priv.status}
              onChange={(e) => handlePrivacyChange('status', e.target.value as any)}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="contacts">My Contacts</option>
              <option value="contacts_except">My Contacts Except...</option>
              <option value="only_share_with">Only Share With...</option>
            </select>
          </div>
        </div>
      </section>

      {/* Messaging Privacy */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900">
          Messaging Controls
        </h2>

        <div className="space-y-3">
          {/* Read Receipts */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Read Receipts</span>
              <p className="text-[11px] text-neutral-500">
                Send and receive read confirmation receipts
              </p>
            </div>
            <button
              type="button"
              onClick={() => handlePrivacyChange('readReceipts', !priv.readReceipts)}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                priv.readReceipts ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  priv.readReceipts ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Disappearing Messages */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Default Message Timer</span>
              <p className="text-[11px] text-neutral-500">
                Automatic disappearance period for new chats
              </p>
            </div>
            <select
              value={priv.defaultMessageTimer}
              onChange={(e) => handlePrivacyChange('defaultMessageTimer', parseInt(e.target.value))}
              className="bg-white border border-black/[0.12] rounded-lg px-3 py-1.5 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value={0}>Off</option>
              <option value={86400}>24 Hours</option>
              <option value={604800}>7 Days</option>
              <option value={7776000}>90 Days</option>
            </select>
          </div>

          {/* Groups */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Groups (Who Can Add Me)</span>
              <p className="text-[11px] text-neutral-500">
                Accounts permitted to add you to group chats
              </p>
            </div>
            <select
              value={priv.groupsWhoCanAdd}
              onChange={(e) => handlePrivacyChange('groupsWhoCanAdd', e.target.value as any)}
              className="bg-white border border-black/[0.12] rounded-lg px-3 py-1.5 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody (Invite only)</option>
            </select>
          </div>

          {/* Silence Unknown Callers */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Silence Unknown Callers</span>
              <p className="text-[11px] text-neutral-500">
                Calls from unknown numbers will be silenced automatically
              </p>
            </div>
            <button
              type="button"
              onClick={() => handlePrivacyChange('silenceUnknownCallers', !priv.silenceUnknownCallers)}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                priv.silenceUnknownCallers ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  priv.silenceUnknownCallers ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Blocked Contacts */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Blocked Contacts ({priv.blockedContacts.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowAddBlockModal(true)}
            className="px-3 py-1.5 rounded-lg bg-black/[0.05] hover:bg-black/[0.1] text-xs font-semibold text-neutral-800 transition-colors"
          >
            Add Block
          </button>
        </div>

        {showAddBlockModal && (
          <form onSubmit={handleAddBlocked} className="p-4 rounded-xl bg-white border border-black/[0.12] space-y-3">
            <h3 className="text-xs font-bold text-neutral-900">Block Contact or Number</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Name or handle"
                value={newBlockedName}
                onChange={(e) => setNewBlockedName(e.target.value)}
                className="bg-white border border-black/[0.12] rounded-lg px-3 py-1.5 text-xs text-neutral-900 outline-none"
              />
              <input
                type="text"
                placeholder="Phone number"
                value={newBlockedPhone}
                onChange={(e) => setNewBlockedPhone(e.target.value)}
                className="bg-white border border-black/[0.12] rounded-lg px-3 py-1.5 text-xs text-neutral-900 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
              >
                Confirm Block
              </button>
              <button
                type="button"
                onClick={() => setShowAddBlockModal(false)}
                className="px-3 py-1.5 rounded-lg border border-black/[0.15] text-neutral-700 font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {priv.blockedContacts.map((blk) => (
            <div
              key={blk.id}
              className="p-3.5 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-neutral-900">{blk.name}</div>
                <div className="text-[11px] font-mono text-neutral-500">{blk.phone} • {blk.handle}</div>
              </div>
              <button
                type="button"
                onClick={() => handleUnblock(blk.id)}
                className="px-3 py-1.5 rounded-lg border border-black/[0.12] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04]"
              >
                Unblock
              </button>
            </div>
          ))}

          {priv.blockedContacts.length === 0 && (
            <div className="p-4 text-center text-xs text-neutral-400">
              No blocked contacts
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
