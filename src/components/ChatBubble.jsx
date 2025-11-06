import React from 'react';

export default function ChatBubble({ from = 'cat', text }) {
  const isCat = from === 'cat';
  return (
    <div className={`w-full flex ${isCat ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isCat
            ? 'bg-white/80 backdrop-blur border border-white/60 text-neutral-800 rounded-tl-sm'
            : 'bg-indigo-600 text-white rounded-tr-sm'
        }`}
      >
        {text}
      </div>
    </div>
  );
}
