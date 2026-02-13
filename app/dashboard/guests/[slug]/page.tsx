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
                // Not owner or site not found
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
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </main>
        );
    }

    if (!isOwner) return null;

    return (
        <main className="min-h-screen bg-[#0a0a0a] pt-20 px-4 pb-16">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="text-white/40 hover:text-white text-sm mb-4 inline-flex items-center gap-1.5 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Guest RSVPs
                    </h1>
                    <p className="text-white/40 text-sm mt-1">{siteName}</p>
                </div>

                {/* Guest List Component */}
                <GuestList weddingId={slug} />
            </div>
        </main>
    );
}
