import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Minimize2,
  Maximize2,
  ShieldCheck,
  Smartphone,
  QrCode,
  Copy,
  Check,
  Lock,
  Volume2,
  VolumeX,
  Bluetooth,
  X,
  Hash,
  Activity,
  Globe,
  Languages,
  MessageCircle,
  Disc,
  MoreHorizontal,
  Send,
  Sparkles,
  Sliders,
  ArrowRightLeft,
  SwitchCamera,
  Radio,
  Vibrate,
  BookOpen,
  Eye,
  EyeOff,
  UserPlus,
  Users,
  Search,
  CheckCircle2,
  Info,
  Shield,
  Wifi,
  Phone,
  PhoneCall,
  ChevronDown,
  Battery,
  BatteryCharging,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  Zap,
  ChevronLeft,
  Layers,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { User } from '../types';

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

interface InCallChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  isMe: boolean;
  isLiveTranslation?: boolean;
  originalText?: string;
  sourceLang?: string;
  targetLang?: string;
}

interface TranslationHistoryItem {
  id: string;
  speaker: string;
  original: string;
  translated: string;
  timestamp: number;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', native: '中文' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', native: 'Kiswahili' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬', native: 'Èdè Yorùbá' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', native: 'Português' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
];

const TRANSLATION_SPEECH_STREAM: Record<
  string,
  Array<{ original: string; translated: string }>
> = {
  fr: [
    {
      original: "Hello! Can you hear the voice stream clearly on this channel?",
      translated: "Bonjour ! Entendez-vous clairement le flux vocal sur ce canal ?",
    },
    {
      original: "Connection is authenticated and end-to-end encryption is active.",
      translated: "La connexion est authentifiée et le chiffrement de bout en bout est actif.",
    },
    {
      original: "Let's review the architectural wireframes and verified milestones.",
      translated: "Examinons les maquettes architecturales et les jalons vérifiés.",
    },
    {
      original: "The Opus 48kHz audio clarity is performing with zero packet loss.",
      translated: "La clarté audio Opus 48kHz fonctionne avec zéro perte de paquets.",
    },
    {
      original: "I will forward the signed smart contract into our verified channel.",
      translated: "Je vais transmettre le contrat intelligent signé dans notre canal vérifié.",
    },
  ],
  es: [
    {
      original: "Hello! Can you hear the voice stream clearly on this channel?",
      translated: "¡Hola! ¿Puedes escuchar el flujo de voz con claridad en este canal?",
    },
    {
      original: "Connection is authenticated and end-to-end encryption is active.",
      translated: "La conexión está autenticada y el cifrado de extremo a extremo está activo.",
    },
    {
      original: "Let's review the architectural wireframes and verified milestones.",
      translated: "Revisemos los esquemas arquitectónicos y los hitos verificados.",
    },
    {
      original: "The Opus 48kHz audio clarity is performing with zero packet loss.",
      translated: "La claridad de audio Opus 48kHz funciona con cero pérdida de paquetes.",
    },
    {
      original: "I will forward the signed smart contract into our verified channel.",
      translated: "Reenviaré el contrato inteligente firmado a nuestro canal verificado.",
    },
  ],
  de: [
    {
      original: "Hello! Can you hear the voice stream clearly on this channel?",
      translated: "Hallo! Können Sie den Sprachstream auf diesem Kanal klar hören?",
    },
    {
      original: "Connection is authenticated and end-to-end encryption is active.",
      translated: "Die Verbindung ist authentifiziert und die Ende-zu-Ende-Verschlüsselung ist aktiv.",
    },
    {
      original: "Let's review the architectural wireframes and verified milestones.",
      translated: "Lassen Sie uns die Architektur-Wireframes und verifizierten Meilensteine überprüfen.",
    },
    {
      original: "The Opus 48kHz audio clarity is performing with zero packet loss.",
      translated: "Die Opus 48kHz-Audioklarheit arbeitet mit null Paketverlust.",
    },
  ],
  ja: [
    {
      original: "Hello! Can you hear the voice stream clearly on this channel?",
      translated: "こんにちは！このチャンネルの音声ストリームははっきりと聞こえますか？",
    },
    {
      original: "Connection is authenticated and end-to-end encryption is active.",
      translated: "接続は認証され、エンドツーエンド暗号化が有効です。",
    },
    {
      original: "Let's review the architectural wireframes and verified milestones.",
      translated: "アーキテクチャのワイヤーフレームと検証済みマイルストーンを確認しましょう。",
    },
    {
      original: "The Opus 48kHz audio clarity is performing with zero packet loss.",
      translated: "Opus 48kHzオーディオの明瞭度はパケット損失ゼロで動作しています。",
    },
  ],
  zh: [
    {
      original: "Hello! Can you hear the voice stream clearly on this channel?",
      translated: "您好！您能在这个频道上清楚地听到语音流吗？",
    },
    {
      original: "Connection is authenticated and end-to-end encryption is active.",
      translated: "连接已通过身份验证，端到端加密处于活动状态。",
    },
    {
      original: "Let's review the architectural wireframes and verified milestones.",
      translated: "让我们审查架构线框和已验证的里程碑。",
    },
    {
      original: "The Opus 48kHz audio clarity is performing with zero packet loss.",
      translated: "Opus 48kHz 音频清晰度表现出色，零丢包。",
    },
  ],
  ar: [
    {
      original: "Hello! Can you hear the voice stream clearly on this channel?",
      translated: "مرحباً! هل تسمع التدفق الصوتي بوضوح على هذه القناة؟",
    },
    {
      original: "Connection is authenticated and end-to-end encryption is active.",
      translated: "الاتصال موثق والتشفير التام بين الطرفين نشط.",
    },
    {
      original: "Let's review the architectural wireframes and verified milestones.",
      translated: "دعونا نراجع المخططات الهيكلية والمعالم المعتمدة.",
    },
  ],
  sw: [
    {
      original: "Hello! Can you hear the voice stream clearly on this channel?",
      translated: "Jambo! Je, unaweza kusikia mtiririko wa sauti vizuri kwenye kituo hiki?",
    },
    {
      original: "Connection is authenticated and end-to-end encryption is active.",
      translated: "Muunganisho umeidhinishwa na usimbaji fiche wa mwisho-hadi-mwisho unafanya kazi.",
    },
    {
      original: "Let's review the architectural wireframes and verified milestones.",
      translated: "Hebu tupitie miundo ya usanifu na hatua zilizothibitishwa.",
    },
  ],
  yo: [
    {
      original: "Hello! Can you hear the voice stream clearly on this channel?",
      translated: "Pẹlẹ o! Ṣe o le gbọ ṣiṣan ohun daradara lori ikanni yii?",
    },
    {
      original: "Connection is authenticated and end-to-end encryption is active.",
      translated: "Asopọ jẹ ifọwọsi ati fifi ẹnọ kọ nkan ipari-si-opin n ṣiṣẹ.",
    },
    {
      original: "Let's review the architectural wireframes and verified milestones.",
      translated: "Jẹ ki a ṣe atunyẹwo awọn fireemu waya ayaworan ati awọn ami-iṣẹlẹ ti o jẹrisi.",
    },
  ],
  pt: [
    {
      original: "Hello! Can you hear the voice stream clearly on this channel?",
      translated: "Olá! Você consegue ouvir o fluxo de voz com clareza neste canal?",
    },
    {
      original: "Connection is authenticated and end-to-end encryption is active.",
      translated: "A conexão está autenticada e a criptografia de ponta a ponta está ativa.",
    },
    {
      original: "Let's review the architectural wireframes and verified milestones.",
      translated: "Vamos revisar os wireframes de arquitetura e marcos verificados.",
    },
  ],
  hi: [
    {
      original: "Hello! Can you hear the voice stream clearly on this channel?",
      translated: "नमस्ते! क्या आप इस चैनल पर वॉयस स्ट्रीम स्पष्ट रूप से सुन सकते हैं?",
    },
    {
      original: "Connection is authenticated and end-to-end encryption is active.",
      translated: "कनेक्शन प्रमाणित है और एंड-टू-एंड एन्क्रिप्शन सक्रिय है।",
    },
    {
      original: "Let's review the architectural wireframes and verified milestones.",
      translated: "आइए आर्किटेक्चरल वायरफ्रेम और सत्यापित मील के पत्थरों की समीक्षा करें।",
    },
  ],
  it: [
    {
      original: "Hello! Can you hear the voice stream clearly on this channel?",
      translated: "Ciao! Riesci a sentire chiaramente il flusso vocale su questo canale?",
    },
    {
      original: "Connection is authenticated and end-to-end encryption is active.",
      translated: "La connessione è autenticata e la crittografia end-to-end è attiva.",
    },
    {
      original: "Let's review the architectural wireframes and verified milestones.",
      translated: "Esaminiamo i wireframe architetturali e i traguardi verificati.",
    },
  ],
};

/**
 * Safe mobile haptic feedback helper using Navigator.vibrate()
 */
export const triggerHaptic = (pattern: number | number[] = 25) => {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {}
};

/**
 * Helper to format seconds into HH:MM:SS or MM:SS
 */
const formatCallTimer = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

/**
 * Icon-Based Real-Time WebRTC Signal Strength Indicator (4-Bar Scale)
 */
interface SignalIndicatorProps {
  signalLevel: number; // 1 to 4
  latencyMs: number;
  packetLoss: number;
  onClick?: () => void;
  compact?: boolean;
}

