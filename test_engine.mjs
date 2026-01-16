import { simulateMarket } from './lib/ai-engine.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log("🚀 Starting Market Simulation Test...");

try {
    const result = await simulateMarket();
    console.log("✅ Simulation Successful!");

    // safe access to result properties
    const news = result.recentNews || [];
    console.log(`Recent News Count: ${news.length}`);
    if (news.length > 0) {
        console.log("First Item:", news[0]);
    } else {
        console.log("⚠️ No recent news returned.");
    }

} catch (error) {
    console.error("❌ CRITICAL ERROR:", error);
    console.error(error.stack);
}
