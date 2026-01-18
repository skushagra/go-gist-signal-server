"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-[system-ui] overflow-hidden">
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center px-8">
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

        {/* Interactive glow that follows mouse */}
        <div
          className="pointer-events-none absolute w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-500 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
          }}
        />

        {/* Static center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px] animate-pulse" />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 text-center animate-[fadeIn_0.6s_ease-out]">
          <div className="flex items-center gap-3 text-xs font-medium tracking-[0.3em] uppercase text-neutral-500 animate-[slideDown_0.8s_ease-out]">
            <span className="h-px w-8 bg-neutral-700 animate-[expandWidth_1s_ease-out]" />
            <span>Signaling Server</span>
            <span className="h-px w-8 bg-neutral-700 animate-[expandWidth_1s_ease-out]" />
          </div>

          <h1
            className="text-8xl md:text-[12rem] font-normal tracking-wide pb-4 cursor-default transition-all duration-300 hover:scale-[1.02]"
            style={{
              fontFamily: 'var(--font-rubik-storm)',
              lineHeight: '1.2',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 20px rgba(255,255,255,0.1))',
            }}
          >
            Signal
          </h1>

          {/* Matte edge shine effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[400px] h-[120px] bg-gradient-to-b from-white/[0.08] via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

          <p className="max-w-lg text-base font-light leading-relaxed text-neutral-500 tracking-wide animate-[fadeIn_1s_ease-out_0.3s_both]">
            WebRTC signaling made simple. Create sessions, exchange offers, and connect peers in real-time.
          </p>

          <div className="mt-4 flex items-center gap-4 animate-[fadeIn_1s_ease-out_0.5s_both]">
            <a
              className="group relative flex items-center gap-2 rounded-full border border-neutral-800 bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden"
              href="https://github.com/skushagra/go-gist-signal-server"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Button shine effect on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="relative">View on GitHub</span>
              <svg className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Connection lines animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute w-full h-full opacity-20">
            <line
              x1="10%" y1="30%" x2="25%" y2="45%"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              className="animate-[drawLine_3s_ease-in-out_infinite]"
            />
            <line
              x1="75%" y1="25%" x2="90%" y2="40%"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              className="animate-[drawLine_3s_ease-in-out_infinite_0.5s]"
            />
            <line
              x1="80%" y1="60%" x2="95%" y2="75%"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              className="animate-[drawLine_3s_ease-in-out_infinite_1s]"
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="white" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <footer className="absolute bottom-8 flex items-center gap-2 text-xs font-medium tracking-wider text-neutral-600 animate-[fadeIn_1s_ease-out_0.7s_both]">
          <span>Built by</span>
          <span className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-default">Kushagra</span>
        </footer>
      </main>
    </div>
  );
}
