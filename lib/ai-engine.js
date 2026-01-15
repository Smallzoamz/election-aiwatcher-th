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
    { id: 'pp', name: "พรรคประชาชน", color: '#F47933', baseScore: 40, candidates: ["ณัฐพงษ์ เรืองปัญญาวุฒิ", "ศิริกัญญา ตันสกุล", "วีระยุทธ กาญจน์ชูฉัตร"], logoUrl: "https://www.google.com/s2/favicons?domain=peoplespartythailand.org&sz=128" },
    { id: 'pt', name: "พรรคเพื่อไทย", color: '#E3000F', baseScore: 25, candidates: ["ยศชนัน วงศ์สวัสดิ์", "สุริยะ จึงรุ่งเรืองกิจ", "จุลพันธ์ อมรวิวัฒน์"], logoUrl: "https://www.google.com/s2/favicons?domain=ptp.or.th&sz=128" },
    { id: 'utn', name: "พรรครวมไทยสร้างชาติ", color: '#2D427D', baseScore: 12, candidates: ["พีระพันธุ์ สาลีรัฐวิภาค"], logoUrl: "https://www.google.com/s2/favicons?domain=unitedthaination.or.th&sz=128" },
    { id: 'bjt', name: "พรรคภูมิใจไทย", color: '#0B1F4F', baseScore: 10, candidates: ["อนุทิน ชาญวีรกูล"], logoUrl: "https://www.google.com/s2/favicons?domain=bhumjaithai.com&sz=128" },
    { id: 'dem', name: "พรรคประชาธิปัตย์", color: '#40C0F0', baseScore: 5, candidates: ["เฉลิมชัย ศรีอ่อน"], logoUrl: "https://www.google.com/s2/favicons?domain=democrat.or.th&sz=128" },
    { id: 'pprp', name: "พรรคพลังประชารัฐ", color: '#1E3A8A', baseScore: 4, candidates: ["พล.อ.ประวิตร วงษ์สุวรรณ"], logoUrl: "https://www.google.com/s2/favicons?domain=pprp.or.th&sz=128" },
    { id: 'cpd', name: "พรรคชาติไทยพัฒนา", color: '#15803D', baseScore: 2, candidates: ["วราวุธ ศิลปอาชา"], logoUrl: "https://www.google.com/s2/favicons?domain=chartthaipattana.or.th&sz=128" },
    { id: 'tst', name: "พรรคไทยสร้างไทย", color: '#DC2626', baseScore: 1, candidates: ["คุณหญิงสุดารัตน์ เกยุราพันธุ์"], logoUrl: "https://www.google.com/s2/favicons?domain=thaisangthai.org&sz=128" },
    { id: 'srt', name: "พรรคเสรีรวมไทย", color: '#7C3AED', baseScore: 1, candidates: ["พล.ต.อ.เสรีพิศุทธ์ เตมียเวส"], logoUrl: "https://www.google.com/s2/favicons?domain=liberal-party.or.th&sz=128" },
    { id: 'tkm', name: "พรรคไทยก้าวใหม่", color: '#0EA5E9', baseScore: 1, candidates: ["ดร.สุชัชวีร์ สุวรรณสวัสดิ์"], logoUrl: "https://www.google.com/s2/favicons?domain=thaikaomai.com&sz=128" }, // Hypothetical domain for new party
    { id: 'okm', name: "พรรคโอกาสใหม่", color: '#EC4899', baseScore: 1, candidates: ["รอการเปิดตัว"], logoUrl: "https://www.google.com/s2/favicons?domain=okas-mai.com&sz=128" }, // Hypothetical domain
    { id: 'econ', name: "พรรคเศรษฐกิจ", color: '#10B981', baseScore: 1, candidates: ["พล.อ.รังษี กิติญาณทรัพย์"], logoUrl: "https://www.google.com/s2/favicons?domain=economic-party.or.th&sz=128" }, // Hypothetical domain
];

export const NIDA_POLL_DATA = {
    'pp': 35.5,   // Peoples Party
    'pt': 35.0,   // Pheu Thai (Adjusted high to trigger Divergence Alert)
    'utn': 10.5,  // United Thai Nation
    'bjt': 8.0,   // Bhumjaithai
    'dem': 3.5,   // Democrat
    'pprp': 2.0,  // Palang Pracharath
    'cpd': 1.0,   // Chart Thai Pattana
    'tst': 1.5,   // Thai Sang Thai
    'srt': 1.0,   // Seri Ruam Thai
};

