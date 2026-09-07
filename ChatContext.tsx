import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  User,
  Room,
  Message,
  MessageType,
  MessageStatus,
  StoryStatus,
  CommunitySpace,
  ActiveCall,
  CallParticipant,
  MatrixEventLog,
  InvoiceInfo,
  ProductInfo,
  LocationInfo,
  JitsiServerConfig,
  WalletCurrency,
  WalletTransaction,
  DiscoverItem,
  PriorityUrgentItem,
  PriorityMeetingItem,
  PriorityPaymentItem,
  PriorityAIBrief,
  AuthStatus,
  MfaStatus,
  OnboardingStatus,
  NetworkMode,
  QueuedMessage,
  CheckoutItem,
  Order,
  EmailNotification,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ROOMS,
  INITIAL_MESSAGES,
  INITIAL_STORIES,
  INITIAL_COMMUNITIES,
  INITIAL_PRODUCTS,
} from '../data/initialData';
import {
  INITIAL_DISCOVER_ITEMS,
  INITIAL_WALLET_TRANSACTIONS,
  INITIAL_PRIORITY_URGENT,
  INITIAL_PRIORITY_MEETINGS,
  INITIAL_PRIORITY_PAYMENTS,
  INITIAL_AI_BRIEF,
} from '../data/discoverAndWalletData';
import { soundEngine } from '../utils/audioSynth';
import { storage } from '../utils/storageEngine';
import confetti from 'canvas-confetti';
import { currencyService, RateTick, SUPPORTED_CURRENCIES } from '../services/currencyService';

export type MainNavTab =
  | 'dashboard'
  | 'chats'
  | 'discover'
  | 'ai'
  | 'business'
  | 'you'
  | 'stories'
  | 'communities'
  | 'calls'
  | 'conference'
  | 'architecture';

interface ChatContextType {
  // Users & Auth
  users: User[];
  currentUser: User;
  setCurrentUserById: (userId: string) => void;

  // Rooms
  rooms: Room[];
  activeRoomId: string;
  activeRoom: Room | undefined;
  setActiveRoomId: (id: string) => void;
  createRoom: (name: string, type: Room['type'], memberIds: string[], topic?: string) => Room;
  togglePinRoom: (roomId: string) => void;
  toggleMuteRoom: (roomId: string) => void;
  toggleArchiveRoom: (roomId: string) => void;
  archiveRoom: (roomId: string) => void;
  unarchiveRoom: (roomId: string) => void;
  updateDisappearingTimer: (roomId: string, seconds: number) => void;

