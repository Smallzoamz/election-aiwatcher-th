
import { fetchPantipPosts, getPantipStatus } from './lib/pantip-scraper.js';
import { fetchYouTubeNews, getYouTubeStatus } from './lib/youtube-fetcher.js';
import { getTrendsData } from './lib/google-trends.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function runTests() {
    console.log("🧪 Testing Extra Data Sources...");
    console.log("--------------------------------------------------");

    // 1. Test Pantip
    console.log("\n1. Testing Pantip Scraper...");
    try {
        const pantipPosts = await fetchPantipPosts();
        if (pantipPosts.length === 0) {
            console.log("⚠️ Pantip returned 0 posts. This could be due to API changes or geo-blocking.");
        } else {
            console.log(`✅ OK: Found ${pantipPosts.length} posts`);
            console.log(`- Sample: ${pantipPosts[0].text.substring(0, 50)}...`);
        }
        console.log("Status:", getPantipStatus());
    } catch (err) {
        console.error("❌ Pantip Error:", err);
    }

    // 2. Test Wikipedia (Google Trends proxy)
    console.log("\n2. Testing Wikipedia Analytics (Trends)...");
    try {
        const trends = await getTrendsData();
        console.log(`✅ OK: Received data for ${Object.keys(trends).length} parties`);
        console.log("- Data:", trends);
    } catch (err) {
        console.error("❌ Trends Error:", err);
    }

    // 3. Test YouTube
    console.log("\n3. Testing YouTube Fetcher...");
    const apiKey = process.env.YOUTUBE_API_KEY;
    console.log(`- API Key Status: ${apiKey ? 'Configured (starts with ' + apiKey.substring(0, 5) + '...)' : 'Missing'}`);

    if (apiKey) {
        try {
            const youtubeNews = await fetchYouTubeNews();
            if (youtubeNews.length === 0) {
                console.log("⚠️ YouTube returned 0 videos. Check API Key quota or channel IDs.");
            } else {
                console.log(`✅ OK: Found ${youtubeNews.length} videos`);
                console.log(`- Sample: ${youtubeNews[0].text.substring(0, 50)}...`);
            }
            console.log("Status:", getYouTubeStatus());
        } catch (err) {
            console.error("❌ YouTube Error:", err);
        }
    } else {
        console.log("⚠️ Skipping YouTube test (No API Key)");
    }

    console.log("\n--------------------------------------------------");
    console.log("🏁 Tests Completed.");
}

runTests();
