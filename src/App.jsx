import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import CatAvatar from './components/CatAvatar';
import Recorder from './components/Recorder';
import PlaybackPanel from './components/PlaybackPanel';

function App() {
  const [transcript, setTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mood, setMood] = useState('idle'); // idle | blink

  useEffect(() => {
    let blinkTimer = null;
    let resetTimer = null;

    const queueBlink = () => {
      const delay = 2200 + Math.random() * 2800; // ~2.2–5s
      blinkTimer = setTimeout(() => {
        setMood('blink');
        resetTimer = setTimeout(() => setMood('idle'), 140);
        queueBlink();
      }, delay);
    };

    queueBlink();
    return () => {
      if (blinkTimer) clearTimeout(blinkTimer);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, []);

  const handleTranscript = (text, url) => {
    setTranscript(text || '');
    setAudioUrl(url || '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-sky-50 text-neutral-900">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <section className="flex flex-col items-center gap-6">
          <div className={`transition-transform duration-200 ${isSpeaking ? 'scale-105' : 'scale-100'}`}>
            <CatAvatar mood={mood} mouthOpen={isSpeaking} />
          </div>
          <Recorder onTranscript={handleTranscript} onSpeakingChange={setIsSpeaking} />
          <p className="text-sm text-neutral-600 text-center max-w-sm">
            Tip: After you stop, the cat will repeat you. Drag the slider to make the voice squeakier or deeper.
          </p>
        </section>

        <section className="space-y-6">
          <PlaybackPanel transcript={transcript} sourceUrl={audioUrl} />

          <div className="p-5 rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur">
            <h3 className="font-semibold mb-2">How it works</h3>
            <ul className="text-sm text-neutral-700 list-disc pl-5 space-y-1">
              <li>Press Start talking and say something.</li>
              <li>Press Stop to finish — your voice is captured.</li>
              <li>The cat repeats it with a funny pitch you can control.</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-xs text-neutral-500">
        Built for fun — works best in modern browsers with mic access enabled.
      </footer>
    </div>
  );
}

export default App;
