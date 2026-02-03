import { createClient } from '@supabase/supabase-js';

// Next.js uses process.env with NEXT_PUBLIC_ prefix for client-side access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a mock client if env vars are missing (for demo/development)
const isMissingConfig = !supabaseUrl || !supabaseKey;

if (isMissingConfig) {
  console.warn('Missing Supabase Environment Variables - running in demo mode');
}

// Create client (will be non-functional without proper config, but won't crash)
export const supabase = isMissingConfig
  ? null
  : createClient(supabaseUrl, supabaseKey);