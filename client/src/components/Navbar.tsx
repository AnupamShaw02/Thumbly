import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, LogOut, Image, Wand2, Home } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    ...(isSignedIn
      ? [
          { href: '/generate', label: 'Generate', icon: Wand2 },
          { href: '/gallery', label: 'My Thumbnails', icon: Image },
        ]
      : []),
  ];

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setMobileOpen(false);
  };

  const displayName = user?.fullName || user?.firstName || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Floating pill */}
      <div className="mx-3 sm:mx-6 mt-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-14 px-4 sm:px-5 rounded-2xl bg-slate-900/70 backdrop-blur-2xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow duration-300">
                  <Zap className="w-4 h-4 text-slate-950" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 border border-slate-900" />
                </span>
              </div>
              <span className="text-[17px] font-bold text-white tracking-tight">
                Thumb<span className="text-cyan-400">ly</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(href)
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2.5">
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      {initial}
                    </div>
                    <span className="text-sm text-slate-300 font-medium">{displayName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Log in
                  </Link>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-cyan-500/25 blur-sm animate-pulse" />
                    <Link
                      to="/signup"
                      className="relative px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold rounded-xl transition-colors duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="md:hidden mx-3 sm:mx-6 mt-1"
          >
            <div className="rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/[0.07] shadow-2xl overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(href)
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}

                <div className="pt-3 mt-2 border-t border-white/[0.05] space-y-2">
                  {isSignedIn ? (
                    <>
                      <div className="flex items-center gap-2.5 px-4 py-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                          {initial}
                        </div>
                        <span className="text-sm text-slate-300 font-medium">{displayName}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/25"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
