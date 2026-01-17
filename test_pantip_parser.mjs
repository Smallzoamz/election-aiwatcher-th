import Parser from 'rss-parser';

const parser = new Parser({
    customFields: { item: [['description', 'description'], ['content:encoded', 'content']] }
});

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    'Accept-Language': 'en-US,en;q=0.9,th;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
};

async function testPantipParser() {
    const url = 'http://pantip.com/forum/rajdamnern/feed';
    console.log(`Testing Pantip Parser for: ${url}`);

    try {
        const response = await fetch(url, {
            headers: HEADERS
        });

        console.log(`Fetch status: ${response.status}`);
        if (!response.ok) {
            console.log(`Fetch failed: ${response.statusText}`);
            return;
        }

        const xml = await response.text();
        console.log(`Fetched XML length: ${xml.length}`);

        const feed = await parser.parseString(xml);
        console.log(`Parsed successfully! Title: ${feed.title}`);
        console.log(`Items count: ${feed.items.length}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        if (err.stack) console.error(err.stack);
    }
}

testPantipParser();
