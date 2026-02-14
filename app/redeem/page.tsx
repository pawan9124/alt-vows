'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Gift, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

// Theme vibe display data (matches dashboard/create)
const THEME_INFO: Record<string, { label: string; emoji: string; color: string }> = {
    'vintage-vinyl': { label: 'Vintage Vinyl', emoji: '💿', color: '#d4af37' },
    'the-voyager': { label: 'The Voyager', emoji: '✈️', color: '#f59e0b' },
};

const NICHE_INFO: Record<string, { label: string; emoji: string; color: string }> = {
    'rock-n-roll-wedding': { label: 'Rock & Roll', emoji: '🤘', color: '#e02e2e' },
    'jazz-lounge-wedding': { label: 'Jazz Lounge', emoji: '🎷', color: '#d4af37' },
    'cyberpunk-wedding': { label: 'Cyberpunk', emoji: '⚡', color: '#00f0ff' },
};

function RedeemContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();

    // Phase state
    const [phase, setPhase] = useState<'code' | 'claim'>('code');

    // Code entry state
    const [code, setCode] = useState(searchParams.get('code') || '');
    const [validating, setValidating] = useState(false);
    const [codeError, setCodeError] = useState<string | null>(null);

    // Validated code info
    const [themeId, setThemeId] = useState<string | null>(null);
    const [nicheSlug, setNicheSlug] = useState<string | null>(null);

    // Claim state
    const [names, setNames] = useState('');
    const [date, setDate] = useState('');
    const [claiming, setClaiming] = useState(false);
    const [claimError, setClaimError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [resultSlug, setResultSlug] = useState('');

    // Auto-validate if code comes from URL (returning from auth)
    useEffect(() => {
        const urlCode = searchParams.get('code');
        if (urlCode && urlCode.length > 0) {
            setCode(urlCode);
            handleValidateCode(urlCode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleValidateCode = async (codeToValidate?: string) => {
        const c = codeToValidate || code;
        if (!c.trim()) return;

        setValidating(true);
        setCodeError(null);

        try {
            // Pass auth token if available so API can check for prior redemption
            const headers: Record<string, string> = {};
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const res = await fetch(`/api/redeem?code=${encodeURIComponent(c.trim())}`, { headers });
            const data = await res.json();

            if (!res.ok) {
                setCodeError(data.error || 'Invalid code');
                setValidating(false);
                return;
            }

            // If this user already redeemed this code, skip straight to their site
            if (data.already_redeemed && data.existing_slug) {
                setResultSlug(data.existing_slug);
                setSuccess(true);
                setTimeout(() => {
                    router.push(`/demo/${data.existing_slug}`);
                }, 3000);
                return;
            }

            setThemeId(data.theme_id);
            setNicheSlug(data.niche_slug);
            setPhase('claim');
        } catch {
            setCodeError('Something went wrong. Please try again.');
        } finally {
            setValidating(false);
        }
    };

    const handleClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!names.trim()) return;

        // If not logged in, redirect to auth with return URL
        if (!user) {
            const returnUrl = `/redeem?code=${encodeURIComponent(code.trim())}`;
            router.push(`/auth?redirect=${encodeURIComponent(returnUrl)}`);
            return;
        }

        setClaiming(true);
        setClaimError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                router.push(`/auth?redirect=${encodeURIComponent(`/redeem?code=${code.trim()}`)}`);
                return;
            }

            const res = await fetch('/api/redeem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    code: code.trim(),
                    names: names.trim(),
                    date: date || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // If user already redeemed this code, redirect to their existing site
                if (res.status === 409 && data.existing_slug) {
                    setResultSlug(data.existing_slug);
                    setClaimError(null);
                    setSuccess(true);
                    setTimeout(() => {
                        router.push(`/demo/${data.existing_slug}`);
                    }, 3000);
                    return;
                }
                throw new Error(data.error || 'Failed to redeem code');
            }

            setResultSlug(data.slug);
            setSuccess(true);

            // Redirect to editor after a brief celebration
            setTimeout(() => {
                router.push(`/demo/${data.slug}`);
            }, 3000);
        } catch (err: any) {
            setClaimError(err.message || 'Something went wrong');
        } finally {
            setClaiming(false);
        }
    };

    const generateSlug = (input: string): string => {
        return input
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    // Get display info for the theme
    const themeDisplay = nicheSlug
        ? NICHE_INFO[nicheSlug] || THEME_INFO[themeId || '']
        : THEME_INFO[themeId || ''];

    // Success screen
    if (success) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="relative inline-block mb-6">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
                            <CheckCircle className="w-10 h-10 text-emerald-400" />
                        </div>
                        <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        You're All Set! 🎉
                    </h1>
                    <p className="text-white/40 text-sm mb-2">
                        Your site <span className="text-yellow-500 font-semibold">{resultSlug}</span> is live and ready to customize.
                    </p>
                    <p className="text-white/20 text-xs">
                        Redirecting to your editor...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 pt-14">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-600/10 border border-yellow-600/20 mb-4">
                        <Gift className="w-7 h-7 text-yellow-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Redeem Your Code
                    </h1>
                    <p className="text-white/40 text-sm mt-2">
                        {phase === 'code'
                            ? 'Enter the code from your Etsy purchase'
                            : 'Set up your wedding site'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-8 shadow-2xl">

                    {/* Phase 1: Code Entry */}
                    {phase === 'code' && (
                        <div>
                            {codeError && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    {codeError}
                                </div>
                            )}

                            <div className="mb-5">
                                <label className="block text-[10px] uppercase font-semibold text-white/40 mb-2 tracking-wider">
                                    Redemption Code
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 outline-none transition-all font-mono tracking-wide"
                                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                    spellCheck={false}
                                    autoComplete="off"
                                />
                            </div>

                            <button
                                onClick={() => handleValidateCode()}
                                disabled={validating || !code.trim()}
                                className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold text-sm rounded-lg transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                            >
                                {validating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Validating…
                                    </>
                                ) : (
                                    'Validate Code'
                                )}
                            </button>
                        </div>
                    )}

                    {/* Phase 2: Claim Site */}
                    {phase === 'claim' && (
                        <div>
                            {/* Theme badge */}
                            {themeDisplay && (
                                <div
                                    className="mb-6 p-4 rounded-lg border flex items-center gap-3"
                                    style={{
                                        backgroundColor: `${themeDisplay.color}08`,
                                        borderColor: `${themeDisplay.color}30`,
                                    }}
                                >
                                    <span className="text-2xl">{themeDisplay.emoji}</span>
                                    <div>
                                        <p className="text-white text-sm font-semibold">
                                            {themeDisplay.label} Theme
                                        </p>
                                        <p className="text-white/30 text-xs">
                                            Included with your purchase — ready to customize
                                        </p>
                                    </div>
                                    <CheckCircle
                                        className="w-5 h-5 ml-auto shrink-0"
                                        style={{ color: themeDisplay.color }}
                                    />
                                </div>
                            )}

                            {claimError && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    {claimError}
                                </div>
                            )}

                            {!user && (
                                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm">
                                    You'll need to sign in or create an account to claim your site.
                                </div>
                            )}

                            <form onSubmit={handleClaim} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] uppercase font-semibold text-white/40 mb-2 tracking-wider">
                                        Your Names
                                    </label>
                                    <input
                                        type="text"
                                        value={names}
                                        onChange={(e) => setNames(e.target.value)}
                                        required
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 outline-none transition-all"
                                        placeholder="Alex & Jordan"
                                    />
                                    {names && (
                                        <p className="text-white/20 text-xs mt-2">
                                            URL: /s/<span className="text-yellow-500/60">{generateSlug(names)}</span>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-semibold text-white/40 mb-2 tracking-wider">
                                        Wedding Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 outline-none transition-all [color-scheme:dark]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={claiming || !names.trim()}
                                    className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold text-sm rounded-lg transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                                >
                                    {claiming ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Creating Your Site…
                                        </>
                                    ) : !user ? (
                                        'Sign In & Claim My Site'
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Claim My Site
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Back button */}
                            <button
                                onClick={() => {
                                    setPhase('code');
                                    setThemeId(null);
                                    setNicheSlug(null);
                                }}
                                className="w-full mt-3 text-center text-white/30 hover:text-white/50 text-xs transition-colors"
                            >
                                ← Use a different code
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-white/20 text-xs mt-6">
                    Don't have a code?{' '}
                    <a href="/" className="text-yellow-500/60 hover:text-yellow-500 transition-colors">
                        Create your site directly
                    </a>
                </p>
            </div>
        </main>
    );
}

export default function RedeemPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </main>
        }>
            <RedeemContent />
        </Suspense>
    );
}
