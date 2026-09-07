import {
  SavedPaymentMethod,
  Voucher,
  CheckoutSession,
  CheckoutItem,
  CheckoutCustomerInfo,
  PaymentTransaction,
  Order,
  EmailNotification,
  PaymentMethodType,
} from '../types/payment';

export interface ProcessPaymentPayload {
  sessionId?: string;
  paymentMethod: PaymentMethodType;
  paymentMethodDetails?: {
    brand?: string;
    last4?: string;
    walletType?: string;
    bankName?: string;
    reference?: string;
    cardholderName?: string;
    phone?: string;
  };
  idempotencyKey?: string;
  customer: CheckoutCustomerInfo;
  items: CheckoutItem[];
  subtotal: number;
  discount?: number;
  tax: number;
  shipping?: number;
  total: number;
  currency?: string;
  sellerName?: string;
  simulateDecline?: boolean;
  declineReason?: string;
}

export const paymentService = {
  // 1. Fetch saved payment methods
  async getPaymentMethods(userId = 'user_lusimadio'): Promise<SavedPaymentMethod[]> {
    try {
      const res = await fetch(`/api/payment-methods?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        return data.paymentMethods || [];
      }
    } catch (e) {
      console.warn('Backend payment method fetch fallback:', e);
    }
    // Fallback default stored methods
    return [
      {
        id: 'pm_card_4821',
        userId,
        type: 'card',
        brand: 'visa',
        last4: '4821',
        expMonth: 12,
        expYear: 2028,
        cardholderName: 'Lusimadio Nkem',
        isDefault: true,
        createdAt: Date.now() - 86400000 * 14,
        token: 'tok_visa_4821_secure_pci',
      },
      {
        id: 'pm_card_9012',
        userId,
        type: 'card',
        brand: 'mastercard',
        last4: '9012',
        expMonth: 8,
        expYear: 2029,
        cardholderName: 'Lusimadio Nkem',
        isDefault: false,
        createdAt: Date.now() - 86400000 * 5,
        token: 'tok_mc_9012_secure_pci',
      },
    ];
  },

  // 2. Add a new bank card
  async addCard(payload: {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    cvv: string;
    cardholderName: string;
    isDefault?: boolean;
    userId?: string;
  }): Promise<{ success: boolean; paymentMethod?: SavedPaymentMethod; error?: string }> {
    try {
      const res = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to save card' };
      }
      return { success: true, paymentMethod: data.paymentMethod };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error saving card' };
    }
  },

  // 3. Remove payment method
  async deletePaymentMethod(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/payment-methods/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // 4. Set as default card
  async setDefaultMethod(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/payment-methods/${id}/default`, { method: 'POST' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // 5. Validate voucher code server-side
  async validateVoucher(
    code: string,
    subtotal: number
  ): Promise<{ valid: boolean; voucher?: Voucher; discountAmount?: number; error?: string; message?: string }> {
    try {
      const res = await fetch('/api/checkout/validate-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { valid: false, error: data.error || 'Invalid voucher' };
      }
      return {
        valid: true,
        voucher: data.voucher,
        discountAmount: data.discountAmount,
        message: data.message,
      };
    } catch (e: any) {
      // Local fallback voucher engine if offline
      const upper = code.trim().toUpperCase();
      if (upper === 'WAT10') {
        const discountAmount = Math.round(subtotal * 0.1 * 100) / 100;
        return {
          valid: true,
          voucher: { code: 'WAT10', discountType: 'percentage', discountValue: 10, description: '10% off', isActive: true },
          discountAmount,
          message: 'Applied 10% WAT Community discount!',
        };
      } else if (upper === 'AFRICA20') {
        if (subtotal < 200) {
          return { valid: false, error: 'AFRICA20 requires min spend of R200 / $15' };
        }
        const discountAmount = Math.round(subtotal * 0.2 * 100) / 100;
        return {
          valid: true,
          voucher: { code: 'AFRICA20', discountType: 'percentage', discountValue: 20, description: '20% off', isActive: true },
          discountAmount,
          message: 'Applied 20% Pan-African discount!',
        };
      } else if (upper === 'LAUNCH50') {
        return {
          valid: true,
          voucher: { code: 'LAUNCH50', discountType: 'fixed', discountValue: 50, description: 'R50 Flat Discount', isActive: true },
          discountAmount: 50,
          message: 'Applied R50 / $50 Launch Discount!',
        };
      }
      return { valid: false, error: `Voucher code "${code}" is invalid or expired` };
    }
  },

  // 6. Create Checkout Session
  async createCheckoutSession(params: {
    items: CheckoutItem[];
    voucherCode?: string;
    customer?: CheckoutCustomerInfo;
    originatingContext?: any;
    currency?: string;
  }): Promise<CheckoutSession> {
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const data = await res.json();
        return data.session;
      }
    } catch (e) {
      console.warn('Create checkout session fallback:', e);
    }

    // Heuristic calculation fallback
    const subtotal = params.items.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const tax = Math.round(subtotal * 0.15 * 100) / 100;
    const shipping = subtotal > 500 ? 0 : 45;
    return {
      sessionId: `cs_${Date.now()}`,
      items: params.items,
      subtotal,
      discount: 0,
      tax,
      shipping,
      total: subtotal + tax + shipping,
      currency: params.currency || 'ZAR',
      status: 'checkout_created',
      customer: params.customer || {
        name: 'Lusimadio Nkem',
        email: 'lusimadio12@gmail.com',
        phone: '+27 78 492 0184',
        shippingAddress: '42 Decentralized Avenue, Sandton',
        city: 'Johannesburg',
        country: 'South Africa',
      },
      originatingContext: params.originatingContext,
      idempotencyKey: `idemp_${Date.now()}`,
      createdAt: Date.now(),
    };
  },

  // 7. Process & Settle Payment (Triggers server authorization and automated email)
  async processPayment(payload: ProcessPaymentPayload): Promise<{
    success: boolean;
    status: 'payment_successful' | 'payment_declined' | 'payment_failed';
    order?: Order;
    transaction?: PaymentTransaction;
    emailNotification?: EmailNotification;
    error?: string;
    orderId?: string;
    transactionId?: string;
  }> {
    try {
      const res = await fetch('/api/checkout/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 402 || !data.success) {
        return {
          success: false,
          status: 'payment_declined',
          error: data.error || 'Payment declined by issuing bank.',
          orderId: data.orderId,
          transactionId: data.transactionId,
          emailNotification: data.emailNotification,
        };
      }
      return {
        success: true,
        status: 'payment_successful',
        order: data.order,
        transaction: data.transaction,
        emailNotification: data.emailNotification,
      };
    } catch (e: any) {
      console.error('Process payment error:', e);
      return {
        success: false,
        status: 'payment_failed',
        error: 'Network connectivity timeout during payment settlement.',
      };
    }
  },

  // 8. Fetch Sent Email Notifications for User
  async getEmailNotifications(email = 'lusimadio12@gmail.com'): Promise<EmailNotification[]> {
    try {
      const res = await fetch(`/api/notifications/emails?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        return data.emails || [];
      }
    } catch (e) {
      console.warn('Email fetch error:', e);
    }
    return [];
  },

  // 9. Fetch Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        return data.orders || [];
      }
    } catch (e) {
      console.warn('Orders fetch error:', e);
    }
    return [];
  },

  // 10. Save / Update Checkout Session Progress
  async saveCheckoutSession(sessionData: {
    sessionId?: string;
    orderId?: string;
    customer: CheckoutCustomerInfo;
    items: CheckoutItem[];
    subtotal: number;
    discount?: number;
    tax: number;
    shipping?: number;
    total: number;
    currency?: string;
    currentStep?: 'shipping' | 'payment' | 'review';
    status?: 'pending' | 'completed' | 'abandoned';
  }): Promise<{ success: boolean; session?: CheckoutSession; error?: string }> {
    try {
      const res = await fetch('/api/checkout/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      const data = await res.json();
      return { success: res.ok, session: data.session, error: data.error };
    } catch (e: any) {
      console.warn('Save checkout session error:', e);
      return { success: false, error: e?.message };
    }
  },

  // 11. Fetch Checkout Sessions
  async getCheckoutSessions(): Promise<{
    sessions: CheckoutSession[];
    total: number;
    pending: number;
    abandoned: number;
    completed: number;
  }> {
    try {
      const res = await fetch('/api/checkout/sessions');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Fetch checkout sessions error:', e);
    }
    return { sessions: [], total: 0, pending: 0, abandoned: 0, completed: 0 };
  },

  // 12. Run Abandoned Checkout Job
  async runAbandonedCheckoutJob(): Promise<{ success: boolean; result?: any; message?: string }> {
    try {
      const res = await fetch('/api/checkout/abandoned/run-job', { method: 'POST' });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e?.message };
    }
  },

  // 13. Simulate 2.5-hour Abandoned Checkout & Trigger Recovery Email
  async simulateAbandonedCheckout(payload?: {
    customerName?: string;
    email?: string;
  }): Promise<{ success: boolean; session?: any; emailNotification?: EmailNotification; message?: string }> {
    try {
      const res = await fetch('/api/checkout/abandoned/simulate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload || {}),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e?.message };
    }
  },

  // 14. Get Abandoned Checkout Stats
  async getAbandonedCheckoutStats(): Promise<any> {
    try {
      const res = await fetch('/api/checkout/abandoned/stats');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Stats fetch error:', e);
    }
    return null;
  },

  // 15. Transfer Money via Matrix Handle or wat.chat link
  async transferViaMatrixHandle(payload: {
    senderHandle?: string;
    recipientHandle: string;
    amount: number;
    currency?: string;
    note?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    transaction?: any;
    recipient?: any;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/wallet/transfer-handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Transfer failed' };
      }
      return data;
    } catch (e: any) {
      return { success: false, error: e?.message || 'Transfer network error' };
    }
  },

  // 16. Resolve Matrix Handle or wat.chat link
  async resolveMatrixHandle(handle: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const res = await fetch(`/api/wallet/resolve-handle?handle=${encodeURIComponent(handle)}`);
      const data = await res.json();
      return data;
    } catch (e: any) {
      return { success: false, error: e?.message };
    }
  },
};
