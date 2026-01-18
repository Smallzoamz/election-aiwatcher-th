// lib/db.js - Supabase PostgreSQL version
import { supabase } from './supabase.js';

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

// [NEW] Clear consumed news cache to allow re-analysis
export function clearConsumedNewsCache() {
    const oldSize = consumedNewsCache.size;
    consumedNewsCache.clear();
    cacheLoaded = false;
    console.log(`🔄 Cleared ${oldSize} consumed news from cache (refresh mode)`);
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
    // Only include columns that exist in Supabase schema
    const rows = parties.map(p => ({
        timestamp: timestamp,
        party_id: p.id,
        score: p.score ?? p.baseScore,
        delta: parseFloat(p.delta) || 0
        // trend, projected_seats columns may not exist in schema - skip
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

// Get Score History by Date Range (for Trends page)
export async function getScoreHistoryByRange(days = 7, partyId = null) {
    if (!supabase) return [];

    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        let query = supabase
            .from('score_history')
            .select('*')
            .gte('timestamp', startDate.toISOString())
            .order('timestamp', { ascending: true });

        if (partyId && partyId !== 'all') {
            query = query.eq('party_id', partyId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Failed to load score history:', error);
            return [];
        }

        // Aggregate by hour to reduce data points
        const aggregated = {};
        data.forEach(row => {
            const hourKey = new Date(row.timestamp).toISOString().slice(0, 13); // YYYY-MM-DDTHH
            const key = `${hourKey}_${row.party_id}`;
            if (!aggregated[key]) {
                aggregated[key] = {
                    timestamp: hourKey + ':00:00.000Z',
                    party_id: row.party_id,
                    scores: [],
                    deltas: []
                };
            }
            aggregated[key].scores.push(row.score);
            aggregated[key].deltas.push(row.delta || 0);
        });

        // Calculate averages
        return Object.values(aggregated).map(item => ({
            timestamp: item.timestamp,
            party_id: item.party_id,
            score: item.scores.reduce((a, b) => a + b, 0) / item.scores.length,
            delta: item.deltas.reduce((a, b) => a + b, 0) / item.deltas.length
        }));
    } catch (err) {
        console.error('Score history range error:', err);
        return [];
    }
}

// Initialize on module load
if (supabase) {
    loadConsumedNews();
}
