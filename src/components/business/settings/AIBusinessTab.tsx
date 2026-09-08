import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { WATBusinessSettings } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const AIBusinessTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const ai = settings.aiBusiness;

  const handleAIChange = (key: keyof typeof ai, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      aiBusiness: {
        ...prev.aiBusiness,
        [key]: val,
      },
    }));
  };

  const handleActionToggle = (actionKey: keyof typeof ai.allowedActions) => {
    updateSettings((prev) => ({
      ...prev,
      aiBusiness: {
        ...prev.aiBusiness,
        allowedActions: {
          ...prev.aiBusiness.allowedActions,
          [actionKey]: !prev.aiBusiness.allowedActions[actionKey],
        },
      },
    }));
    showToast(`Assistant capability updated: ${String(actionKey)}`);
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-900">
      {/* Automated Assistant & Intelligence */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Automated Assistant & Knowledge Base</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Configure customer-facing automated responses, interaction style, knowledge base, and actions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleAIChange('aiAssistantEnabled', !ai.aiAssistantEnabled)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              ai.aiAssistantEnabled
                ? 'bg-black text-white'
                : 'bg-neutral-200 text-neutral-600'
            }`}
          >
            {ai.aiAssistantEnabled ? 'Active' : 'Disabled'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Assistant Persona Name
            </label>
            <input
              type="text"
              value={ai.aiCopilotName}
              onChange={(e) => handleAIChange('aiCopilotName', e.target.value)}
              className="w-full mt-1.5 bg-white shadow-sm rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Personality & Interaction Style
            </label>
            <select
              value={ai.personality}
              onChange={(e: any) => handleAIChange('personality', e.target.value)}
              className="w-full mt-1.5 bg-white shadow-sm rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none"
            >
              <option value="warm_friendly">Warm & Welcoming Concierge</option>
              <option value="professional">Strictly Professional & Formal</option>
              <option value="persuasive">Persuasive Sales Advisor</option>
              <option value="empathetic">Customer Support Specialist</option>
              <option value="casual">Casual & Direct</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Business Knowledge Base & Guidelines
            </label>
            <textarea
              rows={4}
              value={ai.businessKnowledgeBase}
              onChange={(e) => handleAIChange('businessKnowledgeBase', e.target.value)}
              className="w-full mt-1.5 bg-white shadow-sm rounded-2xl p-3.5 text-xs text-neutral-900 outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Permitted Actions */}
        <div className="pt-4 space-y-3">
          <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
            Autonomous Actions & Permissions
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'suggestProducts', label: 'Suggest Products & Recommendations' },
              { key: 'generateInvoices', label: 'Generate Mobile Money Invoices' },
              { key: 'bookAppointments', label: 'Book Calendar Appointments' },
              { key: 'answerFaqs', label: 'Answer FAQs from Knowledge Base' },
              { key: 'qualifyLeads', label: 'Score & Tag High-Value Leads' },
              { key: 'processReturns', label: 'Authorize Refunds / Returns' },
            ].map((action) => {
              const active = (ai.allowedActions as any)[action.key];
              return (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => handleActionToggle(action.key as any)}
                  className={`p-3 rounded-2xl text-left flex items-center justify-between transition-all ${
                    active
                      ? 'bg-black text-white'
                      : 'bg-white shadow-sm text-neutral-600'
                  }`}
                >
                  <span className="text-xs font-medium">{action.label}</span>
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-neutral-400'}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Safeguards & Team Escalation */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-neutral-500">Confidence Threshold</div>
            <div className="text-lg font-bold font-mono text-neutral-900">
              {ai.confidenceThresholdPercent}%
            </div>
            <p className="text-[10px] text-neutral-500">Escalates to staff if match confidence is lower</p>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-neutral-500">Staff Handover Trigger</div>
            <div className="text-sm font-bold text-neutral-900">Instant Alert</div>
            <p className="text-[10px] text-neutral-500">Notifies team members when customer requests a representative</p>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-neutral-500">Data Privacy</div>
            <div className="text-sm font-bold text-neutral-900">Protected & Confidential</div>
            <p className="text-[10px] text-neutral-500">Customer conversations are end-to-end secured and private</p>
          </div>
        </div>
      </section>
    </div>
  );
};
