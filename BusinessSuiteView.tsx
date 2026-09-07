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
  Sparkles,
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
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { ProductInfo } from '../types';
import { AddProductModal } from './business/AddProductModal';
import { ShareProductModal } from './business/ShareProductModal';
import { SettingsSectionId } from './business/BusinessSettingsModal';

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
    description: 'Keyword triggers, instant FAQ answers & smart staff team routing',
  },
  {
    id: 'team_staff',
    label: 'Team Roles & Permissions',
    categoryNumber: '8',
    icon: Shield,
    badge: '4 Staff',
    description: 'Staff roles, granular permissions (Finance, Sales, Support) & multi-agent shifts',
  },
  {
    id: 'ai_assistant',
    label: 'AI Sales Assistant (Gemini Pro)',
    categoryNumber: '9',
    icon: Sparkles,
    badge: 'Gemini Pro',
    description: 'Autonomous catalog advisor, product recommendation & conversational upsells',
  },
  {
    id: 'analytics_growth',
    label: 'Analytics & Sales Growth',
    categoryNumber: '10',
    icon: BarChart3,
    badge: 'Live Data',
    description: 'Revenue graphs, message delivery rate, order settlements & retention KPIs',
  },
  {
    id: 'documents_appointments',
    label: 'Invoices & Bookings',
    categoryNumber: '11, 12',
    icon: Calendar,
    badge: 'VAT Ready',
    description: 'VAT invoices, receipts, consulting bookings, appointment slots & calendar sync',
  },
  {
    id: 'privacy_security',
    label: 'Business Privacy & Security (POPIA)',
    categoryNumber: '13',
    icon: Lock,
    badge: 'Encrypted',
    description: 'Team 2FA enforcement, customer data protection, audit logs & privacy policies',
  },
  {
    id: 'notifications_calls',
    label: 'Notifications & Voice SFU',
    categoryNumber: '14',
    icon: Bell,
    badge: 'Jitsi VIP',
    description: 'Order chimes, custom ringtones & high-def voice conference routing',
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

  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'invoicing' | 'analytics' | 'settings_hub'>('catalog');
  const [invoiceAmount, setInvoiceAmount] = useState('120');
  const [invoiceDesc, setInvoiceDesc] = useState('Custom Handcrafted Textile Order');
  const [invoiceCurrency, setInvoiceCurrency] = useState<'USD' | 'KES' | 'NGN' | 'GHS'>('USD');
  const [invoiceMethod, setInvoiceMethod] = useState<'M-Pesa' | 'MTN MoMo' | 'Card'>('M-Pesa');
  const [createdNotice, setCreatedNotice] = useState(false);

  // Modals for adding & sharing products
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [shareTargetProduct, setShareTargetProduct] = useState<ProductInfo | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleProductCreated = (newProduct: ProductInfo) => {
    setShareTargetProduct(newProduct);
    setIsShareModalOpen(true);
  };

  const handleOpenShare = (product: ProductInfo) => {
    setShareTargetProduct(product);
    setIsShareModalOpen(true);
  };

  const handleGenerateAndShareInvoice = () => {
    createInvoiceInChat(
      parseFloat(invoiceAmount) || 100,
      invoiceCurrency,
      invoiceDesc,
      invoiceMethod
    );
    setCreatedNotice(true);
    setTimeout(() => {
      setCreatedNotice(false);
      setActiveTab('chats');
    }, 1200);
  };

  return (
    <div className="flex-1 bg-neutral-100 flex flex-col h-full overflow-y-auto select-none p-4 md:p-8 pb-20 md:pb-8 text-neutral-900">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header with Sub Navigation & Settings Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center gap-2.5">
              <span>WAT Business & Commerce Suite</span>
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              African artisan commerce, instant Mobile Money gateways, staff roles & AI Copilot
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            {/* Sub Navigation Tabs */}
            <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl border border-black/[0.08] shadow-sm">
              {(['catalog', 'invoicing', 'analytics', 'settings_hub'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    activeSubTab === tab
                      ? 'bg-black text-white font-bold shadow-sm'
                      : 'text-neutral-600 hover:text-black hover:bg-black/[0.04]'
                  }`}
                >
                  {tab === 'settings_hub' ? '⚙️ Settings Hub' : tab}
                </button>
              ))}
            </div>

            {/* Direct Open Business Settings Button */}
            <button
              onClick={() => openBusinessSettings('profile_account')}
              className="px-3.5 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              title="Open full WAT Business Settings modal"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        {/* Analytics Snapshot Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.06)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 font-bold uppercase">
                30-Day Revenue
              </div>
              <div className="text-lg font-black text-neutral-900">$4,850.00</div>
              <span className="text-[10px] text-neutral-600 font-medium">⚡ 100% Mobile Money (M-Pesa/MoMo)</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.06)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 font-bold uppercase">
                Settled Orders
              </div>
              <div className="text-lg font-black text-neutral-900">84 Invoices</div>
              <span className="text-[10px] text-neutral-600 font-medium">Instant on-chain & bank sync</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.06)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 font-bold uppercase">
                Conversion Rate
              </div>
              <div className="text-lg font-black text-neutral-900">68.4%</div>
              <span className="text-[10px] text-neutral-600 font-medium">Conversational sales checkout</span>
            </div>
          </div>
        </div>

        {/* Catalog Tab */}
        {activeSubTab === 'catalog' && (
          <div className="space-y-4">
            {/* Quick Redirect Header for Catalog Settings */}
            <div className="p-4 rounded-3xl bg-white/80 border border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-black/[0.05] flex items-center justify-center text-neutral-800">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Commerce & Payment Configurations</h4>
                  <p className="text-[11px] text-neutral-500">Edit delivery flat rates, in-chat checkout, guest mode & currencies in real time.</p>
                </div>
              </div>
              <button
                onClick={() => openBusinessSettings('commerce_payments')}
                className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all self-start sm:self-auto shrink-0"
              >
                <span>Edit Commerce Settings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Product Catalog ({products.length} Items)
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Manage inventory and broadcast to contacts, groups, and status stories.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openBusinessSettings('ai_assistant')}
                  className="hidden sm:flex px-3 py-2 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 text-xs font-bold items-center gap-1.5 border border-black/[0.08] active:scale-95 transition-all"
                  title="Configure AI Catalog Copilot"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>AI Copilot</span>
                </button>
                <button
                  id="add-product-btn"
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((prod) => {
                const isFree = prod.isFree || prod.price === 0;
                const priceBadge = isFree ? 'FREE' : `${prod.currency} ${prod.price}`;

                return (
                  <div
                    key={prod.id}
                    className="rounded-3xl bg-white/90 border border-black/[0.08] overflow-hidden flex flex-col justify-between hover:border-black/20 transition-all shadow-sm hover:shadow-md group"
                  >
                    <div className="relative h-48 bg-neutral-100 overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-mono font-bold shadow-md ${
                        isFree ? 'bg-emerald-600 text-white' : 'bg-black text-white'
                      }`}>
                        {priceBadge}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                            {prod.category}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {prod.inStock ? `Stock: ${prod.stockCount ?? 15}` : 'Out of Stock'}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-neutral-900">{prod.name}</h4>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-black/[0.06] space-y-2">
                        <button
                          type="button"
                          onClick={() => openProductCheckout(prod)}
                          className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
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
                            className="p-2 rounded-2xl border border-black/[0.08] hover:border-black text-neutral-700 hover:text-black hover:bg-black/[0.04] text-xs font-bold transition-all active:scale-95"
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

        {/* Invoicing Tab */}
        {activeSubTab === 'invoicing' && (
          <div className="space-y-4">
            {/* Quick Redirect for Invoice & Document Settings */}
            <div className="p-4 rounded-3xl bg-white/80 border border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm max-w-xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-black/[0.05] flex items-center justify-center text-neutral-800">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Invoice Templates & Tax VAT</h4>
                  <p className="text-[11px] text-neutral-500">Edit business tax ID, footer terms, and booking services in real time.</p>
                </div>
              </div>
              <button
                onClick={() => openBusinessSettings('documents_appointments')}
                className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
              >
                <span>Edit Templates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-2xl border border-black/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)] space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.06]">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  Generate Instant Mobile Money Invoice
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Amount & Currency
                  </label>
                  <div className="flex gap-2 mt-1.5">
                    <select
                      value={invoiceCurrency}
                      onChange={(e: any) => setInvoiceCurrency(e.target.value)}
                      className="bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="KES">KES (KSh)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="GHS">GHS (GH₵)</option>
                    </select>
                    <input
                      type="number"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                      className="flex-1 bg-black/[0.03] border border-black/[0.08] rounded-2xl px-4 py-2 text-base font-bold text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Item Description
                  </label>
                  <input
                    type="text"
                    value={invoiceDesc}
                    onChange={(e) => setInvoiceDesc(e.target.value)}
                    className="w-full mt-1.5 bg-black/[0.03] border border-black/[0.08] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Target Mobile Payment Provider
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
                            : 'bg-black/[0.03] border-black/[0.08] text-neutral-600 hover:text-black hover:bg-black/[0.06]'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {createdNotice && (
                <div className="p-3 rounded-2xl bg-black/[0.04] border border-black/[0.08] text-neutral-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Invoice created and dispatched to active room!</span>
                </div>
              )}

              <button
                onClick={handleGenerateAndShareInvoice}
                className="w-full py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Mobile Pay Invoice to Chat</span>
              </button>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeSubTab === 'analytics' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-white/80 border border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-black/[0.05] flex items-center justify-center text-neutral-800">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Analytics KPIs & Reporting Targets</h4>
                  <p className="text-[11px] text-neutral-500">Configure custom growth targets, auto-export reports, and retention alerts.</p>
                </div>
              </div>
              <button
                onClick={() => openBusinessSettings('analytics_growth')}
                className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
              >
                <span>Edit Analytics Settings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 bg-white/90 backdrop-blur-2xl border border-black/[0.08] rounded-3xl space-y-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              <h3 className="text-sm font-bold text-neutral-900">
                Payment Gateway Settlements (Live Webhooks)
              </h3>
              <div className="space-y-2 font-mono text-xs text-neutral-700">
                <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-neutral-900 font-bold">M-PESA C2B</span>: 12,500 KES from +254712***890
                  </div>
                  <span className="text-emerald-600 font-bold">CONFIRMED (TXN #R89QW2)</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-neutral-900 font-bold">MTN MOMO</span>: 450 GHS from +233244***112
                  </div>
                  <span className="text-emerald-600 font-bold">CONFIRMED (TXN #MM991A)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Hub Tab - Complete Directory of Real-Time Business Settings Links */}
        {activeSubTab === 'settings_hub' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  WAT Business Real-Time Settings Directory
                </h3>
                <p className="text-[11px] text-neutral-500">
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
                    onClick={() => openBusinessSettings(item.id)}
                    className="p-5 rounded-3xl bg-white/90 hover:bg-white border border-black/[0.08] hover:border-black/30 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-98"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/[0.05] text-neutral-800 border border-black/[0.06]">
                          {item.badge}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-neutral-900 group-hover:text-neutral-800">
                        {item.label}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs font-bold text-neutral-900 group-hover:text-black">
                      <span>Edit Real-Time Settings</span>
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={handleProductCreated}
      />

      {/* Share Product Modal */}
      <ShareProductModal
        product={shareTargetProduct}
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setShareTargetProduct(null);
        }}
      />
    </div>
  );
};
