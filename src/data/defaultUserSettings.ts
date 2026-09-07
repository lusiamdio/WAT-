import { WATUserSettings } from '../types/watUserSettings';

export const DEFAULT_USER_SETTINGS: WATUserSettings = {
  account: {
    phoneNumber: '+254 712 345 678',
    email: 'amara.diop@wat.chat',
    twoStepEnabled: true,
    twoStepPin: '••••••',
    passkeysEnabled: true,
    securityNotifications: true,
    accountRecoveryEmail: 'recovery-amara@gmail.com',
    matrixHomeserver: 'https://matrix.wat.chat',
  },
  privacy: {
    lastSeenAndOnline: 'contacts',
    profilePhoto: 'everyone',
    about: 'everyone',
    status: 'contacts',
    readReceipts: true,
    defaultMessageTimer: 0, // Off by default
    groupsWhoCanAdd: 'everyone',
    silenceUnknownCallers: true,
    blockedContacts: [
      {
        id: 'blk-1',
        name: 'Unverified Telemarketer',
        phone: '+234 800 000 1234',
        handle: '@spam_bot:matrix.org',
        blockedAt: '2026-08-15',
      },
    ],
    liveLocationSharingActive: false,
    protectIpInCalls: true,
    disableLinkPreviews: false,
  },
  security: {
    endToEndEncryption: true,
    encryptedBackups: true,
    backupPasswordProtected: true,
    passkeyRegistered: true,
    securityCodeAlerts: true,
    biometricLock: false,
    appLockTimeout: 'immediately',
    megolmKeyBackupActive: true,
  },
  profile: {
    name: 'Amara Diop',
    handle: '@amara:wat.chat',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    statusMessage: 'Crafting sustainable African textiles & artisan luxury ✨',
    phoneNumber: '+254 712 345 678',
    email: 'amara.diop@wat.chat',
    location: 'Nairobi, Kenya',
  },
  chats: {
    theme: 'dark',
    wallpaper: 'matrix-subtle',
    fontSize: 'medium',
    enterIsSend: true,
    mediaVisibility: true,
    keepChatsArchived: true,
    chatBackupFrequency: 'daily',
    lastBackupTime: 'Today at 04:30 AM',
    backupSize: '242.8 MB',
  },
  notifications: {
    conversationTones: true,
    messageSound: 'WAT Chime Pulse (Web Audio Synth)',
    messageVibrate: 'default',
    popupNotification: true,
    previewText: true,
    groupSound: 'WAT Soft Bell',
    groupVibrate: 'short',
    callRingtone: 'WAT Harmonic Sine Loop',
    callVibrate: true,
    highPriorityAlerts: true,
    inAppVibration: true,
  },
  storage: {
    storageUsedMB: 1840,
    totalStorageMB: 64000,
    photosMB: 920,
    videosMB: 640,
    audioMB: 180,
    docsMB: 100,
    networkUsageSentMB: 3420,
    networkUsageReceivedMB: 8950,
    useLessDataForCalls: true,
    mediaAutoDownload: {
      mobileData: { photos: true, audio: true, videos: false, documents: false },
      wifi: { photos: true, audio: true, videos: true, documents: true },
      roaming: { photos: false, audio: false, videos: false, documents: false },
    },
    photoUploadQuality: 'auto',
  },
  calls: {
    silenceUnknown: true,
    lowDataCalls: true,
    jitsiServerDomain: 'meet.wat.chat',
    screenSharingEnabled: true,
    noiseSuppression: true,
    echoCancellation: true,
  },
  status: {
    privacy: 'contacts',
    statusArchive: true,
    autoDelete24h: true,
  },
  linkedDevices: [
    {
      id: 'dev-1',
      name: 'Chrome on macOS (Sonoma)',
      deviceType: 'desktop',
      os: 'macOS 14.5',
      browser: 'Google Chrome 128.0',
      lastActive: 'Active now',
      location: 'Nairobi, Kenya',
      ipAddress: '197.232.88.14',
      isCurrent: true,
    },
    {
      id: 'dev-2',
      name: 'WAT Desktop for Mac',
      deviceType: 'desktop',
      os: 'macOS 14.4',
      browser: 'Electron v31.2',
      lastActive: 'Yesterday at 18:42',
      location: 'Nairobi, Kenya',
      ipAddress: '197.232.88.14',
      isCurrent: false,
    },
    {
      id: 'dev-3',
      name: 'iPad Pro 12.9"',
      deviceType: 'tablet',
      os: 'iPadOS 17.5',
      browser: 'Safari Mobile',
      lastActive: '3 days ago',
      location: 'Mombasa, Kenya',
      ipAddress: '102.165.42.9',
      isCurrent: false,
    },
  ],
  payments: {
    defaultMethod: 'mpesa',
    mpesaPhone: '+254 712 345 678',
    momoPhone: '+233 24 123 4567',
    cardLast4: '4242',
    currency: 'KES',
    walletBalance: 48500,
    transactions: [
      {
        id: 'tx-101',
        date: '2026-08-29 14:22',
        recipient: 'Kente Weaving Co-op',
        amount: 8500,
        type: 'sent',
        status: 'completed',
        method: 'M-Pesa Express',
        reference: 'WAT-TX-99412',
      },
      {
        id: 'tx-102',
        date: '2026-08-28 09:15',
        recipient: 'Zainab Jewelry Orders',
        amount: 14200,
        type: 'received',
        status: 'completed',
        method: 'MTN MoMo',
        reference: 'WAT-TX-99388',
      },
    ],
  },
  accessibility: {
    highContrast: false,
    screenReaderOptimized: false,
    captionsEnabled: true,
    speechToText: true,
    reducedMotion: false,
    largeTouchTargets: true,
  },
  language: {
    appLanguage: 'English (US)',
    autoTranslateIncoming: true,
    preferredTranslateTarget: 'English',
    realtimeLiveCaptions: true,
  },
  helpAndLegal: {
    helpCenterUrl: 'https://help.wat.chat',
    termsOfServiceUrl: 'https://wat.chat/legal/terms',
    privacyPolicyUrl: 'https://wat.chat/legal/privacy',
    popiaCompliance: true,
    gdprCompliance: true,
    dataExportRequested: false,
    lastExportDate: '2026-08-01',
  },
};

