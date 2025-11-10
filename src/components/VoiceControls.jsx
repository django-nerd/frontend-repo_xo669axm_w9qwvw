import React, { useEffect, useRef, useState } from 'react';
import { Circle, Square, Play, Pause, Volume2 } from 'lucide-react';

// Map semitones (–12..+12) to playbackRate (~0.6..1.8)
function rateFromSemitones(semi) {
  const clamped = Math.max(-12, Math.min(12, semi));
  return Math.min(1.8, Math.max(0.6, Math.pow(2, clamped / 12)));
}

export default function VoiceControls({ onMessage, onTalkingChange }) {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Only used during recording for lip-sync
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(6);
  const [hint, setHint] = useState('Tap start and say hello!');

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rateFromSemitones(pitch);
    }
  }, [pitch]);

  const startMicMonitor = (stream) => {
    stopMicMonitor();
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128; // -1..1
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        onTalkingChange?.(rms > 0.05);
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch (e) {
      // Fallback: show mouth open while recording
      onTalkingChange?.(true);
    }
  };

  const stopMicMonitor = async () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (audioContextRef.current) {
      try { await audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    onTalkingChange?.(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Simple speech-recognition attempt (best-effort)
        try {
          const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (SR) {
            const rec = new SR();
            rec.lang = 'en-US';
            rec.onresult = (ev) => {
              const text = ev.results[0][0].transcript;
              onMessage?.({ from: 'you', text });
              const replies = [
                "Mreow! Did you just say '" + text + "'? I'm on it!",
                "Purr-fect words! I will repeat: '" + text + "'",
                'Nya! That sounded fun. Let\'s echo it!',
              ];
              onMessage?.({ from: 'cat', text: replies[Math.floor(Math.random() * replies.length)] });
            };
            rec.onerror = () => {
              onMessage?.({ from: 'you', text: '...' });
              onMessage?.({ from: 'cat', text: 'I heard you! Hit play to hear my remix.' });
            };
            rec.start();
          } else {
            onMessage?.({ from: 'cat', text: 'I heard you! Hit play to hear my remix.' });
          }
        } catch {
          onMessage?.({ from: 'cat', text: 'I heard you! Hit play to hear my remix.' });
        }
      };

      recorder.start();
      setIsRecording(true);
      setHint('Listening...');
      startMicMonitor(stream);
    } catch (err) {
      setHint('Microphone permission is required.');
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setHint('Great! Now press play.');
    stopMicMonitor();
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      // No lip-sync during playback in this version
      onTalkingChange?.(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {}
    }
  };

  // Reset state when audio ends/pauses
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => { setIsPlaying(false); onTalkingChange?.(false); };
    const onPause = () => { setIsPlaying(false); onTalkingChange?.(false); };
    el.addEventListener('ended', onEnded);
    el.addEventListener('pause', onPause);
    return () => {
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('pause', onPause);
    };
  }, [onTalkingChange]);

  return (
    <div className="w-full max-w-xl mx-auto p-4 rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-600">
          <Volume2 size={18} />
          <span className="text-sm">Funny voice</span>
        </div>
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button onClick={startRecording} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition">
              <Circle size={16} /> Start
            </button>
          ) : (
            <button onClick={stopRecording} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition">
              <Square size={16} /> Stop
            </button>
          )}
          <button onClick={togglePlay} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-300 hover:bg-neutral-50 transition">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />} Play
          </button>
        </div>
      </div>

      <div>
        <input type="range" min={-12} max={12} value={pitch} onChange={(e)=>setPitch(Number(e.target.value))} className="w-full accent-indigo-600"/>
        <p className="mt-1 text-xs text-neutral-500">Pitch: {pitch > 0 ? `+${pitch}` : pitch} st</p>
      </div>

      <p className="text-sm text-neutral-600">{hint}</p>

      <audio ref={audioRef} src={audioUrl || ''} preload="auto" />
    </div>
  );
}
