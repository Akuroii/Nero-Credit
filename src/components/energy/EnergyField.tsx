import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEnergy } from './EnergyProvider';
import { getCharacter, type CharacterId } from '../../data/characters';

/** Deterministic bow direction/amount per pair so it doesn't jitter frame to frame */
function pairSeed(a: string, b: string) {
  const s = [a, b].sort().join('|');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

function buildPath(x1: number, y1: number, x2: number, y2: number, seed: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  // perpendicular offset, bounded so the bow stays gentle
  const bow = Math.min(60, dist * 0.22) * (seed > 0.5 ? 1 : -1);
  const cx = mx + (-dy / dist) * bow;
  const cy = my + (dx / dist) * bow;
  return { d: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, dist };
}

interface EnergyFieldProps {
  reducedMotion: boolean;
}

export function EnergyField({ reducedMotion }: EnergyFieldProps) {
  const { activeId, getPosition } = useEnergy();

  const links = useMemo(() => {
    if (!activeId || reducedMotion) return [];
    const from = getPosition(activeId);
    if (!from) return [];
    const character = getCharacter(activeId);
    return character.connections
      .map((targetId: CharacterId) => {
        const to = getPosition(targetId);
        if (!to) return null;
        const seed = pairSeed(activeId, targetId);
        const { d, dist } = buildPath(from.x, from.y, to.x, to.y, seed);
        return { id: `${activeId}-${targetId}`, d, dist, accent: getCharacter(targetId).accent };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, reducedMotion]);

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id="energy-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <AnimatePresence>
        {links.map((link) => (
          <g key={link.id}>
            {/* faint guiding path, barely visible — the traveling dot carries the effect */}
            <motion.path
              d={link.d}
              fill="none"
              stroke={link.accent}
              strokeWidth={1}
              strokeOpacity={0.14}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            {[0, 0.5].map((delay) => (
              <motion.circle
                key={delay}
                r={3.5}
                fill={link.accent}
                filter="url(#energy-glow)"
                initial={{ opacity: 0 }}
                animate={{
                  offsetDistance: ['0%', '100%'],
                  opacity: [0, 1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  offsetDistance: {
                    duration: 1.3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: delay * 1.3,
                  },
                  opacity: {
                    duration: 1.3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: delay * 1.3,
                    times: [0, 0.15, 0.85, 1],
                  },
                }}
                style={{ offsetPath: `path("${link.d}")` }}
              />
            ))}
          </g>
        ))}
      </AnimatePresence>
    </svg>
  );
}
