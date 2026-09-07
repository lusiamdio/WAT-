import React, { useState } from 'react';
import {
  Bot,
  Zap,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import { WATBusinessSettings } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const AutomationTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const automation = settings.automation;

  const [newKeyword, setNewKeyword] = useState('');
  const [newAction, setNewAction] = useState<'reply' | 'assign_label' | 'route_team' | 'send_catalog'>('reply');
  const [newPayload, setNewPayload] = useState('');
  const [isAddingTrigger, setIsAddingTrigger] = useState(false);

  const handleToggle = (key: keyof typeof automation) => {
    updateSettings((prev) => ({
      ...prev,
      automation: {
        ...prev.automation,
        [key]: !(prev.automation as any)[key],
      },
    }));
    showToast(`Automation toggled: ${String(key)}`);
  };

  const handleAddTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newPayload.trim()) return;

    const newTrig = {
      trigger: newKeyword.trim().toLowerCase(),
      action: newAction,
      payload: newPayload.trim(),
    };

    updateSettings((prev) => ({
      ...prev,
      automation: {
        ...prev.automation,
        keywordTriggers: [...prev.automation.keywordTriggers, newTrig],
      },
    }));

    setNewKeyword('');
    setNewPayload('');
    setIsAddingTrigger(false);
    showToast(`Keyword trigger "${newTrig.trigger}" active!`);
  };

  const handleDeleteTrigger = (idx: number) => {
    updateSettings((prev) => ({
      ...prev,
      automation: {
        ...prev.automation,
        keywordTriggers: prev.automation.keywordTriggers.filter((_, i) => i !== idx),
      },
    }));
    showToast('Trigger removed');
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* 7. Automation Main Hub */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-neutral-100">7. 🤖 Business Automation & Smart Rules</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold font-mono">
            RULE ENGINE V2
          </span>
        </div>

        {/* Master Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-200">Conversational AI Bot</div>
              <p className="text-[11px] text-neutral-500">Autonomous customer concierge</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('autoReplyBotEnabled')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                automation.autoReplyBotEnabled ? 'bg-cyan-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  automation.autoReplyBotEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-200">Lead Auto-Qualification</div>
              <p className="text-[11px] text-neutral-500">Tag high intent shoppers automatically</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('leadQualificationEnabled')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                automation.leadQualificationEnabled ? 'bg-cyan-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  automation.leadQualificationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-200">Team Routing Automation</div>
              <p className="text-[11px] text-neutral-500">Route billing to Finance, orders to Sales</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('smartRoutingEnabled')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                automation.smartRoutingEnabled ? 'bg-cyan-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  automation.smartRoutingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Keyword Triggers */}
        <div className="pt-4 border-t border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Keyword Action Triggers
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                When a customer sends a specific keyword, execute automated actions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingTrigger(!isAddingTrigger)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingTrigger ? 'Cancel' : 'Add Trigger'}</span>
            </button>
          </div>

          {isAddingTrigger && (
            <form onSubmit={handleAddTrigger} className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 font-bold">Keyword Trigger</label>
                  <input
                    type="text"
                    placeholder="e.g. price, invoice, agent"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 font-bold">Action Type</label>
                  <select
                    value={newAction}
                    onChange={(e: any) => setNewAction(e.target.value)}
                    className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200"
                  >
                    <option value="reply">Auto Reply with Text</option>
                    <option value="send_catalog">Send Catalog Card</option>
                    <option value="assign_label">Assign Customer Label</option>
                    <option value="route_team">Route to Staff Department</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 font-bold">Action Parameter / Payload</label>
                  <input
                    type="text"
                    placeholder="e.g. Hot lead, Sales, or link"
                    value={newPayload}
                    onChange={(e) => setNewPayload(e.target.value)}
                    className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs shadow-md"
              >
                Save Trigger
              </button>
            </form>
          )}

          <div className="space-y-2">
            {automation.keywordTriggers.map((trig, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    "{trig.trigger}"
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="text-neutral-300 font-medium">
                    Action: <strong className="text-cyan-400 uppercase font-mono">{trig.action}</strong>
                  </span>
                  <span className="text-neutral-400">({trig.payload})</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteTrigger(idx)}
                  className="text-neutral-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Automation */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-cyan-400" /> Instant FAQ Automated Answers
          </h4>

          <div className="space-y-2">
            {automation.faqAutomation.map((faq, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="text-xs font-bold text-neutral-100 flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">Q:</span>
                  <span>{faq.question}</span>
                </div>
                <p className="text-xs text-neutral-400 pl-4 leading-relaxed">
                  <span className="text-emerald-400 font-mono">A:</span> {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
