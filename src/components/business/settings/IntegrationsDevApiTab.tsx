import React from 'react';
import {
  Code,
  Layers,
  Key,
  Copy,
  Zap,
  Globe,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { WATBusinessSettings } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const IntegrationsDevApiTab: React.FC<Props> = ({ settings, showToast, onNavigateSection }) => {
  const integrations = settings.integrations;
  const devApi = settings.developerApi;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* 23. Integrations Hub */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-neutral-100">23. 🔌 Third-Party CRM & eCommerce Integrations</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">SYNC ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {integrations.map((integ) => (
            <div
              key={integ.id}
              className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-100">{integ.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        integ.status === 'connected'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {integ.status === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{integ.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast(`Configuring integration for ${integ.name}`)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-neutral-300 border border-neutral-800"
              >
                Configure
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 24. Developer API & Webhooks */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">24. 💻 Developer Webhooks & Cloud API</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">REST API v2.4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <div className="text-[11px] text-neutral-400 font-bold uppercase">WAT Business App ID</div>
            <div className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
              <span className="font-mono text-xs text-amber-300">{devApi.appId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(devApi.appId, 'App ID')}
                className="text-neutral-400 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <div className="text-[11px] text-neutral-400 font-bold uppercase">Live API Secret Key</div>
            <div className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
              <span className="font-mono text-xs text-emerald-400">{devApi.apiKey.slice(0, 18)}••••••••</span>
              <button
                type="button"
                onClick={() => copyToClipboard(devApi.apiKey, 'API Secret')}
                className="text-neutral-400 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="md:col-span-2 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <div className="text-[11px] text-neutral-400 font-bold uppercase">Webhook Event Endpoint</div>
            <div className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
              <span className="font-mono text-xs text-neutral-300">{devApi.webhookUrl}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(devApi.webhookUrl, 'Webhook URL')}
                className="text-neutral-400 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
