// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Using fallback mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Initialize database tables
export async function initDatabase() {
    if (!supabase) {
        console.warn('Supabase not initialized');
        return false;
    }

    try {
        // Create consumed_news table if not exists
        const { error } = await supabase.rpc('init_pole_tables');

        if (error && !error.message.includes('already exists')) {
            console.error('Failed to initialize tables:', error);
            return false;
        }

        console.log('Database initialized successfully');
        return true;
    } catch (err) {
        console.error('Database init error:', err);
        return false;
    }
}
