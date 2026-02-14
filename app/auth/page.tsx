'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const redirectUrl = searchParams.get('redirect') || '/dashboard';

    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // If already logged in, redirect
    if (user) {
        router.push(redirectUrl);
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setSuccessMessage('Check your email to confirm your account, then sign in.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push(redirectUrl);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}${redirectUrl}`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            console.error('Google Sign-In error:', err);
            setError('Google Sign-In is not available yet. Please use email.');
            setGoogleLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#08070A] flex">
            {/* ─── Left — Animated Visual Panel (desktop only) ─── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-950/30 via-[#08070A] to-[#08070A]" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4A843] opacity-[0.04] rounded-full blur-[120px]" />

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-[#D4A843] rounded-full"
                        style={{
                            left: `${10 + i * 11}%`,
                            bottom: '15%',
                        }}
                        animate={{
                            y: [0, -350 - i * 30],
                            opacity: [0, 0.4, 0],
                        }}
                        transition={{
                            duration: 6 + i * 1.2,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay: i * 0.8,
                        }}
                    />
                ))}

                {/* 3D-perspective rotating card stack */}
                <div className="relative z-10" style={{ perspective: '1200px' }}>
                    {/* Decorative ring */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1, type: 'spring' }}
                        className="w-20 h-20 rounded-full border-2 border-[#D4A843]/30 flex items-center justify-center mx-auto mb-10"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#D4A843]/15 flex items-center justify-center">
                            <span className="text-[#D4A843] text-lg">✦</span>
                        </div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-bold text-[#F0EBE0] mb-3 text-center"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                        Create Something<br />
                        <span className="text-[#D4A843]">Unforgettable</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-[#9A9198] text-sm leading-relaxed max-w-sm mx-auto mb-12 text-center"
                    >
                        Design a stunning animated invitation that your guests will remember forever. No design skills needed.
                    </motion.p>

                    {/* Animated 3D theme card stack */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="relative h-56 w-72 mx-auto"
                    >
                        {/* Card 3 — back (Cyberpunk) */}
                        <motion.div
                            animate={{ rotateY: [-2, 2, -2], y: [0, -4, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute left-0 top-6 w-44 h-52 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                            style={{ transform: 'rotate(-10deg)', transformStyle: 'preserve-3d' }}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-cyan-900/70 to-blue-950/90 flex flex-col items-center justify-center gap-2">
                                <span className="text-2xl">⚡</span>
                                <span className="text-[10px] text-white/40 uppercase tracking-[3px] font-semibold"
                                    style={{ fontFamily: 'var(--font-jetbrains)' }}>
                                    Cyberpunk
                                </span>
                                <span className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-playfair)' }}>Neon Love</span>
                            </div>
                        </motion.div>

                        {/* Card 2 — middle (Rock & Roll) */}
                        <motion.div
                            animate={{ rotateY: [1, -1, 1], y: [0, -6, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                            className="absolute left-12 top-2 w-44 h-52 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                            style={{ transform: 'rotate(-3deg)', transformStyle: 'preserve-3d' }}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-red-900/70 to-red-950/90 flex flex-col items-center justify-center gap-2">
                                <span className="text-2xl">🤘</span>
                                <span className="text-[10px] text-white/40 uppercase tracking-[3px] font-semibold"
                                    style={{ fontFamily: 'var(--font-jetbrains)' }}>
                                    Rock & Roll
                                </span>
                                <span className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-playfair)' }}>Power Chords</span>
                            </div>
                        </motion.div>

                        {/* Card 1 — front (Jazz Lounge) */}
                        <motion.div
                            animate={{ rotateY: [-1, 1, -1], y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            className="absolute left-24 -top-1 w-44 h-52 rounded-2xl overflow-hidden border border-[#D4A843]/30 shadow-2xl"
                            style={{ transform: 'rotate(5deg)', transformStyle: 'preserve-3d' }}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-amber-900/80 to-yellow-950/90 flex flex-col items-center justify-center gap-2">
                                <span className="text-2xl">🎷</span>
                                <span className="text-[10px] text-[#D4A843]/60 uppercase tracking-[3px] font-semibold"
                                    style={{ fontFamily: 'var(--font-jetbrains)' }}>
                                    Jazz Lounge
                                </span>
                                <span className="text-[#D4A843]/40 text-xs" style={{ fontFamily: 'var(--font-playfair)' }}>Smooth & Gold</span>
                            </div>
                            {/* Gold glow on front card */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#D4A843] rounded-full blur-3xl opacity-20" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* ─── Right — Form Panel ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-16 pt-20 relative">
                {/* Subtle radial glow (mobile only, since desktop has left panel) */}
                <div
                    className="absolute inset-0 pointer-events-none lg:hidden"
                    style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(212,168,67,0.04) 0%, transparent 60%)' }}
                />

                <div className="w-full max-w-[420px] relative z-10">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <h1
                            className="text-3xl font-bold text-[#D4A843] tracking-tight"
                            style={{ fontFamily: 'var(--font-playfair)' }}
                        >
                            Alt Vows
                        </h1>
                        <p className="text-[#9A9198] text-sm mt-2">
                            {mode === 'signin'
                                ? 'Welcome back. Let\u2019s make something unforgettable.'
                                : 'Create your account. Start building in 3 minutes.'}
                        </p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#111015] border border-[#2A2630] rounded-[20px] p-8 sm:p-10"
                        style={{ boxShadow: '0 0 80px rgba(212, 168, 67, 0.03)' }}
                    >
                        {/* Pill Toggle with sliding indicator */}
                        <div className="flex mb-6 bg-[#1A181F] rounded-xl p-1 relative">
                            <motion.div
                                layoutId="auth-tab-bg"
                                className="absolute top-1 bottom-1 rounded-[10px] bg-[#D4A843]"
                                style={{
                                    width: 'calc(50% - 4px)',
                                    left: mode === 'signin' ? '4px' : 'calc(50%)',
                                }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                            <button
                                onClick={() => { setMode('signin'); setError(null); setSuccessMessage(null); }}
                                className={`flex-1 relative z-10 h-10 text-sm rounded-[10px] transition-colors duration-200 ${mode === 'signin' ? 'text-[#08070A] font-semibold' : 'text-[#6A6168]'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setMode('signup'); setError(null); setSuccessMessage(null); }}
                                className={`flex-1 relative z-10 h-10 text-sm rounded-[10px] transition-colors duration-200 ${mode === 'signup' ? 'text-[#08070A] font-semibold' : 'text-[#6A6168]'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Alerts */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-[10px] text-red-400 text-sm overflow-hidden"
                                >
                                    {error}
                                </motion.div>
                            )}
                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[10px] text-emerald-400 text-sm overflow-hidden"
                                >
                                    {successMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    className="block text-[11px] uppercase font-semibold text-[#8A8088] mb-1.5 tracking-[1.5px]"
                                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-[#0D0C10] border border-[#2A2630] rounded-[10px] px-4 h-12 text-[15px] text-[#F0EBE0] placeholder-[#4A4248] focus:border-[#D4A843] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.15)] outline-none transition-all duration-200"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-[11px] uppercase font-semibold text-[#8A8088] mb-1.5 tracking-[1.5px]"
                                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full bg-[#0D0C10] border border-[#2A2630] rounded-[10px] px-4 h-12 text-[15px] text-[#F0EBE0] placeholder-[#4A4248] focus:border-[#D4A843] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.15)] outline-none transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-[50px] rounded-xl font-bold text-[15px] tracking-wide text-[#08070A] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 hover:-translate-y-px active:scale-[0.98] flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #D4A843, #B8922A)' }}
                            >
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Please wait…</>
                                ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-[#2A2630]" />
                            <span className="text-[#4A4248] text-[13px]">or</span>
                            <div className="flex-1 h-px bg-[#2A2630]" />
                        </div>

                        {/* Google */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading}
                            className="w-full h-12 rounded-xl border border-[#2A2630] bg-transparent text-[#9A9198] text-sm font-medium flex items-center justify-center gap-2.5 hover:border-[#3D3548] hover:bg-[#1A181F] transition-all duration-200 disabled:opacity-60"
                        >
                            {googleLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            )}
                            Continue with Google
                        </button>
                    </motion.div>

                    {/* Trust signals */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-center gap-4 mt-6 text-[13px] text-[#6A6168] flex-wrap"
                    >
                        <span><span className="text-[#D4A843]">✦</span> 3 min setup</span>
                        <span>·</span>
                        <span><span className="text-[#D4A843]">✦</span> No credit card</span>
                        <span>·</span>
                        <span><span className="text-[#D4A843]">✦</span> Free to start</span>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#08070A] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#2A2630] border-t-[#D4A843] rounded-full animate-spin" />
            </main>
        }>
            <AuthContent />
        </Suspense>
    );
}
