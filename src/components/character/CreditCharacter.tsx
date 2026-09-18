import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../../data/characters';
import { CharacterOrb } from './CharacterOrb';
import { CurvedName } from './CurvedName';
import { TitleReveal } from './TitleReveal';
import { useCharacterMotion } from '../../hooks/useCharacterMotion';
import { useEnergy } from '../energy/EnergyProvider';

interface CreditCharacterProps {
  character: Character;
  position: { x: number; y: number };
  reducedMotion: boolean;
}

export function CreditCharacter({ character, position, reducedMotion }: CreditCharacterProps) {
  const [active, setActive] = useState(false);
  const hitRef = useRef<HTMLButtonElement>(null);
  const { activeId, setActiveId, registerPosition } = useEnergy();

  const depthScale = 1 - character.depth * 0.26;
  const size = character.baseSize * depthScale;
  const hitSize = size * 1.35;

  const { springX, springY, floatStyle } = useCharacterMotion({
    ref: hitRef,
    motionSeed: character.motionSeed,
    reducedMotion,
    isActive: active,
  });

  const activate = () => {
    setActive(true);
    if (hitRef.current) {
      const r = hitRef.current.getBoundingClientRect();
      registerPosition(character.id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    setActiveId(character.id);
  };
  const deactivate = () => {
    setActive(false);
    if (activeId === character.id) setActiveId(null);
  };

  // Keep this character's position registered for the energy system even
  // when it isn't the active one (so it can be a valid *target*).
  useEffect(() => {
    const measure = () => {
      if (!hitRef.current) return;
      const r = hitRef.current.getBoundingClientRect();
      registerPosition(character.id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [character.id, registerPosition, position]);

  return (
    <div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: Math.round((1 - character.depth) * 100),
      }}
    >
      <motion.div style={{ x: springX, y: springY }}>
        <div style={floatStyle} className="float-layer">
          <button
            ref={hitRef}
            type="button"
            className="group relative flex cursor-pointer flex-col items-center rounded-full outline-none"
            style={{ width: hitSize, height: hitSize + 46 }}
            aria-label={`${character.name}, ${character.role}`}
            onMouseEnter={activate}
            onMouseLeave={deactivate}
            onFocus={activate}
            onBlur={deactivate}
            onTouchStart={activate}
          >
            <div style={{ width: size * 1.25, marginBottom: -6 }}>
              <CurvedName name={character.name} color={character.accent} active={active} />
            </div>

            <CharacterOrb
              character={character}
              size={size}
              active={active}
              reducedMotion={reducedMotion}
            />

            <div className="mt-2">
              <TitleReveal role={character.role} accent={character.accent} visible={active} />
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
