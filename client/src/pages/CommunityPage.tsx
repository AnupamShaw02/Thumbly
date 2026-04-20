import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Wand2, Users, TrendingUp, Clock, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { communityApi } from '../services/api';
import type { Thumbnail, ThumbnailStyle } from '../types';

const STYLES: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'vlog', label: 'Vlog' },
  { value: 'tech', label: 'Tech' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'bold', label: 'Bold' },
  { value: 'educational', label: 'Educational' },
];

export default function CommunityPage() {
  const navigate = useNavigate();
  const { isSignedIn, userId } = useAuth();
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [loading, setLoading] = useState(true);
  const [style, setStyle] = useState('all');
  const [sort, setSort] = useState<'newest' | 'popular'>('newest');
  const [liking, setLiking] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    communityApi
      .getFeed(style === 'all' ? undefined : style, sort)
      .then((res) => setThumbnails(res.data.thumbnails))
      .catch(() => toast.error('Failed to load community'))
      .finally(() => setLoading(false));
  }, [style, sort]);

  const handleLike = async (e: React.MouseEvent, thumb: Thumbnail) => {
    e.stopPropagation();
    if (!isSignedIn) {
      toast.error('Sign in to like thumbnails');
      return;
    }
    if (liking) return;
    setLiking(thumb._id);
    try {
      const res = await communityApi.like(thumb._id);
      setThumbnails((prev) =>
        prev.map((t) =>
          t._id === thumb._id
            ? {
                ...t,
                likes: res.data.liked
                  ? [...t.likes, userId!]
                  : t.likes.filter((id) => id !== userId),
              }
            : t
        )
      );
    } catch {
      toast.error('Failed to like');
    } finally {
      setLiking(null);
    }
  };

  const handleUseStyle = (e: React.MouseEvent, thumb: Thumbnail) => {
    e.stopPropagation();
    navigate('/generate', {
      state: {
        prefill: {
          style: thumb.promptData.style as ThumbnailStyle,
          colorScheme: thumb.promptData.colorScheme,
          aspectRatio: thumb.promptData.aspectRatio,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Community</h1>
          </div>
          <p className="text-gray-400 text-sm ml-12">
            Explore thumbnails shared by the community. Like what inspires you.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Style filter */}
          <div className="flex items-center gap-1.5 bg-dark-700/40 border border-white/8 rounded-xl p-1 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-gray-500 ml-1.5" />
            {STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStyle(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  style === s.value
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 bg-dark-700/40 border border-white/8 rounded-xl p-1 ml-auto">
            <button
              onClick={() => setSort('newest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sort === 'newest' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Newest
            </button>
            <button
              onClick={() => setSort('popular')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sort === 'popular' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Popular
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-dark-700/40 border border-white/8 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-white/5" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : thumbnails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Users className="w-12 h-12 text-gray-700 mb-4" />
            <h3 className="text-white font-semibold mb-2">No public thumbnails yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Be the first — share your thumbnails from My Thumbnails.
            </p>
            <button
              onClick={() => navigate('/generate')}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold rounded-xl transition-colors"
            >
              <Wand2 className="w-4 h-4" />
              Generate a Thumbnail
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {thumbnails.map((thumb, i) => {
              const liked = userId ? thumb.likes.includes(userId) : false;
              return (
                <motion.div
                  key={thumb._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/preview/${thumb._id}`)}
                  className="group bg-dark-700/40 border border-white/8 rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/5"
                >
                  {/* Image */}
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={thumb.imageUrl}
                      alt={thumb.promptData.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => handleUseStyle(e, thumb)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                      >
                        <Wand2 className="w-3 h-3" />
                        Use Style
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white text-sm font-semibold line-clamp-1 mb-1">
                      {thumb.promptData.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 capitalize bg-white/5 px-2 py-0.5 rounded-full">
                          {thumb.promptData.style}
                        </span>
                        <span className="text-xs text-gray-600">
                          {thumb.promptData.colorScheme}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleLike(e, thumb)}
                        disabled={liking === thumb._id}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                          liked
                            ? 'text-cyan-400 bg-cyan-500/10'
                            : 'text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${liked ? 'fill-cyan-400' : ''}`}
                        />
                        {thumb.likes.length}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
