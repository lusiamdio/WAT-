import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { User } from '../types';

interface UserProfileModalProps {
  user: User | null;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  const {
    currentUser,
    createRoom,
    setActiveTab,
    startCall,
    setIsEditProfileOpen,
    sendMoney,
    walletCurrency,
  } = useChat();

  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [sendAmount, setSendAmount] = useState('100');
  const [sendNote, setSendNote] = useState('Payment via WAT');

  if (!user) return null;

  const isSelf = user.id === currentUser.id;

  const handleStartChat = () => {
    onClose();
    if (isSelf) {
      setActiveTab('chats');
      return;
    }
    createRoom(`${user.name}`, 'direct', [user.id]);
    setActiveTab('chats');
  };

  const handleCall = (type: 'voice' | 'video') => {
    onClose();
    startCall(`direct_${user.id}`, type);
  };

  const handleExecuteSendMoney = () => {
    const val = parseFloat(sendAmount);
    if (!val || val <= 0) return;
    sendMoney(val, user.name, user.handle, sendNote);
    setShowSendMoneyModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col w-full h-full text-neutral-900 select-none overflow-hidden">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-4 bg-white border-b border-black/[0.08] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-neutral-900">
            {user.name}
          </h1>
          <p className="text-xs font-mono text-neutral-500">
            {user.handle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSelf ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsEditProfileOpen(true);
              }}
              className="px-4 py-1.5 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04] transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSendMoneyModal(true)}
              className="px-4 py-1.5 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04] transition-colors"
            >
              Send Money
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
      </header>

      {/* Main Profile Details */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Identity Card */}
          <section className="bg-white border border-black/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border border-black/[0.1]"
            />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-900">{user.name}</h2>
                {(user.verified || (user as any).isVerified) && (
                  <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-semibold">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-neutral-500">{user.handle}</p>
              {user.statusMessage && (
                <p className="text-xs text-neutral-700 italic">"{user.statusMessage}"</p>
              )}
              {user.bio && (
                <p className="text-xs text-neutral-600 leading-relaxed">{user.bio}</p>
              )}

              {!isSelf && (
                <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={handleStartChat}
                    className="px-4 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                  >
                    Direct Message
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCall('voice')}
                    className="px-4 py-2 rounded-lg border border-black/[0.15] text-neutral-700 text-xs font-semibold hover:bg-black/[0.04] transition-colors"
                  >
                    Voice Call
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCall('video')}
                    className="px-4 py-2 rounded-lg border border-black/[0.15] text-neutral-700 text-xs font-semibold hover:bg-black/[0.04] transition-colors"
                  >
                    Video Call
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Details & Metadata */}
          <section className="bg-white border border-black/[0.08] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">Contact & Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {user.phone && (
                <div className="p-3 rounded-xl border border-black/[0.06] bg-white">
                  <span className="text-neutral-500 text-[11px] block">Phone</span>
                  <span className="font-semibold text-neutral-900 font-mono">{user.phone}</span>
                </div>
              )}
              {user.email && (
                <div className="p-3 rounded-xl border border-black/[0.06] bg-white">
                  <span className="text-neutral-500 text-[11px] block">Email</span>
                  <span className="font-semibold text-neutral-900">{user.email}</span>
                </div>
              )}
              {user.location && (
                <div className="p-3 rounded-xl border border-black/[0.06] bg-white">
                  <span className="text-neutral-500 text-[11px] block">Location</span>
                  <span className="font-semibold text-neutral-900">{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="p-3 rounded-xl border border-black/[0.06] bg-white">
                  <span className="text-neutral-500 text-[11px] block">Website</span>
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-neutral-900 hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Social Links */}
          {user.socialLinks && user.socialLinks.length > 0 && (
            <section className="bg-white border border-black/[0.08] rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-neutral-900">Links</h3>
              <div className="space-y-2">
                {user.socialLinks.map((sl, idx) => (
                  <a
                    key={idx}
                    href={sl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-black/[0.06] bg-white hover:bg-black/[0.02] flex items-center justify-between transition-colors block text-xs"
                  >
                    <span className="font-bold capitalize text-neutral-900">{sl.platform}</span>
                    <span className="font-mono text-neutral-500 text-[11px]">{sl.url}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Send money overlay if opened */}
      {showSendMoneyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-black/[0.1] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-neutral-900">Send Payment to {user.name}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700">Amount ({walletCurrency})</label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700">Payment Note</label>
                <input
                  type="text"
                  value={sendNote}
                  onChange={(e) => setSendNote(e.target.value)}
                  className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSendMoneyModal(false)}
                className="px-4 py-2 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteSendMoney}
                className="px-4 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Confirm Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
