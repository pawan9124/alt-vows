'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { PublishButton } from '@/components/PublishButton';
import { ConfettiSuccess } from '@/components/ConfettiSuccess';
import { ExternalLink, Copy, Check, Users } from 'lucide-react';

interface WebsiteRow {
    slug: string;
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

    // Payment success state
    const paymentSuccess = searchParams.get('payment') === 'success';
    const paymentSlug = searchParams.get('slug');
    const [showConfetti, setShowConfetti] = useState(paymentSuccess);

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
            }
            setLoading(false);
        }

        fetchSites();
    }, [user]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const handleDismissConfetti = () => {
        setShowConfetti(false);
        // Clean up URL params
        router.replace('/dashboard');
    };

    const handleCopyLink = (slug: string) => {
        const url = `${window.location.origin}/s/${slug}`;
        navigator.clipboard.writeText(url);
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 2000);
    };

    // Show nothing while checking auth
    if (authLoading || !user) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] pt-20 px-4">
            {/* Confetti celebration after payment */}
            {showConfetti && paymentSlug && (
                <ConfettiSuccess slug={paymentSlug} onDismiss={handleDismissConfetti} />
            )}

            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            My Wedding Sites
                        </h1>
                        <p className="text-white/40 text-sm mt-1">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/create"
                            className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-sm rounded-lg transition-all uppercase tracking-wide"
                        >
                            + New Site
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm rounded-lg transition-all border border-white/10"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                ) : sites.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <div className="text-6xl mb-6">💿</div>
                        <h2 className="text-xl font-semibold text-white mb-2">
                            You haven't created a wedding site yet
                        </h2>
                        <p className="text-white/40 text-sm mb-8 max-w-md">
                            Start building your unique, music-inspired wedding invitation
                            that your guests will never forget.
                        </p>
                        <Link
                            href="/dashboard/create"
                            className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-sm rounded-lg transition-all uppercase tracking-wide"
                        >
                            Create Your First Site
                        </Link>
                    </div>
                ) : (
                    /* Site Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {sites.map((site) => {
                            const content = site.content || {};
                            const names = content.hero?.names || site.slug;
                            const title = content.hero?.title || '';
                            const primary = content.theme?.global?.palette?.primary || '#666';
                            const lastEdited = site.updated_at || site.created_at;
                            const isLive = site.status === 'production';

                            return (
                                <div
                                    key={site.slug}
                                    className="bg-[#111] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group"
                                >
                                    {/* Color Banner */}
                                    <div
                                        className="h-24 relative overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${primary}40, ${primary}15)`,
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                background: `radial-gradient(circle at 70% 30%, ${primary}, transparent 60%)`,
                                            }}
                                        />
                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            {isLive ? (
                                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                    Live
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                                    Demo
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5">
                                        <h3 className="text-white font-semibold text-lg mb-0.5">
                                            {names}
                                        </h3>
                                        {title && (
                                            <p className="text-white/30 text-xs mb-3 truncate">
                                                {title}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 text-[11px] text-white/30 mb-5">
                                            <span className="capitalize">{site.theme_id?.replace(/-/g, ' ')}</span>
                                            <span>·</span>
                                            <span>
                                                {lastEdited
                                                    ? new Date(lastEdited).toLocaleDateString()
                                                    : 'Unknown'}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/demo/${site.slug}`}
                                                    className="flex-1 text-center px-3 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-xs rounded-lg transition-all uppercase tracking-wide"
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
                                                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-semibold rounded-lg transition-all border border-white/10 uppercase tracking-wide"
                                                >
                                                    <Users className="w-3.5 h-3.5" /> View RSVPs
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="text-white/60 text-sm">Loading dashboard...</div>
            </main>
        }>
            <DashboardContent />
        </Suspense>
    );
}
