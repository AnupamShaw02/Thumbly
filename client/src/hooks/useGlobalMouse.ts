import { useEffect } from 'react';
import { useMotionValue } from 'framer-motion';

// Singleton motion values shared across all consumers
import { motionValue } from 'framer-motion';

const globalX = motionValue(-9999);
const globalY = motionValue(-9999);

let listenerCount = 0;

function onMove(e: MouseEvent) {
  globalX.set(e.clientX);
  globalY.set(e.clientY);
}

function onLeave() {
  globalX.set(-9999);
  globalY.set(-9999);
}

export function useGlobalMouse() {
  useEffect(() => {
    if (listenerCount === 0) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseleave', onLeave);
    }
    listenerCount++;
    return () => {
      listenerCount--;
      if (listenerCount === 0) {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseleave', onLeave);
      }
    };
  }, []);

  return { mouseX: globalX, mouseY: globalY };
}
