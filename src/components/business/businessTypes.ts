import { SettingsSectionId } from './BusinessSettingsModal';

export interface BusinessActivity {
  id: string;
  type: 'payment_received' | 'invoice_paid' | 'new_customer' | 'product_listed' | 'order_dispatched';
  title: string;
  subtitle: string;
  amount?: string;
  status: 'Settled' | 'Completed' | 'Active' | 'Dispatched' | 'Pending';
  statusColor: 'emerald' | 'blue' | 'purple' | 'amber';
  timestamp: string;
  customerName?: string;
  customerAvatar?: string;
  referenceId?: string;
  paymentMethod?: string;
  items?: string;
}

export interface BusinessCustomer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  location: string;
  tier: 'VIP' | 'Regular' | 'Wholesale' | 'New';
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  preferredPayment: string;
}

export interface BusinessEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendeesCount: number;
  image: string;
  category: 'Summit' | 'Workshop' | 'Trade Expo' | 'Networking';
  price: string;
  description: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  seller: string;
  sellerAvatar: string;
  location: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  verified: boolean;
  minOrder: string;
  rating: number;
}

export interface BusinessNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'payment' | 'order' | 'inventory' | 'customer' | 'system';
  unread: boolean;
  actionUrl?: string;
}
