import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import {
  currencyService,
  SUPPORTED_CURRENCIES,
  CurrencyMeta,
} from '../../services/currencyService';
import { soundEngine } from '../../utils/audioSynth';

export const RealTimeCurrencyExchangeCard: React.FC = () => {
  const {
    walletBalances,
    walletCurrency,
    setWalletCurrency,
    liveRates,
    openExchangeModal,
    exchangeCurrency,
  } = useChat();

  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>('ZAR');
  const [amount, setAmount] = useState<string>('100');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const amountNum = parseFloat(amount) || 0;
  const quote = useMemo(() => {
    return currencyService.convert(fromCurr, toCurr, amountNum);
  }, [fromCurr, toCurr, amountNum, liveRates]);

  const fromMeta = currencyService.getCurrencyMeta(fromCurr);
  const toMeta = currencyService.getCurrencyMeta(toCurr);

  const handleFlip = () => {
    soundEngine.playChime();
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  const handleQuickSwap = async () => {
    if (amountNum <= 0) return;
    setIsSwapping(true);
    await exchangeCurrency(fromCurr, toCurr, amountNum);
    setIsSwapping(false);
  };

  // Major pairs for live ticker
  const majorTickerPairs = [
    { code: 'ZAR', pair: 'USD/ZAR', rate: liveRates.ZAR?.rate || 18.26, change: liveRates.ZAR?.change24h || 0.45, dir: liveRates.ZAR?.direction || 'up' },
    { code: 'EUR', pair: 'EUR/USD', rate: +(1 / (liveRates.EUR?.rate || 0.92)).toFixed(4), change: liveRates.EUR?.change24h || -0.12, dir: liveRates.EUR?.direction || 'down' },
    { code: 'GBP', pair: 'GBP/USD', rate: +(1 / (liveRates.GBP?.rate || 0.784)).toFixed(4), change: liveRates.GBP?.change24h || 0.18, dir: liveRates.GBP?.direction || 'up' },
    { code: 'NGN', pair: 'USD/NGN', rate: liveRates.NGN?.rate || 1492.5, change: liveRates.NGN?.change24h || 0.85, dir: liveRates.NGN?.direction || 'up' },
    { code: 'KES', pair: 'USD/KES', rate: liveRates.KES?.rate || 129.4, change: liveRates.KES?.change24h || -0.22, dir: liveRates.KES?.direction || 'down' },
    { code: 'WAT', pair: 'WAT/USD', rate: 0.08, change: 4.2, dir: 'up' },
  ];

  return (
    <div
      id="realtime-currency-exchange-card"
      className="rounded-3xl bg-white/90 dark:bg-black/40 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)] space-y-6"
    >
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-base font-black text-neutral-900 dark:text-white tracking-tight">
              Real-Time Currency Exchange & Multi-Currency Vault
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
            Interbank mid-market spot rates • 0% network markup • Guaranteed instant settlement
          </p>
        </div>

        <button
          id="open-full-exchange-modal-btn"
          onClick={() => openExchangeModal(fromCurr, toCurr)}
          className="px-4 py-2 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 shadow-sm transition-all"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Open Full Converter</span>
        </button>
      </div>

      {/* Live Market Forex Ticker Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold whitespace-nowrap shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE TICKER</span>
        </div>

        {majorTickerPairs.map((p) => (
          <div
            key={p.pair}
            onClick={() => openExchangeModal(p.code === 'USD' ? 'USD' : 'USD', p.code)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] hover:border-emerald-500/40 text-xs font-mono cursor-pointer transition-all shrink-0"
          >
            <span className="font-bold text-neutral-800 dark:text-neutral-200">{p.pair}</span>
            <span className="font-mono text-neutral-600 dark:text-neutral-400 font-bold">
              {p.rate.toLocaleString()}
            </span>
            <span
              className={`text-[10px] font-bold flex items-center ${
                p.change >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {p.change >= 0 ? '+' : ''}{p.change}%
            </span>
          </div>
        ))}
      </div>

      {/* Interactive Quick Swap Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
        {/* From Side */}
        <div className="md:col-span-5 flex items-center gap-3 bg-white dark:bg-white/[0.04] p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Sell</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-lg font-black font-mono bg-transparent outline-none text-neutral-900 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <select
            value={fromCurr}
            onChange={(e) => {
              setFromCurr(e.target.value);
              soundEngine.playChime();
            }}
            className="bg-neutral-100 dark:bg-[#1a1e2b] text-neutral-900 dark:text-white text-xs font-mono font-bold py-1.5 px-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] outline-none"
          >
            {Object.values(SUPPORTED_CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
        </div>

        {/* Flip Button */}
        <div className="md:col-span-2 flex justify-center">
          <button
            type="button"
            onClick={handleFlip}
            title="Invert Currencies"
            className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 border border-black/[0.08] dark:border-white/[0.12] shadow-sm flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:scale-110 active:scale-95 transition-all"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* To Side */}
        <div className="md:col-span-5 flex items-center gap-3 bg-white dark:bg-white/[0.04] p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Receive</span>
            <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 truncate">
              {toMeta.symbol}{quote.toAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <select
            value={toCurr}
            onChange={(e) => {
              setToCurr(e.target.value);
              soundEngine.playChime();
            }}
            className="bg-neutral-100 dark:bg-[#1a1e2b] text-neutral-900 dark:text-white text-xs font-mono font-bold py-1.5 px-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] outline-none"
          >
            {Object.values(SUPPORTED_CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Multi-Currency Balances Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200">
          <span className="flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span>Multi-Currency Vault Holdings</span>
          </span>
          <span className="text-neutral-400 font-mono text-[11px]">
            Real-Time Matrix Ledgers
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
          {Object.values(SUPPORTED_CURRENCIES).slice(0, 10).map((curr) => {
            const bal = walletBalances[curr.code] ?? 0;
            const isSelected = walletCurrency === curr.code;
            return (
              <div
                key={curr.code}
                className={`p-3 rounded-2xl border transition-all relative group cursor-pointer ${
                  isSelected
                    ? 'border-black dark:border-white bg-black/[0.03] dark:bg-white/[0.06] shadow-sm'
                    : 'border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20'
                }`}
                onClick={() => setWalletCurrency(curr.code as any)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-base">{curr.flag}</span>
                  <span className="text-[10px] font-mono font-bold text-neutral-500 dark:text-neutral-400">
                    {curr.code}
                  </span>
                </div>
                <div className="font-mono font-black text-xs text-neutral-900 dark:text-white truncate">
                  {curr.symbol}
                  {bal.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openExchangeModal(curr.code, curr.code === 'USD' ? 'ZAR' : 'USD');
                  }}
                  className="mt-2 w-full py-1 text-[10px] font-mono font-bold rounded-lg bg-black/[0.04] dark:bg-white/[0.06] group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Exchange</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
