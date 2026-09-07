export interface SocialLink {
  platform: 'website' | 'twitter' | 'github' | 'linkedin' | 'instagram' | 'telegram' | 'youtube' | 'custom';
  url: string;
  label?: string;
}

export interface CareerItem {
  id?: string;
  role: string;
  company: string;
  period: string;
  description?: string;
}

export interface EducationItem {
  id?: string;
  degree: string;
  school: string;
  year: string;
  field?: string;
}

export type AuthStatus = 'UNAUTHENTICATED' | 'AUTHENTICATED';
export type MfaStatus = 'MFA_NOT_CONFIGURED' | 'MFA_ACTIVE' | 'MFA_SKIPPED';
export type OnboardingStatus = 'ONBOARDING_NOT_STARTED' | 'ONBOARDING_IN_PROGRESS' | 'ONBOARDING_COMPLETED';

export interface User {
  id: string;
  name: string;
  handle: string; // e.g. @amara:wat.chat
  avatar: string;
  statusMessage: string;
  headline?: string;
  bio?: string;
  position?: string;
  company?: string;
  industry?: string;
  website?: string;
  socialLinks?: SocialLink[];
  careerHistory?: CareerItem[];
  education?: EducationItem[];
  isOnline: boolean;
  lastSeen?: string;
  phone?: string;
  email?: string;
  location?: string;
  dob?: string;
  country?: string;
  joinedDate?: string;
  isBusiness?: boolean;
  businessDetails?: {
    category?: string;
    description?: string;
    hours?: string;
  };
  verified?: boolean;
  deviceId: string;
  e2eeFingerprint: string;
  isBot?: boolean;
  customStatus?: string;
  // Privacy visibility settings
  isPhonePublic?: boolean;
  isEmailPublic?: boolean;
  isLocationPublic?: boolean;
  isEducationPublic?: boolean;
  isCareerPublic?: boolean;
  // Security & Account metadata (private)
  mfaStatus?: MfaStatus;
  mfaMethod?: 'authenticator' | 'sms';
  onboardingStatus?: OnboardingStatus;
  passwordHash?: string;
}

export type RoomType = 'direct' | 'group' | 'channel' | 'community';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  avatar: string;
  topic?: string;
  isEncrypted: boolean;
  e2eeSessionId?: string;
  memberIds: string[];
  unreadCount: number;
  lastMessage?: Message;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  disappearingTimer: number; // in seconds, 0 = off
  createdAt: number;
  businessInfo?: {
    category: string;
    catalogSize: number;
    autoReplyEnabled: boolean;
    autoReplyMessage?: string;
  };
  tags?: string[];
}

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'file'
  | 'location'
  | 'contact'
  | 'invoice'
  | 'payment'
  | 'system'
  | 'product_card';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type NetworkMode = 'online' | 'slow-3g' | 'offline';

export interface QueuedMessage {
  id: string;
  roomId: string;
  params: {
    text: string;
    type?: MessageType;
    mediaUrl?: string;
    mediaInfo?: any;
    locationInfo?: LocationInfo;
    invoiceInfo?: InvoiceInfo;
    productInfo?: ProductInfo;
    contactInfo?: any;
    replyTo?: Message;
  };
  timestamp: number;
  retryCount: number;
  error?: string;
}

export interface MediaInfo {
  fileName?: string;
  fileSize?: string;
  duration?: number; // for audio / video in seconds
  waveform?: number[]; // normalized 0..1 heights for voice notes
  mimeType?: string;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
}

export interface InvoiceInfo {
  invoiceId: string;
  amount: number;
  currency: 'KES' | 'NGN' | 'GHS' | 'ZAR' | 'USD' | 'EUR';
  description: string;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: number;
  paymentMethod?: 'M-Pesa' | 'MTN MoMo' | 'Airtel Money' | 'Card' | 'Crypto (USDC)';
}

