import { useEffect, useState } from 'react';

/**
 * A real, persistent visitor counter.
 *
 * This project is a static frontend with no backend/API/database of
 * its own (Vite + React, deployed as static files — see package.json/
 * vite.config.ts), so there's nowhere for a first-party counter to
 * live. Inventing a fake one (a number that just increments in
 * localStorage, or a hardcoded figure) would not be a real count —
 * every visitor would see their own private tally, or a number that
 * never actually reflects traffic.
 *
 * Instead this calls a small, free, keyless public counting API
 * (countapi — the open, no-signup, no-API-key successor to the now
 * shut-down countapi.xyz) that does exactly one thing: given a key,
 * "hit" it and hand back the new persistent total. No account, no
 * config, no server of our own required.
 *
 * That's also this approach's one honest caveat: it's a small
 * community service, not something we control, so a minority of
 * visitors running strict ad/privacy blockers that filter
 * counter-style domains may not register (the count will simply be a
 * slight undercount for them, never wrong in the other direction) —
 * and if the request fails for any reason, the counter just quietly
 * doesn't render rather than showing a fake or stale number.
 */
const COUNTER_ENDPOINT_BASE = 'https://countapi.mileshilliard.com/api/v1';
const COUNTER_KEY = 'nero-sama-credits-site';
const SESSION_FLAG = 'nero-visit-counted';

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Count each *visit* (browser session) once, not every render/page
    // navigation within it — otherwise a single person reloading the
    // page repeatedly would inflate "how many people have visited."
    let alreadyCountedThisSession = false;
    try {
      alreadyCountedThisSession = sessionStorage.getItem(SESSION_FLAG) === '1';
    } catch {
      // Private-browsing/storage-restricted contexts can throw on
      // access — fall back to "not counted yet" and just hit every
      // load in that rare case rather than breaking.
    }

    const url = alreadyCountedThisSession
      ? `${COUNTER_ENDPOINT_BASE}/get/${COUNTER_KEY}`
      : `${COUNTER_ENDPOINT_BASE}/hit/${COUNTER_KEY}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Counter request failed: ${res.status}`);
        return res.json();
      })
      .then((data: { value?: number }) => {
        if (cancelled) return;
        if (typeof data.value !== 'number') throw new Error('Unexpected counter response');
        setCount(data.value);
        if (!alreadyCountedThisSession) {
          try {
            sessionStorage.setItem(SESSION_FLAG, '1');
          } catch {
            // Non-fatal — worst case this tab's next reload counts again.
          }
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { count, failed };
}
