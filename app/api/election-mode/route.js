import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Election date constants
const ELECTION_DATE = '2026-02-08T08:00:00+07:00';
const LIVE_STREAM_START = '2026-02-08T17:00:00+07:00';
const LIVE_STREAM_END_DEFAULT = '2026-02-08T23:00:00+07:00';

export async function GET() {
    try {
        const now = new Date();
        const electionStart = new Date(ELECTION_DATE);
        const liveStreamStart = new Date(LIVE_STREAM_START);

        // Default mode based on time
        let mode = 'prediction';
        let source = 'time-based';

        // Check Supabase for manual override
        if (supabase) {
            const { data: configData, error } = await supabase
                .from('election_config')
                .select('key, value')
                .in('key', ['mode', 'live_mode_end']);

            if (!error && configData && configData.length > 0) {
                const manualMode = configData.find(c => c.key === 'mode')?.value;
                const liveEndTime = configData.find(c => c.key === 'live_mode_end')?.value;

                // If manual mode is set, use it
                if (manualMode && manualMode !== 'auto') {
                    mode = manualMode;
                    source = 'supabase-manual';
                } else {
                    // Time-based logic
                    const liveEnd = liveEndTime ? new Date(liveEndTime) : new Date(LIVE_STREAM_END_DEFAULT);

                    if (now >= liveStreamStart && now < liveEnd) {
                        mode = 'live_stream';
                        source = 'time-based';
                    } else if (now >= liveEnd) {
                        mode = 'final_results';
                        source = 'time-based';
                    } else if (now >= electionStart) {
                        mode = 'prediction'; // ช่วง 08:00 - 17:00 หยุดวิเคราะห์
                        source = 'time-based';
                    }
                }
            }
        } else {
            // Fallback: Time-based only
            if (now >= liveStreamStart) {
                mode = 'live_stream';
            } else if (now >= electionStart) {
                mode = 'prediction';
            }
        }

        return NextResponse.json({
            mode,
            source,
            timestamp: now.toISOString(),
            electionDate: ELECTION_DATE,
            liveStreamStart: LIVE_STREAM_START
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'
            }
        });

    } catch (error) {
        console.error('Election mode API error:', error);
        return NextResponse.json(
            { error: 'Failed to get election mode', mode: 'prediction' },
            { status: 500 }
        );
    }
}
