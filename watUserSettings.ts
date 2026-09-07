export interface BlockedContact {
  id: string;
  name: string;
  phone: string;
  handle: string;
  avatar?: string;
  blockedAt: string;
}

export interface LinkedDeviceSession {
  id: string;
  name: string;
  deviceType: 'desktop' | 'web' | 'tablet' | 'phone';
  os: string;
  browser: string;
  lastActive: string;
  location: string;
  ipAddress?: string;
  isCurrent: boolean;
}

export interface WalletTransaction {
  id: string;
  date: string;
  recipient: string;
  amount: number;
  type: 'sent' | 'received';
  status: 'completed' | 'pending';
  method: string;
  reference: string;
}

export interface WATUserSettings {
  // 1. Account
  account: {
    phoneNumber: string;
    email: string;
    twoStepEnabled: boolean;
    twoStepPin: string;
    passkeysEnabled: boolean;
    securityNotifications: boolean;
    accountRecoveryEmail: string;
    matrixHomeserver: string;
  };

  // 2. Privacy
  privacy: {
    lastSeenAndOnline: 'everyone' | 'contacts' | 'nobody';
    profilePhoto: 'everyone' | 'contacts' | 'nobody';
    about: 'everyone' | 'contacts' | 'nobody';
    status: 'contacts' | 'contacts_except' | 'only_share_with';
    readReceipts: boolean;
    defaultMessageTimer: number; // 0 = off, 86400 = 24h, 604800 = 7d, 7776000 = 90d
    groupsWhoCanAdd: 'everyone' | 'contacts' | 'nobody';
    silenceUnknownCallers: boolean;
    blockedContacts: BlockedContact[];
    liveLocationSharingActive: boolean;
    protectIpInCalls: boolean;
    disableLinkPreviews: boolean;
  };

  // 3. Security
  security: {
    endToEndEncryption: boolean;
    encryptedBackups: boolean;
    backupPasswordProtected: boolean;
    passkeyRegistered: boolean;
    securityCodeAlerts: boolean;
    biometricLock: boolean;
    appLockTimeout: 'immediately' | '1min' | '15min' | '1hour';
    megolmKeyBackupActive: boolean;
  };

  // 4. Profile
  profile: {
    name: string;
    handle: string;
    avatar: string;
    statusMessage: string;
    phoneNumber: string;
    email: string;
    location: string;
  };

  // 5 & 6. Chats & Appearance
  chats: {
    theme: 'dark' | 'light' | 'system' | 'midnight' | 'matrix' | 'safari';
    wallpaper: string;
    fontSize: 'small' | 'medium' | 'large';
    enterIsSend: boolean;
    mediaVisibility: boolean;
    keepChatsArchived: boolean;
    chatBackupFrequency: 'daily' | 'weekly' | 'monthly' | 'manual';
    lastBackupTime: string;
    backupSize: string;
  };

  // 7. Notifications
  notifications: {
    conversationTones: boolean;
    messageSound: string;
    messageVibrate: 'default' | 'short' | 'long' | 'off';
    popupNotification: boolean;
    previewText: boolean;
    groupSound: string;
    groupVibrate: 'default' | 'short' | 'long' | 'off';
    callRingtone: string;
    callVibrate: boolean;
    highPriorityAlerts: boolean;
    inAppVibration: boolean;
  };

  // 8 & 9. Storage & Data & Media Auto-Download
  storage: {
    storageUsedMB: number;
    totalStorageMB: number;
    photosMB: number;
    videosMB: number;
    audioMB: number;
    docsMB: number;
    networkUsageSentMB: number;
    networkUsageReceivedMB: number;
    useLessDataForCalls: boolean;
    mediaAutoDownload: {
      mobileData: { photos: boolean; audio: boolean; videos: boolean; documents: boolean };
      wifi: { photos: boolean; audio: boolean; videos: boolean; documents: boolean };
      roaming: { photos: boolean; audio: boolean; videos: boolean; documents: boolean };
    };
    photoUploadQuality: 'auto' | 'best' | 'data_saver';
  };

  // 10. Calls
  calls: {
    silenceUnknown: boolean;
    lowDataCalls: boolean;
    jitsiServerDomain: string;
    screenSharingEnabled: boolean;
    noiseSuppression: boolean;
    echoCancellation: boolean;
  };

  // 11. Status
  status: {
    privacy: 'contacts' | 'contacts_except' | 'only_share_with';
    statusArchive: boolean;
    autoDelete24h: boolean;
  };

  // 14. Linked Devices
  linkedDevices: LinkedDeviceSession[];

  // 15. Payments
  payments: {
    defaultMethod: 'mpesa' | 'momo' | 'airtel' | 'card' | 'bank';
    mpesaPhone: string;
    momoPhone: string;
    cardLast4: string;
    currency: string;
    walletBalance: number;
    transactions: WalletTransaction[];
  };

  // 28. Accessibility
  accessibility: {
    highContrast: boolean;
    screenReaderOptimized: boolean;
    captionsEnabled: boolean;
    speechToText: boolean;
    reducedMotion: boolean;
    largeTouchTargets: boolean;
  };

  // 29. Language & Localization
  language: {
    appLanguage: string;
    autoTranslateIncoming: boolean;
    preferredTranslateTarget: string;
    realtimeLiveCaptions: boolean;
  };

  // 30, 31, 32, 33. Help, Legal, Reports & Data Lifecycle
  helpAndLegal: {
    helpCenterUrl: string;
    termsOfServiceUrl: string;
    privacyPolicyUrl: string;
    popiaCompliance: boolean;
    gdprCompliance: boolean;
    dataExportRequested: boolean;
    lastExportDate?: string;
  };
}
