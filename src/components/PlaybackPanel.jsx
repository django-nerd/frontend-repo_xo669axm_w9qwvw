import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

function pitchShiftPlaybackRate(targetPitch) {
  // very simple funny-voice effect via playbackRate mapping
  // targetPitch range: -12..+12 semitones → 0.6..1.8
  const clamped = Math.max(-12, Math.min(12, targetPitch));
  const rate = 1 * Math.pow(2, clamped / 12);
  return Math.min(1.8, Math.max(0.6, rate));
}

export default function PlaybackPanel({ transcript, sourceUrl }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(6); // default squeaky cat

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = pitchShiftPlaybackRate(pitch);
  }, [pitch]);

  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [sourceUrl]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const restart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">You said</p>
          <p className="text-base sm:text-lg font-medium text-neutral-800 line-clamp-2">{transcript || '...waiting for input'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={togglePlay} className="p-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition">
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={restart} className="p-2 rounded-full border border-neutral-300 hover:bg-neutral-50 transition">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm text-neutral-600">Funny voice</label>
        <input
          type="range"
          min={-12}
          max={12}
          value={pitch}
          onChange={(e) => setPitch(Number(e.target.value))}
          className="w-full accent-purple-600"
        />
      </div>

      <audio ref={audioRef} src={sourceUrl || ''} preload="auto" onEnded={() => setIsPlaying(false)} />
    </div>
  );
}
