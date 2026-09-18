import type { Character } from '../../data/characters';
import { CharacterBubble } from './CharacterBubble';
import { CharacterLabel } from './CharacterLabel';

interface CreditCharacterProps {
  character: Character;
  position: { x: number; y: number };
}

/**
 * Depth (0 = foreground) scales size and slightly reduces opacity/
 * blur to suggest atmospheric distance — a cheap, GPU-friendly way
 * to get real spatial depth from a flat composition.
 */
export function CreditCharacter({ character, position }: CreditCharacterProps) {
  const depthScale = 1 - character.depth * 0.28;
  const size = character.baseSize * depthScale;

  return (
    <div
      className="absolute flex flex-col items-center gap-3"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: Math.round((1 - character.depth) * 100),
      }}
    >
      <CharacterBubble character={character} size={size} />
      <CharacterLabel character={character} />
    </div>
  );
}
