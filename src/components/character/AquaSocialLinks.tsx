import { motion } from 'framer-motion';
import { useState } from 'react';
import type { SocialLink } from '../../data/characters';
import { SocialGlyph } from './SocialGlyphs';

interface AquaSocialLinksProps {
  socials: SocialLink[];
  accent: string;
  open: boolean;
  /** Radius the icons burst out to, in px */
  radius: number;
}

/**
 * Adapted from the Circle Menu's interaction language: items sit
 * collapsed at the center by default and spring outward to points on
 * an arc when opened, staggered per index, with a blur→sharp fade
 * matching the reference's icon-swap treatment. Unlike the original
 * component, there's no separate trigger button — Aqua's own orb
 * *is* the trigger, since she's already a hoverable character; adding
 * a second button on top of her would compete with that interaction
 * rather than feel integrated with it.
 *
 * The arc is a downward fan (not a full circle) so it opens away from
 * the name/orb/title stack above it instead of overlapping them.
 */
export function AquaSocialLinks({ socials, accent, open, radius }: AquaSocialLinksProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const n = socials.length;

  return (
    <div
      className="pointer-events-none relative"
      style={{ width: radius * 2, height: radius + 46 }}
    >
      {socials.map((social, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const angleDeg = -62 + t * 124; // fan spanning ~124° below center
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = radius * Math.sin(angleRad);
        const y = radius * Math.cos(angleRad);
        const isHovered = hoveredId === social.id;

        return (
          <motion.a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
            className="pointer-events-auto absolute left-1/2 top-0 flex items-center justify-center rounded-full"
            style={{
              width: 46,
              height: 46,
              marginLeft: -23,
              color: 'var(--text-primary)',
              background: 'rgba(255,255,255,0.07)',
              border: `1px solid ${accent}55`,
              backdropFilter: 'blur(4px)',
            }}
            initial={false}
            animate={{
              x: open ? x : 0,
              y: open ? y : 0,
              opacity: open ? 1 : 0,
              scale: open ? (isHovered ? 1.18 : 1) : 0.4,
              filter: open ? 'blur(0px)' : 'blur(6px)',
            }}
            whileHover={{ scale: 1.18 }}
            transition={{
              delay: open ? i * 0.025 : (n - i) * 0.015,
              type: 'spring',
              stiffness: 320,
              damping: 26,
            }}
            onMouseEnter={() => setHoveredId(social.id)}
            onMouseLeave={() => setHoveredId(null)}
            tabIndex={open ? 0 : -1}
          >
            <SocialGlyph id={social.id} className="h-5 w-5" />
            {isHovered && (
              <span
                className="absolute top-full mt-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.6rem] font-medium tracking-wide"
                style={{ background: 'rgba(6,15,24,0.85)', color: accent }}
              >
                {social.label}
              </span>
            )}
          </motion.a>
        );
      })}
    </div>
  );
}
