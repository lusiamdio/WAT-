import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Download,
  ShoppingBag,
  ExternalLink,
  Mail,
  ShieldCheck,
  CreditCard,
  Building,
  Smartphone,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Printer,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, EmailNotification } from '../../types/payment';
import { soundEngine } from '../../utils/audioSynth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  emailNotification: EmailNotification | null;
  onViewEmail: (email: EmailNotification) => void;
  onContinueShopping: () => void;
  onOpenChatWithSeller?: (sellerName: string) => void;
}

export const WATPaymentSuccessModal: React.FC<Props> = ({
  isOpen,
  onClose,
  order,
  emailNotification,
  onViewEmail,
  onContinueShopping,
  onOpenChatWithSeller,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playChime();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10B981', '#34D399', '#3B82F6', '#F59E0B'],
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-black/[0.08] overflow-hidden my-auto"
        >
          {/* Top Banner with animated emerald gradient */}
          <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 text-center overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-lg mb-4 text-white"
            >
              <CheckCircle2 className="w-9 h-9 sm:w-12 sm:h-12 text-white fill-emerald-500" />
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-2 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WAT Verified Settlement</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
              Payment Successful!
            </h2>
            <p className="text-emerald-100 text-sm max-w-md mx-auto">
              Your transaction has been verified. A confirmed receipt was automatically dispatched to your email.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
            {/* Automated Email Notification Badge */}
            {emailNotification && (
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <span>Receipt Dispatched</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-xs text-emerald-800 truncate">
                      Sent to <span className="font-semibold">{emailNotification.to}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onViewEmail(emailNotification)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs flex items-center gap-1"
                >
                  <span>View Email</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Order & Transaction Details Card */}
            <div className="bg-neutral-50/80 border border-black/[0.06] rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block">Order Number</span>
                  <span className="font-mono font-bold text-neutral-900 text-sm">
                    {order.orderId}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 block">Transaction Reference</span>
                  <span className="font-mono font-semibold text-neutral-800 text-xs truncate block">
                    {order.transactionId}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Payment Method</span>
                  <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate">{order.paymentMethodLabel}</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 block">Seller / Merchant</span>
                  <span className="font-semibold text-neutral-900 truncate block">
                    {order.sellerName}
                  </span>
                </div>
              </div>

              {/* Items list */}
              <div className="pt-3 border-t border-black/[0.06] space-y-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                  Purchased Items ({order.items.length})
                </span>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded-lg object-cover border border-black/10 shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-semibold text-neutral-900">{item.name}</span>
                        {item.quantity > 1 && (
                          <span className="text-neutral-500 ml-1">×{item.quantity}</span>
                        )}
                        {item.selectedVariant && (
                          <span className="text-[10px] text-neutral-500 block">
                            Variant: {item.selectedVariant}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900 shrink-0 ml-2">
                      {order.currency} {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial summary breakdown */}
              <div className="pt-3 border-t border-black/[0.06] space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{order.currency} {order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount Applied</span>
                    <span>-{order.currency} {order.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>VAT / Taxes (15%)</span>
                  <span>{order.currency} {order.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping & Delivery</span>
                  <span>{order.shipping === 0 ? 'FREE' : `${order.currency} ${order.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-black/[0.08]">
                  <span>Total Settled</span>
                  <span className="text-emerald-700 font-black text-base">
                    {order.currency} {order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-100/70 p-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Protected by WAT 256-bit E2E encrypted Matrix Synapse transaction log and buyer protection guarantee.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onContinueShopping();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-3 rounded-xl border border-black/[0.12] hover:bg-neutral-100 text-neutral-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Print Receipt</span>
                </button>

                {onOpenChatWithSeller && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenChatWithSeller(order.sellerName);
                    }}
                    className="py-2.5 px-3 rounded-xl border border-black/[0.12] hover:bg-neutral-100 text-neutral-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Contact Seller</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
