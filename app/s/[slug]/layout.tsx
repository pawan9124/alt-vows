import React from 'react';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const { data } = await supabase
            .from('websites')
            .select('content, theme_id')
            .eq('slug', slug)
            .eq('status', 'production')
            .maybeSingle();

        if (!data?.content) {
            return {
                title: 'Site Not Found | Alt-Vows',
                description: 'This wedding site could not be found.',
            };
        }

        const content = data.content;
        const names = content.hero?.names || content.defaultContent?.hero?.names || slug;
        const date = content.hero?.date || content.defaultContent?.hero?.date || '';
        const title = `${names} — Wedding Invitation`;
        const description = date
            ? `You're invited to ${names}'s wedding on ${date}. View their interactive wedding website.`
            : `You're invited to ${names}'s wedding. View their interactive wedding website.`;

        // Try to get an OG image from gallery or story image
        const ogImage =
            content.story?.image ||
            content.gallery?.images?.[0] ||
            content.defaultContent?.story?.image ||
            null;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                type: 'website',
                url: `/s/${slug}`,
                ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                ...(ogImage ? { images: [ogImage] } : {}),
            },
        };
    } catch {
        return {
            title: 'Wedding Invitation | Alt-Vows',
            description: 'View this interactive wedding website.',
        };
    }
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
