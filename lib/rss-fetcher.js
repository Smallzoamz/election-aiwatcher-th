import Parser from 'rss-parser';
import { fetchPantipPosts, getPantipStatus } from './pantip-scraper';
import { fetchYouTubeNews, getYouTubeStatus } from './youtube-fetcher';

const parser = new Parser({
    timeout: 15000, // 15 second timeout
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
});

// Thai news RSS feeds - VERIFIED WORKING (Updated Jan 2026)
const RSS_FEEDS = [
    // === ข่าวการเมืองโดยตรง (Verified Working) ===
    { url: 'https://www.matichon.co.th/politics/feed', source: 'มติชนออนไลน์', weight: 1.0, region: 'national' },
    { url: 'https://www.prachachat.net/politics/feed', source: 'ประชาชาติธุรกิจ', weight: 1.0, region: 'national' },

    // === ข่าวทั่วไป (มักมีการเมือง) ===
    { url: 'https://www.matichon.co.th/feed', source: 'มติชน (ทั่วไป)', weight: 0.7, region: 'national' },
    { url: 'https://www.prachachat.net/feed', source: 'ประชาชาติ (ทั่วไป)', weight: 0.7, region: 'national' },
    { url: 'https://www.khaosod.co.th/feed', source: 'ข่าวสด', weight: 0.9, region: 'national' },

    // === สื่อออนไลน์/ทางเลือก ===
    { url: 'https://prachatai.com/rss.xml', source: 'ประชาไท', weight: 1.3, region: 'national' },
    { url: 'https://thestandard.co/feed/', source: 'THE STANDARD', weight: 1.2, region: 'national' },

    // === ข่าวท้องถิ่น/ภูมิภาค (Regional) ===
    { url: 'https://www.bangkokpost.com/rss/data/most-recent.xml', source: 'Bangkok Post', weight: 1.1, region: 'national' },
    { url: 'https://theisaanrecord.co/feed/', source: 'The Isaan Record', weight: 1.4, region: 'isaan' },
    { url: 'https://www.thephuketnews.com/rss-xml/news.xml', source: 'The Phuket News', weight: 1.3, region: 'south' },
    { url: 'https://www.chiangmaicitylife.com/feed/', source: 'Chiang Mai Citylife', weight: 1.3, region: 'north' },
];

let cachedNews = [];
let lastFetch = 0;
let feedStatuses = {}; // Track which feeds are working

// Helper: Normalize headline for duplicate detection
function normalizeHeadline(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[\s\n\r\t]+/g, ' ')  // Collapse whitespace
        .replace(/[""'']/g, '"')       // Normalize quotes
        .replace(/[…]/g, '...')        // Normalize ellipsis
        .trim();
}

// Helper: Check if two headlines are similar (Levenshtein-based)
function areSimilar(a, b, threshold = 0.85) {
    const normA = normalizeHeadline(a);
    const normB = normalizeHeadline(b);

    // Exact match
    if (normA === normB) return true;

    // One contains the other (substring match)
    if (normA.includes(normB) || normB.includes(normA)) return true;

    // First 30 chars match (for headlines with different endings)
    if (normA.substring(0, 30) === normB.substring(0, 30) && normA.length > 20) return true;

    return false;
}

