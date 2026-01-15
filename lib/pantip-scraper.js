// lib/pantip-scraper.js
// Scrapes political discussions from Pantip (Thai forum)

const PANTIP_ROOMS = [
    { id: 'sinthorn', name: 'สินธร (การเมือง)', weight: 1.5 },
    { id: 'rajdumnern', name: 'ราชดำเนิน (ข่าวสาร)', weight: 1.2 },
    { id: 'chalermthai', name: 'เฉลิมไทย (สังคม)', weight: 1.0 },
];

const PANTIP_BASE_URL = 'https://pantip.com/forum/topic/tag';

// Track fetched topics to avoid duplicates
let fetchedTopics = new Set();
let lastFetchTime = 0;
const CACHE_TTL = 60000; // 1 minute cache

export async function fetchPantipPosts() {
    const now = Date.now();

    // Rate limiting - don't fetch more than once per minute
    if (now - lastFetchTime < CACHE_TTL) {
        return [];
    }
    lastFetchTime = now;

    const allPosts = [];

    try {
        // Fetch from each room
        for (const room of PANTIP_ROOMS) {
            try {
                // Use Pantip's API endpoint (unofficial but works)
                const response = await fetch(
                    `https://pantip.com/api/forum-service/home/get_room_recommend?room=${room.id}&limit=10`,
                    {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'application/json',
                        },
                        next: { revalidate: 60 }
                    }
                );

                if (!response.ok) continue;

                const data = await response.json();

                if (data?.data?.topics) {
                    for (const topic of data.data.topics) {
                        // Skip if already fetched
                        if (fetchedTopics.has(topic.topic_id)) continue;

                        allPosts.push({
                            text: topic.title,
                            link: `https://pantip.com/topic/${topic.topic_id}`,
                            source: `Pantip ${room.name}`,
                            weight: room.weight,
                            platform: 'pantip',
                            comments: topic.comments_count || 0,
                            votes: topic.votes_count || 0,
                            timestamp: topic.created_time
                        });

                        fetchedTopics.add(topic.topic_id);
                    }
                }
            } catch (err) {
                console.error(`Pantip ${room.id} error:`, err.message);
            }
        }

        // Keep only last 500 topic IDs to prevent memory leak
        if (fetchedTopics.size > 500) {
            const arr = Array.from(fetchedTopics);
            fetchedTopics = new Set(arr.slice(-300));
        }

        console.log(`Fetched ${allPosts.length} Pantip posts`);
        return allPosts;

    } catch (error) {
        console.error('Pantip scraper error:', error);
        return [];
    }
}

// Alternative: Search Pantip for specific political keywords
export async function searchPantip(keyword) {
    try {
        const response = await fetch(
            `https://pantip.com/api/search-service/search/tag?tag=${encodeURIComponent(keyword)}&limit=20`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
                next: { revalidate: 300 }
            }
        );

        if (!response.ok) return [];

        const data = await response.json();
        return data?.data?.topics?.map(topic => ({
            text: topic.title,
            link: `https://pantip.com/topic/${topic.topic_id}`,
            source: 'Pantip Search',
            weight: 1.0,
            platform: 'pantip'
        })) || [];

    } catch (error) {
        console.error('Pantip search error:', error);
        return [];
    }
}

export function getPantipStatus() {
    return {
        platform: 'Pantip',
        rooms: PANTIP_ROOMS.length,
        cachedTopics: fetchedTopics.size,
        lastFetch: lastFetchTime ? new Date(lastFetchTime).toISOString() : null
    };
}
