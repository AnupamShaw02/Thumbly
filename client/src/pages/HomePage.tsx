import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Shield,
  Download,
  ArrowRight,
  Play,
  Star,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Generation',
    desc: 'Leverage Google Gemini AI to create stunning, high-CTR thumbnails from just a few words.',
  },
  {
    icon: Sparkles,
    title: 'Multiple Styles',
    desc: 'Gaming, vlog, tech, cinematic, tutorial — choose from 8 professional styles tailored to your niche.',
  },
  {
    icon: Shield,
    title: 'Cloud Storage',
    desc: 'All your thumbnails are securely stored in Cloudinary and accessible from your personal gallery.',
  },
  {
    icon: Download,
    title: 'Instant Download',
    desc: 'Download your thumbnails instantly in full resolution, ready to upload to YouTube.',
  },
];

const steps = [
  { num: '01', title: 'Enter Your Title', desc: 'Type your video title and describe what your thumbnail should convey.' },
  { num: '02', title: 'Pick Your Style', desc: 'Select a style, color scheme, and aspect ratio that match your channel.' },
  { num: '03', title: 'AI Generates', desc: 'Gemini AI crafts a professional thumbnail in seconds.' },
  { num: '04', title: 'Download & Publish', desc: 'Preview, save to your gallery, and download — ready to use.' },
];

const testimonials = [
  { name: 'Alex R.', channel: 'TechExplorer', text: 'Thumbly saved me hours every week. My CTR jumped 40% after switching!', rating: 5 },
  { name: 'Priya S.', channel: 'StudyWithPriya', text: 'Perfect for beginners. I had zero design skills but now my thumbnails look pro.', rating: 5 },
  { name: 'Marcus K.', channel: 'GamingWithMK', text: 'The gaming style thumbnails are insane. Exactly what I needed for my channel.', rating: 5 },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-8 text-sm text-primary-300">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Thumbnail Generator
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            Create{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Viral Thumbnails
            </span>
            <br />
            in Seconds
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Thumbly uses AI to generate professional YouTube thumbnails that drive clicks.
            No design skills needed — just enter your title and let AI do the rest.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={user ? '/generate' : '/signup'}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all text-lg"
            >
              Start Creating Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all text-lg"
            >
              <Play className="w-5 h-5" />
              See How It Works
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-primary-400" /> Free to start
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-primary-400" /> No credit card
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-primary-400" /> Instant results
            </span>
          </div>

          {/* Hero Preview Card */}
          <div className="mt-20 relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent rounded-2xl blur-xl" />
            <div className="relative bg-dark-700/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-dark-800/80 border-b border-white/5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="flex-1 ml-2 text-xs text-gray-500 bg-dark-700 rounded px-3 py-1">
                  thumbly.vercel.app/generate
                </span>
              </div>
              {/* Placeholder thumbnail grid */}
              <div className="p-6 grid grid-cols-3 gap-3">
                {['Gaming Thumbnail', 'Tech Review', 'Vlog Style'].map((label, i) => (
                  <div
                    key={label}
                    className="aspect-video rounded-lg overflow-hidden relative group cursor-pointer"
                    style={{
                      background: [
                        'linear-gradient(135deg, #1a0a2e, #6b21a8, #dc2626)',
                        'linear-gradient(135deg, #0f172a, #1e3a5f, #0ea5e9)',
                        'linear-gradient(135deg, #14532d, #166534, #f59e0b)',
                      ][i],
                    }}
                  >
                    <div className="absolute inset-0 flex items-end p-2">
                      <div className="text-white text-[10px] font-bold leading-tight">{label}</div>
                    </div>
                    <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors" />
                    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary-500 rounded-full p-1">
                        <Sparkles className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="text-primary-400">Stand Out</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Thumbly gives creators all the tools to generate thumbnails that drive views and grow channels.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-dark-700/40 border border-white/5 hover:border-primary-500/30 rounded-2xl p-6 transition-all hover:bg-dark-700/60"
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-dark-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="text-primary-400">Works</span>
            </h2>
            <p className="text-gray-400">Four simple steps to your perfect thumbnail</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center text-2xl font-black text-white/80 shadow-lg shadow-primary-500/20">
                  {num}
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Creators <span className="text-primary-400">Love</span> Thumbly
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map(({ name, channel, text, rating }) => (
              <div
                key={name}
                className="bg-dark-700/40 border border-white/5 rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{name}</p>
                    <p className="text-gray-500 text-xs">@{channel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-primary-900/40 to-dark-700/40 border border-primary-500/20 rounded-3xl p-12">
            <div className="absolute inset-0 bg-primary-500/5 rounded-3xl" />
            <div className="relative">
              <Sparkles className="w-12 h-12 text-primary-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Grow Your Channel?
              </h2>
              <p className="text-gray-400 mb-8">
                Join thousands of creators using Thumbly to design thumbnails that actually get clicks.
              </p>
              <Link
                to={user ? '/generate' : '/signup'}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl shadow-2xl shadow-primary-500/30 transition-all text-lg"
              >
                {user ? 'Generate a Thumbnail' : 'Create Your Free Account'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="text-white font-semibold">Thumbly</span>
        </div>
        <p>Built with MERN + TypeScript + Gemini AI · Deployed on Vercel</p>
        <p className="mt-1">© {new Date().getFullYear()} Thumbly. All rights reserved.</p>
      </footer>
    </div>
  );
}
