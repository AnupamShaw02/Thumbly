import { useRef, useCallback } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export function useTilt(intensity = 12) {
  const ref = useRef<HTMLDivElement>(null);

  // Raw values — set directly on mouse move
  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);
  const rawGlare = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Sprung versions for smooth animation
  const springCfg = { stiffness: 400, damping: 35 };
  const rotateX = useSpring(rawRotX, springCfg);
  const rotateY = useSpring(rawRotY, springCfg);
  const glareOpacity = useSpring(rawGlare, springCfg);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      rawRotX.set(-dy * intensity);
      rawRotY.set(dx * intensity);
      glareX.set(((e.clientX - rect.left) / rect.width) * 100);
      glareY.set(((e.clientY - rect.top) / rect.height) * 100);
      rawGlare.set(0.18);
    },
    [intensity, rawRotX, rawRotY, glareX, glareY, rawGlare]
  );

  const onMouseLeave = useCallback(() => {
    rawRotX.set(0);
    rawRotY.set(0);
    rawGlare.set(0);
  }, [rawRotX, rawRotY, rawGlare]);

  return { ref, rotateX, rotateY, glareX, glareY, glareOpacity, onMouseMove, onMouseLeave };
}
