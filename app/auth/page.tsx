'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // If already logged in, redirect
    if (user) {
        router.push('/dashboard');
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
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 pt-14">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Alt Vows
                    </h1>
                    <p className="text-white/40 text-sm mt-2">
                        {mode === 'signin' ? 'Welcome back' : 'Create your account'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-8 shadow-2xl">
                    {/* Tabs */}
                    <div className="flex mb-8 bg-black rounded-lg p-1">
                        <button
                            onClick={() => { setMode('signin'); setError(null); setSuccessMessage(null); }}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${mode === 'signin'
                                ? 'bg-white/10 text-white shadow-sm'
                                : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setError(null); setSuccessMessage(null); }}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${mode === 'signup'
                                ? 'bg-white/10 text-white shadow-sm'
                                : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error / Success Messages */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                            {successMessage}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[10px] uppercase font-semibold text-white/40 mb-2 tracking-wider">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 outline-none transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase font-semibold text-white/40 mb-2 tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold text-sm rounded-lg transition-all uppercase tracking-wide"
                        >
                            {loading
                                ? 'Please wait…'
                                : mode === 'signin'
                                    ? 'Sign In'
                                    : 'Create Account'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-white/20 text-xs mt-6">
                    {mode === 'signin'
                        ? "Don't have an account? Click Sign Up above."
                        : 'Already have an account? Click Sign In above.'}
                </p>
            </div>
        </main>
    );
}
