import { useEffect, useState } from 'react';

const QUERY = '(hover: hover) and (pointer: fine)';

export function useHasHover(): boolean {
  const [hasHover, setHasHover] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const listener = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  return hasHover;
}
