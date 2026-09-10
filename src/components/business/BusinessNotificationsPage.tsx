import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  CreditCard,
  AlertTriangle,
  UserCheck,
  FileCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { BusinessNotification } from './businessTypes';

interface Props {
  notifications: BusinessNotification[];
  onBack: () => void;
  onMarkAllAsRead: () => void;
  onSelectNotification?: (notification: BusinessNotification) => void;
}

export const BusinessNotificationsPage: React.FC<Props> = ({
  notifications,
  onBack,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'payment' | 'inventory' | 'customer'>('all');

  const getIcon = (type: BusinessNotification['type']) => {
    switch (type) {
      case 'payment':
        return { icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'inventory':
        return { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'customer':
        return { icon: UserCheck, color: 'text-purple-600 bg-purple-50 border-purple-200' };
      case 'system':
      default:
        return { icon: FileCheck, color: 'text-blue-600 bg-blue-50 border-blue-200' };
    }
  };

  const filtered = notifications.filter((n) => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

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
              <span className="text-emerald-600">Notifications</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Business Alerts & Order Feed
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="px-4 py-2 rounded-2xl bg-white border border-black/[0.08] hover:bg-neutral-50 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark All as Read</span>
            </button>
          )}
          <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
            {unreadCount} Unread
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'payment', label: 'Payments & Revenue' },
          { id: 'inventory', label: 'Inventory & Stock' },
          { id: 'customer', label: 'Customer Inquiries' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-black text-white shadow-xs'
                : 'bg-white border border-black/[0.06] text-neutral-600 hover:text-black hover:bg-neutral-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-black/[0.06]">
            <Bell className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-neutral-800">No alerts in this category</h4>
            <p className="text-xs text-neutral-400 mt-1">
              You're all caught up on operational notifications.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const { icon: Icon, color } = getIcon(item.type);
            return (
              <div
                key={item.id}
                onClick={() => onSelectNotification && onSelectNotification(item)}
                className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 cursor-pointer group bg-white ${
                  item.unread
                    ? 'border-emerald-300/80 shadow-xs bg-emerald-50/10 hover:border-emerald-400'
                    : 'border-black/[0.06] hover:border-black/20 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-neutral-900 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h4>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed max-w-xl">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-neutral-400">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="self-center">
                  <div className="p-2 rounded-xl bg-neutral-50 group-hover:bg-black group-hover:text-white transition-all text-neutral-400">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
