import { simulateMarket } from './lib/ai-engine.js';

async function test() {
    console.log('Starting market simulation test...');
    try {
        const result = await simulateMarket();
        console.log('Result:', JSON.stringify(result, null, 2).slice(0, 500) + '...');
        console.log('SUCCESS: Market simulation ran without crashes.');
    } catch (error) {
        console.error('FAILURE: Market simulation crashed:', error);
        process.exit(1);
    }
}

test();
