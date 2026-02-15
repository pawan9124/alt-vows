'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Gift, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { generateSlug } from '@/lib/generateSiteId';

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

            setTimeout(() => {
                router.push(`/demo/${data.slug}`);
            }, 3000);
        } catch (err: any) {
            setClaimError(err.message || 'Something went wrong');
        } finally {
            setClaiming(false);
        }
    };

    const generateSlugLocal = (input: string): string => {
        return generateSlug(input);
    };

    // Get display info for the theme
    const themeDisplay = nicheSlug
        ? NICHE_INFO[nicheSlug] || THEME_INFO[themeId || '']
        : THEME_INFO[themeId || ''];

    // Success screen
    if (success) {
        return (
            <main className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="relative inline-block mb-6">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
                            <CheckCircle className="w-10 h-10 text-emerald-400" />
                        </div>
                        <Sparkles className="w-6 h-6 text-[var(--gold)] absolute -top-1 -right-1 animate-bounce" />
                    </div>
                    <h1
                        className="text-3xl font-bold text-[var(--text-primary)] mb-2"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                        You&apos;re All Set! 🎉
                    </h1>
                    <p className="text-[var(--text-tertiary)] text-sm mb-2">
                        Your site <span className="text-[var(--gold)] font-semibold">{resultSlug}</span> is live and ready to customize.
                    </p>
                    <p className="text-[var(--text-tertiary)] text-xs opacity-50">
                        Redirecting to your editor...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center px-4 pt-14">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-4">
                        <Gift className="w-7 h-7 text-[var(--gold)]" />
                    </div>
                    <h1
                        className="text-3xl font-bold text-[var(--text-primary)] tracking-tight"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                        Redeem Your Code
                    </h1>
                    <p className="text-[var(--text-tertiary)] text-sm mt-2">
                        {phase === 'code'
                            ? 'Enter the code from your Etsy purchase'
                            : 'Set up your site'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 shadow-2xl">

                    {/* Phase 1: Code Entry */}
                    {phase === 'code' && (
                        <div>
                            {codeError && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    {codeError}
                                </div>
                            )}

                            <div className="mb-5">
                                <label className="block text-[10px] uppercase font-semibold text-[var(--text-tertiary)] mb-2 tracking-wider">
                                    Redemption Code
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30 outline-none transition-all tracking-wide"
                                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                    spellCheck={false}
                                    autoComplete="off"
                                />
                            </div>

                            <button
                                onClick={() => handleValidateCode()}
                                disabled={validating || !code.trim()}
                                className="w-full py-3 bg-[var(--gold)] hover:bg-[var(--gold-hover)] disabled:bg-[var(--bg-elevated)] disabled:text-[var(--text-tertiary)] text-[var(--bg-deep)] font-bold text-sm rounded-xl transition-all uppercase tracking-wide flex items-center justify-center gap-2"
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
                                    className="mb-6 p-4 rounded-xl border flex items-center gap-3"
                                    style={{
                                        backgroundColor: `${themeDisplay.color}08`,
                                        borderColor: `${themeDisplay.color}30`,
                                    }}
                                >
                                    <span className="text-2xl">{themeDisplay.emoji}</span>
                                    <div>
                                        <p className="text-[var(--text-primary)] text-sm font-semibold">
                                            {themeDisplay.label} Theme
                                        </p>
                                        <p className="text-[var(--text-tertiary)] text-xs">
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
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    {claimError}
                                </div>
                            )}

                            {!user && (
                                <div className="mb-4 p-3 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-xl text-[var(--gold)] text-sm">
                                    You&apos;ll need to sign in or create an account to claim your site.
                                </div>
                            )}

                            <form onSubmit={handleClaim} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] uppercase font-semibold text-[var(--text-tertiary)] mb-2 tracking-wider">
                                        Your Names
                                    </label>
                                    <input
                                        type="text"
                                        value={names}
                                        onChange={(e) => setNames(e.target.value)}
                                        required
                                        className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30 outline-none transition-all"
                                        placeholder="Alex & Jordan"
                                    />
                                    {names && (
                                        <p className="text-[var(--text-tertiary)] text-xs mt-2">
                                            URL: /s/xxxx/<span className="text-[var(--gold-muted)]">{generateSlugLocal(names)}</span>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-semibold text-[var(--text-tertiary)] mb-2 tracking-wider">
                                        Event Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30 outline-none transition-all [color-scheme:dark]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={claiming || !names.trim()}
                                    className="w-full py-3 bg-[var(--gold)] hover:bg-[var(--gold-hover)] disabled:bg-[var(--bg-elevated)] disabled:text-[var(--text-tertiary)] text-[var(--bg-deep)] font-bold text-sm rounded-xl transition-all uppercase tracking-wide flex items-center justify-center gap-2"
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
                                className="w-full mt-3 text-center text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] text-xs transition-colors"
                            >
                                ← Use a different code
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-[var(--text-tertiary)] text-xs mt-6 opacity-60">
                    Don&apos;t have a code?{' '}
                    <a href="/" className="text-[var(--gold-muted)] hover:text-[var(--gold)] transition-colors">
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
            <main className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--border-subtle)] border-t-[var(--gold)] rounded-full animate-spin" />
            </main>
        }>
            <RedeemContent />
        </Suspense>
    );
}
