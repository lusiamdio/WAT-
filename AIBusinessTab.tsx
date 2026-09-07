import React from 'react';
import {
  Sparkles,
  Bot,
  Sliders,
  Shield,
  FileText,
  CheckCircle2,
  Brain,
  MessageSquare,
  Zap,
} from 'lucide-react';
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
    showToast(`AI capability updated: ${String(actionKey)}`);
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* 22. AI Assistant & Intelligence */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-neutral-100">22. 🤖 AI Assistant & Gemini Sales Copilot</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Configure your autonomous customer-facing AI agent, personality tone, knowledge base, and actions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleAIChange('aiAssistantEnabled', !ai.aiAssistantEnabled)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-md ${
              ai.aiAssistantEnabled
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold shadow-amber-500/20'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            {ai.aiAssistantEnabled ? 'AI AGENT ACTIVE' : 'AI DISABLED'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              AI Assistant Persona Name
            </label>
            <input
              type="text"
              value={ai.aiCopilotName}
              onChange={(e) => handleAIChange('aiCopilotName', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Personality & Interaction Style
            </label>
            <select
              value={ai.personality}
              onChange={(e: any) => handleAIChange('personality', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl px-3.5 py-2.5 text-xs text-neutral-100 outline-none"
            >
              <option value="warm_friendly">Warm & Welcoming Concierge</option>
              <option value="professional">Strictly Professional & Formal</option>
              <option value="persuasive">Persuasive High-Conversion Sales Closer</option>
              <option value="empathetic">Empathetic Customer Support Specialist</option>
              <option value="casual">Casual & Direct</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
              <span>Business Knowledge Base (Context Fed to Gemini)</span>
              <span className="text-[10px] text-amber-400 font-mono">Real-time Grounding</span>
            </label>
            <textarea
              rows={4}
              value={ai.businessKnowledgeBase}
              onChange={(e) => handleAIChange('businessKnowledgeBase', e.target.value)}
              className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl p-3.5 text-xs text-neutral-100 outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Permitted AI Actions */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Autonomous Actions & Permissions
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'suggestProducts', label: 'Suggest Products & Cross-sell' },
              { key: 'generateInvoices', label: 'Generate M-Pesa & MoMo Invoices' },
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
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    active
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                  }`}
                >
                  <span className="text-xs font-medium">{action.label}</span>
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${active ? 'text-amber-400' : 'text-neutral-700'}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Safeguards & Handover */}
        <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <div className="text-[11px] font-bold text-neutral-400">Confidence Threshold</div>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {ai.confidenceThresholdPercent}%
            </div>
            <p className="text-[10px] text-neutral-500">Hands over to human if AI confidence is lower</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <div className="text-[11px] font-bold text-neutral-400">Human Handover Trigger</div>
            <div className="text-sm font-bold text-amber-300">Instant Alert</div>
            <p className="text-[10px] text-neutral-500">Notifies staff when customer asks for human</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <div className="text-[11px] font-bold text-neutral-400">Data Training Privacy</div>
            <div className="text-sm font-bold text-emerald-400">Protected & Opted Out</div>
            <p className="text-[10px] text-neutral-500">Chats never used to train public foundation models</p>
          </div>
        </div>
      </section>
    </div>
  );
};
