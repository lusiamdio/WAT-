import React, { useState } from 'react';
import {
  ArrowLeft,
  Receipt,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  Building2,
  User,
  CreditCard,
  MessageCircle,
  Copy,
  Check,
  FileText,
  Printer,
} from 'lucide-react';
import { BusinessActivity } from './businessTypes';
import { useChat } from '../../context/ChatContext';

interface Props {
  activity: BusinessActivity;
  onBack: () => void;
}

export const BusinessTransactionDetailPage: React.FC<Props> = ({
  activity,
  onBack,
}) => {
  const { setActiveTab } = useChat();
  const [copied, setCopied] = useState(false);

  const referenceId = activity.referenceId || 'TXN-WAT-2026-98124';

  const copyRef = () => {
    navigator.clipboard?.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-black/[0.08] hover:bg-neutral-100 text-neutral-800 transition-colors shadow-xs group"
            title="Back to Business Dashboard"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400">
              <span>Business Suite</span>
              <span>/</span>
              <span>Ledger</span>
              <span>/</span>
              <span className="text-emerald-600">Receipt Details</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Transaction & Settlement Statement
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-2xl bg-white border border-black/[0.08] hover:bg-neutral-50 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span>Print Receipt</span>
          </button>
          <button
            type="button"
            onClick={copyRef}
            className="px-4 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Ref' : 'Copy Reference'}</span>
          </button>
        </div>
      </div>

      {/* Main Printable Receipt Card */}
      <div className="bg-white rounded-3xl border border-black/[0.08] shadow-sm p-6 sm:p-10 space-y-8">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-black/[0.06]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs">
                WAT
              </div>
              <span className="text-base font-black text-neutral-900">
                WAT Sovereign Matrix Commerce
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Decentralized Peer-to-Peer Ledger & Mobile Money Escrow
            </p>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activity.status || 'Settled'}</span>
            </span>
            <div className="text-xs font-mono text-neutral-400">
              Ref: <span className="text-neutral-900 font-bold">{referenceId}</span>
            </div>
          </div>
        </div>

        {/* Big Amount Centerpiece */}
        <div className="text-center py-6 bg-neutral-50 rounded-3xl border border-black/[0.04] space-y-1">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Total Settled Amount
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-neutral-900">
            {activity.amount || '$120.00 USD'}
          </div>
          <p className="text-xs text-neutral-500">
            {activity.description || 'Artisan catalog order & settlement'}
          </p>
        </div>

        {/* Key Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-2">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Customer / Counterparty
            </div>
            <div className="text-sm font-black text-neutral-900">
              {activity.customer || 'Kwame Mensah'}
            </div>
            <div className="text-xs font-mono text-neutral-500">
              @kwame:wat.chat
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Settlement Gateway
            </div>
            <div className="text-sm font-black text-neutral-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>{activity.method || 'M-Pesa Mobile Money'}</span>
            </div>
            <div className="text-xs text-neutral-500">
              Zero-Commission Matrix Channel
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Timestamp & Date
            </div>
            <div className="text-sm font-black text-neutral-900">
              {activity.timestamp || 'Today at 14:32 EAT'}
            </div>
            <div className="text-xs text-neutral-500">
              Matrix Event ID: $evt_7f8a92...
            </div>
          </div>
        </div>

        {/* Itemized Breakdown Table */}
        <div className="border border-black/[0.06] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-neutral-50 text-xs font-bold text-neutral-600 border-b border-black/[0.06] grid grid-cols-12">
            <div className="col-span-8">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          <div className="p-4 space-y-3 text-xs font-medium text-neutral-800">
            <div className="grid grid-cols-12 items-center">
              <div className="col-span-8 font-bold text-neutral-900">
                {activity.title}
                <div className="text-[11px] text-neutral-400 font-normal">
                  Authentic certified artisan product dispatched with tracking.
                </div>
              </div>
              <div className="col-span-2 text-center font-mono font-bold">1</div>
              <div className="col-span-2 text-right font-mono font-bold">
                {activity.amount || '$120.00'}
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.04] grid grid-cols-12 text-neutral-500">
              <div className="col-span-10">Cross-Border Settlement Fee</div>
              <div className="col-span-2 text-right font-mono text-emerald-600 font-bold">$0.00</div>
            </div>

            <div className="grid grid-cols-12 text-neutral-500">
              <div className="col-span-10">VAT / Statutory Local Tax (0% Export)</div>
              <div className="col-span-2 text-right font-mono text-neutral-900 font-bold">$0.00</div>
            </div>

            <div className="pt-3 border-t border-black/[0.08] grid grid-cols-12 text-sm font-black text-neutral-900">
              <div className="col-span-10">Total Paid</div>
              <div className="col-span-2 text-right font-mono">{activity.amount || '$120.00'}</div>
            </div>
          </div>
        </div>

        {/* Megolm End-to-End Cryptographic Proof */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <strong className="font-bold">Cryptographically Verified by WAT Matrix Hub:</strong> This transaction receipt is immutably anchored into your private federated Matrix event room with Megolm encryption. Both buyer and seller retain non-repudiable transaction proofs.
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-black/[0.06]">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-black/[0.08] hover:bg-neutral-50 text-neutral-800 text-xs font-bold transition-colors"
          >
            ← Return to Dashboard
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('chats')}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Counterparty</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
