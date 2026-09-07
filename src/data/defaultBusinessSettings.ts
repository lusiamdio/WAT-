import { WATBusinessSettings } from '../types/businessSettings';

export const DEFAULT_WAT_BUSINESS_SETTINGS: WATBusinessSettings = {
  // 1. Business Profile & 25. Verification
  profile: {
    businessName: 'AfroArtisan Global Ltd.',
    logo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
    description: 'Premier curator of handcrafted African fashion, organic shea formulations, woven Kiondo bags, and Pan-African artisan jewelry.',
    category: 'Shopping & Retail • Arts & Crafts',
    email: 'contact@afroartisan.store',
    phoneNumber: '+254 700 892 104',
    website: 'https://afroartisan.store',
    additionalWebsites: ['https://catalog.afroartisan.store', 'https://instagram.com/afroartisan_ke'],
    address: 'Artisan Square, Westlands Road, Nairobi, Kenya',
    googleMapsUrl: 'https://maps.google.com/?q=-1.2678,36.8114',
    hoursType: 'custom_hours',
    hoursSchedule: [
      { day: 'Monday', isOpen: true, openTime: '08:30', closeTime: '18:00' },
      { day: 'Tuesday', isOpen: true, openTime: '08:30', closeTime: '18:00' },
      { day: 'Wednesday', isOpen: true, openTime: '08:30', closeTime: '18:00' },
      { day: 'Thursday', isOpen: true, openTime: '08:30', closeTime: '18:00' },
      { day: 'Friday', isOpen: true, openTime: '08:30', closeTime: '19:00' },
      { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'Sunday', isOpen: false, openTime: '10:00', closeTime: '14:00' },
    ],
    tagline: 'Authentic African Heritage Handcrafted for the World 🌍✨',
    registrationNumber: 'BN-PVT-2024-998124',
    taxVatNumber: 'P051982741Z',
    socialLinks: {
      instagram: '@afroartisan_official',
      facebook: 'AfroArtisanGlobal',
      twitter: '@AfroArtisanHQ',
      tiktok: '@afroartisan_crafts',
    },
    catalogUrl: 'https://wat.chat/c/afroartisan',
    verificationStatus: 'verified',
    verificationBadgeType: 'official_business',
  },

  // 2. Messaging Settings
  messaging: {
    greeting: {
      enabled: true,
      text: 'Hello! 🌿 Welcome to AfroArtisan Global. How can we assist you with our handcrafted artisan collections or mobile money order today?',
      recipientFilter: 'everyone',
      excludedContactIds: [],
    },
    away: {
      enabled: true,
      text: 'Thank you for contacting AfroArtisan! We are currently outside business hours. Our artisans will reply as soon as we resume at 8:30 AM EAT. For urgent orders, browse our catalog at wat.chat/c/afroartisan.',
      schedule: 'outside_business_hours',
      recipients: 'everyone',
    },
    quickReplies: [
      {
        id: 'qr-1',
        shortcut: '/catalog',
        message: 'Explore our latest artisan catalog with instant M-Pesa & MoMo checkout here: https://wat.chat/c/afroartisan 🛍️',
        keywords: ['catalog', 'products', 'buy', 'items'],
        category: 'Sales',
      },
      {
        id: 'qr-2',
        shortcut: '/shipping',
        message: 'We provide express delivery across Nairobi (same-day) and DHL worldwide shipping within 3-5 business days! ✈️📦',
        keywords: ['shipping', 'delivery', 'courier', 'rates'],
        category: 'Logistics',
      },
      {
        id: 'qr-3',
        shortcut: '/payment',
        message: 'We accept M-Pesa Lipa Na M-Pesa, MTN Mobile Money, Airtel Money, Visa/Mastercard, and Bank Wire.',
        keywords: ['mpesa', 'payment', 'pay', 'momo', 'bank'],
        category: 'Billing',
      },
      {
        id: 'qr-4',
        shortcut: '/hours',
        message: 'Our showroom is open Monday to Friday 8:30 AM - 6:00 PM, and Saturday 9:00 AM - 5:00 PM (EAT).',
        keywords: ['hours', 'time', 'open', 'location'],
        category: 'General',
      },
    ],
    defaultTemplates: {
      welcomeMessage: 'Welcome to AfroArtisan on WAT! How can our concierge assist you?',
      firstContactMessage: 'Thank you for reaching out! A dedicated stylist will respond within minutes.',
      followUpMessage: 'Hi there! We wanted to check if you had any questions about your handcrafted selection.',
      orderConfirmation: '🎉 Order confirmed! Your artisan pieces are being packaged with care. Tracking ID: #AFRO-8924',
      paymentConfirmation: '✅ Payment received via Mobile Money. Receipt dispatched to your chat.',
      appointmentConfirmation: '📅 Showroom consultation confirmed with our master artisan on {date} at {time}.',
      deliveryConfirmation: '🚚 Your package has arrived! Enjoy your handcrafted authentic heritage pieces.',
    },
  },

  // 3. Catalog & Commerce
  catalogCommerce: {
    enableCart: true,
    showPrices: true,
    allowGuestCheckout: true,
    orderNotificationsEmail: 'orders@afroartisan.store',
    orderNotificationsPhone: '+254 700 892 104',
    acceptedPaymentMethods: ['mpesa', 'momo', 'card', 'bank_transfer', 'crypto'],
    deliveryFlatRate: 15,
    freeDeliveryThreshold: 150,
    defaultCurrency: 'USD',
    taxRatePercent: 16,
    inventoryAlertThreshold: 5,
  },

  // 4. Labels
  labels: [
    { id: 'lbl-1', name: 'New customer', color: '#3B82F6', icon: 'UserPlus', count: 24, isSystem: true, autoAssignRule: 'First inbound message' },
    { id: 'lbl-2', name: 'New order', color: '#10B981', icon: 'ShoppingBag', count: 18, isSystem: true, autoAssignRule: 'Cart checkout initiated' },
    { id: 'lbl-3', name: 'Pending payment', color: '#F59E0B', icon: 'Clock', count: 7, isSystem: true, autoAssignRule: 'Invoice generated' },
    { id: 'lbl-4', name: 'Paid', color: '#059669', icon: 'CheckCircle2', count: 84, isSystem: true, autoAssignRule: 'Payment webhook confirmed' },
    { id: 'lbl-5', name: 'Order shipped', color: '#8B5CF6', icon: 'Truck', count: 12, isSystem: true, autoAssignRule: 'Tracking number added' },
    { id: 'lbl-6', name: 'Order completed', color: '#14B8A6', icon: 'PackageCheck', count: 156, isSystem: true, autoAssignRule: 'Delivered confirmed' },
    { id: 'lbl-7', name: 'VIP customer', color: '#EC4899', icon: 'Crown', count: 32, isSystem: true, autoAssignRule: 'Spend > $500' },
    { id: 'lbl-8', name: 'Follow-up required', color: '#EF4444', icon: 'AlertCircle', count: 9, isSystem: true, autoAssignRule: 'No reply > 24 hours' },
    { id: 'lbl-9', name: 'Lead', color: '#6366F1', icon: 'Target', count: 45, isSystem: false },
    { id: 'lbl-10', name: 'Hot lead', color: '#F97316', icon: 'Flame', count: 14, isSystem: false },
    { id: 'lbl-11', name: 'Cold lead', color: '#64748B', icon: 'Snowflake', count: 20, isSystem: false },
    { id: 'lbl-12', name: 'Returning customer', color: '#06B6D4', icon: 'Repeat', count: 62, isSystem: false },
    { id: 'lbl-13', name: 'Complaint', color: '#DC2626', icon: 'ShieldAlert', count: 2, isSystem: false },
    { id: 'lbl-14', name: 'Support required', color: '#D97706', icon: 'HelpCircle', count: 5, isSystem: false },
  ],

  // 5. Customers & Contacts
  customers: [
    {
      id: 'cust-1',
      name: 'Amara Okafor',
      phone: '+234 803 123 4567',
      email: 'amara@artisan.africa',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      tags: ['VIP customer', 'Returning customer', 'Lagos Fashion Week'],
      notes: 'Interested in bespoke Ankara ceremonial wraps and bulk brass cuff bangles.',
      totalOrders: 6,
      totalSpend: 1420,
      currency: 'USD',
      status: 'vip',
      segment: 'High Value',
      lastInteraction: '2 hours ago',
    },
    {
      id: 'cust-2',
      name: 'Kwame Mensah',
      phone: '+233 244 567 890',
      email: 'kwame.mensah@ghana-design.org',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      tags: ['Paid', 'Order shipped'],
      notes: 'Shipped Kiondo handcrafted tote via DHL Express to Accra.',
      totalOrders: 3,
      totalSpend: 480,
      currency: 'USD',
      status: 'customer',
      segment: 'Frequent Buyer',
      lastInteraction: 'Yesterday',
    },
    {
      id: 'cust-3',
      name: 'Zainab Al-Mansoor',
      phone: '+971 50 123 4567',
      email: 'zainab.m@dubaiart.ae',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      tags: ['Hot lead', 'VIP customer'],
      notes: 'Requested wholesale price quotation for boutique gallery in Dubai Mall.',
      totalOrders: 1,
      totalSpend: 850,
      currency: 'USD',
      status: 'hot_lead',
      segment: 'New Prospect',
      lastInteraction: '3 hours ago',
    },
  ],

  // 6. Broadcast & Marketing
  broadcastMarketing: {
    optOutKeyword: 'STOP',
    dailyBroadcastLimit: 5000,
    campaigns: [
      {
        id: 'camp-1',
        name: 'Autumn Heritage Collection Drop 🍂',
        templateType: 'product_launch',
        targetSegment: 'VIP & Returning Customers',
        recipientsCount: 2450,
        scheduledTime: '2026-09-02 10:00 EAT',
        status: 'scheduled',
        stats: {
          deliveryRate: 98.4,
          readRate: 86.2,
          responseRate: 34.5,
          conversionRate: 14.8,
        },
      },
      {
        id: 'camp-2',
        name: 'VIP Mobile Money Flash Weekend (20% Off)',
        templateType: 'flash_sale',
        targetSegment: 'All Customers',
        recipientsCount: 1890,
        scheduledTime: '2026-08-28 14:00 EAT',
        status: 'completed',
        stats: {
          deliveryRate: 99.1,
          readRate: 91.5,
          responseRate: 42.1,
          conversionRate: 21.3,
        },
      },
    ],
  },

  // 7. Automation
  automation: {
    autoReplyBotEnabled: true,
    chatbotName: 'AfroArtisan AI Concierge',
    aiAssistantActive: true,
    faqAutomation: [
      {
        question: 'Do you deliver internationally?',
        answer: 'Yes! We ship worldwide via DHL Express with door-to-door tracking within 3-5 business days.',
        keywords: ['international', 'overseas', 'worldwide', 'dhl', 'countries'],
      },
      {
        question: 'How do I pay with M-Pesa or MTN MoMo?',
        answer: 'When checking out or requesting an invoice in chat, select Mobile Money to receive an instant USSD push prompt directly to your phone!',
        keywords: ['mpesa', 'momo', 'mobile money', 'ussd', 'prompt'],
      },
    ],
    keywordTriggers: [
      { trigger: 'catalog', action: 'send_catalog', payload: 'https://wat.chat/c/afroartisan' },
      { trigger: 'wholesale', action: 'assign_label', payload: 'Hot lead' },
      { trigger: 'agent', action: 'route_team', payload: 'Customer Support' },
    ],
    leadQualificationEnabled: true,
    smartRoutingEnabled: true,
    orderFollowUpHours: 48,
    abandonedCartReminderMinutes: 60,
  },

  // 8. Business Team / Staff
  team: [
    {
      id: 'usr-1',
      name: 'Nia Kiprono (You)',
      email: 'nia@afroartisan.store',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      phone: '+254 700 892 104',
      role: 'Admin',
      status: 'active',
      permissions: {
        viewChats: true,
        sendMessages: true,
        deleteMessages: true,
        manageCustomers: true,
        manageCatalog: true,
        manageOrders: true,
        managePayments: true,
        manageCampaigns: true,
        viewAnalytics: true,
        manageStaff: true,
        changeBusinessSettings: true,
      },
    },
    {
      id: 'usr-2',
      name: 'Tariq Al-Mansoor',
      email: 'tariq@afroartisan.store',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      phone: '+254 711 345 678',
      role: 'Sales',
      status: 'active',
      permissions: {
        viewChats: true,
        sendMessages: true,
        deleteMessages: false,
        manageCustomers: true,
        manageCatalog: true,
        manageOrders: true,
        managePayments: true,
        manageCampaigns: false,
        viewAnalytics: true,
        manageStaff: false,
        changeBusinessSettings: false,
      },
    },
    {
      id: 'usr-3',
      name: 'Folake Adeyemi',
      email: 'folake@afroartisan.store',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      phone: '+234 812 345 6789',
      role: 'Customer Support',
      status: 'active',
      permissions: {
        viewChats: true,
        sendMessages: true,
        deleteMessages: false,
        manageCustomers: true,
        manageCatalog: false,
        manageOrders: true,
        managePayments: false,
        manageCampaigns: false,
        viewAnalytics: false,
        manageStaff: false,
        changeBusinessSettings: false,
      },
    },
    {
      id: 'usr-4',
      name: 'David Ochieng',
      email: 'david@afroartisan.store',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      phone: '+254 722 987 654',
      role: 'Finance',
      status: 'active',
      permissions: {
        viewChats: false,
        sendMessages: false,
        deleteMessages: false,
        manageCustomers: false,
        manageCatalog: false,
        manageOrders: true,
        managePayments: true,
        manageCampaigns: false,
        viewAnalytics: true,
        manageStaff: false,
        changeBusinessSettings: false,
      },
    },
  ],

  // 9. Notifications
  notifications: {
    messages: {
      newMessage: true,
      groupMentions: true,
      vipCustomersOnly: false,
    },
    orders: {
      newOrder: true,
      paymentReceived: true,
      paymentFailed: true,
      orderCancelled: true,
      deliveryUpdate: true,
    },
    calls: {
      incomingCalls: true,
      missedCallAlerts: true,
    },
    business: {
      newLead: true,
      customerResponse: true,
      appointmentBooked: true,
      campaignMilestones: true,
    },
    controls: {
      sound: true,
      vibration: true,
      popupPreviews: true,
      ledIndicator: true,
      priorityMode: true,
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:30',
    },
  },

  // 10. Privacy
  privacy: {
    lastSeenVisibility: 'everyone',
    onlineStatusVisibility: 'everyone',
    profilePhotoVisibility: 'everyone',
    aboutVisibility: 'everyone',
    statusVisibility: 'everyone',
    readReceipts: true,
    typingIndicator: true,
    recordingIndicator: true,
    groupInvitations: 'my_contacts',
    callsPrivacy: 'everyone',
    liveLocationSharing: true,
    appLockEnabled: true,
    appLockTimeout: '15_minutes',
    disappearingMessagesDefault: 0,
    screenshotProtection: true,
  },

  // 11. Security
  security: {
    twoStepVerification: true,
    securityPin: '••••••',
    biometricLock: true,
    passcode: 'Enabled',
    loginAlerts: true,
    e2eeVerificationRequired: true,
    backupEncryption: true,
    trustedDevicesOnly: true,
  },

  // 12. Chats & Storage
  chatsStorage: {
    backupFrequency: 'daily',
    backupAccount: 'afroartisan-backup@google.cloud',
    includeVideosInBackup: true,
    encryptedCloudBackup: true,
    autoDownloadPhotos: true,
    autoDownloadAudio: true,
    autoDownloadVideos: false,
    autoDownloadDocuments: true,
    archiveChatsKeepArchived: true,
    storageUsedMB: 840,
    totalAvailableMB: 51200,
  },

  // 13. Linked Devices
  linkedDevices: [
    {
      id: 'dev-1',
      deviceName: 'MacBook Pro 16" (HQ Office)',
      deviceType: 'desktop',
      os: 'macOS Sequoia 15.2',
      location: 'Nairobi, Kenya',
      ipAddress: '102.214.78.12',
      lastActive: 'Active Now',
      isCurrent: true,
    },
    {
      id: 'dev-2',
      deviceName: 'iPad Pro 12.9" (Showroom Tablet)',
      deviceType: 'tablet',
      os: 'iPadOS 18.1',
      location: 'Westlands Showroom',
      ipAddress: '102.214.78.19',
      lastActive: '14 minutes ago',
      isCurrent: false,
    },
    {
      id: 'dev-3',
      deviceName: 'Chrome Web Session (Manager)',
      deviceType: 'web',
      os: 'Windows 11',
      location: 'Mombasa Logistics Hub',
      ipAddress: '41.89.23.104',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
  ],

  // 14. Calls
  calls: {
    voiceCallsEnabled: true,
    videoCallsEnabled: true,
    silenceUnknownCallers: false,
    lowDataUsageForCalls: false,
    hardwareAcceleration: true,
    echoCancellation: true,
    noiseSuppression: true,
    defaultMic: 'Built-in Studio Microphone (Omni)',
    defaultCamera: 'FaceTime HD Camera 1080p',
  },

  // 15. Payments
  payments: {
    defaultCurrency: 'USD',
    mobileMoneyProviders: [
      { provider: 'Safaricom M-Pesa (Kenya)', accountIdentifier: 'Till: 892401', status: 'active', currencies: ['KES', 'USD'] },
      { provider: 'MTN Mobile Money (Ghana/Uganda/Nigeria)', accountIdentifier: 'Merchant ID: MOMO-GH-9981', status: 'active', currencies: ['GHS', 'UGX', 'NGN'] },
      { provider: 'Airtel Money East Africa', accountIdentifier: 'Paybill: 442100', status: 'active', currencies: ['KES', 'TZS', 'UGX'] },
      { provider: 'Orange Money (Francophone Africa)', accountIdentifier: 'Merchant: OM-SEN-401', status: 'active', currencies: ['XOF', 'EUR'] },
    ],
    bankAccountDetails: {
      bankName: 'Standard Chartered Bank Kenya',
      accountNumber: '0108092817400',
      accountName: 'AfroArtisan Global Merchant Acc',
      swiftBic: 'SCBLKENXXXX',
    },
    cardProcessingActive: true,
    vatTaxRate: 16,
    settlementFrequency: 'instant',
    autoSendReceipts: true,
  },

  // 16. Appointments
  appointments: {
    enabled: true,
    workingHoursStart: '09:00',
    workingHoursEnd: '17:30',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    bufferBetweenBookingsMinutes: 15,
    autoConfirmBookings: true,
    reminderHoursBefore: 24,
    googleCalendarConnected: true,
    microsoftCalendarConnected: false,
    services: [
      {
        id: 'svc-1',
        title: 'VIP Bespoke Textile Styling & Fitting',
        durationMinutes: 45,
        bufferMinutes: 15,
        price: 50,
        currency: 'USD',
        assignedStaff: 'Nia Kiprono',
        description: 'Private 1-on-1 virtual or showroom styling session for custom ceremonial wraps.',
      },
      {
        id: 'svc-2',
        title: 'B2B Wholesale Catalog Review Consultation',
        durationMinutes: 60,
        bufferMinutes: 20,
        price: 0,
        currency: 'USD',
        assignedStaff: 'Tariq Al-Mansoor',
        description: 'Commercial wholesale review with export rates, container logistics, and volume discounts.',
      },
    ],
  },

  // 17. Business Analytics
  analytics: {
    messaging: {
      sent: 14280,
      delivered: 14190,
      read: 12940,
      received: 8640,
      avgResponseTimeMinutes: 2.4,
    },
    customers: {
      newCustomersThisMonth: 184,
      returningCustomersThisMonth: 342,
      activeConversations: 76,
      customerGrowthPercent: 28.5,
      retentionRatePercent: 84.2,
    },
    sales: {
      totalLeads: 420,
      qualifiedLeads: 285,
      totalOrders: 194,
      revenueFormatted: '$18,450.00',
      avgOrderValueFormatted: '$95.10',
      conversionRatePercent: 68.4,
    },
    campaigns: {
      totalReach: 8640,
      avgEngagementPercent: 82.4,
      totalClicks: 3210,
      totalConversions: 590,
    },
  },

  // 18. Business Documents
  documents: {
    businessRegistrationNumber: 'BN-PVT-2024-998124',
    taxIdentificationNumber: 'P051982741Z',
    defaultPaymentTerms: 'Net 7 Days for Wholesale • Instant Mobile Money for Retail',
    invoiceFooterNote: 'Thank you for supporting African artisans! Goods inspected under ISO-AfriCraft standard.',
    templates: [
      { id: 'doc-1', type: 'invoice', title: 'Standard Commercial Mobile Invoice', lastUsed: 'Today 11:20 AM', templateCode: 'TPL-INV-2026' },
      { id: 'doc-2', type: 'receipt', title: 'Instant Mobile Money Settled Receipt', lastUsed: 'Yesterday', templateCode: 'TPL-RCPT-MOMO' },
      { id: 'doc-3', type: 'quotation', title: 'Export Wholesale Price Quote Proforma', lastUsed: '3 days ago', templateCode: 'TPL-QUOT-B2B' },
      { id: 'doc-4', type: 'contract', title: 'Artisan Consignment Master Agreement', lastUsed: 'Last week', templateCode: 'TPL-CTR-ARTISAN' },
    ],
  },

  // 19. Language & Region
  languageRegion: {
    appLanguage: 'English (US / UK)',
    businessLanguage: 'English + Kiswahili + French',
    customerPreferredLanguage: 'Auto-detect Customer Language',
    autoTranslateIncoming: true,
    defaultCurrency: 'USD ($)',
    country: 'Kenya (KE)',
    timeZone: 'Africa/Nairobi (UTC+3, EAT)',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1,234.56',
  },

  // 20. Appearance
  appearance: {
    theme: 'dark',
    chatWallpaper: 'Geometric African Mudcloth Texture (Subtle Dark)',
    fontSize: 'medium',
    chatDensity: 'comfortable',
    messageBubbleStyle: 'modern_rounded',
    businessBrandAccentColor: '#F59E0B',
  },

  // 21. Accessibility
  accessibility: {
    fontScaling: 100,
    highContrastMode: false,
    screenReaderOptimized: true,
    reducedMotion: false,
    voiceControlEnabled: true,
    captionsEnabled: true,
    textToSpeechForAudio: true,
    speechToTextVoiceInput: true,
    keyboardNavigationEnabled: true,
  },

  // 22. AI Business Settings
  aiBusiness: {
    aiAssistantEnabled: true,
    aiCopilotName: 'AfroArtisan AI Sales Agent',
    personality: 'warm_friendly',
    responseTone: 'formal',
    responseLanguage: 'auto',
    businessKnowledgeBase: 'AfroArtisan is a certified heritage brand specializing in sustainable hand-spun cotton textiles, cold-pressed Nilotica shea butter, and hand-carved soapstone décor. We ship worldwide within 3-5 days.',
    allowedActions: {
      suggestProducts: true,
      generateInvoices: true,
      bookAppointments: true,
      answerFaqs: true,
      qualifyLeads: true,
      processReturns: false,
    },
    humanHandoverEnabled: true,
    confidenceThresholdPercent: 85,
    autoSummarizeLongConversations: true,
    sentimentDetection: true,
    customerIntentTagging: true,
    aiFollowUpSuggestions: true,
    trainingDataOptOut: true,
  },

  // 23. Integrations
  integrations: [
    { id: 'int-1', name: 'HubSpot CRM', category: 'crm', icon: 'Database', status: 'connected', lastSync: '10 mins ago', description: 'Bi-directional contact & lead sync with timeline tracking' },
    { id: 'int-2', name: 'Shopify Storefront', category: 'ecommerce', icon: 'ShoppingBag', status: 'connected', lastSync: '5 mins ago', description: 'Live inventory & catalog syncing with automatic order creation' },
    { id: 'int-3', name: 'Safaricom Daraja API', category: 'payments', icon: 'CreditCard', status: 'connected', lastSync: 'Real-time Webhook', description: 'STK Push C2B and B2B M-Pesa automated transaction verification' },
    { id: 'int-4', name: 'Google Calendar', category: 'calendar', icon: 'Calendar', status: 'connected', lastSync: '1 hour ago', description: 'Real-time showroom appointment booking & staff schedule sync' },
    { id: 'int-5', name: 'Zapier Webhooks', category: 'automation', icon: 'Zap', status: 'connected', lastSync: 'Trigger active', description: 'Automate lead enrichment in Slack, Google Sheets, and Airtable' },
    { id: 'int-6', name: 'Salesforce Enterprise', category: 'crm', icon: 'Cloud', status: 'not_connected', description: 'Sync B2B wholesale opportunities and contracts' },
  ],

  // 24. API & Developer Settings
  developerApi: {
    appId: 'wat_app_afroartisan_prod_9981',
    businessId: 'wat_biz_772091482',
    phoneNumberId: 'wat_phone_254700892104',
    apiKey: 'wat_live_sec_89f92e817a0b41c9b209fa41d7e299',
    webhookUrl: 'https://api.afroartisan.store/webhooks/wat-events',
    webhookSecret: 'whsec_9941a8820c71e9882bf0a1127',
    rateLimitPerMinute: 600,
    sandboxMode: false,
    eventSubscriptions: ['messages.received', 'messages.delivered', 'messages.read', 'payments.settled', 'orders.created', 'appointments.booked'],
  },

  // 25. Business Verification
  verification: {
    status: 'verified',
    registeredLegalName: 'AfroArtisan Global Limited',
    registrationNumber: 'BN-PVT-2024-998124',
    taxDocumentUploaded: true,
    identityVerified: true,
    addressVerified: true,
    phoneVerified: true,
    emailVerified: true,
    verifiedBadgeVisible: true,
  },

  // 26. Legal & Compliance
  legalCompliance: {
    termsOfServiceUrl: 'https://afroartisan.store/terms',
    privacyPolicyUrl: 'https://afroartisan.store/privacy',
    cookiePolicyUrl: 'https://afroartisan.store/cookies',
    gdprCompliant: true,
    popiaCompliant: true,
    dataRetentionMonths: 24,
    marketingConsentRequired: true,
    auditLogsEnabled: true,
  },

  // 27. Help & Support
  helpSupport: {
    helpCenterUrl: 'https://help.wat.chat/business',
    supportEmail: 'support@wat.chat',
    supportPhone: '+1 (800) 555-WAT-BIZ',
    systemStatus: 'all_systems_operational',
  },

  // 28. Account Settings
  account: {
    phoneNumber: '+254 700 892 104',
    email: 'merchant@afroartisan.store',
    username: '@afroartisan:wat.chat',
    accountType: 'WAT Business Pro',
    accountCreatedDate: 'March 14, 2025',
    activeTier: 'Enterprise Merchant Tier 1',
  },
};

const STORAGE_KEY = 'wat_business_settings_v1';

export function loadSavedBusinessSettings(): WATBusinessSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_WAT_BUSINESS_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to parse saved business settings from localStorage', err);
  }
  return DEFAULT_WAT_BUSINESS_SETTINGS;
}

export function saveBusinessSettingsToStorage(settings: WATBusinessSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save business settings to localStorage', err);
  }
}

export function resetBusinessSettingsToDefault(): WATBusinessSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset business settings in localStorage', err);
  }
  return DEFAULT_WAT_BUSINESS_SETTINGS;
}
