import { Request, Response, Router } from 'express';

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

export interface CheckoutSession {
  sessionId: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    shippingAddress?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  items: any[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  currentStep?: 'shipping' | 'payment' | 'review';
  status: 'pending' | 'completed' | 'abandoned';
  createdAt: number;
  lastActivityAt: number;
  abandonedEmailSent?: boolean;
  abandonedEmailSentAt?: number;
  recoveryUrl?: string;
}

// In-Memory persistent stores
const savedPaymentMethods: SavedPaymentMethod[] = [
  {
    id: 'pm_card_4821',
    userId: 'user_lusimadio',
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
    userId: 'user_lusimadio',
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

const availableVouchers: Record<string, Voucher> = {
  WAT10: {
    code: 'WAT10',
    discountType: 'percentage',
    discountValue: 10,
    description: '10% off your entire WAT purchase',
    isActive: true,
  },
  AFRICA20: {
    code: 'AFRICA20',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 200,
    description: '20% off orders over R200 / $15',
    isActive: true,
  },
  LAUNCH50: {
    code: 'LAUNCH50',
    discountType: 'fixed',
    discountValue: 50,
    minSpend: 150,
    description: 'R50 / $50 Flat Discount on launch items',
    isActive: true,
  },
  MATRIX: {
    code: 'MATRIX',
    discountType: 'percentage',
    discountValue: 15,
    description: '15% Synapse Protocol Special Discount',
    isActive: true,
  },
  VIP100: {
    code: 'VIP100',
    discountType: 'fixed',
    discountValue: 100,
    minSpend: 500,
    description: 'R100 Off for VIP Orders over R500',
    isActive: true,
  },
  RECOVER10: {
    code: 'RECOVER10',
    discountType: 'percentage',
    discountValue: 10,
    description: '10% Cart Recovery Incentive Discount',
    isActive: true,
  },
};

const ordersStore: any[] = [];
const transactionsStore: any[] = [];
const emailNotificationsStore: EmailNotification[] = [];
const processedIdempotencyKeys = new Set<string>();

// Checkout Sessions Store (tracks pending sessions for abandoned checkout job)
const checkoutSessionsStore: CheckoutSession[] = [
  {
    sessionId: 'cs_seed_abandoned_01',
    orderId: 'WAT-ORD-882190',
    customer: {
      name: 'Lusimadio Nkem',
      email: 'lusimadio12@gmail.com',
      phone: '+27 78 492 0184',
      shippingAddress: '42 Decentralized Avenue, Sandton',
      city: 'Johannesburg',
      country: 'South Africa',
      postalCode: '2196',
    },
    items: [
      {
        id: 'item_nordic_01',
        productId: 'prod_mesh_router_01',
        name: 'WAT Sovereign Node (Hardware Matrix SFU Gateway)',
        price: 349.00,
        currency: 'ZAR',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80',
        sellerName: 'WAT Labs Official',
      },
    ],
    subtotal: 349.00,
    discount: 0,
    tax: 52.35,
    shipping: 0,
    total: 401.35,
    currency: 'ZAR',
    currentStep: 'payment',
    status: 'pending',
    createdAt: Date.now() - 2.5 * 60 * 60 * 1000, // 2.5 hours ago (> 2 hours!)
    lastActivityAt: Date.now() - 2.5 * 60 * 60 * 1000, // 2.5 hours ago
    abandonedEmailSent: false,
    recoveryUrl: 'https://wat.chat/checkout?session=cs_seed_abandoned_01&recover=true&coupon=RECOVER10',
  },
];

let lastAbandonedJobRunTime = 0;

// Generate Email HTML
function generateSuccessEmailHtml(params: {
  customerName: string;
  orderId: string;
  transactionId: string;
  items: any[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  paymentMethod: string;
  sellerName: string;
  date: string;
}): string {
  const itemsRows = params.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px 0; font-size: 14px; color: #1e293b; font-weight: 500;">
        ${item.name} ${item.quantity > 1 ? `<span style="color: #64748b; font-size: 12px;">(x${item.quantity})</span>` : ''}
        ${item.selectedVariant ? `<div style="font-size: 11px; color: #64748b;">Variant: ${item.selectedVariant}</div>` : ''}
      </td>
      <td style="padding: 12px 0; text-align: right; font-size: 14px; color: #1e293b; font-weight: 600;">
        ${params.currency} ${(item.price * (item.quantity || 1)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - WAT</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px 40px; text-align: center; color: #ffffff;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 50%; margin-bottom: 12px;">
                <span style="font-size: 28px;">✓</span>
              </div>
              <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Payment Confirmed</h1>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Order #${params.orderId} • WAT Official Receipt</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
                Hello <strong>${params.customerName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                Thank you for your purchase on WAT. Your payment was successfully authorized and verified by our secure payment gateway. Your order is now confirmed with <strong>${params.sellerName}</strong>.
              </p>

              <!-- Payment Summary Box -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 28px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Transaction Reference</td>
                    <td style="text-align: right; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Payment Method</td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; font-weight: 600; color: #0f172a; padding-top: 4px;">${params.transactionId}</td>
                    <td style="text-align: right; font-size: 14px; font-weight: 600; color: #0f172a; padding-top: 4px;">${params.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; padding-top: 14px;">Date & Time</td>
                    <td style="text-align: right; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; padding-top: 14px;">Status</td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; font-weight: 600; color: #0f172a; padding-top: 4px;">${params.date}</td>
                    <td style="text-align: right; font-size: 14px; font-weight: 600; color: #059669; padding-top: 4px;">● Paid / Verified</td>
                  </tr>
                </table>
              </div>

              <!-- Items Breakdown -->
              <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Order Details</h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                ${itemsRows}
              </table>

              <!-- Totals Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 2px solid #e2e8f0; padding-top: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #64748b;">Subtotal</td>
                  <td style="padding: 4px 0; text-align: right; font-size: 14px; color: #334155;">${params.currency} ${params.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                ${
                  params.discount > 0
                    ? `
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #059669;">Voucher Discount</td>
                  <td style="padding: 4px 0; text-align: right; font-size: 14px; color: #059669; font-weight: 600;">-${params.currency} ${params.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #64748b;">VAT / Taxes (15%)</td>
                  <td style="padding: 4px 0; text-align: right; font-size: 14px; color: #334155;">${params.currency} ${params.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #64748b;">Shipping / Delivery</td>
                  <td style="padding: 4px 0; text-align: right; font-size: 14px; color: #334155;">${params.shipping === 0 ? 'FREE' : `${params.currency} ${params.shipping.toFixed(2)}`}</td>
                </tr>
                <tr style="border-top: 1px solid #cbd5e1;">
                  <td style="padding: 12px 0 0 0; font-size: 17px; font-weight: 800; color: #0f172a;">Total Paid</td>
                  <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: 800; color: #059669;">${params.currency} ${params.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://wat.chat/orders/${params.orderId}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 14px 28px; border-radius: 10px;">View Order in WAT App</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;"><strong>WAT Decentralized Commerce & Matrix Communications</strong></p>
              <p style="margin: 0 0 8px 0;">256-bit Encrypted Transaction • Zero-raw-card credential storage • PCI-DSS Certified</p>
              <p style="margin: 0;">Questions? Reach out to support@wat.chat or message @support:wat.chat</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function generateDeclinedEmailHtml(params: {
  customerName: string;
  orderId: string;
  attemptedAmount: number;
  currency: string;
  paymentMethod: string;
  reason: string;
  date: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Declined - WAT</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #fee2e2;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px 40px; text-align: center; color: #ffffff;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 50%; margin-bottom: 12px;">
                <span style="font-size: 28px;">✕</span>
              </div>
              <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Payment Unsuccessful</h1>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Order Attempt #${params.orderId}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
                Hello <strong>${params.customerName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                We were unable to complete your payment of <strong>${params.currency} ${params.attemptedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> via <strong>${params.paymentMethod}</strong> on ${params.date}.
              </p>

              <!-- Reason Box -->
              <div style="background-color: #fef2f2; border-radius: 12px; padding: 18px 20px; border: 1px solid #fecaca; margin-bottom: 28px;">
                <div style="font-size: 12px; font-weight: 700; color: #991b1b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Declined Reason</div>
                <div style="font-size: 14px; color: #b91c1c; font-weight: 500;">${params.reason}</div>
              </div>

              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                Don't worry, your cart and reserved items have been saved. You can complete your order using another card, Apple Pay, Google Pay, or Instant EFT.
              </p>

              <!-- Action Buttons -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://wat.chat/checkout?order=${params.orderId}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 14px 28px; border-radius: 10px;">Retry Payment with Different Method</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;"><strong>WAT Decentralized Commerce & Security</strong></p>
              <p style="margin: 0;">For assistance, please contact your issuing bank or email us at support@wat.chat</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Generate Abandoned Checkout Recovery Email HTML (Triggered if pending > 2 hours)
function generateAbandonedCheckoutEmailHtml(params: {
  customerName: string;
  orderId: string;
  items: any[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  recoveryUrl: string;
  date: string;
}): string {
  const itemsRows = (params.items || [])
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 14px 0; font-size: 14px; color: #1e293b; font-weight: 500;">
        <div style="font-weight: 600; color: #0f172a;">${item.name || 'WAT Product'}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
          Qty: ${item.quantity || 1} ${item.selectedVariant ? `• Variant: ${item.selectedVariant}` : ''}
        </div>
      </td>
      <td style="padding: 14px 0; text-align: right; font-size: 14px; color: #0f172a; font-weight: 700;">
        ${params.currency} ${((item.price || 0) * (item.quantity || 1)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Order - WAT</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 36px 40px; text-align: center; color: #ffffff;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 16px; margin-bottom: 14px; border: 1px solid rgba(255,255,255,0.15);">
                <span style="font-size: 28px;">🛒</span>
              </div>
              <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Did you forget something?</h1>
              <p style="margin: 0; font-size: 14px; color: #94a3b8;">Order #${params.orderId} is reserved in your WAT vault</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a;">
                Hi <strong>${params.customerName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                We noticed you recently started checking out on <strong>WAT</strong> but didn't finish your purchase on ${params.date}. Your items have been safely reserved so you can pick right up where you left off.
              </p>

              <!-- Special Recovery Incentive Voucher -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-radius: 14px; padding: 20px; border: 1px solid #bbf7d0; margin-bottom: 28px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <div style="font-size: 11px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">Exclusive Cart Recovery Gift</div>
                    <div style="font-size: 15px; font-weight: 700; color: #14532d;">Take an extra 10% off your reserved order</div>
                    <div style="font-size: 12px; color: #166534; margin-top: 2px;">Use coupon code at checkout: <strong>RECOVER10</strong></div>
                  </div>
                  <div style="background-color: #15803d; color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 800; font-family: monospace; letter-spacing: 1px;">
                    RECOVER10
                  </div>
                </div>
              </div>

              <!-- Cart Review Section -->
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 12px;">
                Your Reserved Items
              </div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                ${itemsRows}
              </table>

              <!-- Order Summary Breakdown -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 18px 20px; border: 1px solid #e2e8f0; margin-bottom: 28px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 4px 0; font-size: 13px; color: #64748b;">Subtotal</td>
                    <td style="padding: 4px 0; font-size: 13px; color: #0f172a; text-align: right; font-weight: 600;">
                      ${params.currency} ${params.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  ${params.discount > 0 ? `
                  <tr>
                    <td style="padding: 4px 0; font-size: 13px; color: #15803d;">Discounts Applied</td>
                    <td style="padding: 4px 0; font-size: 13px; color: #15803d; text-align: right; font-weight: 600;">
                      -${params.currency} ${params.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 4px 0; font-size: 13px; color: #64748b;">Estimated Tax & Logistics</td>
                    <td style="padding: 4px 0; font-size: 13px; color: #0f172a; text-align: right; font-weight: 600;">
                      ${params.currency} ${(params.tax + params.shipping).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr style="border-top: 1px solid #e2e8f0;">
                    <td style="padding: 10px 0 0 0; font-size: 16px; font-weight: 800; color: #0f172a;">Order Total</td>
                    <td style="padding: 10px 0 0 0; font-size: 18px; font-weight: 800; color: #059669; text-align: right;">
                      ${params.currency} ${params.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Complete Order CTA -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${params.recoveryUrl}" style="display: block; background: #000000; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 16px 32px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                      Complete My Order Now &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Trust & Security Reassurance -->
              <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #334155;">
                  🔒 100% Secure Checkout with 256-bit Encryption
                </p>
                <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                  Supported: Visa, Mastercard, Google Pay, Apple Pay, Instant EFT, MTN MoMo, M-Pesa.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;"><strong>WAT Sovereign Commerce & Matrix Payments</strong></p>
              <p style="margin: 0 0 4px 0;">Automated abandoned checkout notification from the WAT background scheduler</p>
              <p style="margin: 0;">If you did not initiate this checkout, you can safely ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// -----------------------------------------------------------------------------
// Backend Job System: Abandoned Checkout Evaluator (2-Hour Threshold)
// -----------------------------------------------------------------------------
export function runAbandonedCheckoutJob(): { checkedCount: number; emailsDispatched: number } {
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours
  const now = Date.now();
  let dispatched = 0;

  checkoutSessionsStore.forEach((session) => {
    // Check if session is pending, email has not been sent, customer email exists,
    // and inactive for >= 2 hours
    const isOverdue = now - session.lastActivityAt >= TWO_HOURS_MS;
    if (
      session.status === 'pending' &&
      !session.abandonedEmailSent &&
      session.customer?.email &&
      isOverdue
    ) {
      const emailHtml = generateAbandonedCheckoutEmailHtml({
        customerName: session.customer.name || 'Valued Customer',
        orderId: session.orderId,
        items: session.items || [],
        subtotal: session.subtotal || session.total,
        discount: session.discount || 0,
        tax: session.tax || 0,
        shipping: session.shipping || 0,
        total: session.total,
        currency: session.currency || 'ZAR',
        recoveryUrl: session.recoveryUrl || `https://wat.chat/checkout?session=${session.sessionId}&recover=true&coupon=RECOVER10`,
        date: new Date(session.lastActivityAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      });

      const notification: EmailNotification = {
        id: `email_abandoned_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        to: session.customer.email,
        subject: `🛒 Complete your order #${session.orderId} - We saved your cart! (+10% off)`,
        type: 'abandoned_checkout',
        orderId: session.orderId,
        amount: session.total,
        currency: session.currency || 'ZAR',
        timestamp: now,
        html: emailHtml,
        status: 'delivered',
        metadata: {
          customerName: session.customer.name,
          productName: session.items?.[0]?.name || 'Pending WAT Order',
          reason: 'Automated 2-hour abandoned checkout reminder job',
          recoveryUrl: session.recoveryUrl || `https://wat.chat/checkout?session=${session.sessionId}&recover=true&coupon=RECOVER10`,
          itemsCount: session.items?.length || 1,
        },
      };

      emailNotificationsStore.unshift(notification);
      session.abandonedEmailSent = true;
      session.abandonedEmailSentAt = now;
      session.status = 'abandoned';
      dispatched++;
      console.log(
        `[WAT Payments Worker] Abandoned Checkout Job: Dispatched recovery email for Order #${session.orderId} to ${session.customer.email}`
      );
    }
  });

  lastAbandonedJobRunTime = now;
  return { checkedCount: checkoutSessionsStore.length, emailsDispatched: dispatched };
}

// Background Worker Timer
let abandonedJobWorkerStarted = false;
export function startAbandonedCheckoutWorker() {
  if (!abandonedJobWorkerStarted) {
    abandonedJobWorkerStarted = true;
    // Initial evaluation
    runAbandonedCheckoutJob();
    // Recurring evaluation every 60 seconds
    setInterval(() => {
      runAbandonedCheckoutJob();
    }, 60000);
    console.log('[WAT Payments Worker] Abandoned Checkout Background Worker running (every 60s, threshold: 2h)');
  }
}

// -----------------------------------------------------------------------------
// Matrix Handle P2P Money Transfer Helpers
// -----------------------------------------------------------------------------
export const PLATFORM_USERS = [
  {
    id: 'user_lusimadio',
    name: 'Lusimadio Simao',
    handle: '@lusimadio:wat.chat',
    link: 'https://wat.chat/@lusimadio:wat.chat',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 'user_amara',
    name: 'Amara Okafor',
    handle: '@amara:wat.chat',
    link: 'https://wat.chat/@amara:wat.chat',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 'user_kwame',
    name: 'Kwame Mensah',
    handle: '@kwame:wat.chat',
    link: 'https://wat.chat/@kwame:wat.chat',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 'user_zara',
    name: 'Zara Al-Mansoor',
    handle: '@zara:wat.chat',
    link: 'https://wat.chat/@zara:wat.chat',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 'user_brian',
    name: "Brian O'Connor",
    handle: '@brian:wat.chat',
    link: 'https://wat.chat/@brian:wat.chat',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 'user_nia',
    name: 'Nia Adebayo',
    handle: '@nia:wat.chat',
    link: 'https://wat.chat/@nia:wat.chat',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    verified: true,
  },
];

export function resolveMatrixUser(handleOrLink: string) {
  if (!handleOrLink) return null;
  let clean = handleOrLink.trim();
  clean = clean.replace(/^https?:\/\//i, '');
  clean = clean.replace(/^(www\.)?wat\.chat\/(pay\/)?/i, '');
  if (clean.startsWith('@')) clean = clean.slice(1);
  clean = clean.replace(/:wat\.chat$/i, '').toLowerCase();

  const found = PLATFORM_USERS.find(
    (u) =>
      u.id.toLowerCase().includes(clean) ||
      u.handle.toLowerCase().includes(clean) ||
      u.name.toLowerCase().includes(clean)
  );

  if (found) return found;

  return {
    id: `user_${clean}`,
    name: clean.charAt(0).toUpperCase() + clean.slice(1),
    handle: `@${clean}:wat.chat`,
    link: `https://wat.chat/@${clean}:wat.chat`,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    verified: true,
  };
}

export function createPaymentRouter(): Router {
  const router = Router();

  // Initialize and run the 2-hour abandoned checkout background worker
  startAbandonedCheckoutWorker();

  // 1. GET /api/payment-methods - Retrieve saved cards for current user
  router.get('/payment-methods', (req: Request, res: Response) => {
    const userId = (req.query.userId as string) || 'user_lusimadio';
    const methods = savedPaymentMethods.filter((m) => m.userId === userId);
    res.json({
      success: true,
      paymentMethods: methods,
      supportedProviders: ['card', 'google_pay', 'apple_pay', 'eft', 'stripe', 'momo'],
    });
  });

  // 2. POST /api/payment-methods - Add new tokenized card
  router.post('/payment-methods', (req: Request, res: Response) => {
    try {
      const {
        cardNumber,
        expMonth,
        expYear,
        cvv,
        cardholderName,
        isDefault = false,
        userId = 'user_lusimadio',
      } = req.body;

      if (!cardNumber || !expMonth || !expYear || !cardholderName) {
        return res.status(400).json({
          error: 'Card number, expiry month, expiry year, and cardholder name are required',
        });
      }

      const cleanNumber = String(cardNumber).replace(/\s+/g, '');
      if (cleanNumber.length < 13 || cleanNumber.length > 19) {
        return res.status(400).json({ error: 'Invalid card number format' });
      }

      // Detect card brand
      let brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic' = 'generic';
      if (/^4/.test(cleanNumber)) brand = 'visa';
      else if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) brand = 'mastercard';
      else if (/^3[47]/.test(cleanNumber)) brand = 'amex';
      else if (/^6(?:011|5)/.test(cleanNumber)) brand = 'discover';

      const last4 = cleanNumber.slice(-4);
      const token = `tok_${brand}_${last4}_${Date.now().toString(36)}`;

      // If set to default, un-default others
      if (isDefault) {
        savedPaymentMethods.forEach((m) => {
          if (m.userId === userId) m.isDefault = false;
        });
      }

      const newMethod: SavedPaymentMethod = {
        id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId,
        type: 'card',
        brand,
        last4,
        expMonth: Number(expMonth),
        expYear: Number(expYear),
        cardholderName: cardholderName.trim(),
        isDefault: isDefault || savedPaymentMethods.filter((m) => m.userId === userId).length === 0,
        createdAt: Date.now(),
        token,
      };

      savedPaymentMethods.push(newMethod);

      res.status(201).json({
        success: true,
        message: 'Bank card successfully saved and tokenized with PCI-DSS compliance.',
        paymentMethod: newMethod,
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to save payment method' });
    }
  });

  // 3. DELETE /api/payment-methods/:id - Delete card
  router.delete('/payment-methods/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = savedPaymentMethods.findIndex((m) => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    const removed = savedPaymentMethods.splice(index, 1)[0];
    // If was default and remaining cards exist, make first default
    if (removed.isDefault) {
      const remaining = savedPaymentMethods.filter((m) => m.userId === removed.userId);
      if (remaining.length > 0) {
        remaining[0].isDefault = true;
      }
    }

    res.json({ success: true, message: 'Payment method removed' });
  });

  // 4. POST /api/payment-methods/:id/default - Set default
  router.post('/payment-methods/:id/default', (req: Request, res: Response) => {
    const { id } = req.params;
    const target = savedPaymentMethods.find((m) => m.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    savedPaymentMethods.forEach((m) => {
      if (m.userId === target.userId) {
        m.isDefault = m.id === id;
      }
    });

    res.json({ success: true, message: 'Default payment method updated', paymentMethod: target });
  });

  // 5. POST /api/checkout/validate-voucher - Server-side discount calculation
  router.post('/checkout/validate-voucher', (req: Request, res: Response) => {
    try {
      const { code, subtotal = 0 } = req.body;
      if (!code) {
        return res.status(400).json({ error: 'Voucher code is required' });
      }

      const upper = String(code).trim().toUpperCase();
      const voucher = availableVouchers[upper];

      if (!voucher || !voucher.isActive) {
        return res.status(404).json({
          valid: false,
          error: `Voucher code "${code}" is invalid or expired.`,
        });
      }

      if (voucher.minSpend && subtotal < voucher.minSpend) {
        return res.status(400).json({
          valid: false,
          error: `Voucher requires a minimum purchase of R${voucher.minSpend} / $${voucher.minSpend}. Current subtotal: R${subtotal}`,
        });
      }

      let discountAmount = 0;
      if (voucher.discountType === 'percentage') {
        discountAmount = Math.round((subtotal * voucher.discountValue) / 100 * 100) / 100;
      } else {
        discountAmount = Math.min(subtotal, voucher.discountValue);
      }

      res.json({
        valid: true,
        voucher,
        discountAmount,
        message: `Applied ${voucher.description}!`,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to validate voucher' });
    }
  });

  // 6. POST /api/checkout/create-session - Server-side checkout session creation
  router.post('/checkout/create-session', (req: Request, res: Response) => {
    try {
      const {
        items = [],
        voucherCode,
        customer,
        originatingContext,
        currency = 'ZAR',
      } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'At least one product item is required' });
      }

      // Server-side calculation
      const subtotal = items.reduce(
        (sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
        0
      );

      let discount = 0;
      let appliedVoucher: Voucher | undefined = undefined;

      if (voucherCode) {
        const v = availableVouchers[String(voucherCode).trim().toUpperCase()];
        if (v && v.isActive && (!v.minSpend || subtotal >= v.minSpend)) {
          appliedVoucher = v;
          if (v.discountType === 'percentage') {
            discount = Math.round((subtotal * v.discountValue) / 100 * 100) / 100;
          } else {
            discount = Math.min(subtotal, v.discountValue);
          }
        }
      }

      const discountedSubtotal = Math.max(0, subtotal - discount);
      const taxRate = 0.15; // 15% VAT
      const tax = Math.round(discountedSubtotal * taxRate * 100) / 100;
      const shipping = discountedSubtotal > 500 || items.some((i: any) => i.isDigital) ? 0 : 45.0;
      const total = Math.round((discountedSubtotal + tax + shipping) * 100) / 100;

      const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`;
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const session = {
        sessionId,
        items,
        subtotal,
        discount,
        appliedVoucher,
        tax,
        shipping,
        total,
        currency,
        status: 'checkout_created',
        customer: customer || {
          name: 'Lusimadio Nkem',
          email: 'lusimadio12@gmail.com',
          phone: '+27 78 492 0184',
          shippingAddress: '42 Decentralized Avenue, Sandton',
          city: 'Johannesburg',
          country: 'South Africa',
        },
        originatingContext,
        idempotencyKey,
        createdAt: Date.now(),
      };

      res.json({
        success: true,
        session,
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to create checkout session' });
    }
  });

  // 7. POST /api/checkout/process-payment - Authorize & Settle payment
  router.post('/checkout/process-payment', (req: Request, res: Response) => {
    try {
      const {
        sessionId,
        paymentMethod,
        paymentMethodDetails = {},
        idempotencyKey,
        customer,
        simulateDecline = false,
        declineReason,
        items,
        subtotal,
        discount = 0,
        tax,
        shipping = 0,
        total,
        currency = 'ZAR',
        sellerName = 'WAT Verified Merchant',
      } = req.body;

      if (!paymentMethod) {
        return res.status(400).json({ error: 'Payment method is required' });
      }

      // Idempotency check
      if (idempotencyKey && processedIdempotencyKeys.has(idempotencyKey)) {
        return res.status(409).json({
          error: 'Duplicate transaction attempt detected (Idempotency protection)',
        });
      }
      if (idempotencyKey) {
        processedIdempotencyKeys.add(idempotencyKey);
      }

      const orderId = `WAT-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const transactionId = `TXN-${paymentMethod.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      const now = Date.now();
      const dateFormatted = new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      const customerInfo = customer || {
        name: 'Lusimadio Nkem',
        email: 'lusimadio12@gmail.com',
        phone: '+27 78 492 0184',
        shippingAddress: '42 Decentralized Ave',
        city: 'Johannesburg',
        country: 'South Africa',
      };

      // Check simulated decline triggers
      const isDecline =
        simulateDecline ||
        paymentMethodDetails?.last4 === '0002' ||
        paymentMethodDetails?.last4 === '0003';

      if (isDecline) {
        const failureReason =
          declineReason ||
          (paymentMethodDetails?.last4 === '0003'
            ? 'Card has expired or invalid expiration date'
            : 'Insufficient funds or transaction limit exceeded by issuing bank (Declined code 51)');

        const failedTxn = {
          transactionId,
          orderId,
          amount: total,
          currency,
          paymentMethod,
          paymentMethodDetails,
          status: 'payment_declined',
          timestamp: now,
          errorMessage: failureReason,
          idempotencyKey,
        };
        transactionsStore.push(failedTxn);

        // Automated Declined Email Dispatch
        const declinedHtml = generateDeclinedEmailHtml({
          customerName: customerInfo.name,
          orderId,
          attemptedAmount: total,
          currency,
          paymentMethod: getPaymentMethodLabel(paymentMethod, paymentMethodDetails),
          reason: failureReason,
          date: dateFormatted,
        });

        const declinedEmailNotification: EmailNotification = {
          id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          to: customerInfo.email,
          subject: `⚠️ Payment Unsuccessful - Order #${orderId} (${currency} ${total})`,
          type: 'payment_declined',
          orderId,
          amount: total,
          currency,
          timestamp: now,
          html: declinedHtml,
          status: 'delivered',
          metadata: {
            customerName: customerInfo.name,
            paymentMethod: getPaymentMethodLabel(paymentMethod, paymentMethodDetails),
            reason: failureReason,
          },
        };
        emailNotificationsStore.unshift(declinedEmailNotification);

        return res.status(402).json({
          success: false,
          status: 'payment_declined',
          orderId,
          transactionId,
          error: failureReason,
          emailNotification: declinedEmailNotification,
        });
      }

      // Success Flow
      const confirmedOrder = {
        orderId,
        transactionId,
        items: items || [],
        customer: customerInfo,
        subtotal: subtotal || total,
        discount: discount || 0,
        tax: tax || 0,
        shipping: shipping || 0,
        total,
        currency,
        paymentStatus: 'payment_successful',
        paymentMethod,
        paymentMethodLabel: getPaymentMethodLabel(paymentMethod, paymentMethodDetails),
        sellerName,
        createdAt: now,
        estimatedDelivery: '2-4 Business Days via WAT Express Logistics',
      };

      ordersStore.unshift(confirmedOrder);

      const successTxn = {
        transactionId,
        orderId,
        amount: total,
        currency,
        paymentMethod,
        paymentMethodDetails,
        status: 'payment_successful',
        timestamp: now,
        idempotencyKey,
        receiptUrl: `https://wat.chat/receipt/${transactionId}`,
      };
      transactionsStore.unshift(successTxn);

      // Automated Success Email Dispatch
      const successHtml = generateSuccessEmailHtml({
        customerName: customerInfo.name,
        orderId,
        transactionId,
        items: items || [],
        subtotal: subtotal || total,
        discount: discount || 0,
        tax: tax || 0,
        shipping: shipping || 0,
        total,
        currency,
        paymentMethod: getPaymentMethodLabel(paymentMethod, paymentMethodDetails),
        sellerName,
        date: dateFormatted,
      });

      const successEmailNotification: EmailNotification = {
        id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        to: customerInfo.email,
        subject: `✓ Payment Receipt & Order Confirmed - #${orderId} (${currency} ${total})`,
        type: 'payment_success',
        orderId,
        amount: total,
        currency,
        timestamp: now,
        html: successHtml,
        status: 'delivered',
        metadata: {
          customerName: customerInfo.name,
          productName: items?.[0]?.name || 'WAT Purchase',
          paymentMethod: getPaymentMethodLabel(paymentMethod, paymentMethodDetails),
          transactionId,
          sellerName,
        },
      };
      emailNotificationsStore.unshift(successEmailNotification);

      res.status(200).json({
        success: true,
        status: 'payment_successful',
        order: confirmedOrder,
        transaction: successTxn,
        emailNotification: successEmailNotification,
        message: 'Payment verified and settled successfully via WAT Secure Engine.',
      });
    } catch (err: any) {
      console.error('Process payment error:', err);
      res.status(500).json({ error: err?.message || 'Payment processing failed' });
    }
  });

  // 8. GET /api/notifications/emails - Retrieve all transactional emails sent to buyer
  router.get('/notifications/emails', (req: Request, res: Response) => {
    const email = (req.query.email as string) || 'lusimadio12@gmail.com';
    const filtered = emailNotificationsStore.filter(
      (e) => !email || e.to.toLowerCase() === email.toLowerCase()
    );
    res.json({
      success: true,
      emails: filtered,
      count: filtered.length,
    });
  });

  // 9. GET /api/orders - Retrieve confirmed orders
  router.get('/orders', (req: Request, res: Response) => {
    res.json({
      success: true,
      orders: ordersStore,
    });
  });

  // 10. GET /api/orders/:id - Get specific order
  router.get('/orders/:id', (req: Request, res: Response) => {
    const order = ordersStore.find((o) => o.orderId === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, order });
  });

  // 11. POST /api/checkout/sessions - Save or update checkout session (tracks progress for abandoned recovery)
  router.post('/checkout/sessions', (req: Request, res: Response) => {
    try {
      const {
        sessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        orderId = `WAT-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        customer,
        items,
        subtotal,
        discount = 0,
        tax = 0,
        shipping = 0,
        total,
        currency = 'ZAR',
        currentStep = 'shipping',
        status = 'pending',
      } = req.body;

      const existingIndex = checkoutSessionsStore.findIndex((s) => s.sessionId === sessionId);
      const sessionData: CheckoutSession = {
        sessionId,
        orderId: existingIndex >= 0 ? checkoutSessionsStore[existingIndex].orderId : orderId,
        customer: customer || {
          name: 'Lusimadio Nkem',
          email: 'lusimadio12@gmail.com',
          phone: '+27 78 492 0184',
          shippingAddress: '42 Decentralized Ave',
          city: 'Johannesburg',
          country: 'South Africa',
        },
        items: items || [],
        subtotal: Number(subtotal) || 0,
        discount: Number(discount) || 0,
        tax: Number(tax) || 0,
        shipping: Number(shipping) || 0,
        total: Number(total) || 0,
        currency,
        currentStep,
        status,
        createdAt: existingIndex >= 0 ? checkoutSessionsStore[existingIndex].createdAt : Date.now(),
        lastActivityAt: Date.now(),
        abandonedEmailSent: existingIndex >= 0 ? checkoutSessionsStore[existingIndex].abandonedEmailSent : false,
        recoveryUrl: `https://wat.chat/checkout?session=${sessionId}&recover=true&coupon=RECOVER10`,
      };

      if (existingIndex >= 0) {
        checkoutSessionsStore[existingIndex] = {
          ...checkoutSessionsStore[existingIndex],
          ...sessionData,
        };
      } else {
        checkoutSessionsStore.unshift(sessionData);
      }

      res.status(200).json({
        success: true,
        session: sessionData,
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to save checkout session' });
    }
  });

  // 12. GET /api/checkout/sessions - Retrieve checkout sessions & status
  router.get('/checkout/sessions', (req: Request, res: Response) => {
    res.json({
      success: true,
      sessions: checkoutSessionsStore,
      total: checkoutSessionsStore.length,
      pending: checkoutSessionsStore.filter((s) => s.status === 'pending').length,
      abandoned: checkoutSessionsStore.filter((s) => s.status === 'abandoned').length,
      completed: checkoutSessionsStore.filter((s) => s.status === 'completed').length,
    });
  });

  // 13. POST /api/checkout/abandoned/run-job - Trigger 2-hour abandoned checkout background job scan
  router.post('/checkout/abandoned/run-job', (req: Request, res: Response) => {
    const result = runAbandonedCheckoutJob();
    res.json({
      success: true,
      message: `Abandoned checkout job evaluated ${result.checkedCount} sessions and dispatched ${result.emailsDispatched} emails.`,
      result,
      lastRunTime: lastAbandonedJobRunTime,
    });
  });

  // 14. POST /api/checkout/abandoned/simulate-test - Create a simulated 2.5-hour abandoned session and run job
  router.post('/checkout/abandoned/simulate-test', (req: Request, res: Response) => {
    const testSessionId = `cs_sim_${Date.now()}`;
    const testOrderId = `WAT-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const session: CheckoutSession = {
      sessionId: testSessionId,
      orderId: testOrderId,
      customer: {
        name: req.body.customerName || 'Lusimadio Nkem',
        email: req.body.email || 'lusimadio12@gmail.com',
        phone: '+27 78 492 0184',
        shippingAddress: '42 Decentralized Ave, Sandton',
        city: 'Johannesburg',
        country: 'South Africa',
      },
      items: req.body.items || [
        {
          id: 'item_test_01',
          name: 'WAT Sovereign Node (Hardware Matrix SFU Gateway)',
          price: 349.00,
          quantity: 1,
          currency: 'ZAR',
        },
      ],
      subtotal: 349.00,
      discount: 0,
      tax: 52.35,
      shipping: 0,
      total: 401.35,
      currency: 'ZAR',
      currentStep: 'payment',
      status: 'pending',
      createdAt: Date.now() - 2.5 * 60 * 60 * 1000, // 2.5 hours ago (> 2 hours!)
      lastActivityAt: Date.now() - 2.5 * 60 * 60 * 1000,
      abandonedEmailSent: false,
      recoveryUrl: `https://wat.chat/checkout?session=${testSessionId}&recover=true&coupon=RECOVER10`,
    };

    checkoutSessionsStore.unshift(session);
    const jobResult = runAbandonedCheckoutJob();
    const latestAbandonedEmail = emailNotificationsStore.find((e) => e.orderId === testOrderId);

    res.json({
      success: true,
      message: 'Simulated 2-hour pending session created and abandoned checkout email triggered.',
      session,
      jobResult,
      emailNotification: latestAbandonedEmail,
    });
  });

  // 15. GET /api/checkout/abandoned/stats - Get abandoned checkout metrics
  router.get('/checkout/abandoned/stats', (req: Request, res: Response) => {
    const pendingSessions = checkoutSessionsStore.filter((s) => s.status === 'pending');
    const abandonedEmails = emailNotificationsStore.filter((e) => e.type === 'abandoned_checkout');
    res.json({
      success: true,
      totalSessions: checkoutSessionsStore.length,
      pendingSessionsCount: pendingSessions.length,
      abandonedEmailsSentCount: abandonedEmails.length,
      lastJobRunTime: lastAbandonedJobRunTime,
      nextEvaluationInSeconds: 60,
    });
  });

  // 16. POST /api/wallet/transfer-handle - Send & receive money between WAT users via Matrix handle or wat.chat link
  router.post('/wallet/transfer-handle', (req: Request, res: Response) => {
    try {
      const {
        senderHandle = '@lusimadio:wat.chat',
        recipientHandle,
        amount,
        currency = 'ZAR',
        note = 'WAT P2P Sovereign Transfer',
      } = req.body;

      if (!recipientHandle) {
        return res.status(400).json({ error: 'Recipient Matrix handle or wat.chat link is required' });
      }

      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ error: 'Please enter a valid transfer amount' });
      }

      const recipient = resolveMatrixUser(recipientHandle);
      if (!recipient) {
        return res.status(404).json({ error: 'Recipient user not found on WAT Sovereign Network' });
      }

      const txnId = `WTX-P2P-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const transferRecord = {
        id: txnId,
        type: 'transfer' as const,
        amount: numAmount,
        currency,
        senderHandle,
        recipientHandle: recipient.handle,
        recipientName: recipient.name,
        recipientAvatar: recipient.avatar,
        recipientLink: recipient.link,
        status: 'completed' as const,
        timestamp: Date.now(),
        note: note || `P2P Transfer to ${recipient.name} (${recipient.handle})`,
        fee: 0,
        network: 'Matrix 2.0 Sovereign Mesh',
      };

      res.status(200).json({
        success: true,
        message: `Transferred ${currency} ${numAmount.toFixed(2)} to ${recipient.name} (${recipient.handle})`,
        transaction: transferRecord,
        recipient,
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Transfer failed' });
    }
  });

  // 17. GET /api/wallet/resolve-handle - Resolve Matrix handle or wat.chat link to user profile
  router.get('/wallet/resolve-handle', (req: Request, res: Response) => {
    const handle = req.query.handle as string;
    if (!handle) {
      return res.status(400).json({ error: 'Handle parameter is required' });
    }
    const resolved = resolveMatrixUser(handle);
    res.json({
      success: true,
      user: resolved,
    });
  });

  return router;
}

function getPaymentMethodLabel(type: string, details: any): string {
  switch (type) {
    case 'card':
      return `${details?.brand ? details.brand.toUpperCase() : 'Card'} ending in •••• ${details?.last4 || '4821'}`;
    case 'google_pay':
      return 'Google Pay (GPay Tokenized)';
    case 'apple_pay':
      return 'Apple Pay (Secure Enclave)';
    case 'eft':
      return `Instant EFT (${details?.bankName || 'Direct Bank Transfer'})`;
    case 'stripe':
      return 'Stripe Checkout';
    case 'momo':
      return `MTN MoMo (${details?.phone || '+27 78 ...'})`;
    case 'mpesa':
      return `M-Pesa (${details?.phone || '+254 71 ...'})`;
    default:
      return 'WAT Direct Pay';
  }
}