export interface ContactInfo {
  name: string;
  phone: string;
  handle: string;
  avatar: string;
  org?: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  inStock: boolean;
  category: string;
  stockCount?: number;
  isFree?: boolean;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  status: MessageStatus;
  type: MessageType;
  mediaUrl?: string;
  mediaInfo?: MediaInfo;
  locationInfo?: LocationInfo;
  invoiceInfo?: InvoiceInfo;
  contactInfo?: ContactInfo;
  productInfo?: ProductInfo;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
    type: MessageType;
  };
  reactions: Record<string, MessageReaction>;
  isEdited?: boolean;
  editedAt?: number;
  editHistory?: { text: string; timestamp: number }[];
  isStarred?: boolean;
  isPinned?: boolean;
  isEncrypted?: boolean;
  e2eeAlgorithm?: string;
  expiresAt?: number; // for disappearing messages
  translatedText?: string;
  translatedLang?: string;
  transcription?: string;
}

export interface StoryStatus {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'image' | 'text';
  contentUrl?: string;
  text?: string;
  caption?: string;
  bgColor?: string;
  timestamp: number;
  viewed: boolean;
  viewsCount: number;
}

export interface CommunitySpace {
  id: string;
  name: string;
  description: string;
  avatar: string;
  banner: string;
  membersCount: number;
  isPublic: boolean;
  category: string;
  verified?: boolean;
  channels: {
    id: string;
    name: string;
    topic: string;
    unreadCount: number;
    isLocked?: boolean;
  }[];
}

export interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  isSpeaking: boolean;
  isMuted: boolean;
  hasVideo: boolean;
}

export interface ActiveCall {
  id: string;
  roomId: string;
  roomName: string;
  roomAvatar: string;
  type: 'voice' | 'video';
  status: 'connecting' | 'ringing' | 'connected' | 'ended';
  startTime?: number;
  duration: number;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isSpeakerOn: boolean;
  isE2EEEnabled?: boolean;
  e2eeKey?: string;
  roomPassword?: string;
  jitsiDomain?: string;
  jitsiRoomName?: string;
  conferenceMode?: 'jitsi_iframe' | 'interactive_mesh';
  isTileView?: boolean;
  isLowBandwidth?: boolean;
  isMobileLayout?: boolean;
  participants: CallParticipant[];
}

export interface MatrixEventLog {
  id: string;
  timestamp: number;
  type: string; // e.g. "m.room.message", "m.receipt", "m.presence", "m.megolm.v1.aes-sha2"
  endpoint: string; // e.g. "/_matrix/client/v3/rooms/!abc/send/m.room.message/123"
  status: number;
  direction: 'inbound' | 'outbound';
  payloadSummary: string;
}

// Matrix Emojibase Bindings Types (matrix-org/emojibase-bindings)
export type EmojiCategory =
  | 'smileys_emotion'
  | 'people_body'
  | 'animals_nature'
  | 'food_drink'
  | 'activities_travel'
  | 'objects_symbols'
  | 'flags'
  | 'matrix_custom';

export type EmojiSkinTone = 'default' | 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';

export interface EmojibaseItem {
  hexcode: string;
  emoji: string;
  label: string;
  shortcodes: string[];
  category: EmojiCategory;
  tags: string[];
  skins?: {
    tone: EmojiSkinTone;
    emoji: string;
    hexcode: string;
  }[];
  isCustomMatrix?: boolean;
  customPack?: string;
}

// Matrix User Verification Service (UVS) Types (matrix-org/matrix-user-verification-service)
export type UserTrustLevel = 'trusted' | 'verified_cross_signing' | 'uvs_openid_verified' | 'unverified' | 'blocked';

export interface OpenIDToken {
  accessToken: string;
  tokenType: 'Bearer';
  matrixServerName: string;
  expiresIn: number;
  userId: string;
  issuedAt: number;
}

export interface UVSVerificationResult {
  userId: string;
  homeserver: string;
  isValid: boolean;
  trustScore: number; // 0 - 100
  crossSigningStatus: {
    masterKeyVerified: boolean;
    selfSigningKeyVerified: boolean;
    userSigningKeyVerified: boolean;
    masterKeyId: string;
    verifiedDevicesCount: number;
  };
  openIDValidation: {
    verifiedByUVS: boolean;
    uvsEndpoint: string;
    tokenExpiry: number;
  };
  roomPermissions?: {
    roomId: string;
    powerLevel: number; // 0, 50, 100
    isAllowedToJoinConference: boolean;
    isModerator: boolean;
  };
}

