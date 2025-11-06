import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import HeroScene from './components/HeroScene';
import CatAvatar from './components/CatAvatar';
import ChatBubble from './components/ChatBubble';
import VoiceControls from './components/VoiceControls';

function App() {
  const [messages, setMessages] = useState([
    { from: 'cat', text: "Hi! I'm your techno kitty. Talk to me and I'll remix your voice!" },
  ]);
  const [isTalking, setIsTalking] = useState(false);
  const [mood, setMood] = useState('idle');
  const endRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      setMood('blink');
      setTimeout(()=> setMood('idle'), 140);
    }, 2600 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const pushMessage = (m) => setMessages((prev) => [...prev, m]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-50 text-neutral-900">
      <Header />

      <div className="relative">
        <HeroScene />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <section className="flex flex-col items-center gap-6">
          <div className={`transition-transform duration-200 ${isTalking ? 'scale-105' : 'scale-100'}`}>
            <CatAvatar mood={mood} mouthOpen={isTalking} />
          </div>
          <p className="text-sm text-neutral-600 text-center max-w-sm">Say hello and I'll echo it back in a playful techno voice.</p>
          <VoiceControls onMessage={pushMessage} onTalkingChange={setIsTalking} />
        </section>

        <section className="space-y-4">
          <div className="p-5 rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur h-[420px] overflow-y-auto">
            <div className="space-y-3">
              {messages.map((m, i) => (
                <ChatBubble key={i} from={m.from} text={m.text} />
              ))}
              <div ref={endRef} />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur">
            <h3 className="font-semibold mb-2">Tips</h3>
            <ul className="text-sm text-neutral-700 list-disc pl-5 space-y-1">
              <li>Grant mic permission when prompted.</li>
              <li>Try adjusting the pitch slider for squeaky or deep cat vibes.</li>
              <li>If speech recognition isn’t available, you can still record and play back.</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-xs text-neutral-500">
        Built for fun — best experienced on Chrome/Edge with microphone enabled.
      </footer>
    </div>
  );
}

export default App;
