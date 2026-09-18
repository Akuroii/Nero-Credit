import { useMemo } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * The environment behind the characters. Intentionally restrained:
 * a couple of huge, slow, blurred glow fields to suggest depth and
 * magical presence, plus a sparse layer of drifting dust/star motes.
 * Nothing here should compete for attention with the character bubbles.
 */

interface Mote {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function generateMotes(count: number): Mote[] {
  // Deterministic pseudo-random so layout doesn't reshuffle on re-render
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand() * 100,
    y: rand() * 100,
    size: 1 + rand() * 2.4,
    duration: 14 + rand() * 18,
    delay: -rand() * 20,
    opacity: 0.15 + rand() * 0.35,
  }));
}

export function AtmosphericBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const motes = useMemo(() => generateMotes(reducedMotion ? 0 : 46), [reducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--void-950)]">
      {/* base gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, #241c3d 0%, #14102450 45%, #0e0b1a 100%)',
        }}
      />

      {/* large slow-drifting glow fields */}
      <div
        className="absolute -left-1/4 top-[-10%] h-[70vh] w-[70vh] rounded-full opacity-[0.16] blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, var(--glow-violet) 0%, transparent 70%)',
          animation: reducedMotion ? 'none' : 'driftA 46s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[-15%] top-[20%] h-[60vh] w-[60vh] rounded-full opacity-[0.14] blur-[130px]"
        style={{
          background: 'radial-gradient(circle, var(--glow-pink) 0%, transparent 70%)',
          animation: reducedMotion ? 'none' : 'driftB 54s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[25%] h-[55vh] w-[55vh] rounded-full opacity-[0.12] blur-[110px]"
        style={{
          background: 'radial-gradient(circle, var(--glow-cyan) 0%, transparent 70%)',
          animation: reducedMotion ? 'none' : 'driftC 60s ease-in-out infinite',
        }}
      />

      {/* subtle vignette to keep focus centered */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 90% at 50% 45%, transparent 40%, #0e0b1a 100%)',
        }}
      />

      {/* faint grain to avoid flat gradient banding */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* drifting dust motes */}
      {motes.map((m) => (
        <span
          key={m.id}
          className="absolute rounded-full bg-[var(--mist-200)] will-transform"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.size,
            height: m.size,
            opacity: m.opacity,
            animation: `moteFloat ${m.duration}s ease-in-out ${m.delay}s infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes driftA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4%, 6%) scale(1.08); }
        }
        @keyframes driftB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-5%, 4%) scale(1.05); }
        }
        @keyframes driftC {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(3%, -5%) scale(1.1); }
        }
        @keyframes moteFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(1.5vw, -2vh); }
        }
      `}</style>
    </div>
  );
}