const WEIGHT_POLL = 0.4;
const WEIGHT_AI = 0.6;

// ==================== IMPORTS ====================
import { fetchLiveNews, getFeedStatus } from './rss-fetcher';
import { getReadNews, markNewsAsRead, saveScoreHistory, loadLatestScores } from './db';

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
    'pt': ["เพื่อไทย", "นายก", "แพทองธาร", "ทักษิณ", "ยศชนัน", "จุลพันธ์", "ณัฐวุฒิ", "สุริยะ", "สมชาย วงศ์สวัสดิ์"],
    'pp': ["ประชาชน", "ก้าวไกล", "เท้ง", "พิธา", "ธนาธร", "ปชน", "พริษฐ์", "ณัฐชา", "ศิริกัญญา", "วีระยุทธ"],
    'utn': ["รวมไทยสร้างชาติ", "พีระพันธุ์", "รทสช", "ตรีนุช"],
    'bjt': ["ภูมิใจไทย", "อนุทิน", "ภท", "พิพัฒน์"],
    'dem': ["ประชาธิปัตย์", "เฉลิมชัย", "ชวน", "ปชป", "มาร์ค"],
    'pprp': ["พลังประชารัฐ", "ประวิตร", "พปชร", "สันติ"],
    'cpd': ["ชาติไทยพัฒนา", "วราวุธ", "ชทพ"],
    'tst': ["ไทยสร้างไทย", "คุณหญิงสุดารัตน์", "โภคิน"],
    'srt': ["เสรีรวมไทย", "พล.ต.อ.เสรีพิศุทธ์", "เสรีพิศุทธ์"],
    'tkm': ["ไทยก้าวใหม่", "สุชัชวีร์", "พี่เอ้", "ดร.เอ้"],
    'okm': ["โอกาสใหม่", "พรรคโอกาสใหม่"],
    'econ': ["พรรคเศรษฐกิจ", "พลเอกรังษี", "รังษี กิติญาณทรัพย์", "เศรษฐกิจไทย"],
};

// Political relevance keywords - to filter non-political news
const POLITICAL_KEYWORDS = [
    // Party names
    "เพื่อไทย", "ประชาชน", "ก้าวไกล", "ภูมิใจไทย", "ประชาธิปัตย์", "รวมไทยสร้างชาติ",
    "พลังประชารัฐ", "ชาติไทยพัฒนา", "ไทยสร้างไทย", "พรรค",
    // Political terms
    "การเมือง", "เลือกตั้ง", "สภา", "รัฐบาล", "ฝ่ายค้าน", "นายก", "รัฐมนตรี",
    "ส.ส.", "ส.ว.", "กกต.", "รัฐธรรมนูญ", "พ.ร.บ.", "มติ",
    // Political figures (general)
    "นักการเมือง", "ผู้แทน", "หัวหน้าพรรค", "แกนนำ",
    // Actions
    "อภิปราย", "ลงมติ", "ถอดถอน", "ยุบสภา", "เปิดประชุม",
];

function detectParty(text) {
    if (!text) return null;

    for (const [partyId, keywords] of Object.entries(PARTY_KEYWORDS)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return partyId;
        }
    }
    return null;
}

// Check if news is politically relevant
function isPoliticalNews(text) {
    if (!text) return false;

    // Check for party keywords first (high relevance)
    for (const keywords of Object.values(PARTY_KEYWORDS)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return true;
        }
    }

    // Check for general political keywords
    return POLITICAL_KEYWORDS.some(keyword => text.includes(keyword));
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
let isInitialized = false;

// Rehydrate state from Supabase on first run
async function rehydrateState() {
    if (isInitialized) return;

    try {
        const latestScores = await loadLatestScores();
        if (latestScores && latestScores.length > 0) {
            marketState = marketState.map(p => {
                const saved = latestScores.find(s => s.party_id === p.id);
                return saved ? { ...p, score: saved.score } : p;
            });
            console.log('Rehydrated AI market state from Supabase');
        }
    } catch (err) {
        console.error('Rehydration error:', err);
    }
    isInitialized = true;
}

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

