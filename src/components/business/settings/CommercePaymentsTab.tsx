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
    <div className="space-y-8 animate-fade-in text-neutral-900">
      {/* Catalog & Commerce Settings */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-base font-bold text-neutral-900">Catalog & Cart Settings</h3>
          <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold font-mono">
            ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-900">In-Chat Cart & Checkout</div>
              <p className="text-[11px] text-neutral-500">Allow customers to add items to basket</p>
            </div>
            <button
              type="button"
              onClick={() => handleCommerceChange('enableCart', !commerce.enableCart)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                commerce.enableCart ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  commerce.enableCart ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-900">Display Catalog Prices</div>
              <p className="text-[11px] text-neutral-500">Show price tags publicly</p>
            </div>
            <button
              type="button"
              onClick={() => handleCommerceChange('showPrices', !commerce.showPrices)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                commerce.showPrices ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  commerce.showPrices ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-900">Guest Checkout</div>
              <p className="text-[11px] text-neutral-500">Allow instant purchase without account</p>
            </div>
            <button
              type="button"
              onClick={() => handleCommerceChange('allowGuestCheckout', !commerce.allowGuestCheckout)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                commerce.allowGuestCheckout ? 'bg-black' : 'bg-neutral-300'
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
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Standard Delivery Flat Rate ($)
            </label>
            <input
              type="number"
              value={commerce.deliveryFlatRate}
              onChange={(e) => handleCommerceChange('deliveryFlatRate', parseFloat(e.target.value) || 0)}
              className="w-full mt-1.5 bg-white shadow-sm rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Free Shipping Threshold ($)
            </label>
            <input
              type="number"
              value={commerce.freeDeliveryThreshold}
              onChange={(e) => handleCommerceChange('freeDeliveryThreshold', parseFloat(e.target.value) || 0)}
              className="w-full mt-1.5 bg-white shadow-sm rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Default VAT / Sales Tax Rate (%)
            </label>
            <input
              type="number"
              value={commerce.taxRatePercent}
              onChange={(e) => handleCommerceChange('taxRatePercent', parseFloat(e.target.value) || 0)}
              className="w-full mt-1.5 bg-white shadow-sm rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Payments & Mobile Money Gateways */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-base font-bold text-neutral-900">Payment Gateways & Mobile Money</h3>
          <span className="text-xs font-mono text-neutral-600 font-semibold">INSTANT SETTLEMENT</span>
        </div>

        {/* Mobile Money Provider Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Configured Payment Providers
            </h4>
            <button
              type="button"
              onClick={() => showToast('New Mobile Money API provider prompt')}
              className="text-xs text-black font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Provider
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {payments.mobileMoneyProviders.map((prov, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white shadow-sm transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center shadow-xs">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900">{prov.provider}</div>
                    <div className="text-[11px] font-mono text-neutral-700">{prov.accountIdentifier}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      Currencies: {prov.currencies.join(', ')}
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Account Settlement Details */}
        <div className="pt-4 space-y-3">
          <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
            Settlement Bank Account
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white shadow-sm">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Bank Name</div>
              <div className="text-xs font-bold text-neutral-900 mt-0.5">
                {payments.bankAccountDetails.bankName}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white shadow-sm">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Account Number</div>
              <div className="text-xs font-mono text-neutral-900 mt-0.5 font-bold">
                {payments.bankAccountDetails.accountNumber}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white shadow-sm">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Account Name</div>
              <div className="text-xs font-bold text-neutral-900 mt-0.5">
                {payments.bankAccountDetails.accountName}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white shadow-sm">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">SWIFT / BIC</div>
              <div className="text-xs font-mono text-neutral-900 mt-0.5 font-bold">
                {payments.bankAccountDetails.swiftBic}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
