// lib/db.js - Supabase PostgreSQL version
import { supabase } from './supabase';

// In-memory cache for consumed news (fallback + performance)
let consumedNewsCache = new Set();
let cacheLoaded = false;

// Load consumed news from Supabase
async function loadConsumedNews() {
    if (!supabase) {
        console.warn('Supabase not available, using memory-only mode');
        return consumedNewsCache;
    }

    try {
        const { data, error } = await supabase
            .from('consumed_news')
            .select('news_key')
            .order('created_at', { ascending: false })
            .limit(1000);

        if (error) {
            console.error('Failed to load consumed news:', error);
            return consumedNewsCache;
        }

        consumedNewsCache = new Set(data.map(row => row.news_key));
        cacheLoaded = true;
        console.log(`Loaded ${consumedNewsCache.size} consumed news from database`);
        return consumedNewsCache;
    } catch (err) {
        console.error('Database load error:', err);
        return consumedNewsCache;
    }
}

// Get read news (returns Set of news keys)
export function getReadNews() {
    // Load from database on first call
    if (!cacheLoaded && supabase) {
        loadConsumedNews();
    }
    return consumedNewsCache;
}

// Mark news as read
export async function markNewsAsRead(newsKey, partyId = null) {
    if (!newsKey) return;

    // Always update local cache first (for immediate effect)
    consumedNewsCache.add(newsKey);

    if (!supabase) {
        console.warn('Supabase not available, stored in memory only');
        return;
    }

    try {
        const { error } = await supabase
            .from('consumed_news')
            .upsert({
                news_key: newsKey,
                party_id: partyId,
                created_at: new Date().toISOString()
            }, {
                onConflict: 'news_key'
            });

        if (error) {
            console.error('Failed to mark news as read:', error);
        }
    } catch (err) {
        console.error('Database write error:', err);
    }
}

// Cleanup old entries (keep last 1000)
export async function cleanupOldNews() {
    if (!supabase) return;

    try {
        // Get count
        const { count } = await supabase
            .from('consumed_news')
            .select('*', { count: 'exact', head: true });

        if (count > 1000) {
            // Delete oldest entries
            const { error } = await supabase.rpc('cleanup_old_news', { keep_count: 1000 });
            if (error) console.error('Cleanup error:', error);
        }
    } catch (err) {
        console.error('Cleanup error:', err);
    }
}

// Initialize on module load
if (supabase) {
    loadConsumedNews();
}
