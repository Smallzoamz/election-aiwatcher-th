import { simulateMarket } from './lib/ai-engine.js';
import { getReadNews } from './lib/db.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log("🔍 Verifying News Sorting (Chronological Timeline)...");

async function runTest() {
    console.log("--- Ticking Simulation (Round 1) ---");
    const result1 = await simulateMarket();
    console.log("Analyzed News:", result1.analyzedNews?.headline);
    console.log("PubDate:", result1.analyzedNews?.pubDate);

    console.log("\n--- Ticking Simulation (Round 2) ---");
    const result2 = await simulateMarket();
    console.log("Analyzed News:", result2.analyzedNews?.headline);
    console.log("PubDate:", result2.analyzedNews?.pubDate);

    console.log("\n--- Ticking Simulation (Round 3) ---");
    const result3 = await simulateMarket();
    console.log("Analyzed News:", result3.analyzedNews?.headline);
    console.log("PubDate:", result3.analyzedNews?.pubDate);

    const dates = [
        result1.analyzedNews?.pubDate,
        result2.analyzedNews?.pubDate,
        result3.analyzedNews?.pubDate
    ].filter(Boolean).map(d => new Date(d).getTime());

    if (dates.length >= 2) {
        const isChronological = dates.every((val, i) => i === 0 || val >= dates[i - 1]);
        if (isChronological) {
            console.log("\n✅ SUCCESS: News is being analyzed in Chronological order (Oldest First).");
        } else {
            console.log("\n❌ FAILURE: News order is still inconsistent.");
            console.log("Sequence:", dates);
        }
    } else {
        console.log("\n⚠️ Not enough news analyzed to verify order.");
    }
}

runTest();