const STORAGE_KEY = 'wat_standard_user_settings_v1';

export function loadSavedUserSettings(): WATUserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_USER_SETTINGS,
        ...parsed,
        account: { ...DEFAULT_USER_SETTINGS.account, ...parsed.account },
        privacy: { ...DEFAULT_USER_SETTINGS.privacy, ...parsed.privacy },
        security: { ...DEFAULT_USER_SETTINGS.security, ...parsed.security },
        profile: { ...DEFAULT_USER_SETTINGS.profile, ...parsed.profile },
        chats: { ...DEFAULT_USER_SETTINGS.chats, ...parsed.chats },
        notifications: { ...DEFAULT_USER_SETTINGS.notifications, ...parsed.notifications },
        storage: { ...DEFAULT_USER_SETTINGS.storage, ...parsed.storage },
        calls: { ...DEFAULT_USER_SETTINGS.calls, ...parsed.calls },
        status: { ...DEFAULT_USER_SETTINGS.status, ...parsed.status },
        payments: { ...DEFAULT_USER_SETTINGS.payments, ...parsed.payments },
        accessibility: { ...DEFAULT_USER_SETTINGS.accessibility, ...parsed.accessibility },
        language: { ...DEFAULT_USER_SETTINGS.language, ...parsed.language },
        helpAndLegal: { ...DEFAULT_USER_SETTINGS.helpAndLegal, ...parsed.helpAndLegal },
      };
    }
  } catch (err) {
    console.error('Failed to load user settings from localStorage:', err);
  }
  return DEFAULT_USER_SETTINGS;
}

export function saveUserSettingsToStorage(settings: WATUserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save user settings to localStorage:', err);
  }
}

export function resetUserSettingsToDefault(): WATUserSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear user settings localStorage:', err);
  }
  return DEFAULT_USER_SETTINGS;
}
