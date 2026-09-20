import { useVisitorCount } from '../../hooks/useVisitorCount';

/**
 * Small, quiet presence in the bottom-right corner — mirrors the
 * Discord link's corner treatment on the opposite side, at a much
 * lower visual weight since this is trivia, not a call to action.
 * Entirely static (no idle animation, no glow pulse): it's a fact
 * chip, not another living thing in the scene, and that also keeps it
 * free of any ongoing rendering cost while it just sits there.
 */
export function VisitorCounter() {
  const { count, failed } = useVisitorCount();

  // Real data only: while loading, show a quiet placeholder; if the
  // counter service couldn't be reached, render nothing at all rather
  // than a fake or stale number.
  if (failed) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-30 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.65rem] tracking-wide text-[var(--text-secondary)] opacity-0 backdrop-blur-sm transition-opacity duration-700 sm:bottom-6 sm:right-6 sm:text-xs"
      style={{
        background: 'rgba(6,15,24,0.55)',
        border: '1px solid rgba(143,214,255,0.16)',
        opacity: count === null ? 0 : 1,
      }}
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: 'var(--glow-cyan)',
          boxShadow: '0 0 6px var(--glow-cyan)',
        }}
      />
      <span>
        {count !== null ? count.toLocaleString() : '···'}{' '}
        <span className="text-[var(--text-muted)]">visitors</span>
      </span>
    </div>
  );
}
