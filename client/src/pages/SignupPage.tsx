import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const clerkAppearance = {
  variables: {
    colorBackground: 'rgba(15,23,42,0.85)',
    colorText: '#f8fafc',
    colorTextSecondary: '#94a3b8',
    colorInputBackground: 'rgba(255,255,255,0.05)',
    colorInputText: '#f8fafc',
    colorPrimary: '#22d3ee',
    colorDanger: '#f87171',
    borderRadius: '12px',
    fontFamily: 'inherit',
    fontSize: '14px',
  },
  elements: {
    card: 'shadow-none bg-transparent',
    headerTitle: 'text-white text-xl font-bold',
    headerSubtitle: 'text-slate-400 text-sm',
    socialButtonsBlockButton:
      'bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.09] rounded-xl transition-all',
    socialButtonsBlockButtonText: 'text-white font-medium',
    dividerLine: 'bg-white/[0.07]',
    dividerText: 'text-slate-600 text-xs',
    formFieldLabel: 'text-slate-400 text-xs',
    formFieldInput:
      'bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl focus:border-cyan-500/50 focus:ring-0',
    formButtonPrimary:
      'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all',
    footerActionLink: 'text-cyan-400 hover:text-cyan-300',
    identityPreviewText: 'text-slate-300',
    identityPreviewEditButton: 'text-cyan-400',
    formFieldInputShowPasswordButton: 'text-slate-500',
    alertText: 'text-red-400 text-sm',
    otpCodeFieldInput: 'bg-white/[0.05] border-white/[0.08] text-white rounded-xl',
  },
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.05] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-500/[0.04] blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-blue-500/[0.04] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8 group">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Zap className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Thumb<span className="text-cyan-400">ly</span>
          </span>
        </Link>

        <SignUp
          routing="hash"
          fallbackRedirectUrl="/generate"
          appearance={clerkAppearance}
        />
      </div>
    </div>
  );
}
