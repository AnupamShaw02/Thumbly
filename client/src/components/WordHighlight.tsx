import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useGlobalMouse } from '../hooks/useGlobalMouse';

interface WordHighlightProps {
  text: string;
  className?: string;
  glowColor?: string;
  radius?: number;
}

export default function WordHighlight({
  text,
  className = '',
  glowColor = '#67e8f9',
  radius = 140,
}: WordHighlightProps) {
  const { mouseX, mouseY } = useGlobalMouse();
  const words = text.split(' ');

  return (
    <p className={className}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          word={word}
          mouseX={mouseX}
          mouseY={mouseY}
          radius={radius}
          glowColor={glowColor}
        />
      ))}
    </p>
  );
}

function Word({
  word,
  mouseX,
  mouseY,
  radius,
  glowColor,
}: {
  word: string;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  radius: number;
  glowColor: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const rawBrightness = useMotionValue(0);
  const brightness = useSpring(rawBrightness, { stiffness: 200, damping: 30 });

  useTransform([mouseX, mouseY], ([mx, my]) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
    const val = Math.max(0, 1 - dist / radius);
    rawBrightness.set(val);
    return val;
  });

  const color = useTransform(brightness, [0, 1], ['#64748b', glowColor]);
  const textShadow = useTransform(
    brightness,
    [0, 1],
    ['0 0 0px transparent', `0 0 16px ${glowColor}88`]
  );

  return (
    <>
      <motion.span ref={ref} className="inline-block" style={{ color, textShadow }}>
        {word}
      </motion.span>
      {' '}
    </>
  );
}