// Remove duplicate headlines (strict hash-based matching)
function deduplicateNews(newsList) {
    const seen = new Set();
    const unique = [];

    for (const news of newsList) {
        // Normalize: lowercase, remove spaces, first 50 chars
        const normalizedTitle = (news.text || '')
            .toLowerCase()
            .replace(/[\s\n\r\t]+/g, '')
            .replace(/[""''\"\']/g, '')
            .substring(0, 50);

        if (!seen.has(normalizedTitle)) {
            seen.add(normalizedTitle);
            unique.push(news);
        }
    }

    const dupeCount = newsList.length - unique.length;
    if (dupeCount > 0) {
        console.log(`[RSS] Removed ${dupeCount} duplicate headlines`);
    }

    return unique;
}

// [NEW] Filter only recent news (last 48 hours)
function filterRecentNews(newsList) {
    const now = new Date();
    const cutoffTime = now.getTime() - (48 * 60 * 60 * 1000); // 48 hours ago

    const recent = newsList.filter(item => {
        if (!item.pubDate) return true; // Keep items without date (assume recent)
        const itemDate = new Date(item.pubDate);
        // Check if date is valid and within last 48 hours
        if (isNaN(itemDate.getTime())) return true; // Invalid date, keep it
        return itemDate.getTime() >= cutoffTime;
    });

    const oldCount = newsList.length - recent.length;
    if (oldCount > 0) {
        console.log(`[RSS] Filtered out ${oldCount} old news items (>48h)`);
    }

    return recent;
}

// [NEW] Political news filter - only show news about politics/elections
const POLITICAL_KEYWORDS = [
    // พรรคการเมือง
    'พรรค', 'ประชาชน', 'เพื่อไทย', 'ภูมิใจไทย', 'ก้าวไกล', 'พลังประชารัฐ', 'ประชาธิปัตย์',
    'รวมไทยสร้างชาติ', 'ชาติไทยพัฒนา', 'เสรีรวมไทย', 'ไทยสร้างไทย',
    // บุคคลสำคัญ
    'นายก', 'รัฐมนตรี', 'ส.ส.', 'สมาชิกสภา', 'ผู้นำฝ่ายค้าน', 'อนุทิน', 'แพทองธาร', 'ณัฐพงษ์', 'ศิริกัญญา',
    'ทักษิณ', 'ประวิตร', 'ประยุทธ์', 'เสรี', 'อภิสิทธิ์', 'พิธา',
    // กระบวนการ/เหตุการณ์
    'เลือกตั้ง', 'การเมือง', 'สภา', 'รัฐธรรมนูญ', 'ม็อบ', 'ชุมนุม', 'ประท้วง', 'อภิปราย',
    'ไม่ไว้วางใจ', 'ยุบสภา', 'กกต', 'โพล', 'คะแนนเสียง', 'นโยบาย',
    // สถาบัน
    'รัฐสภา', 'วุฒิสภา', 'ศาลรัฐธรรมนูญ', 'คณะรัฐมนตรี', 'ครม', 'ทำเนียบ',
    // ประเด็นร้อน
    'แก้รัฐธรรมนูญ', 'สมรสเท่าเทียม', 'กัญชา', 'ดิจิทัลวอลเล็ต', 'ค่าแรงขั้นต่ำ'
];

function isPoliticalNews(headline) {
    if (!headline) return false;
    const lowerTitle = headline.toLowerCase();
    return POLITICAL_KEYWORDS.some(keyword => lowerTitle.includes(keyword.toLowerCase()));
}

function filterPoliticalNews(newsList) {
    const political = newsList.filter(item => isPoliticalNews(item.text));
    const nonPoliticalCount = newsList.length - political.length;
    if (nonPoliticalCount > 0) {
        console.log(`[RSS] Filtered out ${nonPoliticalCount} non-political news items`);
    }
    return political;
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

    // 1. Fetch from RSS feeds
    const rssPromises = RSS_FEEDS.map(async (feed) => {
        try {
            const feedData = await parser.parseURL(feed.url);
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

    // Sort by weight first (higher weight = more visible), then by date
    allNews.sort((a, b) => {
        // First by weight (descending)
        if (b.weight !== a.weight) return b.weight - a.weight;
        // Then by date (newest first)
        const dateA = a.pubDate ? new Date(a.pubDate) : new Date();
        const dateB = b.pubDate ? new Date(b.pubDate) : new Date();
        return dateB - dateA;
    });

    // [NEW] Filter only recent news (last 48 hours)
    allNews = filterRecentNews(allNews);

    // [FIX] Remove duplicate headlines (strict matching)
    allNews = deduplicateNews(allNews);

    // [NEW] Filter only political news
    allNews = filterPoliticalNews(allNews);

    const rssCount = rssResults.flat().length;
    const pantipCount = pantipResults.length;
    const youtubeCount = youtubeResults.length;

    console.log(`Fetched: ${rssCount} RSS + ${pantipCount} Pantip + ${youtubeCount} YouTube = ${allNews.length} unique items`);

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
