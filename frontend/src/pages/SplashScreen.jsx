import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import EasyGoLogo from '../components/EasyGoLogo';
import { useEasyGo } from '../context/EasyGoContext';
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference';

export default function SplashScreen() {
  const { completeSplash, isAuthenticated } = useEasyGo();
  const prefersReducedMotion = useReducedMotionPreference();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const handleFinish = () => {
    completeSplash();
    navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
  };

  useEffect(() => {
    const durationMs = prefersReducedMotion ? 800 : 2500;
    const intervalMs = 50;
    const step = (intervalMs / durationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, intervalMs);

    const redirectTimer = setTimeout(() => {
      handleFinish();
    }, durationMs);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.45 }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0B1220] text-white px-6"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

      {/* Skip Intro Button */}
      <button
        type="button"
        onClick={handleFinish}
        className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
      >
        <span>Skip Intro</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Animated Wheelchair Logo Reveal */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-6"
      >
        <EasyGoLogo size={92} showText={false} animateWheel={!prefersReducedMotion} />
      </motion.div>

      {/* Brand Title */}
      <motion.h1
        initial={prefersReducedMotion ? { opacity: 1 } : { y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.45 }}
        className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent mb-3 text-center"
      >
        EASY GO
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={prefersReducedMotion ? { opacity: 1 } : { y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.45 }}
        className="text-base sm:text-lg font-medium text-slate-300 tracking-wide text-center mb-8"
      >
        Accessible Routes. Independent Journeys.
      </motion.p>

      {/* Loading Indicator */}
      <div className="w-64 sm:w-72 bg-slate-800/90 h-2 rounded-full overflow-hidden border border-slate-700/80 mb-3">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-400 transition-all duration-75"
          style={{ width: `${Math.min(100, Math.round(progress))}%` }}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Initializing Smart Mobility Command Center ({Math.min(100, Math.round(progress))}%)</span>
      </div>
    </motion.div>
  );
}
