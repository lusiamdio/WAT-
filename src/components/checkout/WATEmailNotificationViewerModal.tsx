import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ExternalLink,
  Share2,
  Copy,
} from 'lucide-react';
import { EmailNotification } from '../../types/payment';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  email: EmailNotification | null;
}

export const WATEmailNotificationViewerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  email,
}) => {
  if (!isOpen || !email) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://wat.chat/orders/${email.orderId}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/[0.08] overflow-hidden my-auto flex flex-col max-h-[85vh]"
        >
          {/* Top Mail Client Bar */}
          <div className="bg-neutral-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">WAT Transactional Email Center</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Dispatched
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Automated delivery to <span className="text-neutral-200 font-medium">{email.to}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Email Envelope Meta Details */}
          <div className="bg-neutral-50 px-5 py-3 border-b border-black/[0.06] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="text-neutral-600">
                <span className="font-semibold text-neutral-900">From:</span> WAT Secure Commerce &lt;payments@wat.chat&gt;
              </div>
              <div className="text-neutral-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(email.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="text-neutral-600">
              <span className="font-semibold text-neutral-900">Subject:</span> {email.subject}
            </div>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SPF, DKIM, DMARC Verified • TLS 1.3 Dispatched</span>
            </div>
          </div>

          {/* Email Body Content (Rendered HTML) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8fafc]">
            <div
              className="w-full bg-white rounded-2xl shadow-xs border border-black/[0.06] overflow-hidden"
              dangerouslySetInnerHTML={{ __html: email.html }}
            />
          </div>

          {/* Footer controls */}
          <div className="p-4 bg-white border-t border-black/[0.06] flex items-center justify-between">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl border border-black/[0.10] hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Order Link</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs"
            >
              Close Viewer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
