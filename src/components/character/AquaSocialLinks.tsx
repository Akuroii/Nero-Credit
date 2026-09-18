import { AnimatePresence, motion } from 'framer-motion';
import type { SocialLink } from '../../data/characters';
import { SocialGlyph } from './SocialGlyphs';

interface AquaSocialLinksProps {
  socials: SocialLink[];
  accent: string;
  visible: boolean;
}

/**
 * Renders as part of Aqua's own hover interaction (same reveal moment
 * as the title, just below it) rather than a persistent row of icons
 * on the page. Each link is a real <a> once `url` is populated; until
 * then it's a non-navigating, clearly-disabled placeholder so nothing
 * points to a dead/empty href in the meantime.
 */
export function AquaSocialLinks({ socials, accent, visible }: AquaSocialLinksProps) {
  return (
    <div className="pointer-events-none flex h-9 items-start justify-center">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full px-2 py-1.5 backdrop-blur-sm"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${accent}30`,
            }}
          >
            {socials.map((social, i) => {
              const isLive = social.url.length > 0;
              return (
                <motion.a
                  key={social.id}
                  href={isLive ? social.url : undefined}
                  target={isLive ? '_blank' : undefined}
                  rel={isLive ? 'noreferrer' : undefined}
                  aria-disabled={!isLive}
                  aria-label={isLive ? social.label : `${social.label} (coming soon)`}
                  title={isLive ? social.label : `${social.label} — coming soon`}
                  onClick={(e) => {
                    if (!isLive) e.preventDefault();
                  }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: isLive ? 1 : 0.4, scale: 1 }}
                  transition={{ delay: 0.05 + i * 0.03, duration: 0.2 }}
                  whileHover={isLive ? { scale: 1.15 } : undefined}
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{
                    color: 'var(--text-primary)',
                    cursor: isLive ? 'pointer' : 'default',
                  }}
                >
                  <SocialGlyph id={social.id} className="h-3.5 w-3.5" />
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
