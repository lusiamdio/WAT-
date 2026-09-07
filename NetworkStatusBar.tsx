import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const NetworkStatusBar: React.FC = () => {
  const {
    networkMode,
    setNetworkMode,
    isOnline,
    outboxQueue,
    flushOutboxQueue,
  } = useChat();

  const isSimulated = networkMode !== 'online';
  const hasQueued = outboxQueue.length > 0;

  if (!isSimulated && !hasQueued && isOnline) {
    return null;
  }

  return (
    <div
      className={`w-full py-1.5 px-4 text-xs font-medium flex items-center justify-between transition-colors z-30 ${
        networkMode === 'offline' || !isOnline
          ? 'bg-red-600 text-white shadow-sm'
          : networkMode === 'slow-3g'
          ? 'bg-amber-500 text-white shadow-sm'
          : 'bg-emerald-600 text-white shadow-sm'
      }`}
    >
      <div className="flex items-center gap-2">
        {networkMode === 'offline' || !isOnline ? (
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
        ) : (
          <Wifi className="w-3.5 h-3.5" />
        )}

        <span>
          {networkMode === 'offline' || !isOnline
            ? 'Matrix Node Offline — Messages will be queued locally in IndexedDB'
            : networkMode === 'slow-3g'
            ? 'Simulated Low-Bandwidth (2G/3G) — High latency messaging active'
            : 'Matrix Connected'}
        </span>

        {hasQueued && (
          <span className="px-2 py-0.5 rounded-full bg-white/20 font-bold text-[10px]">
            {outboxQueue.length} pending in outbox
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {hasQueued && (
          <button
            onClick={flushOutboxQueue}
            className="flex items-center gap-1 px-2 py-0.5 bg-white text-neutral-900 rounded-md font-bold text-[11px] hover:bg-neutral-100 transition-colors shadow-xs"
            title="Retry sending outbox queue"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Queue</span>
          </button>
        )}

        <select
          value={networkMode}
          onChange={(e) => setNetworkMode(e.target.value as any)}
          aria-label="Matrix Network Mode"
          className="bg-black/20 text-white border border-white/20 rounded px-1.5 py-0.5 text-[11px] font-semibold cursor-pointer outline-none hover:bg-black/30"
        >
          <option value="online" className="text-neutral-900">Normal (Online)</option>
          <option value="slow-3g" className="text-neutral-900">Slow 3G Simulation</option>
          <option value="offline" className="text-neutral-900">Offline Simulation</option>
        </select>
      </div>
    </div>
  );
};