const SignalStrengthIndicator: React.FC<SignalIndicatorProps> = ({
  signalLevel,
  latencyMs,
  packetLoss,
  onClick,
  compact = false,
}) => {
  const getBarClass = (barIndex: number) => {
    if (barIndex > signalLevel) return 'bg-white/20';
    if (signalLevel >= 4) return 'bg-emerald-400';
    if (signalLevel === 3) return 'bg-teal-400';
    if (signalLevel === 2) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  const getQualityLabel = () => {
    if (signalLevel >= 4) return 'HD Excellent';
    if (signalLevel === 3) return 'Good';
    if (signalLevel === 2) return 'Fair';
    return 'Weak';
  };

  const getTextColor = () => {
    if (signalLevel >= 4) return 'text-emerald-400';
    if (signalLevel === 3) return 'text-teal-400';
    if (signalLevel === 2) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <button
      onClick={onClick}
      className={`min-h-[44px] min-w-[44px] flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-xl transition-all active:scale-95 text-left select-none ${
        compact ? 'px-2.5 py-1' : ''
      }`}
      title={`Connection Quality: ${getQualityLabel()} (${latencyMs}ms RTT, ${packetLoss}% loss) - Click for WebRTC Diagnostics`}
    >
      {/* 4 Ascending Signal Bars */}
      <div className="flex items-end gap-[2.5px] h-4 w-4.5 pb-0.5" aria-label={`Signal strength: ${signalLevel} of 4 bars`}>
        <span className={`w-[3px] h-1.5 rounded-full ${getBarClass(1)} transition-all duration-300`} />
        <span className={`w-[3px] h-2.5 rounded-full ${getBarClass(2)} transition-all duration-300`} />
        <span className={`w-[3px] h-3.5 rounded-full ${getBarClass(3)} transition-all duration-300`} />
        <span className={`w-[3px] h-4 rounded-full ${getBarClass(4)} transition-all duration-300`} />
      </div>

      {!compact && (
        <div className="flex flex-col">
          <span className={`text-[11px] font-bold tracking-tight ${getTextColor()} leading-none`}>
            {getQualityLabel()}
          </span>
          <span className="text-[9px] font-mono text-neutral-400 leading-none mt-0.5">
            {latencyMs}ms • {packetLoss}%
          </span>
        </div>
      )}
    </button>
  );
};

/**
 * Battery Level Indicator in Call Modal Top Bar
 */
interface BatteryIndicatorProps {
  level: number;
  isCharging: boolean;
  onClick?: () => void;
  compact?: boolean;
}

const BatteryLevelIndicator: React.FC<BatteryIndicatorProps> = ({
  level,
  isCharging,
  onClick,
  compact = false,
}) => {
  const getBatteryColor = () => {
    if (isCharging) return 'text-emerald-400';
    if (level > 50) return 'text-emerald-400';
    if (level > 20) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getBatteryIcon = () => {
    if (isCharging) {
      return <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />;
    }
    if (level <= 20) {
      return <BatteryLow className="w-4 h-4 text-rose-400 animate-pulse" />;
    }
    if (level <= 50) {
      return <BatteryMedium className="w-4 h-4 text-amber-400" />;
    }
    return <Battery className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <button
      onClick={onClick}
      className={`min-h-[44px] min-w-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-xl transition-all active:scale-95 text-left select-none ${
        compact ? 'px-2 py-1' : ''
      }`}
      title={`Battery: ${level}% ${isCharging ? '(Charging)' : ''} - Click for Power & Battery Health Telemetry`}
    >
      {getBatteryIcon()}
      <span className={`text-[11px] font-mono font-bold ${getBatteryColor()} leading-none`}>
        {level}%
      </span>
      {isCharging && (
        <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
      )}
    </button>
  );
};

/**
 * Dynamic Video & Voice Ambient Backdrop Glow
 * Samples video feed content, luminance, and speaker amplitude for a luxurious, premium feel
 */
const DynamicAmbientBackdrop: React.FC<{
  isVideoMode: boolean;
  voiceAmplitude: number;
  isMuted: boolean;
  avatarUrl?: string;
  cameraFacing: 'user' | 'environment';
  blurPreset?: 'subtle' | 'dynamic' | 'deep';
}> = ({ isVideoMode, voiceAmplitude, isMuted, cameraFacing, blurPreset = 'dynamic' }) => {
  const blurScale = blurPreset === 'deep' ? 90 : blurPreset === 'subtle' ? 40 : 65;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Dynamic Multi-Source Organic Color Auras */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] rounded-full transition-all duration-700 ease-out"
        style={{
          filter: `blur(${blurScale}px)`,
          opacity: isMuted ? 0.35 : 0.65 + voiceAmplitude * 0.35,
          background: isVideoMode
            ? cameraFacing === 'user'
              ? 'radial-gradient(circle at 35% 35%, rgba(59, 130, 246, 0.28) 0%, rgba(139, 92, 246, 0.22) 40%, rgba(16, 185, 129, 0.18) 70%, transparent 100%)'
              : 'radial-gradient(circle at 65% 65%, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.22) 40%, rgba(59, 130, 246, 0.15) 80%, transparent 100%)'
            : 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.18) 45%, rgba(14, 165, 233, 0.12) 80%, transparent 100%)',
          transform: `scale(${1 + voiceAmplitude * 0.12}) rotate(${voiceAmplitude * 15}deg)`,
        }}
      />

      {/* Secondary Dynamic Luminance Aura */}
      <div
        className="absolute top-1/3 left-1/4 w-[100%] h-[100%] rounded-full transition-all duration-500 ease-out"
        style={{
          filter: `blur(${blurScale + 25}px)`,
          opacity: 0.45 + voiceAmplitude * 0.4,
          background: isVideoMode
            ? 'radial-gradient(circle, rgba(236, 72, 153, 0.18) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.15) 60%, transparent 80%)',
          transform: `scale(${1.05 + voiceAmplitude * 0.18})`,
        }}
      />

      {/* Vignette Rim for High Contrast and Video Focus */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
    </div>
  );
};

/**
 * Real-Time Canvas Audio Waveform Visualizer
 */
