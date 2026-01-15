-- POLE Database Schema for Supabase
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/[project-id]/sql)

-- Table: consumed_news
-- Tracks which news articles have been processed
CREATE TABLE IF NOT EXISTS consumed_news (
    id BIGSERIAL PRIMARY KEY,
    news_key TEXT NOT NULL UNIQUE,
    party_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_consumed_news_key ON consumed_news(news_key);
CREATE INDEX IF NOT EXISTS idx_consumed_news_party ON consumed_news(party_id);
CREATE INDEX IF NOT EXISTS idx_consumed_news_created ON consumed_news(created_at DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE consumed_news ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for now (public access)
CREATE POLICY "Allow all operations on consumed_news" ON consumed_news
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Function: Cleanup old news entries
CREATE OR REPLACE FUNCTION cleanup_old_news(keep_count INTEGER DEFAULT 1000)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM consumed_news
    WHERE id NOT IN (
        SELECT id FROM consumed_news
        ORDER BY created_at DESC
        LIMIT keep_count
    );
END;
$$;

-- Optional: Table for score history (for trend analysis)
CREATE TABLE IF NOT EXISTS score_history (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    party_id TEXT NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    sample_size INTEGER
);

CREATE INDEX IF NOT EXISTS idx_score_history_party ON score_history(party_id);
CREATE INDEX IF NOT EXISTS idx_score_history_time ON score_history(timestamp DESC);

-- Enable RLS for score_history
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on score_history" ON score_history
    FOR ALL
    USING (true)
    WITH CHECK (true);
