import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
    try {
        const { count, theme_id, niche_slug, secret, source, max_uses } = await req.json();

        // Verify admin secret
        const adminSecret = process.env.ADMIN_SECRET;
        if (!adminSecret || adminSecret === 'your_admin_secret_here') {
            return NextResponse.json(
                { error: 'ADMIN_SECRET not configured' },
                { status: 500 }
            );
        }

        if (secret !== adminSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!count || !theme_id || count < 1 || count > 100) {
            return NextResponse.json(
                { error: 'Provide count (1-100) and theme_id' },
                { status: 400 }
            );
        }

        // Generate the rows — Supabase auto-generates the UUID `code` via DEFAULT
        const rows = Array.from({ length: count }, () => ({
            theme_id,
            niche_slug: niche_slug || null,
            source: source || 'etsy',
            max_uses: max_uses || null,  // null = unlimited
            use_count: 0,
            active: true,
        }));

        const { data, error } = await supabaseAdmin
            .from('redemption_codes')
            .insert(rows)
            .select('code, theme_id, niche_slug, max_uses, source');

        if (error) {
            console.error('[Admin] Code generation error:', error.message);
            return NextResponse.json({ error: 'Failed to generate codes' }, { status: 500 });
        }

        console.log(`[Admin] Generated ${count} redemption codes for theme "${theme_id}" (source: ${source || 'etsy'})`);

        return NextResponse.json({
            generated: data?.length || 0,
            codes: data?.map((row) => ({
                code: row.code,
                redeem_url: `/redeem?code=${row.code}`,
            })) || [],
            theme_id,
            niche_slug: niche_slug || null,
            max_uses: max_uses || 'unlimited',
            source: source || 'etsy',
        });
    } catch (err: any) {
        console.error('[Admin] Unexpected error:', err);
        return NextResponse.json(
            { error: err.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
