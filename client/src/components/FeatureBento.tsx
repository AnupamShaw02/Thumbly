import { useRef } from 'react';
import { motion, useInView, useMotionTemplate } from 'framer-motion';
import { siteData } from '../data/siteData';
import { useTilt } from '../hooks/useTilt';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function FeatureBento() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const [wide, ...rest] = siteData.features;

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400">
            Built Different
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
          Everything you need to
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            go viral on YouTube
          </span>
        </h2>
        <p className="mt-4 text-base text-slate-400 max-w-2xl mx-auto">
          A full-stack powerhouse combining AI generation, cloud storage, and secure authentication —
          all in one seamless workflow.
        </p>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Wide card */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="lg:col-span-2"
        >
          <BentoCard feature={wide} large />
        </motion.div>

        {rest.map((feature, i) => (
          <motion.div
            key={feature.title}
            custom={i + 1}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <BentoCard feature={feature} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function BentoCard({
  feature,
  large = false,
}: {
  feature: (typeof siteData.features)[number];
  large?: boolean;
}) {
  const { ref, rotateX, rotateY, glareX, glareY, glareOpacity, onMouseMove, onMouseLeave } =
    useTilt(10);

  // Reactive CSS string for the glare highlight
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, transparent 55%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      className={`relative h-full rounded-2xl border p-6 md:p-8 overflow-hidden group cursor-default
        bg-gradient-to-br ${feature.gradient} ${feature.border}
        shadow-xl ${feature.glow} hover:shadow-2xl transition-shadow duration-500`}
    >
      {/* Holographic glare */}
      <motion.div
        style={{ opacity: glareOpacity, background: glareBackground }}
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
      />

      {/* Background glow orb */}
      <div
        className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${feature.gradient} blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700`}
      />

      {/* Icon */}
      <div className="relative z-20 mb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] text-2xl">
          {feature.icon}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20">
        <h3 className={`font-bold text-white mb-2 ${large ? 'text-xl sm:text-2xl md:text-3xl' : 'text-base sm:text-lg md:text-xl'}`}>
          {feature.title}
        </h3>
        <p className={`text-slate-400 leading-relaxed ${large ? 'text-sm sm:text-base md:text-lg' : 'text-xs sm:text-sm'}`}>
          {feature.description}
        </p>
      </div>

      {/* Bottom decoration */}
      {large && (
        <div className="relative z-20 mt-8 flex flex-wrap gap-2">
          {['Gemini 1.5', 'Prompt Engineering', 'Image AI', 'Zero Config'].map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-slate-400 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
