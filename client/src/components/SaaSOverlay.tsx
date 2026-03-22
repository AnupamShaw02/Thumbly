import { MotionValue, useTransform, motion } from 'framer-motion';
import { siteData } from '../data/siteData';

interface SaaSOverlayProps {
  scrollYProgress: MotionValue<number>;
}

const stepColors: Record<string, string> = {
  cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  blue: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  violet: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
  emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
};

export default function SaaSOverlay({ scrollYProgress }: SaaSOverlayProps) {
  // Section labels — centered, fade in/out in quarters
  const s0Op = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.28], [0, 1, 1, 0]);
  const s1Op = useTransform(scrollYProgress, [0.25, 0.32, 0.46, 0.54], [0, 1, 1, 0]);
  const s2Op = useTransform(scrollYProgress, [0.5, 0.57, 0.71, 0.79], [0, 1, 1, 0]);
  const s3Op = useTransform(scrollYProgress, [0.76, 0.83, 0.94, 1], [0, 1, 1, 0]);

  const sectionOpacities = [s0Op, s1Op, s2Op, s3Op];

  // Panel 1: Generate form (right side) — visible 0.05 → 0.35
  const p1Op = useTransform(scrollYProgress, [0.05, 0.13, 0.28, 0.37], [0, 1, 1, 0]);
  const p1Y = useTransform(scrollYProgress, [0.05, 0.13, 0.28, 0.37], [24, 0, 0, -24]);

  // Panel 2: AI processing (left side) — visible 0.37 → 0.67
  const p2Op = useTransform(scrollYProgress, [0.37, 0.45, 0.6, 0.68], [0, 1, 1, 0]);
  const p2Y = useTransform(scrollYProgress, [0.37, 0.45, 0.6, 0.68], [24, 0, 0, -24]);

  // Panel 3: Gallery (bottom center) — visible 0.68 → 1
  const p3Op = useTransform(scrollYProgress, [0.68, 0.76, 0.92, 1], [0, 1, 1, 0]);
  const p3Y = useTransform(scrollYProgress, [0.68, 0.76, 0.92, 1], [24, 0, 0, -24]);

  const thumbGradients = [
    'from-cyan-600 to-blue-700',
    'from-violet-600 to-pink-600',
    'from-emerald-600 to-cyan-600',
    'from-amber-600 to-rose-600',
    'from-blue-600 to-violet-700',
    'from-pink-600 to-orange-500',
  ];

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Section text labels — centered */}
      {siteData.scrollSections.map((section, i) => (
        <motion.div
          key={section.id}
          style={{ opacity: sectionOpacities[i] }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-6"
        >
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-300">
              {section.label}
            </span>
          </div>
          <h2
            className="font-black leading-tight bg-gradient-to-r from-violet-300 via-pink-300 to-violet-300 bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(1.25rem, 4.5vw, 3.5rem)' }}
          >
            {section.text}
          </h2>
          <p className="mt-2 hidden sm:block text-sm md:text-base text-pink-200/80 font-medium">{section.sub}</p>
        </motion.div>
      ))}

      {/* Panel 1: Generate UI (right side) */}
      <motion.div
        style={{ opacity: p1Op, y: p1Y }}
        className="absolute top-1/2 right-4 md:right-12 lg:right-20 -translate-y-1/2 w-64 md:w-72"
      >
        <div className="bg-slate-900/85 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase ml-1">
              thumbly / generate
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">Thumbnail Title</p>
              <div className="bg-slate-800/70 border border-white/[0.07] rounded-lg px-3 py-2 text-xs text-slate-300 font-mono">
                "Top 10 AI Tools 2024"
                <span className="inline-block w-0.5 h-3 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
              </div>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">Style</p>
              <div className="flex flex-wrap gap-1.5">
                {['Gaming', 'Tech', 'Vlog', 'Tutorial'].map((s, i) => (
                  <span
                    key={s}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold border ${
                      i === 1
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-slate-800/60 text-slate-500 border-white/5'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">Color</p>
              <div className="flex gap-1.5">
                {['bg-cyan-500', 'bg-violet-500', 'bg-emerald-500', 'bg-pink-500', 'bg-amber-500'].map(
                  (c, i) => (
                    <div
                      key={c}
                      className={`w-5 h-5 rounded-full ${c} ${i === 0 ? 'ring-2 ring-white/30 ring-offset-1 ring-offset-slate-900' : 'opacity-50'}`}
                    />
                  )
                )}
              </div>
            </div>

            <div className="pt-1">
              <div className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-lg py-2 text-center text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25">
                ⚡ Generate Thumbnail
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Panel 2: AI Processing (left side) */}
      <motion.div
        style={{ opacity: p2Op, y: p2Y }}
        className="absolute top-1/2 left-4 md:left-12 lg:left-20 -translate-y-1/2 w-56 md:w-64"
      >
        <div className="bg-slate-900/85 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">
              AI Processing
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'Gemini Analysis', state: 'done' },
              { label: 'Prompt Engineering', state: 'done' },
              { label: 'Image Generation', state: 'active' },
              { label: 'Cloudinary Upload', state: 'pending' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border ${
                    item.state === 'done'
                      ? 'bg-emerald-500/20 border-emerald-500/50'
                      : item.state === 'active'
                        ? 'bg-cyan-500/20 border-cyan-500/50'
                        : 'bg-slate-800/80 border-white/5'
                  }`}
                >
                  {item.state === 'done' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                  {item.state === 'active' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    item.state === 'done'
                      ? 'text-emerald-400'
                      : item.state === 'active'
                        ? 'text-cyan-400'
                        : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.05]">
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                style={{ width: '60%' }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">60% complete • ~1.2s remaining</p>
          </div>
        </div>
      </motion.div>

      {/* Panel 3: Gallery (bottom center) */}
      <motion.div
        style={{ opacity: p3Op, y: p3Y }}
        className="absolute bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 w-72 md:w-80"
      >
        <div className="bg-slate-900/85 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <span className="text-[10px] text-violet-400 font-semibold tracking-widest uppercase">
                My Generations
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">24 thumbnails</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {thumbGradients.map((g, i) => (
              <div
                key={i}
                className={`aspect-video rounded-lg bg-gradient-to-br ${g} opacity-75 hover:opacity-100 transition-opacity`}
              />
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <div className="flex-1 text-center py-1.5 rounded-lg bg-white/5 border border-white/[0.06] text-[10px] text-slate-400 font-medium">
              Download All
            </div>
            <div className="flex-1 text-center py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-400 font-medium">
              + Generate New
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom scroll indicator */}
      <motion.div
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [1, 0, 0, 0]),
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="text-[10px] text-slate-500 tracking-widest uppercase font-medium">
          Scroll to explore
        </div>
        <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent" />
      </motion.div>

      {/* Corner: scroll progress */}
      <div className="absolute top-6 right-6 hidden md:flex flex-col items-end gap-1">
        {siteData.scrollSections.map((section, i) => (
          <motion.div
            key={section.id}
            style={{ opacity: sectionOpacities[i] }}
            className="flex items-center gap-2"
          >
            <span className="text-[9px] text-slate-500 tracking-widest uppercase">{section.label}</span>
            <div className="w-4 h-px bg-cyan-500/60" />
          </motion.div>
        ))}
      </div>

      {/* Floating step colors for workflow mapping */}
      <div className="hidden">
        {Object.entries(stepColors).map(([k, v]) => (
          <div key={k} className={v} />
        ))}
      </div>
    </div>
  );
}
