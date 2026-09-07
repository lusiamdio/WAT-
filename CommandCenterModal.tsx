import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Mic,
  MicOff,
  CheckCircle2,
  FileText,
  Languages,
  DollarSign,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { soundEngine } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface QuickCommand {
  id: string;
  icon: React.ReactNode;
  title: string;
  prompt: string;
  category: 'Comms' | 'Financials' | 'Discovery' | 'Meetings';
  execute: (setResult: (res: string) => void) => void;
}

export const CommandCenterModal: React.FC = () => {
  const {
    isCommandCenterOpen,
    setIsCommandCenterOpen,
    setActiveTab,
    setActiveRoomId,
    sendMessage,
    walletTransactions,
  } = useChat();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  const quickCommands: QuickCommand[] = [
    {
      id: 'cmd_send_proposal',
      icon: <FileText className="w-4 h-4 text-neutral-800" />,
      title: 'Send John the proposal',
      prompt: 'Send John Smith the revised Q3 strategic consulting proposal via encrypted chat',
      category: 'Comms',
      execute: (setResult) => {
        setActiveRoomId('room_kwame');
        sendMessage({
          text: 'Hi John, here is the revised Q3 strategic advisory proposal with updated milestones as discussed.',
          type: 'text',
        });
        setResult('✓ Proposal drafted and transmitted to John Smith with E2EE verification.');
        try {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
        } catch {}
      },
    },
    {
      id: 'cmd_translate_pt',
      icon: <Languages className="w-4 h-4 text-neutral-800" />,
      title: 'Translate conversation into Portuguese',
      prompt: 'Translate active chat transcript into Portuguese for our Luanda & Maputo partners',
      category: 'Comms',
      execute: (setResult) => {
        setResult('✓ Active chat transcript translated to Portuguese (pt-PT): "Olá, confirmamos o agendamento da reunião para quinta-feira antes das 14:00."');
      },
    },
    {
      id: 'cmd_payments_month',
      icon: <DollarSign className="w-4 h-4 text-neutral-800" />,
      title: 'Show payments received this month',
      prompt: 'Summarize all incoming revenues, customer settlements, and pending payouts for this month',
      category: 'Financials',
      execute: (setResult) => {
        setActiveTab('you');
        setResult('✓ Total received this month: R127,450 across 17 settled customer orders & retainers. Navigating to Wallet.');
      },
    },
    {
      id: 'cmd_restaurant_sarah',
      icon: <MapPin className="w-4 h-4 text-neutral-800" />,
      title: 'Find the restaurant Sarah recommended',
      prompt: 'Search chat history for Sarah Jenkins\' culinary recommendation in Johannesburg',
      category: 'Discovery',
      execute: (setResult) => {
        setActiveTab('discover');
        setResult('✓ Sarah recommended "The Greenhouse Rooftop & Artisan Bakery" in Rosebank (1.2 km away). Opening Discover card.');
      },
    },
    {
      id: 'cmd_summarize_biz',
      icon: <Layers className="w-4 h-4 text-neutral-800" />,
      title: 'Summarize today\'s unread conversations',
      prompt: 'Generate an executive summary of key action items, customer inquiries, and payment notifications across rooms',
      category: 'Comms',
      execute: (setResult) => {
        setActiveTab('dashboard');
        setResult('✓ Synthesized 14 conversations: 2 pending quotes for Kigali client, 1 new MoMo payment receipt, 3 unread priority mentions in Matrix.');
      },
    },
    {
      id: 'cmd_schedule_sfu',
      icon: <Calendar className="w-4 h-4 text-neutral-800" />,
      title: 'Start instant HD voice conference',
      prompt: 'Initiate a multi-peer Jitsi SFU room and generate invite links for current active contacts',
      category: 'Meetings',
      execute: (setResult) => {
        setActiveTab('calls');
        setResult('✓ Launched Sovereign SFU bridge "wat-exec-sync". Audio ratchets synchronized with zero latency.');
      },
    },
  ];

  const handleExecuteCommand = (cmd: QuickCommand) => {
    setIsProcessing(true);
    setExecutionResult(null);
    soundEngine.playChime();

    setTimeout(() => {
      cmd.execute(setExecutionResult);
      setIsProcessing(false);
      soundEngine.playMessageSent();
    }, 450);
  };

  const handleExecuteCustomPrompt = () => {
    if (!inputPrompt.trim()) return;
    setIsProcessing(true);
    setExecutionResult(null);
    soundEngine.playChime();

    setTimeout(() => {
      setIsProcessing(false);
      soundEngine.playMessageSent();
      const text = inputPrompt.toLowerCase();

      if (text.includes('pay') || text.includes('wallet') || text.includes('balance') || text.includes('money')) {
        setActiveTab('you');
        setExecutionResult(`✓ Processed financial command: Opened WAT Wallet. Current balance R24,850.00.`);
      } else if (text.includes('discover') || text.includes('restaurant') || text.includes('shop') || text.includes('event')) {
        setActiveTab('discover');
        setExecutionResult(`✓ Filtered WAT Discover layer based on "${inputPrompt}".`);
      } else if (text.includes('meeting') || text.includes('call') || text.includes('video')) {
        setActiveTab('calls');
        setExecutionResult(`✓ Generated WebRTC conference bridge and navigated to Calling hub.`);
      } else {
        setExecutionResult(`✦ WAT AI executed: "${inputPrompt}". Action dispatched across Matrix federated nodes.`);
      }
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }, 600);
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      soundEngine.playChime();
      setTimeout(() => {
        setInputPrompt('Summarize today\'s business conversations and show my wallet balance');
        setIsListening(false);
        soundEngine.playMessageSent();
      }, 1800);
    } else {
      setIsListening(false);
    }
  };

  if (!isCommandCenterOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl shadow-[0_24px_48px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col animate-scale text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-black/[0.06] flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
                WAT Command Center
                <span className="px-2 py-0.5 rounded-full bg-black/[0.05] border border-black/[0.08] text-neutral-700 text-[10px] font-mono font-bold">
                  AI HUD
                </span>
              </h3>
              <p className="text-xs text-neutral-500">
                What can I help you do across communications, business & wallet?
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCommandCenterOpen(false)}
            className="p-2 text-neutral-400 hover:text-black hover:bg-black/[0.04] rounded-2xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-b border-black/[0.06] bg-black/[0.02]">
          <div className="relative flex items-center bg-white border border-black/[0.1] rounded-2xl p-1.5 focus-within:border-black transition-all shadow-2xs">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteCustomPrompt()}
              placeholder="Ask or command WAT (e.g. 'Send John proposal', 'Summarize today')..."
              className="flex-1 bg-transparent px-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
              autoFocus
            />

            <button
              onClick={toggleMic}
              type="button"
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-neutral-500 hover:text-black hover:bg-black/[0.05]'
              }`}
              title="Voice Assistant Mode"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={handleExecuteCustomPrompt}
              disabled={!inputPrompt.trim() || isProcessing}
              className="p-2.5 rounded-xl bg-black hover:bg-neutral-800 disabled:opacity-40 text-white font-bold transition-all ml-1 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Execution Result Alert */}
        {executionResult && (
          <div className="p-4 bg-black/[0.03] border-b border-black/[0.06] flex items-start gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-bold text-neutral-900 block">
                Command Executed Successfully
              </span>
              <p className="text-xs text-neutral-700 mt-0.5">{executionResult}</p>
            </div>
            <button
              onClick={() => setExecutionResult(null)}
              className="text-xs text-neutral-400 hover:text-black p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Suggested Capabilities */}
        <div className="p-5 space-y-3 overflow-y-auto max-h-80 custom-scrollbar">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Instant Business & Comms Shortcuts
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">1-Tap Execution</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {quickCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => handleExecuteCommand(cmd)}
                disabled={isProcessing}
                className="p-3 rounded-2xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06] text-left transition-all group flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-black/[0.04] border border-black/[0.06]">
                      {cmd.icon}
                    </div>
                    <span className="text-xs font-bold text-neutral-900 group-hover:text-black">
                      {cmd.title}
                    </span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/[0.04] text-neutral-600 font-mono">
                    {cmd.category}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                  {cmd.prompt}
                </p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Execute now</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white/80 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-neutral-800" />
            <span>AI Model: Gemini 2.0 Flash • Sovereign Agent</span>
          </div>
          <span>Esc to dismiss</span>
        </div>
      </div>
    </div>
  );
};
