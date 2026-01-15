// lib/ai-engine.js

// ==================== CONSTANTS ====================
export const ELECTION_CONFIG = {
    TOTAL_SEATS: 500,
    TOTAL_VOTERS: 39_000_000,
    MAX_HISTORY_PER_PARTY: 500,
    CONFIDENCE_BASE: 75,
    CONFIDENCE_PER_SOURCE: 3,
    MAX_CONFIDENCE: 95,
};

export const PARTIES = [
    { id: 'pp', name: "พรรคประชาชน", color: '#F47933', baseScore: 40 },
    { id: 'pt', name: "พรรคเพื่อไทย", color: '#E3000F', baseScore: 25 },
    { id: 'utn', name: "พรรครวมไทยสร้างชาติ", color: '#2D427D', baseScore: 12 },
    { id: 'bjt', name: "พรรคภูมิใจไทย", color: '#0B1F4F', baseScore: 10 },
    { id: 'dem', name: "พรรคประชาธิปัตย์", color: '#40C0F0', baseScore: 5 },
];

// ==================== IMPORTS ====================
import { fetchLiveNews, getFeedStatus } from './rss-fetcher';
import { getReadNews, markNewsAsRead } from './db';

// ==================== ENHANCED SENTIMENT ANALYSIS ====================
// Weighted keywords with intensity scores and CONTEXT CATEGORIES
const POSITIVE_KEYWORDS = [
    { word: 'สำเร็จ', weight: 2.0, context: 'performance' },
    { word: 'ชนะ', weight: 2.0, context: 'performance' },
    { word: 'หนุน', weight: 1.5, context: 'support' },
    { word: 'เห็นชอบ', weight: 1.5, context: 'policy' },
    { word: 'ชื่นชม', weight: 1.5, context: 'person' },
    { word: 'ผ่านฉลุย', weight: 1.8, context: 'policy' },
    { word: 'ก้าวหน้า', weight: 1.3, context: 'performance' },
    { word: 'ฟื้นตัว', weight: 1.5, context: 'performance' },
    { word: 'ช่วย', weight: 1.0, context: 'policy' },
    { word: 'แก้ปัญหา', weight: 1.5, context: 'policy' },
    { word: 'พัฒนา', weight: 1.2, context: 'policy' },
    { word: 'สนับสนุน', weight: 1.3, context: 'support' },
    { word: 'นำ', weight: 1.0, context: 'person' },
    { word: 'มั่นใจ', weight: 1.2, context: 'person' },
    { word: 'ประกาศ', weight: 0.5, context: 'policy' },
    { word: 'ลุย', weight: 1.0, context: 'performance' },
    { word: 'ยก', weight: 0.8, context: 'policy' },
];

const NEGATIVE_KEYWORDS = [
    { word: 'ทุจริต', weight: 2.5, context: 'scandal' },
    { word: 'โกง', weight: 2.5, context: 'scandal' },
    { word: 'จับกุม', weight: 2.0, context: 'scandal' },
    { word: 'ค้าน', weight: 1.5, context: 'policy' },
    { word: 'เดือด', weight: 1.3, context: 'conflict' },
    { word: 'สอบ', weight: 1.5, context: 'scandal' },
    { word: 'วิจารณ์', weight: 1.3, context: 'person' },
    { word: 'ไม่เห็นด้วย', weight: 1.5, context: 'policy' },
    { word: 'ล้ม', weight: 1.8, context: 'policy' },
    { word: 'ขัดแย้ง', weight: 1.5, context: 'conflict' },
    { word: 'ประท้วง', weight: 1.8, context: 'conflict' },
    { word: 'ถล่ม', weight: 1.5, context: 'person' },
    { word: 'โจมตี', weight: 1.5, context: 'person' },
    { word: 'แฉ', weight: 1.8, context: 'scandal' },
    { word: 'ฉาว', weight: 2.0, context: 'scandal' },
    { word: 'พัวพัน', weight: 1.5, context: 'scandal' },
    { word: 'เอี่ยว', weight: 1.5, context: 'scandal' },
    { word: 'เสียหาย', weight: 1.3, context: 'performance' },
    { word: 'ล้มเหลว', weight: 2.0, context: 'policy' },
    { word: 'ผิดพลาด', weight: 1.5, context: 'performance' },
    { word: 'ปัญหา', weight: 1.0, context: 'policy' },
];

