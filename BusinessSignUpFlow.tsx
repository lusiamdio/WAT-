import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  MapPin,
  Camera,
  Upload,
} from 'lucide-react';
import { COUNTRIES, Country } from '../../data/countries';
import { soundEngine } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

interface BusinessSignUpFlowProps {
  onComplete: (businessData: {
    businessName: string;
    category: string;
    country: string;
    email: string;
    phone: string;
    website: string;
    industry: string;
    description: string;
    username: string;
    location: string;
  }) => void;
  onBackToAccountType: () => void;
  logoSrc?: string;
}

const BUSINESS_INDUSTRIES = [
  'Retail',
  'Professional Services',
  'Technology',
  'Finance',
  'Education',
  'Healthcare',
  'Hospitality',
  'Manufacturing',
  'NGO / Nonprofit',
  'Government',
  'Other',
];

const PRESET_BUSINESS_LOGOS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80',
];

export const BusinessSignUpFlow: React.FC<BusinessSignUpFlowProps> = ({
  onComplete,
  onBackToAccountType,
  logoSrc = '/assets/image/ChatGPT Image Sep 4, 2026, 04_52_47 PM (1)-1.png',
}) => {
  // Steps 1 to 5
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Business Information
  const [businessName, setBusinessName] = useState('Zuri Innovations');
  const [businessCategory, setBusinessCategory] = useState('Fintech & Merchant Commerce');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [businessEmail, setBusinessEmail] = useState('contact@zuriinnovations.com');
  const [businessPhone, setBusinessPhone] = useState('809 123 4567');
  const [website, setWebsite] = useState('https://zuriinnovations.africa');
  const [step1Error, setStep1Error] = useState('');

  // Step 2: Industry / About
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Technology');
  const [companySize, setCompanySize] = useState('11-50 employees');

  // Step 3: Business Identity
  const [businessLogo, setBusinessLogo] = useState(PRESET_BUSINESS_LOGOS[0]);
  const [businessDescription, setBusinessDescription] = useState(
    'Pan-African cross-border payments & enterprise commerce infrastructure.'
  );
  const [businessUsername, setBusinessUsername] = useState('zuriinnovations');
  const [businessLocation, setBusinessLocation] = useState('Victoria Island, Lagos, Nigeria');
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setBusinessLogo(e.target.result);
        soundEngine.playChime();
      }
    };
    reader.readAsDataURL(file);
  };

  // Step 4: Invite Team
  const [teamInvites, setTeamInvites] = useState([
    { id: '1', contact: 'amara@zuriinnovations.com', role: 'Administrator' },
    { id: '2', contact: 'kofi@zuriinnovations.com', role: 'Support Lead' },
  ]);

  // Step 5: Animation trigger
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Handlers
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setStep1Error('Please enter your business name.');
      return;
    }
    if (!businessEmail.trim() || !businessEmail.includes('@')) {
      setStep1Error('Please enter a valid business email.');
      return;
    }
    setStep1Error('');
    soundEngine.playChime();
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playChime();
    setCurrentStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playChime();
    setCurrentStep(4);
  };

  const handleAddTeamMember = () => {
    setTeamInvites([
      ...teamInvites,
      { id: Date.now().toString(), contact: '', role: 'Agent' },
    ]);
  };

  const handleRemoveTeamMember = (id: string) => {
    setTeamInvites(teamInvites.filter((t) => t.id !== id));
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playMessageSent();
    triggerStep5Completion();
  };

  const handleSkipTeam = () => {
    soundEngine.playChime();
    triggerStep5Completion();
  };

  const triggerStep5Completion = () => {
    setCurrentStep(5);
    setIsProvisioning(true);
    setTimeout(() => {
      setIsProvisioning(false);
      soundEngine.playChime();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#000000', '#555555', '#999999', '#ffffff'],
        });
      } catch {}
    }, 1200);
  };

  const handleEnterWatBusiness = () => {
    soundEngine.playMessageSent();
    onComplete({
      businessName,
      category: businessCategory,
      country: selectedCountry.name,
      email: businessEmail,
      phone: `${selectedCountry.dialCode} ${businessPhone}`,
      website,
      industry: selectedIndustry,
      description: businessDescription,
      username: businessUsername.startsWith('@') ? businessUsername : `@${businessUsername}:wat.chat`,
      location: businessLocation,
    });
  };

  return (
    <div className="relative w-full max-w-lg mx-auto z-20">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.99 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl text-neutral-900 overflow-hidden"
      >
        {/* Top Bar with Transparent Logo & Back Option */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <img
              src={logoSrc}
              alt="WAT"
              className="w-7 h-7 object-contain bg-transparent select-none pointer-events-none"
              onError={(e) => {
                e.currentTarget.src = '/wat-logo.png';
              }}
            />
            <span className="text-xs font-semibold text-neutral-500">
              Step {currentStep} of 5
            </span>
          </div>

          {currentStep < 5 && (
            <button
              type="button"
              onClick={onBackToAccountType}
              className="text-[11px] text-neutral-500 hover:text-black flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Change Type</span>
            </button>
          )}
        </div>

        {/* Minimal Progress Line - 10% Grey Track, 30% Black Fill */}
        <div className="w-full h-1 bg-neutral-100 rounded-full mb-5 overflow-hidden">
          <motion.div
            className="h-full bg-black rounded-full"
            animate={{ width: `${(currentStep / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                Business information
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Provide your official commercial details
              </p>
            </div>

            {step1Error && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-neutral-100 text-xs text-neutral-800">
                {step1Error}
              </div>
            )}

            <form onSubmit={handleStep1Submit} className="space-y-3">
              {/* Business Name */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Zuri Innovations Ltd"
                  required
                  className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                />
              </div>

              {/* Category / Offering */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Category or Offering
                </label>
                <input
                  type="text"
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  placeholder="e.g. Fintech & Merchant Commerce"
                  required
                  className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                />
              </div>

              {/* Business Email */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Official Business Email
                </label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="contact@company.com"
                  required
                  className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                />
              </div>

              {/* Business Phone with Country */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Business Phone
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const found = COUNTRIES.find((c) => c.code === e.target.value);
                      if (found) setSelectedCountry(found);
                    }}
                    className="w-24 px-2.5 py-2 bg-neutral-100 rounded-xl text-xs text-black focus:outline-none focus:bg-neutral-200/80 transition-colors"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.dialCode}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    placeholder="809 123 4567"
                    required
                    className="flex-1 px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 2: Industry & Organization Size */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                Industry and scale
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Classify your enterprise sector and operational size
              </p>
            </div>

            <form onSubmit={handleStep2Submit} className="space-y-4">
              {/* Industry Grid */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-2">
                  Select Industry
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BUSINESS_INDUSTRIES.map((ind) => (
                    <button
                      type="button"
                      key={ind}
                      onClick={() => setSelectedIndustry(ind)}
                      className={`p-2.5 rounded-xl text-xs text-left transition-all ${
                        selectedIndustry === ind
                          ? 'bg-black text-white font-semibold'
                          : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Organization Size */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-2">
                  Organization Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['1-10', '11-50', '50+'].map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setCompanySize(`${size} employees`)}
                      className={`p-2 rounded-xl text-xs text-center transition-all ${
                        companySize.startsWith(size)
                          ? 'bg-black text-white font-semibold'
                          : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-2.5 px-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Business Identity */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                Profile and presence
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Set up your brand logo and public discovery handle
              </p>
            </div>

            <form onSubmit={handleStep3Submit} className="space-y-3">
              {/* Business Logo Selector with Upload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-neutral-600">
                    Business Logo
                  </label>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="text-[11px] text-neutral-700 hover:text-black font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload logo</span>
                  </button>
                </div>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file);
                  }}
                />

                <div className="flex items-center gap-3">
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingLogo(true);
                    }}
                    onDragLeave={() => setIsDraggingLogo(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingLogo(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                    className={`relative group cursor-pointer shrink-0 rounded-xl overflow-hidden transition-all ${
                      isDraggingLogo ? 'ring-2 ring-black scale-105' : ''
                    }`}
                    title="Click or drag image to upload logo"
                  >
                    <img
                      src={businessLogo}
                      alt="Logo"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black/45 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                      <span className="text-[8px] text-white font-medium mt-0.5">Upload</span>
                    </div>
                  </div>

                  <div className="flex-1 flex gap-1.5 overflow-x-auto pb-1 items-center">
                    {PRESET_BUSINESS_LOGOS.map((logo, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setBusinessLogo(logo);
                          soundEngine.playChime();
                        }}
                        className={`w-8 h-8 rounded-lg overflow-hidden shrink-0 transition-transform ${
                          businessLogo === logo
                            ? 'ring-2 ring-black scale-105'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={logo} alt={`Logo ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Username Handle */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Business Handle
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-neutral-400">@</span>
                  <input
                    type="text"
                    value={businessUsername}
                    onChange={(e) =>
                      setBusinessUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))
                    }
                    placeholder="zuriinnovations"
                    required
                    className="w-full pl-7 pr-16 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                  />
                  <span className="absolute right-3 text-[11px] text-neutral-400">
                    :wat.chat
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Business Description
                </label>
                <textarea
                  rows={2}
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Summarize services..."
                  className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 resize-none transition-colors"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Headquarters Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={businessLocation}
                    onChange={(e) => setBusinessLocation(e.target.value)}
                    placeholder="e.g. Victoria Island, Lagos, Nigeria"
                    required
                    className="w-full pl-8 pr-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                  />
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="py-2.5 px-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 4: Invite Team */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                Invite team members
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Add teammates to collaborate on customer chats and orders
              </p>
            </div>

            <form onSubmit={handleStep4Submit} className="space-y-3">
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {teamInvites.map((member, idx) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-neutral-100"
                  >
                    <input
                      type="text"
                      value={member.contact}
                      onChange={(e) => {
                        const copy = [...teamInvites];
                        copy[idx].contact = e.target.value;
                        setTeamInvites(copy);
                      }}
                      placeholder="teammate@company.com"
                      className="flex-1 px-2.5 py-1.5 bg-transparent text-xs text-black placeholder:text-neutral-400 focus:outline-none"
                    />
                    <select
                      value={member.role}
                      onChange={(e) => {
                        const copy = [...teamInvites];
                        copy[idx].role = e.target.value;
                        setTeamInvites(copy);
                      }}
                      className="px-2 py-1 bg-white rounded-lg text-xs text-black focus:outline-none"
                    >
                      <option value="Administrator">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Support Lead">Support</option>
                      <option value="Agent">Agent</option>
                    </select>
                    {teamInvites.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTeamMember(member.id)}
                        className="p-1.5 text-neutral-400 hover:text-black"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddTeamMember}
                className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Team Member</span>
              </button>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSkipTeam}
                  className="py-2.5 px-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-800 transition-colors"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
                >
                  <span>Send Invites & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 5: Business Ready */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-2 space-y-4"
          >
            {isProvisioning ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">Provisioning Workspace...</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Setting up team directory and channels
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-black" />
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-black">
                    Your business is ready
                  </h2>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    <span className="text-black font-semibold">{businessName}</span> has been established on WAT with messaging, team roles, and commerce.
                  </p>
                </div>

                {/* Identity Summary Card - No Borders */}
                <div className="p-3.5 rounded-2xl bg-neutral-100 text-left max-w-sm mx-auto space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Handle:</span>
                    <span className="text-black font-medium">@{businessUsername}:wat.chat</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Industry:</span>
                    <span className="text-black font-medium">{selectedIndustry}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Headquarters:</span>
                    <span className="text-black font-medium">{businessLocation}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEnterWatBusiness}
                  className="w-full max-w-sm mx-auto py-2.5 px-6 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Enter WAT Business</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
