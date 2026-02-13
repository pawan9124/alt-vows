import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    try {
        const { slug } = await req.json();

        if (!slug) {
            return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
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

        // Verify the site belongs to this user
        const { data: site, error: siteError } = await supabase
            .from('websites')
            .select('slug, owner_id, status')
            .eq('slug', slug)
            .eq('owner_id', user.id)
            .maybeSingle();

        if (siteError || !site) {
            return NextResponse.json({ error: 'Site not found' }, { status: 404 });
        }

        if (site.status === 'production') {
            return NextResponse.json({ error: 'Site is already published' }, { status: 400 });
        }

        // Create LemonSqueezy checkout
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const checkoutPayload = {
            data: {
                type: 'checkouts',
                attributes: {
                    checkout_data: {
                        custom: {
                            website_slug: slug,
                        },
                    },
                    product_options: {
                        redirect_url: `${appUrl}/dashboard?payment=success&slug=${slug}`,
                    },
                },
                relationships: {
                    store: {
                        data: {
                            type: 'stores',
                            id: process.env.LEMONSQUEEZY_STORE_ID!,
                        },
                    },
                    variant: {
                        data: {
                            type: 'variants',
                            id: process.env.LEMONSQUEEZY_VARIANT_ID!,
                        },
                    },
                },
            },
        };

        const lsResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
            },
            body: JSON.stringify(checkoutPayload),
        });

        if (!lsResponse.ok) {
            const errorBody = await lsResponse.text();
            console.error('[Checkout] LemonSqueezy error:', lsResponse.status, errorBody);
            return NextResponse.json(
                { error: 'Failed to create checkout session' },
                { status: 500 }
            );
        }

        const lsData = await lsResponse.json();
        const checkoutUrl = lsData.data?.attributes?.url;

        if (!checkoutUrl) {
            console.error('[Checkout] No URL in LemonSqueezy response:', lsData);
            return NextResponse.json(
                { error: 'Invalid checkout response' },
                { status: 500 }
            );
        }

        return NextResponse.json({ url: checkoutUrl });
    } catch (err: any) {
        console.error('[Checkout] Unexpected error:', err);
        return NextResponse.json(
            { error: err.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
