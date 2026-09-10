import React, { useState } from 'react';
import {
  ArrowLeft,
  Users,
  Search,
  Plus,
  Crown,
  CreditCard,
  MessageCircle,
  MapPin,
  ExternalLink,
  Phone,
  Calendar,
  Sparkles,
  DollarSign,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_BUSINESS_CUSTOMERS } from './businessData';
import { BusinessCustomer } from './businessTypes';
import { useChat } from '../../context/ChatContext';

interface Props {
  onBack: () => void;
}

export const BusinessCustomerPage: React.FC<Props> = ({ onBack }) => {
  const { setActiveTab } = useChat();
  const [customers, setCustomers] = useState<BusinessCustomer[]>(INITIAL_BUSINESS_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'vip' | 'regular' | 'wholesale'>('all');

  // In-page New Customer Form toggle
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const [newCity, setNewCity] = useState('Nairobi, Kenya');
  const [newTier, setNewTier] = useState<'vip' | 'regular' | 'wholesale'>('vip');
  const [newGateway, setNewGateway] = useState('M-Pesa');
  const [newNotes, setNewNotes] = useState('');

  const filtered = customers.filter((c) => {
    if (tierFilter !== 'all' && c.tier !== tierFilter) return false;
    if (
      searchQuery &&
      !c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.handle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.city.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalSpent = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalOrders = customers.reduce((acc, c) => acc + c.ordersCount, 0);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCust: BusinessCustomer = {
      id: `cust_${Date.now()}`,
      name: newName.trim(),
      handle: newHandle.trim() || `@${newName.toLowerCase().replace(/\s+/g, '')}:wat.chat`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: newCity || 'Nairobi, Kenya',
      totalSpent: 0,
      ordersCount: 0,
      lastOrderDate: 'Just now',
      preferredPayment: newGateway,
      tier: newTier,
    };

    setCustomers([newCust, ...customers]);
    setNewName('');
    setNewHandle('');
    setNewNotes('');
    setIsAddingNew(false);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Top Page Header */}
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
              <span className="text-emerald-600">Customers & CRM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Customer & CRM Directory
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingNew ? 'Close Form' : 'New Customer'}</span>
          </button>
        </div>
      </div>

      {/* CRM Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Clients</div>
          <div className="text-xl font-black font-mono text-neutral-900 mt-1">{customers.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Lifetime Revenue</div>
          <div className="text-xl font-black font-mono text-emerald-600 mt-1">${totalSpent.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Orders</div>
          <div className="text-xl font-black font-mono text-neutral-900 mt-1">{totalOrders}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">VIP Tier Share</div>
          <div className="text-xl font-black font-mono text-purple-600 mt-1">
            {Math.round((customers.filter((c) => c.tier === 'vip').length / customers.length) * 100)}%
          </div>
        </div>
      </div>

      {/* In-page Add Customer Form */}
      {isAddingNew && (
        <form
          onSubmit={handleAddCustomer}
          className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-emerald-500/20 shadow-md space-y-4 animate-scale"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-neutral-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Register New Client Profile</span>
            </h3>
            <span className="text-xs text-neutral-400 font-medium">Automatic Matrix Profile Sync</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Aissatou Diallo"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-black/[0.08] text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Matrix Handle / Phone</label>
              <input
                type="text"
                value={newHandle}
                onChange={(e) => setNewHandle(e.target.value)}
                placeholder="@handle:wat.chat"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-black/[0.08] text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Location / City</label>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="e.g. Dakar, Senegal"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-black/[0.08] text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Customer Tier</label>
              <select
                value={newTier}
                onChange={(e) => setNewTier(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-black/[0.08] text-xs font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="vip">VIP Buyer</option>
                <option value="wholesale">Wholesale Partner</option>
                <option value="regular">Standard Customer</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Preferred Gateway</label>
              <select
                value={newGateway}
                onChange={(e) => setNewGateway(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-black/[0.08] text-xs font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="M-Pesa">M-Pesa (Kenya / TZ)</option>
                <option value="MTN MoMo">MTN MoMo (Ghana / Uganda)</option>
                <option value="Wave">Wave (Senegal / CI)</option>
                <option value="Debit Card">Credit / Debit Card</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Private Notes</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Discounts, preferences, packaging notes"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-black/[0.08] text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs"
            >
              Save Customer Profile
            </button>
          </div>
        </form>
      )}

      {/* Search & Tier Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, city, or handle..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-black/[0.08] focus:border-black text-xs font-medium focus:outline-none transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Clients' },
            { id: 'vip', label: 'VIP Clients' },
            { id: 'wholesale', label: 'Wholesale' },
            { id: 'regular', label: 'Standard' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTierFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                tierFilter === tab.id
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white border border-black/[0.06] text-neutral-600 hover:text-black hover:bg-neutral-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cust) => (
          <div
            key={cust.id}
            className="rounded-3xl bg-white border border-black/[0.06] p-5 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={cust.avatar}
                    alt={cust.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-black/10 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-neutral-900">
                        {cust.name}
                      </h4>
                      {cust.tier === 'vip' && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                          <Crown className="w-3 h-3 text-purple-600" />
                          VIP
                        </span>
                      )}
                      {cust.tier === 'wholesale' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                          Wholesale
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400 font-mono mt-0.5">
                      {cust.handle}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black font-mono text-neutral-900">
                    ${cust.totalSpent}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-medium">
                    {cust.ordersCount} orders
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/[0.04] grid grid-cols-2 gap-2 text-xs text-neutral-600">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{cust.city}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate text-emerald-700 font-semibold">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{cust.preferredPaymentMethod}</span>
                </div>
              </div>

              {cust.notes && (
                <p className="mt-3 text-xs text-neutral-500 bg-neutral-50 p-2.5 rounded-xl border border-black/[0.04] leading-relaxed italic">
                  "{cust.notes}"
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('chats')}
                className="flex-1 py-2 px-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`Dispatched payment request link to ${cust.name}`);
                }}
                className="py-2 px-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black transition-all border border-emerald-200 active:scale-95"
              >
                Request Payment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
