import React from 'react';
import { useChat } from '../context/ChatContext';

export const UserSwitcherModal: React.FC = () => {
  const { isUserSwitcherOpen, setIsUserSwitcherOpen, users, currentUser, setCurrentUserById, setIsSettingsOpen } = useChat();

  if (!isUserSwitcherOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col w-full h-full text-neutral-900 select-none overflow-hidden">
      {/* Header */}
      <header className="px-4 sm:px-8 py-4 bg-white border-b border-black/[0.08] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-neutral-900">
            Switch Account
          </h1>
          <p className="text-xs text-neutral-500">
            Select an account to switch profiles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsUserSwitcherOpen(false);
              setIsSettingsOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04] transition-colors"
          >
            Settings
          </button>
          <button
            type="button"
            onClick={() => setIsUserSwitcherOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
      </header>

      {/* User list */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white">
        <div className="max-w-2xl mx-auto space-y-3">
          {users.map((u) => {
            const isActive = u.id === currentUser.id;
            return (
              <div
                key={u.id}
                onClick={() => {
                  setCurrentUserById(u.id);
                  setIsUserSwitcherOpen(false);
                }}
                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-white border-black/[0.08] hover:bg-black/[0.02] text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover border border-black/[0.1]"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ${
                        isActive ? 'ring-black' : 'ring-white'
                      } ${u.isOnline ? 'bg-emerald-500' : 'bg-neutral-400'}`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-neutral-900'}`}>
                        {u.name}
                      </h2>
                      {u.isVerified && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          Verified
                        </span>
                      )}
                    </div>
                    <div className={`text-xs font-mono ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {u.handle}
                    </div>
                    <div className={`text-[11px] truncate max-w-sm ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {u.statusMessage || u.location}
                    </div>
                  </div>
                </div>

                {isActive ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-md bg-white text-black">
                    Active
                  </span>
                ) : (
                  <button
                    type="button"
                    className="text-xs font-semibold px-3 py-1 rounded-lg border border-black/[0.12] text-neutral-700 hover:bg-black/[0.04]"
                  >
                    Select
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
