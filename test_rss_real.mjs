
// Using native fetch available in Node.js 18+

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://www.google.com/',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
};

async function testFetch() {
    const urls = [
        'https://www.matichon.co.th/politics/feed',
        'https://www.khaosod.co.th/politics/feed'
    ];

    for (const url of urls) {
        console.log(`Testing ${url}...`);
        try {
            const res = await fetch(url, { headers: HEADERS });
            console.log(`Status: ${res.status}`);
            if (res.ok) {
                const text = await res.text();
                console.log(`Length: ${text.length}`);
                console.log(`Sample: ${text.substring(0, 200)}`);
            }
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }
}

testFetch();
