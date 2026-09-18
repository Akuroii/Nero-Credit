import { motion, AnimatePresence } from 'framer-motion';

interface TitleRevealProps {
  role: string;
  accent: string;
  visible: boolean;
}

export function TitleReveal({ role, accent, visible }: TitleRevealProps) {
  return (
    <div className="pointer-events-none flex h-6 items-start justify-center">
      <AnimatePresence>
        {visible && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="whitespace-nowrap rounded-full px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em]"
            style={{
              color: accent,
              background: `${accent}1a`,
              border: `1px solid ${accent}40`,
            }}
          >
            {role}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
