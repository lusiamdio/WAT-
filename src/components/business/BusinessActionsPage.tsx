import React from 'react';
import {
  ArrowLeft,
  PackagePlus,
  Receipt,
  Sparkles,
  CalendarPlus,
  UserPlus,
  Radio,
  ArrowRight,
  ShoppingBag,
  Building2,
  QrCode,
} from 'lucide-react';

interface Props {
  onBack: () => void;
  onAddProduct: () => void;
  onCreateInvoice: () => void;
  onListService: () => void;
  onCreateEvent: () => void;
  onAddCustomer: () => void;
  onSendBroadcast: () => void;
  onScanQR?: () => void;
}

export const BusinessActionsPage: React.FC<Props> = ({
  onBack,
  onAddProduct,
  onCreateInvoice,
  onListService,
  onCreateEvent,
  onAddCustomer,
  onSendBroadcast,
  onScanQR,
}) => {
  const actions = [
    ...(onScanQR
      ? [
          {
            id: 'scan_qr_pay',
            title: 'Scan QR & Accept Payment',
            desc: 'Point camera at customer QR code or present your Till point for instant zero-fee settlement.',
            badge: 'Instant POS',
            icon: QrCode,
            iconColor: 'bg-emerald-600 text-white',
            onClick: onScanQR,
          },
        ]
      : []),
    {
      id: 'add_product',
      title: 'List New Product',
      desc: 'Add artisan physical goods, define stock & sync instant Mobile Money checkout.',
      badge: 'Catalog',
      icon: PackagePlus,
      iconColor: 'bg-emerald-600 text-white',
      onClick: onAddProduct,
    },
    {
      id: 'create_invoice',
      title: 'Create Instant Invoice',
      desc: 'Generate pro-forma or VAT invoice with zero-fee Matrix escrow and M-Pesa QR.',
      badge: 'Payments',
      icon: Receipt,
      iconColor: 'bg-black text-white',
      onClick: onCreateInvoice,
    },
    {
      id: 'add_customer',
      title: 'Register VIP Client',
      desc: 'Create contact profile, assign VIP tier, lifetime value & preferred payout channels.',
      badge: 'CRM',
      icon: UserPlus,
      iconColor: 'bg-purple-600 text-white',
      onClick: onAddCustomer,
    },
    {
      id: 'list_service',
      title: 'Offer Professional Service',
      desc: 'Publish consulting, artisan masterclasses, tailoring or logistics rates to directory.',
      badge: 'Services',
      icon: Sparkles,
      iconColor: 'bg-amber-600 text-white',
      onClick: onListService,
    },
    {
      id: 'create_event',
      title: 'Host Trade Event or Summit',
      desc: 'Register a craft showcase, pop-up runway, or business workshop with attendee RSVP.',
      badge: 'Community',
      icon: CalendarPlus,
      iconColor: 'bg-blue-600 text-white',
      onClick: onCreateEvent,
    },
    {
      id: 'send_broadcast',
      title: 'Send Campaign Broadcast',
      desc: 'Blast promotional announcements and restock alerts to client lists with opt-out.',
      badge: 'Marketing',
      icon: Radio,
      iconColor: 'bg-rose-600 text-white',
      onClick: onSendBroadcast,
    },
  ];

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
              <span className="text-emerald-600">Create & Publish</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Create & Publish Actions
            </h2>
          </div>
        </div>
      </div>

      {/* Grid of Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className="p-5 rounded-3xl bg-white border border-black/[0.06] hover:border-black/20 hover:shadow-md transition-all text-left flex items-start justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${act.iconColor}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-neutral-900 group-hover:text-black">
                      {act.title}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {act.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              </div>

              <div className="self-center">
                <div className="p-2 rounded-xl bg-neutral-50 group-hover:bg-black group-hover:text-white transition-all text-neutral-400">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
