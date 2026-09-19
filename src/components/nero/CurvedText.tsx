interface CurvedTextProps {
  text: string;
  color: string;
  fontSize?: number;
  /** 'up' bulges the arc upward (text sits on top, like character names); 'down' mirrors it beneath. */
  direction: 'up' | 'down';
  width?: number;
  glow?: boolean;
}

/**
 * Same shallow-arc language as CurvedName, generalized for Nero's own
 * title/tagline. Kept as a separate small component rather than
 * reworking CurvedName itself, so the character system stays untouched.
 */
export function CurvedText({
  text,
  color,
  fontSize = 22,
  direction,
  width = 260,
  glow = true,
}: CurvedTextProps) {
  const pathId = `curved-${direction}-${text.replace(/\s+/g, '-').toLowerCase()}`;
  const d =
    direction === 'up'
      ? `M 16 46 Q ${width / 2} 8 ${width - 16} 46`
      : `M 16 10 Q ${width / 2} 48 ${width - 16} 10`;

  return (
    <svg viewBox={`0 0 ${width} 56`} className="pointer-events-none overflow-visible" style={{ width }} aria-hidden="true">
      <path id={pathId} d={d} fill="none" />
      <text
        className="font-display"
        fontSize={fontSize}
        letterSpacing="1"
        textAnchor="middle"
        style={{
          fill: color,
          filter: glow ? `drop-shadow(0 0 6px ${color}99)` : undefined,
        }}
      >
        <textPath href={`#${pathId}`} startOffset="50%">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