export async function simulateMarket() {
    // Ensure state is rehydrated from DB
    if (!isInitialized) await rehydrateState();

    try {
        // Fetch real news
        const newsList = await fetchLiveNews();
        const feedStatus = getFeedStatus();

        // Load read news from DB
        const consumedNewsLinks = getReadNews();

        // Filter out news that have already been consumed
        let availableNews = newsList.filter(n => !consumedNewsLinks.has(n.text));

        // Filter to only political news (skip general/non-political news)
        availableNews = availableNews.filter(n => isPoliticalNews(n.text));

        // Filter to only recent news (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        availableNews = availableNews.filter(n => {
            if (!n.pubDate) return true; // Include if no date (assume recent)
            const newsDate = new Date(n.pubDate);
            return newsDate >= oneDayAgo;
        });

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

            // ETHICS BY DESIGN: Neutral Moderator
            // If the news is overwhelmingly negative (-), try to find a lighter/neutral one occasionally
            // This prevents "Doom Scrolling" effect in the AI feed
            const rawSentiment = analyzeSentiment(newsItem.text);
            if (rawSentiment.sentiment === 'neg' && Math.random() > 0.7) {
                // 30% chance to skip dark news and find something else to balance
                const positiveAlternative = availableNews.find(n => analyzeSentiment(n.text).sentiment === 'pos');
                if (positiveAlternative) {
                    newsItem = positiveAlternative;
                    console.log('⚖️ Ethics Auto-Balance: Swapped negative news for positive coverage.');
                }
            }

            // Analyze sentiment BEFORE marking (to save data)
            sentimentResult = analyzeSentiment(newsItem.text);
            const partyId = detectParty(newsItem.text);

            // Mark as read in DB with metadata
            markNewsAsRead(
                newsItem.text,
                partyId,
                sentimentResult.sentiment,
                +((sentimentResult.score * 0.3).toFixed(2)) // Impact estimate
            ).catch(err => console.error('Failed to mark news as read:', err));
        }

        if (!newsItem) {
            // No new news - just add small random drift
            marketState = marketState.map(p => {
                const drift = (Math.random() - 0.5) * 0.1;

                // NIDA Comparison
                const nidaScore = NIDA_POLL_DATA[p.id] || 0.5;
                const divergence = ((p.score ?? p.baseScore) - nidaScore).toFixed(1);

                // HIDDEN SUPPORT LOGIC: If NIDA is significantly higher than AI (> 5%)
                // This means AI is "under-representing" this party (Silent Majority)
                const isUnderValued = (nidaScore - (p.score ?? p.baseScore)) > 5.0;

                return {
                    ...p,
                    score: (p.score ?? p.baseScore) + drift,
                    trend: drift > 0 ? 'up' : 'down',
                    delta: Math.abs(drift).toFixed(2),
                    nidaScore: nidaScore,
                    divergence: divergence,
                    hiddenSupport: isUnderValued // Flag for UI Alert
                };
            });

            // Get latest 7 political news for display (even if already consumed)
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const seenHeadlines = new Set();
            const recentPoliticalNews = newsList
                .filter(n => isPoliticalNews(n.text)) // Must contain political keywords
                .filter(n => !n.source?.includes('ทั่วไป')) // Exclude general feeds
                .filter(n => !n.pubDate || new Date(n.pubDate) >= oneDayAgo)
                .filter(n => {
                    // Deduplicate: skip if headline already seen
                    if (seenHeadlines.has(n.text)) return false;
                    seenHeadlines.add(n.text);
                    return true;
                })
                .slice(0, 7)
                .map(n => ({
                    headline: n.text,
                    link: n.link,
                    pubDate: n.pubDate ? new Date(n.pubDate).toISOString() : null,
                    source: n.source,
                    sentiment: analyzeSentiment(n.text).sentiment,
                    isHistorical: true
                }));

            return {
                timestamp: new Date().toISOString(),
                parties: marketState.sort((a, b) => b.score - a.score),
                sampleSize: consumedNewsLinks.size,
                feedStatus: feedStatus,
                analyzedNews: null,
                recentNews: recentPoliticalNews // Send recent news for display
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
        const { TOTAL_SEATS, TOTAL_VOTERS } = ELECTION_CONFIG;
        const SEATS_LIST = 100;
        const SEATS_CONST = 400;

        // Weights for Split Calculation
        const W_LIST_AI = 0.6;
        const W_LIST_POLL = 0.4;
        const W_CONST_AI = 0.3;
        const W_CONST_POLL = 0.7;

        // 1. Calculate weighted scores for both systems
        const listScores = marketState.map(p => {
            const nida = NIDA_POLL_DATA[p.id] || 0.5;
            const ai = p.score ?? p.baseScore;
            return { id: p.id, val: (nida * W_LIST_POLL) + (ai * W_LIST_AI) };
        });

        const constScores = marketState.map(p => {
            const nida = NIDA_POLL_DATA[p.id] || 0.5;
            const ai = p.score ?? p.baseScore;
            return { id: p.id, val: (nida * W_CONST_POLL) + (ai * W_CONST_AI) };
        });

        const totalListScore = listScores.reduce((sum, s) => sum + s.val, 0);
        const totalConstScore = constScores.reduce((sum, s) => sum + s.val, 0);

        marketState = marketState.map(p => {
            // NIDA Comparison
            const nidaScore = NIDA_POLL_DATA[p.id] || 0.5;
            const aiScore = p.score ?? p.baseScore;

            // --- SPLIT SEAT CALCULATION ---
            const listRaw = listScores.find(s => s.id === p.id).val;
            const constRaw = constScores.find(s => s.id === p.id).val;

            const shareList = listRaw / totalListScore;
            const shareConst = constRaw / totalConstScore;

            const seatsList = shareList * SEATS_LIST;
            const seatsConst = shareConst * SEATS_CONST;
            const totalSeats = Math.round(seatsList + seatsConst);

            const shareTotal = (seatsList + seatsConst) / TOTAL_SEATS; // Effective total share

            // --- VOLATILITY INDEX ---
            // If AI detects many "Neutral", it implies "Undecided"
            // We use confidence as a reverse proxy for volatility, scaled to current NIDA undecided ~14.1%
            // Low confidence = High Volatility
            const ci = calculateConfidenceInterval(p.score, consumedNewsLinks.size);
            const volatilityIndex = Math.max(5, (20 - (ci.margin * 2))).toFixed(1); // Experimental formula

            // Record score for trend prediction
            partyScoreHistory[p.id].push(p.score);
            if (partyScoreHistory[p.id].length > 50) {
                partyScoreHistory[p.id] = partyScoreHistory[p.id].slice(-50);
            }

            // Calculate trend prediction for this party
            const trendPrediction = calculateTrendPrediction(p.id);

            const divergence = (aiScore - nidaScore).toFixed(1);

            // --- DARK HORSE ALERT (Bhumjaithai Focus) ---
            let isDarkHorse = false;
            if (p.id === 'bjt') {
                // Trigger if AI score is significantly higher than Poll (Hidden momentum)
                // OR if trend is consistently UP
                if ((aiScore > nidaScore * 1.1) || trendPrediction.prediction === 'up') {
                    isDarkHorse = true;
                    console.log('🐎 Dark Horse Alert Triggered: Bhumjaithai');
                }
            }

            // HIDDEN SUPPORT LOGIC
            const isUnderValued = (nidaScore - aiScore) > 5.0;

            return {
                ...p,
                projectedSeats: totalSeats,
                projectedSeatsList: Math.round(seatsList), // Extra data for debug
                projectedSeatsConst: Math.round(seatsConst), // Extra data for debug
                projectedVotes: Math.floor(shareTotal * TOTAL_VOTERS).toLocaleString('th-TH'),
                confidenceInterval: ci,
                trendPrediction: trendPrediction,
                nidaScore: nidaScore,
                divergence: divergence,
                hiddenSupport: isUnderValued,
                isDarkHorse: isDarkHorse, // New Alert
                volatility: volatilityIndex, // New Metric
                hybridScore: listRaw.toFixed(2) // Keep List Score as primary "Hybrid" for ranking if needed
            };
        });

        // SAVE TO DB AFTER CALCULATION
        saveScoreHistory(marketState);

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
                pubDate: newsItem.pubDate ? new Date(newsItem.pubDate).toISOString() : null,
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
