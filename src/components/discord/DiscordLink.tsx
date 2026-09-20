import { useState } from 'react';
import { useHasHover } from '../../hooks/useHasHover';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const DISCORD_URL = 'https://discord.com/invite/UTEmgnDHHq';

/**
 * Top-left Discord entry point — a single lightweight, CSS-animated
 * element (no canvas/WebGL/particles/physics) that echoes the world's
 * glass/glow language without competing with the character
 * composition.
 *
 * Idle: a slow breathing float on the artwork + a gently pulsing glow
 * behind it (transform-only keyframes, so it's cheap and never touches
 * layout). Hover/focus: a touch more glow, a small lift, and a
 * tooltip. Touch devices don't get hover, so instead of hiding the
 * affordance behind a gesture they never trigger, a small persistent
 * "Discord" label sits under the icon — the tap itself is a plain
 * anchor navigation, no extra JS required.
 */
export function DiscordLink() {
  const hasHover = useHasHover();
  const reducedMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={DISCORD_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Join our Discord"
      className="fixed left-4 top-4 z-30 flex flex-col items-center outline-none sm:left-6 sm:top-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <span
        className="relative block"
        style={{
          width: 'clamp(76px, 10vw, 136px)',
          animation: reducedMotion ? 'none' : 'discordFloat 6.5s ease-in-out infinite',
        }}
      >
        {/* soft glow, behind the artwork — pulses gently on its own,
            brightens further on hover/focus */}
        <span
          aria-hidden="true"
          className="absolute inset-[-35%] rounded-full blur-2xl transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle, rgba(114,137,218,0.55) 0%, rgba(127,226,255,0.28) 55%, transparent 75%)',
            opacity: hovered ? 0.9 : 0.45,
            animation: reducedMotion ? 'none' : 'discordGlowPulse 6.5s ease-in-out infinite',
          }}
        />

        <img
          src="/social/discord-cat.png"
          alt=""
          draggable={false}
          className="relative w-full select-none transition-transform duration-500 ease-out"
          style={{
            transform: hovered ? 'scale(1.05) translateY(-2px)' : 'scale(1) translateY(0)',
            filter: hovered
              ? 'drop-shadow(0 6px 18px rgba(114,137,218,0.45))'
              : 'drop-shadow(0 3px 10px rgba(6,15,24,0.5))',
          }}
        />
      </span>

      {/* Desktop: tooltip that only appears on hover/focus. Touch: a
          small always-visible label instead, since there's no hover
          to reveal it with. */}
      {hasHover ? (
        <span
          aria-hidden="true"
          className="pointer-events-none mt-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-[var(--text-secondary)] transition-all duration-300"
          style={{
            background: 'rgba(6,15,24,0.85)',
            border: '1px solid rgba(143,214,255,0.25)',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(-3px)',
          }}
        >
          Join our Discord
        </span>
      ) : (
        <span
          className="mt-1 rounded-full px-2 py-0.5 text-[0.6rem] font-medium tracking-wide text-[var(--text-secondary)]"
          style={{
            background: 'rgba(6,15,24,0.55)',
            border: '1px solid rgba(143,214,255,0.18)',
          }}
        >
          Discord
        </span>
      )}
    </a>
  );
}
