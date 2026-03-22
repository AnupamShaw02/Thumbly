import { useRef, useEffect, useState, useCallback } from 'react';
import { useScroll, useMotionValueEvent, motion } from 'framer-motion';
import SaaSOverlay from './SaaSOverlay';

const FRAME_COUNT = 189;
const FRAME_BASE = '/frames/ezgif-frame-';

export default function NexusScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
  const loadedCountRef = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const rafRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameIndex = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(progress * FRAME_COUNT)));
    const img = imagesRef.current[frameIndex];
    if (!img) return;

    // Cover-style draw: fill canvas, crop to center
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const canvasAspect = cw / ch;
    const imgAspect = iw / ih;

    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (imgAspect > canvasAspect) {
      sw = ih * canvasAspect;
      sx = (iw - sw) / 2;
    } else {
      sh = iw / canvasAspect;
      sy = (ih - sh) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }, []);

  // Preload all frames
  useEffect(() => {
    loadedCountRef.current = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const idx = i - 1;
      img.src = `${FRAME_BASE}${String(i).padStart(3, '0')}.jpg`;

      img.onload = () => {
        imagesRef.current[idx] = img;
        loadedCountRef.current++;
        setLoadProgress(loadedCountRef.current / FRAME_COUNT);

        // Draw first frame as soon as it's ready
        if (loadedCountRef.current === 1) drawFrame(0);

        if (loadedCountRef.current === FRAME_COUNT) {
          setIsReady(true);
        }
      };

      img.onerror = () => {
        loadedCountRef.current++;
        setLoadProgress(loadedCountRef.current / FRAME_COUNT);
        if (loadedCountRef.current === FRAME_COUNT) setIsReady(true);
      };
    }
  }, [drawFrame]);

  // Sync scroll → canvas frame using RAF for smoothness
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => drawFrame(progress));
  });

  // Handle canvas resize
  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      drawFrame(scrollYProgress.get());
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, [drawFrame, scrollYProgress]);

  // Slow down scroll inside the sticky zone so all 189 frames have time to play.
  // Without this, trackpad/mouse inertia blows through the section in a second.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // How much of the real scroll delta to apply (0.3 = 30% speed → ~3× slower).
    const SPEED_FACTOR = 0.3;

    const onWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const inStickyZone = rect.top <= 2 && rect.bottom > window.innerHeight - 2;

      if (!inStickyZone) return;

      const maxScroll = section.offsetHeight - window.innerHeight;
      const currentOffset = Math.max(0, -rect.top);

      // Scrolling UP → always let pass through at full speed so user can reach hero
      if (e.deltaY < 0) return;

      // At end boundary scrolling DOWN → let pass through to next section
      if (currentOffset >= maxScroll - 2) return;

      // Scrolling DOWN mid-section: slow down so all 189 frames play
      e.preventDefault();
      const next = Math.max(0, Math.min(maxScroll, currentOffset + e.deltaY * SPEED_FACTOR));
      window.scrollTo({ top: section.offsetTop + next, behavior: 'instant' });
    };

    // Must be non-passive to call preventDefault
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-slate-950">
        {/* Loading overlay */}
        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-950">
            <div className="w-72 space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <p className="text-cyan-400 text-xs font-semibold tracking-[0.2em] uppercase">
                    Initializing AI Nexus
                  </p>
                </div>
                <p className="text-slate-600 text-xs">
                  {Math.round(loadProgress * 100)}% loaded — {Math.round(loadProgress * FRAME_COUNT)}/
                  {FRAME_COUNT} frames
                </p>
              </div>
              <div className="h-px bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                  style={{ width: `${loadProgress * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              {/* Skeleton preview */}
              <div className="grid grid-cols-3 gap-1.5 mt-4 opacity-20">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-video bg-slate-800 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 block" />

        {/* Depth gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950/60 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950/60 to-transparent" />
        </div>

        {/* UI overlays */}
        <SaaSOverlay scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}
