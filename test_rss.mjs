
import fetch from 'node-fetch'; // Standard available in node usually, or native
// If native, no import needed in Node 18+

const RSS_APP_URL = 'https://www.thairath.co.th/rss/politics';

async function testRSS() {
    console.log("Testing RSS Fetch...");
    try {
        // Method 1: RSS2JSON (Existing method)
        console.log("1. Testing rss2json.com API...");
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_APP_URL)}`;
        const start = Date.now();
        const res = await fetch(apiUrl);
        console.log(`- Status: ${res.status}`);
        console.log(`- Time: ${Date.now() - start}ms`);

        if (!res.ok) {
            console.error("- Error Body:", await res.text());
        } else {
            const data = await res.json();
            console.log(`- Items found: ${data.items ? data.items.length : 0}`);
        }

    } catch (err) {
        console.error("❌ Method 1 Failed:", err.message);
    }

    try {
        // Method 2: Direct Fetch
        console.log("\n2. Testing Direct RSS Fetch...");
        const res2 = await fetch(RSS_APP_URL);
        console.log(`- Status: ${res2.status}`);
        if (!res2.ok) {
            console.error("- Error:", await res2.text());
        } else {
            const text = await res2.text();
            console.log(`- Content Length: ${text.length}`);
            console.log(`- Starts with: ${text.substring(0, 50)}`);
        }
    } catch (err) {
        console.error("❌ Method 2 Failed:", err.message);
    }
}

testRSS();
