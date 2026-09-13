import {
  DiscoverItem,
  PriorityAIBrief,
  PriorityMeetingItem,
  PriorityPaymentItem,
  PriorityUrgentItem,
  WalletTransaction,
} from '../types';

/** Production clients start with no pre-populated financial, discovery, or AI data. */
export const INITIAL_DISCOVER_ITEMS: DiscoverItem[] = [];
export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [];
export const INITIAL_PRIORITY_URGENT: PriorityUrgentItem[] = [];
export const INITIAL_PRIORITY_MEETINGS: PriorityMeetingItem[] = [];
export const INITIAL_PRIORITY_PAYMENTS: PriorityPaymentItem[] = [];
export const INITIAL_AI_BRIEF: PriorityAIBrief = {
  summary: '',
  bulletPoints: [],
  keyActions: [],
};
