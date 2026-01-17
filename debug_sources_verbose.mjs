
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function debugPantip() {
    console.log("\n--- Debugging Pantip ---");
    const rooms = ['sinthorn', 'rajdumnern'];
    for (const room of rooms) {
        console.log(`Checking room: ${room}`);
        try {
            const url = `https://pantip.com/api/forum-service/home/get_room_recommend?room=${room}&limit=5`;
            const resp = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json',
                    'Referer': 'https://pantip.com/'
                }
            });
            console.log(`Status: ${resp.status} ${resp.statusText}`);
            const text = await resp.text();
            try {
                const json = JSON.parse(text);
                console.log(`Got JSON: ${json.success ? 'Success' : 'Failed'}`);
                if (json.data?.topics) {
                    console.log(`Found ${json.data.topics.length} topics`);
                } else {
                    console.log("No topics in JSON data.");
                }
            } catch (e) {
                console.log("Response is not JSON. Preview:");
                console.log(text.substring(0, 200));
            }
        } catch (err) {
            console.error(`Fetch Error: ${err.message}`);
        }
    }
}

async function debugYouTube() {
    console.log("\n--- Debugging YouTube ---");
    const key = process.env.YOUTUBE_API_KEY;
    const channelId = 'UCXFrdLDGeWk5sGhgQb4sPPg'; // PPTV
    console.log(`Using Key: ${key ? 'Yes' : 'No'}`);
    if (!key) return;

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&q=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87&type=video&order=date&maxResults=5&key=${key}`;
        const resp = await fetch(url);
        console.log(`Status: ${resp.status} ${resp.statusText}`);
        const data = await resp.json();
        if (data.error) {
            console.log("YouTube API Error:", JSON.stringify(data.error, null, 2));
        } else if (data.items) {
            console.log(`Found ${data.items.length} items`);
        } else {
            console.log("No items found. Full response:", JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error(`YouTube Error: ${err.message}`);
    }
}

async function run() {
    await debugPantip();
    await debugYouTube();
}

run();
