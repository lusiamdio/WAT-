import React from 'react';
import {
  ShoppingBag,
  CreditCard,
  DollarSign,
  Truck,
  Percent,
  CheckCircle2,
  AlertCircle,
  Building,
  Smartphone,
  Send,
  Plus,
} from 'lucide-react';
import { WATBusinessSettings } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const CommercePaymentsTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const commerce = settings.catalogCommerce;
  const payments = settings.payments;

  const handleCommerceChange = (key: keyof typeof commerce, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      catalogCommerce: {
        ...prev.catalogCommerce,
        [key]: val,
      },
    }));
  };

  const handlePaymentChange = (key: keyof typeof payments, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      payments: {
        ...prev.payments,
        [key]: val,
      },
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* 3. Catalog & Commerce Settings */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-neutral-100">3. 🛍️ Catalog & In-Chat Cart Settings</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
            COMMERCE ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-200">In-Chat Cart & Checkout</div>
              <p className="text-[11px] text-neutral-500">Allow customers to add items to basket</p>
            </div>
            <button
              type="button"
              onClick={() => handleCommerceChange('enableCart', !commerce.enableCart)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                commerce.enableCart ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  commerce.enableCart ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-200">Display Catalog Prices</div>
              <p className="text-[11px] text-neutral-500">Show price tags publicly</p>
            </div>
            <button
              type="button"
              onClick={() => handleCommerceChange('showPrices', !commerce.showPrices)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                commerce.showPrices ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  commerce.showPrices ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-200">Guest Checkout</div>
              <p className="text-[11px] text-neutral-500">Allow instant purchase without account</p>
            </div>
            <button
              type="button"
              onClick={() => handleCommerceChange('allowGuestCheckout', !commerce.allowGuestCheckout)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                commerce.allowGuestCheckout ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  commerce.allowGuestCheckout ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Shipping and Delivery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-neutral-400" /> Standard Delivery Flat Rate ($)
            </label>
            <input
              type="number"
              value={commerce.deliveryFlatRate}
              onChange={(e) => handleCommerceChange('deliveryFlatRate', parseFloat(e.target.value) || 0)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-neutral-400" /> Free Shipping Threshold ($)
            </label>
            <input
              type="number"
              value={commerce.freeDeliveryThreshold}
              onChange={(e) => handleCommerceChange('freeDeliveryThreshold', parseFloat(e.target.value) || 0)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-neutral-400" /> Default VAT / Sales Tax Rate (%)
            </label>
            <input
              type="number"
              value={commerce.taxRatePercent}
              onChange={(e) => handleCommerceChange('taxRatePercent', parseFloat(e.target.value) || 0)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100"
            />
          </div>
        </div>
      </section>

      {/* 15. Payments & Mobile Money Gateways */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">15. 💳 Mobile Money & Payment Gateways</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">INSTANT SETTLEMENT</span>
        </div>

        {/* Mobile Money Provider Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Configured Payment Providers
            </h4>
            <button
              type="button"
              onClick={() => showToast('New Mobile Money API provider prompt')}
              className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Provider
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {payments.mobileMoneyProviders.map((prov, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-100">{prov.provider}</div>
                    <div className="text-[11px] font-mono text-emerald-400">{prov.accountIdentifier}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      Currencies: {prov.currencies.join(', ')}
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Account Settlement Details */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-neutral-400" />
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Settlement Bank Account
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Bank Name</div>
              <div className="text-xs font-bold text-neutral-200 mt-0.5">
                {payments.bankAccountDetails.bankName}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Account Number</div>
              <div className="text-xs font-mono text-emerald-400 mt-0.5 font-bold">
                {payments.bankAccountDetails.accountNumber}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Account Name</div>
              <div className="text-xs font-bold text-neutral-200 mt-0.5">
                {payments.bankAccountDetails.accountName}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">SWIFT / BIC</div>
              <div className="text-xs font-mono text-amber-300 mt-0.5 font-bold">
                {payments.bankAccountDetails.swiftBic}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
