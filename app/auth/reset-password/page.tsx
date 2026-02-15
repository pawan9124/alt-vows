'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);

    // Supabase automatically handles the recovery token from the URL hash
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setSessionReady(true);
            }
        });

        // Also check if we already have a session (token was already processed)
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) setSessionReady(true);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setSuccess(true);
            setTimeout(() => router.push('/dashboard'), 2500);
        } catch (err: any) {
            setError(err.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#08070A] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[420px]"
            >
                <div className="text-center mb-8">
                    <h1
                        className="text-3xl font-bold text-[#D4A843] tracking-tight"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                        Alt Vows
                    </h1>
                    <p className="text-[#9A9198] text-sm mt-2">
                        {success ? 'Your password has been updated!' : 'Set your new password below.'}
                    </p>
                </div>

                <div
                    className="bg-[#111015] border border-[#2A2630] rounded-[20px] p-8 sm:p-10"
                    style={{ boxShadow: '0 0 80px rgba(212, 168, 67, 0.03)' }}
                >
                    {success ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-6"
                        >
                            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                            <h3 className="text-[#F0EBE0] font-semibold text-lg mb-2">Password Updated!</h3>
                            <p className="text-[#6A6168] text-sm">Redirecting to dashboard…</p>
                        </motion.div>
                    ) : !sessionReady ? (
                        <div className="text-center py-6">
                            <Loader2 className="w-8 h-8 animate-spin text-[#D4A843] mx-auto mb-4" />
                            <p className="text-[#6A6168] text-sm">Verifying reset link…</p>
                            <p className="text-[#4A4248] text-xs mt-2">
                                If this takes too long,{' '}
                                <button
                                    onClick={() => router.push('/auth')}
                                    className="text-[#D4A843] hover:underline"
                                >
                                    request a new link
                                </button>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-5">
                            <div className="mb-4">
                                <h3 className="text-[#F0EBE0] font-semibold text-lg mb-1">New Password</h3>
                                <p className="text-[#6A6168] text-sm">Enter your new password below.</p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[10px] text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label
                                    className="block text-[11px] uppercase font-semibold text-[#8A8088] mb-1.5 tracking-[1.5px]"
                                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                                >
                                    New Password
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

                            <div>
                                <label
                                    className="block text-[11px] uppercase font-semibold text-[#8A8088] mb-1.5 tracking-[1.5px]"
                                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                                >
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</>
                                ) : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </main>
    );
}
