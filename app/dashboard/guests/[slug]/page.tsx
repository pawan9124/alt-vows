'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { GuestList } from '@/components/GuestList';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
    params: Promise<{ slug: string }>;
}

export default function GuestListPage({ params }: Props) {
    const { slug } = React.use(params);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [siteName, setSiteName] = useState<string>('');
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth');
        }
    }, [user, authLoading, router]);

    // Verify ownership
    useEffect(() => {
        if (!user) return;

        async function verify() {
            const { data, error } = await supabase
                .from('websites')
                .select('slug, content, owner_id, status')
                .eq('slug', slug)
                .eq('owner_id', user!.id)
                .maybeSingle();

            if (error || !data) {
                router.push('/dashboard');
                return;
            }

            setSiteName(data.content?.hero?.names || slug);
            setIsOwner(true);
            setLoading(false);
        }

        verify();
    }, [user, slug, router]);

    if (authLoading || !user || loading) {
        return (
            <main className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--border-subtle)] border-t-[var(--gold)] rounded-full animate-spin" />
            </main>
        );
    }

    if (!isOwner) return null;

    return (
        <main className="min-h-screen bg-[var(--bg-deep)] pt-20 px-4 pb-16">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-sm mb-4 inline-flex items-center gap-1.5 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                    </Link>
                    <h1
                        className="text-3xl font-bold text-[var(--text-primary)] tracking-tight"
                        style={{ fontFamily: 'var(--font-inter)' }}
                    >
                        Guest RSVPs
                    </h1>
                    <p className="text-[var(--text-tertiary)] text-sm mt-1">{siteName}</p>
                </div>

                {/* Guest List Component */}
                <GuestList weddingId={slug} />
            </div>
        </main>
    );
}
