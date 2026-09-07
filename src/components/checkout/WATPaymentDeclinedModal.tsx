import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  RotateCcw,
  CreditCard,
  Mail,
  X,
  ShieldAlert,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { EmailNotification } from '../../types/payment';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  emailNotification: EmailNotification | null;
  onViewEmail?: (email: EmailNotification) => void;
  onRetryWithDifferentMethod: () => void;
}

export const WATPaymentDeclinedModal: React.FC<Props> = ({
  isOpen,
  onClose,
  errorMessage,
  orderId,
  amount,
  currency = 'ZAR',
  emailNotification,
  onViewEmail,
  onRetryWithDifferentMethod,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-black/[0.08] overflow-hidden my-auto"
        >
          {/* Top Banner with Red gradient */}
          <div className="relative bg-gradient-to-br from-red-600 via-rose-700 to-red-800 text-white p-6 sm:p-8 text-center overflow-hidden">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-lg mb-4 text-white">
              <AlertTriangle className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
              Payment Unsuccessful
            </h2>
            <p className="text-red-100 text-sm max-w-sm mx-auto">
              We were unable to complete your transaction with the selected payment method.
            </p>
          </div>

          <div className="p-6 sm:p-7 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* Error reason card */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-1.5">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
                Decline Reason
              </span>
              <p className="text-sm font-semibold text-red-950">
                {errorMessage || 'Your financial institution declined the transaction. Please check your available balance or use another card.'}
              </p>
              {orderId && (
                <span className="text-xs text-red-600 font-mono block pt-1">
                  Attempt Reference: {orderId}
                </span>
              )}
            </div>

            {/* Email notice badge */}
            {emailNotification && (
              <div className="bg-neutral-50 border border-black/[0.08] rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-neutral-900">
                      Declined Alert Email Dispatched
                    </div>
                    <p className="text-xs text-neutral-500 truncate">
                      Sent to {emailNotification.to}
                    </p>
                  </div>
                </div>
                {onViewEmail && (
                  <button
                    type="button"
                    onClick={() => onViewEmail(emailNotification)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Common troubleshooting tips */}
            <div className="space-y-2 text-xs text-neutral-600">
              <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-neutral-500" />
                <span>How to resolve this:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                <li>Verify your card details, CVV, and billing address.</li>
                <li>Try selecting Google Pay, Apple Pay, or Instant EFT transfer.</li>
                <li>Ensure international/online transactions are enabled with your bank.</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRetryWithDifferentMethod();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Another Payment Method</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl border border-black/[0.12] hover:bg-neutral-100 text-neutral-800 text-xs font-semibold transition-colors"
              >
                Cancel and Return to Shopping
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
