import { Sparkles } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/30 animate-pulse-slow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl animate-ping opacity-20" />
        </div>
        <p className="text-gray-400 text-sm animate-pulse">Loading Thumbly...</p>
      </div>
    </div>
  );
}
