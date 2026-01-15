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

// Mark news as read (Enhanced to save sentiment/impact)
export async function markNewsAsRead(newsKey, partyId = null, sentiment = 'neu', impact = 0) {
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
                sentiment: sentiment,
                impact: impact,
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

// Save Party Score Snapshots for 24h history
export async function saveScoreHistory(parties) {
    if (!supabase || !parties || parties.length === 0) return;

    const timestamp = new Date().toISOString();

    // Transform parties data for batch insert
    const rows = parties.map(p => ({
        timestamp: timestamp,
        party_id: p.id,
        score: p.score ?? p.baseScore,
        delta: parseFloat(p.delta) || 0,
        trend: p.trend,
        projected_seats: p.projectedSeats || 0
    }));

    try {
        const { error } = await supabase
            .from('score_history')
            .insert(rows);

        if (error) {
            console.error('Failed to save score history:', error);
        }
    } catch (err) {
        console.error('Score history save error:', err);
    }
}

// Load latest score history to rehydrate AI engine
export async function loadLatestScores() {
    if (!supabase) return null;

    try {
        // Get the latest timestamp from the table
        const { data: latestEntry, error: timeError } = await supabase
            .from('score_history')
            .select('timestamp')
            .order('timestamp', { ascending: false })
            .limit(1);

        if (timeError || !latestEntry || latestEntry.length === 0) return null;

        const latestTime = latestEntry[0].timestamp;

        // Fetch all scores for that timestamp
        const { data, error } = await supabase
            .from('score_history')
            .select('*')
            .eq('timestamp', latestTime);

        if (error) {
            console.error('Failed to load latest scores:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Load latest scores error:', err);
        return null;
    }
}

// Initialize on module load
if (supabase) {
    loadConsumedNews();
}
