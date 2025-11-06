import React from 'react';

export default function CatAvatar({ mood = 'idle', mouthOpen = false }) {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[320px] aspect-square select-none">
      {/* Ears */}
      <div className="absolute -top-6 left-8 w-16 h-16 bg-purple-300 rotate-45 rounded-tl-[18px] rounded-br-[18px] shadow-inner shadow-purple-700/10"></div>
      <div className="absolute -top-6 right-8 w-16 h-16 bg-purple-300 -rotate-45 rounded-tr-[18px] rounded-bl-[18px] shadow-inner shadow-purple-700/10"></div>

      {/* Head */}
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 shadow-xl border border-white/40" />

      {/* Eyes */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex gap-8">
        <Eye blink={mood === 'blink'} />
        <Eye blink={mood === 'blink'} />
      </div>

      {/* Nose */}
      <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-6 h-4 bg-pink-300 rounded-b-full shadow-inner shadow-pink-500/20"></div>

      {/* Whiskers */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-48 flex justify-between text-purple-600/40">
        <Whisker side="left" />
        <Whisker side="right" />
      </div>

      {/* Mouth */}
      {mouthOpen ? (
        <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-24 h-16 bg-purple-700 rounded-b-3xl rounded-t-lg overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-rose-400 rounded-t-full" />
        </div>
      ) : (
        <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-16 h-2 bg-purple-700 rounded-full" />
      )}
    </div>
  );
}

function Eye({ blink }) {
  return (
    <div className="relative w-8 h-8">
      <div className={`absolute inset-0 bg-white rounded-full border border-purple-600/20 ${blink ? 'scale-y-0 transition-transform duration-150' : ''}`}></div>
      <div className="absolute inset-0 grid place-items-center">
        <div className="w-3 h-3 bg-purple-700 rounded-full"></div>
      </div>
    </div>
  );
}

function Whisker({ side }) {
  return (
    <div className={`flex ${side === 'left' ? 'flex-row-reverse' : ''} gap-1 items-center` }>
      <span className="block w-10 h-[2px] bg-purple-700/40" />
      <span className="block w-12 h-[2px] bg-purple-700/40" />
      <span className="block w-9 h-[2px] bg-purple-700/40" />
    </div>
  );
}
