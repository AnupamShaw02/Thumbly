import { useState, useCallback, useRef, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  cycles?: number;
  mono?: boolean;
  autoPlay?: boolean;
  onComplete?: () => void;
}

export default function ScrambleText({
  text,
  className = '',
  speed = 35,
  cycles = 5,
  mono = true,
  autoPlay = false,
  onComplete,
}: ScrambleTextProps) {
  const [displayed, setDisplayed] = useState(autoPlay ? '' : text);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef(0);

  const scramble = useCallback(() => {
    if (animRef.current) clearTimeout(animRef.current);
    frameRef.current = 0;
    const totalFrames = text.length * cycles;

    const tick = () => {
      const frame = frameRef.current;
      if (frame >= totalFrames) {
        setDisplayed(text);
        onComplete?.();
        return;
      }

      const resolved = Math.floor(frame / cycles);

      setDisplayed(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < resolved) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      frameRef.current += 1;
      animRef.current = setTimeout(tick, speed);
    };

    tick();
  }, [text, speed, cycles]);

  const reset = useCallback(() => {
    if (animRef.current) clearTimeout(animRef.current);
    setDisplayed(text);
  }, [text]);

  // Auto-play on mount
  useEffect(() => {
    if (!autoPlay) return;
    scramble();
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [autoPlay, scramble]);

  return (
    <span
      className={`cursor-default select-none ${mono ? 'font-mono' : ''} ${className}`}
      onMouseEnter={autoPlay ? undefined : scramble}
      onMouseLeave={autoPlay ? undefined : reset}
    >
      {displayed}
    </span>
  );
}
