import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
}: {
  thumb: Thumbnail;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
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
    <div className="group bg-dark-700/40 border border-white/8 hover:border-white/15 rounded-2xl overflow-hidden transition-all">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-dark-800">
        <img
          src={thumb.imageUrl}
          alt={thumb.promptData.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/60 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onPreview(thumb._id)}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white transition-all"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-10 h-10 bg-red-500/50 hover:bg-red-500/70 backdrop-blur rounded-full flex items-center justify-center text-white transition-all disabled:opacity-50"
          >
            {deleting ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white text-sm font-medium line-clamp-1 mb-1">
          {thumb.promptData.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 capitalize bg-white/5 px-2 py-0.5 rounded-full">
              {thumb.promptData.style}
            </span>
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
              {thumb.promptData.aspectRatio}
            </span>
          </div>
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(thumb.createdAt)}
          </span>
        </div>
      </div>
    </div>
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
    <div className="min-h-screen bg-dark-900 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Thumbnails</h1>
            <p className="text-gray-400 text-sm">
              {loading ? 'Loading...' : `${thumbnails.length} thumbnail${thumbnails.length !== 1 ? 's' : ''} generated`}
            </p>
          </div>
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Generate New
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-dark-700/40 border border-white/8 rounded-2xl overflow-hidden">
                <div className="aspect-video bg-dark-800 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-dark-800 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-dark-800 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && thumbnails.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-dark-700/50 rounded-2xl flex items-center justify-center mb-6">
              <Image className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No thumbnails yet</h2>
            <p className="text-gray-500 mb-6 max-w-sm">
              Generate your first AI-powered thumbnail to see it here.
            </p>
            <button
              onClick={() => navigate('/generate')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Generate Your First Thumbnail
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && thumbnails.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {thumbnails.map((thumb) => (
              <ThumbnailCard
                key={thumb._id}
                thumb={thumb}
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
