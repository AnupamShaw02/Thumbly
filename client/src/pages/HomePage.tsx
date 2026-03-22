import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { ArrowRight, ChevronDown, Github, ExternalLink, Zap } from 'lucide-react';
import NexusScroll from '../components/NexusScroll';
import FeatureBento from '../components/FeatureBento';
import ScrambleText from '../components/ScrambleText';
import WordHighlight from '../components/WordHighlight';
import LiftText from '../components/LiftText';
import { siteData } from '../data/siteData';

// ─── Animation helpers ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// ─── Section label component ──────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
      <ScrambleText
        text={text}
        className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400"
        speed={30}
        cycles={4}
      />
    </div>
  );
}

// ─── Workflow step color map ──────────────────────────────────────────────────

const workflowColors: Record<string, { dot: string; text: string; badge: string }> = {
  cyan: {
    dot: 'bg-cyan-500 shadow-cyan-500/50',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
  },
  blue: {
    dot: 'bg-blue-500 shadow-blue-500/50',
    text: 'text-blue-400',
    badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  },
  violet: {
    dot: 'bg-violet-500 shadow-violet-500/50',
    text: 'text-violet-400',
    badge: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
  },
  emerald: {
    dot: 'bg-emerald-500 shadow-emerald-500/50',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  },
};

