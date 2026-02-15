import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase-server';
import { mergeConfig } from '@/components/themes/vintage-vinyl/config';
import { theVoyagerConfig } from '@/components/themes/the-voyager/config';
import niches from '@/data/niches.json';
import { generateSlug, generateSiteId, normalizeNames } from '@/lib/generateSiteId';

// Validate a code without redeeming (GET ?code=xxx)
// Optionally checks if the authenticated user already redeemed this code
export async function GET(req: NextRequest) {
    try {
        const code = req.nextUrl.searchParams.get('code');

        if (!code) {
            return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
        }

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(code)) {
            return NextResponse.json({ error: 'Invalid code format' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('redemption_codes')
            .select('code, theme_id, niche_slug, active, use_count, max_uses')
            .eq('code', code)
            .maybeSingle();

        if (error || !data) {
            return NextResponse.json({ error: 'Invalid redemption code' }, { status: 404 });
        }

        if (!data.active) {
            return NextResponse.json({ error: 'This code has been deactivated' }, { status: 410 });
        }

        if (data.max_uses && data.use_count >= data.max_uses) {
            return NextResponse.json({ error: 'This code has reached its maximum number of uses' }, { status: 410 });
        }

        // Check if the authenticated user already redeemed this code
        let alreadyRedeemed = false;
        let existingSlug: string | null = null;

        const authHeader = req.headers.get('authorization');
        if (authHeader) {
            try {
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    { global: { headers: { Authorization: authHeader } } }
                );
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: existingSite } = await supabaseAdmin
                        .from('websites')
                        .select('slug, site_id')
                        .eq('owner_id', user.id)
                        .like('payment_id', `redeem-${code}%`)
                        .maybeSingle();

                    if (existingSite) {
                        alreadyRedeemed = true;
                        existingSlug = existingSite.site_id + '/' + existingSite.slug;
                    }
                }
            } catch {
                // Auth check is optional — if it fails, just proceed normally
            }
        }

        return NextResponse.json({
            valid: true,
            theme_id: data.theme_id,
            niche_slug: data.niche_slug,
            already_redeemed: alreadyRedeemed,
            existing_slug: existingSlug,
        });
    } catch (err: any) {
        console.error('[Redeem] Validation error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Redeem a code (POST)
export async function POST(req: NextRequest) {
    try {
        const { code, names, date } = await req.json();

        if (!code || !names) {
            return NextResponse.json(
                { error: 'Missing required fields: code, names' },
                { status: 400 }
            );
        }

        // Verify the user is authenticated
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Look up the redemption code
        const { data: codeData, error: codeError } = await supabaseAdmin
            .from('redemption_codes')
            .select('*')
            .eq('code', code)
            .maybeSingle();

        if (codeError || !codeData) {
            return NextResponse.json({ error: 'Invalid redemption code' }, { status: 404 });
        }

        if (!codeData.active) {
            return NextResponse.json({ error: 'This code has been deactivated' }, { status: 410 });
        }

        if (codeData.max_uses && codeData.use_count >= codeData.max_uses) {
            return NextResponse.json({ error: 'This code has reached its maximum number of uses' }, { status: 410 });
        }

        // Check if this user already redeemed this code (prevent duplicates)
        const paymentIdPrefix = `redeem-${codeData.code}`;
        const { data: existingSite } = await supabaseAdmin
            .from('websites')
            .select('slug, site_id')
            .eq('owner_id', user.id)
            .like('payment_id', `${paymentIdPrefix}%`)
            .maybeSingle();

        if (existingSite) {
            return NextResponse.json({
                error: 'You have already redeemed this code. Check your dashboard for your existing site.',
                existing_slug: existingSite.site_id + '/' + existingSite.slug,
            }, { status: 409 });
        }

        // Generate slug and siteId from names
        const slug = generateSlug(names);
        const siteId = generateSiteId();

        // Build site content based on theme
        const themeId = codeData.theme_id;
        const nicheSlug = codeData.niche_slug;
        let content: any;

        if (themeId === 'the-voyager') {
            const formattedDate = date
                ? new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                }).toUpperCase()
                : '';

            content = {
                ...theVoyagerConfig.defaultContent,
                slug,
                siteId,
                themeId: 'the-voyager',
                nicheSlug: null,
                hero: {
                    ...theVoyagerConfig.defaultContent.hero,
                    names: normalizeNames(names),
                    date: formattedDate || theVoyagerConfig.defaultContent.hero.date,
                },
            };
        } else {
            // Vintage Vinyl — use mergeConfig with niche data
            const nicheConfig = niches.find((n) => n.slug === nicheSlug);
            const baseContent = mergeConfig(nicheConfig || null);

            const formattedDate = date
                ? new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                }).toUpperCase()
                : baseContent.hero.date;

            content = {
                ...baseContent,
                slug,
                siteId,
                themeId,
                nicheSlug: nicheSlug || null,
                hero: {
                    ...baseContent.hero,
                    names: normalizeNames(names),
                    date: formattedDate,
                },
            };
        }

        // Insert the website with status 'production' (pre-paid!)
        const { error: insertError } = await supabaseAdmin.from('websites').insert({
            slug,
            site_id: siteId,
            theme_id: themeId,
            owner_id: user.id,
            content,
            status: 'production',
            payment_id: `redeem-${codeData.code}-${user.id.slice(0, 8)}`,
        });

        if (insertError) {
            console.error('[Redeem] Website insert error:', insertError.message);
            return NextResponse.json({ error: 'Failed to create website' }, { status: 500 });
        }

        // Increment the use_count on the redemption code
        const { error: updateError } = await supabaseAdmin
            .from('redemption_codes')
            .update({
                use_count: (codeData.use_count || 0) + 1,
            })
            .eq('code', code);

        if (updateError) {
            console.error('[Redeem] Code update error:', updateError.message);
            // Site was created, so don't fail — just log
        }

        console.log(`[Redeem] Code ${code} redeemed by ${user.email} → site "${siteId}/${slug}" (production, use #${(codeData.use_count || 0) + 1})`);

        return NextResponse.json({ slug: `${siteId}/${slug}`, site_id: siteId, status: 'production' });
    } catch (err: any) {
        console.error('[Redeem] Unexpected error:', err);
        return NextResponse.json(
            { error: err.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
