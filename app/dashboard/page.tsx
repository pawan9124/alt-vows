'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { PublishButton } from '@/components/PublishButton';
import { Copy, Check, Users, Plus, Palette, LayoutGrid, Trash2, Tag, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import niches from '@/data/niches.json';

interface WebsiteRow {
    slug: string;
    site_id: string;
    theme_id: string;
    content: any;
    status: string;
    payment_id?: string;
    created_at: string;
    updated_at?: string;
}

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading, signOut } = useAuth();
    const [sites, setSites] = useState<WebsiteRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
    const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
    const [activeTab, setActiveTab] = useState<'themes' | 'sites'>('themes');

    // Payment success state
    const paymentSuccess = searchParams.get('payment') === 'success';
    const paymentSlug = searchParams.get('slug');
    const [showToast, setShowToast] = useState(paymentSuccess);

    // Auto-dismiss toast
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
                router.replace('/dashboard');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showToast, router]);

    // Redirect to auth if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth');
        }
    }, [user, authLoading, router]);

    // Fetch user's sites
    useEffect(() => {
        if (!user) return;

        async function fetchSites() {
            const { data, error } = await supabase
                .from('websites')
                .select('*')
                .eq('owner_id', user!.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching sites:', error.message);
            } else {
                setSites(data || []);

                // Fetch RSVP counts for live sites
                const liveSlugs = (data || []).filter(s => s.status === 'production').map(s => s.slug);
                if (liveSlugs.length > 0) {
                    const { data: guests } = await supabase
                        .from('guests')
                        .select('wedding_id')
                        .in('wedding_id', liveSlugs);

                    if (guests) {
                        const counts: Record<string, number> = {};
                        guests.forEach(g => {
                            counts[g.wedding_id] = (counts[g.wedding_id] || 0) + 1;
                        });
                        setRsvpCounts(counts);
                    }
                }
            }
            setLoading(false);
        }

        fetchSites();
    }, [user]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const handleDeleteSite = async (slug: string) => {
        const site = sites.find(s => s.slug === slug);
        const label = site?.content?.hero?.names || slug;
        if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;

        try {
            const { error } = await supabase
                .from('websites')
                .delete()
                .eq('slug', slug)
                .eq('owner_id', user!.id);

            if (error) throw error;
            setSites(prev => prev.filter(s => s.slug !== slug));
        } catch (err: any) {
            console.error('Delete failed:', err.message);
            alert('Failed to delete site. Check console for details.');
        }
    };

    const handleCopyLink = (slug: string) => {
        const site = sites.find(s => s.slug === slug);
        const url = `${window.location.origin}/s/${site?.site_id || ''}/${slug}`;
        navigator.clipboard.writeText(url);
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 2000);
    };

    // Stats
    const totalSites = sites.length;
    const liveSites = sites.filter(s => s.status === 'production').length;
    const totalRsvps = Object.values(rsvpCounts).reduce((a, b) => a + b, 0);

    // Show nothing while checking auth
    if (authLoading || !user) {
        return (
            <main className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--border-subtle)] border-t-[var(--gold)] rounded-full animate-spin" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--bg-deep)] pt-20 px-4 pb-16">
            {/* Payment Success Toast */}
            <AnimatePresence>
                {showToast && paymentSlug && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-emerald-900/90 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium shadow-xl backdrop-blur-sm"
                    >
                        🎉 Your site is live! Share it with your guests.
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1
                            className="text-3xl font-bold text-[var(--text-primary)] tracking-tight"
                            style={{ fontFamily: 'var(--font-inter)' }}
                        >
                            My Sites
                        </h1>
                        <p className="text-[var(--text-tertiary)] text-sm mt-1">
                            {totalSites} site{totalSites !== 1 ? 's' : ''}
                            {liveSites > 0 && <> · {liveSites} live</>}
                            {totalRsvps > 0 && <> · {totalRsvps} RSVP{totalRsvps !== 1 ? 's' : ''}</>}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/create"
                            className="px-5 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--bg-deep)] font-bold text-sm rounded-xl transition-all uppercase tracking-wide"
                        >
                            + New Site
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm rounded-xl transition-all border border-[var(--border-subtle)]"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 mb-8 bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-subtle)] w-fit">
                    <button
                        onClick={() => setActiveTab('themes')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'themes'
                            ? 'bg-[var(--gold)] text-[var(--bg-deep)] shadow-md'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                            }`}
                    >
                        <Palette className="w-4 h-4" />
                        Themes
                    </button>
                    <button
                        onClick={() => setActiveTab('sites')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'sites'
                            ? 'bg-[var(--gold)] text-[var(--bg-deep)] shadow-md'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        My Sites
                        {totalSites > 0 && (
                            <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${activeTab === 'sites'
                                ? 'bg-[var(--bg-deep)]/20 text-[var(--bg-deep)]'
                                : 'bg-[var(--gold)]/15 text-[var(--gold)]'
                                }`}>{totalSites}</span>
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'themes' ? (
                    /* ─── Themes Storefront ─── */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {(niches as any[]).map((niche, index) => {
                            const primary = niche.theme?.global?.palette?.primary || 'var(--gold)';
                            const bgImage = niche.theme?.pages?.landing?.backgroundValue || niche.theme?.pages?.gatekeeper?.backgroundTexture;
                            // Match ownership: only production sites count as "Purchased"
                            const ownedSite = sites.find(s => {
                                if (s.status !== 'production') return false;
                                // Direct nicheSlug match (new sites)
                                if (s.content?.nicheSlug === niche.slug) return true;
                                // Fallback: same theme_id + same primary color (for sites created before nicheSlug was stored)
                                if (s.theme_id === niche.archetypeId) {
                                    const sitePrimary = s.content?.theme?.global?.palette?.primary;
                                    if (sitePrimary && sitePrimary === primary) return true;
                                }
                                return false;
                            });

                            return (
                                <motion.div
                                    key={niche.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
                                    className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-[var(--border-active)] transition-all group"
                                >
                                    {/* Theme Preview Banner */}
                                    <div
                                        className="h-36 relative overflow-hidden"
                                        style={{
                                            background: bgImage
                                                ? `url(${bgImage}) center/cover`
                                                : `linear-gradient(135deg, ${primary}30, ${primary}08, var(--bg-deep))`,
                                        }}
                                    >
                                        {/* Overlay for readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                        {/* Accent glow */}
                                        <div
                                            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30"
                                            style={{ background: primary }}
                                        />

                                        {/* Owned badge */}
                                        {ownedSite && (
                                            <div className="absolute top-3 right-3">
                                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm"
                                                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                                                >
                                                    ✅ Purchased
                                                </span>
                                            </div>
                                        )}

                                        {/* Theme name overlay */}
                                        <div className="absolute bottom-3 left-4 right-4">
                                            <h3 className="text-white font-bold text-lg drop-shadow-md">
                                                {niche.hero?.title || niche.slug.replace(/-/g, ' ')}
                                            </h3>
                                            <p className="text-white/70 text-xs mt-0.5 capitalize">
                                                {niche.archetypeId?.replace(/-/g, ' ')} theme
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5">
                                        <p className="text-[var(--text-tertiary)] text-xs mb-3">
                                            {niche.hero?.names || 'Preview names'} · {niche.hero?.date || 'Date TBD'}
                                        </p>

                                        {/* Price / Purchased indicator */}
                                        <div className="flex items-center gap-2 mb-4">
                                            {ownedSite ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                                    <Check className="w-3 h-3" /> Purchased
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                                                    <Tag className="w-3 h-3" /> $49
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            {ownedSite ? (
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/demo/${ownedSite.site_id}/${ownedSite.slug}`}
                                                        className="flex-1 text-center px-3 py-2 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--bg-deep)] font-bold text-xs rounded-lg transition-all uppercase tracking-wide"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={`/themes/${niche.slug}`}
                                                        className="flex-1 text-center px-3 py-2 bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs rounded-lg transition-all border border-[var(--border-subtle)] uppercase tracking-wide"
                                                    >
                                                        Preview
                                                    </Link>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={`/themes/${niche.slug}`}
                                                            className="flex-1 text-center px-3 py-2 bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs rounded-lg transition-all border border-[var(--border-subtle)] uppercase tracking-wide"
                                                        >
                                                            Preview
                                                        </Link>
                                                        <Link
                                                            href="/redeem"
                                                            className="flex-1 text-center px-3 py-2 bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs rounded-lg transition-all border border-[var(--border-subtle)] uppercase tracking-wide flex items-center justify-center gap-1"
                                                        >
                                                            <Gift className="w-3 h-3" /> Redeem
                                                        </Link>
                                                    </div>
                                                    <Link
                                                        href={`/dashboard/create?theme=${niche.slug}`}
                                                        className="w-full text-center px-3 py-2 bg-[var(--bg-surface)] hover:bg-[var(--gold)]/10 text-[var(--gold)] hover:text-[var(--gold)] font-bold text-xs rounded-lg transition-all border border-[var(--gold)]/30 uppercase tracking-wide"
                                                    >
                                                        ✨ Try Demo
                                                    </Link>
                                                    <Link
                                                        href="/redeem"
                                                        className="w-full text-center px-3 py-2 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--bg-deep)] font-bold text-xs rounded-lg transition-all uppercase tracking-wide"
                                                    >
                                                        $49 Buy
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[var(--border-subtle)] border-t-[var(--gold)] rounded-full animate-spin" />
                    </div>
                ) : sites.length === 0 ? (
                    /* ─── Empty State ─── */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-28 text-center"
                    >
                        <div className="w-20 h-20 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center mb-6">
                            <span className="text-4xl">✦</span>
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                            Your love story starts here.
                        </h2>
                        <p className="text-[var(--text-tertiary)] text-sm mb-8 max-w-md">
                            Choose a theme, add your details, and create an invitation
                            your guests will actually remember.
                        </p>
                        <Link
                            href="/dashboard/create"
                            className="px-8 py-3 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--bg-deep)] font-bold text-sm rounded-xl transition-all uppercase tracking-wide"
                        >
                            Create Your First Site
                        </Link>
                    </motion.div>
                ) : (
                    /* ─── Site Cards Grid — original 3-column ─── */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {sites.map((site, index) => {
                            const content = site.content || {};
                            const names = content.hero?.names || site.slug;
                            const title = content.hero?.title || '';
                            const primary = content.theme?.global?.palette?.primary || 'var(--gold)';
                            const lastEdited = site.updated_at || site.created_at;
                            const isLive = site.status === 'production';
                            const rsvpCount = rsvpCounts[site.slug] || 0;

                            return (
                                <motion.div
                                    key={site.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
                                    className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-[var(--border-active)] transition-all group"
                                >
                                    {/* Color Banner — original style with SVG pattern overlay */}
                                    <div
                                        className="h-28 relative overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${primary}30, ${primary}08, var(--bg-deep))`,
                                        }}
                                    >
                                        {/* Radial glow */}
                                        <div
                                            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-40"
                                            style={{ background: primary }}
                                        />

                                        {/* SVG dot pattern */}
                                        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id={`pat-${site.slug}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                                    <circle cx="20" cy="20" r="1.5" fill="currentColor" />
                                                    <circle cx="0" cy="0" r="1" fill="currentColor" />
                                                    <circle cx="40" cy="0" r="1" fill="currentColor" />
                                                    <circle cx="0" cy="40" r="1" fill="currentColor" />
                                                    <circle cx="40" cy="40" r="1" fill="currentColor" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill={`url(#pat-${site.slug})`} style={{ color: primary }} />
                                        </svg>

                                        {/* Floating niche icon */}
                                        <div className="absolute bottom-3 left-5 text-3xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                                            {content.nicheSlug?.includes('rock') ? '🤘'
                                                : content.nicheSlug?.includes('jazz') ? '🎷'
                                                    : content.nicheSlug?.includes('cyber') ? '⚡'
                                                        : '✦'}
                                        </div>

                                        {/* Gradient accent line */}
                                        <div
                                            className="absolute -bottom-px left-0 right-0 h-px"
                                            style={{ background: `linear-gradient(90deg, transparent, ${primary}50, transparent)` }}
                                        />

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            {isLive ? (
                                                <span
                                                    className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm"
                                                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                                                >
                                                    Live
                                                </span>
                                            ) : (
                                                <span
                                                    className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/25 backdrop-blur-sm"
                                                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                                                >
                                                    Demo
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5">
                                        <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-0.5">
                                            {names}
                                        </h3>
                                        {title && (
                                            <p className="text-[var(--text-tertiary)] text-xs mb-1 truncate">
                                                {title}
                                            </p>
                                        )}
                                        <div
                                            className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] mb-1"
                                            style={{ fontFamily: 'var(--font-jetbrains)' }}
                                        >
                                            <span className="capitalize">{site.theme_id?.replace(/-/g, ' ')}</span>
                                            <span>·</span>
                                            <span>
                                                {lastEdited
                                                    ? new Date(lastEdited).toLocaleDateString()
                                                    : 'Unknown'}
                                            </span>
                                        </div>
                                        {/* RSVP count for live sites */}
                                        {isLive && rsvpCount > 0 && (
                                            <p
                                                className="text-[11px] text-[var(--text-tertiary)] mb-1"
                                                style={{ fontFamily: 'var(--font-jetbrains)' }}
                                            >
                                                {rsvpCount} RSVP{rsvpCount !== 1 ? 's' : ''}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 mt-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/demo/${site.site_id}/${site.slug}`}
                                                    className="flex-1 text-center px-3 py-2 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--bg-deep)] font-bold text-xs rounded-lg transition-all uppercase tracking-wide"
                                                >
                                                    Edit
                                                </Link>
                                                {isLive ? (
                                                    <button
                                                        onClick={() => handleCopyLink(site.slug)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg transition-all border border-emerald-500/20 uppercase tracking-wide"
                                                    >
                                                        {copiedSlug === site.slug ? (
                                                            <><Check className="w-3.5 h-3.5" /> Copied!</>
                                                        ) : (
                                                            <><Copy className="w-3.5 h-3.5" /> Share Link</>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <PublishButton slug={site.slug} />
                                                )}
                                            </div>
                                            {isLive && (
                                                <Link
                                                    href={`/dashboard/guests/${site.slug}`}
                                                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold rounded-lg transition-all border border-[var(--border-subtle)] uppercase tracking-wide"
                                                >
                                                    <Users className="w-3.5 h-3.5" /> View RSVPs
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleDeleteSite(site.slug)}
                                                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/5 hover:bg-red-500/15 text-red-400/60 hover:text-red-400 text-xs font-semibold rounded-lg transition-all border border-red-500/10 hover:border-red-500/30 uppercase tracking-wide"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* ─── "+ Create New Site" Card ─── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sites.length * 0.08, duration: 0.4, ease: 'easeOut' }}
                        >
                            <Link
                                href="/dashboard/create"
                                className="min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-subtle)] rounded-2xl cursor-pointer transition-all duration-200 hover:border-[var(--gold)] hover:bg-[var(--gold)]/[0.03] group h-full"
                            >
                                <Plus className="w-10 h-10 text-[var(--gold)] mb-3 group-hover:scale-110 transition-transform" />
                                <span className="text-base font-semibold text-[var(--text-primary)]">
                                    Create a New Site
                                </span>
                                <span className="text-[13px] text-[var(--text-tertiary)] mt-1">
                                    Choose a theme. Tell your story.
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--border-subtle)] border-t-[var(--gold)] rounded-full animate-spin" />
            </main>
        }>
            <DashboardContent />
        </Suspense>
    );
}
