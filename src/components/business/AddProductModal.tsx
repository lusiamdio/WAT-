import React, { useState } from 'react';
import {
  X,
  Plus,
  ShoppingBag,
  DollarSign,
  Tag,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Package,
  Layers,
  Upload,
  Coins,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { ProductInfo } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated?: (product: ProductInfo) => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', flag: '🇬🇧' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (NGN)', flag: '🇳🇬' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand (ZAR)', flag: '🇿🇦' },
  { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza (AOA)', flag: '🇦🇴' },
];

const PRESET_IMAGES = [
  {
    name: 'Kente Textile',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80',
    category: 'Fashion & Apparel',
  },
  {
    name: 'Leather Craft',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    category: 'Accessories',
  },
  {
    name: 'Raffia Tote',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    category: 'Bags & Totes',
  },
  {
    name: 'Organic Coffee',
    url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80',
    category: 'Gourmet & Food',
  },
  {
    name: 'Artisan Pottery',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
    category: 'Art & Decor',
  },
  {
    name: 'Beaded Jewelry',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80',
    category: 'Jewelry & Beads',
  },
];

const CATEGORIES = [
  'Fashion & Apparel',
  'Accessories & Leather',
  'Bags & Totes',
  'Art & Handcrafted Decor',
  'Gourmet & Food',
  'Jewelry & Beads',
  'Beauty & Wellness',
  'Electronics & Gadgets',
  'Services & Consulting',
];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductCreated,
}) => {
  const { addProduct } = useChat();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceType, setPriceType] = useState<'cost' | 'free'>('cost');
  const [price, setPrice] = useState('45');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState(25);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  if (!isOpen) return null;

  const handleImagePreset = (presetUrl: string, presetCat: string) => {
    setImage(presetUrl);
    setCategory(presetCat);
    soundEngine.playPop();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
          soundEngine.playPop();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; price?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }

    const isFree = priceType === 'free';
    const numericPrice = isFree ? 0 : parseFloat(price);

    if (!isFree && (isNaN(numericPrice) || numericPrice <= 0)) {
      newErrors.price = 'Please enter a valid price greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalImage = customImageUrl.trim() || image;

    const createdProduct = addProduct({
      name: name.trim(),
      description: description.trim() || 'Handcrafted item listed in WAT Business Catalogue.',
      price: numericPrice,
      currency: isFree ? 'USD' : currency,
      isFree,
      category,
      image: finalImage,
      inStock,
      stockCount: inStock ? stockCount : 0,
    });

    // Reset Form
    setName('');
    setDescription('');
    setPriceType('cost');
    setPrice('45');
    setErrors({});

    onClose();
    if (onProductCreated) {
      onProductCreated(createdProduct);
    }
  };

  const selectedCurrencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        id="add-product-modal"
        className="bg-white rounded-3xl border border-black/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.16)] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-neutral-900"
      >
        {/* Header */}
        <header className="p-4 sm:p-5 border-b border-black/[0.06] bg-white/90 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900">
                Add Product to Catalogue
              </h2>
              <p className="text-xs text-neutral-500">
                List artisan goods, textiles, services & digital products across African corridors.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-neutral-400 hover:text-black hover:bg-black/[0.04] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. Product Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
              <span>Product Name</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              id="product-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="e.g. Handcrafted Kente Statement Blazer"
              className={`w-full px-4 py-3 rounded-2xl bg-black/[0.03] border text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                errors.name
                  ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100'
                  : 'border-black/[0.08] focus:border-black'
              }`}
            />
            {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
          </div>

          {/* 2. Product Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 flex items-center justify-between">
              <span>Product Description</span>
              <span className="text-[11px] text-neutral-400 font-normal">
                {description.length}/300 chars
              </span>
            </label>
            <textarea
              id="product-desc-input"
              rows={3}
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe materials, origin, sizing, and artisan craftsmanship..."
              className="w-full px-4 py-3 rounded-2xl bg-black/[0.03] border border-black/[0.08] text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all resize-none"
            />
          </div>

          {/* 3. Price (Free / Cost) & Currency Selector */}
          <div className="space-y-3 p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-neutral-700" />
                <span>Pricing & Currency</span>
              </label>

              {/* Free vs Cost Toggle */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-black/[0.08] shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    setPriceType('cost');
                    soundEngine.playPop();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    priceType === 'cost'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  Set Cost
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriceType('free');
                    soundEngine.playPop();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    priceType === 'free'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  Free
                </button>
              </div>
            </div>

            {priceType === 'cost' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Currency selector: USD, EUR, GBP, NGN, ZAR, AOA */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500">
                    Currency (Corridor)
                  </label>
                  <div className="relative">
                    <select
                      id="product-currency-select"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs font-bold text-neutral-900 focus:outline-none focus:border-black cursor-pointer shadow-xs pr-8"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol}) - {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Price Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500">
                    Price Amount ({selectedCurrencyObj.symbol})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                      {selectedCurrencyObj.symbol}
                    </span>
                    <input
                      id="product-price-input"
                      type="number"
                      step="any"
                      min="0.01"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        if (errors.price) setErrors({ ...errors, price: undefined });
                      }}
                      placeholder="0.00"
                      className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:bg-white shadow-xs ${
                        errors.price
                          ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100'
                          : 'border-black/[0.08] focus:border-black'
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-[11px] text-red-500 font-medium">{errors.price}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold">Free Product / Sample:</span> Listed at no monetary
                  cost. Customers can request or download directly in chat.
                </div>
              </div>
            )}
          </div>

          {/* 4. Category & Inventory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-neutral-500" />
                <span>Category</span>
              </label>
              <select
                id="product-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] border border-black/[0.08] text-xs font-bold text-neutral-900 focus:outline-none focus:border-black"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Stock Status</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded text-black focus:ring-black accent-black"
                  />
                  <span className="font-semibold text-neutral-700">In Stock</span>
                </label>
              </div>

              <input
                type="number"
                disabled={!inStock}
                min="1"
                value={stockCount}
                onChange={(e) => setStockCount(parseInt(e.target.value) || 0)}
                placeholder="Stock quantity"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] border border-black/[0.08] text-xs font-mono font-bold text-neutral-900 disabled:opacity-50 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* 5. Product Image & Preset Picker */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-neutral-500" />
              <span>Product Image</span>
            </label>

            {/* Current Selected Image Preview */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
              <img
                src={customImageUrl.trim() || image}
                alt="Product preview"
                className="w-16 h-16 rounded-xl object-cover border border-black/10 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-neutral-900 truncate">Selected Visual Asset</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Choose from artisan catalog presets or enter a custom photo link below.
                </p>
              </div>

              <label className="px-3 py-1.5 rounded-xl bg-black/[0.05] hover:bg-black/[0.1] text-xs font-bold text-neutral-800 cursor-pointer flex items-center gap-1.5 transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Presets Grid */}
            <div>
              <p className="text-[11px] font-semibold text-neutral-500 mb-1.5">
                Quick Artisan Presets:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_IMAGES.map((p) => {
                  const isSelected = image === p.url && !customImageUrl.trim();
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setCustomImageUrl('');
                        handleImagePreset(p.url, p.category);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${
                        isSelected
                          ? 'border-black ring-2 ring-black/20 scale-95'
                          : 'border-transparent hover:border-black/30'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-[9px] text-white font-bold truncate">
                        {p.name}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="pt-1">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Or paste external image URL (https://...)"
                className="w-full px-3.5 py-2 rounded-xl bg-black/[0.03] border border-black/[0.08] text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-black/[0.06] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-black/[0.08] text-neutral-600 hover:text-black hover:bg-black/[0.04] text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-black shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>List Product in Catalogue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
