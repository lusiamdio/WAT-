import React, { useState } from 'react';
import {
  Tag,
  Users,
  Plus,
  Trash2,
  Edit2,
  Filter,
  Download,
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { WATBusinessSettings, CustomerLabel, CustomerContact } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const LabelsAndCustomersTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const labels = settings.labels;
  const customers = settings.customers;

  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#EC4899');
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelName.trim()) return;

    const newLbl: CustomerLabel = {
      id: `lbl-${Date.now()}`,
      name: newLabelName.trim(),
      color: newLabelColor,
      icon: 'Tag',
      count: 0,
      isSystem: false,
    };

    updateSettings((prev) => ({
      ...prev,
      labels: [...prev.labels, newLbl],
    }));

    setNewLabelName('');
    setIsAddingLabel(false);
    showToast(`Label "${newLbl.name}" created!`);
  };

  const handleDeleteLabel = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      labels: prev.labels.filter((l) => l.id !== id),
    }));
    showToast('Label removed');
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch) ||
      c.tags.some((t) => t.toLowerCase().includes(customerSearch.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fade-in text-neutral-900">
      {/* Customer & Transaction Labels */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Customer & Order Labels ({labels.length})</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Organize chats and customers into clear operational pipelines with automatic assignment rules.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingLabel(!isAddingLabel)}
            className="px-3.5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingLabel ? 'Cancel' : 'New Custom Label'}</span>
          </button>
        </div>

        {isAddingLabel && (
          <form onSubmit={handleAddLabel} className="p-4 rounded-2xl bg-white shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Create Custom Label</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-neutral-600 font-bold">Label Name</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Wholesale Dubai"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-xs text-neutral-900 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-600 font-bold">Accent Color</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={newLabelColor}
                    onChange={(e) => setNewLabelColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-neutral-600">{newLabelColor}</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm"
            >
              Create Label
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {labels.map((lbl) => (
            <div
              key={lbl.id}
              className="p-3 rounded-2xl bg-white shadow-sm flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: lbl.color }}
                />
                <div className="truncate">
                  <div className="text-xs font-bold text-neutral-900 truncate">{lbl.name}</div>
                  {lbl.autoAssignRule && (
                    <div className="text-[9px] text-neutral-500 truncate">
                      Auto: {lbl.autoAssignRule}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] font-mono font-bold text-neutral-600 bg-white px-1.5 py-0.5 rounded shadow-xs">
                  {lbl.count}
                </span>
                {!lbl.isSystem && (
                  <button
                    type="button"
                    onClick={() => handleDeleteLabel(lbl.id)}
                    className="p-1 text-neutral-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customers & Contacts Management */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Customers & Contacts Directory</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Customer lifetime value, notes, tags, and automated segmentation profiles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast('Exporting customer CSV database...')}
              className="px-3 py-1.5 rounded-xl bg-white shadow-sm hover:bg-neutral-50 text-neutral-800 text-xs font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Import customer contacts dialog...')}
              className="px-3 py-1.5 rounded-xl bg-white shadow-sm hover:bg-neutral-50 text-neutral-800 text-xs font-semibold flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, phone, or label tag..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white shadow-sm rounded-2xl text-xs text-neutral-900 outline-none"
          />
        </div>

        <div className="space-y-3">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="p-4 rounded-2xl bg-white shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={cust.avatar}
                  alt={cust.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/60"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">{cust.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {cust.segment}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono mt-0.5">
                    <span>{cust.phone}</span>
                    <span>•</span>
                    <span>{cust.email}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {cust.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-white text-[10px] font-semibold text-neutral-700 shadow-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0">
                <div className="text-right">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Orders / Spend</div>
                  <div className="text-xs font-bold text-neutral-900">
                    {cust.totalOrders} orders (${cust.totalSpend})
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Active {cust.lastInteraction}</div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast(`Opened customer dossier for ${cust.name}`)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-900 shadow-xs"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
