import { notFound } from 'next/navigation';
import niches from '@/data/niches.json';
import { registry } from '@/components/themes/registry';

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
    // Await the params (Next.js 15 requirement)
    const { slug } = await params;

    // 1. Find the Niche Data
    const niche = niches.find((n) => n.slug === slug);

    if (!niche) {
        return notFound();
    }

    // 2. Load the Component
    const ThemeComponent = registry[niche.archetypeId];

    // 3. FORCE GATEKEEPER MODE (The Fix)
    // We create a copy of the data but REMOVE the landing config.
    // This tricks the component into thinking no landing page exists.
    const demoData = {
        ...niche,
        theme: {
            ...(niche as any).theme,
            pages: {
                ...(niche as any).theme?.pages,
                landing: undefined // <--- THIS LINE FORCES THE CARD VIEW
            }
        }
    };

    return (
        <main className="w-full h-screen overflow-hidden">
            <ThemeComponent initialData={demoData} />
        </main>
    );
}
