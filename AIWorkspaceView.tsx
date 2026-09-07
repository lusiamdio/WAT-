import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Languages,
  FileText,
  MessageSquare,
  Bot,
  Zap,
  Mic,
  Copy,
  Check,
  RotateCw,
  Layers,
  ArrowRight,
  TrendingUp,
  Brain,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { soundEngine } from '../utils/audioSynth';

type AITool = 'ask' | 'summarize' | 'translate' | 'compose';

export const AIWorkspaceView: React.FC = () => {
  const {
    rooms,
  } = useChat();

  const [activeTool, setActiveTool] = useState<AITool>('ask');
  const [askQuery, setAskQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Ask AI Chat State
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Good day! I am your WAT AI Copilot. I can summarize conversations, draft client proposals, translate between 30+ languages, audit invoices, and analyze business metrics.',
      time: 'Just now',
    },
  ]);

  // Summarizer State
  const [selectedRoomToSummarize, setSelectedRoomToSummarize] = useState(rooms[0]?.id || '');
  const [summaryOutput, setSummaryOutput] = useState<string | null>(null);

  // Translator State
  const [transInput, setTransInput] = useState('Hello, we confirmed the delivery for Thursday before 14:00.');
  const [transLang, setTransLang] = useState('Portuguese');
  const [transOutput, setTransOutput] = useState('Olá, confirmamos a entrega para quinta-feira antes das 14:00.');

  // AI Message Composer State
  const [composerPrompt, setComposerPrompt] = useState('Write a professional response accepting John\'s proposal milestone');
  const [composerTone, setComposerTone] = useState<'Professional' | 'Friendly' | 'Concise' | 'Direct'>('Professional');
  const [composerOutput, setComposerOutput] = useState(
    "Thanks, John. Thursday works perfectly for the strategy kickoff. I'll review the updated milestone deliverables and transmit our approval before 14:00."
  );

  const handleAskSubmit = () => {
    if (!askQuery.trim()) return;
    const userMsg = askQuery;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg, time }]);
    setAskQuery('');
    setIsProcessing(true);
    soundEngine.playMessageSent();

    setTimeout(() => {
      setIsProcessing(false);
      let reply = `✦ WAT AI Analysis: Based on your Matrix logs and business ledger, here are the key insights regarding "${userMsg}":`;
      if (userMsg.toLowerCase().includes('revenue') || userMsg.toLowerCase().includes('wallet')) {
        reply = `Your current balance is R24,850.00 with R127,450 revenue recorded this month across 17 wholesale orders. All settlements are backed by verifiable transaction hashes.`;
      } else if (userMsg.toLowerCase().includes('john')) {
        reply = `John Smith accepted your Q3 advisory proposal, settled an R2,500 retainer, and requested meeting slides before 14:00 on Thursday.`;
      } else {
        reply = `I have cross-referenced your encrypted chats and workspace data. Action items and timeline adjustments have been prepared for immediate execution.`;
      }
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
      soundEngine.playChime();
    }, 700);
  };

  const handleSummarize = () => {
    setIsProcessing(true);
    soundEngine.playChime();
    setTimeout(() => {
      const room = rooms.find((r) => r.id === selectedRoomToSummarize);
      setSummaryOutput(
        `✦ Executive Summary for "${room?.name || 'Selected Room'}":\n• 3 key decisions made regarding infrastructure scaling & sliding-sync deployment.\n• Delivery confirmed for Thursday before 14:00.\n• Next step: Approve PR and send invoice receipt.`
      );
      setIsProcessing(false);
    }, 600);
  };

  const handleTranslate = () => {
    setIsProcessing(true);
    soundEngine.playChime();
    setTimeout(() => {
      if (transLang === 'Portuguese') {
        setTransOutput('Olá, confirmamos a entrega para quinta-feira antes das 14:00.');
      } else if (transLang === 'French') {
        setTransOutput('Bonjour, nous avons confirmé la livraison pour jeudi avant 14h00.');
      } else if (transLang === 'Swahili') {
        setTransOutput('Habari, tumethibitisha uwasilishaji kwa Alhamisi kabla ya saa 14:00.');
      } else if (transLang === 'Yoruba') {
        setTransOutput('Ẹ n lẹ o, a ti fọwọsi ifijiṣẹ fun Ọjọbọ ṣaaju aago 14:00.');
      } else {
        setTransOutput(`[${transLang}] ${transInput}`);
      }
      setIsProcessing(false);
    }, 500);
  };

  const handleCompose = () => {
    setIsProcessing(true);
    soundEngine.playChime();
    setTimeout(() => {
      if (composerTone === 'Professional') {
        setComposerOutput(
          `Dear Partner, thank you for the detailed brief. Thursday works seamlessly for our alignment session, and we look forward to finalizing the proposal deliverables.`
        );
      } else if (composerTone === 'Concise') {
        setComposerOutput(`Confirmed for Thursday before 14:00. Revised proposal is on the way.`);
      } else if (composerTone === 'Friendly') {
        setComposerOutput(`Awesome, thanks so much! Thursday sounds great to me. Excited to collaborate! 😊`);
      } else {
        setComposerOutput(`Approved. Let's proceed as scheduled on Thursday.`);
      }
      setIsProcessing(false);
    }, 500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundEngine.playChime();
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex-1 bg-neutral-100 flex flex-col h-full overflow-y-auto select-none p-4 sm:p-6 md:p-8 pb-20 md:pb-8 text-neutral-900">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                WAT Intelligence Suite
              </h1>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Context-aware LLM, universal translation, conversation synthesizer & executive business copilot
            </p>
          </div>

          {/* Tool Navigation Pills */}
          <div className="flex items-center gap-1.5 bg-white/90 p-1.5 rounded-2xl border border-black/[0.08] overflow-x-auto no-scrollbar shadow-sm">
            {[
              { id: 'ask', label: 'Ask AI', icon: <Bot className="w-3.5 h-3.5" /> },
              { id: 'summarize', label: 'Summarizer', icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'translate', label: 'Translator', icon: <Languages className="w-3.5 h-3.5" /> },
              { id: 'compose', label: 'Composer', icon: <FileText className="w-3.5 h-3.5" /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTool(t.id as AITool);
                  soundEngine.playChime();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  activeTool === t.id
                    ? 'bg-black text-white shadow-sm font-bold'
                    : 'text-neutral-600 hover:text-black hover:bg-black/[0.04]'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. ASK AI TAB */}
        {activeTool === 'ask' && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-4 sm:p-6 flex flex-col h-[500px] shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
                {chatHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      item.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {item.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl max-w-[80%] text-xs sm:text-sm leading-relaxed ${
                        item.sender === 'user'
                          ? 'bg-black text-white rounded-tr-none font-medium'
                          : 'bg-black/[0.03] text-neutral-900 border border-black/[0.06] rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{item.text}</p>
                      <span className="block text-[10px] text-right mt-1.5 opacity-60">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-xs text-neutral-600 p-2 font-semibold animate-pulse">
                    <Sparkles className="w-4 h-4 text-black" />
                    WAT AI is analyzing workspace records...
                  </div>
                )}
              </div>

              {/* Quick Prompts */}
              <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  'Summarize my pending tasks',
                  'What did John say about the proposal?',
                  'Calculate total revenue this month',
                  'Draft a quote for 25 jackets',
                ].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAskQuery(p);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 text-[11px] whitespace-nowrap font-medium transition-colors border border-black/[0.06]"
                  >
                    ✦ {p}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="pt-2 border-t border-black/[0.06] flex items-center gap-2">
                <input
                  type="text"
                  value={askQuery}
                  onChange={(e) => setAskQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskSubmit()}
                  placeholder="Ask WAT AI anything about your chats, clients, financials..."
                  className="flex-1 bg-black/[0.03] border border-black/[0.08] rounded-2xl px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
                />
                <button
                  onClick={handleAskSubmit}
                  disabled={!askQuery.trim() || isProcessing}
                  className="p-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold disabled:opacity-40 transition-all shadow-md active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SUMMARIZER TAB */}
        {activeTool === 'summarize' && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 space-y-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-neutral-800" />
              Chat & Meeting Transcript Summarizer
            </h3>
            <p className="text-xs text-neutral-500">
              Select any conversation to extract decisions, action items, dates, and assigned owners.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedRoomToSummarize}
                onChange={(e) => setSelectedRoomToSummarize(e.target.value)}
                className="flex-1 bg-black/[0.03] border border-black/[0.08] rounded-2xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.unreadCount || 0} unread)
                  </option>
                ))}
              </select>
              <button
                onClick={handleSummarize}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                {isProcessing ? 'Synthesizing...' : 'Generate AI Summary'}
              </button>
            </div>

            {summaryOutput && (
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.08] space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    Executive Briefing Output
                  </span>
                  <button
                    onClick={() => copyToClipboard(summaryOutput, 'sum_out')}
                    className="text-xs text-neutral-600 hover:text-black flex items-center gap-1 font-semibold"
                  >
                    {copiedId === 'sum_out' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'sum_out' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-neutral-700 whitespace-pre-wrap leading-relaxed">
                  {summaryOutput}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. TRANSLATOR TAB */}
        {activeTool === 'translate' && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 space-y-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Languages className="w-5 h-5 text-neutral-800" />
              Pan-African & Global Universal Translator
            </h3>
            <p className="text-xs text-neutral-500">
              Translate incoming inquiries and outgoing proposals across English, Portuguese, French, Swahili, Yoruba, Zulu, Amharic, and Arabic.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                  Original Message
                </label>
                <textarea
                  value={transInput}
                  onChange={(e) => setTransInput(e.target.value)}
                  rows={3}
                  className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl p-3 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 font-semibold">Target Language:</span>
                <select
                  value={transLang}
                  onChange={(e) => setTransLang(e.target.value)}
                  className="bg-black/[0.03] border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-neutral-900"
                >
                  <option value="Portuguese">Portuguese (Luanda / Maputo / Lisbon)</option>
                  <option value="French">French (Dakar / Abidjan / Paris)</option>
                  <option value="Swahili">Swahili (Nairobi / Dar es Salaam)</option>
                  <option value="Yoruba">Yoruba (Lagos / Ibadan)</option>
                  <option value="Zulu">Zulu (Johannesburg / Durban)</option>
                  <option value="Arabic">Arabic (Cairo / Casablanca)</option>
                  <option value="English">English</option>
                </select>
                <button
                  onClick={handleTranslate}
                  className="px-4 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold ml-auto shadow-sm active:scale-95"
                >
                  Translate
                </button>
              </div>

              {transOutput && (
                <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.08] space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">
                      Translated Result ({transLang})
                    </span>
                    <button
                      onClick={() => copyToClipboard(transOutput, 'tr_out')}
                      className="text-xs text-neutral-600 hover:text-black flex items-center gap-1 font-semibold"
                    >
                      {copiedId === 'tr_out' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === 'tr_out' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-900 font-medium">
                    {transOutput}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. AI COMPOSER TAB */}
        {activeTool === 'compose' && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 space-y-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-neutral-800" />
              AI Smart Message & Proposal Composer
            </h3>
            <p className="text-xs text-neutral-500">
              Type what you want to communicate in bullet points and let WAT AI generate a tailored, persuasive response.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                  Brief Intent
                </label>
                <input
                  type="text"
                  value={composerPrompt}
                  onChange={(e) => setComposerPrompt(e.target.value)}
                  placeholder="e.g. Write a professional response accepting John's proposal milestone"
                  className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              {/* Tone Selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-semibold">Tone:</span>
                {(['Professional', 'Concise', 'Friendly', 'Direct'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setComposerTone(t)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      composerTone === t
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-black/[0.04] text-neutral-600 hover:text-black border border-black/[0.05]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <button
                  onClick={handleCompose}
                  className="px-4 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold ml-auto shadow-sm active:scale-95"
                >
                  Generate Text
                </button>
              </div>

              {composerOutput && (
                <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.08] space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">
                      Generated Response ({composerTone})
                    </span>
                    <button
                      onClick={() => copyToClipboard(composerOutput, 'comp_out')}
                      className="text-xs text-neutral-600 hover:text-black flex items-center gap-1 font-semibold"
                    >
                      {copiedId === 'comp_out' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === 'comp_out' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
                    &ldquo;{composerOutput}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
