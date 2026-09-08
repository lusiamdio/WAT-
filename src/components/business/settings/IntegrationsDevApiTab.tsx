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
    <div className="space-y-8 animate-fade-in text-neutral-900">
      {/* Integrations Hub */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-base font-bold text-neutral-900">CRM & eCommerce Integrations</h3>
          <span className="text-xs font-mono text-neutral-600 font-semibold">SYNC ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {integrations.map((integ) => (
            <div
              key={integ.id}
              className="p-4 rounded-2xl bg-white shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-neutral-900 shadow-xs">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900">{integ.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        integ.status === 'connected'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {integ.status === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{integ.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast(`Configuring integration for ${integ.name}`)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-xs font-bold text-neutral-900 shadow-xs"
              >
                Configure
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Developer API & Webhooks */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-base font-bold text-neutral-900">Developer Webhooks & Cloud API</h3>
          <span className="text-xs font-mono text-neutral-600 font-semibold">REST API v2.4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white shadow-sm space-y-1.5">
            <div className="text-[11px] text-neutral-600 font-bold uppercase">WAT Business App ID</div>
            <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-xl shadow-xs">
              <span className="font-mono text-xs text-neutral-900">{devApi.appId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(devApi.appId, 'App ID')}
                className="text-neutral-500 hover:text-black"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm space-y-1.5">
            <div className="text-[11px] text-neutral-600 font-bold uppercase">Live API Secret Key</div>
            <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-xl shadow-xs">
              <span className="font-mono text-xs text-neutral-900">{devApi.apiKey.slice(0, 18)}••••••••</span>
              <button
                type="button"
                onClick={() => copyToClipboard(devApi.apiKey, 'API Secret')}
                className="text-neutral-500 hover:text-black"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="md:col-span-2 p-4 rounded-2xl bg-white shadow-sm space-y-1.5">
            <div className="text-[11px] text-neutral-600 font-bold uppercase">Webhook Event Endpoint</div>
            <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-xl shadow-xs">
              <span className="font-mono text-xs text-neutral-900">{devApi.webhookUrl}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(devApi.webhookUrl, 'Webhook URL')}
                className="text-neutral-500 hover:text-black"
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
