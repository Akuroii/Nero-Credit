import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';

interface PointerFieldValue {
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** false when the pointer hasn't moved yet / is a touch device with no hover */
  active: MotionValue<number>;
}

const PointerFieldContext = createContext<PointerFieldValue | null>(null);

export function PointerFieldProvider({ children }: { children: ReactNode }) {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const active = useMotionValue(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // repel is a hover-only affordance
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);
        active.set(1);
      });
    };
    const onLeave = () => active.set(0);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [x, y, active]);

  return (
    <PointerFieldContext.Provider value={{ x, y, active }}>
      {children}
    </PointerFieldContext.Provider>
  );
}

export function usePointerField() {
  const ctx = useContext(PointerFieldContext);
  if (!ctx) throw new Error('usePointerField must be used within PointerFieldProvider');
  return ctx;
}
