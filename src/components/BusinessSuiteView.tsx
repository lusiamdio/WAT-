import React, { useState } from 'react';
import {
  CreditCard,
  ShoppingBag,
  Plus,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  PackageCheck,
  Send,
  Brain,
  Bot,
  Tag,
  Shield,
  Share2,
  Settings,
  Building2,
  MessageSquare,
  Users,
  Radio,
  BarChart3,
  Calendar,
  Lock,
  Bell,
  HardDrive,
  Code,
  Globe,
  ChevronRight,
  Sliders,
  Search,
  Filter,
  Check,
  ArrowUpRight,
  Receipt,
  FileText,
  Clock,
  Sparkles,
  QrCode,
  Camera,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { ProductInfo } from '../types';
import { AddProductPage } from './business/AddProductPage';
import { ShareProductPage } from './business/ShareProductPage';
import { BusinessDiscoverPage } from './business/BusinessDiscoverPage';
import { BusinessEventsPage } from './business/BusinessEventsPage';
import { BusinessMarketplacePage } from './business/BusinessMarketplacePage';
import { BusinessCustomerPage } from './business/BusinessCustomerPage';
import { BusinessTransactionDetailPage } from './business/BusinessTransactionDetailPage';
import { BusinessNotificationsPage } from './business/BusinessNotificationsPage';
import { BusinessActionsPage } from './business/BusinessActionsPage';
import { BusinessScanQRPage } from './business/BusinessScanQRPage';
import { SettingsSectionId } from './business/BusinessSettingsModal';
import { BusinessHeroCard } from './business/BusinessHeroCard';
import { BusinessActionCards } from './business/BusinessActionCards';
import { BusinessKpiOverview } from './business/BusinessKpiOverview';
import { BusinessRecentActivity } from './business/BusinessRecentActivity';
import {
  INITIAL_BUSINESS_ACTIVITIES,
  INITIAL_BUSINESS_NOTIFICATIONS,
} from './business/businessData';
import { BusinessActivity, BusinessNotification } from './business/businessTypes';

interface BusinessSettingCard {
  id: SettingsSectionId;
  label: string;
  categoryNumber: string;
  icon: React.ElementType;
  badge: string;
  description: string;
}

const BUSINESS_SETTINGS_LIST: BusinessSettingCard[] = [
  {
    id: 'profile_account',
    label: 'Business Profile & Account',
    categoryNumber: '1, 25, 28',
    icon: Building2,
    badge: 'Verified',
    description: 'Name, address, catalog link, working hours, verified badge & Matrix ID',
  },
  {
    id: 'messaging_tools',
    label: 'Messaging & Quick Replies',
    categoryNumber: '2',
    icon: MessageSquare,
    badge: '4 Quick Replies',
    description: 'Greeting, away message, quick reply templates (/price, /momo) & auto-dispatch',
  },
  {
    id: 'commerce_payments',
    label: 'Commerce & Mobile Money',
    categoryNumber: '3, 15',
    icon: ShoppingBag,
    badge: 'M-Pesa / MoMo',
    description: 'In-chat cart, delivery flat rates, instant Mobile Money & settlement accounts',
  },
  {
    id: 'labels_org',
    label: 'Customer & Order Labels',
    categoryNumber: '4',
    icon: Tag,
    badge: '14 Labels',
    description: 'Color-coded tags, VIP, pending payment, dispatched & auto-assignment rules',
  },
  {
    id: 'customers_contacts',
    label: 'Customers & CRM Directory',
    categoryNumber: '5',
    icon: Users,
    badge: '3 Profiles',
    description: 'Customer segmentation, lifetime value, private notes & contact export',
  },
  {
    id: 'broadcast_marketing',
    label: 'Broadcast & Marketing Campaigns',
    categoryNumber: '6',
    icon: Radio,
    badge: 'Campaigns',
    description: 'Promotional messages, flash sales, scheduled broadcasts & compliance opt-out',
  },
  {
    id: 'automation_rules',
    label: 'Business Automation & Keywords',
    categoryNumber: '7',
    icon: Bot,
    badge: 'Rules Active',
    description: 'Auto-reply triggers, custom keywords, out-of-office schedules & fallback routing',
  },
  {
    id: 'team_staff',
    label: 'Team Members & Staff Roles',
    categoryNumber: '8',
    icon: Shield,
    badge: '3 Staff',
    description: 'Manager, Support Agent & Catalog Operator roles with granular RBAC permissions',
  },
  {
    id: 'ai_assistant',
    label: 'WAT AI Business Copilot',
    categoryNumber: '9, 10, 11',
    icon: Brain,
    badge: 'Gemini 2.5',
    description: 'Multilingual smart catalog answers, African local slang, tone & knowledge base',
  },
  {
    id: 'analytics_growth',
    label: 'Analytics, Reports & Targets',
    categoryNumber: '12',
    icon: BarChart3,
    badge: 'Growth Metrics',
    description: 'Message delivery rates, catalog conversion funnels, revenue & CSV export',
  },
  {
    id: 'documents_appointments',
    label: 'Documents, VAT & Bookings',
    categoryNumber: '13',
    icon: Calendar,
    badge: 'Invoices Active',
    description: 'Official VAT receipts, pro-forma estimates, service bookings & calendar sync',
  },
  {
    id: 'privacy_security',
    label: 'Security & POPIA Compliance',
    categoryNumber: '14',
    icon: Lock,
    badge: 'POPIA Ready',
    description: 'E2EE Megolm encryption, biometric unlock, audit trails & privacy compliance',
  },
  {
    id: 'notifications_calls',
    label: 'Order Alerts & Audio Channels',
    categoryNumber: '15',
    icon: Bell,
    badge: 'Urgent Only',
    description: 'Instant Mobile Money alert chimes, ringtones & WebRTC business hotline routing',
  },
  {
    id: 'chats_storage_devices',
    label: 'Storage & Linked POS Registers',
    categoryNumber: '16, 17',
    icon: HardDrive,
    badge: 'Cloud Sync',
    description: 'Enterprise backups, register POS tablets & offline local device cache',
  },
  {
    id: 'integrations_dev_api',
    label: 'Webhooks & Matrix APIs',
    categoryNumber: '18, 19, 20',
    icon: Code,
    badge: 'MSC REST',
    description: 'Shopify, WooCommerce, ERP webhooks & sovereign Matrix bot access tokens',
  },
  {
    id: 'language_appearance_legal',
    label: 'Language & Brand Appearance',
    categoryNumber: '21, 22, 23, 24',
    icon: Globe,
    badge: 'Multi-lingual',
    description: 'African language packs (Swahili, Zulu, Yoruba), brand theme & compliance',
  },
];

export const BusinessSuiteView: React.FC = () => {
  const {
    products,
    shareProductInChat,
    createInvoiceInChat,
    setActiveTab,
    openBusinessSettings,
    openProductCheckout,
    openInvoiceCheckout,
  } = useChat();

  // Navigation State
  const [activeSubTab, setActiveSubTab] = useState<
    | 'home'
    | 'catalog'
    | 'invoicing'
    | 'analytics'
    | 'settings_hub'
    | 'discover'
    | 'events'
    | 'marketplace'
    | 'customers'
    | 'add_product'
    | 'transaction_detail'
    | 'share_product'
    | 'notifications'
    | 'actions'
    | 'scan_qr'
  >('home');
  const [previousSubTab, setPreviousSubTab] = useState<typeof activeSubTab>('home');

  const navigateTo = (tab: typeof activeSubTab) => {
    setPreviousSubTab(activeSubTab);
    setActiveSubTab(tab);
  };

  const navigateBack = (fallback: typeof activeSubTab = 'home') => {
    setActiveSubTab(previousSubTab || fallback);
  };

  // Invoicing Generator State
  const [invoiceAmount, setInvoiceAmount] = useState('120');
  const [invoiceDesc, setInvoiceDesc] = useState('Custom Handcrafted Textile Order');
  const [invoiceCustomer, setInvoiceCustomer] = useState('Kwame Mensah');
  const [invoiceCurrency, setInvoiceCurrency] = useState<'USD' | 'KES' | 'NGN' | 'GHS' | 'ZAR'>('USD');
  const [invoiceMethod, setInvoiceMethod] = useState<'M-Pesa' | 'MTN MoMo' | 'Card'>('M-Pesa');
  const [createdNotice, setCreatedNotice] = useState(false);
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<'all' | 'settled' | 'pending'>('all');

  // Catalog Filter State
  const [catalogCategory, setCatalogCategory] = useState('All');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Target Product & Activity Selection
  const [shareTargetProduct, setShareTargetProduct] = useState<ProductInfo | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<BusinessActivity | null>(null);

  // Activities & Notifications Feed
  const [activities, setActivities] = useState<BusinessActivity[]>(INITIAL_BUSINESS_ACTIVITIES);
  const [notifications, setNotifications] = useState<BusinessNotification[]>(INITIAL_BUSINESS_NOTIFICATIONS);

  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllNotifsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleProductCreated = (newProduct: ProductInfo) => {
    setShareTargetProduct(newProduct);
    // Also record an activity event
    const newAct: BusinessActivity = {
      id: `act_${Date.now()}`,
      type: 'product_listed',
      title: 'New Product Listed',
      subtitle: `${newProduct.name} added to catalog`,
      amount: `$${newProduct.price}.00`,
      status: 'Active',
      statusColor: 'emerald',
      timestamp: 'Just now',
      items: newProduct.description,
    };
    setActivities([newAct, ...activities]);
    navigateTo('share_product');
  };

  const handleOpenShare = (product: ProductInfo) => {
    setShareTargetProduct(product);
    navigateTo('share_product');
  };

  const handleGenerateAndShareInvoice = () => {
    const amt = parseFloat(invoiceAmount) || 100;
    createInvoiceInChat(
      amt,
      invoiceCurrency as any,
      invoiceDesc,
      invoiceMethod
    );

    // Record activity
    const newAct: BusinessActivity = {
      id: `act_${Date.now()}`,
      type: 'payment_received',
      title: 'Invoice Dispatched',
      subtitle: `${invoiceMethod} link sent to ${invoiceCustomer}`,
      amount: `+$${amt}.00`,
      status: 'Pending',
      statusColor: 'amber',
      timestamp: 'Just now',
      customerName: invoiceCustomer,
      paymentMethod: invoiceMethod,
      items: invoiceDesc,
    };
    setActivities([newAct, ...activities]);

    setCreatedNotice(true);
    setTimeout(() => {
      setCreatedNotice(false);
      setActiveTab('chats');
    }, 1200);
  };

  // Past invoices mock list for Invoicing Tab
  const pastInvoices = [
    {
      id: 'INV-8492-KE',
      customer: 'Brian Kiprono',
      amount: '$340.00',
      currency: 'USD',
      method: 'M-Pesa Express',
      date: 'Today, 2:40 PM',
      status: 'Settled',
      description: '4x Ankara & Leather Laptop Sleeves',
    },
    {
      id: 'INV-7782-NG',
      customer: 'Zainab Al-Mansoor',
      amount: '$85.00',
      currency: 'USD',
      method: 'MTN MoMo',
      date: 'Yesterday, 11:15 AM',
      status: 'Settled',
      description: '1x Kente Statement Jacket (Medium)',
    },
    {
      id: 'INV-9021-GH',
      customer: 'Kwame Mensah',
      amount: '$120.00',
      currency: 'USD',
      method: 'M-Pesa C2B',
      date: '2 days ago',
      status: 'Settled',
      description: 'Handwoven Textile Custom Cut',
    },
    {
      id: 'INV-9104-SN',
      customer: 'Amina Diallo',
      amount: '$45.00',
      currency: 'USD',
      method: 'Wave / Card',
      date: '3 days ago',
      status: 'Pending',
      description: 'Natural Raffia Shopper Tote',
    },
  ];

  const filteredPastInvoices = pastInvoices.filter((inv) => {
    if (invoiceStatusFilter === 'settled') return inv.status === 'Settled';
    if (invoiceStatusFilter === 'pending') return inv.status === 'Pending';
    return true;
  });

  // Filtered Catalog
  const categoriesList = ['All', 'Fashion & Apparel', 'Accessories', 'Bags & Totes', 'Gourmet & Coffee', 'Services'];

  const filteredProducts = products.filter((prod) => {
    if (catalogCategory !== 'All' && prod.category !== catalogCategory) return false;
    if (
      catalogSearch &&
      !prod.name.toLowerCase().includes(catalogSearch.toLowerCase()) &&
      !prod.description.toLowerCase().includes(catalogSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex-1 bg-[#F9FAFB] flex flex-col h-full overflow-y-auto select-none pb-10 text-neutral-900">
      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Sub-Navigation Tabs with Pill-shaped Active Indicator (shown on primary tabs) */}
        {['home', 'catalog', 'invoicing', 'analytics', 'settings_hub'].includes(activeSubTab) && (
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5 p-1 bg-neutral-200/60 rounded-full border border-black/[0.04]">
              {(
                [
                  { id: 'home', label: 'Home' },
                  { id: 'catalog', label: 'Catalog' },
                  { id: 'invoicing', label: 'Invoicing & Pay' },
                  { id: 'analytics', label: 'Analytics' },
                  { id: 'settings_hub', label: 'Settings Hub' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeSubTab === tab.id
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-600 hover:text-black hover:bg-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigateTo('notifications')}
                className="relative p-2 rounded-full bg-white hover:bg-neutral-100 text-neutral-700 hover:text-black border border-black/[0.08] shadow-xs active:scale-95 transition-all"
                title="View Business Notifications & Alerts"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigateTo('scan_qr')}
                className="flex px-3.5 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-black items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                title="Scan QR to Accept Payments"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Scan QR</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('actions')}
                className="flex px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Action</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: HOME (Executive Hub) */}
        {activeSubTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            {/* 3. Hero Section (Discover people, businesses, events & products) */}
            <BusinessHeroCard
              onExploreDiscovery={() => navigateTo('discover')}
              onAddProduct={() => navigateTo('add_product')}
              onScanQR={() => navigateTo('scan_qr')}
            />

            {/* Quick POS Terminal Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900 text-white shadow-md border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-black text-white">Instant QR Checkout & POS</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-neutral-950 uppercase tracking-wider">
                      Zero Fees
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Scan customer wallet QR or display your dynamic Till code for instant settlement.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => navigateTo('scan_qr')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-black flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan QR</span>
                </button>
              </div>
            </div>

            {/* 4. Action Cards (List Product, Find People, Discover Events, Explore Marketplace) */}
            <BusinessActionCards
              onListProduct={() => navigateTo('add_product')}
              onFindPeople={() => navigateTo('discover')}
              onDiscoverEvents={() => navigateTo('events')}
              onExploreMarketplace={() => navigateTo('marketplace')}
            />

            {/* 5. Compact Business Performance Snapshot (Your Business Overview) */}
            <BusinessKpiOverview
              onViewDeepAnalytics={() => setActiveSubTab('analytics')}
            />

            {/* 6. Recent Activity Feed (Banking / Fintech Pattern) */}
            <BusinessRecentActivity
              activities={activities}
              onSelectActivity={(act) => {
                setSelectedActivity(act);
                navigateTo('transaction_detail');
              }}
              onViewAll={() => setActiveSubTab('invoicing')}
            />

            {/* Extra High-Value Touchpoints (Customer CRM & Trade Expos) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-black/[0.06] shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-neutral-900">VIP Customer Directory</h4>
                    <p className="text-xs text-neutral-500">4 active VIP clients • Synced with Matrix CRM</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('customers')}
                  className="px-3.5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  Open CRM
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-black/[0.06] shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-neutral-900">Upcoming Trade Summits</h4>
                    <p className="text-xs text-neutral-500">Pan-African E-Commerce Expo • Kigali 2026</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('events')}
                  className="px-3.5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  View Events
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATALOG (What do I sell?) */}
        {activeSubTab === 'catalog' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Redirect Header for Catalog Settings */}
            <div className="p-4 rounded-3xl bg-white border border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Commerce & Payment Gateway Settings</h4>
                  <p className="text-[11px] text-neutral-500">
                    Configure delivery flat rates, Mobile Money auto-dispatch, in-chat checkout & multi-currencies.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openBusinessSettings('commerce_payments')}
                className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all self-start sm:self-auto shrink-0"
              >
                <span>Edit Settings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Catalog Controls: Search, Category Chips & Add Button */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search catalog products..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-black/[0.08] focus:border-black text-xs font-medium focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  type="button"
                  onClick={() => openBusinessSettings('ai_assistant')}
                  className="px-3.5 py-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center gap-1.5 border border-black/[0.06] transition-all"
                >
                  <Brain className="w-3.5 h-3.5 text-neutral-800" />
                  <span>AI Copilot</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('add_product')}
                  className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCatalogCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    catalogCategory === cat
                      ? 'bg-black text-white'
                      : 'bg-white border border-black/[0.06] text-neutral-600 hover:text-black hover:bg-neutral-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((prod) => {
                const isFree = prod.isFree || prod.price === 0;
                const priceBadge = isFree ? 'FREE' : `${prod.currency} ${prod.price}.00`;

                return (
                  <div
                    key={prod.id}
                    className="rounded-3xl bg-white border border-black/[0.06] overflow-hidden flex flex-col justify-between hover:border-black/20 transition-all shadow-sm hover:shadow-md group"
                  >
                    <div className="relative h-48 bg-neutral-100 overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-mono font-bold shadow-md ${
                          isFree ? 'bg-emerald-600 text-white' : 'bg-black text-white'
                        }`}
                      >
                        {priceBadge}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                            {prod.category}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {prod.inStock ? `Stock: ${prod.stockCount ?? 15}` : 'Out of Stock'}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-neutral-900">{prod.name}</h4>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-black/[0.06] space-y-2">
                        <button
                          type="button"
                          onClick={() => openProductCheckout(prod)}
                          className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Buy Now (WAT Checkout)</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenShare(prod)}
                            className="flex-1 py-2 px-3 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                            title="Share with contacts, groups, or status"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              shareProductInChat(prod);
                              setActiveTab('chats');
                            }}
                            className="p-2 rounded-2xl border border-black/[0.08] hover:border-black text-neutral-700 hover:text-black hover:bg-neutral-50 text-xs font-bold transition-all active:scale-95"
                            title="Send to active conversation"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: INVOICING & COMMERCE (What do customers owe/pay?) */}
        {activeSubTab === 'invoicing' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Redirect for Invoice & Document Settings */}
            <div className="p-4 rounded-3xl bg-white border border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Invoice Templates, VAT & Booking Terms</h4>
                  <p className="text-[11px] text-neutral-500">
                    Edit official tax registration ID, footer payment terms, and booking services in real time.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openBusinessSettings('documents_appointments')}
                className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all self-start sm:self-auto shrink-0"
              >
                <span>Edit Templates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Real-Time Invoice Generator */}
              <div className="lg:col-span-5 bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.06]">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-neutral-900">
                      Create Instant Invoice
                    </h3>
                    <p className="text-[11px] text-neutral-500">Dispatches directly into active chat</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={invoiceCustomer}
                      onChange={(e) => setInvoiceCustomer(e.target.value)}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full mt-1.5 bg-neutral-100 border border-transparent focus:border-black focus:bg-white rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                      Amount & Currency
                    </label>
                    <div className="flex gap-2 mt-1.5">
                      <select
                        value={invoiceCurrency}
                        onChange={(e: any) => setInvoiceCurrency(e.target.value)}
                        className="bg-neutral-100 border border-transparent focus:border-black rounded-2xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="KES">KES (KSh)</option>
                        <option value="NGN">NGN (₦)</option>
                        <option value="GHS">GHS (GH₵)</option>
                        <option value="ZAR">ZAR (R)</option>
                      </select>
                      <input
                        type="number"
                        value={invoiceAmount}
                        onChange={(e) => setInvoiceAmount(e.target.value)}
                        className="flex-1 bg-neutral-100 border border-transparent focus:border-black focus:bg-white rounded-2xl px-4 py-2 text-base font-black text-neutral-900 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                      Itemized Description
                    </label>
                    <input
                      type="text"
                      value={invoiceDesc}
                      onChange={(e) => setInvoiceDesc(e.target.value)}
                      className="w-full mt-1.5 bg-neutral-100 border border-transparent focus:border-black focus:bg-white rounded-2xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                      Payment Provider
                    </label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {(['M-Pesa', 'MTN MoMo', 'Card'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setInvoiceMethod(method)}
                          className={`py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                            invoiceMethod === method
                              ? 'bg-black text-white border-black shadow-sm'
                              : 'bg-neutral-100 border-transparent text-neutral-600 hover:text-black'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {createdNotice && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Invoice generated and sent to active chat!</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGenerateAndShareInvoice}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Mobile Money Invoice</span>
                </button>
              </div>

              {/* Right Column: Invoicing History / Ledger */}
              <div className="lg:col-span-7 bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                  <div>
                    <h3 className="text-base font-black text-neutral-900">
                      Recent Invoices Ledger
                    </h3>
                    <p className="text-xs text-neutral-500">Live settlement tracking & VAT exports</p>
                  </div>

                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                    {(['all', 'settled', 'pending'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setInvoiceStatusFilter(f)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                          invoiceStatusFilter === f
                            ? 'bg-white text-black shadow-xs'
                            : 'text-neutral-500 hover:text-black'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-black/[0.04]">
                  {filteredPastInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => {
                        setSelectedActivity({
                          id: inv.id,
                          type: 'invoice_paid',
                          title: `Invoice ${inv.id}`,
                          subtitle: inv.description,
                          amount: inv.amount,
                          status: inv.status as any,
                          statusColor: inv.status === 'Settled' ? 'emerald' : 'amber',
                          timestamp: inv.date,
                          customerName: inv.customer,
                          referenceId: inv.id,
                          paymentMethod: inv.method,
                          items: inv.description,
                        });
                        navigateTo('transaction_detail');
                      }}
                      className="py-3 px-2 -mx-2 rounded-2xl flex items-center justify-between gap-3 hover:bg-neutral-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-mono text-xs font-bold group-hover:bg-black group-hover:text-white transition-colors">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                            <span>{inv.id}</span>
                            <span className="text-neutral-400 font-normal">• {inv.customer}</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5 truncate max-w-xs">
                            {inv.description}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-black text-neutral-900">
                          {inv.amount}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            inv.status === 'Settled'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-800'
                          }`}>
                            {inv.status}
                          </span>
                          <span className="text-[10px] text-neutral-400">{inv.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS (How is my business performing?) */}
        {activeSubTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Redirect for Analytics Targets */}
            <div className="p-4 rounded-3xl bg-white border border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Analytics Targets & Auto-Export</h4>
                  <p className="text-[11px] text-neutral-500">
                    Configure custom monthly growth targets, automated tax reports, and customer retention alerts.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openBusinessSettings('analytics_growth')}
                className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
              >
                <span>Edit Targets</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* KPI Cards */}
            <BusinessKpiOverview onViewDeepAnalytics={() => {}} />

            {/* Revenue Trend Visual Graph & Payment Gateways Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 30-Day Revenue Trend Chart */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-black/[0.06] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-neutral-900">30-Day Revenue Trend</h4>
                    <p className="text-xs text-neutral-500">Cumulative Mobile Money settlements ($USD)</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    +18.4% MoM
                  </span>
                </div>

                {/* Visual SVG Line/Area Chart */}
                <div className="relative pt-4 pb-2">
                  <svg viewBox="0 0 500 150" className="w-full h-40 overflow-visible">
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d="M0,130 Q60,110 120,120 T240,80 T360,60 T480,20 L480,150 L0,150 Z"
                      fill="url(#revenueGrad)"
                    />
                    {/* Stroke line */}
                    <path
                      d="M0,130 Q60,110 120,120 T240,80 T360,60 T480,20"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Data Points */}
                    {[
                      { cx: 0, cy: 130, val: '$1.2k' },
                      { cx: 120, cy: 120, val: '$1.8k' },
                      { cx: 240, cy: 80, val: '$2.9k' },
                      { cx: 360, cy: 60, val: '$3.8k' },
                      { cx: 480, cy: 20, val: '$4.85k' },
                    ].map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.cx} cy={pt.cy} r="4" fill="#047857" stroke="#ffffff" strokeWidth="2" />
                        <text
                          x={pt.cx}
                          y={pt.cy - 10}
                          textAnchor={i === 4 ? 'end' : i === 0 ? 'start' : 'middle'}
                          className="text-[10px] font-mono fill-neutral-600 font-bold"
                        >
                          {pt.val}
                        </text>
                      </g>
                    ))}
                  </svg>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mt-2 pt-2 border-t border-black/[0.04]">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                    <span>Current</span>
                  </div>
                </div>
              </div>

              {/* Payment Gateways Breakdown */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-black/[0.06] p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-neutral-900">Payment Gateway Distribution</h4>
                <p className="text-xs text-neutral-500">Volume processed per integration channel</p>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mb-1">
                      <span>M-Pesa Express (Kenya / TZ)</span>
                      <span className="font-mono">62% ($3,007.00)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mb-1">
                      <span>MTN Mobile Money (Ghana / UG)</span>
                      <span className="font-mono">24% ($1,164.00)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '24%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mb-1">
                      <span>International Cards & USDC</span>
                      <span className="font-mono">14% ($679.00)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '14%' }} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/[0.04]">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
                    <span>Average Order Value (AOV)</span>
                    <span className="font-mono text-neutral-900">$57.70</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Webhooks Activity Table */}
            <div className="p-6 bg-white border border-black/[0.06] rounded-3xl space-y-3 shadow-sm">
              <h3 className="text-sm font-black text-neutral-900">
                Payment Gateway Settlement Webhooks (Live Ledger)
              </h3>
              <div className="space-y-2 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/[0.04] flex items-center justify-between">
                  <div>
                    <span className="text-neutral-900 font-bold">M-PESA C2B</span>: 12,500 KES from +254712***890
                  </div>
                  <span className="text-emerald-700 font-bold">CONFIRMED (TXN #R89QW2)</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/[0.04] flex items-center justify-between">
                  <div>
                    <span className="text-neutral-900 font-bold">MTN MOMO</span>: 450 GHS from +233244***112
                  </div>
                  <span className="text-emerald-700 font-bold">CONFIRMED (TXN #MM991A)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS HUB (How do I configure my business?) */}
        {activeSubTab === 'settings_hub' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-neutral-900">
                  WAT Business Real-Time Settings Directory
                </h3>
                <p className="text-xs text-neutral-500">
                  Click on any setting module below to edit live configuration, manage rules, and save instantly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BUSINESS_SETTINGS_LIST.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openBusinessSettings(item.id)}
                    className="p-5 rounded-3xl bg-white hover:bg-neutral-50/80 border border-black/[0.06] hover:border-black/20 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-98"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 border border-black/[0.04]">
                          {item.badge}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-neutral-900 group-hover:text-black">
                        {item.label}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs font-bold text-neutral-800 group-hover:text-black">
                      <span>Edit Real-Time Settings</span>
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {/* SUB-PAGE: DISCOVER */}
        {activeSubTab === 'discover' && (
          <BusinessDiscoverPage onBack={() => navigateBack('home')} />
        )}

        {/* SUB-PAGE: EVENTS */}
        {activeSubTab === 'events' && (
          <BusinessEventsPage onBack={() => navigateBack('home')} />
        )}

        {/* SUB-PAGE: MARKETPLACE */}
        {activeSubTab === 'marketplace' && (
          <BusinessMarketplacePage onBack={() => navigateBack('home')} />
        )}

        {/* SUB-PAGE: CUSTOMERS (CRM) */}
        {activeSubTab === 'customers' && (
          <BusinessCustomerPage onBack={() => navigateBack('home')} />
        )}

        {/* SUB-PAGE: ADD PRODUCT */}
        {activeSubTab === 'add_product' && (
          <AddProductPage
            onBack={() => navigateBack('catalog')}
            onProductCreated={handleProductCreated}
          />
        )}

        {/* SUB-PAGE: TRANSACTION & SETTLEMENT STATEMENT */}
        {activeSubTab === 'transaction_detail' && (
          <BusinessTransactionDetailPage
            activity={
              selectedActivity ||
              activities[0] || {
                id: 'tx_default',
                type: 'payment_received',
                title: 'Order Settlement',
                subtitle: 'Payment received via Mobile Money',
                amount: '$120.00',
                status: 'Settled',
                statusColor: 'emerald',
                timestamp: 'Today',
              }
            }
            onBack={() => navigateBack('invoicing')}
          />
        )}

        {/* SUB-PAGE: SHARE PRODUCT */}
        {activeSubTab === 'share_product' && (
          <ShareProductPage
            product={shareTargetProduct || products[0]}
            onBack={() => navigateBack('catalog')}
          />
        )}

        {/* SUB-PAGE: NOTIFICATIONS FEED */}
        {activeSubTab === 'notifications' && (
          <BusinessNotificationsPage
            notifications={notifications}
            onBack={() => navigateBack('home')}
            onMarkAllAsRead={handleMarkAllNotifsRead}
            onSelectNotification={(notif) => {
              if (notif.type === 'payment') {
                navigateTo('invoicing');
              } else if (notif.type === 'inventory') {
                navigateTo('catalog');
              } else if (notif.type === 'customer') {
                navigateTo('customers');
              }
            }}
          />
        )}

        {/* SUB-PAGE: ACTIONS EXECUTIVE HUB */}
        {activeSubTab === 'actions' && (
          <BusinessActionsPage
            onBack={() => navigateBack('home')}
            onAddProduct={() => navigateTo('add_product')}
            onCreateInvoice={() => navigateTo('invoicing')}
            onListService={() => navigateTo('add_product')}
            onCreateEvent={() => navigateTo('events')}
            onAddCustomer={() => navigateTo('customers')}
            onSendBroadcast={() => openBusinessSettings('broadcast_marketing')}
            onScanQR={() => navigateTo('scan_qr')}
          />
        )}

        {/* SUB-PAGE: SCAN QR PAYMENT TERMINAL */}
        {activeSubTab === 'scan_qr' && (
          <BusinessScanQRPage
            onBack={() => navigateBack('home')}
            onPaymentCollected={(activity) => {
              setActivities([activity, ...activities]);
            }}
            onViewTransaction={(activity) => {
              setSelectedActivity(activity);
              navigateTo('transaction_detail');
            }}
          />
        )}
      </main>
    </div>
  );
};
