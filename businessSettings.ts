// WAT Business Settings - Complete Data Models & Types

export interface BusinessHoursDay {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface BusinessProfileSettings {
  businessName: string;
  logo: string;
  coverPhoto?: string;
  description: string;
  category: string;
  email: string;
  phoneNumber: string;
  website: string;
  additionalWebsites: string[];
  address: string;
  googleMapsUrl: string;
  hoursType: 'always_open' | 'by_appointment' | 'custom_hours';
  hoursSchedule: BusinessHoursDay[];
  tagline: string;
  registrationNumber: string;
  taxVatNumber: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    tiktok?: string;
  };
  catalogUrl: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  verificationBadgeType: 'official_business' | 'standard_merchant' | 'none';
}

export interface QuickReply {
  id: string;
  shortcut: string;
  message: string;
  keywords: string[];
  category: string;
}

export interface DefaultTemplates {
  welcomeMessage: string;
  firstContactMessage: string;
  followUpMessage: string;
  orderConfirmation: string;
  paymentConfirmation: string;
  appointmentConfirmation: string;
  deliveryConfirmation: string;
}

export interface MessagingSettings {
  greeting: {
    enabled: boolean;
    text: string;
    recipientFilter: 'everyone' | 'not_in_contacts' | 'everyone_except' | 'only_send_to';
    excludedContactIds?: string[];
  };
  away: {
    enabled: boolean;
    text: string;
    schedule: 'always' | 'custom_schedule' | 'outside_business_hours';
    startTime?: string;
    endTime?: string;
    recipients: 'everyone' | 'not_in_contacts' | 'everyone_except' | 'only_send_to';
  };
  quickReplies: QuickReply[];
  defaultTemplates: DefaultTemplates;
}

export interface CatalogCommerceSettings {
  enableCart: boolean;
  showPrices: boolean;
  allowGuestCheckout: boolean;
  orderNotificationsEmail: string;
  orderNotificationsPhone: string;
  acceptedPaymentMethods: ('mpesa' | 'momo' | 'card' | 'bank_transfer' | 'crypto')[];
  deliveryFlatRate: number;
  freeDeliveryThreshold: number;
  defaultCurrency: 'USD' | 'KES' | 'NGN' | 'GHS' | 'ZAR' | 'EUR';
  taxRatePercent: number;
  inventoryAlertThreshold: number;
}

export interface CustomerLabel {
  id: string;
  name: string;
  color: string;
  icon: string;
  count: number;
  isSystem: boolean;
  autoAssignRule?: string;
}

export interface CustomerContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  tags: string[];
  notes: string;
  totalOrders: number;
  totalSpend: number;
  currency: string;
  status: 'lead' | 'hot_lead' | 'cold_lead' | 'customer' | 'vip' | 'blocked';
  segment: 'High Value' | 'Frequent Buyer' | 'New Prospect' | 'Needs Follow-Up';
  lastInteraction: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  templateType: 'promotional' | 'product_launch' | 're_engagement' | 'flash_sale';
  targetSegment: string;
  recipientsCount: number;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'sent' | 'completed';
  stats: {
    deliveryRate: number;
    readRate: number;
    responseRate: number;
    conversionRate: number;
  };
}

export interface BroadcastMarketingSettings {
  optOutKeyword: string;
  campaigns: MarketingCampaign[];
  dailyBroadcastLimit: number;
}

export interface AutomationSettings {
  autoReplyBotEnabled: boolean;
  chatbotName: string;
  aiAssistantActive: boolean;
  faqAutomation: {
    question: string;
    answer: string;
    keywords: string[];
  }[];
  keywordTriggers: {
    trigger: string;
    action: 'reply' | 'assign_label' | 'route_team' | 'send_catalog';
    payload: string;
  }[];
  leadQualificationEnabled: boolean;
  smartRoutingEnabled: boolean;
  orderFollowUpHours: number;
  abandonedCartReminderMinutes: number;
}

export type StaffRole = 'Admin' | 'Manager' | 'Sales' | 'Customer Support' | 'Marketing' | 'Finance' | 'Read-only User';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  role: StaffRole;
  status: 'active' | 'invited' | 'disabled';
  permissions: {
    viewChats: boolean;
    sendMessages: boolean;
    deleteMessages: boolean;
    manageCustomers: boolean;
    manageCatalog: boolean;
    manageOrders: boolean;
    managePayments: boolean;
    manageCampaigns: boolean;
    viewAnalytics: boolean;
    manageStaff: boolean;
    changeBusinessSettings: boolean;
  };
}

