import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Dot: near-instant snap
  const dotX = useSpring(mouseX, { stiffness: 3000, damping: 80, mass: 0.1 });
  const dotY = useSpring(mouseY, { stiffness: 3000, damping: 80, mass: 0.1 });

  // Ring: laggy trailing spring
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.6 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.6 });

  // Ring scale: expands on interactive elements
  const ringScale = useSpring(1, { stiffness: 350, damping: 22 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('a, button, input, textarea, select, label, [role="button"]')) {
        ringScale.set(2.4);
      }
    };

    const onOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('a, button, input, textarea, select, label, [role="button"]')) {
        ringScale.set(1);
      }
    };

    const onLeave = () => {
      mouseX.set(-200);
      mouseY.set(-200);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [mouseX, mouseY, ringScale]);

  return (
    <>
      {/* Lagging outer ring */}
      <motion.div
        style={{ left: ringX, top: ringY, x: '-50%', y: '-50%', scale: ringScale }}
        className="fixed pointer-events-none z-[9999] w-8 h-8 rounded-full border border-cyan-400/60"
      />

      {/* Instant inner dot with glow */}
      <motion.div
        style={{
          left: dotX,
          top: dotY,
          x: '-50%',
          y: '-50%',
          boxShadow: '0 0 8px 2px rgba(6,182,212,0.55)',
        }}
        className="fixed pointer-events-none z-[9999] w-2 h-2 rounded-full bg-cyan-400"
      />
    </>
  );
}
