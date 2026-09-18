import { forwardRef } from 'react';
import type { Character } from '../../data/characters';

interface CharacterBubbleProps {
  character: Character;
  size: number;
  active?: boolean;
}

/**
 * Renders the provided ring artwork + avatar together. The ring PNG
 * is the authoritative glassy-bubble frame; the avatar is layered
 * inside it and normalized via `displayScale`. Nothing here redraws
 * or recolors the source art — accent glow is applied as a separate
 * drop-shadow/box-shadow layer behind it.
 */
export const CharacterBubble = forwardRef<HTMLDivElement, CharacterBubbleProps>(
  ({ character, size, active }, ref) => {
    return (
      <div
        ref={ref}
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* ambient glow, tinted per-character, sits behind everything */}
        <div
          className="absolute inset-0 rounded-full blur-2xl transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${character.accent} 0%, transparent 72%)`,
            opacity: active ? 0.55 : 0.28,
          }}
        />

        {/* avatar, clipped to a circle, normalized to fill the bubble consistently */}
        <div className="absolute inset-[12%] overflow-hidden rounded-full">
          <img
            src={character.avatar}
            alt=""
            draggable={false}
            className="absolute left-1/2 top-1/2 h-full w-full object-contain select-none"
            style={{
              transform: `translate(-50%, -50%) scale(${character.displayScale})`,
            }}
          />
        </div>

        {/* the provided glassy ring frame, on top */}
        <img
          src="/avatars/bubble-ring.png"
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none"
          style={{
            filter: active
              ? 'drop-shadow(0 0 18px rgba(255,255,255,0.35))'
              : 'drop-shadow(0 0 6px rgba(255,255,255,0.12))',
            transition: 'filter 400ms ease',
          }}
        />
      </div>
    );
  },
);

CharacterBubble.displayName = 'CharacterBubble';
