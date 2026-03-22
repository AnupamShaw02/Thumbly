import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface LiftTextProps {
  children: ReactNode;
  className?: string;
  liftPx?: number;
  glowColor?: string;
}

/**
 * Splits children text into words and animates each word up + glows on hover.
 * Accepts a plain string as children.
 */
export default function LiftText({
  children,
  className = '',
  liftPx = 6,
  glowColor = 'rgba(103,232,249,0.55)', // cyan-300/55
}: LiftTextProps) {
  const text = typeof children === 'string' ? children : String(children);
  const words = text.split(' ');

  return (
    <span className={`inline ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block cursor-default"
          whileHover={{
            y: -liftPx,
            filter: `drop-shadow(0 0 10px ${glowColor})`,
            transition: { type: 'spring', stiffness: 400, damping: 20 },
          }}
          style={{ marginRight: i < words.length - 1 ? '0.25em' : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
