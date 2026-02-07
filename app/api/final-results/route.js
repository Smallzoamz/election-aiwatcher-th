import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        if (!supabase) {
            // Fallback: Return empty results
            return NextResponse.json({
                results: [],
                source: 'fallback',
                message: 'Supabase not connected'
            });
        }

        const { data, error } = await supabase
            .from('final_results')
            .select('party_id, party_name, votes, seats, updated_at')
            .order('seats', { ascending: false });

        if (error) {
            console.error('Final results fetch error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch results', results: [] },
                { status: 500 }
            );
        }

        return NextResponse.json({
            results: data || [],
            source: 'supabase',
            timestamp: new Date().toISOString()
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
            }
        });

    } catch (error) {
        console.error('Final results API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', results: [] },
            { status: 500 }
        );
    }
}
