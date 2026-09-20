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

/**
 * Relationship energy — only ever rendered while a character is
 * actively engaged (`activeId` set by hover/touch on that character).
 *
 * Lifecycle, made deliberately unambiguous:
 *  - The list of links is empty whenever nothing is active, so there is
 *    nothing here for React to keep alive or for the browser to keep
 *    ticking — no interaction, no elements, no animation frames.
 *  - Each relationship is exactly one `motion.g` — the single, direct
 *    AnimatePresence child — so enter/exit is unambiguous: it fades in
 *    on mount and fades out on removal via its own explicit, short
 *    (‑0.3s) transition, fully decoupled from the looping travel
 *    animation inside it. There's no way for the loop's `repeat:
 *    Infinity` timing to leak into (or stall) the exit.
 *  - The traveling dots themselves are driven by a plain CSS
 *    `@keyframes` animation (`energyTravel`, in index.css) rather than
 *    a JS-ticked Framer Motion loop — cheaper while running, and when
 *    the parent unmounts the animation simply stops existing with it.
 *    Nothing keeps generating once the group is gone.
 */
export function EnergyField({ reducedMotion }: EnergyFieldProps) {
  const { activeId, getPosition } = useEnergy();

  const links = (() => {
    if (!activeId || reducedMotion) return [];
    const from = getPosition(activeId);
    if (!from) return [];
    const character = getCharacter(activeId);
    return character.connections
      .map((targetId: CharacterId) => {
        const to = getPosition(targetId);
        if (!to) return null;
        const seed = pairSeed(activeId, targetId);
        const { d } = buildPath(from.x, from.y, to.x, to.y, seed);
        return { id: `${activeId}-${targetId}`, d, accent: getCharacter(targetId).accent };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);
  })();

  return (
    <svg className="pointer-events-none fixed inset-0 z-40 h-full w-full" aria-hidden="true">
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
          <motion.g
            key={link.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* faint guiding path, barely visible — the traveling dot carries the effect */}
            <path d={link.d} fill="none" stroke={link.accent} strokeWidth={1} strokeOpacity={0.14} />
            {[0, 0.65].map((delay) => (
              <circle
                key={delay}
                r={3.5}
                fill={link.accent}
                filter="url(#energy-glow)"
                style={{
                  offsetPath: `path("${link.d}")`,
                  animation: `energyTravel 1.3s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
          </motion.g>
        ))}
      </AnimatePresence>
    </svg>
  );
}
