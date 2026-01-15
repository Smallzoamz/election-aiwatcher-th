import Parser from 'rss-parser';

const parser = new Parser({
    timeout: 10000, // 10 second timeout
    headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; POLE-NewsBot/1.0)'
    }
});

// Comprehensive Thai news RSS feeds
const RSS_FEEDS = [
    // Original feeds
    { url: 'https://www.matichon.co.th/politics/feed', source: 'มติชนออนไลน์', weight: 1.0 },
    { url: 'https://www.prachachat.net/politics/feed', source: 'ประชาชาติธุรกิจ', weight: 1.0 },

    // Additional feeds for better coverage
    { url: 'https://www.thairath.co.th/rss/news/politic', source: 'ไทยรัฐ', weight: 1.2 },
    { url: 'https://www.dailynews.co.th/rss/politics', source: 'เดลินิวส์', weight: 1.0 },
    { url: 'https://www.bangkokbiznews.com/rss/politics', source: 'กรุงเทพธุรกิจ', weight: 1.1 },
    { url: 'https://news.thaipbs.or.th/rss', source: 'Thai PBS', weight: 1.2 },
    { url: 'https://www.posttoday.com/rss/src/politic.xml', source: 'โพสต์ทูเดย์', weight: 1.0 },
];

let cachedNews = [];
let lastFetch = 0;
let feedStatuses = {}; // Track which feeds are working

export async function fetchLiveNews() {
    const now = Date.now();
    // Cache for 60 seconds
    if (now - lastFetch < 60000 && cachedNews.length > 0) {
        return cachedNews;
    }

    console.log("Fetching live RSS feeds from", RSS_FEEDS.length, "sources...");
    let allNews = [];
    let successfulFeeds = 0;

    const fetchPromises = RSS_FEEDS.map(async (feed) => {
        try {
            const feedData = await parser.parseURL(feed.url);
            const items = feedData.items.map(item => ({
                text: item.title,
                link: item.link,
                source: feed.source,
                weight: feed.weight,
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

    const results = await Promise.all(fetchPromises);
    allNews = results.flat();

    // Sort by date (newest first)
    allNews.sort((a, b) => b.pubDate - a.pubDate);

    console.log(`Fetched ${allNews.length} news items from ${successfulFeeds}/${RSS_FEEDS.length} feeds`);

    cachedNews = allNews;
    lastFetch = now;
    return allNews;
}

// Get feed status for transparency
export function getFeedStatus() {
    return {
        feeds: RSS_FEEDS.map(f => ({
            source: f.source,
            weight: f.weight,
            ...feedStatuses[f.source]
        })),
        totalFeeds: RSS_FEEDS.length,
        activeFeeds: Object.values(feedStatuses).filter(s => s.status === 'ok').length,
        lastUpdate: lastFetch
    };
}
