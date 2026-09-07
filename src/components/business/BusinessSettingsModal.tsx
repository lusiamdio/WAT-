import React, { useState, useEffect } from 'react';
import { WATBusinessSettings } from '../../types/businessSettings';
import {
  loadSavedBusinessSettings,
  saveBusinessSettingsToStorage,
  resetBusinessSettingsToDefault,
} from '../../data/defaultBusinessSettings';

import { ProfileAndAccountTab } from './settings/ProfileAndAccountTab';
import { MessagingSettingsTab } from './settings/MessagingSettingsTab';
import { CommercePaymentsTab } from './settings/CommercePaymentsTab';
import { LabelsAndCustomersTab } from './settings/LabelsAndCustomersTab';
import { BroadcastMarketingTab } from './settings/BroadcastMarketingTab';
import { AutomationTab } from './settings/AutomationTab';
import { TeamStaffTab } from './settings/TeamStaffTab';
import { AIBusinessTab } from './settings/AIBusinessTab';
import { AnalyticsTab } from './settings/AnalyticsTab';
import { DocumentsAppointmentsTab } from './settings/DocumentsAppointmentsTab';
import { PrivacySecurityTab } from './settings/PrivacySecurityTab';
import { NotificationsCallsTab } from './settings/NotificationsCallsTab';
import { ChatsStorageDevicesTab } from './settings/ChatsStorageDevicesTab';
import { IntegrationsDevApiTab } from './settings/IntegrationsDevApiTab';
import { LanguageAppearanceLegalTab } from './settings/LanguageAppearanceLegalTab';

export type SettingsSectionId =
  | 'profile_account'
  | 'messaging_tools'
  | 'commerce_payments'
  | 'labels_org'
  | 'customers_contacts'
  | 'broadcast_marketing'
  | 'automation_rules'
  | 'team_staff'
  | 'ai_assistant'
  | 'analytics_growth'
  | 'documents_appointments'
  | 'privacy_security'
  | 'notifications_calls'
  | 'chats_storage_devices'
  | 'integrations_dev_api'
  | 'language_appearance_legal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: SettingsSectionId;
}

interface NavItem {
  id: SettingsSectionId;
  label: string;
  description: string;
}

const SECTION_SLUG_MAP: Record<string, SettingsSectionId> = {
  profile: 'profile_account',
  profile_account: 'profile_account',
  account: 'profile_account',
  messaging: 'messaging_tools',
  messaging_tools: 'messaging_tools',
  quickreplies: 'messaging_tools',
  commerce: 'commerce_payments',
  payments: 'commerce_payments',
  commerce_payments: 'commerce_payments',
  labels: 'labels_org',
  labels_org: 'labels_org',
  customers: 'customers_contacts',
  crm: 'customers_contacts',
  customers_contacts: 'customers_contacts',
  broadcast: 'broadcast_marketing',
  marketing: 'broadcast_marketing',
  broadcast_marketing: 'broadcast_marketing',
  automation: 'automation_rules',
  automation_rules: 'automation_rules',
  team: 'team_staff',
  staff: 'team_staff',
  team_staff: 'team_staff',
  ai: 'ai_assistant',
  ai_assistant: 'ai_assistant',
  analytics: 'analytics_growth',
  growth: 'analytics_growth',
  analytics_growth: 'analytics_growth',
  documents: 'documents_appointments',
  appointments: 'documents_appointments',
  invoices: 'documents_appointments',
  documents_appointments: 'documents_appointments',
  privacy: 'privacy_security',
  security: 'privacy_security',
  privacy_security: 'privacy_security',
  notifications: 'notifications_calls',
  calls: 'notifications_calls',
  notifications_calls: 'notifications_calls',
  storage: 'chats_storage_devices',
  devices: 'chats_storage_devices',
  chats_storage_devices: 'chats_storage_devices',
  integrations: 'integrations_dev_api',
  api: 'integrations_dev_api',
  integrations_dev_api: 'integrations_dev_api',
  appearance: 'language_appearance_legal',
  language: 'language_appearance_legal',
  legal: 'language_appearance_legal',
  language_appearance_legal: 'language_appearance_legal',
};

const NAV_ITEMS: NavItem[] = [
  {
    id: 'profile_account',
    label: 'Business Profile & Account',
    description: 'Name, address, catalog link, hours, verification and matrix handle',
  },
  {
    id: 'messaging_tools',
    label: 'Messaging Settings',
    description: 'Greeting, away message, quick replies and transactional templates',
  },
  {
    id: 'commerce_payments',
    label: 'Commerce & Payments',
    description: 'Catalog cart, delivery, Mobile Money and settlement accounts',
  },
  {
    id: 'labels_org',
    label: 'Customer & Order Labels',
    description: 'Tags, VIP, pending payment and assignment rules',
  },
  {
    id: 'customers_contacts',
    label: 'Customers & CRM',
    description: 'Customer segmentation, lifetime value, notes and export',
  },
  {
    id: 'broadcast_marketing',
    label: 'Broadcast & Marketing',
    description: 'Promotional messages, flash sales and scheduled broadcasts',
  },
  {
    id: 'automation_rules',
    label: 'Business Automation',
    description: 'Keyword triggers, instant FAQ answers and team routing',
  },
  {
    id: 'team_staff',
    label: 'Team & Permissions',
    description: 'Staff roles and permissions',
  },
  {
    id: 'ai_assistant',
    label: 'Automated Sales Assistant',
    description: 'Catalog advisor and product recommendations',
  },
  {
    id: 'analytics_growth',
    label: 'Analytics & Reports',
    description: 'Revenue graphs, message delivery rate and customer KPIs',
  },
  {
    id: 'documents_appointments',
    label: 'Invoices & Bookings',
    description: 'VAT invoices, receipts and calendar bookings',
  },
  {
    id: 'privacy_security',
    label: 'Business Privacy & Security',
    description: 'Team verification, data protection and audit logs',
  },
  {
    id: 'notifications_calls',
    label: 'Notifications & Audio',
    description: 'Order alerts, ringtones and conference audio',
  },
  {
    id: 'chats_storage_devices',
    label: 'Storage & Linked Devices',
    description: 'Backup, POS registers and offline cache',
  },
  {
    id: 'integrations_dev_api',
    label: 'Webhooks & APIs',
    description: 'Webhooks and bot tokens',
  },
  {
    id: 'language_appearance_legal',
    label: 'Language & Legal',
    description: 'Language packs, brand theme and legal compliance',
  },
];

