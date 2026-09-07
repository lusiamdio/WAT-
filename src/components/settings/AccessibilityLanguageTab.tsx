import React from 'react';
import { WATUserSettings } from '../../types/watUserSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const AccessibilityLanguageTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
}) => {
  const acc = settings.accessibility;
  const lang = settings.language;

  const handleAccToggle = (key: keyof typeof acc) => {
    updateSettings((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: !(prev.accessibility as any)[key],
      },
    }));
    showToast(`Updated ${String(key)}`);
  };

  const handleLangChange = (key: keyof typeof lang, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        [key]: val,
      },
    }));
    showToast(`Updated ${String(key)}`);
  };

  const handleSaveTab = () => {
    showToast('Language and accessibility settings saved');
  };

  return (
    <div className="space-y-6 text-neutral-900 bg-white">
      {/* Language */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Language
          </h2>
          <span className="text-[11px] font-mono text-neutral-500">
            Localization
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">Display Language</label>
            <select
              value={lang.appLanguage}
              onChange={(e) => handleLangChange('appLanguage', e.target.value)}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="English (US)">English (US)</option>
              <option value="Swahili (Kiswahili)">Swahili (Kiswahili)</option>
              <option value="French (Français)">French (Français)</option>
              <option value="Zulu (isiZulu)">Zulu (isiZulu)</option>
              <option value="Yoruba (Èdè Yorùbá)">Yoruba (Èdè Yorùbá)</option>
              <option value="Portuguese (Português)">Portuguese (Português)</option>
              <option value="Arabic (العربية)">Arabic (العربية)</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/[0.08] space-y-2">
            <label className="text-xs font-bold text-neutral-900">Target Translation</label>
            <select
              value={lang.preferredTranslateTarget}
              onChange={(e) => handleLangChange('preferredTranslateTarget', e.target.value)}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
            >
              <option value="English">English</option>
              <option value="Swahili">Swahili</option>
              <option value="French">French</option>
              <option value="Yoruba">Yoruba</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-neutral-900">Auto-Translate Messages</span>
            <p className="text-[11px] text-neutral-500">
              Translate incoming messages automatically
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleLangChange('autoTranslateIncoming', !lang.autoTranslateIncoming)}
            className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
              lang.autoTranslateIncoming ? 'bg-black' : 'bg-neutral-300'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                lang.autoTranslateIncoming ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Accessibility Controls */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900">
          Accessibility
        </h2>

        <div className="space-y-3">
          {/* High Contrast */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">High Contrast Mode</span>
              <p className="text-[11px] text-neutral-500">
                Enhance visual separation of text and interface borders
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAccToggle('highContrast')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                acc.highContrast ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  acc.highContrast ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reduce Motion */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Reduce Motion</span>
              <p className="text-[11px] text-neutral-500">
                Minimize transition animations across screens
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAccToggle('reduceMotion')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                acc.reduceMotion ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  acc.reduceMotion ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* VoiceOver / Screen Reader */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Screen Reader Optimization</span>
              <p className="text-[11px] text-neutral-500">
                Provide semantic accessibility labels for screen readers
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAccToggle('screenReaderOptimized')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                acc.screenReaderOptimized ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  acc.screenReaderOptimized ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Speech-to-Text */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-900">Speech-to-Text Dictation</span>
              <p className="text-[11px] text-neutral-500">
                Voice transcription in composer
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAccToggle('speechToText')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                acc.speechToText ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  acc.speechToText ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Save / Cancel Footer */}
      <div className="flex items-center justify-end gap-2 pt-2 pb-4">
        <button
          type="button"
          onClick={() => showToast('Changes discarded')}
          className="px-4 py-2 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveTab}
          className="px-5 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
