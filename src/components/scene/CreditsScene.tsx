import { useState } from 'react';
import { characters } from '../../data/characters';
import { CreditCharacter } from '../character/CreditCharacter';
import { NeroCore } from '../nero/NeroCore';
import { AtmosphericBackground } from './AtmosphericBackground';
import { useIsMobile } from '../../hooks/useViewport';

export function CreditsScene() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full">
      <AtmosphericBackground />

      <header className="relative z-10 flex flex-col items-center pt-14 pb-2 text-center">
        <h1 className="font-display text-3xl tracking-wide text-[var(--text-primary)] sm:text-4xl">
          Nero Sama
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          the world behind the bot
        </p>
      </header>

      <div className="relative mx-auto h-[900px] w-full max-w-[1100px] sm:h-[820px]">
        <div
          className="absolute left-1/2"
          style={{ top: isMobile ? '5%' : '4%', transform: 'translateX(-50%)' }}
        >
          <NeroCore size={isMobile ? 130 : 176} onActivate={() => setMenuOpen((v) => !v)} />
        </div>

        {characters.map((character) => (
          <CreditCharacter
            key={character.id}
            character={character}
            position={isMobile ? character.mobilePosition : character.position}
          />
        ))}
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/10 bg-[var(--dusk-800)] px-8 py-6 text-center">
            <p className="font-display text-lg text-[var(--text-primary)]">
              Nero Sama's menu
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              (radial navigation arrives in Phase 6)
            </p>
            <button
              onClick={() => setMenuOpen(false)}
              className="mt-4 rounded-full border border-white/15 px-4 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-white/5"
            >
              close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
