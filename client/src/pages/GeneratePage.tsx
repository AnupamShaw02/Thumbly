import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Wand2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { thumbnailApi } from '../services/api';
import type { GenerateFormData, ThumbnailStyle, AspectRatio, ColorScheme } from '../types';

const styles: { value: ThumbnailStyle; label: string; emoji: string }[] = [
  { value: 'gaming', label: 'Gaming', emoji: '🎮' },
  { value: 'vlog', label: 'Vlog', emoji: '🎥' },
  { value: 'tech', label: 'Tech', emoji: '💻' },
  { value: 'tutorial', label: 'Tutorial', emoji: '📚' },
  { value: 'cinematic', label: 'Cinematic', emoji: '🎬' },
  { value: 'minimalist', label: 'Minimalist', emoji: '✨' },
  { value: 'bold', label: 'Bold', emoji: '🔥' },
  { value: 'educational', label: 'Educational', emoji: '🎓' },
];

const aspectRatios: { value: AspectRatio; label: string; desc: string }[] = [
  { value: '16:9', label: '16:9', desc: 'Standard YouTube' },
  { value: '4:3', label: '4:3', desc: 'Classic' },
  { value: '1:1', label: '1:1', desc: 'Square' },
  { value: '9:16', label: '9:16', desc: 'Shorts' },
];

const colorSchemes: { value: ColorScheme; label: string; preview: string }[] = [
  { value: 'vibrant', label: 'Vibrant', preview: 'from-yellow-400 via-orange-500 to-red-500' },
  { value: 'dark', label: 'Dark', preview: 'from-gray-900 via-gray-800 to-gray-700' },
  { value: 'light', label: 'Light', preview: 'from-white via-gray-100 to-gray-200' },
  { value: 'neon', label: 'Neon', preview: 'from-green-400 via-cyan-400 to-blue-500' },
  { value: 'monochrome', label: 'Monochrome', preview: 'from-gray-400 via-gray-600 to-gray-800' },
  { value: 'warm', label: 'Warm', preview: 'from-amber-300 via-orange-400 to-red-400' },
  { value: 'cool', label: 'Cool', preview: 'from-blue-400 via-indigo-500 to-violet-600' },
  { value: 'gradient', label: 'Gradient', preview: 'from-pink-500 via-purple-500 to-indigo-500' },
];

const defaultForm: GenerateFormData = {
  title: '',
  style: 'gaming',
  aspectRatio: '16:9',
  colorScheme: 'vibrant',
  additionalDetails: '',
};

// Shared selected/unselected button classes
const btnSelected = 'border-cyan-500 bg-cyan-500/10 text-cyan-300';
const btnIdle = 'border-white/[0.08] bg-slate-900/50 text-slate-400 hover:border-white/20 hover:text-white';

export default function GeneratePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<GenerateFormData>(defaultForm);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof GenerateFormData>(key: K, value: GenerateFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Please enter a video title');
      return;
    }
    setLoading(true);
    const toastId = toast.loading('Generating your thumbnail with AI...');
    try {
      const res = await thumbnailApi.generate(form);
      toast.dismiss(toastId);
      toast.success('Thumbnail generated successfully!');
      navigate(`/preview/${res.data.thumbnail._id}`);
    } catch (err: unknown) {
      toast.dismiss(toastId);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Generation failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-500/[0.05] blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-4 text-sm text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Generate Your Thumbnail
          </h1>
          <p className="text-slate-400">
            Fill in the details below and let Gemini AI create your perfect thumbnail
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Main card */}
          <div className="bg-slate-900/50 border border-white/[0.07] rounded-2xl p-6 space-y-6 backdrop-blur-sm">

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Video Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. I Tried Every FAST FOOD in 24 Hours…"
                maxLength={200}
                className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
              <p className="text-slate-600 text-xs mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3" /> Be specific — better title = better thumbnail
              </p>
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Thumbnail Style
              </label>
              <div className="grid grid-cols-4 gap-2">
                {styles.map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('style', value)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                      form.style === value ? btnSelected : btnIdle
                    }`}
                  >
                    <span className="text-xl">{emoji}</span>
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-2">
                {aspectRatios.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('aspectRatio', value)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                      form.aspectRatio === value ? btnSelected : btnIdle
                    }`}
                  >
                    <span className="font-bold">{label}</span>
                    <span className="text-[10px] opacity-70">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Color Scheme</label>
              <div className="grid grid-cols-4 gap-2">
                {colorSchemes.map(({ value, label, preview }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('colorScheme', value)}
                    className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border transition-all ${
                      form.colorScheme === value
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-white/[0.08] bg-slate-900/50 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-full h-6 rounded-lg bg-gradient-to-r ${preview}`} />
                    <span
                      className={`text-xs font-medium ${
                        form.colorScheme === value ? 'text-cyan-300' : 'text-slate-400'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Additional Details{' '}
                <span className="text-slate-500 font-normal text-xs">(optional)</span>
              </label>
              <textarea
                value={form.additionalDetails}
                onChange={(e) => set('additionalDetails', e.target.value)}
                placeholder="e.g. Include a shocked face, big bold text, bright background, food emojis..."
                rows={3}
                maxLength={500}
                className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit summary + button */}
          <div className="bg-slate-900/50 border border-white/[0.07] rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
              <div className="text-sm text-slate-400 space-y-0.5">
                <p>
                  <span className="text-white font-medium">Style:</span>{' '}
                  {styles.find((s) => s.value === form.style)?.label} ·{' '}
                  <span className="text-white font-medium">Ratio:</span> {form.aspectRatio} ·{' '}
                  <span className="text-white font-medium">Colors:</span>{' '}
                  {colorSchemes.find((c) => c.value === form.colorScheme)?.label}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-md" />
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl shadow-2xl shadow-cyan-500/25 transition-all text-base flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Thumbnail
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
