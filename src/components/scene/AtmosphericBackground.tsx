import { useMemo } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Dreamy deep-water atmosphere: soft cyan/blue wash, slow drifting
 * caustic light, and rising bubbles instead of the previous
 * violet-dust "magical void" — per the updated aquatic direction.
 * Kept deliberately restrained so it never competes with the
 * character orbs sitting in front of it.
 */

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  wobble: number;
}

function generateBubbles(count: number): Bubble[] {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand() * 100,
    size: 3 + rand() * 7,
    duration: 16 + rand() * 20,
    delay: -rand() * 30,
    opacity: 0.1 + rand() * 0.28,
    wobble: 6 + rand() * 10,
  }));
}

export function AtmosphericBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const bubbles = useMemo(() => generateBubbles(reducedMotion ? 0 : 34), [reducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--void-950)]">
      {/* deep-water base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 65% at 50% 0%, #122c3e 0%, #0d2130 45%, #060f18 100%)',
        }}
      />

      {/* large slow-drifting glow fields, cyan/teal/blue */}
      <div
        className="absolute -left-1/4 top-[-8%] h-[68vh] w-[68vh] rounded-full opacity-[0.16] blur-[120px]"
        style={{
          background: 'radial-gradient(circle, var(--glow-cyan) 0%, transparent 70%)',
          animation: reducedMotion ? 'none' : 'driftA 50s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[-15%] top-[22%] h-[58vh] w-[58vh] rounded-full opacity-[0.13] blur-[130px]"
        style={{
          background: 'radial-gradient(circle, var(--glow-teal) 0%, transparent 70%)',
          animation: reducedMotion ? 'none' : 'driftB 58s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-18%] left-[22%] h-[52vh] w-[52vh] rounded-full opacity-[0.12] blur-[110px]"
        style={{
          background: 'radial-gradient(circle, var(--glow-violet) 0%, transparent 70%)',
          animation: reducedMotion ? 'none' : 'driftC 64s ease-in-out infinite',
        }}
      />

      {/* caustic light: soft moving bands, evoking underwater light without literal waves */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, transparent 0 40px, rgba(127,226,255,0.5) 40px 42px, transparent 42px 90px)',
          animation: reducedMotion ? 'none' : 'causticDrift 22s linear infinite',
        }}
      />

      {/* vignette to keep focus centered */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 90% at 50% 45%, transparent 40%, #060f18 100%)',
        }}
      />

      {/* faint grain */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* rising bubbles */}
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="absolute rounded-full will-transform"
          style={{
            left: `${b.x}%`,
            bottom: '-5%',
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(180,230,255,0.15) 60%, transparent 75%)',
            boxShadow: '0 0 6px rgba(200,240,255,0.4)',
            animation: `bubbleRise ${b.duration}s linear ${b.delay}s infinite`,
            ['--wobble' as string]: `${b.wobble}px`,
          }}
        />
      ))}

      <style>{`
        @keyframes driftA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4%, 5%) scale(1.07); }
        }
        @keyframes driftB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-5%, 4%) scale(1.05); }
        }
        @keyframes driftC {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(3%, -4%) scale(1.08); }
        }
        @keyframes causticDrift {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-120px) translateY(-40px); }
        }
        @keyframes bubbleRise {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translate(var(--wobble), -55vh); }
          90% { opacity: 0.6; }
          100% { transform: translate(0, -110vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
