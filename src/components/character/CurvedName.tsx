interface CurvedNameProps {
  name: string;
  color: string;
  active?: boolean;
  /** Multiplier on the base 24-unit text size. Defaults to 1 — the
   *  curve path, viewBox, and layout stay identical; only the glyph
   *  size changes. */
  fontScale?: number;
}

/**
 * A shallow arc (not a full semicircle — exaggerated curves hurt
 * legibility) sitting just above the ring. Uses a fixed viewBox so the
 * curve amount stays consistent regardless of the bubble's own size;
 * the parent controls final scale via its own width.
 */
export function CurvedName({ name, color, active, fontScale = 1 }: CurvedNameProps) {
  const pathId = `name-arc-${name.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <svg
      viewBox="0 0 220 46"
      className="pointer-events-none w-full overflow-visible"
      aria-hidden="true"
    >
      <path id={pathId} d="M 20 40 Q 110 18 200 40" fill="none" />
      <text
        className="font-display"
        fontSize={24 * fontScale}
        letterSpacing="0.5"
        textAnchor="middle"
        style={{
          fill: color,
          filter: active
            ? `drop-shadow(0 0 8px ${color})`
            : `drop-shadow(0 0 3px ${color}99)`,
          transition: 'filter 350ms ease',
        }}
      >
        <textPath href={`#${pathId}`} startOffset="50%">
          {name}
        </textPath>
      </text>
    </svg>
  );
}