// Context label mapping (Thai)
const CONTEXT_LABELS = {
    'person': 'ตัวบุคคล',
    'policy': 'นโยบาย',
    'scandal': 'ข่าวฉาว',
    'performance': 'ผลงาน',
    'support': 'แรงสนับสนุน',
    'conflict': 'ความขัดแย้ง',
};

function analyzeSentiment(text) {
    if (!text) return { sentiment: 'neu', score: 0, keywords: [], contexts: [], primaryContext: null };

    let totalScore = 0;
    const matchedKeywords = [];
    const contextCounts = {};

    POSITIVE_KEYWORDS.forEach(({ word, weight, context }) => {
        if (text.includes(word)) {
            totalScore += weight;
            matchedKeywords.push({ word, type: 'pos', weight, context });
            contextCounts[context] = (contextCounts[context] || 0) + weight;
        }
    });

    NEGATIVE_KEYWORDS.forEach(({ word, weight, context }) => {
        if (text.includes(word)) {
            totalScore -= weight;
            matchedKeywords.push({ word, type: 'neg', weight, context });
            contextCounts[context] = (contextCounts[context] || 0) + weight;
        }
    });

    let sentiment = 'neu';
    if (totalScore > 0.5) sentiment = 'pos';
    if (totalScore < -0.5) sentiment = 'neg';

    // Determine primary context (highest weight match)
    const sortedContexts = Object.entries(contextCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([ctx, weight]) => ({
            context: ctx,
            label: CONTEXT_LABELS[ctx] || ctx,
            weight
        }));

    const primaryContext = sortedContexts.length > 0 ? sortedContexts[0] : null;

    return {
        sentiment,
        score: totalScore,
        keywords: matchedKeywords,
        contexts: sortedContexts,
        primaryContext
    };
}

// ==================== PARTY DETECTION ====================
const PARTY_KEYWORDS = {
    'pt': ["เพื่อไทย", "นายก", "แพทองธาร", "ทักษิณ", "ยศชนัน", "จุลพันธ์", "ณัฐวุฒิ"],
    'pp': ["ประชาชน", "ก้าวไกล", "เท้ง", "พิธา", "ธนาธร", "ปชน", "พริษฐ์", "ณัฐชา"],
    'utn': ["รวมไทยสร้างชาติ", "พีระพันธุ์", "รทสช", "ตรีนุช"],
    'bjt': ["ภูมิใจไทย", "อนุทิน", "ภท", "พิพัฒน์"],
    'dem': ["ประชาธิปัตย์", "เฉลิมชัย", "อภิสิทธิ์", "ปชป", "มาร์ค"],
};

function detectParty(text) {
    if (!text) return null;

    for (const [partyId, keywords] of Object.entries(PARTY_KEYWORDS)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return partyId;
        }
    }
    return null;
}

// ==================== CONFIDENCE CALCULATION ====================
function calculateConfidence(newsCount, feedCount, sentimentStrength) {
    const { CONFIDENCE_BASE, CONFIDENCE_PER_SOURCE, MAX_CONFIDENCE } = ELECTION_CONFIG;

    // Base confidence + bonus per active feed + sentiment clarity bonus
    let confidence = CONFIDENCE_BASE;
    confidence += Math.min(feedCount * CONFIDENCE_PER_SOURCE, 15); // Max +15 from feeds
    confidence += Math.min(Math.abs(sentimentStrength) * 2, 5); // Max +5 from sentiment clarity

    return Math.min(confidence, MAX_CONFIDENCE);
}

