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
import { authenticatedHeaders } from './supabaseAuth';

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
      const res = await fetch('/api/payment-methods', { headers: authenticatedHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.paymentMethods || [];
      }
    } catch (e) {
      console.warn('Unable to retrieve payment methods:', e);
    }
    return [];
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
        headers: authenticatedHeaders({ 'Content-Type': 'application/json' }),
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
      const res = await fetch(`/api/payment-methods/${id}`, { method: 'DELETE', headers: authenticatedHeaders() });
      return res.ok;
    } catch {
      return false;
    }
  },

  // 4. Set as default card
  async setDefaultMethod(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/payment-methods/${id}/default`, { method: 'POST', headers: authenticatedHeaders() });
      return res.ok;
    } catch {
      return false;
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
        headers: authenticatedHeaders({ 'Content-Type': 'application/json' }),
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
      return { valid: false, error: e?.message || 'Voucher validation is temporarily unavailable' };
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
        headers: authenticatedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const data = await res.json();
        return data.session;
      }
    } catch (e) {
      console.warn('Unable to create checkout session:', e);
    }
    throw new Error('Checkout is unavailable. Please try again later.');
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
        headers: authenticatedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 402) {
        return {
          success: false,
          status: 'payment_declined',
          error: data.error || 'Payment declined by issuing bank.',
          orderId: data.orderId,
          transactionId: data.transactionId,
          emailNotification: data.emailNotification,
        };
      }
      if (!res.ok || !data.success) {
        return {
          success: false,
          status: 'payment_failed',
          error: data.error || 'Payment processing failed. Please try again.',
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
        headers: authenticatedHeaders({ 'Content-Type': 'application/json' }),
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
      const res = await fetch('/api/checkout/abandoned/run-job', { method: 'POST', headers: authenticatedHeaders() });
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
        headers: authenticatedHeaders({ 'Content-Type': 'application/json' }),
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
        headers: authenticatedHeaders({ 'Content-Type': 'application/json' }),
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
