
import { createClient } from '@supabase/supabase-js';
// import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fszleubvvptsfqshcslp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_icPijyKT6VRqxvT0u2-oVQ_juS-RQ1X';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase credentials. Please checks your .env file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
