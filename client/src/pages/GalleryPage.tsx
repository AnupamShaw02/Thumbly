import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Image,
  Trash2,
  Eye,
  Download,
  Sparkles,
  Plus,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { thumbnailApi } from '../services/api';
import type { Thumbnail } from '../types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ThumbnailCard({
  thumb,
  onDelete,
  onPreview,
  index,
}: {
  thumb: Thumbnail;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
  index: number;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this thumbnail? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await thumbnailApi.delete(thumb._id);
      onDelete(thumb._id);
      toast.success('Thumbnail deleted');
    } catch {
      toast.error('Failed to delete thumbnail');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    const toastId = toast.loading('Downloading...');
    try {
      const res = await fetch(thumb.imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thumbly-${thumb._id}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success('Downloaded!');
    } catch {
      toast.dismiss(toastId);
      toast.error('Download failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-slate-900/50 border border-white/[0.07] hover:border-cyan-500/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <img
          src={thumb.imageUrl}
          alt={thumb.promptData.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/60 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onPreview(thumb._id)}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="w-10 h-10 bg-cyan-500/20 hover:bg-cyan-500/40 backdrop-blur-sm border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-300 transition-all"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-10 h-10 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm border border-red-500/30 rounded-full flex items-center justify-center text-red-300 transition-all disabled:opacity-50"
          >
            {deleting ? (
              <span className="w-3.5 h-3.5 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white text-sm font-medium line-clamp-1 mb-2">
          {thumb.promptData.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 capitalize bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 rounded-full">
              {thumb.promptData.style}
            </span>
            <span className="text-[10px] text-slate-500 bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 rounded-full">
              {thumb.promptData.aspectRatio}
            </span>
          </div>
          <span className="text-[10px] text-slate-600 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(thumb.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const navigate = useNavigate();
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThumbnails = useCallback(async () => {
    try {
      const res = await thumbnailApi.getAll();
      setThumbnails(res.data.thumbnails);
    } catch {
      toast.error('Failed to load thumbnails');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThumbnails();
  }, [fetchThumbnails]);

  const handleDelete = (id: string) => {
    setThumbnails((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-cyan-500/[0.04] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Thumbnails</h1>
            <p className="text-slate-400 text-sm">
              {loading
                ? 'Loading...'
                : `${thumbnails.length} thumbnail${thumbnails.length !== 1 ? 's' : ''} generated`}
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-cyan-500/15 blur-sm" />
            <button
              onClick={() => navigate('/generate')}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Generate New
            </button>
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-900/50 border border-white/[0.07] rounded-2xl overflow-hidden"
              >
                <div className="aspect-video bg-slate-900 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-800 rounded-lg animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-800 rounded-lg animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && thumbnails.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="w-20 h-20 bg-slate-900/60 border border-white/[0.07] rounded-2xl flex items-center justify-center mb-6">
              <Image className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No thumbnails yet</h2>
            <p className="text-slate-500 mb-8 max-w-sm text-sm">
              Generate your first AI-powered thumbnail to see it here.
            </p>
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-md" />
              <button
                onClick={() => navigate('/generate')}
                className="relative inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25"
              >
                <Sparkles className="w-4 h-4" />
                Generate Your First Thumbnail
              </button>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && thumbnails.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {thumbnails.map((thumb, i) => (
              <ThumbnailCard
                key={thumb._id}
                thumb={thumb}
                index={i}
                onDelete={handleDelete}
                onPreview={(id) => navigate(`/preview/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
