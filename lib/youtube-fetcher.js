// lib/youtube-fetcher.js
// Fetches comments from Thai political YouTube channels (FREE tier - 10,000 queries/day)

// Popular Thai political/news YouTube channel IDs
const THAI_NEWS_CHANNELS = [
    { id: 'UCXFrdLDGeWk5sGhgQb4sPPg', name: 'PPTV HD 36', weight: 1.3 },
    { id: 'UCOmqM1T5VNMjD5A2LdkDbdg', name: 'Thai PBS', weight: 1.5 },
    { id: 'UCQhT5P94c2r_xd2F8s9c-hg', name: 'ข่าวช่อง 3', weight: 1.2 },
    { id: 'UCRp0R2WXfePQNFT9IqZmHEA', name: 'Thairath', weight: 1.0 },
];

// Note: YouTube API requires API key. This is a free tier implementation.
// Get your free API key at: https://console.cloud.google.com/

let cachedVideos = [];
let lastFetchTime = 0;
const CACHE_TTL = 300000; // 5 minutes cache

export async function fetchYouTubeNews(apiKey = null) {
    // If no API key, return empty (user needs to configure)
    if (!apiKey && !process.env.YOUTUBE_API_KEY) {
        console.log('YouTube API: No API key configured');
        return [];
    }

    const key = apiKey || process.env.YOUTUBE_API_KEY;
    const now = Date.now();

    // Rate limiting
    if (now - lastFetchTime < CACHE_TTL && cachedVideos.length > 0) {
        return cachedVideos;
    }

    const allVideos = [];

    try {
        for (const channel of THAI_NEWS_CHANNELS) {
            try {
                // Search for recent political videos
                const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.id}&q=การเมือง&type=video&order=date&maxResults=5&key=${key}`;

                const response = await fetch(searchUrl, {
                    next: { revalidate: 300 }
                });

                if (!response.ok) {
                    console.error(`YouTube API error for ${channel.name}:`, response.status);
                    continue;
                }

                const data = await response.json();

                if (data?.items) {
                    for (const item of data.items) {
                        allVideos.push({
                            text: item.snippet.title,
                            description: item.snippet.description?.substring(0, 200),
                            link: `https://youtube.com/watch?v=${item.id.videoId}`,
                            source: `YouTube: ${channel.name}`,
                            weight: channel.weight,
                            platform: 'youtube',
                            publishedAt: item.snippet.publishedAt,
                            thumbnail: item.snippet.thumbnails?.default?.url
                        });
                    }
                }
            } catch (err) {
                console.error(`YouTube ${channel.name} error:`, err.message);
            }
        }

        cachedVideos = allVideos;
        lastFetchTime = now;

        console.log(`Fetched ${allVideos.length} YouTube videos`);
        return allVideos;

    } catch (error) {
        console.error('YouTube fetcher error:', error);
        return cachedVideos; // Return cached on error
    }
}

// Fetch comments from a specific video (requires additional quota)
export async function fetchVideoComments(videoId, apiKey = null) {
    const key = apiKey || process.env.YOUTUBE_API_KEY;
    if (!key) return [];

    try {
        const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&order=relevance&key=${key}`;

        const response = await fetch(url);
        if (!response.ok) return [];

        const data = await response.json();

        return data?.items?.map(item => ({
            text: item.snippet.topLevelComment.snippet.textDisplay,
            author: item.snippet.topLevelComment.snippet.authorDisplayName,
            likes: item.snippet.topLevelComment.snippet.likeCount,
            publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
            platform: 'youtube_comment'
        })) || [];

    } catch (error) {
        console.error('YouTube comments error:', error);
        return [];
    }
}

export function getYouTubeStatus() {
    return {
        platform: 'YouTube',
        channels: THAI_NEWS_CHANNELS.length,
        cachedVideos: cachedVideos.length,
        hasApiKey: !!(process.env.YOUTUBE_API_KEY),
        lastFetch: lastFetchTime ? new Date(lastFetchTime).toISOString() : null
    };
}