// Matrix Conference & Ecosystem Types (matrix-org/matrix-conf-website)
export interface ConferenceSpeaker {
  id: string;
  name: string;
  role: string;
  org: string;
  avatar: string;
  matrixId: string;
  bio: string;
}

export interface ConferenceSession {
  id: string;
  title: string;
  track: 'Matrix 2.0 & Core' | 'Decentralized RTC & Calling' | 'Crypto & Vodozemac' | 'User Verification & Trust' | 'Mobile Commerce & Bots';
  speakers: ConferenceSpeaker[];
  startTime: string;
  durationMinutes: number;
  abstract: string;
  roomAlias: string;
  isLiveNow?: boolean;
  recordingUrl?: string;
  slidesUrl?: string;
  tags: string[];
}

// Jitsi Meet DevOps Guide & Self-Hosting Types (jitsi.github.io/handbook/docs/devops-guide/)
export interface JitsiServerConfig {
  serverDomain: string; // e.g. "meet.wat.chat", "meet.jit.si", or custom FQDN
  publicHttpPort: number;
  publicHttpsPort: number;
  jvbPort: number; // default 10000 UDP
  enableAuth: boolean; // JWT or internal Prosody auth
  authType: 'jwt' | 'internal' | 'ldap';
  jwtAppId: string;
  jwtAppSecret: string;
  enableGuests: boolean;
  enableLetsEncrypt: boolean;
  letsEncryptEmail: string;
  enableJibri: boolean; // Recording & live streaming
  enableJigasi: boolean; // SIP & telephony gateway
  enableCoturn: boolean; // STUN/TURN media relay
  enableOcto: boolean; // Geo-distributed multi-JVB routing
  configDirectory: string; // e.g. ~/.jitsi-meet-cfg
  isCustomServer: boolean;
}

export interface JitsiComponentStatus {
  name: string;
  code: 'web' | 'prosody' | 'jicofo' | 'jvb' | 'jibri' | 'jigasi' | 'coturn';
  role: string;
  port: string;
  protocol: string;
  status: 'healthy' | 'active' | 'warning' | 'standby';
  description: string;
}

// WAT Fintech Wallet Types
export type WalletCurrency = 'ZAR' | 'USD' | 'EUR' | 'GBP' | 'NGN' | 'KES' | 'GHS' | 'EGP' | 'XOF' | 'WAT';

export interface WalletTransaction {
  id: string;
  type: 'incoming' | 'outgoing' | 'payment_request' | 'invoice_settlement';
  amount: number;
  currency: WalletCurrency;
  counterpartyName: string;
  counterpartyHandle?: string;
  counterpartyLink?: string;
  counterpartyAvatar?: string;
  category: 'Business' | 'Transfer' | 'Services' | 'Marketplace' | 'AI Assistant' | 'Invoice';
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  note?: string;
  referenceId?: string;
}

// WAT Discover Layer Types
export type DiscoverCategory =
  | 'trending'
  | 'businesses'
  | 'services'
  | 'products'
  | 'communities'
  | 'events'
  | 'channels'
  | 'nearby';

export interface DiscoverItem {
  id: string;
  title: string;
  subtitle: string;
  category: DiscoverCategory;
  image: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  distanceKm?: number;
  priceTag?: string;
  verified?: boolean;
  tags: string[];
  actionLabel: string;
  authorName?: string;
  authorHandle?: string;
  authorAvatar?: string;
  membersCount?: number;
  eventDate?: string;
  description?: string;
}

// Priority Hub & AI Brief Types
export interface PriorityUrgentItem {
  id: string;
  roomId: string;
  senderName: string;
  senderAvatar: string;
  previewText: string;
  timeAgo: string;
  priorityTag: 'High Priority' | 'Client Proposal' | 'Overdue Action';
}

export interface PriorityMeetingItem {
  id: string;
  title: string;
  time: string;
  roomId: string;
  participants: { name: string; avatar: string }[];
  type: 'voice' | 'video';
}

export interface PriorityPaymentItem {
  id: string;
  amount: number;
  currency: WalletCurrency;
  counterpartyName: string;
  dueDate: string;
  invoiceId: string;
  description: string;
}

export interface PriorityAIBrief {
  summary: string;
  bulletPoints: string[];
  keyActions: string[];
}

// Re-export all centralized payment types
export * from './types/payment';



