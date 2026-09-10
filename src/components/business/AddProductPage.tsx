import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Upload,
  Link,
  DollarSign,
  Layers,
  Sparkles,
  AlertCircle,
  Eye,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { ProductInfo } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

interface Props {
  onBack: () => void;
  onProductCreated?: (product: ProductInfo) => void;
}

const PRESET_IMAGES = [
  {
    name: 'Woven Sisal Kiondo Bag',
    category: 'Bags & Totes',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Single Origin Arabica Coffee',
    category: 'Gourmet & Food',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Handcrafted Brass Jewelry',
    category: 'Jewelry & Beads',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Organic Shea Butter & Oils',
    category: 'Beauty & Wellness',
    url: 'https://images.unsplash.com/photo-1608248597359-00918c505417?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Hand-dyed Indigo Fabric',
    category: 'Fashion & Apparel',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Handmade Clay Ceramic Vase',
    category: 'Art & Handcrafted Decor',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
  },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar (USD)' },
  { code: 'KES', symbol: 'KSh', label: 'Kenyan Shilling (KES)' },
  { code: 'NGN', symbol: '₦', label: 'Nigerian Naira (NGN)' },
  { code: 'GHS', symbol: 'GH₵', label: 'Ghanaian Cedi (GHS)' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand (ZAR)' },
];

const CATEGORIES = [
  'Fashion & Apparel',
  'Bags & Totes',
  'Art & Handcrafted Decor',
  'Gourmet & Food',
  'Jewelry & Beads',
  'Beauty & Wellness',
  'Electronics & Gadgets',
  'Services & Consulting',
];

export const AddProductPage: React.FC<Props> = ({ onBack, onProductCreated }) => {
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
  const [isPublishing, setIsPublishing] = useState(false);

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
        setImage(reader.result as string);
        setCustomImageUrl('');
        soundEngine.playPop();
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

    const numericPrice = parseFloat(price);
    const isFree = priceType === 'free';

    if (!isFree && (isNaN(numericPrice) || numericPrice <= 0)) {
      newErrors.price = 'Please enter a valid price greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsPublishing(true);
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

    soundEngine.playChime();
    if (onProductCreated) {
      onProductCreated(createdProduct);
    } else {
      onBack();
    }
  };

  const selectedCurrencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-black/[0.08] hover:bg-neutral-100 text-neutral-800 transition-colors shadow-xs group"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400">
              <span>Business Suite</span>
              <span>/</span>
              <span>Catalog</span>
              <span>/</span>
              <span className="text-emerald-600">Add Product</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              List New Product or Service
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Real-Time Catalog Sync
          </span>
        </div>
      </div>

      {/* Two Column Layout: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-4">
            <h3 className="text-sm font-black text-neutral-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Product Details</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                Item Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g., Handcrafted Sisal Kiondo Basket"
                className={`w-full px-4 py-3 rounded-2xl bg-neutral-50 border ${
                  errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-black/[0.08]'
                } text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-black/[0.08] text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Inventory Stock
                </label>
                <div className="flex items-center gap-2 h-11">
                  <button
                    type="button"
                    onClick={() => setInStock(!inStock)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                      inStock
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                    }`}
                  >
                    {inStock ? 'In Stock' : 'Out of Stock'}
                  </button>
                  {inStock && (
                    <input
                      type="number"
                      min="1"
                      value={stockCount}
                      onChange={(e) => setStockCount(parseInt(e.target.value) || 1)}
                      className="w-24 px-3 py-2 rounded-2xl bg-neutral-50 border border-black/[0.08] text-xs font-mono font-bold text-center"
                      title="Available units"
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                Description & Specifications
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details regarding materials, sizing, provenance, or custom requests..."
                className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-black/[0.08] text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Card 2: Pricing & Mobile Money */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-4">
            <h3 className="text-sm font-black text-neutral-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Pricing & Mobile Money Currency</span>
            </h3>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPriceType('cost')}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold border transition-all ${
                  priceType === 'cost'
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-neutral-50 border-black/[0.08] text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Fixed Price
              </button>
              <button
                type="button"
                onClick={() => setPriceType('free')}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold border transition-all ${
                  priceType === 'free'
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-neutral-50 border-black/[0.08] text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Free / Promotional
              </button>
            </div>

            {priceType === 'cost' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-black/[0.08] text-xs font-bold focus:bg-white focus:outline-none"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Amount ({selectedCurrencyObj.symbol})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (errors.price) setErrors({ ...errors, price: undefined });
                    }}
                    placeholder="45"
                    className={`w-full px-4 py-3 rounded-2xl bg-neutral-50 border ${
                      errors.price ? 'border-rose-400 bg-rose-50/30' : 'border-black/[0.08]'
                    } text-sm font-mono font-bold focus:bg-white focus:outline-none`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.price}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Photos & Visuals */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-4">
            <h3 className="text-sm font-black text-neutral-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Catalog Visuals</span>
            </h3>

            <div>
              <span className="block text-xs font-bold text-neutral-800 mb-2">
                Choose an artisan preset photo:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {PRESET_IMAGES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleImagePreset(item.url, item.category)}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all group ${
                      image === item.url && !customImageUrl
                        ? 'border-black scale-100 ring-2 ring-black/10'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    {image === item.url && !customImageUrl && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white font-bold" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center">
              <label className="flex-1 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-dashed border-black/20 hover:border-black hover:bg-neutral-50 cursor-pointer transition-all text-xs font-bold text-neutral-700">
                <Upload className="w-4 h-4 text-neutral-500" />
                <span>Upload image from device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-neutral-400 font-bold">or</span>

              <div className="flex-1 w-full relative">
                <Link className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="Paste direct image link..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-2xl bg-neutral-50 border border-black/[0.08] text-xs font-medium focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="py-3.5 px-6 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish to Catalog & Chat Feed</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Interactive Card Preview */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Live Customer Card Preview
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold">
                Catalogue Ready
              </span>
            </div>

            {/* Simulated Product Card */}
            <div className="rounded-3xl border border-black/[0.08] overflow-hidden bg-white shadow-md">
              <div className="relative h-60 bg-neutral-100 overflow-hidden">
                <img
                  src={customImageUrl.trim() || image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold">
                  {category}
                </div>
                {inStock ? (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>In Stock ({stockCount})</span>
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-bold">
                    Sold Out
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-base font-black text-neutral-900 leading-snug">
                    {name.trim() || 'Handcrafted Artisan Item'}
                  </h4>
                  <div className="text-base font-black font-mono text-neutral-900 shrink-0">
                    {priceType === 'free'
                      ? 'FREE'
                      : `${selectedCurrencyObj.symbol} ${price || '0'}`}
                  </div>
                </div>

                <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">
                  {description.trim() ||
                    'Detailed product overview describing authentic African craftsmanship, sustainable materials, and care instructions.'}
                </p>

                <div className="pt-3 border-t border-black/[0.04] flex items-center gap-2">
                  <div className="flex-1 py-2 px-3 rounded-xl bg-black text-white text-[11px] font-bold text-center">
                    Simulate Buy Now
                  </div>
                  <div className="py-2 px-3 rounded-xl bg-neutral-100 text-neutral-700 text-[11px] font-bold text-center">
                    Share Link
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
