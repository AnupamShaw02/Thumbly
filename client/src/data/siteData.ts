export const siteData = {
  hero: {
    title: 'Thumbly',
    subtitle: 'AI-Powered YouTube Thumbnail Generator',
    description:
      'Convert your video title and style into high-CTR thumbnail renders instantly. Powered by Gemini AI & Cloudinary.',
  },

  techStack: ['MERN', 'TypeScript', 'Gemini AI', 'Cloudinary'],

  stats: [
    { value: '8+', label: 'Pro Styles' },
    { value: '<3s', label: 'Generation' },
    { value: '100%', label: 'Cloud Storage' },
    { value: '40%', label: 'CTR Boost' },
  ],

  scrollSections: [
    {
      id: 'problem',
      label: 'The Problem',
      text: "Design skills shouldn't stop your growth.",
      sub: 'Most creators spend hours in Canva. You spend 3 seconds.',
    },
    {
      id: 'solution',
      label: 'The Solution',
      text: 'Convert Title & Style into High-CTR Renders instantly.',
      sub: 'One click. Gemini AI does the heavy lifting.',
    },
    {
      id: 'tech',
      label: 'The Tech',
      text: 'Gemini AI + Cloudinary: A powerhouse of automation.',
      sub: 'Enterprise-grade infrastructure under the hood.',
    },
    {
      id: 'flow',
      label: 'The Flow',
      text: 'Generate. Preview. Download. Dominate.',
      sub: 'Your entire thumbnail workflow in under 10 seconds.',
    },
  ],

  features: [
    {
      title: 'Gemini AI Core',
      description:
        "Google's Gemini AI analyzes your title and style to craft the perfect visual prompt for stunning, high-CTR thumbnails.",
      icon: '🧠',
      size: 'wide',
      gradient: 'from-cyan-500/10 to-blue-600/10',
      border: 'border-cyan-500/20',
      glow: 'shadow-cyan-500/10',
    },
    {
      title: 'Secure by Design',
      description:
        'bcrypt password hashing, session-based auth, and MongoDB Atlas keep your account locked down.',
      icon: '🔐',
      gradient: 'from-emerald-500/10 to-teal-600/10',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/10',
    },
    {
      title: 'Cloud Storage',
      description:
        'Every thumbnail is instantly uploaded to Cloudinary — accessible anywhere, anytime, forever.',
      icon: '☁️',
      gradient: 'from-violet-500/10 to-purple-600/10',
      border: 'border-violet-500/20',
      glow: 'shadow-violet-500/10',
    },
    {
      title: '8 Pro Styles',
      description:
        'Gaming, Vlog, Tech, Tutorial, Cinematic, Minimalist, Bold, Educational — pick your aesthetic.',
      icon: '🎨',
      gradient: 'from-pink-500/10 to-rose-600/10',
      border: 'border-pink-500/20',
      glow: 'shadow-pink-500/10',
    },
    {
      title: 'Instant Download',
      description:
        'Download full-res thumbnails directly from your gallery with a single click. No watermarks.',
      icon: '⚡',
      gradient: 'from-amber-500/10 to-yellow-600/10',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
    },
  ],

  workflow: [
    {
      step: '01',
      title: 'Sign In',
      desc: 'Create your account with email & password, secured with bcrypt hashing and session-based auth.',
      color: 'cyan',
    },
    {
      step: '02',
      title: 'Set Parameters',
      desc: 'Enter your video title, pick a style, aspect ratio, and color scheme.',
      color: 'blue',
    },
    {
      step: '03',
      title: 'Gemini Generates',
      desc: 'Our AI crafts the perfect prompt and generates your custom thumbnail in seconds.',
      color: 'violet',
    },
    {
      step: '04',
      title: 'Cloud & Download',
      desc: 'Image uploads to Cloudinary. Preview it, download it, and dominate YouTube.',
      color: 'emerald',
    },
  ],

  aiLoop: [
    { label: 'Input Title', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
    { label: 'Gemini Process', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    { label: 'Base64 Encode', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/30' },
    { label: 'Cloudinary URL', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  ],

  roadmap: [
    {
      title: 'Stripe Payments',
      desc: 'Premium plans with usage tiers for high-volume creators.',
      icon: '💳',
      status: 'upcoming',
    },
    {
      title: 'Image Overlays',
      desc: 'Add custom text, logos, and visual elements on top of generated thumbnails.',
      icon: '🖼️',
      status: 'upcoming',
    },
    {
      title: 'Analytics Dashboard',
      desc: 'Track CTR performance and A/B test your thumbnail variants.',
      icon: '📊',
      status: 'planned',
    },
    {
      title: 'Batch Generation',
      desc: 'Generate multiple thumbnail variants simultaneously for faster workflows.',
      icon: '🔄',
      status: 'planned',
    },
  ],
};