export const BusinessSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialSection = 'profile_account',
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>(initialSection);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<WATBusinessSettings>(loadSavedBusinessSettings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('detail');

  useEffect(() => {
    if (isOpen) {
      setSettings(loadSavedBusinessSettings());
      if (initialSection) {
        setActiveSection(initialSection);
        setMobileView('detail');
      }
    }
  }, [isOpen, initialSection]);

  useEffect(() => {
    if (!isOpen) return;

    const syncFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#business/settings/') || hash.startsWith('#/business/settings/')) {
        const slug = hash.replace(/^#\/?business\/settings\//, '').split('?')[0];
        if (slug && SECTION_SLUG_MAP[slug]) {
          setActiveSection(SECTION_SLUG_MAP[slug]);
          setMobileView('detail');
        }
      }
    };

    syncFromHash();
    window.addEventListener('popstate', syncFromHash);
    window.addEventListener('hashchange', syncFromHash);

    return () => {
      window.removeEventListener('popstate', syncFromHash);
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [isOpen]);

  const handleSectionSelect = (sectionId: SettingsSectionId) => {
    setActiveSection(sectionId);
    setMobileView('detail');
    try {
      const targetHash = `#business/settings/${sectionId}`;
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    saveBusinessSettingsToStorage(settings);
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleUpdateSettings = (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => {
    setSettings((prev) => {
      const next = updater(prev);
      saveBusinessSettingsToStorage(next);
      return next;
    });
  };

  const handleManualSave = () => {
    saveBusinessSettingsToStorage(settings);
    showToast('Business settings saved successfully');
    onClose();
  };

  const handleCancel = () => {
    setSettings(loadSavedBusinessSettings());
    onClose();
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all business settings to default values?')) {
      const def = resetBusinessSettingsToDefault();
      setSettings(def);
      showToast('All settings reset to defaults.');
    }
  };

  if (!isOpen) return null;

  const filteredNavItems = NAV_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentNav = NAV_ITEMS.find((n) => n.id === activeSection) || NAV_ITEMS[0];

  return (
    <div
      id="wat-business-settings-page"
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
              {mobileView === 'detail' ? currentNav.label : 'Business Settings'}
            </h1>
            <p className="text-xs text-neutral-500 hidden sm:block truncate">
              {mobileView === 'detail' ? currentNav.description : 'Commerce, payments, customer messaging and automation'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="hidden sm:block px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:text-black hover:bg-black/[0.05] transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-3.5 py-1.5 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleManualSave}
            className="px-4 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
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
          {/* Search Box */}
          <div className="p-3 border-b border-black/[0.08]">
            <input
              type="text"
              placeholder="Search business settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-black/[0.12] rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-black"
            />
          </div>

          {/* Category Nav List */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1 bg-white">
            {filteredNavItems.map((item) => {
              const isSelected = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSectionSelect(item.id)}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors ${
                    isSelected
                      ? 'bg-black text-white'
                      : 'text-neutral-700 hover:text-black hover:bg-black/[0.04]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{item.label}</div>
                    <div className={`text-[11px] truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-black/[0.08] flex items-center justify-between bg-white">
            <span className="text-[11px] text-neutral-400">Business Storage</span>
            <button
              type="button"
              onClick={handleResetDefaults}
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
            {activeSection === 'profile_account' && (
              <ProfileAndAccountTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'messaging_tools' && (
              <MessagingSettingsTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'commerce_payments' && (
              <CommercePaymentsTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'labels_org' && (
              <LabelsAndCustomersTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'customers_contacts' && (
              <LabelsAndCustomersTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'broadcast_marketing' && (
              <BroadcastMarketingTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'automation_rules' && (
              <AutomationTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'team_staff' && (
              <TeamStaffTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'ai_assistant' && (
              <AIBusinessTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'analytics_growth' && (
              <AnalyticsTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'documents_appointments' && (
              <DocumentsAppointmentsTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'privacy_security' && (
              <PrivacySecurityTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'notifications_calls' && (
              <NotificationsCallsTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'chats_storage_devices' && (
              <ChatsStorageDevicesTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'integrations_dev_api' && (
              <IntegrationsDevApiTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
            {activeSection === 'language_appearance_legal' && (
              <LanguageAppearanceLegalTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
                onNavigateSection={handleSectionSelect}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
