// lib/google-trends.js

// Mapping Party IDs to Wikipedia Article Titles (Thai)
// We use the Party Leader or Key Figure as the proxy for popularity
// Updated: January 2026 (อนุทินเป็นนายกฯ, จุลพันธ์เป็นหัวหน้าเพื่อไทย)
const WIKI_ARTICLES = {
    'pp': 'ณัฐพงษ์_เรืองปัญญาวุฒิ', // หัวหน้าพรรคประชาชน (ผู้นำฝ่ายค้าน)
    'pt': 'จุลพันธ์_อมรวิวัฒน์',   // หัวหน้าพรรคเพื่อไทย (ใหม่ ธ.ค. 2568)
    'utn': 'พีระพันธุ์_สาลีรัฐวิภาค', // หัวหน้าพรรครวมไทยสร้างชาติ
    'bjt': 'อนุทิน_ชาญวีรกูล',      // นายกรัฐมนตรี คนที่ 32 (ก.ย. 2568)
    'dem': 'เฉลิมชัย_ศรีอ่อน',      // หัวหน้าพรรคประชาธิปัตย์
    'pprp': 'ประวิตร_วงษ์สุวรรณ',   // หัวหน้าพรรคพลังประชารัฐ
    'tst': 'สุดารัตน์_เกยุราพันธุ์',  // หัวหน้าพรรคไทยสร้างไทย
    'cpd': 'วราวุธ_ศิลปอาชา'       // หัวหน้าพรรคชาติไทยพัฒนา
};

// Cache to prevent hitting rate limits
let trendsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour (Wikipedia updates daily)

/**
 * Fetch Popularity Score from Wikipedia Pageviews
 * Source: wikimedia.org API (Open & Stable)
 * Metric: Average daily pageviews over the last 30 days
 * @returns {Promise<Object>} Normalized scores (0-1)
 */
export async function getTrendsData() {
    const now = Date.now();
    if (trendsCache && (now - lastFetchTime < CACHE_DURATION)) {
        return trendsCache;
    }

    console.log('📊 Fetching Wikipedia Analytics (Real Data)...');

    // Date Range: Last 30 Days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    // Format YYYYMMDD
    const formatDate = (date) => date.toISOString().split('T')[0].replace(/-/g, '');
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);

    const scores = {};

    // Create fetch promises for all parties
    const requests = Object.entries(WIKI_ARTICLES).map(async ([partyId, article]) => {
        try {
            // Wikipedia REST API (User-Agent is required)
            const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/th.wikipedia.org/all-access/user/${encodeURIComponent(article)}/daily/${startStr}/${endStr}`;

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'ElectionAIWatcher/1.0 (contact@example.com)' // Required by Wiki API
                }
            });

            if (!response.ok) {
                console.warn(`⚠️ Wiki Error for ${partyId} (${article}): ${response.status}`);
                return { partyId, views: 0 };
            }

            const data = await response.json();

            // Calculate total views in period
            let totalViews = 0;
            if (data.items && Array.isArray(data.items)) {
                totalViews = data.items.reduce((sum, item) => sum + item.views, 0);
            }

            // Average daily views
            const dailyAvg = totalViews / 30;
            return { partyId, views: dailyAvg };

        } catch (error) {
            console.error(`❌ Wiki Fetch Error (${partyId}):`, error.message);
            return { partyId, views: 0 };
        }
    });

    const results = await Promise.all(requests);

    // Normalize Scores (Find max views to scale others)
    let maxViews = 1; // Avoid division by zero
    results.forEach(r => {
        if (r.views > maxViews) maxViews = r.views;
    });

    results.forEach(r => {
        // Linear normalization: 0 to 1 based on the most popular leader
        // Baseline 0.05 ensures no one gets absolute zero
        let normalizedScore = (r.views / maxViews);
        scores[r.partyId] = Math.max(0.05, parseFloat(normalizedScore.toFixed(2)));

        console.log(`📈 Wiki Stats [${r.partyId}]: ~${Math.round(r.views)} views/day (Score: ${scores[r.partyId]})`);
    });

    console.log('✅ Wikipedia Analytics Fetched:', scores);

    trendsCache = scores;
    lastFetchTime = now;

    return scores;
}
