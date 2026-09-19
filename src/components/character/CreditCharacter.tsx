import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../../data/characters';
import { CharacterOrb } from './CharacterOrb';
import { CurvedName } from './CurvedName';
import { TitleReveal } from './TitleReveal';
import { AquaSocialLinks } from './AquaSocialLinks';
import { useCharacterMotion } from '../../hooks/useCharacterMotion';
import { useHasHover } from '../../hooks/useHasHover';
import { useEnergy } from '../energy/EnergyProvider';

interface CreditCharacterProps {
  character: Character;
  position: { x: number; y: number };
  reducedMotion: boolean;
}

export function CreditCharacter({ character, position, reducedMotion }: CreditCharacterProps) {
  const [active, setActive] = useState(false);
  const [pinned, setPinned] = useState(false); // Aqua-only, touch-only: tap-toggle for the social menu
  const hitRef = useRef<HTMLButtonElement>(null);
  const { activeId, setActiveId, registerPosition } = useEnergy();
  const hasHover = useHasHover();

  const depthScale = 1 - character.depth * 0.26;
  const size = character.baseSize * depthScale;
  const hitSize = size * 1.32;
  const hasSocials = !!character.socials?.length;

  const { springX, springY, floatStyle } = useCharacterMotion({
    ref: hitRef,
    motionSeed: character.motionSeed,
    reducedMotion,
    isActive: active,
  });

  // Large hit area: this is the character's main clickable/interactive
  // area (title reveal, orb glow, floating pause). Kept generous —
  // never shrunk for the sake of the relationship effect.
  const activate = () => setActive(true);
  const deactivate = () => setActive(false);

  // On touch devices, Aqua's social menu is a tap-toggle (open on first
  // tap, close on second) rather than press-and-hold — everything else,
  // and Aqua herself on hover-capable devices, keeps the hover behavior.
  const handleClick = () => {
    if (hasSocials && !hasHover) setPinned((v) => !v);
  };

  const socialOpen = hasSocials && (hasHover ? active : pinned);
  // The name/orb/title "engaged" look follows the same rule, so Aqua's
  // whole card reads as open while her pinned social menu is showing.
  const visuallyActive = active || (hasSocials && !hasHover && pinned);

  // Relationship energy trigger: deliberately a *tighter* area (roughly
  // the orb itself, via energyRef below) so hovering the padded margin
  // around a character doesn't light up connections — only actually
  // engaging the character does. Uses Pointer Events so mouse hover and
  // touch press/release are both handled by the same, reliable pair of
  // handlers instead of separate mouse/touch listeners that can miss
  // each other when the element is mid-float/repel.
  const activateEnergy = () => {
    if (hitRef.current) {
      const r = hitRef.current.getBoundingClientRect();
      registerPosition(character.id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    setActiveId(character.id);
  };
  const deactivateEnergy = () => {
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
            style={{
              width: hasSocials ? size * 1.12 * 2 : hitSize,
              height: hitSize + 44 + (hasSocials ? size * 0.68 + 46 : 0),
              paddingTop: 14,
            }}
            aria-label={`${character.name}, ${character.role}`}
            onMouseEnter={activate}
            onMouseLeave={deactivate}
            onFocus={activate}
            onBlur={deactivate}
            onTouchStart={activate}
            onTouchEnd={deactivate}
            onTouchCancel={deactivate}
            onClick={handleClick}
          >
            <div style={{ width: size * 1.18, marginBottom: size * 0.035 }}>
              <CurvedName name={character.name} color={character.accent} active={visuallyActive} />
            </div>

            <div className="relative" style={{ width: size, height: size }}>
              {/* The WebGL canvas inside CharacterOrb installs its own
                  internal pointer-event system (for raycasting support),
                  which can swallow/intercept pointerenter/leave before
                  they reach our handlers — the likely cause of energy
                  sometimes failing to deactivate. Fix: make the orb
                  itself inert to pointer events and use a transparent
                  overlay on top purely for the energy trigger, so the
                  canvas never sees pointer events at all. */}
              <div style={{ pointerEvents: 'none' }}>
                <CharacterOrb
                  character={character}
                  size={size}
                  active={visuallyActive}
                  reducedMotion={reducedMotion}
                />
              </div>
              <div
                className="absolute inset-0 rounded-full"
                style={{ pointerEvents: 'auto' }}
                onPointerEnter={activateEnergy}
                onPointerLeave={deactivateEnergy}
                onPointerDown={activateEnergy}
                onPointerUp={deactivateEnergy}
                onPointerCancel={deactivateEnergy}
              />
            </div>

            <div className="mt-2">
              <TitleReveal role={character.role} accent={character.accent} visible={visuallyActive} />
            </div>

            {hasSocials && (
              <AquaSocialLinks
                socials={character.socials!}
                accent={character.accent}
                open={socialOpen}
                radius={size * 0.68}
              />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
