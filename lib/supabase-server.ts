import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using Service Role Key
// Use this ONLY in API routes (never in client components)
// It bypasses Row Level Security, so webhooks can update any row

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
