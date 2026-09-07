import React, { useState } from 'react';
import { WATUserSettings, WalletTransaction } from '../../types/watUserSettings';
import { PaymentMethodsSettings } from './PaymentMethodsSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const PaymentsTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const pay = settings.payments;
  const [showSendModal, setShowSendModal] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSendPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || !recipient.trim()) return;

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      recipient: recipient.trim(),
      amount: num,
      type: 'sent',
      status: 'completed',
      method: pay.defaultMethod === 'mpesa' ? 'M-Pesa Direct' : 'Mobile Money',
      reference: `WAT-P2P-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    updateSettings((prev) => ({
      ...prev,
      payments: {
        ...prev.payments,
        walletBalance: prev.payments.walletBalance - num,
        transactions: [newTx, ...prev.payments.transactions],
      },
    }));

    showToast(`Transferred ${pay.currency} ${num.toLocaleString()} to ${recipient}`);
    setRecipient('');
    setAmount('');
    setShowSendModal(false);
  };

  const handleSaveTab = () => {
    showToast('Payment settings saved');
  };

  return (
    <div className="space-y-6 text-neutral-900 bg-white">
      {/* Direct Bank Cards & Saved Payment Methods Vault */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <PaymentMethodsSettings showToast={showToast} />
      </section>

      {/* Wallet Balance */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Wallet & Balances
          </h2>
          <span className="text-[11px] font-mono text-neutral-500 font-semibold">
            Active Account
          </span>
        </div>

        <div className="p-5 rounded-xl bg-neutral-50 border border-black/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-neutral-600">Available Balance</span>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900 mt-0.5 font-mono">
              {pay.currency} {pay.walletBalance.toLocaleString()}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowSendModal(true)}
              className="px-4 py-2 rounded-lg bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
            >
              Send Money
            </button>
            <button
              type="button"
              onClick={() => showToast('Payment request link copied')}
              className="px-4 py-2 rounded-lg border border-black/[0.15] text-neutral-700 font-semibold text-xs hover:bg-black/[0.04] transition-colors"
            >
              Request Money
            </button>
          </div>
        </div>

        {showSendModal && (
          <form onSubmit={handleSendPayment} className="p-4 rounded-xl bg-white border border-black/[0.12] space-y-3">
            <h3 className="text-xs font-bold text-neutral-900">Send Payment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Recipient name or number"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-black text-white font-semibold text-xs hover:bg-neutral-800"
              >
                Transfer Now
              </button>
              <button
                type="button"
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 rounded-lg border border-black/[0.15] text-neutral-700 font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Linked Accounts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-1">
            <div className="text-xs font-bold text-neutral-900">M-Pesa Express</div>
            <div className="text-xs font-mono text-neutral-600">{pay.mpesaPhone}</div>
            <span className="inline-block px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-semibold">
              Primary
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-1">
            <div className="text-xs font-bold text-neutral-900">Mobile Money</div>
            <div className="text-xs font-mono text-neutral-600">{pay.momoPhone}</div>
            <span className="inline-block px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-semibold">
              Linked
            </span>
          </div>
        </div>

        {/* Transactions */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
            Recent Transactions
          </div>

          {pay.transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-neutral-900">{tx.recipient}</div>
                <div className="text-[11px] text-neutral-500">
                  {tx.date} • {tx.method} • {tx.reference}
                </div>
              </div>

              <div className="text-xs font-bold font-mono text-neutral-900">
                {tx.type === 'received' ? '+' : '-'} {pay.currency} {tx.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Save / Cancel Footer */}
      <div className="flex items-center justify-end gap-2 pt-2 pb-4">
        <button
          type="button"
          onClick={() => showToast('Changes discarded')}
          className="px-4 py-2 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveTab}
          className="px-5 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
