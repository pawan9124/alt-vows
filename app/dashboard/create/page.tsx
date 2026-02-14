'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { mergeConfig } from '@/components/themes/vintage-vinyl/config';
import { theVoyagerConfig } from '@/components/themes/the-voyager/config';
import niches from '@/data/niches.json';

const THEME_VIBES = [
    {
        id: 'rock-n-roll',
        label: 'Rock & Roll',
        emoji: '🤘',
        description: 'Heavy riffs, leather & neon glow',
        color: '#e02e2e',
        nicheSlug: 'rock-n-roll-wedding',
        themeId: 'vintage-vinyl',
    },
    {
        id: 'jazz-lounge',
        label: 'Jazz Lounge',
        emoji: '🎷',
        description: 'Smooth gold, velvet & candlelight',
        color: '#d4af37',
        nicheSlug: 'jazz-lounge-wedding',
        themeId: 'vintage-vinyl',
    },
    {
        id: 'cyberpunk',
        label: 'Cyberpunk',
        emoji: '⚡',
        description: 'Neon-soaked futuristic vibes',
        color: '#00f0ff',
        nicheSlug: 'cyberpunk-wedding',
        themeId: 'vintage-vinyl',
    },
    {
        id: 'the-voyager',
        label: 'The Voyager',
        emoji: '✈️',
        description: 'Travel-inspired adventure',
        color: '#f59e0b',
        nicheSlug: null,
        themeId: 'the-voyager',
    },
];

export default function CreateSitePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [names, setNames] = useState('');
    const [date, setDate] = useState('');
    const [selectedVibe, setSelectedVibe] = useState('rock-n-roll');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth');
        }
    }, [user, authLoading, router]);

    const generateSlug = (input: string): string => {
        return input
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    // Normalize "Moly and Goli" or "Moly & Goli" → "Moly & Goli"
    const normalizeNames = (input: string): string => {
        const parts = input.split(/\s+(?:&|and)\s+/i);
        if (parts.length >= 2) {
            return `${parts[0].trim()} & ${parts[1].trim()}`;
        }
        return input.trim();
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !names.trim()) return;

        setCreating(true);
        setError(null);

        try {
            const slug = generateSlug(names);

            // Check if slug already exists
            const { data: existing } = await supabase
                .from('websites')
                .select('slug')
                .eq('slug', slug)
                .maybeSingle();

            if (existing) {
                setError(`A site with the URL "${slug}" already exists. Try different names.`);
                setCreating(false);
                return;
            }

            // 1. Find the selected vibe and its niche config from niches.json
            const vibe = THEME_VIBES.find((v) => v.id === selectedVibe);
            const resolvedThemeId = vibe?.themeId || 'vintage-vinyl';

            let content: any;

            if (resolvedThemeId === 'the-voyager') {
                const formattedDate = date
                    ? new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    }).toUpperCase()
                    : '';

                content = {
                    ...theVoyagerConfig.defaultContent,
                    slug,
                    themeId: 'the-voyager',
                    hero: {
                        ...theVoyagerConfig.defaultContent.hero,
                        names: normalizeNames(names),
                        date: formattedDate || theVoyagerConfig.defaultContent.hero.date,
                    },
                };
            } else {
                const nicheConfig = niches.find((n) => n.slug === vibe?.nicheSlug);
                const baseContent = mergeConfig(nicheConfig || null);

                const formattedDate = date
                    ? new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    }).toUpperCase()
                    : baseContent.hero.date;

                content = {
                    ...baseContent,
                    slug,
                    themeId: resolvedThemeId,
                    hero: {
                        ...baseContent.hero,
                        names: normalizeNames(names),
                        date: formattedDate,
                    },
                };
            }

            // Insert into Supabase
            const { error: insertError } = await supabase.from('websites').insert({
                slug,
                theme_id: resolvedThemeId,
                owner_id: user.id,
                content,
            });

            if (insertError) throw insertError;

            // Redirect to the editor
            router.push(`/demo/${slug}`);
        } catch (err: any) {
            console.error('Error creating site:', err);
            setError(err.message || 'Failed to create site');
            setCreating(false);
        }
    };

    if (authLoading || !user) {
        return (
            <main className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--border-subtle)] border-t-[var(--gold)] rounded-full animate-spin" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--bg-deep)] pt-20 px-4 pb-16">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-sm mb-4 inline-block transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1
                        className="text-3xl font-bold text-[var(--text-primary)] tracking-tight"
                        style={{ fontFamily: 'var(--font-inter)' }}
                    >
                        Create Your Site
                    </h1>
                    <p className="text-[var(--text-tertiary)] text-sm mt-1">
                        Set up the basics. You can customize everything later.
                    </p>
                </div>

                <form onSubmit={handleCreate} className="space-y-8">
                    {/* Names */}
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
                                URL: /demo/<span className="text-[var(--gold-muted)]">{generateSlug(names)}</span>
                            </p>
                        )}
                    </div>

                    {/* Date */}
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

                    {/* Vibe Selection */}
                    <div>
                        <label className="block text-[10px] uppercase font-semibold text-[var(--text-tertiary)] mb-3 tracking-wider">
                            Choose Your Vibe
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {THEME_VIBES.map((vibe) => (
                                <button
                                    key={vibe.id}
                                    type="button"
                                    onClick={() => setSelectedVibe(vibe.id)}
                                    className={`relative p-5 rounded-xl border-2 text-left transition-all ${selectedVibe === vibe.id
                                        ? 'border-[var(--gold)] bg-[var(--gold)]/5'
                                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-active)]'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{vibe.emoji}</div>
                                    <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-1">
                                        {vibe.label}
                                    </h3>
                                    <p className="text-[var(--text-tertiary)] text-xs leading-relaxed">
                                        {vibe.description}
                                    </p>
                                    {/* Color dot */}
                                    <div
                                        className="absolute top-4 right-4 w-3 h-3 rounded-full"
                                        style={{ backgroundColor: vibe.color }}
                                    />
                                    {/* Selected check */}
                                    {selectedVibe === vibe.id && (
                                        <div className="absolute top-4 right-4 w-5 h-5 bg-[var(--gold)] rounded-full flex items-center justify-center">
                                            <span className="text-[var(--bg-deep)] text-xs font-bold">✓</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={creating || !names.trim()}
                        className="w-full py-3.5 bg-[var(--gold)] hover:bg-[var(--gold-hover)] disabled:bg-[var(--bg-elevated)] disabled:text-[var(--text-tertiary)] text-[var(--bg-deep)] font-bold text-sm rounded-xl transition-all uppercase tracking-wide"
                    >
                        {creating ? 'Creating…' : 'Create & Start Editing'}
                    </button>
                </form>
            </div>
        </main>
    );
}
