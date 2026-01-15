-- POLE Project Database Schema

-- 1. Table: consumed_news (Track news already analyzed)
CREATE TABLE IF NOT EXISTS consumed_news (
    news_key TEXT PRIMARY KEY,
    party_id TEXT,
    sentiment TEXT,
    impact FLOAT8,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster cleanup/querying
CREATE INDEX IF NOT EXISTS idx_consumed_news_created_at ON consumed_news (created_at DESC);

-- 2. Table: score_history (Track popularity trends over time)
CREATE TABLE IF NOT EXISTS score_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    party_id TEXT NOT NULL,
    score FLOAT8 NOT NULL,
    delta FLOAT8,
    trend TEXT,
    projected_seats INT
);

-- Index for trend grouping
CREATE INDEX IF NOT EXISTS idx_score_history_timestamp ON score_history (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_score_history_party ON score_history (party_id);

-- 3. Row Level Security (RLS) - Enable for security but allow all for now (development)
ALTER TABLE consumed_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anonymous" ON consumed_news FOR ALL USING (true);
CREATE POLICY "Allow all for anonymous" ON score_history FOR ALL USING (true);

-- 4. RPC for Cleanup
CREATE OR REPLACE FUNCTION cleanup_old_news(keep_count INT)
RETURNS void AS $$
BEGIN
    DELETE FROM consumed_news
    WHERE news_key IN (
        SELECT news_key
        FROM consumed_news
        ORDER BY created_at ASC
        LIMIT (SELECT GREATEST(0, (SELECT COUNT(*) FROM consumed_news) - keep_count))
    );
END;
$$ LANGUAGE plpgsql;

-- 5. Helper function for initializing tables (called from app)
CREATE OR REPLACE FUNCTION init_pole_tables()
RETURNS boolean AS $$
BEGIN
    -- This function serves as a trigger point for the app to verify connection
    -- Actual table creation is handled via SQL Editor for reliability.
    RETURN true;
END;
$$ LANGUAGE plpgsql;