const AudioWaveformVisualizer: React.FC<{
  isMuted: boolean;
  isConnected: boolean;
  onAmplitudeChange?: (amp: number) => void;
}> = ({ isMuted, isConnected, onAmplitudeChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const [micActive, setMicActive] = useState(false);
  const [dbLevel, setDbLevel] = useState<number>(-45);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isConnected && !isMuted && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((s) => {
          stream = s;
          try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              const audioCtx = new AudioCtx();
              const analyser = audioCtx.createAnalyser();
              analyser.fftSize = 64;
              analyser.smoothingTimeConstant = 0.8;
              const source = audioCtx.createMediaStreamSource(s);
              source.connect(analyser);

              audioContextRef.current = audioCtx;
              analyserRef.current = analyser;
              sourceRef.current = source;
              setMicActive(true);
            }
          } catch (e) {
            console.warn('AudioContext fallback to synthetic harmonic mode', e);
          }
        })
        .catch(() => {
          setMicActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      setMicActive(false);
    };
  }, [isConnected, isMuted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numBars = 32;
    const barValues = new Array(numBars).fill(4);
    let time = 0;

    const render = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      let currentAmplitude = 0;

      if (!isConnected || isMuted) {
        for (let i = 0; i < numBars; i++) {
          barValues[i] = barValues[i] * 0.85 + 3 * 0.15;
        }
        setDbLevel(-60);
        setIsSpeaking(false);
        if (onAmplitudeChange) onAmplitudeChange(0);
      } else if (analyserRef.current && micActive) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < numBars; i++) {
          const dataIndex = Math.min(bufferLength - 1, Math.floor((i / numBars) * bufferLength));
          const val = dataArray[dataIndex] || 0;
          sum += val;

          const targetHeight = Math.max(4, (val / 255) * (height - 6));
          barValues[i] = barValues[i] * 0.65 + targetHeight * 0.35;
        }

        const avg = sum / numBars;
        currentAmplitude = avg / 255;
        const computedDb = Math.round(20 * Math.log10(Math.max(0.001, currentAmplitude)));
        setDbLevel(Math.max(-60, computedDb));
        setIsSpeaking(avg > 15);
        if (onAmplitudeChange) onAmplitudeChange(currentAmplitude);
      } else {
        const speechEnvelope = Math.max(0, Math.sin(time * 0.8)) * 0.85 + 0.15;
        let sum = 0;

        for (let i = 0; i < numBars; i++) {
          const harmonic1 = Math.sin(time * 3.2 + i * 0.3);
          const harmonic2 = Math.cos(time * 2.1 + i * 0.18);
          const harmonic3 = Math.sin(time * 5.0 + i * 0.6) * 0.5;
          const raw = (harmonic1 + harmonic2 + harmonic3 + 2.5) / 5;

          const targetHeight = Math.max(
            4,
            raw * (height - 8) * speechEnvelope * (0.6 + 0.4 * Math.sin(i * 0.25))
          );

          barValues[i] = barValues[i] * 0.7 + targetHeight * 0.3;
          sum += barValues[i];
        }

        currentAmplitude = sum / numBars / (height - 8);
        const computedDb = Math.round(-40 + currentAmplitude * 32);
        setDbLevel(computedDb);
        setIsSpeaking(currentAmplitude > 0.25);
        if (onAmplitudeChange) onAmplitudeChange(currentAmplitude);
      }

      const gap = 3.5;
      const barWidth = (width - gap * (numBars - 1)) / numBars;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + gap);
        const barH = Math.max(3, barValues[i]);
        const y = (height - barH) / 2;
        const radius = barWidth / 2;

        const gradient = ctx.createLinearGradient(0, y + barH, 0, y);
        if (isMuted || !isConnected) {
          gradient.addColorStop(0, '#3f3f46');
          gradient.addColorStop(1, '#27272a');
        } else {
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(0.5, '#6366f1');
          gradient.addColorStop(1, '#a855f7');
        }

        ctx.fillStyle = gradient;

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barH, [radius]);
        } else {
          ctx.rect(x, y, barWidth, barH);
        }
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isConnected, isMuted, micActive, onAmplitudeChange]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-1">
      {/* Waveform Canvas with Ambient Glow */}
      <div className="relative w-full max-w-md sm:max-w-lg h-16 flex items-center justify-center">
        {!isMuted && isConnected && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/25 to-violet-500/20 blur-2xl rounded-full pointer-events-none" />
        )}
        <canvas
          ref={canvasRef}
          width={420}
          height={64}
          className="relative z-10 w-full h-full object-contain"
        />
      </div>

      {/* Acoustic Real-Time Telemetry */}
      <div className="flex items-center justify-center gap-3 mt-1.5 text-[11px] font-mono text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isMuted
                ? 'bg-rose-500'
                : isSpeaking
                ? 'bg-emerald-400 animate-ping'
                : 'bg-indigo-400'
            }`}
          />
          <span className={isMuted ? 'text-rose-400 font-semibold' : 'text-neutral-300'}>
            {isMuted ? 'MIC MUTED' : isSpeaking ? 'VOICE ACTIVE' : 'AWAITING SPEECH'}
          </span>
        </span>

        <span className="text-neutral-600">•</span>

        <span className="text-neutral-400 font-medium">
          {isMuted ? '-∞ dBFS' : `${dbLevel} dBFS`}
        </span>

        <span className="text-neutral-600">•</span>

        <span className="text-indigo-400 font-semibold flex items-center gap-1">
          <Radio className="w-3.5 h-3.5 text-indigo-400" />
          <span>{micActive ? 'LIVE MIC' : 'OPUS 48kHz'}</span>
        </span>
      </div>
    </div>
  );
};

export const WebRTCCallModal: React.FC = () => {
  const {
    activeCall,
    endCall,
    toggleMute,
    toggleCamera,
    toggleSpeaker,
    addCallParticipant,
    currentUser,
    users,
    jitsiServerConfig,
    setActiveCall,
  } = useChat();

  // Primary UI & Screen States
  const [isMinimized, setIsMinimized] = useState(false);
  const [hideFunctions, setHideFunctions] = useState(false); // Focus / Reading Mode: Hides functions for clean reading
  const [readingTextSize, setReadingTextSize] = useState<'normal' | 'large' | 'xl'>('large');
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showSignalModal, setShowSignalModal] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showMobileQR, setShowMobileQR] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [keypadInput, setKeypadInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [voiceAmplitude, setVoiceAmplitude] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Battery Level & Power Telemetry
  const [batteryLevel, setBatteryLevel] = useState<number>(84);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [showBatteryModal, setShowBatteryModal] = useState<boolean>(false);
  const [isEcoPowerMode, setIsEcoPowerMode] = useState<boolean>(false);
  const [lowBatteryAlertShown, setLowBatteryAlertShown] = useState<boolean>(false);

  // Proximity Sensor (Screen Lock when held to ear)
  const [isProximityLocked, setIsProximityLocked] = useState<boolean>(false);
  const [proximityAutoLock, setProximityAutoLock] = useState<boolean>(true);
  const [proximitySensorSupported, setProximitySensorSupported] = useState<boolean>(false);

  // Dynamic Background Blur & Video Aesthetic
  const [blurPreset, setBlurPreset] = useState<'subtle' | 'dynamic' | 'deep'>('dynamic');
  const [enableDynamicBlur, setEnableDynamicBlur] = useState<boolean>(true);

  // WhatsApp Video Call Layout & Controls
  const [videoCallLayout, setVideoCallLayout] = useState<'whatsapp' | 'focus' | 'grid'>('whatsapp');
  const [showWhatsAppImmersiveControls, setShowWhatsAppImmersiveControls] = useState<boolean>(true);
  const [isPiPSwapped, setIsPiPSwapped] = useState<boolean>(false);
  const [isSelfCameraFlipped, setIsSelfCameraFlipped] = useState<boolean>(false);

  // Audio Output State: 'speaker' | 'earpiece' | 'bluetooth'
  const [audioOutput, setAudioOutput] = useState<'speaker' | 'earpiece' | 'bluetooth'>('speaker');
  const [noiseSuppression, setNoiseSuppression] = useState(true);

  // Real-Time Signal Quality Telemetry (1 to 4 bars)
  const [signalLevel, setSignalLevel] = useState<number>(4);
  const [latencyMs, setLatencyMs] = useState<number>(24);
  const [packetLoss, setPacketLoss] = useState<number>(0.0);
  const [jitterMs, setJitterMs] = useState<number>(1.4);

  // Participant Drawer Search & Selection State
  const [participantSearch, setParticipantSearch] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [activeParticipantFilter, setActiveParticipantFilter] = useState<'all' | 'online' | 'team'>('all');

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Real-Time Translation & Live Captions
  const [isTranslationActive, setIsTranslationActive] = useState(true);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('fr');
  const [liveCaptionIndex, setLiveCaptionIndex] = useState(0);

  // In-Call Chat Drawer
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [inCallChatInput, setInCallChatInput] = useState('');
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [inCallMessages, setInCallMessages] = useState<InCallChatMessage[]>([
    {
      id: 'icm_1',
      senderName: activeCall?.roomName || 'Caller',
      senderAvatar: activeCall?.roomAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      text: 'Voice stream connected with End-to-End Encryption 🚀',
      timestamp: Date.now() - 45000,
      isMe: false,
    },
  ]);

  // Video Camera State
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isPiPMinimized, setIsPiPMinimized] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const domain = activeCall?.jitsiDomain || jitsiServerConfig.serverDomain || 'meet.jit.si';
  const cleanRoomName =
    activeCall?.jitsiRoomName ||
    (activeCall?.roomId ? `wat-conf-${activeCall.roomId.replace(/[^a-zA-Z0-9]/g, '')}` : 'wat-conf-room');
  const jitsiMeetingUrl = `https://${domain}/${cleanRoomName}`;
  const isIframeMode = activeCall?.conferenceMode === 'jitsi_iframe';

  // Trigger transient notification toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Battery Status API & Real-Time Power Monitoring
  useEffect(() => {
    let batteryInstance: any = null;
    const updateBattery = (battery: any) => {
      if (battery) {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
      }
    };

    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      (navigator as any).getBattery()
        .then((battery: any) => {
          batteryInstance = battery;
          updateBattery(battery);
          battery.addEventListener('levelchange', () => updateBattery(battery));
          battery.addEventListener('chargingchange', () => updateBattery(battery));
        })
        .catch(() => {
          // Graceful fallback simulation
        });
    }

    return () => {
      if (batteryInstance) {
        batteryInstance.removeEventListener?.('levelchange', () => {});
        batteryInstance.removeEventListener?.('chargingchange', () => {});
      }
    };
  }, []);

  // Low Battery Warning Trigger during Call
  useEffect(() => {
    if (activeCall?.status === 'connected' && batteryLevel <= 20 && !isCharging && !lowBatteryAlertShown) {
      setLowBatteryAlertShown(true);
      showToast(`⚠️ Low Battery (${batteryLevel}%) • Long calls consume high power`);
    }
  }, [activeCall?.status, batteryLevel, isCharging, lowBatteryAlertShown]);

  // Proximity Sensor (Generic Sensor API + Orientation Event Support)
  useEffect(() => {
    let proximitySensor: any = null;

    if (typeof window !== 'undefined' && 'ProximitySensor' in window) {
      try {
        proximitySensor = new (window as any).ProximitySensor();
        setProximitySensorSupported(true);
        proximitySensor.addEventListener('reading', () => {
          if (proximityAutoLock) {
            const isNear = proximitySensor.distance < 5 || proximitySensor.near === true;
            setIsProximityLocked(isNear);
          }
        });
        proximitySensor.start();
      } catch (e) {
        setProximitySensorSupported(false);
      }
    }

    // Also support userproximity event (Firefox / WebKit legacy)
    const handleUserProximity = (event: any) => {
      if (proximityAutoLock) {
        setIsProximityLocked(Boolean(event.near));
      }
    };

    window.addEventListener('userproximity', handleUserProximity);

    return () => {
      if (proximitySensor) {
        proximitySensor.stop?.();
      }
      window.removeEventListener('userproximity', handleUserProximity);
    };
  }, [proximityAutoLock]);

  // Real-Time Signal Fluctuation Simulation (Realistic WebRTC Health)
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'connected') return;
    const interval = setInterval(() => {
      // 90% chance of excellent 4 bars, 10% occasional minor jitter
      const rand = Math.random();
      if (rand > 0.15) {
        setSignalLevel(4);
        setLatencyMs(Math.floor(18 + Math.random() * 12));
        setPacketLoss(0.0);
        setJitterMs(Number((1.1 + Math.random() * 0.7).toFixed(1)));
      } else if (rand > 0.05) {
        setSignalLevel(3);
        setLatencyMs(Math.floor(45 + Math.random() * 20));
        setPacketLoss(0.1);
        setJitterMs(Number((2.2 + Math.random() * 0.9).toFixed(1)));
      } else {
        setSignalLevel(4);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeCall?.status]);

  // Haptic Button Action Handlers with Tactile Feedback confirmation
  const handleToggleMute = useCallback(() => {
    if (!activeCall) return;
    triggerHaptic(activeCall.isMuted ? 30 : [35, 40, 35]);
    toggleMute();
    showToast(activeCall.isMuted ? 'Microphone Unmuted' : 'Microphone Muted');
  }, [activeCall, toggleMute]);

  const handleToggleVideo = useCallback(() => {
    if (!activeCall) return;
    triggerHaptic([30, 45, 50]);
    toggleCamera();
    showToast(!activeCall.isCameraOff ? 'Camera Turned Off' : 'Camera Live Preview On');
  }, [activeCall, toggleCamera]);

  // Dedicated Speakerphone Toggle (Handset vs Loudspeaker)
  const handleToggleSpeakerphone = useCallback(() => {
    triggerHaptic(35);
    if (audioOutput === 'speaker') {
      setAudioOutput('earpiece');
      showToast('Switched to Handset (Earpiece)');
    } else {
      setAudioOutput('speaker');
      showToast('Switched to Loudspeaker (Speakerphone)');
    }
    toggleSpeaker();
  }, [audioOutput, toggleSpeaker]);

  const handleAudioOutputSwitch = useCallback(() => {
    triggerHaptic(25);
    const next =
      audioOutput === 'speaker' ? 'earpiece' : audioOutput === 'earpiece' ? 'bluetooth' : 'speaker';
    setAudioOutput(next);
    showToast(
      next === 'speaker'
        ? 'Audio: Loudspeaker'
        : next === 'earpiece'
        ? 'Audio: Handset Earpiece'
        : 'Audio: Bluetooth Headset'
    );
  }, [audioOutput]);

  const handleHangUp = useCallback(() => {
    triggerHaptic([70, 50, 90]);
    endCall();
  }, [endCall]);

  const handleToggleRecording = useCallback(() => {
    triggerHaptic([40, 60]);
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      showToast('Session Recording Started');
    } else {
      setIsRecording(false);
      showToast('Session Recording Saved');
    }
  }, [isRecording]);

  // Recording Timer
  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  // Translation Live Captions periodic rotation
  useEffect(() => {
    if (!isTranslationActive) return;
    const interval = setInterval(() => {
      setLiveCaptionIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isTranslationActive]);

  // Auto-scroll in-call chat
  useEffect(() => {
    if (isChatDrawerOpen && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [isChatDrawerOpen, inCallMessages]);

  // Handle local camera stream
  useEffect(() => {
    if (!activeCall || isIframeMode) return;
    let stream: MediaStream | null = null;

    if (!activeCall.isCameraOff && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: cameraFacing },
          audio: !activeCall.isMuted,
        })
        .then((s) => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
        })
        .catch((e) => {
          console.warn('Camera preview not permitted or unavailable in sandbox', e);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isIframeMode, activeCall?.isCameraOff, activeCall?.isMuted, cameraFacing]);

  // Handle DTMF Keypad click
  const handleKeypadPress = (val: string) => {
    triggerHaptic(20);
    setKeypadInput((prev) => prev + val);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(
          val === '*' ? 941 : val === '#' ? 1336 : 700 + parseInt(val || '0', 10) * 50,
          audioCtx.currentTime
        );
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      }
    } catch {}
  };

  // Send In-Call Chat Message
  const handleSendInCallMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inCallChatInput.trim()) return;
    triggerHaptic(25);

    const newMsg: InCallChatMessage = {
      id: 'icm_' + Date.now(),
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: inCallChatInput.trim(),
      timestamp: Date.now(),
      isMe: true,
    };

    setInCallMessages((prev) => [...prev, newMsg]);
    setInCallChatInput('');

    setTimeout(() => {
      if (activeCall) {
        setInCallMessages((prev) => [
          ...prev,
          {
            id: 'icm_reply_' + Date.now(),
            senderName: activeCall.roomName,
            senderAvatar: activeCall.roomAvatar,
            text: 'Got it! Looking over the notes right now 👍',
            timestamp: Date.now(),
            isMe: false,
          },
        ]);
      }
    }, 4000);
  };

  const handleCopyLink = () => {
    triggerHaptic(30);
    navigator.clipboard.writeText(jitsiMeetingUrl);
    setCopiedLink(true);
    showToast('Call Link Copied to Clipboard');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Add Participant to Call Handlers
  const handleToggleSelectUser = (userId: string) => {
    triggerHaptic(20);
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleInviteSelectedParticipants = () => {
    triggerHaptic([30, 45, 60]);
    const addedUsers = users.filter((u) => selectedUserIds.includes(u.id));

    addedUsers.forEach((user) => {
      addCallParticipant(user);
      // Post system announcement to in-call chat
      setInCallMessages((prev) => [
        ...prev,
        {
          id: 'icm_join_' + user.id + Date.now(),
          senderName: user.name,
          senderAvatar: user.avatar,
          text: `Joined the group conference 👋`,
          timestamp: Date.now(),
          isMe: false,
        },
      ]);
    });

    showToast(
      addedUsers.length === 1
        ? `Added ${addedUsers[0].name} to group call`
        : `Added ${addedUsers.length} participants to group call`
    );

    setSelectedUserIds([]);
    setShowAddParticipantModal(false);
  };

  // Filter available contacts for Add Participant Drawer
  const filteredUsers = useMemo(() => {
    const currentParticipantIds = activeCall?.participants.map((p) => p.id) || [];
    return users.filter((u) => {
      if (u.id === currentUser.id) return false;
      const matchesSearch =
        u.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
        u.handle.toLowerCase().includes(participantSearch.toLowerCase()) ||
        (u.phone && u.phone.includes(participantSearch));

      if (!matchesSearch) return false;
      if (activeParticipantFilter === 'online') return u.isOnline;
      if (activeParticipantFilter === 'team')
        return u.role === 'admin' || u.statusMessage.toLowerCase().includes('team');
      return true;
    });
  }, [users, currentUser.id, participantSearch, activeParticipantFilter, activeCall?.participants]);

  if (!activeCall) return null;

  // Active language details
  const sourceLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang) || SUPPORTED_LANGUAGES[0];
  const targetLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[1];
  const currentCaptions = TRANSLATION_SPEECH_STREAM[targetLang] || TRANSLATION_SPEECH_STREAM.fr;

  // Dynamic Call Status Formatter with clean typography (borderless)
  const renderCallStatusIndicator = () => {
    const status = activeCall.status;

    if (status === 'connecting') {
      return (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-amber-300 uppercase">
            Connecting…
          </span>
        </div>
      );
    }

    if (status === 'ringing') {
      return (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.25)]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-amber-300 uppercase">
            Ringing…
          </span>
        </div>
      );
    }

    const formattedTimer = formatCallTimer(activeCall.duration);

    return (
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/15 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </span>
        <span className="text-sm sm:text-base font-mono font-bold tracking-widest text-emerald-400 tabular-nums drop-shadow-sm">
          {formattedTimer}
        </span>
      </div>
    );
  };

  // Minimized Picture-in-Picture Floating Pill (borderless & draggable)
  if (isMinimized) {
    return (
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.15}
        whileDrag={{ scale: 1.04, cursor: 'grabbing' }}
        className="fixed bottom-6 right-6 z-50 bg-[#0D0D0F]/95 rounded-3xl p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center gap-3.5 animate-scale select-none backdrop-blur-2xl cursor-grab active:cursor-grabbing border border-white/10 touch-none"
      >
        <div className="relative">
          <img
            src={activeCall.roomAvatar}
            alt={activeCall.roomName}
            className="w-12 h-12 rounded-full object-cover shadow-[0_0_20px_rgba(99,102,241,0.6)] pointer-events-none"
          />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-[#0D0D0F]" />
        </div>

        <div className="flex flex-col pointer-events-none">
          <span className="text-xs font-bold text-white tracking-tight truncate max-w-[140px]">
            {activeCall.roomName}
          </span>
          <span className="text-[11px] text-emerald-400 font-mono font-bold tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {activeCall.status === 'connecting'
              ? 'Connecting…'
              : activeCall.status === 'ringing'
              ? 'Ringing…'
              : formatCallTimer(activeCall.duration)}
          </span>
          {isRecording && (
            <span className="text-[9px] text-rose-400 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              REC {formatCallTimer(recordingSeconds)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-1" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={handleToggleMute}
            className={`min-w-[44px] min-h-[44px] p-2.5 rounded-2xl text-xs transition-colors active:scale-95 flex items-center justify-center ${
              activeCall.isMuted
                ? 'bg-rose-500/25 text-rose-400 shadow-sm'
                : 'bg-white/10 text-neutral-300 hover:text-white'
            }`}
            title={activeCall.isMuted ? 'Unmute' : 'Mute'}
          >
            {activeCall.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              triggerHaptic(20);
              setIsMinimized(false);
            }}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-2xl bg-white/10 text-neutral-300 hover:text-white transition-colors active:scale-95 flex items-center justify-center"
            title="Expand Call"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleHangUp}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shadow-lg shadow-rose-600/40 active:scale-95 flex items-center justify-center"
            title="End Call"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-2 sm:p-4 md:p-8 animate-fade-in select-none overflow-hidden touch-manipulation">
      {/* Dynamic Toast Feedback Pill */}
      {toastMessage && (
        <div className="fixed top-6 z-50 px-4 py-2 rounded-full bg-neutral-900/90 text-white text-xs font-semibold backdrop-blur-2xl shadow-2xl animate-fade-in flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Spacious & Stretched Call Modal Container (Borderless, High-Impact Negative Space) */}
      <div className="w-full max-w-5xl h-[88vh] min-h-[640px] max-h-[880px] rounded-[36px] shadow-[0_30px_90px_rgba(0,0,0,0.9)] bg-gradient-to-b from-[#0D0D10] via-[#131318] to-[#0A0A0D] overflow-hidden flex flex-col justify-between relative transition-all duration-300 p-4 sm:p-6 md:p-8 border border-white/[0.04]">
        {/* Dynamic Ambient Background Blur */}
        <DynamicAmbientBackdrop
          voiceAmplitude={voiceAmplitude}
          isMuted={activeCall.isMuted}
          blurPreset={blurPreset}
          roomAvatar={activeCall.roomAvatar}
        />

        {/* PROXIMITY SENSOR SCREEN-OFF LOCK OVERLAY (When held to ear) */}
        {isProximityLocked && (
          <div
            onClick={() => {
              triggerHaptic(20);
              setIsProximityLocked(false);
              showToast('Screen unlocked');
            }}
            className="absolute inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center text-center p-8 select-none cursor-pointer animate-fade-in"
          >
            <div className="w-16 h-16 rounded-full bg-neutral-900/60 border border-white/10 flex items-center justify-center mb-4 text-neutral-500 animate-pulse">
              <EyeOff className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-400 mb-1">
              Display Off • Handset Ear Mode
            </h3>
            <p className="text-xs text-neutral-600 max-w-xs leading-relaxed mb-6">
              Proximity sensor active to prevent accidental ear touches during call.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic(25);
                setIsProximityLocked(false);
              }}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 text-xs font-medium backdrop-blur-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Tap or Move Away to Wake</span>
            </button>
          </div>
        )}

        {/* WHATSAPP-LIKE VIDEO CALL VIEW (When video is active) */}
        {(activeCall.type === 'video' && !activeCall.isCameraOff) ? (
          <div
            ref={videoContainerRef}
            className="relative w-full h-full flex flex-col justify-between overflow-hidden rounded-[28px]"
            onClick={() => setShowWhatsAppImmersiveControls((prev) => !prev)}
          >
            {/* Remote Full-Bleed Video Background with Ambient Glow */}
            <div className="absolute inset-0 bg-[#0A0A0E] overflow-hidden pointer-events-none">
              {/* If PiP is swapped, show local camera in main view, otherwise remote feed */}
              {isPiPSwapped ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${
                    isSelfCameraFlipped ? 'transform scale-x-100' : 'transform -scale-x-100'
                  }`}
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#14141c] via-[#0d0d12] to-[#08080b]">
                  {/* High-Resolution Caller Video Stream Simulation */}
                  <img
                    src={activeCall.roomAvatar}
                    alt={activeCall.roomName}
                    className="w-full h-full object-cover opacity-85 filter contrast-105 scale-105"
                  />
                  {/* Subtle video ambient vignette & dynamic lighting */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
                  
                  {/* Active Speaker Voice Pulse Aura */}
                  <div
                    className="absolute inset-0 bg-radial-gradient pointer-events-none transition-opacity duration-200"
                    style={{
                      background: `radial-gradient(circle, rgba(16,185,129,${voiceAmplitude * 0.25}) 0%, transparent 70%)`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Top WhatsApp Video Navigation Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`z-30 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-all duration-300 ${
                showWhatsAppImmersiveControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
              }`}
            >
              {/* Back / Minimize & Caller Info */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    setIsMinimized(true);
                  }}
                  className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xl flex items-center justify-center transition-all active:scale-95 shadow-md"
                  title="Minimize Call"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-2.5">
                  <img
                    src={activeCall.roomAvatar}
                    alt={activeCall.roomName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm sm:text-base font-bold text-white drop-shadow-md">
                        {activeCall.roomName}
                      </h3>
                      <Lock className="w-3 h-3 text-emerald-400" title="End-to-end encrypted" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-white/80 font-medium drop-shadow">
                      <span className="text-emerald-300 font-mono font-bold">
                        {formatCallTimer(activeCall.duration)}
                      </span>
                      <span>•</span>
                      <span>WhatsApp HD Video</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Indicators: Signal Strength & Battery Level */}
              <div className="flex items-center gap-2">
                <SignalStrengthIndicator
                  signalLevel={signalLevel}
                  latencyMs={latencyMs}
                  packetLoss={packetLoss}
                  onClick={() => {
                    triggerHaptic(20);
                    setShowSignalModal(true);
                  }}
                />

                <BatteryLevelIndicator
                  level={batteryLevel}
                  isCharging={isCharging}
                  onClick={() => {
                    triggerHaptic(20);
                    setShowBatteryModal(true);
                  }}
                />

                {/* Add Participant to Video Call */}
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    setShowAddParticipantModal(true);
                  }}
                  className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xl flex items-center justify-center transition-all active:scale-95 shadow-md"
                  title="Add Participant"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* WhatsApp Draggable Floating Self-View Video PiP */}
            <motion.div
              drag
              dragConstraints={videoContainerRef}
              dragElastic={0.12}
              dragMomentum={false}
              whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic(25);
                setIsPiPSwapped(!isPiPSwapped);
                showToast(isPiPSwapped ? 'Showing Remote in Main View' : 'Swapped Self to Main View');
              }}
              className="absolute top-16 right-4 sm:right-6 z-30 w-28 h-40 sm:w-36 sm:h-48 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/30 bg-neutral-900 cursor-grab active:cursor-grabbing group transition-shadow duration-200 select-none touch-none"
              title="Drag anywhere to move screen • Tap to swap view"
            >
              {isPiPSwapped ? (
                <img
                  src={activeCall.roomAvatar}
                  alt={activeCall.roomName}
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover pointer-events-none ${
                    isSelfCameraFlipped ? 'transform scale-x-100' : 'transform -scale-x-100'
                  }`}
                />
              )}

              {/* PiP Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between pointer-events-none">
                <span className="text-[9px] font-bold text-white px-2 py-0.5 bg-black/60 rounded-full backdrop-blur w-max">
                  {isPiPSwapped ? activeCall.roomName : 'You (Self View)'}
                </span>

                <div className="flex justify-between items-center pointer-events-auto">
                  <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic(20);
                      setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user');
                      setIsSelfCameraFlipped(!isSelfCameraFlipped);
                    }}
                    className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur active:scale-90 transition-transform"
                    title="Flip camera facing"
                  >
                    <SwitchCamera className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[8px] text-white/80 font-mono">Drag or Tap</span>
                </div>
              </div>

              <div className="absolute bottom-1.5 left-2 text-[9px] font-semibold text-white/90 drop-shadow pointer-events-none">
                {isPiPSwapped ? activeCall.roomName : 'You'}
              </div>
            </motion.div>

            {/* WhatsApp Bottom Control Dock (Frosted Glass Pill) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`z-30 p-4 pb-5 flex flex-col items-center gap-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-300 ${
                showWhatsAppImmersiveControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              {/* WhatsApp Curved Floating Control Pill */}
              <div className="flex items-center gap-2.5 sm:gap-3 bg-[#18181f]/85 backdrop-blur-2xl px-4 py-2.5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/10">
                {/* 1. Flip Camera */}
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user');
                    setIsSelfCameraFlipped(!isSelfCameraFlipped);
                    showToast('Switched Camera Facing');
                  }}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90"
                  title="Flip Camera"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>

                {/* 2. Video Toggle / Switch to Voice Call */}
                <button
                  onClick={() => {
                    triggerHaptic([30, 45, 50]);
                    setActiveCall((prev) => (prev ? { ...prev, type: 'voice', isCameraOff: true } : null));
                    showToast('Switched to Voice Call Interface');
                  }}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90"
                  title="Switch to Voice Call"
                >
                  <Video className="w-5 h-5 text-emerald-400" />
                </button>

                {/* 3. Mic Mute */}
                <button
                  onClick={handleToggleMute}
                  className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all active:scale-90 ${
                    activeCall.isMuted ? 'bg-rose-500/30 text-rose-300' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={activeCall.isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                >
                  {activeCall.isMuted ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* 4. Speaker / Earpiece Toggle */}
                <button
                  onClick={handleToggleSpeakerphone}
                  className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all active:scale-90 ${
                    audioOutput === 'speaker'
                      ? 'bg-blue-500/30 text-blue-300'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={audioOutput === 'speaker' ? 'Switch to Handset' : 'Switch to Speaker'}
                >
                  {audioOutput === 'speaker' ? (
                    <Volume2 className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-neutral-300" />
                  )}
                </button>

                {/* 5. In-Call Chat */}
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    setIsChatDrawerOpen(true);
                    setUnreadChatCount(0);
                  }}
                  className="relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90"
                  title="Open In-Call Chat"
                >
                  <MessageCircle className="w-5 h-5" />
                  {unreadChatCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-neutral-900 animate-pulse" />
                  )}
                </button>

                {/* 6. Large Red Circular Hang Up Button */}
                <button
                  onClick={handleHangUp}
                  className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(225,29,72,0.7)] transition-all active:scale-90 ring-4 ring-rose-600/30"
                  title="End Call"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD VOICE CALL VIEW */
          <>
            {/* Top Header Bar */}
            {!hideFunctions && (
              <header className="z-20 flex items-center justify-between shrink-0 mb-3">
                {/* Left: Signal Strength Indicator + Battery Level + Audio Output */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <SignalStrengthIndicator
                    signalLevel={signalLevel}
                    latencyMs={latencyMs}
                    packetLoss={packetLoss}
                    onClick={() => {
                      triggerHaptic(20);
                      setShowSignalModal(true);
                    }}
                  />

                  <BatteryLevelIndicator
                    level={batteryLevel}
                    isCharging={isCharging}
                    onClick={() => {
                      triggerHaptic(20);
                      setShowBatteryModal(true);
                    }}
                  />

                  {/* Speakerphone / Handset Routing Pill */}
                  <button
                    onClick={handleAudioOutputSwitch}
                    className="min-h-[44px] min-w-[44px] flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-xl text-xs font-medium text-white/90 transition-all active:scale-95 shadow-sm"
                    title="Switch Audio Output (Speakerphone, Handset, Bluetooth)"
                  >
                    {audioOutput === 'speaker' && <Volume2 className="w-4 h-4 text-blue-400" />}
                    {audioOutput === 'bluetooth' && <Bluetooth className="w-4 h-4 text-violet-400" />}
                    {audioOutput === 'earpiece' && <Smartphone className="w-4 h-4 text-neutral-300" />}
                    <span className="capitalize hidden xs:inline">{audioOutput}</span>
                  </button>
                </div>

                {/* Right: Overflow + Minimize */}
                <div className="flex items-center gap-2">
                  {/* Overflow Options */}
                  <button
                    onClick={() => {
                      triggerHaptic(20);
                      setShowOverflowMenu(true);
                    }}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    title="More Call Options"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {/* Minimize Call */}
                  <button
                    onClick={() => {
                      triggerHaptic(20);
                      setIsMinimized(true);
                    }}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    title="Minimize Call"
                  >
                    <Minimize2 className="w-4 h-4 text-neutral-300" />
                  </button>
                </div>
              </header>
            )}

            {/* CALLER PROFILE & STATUS */}
            {!hideFunctions ? (
              <section className="flex flex-col items-center justify-center z-20 text-center shrink-0 mb-2">
                <div className="flex items-center gap-2 mb-2.5 min-h-[28px] flex-wrap justify-center">
                  {isRecording && (
                    <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>REC {formatCallTimer(recordingSeconds)}</span>
                    </div>
                  )}

                  {/* Multi-Participant Avatar Pile in Group Calls */}
                  {activeCall.participants && activeCall.participants.length > 1 && (
                    <button
                      onClick={() => setShowAddParticipantModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-xs text-neutral-300 backdrop-blur-md"
                    >
                      <div className="flex -space-x-2">
                        {activeCall.participants.slice(0, 3).map((p) => (
                          <img
                            key={p.id}
                            src={p.avatar}
                            alt={p.name}
                            className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-[#0D0D10]"
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-[11px] text-white">
                        {activeCall.participants.length} in Call
                      </span>
                    </button>
                  )}
                </div>

                {/* Caller Avatar with Audio-Responsive Soft Glow Ring */}
                <div className="relative mb-2.5 group">
                  <div
                    className="absolute -inset-4 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-600 opacity-60 blur-lg pointer-events-none transition-all duration-150"
                    style={{
                      transform: `scale(${1 + voiceAmplitude * 0.25})`,
                      opacity: activeCall.isMuted ? 0.2 : 0.5 + voiceAmplitude * 0.5,
                    }}
                  />

                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-500 shadow-[0_0_40px_rgba(99,102,241,0.5)]">
                    <img
                      src={activeCall.roomAvatar}
                      alt={activeCall.roomName}
                      className="w-full h-full rounded-full object-cover ring-2 ring-black"
                    />

                    <div
                      className={`absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-200 ${
                        activeCall.isMuted
                          ? 'bg-rose-600'
                          : voiceAmplitude > 0.15
                          ? 'bg-gradient-to-tr from-emerald-500 to-blue-500 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.7)]'
                          : 'bg-gradient-to-tr from-blue-500 to-violet-600'
                      }`}
                    >
                      {activeCall.isMuted ? (
                        <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      ) : (
                        <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-1.5 drop-shadow-sm truncate max-w-md">
                  {activeCall.roomName}
                </h2>

                <div className="flex flex-col items-center gap-1">{renderCallStatusIndicator()}</div>
              </section>
            ) : null}

            {/* MIDDLE SECTION: Acoustic Waveform */}
            <section className="flex-1 flex flex-col justify-center items-center px-1 sm:px-4 z-20 min-h-0 w-full overflow-hidden">
              <div className="w-full flex justify-center mb-4 shrink-0">
                <AudioWaveformVisualizer
                  isMuted={activeCall.isMuted}
                  isConnected={activeCall.status === 'connected'}
                  onAmplitudeChange={setVoiceAmplitude}
                />
              </div>
            </section>

            {/* BOTTOM SECTION: Voice Control Dock */}
            {!hideFunctions && (
              <section className="pb-2 pt-2 z-20 flex flex-col items-center gap-3 shrink-0">
                <div className="w-full max-w-lg rounded-3xl bg-neutral-900/80 backdrop-blur-2xl p-2 sm:p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center justify-between gap-1.5 sm:gap-2">
                  {/* 1. Mute / Unmute */}
                  <button
                    onClick={handleToggleMute}
                    className={`min-w-[44px] min-h-[44px] flex-1 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                      activeCall.isMuted
                        ? 'bg-rose-500/25 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                        : 'bg-white/[0.06] hover:bg-white/[0.12] text-white'
                    }`}
                    title={activeCall.isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                  >
                    {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    <span className="text-[10px] font-medium mt-1">
                      {activeCall.isMuted ? 'Muted' : 'Mute'}
                    </span>
                  </button>

                  {/* 2. SPEAKERPHONE TOGGLE BUTTON */}
                  <button
                    onClick={handleToggleSpeakerphone}
                    className={`min-w-[44px] min-h-[44px] flex-1 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                      audioOutput === 'speaker'
                        ? 'bg-gradient-to-tr from-blue-600/40 to-indigo-600/40 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.35)] ring-1 ring-blue-500/30'
                        : 'bg-white/[0.06] hover:bg-white/[0.12] text-white'
                    }`}
                    title={
                      audioOutput === 'speaker'
                        ? 'Switch audio output to Handset (Earpiece)'
                        : 'Switch audio output to Loudspeaker (Speakerphone)'
                    }
                  >
                    {audioOutput === 'speaker' ? (
                      <Volume2 className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Smartphone className="w-5 h-5 text-neutral-300" />
                    )}
                    <span className="text-[10px] font-medium mt-1">
                      {audioOutput === 'speaker' ? 'Speaker' : 'Handset'}
                    </span>
                  </button>

                  {/* 3. Switch to WhatsApp Video Call */}
                  <button
                    onClick={() => {
                      triggerHaptic([30, 45, 50]);
                      setActiveCall((prev) => (prev ? { ...prev, type: 'video', isCameraOff: false } : null));
                      showToast('Switched to WhatsApp Video Call');
                    }}
                    className="min-w-[44px] min-h-[44px] flex-1 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 bg-white/[0.06] hover:bg-white/[0.12] text-white"
                    title="Switch to Video Call"
                  >
                    <Video className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-medium mt-1">Video</span>
                  </button>

                  {/* 4. In-Call Chat */}
                  <button
                    onClick={() => {
                      triggerHaptic(25);
                      setIsChatDrawerOpen(true);
                      setUnreadChatCount(0);
                    }}
                    className="relative min-w-[44px] min-h-[44px] flex-1 h-14 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white flex flex-col items-center justify-center transition-all duration-200 active:scale-95"
                    title="Open In-Call Chat"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[10px] font-medium mt-1">Chat</span>

                    {unreadChatCount > 0 && (
                      <span className="absolute top-2 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 ring-2 ring-neutral-900 animate-pulse" />
                    )}
                  </button>
                </div>

                {/* Red Circular Hang-Up Button */}
                <div className="w-full flex justify-center pt-0.5">
                  <button
                    onClick={handleHangUp}
                    className="w-16 h-16 min-w-[56px] min-h-[56px] rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_35px_rgba(225,29,72,0.6)] transition-all duration-200 active:scale-90 flex items-center justify-center group ring-4 ring-rose-600/25"
                    title="End Call"
                  >
                    <PhoneOff className="w-7 h-7 transform transition-transform group-hover:rotate-12" />
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        {/* 'ADD PARTICIPANT' CONTACT SELECTION DRAWER FOR GROUP CALLING */}
        {showAddParticipantModal && (
          <div className="absolute inset-x-0 bottom-0 top-12 bg-[#111116]/98 backdrop-blur-3xl rounded-t-[36px] z-40 flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.85)] animate-fade-in">
            {/* Drawer Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add Participants to Call</h3>
                  <p className="text-xs text-neutral-400">
                    Invite contacts to join this encrypted conference
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowAddParticipantModal(false);
                }}
                className="w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Currently Active in Call Bar */}
            <div className="px-6 py-3 bg-white/[0.02] border-b border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-neutral-300">
                  Currently in Call ({activeCall.participants?.length || 1}):
                </span>
              </div>
              <div className="flex items-center -space-x-2">
                {activeCall.participants?.map((p) => (
                  <img
                    key={p.id}
                    src={p.avatar}
                    alt={p.name}
                    title={p.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#111116]"
                  />
                ))}
              </div>
            </div>

            {/* Search Input & Filter Chips */}
            <div className="p-4 sm:p-6 space-y-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  placeholder="Search contacts by name or @handle…"
                  className="w-full bg-white/5 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {participantSearch && (
                  <button
                    onClick={() => setParticipantSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2">
                {(['all', 'online', 'team'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      triggerHaptic(15);
                      setActiveParticipantFilter(filter);
                    }}
                    className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                      activeParticipantFilter === filter
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {filter === 'all' ? 'All Contacts' : filter === 'online' ? 'Online Now' : 'Team / Work'}
                  </button>
                ))}
              </div>
            </div>

            {/* Contacts Directory List */}
            <div className="flex-1 px-4 sm:px-6 space-y-2 overflow-y-auto min-h-0">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-neutral-400 text-xs">
                  No matching contacts found to invite.
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  const isAlreadyInCall = activeCall.participants?.some((p) => p.id === user.id);

                  return (
                    <div
                      key={user.id}
                      onClick={() => !isAlreadyInCall && handleToggleSelectUser(user.id)}
                      className={`p-3 rounded-2xl flex items-center justify-between transition-all select-none ${
                        isAlreadyInCall
                          ? 'opacity-50 bg-white/[0.02] cursor-not-allowed'
                          : isSelected
                          ? 'bg-indigo-600/20 ring-1 ring-indigo-500/40 cursor-pointer'
                          : 'bg-white/[0.03] hover:bg-white/[0.07] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {user.isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#111116]" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">{user.name}</span>
                            {user.role === 'admin' && (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono">
                                Team
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 font-mono">{user.handle}</p>
                        </div>
                      </div>

                      <div>
                        {isAlreadyInCall ? (
                          <span className="px-3 py-1 rounded-full bg-white/5 text-neutral-400 text-[10px] font-medium">
                            In Call
                          </span>
                        ) : (
                          <div
                            className={`min-w-[36px] min-h-[36px] w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white/10 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {isSelected ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions Row */}
            <div className="p-4 sm:p-6 bg-[#0E0E12] border-t border-white/[0.06] flex items-center gap-3 shrink-0">
              <button
                onClick={handleCopyLink}
                className="min-h-[44px] px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={handleInviteSelectedParticipants}
                disabled={selectedUserIds.length === 0}
                className="min-h-[44px] flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-indigo-600/40 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {selectedUserIds.length > 0
                    ? `Invite Selected (${selectedUserIds.length})`
                    : 'Select Contacts to Invite'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* REAL-TIME WEBRTC CONNECTION DIAGNOSTICS MODAL */}
        {showSignalModal && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#121217] rounded-[32px] max-w-sm w-full p-6 sm:p-8 space-y-4 shadow-2xl relative animate-scale">
              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowSignalModal(false);
                }}
                className="min-w-[44px] min-h-[44px] absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Network Diagnostics</h3>
                  <p className="text-xs text-emerald-400 font-semibold">WebRTC Peer Connection Active</p>
                </div>
              </div>

              {/* Real-time stats card */}
              <div className="space-y-2.5 bg-black/40 p-4 rounded-2xl text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Signal Strength:</span>
                  <span className="text-emerald-400 font-bold">
                    {signalLevel === 4 ? 'Excellent (4/4 Bars)' : `${signalLevel}/4 Bars`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Round-Trip Latency:</span>
                  <span className="text-white font-bold">{latencyMs} ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Packet Loss:</span>
                  <span className="text-emerald-400 font-bold">{packetLoss}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Jitter:</span>
                  <span className="text-white">{jitterMs} ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Audio Codec:</span>
                  <span className="text-indigo-300">Opus 48kHz Stereo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Transport Security:</span>
                  <span className="text-emerald-400">DTLS 1.3 / SRTP</span>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowSignalModal(false);
                }}
                className="min-h-[44px] w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
              >
                Close Diagnostics
              </button>
            </div>
          </div>
        )}

        {/* SLIDING IN-CALL CHAT & LIVE TRANSLATIONS DRAWER (Borderless) */}
        {isChatDrawerOpen && (
          <div className="absolute inset-x-0 bottom-0 top-14 bg-[#111116]/98 backdrop-blur-3xl rounded-t-[36px] z-40 flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.85)] animate-fade-in border-t border-white/[0.08]">
            {/* Drawer Header */}
            <div className="px-6 py-3.5 flex items-center justify-between border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">In-Call Messages & Translation</h3>
                  </div>
                  <p className="text-[11px] text-neutral-400">Encrypted in-session chat & live spoken captions</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    setIsChatDrawerOpen(false);
                  }}
                  className="min-w-[44px] min-h-[44px] w-9 h-9 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-Header: Active Translation Controls Bar */}
            <div className="px-6 py-2.5 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    setShowLanguagePicker(true);
                  }}
                  className="min-h-[32px] px-3 py-1 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                  title="Change translation languages"
                >
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {sourceLangObj.flag} {sourceLang.toUpperCase()} → {targetLangObj.flag} {targetLang.toUpperCase()}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
                </button>

                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>

              {/* Compact Toggle: Live Translation ON / OFF */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400 font-medium">Live Speech Translation:</span>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(20);
                    setIsTranslationActive(!isTranslationActive);
                    showToast(!isTranslationActive ? 'Live Translation Active' : 'Live Translation Paused');
                  }}
                  className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    isTranslationActive ? 'bg-indigo-600' : 'bg-neutral-800'
                  }`}
                  title="Toggle live speech transcription & translation"
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      isTranslationActive ? 'translate-x-3.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Chat & Translation Messages List */}
            <div ref={chatScrollRef} className="flex-1 p-5 sm:p-6 space-y-3.5 overflow-y-auto min-h-0">
              {inCallMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isMe && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover mt-0.5 ring-1 ring-white/10 shrink-0"
                    />
                  )}

                  {msg.isLiveTranslation ? (
                    /* Live Spoken Speech Translation Card */
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 space-y-2 border transition-all ${
                        msg.isMe
                          ? 'bg-gradient-to-br from-indigo-950/70 to-blue-950/70 border-indigo-500/30 text-white rounded-tr-xs'
                          : 'bg-[#181820] border-violet-500/30 text-neutral-100 rounded-tl-xs shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/[0.08]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                            <Languages className="w-3 h-3 text-indigo-400" />
                            <span>Live Translation</span>
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.08] text-neutral-300">
                          {msg.sourceLang ? msg.sourceLang.toUpperCase() : sourceLang.toUpperCase()} → {msg.targetLang ? msg.targetLang.toUpperCase() : targetLang.toUpperCase()}
                        </span>
                      </div>

                      {/* Main Translated Text */}
                      <p className="text-sm sm:text-base font-semibold leading-snug text-white">
                        "{msg.text}"
                      </p>

                      {/* Original Spoken Transcript */}
                      {msg.originalText && (
                        <div className="text-xs text-neutral-400 italic bg-black/20 p-2 rounded-xl border border-white/[0.04]">
                          <span className="text-[10px] font-mono not-italic text-neutral-500 block uppercase font-bold mb-0.5">
                            Original:
                          </span>
                          "{msg.originalText}"
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-white/50 pt-0.5 font-mono">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              triggerHaptic(15);
                              try {
                                if ('speechSynthesis' in window) {
                                  const utterance = new SpeechSynthesisUtterance(msg.text);
                                  utterance.lang = msg.targetLang || targetLang;
                                  window.speechSynthesis.speak(utterance);
                                }
                              } catch {}
                              showToast('Pronouncing translation');
                            }}
                            className="hover:text-white flex items-center gap-1 transition-colors"
                            title="Pronounce translation"
                          >
                            <Volume2 className="w-3 h-3 text-indigo-400" />
                            <span>Speak</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              triggerHaptic(15);
                              navigator.clipboard?.writeText(msg.text);
                              showToast('Translation copied');
                            }}
                            className="hover:text-white flex items-center gap-1 transition-colors"
                            title="Copy translation"
                          >
                            <Copy className="w-3 h-3 text-neutral-400" />
                            <span>Copy</span>
                          </button>
                        </div>

                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Standard Chat Message Bubble */
                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.isMe
                          ? 'bg-gradient-to-tr from-blue-600 to-violet-600 text-white rounded-tr-xs shadow-md'
                          : 'bg-white/10 text-neutral-200 rounded-tl-xs'
                      }`}
                    >
                      {!msg.isMe && (
                        <span className="block text-[10px] font-bold text-indigo-300 mb-0.5">
                          {msg.senderName}
                        </span>
                      )}
                      <p>{msg.text}</p>
                      <span className="block text-[9px] text-white/50 text-right mt-1 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Reactions Bar */}
            <div className="px-6 py-2 flex items-center gap-2 border-t border-white/[0.04] bg-[#0E0E12]/50">
              {['👍', '❤️', '🔥', '👏', '🎉', '💡'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    triggerHaptic(20);
                    setInCallMessages((prev) => [
                      ...prev,
                      {
                        id: 'icm_' + Date.now(),
                        senderName: currentUser.name,
                        senderAvatar: currentUser.avatar,
                        text: emoji,
                        timestamp: Date.now(),
                        isMe: true,
                      },
                    ]);
                  }}
                  className="min-h-[38px] min-w-[38px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-sm transition-transform active:scale-125 flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Chat Input Field with Translate & Send */}
            <form
              onSubmit={handleSendInCallMessage}
              className="p-4 bg-[#0E0E12] flex items-center gap-2 border-t border-white/[0.06]"
            >
              <input
                type="text"
                value={inCallChatInput}
                onChange={(e) => setInCallChatInput(e.target.value)}
                placeholder="Type a message or translation…"
                className="flex-1 bg-white/5 rounded-2xl px-5 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              {/* Translate & Send Button */}
              <button
                type="button"
                onClick={() => {
                  if (!inCallChatInput.trim()) return;
                  triggerHaptic(25);
                  const sourceText = inCallChatInput.trim();
                  const targetStream = TRANSLATION_SPEECH_STREAM[targetLang] || TRANSLATION_SPEECH_STREAM.fr;
                  const sampleTrans = targetStream[0]?.translated || `[${targetLang.toUpperCase()}] ${sourceText}`;
                  const newMsg: InCallChatMessage = {
                    id: 'icm_trans_' + Date.now(),
                    senderName: currentUser.name,
                    senderAvatar: currentUser.avatar,
                    text: sampleTrans,
                    originalText: sourceText,
                    isLiveTranslation: true,
                    sourceLang: sourceLang,
                    targetLang: targetLang,
                    timestamp: Date.now(),
                    isMe: true,
                  };
                  setInCallMessages((prev) => [...prev, newMsg]);
                  setInCallChatInput('');
                  showToast(`Translated to ${targetLangObj.name}`);
                }}
                disabled={!inCallChatInput.trim()}
                className="min-h-[44px] px-3.5 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 transition-all active:scale-95 border border-indigo-500/30 shadow-sm"
                title="Translate into target language and send"
              >
                <Languages className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Translate</span>
              </button>

              {/* Direct Send Button */}
              <button
                type="submit"
                disabled={!inCallChatInput.trim()}
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white flex items-center justify-center disabled:opacity-40 transition-all active:scale-95 shadow-md"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* REAL-TIME LANGUAGE PICKER MODAL INTERFACE */}
        {showLanguagePicker && (
          <div className="absolute inset-x-0 bottom-0 top-12 bg-[#121217]/98 backdrop-blur-3xl rounded-t-[36px] z-50 p-6 sm:p-8 shadow-[0_-20px_60px_rgba(0,0,0,0.9)] animate-fade-in flex flex-col justify-between overflow-y-auto border-t border-white/[0.08]">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-violet-600/30 text-indigo-300 flex items-center justify-center border border-indigo-500/30 shadow-md">
                    <Languages className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Live Voice & Chat Translator</h3>
                    <p className="text-xs text-neutral-400">
                      Real-time translation stream appears inside In-Call Messages
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    setShowLanguagePicker(false);
                  }}
                  className="min-w-[44px] min-h-[44px] w-10 h-10 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Translation Status Toggle */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="text-xs font-semibold text-white block">Real-Time Speech Engine</span>
                    <span className="text-[11px] text-neutral-400">Translates live call audio and transcribes into In-Call Chat</span>
                  </div>
                </div>

                {/* Compact Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(20);
                    setIsTranslationActive(!isTranslationActive);
                    showToast(!isTranslationActive ? 'Live Translation Enabled' : 'Live Translation Disabled');
                  }}
                  className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    isTranslationActive ? 'bg-indigo-600' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      isTranslationActive ? 'translate-x-3.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Language Pair Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
                {/* Source Language */}
                <div className="space-y-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                  <label className="text-[11px] uppercase font-bold text-neutral-400 flex items-center gap-1.5">
                    <span>1. Speaker / Caller Language</span>
                  </label>
                  <select
                    value={sourceLang}
                    onChange={(e) => {
                      triggerHaptic(15);
                      setSourceLang(e.target.value);
                    }}
                    className="w-full bg-black/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-white/10"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-neutral-900 text-white">
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      triggerHaptic(30);
                      const temp = sourceLang;
                      setSourceLang(targetLang);
                      setTargetLang(temp);
                    }}
                    className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 transition-transform active:rotate-180 flex items-center justify-center border border-indigo-500/30 shadow-md"
                    title="Swap Source and Target Languages"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Target Language */}
                <div className="space-y-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                  <label className="text-[11px] uppercase font-bold text-neutral-400 flex items-center gap-1.5">
                    <span>2. Translation Target Language</span>
                  </label>
                  <select
                    value={targetLang}
                    onChange={(e) => {
                      triggerHaptic(15);
                      setTargetLang(e.target.value);
                    }}
                    className="w-full bg-black/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-white/10"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-neutral-900 text-white">
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Language Selection Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Quick Select Target Language:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        triggerHaptic(15);
                        setTargetLang(lang.code);
                      }}
                      className={`min-h-[36px] px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 ${
                        targetLang === lang.code
                          ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold shadow-md ring-1 ring-indigo-400'
                          : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Informational Guidance Notice */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-white">Translation Output in In-Call Messages:</p>
                  <p className="text-neutral-300 leading-relaxed">
                    Live spoken utterances are automatically transcribed and translated with speech synthesis support directly inside the In-Call Chat drawer.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/[0.06]">
              <button
                onClick={() => {
                  triggerHaptic(25);
                  setShowLanguagePicker(false);
                  setIsChatDrawerOpen(true);
                  setUnreadChatCount(0);
                  showToast(`Live translation configured: ${sourceLangObj.name} → ${targetLangObj.name}`);
                }}
                className="flex-1 min-h-[44px] py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/40 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Apply & Open In-Call Messages</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowLanguagePicker(false);
                  showToast(`Language set: ${sourceLangObj.flag} → ${targetLangObj.flag}`);
                }}
                className="min-h-[44px] px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* OVERFLOW OPTIONS MODAL */}
        {showOverflowMenu && (
          <div className="absolute inset-x-0 bottom-0 bg-[#121217]/98 backdrop-blur-3xl rounded-t-[36px] z-40 p-8 shadow-[0_-20px_60px_rgba(0,0,0,0.85)] animate-fade-in space-y-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-bold text-white">Call Settings & Utilities</h3>
              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowOverflowMenu(false);
                }}
                className="min-w-[44px] min-h-[44px] w-9 h-9 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Speakerphone Output Mode in Overflow */}
              <button
                onClick={() => {
                  handleAudioOutputSwitch();
                }}
                className="min-h-[44px] w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-left flex items-center justify-between text-xs text-white active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="block font-medium">Audio Output Route</span>
                    <span className="text-[10px] text-neutral-400">Speaker, Handset or Bluetooth</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 capitalize">
                  {audioOutput}
                </span>
              </button>

              {/* Live Translator Trigger in Overflow */}
              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowOverflowMenu(false);
                  setShowLanguagePicker(true);
                }}
                className="min-h-[44px] w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-left flex items-center justify-between text-xs text-white active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Languages className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="block font-medium">Live Voice Translation</span>
                    <span className="text-[10px] text-neutral-400">
                      {sourceLangObj.flag} {sourceLang.toUpperCase()} → {targetLangObj.flag} {targetLang.toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">Configure</span>
              </button>

              {/* DTMF Keypad */}
              <button
                onClick={() => {
                  triggerHaptic(25);
                  setShowOverflowMenu(false);
                  setShowKeypad(true);
                }}
                className="min-h-[44px] w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-left flex items-center justify-between text-xs text-white active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-blue-400" />
                  <span>DTMF Dial Keypad</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">Open</span>
              </button>

              {/* Noise Suppression Toggle with Compact Switch */}
              <button
                onClick={() => {
                  triggerHaptic(25);
                  setNoiseSuppression(!noiseSuppression);
                  showToast(
                    !noiseSuppression ? 'AI Noise Isolation Enabled' : 'Noise Isolation Off'
                  );
                }}
                className="min-h-[44px] w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-left flex items-center justify-between text-xs text-white active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 text-violet-400" />
                  <div>
                    <span className="block font-medium">AI Noise Suppression</span>
                    <span className="text-[10px] text-neutral-400">Crisp voice isolation</span>
                  </div>
                </div>
                <div
                  className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    noiseSuppression ? 'bg-indigo-600' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      noiseSuppression ? 'translate-x-3.5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </button>

              {/* Mobile QR Link */}
              <button
                onClick={() => {
                  triggerHaptic(25);
                  setShowOverflowMenu(false);
                  setShowMobileQR(true);
                }}
                className="min-h-[44px] w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-left flex items-center justify-between text-xs text-white active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>Mobile Join QR Code</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">Scan</span>
              </button>

              {/* Copy Meeting Link */}
              <button
                onClick={handleCopyLink}
                className="min-h-[44px] w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-left flex items-center justify-between text-xs text-white active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Copy className="w-4 h-4 text-neutral-300" />
                  <span>{copiedLink ? 'Copied Link!' : 'Copy Call Link'}</span>
                </div>
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : null}
              </button>
            </div>
          </div>
        )}

        {/* DTMF KEYPAD OVERLAY MODAL */}
        {showKeypad && (
          <div className="absolute inset-x-6 bottom-20 top-16 bg-[#121217]/95 backdrop-blur-3xl rounded-[32px] p-6 z-40 flex flex-col items-center justify-between shadow-2xl animate-scale">
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                DTMF Dial Pad
              </span>
              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowKeypad(false);
                }}
                className="min-w-[44px] min-h-[44px] p-2 rounded-xl text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-10 text-2xl font-mono font-bold text-indigo-400 tracking-widest text-center">
              {keypadInput || '—'}
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-xs my-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  className="min-w-[44px] min-h-[44px] h-14 rounded-2xl bg-white/5 hover:bg-white/15 text-white text-xl font-bold flex items-center justify-center active:scale-95 transition-all shadow-md"
                >
                  {key}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                triggerHaptic(15);
                setKeypadInput('');
              }}
              className="min-h-[44px] text-xs text-neutral-400 hover:text-neutral-200 mt-2 px-4 py-2"
            >
              Clear Input
            </button>
          </div>
        )}

        {/* E2EE SECURITY MODAL */}
        {showSecurityModal && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#121217] rounded-[32px] max-w-sm w-full p-8 space-y-5 shadow-2xl relative animate-scale">
              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowSecurityModal(false);
                }}
                className="min-w-[44px] min-h-[44px] absolute top-5 right-5 p-2 rounded-xl bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">End-to-End Encryption</h3>
                  <p className="text-xs text-neutral-400">Cryptographic Voice & Video Session</p>
                </div>
              </div>

              <div className="space-y-3 bg-black/40 p-5 rounded-2xl text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Cipher:</span>
                  <span className="text-emerald-400 font-bold">AES-GCM-256</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Audio Codec:</span>
                  <span className="text-indigo-300">Opus 48kHz Stereo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">SAS Fingerprint:</span>
                  <span className="text-emerald-400 font-bold">
                    {activeCall.e2eeKey || 'wat_e2ee_9981'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic(25);
                  setShowSecurityModal(false);
                }}
                className="min-h-[44px] w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold transition-colors active:scale-95 shadow-lg shadow-indigo-600/30"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* BATTERY POWER & TELEMETRY MODAL */}
        {showBatteryModal && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#121217] rounded-[32px] max-w-sm w-full p-7 space-y-5 shadow-2xl relative animate-scale border border-white/10">
              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowBatteryModal(false);
                }}
                className="min-w-[44px] min-h-[44px] absolute top-5 right-5 p-2 rounded-xl bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <BatteryCharging className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Call Power & Battery</h3>
                  <p className="text-xs text-neutral-400">Live Device Telemetry</p>
                </div>
              </div>

              {/* Live Battery Gauge */}
              <div className="bg-black/50 p-4 rounded-2xl space-y-3 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300">Remaining Charge</span>
                  <span className="text-lg font-bold font-mono text-white flex items-center gap-1">
                    {batteryLevel}%
                    {isCharging && <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 animate-pulse" />}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      batteryLevel > 50
                        ? 'bg-emerald-500'
                        : batteryLevel > 20
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${batteryLevel}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-neutral-400 font-mono">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="block text-neutral-500">Status</span>
                    <span className="text-white font-semibold">{isCharging ? '⚡ Charging' : 'On Battery'}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="block text-neutral-500">Estimated Talk</span>
                    <span className="text-emerald-400 font-semibold">{Math.max(1, Math.round(batteryLevel * 0.08))}h {Math.round((batteryLevel % 12) * 5)}m</span>
                  </div>
                </div>
              </div>

              {/* Power Optimization Options */}
              <div className="space-y-2 text-xs">
                <div className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  Power Consumption Profile:
                </div>
                <div className="space-y-1.5 text-neutral-300 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Camera Video Stream</span>
                    <span className="text-neutral-400 font-mono">~45%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Acoustic Visualizer & Blur</span>
                    <span className="text-neutral-400 font-mono">~20%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Opus 48kHz Audio</span>
                    <span className="text-neutral-400 font-mono">~15%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowBatteryModal(false);
                  showToast('Power optimization active');
                }}
                className="min-h-[44px] w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold transition-all active:scale-95 shadow-lg shadow-emerald-600/30"
              >
                Close Telemetry
              </button>
            </div>
          </div>
        )}

        {/* MOBILE JOIN QR CODE MODAL */}
        {showMobileQR && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#121217] rounded-[32px] max-w-sm w-full p-8 space-y-5 shadow-2xl relative animate-scale text-center">
              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowMobileQR(false);
                }}
                className="min-w-[44px] min-h-[44px] absolute top-5 right-5 p-2 rounded-xl bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Join Call on Phone</h3>
                <p className="text-xs text-neutral-400">Scan QR Code with Camera</p>
              </div>

              <div className="p-4 bg-white rounded-3xl flex flex-col items-center justify-center shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    jitsiMeetingUrl
                  )}`}
                  alt="Meeting QR Code"
                  className="w-40 h-40 object-contain rounded-xl"
                />
              </div>

              <button
                onClick={handleCopyLink}
                className="min-h-[44px] w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied Meeting URL!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
