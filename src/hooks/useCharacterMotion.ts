import { useEffect, useRef, type RefObject, type CSSProperties } from 'react';
import { useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';
import { usePointerField } from '../components/scene/PointerFieldProvider';

interface UseCharacterMotionOptions {
  /** Element the repel distance is measured against */
  ref: RefObject<HTMLElement | null>;
  /** 0–1, staggers idle floating so characters never sync */
  motionSeed: number;
  /** Radius (px) at which repel starts */
  repelRadius?: number;
  /** Radius (px) at which repel fully relaxes — keeps the bubble easy to click */
  calmRadius?: number;
  /** Max repel displacement in px */
  repelStrength?: number;
  reducedMotion: boolean;
  /** True while hovered/focused — calms the idle float */
  isActive: boolean;
}

export function useCharacterMotion({
  ref,
  motionSeed,
  repelRadius = 140,
  calmRadius = 55,
  repelStrength = 22,
  reducedMotion,
  isActive,
}: UseCharacterMotionOptions) {
  const pointer = usePointerField();

  // Repel offset, spring-smoothed for organic settle-in/settle-out
  const repelX = useMotionValue(0);
  const repelY = useMotionValue(0);
  const springX = useSpring(repelX, { stiffness: 120, damping: 18, mass: 0.6 });
  const springY = useSpring(repelY, { stiffness: 120, damping: 18, mass: 0.6 });

  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const measure = () => {
      if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [ref]);

  useAnimationFrame(() => {
    if (reducedMotion) return;
    const rect = rectRef.current;
    if (!rect) return;

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = pointer.x.get();
    const py = pointer.y.get();
    const active = pointer.active.get();

    const dx = cx - px;
    const dy = cy - py;
    const dist = Math.hypot(dx, dy) || 1;

    if (!active || dist > repelRadius) {
      repelX.set(0);
      repelY.set(0);
      return;
    }

    // Fade repel to ~0 as the cursor nears calmRadius so the bubble
    // becomes easy to actually click/hover rather than skittering away.
    const t = Math.max(0, (dist - calmRadius) / (repelRadius - calmRadius));
    const force = t * repelStrength;
    repelX.set((dx / dist) * force);
    repelY.set((dy / dist) * force);
  });

  // Idle floating: seeded duration/amplitude so nothing synchronizes.
  const duration = 7 + motionSeed * 6; // 7–13s
  const amplitude = 8 + motionSeed * 6; // 8–14px
  const delay = -motionSeed * duration; // negative delay = staggered start

  const floatStyle: CSSProperties = reducedMotion
    ? {}
    : {
        animation: `floatIdle ${duration}s ease-in-out ${delay}s infinite`,
        animationPlayState: isActive ? 'paused' : 'running',
        ['--float-amp' as string]: `${amplitude}px`,
        ['--float-rot' as string]: `${(motionSeed - 0.5) * 4}deg`,
      };

  return { springX, springY, floatStyle };
}
