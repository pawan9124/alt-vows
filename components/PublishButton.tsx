'use client';

import React, { useState } from 'react';
import { Rocket, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PublishButtonProps {
    slug: string;
    compact?: boolean; // For editor toolbar (smaller)
}

export const PublishButton: React.FC<PublishButtonProps> = ({ slug, compact = false }) => {
    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        setLoading(true);
        try {
            // Get the current session token
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                alert('Please sign in to publish your site.');
                setLoading(false);
                return;
            }

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ slug }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create checkout');
            }

            // Redirect to LemonSqueezy checkout
            window.location.href = data.url;
        } catch (err: any) {
            console.error('Publish error:', err);
            alert(err.message || 'Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    if (compact) {
        return (
            <button
                onClick={handlePublish}
                disabled={loading}
                className="w-full py-3 font-bold text-sm rounded transition-all uppercase tracking-wide flex items-center justify-center gap-2 text-black disabled:opacity-50"
                style={{
                    background: loading
                        ? '#555'
                        : 'linear-gradient(135deg, #d4af37, #f5d060, #d4af37)',
                }}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                    </>
                ) : (
                    <>
                        <Rocket className="w-4 h-4" /> Publish — $49
                    </>
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handlePublish}
            disabled={loading}
            className="flex-1 text-center px-3 py-2 font-bold text-xs rounded-lg transition-all uppercase tracking-wide flex items-center justify-center gap-1.5 text-black disabled:opacity-50"
            style={{
                background: loading
                    ? '#555'
                    : 'linear-gradient(135deg, #d4af37, #f5d060, #d4af37)',
            }}
        >
            {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
                <>
                    <Rocket className="w-3.5 h-3.5" /> Publish $49
                </>
            )}
        </button>
    );
};
