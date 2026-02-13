import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-server';

// Disable body parsing — we need the raw body for signature verification
export const dynamic = 'force-dynamic';

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature') || '';
        const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        // Verify webhook signature
        if (!webhookSecret || webhookSecret === 'your_webhook_secret_here') {
            console.error('[Webhook] LEMONSQUEEZY_WEBHOOK_SECRET is not configured — rejecting request');
            return NextResponse.json(
                { error: 'Webhook secret not configured. Set LEMONSQUEEZY_WEBHOOK_SECRET env var.' },
                { status: 500 }
            );
        }

        if (!signature || !verifySignature(rawBody, signature, webhookSecret)) {
            console.error('[Webhook] Invalid signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta?.event_name;

        console.log('[Webhook] Received event:', eventName);

        if (eventName === 'order_created') {
            const websiteSlug = payload.meta?.custom_data?.website_slug;
            const orderId = String(payload.data?.id || '');

            if (!websiteSlug) {
                console.error('[Webhook] Missing website_slug in custom_data:', payload.meta);
                return NextResponse.json({ error: 'Missing website_slug' }, { status: 400 });
            }

            // Update site status to production
            const { error } = await supabaseAdmin
                .from('websites')
                .update({
                    status: 'production',
                    payment_id: orderId,
                })
                .eq('slug', websiteSlug);

            if (error) {
                console.error('[Webhook] Supabase update error:', error.message);
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }

            console.log(`[Webhook] Site "${websiteSlug}" upgraded to production (order: ${orderId})`);
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('[Webhook] Unexpected error:', err);
        return NextResponse.json(
            { error: err.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
