import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  RotateCw,
  Send,
  CornerDownLeft,
  Copy,
  Check,
  X,
  Upload,
  Sparkles,
  FileAudio,
  Volume2,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

interface AudioTranscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTranscript?: (text: string) => void;
  onSendTranscript?: (text: string) => void;
}

export const AudioTranscribeModal: React.FC<AudioTranscribeModalProps> = ({
  isOpen,
  onClose,
  onInsertTranscript,
  onSendTranscript,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [modelName, setModelName] = useState('gemini-3.5-transcribe');
  const [copied, setCopied] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>([15, 30, 60, 40, 80, 50, 30, 20]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const animFrameRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      stopRecordingCleanup();
    };
  }, []);

  const stopRecordingCleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      soundEngine.playChime();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Audio analysis for real-time waveform bars
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const updateWaveform = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const levels = Array.from(dataArray.slice(0, 12)).map((v) => Math.max(12, (v / 255) * 100));
        setAudioLevels(levels);
        animFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      updateWaveform();

      // MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        transcribeBlob(blob, mimeType);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);
      setTranscript('');

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      alert('Microphone access was denied or is not supported. Please grant permission in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      soundEngine.playMessageSent();
      stopRecordingCleanup();
    }
  };

  const transcribeBlob = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        try {
          const res = await fetch('/api/ai/transcribe-live-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64data,
              mimeType,
              prompt: 'Transcribe this spoken audio accurately. Output only the verbatim spoken transcription, without any commentary or quotation marks.',
            }),
          });

          const data = await res.json();
          setTranscript(data.transcript || 'No speech detected in audio clip.');
          setModelName(data.model || 'gemini-3.5-transcribe');
          soundEngine.playChime();
        } catch (err: any) {
          setTranscript('Could not connect to Gemini transcription service.');
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (err) {
      setIsTranscribing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
    transcribeBlob(file, file.type || 'audio/webm');
    e.target.value = '';
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (transcript && onInsertTranscript) {
      onInsertTranscript(transcript);
      onClose();
    }
  };

  const handleSend = () => {
    if (transcript && onSendTranscript) {
      onSendTranscript(transcript);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="audio-transcribe-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isRecording) onClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-black/10 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-md">
              <Mic className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">Voice Transcription</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  gemini-3.5-transcribe
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Speak into your microphone to convert speech to verbatim text
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isRecording) stopRecording();
              onClose();
            }}
            className="p-2 rounded-2xl text-neutral-400 hover:text-black hover:bg-black/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Recording Canvas / Waveform */}
          <div className="bg-neutral-50 rounded-2xl border border-black/[0.06] p-6 flex flex-col items-center justify-center min-h-[160px] text-center relative overflow-hidden">
            {isRecording ? (
              <div className="space-y-4 flex flex-col items-center">
                {/* Live Waveform visualizer */}
                <div className="flex items-center justify-center gap-1.5 h-16 px-4">
                  {audioLevels.map((lvl, i) => (
                    <div
                      key={i}
                      style={{ height: `${Math.max(10, lvl)}%` }}
                      className="w-1.5 sm:w-2 bg-emerald-500 rounded-full transition-all duration-75"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-mono text-sm font-bold text-neutral-800">
                    00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                  </span>
                  <span className="text-xs text-neutral-500">Listening to microphone...</span>
                </div>
              </div>
            ) : isTranscribing ? (
              <div className="py-4 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 animate-pulse">
                  <RotateCw className="w-6 h-6 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-neutral-900">Transcribing with gemini-3.5-transcribe</h4>
                  <p className="text-xs text-neutral-500">Converting speech audio to verbatim text...</p>
                </div>
              </div>
            ) : (
              <div className="py-2 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black/[0.04] text-neutral-700 flex items-center justify-center">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-neutral-800">Tap Record to Begin Speaking</h4>
                  <p className="text-xs text-neutral-500 max-w-xs">
                    Uses Gemini 3.5 Transcribe to accurately capture spoken words, accents, and punctuation.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Record Control Buttons */}
          <div className="flex items-center justify-center gap-3">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-transform active:scale-95"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop & Transcribe</span>
              </button>
            ) : (
              <>
                <button
                  onClick={startRecording}
                  disabled={isTranscribing}
                  className="px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-black/20 transition-transform active:scale-95"
                >
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>Start Recording</span>
                </button>

                {/* File upload audio option */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTranscribing}
                  className="p-3 rounded-2xl border border-black/[0.08] hover:bg-black/[0.04] text-neutral-700 transition-colors"
                  title="Upload audio file to transcribe"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Audio Playback (if recorded) */}
          {audioUrl && !isRecording && (
            <div className="flex items-center gap-3 p-3 bg-neutral-100/70 rounded-2xl border border-black/[0.04]">
              <Volume2 className="w-4 h-4 text-neutral-500 shrink-0" />
              <audio src={audioUrl} controls className="w-full h-8" />
            </div>
          )}

          {/* Transcript Result Box */}
          {transcript && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Transcribed Text ({modelName})
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-black/[0.05] transition-colors text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={3}
                className="w-full p-3 bg-neutral-50 border border-black/[0.08] focus:border-black/30 focus:bg-white rounded-2xl text-xs sm:text-sm text-neutral-900 resize-none focus:outline-none leading-relaxed"
                placeholder="Spoken transcription will appear here..."
              />

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 flex-wrap">
                {onInsertTranscript && (
                  <button
                    onClick={handleInsert}
                    className="px-3.5 py-2 rounded-xl border border-black/[0.1] hover:bg-black/[0.04] text-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                    <span>Insert into Input</span>
                  </button>
                )}

                {onSendTranscript && (
                  <button
                    onClick={handleSend}
                    className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send as Message</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
