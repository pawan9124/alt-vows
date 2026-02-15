import React from 'react';
import { supabase } from '@/lib/supabase';
import niches from '@/data/niches.json';
import { mergeConfig } from '@/components/themes/vintage-vinyl/config';
import type { Metadata } from 'next';

interface Props {
    params: Promise<{ id: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id: siteId, slug } = await params;

    try {
        // Try Supabase first
        const { data } = await supabase
            .from('websites')
            .select('content, theme_id')
            .eq('site_id', siteId)
            .maybeSingle();

        let content = data?.content;

        // Fallback to niches.json
        if (!content) {
            const staticConfig = niches.find((n: any) => n.slug === slug);
            if (staticConfig) {
                content = mergeConfig(staticConfig);
            }
        }

        if (!content) {
            return {
                title: 'Demo | Alt-Vows',
                description: 'Preview this interactive wedding website.',
            };
        }

        const names = content.hero?.names || content.defaultContent?.hero?.names || slug;
        const date = content.hero?.date || content.defaultContent?.hero?.date || '';
        const title = `${names} — Wedding Preview | Alt-Vows`;
        const description = date
            ? `Preview ${names}'s wedding website. Date: ${date}.`
            : `Preview ${names}'s interactive wedding website.`;

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
                url: `/demo/${siteId}/${slug}`,
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
            title: 'Wedding Preview | Alt-Vows',
            description: 'Preview this interactive wedding website.',
        };
    }
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
