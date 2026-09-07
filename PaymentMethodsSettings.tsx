import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  Lock,
  Building,
  Smartphone,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { SavedPaymentMethod } from '../../types/payment';
import { paymentService } from '../../services/paymentService';
import { soundEngine } from '../../utils/audioSynth';

interface Props {
  showToast?: (msg: string) => void;
}

export const PaymentMethodsSettings: React.FC<Props> = ({ showToast }) => {
  const [methods, setMethods] = useState<SavedPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // New card form
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('12');
  const [expYear, setExpYear] = useState('2028');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('Lusimadio Nkem');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMethods();
  }, []);

  const loadMethods = async () => {
    setIsLoading(true);
    const data = await paymentService.getPaymentMethods();
    setMethods(data);
    setIsLoading(false);
  };

  const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'VISA';
      case 'mastercard':
        return 'MC';
      case 'amex':
        return 'AMEX';
      default:
        return 'CARD';
    }
  };

  const handleCardNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!cardNumber || !cvv || !cardholderName) {
      setError('Please fill in all card details');
      return;
    }

    setIsSubmitting(true);
    const result = await paymentService.addCard({
      cardNumber,
      expMonth: parseInt(expMonth, 10),
      expYear: parseInt(expYear, 10),
      cvv,
      cardholderName,
      isDefault,
    });
    setIsSubmitting(false);

    if (result.success && result.paymentMethod) {
      setMethods((prev) => {
        if (isDefault) {
          return [...prev.map((m) => ({ ...m, isDefault: false })), result.paymentMethod!];
        }
        return [...prev, result.paymentMethod!];
      });
      setIsAdding(false);
      setCardNumber('');
      setCvv('');
      showToast?.('Card securely added and tokenized (PCI-DSS compliant)');
      soundEngine.playChime();
    } else {
      setError(result.error || 'Failed to save card');
    }
  };

  const handleSetDefault = async (id: string) => {
    await paymentService.setDefaultMethod(id);
    setMethods((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
    showToast?.('Default payment method updated');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this saved payment method?')) {
      await paymentService.deletePaymentMethod(id);
      setMethods((prev) => prev.filter((m) => m.id !== id));
      showToast?.('Payment method removed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-neutral-900">
            Saved Payment Methods
          </h3>
          <p className="text-xs text-neutral-500">
            Manage your direct bank cards, Google Pay, Apple Pay, and Instant EFT accounts
          </p>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Bank Card</span>
          </button>
        )}
      </div>

      {/* PCI Compliance Notice */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <span className="font-bold block">PCI-DSS Tokenized Security</span>
          <span className="text-emerald-800 text-[11px]">
            WAT never stores raw 16-digit card numbers or CVV codes. Cards are tokenized into cryptographic vault identifiers for 1-click checkout.
          </span>
        </div>
      </div>

      {/* Add Card Form Modal / Expandable */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddCard}
            className="bg-white border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-neutral-900">Add New Direct Bank Card</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold"
              >
                Cancel
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Card Number (Debit or Credit)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={handleCardNumberInput}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-black/[0.12] rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <CreditCard className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Exp Month
                  </label>
                  <select
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-black/[0.12] rounded-xl text-xs"
                  >
                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Exp Year
                  </label>
                  <select
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-black/[0.12] rounded-xl text-xs"
                  >
                    {[2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-black/[0.12] rounded-xl font-mono text-xs text-center focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-black/[0.12] rounded-xl text-xs focus:bg-white"
                  required
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="accent-emerald-600 rounded"
                />
                <span className="text-neutral-700 font-medium">
                  Set as default payment method for 1-click purchases
                </span>
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border border-black/[0.10] text-neutral-700 text-xs font-semibold hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Tokenizing Card...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Save & Tokenize Card</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Cards List */}
      <div className="space-y-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all flex items-center justify-between gap-4 ${
              method.isDefault
                ? 'border-emerald-600/60 ring-2 ring-emerald-500/10 shadow-xs'
                : 'border-black/[0.08] hover:border-black/[0.15]'
            }`}
          >
            <div className="flex items-center gap-4 min-w-0">
              {/* Card visual badge */}
              <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-800 text-white flex items-center justify-center font-extrabold text-[11px] tracking-wider shrink-0 shadow-xs border border-white/10">
                {getBrandIcon(method.brand)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 font-mono">
                    •••• •••• •••• {method.last4}
                  </span>
                  {method.isDefault && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      Default
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-500">
                  Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear.toString().slice(-2)} • {method.cardholderName}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {!method.isDefault && (
                <button
                  type="button"
                  onClick={() => handleSetDefault(method.id)}
                  className="px-3 py-1.5 rounded-xl border border-black/[0.10] hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors"
                >
                  Make Default
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(method.id)}
                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Remove Card"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {methods.length === 0 && !isLoading && !isAdding && (
          <div className="text-center py-8 border-2 border-dashed border-black/[0.08] rounded-3xl bg-neutral-50/50 space-y-3">
            <CreditCard className="w-10 h-10 text-neutral-400 mx-auto" />
            <div className="text-sm font-bold text-neutral-800">No Saved Payment Methods</div>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Add your bank card to enable 1-click checkout across all WAT products and services.
            </p>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
            >
              Add Bank Card Now
            </button>
          </div>
        )}
      </div>

      {/* Alternative Wallets Status */}
      <div className="pt-3 border-t border-black/[0.06] space-y-3">
        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Connected Wallets & Gateways
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-neutral-50/80 border border-black/[0.06] rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-white border border-black/10 flex items-center justify-center font-bold text-xs">
                G
              </span>
              <div>
                <div className="text-xs font-bold text-neutral-900">Google Pay</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Active & Ready</div>
              </div>
            </div>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="bg-neutral-50/80 border border-black/[0.06] rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                
              </span>
              <div>
                <div className="text-xs font-bold text-neutral-900">Apple Pay</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Supported</div>
              </div>
            </div>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="bg-neutral-50/80 border border-black/[0.06] rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-neutral-700" />
              <div>
                <div className="text-xs font-bold text-neutral-900">Instant EFT</div>
                <div className="text-[10px] text-neutral-500">Capitec, FNB, Nedbank</div>
              </div>
            </div>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
