
import Parser from 'rss-parser';

const NEWS_SOURCES = [
    { url: 'https://www.matichon.co.th/politics/feed', source: 'มติชนออนไลน์', type: 'news' },
    { url: 'https://www.prachachat.net/politics/feed', source: 'ประชาชาติธุรกิจ', type: 'news' },
    { url: 'https://www.khaosod.co.th/politics/feed', source: 'ข่าวสด', type: 'news' },
    { url: 'https://prachatai.com/rss.xml', source: 'ประชาไท', type: 'news' },
    { url: 'https://thestandard.co/feed/', source: 'THE STANDARD', type: 'news' },
    { url: 'https://www.bangkokpost.com/rss/data/most-recent.xml', source: 'Bangkok Post', type: 'news' },
];

const parser = new Parser();

async function checkFeeds() {
    console.log(`Current Time: ${new Date().toISOString()}`);
    for (const feed of NEWS_SOURCES) {
        try {
            const res = await parser.parseURL(feed.url);
            console.log(`\nSource: ${feed.source} (${res.items.length} items)`);
            res.items.slice(0, 3).forEach(item => {
                console.log(`- [${item.pubDate}] ${item.title}`);
            });
        } catch (e) {
            console.log(`\nSource: ${feed.source} FAILED: ${e.message}`);
        }
    }
}

checkFeeds();
