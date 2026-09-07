import React from 'react';
import {
  Globe,
  Palette,
  Accessibility,
  Scale,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { WATBusinessSettings } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const LanguageAppearanceLegalTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const lang = settings.languageRegion;
  const app = settings.appearance;
  const access = settings.accessibility;
  const legal = settings.legalCompliance;
  const help = settings.helpSupport;

  const handleLangChange = (key: keyof typeof lang, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      languageRegion: {
        ...prev.languageRegion,
        [key]: val,
      },
    }));
  };

  const handleAppChange = (key: keyof typeof app, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: val,
      },
    }));
    showToast(`Appearance updated: ${String(key)}`);
  };

  const handleAccessToggle = (key: keyof typeof access) => {
    updateSettings((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: !(prev.accessibility as any)[key],
      },
    }));
    showToast(`Accessibility preference updated: ${String(key)}`);
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* 19. Language & Region */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-neutral-100">19. 🌐 Language, Currency & Regional Locale</h3>
          </div>
          <span className="text-xs font-mono text-amber-400">AUTO-TRANSLATE ON</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Business Language</label>
            <input
              type="text"
              value={lang.businessLanguage}
              onChange={(e) => handleLangChange('businessLanguage', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Default Currency</label>
            <input
              type="text"
              value={lang.defaultCurrency}
              onChange={(e) => handleLangChange('defaultCurrency', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Time Zone</label>
            <input
              type="text"
              value={lang.timeZone}
              onChange={(e) => handleLangChange('timeZone', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100"
            />
          </div>
        </div>
      </section>

      {/* 20. Appearance & Brand Colors */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-neutral-100">20. 🎨 Visual Appearance & Branding</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="text-xs font-bold text-neutral-300">Interface Theme</div>
            <div className="flex gap-2">
              {['dark', 'light', 'system'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleAppChange('theme', t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize border ${
                    app.theme === t
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="text-xs font-bold text-neutral-300">Chat Density</div>
            <div className="flex gap-2">
              {['compact', 'comfortable'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleAppChange('chatDensity', d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize border ${
                    app.chatDensity === d
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="text-xs font-bold text-neutral-300">Brand Accent Color</div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={app.businessBrandAccentColor}
                onChange={(e) => handleAppChange('businessBrandAccentColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-neutral-300 font-bold">{app.businessBrandAccentColor}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 21. Accessibility */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-neutral-100">21. ♿ Accessibility & Voice Controls</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'highContrastMode', label: 'High Contrast Mode' },
            { key: 'screenReaderOptimized', label: 'Screen Reader Optimized' },
            { key: 'captionsEnabled', label: 'Live Audio Captions' },
            { key: 'speechToTextVoiceInput', label: 'Voice-to-Text Input' },
          ].map((item) => {
            const active = (access as any)[item.key];
            return (
              <div
                key={item.key}
                className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
              >
                <span className="text-xs text-neutral-300 font-medium">{item.label}</span>
                <button
                  type="button"
                  onClick={() => handleAccessToggle(item.key as any)}
                  className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                    active ? 'bg-cyan-500' : 'bg-neutral-800'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      active ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 26 & 27. Legal & Help */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">26 & 27. ⚖️ Legal, GDPR, Compliance & Help Desk</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">OPERATIONAL</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <a
            href={legal.termsOfServiceUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-xs text-neutral-200"
          >
            <span>Terms of Service</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </a>

          <a
            href={legal.privacyPolicyUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-xs text-neutral-200"
          >
            <span>Privacy Policy (GDPR / POPIA)</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </a>

          <a
            href={help.helpCenterUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-xs text-neutral-200"
          >
            <span>WAT Business Help Center</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </a>
        </div>
      </section>
    </div>
  );
};
