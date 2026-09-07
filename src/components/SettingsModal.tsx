import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { WATUserSettings } from '../types/watUserSettings';
import {
  loadSavedUserSettings,
  saveUserSettingsToStorage,
  resetUserSettingsToDefault,
} from '../data/defaultUserSettings';

import { ProfileAccountTab } from './settings/ProfileAccountTab';
import { PrivacyTab } from './settings/PrivacyTab';
import { SecurityE2EETab } from './settings/SecurityE2EETab';
import { ChatsAppearanceTab } from './settings/ChatsAppearanceTab';
import { NotificationsTab } from './settings/NotificationsTab';
import { StorageDataMediaTab } from './settings/StorageDataMediaTab';
import { CallsTab } from './settings/CallsTab';
import { LinkedDevicesTab } from './settings/LinkedDevicesTab';
import { PaymentsTab } from './settings/PaymentsTab';
import { AccessibilityLanguageTab } from './settings/AccessibilityLanguageTab';
import { HelpLegalComplianceTab } from './settings/HelpLegalComplianceTab';

export type SettingsTab =
  | 'profile_account'
  | 'privacy'
  | 'security'
  | 'chats'
  | 'notifications'
  | 'storage'
  | 'calls'
  | 'linked_devices'
  | 'payments'
  | 'accessibility_language'
  | 'help_legal';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, currentUser } = useChat();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile_account');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<WATUserSettings>(loadSavedUserSettings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save settings on change
  useEffect(() => {
    saveUserSettingsToStorage(settings);
  }, [settings]);

  // Reset to list view when opened
  useEffect(() => {
    if (isSettingsOpen) {
      setMobileView('list');
    }
  }, [isSettingsOpen]);

  if (!isSettingsOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleSaveAll = () => {
    saveUserSettingsToStorage(settings);
    showToast('All settings saved successfully');
    setIsSettingsOpen(false);
  };

  const handleCancelAll = () => {
    setSettings(loadSavedUserSettings());
    setIsSettingsOpen(false);
  };

  const navCategories = [
    {
      id: 'profile_account' as SettingsTab,
      label: 'Profile & Account',
      sublabel: 'Identity, phone, email, passkeys, 2FA',
    },
    {
      id: 'privacy' as SettingsTab,
      label: 'Privacy & Visibility',
      sublabel: 'Last seen, read receipts, blocked users, timers',
    },
    {
      id: 'security' as SettingsTab,
      label: 'Security & E2EE',
      sublabel: 'Olm and Megolm keys, encrypted backups',
    },
    {
      id: 'chats' as SettingsTab,
      label: 'Chats & Appearance',
      sublabel: 'Themes, wallpaper, font size, backups',
    },
    {
      id: 'notifications' as SettingsTab,
      label: 'Notifications',
      sublabel: 'Audio chimes, alerts, vibration',
    },
    {
      id: 'storage' as SettingsTab,
      label: 'Storage & Data',
      sublabel: 'Media auto-download, network usage, cache',
    },
    {
      id: 'calls' as SettingsTab,
      label: 'Calls & Audio',
      sublabel: 'Call routing, noise cancellation, bandwidth',
    },
    {
      id: 'linked_devices' as SettingsTab,
      label: 'Linked Devices',
      sublabel: 'Desktop, web clients, QR pairing, sessions',
    },
    {
      id: 'payments' as SettingsTab,
      label: 'Payments & Wallet',
      sublabel: 'Mobile money, cards, transactions',
    },
    {
      id: 'accessibility_language' as SettingsTab,
      label: 'Language & Accessibility',
      sublabel: 'Translation, system language, high contrast',
    },
    {
      id: 'help_legal' as SettingsTab,
      label: 'Help & Legal',
      sublabel: 'Terms of service, privacy policy, compliance',
    },
  ];

  const filteredCategories = navCategories.filter(
    (c) =>
      c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sublabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCategoryObj = navCategories.find((c) => c.id === activeTab) || navCategories[0];

  const handleSelectTab = (tabId: SettingsTab) => {
    setActiveTab(tabId);
    setMobileView('detail');
  };

  return (
    <div
      id="wat-settings-page"
      className="fixed inset-0 z-50 bg-white flex flex-col w-full h-full text-neutral-900 select-none overflow-hidden"
    >
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-4 bg-white border-b border-black/[0.08] flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {mobileView === 'detail' && (
            <button
              type="button"
              onClick={() => setMobileView('list')}
              className="md:hidden px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-black bg-black/[0.05] hover:bg-black/[0.1] transition-colors"
            >
              Back
            </button>
          )}

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-neutral-900 truncate">
              {mobileView === 'detail' ? activeCategoryObj.label : 'WAT Settings'}
            </h1>
            <p className="text-xs text-neutral-500 hidden sm:block truncate">
              {mobileView === 'detail' ? activeCategoryObj.sublabel : 'Preferences, privacy, security, and account configuration'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCancelAll}
            className="px-3.5 py-1.5 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="ml-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:text-black hover:bg-black/[0.05] transition-colors"
          >
            Close
          </button>
        </div>
      </header>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-black text-white text-xs font-medium px-4 py-2 text-center shrink-0">
          {toastMessage}
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden bg-white">
        {/* Left Category Sidebar */}
        <aside
          className={`w-full md:w-72 lg:w-80 bg-white border-r border-black/[0.08] flex flex-col shrink-0 overflow-hidden ${
            mobileView === 'list' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* User Profile Snippet */}
          <div className="p-3 border-b border-black/[0.08] bg-white">
            <button
              type="button"
              onClick={() => handleSelectTab('profile_account')}
              className="w-full p-2.5 rounded-xl bg-white hover:bg-black/[0.03] border border-black/[0.08] flex items-center gap-3 text-left transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-black/[0.1] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-neutral-900 truncate">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-neutral-500 truncate">
                  {currentUser.statusMessage || 'Available'}
                </div>
              </div>
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-black/[0.08]">
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-black/[0.12] rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-black"
            />
          </div>

          {/* Category Nav List */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1 bg-white">
            {filteredCategories.map((cat) => {
              const isSelected = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectTab(cat.id)}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors ${
                    isSelected
                      ? 'bg-black text-white'
                      : 'text-neutral-700 hover:text-black hover:bg-black/[0.04]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{cat.label}</div>
                    <div className={`text-[11px] truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {cat.sublabel}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick Reset Settings */}
          <div className="p-3 border-t border-black/[0.08] flex items-center justify-between bg-white">
            <span className="text-[11px] text-neutral-400">Settings Storage</span>
            <button
              type="button"
              onClick={() => {
                setSettings(resetUserSettingsToDefault());
                showToast('Reset all settings to defaults.');
              }}
              className="text-[11px] font-semibold text-neutral-600 hover:text-black transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </aside>

        {/* Right Content Panel */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-8 bg-white ${
            mobileView === 'detail' ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {activeTab === 'profile_account' && (
              <ProfileAccountTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'privacy' && (
              <PrivacyTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'security' && (
              <SecurityE2EETab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'chats' && (
              <ChatsAppearanceTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationsTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'storage' && (
              <StorageDataMediaTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'calls' && (
              <CallsTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'linked_devices' && (
              <LinkedDevicesTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'payments' && (
              <PaymentsTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'accessibility_language' && (
              <AccessibilityLanguageTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'help_legal' && (
              <HelpLegalComplianceTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
