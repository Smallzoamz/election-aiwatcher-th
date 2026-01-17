
// Native fetch is available in Node 18+

const RSS_FEEDS = [
    { url: 'https://www.matichon.co.th/politics/feed', source: 'มติชนออนไลน์' },
    { url: 'https://www.prachachat.net/politics/feed', source: 'ประชาชาติธุรกิจ' },
    { url: 'https://www.matichon.co.th/feed', source: 'มติชน (ทั่วไป)' },
    { url: 'https://www.prachachat.net/feed', source: 'ประชาชาติ (ทั่วไป)' },
    { url: 'https://www.khaosod.co.th/feed', source: 'ข่าวสด' },
    { url: 'https://prachatai.com/rss.xml', source: 'ประชาไท' },
    { url: 'https://thestandard.co/feed/', source: 'THE STANDARD' },
    { url: 'https://www.bangkokpost.com/rss/data/most-recent.xml', source: 'Bangkok Post' },
    { url: 'https://theisaanrecord.co/feed/', source: 'The Isaan Record' },
    { url: 'https://www.thephuketnews.com/rss-xml/news.xml', source: 'The Phuket News' },
    { url: 'https://www.chiangmaicitylife.com/feed/', source: 'Chiang Mai Citylife' },
    { url: 'https://www.reddit.com/r/Thailand/search.rss?q=politics&restrict_sr=on&sort=new&t=all', source: 'Reddit (r/Thailand)' },
    { url: 'https://www.bbc.com/thai/index.xml', source: 'BBC News ไทย' },
];

async function auditRSS() {
    console.log("🚀 Starting Comprehensive RSS Audit...");
    console.log("--------------------------------------------------");

    const results = [];

    for (const feed of RSS_FEEDS) {
        process.stdout.write(`Testing [${feed.source}]... `);
        const start = Date.now();
        try {
            const res = await fetch(feed.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const duration = Date.now() - start;

            if (res.ok) {
                const text = await res.text();
                const isXML = text.includes('<?xml') || text.includes('<rss') || text.includes('<feed');
                console.log(`✅ OK (${res.status}) in ${duration}ms | XML: ${isXML ? 'Yes' : 'No'}`);
                results.push({ source: feed.source, url: feed.url, status: res.status, ok: true, isXML });
            } else {
                console.log(`❌ FAILED (${res.status}) in ${duration}ms`);
                results.push({ source: feed.source, url: feed.url, status: res.status, ok: false });
            }
        } catch (err) {
            console.log(`❌ ERROR: ${err.message}`);
            results.push({ source: feed.source, url: feed.url, status: 'ERROR', message: err.message, ok: false });
        }
    }

    console.log("--------------------------------------------------");
    console.log("📊 Summary:");
    const total = results.length;
    const success = results.filter(r => r.ok).length;
    console.log(`- Total: ${total}`);
    console.log(`- Success: ${success}`);
    console.log(`- Failed: ${total - success}`);

    if (total - success > 0) {
        console.log("\n⚠️ Broken Feeds:");
        results.filter(r => !r.ok).forEach(r => {
            console.log(`- [${r.source}] ${r.status !== 'ERROR' ? '(' + r.status + ')' : r.message} : ${r.url}`);
        });
    }
}

auditRSS();
