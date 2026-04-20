import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Dot: near-instant snap
  const dotX = useSpring(mouseX, { stiffness: 3000, damping: 80, mass: 0.1 });
  const dotY = useSpring(mouseY, { stiffness: 3000, damping: 80, mass: 0.1 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onLeave = () => {
      mouseX.set(-200);
      mouseY.set(-200);
    };

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [mouseX, mouseY]);

  return (
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
  );
}
