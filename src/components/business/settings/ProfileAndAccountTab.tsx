import React from 'react';
import {
  Building2,
  BadgeCheck,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Share2,
  FileText,
  ShieldCheck,
  User,
  Sparkles,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { WATBusinessSettings } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const ProfileAndAccountTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const profile = settings.profile;
  const verification = settings.verification;
  const account = settings.account;

  const handleProfileChange = (key: keyof typeof profile, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: val,
      },
    }));
  };

  const handleVerificationToggle = () => {
    const nextStatus = verification.status === 'verified' ? 'in_review' : 'verified';
    updateSettings((prev) => ({
      ...prev,
      verification: {
        ...prev.verification,
        status: nextStatus,
      },
      profile: {
        ...prev.profile,
        verificationStatus: nextStatus,
      },
    }));
    showToast(`Verification status set to: ${nextStatus.toUpperCase()}`);
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* Top Banner: Verification Badge & Quick Brand Header */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
        <div className="h-32 w-full bg-gradient-to-r from-amber-900/40 via-amber-800/20 to-neutral-950 relative">
          {profile.coverPhoto && (
            <img
              src={profile.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover opacity-35"
            />
          )}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow-lg ${
                verification.status === 'verified'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>{verification.status === 'verified' ? 'Official Verified Business' : 'Verification In Review'}</span>
            </span>
          </div>
        </div>

        <div className="p-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="relative group">
              <img
                src={profile.logo}
                alt={profile.businessName}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-neutral-950 shadow-2xl bg-neutral-800"
              />
              <button
                type="button"
                onClick={() => {
                  const newUrl = prompt('Enter new logo image URL:', profile.logo);
                  if (newUrl) handleProfileChange('logo', newUrl);
                }}
                className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity"
              >
                <Upload className="w-4 h-4 mr-1" /> Change
              </button>
            </div>
            <div className="mb-1">
              <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                <span>{profile.businessName}</span>
                <BadgeCheck className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              </h2>
              <p className="text-xs text-amber-400 font-medium">{profile.category}</p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{account.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={handleVerificationToggle}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 flex items-center justify-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Toggle Verified Badge</span>
            </button>
            <a
              href={profile.catalogUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Catalog</span>
            </a>
          </div>
        </div>
      </div>

      {/* 1. Primary Business Profile Info */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-neutral-100">1. 👤 Business Profile Details</h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">Public Customer View</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Business Name
            </label>
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => handleProfileChange('businessName', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Business Category
            </label>
            <input
              type="text"
              value={profile.category}
              onChange={(e) => handleProfileChange('category', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100 outline-none transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Tagline / About
            </label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => handleProfileChange('tagline', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100 outline-none transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Business Description
            </label>
            <textarea
              rows={3}
              value={profile.description}
              onChange={(e) => handleProfileChange('description', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl p-3.5 text-xs text-neutral-100 outline-none transition-colors leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-neutral-400" /> Business Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100 outline-none transition-colors font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-neutral-400" /> Business Phone Number
            </label>
            <input
              type="text"
              value={profile.phoneNumber}
              onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100 outline-none transition-colors font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-neutral-400" /> Primary Website
            </label>
            <input
              type="url"
              value={profile.website}
              onChange={(e) => handleProfileChange('website', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100 outline-none transition-colors font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" /> Physical Address
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => handleProfileChange('address', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Business Hours Settings */}
        <div className="pt-4 border-t border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Business Hours
              </label>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Determines when the Away message and bot are triggered
              </p>
            </div>
            <div className="flex gap-1.5 bg-neutral-950 p-1 rounded-2xl border border-neutral-800">
              {(['always_open', 'by_appointment', 'custom_hours'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleProfileChange('hoursType', type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    profile.hoursType === type
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {profile.hoursType === 'custom_hours' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
              {profile.hoursSchedule.map((day, idx) => (
                <div
                  key={day.day}
                  className={`p-3 rounded-2xl border transition-all ${
                    day.isOpen
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                      : 'bg-neutral-950/40 border-neutral-900 text-neutral-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold">{day.day}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...profile.hoursSchedule];
                        updated[idx].isOpen = !updated[idx].isOpen;
                        handleProfileChange('hoursSchedule', updated);
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        day.isOpen
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {day.isOpen ? 'Open' : 'Closed'}
                    </button>
                  </div>
                  {day.isOpen && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono">
                      <input
                        type="time"
                        value={day.openTime}
                        onChange={(e) => {
                          const updated = [...profile.hoursSchedule];
                          updated[idx].openTime = e.target.value;
                          handleProfileChange('hoursSchedule', updated);
                        }}
                        className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-neutral-200 text-xs"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={day.closeTime}
                        onChange={(e) => {
                          const updated = [...profile.hoursSchedule];
                          updated[idx].closeTime = e.target.value;
                          handleProfileChange('hoursSchedule', updated);
                        }}
                        className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-neutral-200 text-xs"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Social Media & Tax Registration */}
        <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-400" /> Business Reg. Number
            </label>
            <input
              type="text"
              value={profile.registrationNumber}
              onChange={(e) => handleProfileChange('registrationNumber', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-200 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-400" /> Tax / VAT PIN
            </label>
            <input
              type="text"
              value={profile.taxVatNumber}
              onChange={(e) => handleProfileChange('taxVatNumber', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-200 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram Handle
            </label>
            <input
              type="text"
              value={profile.socialLinks.instagram || ''}
              onChange={(e) =>
                handleProfileChange('socialLinks', {
                  ...profile.socialLinks,
                  instagram: e.target.value,
                })
              }
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-200"
            />
          </div>
        </div>
      </section>

      {/* 25. Business Verification Module */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">25. 🏢 Business Verification & Trust</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
            STATUS: {verification.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Identity Verified', ok: verification.identityVerified },
            { label: 'Tax Docs Confirmed', ok: verification.taxDocumentUploaded },
            { label: 'Phone Number Valid', ok: verification.phoneVerified },
            { label: 'Address Geocoded', ok: verification.addressVerified },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
            >
              <span className="text-xs text-neutral-300 font-medium">{item.label}</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                ✓ VALID
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 28. Account Settings Module */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-neutral-100">28. 📲 Business Account Settings</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">{account.accountType}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="text-[11px] text-neutral-500 uppercase font-bold">WAT Matrix Handle</div>
            <div className="text-xs font-mono text-emerald-400 mt-1 font-bold">{account.username}</div>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="text-[11px] text-neutral-500 uppercase font-bold">Tier & Plan</div>
            <div className="text-xs font-bold text-amber-300 mt-1">{account.activeTier}</div>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="text-[11px] text-neutral-500 uppercase font-bold">Account Created</div>
            <div className="text-xs text-neutral-300 mt-1">{account.accountCreatedDate}</div>
          </div>
        </div>
      </section>
    </div>
  );
};
