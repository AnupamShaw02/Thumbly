import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download,
  ArrowLeft,
  Trash2,
  Image,
  MonitorPlay,
  Smartphone,
  Wand2,
  Calendar,
  Tag,
  Palette,
  Maximize2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { thumbnailApi } from '../services/api';
import type { Thumbnail } from '../types';

type PreviewMode = 'raw' | 'youtube' | 'mobile';

function YouTubeDesktopPreview({ imageUrl, title }: { imageUrl: string; title: string }) {
  return (
    <div className="bg-[#0f0f0f] rounded-xl overflow-hidden p-4 max-w-2xl mx-auto">
      {/* YouTube header stub */}
      <div className="flex items-center gap-3 mb-3 opacity-50">
        <div className="w-24 h-6 bg-red-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">▶ YouTube</span>
        </div>
        <div className="flex-1 h-6 bg-white/10 rounded-full" />
        <div className="w-8 h-8 bg-white/10 rounded-full" />
      </div>

      <div className="flex gap-4">
        {/* Main video */}
        <div className="flex-1">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="mt-3">
            <h3 className="text-white text-sm font-semibold line-clamp-2">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-400 text-xs">YourChannel</span>
              <span className="text-gray-600 text-xs">·</span>
              <span className="text-gray-400 text-xs">1.2M views</span>
              <span className="text-gray-600 text-xs">·</span>
              <span className="text-gray-400 text-xs">2 hours ago</span>
            </div>
          </div>
        </div>

        {/* Sidebar stubs */}
        <div className="w-40 space-y-3 hidden sm:block">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-20 aspect-video bg-white/5 rounded flex-shrink-0" />
              <div className="flex-1 space-y-1 pt-1">
                <div className="h-2 bg-white/10 rounded w-full" />
                <div className="h-2 bg-white/5 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function YouTubeMobilePreview({ imageUrl, title }: { imageUrl: string; title: string }) {
  return (
    <div className="max-w-xs mx-auto">
      <div className="bg-[#0f0f0f] rounded-3xl overflow-hidden border-4 border-dark-600 shadow-2xl">
        {/* Status bar */}
        <div className="h-6 bg-black flex items-center justify-between px-4">
          <span className="text-white text-[9px]">9:41</span>
          <div className="flex gap-1">
            <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
            <div className="w-1 h-1.5 bg-white/30 rounded-sm" />
          </div>
        </div>

        {/* App bar */}
        <div className="bg-[#0f0f0f] px-3 py-2 flex items-center gap-2">
          <div className="text-red-600 font-black text-sm">▶</div>
          <div className="flex-1 h-5 bg-white/10 rounded-full text-[9px] text-white/30 flex items-center px-2">
            Search YouTube
          </div>
        </div>

        {/* Feed item */}
        <div className="p-3">
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-2">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
              Y
            </div>
            <div>
              <p className="text-white text-[11px] font-medium line-clamp-2">{title}</p>
              <p className="text-gray-500 text-[9px] mt-0.5">YourChannel · 1.2M views</p>
            </div>
          </div>
        </div>

        {/* Stubs */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="px-3 pb-3 flex gap-2">
            <div className="w-full aspect-video bg-white/5 rounded-lg" />
          </div>
        ))}

        {/* Nav bar */}
        <div className="h-12 bg-black flex items-center justify-around px-4">
          {['🏠', '🔍', '＋', '📊', '👤'].map((icon, i) => (
            <span key={i} className="text-base opacity-50">
              {icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState<Thumbnail | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('youtube');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    thumbnailApi
      .getOne(id)
      .then((res) => setThumbnail(res.data.thumbnail))
      .catch(() => toast.error('Thumbnail not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    if (!thumbnail) return;
    const toastId = toast.loading('Downloading...');
    try {
      const res = await fetch(thumbnail.imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thumbly-${thumbnail._id}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success('Downloaded!');
    } catch {
      toast.dismiss(toastId);
      toast.error('Download failed');
    }
  };

  const handleDelete = async () => {
    if (!thumbnail || !confirm('Delete this thumbnail?')) return;
    setDeleting(true);
    try {
      await thumbnailApi.delete(thumbnail._id);
      toast.success('Deleted');
      navigate('/gallery');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 pt-24 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <span className="w-5 h-5 border-2 border-gray-600 border-t-primary-500 rounded-full animate-spin" />
          Loading preview...
        </div>
      </div>
    );
  }

  if (!thumbnail) {
    return (
      <div className="min-h-screen bg-dark-900 pt-24 flex flex-col items-center justify-center text-center px-4">
        <Image className="w-12 h-12 text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Thumbnail not found</h2>
        <button
          onClick={() => navigate('/gallery')}
          className="text-primary-400 hover:text-primary-300 text-sm mt-2"
        >
          Go to Gallery
        </button>
      </div>
    );
  }

  const previewModes: { key: PreviewMode; icon: typeof Image; label: string }[] = [
    { key: 'youtube', icon: MonitorPlay, label: 'YouTube Desktop' },
    { key: 'mobile', icon: Smartphone, label: 'YouTube Mobile' },
    { key: 'raw', icon: Maximize2, label: 'Raw Image' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back + Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-primary-500/20"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-semibold rounded-lg border border-red-500/20 transition-all disabled:opacity-50"
            >
              {deleting ? (
                <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Preview Area */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-2xl font-bold text-white line-clamp-2">{thumbnail.promptData.title}</h1>

            {/* Mode switcher */}
            <div className="flex items-center gap-1 bg-dark-700/40 border border-white/8 rounded-xl p-1 w-fit">
              {previewModes.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setPreviewMode(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    previewMode === key
                      ? 'bg-primary-600 text-white shadow'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Preview */}
            <div className="bg-dark-800/50 border border-white/8 rounded-2xl p-6">
              {previewMode === 'raw' && (
                <img
                  src={thumbnail.imageUrl}
                  alt={thumbnail.promptData.title}
                  className="w-full rounded-xl shadow-2xl"
                />
              )}
              {previewMode === 'youtube' && (
                <YouTubeDesktopPreview
                  imageUrl={thumbnail.imageUrl}
                  title={thumbnail.promptData.title}
                />
              )}
              {previewMode === 'mobile' && (
                <YouTubeMobilePreview
                  imageUrl={thumbnail.imageUrl}
                  title={thumbnail.promptData.title}
                />
              )}
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-4">
            <div className="bg-dark-700/40 border border-white/8 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-400" />
                Thumbnail Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Style</p>
                  <p className="text-white text-sm capitalize font-medium">
                    {thumbnail.promptData.style}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Aspect Ratio</p>
                  <p className="text-white text-sm font-medium">{thumbnail.promptData.aspectRatio}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Color Scheme</p>
                  <p className="text-white text-sm capitalize font-medium">
                    {thumbnail.promptData.colorScheme}
                  </p>
                </div>
                {thumbnail.promptData.additionalDetails && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Additional Details</p>
                    <p className="text-gray-300 text-sm">{thumbnail.promptData.additionalDetails}</p>
                  </div>
                )}
                <div className="pt-2 border-t border-white/5">
                  <p className="text-gray-500 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Created {new Date(thumbnail.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-dark-700/40 border border-white/8 rounded-2xl p-5 space-y-2">
              <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary-400" />
                Quick Actions
              </h2>
              <button
                onClick={() => navigate('/generate')}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm rounded-lg transition-all"
              >
                <Wand2 className="w-4 h-4 text-primary-400" />
                Generate Another
              </button>
              <button
                onClick={() => navigate('/gallery')}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm rounded-lg transition-all"
              >
                <Image className="w-4 h-4 text-primary-400" />
                View All Thumbnails
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
