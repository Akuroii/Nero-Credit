import { characters, SIZE_SCALE } from '../../data/characters';
import { CreditCharacter } from '../character/CreditCharacter';
import { NeroCore } from '../nero/NeroCore';
import { CurvedText } from '../nero/CurvedText';
import { AtmosphericBackground } from './AtmosphericBackground';
import { PointerFieldProvider } from './PointerFieldProvider';
import { EnergyProvider } from '../energy/EnergyProvider';
import { EnergyField } from '../energy/EnergyField';
import { DiscordLink } from '../discord/DiscordLink';
import { VisitorCounter } from './VisitorCounter';
import { useIsMobile } from '../../hooks/useViewport';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

// Composition canvas size, keyed to the same isMobile breakpoint that
// drives which position set (`position` vs `mobilePosition`) is used
// below — previously this was set via a Tailwind `sm:` (640px) class
// while the layout itself switched at 768px, so the 640–767px band
// rendered the stacked mobile composition inside the shorter desktop
// canvas. Driving both from one JS value keeps them in sync.
const DESKTOP_CANVAS_HEIGHT = 880;
const MOBILE_CANVAS_HEIGHT = 1220;

export function CreditsScene() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const neroSize = Math.round((isMobile ? 120 : 150) * SIZE_SCALE);
  const canvasHeight = isMobile ? MOBILE_CANVAS_HEIGHT : DESKTOP_CANVAS_HEIGHT;

  return (
    <PointerFieldProvider>
      <EnergyProvider>
        <div className="relative min-h-screen w-full">
          <AtmosphericBackground />
          <EnergyField reducedMotion={reducedMotion} />
          <DiscordLink />
          <VisitorCounter />

          {/* Real text for accessibility/SEO; the visible title lives on
              the curved arcs around Nero's own image below. */}
          <h1 className="sr-only">Nero Sama</h1>
          <p className="sr-only">The world behind the bot</p>

          {/* Framing wrapper: centers the composition in the viewport and
              keeps it off the top/bottom edges on every screen size. On
              tall viewports (typical desktop) the flex centering gives
              equal breathing room above and below; on short ones (and on
              the tall mobile stack, which usually exceeds the viewport)
              it simply guarantees the padding on both ends as the page
              scrolls, instead of the composition starting flush at y=0. */}
          <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-14 md:py-24">
            <div
              className="relative mx-auto w-full max-w-[1150px]"
              style={{ height: canvasHeight }}
            >
              <div
                className="absolute left-1/2 flex flex-col items-center"
                style={{ top: '2%', transform: 'translateX(-50%)' }}
                aria-hidden="true"
              >
                <CurvedText
                  text="Nero Sama"
                  color="var(--text-primary)"
                  direction="up"
                  width={neroSize * 1.7}
                  fontSize={neroSize * 0.16}
                />
                <div style={{ marginTop: -neroSize * 0.12 }}>
                  <NeroCore size={neroSize} />
                </div>
                <CurvedText
                  text="The World Behind The Bot"
                  color="var(--text-secondary)"
                  direction="down"
                  width={neroSize * 2.1}
                  fontSize={neroSize * 0.09}
                  glow={false}
                />
              </div>

              {characters.map((character) => (
                <CreditCharacter
                  key={character.id}
                  character={character}
                  position={isMobile ? character.mobilePosition : character.position}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </EnergyProvider>
    </PointerFieldProvider>
  );
}
