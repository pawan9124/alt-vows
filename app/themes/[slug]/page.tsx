import React from 'react';
import { notFound } from 'next/navigation';
// Verify these paths match your folder structure
import { registry } from '@/components/themes/registry';
import niches from '@/data/niches.json';

// 1. Generate Static Paths (Pre-build these 2 pages)
export async function generateStaticParams() {
    return niches.map((niche) => ({
        slug: niche.slug,
    }));
}

// 2. The Page Controller
export default async function ThemePage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    // A. Look up the Niche
    const niche = niches.find((n) => n.slug === params.slug);

    // B. Safety Check
    if (!niche) return notFound();

    // C. Find the Component (Vintage Vinyl)
    const ThemeComponent = registry[niche.archetypeId];

    if (!ThemeComponent) {
        console.error(`Archetype ID '${niche.archetypeId}' not found in registry.`);
        return notFound();
    }

    // D. Render
    // The 'initialData' prop here feeds into the 'mergeConfig' function we just built
    return (
        <main>
            <ThemeComponent initialData={niche} slug={params.slug} />
        </main>
    );
}
