import type { Character } from '../../data/characters';
import { GradientOrb } from '../ui/gradient-orb';

interface CharacterOrbProps {
  character: Character;
  size: number;
  active: boolean;
  reducedMotion: boolean;
}

/**
 * Layering, back to front:
 *  1. GradientOrb — the living shader glow, tinted per character
 *  2. Avatar — circular-masked, normalized via displayScale
 *  3. A thin glass rim — the one piece of the original bubble-ring
 *     treatment worth keeping once the orb itself carries the color;
 *     it reads as the "glass surface" catching the orb's light.
 */
export function CharacterOrb({ character, size, active, reducedMotion }: CharacterOrbProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute rounded-full overflow-hidden transition-transform duration-500"
        style={{
          inset: -size * 0.18,
          transform: active ? 'scale(1.06)' : 'scale(1)',
        }}
      >
        <GradientOrb
          config={{
            hue: character.orbHue,
            rotationSpeed: active ? 0.55 : 0.22,
            noiseScale: 0.7,
            innerRadius: 0.08,
          }}
          paused={reducedMotion}
        />
      </div>

      <div
        className="absolute overflow-hidden rounded-full"
        style={{ inset: size * 0.11 }}
      >
        <img
          src={character.avatar}
          alt=""
          draggable={false}
          className="absolute left-1/2 top-1/2 h-full w-full select-none object-contain"
          style={{ transform: `translate(-50%, -50%) scale(${character.displayScale})` }}
        />
      </div>

      <div
        className="absolute inset-0 rounded-full transition-all duration-500"
        style={{
          boxShadow: active
            ? 'inset 0 0 0 1.5px rgba(255,255,255,0.55), inset 0 -6px 14px rgba(255,255,255,0.12), 0 0 26px rgba(255,255,255,0.18)'
            : 'inset 0 0 0 1px rgba(255,255,255,0.28), inset 0 -4px 10px rgba(255,255,255,0.06)',
        }}
      />
    </div>
  );
}
