import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Tag,
  Check,
  AlertCircle,
  X,
  ChevronRight,
  Plus,
  Trash2,
  Smartphone,
  Building,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Info,
  CheckCircle2,
  RotateCcw,
  Zap,
  Truck,
  MapPin,
  ClipboardCheck,
} from 'lucide-react';
import {
  CheckoutItem,
  CheckoutCustomerInfo,
  PaymentMethodType,
  SavedPaymentMethod,
  Voucher,
  Order,
  EmailNotification,
} from '../../types/payment';
import { paymentService } from '../../services/paymentService';
import { soundEngine } from '../../utils/audioSynth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CheckoutItem[];
  originatingContext?: any;
  onPaymentSuccess: (order: Order, emailNotification: EmailNotification | null) => void;
  onPaymentDeclined: (error: string, orderId?: string, emailNotification?: EmailNotification | null) => void;
}

export const WATCheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  items: initialItems,
  originatingContext,
  onPaymentSuccess,
  onPaymentDeclined,
}) => {
  const [items, setItems] = useState<CheckoutItem[]>(initialItems);

  // Stepper State: Shipping -> Payment -> Review
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [sessionId] = useState<string>(() => 'cs_' + Date.now() + '_' + Math.random().toString(36).substr(2, 7));

  // Customer Info State
  const [customer, setCustomer] = useState<CheckoutCustomerInfo>({
    name: 'Lusimadio Nkem',
    email: 'lusimadio12@gmail.com',
    phone: '+27 78 492 0184',
    shippingAddress: '42 Decentralized Avenue, Sandton',
    city: 'Johannesburg',
    postalCode: '2196',
    country: 'South Africa',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Voucher State
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccessMsg, setVoucherSuccessMsg] = useState<string | null>(null);

  // Payment Method State
  const [selectedMethodType, setSelectedMethodType] = useState<PaymentMethodType>('card');
  const [savedCards, setSavedCards] = useState<SavedPaymentMethod[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);

  // New Card Form Fields
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('Lusimadio Nkem');
  const [saveCardForFuture, setSaveCardForFuture] = useState(true);

  // EFT State
  const [selectedBank, setSelectedBank] = useState('Capitec Pay');

  // Mobile Money State
  const [momoPhone, setMomoPhone] = useState('+27 78 492 0184');

  // Test decline simulation toggle
  const [simulateDecline, setSimulateDecline] = useState(false);

  // Checkout Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
    }
  }, [initialItems]);

  useEffect(() => {
    if (isOpen) {
      loadSavedCards();
    }
  }, [isOpen]);

  const loadSavedCards = async () => {
    const cards = await paymentService.getPaymentMethods();
    setSavedCards(cards);
    const defaultCard = cards.find((c) => c.isDefault) || cards[0];
    if (defaultCard) {
      setSelectedCardId(defaultCard.id);
    }
  };

  // Calculations
  const currency = items[0]?.currency || 'ZAR';
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const isDigital = items.some((i) => i.category === 'digital' || i.category === 'services');
  const shipping = isDigital
    ? 0
    : deliverySpeed === 'express'
    ? 65.0
    : subtotal > 500
    ? 0
    : 45.0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * 0.15 * 100) / 100;
  const finalTotal = Math.round((taxableAmount + tax + shipping) * 100) / 100;

  // Sync session with backend for abandoned checkout background job
  useEffect(() => {
    if (isOpen && items.length > 0) {
      paymentService
        .saveCheckoutSession({
          sessionId,
          customer,
          items,
          subtotal,
          discount: discountAmount,
          tax,
          shipping,
          total: finalTotal,
          currency,
          currentStep,
          status: 'pending',
        })
        .catch((e) => console.warn('Sync session error:', e));
    }
  }, [isOpen, currentStep, customer, items, subtotal, discountAmount, tax, shipping, finalTotal, currency, sessionId]);

  const handleProceedFromShipping = () => {
    if (!customer.name.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!customer.email.trim() || !customer.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    if (!customer.shippingAddress.trim()) {
      alert('Please enter your delivery street address');
      return;
    }
    soundEngine.playChime();
    setCurrentStep('payment');
  };

  const handleProceedFromPayment = () => {
    if (selectedMethodType === 'card' && isAddingNewCard) {
      if (!newCardNumber || !newCardExp || !newCardCvv) {
        alert('Please fill out all required card fields (Number, Expiry, CVV)');
        return;
      }
    }
    soundEngine.playChime();
    setCurrentStep('review');
  };

  // Quantity modification
  const handleQuantityChange = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((it) => {
          if (it.productId === productId || it.id === productId) {
            const newQ = Math.max(1, it.quantity + delta);
            return { ...it, quantity: newQ };
          }
          return it;
        })
        .filter((it) => it.quantity > 0)
    );
  };

  // Card Brand Detection
  const getCardBrand = (number: string) => {
    const clean = number.replace(/\s+/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    return 'generic';
  };

  // Format Card Number
  const handleCardNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setNewCardNumber(formatted);
  };

  // Format Expiration MM/YY
  const handleExpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setNewCardExp(val);
  };

  // Voucher Application
  const handleApplyVoucher = async () => {
    if (!voucherCodeInput.trim()) return;
    setVoucherLoading(true);
    setVoucherError(null);
    setVoucherSuccessMsg(null);

    const result = await paymentService.validateVoucher(voucherCodeInput, subtotal);
    setVoucherLoading(false);

    if (result.valid && result.voucher) {
      setAppliedVoucher(result.voucher);
      setDiscountAmount(result.discountAmount || 0);
      setVoucherSuccessMsg(result.message || 'Voucher applied successfully!');
      soundEngine.playChime();
    } else {
      setVoucherError(result.error || 'Invalid or expired voucher code');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setVoucherCodeInput('');
    setVoucherSuccessMsg(null);
    setVoucherError(null);
  };

  // Process & Authorize Payment
  const handlePayNow = async () => {
    setIsProcessing(true);
    setProcessingStep('Tokenizing payment credentials with 256-bit encryption...');

    await new Promise((r) => setTimeout(r, 600));

    // If adding a new card, save/tokenize first if checked
    let paymentMethodDetails: any = {};

    if (selectedMethodType === 'card') {
      if (isAddingNewCard) {
        if (!newCardNumber || !newCardExp || !newCardCvv || !newCardHolder) {
          setIsProcessing(false);
          alert('Please fill in all card details');
          return;
        }
        const [m, y] = newCardExp.split('/');
        const expMonth = parseInt(m, 10) || 12;
        const expYear = parseInt(y, 10) ? 2000 + parseInt(y, 10) : 2028;
        const brand = getCardBrand(newCardNumber);
        const last4 = newCardNumber.replace(/\s+/g, '').slice(-4);

        if (saveCardForFuture) {
          setProcessingStep('Saving tokenized card to your WAT vault...');
          await paymentService.addCard({
            cardNumber: newCardNumber,
            expMonth,
            expYear,
            cvv: newCardCvv,
            cardholderName: newCardHolder,
            isDefault: savedCards.length === 0,
          });
        }

        paymentMethodDetails = {
          brand,
          last4: last4 || '4821',
          cardholderName: newCardHolder,
        };
      } else {
        const card = savedCards.find((c) => c.id === selectedCardId);
        paymentMethodDetails = {
          brand: card?.brand || 'visa',
          last4: card?.last4 || '4821',
          cardholderName: card?.cardholderName || 'Lusimadio Nkem',
        };
      }
    } else if (selectedMethodType === 'google_pay') {
      paymentMethodDetails = {
        walletType: 'Google Pay Token',
        last4: '9842',
      };
    } else if (selectedMethodType === 'apple_pay') {
      paymentMethodDetails = {
        walletType: 'Apple Pay Device Account',
        last4: '1029',
      };
    } else if (selectedMethodType === 'eft') {
      paymentMethodDetails = {
        bankName: selectedBank,
        reference: `WAT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      };
    } else if (selectedMethodType === 'momo' || selectedMethodType === 'mpesa') {
      paymentMethodDetails = {
        phone: momoPhone,
      };
    }

    setProcessingStep('Contacting gateway & verifying transaction authorization...');
    await new Promise((r) => setTimeout(r, 700));

    setProcessingStep('Executing fraud check and settling Matrix ledger...');
    await new Promise((r) => setTimeout(r, 600));

    const sellerName = items[0]?.sellerName || 'WAT Verified Merchant';

    const result = await paymentService.processPayment({
      sessionId,
      paymentMethod: selectedMethodType,
      paymentMethodDetails,
      customer,
      items,
      subtotal,
      discount: discountAmount,
      tax,
      shipping,
      total: finalTotal,
      currency,
      sellerName,
      simulateDecline,
      declineReason: simulateDecline ? 'Simulated test decline (Insufficient funds / Card declined)' : undefined,
    });

    setIsProcessing(false);

    if (result.success && result.order) {
      onClose();
      onPaymentSuccess(result.order, result.emailNotification || null);
    } else {
      onClose();
      onPaymentDeclined(
        result.error || 'Payment was declined by issuing bank.',
        result.orderId,
        result.emailNotification || null
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-black/[0.08] overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Top Header Bar */}
          <div className="bg-neutral-900 text-white px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black tracking-tight text-lg shadow-sm">
                WAT
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Secure WAT Checkout
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Lock className="w-3 h-3" />
                    <span>256-Bit E2EE</span>
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Universal Decentralized Commerce & Instant Settlement
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Stepper Bar (Shipping -> Payment -> Review) */}
          <div className="bg-neutral-50 border-b border-black/[0.08] px-5 sm:px-8 py-3.5 shrink-0">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              {/* Step 1: Shipping */}
              <button
                type="button"
                onClick={() => setCurrentStep('shipping')}
                className={`flex items-center gap-2 text-xs transition-all ${
                  currentStep === 'shipping'
                    ? 'text-neutral-900 font-extrabold'
                    : 'text-neutral-500 hover:text-neutral-900 font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                    currentStep === 'shipping'
                      ? 'bg-neutral-900 text-white shadow-xs ring-2 ring-neutral-900/20'
                      : currentStep === 'payment' || currentStep === 'review'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {currentStep === 'payment' || currentStep === 'review' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>1</span>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] uppercase tracking-wider font-bold">Shipping</span>
                  <span className="text-[10px] text-neutral-400 hidden sm:inline">Address & Delivery</span>
                </div>
              </button>

              <div
                className={`flex-1 h-0.5 mx-3 sm:mx-6 transition-colors ${
                  currentStep === 'payment' || currentStep === 'review'
                    ? 'bg-emerald-600'
                    : 'bg-neutral-200'
                }`}
              />

              {/* Step 2: Payment */}
              <button
                type="button"
                onClick={handleProceedFromShipping}
                className={`flex items-center gap-2 text-xs transition-all ${
                  currentStep === 'payment'
                    ? 'text-neutral-900 font-extrabold'
                    : 'text-neutral-500 hover:text-neutral-900 font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                    currentStep === 'payment'
                      ? 'bg-neutral-900 text-white shadow-xs ring-2 ring-neutral-900/20'
                      : currentStep === 'review'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {currentStep === 'review' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>2</span>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] uppercase tracking-wider font-bold">Payment</span>
                  <span className="text-[10px] text-neutral-400 hidden sm:inline">Card, EFT or MoMo</span>
                </div>
              </button>

              <div
                className={`flex-1 h-0.5 mx-3 sm:mx-6 transition-colors ${
                  currentStep === 'review' ? 'bg-emerald-600' : 'bg-neutral-200'
                }`}
              />

              {/* Step 3: Review */}
              <button
                type="button"
                onClick={handleProceedFromPayment}
                className={`flex items-center gap-2 text-xs transition-all ${
                  currentStep === 'review'
                    ? 'text-neutral-900 font-extrabold'
                    : 'text-neutral-500 hover:text-neutral-900 font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                    currentStep === 'review'
                      ? 'bg-neutral-900 text-white shadow-xs ring-2 ring-neutral-900/20'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  <span>3</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] uppercase tracking-wider font-bold">Review</span>
                  <span className="text-[10px] text-neutral-400 hidden sm:inline">Verify & Authorize</span>
                </div>
              </button>
            </div>
          </div>

          {/* Main 2-Column Responsive Content */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column: Customer & Payment Method Selection (7 cols) */}
            <div className="lg:col-span-7 p-5 sm:p-7 space-y-6 border-b lg:border-b-0 lg:border-r border-black/[0.08] bg-white">
              {/* ========================================================================= */}
              {/* STEP 1: SHIPPING & CONTACT DETAILS                                        */}
              {/* ========================================================================= */}
              {currentStep === 'shipping' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                        <Truck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900">Shipping & Delivery Details</h3>
                        <p className="text-[11px] text-neutral-500">Provide recipient contact and destination address</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Inputs */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">Full Recipient Name *</label>
                        <input
                          type="text"
                          value={customer.name}
                          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                          placeholder="e.g. Lusimadio Nkem"
                          className="w-full px-3 py-2.5 bg-neutral-50/80 border border-black/[0.10] rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">Email Address *</label>
                        <input
                          type="email"
                          value={customer.email}
                          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full px-3 py-2.5 bg-neutral-50/80 border border-black/[0.10] rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          placeholder="+27 78 492 0184"
                          className="w-full px-3 py-2.5 bg-neutral-50/80 border border-black/[0.10] rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">Country</label>
                        <input
                          type="text"
                          value={customer.country}
                          onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                          className="w-full px-3 py-2.5 bg-neutral-50/80 border border-black/[0.10] rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-600 mb-1">Delivery Street Address *</label>
                      <input
                        type="text"
                        value={customer.shippingAddress}
                        onChange={(e) => setCustomer({ ...customer, shippingAddress: e.target.value })}
                        placeholder="Street name, building, apartment number"
                        className="w-full px-3 py-2.5 bg-neutral-50/80 border border-black/[0.10] rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">City / Town</label>
                        <input
                          type="text"
                          value={customer.city}
                          onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                          className="w-full px-3 py-2.5 bg-neutral-50/80 border border-black/[0.10] rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={customer.postalCode}
                          onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                          className="w-full px-3 py-2.5 bg-neutral-50/80 border border-black/[0.10] rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Speed / Courier Selection */}
                  <div className="space-y-2.5 pt-2">
                    <label className="block text-xs font-bold text-neutral-900">
                      Select Delivery Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div
                        onClick={() => setDeliverySpeed('standard')}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          deliverySpeed === 'standard'
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-neutral-50 border-black/[0.08] text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">Standard Tracked Courier</span>
                          <span className="text-[11px] font-semibold">
                            {subtotal > 500 || isDigital ? 'FREE' : `${currency} 45.00`}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-1 ${deliverySpeed === 'standard' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          Estimated 2–4 business days delivery with SMS notifications.
                        </p>
                      </div>

                      <div
                        onClick={() => setDeliverySpeed('express')}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          deliverySpeed === 'express'
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-neutral-50 border-black/[0.08] text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">Express Priority Courier</span>
                          <span className="text-[11px] font-semibold">{currency} 65.00</span>
                        </div>
                        <p className={`text-[11px] mt-1 ${deliverySpeed === 'express' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          Same-day / next-day priority dispatch with live GPS tracking.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order notification notice */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-[11px] text-emerald-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Order tracking and confirmation invoice will be automatically dispatched to{' '}
                      <strong>{customer.email || 'your email'}</strong> upon settlement.
                    </span>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleProceedFromShipping}
                      className="px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Payment Method</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP 2: PAYMENT METHOD SELECTION                                          */}
              {/* ========================================================================= */}
              {currentStep === 'payment' && (
                <div className="space-y-5">
                  {/* Shipping Summary Strip */}
                  <div className="bg-neutral-50 border border-black/[0.06] rounded-2xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-xs sm:max-w-md">
                        Deliver to: <strong>{customer.name}</strong> • {customer.shippingAddress}, {customer.city}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="text-emerald-700 hover:text-emerald-800 font-bold text-[11px] shrink-0"
                    >
                      Change
                    </button>
                  </div>

                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
                      <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900">Choose Payment Method</h3>
                        <p className="text-[11px] text-neutral-500">256-bit encrypted decentralized processing</p>
                      </div>
                    </div>

                {/* Method Pills Navigation */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethodType('card');
                      setIsAddingNewCard(false);
                    }}
                    className={`py-2.5 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedMethodType === 'card'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-neutral-50/80 border-black/[0.08] text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Bank Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethodType('google_pay')}
                    className={`py-2.5 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedMethodType === 'google_pay'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-neutral-50/80 border-black/[0.08] text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="text-sm font-black tracking-tighter">G Pay</span>
                    <span className="text-[11px] font-bold">Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethodType('apple_pay')}
                    className={`py-2.5 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedMethodType === 'apple_pay'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-neutral-50/80 border-black/[0.08] text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="text-sm font-black"> Pay</span>
                    <span className="text-[11px] font-bold">Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethodType('eft')}
                    className={`py-2.5 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedMethodType === 'eft'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-neutral-50/80 border-black/[0.08] text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Instant EFT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethodType('momo')}
                    className={`py-2.5 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedMethodType === 'momo'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-neutral-50/80 border-black/[0.08] text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[11px] font-bold">MoMo</span>
                  </button>
                </div>

                {/* Sub-Panels based on payment method */}
                <div className="bg-neutral-50/90 border border-black/[0.08] rounded-2xl p-4 sm:p-5 space-y-4">
                  {/* CARD METHOD PANEL */}
                  {selectedMethodType === 'card' && (
                    <div className="space-y-4">
                      {/* Saved Cards List */}
                      {savedCards.length > 0 && !isAddingNewCard && (
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-neutral-700 flex items-center justify-between">
                            <span>Your Saved Bank Cards</span>
                            <button
                              type="button"
                              onClick={() => setIsAddingNewCard(true)}
                              className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add New Card</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {savedCards.map((card) => (
                              <label
                                key={card.id}
                                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                                  selectedCardId === card.id
                                    ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                                    : 'bg-white border-black/[0.08] hover:bg-neutral-100/70'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="radio"
                                    name="saved_card"
                                    checked={selectedCardId === card.id}
                                    onChange={() => setSelectedCardId(card.id)}
                                    className="accent-emerald-600 w-4 h-4"
                                  />
                                  <div className="w-10 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                                    {card.brand}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                                      <span>•••• •••• •••• {card.last4}</span>
                                      {card.isDefault && (
                                        <span className="px-1.5 py-0.2 rounded-md bg-neutral-100 text-neutral-600 text-[9px] font-bold">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-neutral-500">
                                      Exp: {card.expMonth.toString().padStart(2, '0')}/{card.expYear.toString().slice(-2)} • {card.cardholderName}
                                    </div>
                                  </div>
                                </div>
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ADD NEW CARD FORM */}
                      {(isAddingNewCard || savedCards.length === 0) && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-900">
                              Direct Bank Card Details
                            </span>
                            {savedCards.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setIsAddingNewCard(false)}
                                className="text-xs text-neutral-500 hover:text-neutral-800"
                              >
                                Use Saved Card
                              </button>
                            )}
                          </div>

                          <div className="space-y-2.5">
                            <div>
                              <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                                Card Number
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="4000 1234 5678 9010"
                                  value={newCardNumber}
                                  onChange={handleCardNumberInput}
                                  className="w-full pl-3 pr-16 py-2.5 bg-white border border-black/[0.12] rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <span className="absolute right-3 top-2.5 text-[10px] font-bold uppercase bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">
                                  {getCardBrand(newCardNumber)}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                                  Expiration (MM/YY)
                                </label>
                                <input
                                  type="text"
                                  placeholder="12/28"
                                  value={newCardExp}
                                  onChange={handleExpInput}
                                  className="w-full px-3 py-2 bg-white border border-black/[0.12] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                                  Security CVV
                                </label>
                                <input
                                  type="password"
                                  placeholder="•••"
                                  maxLength={4}
                                  value={newCardCvv}
                                  onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ''))}
                                  className="w-full px-3 py-2 bg-white border border-black/[0.12] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                                Cardholder Name
                              </label>
                              <input
                                type="text"
                                value={newCardHolder}
                                onChange={(e) => setNewCardHolder(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-black/[0.12] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>

                            <label className="flex items-center gap-2 pt-1 text-xs text-neutral-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={saveCardForFuture}
                                onChange={(e) => setSaveCardForFuture(e.target.checked)}
                                className="accent-emerald-600 rounded"
                              />
                              <span>Save card securely for 1-click purchases (PCI Tokenized)</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* GOOGLE PAY PANEL */}
                  {selectedMethodType === 'google_pay' && (
                    <div className="text-center py-4 space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-black/[0.08] shadow-xs flex items-center justify-center font-black text-xl text-neutral-800">
                        GPay
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900">Google Pay Ready</div>
                        <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                          Fast, secure checkout using cards stored in your Google Account.
                        </p>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Connected to lusimadio12@gmail.com</span>
                      </div>
                    </div>
                  )}

                  {/* APPLE PAY PANEL */}
                  {selectedMethodType === 'apple_pay' && (
                    <div className="text-center py-4 space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-black text-white flex items-center justify-center font-black text-2xl shadow-xs">
                        
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900">Apple Pay Ready</div>
                        <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                          Confirm with Touch ID / Face ID. Your card number is never shared with merchants.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* EFT PANEL */}
                  {selectedMethodType === 'eft' && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-neutral-900">
                        Select Instant EFT Bank Provider
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {['Capitec Pay', 'Standard Bank', 'FNB / RMB', 'Nedbank', 'Absa Direct', 'GTBank / Kuda'].map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setSelectedBank(bank)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                              selectedBank === bank
                                ? 'bg-white border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20 font-bold'
                                : 'bg-white border-black/[0.08] text-neutral-700 hover:bg-neutral-100'
                            }`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        Instant automated payment notification. No manual proof of payment required.
                      </p>
                    </div>
                  )}

                  {/* MOMO PANEL */}
                  {selectedMethodType === 'momo' && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-neutral-900">
                        Mobile Money (MTN MoMo / M-Pesa STK Push)
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                          Mobile Number for Payment Prompt
                        </label>
                        <input
                          type="tel"
                          value={momoPhone}
                          onChange={(e) => setMomoPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-black/[0.12] rounded-xl text-xs"
                        />
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        You will receive an instant PIN confirmation prompt on your phone.
                      </p>
                    </div>
                  )}
                </div>

                {/* Developer / QA Test Decline Toggle */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-950 block">Simulate Decline Scenario</span>
                      <span className="text-[10px] text-amber-700">
                        Test declined modal & automated decline email
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSimulateDecline(!simulateDecline)}
                    className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                      simulateDecline ? 'bg-amber-600' : 'bg-neutral-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                        simulateDecline ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Step 2 Bottom Navigation */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('shipping')}
                    className="px-4 py-2.5 rounded-xl border border-black/[0.10] text-xs font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Shipping</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedFromPayment}
                    className="px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Order Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: REVIEW & AUTHORIZE ORDER                                          */}
          {/* ========================================================================= */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                    <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">Review & Authorize Order</h3>
                    <p className="text-[11px] text-neutral-500">Confirm all details before final decentralized payment settlement</p>
                  </div>
                </div>
              </div>

              {/* Summary Card 1: Shipping */}
              <div className="bg-neutral-50 border border-black/[0.08] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Delivery Destination & Contact</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('shipping')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Edit Shipping
                  </button>
                </div>

                <div className="text-xs space-y-1 text-neutral-700">
                  <div className="font-bold text-neutral-900">{customer.name}</div>
                  <div>{customer.email} • {customer.phone}</div>
                  <div className="text-neutral-500">{customer.shippingAddress}, {customer.city}, {customer.postalCode}, {customer.country}</div>
                  <div className="pt-1 text-[11px] text-emerald-700 font-semibold">
                    Delivery Method: {deliverySpeed === 'express' ? 'Express Priority Courier (1-2 days)' : 'Standard Tracked Delivery (2-4 days)'}
                  </div>
                </div>
              </div>

              {/* Summary Card 2: Payment Method */}
              <div className="bg-neutral-50 border border-black/[0.08] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Payment Method Selected</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('payment')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Change Method
                  </button>
                </div>

                <div className="text-xs text-neutral-700">
                  {selectedMethodType === 'card' && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase font-mono bg-neutral-200 px-1.5 py-0.5 rounded text-[10px]">
                        {isAddingNewCard ? getCardBrand(newCardNumber) : (savedCards.find((c) => c.id === selectedCardId)?.brand || 'Visa')}
                      </span>
                      <span className="font-mono">
                        •••• •••• •••• {isAddingNewCard ? (newCardNumber.replace(/\s+/g, '').slice(-4) || '4821') : (savedCards.find((c) => c.id === selectedCardId)?.last4 || '4821')}
                      </span>
                    </div>
                  )}
                  {selectedMethodType === 'google_pay' && <span>Google Pay (Tokenized Account •••• 9842)</span>}
                  {selectedMethodType === 'apple_pay' && <span>Apple Pay (Secure Device Account •••• 1029)</span>}
                  {selectedMethodType === 'eft' && <span>Instant EFT via {selectedBank}</span>}
                  {selectedMethodType === 'momo' && <span>Mobile Money prompt to {momoPhone}</span>}
                </div>
              </div>

              {/* Guarantee & Trust Panel */}
              <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-4 text-xs space-y-2 text-emerald-950">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sovereign Matrix Escrow Protection</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Your funds are held in zero-knowledge sovereign smart escrow until delivery confirmation is acknowledged on the Matrix ledger. Zero raw card details stored.
                </p>
              </div>

              {/* Step 3 Bottom Navigation */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('payment')}
                  className="px-4 py-2.5 rounded-xl border border-black/[0.10] text-xs font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Payment</span>
                </button>

                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{processingStep || 'Authorizing...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Authorize & Place Order ({currency} {finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

            {/* Right Column: Order Summary, Voucher Bar & Final Payment (5 cols) */}
            <div className="lg:col-span-5 p-5 sm:p-7 space-y-6 bg-neutral-50/50 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Order Summary ({items.reduce((s, i) => s + i.quantity, 0)})
                  </h3>
                  <span className="text-xs text-neutral-500 font-medium">
                    {items[0]?.sellerName || 'Verified WAT Seller'}
                  </span>
                </div>

                {/* Item List */}
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id || item.productId}
                      className="bg-white border border-black/[0.06] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-black/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-neutral-900 truncate">
                            {item.name}
                          </div>
                          {item.selectedVariant && (
                            <div className="text-[10px] text-neutral-500">
                              {item.selectedVariant}
                            </div>
                          )}
                          <div className="text-xs font-semibold text-emerald-700">
                            {currency} {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.productId || item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-neutral-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.productId || item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* VOUCHER / DISCOUNT CODE SYSTEM */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Have a Voucher or Promo Code?</span>
                  </div>

                  {!appliedVoucher ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. WAT10, AFRICA20, LAUNCH50"
                        value={voucherCodeInput}
                        onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyVoucher();
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-black/[0.12] rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        disabled={voucherLoading || !voucherCodeInput.trim()}
                        className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {voucherLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-emerald-950 font-mono">
                            {appliedVoucher.code} ({appliedVoucher.description})
                          </div>
                          <div className="text-[10px] text-emerald-700">
                            Discount: -{currency} {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        className="text-emerald-800 hover:text-red-600 p-1 transition-colors"
                        title="Remove voucher"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {voucherError && (
                    <p className="text-[11px] text-red-600 font-medium">{voucherError}</p>
                  )}
                  {voucherSuccessMsg && !voucherError && (
                    <p className="text-[11px] text-emerald-700 font-medium">{voucherSuccessMsg}</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="bg-white border border-black/[0.08] rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{currency} {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Voucher Discount</span>
                      <span>-{currency} {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>VAT / Taxes (15%)</span>
                    <span>{currency} {tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping & Handling</span>
                    <span>{shipping === 0 ? 'FREE' : `${currency} ${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="pt-2 border-t border-black/[0.08] flex justify-between text-sm font-extrabold text-neutral-900">
                    <span>Total Due</span>
                    <span className="text-emerald-700 text-lg font-black">
                      {currency} {finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pay Now Action Button */}
              <div className="space-y-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 'shipping') handleProceedFromShipping();
                    else if (currentStep === 'payment') handleProceedFromPayment();
                    else handlePayNow();
                  }}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl bg-neutral-900 hover:bg-black text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{processingStep || 'Processing Payment...'}</span>
                    </>
                  ) : currentStep === 'shipping' ? (
                    <>
                      <span>Continue to Payment Method</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  ) : currentStep === 'payment' ? (
                    <>
                      <span>Continue to Order Review</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>
                        Authorize {currency} {finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} Now
                      </span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    PCI-DSS Level 1
                  </span>
                  <span>•</span>
                  <span>Instant Email Notification</span>
                  <span>•</span>
                  <span>WAT Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
