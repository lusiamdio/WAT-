import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  FileAudio,
  CheckCheck,
} from 'lucide-react';
import { Message } from '../types';
import { soundEngine } from '../utils/audioSynth';

interface AudioVoicePlayerProps {
  message: Message;
  isOwn: boolean;
  onTranscribe?: () => void;
  isTranscribing?: boolean;
}

export const AudioVoicePlayer: React.FC<AudioVoicePlayerProps> = ({
  message,
  isOwn,
  onTranscribe,
  isTranscribing,
}) => {
  const duration = message.mediaInfo?.duration || 18;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHoveringSeek, setIsHoveringSeek] = useState(false);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const [showTranscription, setShowTranscription] = useState(true);

  const timerRef = useRef<any>(null);
  const seekContainerRef = useRef<HTMLDivElement>(null);

  // Normalised waveform data (fallback if not provided in message)
  const waveform = message.mediaInfo?.waveform || [
    0.25, 0.45, 0.75, 0.9, 0.6, 0.35, 0.8, 1.0, 0.85, 0.55, 0.35, 0.7, 0.95,
    0.75, 0.45, 0.25, 0.5, 0.85, 0.4, 0.65, 0.9, 0.5, 0.3,
  ];

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = Math.floor(sec % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Playback timer & synth audio sync
  useEffect(() => {
    if (isPlaying) {
      if (!isMuted) {
        soundEngine.startVoicePlayback();
      }

      const stepIntervalMs = 50;
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const nextTime = prev + (stepIntervalMs / 1000) * playbackRate;
          if (nextTime >= duration) {
            setIsPlaying(false);
            soundEngine.stopVoicePlayback();
            return 0;
          }
          return nextTime;
        });
      }, stepIntervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      soundEngine.stopVoicePlayback();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      soundEngine.stopVoicePlayback();
    };
  }, [isPlaying, playbackRate, isMuted, duration]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentTime >= duration) {
        setCurrentTime(0);
      }
      setIsPlaying(true);
    }
  };

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(duration, newTime));
    setCurrentTime(clamped);
    soundEngine.playSeekTick();
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekContainerRef.current) return;
    const rect = seekContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    handleSeek(ratio * duration);
  };

  const handleWaveformMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekContainerRef.current) return;
    const rect = seekContainerRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, hoverX / rect.width));
    setHoverSeekTime(ratio * duration);
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    soundEngine.playSeekTick();
  };

  const skipRelative = (delta: number) => {
    handleSeek(currentTime + delta);
  };

  const progressRatio = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="my-1 w-full max-w-[320px] sm:max-w-[360px] select-none">
      {/* Audio Player Card Frame */}
      <div
        className={`rounded-2xl p-3 border transition-colors ${
          isOwn
            ? 'bg-white/10 border-white/20 text-white'
            : 'bg-black/[0.02] border-black/[0.08] text-neutral-900'
        }`}
      >
        {/* Top Header: Voice Note Tag & Codec Details */}
        <div className={`flex items-center justify-between pb-2 mb-2 border-b text-[11px] ${isOwn ? 'border-white/15' : 'border-black/[0.06]'}`}>
          <div className="flex items-center gap-1.5 font-bold">
            <FileAudio className="w-3.5 h-3.5" />
            <span>Voice Note</span>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${isOwn ? 'bg-white/20 text-white' : 'bg-black/[0.05] text-neutral-700'}`}>
              Opus 48kHz
            </span>
          </div>

          <div className={`flex items-center gap-2 text-[10px] ${isOwn ? 'text-white/70' : 'text-neutral-500'}`}>
            <span>{message.mediaInfo?.fileSize || '380 KB'}</span>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 hover:opacity-80 transition-opacity"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Core Controls Row: Play/Pause Button, Interactive Waveform Seekbar */}
        <div className="flex items-center gap-2.5">
          {/* Main Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold shadow transition-transform active:scale-90 shrink-0 ${
              isOwn
                ? 'bg-white text-black hover:bg-neutral-100'
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
            title={isPlaying ? 'Pause' : 'Play Voice Note'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Waveform & Scrub Area */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            {/* Interactive Waveform Container */}
            <div
              ref={seekContainerRef}
              onClick={handleWaveformClick}
              onMouseEnter={() => setIsHoveringSeek(true)}
              onMouseLeave={() => {
                setIsHoveringSeek(false);
                setHoverSeekTime(null);
              }}
              onMouseMove={handleWaveformMouseMove}
              className={`relative flex items-center gap-0.5 h-8 px-1 rounded-xl cursor-pointer transition-colors group ${
                isOwn ? 'hover:bg-white/10' : 'hover:bg-black/[0.04]'
              }`}
              title="Click or drag to seek voice note"
            >
              {/* Hover seek time preview tooltip */}
              {isHoveringSeek && hoverSeekTime !== null && (
                <div
                  className="absolute -top-5 transform -translate-x-1/2 bg-white border border-black/[0.08] text-neutral-900 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-lg pointer-events-none z-10"
                  style={{
                    left: `${(hoverSeekTime / duration) * 100}%`,
                  }}
                >
                  {formatSeconds(hoverSeekTime)}
                </div>
              )}

              {/* Waveform Bars with dynamic Played / Unplayed coloring */}
              {waveform.map((barHeight, i) => {
                const barPositionRatio = (i + 0.5) / waveform.length;
                const isPlayed = barPositionRatio <= progressRatio;
                const isCurrent =
                  Math.abs(barPositionRatio - progressRatio) < 0.05 && isPlaying;

                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-150 ${
                      isPlayed
                        ? isOwn
                          ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]'
                          : 'bg-black shadow-[0_0_6px_rgba(0,0,0,0.2)]'
                        : isOwn
                        ? 'bg-white/30 group-hover:bg-white/50'
                        : 'bg-black/20 group-hover:bg-black/35'
                    } ${isCurrent ? 'scale-y-125' : ''}`}
                    style={{
                      height: `${Math.max(20, barHeight * 100)}%`,
                    }}
                  />
                );
              })}
            </div>

            {/* Continuous Seek Track Bar underneath */}
            <div className="relative mt-1 px-1">
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className={`w-full h-1 rounded-lg appearance-none cursor-pointer focus:outline-none ${
                  isOwn
                    ? 'bg-white/20 accent-white'
                    : 'bg-black/15 accent-black'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Footer: Elapsed / Duration Time, Quick Skip, Speed Pill */}
        <div className={`flex items-center justify-between mt-2 pt-1.5 text-[11px] font-mono ${isOwn ? 'text-white/70' : 'text-neutral-500'}`}>
          <div className="flex items-center gap-1">
            <span className={`font-bold ${isOwn ? 'text-white' : 'text-neutral-900'}`}>
              {formatSeconds(currentTime)}
            </span>
            <span>/</span>
            <span>{formatSeconds(duration)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Rewind 5s */}
            <button
              type="button"
              onClick={() => skipRelative(-5)}
              className={`p-1 rounded transition-colors ${
                isOwn ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-black/[0.05] hover:text-black'
              }`}
              title="Rewind 5 seconds"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            {/* Playback speed toggle */}
            <button
              type="button"
              onClick={cyclePlaybackRate}
              className={`px-2 py-0.5 rounded-full font-bold text-[10px] border transition-colors active:scale-95 ${
                isOwn
                  ? 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                  : 'bg-black/[0.06] hover:bg-black/[0.1] text-neutral-900 border-black/[0.1]'
              }`}
              title="Change playback speed"
            >
              {playbackRate}x
            </button>
          </div>
        </div>

        {/* AI Voice Note Transcription Section */}
        {message.transcription ? (
          <div className={`mt-2.5 pt-2 border-t ${isOwn ? 'border-white/15' : 'border-black/[0.06]'}`}>
            <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
              <button
                type="button"
                onClick={() => setShowTranscription(!showTranscription)}
                className="flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Transcript {showTranscription ? '▼' : '▶'}</span>
              </button>
              <span className={`text-[9px] font-mono ${isOwn ? 'text-white/60' : 'text-neutral-400'}`}>
                Whisper AI
              </span>
            </div>

            {showTranscription && (
              <p className={`italic text-[11px] leading-relaxed p-2 rounded-xl border ${
                isOwn
                  ? 'bg-white/10 border-white/15 text-white'
                  : 'bg-black/[0.03] border-black/[0.06] text-neutral-800'
              }`}>
                "{message.transcription}"
              </p>
            )}
          </div>
        ) : onTranscribe ? (
          <div className={`mt-2 pt-2 border-t ${isOwn ? 'border-white/15' : 'border-black/[0.06]'}`}>
            <button
              type="button"
              onClick={onTranscribe}
              disabled={isTranscribing}
              className={`w-full flex items-center justify-center gap-1.5 py-1 px-2 text-[11px] border rounded-xl transition-colors font-medium disabled:opacity-50 ${
                isOwn
                  ? 'bg-white/15 hover:bg-white/25 text-white border-white/30'
                  : 'bg-black/[0.05] hover:bg-black/[0.1] text-neutral-900 border-black/[0.1]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isTranscribing
                  ? 'Transcribing audio via AI...'
                  : 'Transcribe with AI'}
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
