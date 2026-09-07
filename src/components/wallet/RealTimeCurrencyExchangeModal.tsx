import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ArrowDownUp,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import {
  currencyService,
  SUPPORTED_CURRENCIES,
  CurrencyMeta,
  RateTick,
} from '../../services/currencyService';
import { soundEngine } from '../../utils/audioSynth';

export const RealTimeCurrencyExchangeModal: React.FC = () => {
  const {
    isExchangeModalOpen,
    setIsExchangeModalOpen,
    exchangeInitialCurrencies,
    walletBalances,
    walletCurrency,
    liveRates,
    exchangeCurrency,
    isDarkMode,
  } = useChat();

  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('ZAR');
  const [sendAmountStr, setSendAmountStr] = useState<string>('100');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedTx, setCompletedTx] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [quoteSecondsLeft, setQuoteSecondsLeft] = useState<number>(60);
  const [isSelectingFrom, setIsSelectingFrom] = useState<boolean>(false);
  const [isSelectingTo, setIsSelectingTo] = useState<boolean>(false);

  // Initialize from props when modal opens
  useEffect(() => {
    if (isExchangeModalOpen) {
      setFromCurrency(exchangeInitialCurrencies?.from || 'USD');
      setToCurrency(exchangeInitialCurrencies?.to || 'ZAR');
      setCompletedTx(null);
      setError(null);
      setQuoteSecondsLeft(60);
    }
  }, [isExchangeModalOpen, exchangeInitialCurrencies]);

  // Quote refresh countdown timer
  useEffect(() => {
    if (!isExchangeModalOpen || completedTx) return;
    let currentSeconds = 60;
    const timer = setInterval(() => {
      currentSeconds -= 1;
      if (currentSeconds <= 0) {
        currentSeconds = 60;
        currencyService.applyMarketMicroTick();
      }
      setQuoteSecondsLeft(currentSeconds);
    }, 1000);
    return () => clearInterval(timer);
  }, [isExchangeModalOpen, completedTx]);

  const sendAmountNum = useMemo(() => {
    const parsed = parseFloat(sendAmountStr);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [sendAmountStr]);

  const quote = useMemo(() => {
    return currencyService.convert(fromCurrency, toCurrency, sendAmountNum);
  }, [fromCurrency, toCurrency, sendAmountNum, liveRates]);

  const fromMeta: CurrencyMeta = useMemo(() => {
    return currencyService.getCurrencyMeta(fromCurrency);
  }, [fromCurrency]);

  const toMeta: CurrencyMeta = useMemo(() => {
    return currencyService.getCurrencyMeta(toCurrency);
  }, [toCurrency]);

  const availableFromBalance = walletBalances[fromCurrency] ?? 0;
  const availableToBalance = walletBalances[toCurrency] ?? 0;

  const currentPairRateTick = liveRates[toCurrency];

  const handleSwapCurrencies = () => {
    soundEngine.playChime();
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setError(null);
  };

  const handleExecuteExchange = async () => {
    if (sendAmountNum <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }
    if (sendAmountNum > availableFromBalance) {
      setError(`Insufficient ${fromCurrency} balance. Available: ${fromMeta.symbol}${availableFromBalance.toLocaleString()}`);
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const res = await exchangeCurrency(fromCurrency, toCurrency, sendAmountNum);
      if (res.success && res.tx) {
        setCompletedTx({
          ...res.tx,
          fromAmount: sendAmountNum,
          fromCurrency,
          toAmount: quote.toAmount,
          toCurrency,
          rate: quote.exchangeRate,
          inverseRate: quote.inverseRate,
        });
      } else {
        setError(res.error || 'Currency exchange failed.');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to complete exchange');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isExchangeModalOpen) return null;

  return (
    <div
      id="realtime-currency-exchange-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-[fadeIn_0.15s_ease-out]"
      onClick={() => setIsExchangeModalOpen(false)}
    >
      <div
        id="realtime-currency-exchange-modal-card"
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#12151f] border border-black/[0.08] dark:border-white/[0.12] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/70 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                Real-Time Currency Exchange
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  Live Forex
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                WAT Sovereign Interbank • 0% Network Spread
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExchangeModalOpen(false)}
            className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {completedTx ? (
            /* Exchange Success Receipt View */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9 animate-[scale_0.2s_ease-out]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-neutral-900 dark:text-white">
                  Exchange Settled Successfully!
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
                  Settled on WAT Sovereign Matrix Ledger in &lt; 2s
                </p>
              </div>

              {/* Receipt Card */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-3 text-left">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <span className="text-neutral-500 dark:text-neutral-400">Sold Amount</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">
                    {fromMeta.flag} {fromMeta.symbol}{completedTx.fromAmount.toLocaleString()} {completedTx.fromCurrency}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <span className="text-neutral-500 dark:text-neutral-400">Received Amount</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {toMeta.flag} {toMeta.symbol}{completedTx.toAmount.toLocaleString()} {completedTx.toCurrency}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <span className="text-neutral-500 dark:text-neutral-400">Execution Spot Rate</span>
                  <span className="font-mono text-neutral-700 dark:text-neutral-300">
                    1 {completedTx.fromCurrency} = {completedTx.rate} {completedTx.toCurrency}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400">Reference ID</span>
                  <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                    {completedTx.referenceId}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setCompletedTx(null)}
                  className="flex-1 py-3 px-4 rounded-2xl border border-black/[0.12] dark:border-white/[0.15] text-xs font-bold hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all"
                >
                  Make Another Exchange
                </button>
                <button
                  onClick={() => setIsExchangeModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold shadow-md hover:opacity-90 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Converter & Order Entry Form */
            <>
              {/* Real-time Ticker Ribbon */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100/80 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    1 {fromCurrency} = {quote.exchangeRate} {toCurrency}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {currentPairRateTick && (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        currentPairRateTick.direction === 'up'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : currentPairRateTick.direction === 'down'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600'
                      }`}
                    >
                      {currentPairRateTick.direction === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : currentPairRateTick.direction === 'down' ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : null}
                      {currentPairRateTick.change24h >= 0 ? '+' : ''}
                      {currentPairRateTick.change24h}%
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {quoteSecondsLeft}s
                  </span>
                </div>
              </div>

              {/* "You Pay" Container */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] space-y-2 relative">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-500 dark:text-neutral-400">You Pay</span>
                  <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    Available: {fromMeta.symbol}
                    {availableFromBalance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <input
                    type="number"
                    value={sendAmountStr}
                    onChange={(e) => {
                      setSendAmountStr(e.target.value);
                      setError(null);
                    }}
                    placeholder="0.00"
                    step="any"
                    className="w-full text-2xl sm:text-3xl font-black font-mono bg-transparent outline-none text-neutral-900 dark:text-white"
                  />

                  {/* Currency Picker Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSelectingFrom(!isSelectingFrom);
                        setIsSelectingTo(false);
                      }}
                      className="flex items-center gap-2 py-2 px-3 rounded-2xl bg-white dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.12] shadow-sm hover:bg-neutral-50 dark:hover:bg-white/[0.12] transition-colors whitespace-nowrap"
                    >
                      <span className="text-base">{fromMeta.flag}</span>
                      <span className="font-bold text-xs font-mono">{fromCurrency}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    </button>

                    {/* From Currency Dropdown */}
                    {isSelectingFrom && (
                      <div className="absolute right-0 top-full mt-2 w-56 max-h-60 overflow-y-auto rounded-2xl bg-white dark:bg-[#181b26] border border-black/[0.10] dark:border-white/[0.15] shadow-2xl z-40 p-1.5 space-y-1">
                        {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                          <button
                            key={c.code}
                            onClick={() => {
                              if (c.code === toCurrency) {
                                setToCurrency(fromCurrency);
                              }
                              setFromCurrency(c.code);
                              setIsSelectingFrom(false);
                              soundEngine.playChime();
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                              fromCurrency === c.code
                                ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                                : 'hover:bg-neutral-100 dark:hover:bg-white/[0.06] text-neutral-800 dark:text-neutral-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{c.flag}</span>
                              <span className="font-bold font-mono">{c.code}</span>
                            </div>
                            <span className="text-[10px] opacity-70 font-mono">
                              {walletBalances[c.code] !== undefined
                                ? `${c.symbol}${walletBalances[c.code]?.toLocaleString()}`
                                : ''}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Amount Chips */}
                <div className="flex gap-2 pt-1">
                  {[100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSendAmountStr(String(amt))}
                      className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-neutral-600 dark:text-neutral-300 transition-colors"
                    >
                      +{fromMeta.symbol}{amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSendAmountStr(String(Math.floor(availableFromBalance)))}
                    className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors ml-auto"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Swap Switch Button */}
              <div className="relative flex justify-center -my-2 z-10">
                <button
                  type="button"
                  onClick={handleSwapCurrencies}
                  title="Invert Exchange Direction"
                  className="w-10 h-10 rounded-full bg-white dark:bg-[#1f2332] border border-black/[0.10] dark:border-white/[0.15] shadow-lg flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:scale-110 active:scale-90 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                >
                  <ArrowDownUp className="w-4 h-4" />
                </button>
              </div>

              {/* "You Receive" Container */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] space-y-2 relative">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-500 dark:text-neutral-400">You Receive</span>
                  <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    Balance: {toMeta.symbol}
                    {availableToBalance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="w-full text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
                    {toMeta.symbol}
                    {quote.toAmount.toLocaleString('en-US', {
                      minimumFractionDigits: toMeta.decimals,
                      maximumFractionDigits: toMeta.decimals,
                    })}
                  </div>

                  {/* Currency Picker Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSelectingTo(!isSelectingTo);
                        setIsSelectingFrom(false);
                      }}
                      className="flex items-center gap-2 py-2 px-3 rounded-2xl bg-white dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.12] shadow-sm hover:bg-neutral-50 dark:hover:bg-white/[0.12] transition-colors whitespace-nowrap"
                    >
                      <span className="text-base">{toMeta.flag}</span>
                      <span className="font-bold text-xs font-mono">{toCurrency}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    </button>

                    {/* To Currency Dropdown */}
                    {isSelectingTo && (
                      <div className="absolute right-0 top-full mt-2 w-56 max-h-60 overflow-y-auto rounded-2xl bg-white dark:bg-[#181b26] border border-black/[0.10] dark:border-white/[0.15] shadow-2xl z-40 p-1.5 space-y-1">
                        {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                          <button
                            key={c.code}
                            onClick={() => {
                              if (c.code === fromCurrency) {
                                setFromCurrency(toCurrency);
                              }
                              setToCurrency(c.code);
                              setIsSelectingTo(false);
                              soundEngine.playChime();
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                              toCurrency === c.code
                                ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                                : 'hover:bg-neutral-100 dark:hover:bg-white/[0.06] text-neutral-800 dark:text-neutral-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{c.flag}</span>
                              <span className="font-bold font-mono">{c.code}</span>
                            </div>
                            <span className="text-[10px] opacity-70 font-mono">
                              {walletBalances[c.code] !== undefined
                                ? `${c.symbol}${walletBalances[c.code]?.toLocaleString()}`
                                : ''}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Market Trade Details Breakdown */}
              <div className="p-4 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-neutral-500 dark:text-neutral-400">
                  <span>Guaranteed Rate</span>
                  <span className="text-neutral-900 dark:text-white font-bold">
                    1 {fromCurrency} = {quote.exchangeRate} {toCurrency}
                  </span>
                </div>
                <div className="flex justify-between items-center text-neutral-500 dark:text-neutral-400">
                  <span>Inverse Rate</span>
                  <span className="text-neutral-900 dark:text-white">
                    1 {toCurrency} = {quote.inverseRate} {fromCurrency}
                  </span>
                </div>
                <div className="flex justify-between items-center text-neutral-500 dark:text-neutral-400">
                  <span>Matrix Protocol Fee</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    0.00% (Zero Fee)
                  </span>
                </div>
                <div className="flex justify-between items-center text-neutral-500 dark:text-neutral-400">
                  <span>Settlement Speed</span>
                  <span className="text-neutral-900 dark:text-white">
                    Instant (&lt; 2.0s)
                  </span>
                </div>
              </div>

              {/* Submit Exchange Button */}
              <button
                id="execute-realtime-exchange-btn"
                type="button"
                disabled={isProcessing || sendAmountNum <= 0}
                onClick={handleExecuteExchange}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  isProcessing || sendAmountNum <= 0
                    ? 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Matrix Settlement...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>
                      Swap {fromMeta.symbol}{sendAmountNum.toLocaleString()} {fromCurrency} → {toMeta.symbol}{quote.toAmount.toLocaleString()} {toCurrency}
                    </span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
