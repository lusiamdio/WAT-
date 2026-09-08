import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  X,
  MessageSquare,
  Radio,
  Send,
  RefreshCw,
  User,
  Bot,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

interface LiveMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  time: string;
}

interface GeminiLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareToChat?: (summaryText: string) => void;
}

const VOICES = [
  { id: 'Zephyr', name: 'Zephyr', desc: 'Gentle & Balanced' },
  { id: 'Puck', name: 'Puck', desc: 'Upbeat & Playful' },
  { id: 'Kore', name: 'Kore', desc: 'Calm & Warm' },
  { id: 'Fenrir', name: 'Fenrir', desc: 'Deep & Confident' },
  { id: 'Charon', name: 'Charon', desc: 'Smooth & Articulate' },
];

export const GeminiLiveVoiceModal: React.FC<GeminiLiveVoiceModalProps> = ({
  isOpen,
  onClose,
  onShareToChat,
}) => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error' | 'closed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcriptHistory, setTranscriptHistory] = useState<LiveMessage[]>([]);
  const [currentOutputText, setCurrentOutputText] = useState('');
  const [currentInputText, setCurrentInputText] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextStartTimeRef = useRef<number>(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      startLiveSession();
    } else {
      endLiveSession();
    }
    return () => {
      endLiveSession();
    };
  }, [isOpen]);

  const startLiveSession = async () => {
    setConnectionStatus('connecting');
    setErrorMessage(null);
    setTranscriptHistory([]);
    setCurrentOutputText('');
    setCurrentInputText('');
    setCallDuration(0);
    soundEngine.playChime();

    try {
      // 1. Initialize Microphone Audio Stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // 2. Initialize Output AudioContext for 24kHz PCM Playback
      const OutputCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const outputAudioCtx = new OutputCtxClass({ sampleRate: 24000 });
      outputAudioCtxRef.current = outputAudioCtx;
      nextStartTimeRef.current = outputAudioCtx.currentTime;

      // 3. Connect to Server WebSocket on /live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live?voice=${selectedVoice}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[Live Voice Client] WebSocket connected to server');
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'connected') {
            setConnectionStatus('connected');
            soundEngine.playMessageSent();

            // Start call duration timer
            timerRef.current = setInterval(() => {
              setCallDuration((prev) => prev + 1);
            }, 1000);

            // Start capturing microphone input
            startMicrophoneStreaming(stream, ws);
          } else if (msg.type === 'audio') {
            // Received 24kHz PCM chunk from Gemini Live
            if (!isSpeakerMuted && outputAudioCtxRef.current) {
              playAudioChunk(msg.audio, outputAudioCtxRef.current);
            }
            setIsAiSpeaking(true);
          } else if (msg.type === 'outputTranscription') {
            setIsAiSpeaking(true);
            setCurrentOutputText((prev) => {
              const updated = prev + msg.text;
              return updated;
            });
          } else if (msg.type === 'inputTranscription') {
            setIsUserSpeaking(true);
            setCurrentInputText((prev) => {
              const updated = prev + msg.text;
              return updated;
            });
          } else if (msg.type === 'interrupted') {
            // Stop playing active audio chunks immediately on interruption
            stopCurrentAudioPlayback();
            setIsAiSpeaking(false);
          } else if (msg.type === 'turnComplete') {
            // Commit text turns to history
            setCurrentOutputText((finalOut) => {
              if (finalOut.trim()) {
                setTranscriptHistory((prev) => [
                  ...prev,
                  {
                    id: String(Date.now()),
                    sender: 'gemini',
                    text: finalOut.trim(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }
              return '';
            });
            setCurrentInputText((finalIn) => {
              if (finalIn.trim()) {
                setTranscriptHistory((prev) => [
                  ...prev,
                  {
                    id: String(Date.now() - 1),
                    sender: 'user',
                    text: finalIn.trim(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }
              return '';
            });
            setIsAiSpeaking(false);
          } else if (msg.type === 'error') {
            setConnectionStatus('error');
            setErrorMessage(msg.error || 'Live API session encountered an error');
          } else if (msg.type === 'closed') {
            setConnectionStatus('closed');
          }
        } catch (e) {
          console.error('[Live Voice Client] Message parse error:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('[Live Voice Client] WebSocket error:', err);
        setConnectionStatus('error');
        setErrorMessage('Failed to connect to Live API WebSocket server.');
      };

      ws.onclose = () => {
        setConnectionStatus('closed');
      };
    } catch (err: any) {
      console.error('[Live Voice Client] Initialization failed:', err);
      setConnectionStatus('error');
      setErrorMessage(err?.message || 'Microphone access denied or audio initialization failed.');
    }
  };

  const startMicrophoneStreaming = (stream: MediaStream, ws: WebSocket) => {
    try {
      const InputCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new InputCtxClass({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      const sourceNode = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      sourceNode.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);

        // Simple volume threshold to determine if user is speaking
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += Math.abs(inputData[i]);
        }
        const avg = sum / inputData.length;
        if (avg > 0.02) {
          setIsUserSpeaking(true);
        } else {
          setIsUserSpeaking(false);
        }

        if (isMicMuted) return;

        // Convert Float32Array to 16-bit PCM Little Endian
        const pcmBuffer = new ArrayBuffer(inputData.length * 2);
        const view = new DataView(pcmBuffer);
        let offset = 0;
        for (let i = 0; i < inputData.length; i++, offset += 2) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }

        // Convert to Base64
        let binary = '';
        const bytes = new Uint8Array(pcmBuffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Audio = btoa(binary);

        ws.send(JSON.stringify({ audio: base64Audio }));
      };
    } catch (e) {
      console.error('[Live Voice Client] ScriptProcessor setup error:', e);
    }
  };

  const playAudioChunk = (base64Data: string, ctx: AudioContext) => {
    try {
      const binary = atob(base64Data);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      // Scheduled seamless playback
      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime + 0.03;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;

      activeSourcesRef.current.push(source);
      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
        if (activeSourcesRef.current.length === 0) {
          setIsAiSpeaking(false);
        }
      };
    } catch (e) {
      console.error('[Live Voice Client] Audio playback error:', e);
    }
  };

  const stopCurrentAudioPlayback = () => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch (e) {}
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
  };

  const endLiveSession = () => {
    soundEngine.playMessageSent();
    stopCurrentAudioPlayback();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== 'closed') {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }

    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }

    setConnectionStatus('idle');
  };

  const handleShareSummary = () => {
    let summary = `🎙️ **Gemini Live Voice Call Summary** (Voice: ${selectedVoice}, Duration: ${formatTime(callDuration)})\n\n`;
    if (transcriptHistory.length === 0) {
      summary += `Voice session completed successfully.`;
    } else {
      transcriptHistory.forEach((msg) => {
        summary += `**${msg.sender === 'user' ? 'You' : 'Gemini Live'}:** ${msg.text}\n`;
      });
    }

    if (onShareToChat) {
      onShareToChat(summary);
    }
    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div
      id="gemini-live-voice-modal"
      className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in"
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-100">Gemini Live Voice</h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  gemini-3.1-flash-live-preview
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Real-time, low-latency bidirectional voice conversation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Calling Stage */}
        <div className="p-6 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950 min-h-[260px]">
          {/* Status badge */}
          <div className="mb-4 flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700 text-xs font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : connectionStatus === 'connecting'
                  ? 'bg-amber-400 animate-ping'
                  : connectionStatus === 'error'
                  ? 'bg-rose-500'
                  : 'bg-neutral-500'
              }`}
            />
            <span className="text-neutral-300">
              {connectionStatus === 'connected'
                ? `Connected • ${formatTime(callDuration)}`
                : connectionStatus === 'connecting'
                ? 'Connecting to Live API...'
                : connectionStatus === 'error'
                ? 'Connection Issue'
                : 'Session Ended'}
            </span>
          </div>

          {/* Animated Interactive Glowing Voice Orb */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Outer soundwave pulse rings */}
            {isAiSpeaking && (
              <>
                <div className="absolute w-36 h-36 rounded-full bg-purple-500/20 animate-ping" />
                <div className="absolute w-44 h-44 rounded-full bg-indigo-500/15 animate-pulse" />
              </>
            )}
            {isUserSpeaking && (
              <div className="absolute w-36 h-36 rounded-full bg-emerald-500/25 animate-ping" />
            )}

            {/* Central Glowing Orb */}
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                isAiSpeaking
                  ? 'bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 scale-110 shadow-purple-500/50'
                  : isUserSpeaking
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 scale-105 shadow-emerald-500/40'
                  : 'bg-gradient-to-tr from-neutral-800 to-neutral-700 shadow-black'
              }`}
            >
              <Radio
                className={`w-10 h-10 text-white ${
                  isAiSpeaking || isUserSpeaking ? 'animate-bounce' : 'opacity-70'
                }`}
              />
            </div>
          </div>

          {/* State Subtitle */}
          <div className="text-center mt-2">
            <p className="text-xs font-medium text-neutral-300">
              {isAiSpeaking
                ? `Gemini Live (${selectedVoice}) is speaking...`
                : isUserSpeaking
                ? 'Listening to you speak...'
                : connectionStatus === 'connected'
                ? 'Say anything to converse in real-time'
                : ''}
            </p>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center max-w-sm">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Real-time Subtitles & Transcript Stream */}
        <div className="flex-1 overflow-y-auto p-4 border-t border-b border-neutral-800 bg-neutral-950/60 max-h-48 space-y-2.5">
          {transcriptHistory.length === 0 && !currentInputText && !currentOutputText ? (
            <div className="py-4 text-center text-xs text-neutral-500 italic">
              Live transcriptions will appear here as you talk...
            </div>
          ) : (
            <>
              {transcriptHistory.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-2 text-xs ${
                    item.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-2xl ${
                      item.sender === 'user'
                        ? 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                        : 'bg-purple-950/40 text-purple-200 border border-purple-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 opacity-70 text-[10px]">
                      {item.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-purple-400" />}
                      <span className="font-semibold">{item.sender === 'user' ? 'You' : `Gemini (${selectedVoice})`}</span>
                      <span>• {item.time}</span>
                    </div>
                    <p className="leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}

              {/* In-flight streaming transcription */}
              {currentInputText && (
                <div className="flex justify-end text-xs">
                  <div className="max-w-[85%] p-2.5 rounded-2xl bg-neutral-800/60 text-neutral-300 border border-neutral-700/50 animate-pulse">
                    <span className="text-[10px] text-neutral-400 block mb-1">Listening...</span>
                    {currentInputText}
                  </div>
                </div>
              )}

              {currentOutputText && (
                <div className="flex justify-start text-xs">
                  <div className="max-w-[85%] p-2.5 rounded-2xl bg-purple-950/30 text-purple-200 border border-purple-700/30 animate-pulse">
                    <span className="text-[10px] text-purple-400 block mb-1">Speaking...</span>
                    {currentOutputText}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Voice Selector & Action Controls */}
        <div className="p-4 bg-neutral-900 space-y-4">
          {/* Voice Personality Selector */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0">
              Voice:
            </span>
            <div className="flex items-center gap-1.5">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  disabled={connectionStatus === 'connected'}
                  className={`text-xs px-2.5 py-1 rounded-xl font-medium border transition-all ${
                    selectedVoice === v.id
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
                  } disabled:opacity-70`}
                  title={v.desc}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Mute Mic */}
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-3 rounded-2xl border transition-colors ${
                  isMicMuted
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                }`}
                title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Mute Speaker */}
              <button
                onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                className={`p-3 rounded-2xl border transition-colors ${
                  isSpeakerMuted
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                }`}
                title={isSpeakerMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Hangup / Reconnect Button */}
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <button
                  onClick={endLiveSession}
                  className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Live Voice</span>
                </button>
              ) : (
                <button
                  onClick={startLiveSession}
                  className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-transform active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Start Conversation</span>
                </button>
              )}

              {transcriptHistory.length > 0 && onShareToChat && (
                <button
                  onClick={handleShareSummary}
                  className="px-3.5 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Share voice transcript to chat"
                >
                  <Send className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">Share to Chat</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
