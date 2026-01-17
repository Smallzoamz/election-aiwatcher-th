// lib/ai-engine.js
import * as fs from 'fs';
import * as path from 'path';
import { getReadNews, markNewsAsRead, saveScoreHistory, loadLatestScores, trimConsumedNewsCache } from './db.js';
import { analyzeWithGemini } from './gemini-client.js';
import { getTrendsData } from './google-trends.js';
import Parser from 'rss-parser';

// ==================== CONSTANTS ====================
export const ELECTION_CONFIG = {
    TOTAL_SEATS: 500,
    TOTAL_VOTERS: 39_000_000,
    MAX_HISTORY_PER_PARTY: 500,
    CONFIDENCE_BASE: 75,
    CONFIDENCE_PER_SOURCE: 3,
    MAX_CONFIDENCE: 95,
};

// ==================== HELPER FUNCTIONS ====================
function logDebug(message) {
    console.log(`[AI-ENGINE] [${new Date().toISOString()}] ${message}`);
}

export const PARTIES = [
    {
        id: 'pp',
        name: "พรรคประชาชน",
        color: '#F47933',
        baseScore: 40,
        candidates: [
            {
                name: "ณัฐพงษ์ เรืองปัญญาวุฒิ",
                nickname: "คุณเท้ง",
                position: "หัวหน้าพรรค/แคนดิเดตนายกฯ",
                bio: "อดีตผู้บริหารบริษัท Cloud Solutions นักเขียนโปรแกรม ผู้นำฝ่ายค้านอายุน้อยที่สุดในประวัติศาสตร์ไทย",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/8/89/Natthaphong_Ruengpanyawut_in_2024.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "ศิริกัญญา ตันสกุล",
                nickname: "คุณไหม",
                position: "รองหัวหน้าพรรค/แคนดิเดตนายกฯ",
                bio: "อดีตนักวิจัย TDRI ผู้เชี่ยวชาญด้านเศรษฐกิจและนโยบายสาธารณะ",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/d/d2/Sirikanya_Tansakul_in_January_2023.jpg&w=400&h=400&fit=cover"
            }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=peoplespartythailand.org&sz=128"
    },
    {
        id: 'pt',
        name: "พรรคเพื่อไทย",
        color: '#E3000F',
        baseScore: 25,
        candidates: [
            {
                name: "ยศชนัน วงศ์สวัสดิ์",
                nickname: "ศ.ดร.เชน",
                position: "แคนดิเดตนายกฯ",
                bio: "หลานทักษิณ ชินวัตร อดีตรองอธิการบดีฝ่ายวิจัย ม.มหิดล ผู้เชี่ยวชาญ Brain-Computer Interface",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/a/ae/Yodchanun_Wongsawat.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "จุลพันธ์ อมรวิวัฒน์",
                nickname: "คุณหนิม",
                position: "หัวหน้าพรรค/แคนดิเดตนายกฯ",
                bio: "บุตรชายสมพงษ์ อมรวิวัฒน์ (อดีตหัวหน้าพรรค) อดีต รมช.การคลัง",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/c/c2/Chullaphan_Amornwiwat.jpg&w=400&h=400&fit=cover"
            }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=ptp.or.th&sz=128"
    },
    {
        id: 'utn',
        name: "พรรครวมไทยสร้างชาติ",
        color: '#2D427D',
        baseScore: 12,
        candidates: [
            { name: "พีระพันธุ์ สาลีรัฐวิภาค", nickname: "คุณตุ๋ย", position: "หัวหน้าพรรค", bio: "อดีตผู้พิพากษาและข้าราชการตุลาการ", imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/5/52/Pirapan_Salirathavibhaga.jpg&w=400&h=400&fit=cover" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=unitedthaination.or.th&sz=128"
    },
    {
        id: 'bjt',
        name: "พรรคภูมิใจไทย",
        color: '#0B1F4F',
        baseScore: 10,
        candidates: [
            { name: "อนุทิน ชาญวีรกูล", nickname: "คุณหนู", position: "หัวหน้าพรรค", bio: "อดีตประธานบริษัท ซิโน-ไทย", imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/2/2e/Anutin_Charnvirakul_in_October_2023.jpg&w=400&h=400&fit=cover" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=bhumjaithai.com&sz=128"
    },
    {
        id: 'dem',
        name: "พรรคประชาธิปัตย์",
        color: '#40C0F0',
        baseScore: 5,
        candidates: [
            { name: "เฉลิมชัย ศรีอ่อน", nickname: "คุณต่อ", position: "หัวหน้าพรรค", bio: "อดีตเลขาธิการพรรคประชาธิปัตย์", imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/4/4d/Chalermchai_Sri-on.jpg&w=400&h=400&fit=cover" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=democrat.or.th&sz=128"
    },
    {
        id: 'pprp',
        name: "พรรคพลังประชารัฐ",
        color: '#1E3A8A',
        baseScore: 4,
        candidates: [
            { name: "พล.อ.ประวิตร วงษ์สุวรรณ", nickname: "พล.อ.ป้อม", position: "หัวหน้าพรรค", bio: "อดีตรองนายกรัฐมนตรี อดีต ผบ.ทบ.", imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/f/f6/Prawit_Wongsuwon_2022.jpg&w=400&h=400&fit=cover" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=pprp.or.th&sz=128"
    },
    {
        id: 'cpd',
        name: "พรรคชาติไทยพัฒนา",
        color: '#15803D',
        baseScore: 2,
        candidates: [
            { name: "วราวุธ ศิลปอาชา", nickname: "คุณท็อป", position: "หัวหน้าพรรค", bio: "บุตรชายคนเล็กของนายบรรหาร ศิลปอาชา", imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/c/c5/Varawut_Silpa-archa_2019.jpg&w=400&h=400&fit=cover" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=chartthaipattana.or.th&sz=128"
    },
    {
        id: 'tst',
        name: "พรรคไทยสร้างไทย",
        color: '#280D5F',
        baseScore: 1,
        candidates: [
            { name: "คุณหญิงสุดารัตน์ เกยุราพันธุ์", nickname: "คุณหญิงหน่อย", position: "หัวหน้าพรรค", bio: "อดีต รมว.สาธารณสุข ยุค 30 บาท", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Sudarat_Keyuraphan_2019.png/440px-Sudarat_Keyuraphan_2019.png" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=thaisangthai.org&sz=128"
    },
    {
        id: 'srt',
        name: "พรรคเสรีรวมไทย",
        color: '#D4AF37',
        baseScore: 1,
        candidates: [
            { name: "พล.ต.อ.เสรีพิศุทธ์ เตมียเวส", nickname: "พล.ต.อ.เสรีพิศุทธ์", position: "หัวหน้าพรรค", bio: "อดีต ผบ.ตร. ฉายาวีรบุรุษนาแก", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Seripisut_Temiyavet_2019.jpg/440px-Seripisut_Temiyavet_2019.jpg" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=seriruamthai.com&sz=128"
    },
    {
        id: 'tkm',
        name: "พรรคไทยก้าวใหม่",
        color: '#0EA5E9',
        baseScore: 1,
        candidates: [
            { name: "ดร.สุชัชวีร์ สุวรรณสวัสดิ์", nickname: "ดร.เอ้", position: "หัวหน้าพรรค", bio: "อดีตอธิการบดี สจล.", imageUrl: "https://ui-avatars.com/api/?name=SS&background=0EA5E9&color=fff&size=128&bold=true&font-size=0.4" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=thaikaomai.com&sz=128"
    },
    {
        id: 'okm',
        name: "พรรคโอกาสใหม่",
        color: '#EC4899',
        baseScore: 1,
        candidates: [
            { name: "รอการเปิดตัว", nickname: "-", position: "รอประกาศ", bio: "พรรคใหม่ รอการเปิดตัว", imageUrl: "https://ui-avatars.com/api/?name=?&background=EC4899&color=fff&size=128&bold=true&font-size=0.4" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=okas-mai.com&sz=128"
    },
    {
        id: 'econ',
        name: "พรรคเศรษฐกิจ",
        color: '#10B981',
        baseScore: 1,
        candidates: [
            { name: "พล.อ.รังษี กิติญาณทรัพย์", nickname: "พล.อ.รังษี", position: "หัวหน้าพรรค", bio: "หัวหน้าพรรคเศรษฐกิจ", imageUrl: "https://ui-avatars.com/api/?name=RK&background=10B981&color=fff&size=128&bold=true&font-size=0.4" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=economic-party.or.th&sz=128"
    },
];

// Remote Data Configuration
const NIDA_DATA_URL = 'https://raw.githubusercontent.com/potatohd-studio/monitor-data/main/nida-data.json';
const FALLBACK_NIDA_DATA = { 'pp': 28.5, 'bjt': 25.0, 'pt': 12.0, 'dem': 8.5, 'utn': 7.5, 'pprp': 2.5, 'cpd': 1.5, 'tst': 1.0, 'srt': 0.8 };

const NEWS_SOURCES = [
    { url: 'https://www.matichon.co.th/politics/feed', source: 'มติชนออนไลน์', type: 'news' },
    { url: 'https://www.prachachat.net/politics/feed', source: 'ประชาชาติธุรกิจ', type: 'news' },
    { url: 'https://www.khaosod.co.th/politics/feed', source: 'ข่าวสด', type: 'news' },
    { url: 'https://prachatai.com/rss.xml', source: 'ประชาไท', type: 'news' },
    { url: 'https://thestandard.co/feed/', source: 'THE STANDARD', type: 'news' },
    { url: 'https://www.bangkokpost.com/rss/data/most-recent.xml', source: 'Bangkok Post', type: 'news' },
];

const REGIONAL_SOURCES = [
    { url: 'https://theisaanrecord.co/feed/', source: 'The Isaan Record', type: 'regional' },
    { url: 'https://www.thephuketnews.com/rss-xml/news.xml', source: 'The Phuket News', type: 'regional' },
    { url: 'https://www.chiangmaicitylife.com/feed/', source: 'Chiang Mai Citylife', type: 'regional' },
];

const SOCIAL_SOURCES = [
    { url: 'https://www.reddit.com/r/Thailand/search.rss?q=politics&restrict_sr=on&sort=new&t=all', source: 'Reddit (r/Thailand)', type: 'social' },
    { url: 'http://pantip.com/forum/rajdamnern/feed', source: 'Pantip (ราชดำเนิน)', type: 'social' },
    { url: 'https://thestandard.co/category/opinion/feed/', source: 'THE STANDARD (Opinion)', type: 'opinion' },
];

const RSS_FEEDS = [...NEWS_SOURCES, ...REGIONAL_SOURCES, ...SOCIAL_SOURCES];
const CACHE_DURATION = 5 * 60 * 1000;

function getWikiIndex(partyId, trendsData = null) {
    if (trendsData && trendsData[partyId]) return trendsData[partyId] * 100;
    return 5.0;
}

let cachedNidaData = null;
let lastFetchTime = 0;

async function getNidaData() {
    const now = Date.now();
    if (cachedNidaData && (now - lastFetchTime < CACHE_DURATION)) return cachedNidaData;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(NIDA_DATA_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        cachedNidaData = data; lastFetchTime = now;
        return data;
    } catch (error) {
        return FALLBACK_NIDA_DATA;
    }
}

// ==================== IMPORTS ====================
// import { fetchLiveNews, getFeedStatus } from './rss-fetcher'; // Replaced by local implementation

// ==================== ENHANCED SENTIMENT ANALYSIS ====================
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

const CONTEXT_LABELS = {
    'person': 'ตัวบุคคล',
    'policy': 'นโยบาย',
    'scandal': 'ข่าวฉาว',
    'performance': 'ผลงาน',
    'support': 'แรงสนับสนุน',
    'conflict': 'ความขัดแย้ง',
    'victim': 'ถูกกระทำ',
};

const VICTIM_PATTERNS = [
    { prefix: 'ถูก', words: ['คุกคาม', 'โจมตี', 'ทำร้าย', 'ข่มขู่', 'กลั่นแกล้ง', 'ใส่ร้าย', 'ทุบ', 'เผา', 'ทำลาย', 'ขู่', 'ปาหิน', 'ปา', 'ด่า', 'ประท้วง'] },
    { prefix: 'โดน', words: ['คุกคาม', 'โจมตี', 'ทำร้าย', 'ข่มขู่', 'กลั่นแกล้ง', 'ใส่ร้าย', 'ทุบ', 'เผา', 'ทำลาย', 'ด่า', 'ปาหิน', 'ปา', 'ประท้วง'] },
    { prefix: 'โพสต์คลิปแฉ', isWhistleblower: true },
    { prefix: 'โพสต์แฉ', isWhistleblower: true },
    { prefix: 'เปิดโปง', isWhistleblower: true },
    { prefix: 'ร้องเรียน', isWhistleblower: true },
    { prefix: 'ร้องทุกข์', isWhistleblower: true },
    { contains: 'ป้ายหาย', isVictim: true },
    { contains: 'ทุบกระจก', isVictim: true },
    { contains: 'รถถูกทำลาย', isVictim: true },
    { contains: 'ถูกทุบ', isVictim: true },
    { contains: 'ถูกเผา', isVictim: true },
    { contains: 'ถูกปา', isVictim: true },
    { contains: 'เดือดจัด', isVictim: true },
];

function detectVictimContext(text) {
    if (!text) return { isVictim: false, isWhistleblower: false, matchedPattern: null };
    for (const pattern of VICTIM_PATTERNS) {
        if (pattern.prefix && pattern.words) {
            for (const word of pattern.words) {
                if (text.includes(pattern.prefix + word)) {
                    return { isVictim: true, isWhistleblower: false, matchedPattern: `${pattern.prefix}${word}` };
                }
            }
        }
        if (pattern.isWhistleblower && text.includes(pattern.prefix)) {
            return { isVictim: false, isWhistleblower: true, matchedPattern: pattern.prefix };
        }
        if (pattern.isVictim && pattern.contains && text.includes(pattern.contains)) {
            return { isVictim: true, isWhistleblower: false, matchedPattern: pattern.contains };
        }
    }
    return { isVictim: false, isWhistleblower: false, matchedPattern: null };
}

function analyzeSentiment(text) {
    if (!text) return { sentiment: 'neu', score: 0, keywords: [], contexts: [] };
    let totalScore = 0;
    const matchedKeywords = [];
    const contextCounts = {};
    let posCount = 0; let negCount = 0;
    POSITIVE_KEYWORDS.forEach(({ word, weight, context }) => {
        if (text.includes(word)) {
            totalScore += weight; matchedKeywords.push({ word, type: 'pos', weight, context });
            contextCounts[context] = (contextCounts[context] || 0) + weight; posCount++;
        }
    });
    NEGATIVE_KEYWORDS.forEach(({ word, weight, context }) => {
        if (text.includes(word)) {
            totalScore -= weight; matchedKeywords.push({ word, type: 'neg', weight, context });
            contextCounts[context] = (contextCounts[context] || 0) + weight; negCount++;
        }
    });
    const sortedContexts = Object.entries(contextCounts).sort((a, b) => b[1] - a[1]).map(([ctx, weight]) => ({ context: ctx, label: CONTEXT_LABELS[ctx] || ctx, weight }));

    // Default confidence for rule-based analysis
    const confidence = totalScore === 0 ? 100 : Math.min(95, 80 + (matchedKeywords.length * 5));

    return {
        sentiment: totalScore > 0.5 ? 'pos' : (totalScore < -0.5 ? 'neg' : 'neu'),
        score: totalScore,
        confidence,
        modelUsed: 'Local Rule Engine',
        keywords: matchedKeywords,
        contexts: sortedContexts,
        primaryContext: sortedContexts[0] || null,
        _posCount: posCount, _negCount: negCount
    };
}

const AMBIGUITY_THRESHOLD = 0.5;
function calculateAmbiguityScore(text, score, posCount, negCount) {
    const victim = detectVictimContext(text);
    if (victim.isVictim || victim.isWhistleblower) return 0.9;
    if (posCount > 0 && negCount > 0) return 0.8;
    if (Math.abs(score) < 0.2 && text.length > 80) return 0.6;
    return Math.abs(score) > 0.7 ? 0.1 : 0.2;
}

async function analyzeSentimentHybrid(text, content = "") {
    const rule = analyzeSentiment(text);
    const ambi = calculateAmbiguityScore(text, rule.score, rule._posCount, rule._negCount);
    if (ambi > AMBIGUITY_THRESHOLD) {
        const gemini = await analyzeWithGemini(text, content);
        if (gemini) return {
            ...rule,
            sentiment: gemini.sentiment,
            score: gemini.score,
            confidence: gemini.confidence,
            modelUsed: gemini.modelUsed,
            isGemini: true,
            geminiReason: gemini.reason,
            ambiguityScore: ambi
        };
    }
    return { ...rule, isGemini: false, ambiguityScore: ambi };
}

const PARTY_KEYWORDS = {
    'pp': ["ประชาชน", "เท้ง", "ปชน", "ศิริกัญญา", "วีระยุทธ"],
    'pt': ["เพื่อไทย", "แพทองธาร", "ทักษิณ", "ยศชนัน", "จุลพันธ์"],
    'utn': ["รวมไทยสร้างชาติ", "พีระพันธุ์", "รทสช"],
    'bjt': ["ภูมิใจไทย", "อนุทิน", "ภท"],
    'dem': ["ประชาธิปัตย์", "เฉลิมชัย", "ปชป"],
    'pprp': ["พลังประชารัฐ", "ประวิตร", "พปชร"],
    'cpd': ["ชาติไทยพัฒนา", "วราวุธ"],
    'tst': ["ไทยสร้างไทย", "สุดารัตน์"],
    'srt': ["เสรีรวมไทย", "เสรีพิศุทธ์"],
    'tkm': ["ไทยก้าวใหม่", "สุชัชวีร์", "พี่เอ้", "ดร.เอ้"],
    'okm': ["โอกาสใหม่", "พรรคโอกาสใหม่"],
    'econ': ["พรรคเศรษฐกิจ", "พลเอกรังษี", "รังษี กิติญาณทรัพย์", "เศรษฐกิจไทย"],
};

function detectParty(text) {
    for (const [id, kw] of Object.entries(PARTY_KEYWORDS)) {
        if (kw.some(k => text.includes(k))) return id;
    }
    return null;
}

function isPoliticalNews(text) {
    if (!text) return false;
    const polKw = ["การเมือง", "เลือกตั้ง", "สภา", "รัฐบาล", "ฝ่ายค้าน", "นายก", "รัฐมนตรี", "พรรค"];
    if (polKw.some(k => text.includes(k))) return true;
    return detectParty(text) !== null;
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

// [NEW] Cache for recent news to keep it stable when no new news available
let cachedRecentNews = [];
let lastNewsCacheTime = 0;
const NEWS_CACHE_DURATION = 60000; // 1 minute cache

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

// Google Trends Integration (Imported at top)

// Reliable Fetch using rss-parser (Server-side)
async function fetchLiveNewsLocal() {
    const parser = new Parser({
        timeout: 8000,
        headers: { 'User-Agent': 'Mozilla/5.0' },
        customFields: { item: [['description', 'description'], ['content:encoded', 'content']] }
    });
    const allItems = [];
    await Promise.all(RSS_FEEDS.map(async (feed) => {
        try {
            const res = await parser.parseURL(feed.url);
            res.items.forEach(item => allItems.push({
                text: item.title,
                link: item.link,
                pubDate: item.pubDate || item.isoDate,
                source: feed.source,
                type: feed.type || 'news',
                region: feed.type === 'regional' ? feed.source.split(' ').pop() : (feed.type === 'news' ? 'National' : 'Online'),
                content: item.content || item.description || ""
            }));
        } catch (e) {
            console.error(`Status: ${feed.source} fetch failed: ${e.message}`);
        }
    }));

    const seen = new Set();
    return allItems.filter(item => {
        const key = (item.text || '').toLowerCase().replace(/[\s\W]/g, '');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function getFeedStatus() {
    return { activeFeeds: RSS_FEEDS.length, lastUpdate: new Date().toISOString() };
}

export async function simulateMarket() {
    if (!isInitialized) await rehydrateState();

    try {
        const nidaData = await getNidaData();
        const trendsData = await getTrendsData();
        const newsList = await fetchLiveNewsLocal();
        const consumed = getReadNews();

        // Filter available news
        const available = newsList.filter(n => {
            const key = (n.text || '').toLowerCase().replace(/[\s\W]/g, '');
            const linkKey = (n.link || '').split('?')[0].replace(/\/$/, '').trim();
            return !consumed.has(key) && (!linkKey || !consumed.has(linkKey));
        });

        // Separate Mainstream/Social
        const mainstream = available.filter(n => n.type === 'news');
        const social = available.filter(n => n.type === 'social' || n.type === 'opinion');

        let newsItem = null;
        let sentimentResult = { sentiment: 'neu', score: 0 };
        let partyId = null;
        let impact = 0;

        // Choose one news item to process
        if (mainstream.length > 0) {
            mainstream.sort((a, b) => new Date(a.pubDate || 0) - new Date(b.pubDate || 0));
            newsItem = mainstream[0];
        } else if (social.length > 0) {
            newsItem = social[0];
        }

        if (newsItem) {
            sentimentResult = await analyzeSentimentHybrid(newsItem.text, newsItem.content);
            partyId = detectParty(newsItem.text);
            impact = sentimentResult.score * 0.3;
            if (newsItem.type !== 'news') impact *= 0.5; // Social has less weight

            markNewsAsRead(newsItem.text, newsItem.link);
        }

        // Update Market State
        marketState = marketState.map(p => {
            let drift = (Math.random() - 0.5) * 0.2;
            if (partyId && p.id === partyId) drift += impact;

            const current = p.score ?? p.baseScore;
            const decay = (p.baseScore - current) * 0.02;
            const trendBonus = trendsData && trendsData[p.id] ? (trendsData[p.id] - 0.2) * 0.05 : 0;
            const finalScore = Math.max(0, Math.min(100, current + drift + decay + trendBonus));
            const delta = finalScore - current;

            partyScoreHistory[p.id].push(finalScore);
            if (partyScoreHistory[p.id].length > 100) partyScoreHistory[p.id].shift();

            return {
                ...p,
                score: finalScore,
                delta: delta.toFixed(2),
                trend: (drift + decay) > 0 ? 'up' : 'down'
            };
        });

        // Calculate Projections
        marketState = marketState.map(p => {
            const nida = nidaData[p.id] || 0.5;
            const news = p.score;
            const wiki = getWikiIndex(p.id, trendsData);

            // QWHS: List (Poll 30%, News 30%, Social 20%, Wiki 20%), Const (Poll 50%, News 20%, Social 10%, Wiki 20%)
            const listVal = (nida * 0.3) + (news * 0.3) + (news * 1.1 * 0.2) + (wiki * 0.2);
            const constVal = (nida * 0.5) + (news * 0.2) + (news * 0.9 * 0.1) + (wiki * 0.2);

            const share = (listVal * 0.4 + constVal * 0.6) / 100;
            const seats = Math.round(share * ELECTION_CONFIG.TOTAL_SEATS);
            const moe = 3.0 + (Math.abs(news - nida) * 0.1);

            return {
                ...p,
                projectedSeats: seats,
                projectedVotes: Math.floor(share * ELECTION_CONFIG.TOTAL_VOTERS).toLocaleString('th-TH'),
                moe: moe.toFixed(1),
                wikiIndex: wiki.toFixed(1),
                nidaScore: nida,
                hiddenSupport: news > (nida + 5),
                divergence: (news - nida).toFixed(1),
                trendPrediction: calculateTrendPrediction(p.id)
            };
        });

        saveScoreHistory(marketState);

        return {
            timestamp: new Date().toISOString(),
            parties: marketState.sort((a, b) => b.score - a.score),
            sampleSize: available.length,
            feedStatus: getFeedStatus(),
            analyzedNews: (newsItem && newsItem.type === 'news') ? {
                headline: newsItem.text,
                link: newsItem.link,
                pubDate: newsItem.pubDate || new Date().toISOString(),
                sentiment: sentimentResult.sentiment,
                confidence: sentimentResult.confidence,
                modelUsed: sentimentResult.modelUsed,
                source: newsItem.source,
                impact: impact.toFixed(2),
                primaryContext: sentimentResult.primaryContext,
                target: partyId ? PARTIES.find(pa => pa.id === partyId)?.name : "ทั่วไป"
            } : null,
            recentNews: newsList.slice(0, 10).map(n => ({
                headline: n.text,
                link: n.link,
                source: n.source,
                pubDate: n.pubDate,
                region: n.region,
                sentiment: analyzeSentiment(n.text).sentiment
            }))
        };
    } catch (error) {
        console.error('simulateMarket major failure:', error);
        return { error: error.message, timestamp: new Date().toISOString(), parties: marketState };
    }
}

export function getScoreHistory() {
    return scoreHistory;
}
