import { useCallback, useRef } from 'react';

const NERO_SOUND_SRC = '/audio/nero-meow.mp3';

/**
 * Nero's hover/click sound.
 *
 * Browsers restrict audio playback that isn't tied to a user gesture.
 * A `mouseenter` or `click` handler counts as a gesture in effectively
 * every browser, but some (Safari in particular, and some in-app mobile
 * browsers) are stricter still, and calling `.play()` on an element
 * that's already mid-playback — e.g. rapid re-hover — can also reject.
 * Both cases are handled the same way: swallow the rejection and do
 * nothing. Worst case that one trigger is silent; the page never
 * breaks or logs an unhandled rejection.
 *
 * The <audio> element itself is created lazily, on first actual
 * trigger (inside the gesture handler) rather than on mount — the
 * safest pattern for autoplay policies, and it means nothing loads or
 * exists until Nero is actually interacted with.
 */
export function useNeroSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      const el = new Audio(NERO_SOUND_SRC);
      el.preload = 'auto';
      el.volume = 0.6;
      audioRef.current = el;
    }

    const audio = audioRef.current;
    try {
      // Restart from the top so a quick re-hover/re-click retriggers
      // the sound instead of doing nothing (or overlapping oddly).
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Autoplay/user-interaction restrictions — fail silently.
        });
      }
    } catch {
      // Defensive: a few browsers can throw synchronously instead of
      // rejecting the promise. Never let audio break the page.
    }
  }, []);
}
