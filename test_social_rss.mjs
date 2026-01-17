const SOCIAL_FEEDS = [
    { url: 'https://www.reddit.com/r/Thailand/search.rss?q=politics&restrict_sr=on&sort=new&t=all', source: 'Reddit (r/Thailand Politics)' },
    { url: 'http://pantip.com/forum/rajdamnern/feed', source: 'Pantip (ราชดำเนิน)' },
    { url: 'https://www.matichon.co.th/politics/feed', source: 'มติชน (การเมือง)' },
    { url: 'https://www.prachachat.net/politics/feed', source: 'ประชาชาติ (การเมือง)' },
    { url: 'https://prachatai.com/rss.xml', source: 'ประชาไท (Social/Political)' },
    { url: 'https://thestandard.co/category/opinion/feed/', source: 'THE STANDARD (Opinion)' },
];

async function testSocialFeeds() {
    console.log("🔍 Testing Social & Opinion RSS Feeds...");
    console.log("--------------------------------------------------");

    for (const feed of SOCIAL_FEEDS) {
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
                const itemCount = (text.match(/<item>|<entry>/g) || []).length;
                console.log(`✅ OK (${res.status}) in ${duration}ms | Items: ${itemCount}`);
            } else {
                console.log(`❌ FAILED (${res.status}) in ${duration}ms`);
            }
        } catch (err) {
            console.log(`❌ ERROR: ${err.message}`);
        }
    }
}

testSocialFeeds();