export interface NotificationsSettings {
  messages: {
    newMessage: boolean;
    groupMentions: boolean;
    vipCustomersOnly: boolean;
  };
  orders: {
    newOrder: boolean;
    paymentReceived: boolean;
    paymentFailed: boolean;
    orderCancelled: boolean;
    deliveryUpdate: boolean;
  };
  calls: {
    incomingCalls: boolean;
    missedCallAlerts: boolean;
  };
  business: {
    newLead: boolean;
    customerResponse: boolean;
    appointmentBooked: boolean;
    campaignMilestones: boolean;
  };
  controls: {
    sound: boolean;
    vibration: boolean;
    popupPreviews: boolean;
    ledIndicator: boolean;
    priorityMode: boolean;
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
}

export interface PrivacySettings {
  lastSeenVisibility: 'everyone' | 'my_contacts' | 'nobody';
  onlineStatusVisibility: 'everyone' | 'my_contacts' | 'nobody';
  profilePhotoVisibility: 'everyone' | 'my_contacts' | 'nobody';
  aboutVisibility: 'everyone' | 'my_contacts' | 'nobody';
  statusVisibility: 'everyone' | 'my_contacts' | 'nobody';
  readReceipts: boolean;
  typingIndicator: boolean;
  recordingIndicator: boolean;
  groupInvitations: 'everyone' | 'my_contacts' | 'nobody';
  callsPrivacy: 'everyone' | 'my_contacts';
  liveLocationSharing: boolean;
  appLockEnabled: boolean;
  appLockTimeout: 'immediately' | '1_minute' | '15_minutes' | '1_hour';
  disappearingMessagesDefault: number; // in seconds, 0 = off
  screenshotProtection: boolean;
}

export interface SecuritySettings {
  twoStepVerification: boolean;
  securityPin: string;
  biometricLock: boolean;
  passcode: string;
  loginAlerts: boolean;
  e2eeVerificationRequired: boolean;
  backupEncryption: boolean;
  trustedDevicesOnly: boolean;
}

export interface LinkedDeviceItem {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'web' | 'tablet' | 'phone';
  os: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface ChatsStorageSettings {
  backupFrequency: 'never' | 'daily' | 'weekly' | 'monthly';
  backupAccount: string;
  includeVideosInBackup: boolean;
  encryptedCloudBackup: boolean;
  autoDownloadPhotos: boolean;
  autoDownloadAudio: boolean;
  autoDownloadVideos: boolean;
  autoDownloadDocuments: boolean;
  archiveChatsKeepArchived: boolean;
  storageUsedMB: number;
  totalAvailableMB: number;
}

export interface CallsSettings {
  voiceCallsEnabled: boolean;
  videoCallsEnabled: boolean;
  silenceUnknownCallers: boolean;
  lowDataUsageForCalls: boolean;
  hardwareAcceleration: boolean;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  defaultMic: string;
  defaultCamera: string;
}

export interface PaymentMethodConfig {
  provider: string;
  accountIdentifier: string;
  status: 'active' | 'pending_verification' | 'disabled';
  currencies: string[];
}

export interface PaymentsSettings {
  defaultCurrency: 'USD' | 'KES' | 'NGN' | 'GHS' | 'ZAR' | 'EUR';
  mobileMoneyProviders: PaymentMethodConfig[];
  bankAccountDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    swiftBic: string;
  };
  cardProcessingActive: boolean;
  vatTaxRate: number;
  settlementFrequency: 'instant' | 'daily_batch' | 'weekly';
  autoSendReceipts: boolean;
}

export interface AppointmentService {
  id: string;
  title: string;
  durationMinutes: number;
  bufferMinutes: number;
  price: number;
  currency: string;
  assignedStaff: string;
  description: string;
}

export interface AppointmentsSettings {
  enabled: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  workingDays: string[];
  bufferBetweenBookingsMinutes: number;
  autoConfirmBookings: boolean;
  reminderHoursBefore: number;
  googleCalendarConnected: boolean;
  microsoftCalendarConnected: boolean;
  services: AppointmentService[];
}

export interface BusinessAnalyticsData {
  messaging: {
    sent: number;
    delivered: number;
    read: number;
    received: number;
    avgResponseTimeMinutes: number;
  };
  customers: {
    newCustomersThisMonth: number;
    returningCustomersThisMonth: number;
    activeConversations: number;
    customerGrowthPercent: number;
    retentionRatePercent: number;
  };
  sales: {
    totalLeads: number;
    qualifiedLeads: number;
    totalOrders: number;
    revenueFormatted: string;
    avgOrderValueFormatted: string;
    conversionRatePercent: number;
  };
  campaigns: {
    totalReach: number;
    avgEngagementPercent: number;
    totalClicks: number;
    totalConversions: number;
  };
}

export interface BusinessDocumentTemplate {
  id: string;
  type: 'invoice' | 'receipt' | 'quotation' | 'purchase_order' | 'contract' | 'statement';
  title: string;
  lastUsed: string;
  templateCode: string;
}

export interface DocumentsSettings {
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  defaultPaymentTerms: string;
  invoiceFooterNote: string;
  templates: BusinessDocumentTemplate[];
}

export interface LanguageRegionSettings {
  appLanguage: string;
  businessLanguage: string;
  customerPreferredLanguage: string;
  autoTranslateIncoming: boolean;
  defaultCurrency: string;
  country: string;
  timeZone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  numberFormat: '1,234.56' | '1.234,56' | '1 234,56';
}

export interface AppearanceSettings {
  theme: 'dark' | 'light' | 'system';
  chatWallpaper: string;
  fontSize: 'small' | 'medium' | 'large' | 'extra_large';
  chatDensity: 'compact' | 'comfortable' | 'spacious';
  messageBubbleStyle: 'modern_rounded' | 'classic_whatsapp' | 'flat_minimal';
  businessBrandAccentColor: string;
}

export interface AccessibilitySettings {
  fontScaling: number; // 100 = 100%
  highContrastMode: boolean;
  screenReaderOptimized: boolean;
  reducedMotion: boolean;
  voiceControlEnabled: boolean;
  captionsEnabled: boolean;
  textToSpeechForAudio: boolean;
  speechToTextVoiceInput: boolean;
  keyboardNavigationEnabled: boolean;
}

export interface AIBusinessSettings {
  aiAssistantEnabled: boolean;
  aiCopilotName: string;
  personality: 'professional' | 'warm_friendly' | 'concise_expert' | 'playful';
  responseTone: 'formal' | 'casual' | 'enthusiastic';
  responseLanguage: 'auto' | 'en' | 'sw' | 'fr' | 'ar' | 'yo' | 'ig' | 'ha';
  businessKnowledgeBase: string;
  allowedActions: {
    suggestProducts: boolean;
    generateInvoices: boolean;
    bookAppointments: boolean;
    answerFaqs: boolean;
    qualifyLeads: boolean;
    processReturns: boolean;
  };
  humanHandoverEnabled: boolean;
  confidenceThresholdPercent: number;
  autoSummarizeLongConversations: boolean;
  sentimentDetection: boolean;
  customerIntentTagging: boolean;
  aiFollowUpSuggestions: boolean;
  trainingDataOptOut: boolean;
}

export interface IntegrationConnection {
  id: string;
  name: string;
  category: 'crm' | 'ecommerce' | 'calendar' | 'payments' | 'storage' | 'automation';
  icon: string;
  status: 'connected' | 'not_connected' | 'syncing';
  lastSync?: string;
  description: string;
}

export interface DeveloperApiSettings {
  appId: string;
  businessId: string;
  phoneNumberId: string;
  apiKey: string;
  webhookUrl: string;
  webhookSecret: string;
  rateLimitPerMinute: number;
  sandboxMode: boolean;
  eventSubscriptions: string[];
}

export interface BusinessVerificationInfo {
  status: 'verified' | 'in_review' | 'unverified';
  registeredLegalName: string;
  registrationNumber: string;
  taxDocumentUploaded: boolean;
  identityVerified: boolean;
  addressVerified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  verifiedBadgeVisible: boolean;
}

export interface LegalComplianceSettings {
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
  cookiePolicyUrl: string;
  gdprCompliant: boolean;
  popiaCompliant: boolean;
  dataRetentionMonths: number;
  marketingConsentRequired: boolean;
  auditLogsEnabled: boolean;
}

export interface HelpSupportSettings {
  helpCenterUrl: string;
  supportEmail: string;
  supportPhone: string;
  systemStatus: 'all_systems_operational' | 'partial_outage' | 'maintenance';
}

export interface AccountSettingsData {
  phoneNumber: string;
  email: string;
  username: string;
  accountType: 'WAT Business Pro' | 'WAT Enterprise' | 'WAT Standard';
  accountCreatedDate: string;
  activeTier: string;
}

// Full Master Business Settings Object
export interface WATBusinessSettings {
  profile: BusinessProfileSettings;
  messaging: MessagingSettings;
  catalogCommerce: CatalogCommerceSettings;
  labels: CustomerLabel[];
  customers: CustomerContact[];
  broadcastMarketing: BroadcastMarketingSettings;
  automation: AutomationSettings;
  team: TeamMember[];
  notifications: NotificationsSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
  chatsStorage: ChatsStorageSettings;
  linkedDevices: LinkedDeviceItem[];
  calls: CallsSettings;
  payments: PaymentsSettings;
  appointments: AppointmentsSettings;
  analytics: BusinessAnalyticsData;
  documents: DocumentsSettings;
  languageRegion: LanguageRegionSettings;
  appearance: AppearanceSettings;
  accessibility: AccessibilitySettings;
  aiBusiness: AIBusinessSettings;
  integrations: IntegrationConnection[];
  developerApi: DeveloperApiSettings;
  verification: BusinessVerificationInfo;
  legalCompliance: LegalComplianceSettings;
  helpSupport: HelpSupportSettings;
  account: AccountSettingsData;
}