// ─── Main HomePage ────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="bg-slate-950 text-white" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <StatsBar />
      <NexusScroll />
      <FeatureBento />
      <WorkflowSection />
      <AILoopSection />
      <RoadmapSection />
      <CTASection />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [scrambleDone, setScrambleDone] = useState(false);

  // Normalised mouse position (-1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // "ly" gradient follows cursor left↔right after scramble completes
  const lyGradient = useMotionTemplate`linear-gradient(90deg, ${useTransform(mouseX, [-1, 1], ['#22d3ee', '#818cf8'])} 0%, ${useTransform(mouseX, [-1, 1], ['#67e8f9', '#a78bfa'])} 100%)`;

  const springCfg = { stiffness: 60, damping: 18, mass: 1 };


  // Three orbs move at different speeds/directions for parallax depth
  const orb1X = useSpring(useTransform(mouseX, [-1, 1], [-28, 28]), springCfg);
  const orb1Y = useSpring(useTransform(mouseY, [-1, 1], [-28, 28]), springCfg);
  const orb2X = useSpring(useTransform(mouseX, [-1, 1], [18, -18]), springCfg);
  const orb2Y = useSpring(useTransform(mouseY, [-1, 1], [18, -18]), springCfg);
  const orb3X = useSpring(useTransform(mouseX, [-1, 1], [-12, 12]), springCfg);
  const orb3Y = useSpring(useTransform(mouseY, [-1, 1], [14, -14]), springCfg);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
    mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Parallax glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
          <motion.div style={{ x: orb1X, y: orb1Y }} className="w-[700px] h-[700px] rounded-full bg-cyan-500/30 blur-[120px]" />
        </div>
        <div className="absolute top-1/3 left-1/4">
          <motion.div style={{ x: orb2X, y: orb2Y }} className="w-96 h-96 rounded-full bg-violet-500/25 blur-[100px]" />
        </div>
        <div className="absolute top-1/3 right-1/4">
          <motion.div style={{ x: orb3X, y: orb3Y }} className="w-96 h-96 rounded-full bg-blue-500/25 blur-[100px]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative text-center max-w-5xl mx-auto pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/[0.08] border border-cyan-500/20 mb-8"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider uppercase text-cyan-400">
            Powered by Gemini AI + Cloudinary
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <motion.h1
            variants={staggerChild}
            className="font-black tracking-tight leading-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 9rem)' }}
          >
            {!scrambleDone ? (
              <ScrambleText
                text="Thumbly"
                mono={false}
                autoPlay
                speed={28}
                cycles={6}
                onComplete={() => setScrambleDone(true)}
                className="bg-gradient-to-r from-white via-white to-cyan-400 bg-clip-text text-transparent font-black"
              />
            ) : (
              <>
                <span className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
                  Thumb
                </span>
                <motion.span
                  style={{
                    backgroundImage: lyGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  ly
                </motion.span>
              </>
            )}
          </motion.h1>

          <motion.p
            variants={staggerChild}
            className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-slate-400"
          >
            {siteData.hero.subtitle}
          </motion.p>
        </motion.div>

        {/* Description */}
        <motion.div
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <WordHighlight
            text={siteData.hero.description}
            className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-center"

            glowColor="#67e8f9"
            radius={130}
          />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          custom={0.45}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-cyan-500/30 blur-md animate-pulse" />
            <Link
              to="/signup"
              className="relative inline-flex items-center gap-2 px-7 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-colors duration-200 shadow-xl shadow-cyan-500/30"
            >
              Start Creating Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-white font-semibold text-sm rounded-xl transition-all duration-200"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Tech stack badges */}
        <motion.div
          custom={0.6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs text-slate-600 mr-1">Built with</span>
          {siteData.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-xs text-slate-400 font-medium"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-600 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-slate-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative border-y border-white/[0.06] bg-white/[0.02] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {siteData.stats.map((stat) => (
            <motion.div key={stat.label} variants={staggerChild} className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Workflow timeline ────────────────────────────────────────────────────────

function WorkflowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <SectionLabel text="How It Works" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white">
            From idea to thumbnail
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              <LiftText glowColor="rgba(139,92,246,0.6)">in under 10 seconds</LiftText>
            </span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/20 to-emerald-500/0" />

          <div className="space-y-10">
            {siteData.workflow.map((item, i) => {
              const colors = workflowColors[item.color];
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -32 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.13 }}
                  className="relative flex gap-6 md:gap-8"
                >
                  {/* Dot */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${colors.dot} shadow-xl flex items-center justify-center z-10 relative`}
                    >
                      <span className="text-xs font-black text-white/90">{item.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border mb-2 ${colors.badge}`}
                    >
                      Step {item.step}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── AI Process loop ──────────────────────────────────────────────────────────

function AILoopSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <SectionLabel text="The AI Pipeline" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">System Blueprint</h2>
          <WordHighlight
            text="See exactly how your thumbnail moves through our AI pipeline"
            className="mt-3 text-sm"
            radius={160}
          />
        </motion.div>

        {/* Pipeline flow */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0"
        >
          {siteData.aiLoop.map((step, i) => (
            <motion.div
              key={step.label}
              variants={staggerChild}
              className="flex flex-col md:flex-row items-center"
            >
              <div
                className={`flex items-center justify-center px-5 py-3 rounded-xl border text-sm font-bold ${step.bg} ${step.color} whitespace-nowrap`}
              >
                {step.label}
              </div>

              {i < siteData.aiLoop.length - 1 && (
                <div className="flex flex-col md:flex-row items-center mx-2 my-2 md:my-0">
                  <div className="flex md:hidden flex-col items-center">
                    <div className="w-px h-4 bg-white/10" />
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/10" />
                  </div>
                  <div className="hidden md:flex items-center">
                    <div className="w-6 h-px bg-white/10" />
                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-white/10" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Blueprint card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Client Layer',
                items: ['React + Vite', 'Framer Motion', 'Tailwind CSS', 'Axios + Sessions'],
                color: 'text-cyan-400',
              },
              {
                title: 'AI + API Layer',
                items: ['Gemini 1.5 Flash', 'Prompt Engineering', 'Base64 Processing', 'Cloudinary SDK'],
                color: 'text-blue-400',
              },
              {
                title: 'Data Layer',
                items: ['MongoDB Atlas', 'Mongoose ODM', 'Express Sessions', 'bcrypt Auth'],
                color: 'text-violet-400',
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className={`text-xs font-bold tracking-widest uppercase mb-3 ${col.color}`}>
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                      <div className="w-1 h-1 rounded-full bg-slate-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

function RoadmapSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const statusConfig: Record<string, { label: string; color: string }> = {
    upcoming: { label: 'Coming Soon', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    planned: { label: 'Planned', color: 'text-slate-400 border-slate-500/30 bg-slate-500/10' },
  };

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <SectionLabel text="What's Next" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white">The Roadmap</h2>
          <WordHighlight
            text="Thumbly is growing. Here's what we're building next for creators."
            className="mt-3 text-sm max-w-xl mx-auto"
            radius={160}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siteData.roadmap.map((item, i) => {
            const status = statusConfig[item.status];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.09 }}
                className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{item.icon}</div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-28 md:py-40 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-cyan-500/[0.05] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-6xl mb-6">⚡</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Start Generating
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              <LiftText glowColor="rgba(6,182,212,0.6)">with Thumbly</LiftText>
            </span>
          </h2>
          <WordHighlight
            text="Join creators who are already saving hours every week with AI-powered thumbnail generation."
            className="text-base md:text-lg mb-10 max-w-xl mx-auto"
            glowColor="#67e8f9"
            radius={180}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-cyan-500/40 blur-md animate-pulse" />
              <Link
                to="/signup"
                className="relative inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-colors duration-200 shadow-xl shadow-cyan-500/30"
              >
                Get Started — It's Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-white font-semibold text-sm rounded-xl transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              View Source
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600">
            {['No credit card required', 'Built with MERN + TypeScript', 'Deployed on Vercel'].map(
              (item, i) => (
                <span key={item} className="flex items-center gap-2">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-700" />}
                  {item}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer bar */}
      <div className="relative mt-20 pt-8 border-t border-white/[0.05] max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
              <span className="text-[10px] text-white font-black">T</span>
            </div>
            <span className="text-sm font-bold text-white">
              Thumb<span className="text-cyan-400">ly</span>
            </span>
          </div>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Thumbly. AI-Powered YouTube Thumbnail Generator.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-xs text-slate-500 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="text-xs text-slate-500 hover:text-white transition-colors">
              Sign Up
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
