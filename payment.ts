export type PaymentMethodType =
  | 'card'
  | 'google_pay'
  | 'apple_pay'
  | 'eft'
  | 'stripe'
  | 'momo'
  | 'mpesa';

export type PaymentStatus =
  | 'checkout_created'
  | 'payment_pending'
  | 'payment_processing'
  | 'payment_successful'
  | 'payment_failed'
  | 'payment_declined'
  | 'payment_cancelled'
  | 'payment_expired'
  | 'payment_refunded'
  | 'payment_requires_action';

export interface SavedPaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_account';
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic';
  last4: string;
  expMonth: number;
  expYear: number;
  cardholderName: string;
  isDefault: boolean;
  createdAt: number;
  token: string;
  bankName?: string;
  accountNumberLast4?: string;
}

export interface Voucher {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  description: string;
  expiresAt?: number;
  isActive: boolean;
}

export interface CheckoutCustomerInfo {
  name: string;
  email: string;
  phone: string;
  shippingAddress: string;
  billingAddress?: string;
  city: string;
  postalCode?: string;
  country: string;
}

export interface CheckoutItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  sellerId?: string;
  sellerName?: string;
  selectedVariant?: string;
  category?: string;
  description?: string;
}

export interface CheckoutSession {
  sessionId: string;
  orderId?: string;
  items: CheckoutItem[];
  subtotal: number;
  discount: number;
  appliedVoucher?: Voucher;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  status: PaymentStatus;
  currentStep?: 'shipping' | 'payment' | 'review';
  customer: CheckoutCustomerInfo;
  originatingContext?: {
    productId?: string;
    sellerId?: string;
    sellerName?: string;
    returnTab?: string;
    returnRoomId?: string;
  };
  idempotencyKey: string;
  createdAt: number;
  lastActivityAt?: number;
  abandonedEmailSent?: boolean;
  abandonedEmailSentAt?: number;
}

export interface PaymentTransaction {
  transactionId: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodType;
  paymentMethodDetails: {
    brand?: string;
    last4?: string;
    walletType?: string;
    bankName?: string;
    reference?: string;
    cardholderName?: string;
  };
  status: PaymentStatus;
  timestamp: number;
  errorMessage?: string;
  declineCode?: string;
  idempotencyKey: string;
  receiptUrl?: string;
}

export interface Order {
  orderId: string;
  transactionId: string;
  items: CheckoutItem[];
  customer: CheckoutCustomerInfo;
  subtotal: number;
  discount: number;
  voucherCode?: string;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethodType;
  paymentMethodLabel: string;
  sellerName: string;
  createdAt: number;
  estimatedDelivery?: string;
}

export interface EmailNotification {
  id: string;
  to: string;
  subject: string;
  type: 'payment_success' | 'payment_declined' | 'order_confirmation' | 'abandoned_checkout';
  orderId: string;
  amount: number;
  currency: string;
  timestamp: number;
  html: string;
  status: 'delivered' | 'bounced' | 'opened';
  metadata?: {
    customerName?: string;
    productName?: string;
    paymentMethod?: string;
    transactionId?: string;
    sellerName?: string;
    reason?: string;
    recoveryUrl?: string;
    itemsCount?: number;
  };
}