  // Messages
  messages: Message[];
  allMessages: Record<string, Message[]>;
  sendMessage: (params: {
    text: string;
    type?: MessageType;
    mediaUrl?: string;
    mediaInfo?: any;
    locationInfo?: LocationInfo;
    invoiceInfo?: InvoiceInfo;
    productInfo?: ProductInfo;
    contactInfo?: any;
    replyTo?: Message;
  }) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  toggleStar: (messageId: string) => void;
  togglePinMessage: (messageId: string) => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string, forEveryone?: boolean) => void;
  translateMessage: (messageId: string, targetLanguage: string) => Promise<void>;
  transcribeMessage: (messageId: string) => Promise<void>;
  payInvoice: (messageId: string, paymentMethod: InvoiceInfo['paymentMethod']) => void;

  // Active Call (WebRTC & Jitsi Meet)
  activeCall: ActiveCall | null;
  setActiveCall: React.Dispatch<React.SetStateAction<ActiveCall | null>>;
  startCall: (
    roomId: string,
    type: 'voice' | 'video',
    options?: {
      customDomain?: string;
      roomName?: string;
      mode?: 'jitsi_iframe' | 'interactive_mesh';
      isMobile?: boolean;
    }
  ) => void;
  startJitsiConference: (
    roomName?: string,
    type?: 'voice' | 'video',
    options?: {
      customDomain?: string;
      isMobile?: boolean;
    }
  ) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleSpeaker: () => void;
  addCallParticipant: (user: User) => void;
  toggleScreenShare: () => void;
  toggleCallTileView: () => void;
  toggleCallLowBandwidth: () => void;
  toggleMobileLayout: () => void;
  setConferenceMode: (mode: 'jitsi_iframe' | 'interactive_mesh') => void;
  setCallE2EEKey: (key: string) => void;
  setCallPassword: (password: string) => void;

  // Social / Stories & Communities
  stories: StoryStatus[];
  communities: CommunitySpace[];
  addStory: (story: Omit<StoryStatus, 'id' | 'viewsCount' | 'viewed' | 'timestamp'>) => void;
  markStoryViewed: (storyId: string) => void;

  // Business Suite & Mode
  products: ProductInfo[];
  setProducts: React.Dispatch<React.SetStateAction<ProductInfo[]>>;
  addProduct: (productData: Omit<ProductInfo, 'id'>) => ProductInfo;
  createInvoiceInChat: (amount: number, currency: InvoiceInfo['currency'], description: string, paymentMethod: InvoiceInfo['paymentMethod']) => void;
  shareProductInChat: (product: ProductInfo) => void;
  shareProductToRooms: (product: ProductInfo, roomIds: string[]) => void;
  shareProductToStatus: (product: ProductInfo) => void;
  businessMode: 'personal' | 'business';
  setBusinessMode: (mode: 'personal' | 'business') => void;
  toggleBusinessMode: () => void;

  // Theme & Appearance (Native Dark Mode)
  theme: 'light' | 'dark' | 'system';
  isDarkMode: boolean;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;

  // WAT Revolut-style Multi-Currency Wallet & Real-Time Exchange
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  walletCurrency: WalletCurrency;
  setWalletCurrency: (c: WalletCurrency) => void;
  walletBalances: Record<string, number>;
  setWalletBalances: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  walletTransactions: WalletTransaction[];
  sendMoney: (amount: number, recipientName: string, recipientHandle: string, note?: string) => void;
  requestMoney: (amount: number, payerName: string, note?: string) => void;
  exchangeCurrency: (
    fromCurrency: string,
    toCurrency: string,
    fromAmount: number
  ) => Promise<{ success: boolean; tx?: WalletTransaction; error?: string }>;
  liveRates: Record<string, RateTick>;
  isExchangeModalOpen: boolean;
  setIsExchangeModalOpen: (open: boolean) => void;
  openExchangeModal: (from?: string, to?: string) => void;
  exchangeInitialCurrencies: { from: string; to: string };

  // WAT Discover Layer
  discoverItems: DiscoverItem[];
  savedDiscoverIds: string[];
  toggleSaveDiscoverItem: (id: string) => void;

  // Priority Hub & AI Brief
  priorityUrgent: PriorityUrgentItem[];
  priorityMeetings: PriorityMeetingItem[];
  priorityPayments: PriorityPaymentItem[];
  priorityAIBrief: PriorityAIBrief;
  dismissPriorityUrgent: (id: string) => void;
  dismissUrgentItem: (id: string) => void;
  dismissPriorityPayment: (id: string) => void;
  settlePriorityPayment: (id: string) => void;

  // Architecture & Matrix Events
  matrixLogs: MatrixEventLog[];
  logMatrixEvent: (type: string, endpoint: string, payloadSummary: string, direction?: 'inbound' | 'outbound') => void;

  // UI Navigation & Modals
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  isBlueprintOpen: boolean;
  setIsBlueprintOpen: (open: boolean) => void;
  isE2EEOpen: boolean;
  setIsE2EEOpen: (open: boolean) => void;
  isUVSModalOpen: boolean;
  setIsUVSModalOpen: (open: boolean) => void;
  isBusinessSuiteOpen: boolean;
  setIsBusinessSuiteOpen: (open: boolean) => void;
  isBusinessSettingsOpen: boolean;
  setIsBusinessSettingsOpen: (open: boolean) => void;
  businessSettingsSection: any;
  setBusinessSettingsSection: (section: any) => void;
  openBusinessSettings: (section?: any) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isUserSwitcherOpen: boolean;
  setIsUserSwitcherOpen: (open: boolean) => void;
  isNewChatModalOpen: boolean;
  setIsNewChatModalOpen: (open: boolean) => void;
  isStarredDrawerOpen: boolean;
  setIsStarredDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isUniversalSearchOpen: boolean;
  setIsUniversalSearchOpen: (open: boolean) => void;
  isCommandCenterOpen: boolean;
  setIsCommandCenterOpen: (open: boolean) => void;
  isStoryViewerOpen: boolean;
  setIsStoryViewerOpen: (open: boolean) => void;
  selectedStoryIndex: number;
  setSelectedStoryIndex: (index: number) => void;
  isJitsiDevOpsOpen: boolean;
  setIsJitsiDevOpsOpen: (open: boolean) => void;
  jitsiServerConfig: JitsiServerConfig;
  setJitsiServerConfig: React.Dispatch<React.SetStateAction<JitsiServerConfig>>;

  // AI Helpers
  summarizeCurrentRoom: () => Promise<string>;
  generateSmartReplies: (lastMsg: string) => Promise<string[]>;
  rewriteText: (text: string, tone: string) => Promise<string>;

  // Onboarding (WhatsApp Flow) & Auth Lifecycle
  authStatus: AuthStatus;
  setAuthStatus: (status: AuthStatus) => void;
  mfaStatus: MfaStatus;
  setMfaStatus: (status: MfaStatus) => void;
  onboardingStatus: OnboardingStatus;
  setOnboardingStatus: (status: OnboardingStatus) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  isLogoutConfirmOpen: boolean;
  setIsLogoutConfirmOpen: (open: boolean) => void;

  signUp: (formData: {
    name: string;
    dob: string;
    country: string;
    phone: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signIn: (
    identifier: string,
    password?: string
  ) => Promise<{ success: boolean; requiresMfa?: boolean; user?: User; error?: string }>;
  verifyLoginMfa: (code: string) => Promise<{ success: boolean; error?: string }>;
  activateMfa: (method: 'authenticator' | 'sms', code: string) => Promise<{ success: boolean; error?: string }>;
  skipMfa: () => void;
  saveOnboardingStep: (step: number, partialData: Partial<User>) => void;
  finishOnboarding: (userData: Partial<User>) => void;
  logout: () => void;
  startAuthExperience: () => void;

  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  completeOnboarding: (userData: {
    name: string;
    phone: string;
    avatar: string;
    statusMessage: string;
    countryCode: string;
  }) => void;

  // User Profiles
  viewingUserProfile: User | null;
  setViewingUserProfile: (user: User | null) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  openUserProfile: (userOrId: string | User) => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;

  // Typing simulation
  typingUsers: string[];
  sendTypingNotification: (isTyping: boolean) => void;
  simulatePeerTyping: (userName?: string, durationMs?: number) => void;
  markRoomAsRead: (roomId: string) => void;

  // Offline Persistence, Outbox & Network Simulation
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  isOnline: boolean;
  outboxQueue: QueuedMessage[];
  flushOutboxQueue: () => void;
  retryMessage: (messageId: string) => void;

  // Keyboard Shortcuts Modal
  isKeyboardShortcutsOpen: boolean;
  setIsKeyboardShortcutsOpen: (open: boolean) => void;
  toggleKeyboardShortcuts: () => void;
  clearAllAppData: () => void;

  // WAT Unified Checkout & Payments Infrastructure
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutItems: CheckoutItem[];
  setCheckoutItems: React.Dispatch<React.SetStateAction<CheckoutItem[]>>;
  openCheckout: (items: CheckoutItem[], originatingContext?: any) => void;
  openProductCheckout: (product: ProductInfo) => void;
  openInvoiceCheckout: (invoice: InvoiceInfo) => void;

  // Payment Modals & Notifications
  isPaymentSuccessOpen: boolean;
  setIsPaymentSuccessOpen: (open: boolean) => void;
  latestOrder: Order | null;
  setLatestOrder: (order: Order | null) => void;
  latestEmailNotification: EmailNotification | null;
  setLatestEmailNotification: (email: EmailNotification | null) => void;
  isPaymentDeclinedOpen: boolean;
  setIsPaymentDeclinedOpen: (open: boolean) => void;
  declineErrorMessage: string;
  setDeclineErrorMessage: (msg: string) => void;
  declineOrderId?: string;
  isEmailViewerOpen: boolean;
  setIsEmailViewerOpen: (open: boolean) => void;
  viewingEmailNotification: EmailNotification | null;
  openEmailViewer: (email: EmailNotification) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => storage.get('users', INITIAL_USERS));
  const [currentUserId, setCurrentUserId] = useState<string>(() => storage.get('current_user_id', 'user_lusimadio'));
  const [rooms, setRooms] = useState<Room[]>(() => storage.get('rooms', INITIAL_ROOMS));
  const [activeRoomId, setActiveRoomId] = useState<string>('');
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, Message[]>>(() => storage.get('messages', INITIAL_MESSAGES));
  const [stories, setStories] = useState<StoryStatus[]>(() => storage.get('stories', INITIAL_STORIES));
  const [communities] = useState<CommunitySpace[]>(INITIAL_COMMUNITIES);
  const [products, setProducts] = useState<ProductInfo[]>(() => storage.get('products', INITIAL_PRODUCTS));
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // WAT Unified Checkout & Payments Infrastructure State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [latestEmailNotification, setLatestEmailNotification] = useState<EmailNotification | null>(null);
  const [isPaymentDeclinedOpen, setIsPaymentDeclinedOpen] = useState(false);
  const [declineErrorMessage, setDeclineErrorMessage] = useState('');
  const [declineOrderId, setDeclineOrderId] = useState<string | undefined>(undefined);
  const [isEmailViewerOpen, setIsEmailViewerOpen] = useState(false);
  const [viewingEmailNotification, setViewingEmailNotification] = useState<EmailNotification | null>(null);

  const openCheckout = (items: CheckoutItem[], originatingContext?: any) => {
    setCheckoutItems(items);
    setIsCheckoutOpen(true);
  };

  const openProductCheckout = (product: ProductInfo) => {
    const item: CheckoutItem = {
      id: `item_${product.id}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency || 'ZAR',
      quantity: 1,
      image: product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      category: product.category,
      sellerName: 'WAT Verified Merchant',
    };
    openCheckout([item], { type: 'product', productId: product.id });
  };

  const openInvoiceCheckout = (invoice: InvoiceInfo) => {
    const item: CheckoutItem = {
      id: `item_inv_${invoice.invoiceId}_${Date.now()}`,
      productId: invoice.invoiceId,
      name: `Invoice #${invoice.invoiceId} - ${invoice.description}`,
      description: invoice.description,
      price: invoice.amount,
      currency: invoice.currency || 'ZAR',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
      category: 'services',
      sellerName: 'WAT Merchant',
    };
    openCheckout([item], { type: 'invoice', invoiceId: invoice.invoiceId });
  };

  const openEmailViewer = (email: EmailNotification) => {
    setViewingEmailNotification(email);
    setIsEmailViewerOpen(true);
  };

  // Network Simulation & Persistent Outbox Queue
  const [networkMode, setNetworkMode] = useState<NetworkMode>('online');
  const [isOnline, setIsOnline] = useState<boolean>(typeof window !== 'undefined' && typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [outboxQueue, setOutboxQueue] = useState<QueuedMessage[]>(() => storage.get('outbox_queue', []));
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState<boolean>(false);

  const toggleKeyboardShortcuts = () => {
    setIsKeyboardShortcutsOpen((prev) => !prev);
  };

  // Sync state to local storage engine
  useEffect(() => { storage.set('users', users); }, [users]);
  useEffect(() => { storage.set('current_user_id', currentUserId); }, [currentUserId]);
  useEffect(() => { storage.set('rooms', rooms); }, [rooms]);
  useEffect(() => { storage.set('messages', messagesByRoom); }, [messagesByRoom]);
  useEffect(() => { storage.set('stories', stories); }, [stories]);
  useEffect(() => { storage.set('products', products); }, [products]);
  useEffect(() => { storage.set('outbox_queue', outboxQueue); }, [outboxQueue]);

  // Online / Offline window listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Business Mode & Wallet
  const [businessMode, setBusinessMode] = useState<'personal' | 'business'>('personal');
  const toggleBusinessMode = () => {
    setBusinessMode((prev) => (prev === 'personal' ? 'business' : 'personal'));
    soundEngine.playChime();
  };

  // Global Theme & Native Dark Mode
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    return storage.get<'light' | 'dark' | 'system'>('wat_theme', 'light');
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = storage.get<'light' | 'dark' | 'system'>('wat_theme', 'light');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  });

  useEffect(() => {
    const applyTheme = () => {
      let activeDark = false;
      if (theme === 'dark') {
        activeDark = true;
      } else if (theme === 'light') {
        activeDark = false;
      } else {
        activeDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDarkMode(activeDark);
      if (typeof document !== 'undefined') {
        if (activeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    applyTheme();
    storage.set('wat_theme', theme);

    if (theme === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  const setTheme = (mode: 'light' | 'dark' | 'system') => {
    setThemeState(mode);
    soundEngine.playChime();
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const currentlyDark =
        prev === 'dark' ||
        (prev === 'system' &&
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      return currentlyDark ? 'light' : 'dark';
    });
    soundEngine.playChime();
  };

  // Multi-Currency Holdings & Real-Time Exchange
  const INITIAL_WALLET_BALANCES: Record<string, number> = {
    ZAR: 24850.0,
    USD: 1360.5,
    EUR: 1250.0,
    GBP: 980.0,
    NGN: 850000.0,
    KES: 95000.0,
    GHS: 6400.0,
    EGP: 28500.0,
    XOF: 450000.0,
    WAT: 12500.0,
  };

  const [walletBalances, setWalletBalances] = useState<Record<string, number>>(() => {
    return storage.get('wallet_balances', INITIAL_WALLET_BALANCES);
  });

  const [walletCurrency, setWalletCurrencyState] = useState<WalletCurrency>(() => storage.get('wallet_currency', 'ZAR'));

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const savedBalances = storage.get('wallet_balances', INITIAL_WALLET_BALANCES);
    const curr = storage.get('wallet_currency', 'ZAR');
    return savedBalances[curr] ?? 24850.0;
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() =>
    storage.get('wallet_transactions', INITIAL_WALLET_TRANSACTIONS)
  );

  const setWalletCurrency = (c: WalletCurrency) => {
    setWalletCurrencyState(c);
    if (walletBalances[c] !== undefined) {
      setWalletBalance(walletBalances[c]);
    }
    soundEngine.playChime();
  };

  useEffect(() => {
    storage.set('wallet_balances', walletBalances);
    if (walletBalances[walletCurrency] !== undefined) {
      setWalletBalance(walletBalances[walletCurrency]);
    }
  }, [walletBalances, walletCurrency]);

  useEffect(() => { storage.set('wallet_balance', walletBalance); }, [walletBalance]);
  useEffect(() => { storage.set('wallet_currency', walletCurrency); }, [walletCurrency]);
  useEffect(() => { storage.set('wallet_transactions', walletTransactions); }, [walletTransactions]);

  // Real-Time Currency Exchange Rates Feed
  const [liveRates, setLiveRates] = useState<Record<string, RateTick>>(() => currencyService.getRates());

  useEffect(() => {
    const unsubscribe = currencyService.subscribe((updated) => {
      setLiveRates(updated);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Currency Exchange Modal State
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [exchangeInitialCurrencies, setExchangeInitialCurrencies] = useState<{ from: string; to: string }>({
    from: 'USD',
    to: 'ZAR',
  });

  const openExchangeModal = (from: string = 'USD', to: string = 'ZAR') => {
    setExchangeInitialCurrencies({ from, to });
    setIsExchangeModalOpen(true);
    soundEngine.playChime();
  };

  const exchangeCurrency = async (
    fromCurrency: string,
    toCurrency: string,
    fromAmount: number
  ): Promise<{ success: boolean; tx?: WalletTransaction; error?: string }> => {
    const currentFromBalance = walletBalances[fromCurrency] ?? 0;
    if (fromAmount <= 0) {
      return { success: false, error: 'Exchange amount must be greater than zero.' };
    }
    if (fromAmount > currentFromBalance) {
      return {
        success: false,
        error: `Insufficient ${fromCurrency} balance. Available: ${currencyService.format(currentFromBalance, fromCurrency)}`,
      };
    }

    const quote = currencyService.convert(fromCurrency, toCurrency, fromAmount);

    // Update balances
    setWalletBalances((prev) => {
      const nextFrom = Math.max(0, +(prev[fromCurrency] - fromAmount).toFixed(2));
      const nextTo = +((prev[toCurrency] ?? 0) + quote.toAmount).toFixed(2);
      return {
        ...prev,
        [fromCurrency]: nextFrom,
        [toCurrency]: nextTo,
      };
    });

    const fromMeta = currencyService.getCurrencyMeta(fromCurrency);
    const toMeta = currencyService.getCurrencyMeta(toCurrency);

    const newTx: WalletTransaction = {
      id: `tx_fx_${Date.now()}`,
      type: 'invoice_settlement',
      amount: quote.toAmount,
      currency: toCurrency as WalletCurrency,
      counterpartyName: `Matrix Spot FX (${fromCurrency} → ${toCurrency})`,
      category: 'Transfer',
      timestamp: Date.now(),
      status: 'completed',
      note: `Exchanged ${currencyService.format(fromAmount, fromCurrency)} for ${currencyService.format(quote.toAmount, toCurrency)} @ 1 ${fromCurrency} = ${quote.exchangeRate} ${toCurrency} (Zero Matrix Spread Fee)`,
      referenceId: quote.guaranteeId,
    };

    setWalletTransactions((prev) => [newTx, ...prev]);
    soundEngine.playChime();

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#F59E0B'],
      });
    } catch {}

    return { success: true, tx: newTx };
  };

  const sendMoney = (amount: number, recipientName: string, recipientHandle: string, note?: string) => {
    if (amount <= 0 || amount > walletBalance) return;
    setWalletBalance((prev) => Math.max(0, prev - amount));
    setWalletBalances((prev) => ({
      ...prev,
      [walletCurrency]: Math.max(0, (prev[walletCurrency] || 0) - amount),
    }));
    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      type: 'outgoing',
      amount,
      currency: walletCurrency,
      counterpartyName: recipientName,
      counterpartyHandle: recipientHandle,
      counterpartyAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      category: 'Transfer',
      timestamp: Date.now(),
      status: 'completed',
      note: note || 'Peer transfer via WAT Wallet',
      referenceId: `WAT-TX-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setWalletTransactions((prev) => [newTx, ...prev]);
    soundEngine.playMessageSent();
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  const requestMoney = (amount: number, payerName: string, note?: string) => {
    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      type: 'payment_request',
      amount,
      currency: walletCurrency,
      counterpartyName: payerName,
      category: 'Transfer',
      timestamp: Date.now(),
      status: 'pending',
      note: note || 'Payment request sent',
      referenceId: `WAT-REQ-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setWalletTransactions((prev) => [newTx, ...prev]);
    soundEngine.playChime();
  };

  // Discover Items & Saved
  const [discoverItems] = useState<DiscoverItem[]>(INITIAL_DISCOVER_ITEMS);
  const [savedDiscoverIds, setSavedDiscoverIds] = useState<string[]>(['disc_1', 'disc_3']);
  const toggleSaveDiscoverItem = (id: string) => {
    setSavedDiscoverIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    soundEngine.playChime();
  };

  // Priority Hub
  const [priorityUrgent, setPriorityUrgent] = useState<PriorityUrgentItem[]>(INITIAL_PRIORITY_URGENT);
  const [priorityMeetings] = useState<PriorityMeetingItem[]>(INITIAL_PRIORITY_MEETINGS);
  const [priorityPayments, setPriorityPayments] = useState<PriorityPaymentItem[]>(INITIAL_PRIORITY_PAYMENTS);
  const [priorityAIBrief] = useState<PriorityAIBrief>(INITIAL_AI_BRIEF);

  const dismissPriorityUrgent = (id: string) => {
    setPriorityUrgent((prev) => prev.filter((p) => p.id !== id));
  };
  const dismissUrgentItem = dismissPriorityUrgent;

  const dismissPriorityPayment = (id: string) => {
    setPriorityPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const settlePriorityPayment = (id: string) => {
    const payment = priorityPayments.find((p) => p.id === id);
    if (payment) {
      setWalletBalance((prev) => Math.max(0, prev - payment.amount));
      setWalletBalances((prev) => {
        const curr = (payment.currency as string) || walletCurrency;
        return {
          ...prev,
          [curr]: Math.max(0, (prev[curr] || 0) - payment.amount),
        };
      });
      const newTx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        type: 'outgoing',
        amount: payment.amount,
        currency: payment.currency as any,
        counterpartyName: payment.counterpartyName,
        category: 'Invoice',
        timestamp: Date.now(),
        status: 'completed',
        note: `Settled Invoice ${payment.invoiceId} (${payment.description})`,
        referenceId: `WAT-INV-${Math.floor(100000 + Math.random() * 900000)}`,
      };
      setWalletTransactions((prev) => [newTx, ...prev]);
      setPriorityPayments((prev) => prev.filter((p) => p.id !== id));
      soundEngine.playMessageSent();
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {}
    }
  };

  // Universal Search & Command Center
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);

  // Authentication, MFA & Onboarding Lifecycle State
  const [authStatus, setAuthStatus] = useState<AuthStatus>(() => {
    const saved = localStorage.getItem('wat_auth_status');
    return (saved as AuthStatus) || 'AUTHENTICATED';
  });

  const [mfaStatus, setMfaStatus] = useState<MfaStatus>(() => {
    const saved = localStorage.getItem('wat_mfa_status');
    return (saved as MfaStatus) || 'MFA_ACTIVE';
  });

  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>(() => {
    const saved = localStorage.getItem('wat_onboarding_status');
    return (saved as OnboardingStatus) || 'ONBOARDING_COMPLETED';
  });

  const [onboardingStep, setOnboardingStep] = useState<number>(() => {
    const saved = localStorage.getItem('wat_onboarding_step');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [pendingLoginUser, setPendingLoginUser] = useState<User | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Sync lifecycle with localStorage
  useEffect(() => {
    localStorage.setItem('wat_auth_status', authStatus);
  }, [authStatus]);

  useEffect(() => {
    localStorage.setItem('wat_mfa_status', mfaStatus);
  }, [mfaStatus]);

  useEffect(() => {
    localStorage.setItem('wat_onboarding_status', onboardingStatus);
  }, [onboardingStatus]);

  useEffect(() => {
    localStorage.setItem('wat_onboarding_step', onboardingStep.toString());
  }, [onboardingStep]);

  // Sign Up method
  const signUp = async (formData: {
    name: string;
    dob: string;
    country: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanHandle = `@${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}:wat.chat`;
    const newUserId = `user_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: formData.name,
      handle: cleanHandle,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      statusMessage: 'Available ✦ Building on WAT',
      isOnline: true,
      phone: formData.phone,
      dob: formData.dob,
      country: formData.country,
      location: formData.country,
      joinedDate: 'Joined recently',
      deviceId: `WAT_DEVICE_${Math.floor(1000 + Math.random() * 9000)}`,
      e2eeFingerprint: 'Xk9P/7Qw2+Vz8My4N1nF9Kj5Rt3sD8hL',
      isPhonePublic: false,
      isEmailPublic: false,
      isLocationPublic: true,
      isEducationPublic: true,
      isCareerPublic: true,
      mfaStatus: 'MFA_NOT_CONFIGURED',
      onboardingStatus: 'ONBOARDING_IN_PROGRESS',
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUserId);
    setAuthStatus('AUTHENTICATED');
    setMfaStatus('MFA_NOT_CONFIGURED');
    setOnboardingStatus('ONBOARDING_IN_PROGRESS');
    setOnboardingStep(1);

    return { success: true };
  };

  // Sign In method
  const signIn = async (
    identifier: string,
    password?: string
  ): Promise<{ success: boolean; requiresMfa?: boolean; user?: User; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const foundUser = users.find(
      (u) =>
        u.handle.toLowerCase() === cleanId ||
        (u.phone && u.phone.replace(/\s+/g, '').includes(cleanId.replace(/\s+/g, ''))) ||
        (u.email && u.email.toLowerCase() === cleanId) ||
        u.name.toLowerCase().includes(cleanId)
    );

    if (!foundUser) {
      return { success: false, error: 'No account found with this identifier' };
    }

    if (foundUser.mfaStatus === 'MFA_ACTIVE') {
      setPendingLoginUser(foundUser);
      return { success: true, requiresMfa: true, user: foundUser };
    }

    // Direct login
    setCurrentUserId(foundUser.id);
    setAuthStatus('AUTHENTICATED');
    setMfaStatus(foundUser.mfaStatus || 'MFA_SKIPPED');
    setOnboardingStatus(foundUser.onboardingStatus || 'ONBOARDING_COMPLETED');
    return { success: true, requiresMfa: false, user: foundUser };
  };

  // Verify Login MFA Challenge
  const verifyLoginMfa = async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!pendingLoginUser) {
      return { success: false, error: 'No pending authentication session' };
    }
    // Accept valid 6 digit code (demo: '123456' or any 6-digit number)
    if (code.length === 6) {
      setCurrentUserId(pendingLoginUser.id);
      setAuthStatus('AUTHENTICATED');
      setMfaStatus('MFA_ACTIVE');
      setOnboardingStatus(pendingLoginUser.onboardingStatus || 'ONBOARDING_COMPLETED');
      setPendingLoginUser(null);
      return { success: true };
    }
    return { success: false, error: 'Invalid verification code' };
  };

  // Activate MFA
  const activateMfa = async (
    method: 'authenticator' | 'sms',
    code: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (code.length < 6) {
      return { success: false, error: 'Please enter a valid 6-digit code' };
    }
    setMfaStatus('MFA_ACTIVE');
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUserId ? { ...u, mfaStatus: 'MFA_ACTIVE', mfaMethod: method } : u
      )
    );
    return { success: true };
  };

  // Skip MFA
  const skipMfa = () => {
    setMfaStatus('MFA_SKIPPED');
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, mfaStatus: 'MFA_SKIPPED' } : u))
    );
  };

  // Save Onboarding Step
  const saveOnboardingStep = (step: number, partialData: Partial<User>) => {
    setOnboardingStep(step);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, ...partialData } : u))
    );
  };

  // Finish Onboarding
  const finishOnboarding = (userData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUserId
          ? {
              ...u,
              ...userData,
              onboardingStatus: 'ONBOARDING_COMPLETED',
            }
          : u
      )
    );
    setOnboardingStatus('ONBOARDING_COMPLETED');
    setIsOnboardingOpen(false);
    soundEngine.playMessageSent();
  };

  // Logout method
  const logout = () => {
    setAuthStatus('UNAUTHENTICATED');
    setMfaStatus('MFA_NOT_CONFIGURED');
    setOnboardingStatus('ONBOARDING_NOT_STARTED');
    setIsLogoutConfirmOpen(false);
    setActiveRoomId('');
    soundEngine.playChime();
  };

  const startAuthExperience = () => {
    logout();
  };

  // Switch demo user
  const setCurrentUserById = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUserId(found.id);
      setAuthStatus('AUTHENTICATED');
      setMfaStatus(found.mfaStatus || 'MFA_ACTIVE');
      setOnboardingStatus(found.onboardingStatus || 'ONBOARDING_COMPLETED');
    }
  };

  // Onboarding (WhatsApp Flow) state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  const completeOnboarding = (userData: {
    name: string;
    phone: string;
    avatar: string;
    statusMessage: string;
    countryCode: string;
  }) => {
    const newUserId = 'user_lusimadio';
    const handleSlug = userData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const updatedMe: User = {
      id: newUserId,
      name: userData.name,
      handle: `@${handleSlug || 'lusimadio'}:wat.chat`,
      avatar: userData.avatar,
      statusMessage: userData.statusMessage,
      isOnline: true,
      phone: userData.phone,
      deviceId: 'WAT_PRIMARY_SECURE_DEVICE',
      e2eeFingerprint: 'Xk9P/7Qw2+Vz8My4N1nF9Kj5Rt3sD8hL',
      mfaStatus: 'MFA_ACTIVE',
      onboardingStatus: 'ONBOARDING_COMPLETED',
    };

    setUsers((prev) => {
      const exists = prev.some((u) => u.id === newUserId);
      if (exists) {
        return prev.map((u) => (u.id === newUserId ? updatedMe : u));
      }
      return [updatedMe, ...prev];
    });
    setCurrentUserId(newUserId);
    setAuthStatus('AUTHENTICATED');
    setOnboardingStatus('ONBOARDING_COMPLETED');
    setIsOnboardingOpen(false);
    soundEngine.playMessageSent();
  };

  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<MainNavTab>('dashboard');
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isE2EEOpen, setIsE2EEOpen] = useState(false);
  const [isUVSModalOpen, setIsUVSModalOpen] = useState(false);
  const [isBusinessSuiteOpen, setIsBusinessSuiteOpen] = useState(false);
  const [isBusinessSettingsOpen, setIsBusinessSettingsOpen] = useState(false);
  const [businessSettingsSection, setBusinessSettingsSection] = useState<any>('profile_account');
  const openBusinessSettings = (section?: any) => {
    if (section) setBusinessSettingsSection(section);
    setIsBusinessSettingsOpen(true);
  };
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isStarredDrawerOpen, setIsStarredDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [isJitsiDevOpsOpen, setIsJitsiDevOpsOpen] = useState(false);
  const [jitsiServerConfig, setJitsiServerConfig] = useState<JitsiServerConfig>({
    serverDomain: 'meet.wat.chat',
    publicHttpPort: 80,
    publicHttpsPort: 443,
    jvbPort: 10000,
    enableAuth: true,
    authType: 'jwt',
    jwtAppId: 'wat_matrix_app',
    jwtAppSecret: 'sovereign_wat_secret_key_8892',
    enableGuests: true,
    enableLetsEncrypt: true,
    letsEncryptEmail: 'devops@wat.chat',
    enableJibri: true,
    enableJigasi: false,
    enableCoturn: true,
    enableOcto: true,
    configDirectory: '~/.jitsi-meet-cfg',
    isCustomServer: false,
  });

  // User Profiles & Profile Editing
  const [viewingUserProfile, setViewingUserProfile] = useState<User | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const openUserProfile = (userOrId: string | User) => {
    let targetUser: User | undefined;
    if (typeof userOrId === 'string') {
      targetUser = users.find((u) => u.id === userOrId || u.handle === userOrId);
    } else {
      targetUser = userOrId;
    }
    if (targetUser) {
      setViewingUserProfile(targetUser);
      soundEngine.playChime();
    }
  };

  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updates };
          if (viewingUserProfile && viewingUserProfile.id === userId) {
            setViewingUserProfile(updated);
          }
          return updated;
        }
        return u;
      })
    );

    // If updating name or avatar, reflect in direct chat rooms too
    if (updates.name || updates.avatar) {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.type === 'direct' && r.memberIds.includes(userId)) {
            const isPeer = userId !== currentUserId;
            if (isPeer) {
              return {
                ...r,
                name: updates.name || r.name,
                avatar: updates.avatar || r.avatar,
              };
            }
          }
          return r;
        })
      );
    }
    soundEngine.playMessageSent();
  };

  // Active WebRTC Call
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);

  // Matrix Event Logs for Architecture Inspector
  const [matrixLogs, setMatrixLogs] = useState<MatrixEventLog[]>([
    {
      id: 'log_init_1',
      timestamp: Date.now() - 120000,
      type: 'm.room.encrypted (Megolm)',
      endpoint: '/_matrix/client/v3/sync?since=s7892_1',
      status: 200,
      direction: 'inbound',
      payloadSummary: 'Sync event: decrypted 4 megolm room sessions via vodozemac',
    },
    {
      id: 'log_init_2',
      timestamp: Date.now() - 60000,
      type: 'm.presence',
      endpoint: '/_matrix/client/v3/presence/@amara:wat.chat/status',
      status: 200,
      direction: 'outbound',
      payloadSummary: 'Presence updated to "online" via Redis pub/sub pool',
    },
    {
      id: 'log_init_3',
      timestamp: Date.now() - 30000,
      type: 'm.keys.query',
      endpoint: '/_matrix/client/v3/keys/query',
      status: 200,
      direction: 'outbound',
      payloadSummary: 'Fetched one-time Olm keys for @kwame:wat.chat & @brian:wat.chat',
    },
  ]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const activeRoom = useMemo(() => {
    return rooms.find((r) => r.id === activeRoomId);
  }, [rooms, activeRoomId]);

  const messages = useMemo(() => {
    return messagesByRoom[activeRoomId] || [];
  }, [messagesByRoom, activeRoomId]);

  const logMatrixEvent = (
    type: string,
    endpoint: string,
    payloadSummary: string,
    direction: 'inbound' | 'outbound' = 'outbound'
  ) => {
    const newLog: MatrixEventLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: Date.now(),
      type,
      endpoint,
      status: 200,
      direction,
      payloadSummary,
    };
    setMatrixLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const markRoomAsRead = (roomId: string) => {
    setMessagesByRoom((prev) => {
      const roomMsgs = prev[roomId] || [];
      if (!roomMsgs.length) return prev;
      let hasChanges = false;
      const updated = roomMsgs.map((m) => {
        if (m.senderId !== currentUserId && m.status !== 'read') {
          hasChanges = true;
          return { ...m, status: 'read' as MessageStatus };
        }
        return m;
      });
      return hasChanges ? { ...prev, [roomId]: updated } : prev;
    });

    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, unreadCount: 0 } : r))
    );

    logMatrixEvent(
      'm.receipt',
      `/_matrix/client/v3/rooms/${roomId}/receipt/m.read`,
      `Dispatched Matrix m.receipt for room ${roomId}`
    );
  };

  const sendTypingNotification = (isTyping: boolean) => {
    if (!activeRoomId) return;
    if (isTyping) {
      logMatrixEvent(
        'm.typing',
        `/_matrix/client/v3/rooms/${activeRoomId}/typing/${currentUserId}`,
        `Broadcasted m.typing active event (timeout: 4000ms)`
      );
    }
  };

  const simulatePeerTyping = (userName?: string, durationMs: number = 3200) => {
    if (!activeRoom) return;
    const peerId = activeRoom.memberIds.find((id) => id !== currentUserId);
    const peer = users.find((u) => u.id === peerId);
    const name = userName || (peer ? peer.name : 'Participant');

    setTypingUsers((prev) => Array.from(new Set([...prev, name])));
    logMatrixEvent(
      'm.typing',
      `/_matrix/client/v3/rooms/${activeRoom.id}/typing/${peerId || 'peer'}`,
      `${name} is typing in ${activeRoom.name}`,
      'inbound'
    );

    setTimeout(() => {
      setTypingUsers((prev) => prev.filter((u) => u !== name));
    }, durationMs);
  };

  // Auto-mark room as read on active room change
  useEffect(() => {
    if (activeRoomId) {
      markRoomAsRead(activeRoomId);
    }
  }, [activeRoomId]);

  // Disappearing messages cleanup interval
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setMessagesByRoom((prev) => {
        let changed = false;
        const updated: Record<string, Message[]> = {};
        for (const [roomId, msgs] of Object.entries(prev)) {
          const messageList = (msgs || []) as Message[];
          const filtered = messageList.filter((m) => !m.expiresAt || m.expiresAt > now);
          if (filtered.length !== messageList.length) {
            changed = true;
          }
          updated[roomId] = filtered;
        }
        return changed ? updated : prev;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Active call duration timer
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'connected') return;

    const timer = setInterval(() => {
      setActiveCall((prev) =>
        prev && prev.status === 'connected'
          ? { ...prev, duration: prev.duration + 1 }
          : prev
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [activeCall?.status]);

  // Send message with Optimistic Outbox Queuing & Latency simulation
  const sendMessage = (params: {
    text: string;
    type?: MessageType;
    mediaUrl?: string;
    mediaInfo?: any;
    locationInfo?: LocationInfo;
    invoiceInfo?: InvoiceInfo;
    productInfo?: ProductInfo;
    contactInfo?: any;
    replyTo?: Message;
  }) => {
    if (!activeRoom) return;

    const isCurrentlyOffline = networkMode === 'offline' || !isOnline;
    const isSlow3G = networkMode === 'slow-3g';

    const expiresAt =
      activeRoom.disappearingTimer > 0
        ? Date.now() + activeRoom.disappearingTimer * 1000
        : undefined;

    const initialStatus: MessageStatus = isCurrentlyOffline ? 'failed' : 'sending';

    const newMsg: Message = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      roomId: activeRoom.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: params.text || '',
      timestamp: Date.now(),
      status: initialStatus,
      type: params.type || 'text',
      mediaUrl: params.mediaUrl,
      mediaInfo: params.mediaInfo,
      locationInfo: params.locationInfo,
      invoiceInfo: params.invoiceInfo,
      productInfo: params.productInfo,
      contactInfo: params.contactInfo,
      replyTo: params.replyTo
        ? {
            id: params.replyTo.id,
            senderName: params.replyTo.senderName,
            text: params.replyTo.text || '',
            type: params.replyTo.type,
          }
        : undefined,
      reactions: {},
      isEncrypted: activeRoom.isEncrypted,
      e2eeAlgorithm: activeRoom.isEncrypted ? 'm.megolm.v1.aes-sha2' : undefined,
      expiresAt,
    };

    // Play sound
    soundEngine.playMessageSent();

    // Log Matrix Synapse CS-API event
    const snippet = params.text ? `${params.text.slice(0, 35)}...` : params.type || 'media';
    logMatrixEvent(
      activeRoom.isEncrypted ? 'm.room.encrypted' : 'm.room.message',
      `/_matrix/client/v3/rooms/${activeRoom.id}/send/m.room.message/${newMsg.id}`,
      `Sent ${params.type || 'text'} event (${snippet}) [status: ${initialStatus}]`
    );

    setMessagesByRoom((prev) => ({
      ...prev,
      [activeRoom.id]: [...(prev[activeRoom.id] || []), newMsg],
    }));

    // Update room's last message
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom.id
          ? {
              ...r,
              lastMessage: newMsg,
              unreadCount: 0,
            }
          : r
      )
    );

    // If offline, save into persistent outbox queue and halt remote simulation
    if (isCurrentlyOffline) {
      setOutboxQueue((prev) => [
        ...prev,
        {
          id: newMsg.id,
          roomId: activeRoom.id,
          params,
          timestamp: Date.now(),
          retryCount: 0,
          error: 'Network unreachable (Matrix Offline Mode)',
        },
      ]);
      return;
    }

    // Progressive status update: 'sending' -> 'sent' -> 'delivered' -> 'read'
    const sentDelay = isSlow3G ? 2200 : 250;
    const deliveredDelay = isSlow3G ? 4800 : 650;
    const readDelay = isSlow3G ? 8000 : 2000;

    setTimeout(() => {
      setMessagesByRoom((prev) => {
        const roomMsgs = prev[activeRoom.id] || [];
        const updated = roomMsgs.map((m) =>
          m.id === newMsg.id ? { ...m, status: 'sent' as MessageStatus } : m
        );
        return { ...prev, [activeRoom.id]: updated };
      });
    }, sentDelay);

    setTimeout(() => {
      setMessagesByRoom((prev) => {
        const roomMsgs = prev[activeRoom.id] || [];
        const updated = roomMsgs.map((m) =>
          m.id === newMsg.id ? { ...m, status: 'delivered' as MessageStatus } : m
        );
        return { ...prev, [activeRoom.id]: updated };
      });
    }, deliveredDelay);

    // If direct chat or AI bot, simulate peer read receipt transition
    if (activeRoom.type === 'direct' || activeRoom.id === 'room_ai_assistant') {
      setTimeout(() => {
        setMessagesByRoom((prev) => {
          const roomMsgs = prev[activeRoom.id] || [];
          const updated = roomMsgs.map((m) =>
            m.id === newMsg.id ? { ...m, status: 'read' as MessageStatus } : m
          );
          return { ...prev, [activeRoom.id]: updated };
        });
        logMatrixEvent(
          'm.receipt',
          `/_matrix/client/v3/rooms/${activeRoom.id}/receipt/m.read/${newMsg.id}`,
          `Peer read receipt confirmed for message ${newMsg.id}`,
          'inbound'
        );
      }, readDelay);
    }

    // Trigger intelligent automated response if sending to WAT AI Copilot or Business account
    if (activeRoom.id === 'room_ai_assistant' || activeRoom.memberIds.includes('user_ai')) {
      handleAICopilotResponse(activeRoom.id, params.text);
    } else if (activeRoom.businessInfo?.autoReplyEnabled && currentUser.id !== 'user_business') {
      handleBusinessAutoReply(activeRoom);
    } else if (activeRoom.type === 'direct') {
      // Occasional realistic companion response simulation
      handleSimulatedPeerReply(activeRoom, params.text);
    }
  };

  // Flush queued messages from outbox
  const flushOutboxQueue = () => {
    if (outboxQueue.length === 0) return;
    const queued = [...outboxQueue];
    setOutboxQueue([]);
    soundEngine.playChime();

    queued.forEach((item, index) => {
      setTimeout(() => {
        setMessagesByRoom((prev) => {
          const roomMsgs = prev[item.roomId] || [];
          const updated = roomMsgs.map((m) =>
            m.id === item.id ? { ...m, status: 'delivered' as MessageStatus } : m
          );
          return { ...prev, [item.roomId]: updated };
        });

        logMatrixEvent(
          'm.room.message',
          `/_matrix/client/v3/rooms/${item.roomId}/send/m.room.message/${item.id}`,
          `Flushed queued offline message (${item.id}) to Matrix Synapse`
        );
      }, (index + 1) * 350);
    });
  };

  // Retry individual message
  const retryMessage = (messageId: string) => {
    setOutboxQueue((prev) => prev.filter((q) => q.id !== messageId));

    setMessagesByRoom((prev) => {
      let targetRoomId = '';
      for (const [rid, msgs] of Object.entries(prev) as [string, Message[]][]) {
        if (Array.isArray(msgs) && msgs.some((m) => m.id === messageId)) {
          targetRoomId = rid;
          break;
        }
      }
      if (!targetRoomId) return prev;

      const roomMsgs = prev[targetRoomId] || [];
      const updated = roomMsgs.map((m) =>
        m.id === messageId ? { ...m, status: 'sending' as MessageStatus } : m
      );

      setTimeout(() => {
        setMessagesByRoom((p) => {
          const rms = p[targetRoomId] || [];
          return {
            ...p,
            [targetRoomId]: rms.map((m) =>
              m.id === messageId ? { ...m, status: 'delivered' as MessageStatus } : m
            ),
          };
        });
      }, 600);

      return { ...prev, [targetRoomId]: updated };
    });
    soundEngine.playMessageSent();
  };

  // Clear all local app data
  const clearAllAppData = () => {
    storage.clearAllAppData();
    setUsers(INITIAL_USERS);
    setCurrentUserId('user_lusimadio');
    setRooms(INITIAL_ROOMS);
    setMessagesByRoom(INITIAL_MESSAGES);
    setStories(INITIAL_STORIES);
    setProducts(INITIAL_PRODUCTS);
    setWalletBalance(24850.0);
    setWalletCurrency('ZAR');
    setWalletTransactions(INITIAL_WALLET_TRANSACTIONS);
    setOutboxQueue([]);
    soundEngine.playChime();
  };

  // AI Copilot response handler
  const handleAICopilotResponse = async (roomId: string, userPrompt: string) => {
    setTypingUsers((prev) => [...prev, 'WAT AI Copilot']);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      const data = await res.json();
      const aiReplyText = data.reply || 'I am processing your Matrix request.';

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u !== 'WAT AI Copilot'));

        const aiMsg: Message = {
          id: 'msg_ai_' + Date.now(),
          roomId,
          senderId: 'user_ai',
          senderName: 'WAT AI Copilot',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
          text: aiReplyText,
          timestamp: Date.now(),
          status: 'read',
          type: 'text',
          reactions: {},
        };

        soundEngine.playMessageReceived();
        setMessagesByRoom((prev) => ({
          ...prev,
          [roomId]: [...(prev[roomId] || []), aiMsg],
        }));

        setRooms((prev) =>
          prev.map((r) =>
            r.id === roomId ? { ...r, lastMessage: aiMsg } : r
          )
        );
      }, 900);
    } catch (e) {
      setTypingUsers((prev) => prev.filter((u) => u !== 'WAT AI Copilot'));
    }
  };

  // Business auto-reply handler
  const handleBusinessAutoReply = (room: Room) => {
    const peerId = room.memberIds.find((id) => id !== currentUser.id);
    const peer = users.find((u) => u.id === peerId);
    if (!peer) return;

    setTimeout(() => {
      setTypingUsers((prev) => [...prev, peer.name]);
    }, 600);

    setTimeout(() => {
      setTypingUsers((prev) => prev.filter((u) => u !== peer.name));

      const replyText =
        room.businessInfo?.autoReplyMessage ||
        'Thank you for reaching out to our official store! How can we assist you with our catalog today?';

      const replyMsg: Message = {
        id: 'msg_biz_' + Date.now(),
        roomId: room.id,
        senderId: peer.id,
        senderName: peer.name,
        senderAvatar: peer.avatar,
        text: replyText,
        timestamp: Date.now(),
        status: 'delivered',
        type: 'text',
        reactions: {},
        isEncrypted: room.isEncrypted,
      };

      soundEngine.playMessageReceived();
      setMessagesByRoom((prev) => ({
        ...prev,
        [room.id]: [...(prev[room.id] || []), replyMsg],
      }));
    }, 1800);
  };

  // Simulated peer reply
  const handleSimulatedPeerReply = (room: Room, text: string) => {
    // Only simulate if user sends a question or greeting
    const peerId = room.memberIds.find((id) => id !== currentUser.id);
    if (!peerId || peerId === 'user_ai') return;
    const peer = users.find((u) => u.id === peerId);
    if (!peer) return;

    if (
      text.toLowerCase().includes('hello') ||
      text.toLowerCase().includes('habari') ||
      text.toLowerCase().includes('hey') ||
      text.toLowerCase().includes('call') ||
      text.toLowerCase().includes('ready')
    ) {
      setTimeout(() => {
        setTypingUsers((prev) => [...prev, peer.name]);
      }, 1000);

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u !== peer.name));

        const replies = [
          'Got it! Syncing with the Matrix Synapse worker now 👍',
          'Sounds fantastic! Ready whenever you are.',
          'Checking this on my device. E2EE key matches perfectly! 🔒',
          'Habari! Let me review this and get back to you shortly.',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg: Message = {
          id: 'msg_peer_' + Date.now(),
          roomId: room.id,
          senderId: peer.id,
          senderName: peer.name,
          senderAvatar: peer.avatar,
          text: randomReply,
          timestamp: Date.now(),
          status: 'delivered',
          type: 'text',
          reactions: {},
          isEncrypted: room.isEncrypted,
        };

        soundEngine.playMessageReceived();
        setMessagesByRoom((prev) => ({
          ...prev,
          [room.id]: [...(prev[room.id] || []), replyMsg],
        }));

        setRooms((prev) =>
          prev.map((r) =>
            r.id === room.id ? { ...r, lastMessage: replyMsg } : r
          )
        );
      }, 3000);
    }
  };

  // Toggle reaction
  const toggleReaction = (messageId: string, emoji: string) => {
    if (!activeRoom) return;
    soundEngine.playReactionPop();

    logMatrixEvent(
      'm.reaction',
      `/_matrix/client/v3/rooms/${activeRoom.id}/send/m.reaction`,
      `Reacted ${emoji} to event ${messageId}`
    );

    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.map((msg) => {
        if (msg.id !== messageId) return msg;

        const currentReaction = msg.reactions[emoji] || {
          emoji,
          count: 0,
          userIds: [],
        };
        const hasReacted = currentReaction.userIds.includes(currentUser.id);

        let newUserIds: string[];
        let newCount: number;

        if (hasReacted) {
          newUserIds = currentReaction.userIds.filter((id) => id !== currentUser.id);
          newCount = Math.max(0, currentReaction.count - 1);
        } else {
          newUserIds = [...currentReaction.userIds, currentUser.id];
          newCount = currentReaction.count + 1;
        }

        const newReactions = { ...msg.reactions };
        if (newCount === 0) {
          delete newReactions[emoji];
        } else {
          newReactions[emoji] = {
            emoji,
            count: newCount,
            userIds: newUserIds,
          };
        }

        return {
          ...msg,
          reactions: newReactions,
        };
      });
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Toggle Star message
  const toggleStar = (messageId: string) => {
    if (!activeRoom) return;
    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.map((m) =>
        m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
      );
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Toggle Pin message
  const togglePinMessage = (messageId: string) => {
    if (!activeRoom) return;
    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.map((m) =>
        m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
      );
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Edit message
  const editMessage = (messageId: string, newText: string) => {
    if (!activeRoom) return;
    logMatrixEvent(
      'm.room.message (edit)',
      `/_matrix/client/v3/rooms/${activeRoom.id}/send/m.room.message/edit`,
      `Edited message ${messageId}`
    );

    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.map((m) => {
        if (m.id !== messageId) return m;
        const history = m.editHistory || [{ text: m.text, timestamp: m.timestamp }];
        return {
          ...m,
          text: newText,
          isEdited: true,
          editedAt: Date.now(),
          editHistory: [...history, { text: newText, timestamp: Date.now() }],
        };
      });
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Delete message
  const deleteMessage = (messageId: string, forEveryone: boolean = true) => {
    if (!activeRoom) return;
    logMatrixEvent(
      'm.room.redaction',
      `/_matrix/client/v3/rooms/${activeRoom.id}/redact/${messageId}`,
      `Redacted event ${messageId}`
    );

    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.filter((m) => m.id !== messageId);
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Translate message via AI endpoint
  const translateMessage = async (messageId: string, targetLanguage: string) => {
    if (!activeRoom) return;
    const targetMsg = messages.find((m) => m.id === messageId);
    if (!targetMsg) return;

    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: targetMsg.text,
          targetLanguage,
        }),
      });
      const data = await res.json();
      if (data.translatedText) {
        setMessagesByRoom((prev) => {
          const roomMsgs = prev[activeRoom.id] || [];
          const updated = roomMsgs.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  translatedText: data.translatedText,
                  translatedLang: targetLanguage,
                }
              : m
          );
          return { ...prev, [activeRoom.id]: updated };
        });
      }
    } catch (e) {
      console.error('Translation failed', e);
    }
  };

  // Transcribe audio message via AI
  const transcribeMessage = async (messageId: string) => {
    if (!activeRoom) return;
    const targetMsg = messages.find((m) => m.id === messageId);
    if (!targetMsg) return;

    try {
      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationSeconds: targetMsg.mediaInfo?.duration || 15,
        }),
      });
      const data = await res.json();
      if (data.transcript) {
        setMessagesByRoom((prev) => {
          const roomMsgs = prev[activeRoom.id] || [];
          const updated = roomMsgs.map((m) =>
            m.id === messageId
              ? { ...m, transcription: data.transcript }
              : m
          );
          return { ...prev, [activeRoom.id]: updated };
        });
      }
    } catch (e) {
      console.error('Transcription failed', e);
    }
  };

  // Pay invoice with instant confetti
  const payInvoice = (messageId: string, paymentMethod: InvoiceInfo['paymentMethod']) => {
    if (!activeRoom) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    logMatrixEvent(
      'm.payment.settlement',
      `/_api/payments/momo/verify/${messageId}`,
      `Settled payment via ${paymentMethod}`
    );

    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.map((m) => {
        if (m.id !== messageId || !m.invoiceInfo) return m;
        return {
          ...m,
          invoiceInfo: {
            ...m.invoiceInfo,
            status: 'paid' as const,
            paidAt: Date.now(),
            paymentMethod,
          },
        };
      });
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Create room
  const createRoom = (name: string, type: Room['type'], memberIds: string[], topic?: string): Room => {
    const newRoom: Room = {
      id: 'room_' + Date.now(),
      name,
      type,
      avatar:
        type === 'group'
          ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      topic: topic || 'New Matrix Room',
      isEncrypted: type !== 'channel',
      e2eeSessionId: 'megolm_sess_' + Date.now(),
      memberIds: Array.from(new Set([currentUser.id, ...memberIds])),
      unreadCount: 0,
      disappearingTimer: 0,
      createdAt: Date.now(),
    };

    setRooms((prev) => [newRoom, ...prev]);
    setMessagesByRoom((prev) => ({ ...prev, [newRoom.id]: [] }));
    setActiveRoomId(newRoom.id);

    logMatrixEvent(
      'm.room.create',
      `/_matrix/client/v3/createRoom`,
      `Created room "${name}" (type: ${type})`
    );

    return newRoom;
  };

  const togglePinRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, isPinned: !r.isPinned } : r))
    );
  };

  const toggleMuteRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, isMuted: !r.isMuted } : r))
    );
  };

  const toggleArchiveRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const nextArchived = !r.isArchived;
          logMatrixEvent(
            'm.room.archive',
            `/_matrix/client/v3/rooms/${roomId}/tags`,
            `${nextArchived ? 'Archived' : 'Unarchived'} room "${r.name}"`
          );
          return { ...r, isArchived: nextArchived };
        }
        return r;
      })
    );
    soundEngine.playChime();
  };

  const archiveRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          logMatrixEvent(
            'm.room.archive',
            `/_matrix/client/v3/rooms/${roomId}/tags`,
            `Archived room "${r.name}"`
          );
          return { ...r, isArchived: true };
        }
        return r;
      })
    );
    soundEngine.playChime();
  };

  const unarchiveRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          logMatrixEvent(
            'm.room.unarchive',
            `/_matrix/client/v3/rooms/${roomId}/tags`,
            `Unarchived room "${r.name}"`
          );
          return { ...r, isArchived: false };
        }
        return r;
      })
    );
    soundEngine.playChime();
  };

  const updateDisappearingTimer = (roomId: string, seconds: number) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, disappearingTimer: seconds } : r
      )
    );
  };

  // WebRTC & Jitsi Meet Call actions
  const startCall = (
    roomId: string,
    type: 'voice' | 'video',
    options?: {
      customDomain?: string;
      roomName?: string;
      mode?: 'jitsi_iframe' | 'interactive_mesh';
      isMobile?: boolean;
    }
  ) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    soundEngine.startRingingTone();

    const participants = room.memberIds.map((mId) => {
      const u = users.find((user) => user.id === mId) || {
        id: mId,
        name: 'Member',
        avatar: '',
      };
      return {
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        isSpeaking: u.id !== currentUser.id,
        isMuted: false,
        hasVideo: type === 'video',
      };
    });

    const cleanRoomName = options?.roomName || `wat-${room.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const domain = options?.customDomain || jitsiServerConfig.serverDomain || 'meet.jit.si';
    const isMobile = options?.isMobile ?? (typeof window !== 'undefined' && window.innerWidth < 768);

    const call: ActiveCall = {
      id: 'call_' + Date.now(),
      roomId: room.id,
      roomName: room.name,
      roomAvatar: room.avatar,
      type,
      status: 'ringing',
      duration: 0,
      isMuted: false,
      isCameraOff: type === 'voice',
      isScreenSharing: false,
      isSpeakerOn: true,
      isE2EEEnabled: true,
      e2eeKey: 'wat_e2ee_' + Math.random().toString(36).substring(2, 10),
      jitsiDomain: domain,
      jitsiRoomName: cleanRoomName,
      conferenceMode: options?.mode || (type === 'voice' ? 'interactive_mesh' : 'interactive_mesh'),
      isTileView: true,
      isLowBandwidth: false,
      isMobileLayout: isMobile,
      participants,
    };

    setActiveCall(call);

    logMatrixEvent(
      'm.call.invite',
      `/_matrix/client/v3/rooms/${room.id}/send/m.call.invite`,
      `Initiated Jitsi Meet & WebRTC ${type} call signaling session (room: ${cleanRoomName})`
    );

    // Auto-answer simulation after 1.8 seconds
    setTimeout(() => {
      soundEngine.stopRingingTone();
      soundEngine.playCallConnected();
      setActiveCall((prev) =>
        prev
          ? {
              ...prev,
              status: 'connected',
              startTime: Date.now(),
            }
          : null
      );
    }, 1800);
  };

  const startJitsiConference = (
    customRoomName?: string,
    type: 'voice' | 'video' = 'video',
    options?: {
      customDomain?: string;
      isMobile?: boolean;
    }
  ) => {
    soundEngine.startRingingTone();

    const cleanRoomName =
      customRoomName?.trim() ||
      `wat-matrix-conf-${Date.now().toString().slice(-5)}`;
    const domain = options?.customDomain || jitsiServerConfig.serverDomain || 'meet.jit.si';
    const isMobile = options?.isMobile ?? (typeof window !== 'undefined' && window.innerWidth < 768);

    const call: ActiveCall = {
      id: 'conf_' + Date.now(),
      roomId: 'conference_global',
      roomName: customRoomName || 'Jitsi Scalable Video Conference',
      roomAvatar: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150&auto=format&fit=crop&q=80',
      type,
      status: 'ringing',
      duration: 0,
      isMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
      isSpeakerOn: true,
      isE2EEEnabled: true,
      e2eeKey: 'wat_e2ee_' + Math.random().toString(36).substring(2, 10),
      jitsiDomain: domain,
      jitsiRoomName: cleanRoomName,
      conferenceMode: 'jitsi_iframe',
      isTileView: true,
      isLowBandwidth: false,
      isMobileLayout: isMobile,
      participants: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          isSpeaking: false,
          isMuted: false,
          hasVideo: type === 'video',
        },
        {
          id: 'user_speaker_1',
          name: 'Amara Diop (Video SFU)',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          isSpeaking: true,
          isMuted: false,
          hasVideo: true,
        },
        {
          id: 'user_speaker_2',
          name: 'Kwame Mensah (OCTO Node)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          isSpeaking: false,
          isMuted: false,
          hasVideo: true,
        }
      ],
    };

    setActiveCall(call);

    logMatrixEvent(
      'im.vector.modular.widgets.jitsi',
      `/_matrix/client/v3/rooms/global/jitsi_widget`,
      `Created scalable Jitsi Meet conference: ${cleanRoomName} on ${domain}`
    );

    setTimeout(() => {
      soundEngine.stopRingingTone();
      soundEngine.playCallConnected();
      setActiveCall((prev) =>
        prev
          ? {
              ...prev,
              status: 'connected',
              startTime: Date.now(),
            }
          : null
      );
    }, 1200);
  };

  const endCall = () => {
    soundEngine.stopRingingTone();
    if (activeCall) {
      logMatrixEvent(
        'm.call.hangup',
        `/_matrix/client/v3/rooms/${activeCall.roomId}/send/m.call.hangup`,
        `Ended Jitsi WebRTC call duration: ${activeCall.duration}s`
      );
    }
    setActiveCall(null);
  };

  const toggleMute = () => {
    setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  const toggleCamera = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, isCameraOff: !prev.isCameraOff } : null
    );
  };

  const toggleSpeaker = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, isSpeakerOn: !prev.isSpeakerOn } : null
    );
  };

  const addCallParticipant = (user: User) => {
    setActiveCall((prev) => {
      if (!prev) return null;
      const alreadyIn = prev.participants.some((p) => p.id === user.id);
      if (alreadyIn) return prev;
      const newParticipant: CallParticipant = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        isSpeaking: false,
        isMuted: false,
        hasVideo: prev.type === 'video',
      };
      return {
        ...prev,
        participants: [...prev.participants, newParticipant],
      };
    });
  };

  const toggleScreenShare = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, isScreenSharing: !prev.isScreenSharing } : null
    );
  };

  const toggleCallTileView = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, isTileView: !prev.isTileView } : null
    );
  };

  const toggleCallLowBandwidth = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, isLowBandwidth: !prev.isLowBandwidth } : null
    );
  };

  const toggleMobileLayout = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, isMobileLayout: !prev.isMobileLayout } : null
    );
  };

  const setConferenceMode = (mode: 'jitsi_iframe' | 'interactive_mesh') => {
    setActiveCall((prev) => (prev ? { ...prev, conferenceMode: mode } : null));
  };

  const setCallE2EEKey = (key: string) => {
    setActiveCall((prev) => (prev ? { ...prev, e2eeKey: key } : null));
  };

  const setCallPassword = (password: string) => {
    setActiveCall((prev) => (prev ? { ...prev, roomPassword: password } : null));
  };

  // Call duration counter
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'connected') return;
    const interval = setInterval(() => {
      setActiveCall((prev) =>
        prev ? { ...prev, duration: prev.duration + 1 } : null
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCall?.status]);

  // Stories
  const addStory = (storyData: Omit<StoryStatus, 'id' | 'viewsCount' | 'viewed' | 'timestamp'>) => {
    const newStory: StoryStatus = {
      ...storyData,
      id: 'story_' + Date.now(),
      viewsCount: 1,
      viewed: false,
      timestamp: Date.now(),
    };
    setStories((prev) => [newStory, ...prev]);
  };

  const markStoryViewed = (storyId: string) => {
    setStories((prev) => {
      const target = prev.find((s) => s.id === storyId);
      if (!target || target.viewed) return prev;
      return prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s));
    });
  };

  // Business invoice creator in chat
  const createInvoiceInChat = (
    amount: number,
    currency: InvoiceInfo['currency'],
    description: string,
    paymentMethod: InvoiceInfo['paymentMethod']
  ) => {
    const invoice: InvoiceInfo = {
      invoiceId: 'WAT-INV-' + Math.floor(1000 + Math.random() * 9000),
      amount,
      currency,
      description,
      status: 'pending',
      paymentMethod,
    };
    sendMessage({
      text: `Invoice: ${currency} ${amount} for ${description}`,
      type: 'invoice',
      invoiceInfo: invoice,
    });
  };

  // Product operations
  const addProduct = (productData: Omit<ProductInfo, 'id'>): ProductInfo => {
    const newProduct: ProductInfo = {
      ...productData,
      id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      inStock: productData.inStock !== false,
      stockCount: productData.stockCount ?? 20,
      price: productData.isFree ? 0 : productData.price,
      currency: productData.currency || 'USD',
    };
    setProducts((prev) => [newProduct, ...prev]);
    soundEngine.playChime();
    logMatrixEvent(
      'm.product.catalog.add',
      `/_matrix/client/v3/commerce/products/${newProduct.id}`,
      `Listed new catalogue product: "${newProduct.name}" (${newProduct.isFree ? 'FREE' : `${newProduct.currency} ${newProduct.price}`})`
    );
    return newProduct;
  };

  // Share product in chat
  const shareProductInChat = (product: ProductInfo) => {
    sendMessage({
      text: `🛍️ Product: ${product.name} - ${product.isFree ? 'FREE' : `${product.currency} ${product.price}`}`,
      type: 'product_card',
      productInfo: product,
    });
  };

  const shareProductToRooms = (product: ProductInfo, roomIds: string[]) => {
    const priceTag = product.isFree ? 'FREE' : `${product.currency} ${product.price}`;
    roomIds.forEach((rId) => {
      const newMsg: Message = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        roomId: rId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        text: `🛍️ Product: ${product.name} - ${priceTag}`,
        timestamp: Date.now(),
        status: 'delivered',
        type: 'product_card',
        productInfo: product,
        reactions: {},
      };
      setMessagesByRoom((prev) => ({
        ...prev,
        [rId]: [...(prev[rId] || []), newMsg],
      }));
    });
    soundEngine.playMessageSent();
  };

  const shareProductToStatus = (product: ProductInfo) => {
    const priceTag = product.isFree ? 'FREE' : `${product.currency} ${product.price}`;
    addStory({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: 'image',
      contentUrl: product.image,
      caption: `🛍️ ${product.name} (${priceTag})\n${product.description}`,
    });
    soundEngine.playChime();
  };

  // AI Helpers
  const summarizeCurrentRoom = async (): Promise<string> => {
    if (!activeRoom) return 'No active room.';
    const roomMsgs = messages.slice(-20);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: activeRoom.name,
          messages: roomMsgs,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      return data.summary || 'Summary unavailable.';
    } catch (e) {
      const senders = Array.from(new Set(roomMsgs.map((m) => m.senderName || 'Member')));
      return `### 📋 Summary for ${activeRoom.name}\n\n1. **Executive Summary**\nRecent coordination among ${senders.join(', ')}.\n\n2. **Takeaways**\n• Active conversation and real-time synchronization.\n\n3. **Status**\n• Channel members connected.`;
    }
  };

  const generateSmartReplies = async (lastMsg: string): Promise<string[]> => {
    try {
      const res = await fetch('/api/ai/smart-replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastMessage: lastMsg }),
      });
      const data = await res.json();
      return data.suggestions || ['Sounds great!', 'Received 👍', 'Will check shortly'];
    } catch (e) {
      return ['Sounds good!', 'Understood 👍', 'Let me review'];
    }
  };

  const rewriteText = async (text: string, tone: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone }),
      });
      const data = await res.json();
      return data.rewrittenText || text;
    } catch (e) {
      return text;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUserById,
        rooms,
        activeRoomId,
        activeRoom,
        setActiveRoomId,
        createRoom,
        togglePinRoom,
        toggleMuteRoom,
        toggleArchiveRoom,
        archiveRoom,
        unarchiveRoom,
        updateDisappearingTimer,
        messages,
        allMessages: messagesByRoom,
        sendMessage,
        toggleReaction,
        toggleStar,
        togglePinMessage,
        editMessage,
        deleteMessage,
        translateMessage,
        transcribeMessage,
        payInvoice,
        activeCall,
        setActiveCall,
        startCall,
        startJitsiConference,
        endCall,
        toggleMute,
        toggleCamera,
        toggleSpeaker,
        addCallParticipant,
        toggleScreenShare,
        toggleCallTileView,
        toggleCallLowBandwidth,
        toggleMobileLayout,
        setConferenceMode,
        setCallE2EEKey,
        setCallPassword,
        stories,
        communities,
        addStory,
        markStoryViewed,
        products,
        setProducts,
        addProduct,
        createInvoiceInChat,
        shareProductInChat,
        shareProductToRooms,
        shareProductToStatus,
        matrixLogs,
        logMatrixEvent,
        activeTab,
        setActiveTab,
        businessMode,
        setBusinessMode,
        toggleBusinessMode,
        theme,
        isDarkMode,
        setTheme,
        toggleTheme,
        walletBalance,
        setWalletBalance,
        walletCurrency,
        setWalletCurrency,
        walletBalances,
        setWalletBalances,
        walletTransactions,
        sendMoney,
        requestMoney,
        exchangeCurrency,
        liveRates,
        isExchangeModalOpen,
        setIsExchangeModalOpen,
        openExchangeModal,
        exchangeInitialCurrencies,
        discoverItems,
        savedDiscoverIds,
        toggleSaveDiscoverItem,
        priorityUrgent,
        priorityMeetings,
        priorityPayments,
        priorityAIBrief,
        dismissPriorityUrgent,
        dismissUrgentItem,
        dismissPriorityPayment,
        settlePriorityPayment,
        isUniversalSearchOpen,
        setIsUniversalSearchOpen,
        isCommandCenterOpen,
        setIsCommandCenterOpen,
        isBlueprintOpen,
        setIsBlueprintOpen,
        isE2EEOpen,
        setIsE2EEOpen,
        isUVSModalOpen,
        setIsUVSModalOpen,
        isBusinessSuiteOpen,
        setIsBusinessSuiteOpen,
        isBusinessSettingsOpen,
        setIsBusinessSettingsOpen,
        businessSettingsSection,
        setBusinessSettingsSection,
        openBusinessSettings,
        isSettingsOpen,
        setIsSettingsOpen,
        isUserSwitcherOpen,
        setIsUserSwitcherOpen,
        isNewChatModalOpen,
        setIsNewChatModalOpen,
        isStarredDrawerOpen,
        setIsStarredDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        isStoryViewerOpen,
        setIsStoryViewerOpen,
        selectedStoryIndex,
        setSelectedStoryIndex,
        isJitsiDevOpsOpen,
        setIsJitsiDevOpsOpen,
        jitsiServerConfig,
        setJitsiServerConfig,
        isOnboardingOpen,
        setIsOnboardingOpen,
        completeOnboarding,
        authStatus,
        setAuthStatus,
        mfaStatus,
        setMfaStatus,
        onboardingStatus,
        setOnboardingStatus,
        onboardingStep,
        setOnboardingStep,
        isLogoutConfirmOpen,
        setIsLogoutConfirmOpen,
        signUp,
        signIn,
        verifyLoginMfa,
        activateMfa,
        skipMfa,
        saveOnboardingStep,
        finishOnboarding,
        logout,
        startAuthExperience,
        viewingUserProfile,
        setViewingUserProfile,
        isEditProfileOpen,
        setIsEditProfileOpen,
        openUserProfile,
        updateUserProfile,
        summarizeCurrentRoom,
        generateSmartReplies,
        rewriteText,
        typingUsers,
        sendTypingNotification,
        simulatePeerTyping,
        markRoomAsRead,
        networkMode,
        setNetworkMode,
        isOnline,
        outboxQueue,
        flushOutboxQueue,
        retryMessage,
        isKeyboardShortcutsOpen,
        setIsKeyboardShortcutsOpen,
        toggleKeyboardShortcuts,
        clearAllAppData,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutItems,
        setCheckoutItems,
        openCheckout,
        openProductCheckout,
        openInvoiceCheckout,
        isPaymentSuccessOpen,
        setIsPaymentSuccessOpen,
        latestOrder,
        setLatestOrder,
        latestEmailNotification,
        setLatestEmailNotification,
        isPaymentDeclinedOpen,
        setIsPaymentDeclinedOpen,
        declineErrorMessage,
        setDeclineErrorMessage,
        declineOrderId,
        isEmailViewerOpen,
        setIsEmailViewerOpen,
        viewingEmailNotification,
        openEmailViewer,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
