// app/api/history/route.js - Historical Score Data API
import { NextResponse } from 'next/server';
import { getScoreHistoryByRange } from '@/lib/db';
import { PARTIES } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '7', 10);
        const partyId = searchParams.get('party') || 'all';

        // Validate days parameter
        const validDays = [7, 14, 30];
        const actualDays = validDays.includes(days) ? days : 7;

        // Fetch data from Supabase
        const rawData = await getScoreHistoryByRange(actualDays, partyId);

        // Transform data for charting
        // Group by timestamp for multi-line chart
        const chartDataMap = {};

        rawData.forEach(row => {
            const timeKey = row.timestamp;
            if (!chartDataMap[timeKey]) {
                chartDataMap[timeKey] = {
                    timestamp: timeKey,
                    date: new Date(timeKey).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
            }
            chartDataMap[timeKey][row.party_id] = parseFloat(row.score.toFixed(2));
        });

        const chartData = Object.values(chartDataMap).sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        // Get party info for legend
        const partyInfo = PARTIES.map(p => ({
            id: p.id,
            name: p.name,
            color: p.color
        }));

        return NextResponse.json({
            success: true,
            days: actualDays,
            totalPoints: chartData.length,
            chartData,
            partyInfo,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('History API Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch history data',
            message: error.message
        }, { status: 500 });
    }
}