// ==================== CONFIDENCE INTERVAL ====================
function calculateConfidenceInterval(score, sampleSize) {
    // Using simplified statistical model
    // Margin of error decreases with more samples
    const baseMargin = 5.0; // ±5% base margin
    const sampleFactor = Math.sqrt(50 / Math.max(sampleSize, 10)); // Decreases with more samples

    const margin = baseMargin * sampleFactor;

    return {
        low: Math.max(0, score - margin),
        high: Math.min(100, score + margin),
        margin: +margin.toFixed(2)
    };
}

// ==================== MARKET STATE ====================
let marketState = PARTIES.map(p => ({ ...p, score: p.baseScore }));
let scoreHistory = []; // Track score changes over time

// Per-party history for trend prediction
const partyScoreHistory = {};
PARTIES.forEach(p => {
    partyScoreHistory[p.id] = [];
});

// ==================== TREND PREDICTION ====================
function calculateTrendPrediction(partyId) {
    const history = partyScoreHistory[partyId] || [];

    if (history.length < 3) {
        return { prediction: 'stable', confidence: 'low', delta24h: 0, reason: 'ข้อมูลไม่เพียงพอ' };
    }

    // Get last 10 data points (representing ~5 minutes of data at 2s intervals)
    const recentHistory = history.slice(-10);

    // Calculate linear regression for trend
    const n = recentHistory.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    recentHistory.forEach((score, i) => {
        sumX += i;
        sumY += score;
        sumXY += i * score;
        sumX2 += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    // Project 24h ahead (rough estimate - scale slope to 24h worth of data points)
    // Assuming ~2s intervals, 24h = 43200 intervals, but we scale conservatively
    const scaleFactor = 100; // ~200 seconds worth of trend
    const delta24h = +(slope * scaleFactor).toFixed(2);

    // Determine prediction
    let prediction = 'stable';
    let reason = 'แนวโน้มทรงตัว';

    if (delta24h > 1) {
        prediction = 'up';
        reason = delta24h > 3 ? 'แนวโน้มขาขึ้นแรง' : 'แนวโน้มเพิ่มขึ้น';
    } else if (delta24h < -1) {
        prediction = 'down';
        reason = delta24h < -3 ? 'แนวโน้มขาลงแรง' : 'แนวโน้มลดลง';
    }

    // Confidence based on history length and consistency
    const confidence = history.length > 20 ? 'high' : (history.length > 10 ? 'medium' : 'low');

    return { prediction, confidence, delta24h, reason };
}

// ==================== MAIN SIMULATION ====================
export async function simulateMarket() {
    try {
        // Fetch real news
        const newsList = await fetchLiveNews();
        const feedStatus = getFeedStatus();

        // Load read news from DB
        const consumedNewsLinks = getReadNews();

        // Filter out news that have already been consumed
        const availableNews = newsList.filter(n => !consumedNewsLinks.has(n.text));

        let newsItem;
        let sentimentResult = { sentiment: 'neu', score: 0, keywords: [] };

        if (availableNews.length > 0) {
            // Pick random from AVAILABLE news (weighted by source weight)
            const totalWeight = availableNews.reduce((sum, n) => sum + (n.weight || 1), 0);
            let random = Math.random() * totalWeight;

            for (const news of availableNews) {
                random -= (news.weight || 1);
                if (random <= 0) {
                    newsItem = news;
                    break;
                }
            }

            if (!newsItem) newsItem = availableNews[0];

            // Mark as read in DB with Party ID
            const partyId = detectParty(newsItem.text);
            markNewsAsRead(newsItem.text, partyId).catch(err =>
                console.error('Failed to mark news as read:', err)
            );

            sentimentResult = analyzeSentiment(newsItem.text);
        }

        if (!newsItem) {
            // No new news - just add small random drift
            marketState = marketState.map(p => {
                const drift = (Math.random() - 0.5) * 0.1;
                return {
                    ...p,
                    score: (p.score ?? p.baseScore) + drift,
                    trend: drift > 0 ? 'up' : 'down',
                    delta: Math.abs(drift).toFixed(2)
                };
            });

            return {
                timestamp: new Date().toISOString(),
                parties: marketState.sort((a, b) => b.score - a.score),
                sampleSize: consumedNewsLinks.size,
                feedStatus: feedStatus,
                analyzedNews: null
            };
        }

        // Analyze Real News
        const partyId = detectParty(newsItem.text);

        // Calculate Impact based on sentiment score (not just pos/neg)
        let impact = sentimentResult.score * 0.3; // Scale down for stability
        if (sentimentResult.sentiment === 'neu') {
            impact = (Math.random() - 0.5) * 0.1;
        }

        // Apply to Market State
        marketState = marketState.map(p => {
            let drift = (Math.random() - 0.5) * 0.3;

            if (partyId && p.id === partyId) {
                drift += impact;
            }

            const newScore = (p.score ?? p.baseScore) + drift;

            return {
                ...p,
                score: newScore,
                trend: drift > 0 ? 'up' : 'down',
                delta: Math.abs(drift).toFixed(2)
            };
        });

        // Calculate Projections with Confidence Intervals
        const totalScore = marketState.reduce((sum, p) => sum + (p.score ?? p.baseScore), 0);
        const { TOTAL_SEATS, TOTAL_VOTERS } = ELECTION_CONFIG;

        marketState = marketState.map(p => {
            const share = (p.score ?? p.baseScore) / totalScore;
            const ci = calculateConfidenceInterval(p.score, consumedNewsLinks.size);

            // Record score for trend prediction
            partyScoreHistory[p.id].push(p.score);
            if (partyScoreHistory[p.id].length > 50) {
                partyScoreHistory[p.id] = partyScoreHistory[p.id].slice(-50);
            }

            // Calculate trend prediction for this party
            const trendPrediction = calculateTrendPrediction(p.id);

            return {
                ...p,
                projectedSeats: Math.round(share * TOTAL_SEATS),
                projectedVotes: Math.floor(share * TOTAL_VOTERS).toLocaleString('th-TH'),
                confidenceInterval: ci,
                trendPrediction: trendPrediction
            };
        });

        // Record history for trend analysis
        scoreHistory.push({
            timestamp: new Date().toISOString(),
            scores: marketState.map(p => ({ id: p.id, score: p.score }))
        });

        // Keep only last 100 entries
        if (scoreHistory.length > 100) {
            scoreHistory = scoreHistory.slice(-100);
        }

        const impactedParty = marketState.find(p => p.id === partyId);

        // Calculate overall confidence
        const confidence = calculateConfidence(
            consumedNewsLinks.size,
            feedStatus.activeFeeds,
            sentimentResult.score
        );

        return {
            timestamp: new Date().toISOString(),
            parties: marketState.sort((a, b) => b.score - a.score),
            sampleSize: consumedNewsLinks.size,
            feedStatus: feedStatus,
            analyzedNews: {
                headline: newsItem.text,
                link: newsItem.link,
                sentiment: sentimentResult.sentiment,
                sentimentScore: sentimentResult.score,
                keywords: sentimentResult.keywords,
                contexts: sentimentResult.contexts,
                primaryContext: sentimentResult.primaryContext,
                confidence: confidence,
                impact: +impact.toFixed(2),
                source: newsItem.source,
                target: impactedParty ? impactedParty.name : "ทั่วไป"
            }
        };
    } catch (error) {
        console.error('simulateMarket error:', error);
        return {
            timestamp: new Date().toISOString(),
            parties: marketState.sort((a, b) => b.score - a.score),
            sampleSize: 0,
            analyzedNews: null,
            error: error.message
        };
    }
}

// Get score history for charts
export function getScoreHistory() {
    return scoreHistory;
}
