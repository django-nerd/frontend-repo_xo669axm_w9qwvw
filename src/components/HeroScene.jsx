import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroScene() {
  return (
    <section className="relative w-full h-[360px] sm:h-[420px] lg:h-[520px] overflow-hidden rounded-b-3xl">
      <Spline
        scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      {/* soft gradient glow that never blocks interaction */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80" />
    </section>
  );
}
