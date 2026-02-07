-- ===========================================
-- Election Day Mode Tables
-- Run this in Supabase SQL Editor
-- ===========================================

-- Election Day Mode Configuration
CREATE TABLE IF NOT EXISTS election_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default values
INSERT INTO election_config (key, value) VALUES
    ('mode', 'prediction'),
    ('live_mode_start', '2026-02-08T17:00:00+07:00'),
    ('live_mode_end', '2026-02-08T23:00:00+07:00')
ON CONFLICT (key) DO NOTHING;

-- Final Election Results
CREATE TABLE IF NOT EXISTS final_results (
    party_id TEXT PRIMARY KEY,
    party_name TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    seats INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert placeholder data for all parties
INSERT INTO final_results (party_id, party_name, votes, seats) VALUES
    ('pp', 'พรรคประชาชน', 0, 0),
    ('pt', 'พรรคเพื่อไทย', 0, 0),
    ('bjt', 'พรรคภูมิใจไทย', 0, 0),
    ('dem', 'พรรคประชาธิปัตย์', 0, 0),
    ('pprp', 'พรรคพลังประชารัฐ', 0, 0),
    ('utnp', 'พรรครวมไทยสร้างชาติ', 0, 0),
    ('ctp', 'พรรคชาติไทยพัฒนา', 0, 0),
    ('tnp', 'พรรคไทยสร้างไทย', 0, 0)
ON CONFLICT (party_id) DO NOTHING;

-- Enable RLS
ALTER TABLE election_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_results ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read on election_config" ON election_config
    FOR SELECT USING (true);
    
CREATE POLICY "Allow public read on final_results" ON final_results
    FOR SELECT USING (true);
