import Parser from 'rss-parser';
import { fetchPantipPosts, getPantipStatus } from './pantip-scraper';
import { fetchYouTubeNews, getYouTubeStatus } from './youtube-fetcher';

// CORS proxy for RSS feeds (free public proxies)
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
];

const parser = new Parser({
    timeout: 15000, // 15 second timeout for proxied requests
    headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; POLE-NewsBot/1.0)'
    }
});

// Comprehensive Thai news RSS feeds
const RSS_FEEDS = [
    // Working feeds (tested)
    { url: 'https://www.matichon.co.th/politics/feed', source: 'มติชนออนไลน์', weight: 1.0 },
    { url: 'https://www.prachachat.net/politics/feed', source: 'ประชาชาติธุรกิจ', weight: 1.0 },

    // Feeds that need CORS proxy
    { url: 'https://www.thairath.co.th/rss/news/politic', source: 'ไทยรัฐ', weight: 1.2, needsProxy: true },
    { url: 'https://news.thaipbs.or.th/rss', source: 'Thai PBS', weight: 1.2, needsProxy: true },
    { url: 'https://www.bangkokbiznews.com/rss/politics', source: 'กรุงเทพธุรกิจ', weight: 1.1, needsProxy: true },
];

let cachedNews = [];
let lastFetch = 0;
let feedStatuses = {}; // Track which feeds are working

// Fetch RSS with optional CORS proxy fallback
async function fetchRSSWithProxy(url, needsProxy = false) {
    // Try direct first if not marked as needing proxy
    if (!needsProxy) {
        try {
            return await parser.parseURL(url);
        } catch (err) {
            console.log(`Direct fetch failed for ${url}, trying proxy...`);
        }
    }

    // Try CORS proxies
    for (const proxy of CORS_PROXIES) {
        try {
            const proxyUrl = proxy + encodeURIComponent(url);
            return await parser.parseURL(proxyUrl);
        } catch (err) {
            continue; // Try next proxy
        }
    }

    throw new Error('All fetch methods failed');
}

export async function fetchLiveNews() {
    const now = Date.now();
    // Cache for 60 seconds
    if (now - lastFetch < 60000 && cachedNews.length > 0) {
        return cachedNews;
    }

    console.log("Fetching from all sources...");
    let allNews = [];
    let successfulFeeds = 0;

    // 1. Fetch from RSS feeds (with proxy support)
    const rssPromises = RSS_FEEDS.map(async (feed) => {
        try {
            const feedData = await fetchRSSWithProxy(feed.url, feed.needsProxy);
            const items = feedData.items.map(item => ({
                text: item.title,
                link: item.link,
                source: feed.source,
                weight: feed.weight,
                platform: 'rss',
                pubDate: item.pubDate ? new Date(item.pubDate) : new Date()
            }));

            feedStatuses[feed.source] = { status: 'ok', count: items.length, lastUpdate: now };
            successfulFeeds++;
            return items;
        } catch (err) {
            console.error(`Failed to fetch ${feed.source}:`, err.message);
            feedStatuses[feed.source] = { status: 'error', error: err.message, lastUpdate: now };
            return [];
        }
    });

    // 2. Fetch from Pantip (Social Media)
    const pantipPromise = fetchPantipPosts().then(posts => {
        if (posts.length > 0) {
            feedStatuses['Pantip'] = { status: 'ok', count: posts.length, lastUpdate: now };
            successfulFeeds++;
        }
        return posts;
    }).catch(err => {
        console.error('Pantip fetch error:', err.message);
        feedStatuses['Pantip'] = { status: 'error', error: err.message, lastUpdate: now };
        return [];
    });

    // 3. Fetch from YouTube (if API key available)
    const youtubePromise = fetchYouTubeNews().then(videos => {
        if (videos.length > 0) {
            feedStatuses['YouTube'] = { status: 'ok', count: videos.length, lastUpdate: now };
            successfulFeeds++;
        }
        return videos;
    }).catch(err => {
        console.error('YouTube fetch error:', err.message);
        feedStatuses['YouTube'] = { status: 'error', error: err.message, lastUpdate: now };
        return [];
    });

    // Wait for all sources
    const [rssResults, pantipResults, youtubeResults] = await Promise.all([
        Promise.all(rssPromises),
        pantipPromise,
        youtubePromise
    ]);

    // Combine all results
    allNews = [
        ...rssResults.flat(),
        ...pantipResults,
        ...youtubeResults
    ];

    // Sort by date (newest first) - handle items without pubDate
    allNews.sort((a, b) => {
        const dateA = a.pubDate ? new Date(a.pubDate) : new Date();
        const dateB = b.pubDate ? new Date(b.pubDate) : new Date();
        return dateB - dateA;
    });

    const rssCount = rssResults.flat().length;
    const pantipCount = pantipResults.length;
    const youtubeCount = youtubeResults.length;

    console.log(`Fetched: ${rssCount} RSS + ${pantipCount} Pantip + ${youtubeCount} YouTube = ${allNews.length} total items`);

    cachedNews = allNews;
    lastFetch = now;
    return allNews;
}

// Get feed status for transparency
export function getFeedStatus() {
    const pantipStatus = getPantipStatus();
    const youtubeStatus = getYouTubeStatus();

    return {
        feeds: [
            ...RSS_FEEDS.map(f => ({
                source: f.source,
                weight: f.weight,
                platform: 'RSS',
                ...feedStatuses[f.source]
            })),
            {
                source: 'Pantip',
                weight: 1.5,
                platform: 'Social',
                ...feedStatuses['Pantip'],
                rooms: pantipStatus.rooms
            },
            {
                source: 'YouTube',
                weight: 1.3,
                platform: 'Video',
                ...feedStatuses['YouTube'],
                hasApiKey: youtubeStatus.hasApiKey
            }
        ],
        totalFeeds: RSS_FEEDS.length + 2, // +2 for Pantip & YouTube
        activeFeeds: Object.values(feedStatuses).filter(s => s.status === 'ok').length,
        platforms: {
            rss: RSS_FEEDS.length,
            social: 1, // Pantip
            video: 1   // YouTube
        },
        lastUpdate: lastFetch
    };
}

