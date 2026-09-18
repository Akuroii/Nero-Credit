import type { Character } from '../../data/characters';

interface CharacterLabelProps {
  character: Character;
  active?: boolean;
}

export function CharacterLabel({ character, active }: CharacterLabelProps) {
  return (
    <div
      className="pointer-events-none flex flex-col items-center text-center transition-transform duration-400"
      style={{ transform: active ? 'translateY(-2px) scale(1.04)' : 'translateY(0) scale(1)' }}
    >
      <span
        className="font-display text-[1.05rem] leading-none text-[var(--text-primary)]"
        style={{
          textShadow: active
            ? `0 0 16px ${character.accent}, 0 0 4px rgba(255,255,255,0.6)`
            : `0 0 10px ${character.accent}88`,
        }}
      >
        {character.name}
      </span>
      <span
        className="mt-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity duration-400"
        style={{
          color: 'var(--text-secondary)',
          opacity: active ? 1 : 0.72,
        }}
      >
        {character.role}
      </span>
    </div>
  );
}
