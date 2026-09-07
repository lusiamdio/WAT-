import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

export const NewChatModal: React.FC = () => {
  const { isNewChatModalOpen, setIsNewChatModalOpen, users, currentUser, createRoom, setActiveTab } = useChat();

  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');
  const [groupTopic, setGroupTopic] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  if (!isNewChatModalOpen) return null;

  const contacts = users.filter((u) => u.id !== currentUser.id && u.id !== 'user_ai');

  const toggleUserSelection = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleStartDirectChat = (contact: typeof users[0]) => {
    createRoom(contact.name, 'direct', [contact.id], contact.statusMessage);
    setIsNewChatModalOpen(false);
    setActiveTab('chats');
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    createRoom(groupName.trim(), 'group', selectedUserIds, groupTopic);
    setIsNewChatModalOpen(false);
    setActiveTab('chats');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col w-full h-full text-neutral-900 select-none overflow-hidden">
      {/* Header */}
      <header className="px-4 sm:px-8 py-4 bg-white border-b border-black/[0.08] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-neutral-900">
            New Conversation
          </h1>
          <p className="text-xs text-neutral-500">
            Start a direct message or new group
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsNewChatModalOpen(false)}
          className="px-4 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
        >
          Close
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Tab switch */}
          <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl">
            <button
              type="button"
              onClick={() => setChatType('direct')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                chatType === 'direct'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Direct Message
            </button>
            <button
              type="button"
              onClick={() => setChatType('group')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                chatType === 'group'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Group Chat
            </button>
          </div>

          {chatType === 'direct' ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                Select Contact
              </span>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleStartDirectChat(contact)}
                    className="p-3.5 rounded-xl border border-black/[0.08] hover:bg-black/[0.02] cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover border border-black/[0.1]"
                      />
                      <div>
                        <div className="text-xs font-bold text-neutral-900">
                          {contact.name}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-500">
                          {contact.handle}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg border border-black/[0.12] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04]"
                    >
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-900">Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. Project Operations"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-900">Group Topic / Description</label>
                <input
                  type="text"
                  placeholder="Optional discussion topic"
                  value={groupTopic}
                  onChange={(e) => setGroupTopic(e.target.value)}
                  className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
                />
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                  Select Members ({selectedUserIds.length} selected)
                </span>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {contacts.map((c) => {
                    const isSelected = selectedUserIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => toggleUserSelection(c.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-neutral-50 border-black'
                            : 'bg-white border-black/[0.08] hover:bg-black/[0.02]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-9 h-9 rounded-full object-cover border border-black/[0.1]"
                          />
                          <div>
                            <div className="text-xs font-bold text-neutral-900">{c.name}</div>
                            <div className="text-[11px] font-mono text-neutral-500">{c.handle}</div>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-black focus:ring-0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsNewChatModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim()}
                  className="px-5 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                  Create Group
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
