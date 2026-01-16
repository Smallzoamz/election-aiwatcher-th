import { NextResponse } from 'next/server';
import { simulateMarket } from '@/lib/ai-engine';
import * as fs from 'fs';
import * as path from 'path';

const DEBUG_LOG_PATH = path.join(process.cwd(), 'debug_engine.log');
function logDebug(msg) {
    try {
        fs.appendFileSync(DEBUG_LOG_PATH, `[API-ROUTE] [${new Date().toISOString()}] ${msg}\n`);
    } catch (e) {
        // ignore
    }
}

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute per IP

function getRateLimitKey(request) {
    // Get IP from headers (works with most proxies/vercel)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'anonymous';
    return ip;
}

function checkRateLimit(key) {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    // Get or create rate limit entry
    let entry = rateLimitMap.get(key);
    if (!entry || entry.windowStart < windowStart) {
        entry = { windowStart: now, count: 0 };
    }

    entry.count++;
    rateLimitMap.set(key, entry);

    // Cleanup old entries periodically
    if (rateLimitMap.size > 1000) {
        for (const [k, v] of rateLimitMap.entries()) {
            if (v.windowStart < windowStart) {
                rateLimitMap.delete(k);
            }
        }
    }

    return entry.count <= RATE_LIMIT_MAX;
}

export async function GET(request) {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            {
                status: 429,
                headers: {
                    'Retry-After': '60',
                    'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
                }
            }
        );
    }

    try {
        const data = await simulateMarket();

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=2, stale-while-revalidate=5',
                'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
                'X-RateLimit-Remaining': Math.max(0, RATE_LIMIT_MAX - rateLimitMap.get(rateLimitKey)?.count || 0).toString(),
            }
        });
    } catch (error) {
        console.error('API Error:', error);
        logDebug(`API Error: ${error.message}\nStack: ${error.stack}`);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
