// lib/ai-engine.js
import * as fs from 'fs';
import * as path from 'path';
import { getReadNews, markNewsAsRead, saveScoreHistory, loadLatestScores, trimConsumedNewsCache } from './db.js';
import { analyzeWithGemini } from './gemini-client.js';

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
                birthdate: "18 พฤษภาคม 2530",
                education: "วิศวกรรมคอมพิวเตอร์ จุฬาลงกรณ์มหาวิทยาลัย",
                currentPosition: "หัวหน้าพรรคประชาชน, ผู้นำฝ่ายค้านในสภา",
                bio: "อดีตผู้บริหารบริษัท Cloud Solutions นักเขียนโปรแกรม ผู้นำฝ่ายค้านอายุน้อยที่สุดในประวัติศาสตร์ไทย",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/8/89/Natthaphong_Ruengpanyawut_in_2024.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "ศิริกัญญา ตันสกุล",
                nickname: "คุณไหม",
                position: "รองหัวหน้าพรรค/แคนดิเดตนายกฯ",
                birthdate: "4 เมษายน 2524",
                education: "ป.โท เศรษฐศาสตร์ ม.ธรรมศาสตร์, ป.โท Toulouse School of Economics ฝรั่งเศส",
                currentPosition: "รองหัวหน้าพรรคประชาชน, ส.ส.บัญชีรายชื่อ",
                bio: "อดีตนักวิจัย TDRI ผู้เชี่ยวชาญด้านเศรษฐกิจและนโยบายสาธารณะ",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/d/d2/Sirikanya_Tansakul_in_January_2023.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "วีระยุทธ กาญจน์ชูฉัตร",
                nickname: "ดร.ต้น",
                position: "รองหัวหน้าพรรค/แคนดิเดตนายกฯ",
                birthdate: "16 พฤษภาคม 2522",
                education: "ป.เอก Development Studies ม.เคมบริดจ์ สหราชอาณาจักร",
                currentPosition: "รองหัวหน้าพรรคประชาชน ฝ่ายยุทธศาสตร์การเมือง",
                bio: "อดีต รศ. ด้านเศรษฐศาสตร์การเมือง GRIPS ญี่ปุ่น ที่ปรึกษา IMF, UNCTAD",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/0/04/Virayuth_Kanchoochat_in_2024.jpg&w=400&h=400&fit=cover"
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
                birthdate: "8 ตุลาคม 2522",
                education: "ป.เอก วิศวกรรมไฟฟ้า ม.เท็กซัส อาร์ลิงตัน สหรัฐอเมริกา",
                currentPosition: "อาจารย์ ภาควิชาวิศวกรรมชีวการแพทย์ ม.มหิดล",
                bio: "หลานทักษิณ ชินวัตร อดีตรองอธิการบดีฝ่ายวิจัย ม.มหิดล ผู้เชี่ยวชาญ Brain-Computer Interface",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/a/ae/Yodchanun_Wongsawat.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "จุลพันธ์ อมรวิวัฒน์",
                nickname: "คุณหนิม",
                position: "หัวหน้าพรรค/แคนดิเดตนายกฯ",
                birthdate: "8 เมษายน 2518",
                education: "ป.ตรี เศรษฐศาสตร์ จุฬาฯ, MBA บอสตัน คอลเลจ สหรัฐอเมริกา",
                currentPosition: "หัวหน้าพรรคเพื่อไทย, ส.ส.เชียงใหม่ 5 สมัย",
                bio: "บุตรชายสมพงษ์ อมรวิวัฒน์ (อดีตหัวหน้าพรรค) อดีต รมช.การคลัง",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/c/c2/Chullaphan_Amornwiwat.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "สุริยะ จึงรุ่งเรืองกิจ",
                nickname: "คุณอ๊อฟ",
                position: "ผอ.เลือกตั้ง/แคนดิเดตนายกฯ",
                birthdate: "10 ธันวาคม 2497",
                education: "ป.ตรี วิศวกรรมอุตสาหการ UC Berkeley สหรัฐอเมริกา",
                currentPosition: "ผอ.เลือกตั้งพรรคเพื่อไทย",
                bio: "อดีต รมว.อุตสาหกรรม, คมนาคม นักธุรกิจอุตสาหกรรมรถยนต์",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/8/8c/Suriya_Jungrungreangkit_2024.jpg&w=400&h=400&fit=cover"
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
            {
                name: "พีระพันธุ์ สาลีรัฐวิภาค",
                nickname: "คุณตุ๋ย",
                position: "หัวหน้าพรรค",
                birthdate: "21 กุมภาพันธ์ 2502",
                education: "ป.โท กฎหมาย (LL.M., MCL) มหาวิทยาลัยทูเลน สหรัฐอเมริกา",
                currentPosition: "รองนายกรัฐมนตรี และ รมว.พลังงาน",
                bio: "อดีตผู้พิพากษาและข้าราชการตุลาการ ผู้สอบสวนคดีค่าโง่โฮปเวลล์",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/5/52/Pirapan_Salirathavibhaga.jpg&w=400&h=400&fit=cover"
            }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=unitedthaination.or.th&sz=128"
    },
    {
        id: 'bjt',
        name: "พรรคภูมิใจไทย",
        color: '#0B1F4F',
        baseScore: 10,
        candidates: [
            {
                name: "อนุทิน ชาญวีรกูล",
                nickname: "คุณหนู",
                position: "หัวหน้าพรรค",
                birthdate: "13 กันยายน 2509",
                education: "ป.ตรี วิศวกรรมศาสตร์ Hofstra University สหรัฐอเมริกา",
                currentPosition: "รองนายกรัฐมนตรี และ รมว.มหาดไทย",
                bio: "อดีตประธานบริษัท ซิโน-ไทย เอ็นจีเนียริ่ง แอนด์ คอนสตรัคชั่น จำกัด (มหาชน)",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/2/2e/Anutin_Charnvirakul_in_October_2023.jpg&w=400&h=400&fit=cover"
            }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=bhumjaithai.com&sz=128"
    },
    {
        id: 'dem',
        name: "พรรคประชาธิปัตย์",
        color: '#40C0F0',
        baseScore: 5,
        candidates: [
            {
                name: "เฉลิมชัย ศรีอ่อน",
                nickname: "คุณต่อ",
                position: "หัวหน้าพรรค",
                birthdate: "7 มีนาคม 2508",
                education: "ป.เอก ยุทธศาสตร์การพัฒนา มรภ.พระนคร",
                currentPosition: "หัวหน้าพรรคประชาธิปัตย์, รมว.ทรัพยากรธรรมชาติฯ",
                bio: "อดีตเลขาธิการพรรคประชาธิปัตย์ อดีต รมว.เกษตรและสหกรณ์",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/4/4d/Chalermchai_Sri-on.jpg&w=400&h=400&fit=cover"
            }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=democrat.or.th&sz=128"
    },
    {
        id: 'pprp',
        name: "พรรคพลังประชารัฐ",
        color: '#1E3A8A',
        baseScore: 4,
        candidates: [
            {
                name: "พล.อ.ประวิตร วงษ์สุวรรณ",
                nickname: "พล.อ.ป้อม",
                position: "หัวหน้าพรรค",
                birthdate: "11 สิงหาคม 2488",
                education: "โรงเรียนนายร้อยพระจุลจอมเกล้า (จปร.17)",
                currentPosition: "หัวหน้าพรรคพลังประชารัฐ",
                bio: "อดีตรองนายกรัฐมนตรี อดีตผู้บัญชาการทหารบก พี่ใหญ่แห่งบูรพาพยัคฆ์",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/f/f6/Prawit_Wongsuwon_2022.jpg&w=400&h=400&fit=cover"
            }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=pprp.or.th&sz=128"
    },
    {
        id: 'cpd',
        name: "พรรคชาติไทยพัฒนา",
        color: '#15803D',
        baseScore: 2,
        candidates: [
            {
                name: "วราวุธ ศิลปอาชา",
                nickname: "คุณท็อป",
                position: "หัวหน้าพรรค",
                birthdate: "11 กรกฎาคม 2516",
                education: "ป.โท MBA (Finance) University of Wisconsin-Madison สหรัฐอเมริกา",
                currentPosition: "รมว.การพัฒนาสังคมและความมั่นคงของมนุษย์",
                bio: "บุตรชายคนเล็กของนายบรรหาร ศิลปอาชา (อดีตนายกรัฐมนตรี)",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/c/c5/Varawut_Silpa-archa_2019.jpg&w=400&h=400&fit=cover"
            }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=chartthaipattana.or.th&sz=128"
    },
    {
        id: 'tst',
        name: "พรรคไทยสร้างไทย",
        color: '#280D5F',
        baseScore: 1,
        candidates: [
            {
                name: "คุณหญิงสุดารัตน์ เกยุราพันธุ์",
                nickname: "คุณหญิงหน่อย",
                position: "หัวหน้าพรรค",
                birthdate: "1 พฤษภาคม 2504",
                education: "ป.เอก พุทธศาสตรดุษฎีบัณฑิต มจร.",
                currentPosition: "หัวหน้าพรรคไทยสร้างไทย",
                bio: "อดีต รมว.สาธารณสุข ผู้ผลักดันโครงการ 30 บาทรักษาทุกโรค",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Sudarat_Keyuraphan_2019.png/440px-Sudarat_Keyuraphan_2019.png"
            }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=thaisangthai.org&sz=128"
    },
    {
        id: 'tlp',
        name: "พรรคเสรีรวมไทย",
        color: '#D4AF37',
        baseScore: 1,
        candidates: [
            {
                name: "พล.ต.อ.เสรีพิศุทธ์ เตมียเวส",
                nickname: "พล.ต.อ.เสรีพิศุทธ์",
                position: "หัวหน้าพรรค",
                birthdate: "3 กันยายน 2491",
                education: "โรงเรียนนายร้อยตำรวจ (รุ่น 24)",
                currentPosition: "หัวหน้าพรรคเสรีรวมไทย",
                bio: "ฉายา 'วีรบุรุษนาแก' อดีตผู้บัญชาการตำรวจแห่งชาติ มือปราบตงฉิน",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Seripisut_Temiyavet_2019.jpg/440px-Seripisut_Temiyavet_2019.jpg"
            }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=seriruamthai.com&sz=128"
    },
    {
        id: 'tkm',
        name: "พรรคไทยก้าวใหม่",
        color: '#0EA5E9',
        baseScore: 1,
        candidates: [
            { name: "ดร.สุชัชวีร์ สุวรรณสวัสดิ์", nickname: "ดร.เอ้", position: "หัวหน้าพรรค", bio: "อดีตอธิการบดี สจล. นักวิชาการด้านวิศวกรรม", imageUrl: "https://ui-avatars.com/api/?name=SS&background=0EA5E9&color=fff&size=128&bold=true&font-size=0.4" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=thaikaomai.com&sz=128"
    },
    {
        id: 'okm',
        name: "พรรคโอกาสใหม่",
        color: '#EC4899',
        baseScore: 1,
        candidates: [
            { name: "รอการเปิดตัว", nickname: "-", position: "รอประกาศ", bio: "พรรคใหม่ รอการเปิดตัวแคนดิเดตอย่างเป็นทางการ", imageUrl: "https://ui-avatars.com/api/?name=?&background=EC4899&color=fff&size=128&bold=true&font-size=0.4" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=okas-mai.com&sz=128"
    },
    {
        id: 'econ',
        name: "พรรคเศรษฐกิจ",
        color: '#10B981',
        baseScore: 1,
        candidates: [
            { name: "พล.อ.รังษี กิติญาณทรัพย์", nickname: "พล.อ.รังษี", position: "หัวหน้าพรรค", bio: "หัวหน้าพรรคเศรษฐกิจ เน้นนโยบายเศรษฐกิจปากท้อง", imageUrl: "https://ui-avatars.com/api/?name=RK&background=10B981&color=fff&size=128&bold=true&font-size=0.4" }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=economic-party.or.th&sz=128"
    },
];

// Remote Data Configuration
const NIDA_DATA_URL = 'https://raw.githubusercontent.com/potatohd-studio/monitor-data/main/nida-data.json'; // Default URL (Example)

// Fallback Data (used if fetch fails) - Updated Jan 2026
const FALLBACK_NIDA_DATA = {
    'pp': 28.5,   // พรรคประชาชน (ผู้นำฝ่ายค้าน)
    'bjt': 25.0,  // ภูมิใจไทย (นายกฯ อนุทิน)
    'pt': 12.0,   // เพื่อไทย (หัวหน้าใหม่ จุลพันธ์)
    'dem': 8.5,   // ประชาธิปัตย์
    'utn': 7.5,   // รวมไทยสร้างชาติ
    'pprp': 2.5,  // พลังประชารัฐ
    'cpd': 1.5,   // ชาติไทยพัฒนา
    'tst': 1.0,   // ไทยสร้างไทย
    'srt': 0.8,   // เสรีรวมไทย
};

// ---------------------------------------------------------
// [NEW] Wikipedia PageViews Data (30-Day Rolling AVG)
// Mock data for Tech Demo - representing "Interest/Curiosity"
// ---------------------------------------------------------
const WIKI_PAGEVIEWS = {
    'pp': 450000,   // High organic interest (Natthaphong + Candidates)
    'pt': 380000,   // Ruling party figures
    'bjt': 180000,  // Anutin acts as news magnet
    'utn': 120000,
    'dem': 90000,
    'pprp': 60000,
    'cpd': 30000,
    'tst': 45000,
    'tlp': 25000,
    'tkm': 15000,
    'okm': 8000,
    'econ': 5000
};

const TOTAL_WIKI_VIEWS = Object.values(WIKI_PAGEVIEWS).reduce((a, b) => a + b, 0);

function getWikiIndex(partyId) {
    const views = WIKI_PAGEVIEWS[partyId] || 0;
    // Share of Voice (SoV) Formula
    return (views / TOTAL_WIKI_VIEWS) * 100;
}

let cachedNidaData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getNidaData() {
    const now = Date.now();
    // Return cached data if valid
    if (cachedNidaData && (now - lastFetchTime < CACHE_DURATION)) {
        return cachedNidaData;
    }

    try {
        // Try fetching from remote URL
        // In a real scenario, this URL would be a GitHub Gist or a public JSON file
        // For local development, we might want to read from file, but fetch works if served
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        const response = await fetch(NIDA_DATA_URL, { signal: controller.signal });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Validate keys exist
        if (!data.pp || !data.pt) throw new Error("Invalid data format");

        console.log('✅ Fetched NIDA Poll Data from remote source');
        cachedNidaData = data;
        lastFetchTime = now;
        return data;

    } catch (error) {
        // Fallback: Try reading from local file (server-side only)
        try {
            if (typeof window === 'undefined') {
                const { promises: fs } = await import('fs');
                const path = await import('path');
                const localPath = path.join(process.cwd(), 'nida-data.json');
                const fileContent = await fs.readFile(localPath, 'utf8');
                const data = JSON.parse(fileContent);

                // Should output this once to confirm it's using local
                if (!cachedNidaData) console.log('📂 Using local NIDA data file (Remote failed)');

                cachedNidaData = data;
                lastFetchTime = now;
                return data;
            }
        } catch (fileError) {
            // Ignore file error, use hardcoded fallback
        }

        console.warn(`⚠️ Failed to fetch NIDA data (${error.message}). Using hardcoded fallback.`);
        if (cachedNidaData) return cachedNidaData; // Use stale cache if available
        return FALLBACK_NIDA_DATA; // Use hardcoded fallback
    }
}

const WEIGHT_POLL = 0.4;
const WEIGHT_AI = 0.6;

// ==================== IMPORTS ====================
// import { fetchLiveNews, getFeedStatus } from './rss-fetcher'; // Replaced by local implementation

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
    if (!text) return { sentiment: 'neu', score: 0, keywords: [], contexts: [], primaryContext: null, isGemini: false };

    let totalScore = 0;
    const matchedKeywords = [];
    const contextCounts = {};
    let positiveCount = 0;
    let negativeCount = 0;

    POSITIVE_KEYWORDS.forEach(({ word, weight, context }) => {
        if (text.includes(word)) {
            totalScore += weight;
            positiveCount++;
            matchedKeywords.push({ word, type: 'pos', weight, context });
            contextCounts[context] = (contextCounts[context] || 0) + weight;
        }
    });

    NEGATIVE_KEYWORDS.forEach(({ word, weight, context }) => {
        if (text.includes(word)) {
            totalScore -= weight;
            negativeCount++;
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
        primaryContext,
        isGemini: false,
        // For ambiguity calculation
        _positiveCount: positiveCount,
        _negativeCount: negativeCount
    };
}

// ==================== HYBRID SENTIMENT ANALYSIS (with Gemini Escalation) ====================

const AMBIGUITY_THRESHOLD = 0.5; // Escalate to Gemini if ambiguity score > 0.5

/**
 * Helper: Calculate ambiguity score to decide when to call Gemini
 */
function calculateAmbiguityScore(text, score, posCount, negCount) {
    // 1. Conflicting signals (Positive AND Negative keywords present)
    if (posCount > 0 && negCount > 0) {
        return 0.8; // High ambiguity
    }

    // 2. Long text but neutral score (Likely missed context)
    if (Math.abs(score) < 0.2 && text.length > 80) {
        return 0.6; // Moderate ambiguity
    }

    // 3. Very strong sentiment (Likely clear)
    if (Math.abs(score) > 0.7) {
        return 0.1; // Low ambiguity
    }

    return 0.2; // Default low
}

/**
 * Hybrid sentiment analysis: Rule-based first, Gemini for ambiguous cases
 * @param {string} text - News headline
 * @returns {Promise<Object>} Sentiment result (may include Gemini analysis)
 */
async function analyzeSentimentHybrid(text) {
    // Step 1: Rule-based analysis
    const ruleResult = analyzeSentiment(text);

    // Step 2: Calculate ambiguity score
    const ambiguityScore = calculateAmbiguityScore(
        text,
        ruleResult.score,
        ruleResult._positiveCount || 0,
        ruleResult._negativeCount || 0
    );

    // Step 3: Escalate to Gemini if ambiguous
    if (ambiguityScore > AMBIGUITY_THRESHOLD) {
        console.log(`🔍 Ambiguous headline detected (score: ${ambiguityScore.toFixed(2)}). Escalating to Gemini...`);
        console.log(`   Headline: "${text.substring(0, 60)}..."`);

        const geminiResult = await analyzeWithGemini(text);

        if (geminiResult) {
            return {
                sentiment: geminiResult.sentiment,
                score: geminiResult.score,
                keywords: ruleResult.keywords, // Keep rule-based keywords for reference
                contexts: ruleResult.contexts,
                primaryContext: ruleResult.primaryContext,
                isGemini: true,
                geminiReason: geminiResult.reason,
                geminiParty: geminiResult.party,
                ambiguityScore: ambiguityScore
            };
        }
    }

    // Step 4: Return rule-based result (default path)
    return {
        ...ruleResult,
        ambiguityScore: ambiguityScore
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

const RSS_FEEDS = [
    // === ข่าวการเมืองโดยตรง (Verified Working) ===
    { url: 'https://www.matichon.co.th/politics/feed', weight: 1.0, source: 'มติชนออนไลน์', type: 'national' },
    { url: 'https://www.prachachat.net/politics/feed', weight: 1.0, source: 'ประชาชาติธุรกิจ', type: 'national' },

    // === ข่าวทั่วไป ===
    { url: 'https://www.matichon.co.th/feed', weight: 0.7, source: 'มติชน (ทั่วไป)', type: 'national' },
    { url: 'https://www.prachachat.net/feed', weight: 0.7, source: 'ประชาชาติ (ทั่วไป)', type: 'national' },
    { url: 'https://www.khaosod.co.th/feed', weight: 0.9, source: 'ข่าวสด', type: 'national' },

    // === สื่อออนไลน์/ทางเลือก ===
    { url: 'https://prachatai.com/rss.xml', weight: 1.3, source: 'ประชาไท', type: 'national' },
    { url: 'https://thestandard.co/feed/', weight: 1.2, source: 'THE STANDARD', type: 'national' },

    // === ข่าวท้องถิ่น/ภูมิภาค (Regional) ===
    { url: 'https://www.bangkokpost.com/rss/data/most-recent.xml', weight: 1.1, source: 'Bangkok Post', type: 'national' },
    { url: 'https://theisaanrecord.co/feed/', weight: 1.4, source: 'The Isaan Record', type: 'isaan' },
    { url: 'https://www.thephuketnews.com/rss-xml/news.xml', weight: 1.3, source: 'The Phuket News', type: 'south' },
    { url: 'https://www.chiangmaicitylife.com/feed/', weight: 1.3, source: 'Chiang Mai Citylife', type: 'north' },
];

// Google Trends Integration
import { getTrendsData } from './google-trends.js';
import Parser from 'rss-parser';

// Reliable Fetch using rss-parser (Server-side)
async function fetchLiveNewsLocal() {
    const news = [];
    const parser = new Parser({
        timeout: 5000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });

    // Fetch from all RSS feeds in parallel
    const feedPromises = RSS_FEEDS.map(async feed => {
        try {
            const result = await parser.parseURL(feed.url);
            if (result && result.items) {
                result.items.forEach(item => {
                    news.push({
                        text: item.title,
                        link: item.link,
                        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
                        source: feed.source,
                        weight: feed.weight,
                        type: feed.type,
                        region: feed.region
                    });
                });
            }
        } catch (error) {
            console.warn(`[RSS] Failed to fetch ${feed.source}: ${error.message}`);
        }
    });

    await Promise.all(feedPromises);

    // [NEW] Filter only recent news (last 48 hours)
    const cutoffTime = Date.now() - (48 * 60 * 60 * 1000);
    const recentNews = news.filter(item => {
        if (!item.pubDate) return true;
        const itemDate = new Date(item.pubDate);
        if (isNaN(itemDate.getTime())) return true;
        return itemDate.getTime() >= cutoffTime;
    });

    const oldCount = news.length - recentNews.length;
    if (oldCount > 0) {
        console.log(`[RSS] Filtered out ${oldCount} old news items (>48h)`);
    }

    // [FIX] Remove duplicate headlines (strict matching)
    const seen = new Set();
    const uniqueNews = recentNews.filter(item => {
        // Normalize: lowercase, remove ALL whitespace, first 50 chars
        const normalizedTitle = (item.text || '')
            .toLowerCase()
            .replace(/[\s\n\r\t]+/g, '')
            .replace(/[""''\"\']/g, '')
            .substring(0, 50);

        if (seen.has(normalizedTitle)) {
            return false;
        }
        seen.add(normalizedTitle);
        return true;
    });

    const dupeCount = recentNews.length - uniqueNews.length;
    if (dupeCount > 0) {
        console.log(`[RSS] Removed ${dupeCount} duplicate headlines`);
    }

    // Log success count
    if (uniqueNews.length > 0) {
        console.log(`[RSS] Successfully fetched ${uniqueNews.length} unique items.`);
    } else {
        console.warn("[RSS] Warning: No news items fetched from any source.");
    }

    return uniqueNews;
}

function getFeedStatus() {
    return {
        activeFeeds: RSS_FEEDS.length,
        totalFeeds: RSS_FEEDS.length,
        lastUpdate: new Date().toISOString(),
        status: 'online'
    };
}

// [Modified simulateMarket]
export async function simulateMarket() {
    // Ensure state is rehydrated from DB
    if (!isInitialized) await rehydrateState();

    try {
        // Fetch Real-time or Cached NIDA Data
        const nidaData = await getNidaData();

        // Fetch Real-time Google Trends Data (Search Intent)
        const trendsData = await getTrendsData();

        // Fetch real news
        const newsList = await fetchLiveNewsLocal();
        const feedStatus = getFeedStatus();

        // Load read news from DB
        const consumedNewsLinks = getReadNews();

        // Filter out news that have already been consumed
        let availableNews = newsList.filter(n => !consumedNewsLinks.has(n.text));

        // Filter to only political news (skip general/non-political news)
        availableNews = availableNews.filter(n => isPoliticalNews(n.text));

        logDebug(`News Count: Total=${newsList.length}, Available=${availableNews.length}`);

        // Filter to only recent news (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        availableNews = availableNews.filter(n => {
            if (!n.pubDate) return true; // Include if no date (assume recent)
            const newsDate = new Date(n.pubDate);
            return newsDate >= oneDayAgo;
        });

        // [FIX] If we ran out of new news, just DISPLAY the last 7 news (no analysis)
        // DB stores consumed news - we don't clear it, just show recent ones as static display
        let noNewNewsAvailable = false;
        if (availableNews.length === 0 && newsList.length > 0) {
            noNewNewsAvailable = true;
            console.log('📰 No new news available. Displaying last 7 news as static.');
        }

        let newsItem;
        let sentimentResult = { sentiment: 'neu', score: 0, keywords: [] };

        // -------------------------------------------------------------
        // [FIX] Calculate Recent News with CACHING for stability
        // -------------------------------------------------------------
        let recentPoliticalNews = [];
        const now = Date.now();

        // Use cached news if:
        // 1. No new news available AND cache exists
        // 2. Cache is still valid (within 1 minute)
        if (noNewNewsAvailable && cachedRecentNews.length > 0 && (now - lastNewsCacheTime) < NEWS_CACHE_DURATION) {
            recentPoliticalNews = cachedRecentNews;
            logDebug(`Using cached news (${recentPoliticalNews.length} items, age: ${Math.round((now - lastNewsCacheTime) / 1000)}s)`);
        } else {
            // Recalculate fresh news
            try {
                logDebug(`Calculating recent news... oneDayAgo=${oneDayAgo}`);
                const seenHeadlines = new Set();

                // Step 1: Filter candidates (Political + Not General)
                let candidateNews = newsList
                    .filter(n => isPoliticalNews(n.text))
                    .filter(n => !n.source?.includes('ทั่วไป'));

                // Step 2: Try 24h Filter
                let freshNews = candidateNews.filter(n => !n.pubDate || new Date(n.pubDate) >= oneDayAgo);

                // Step 3: Fallback if no fresh news (Demo Mode / Stale Data protection)
                if (freshNews.length === 0 && candidateNews.length > 0) {
                    logDebug('⚠️ No fresh news found. Using stale news for recent feed (Fallback).');
                    freshNews = candidateNews;
                }

                // Sort by date (newest first) before slicing for consistency
                freshNews.sort((a, b) => {
                    const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
                    const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
                    return dateB - dateA;
                });

                recentPoliticalNews = freshNews
                    .filter(n => {
                        // Deduplicate: skip if headline already seen
                        if (seenHeadlines.has(n.text)) return false;
                        seenHeadlines.add(n.text);
                        return true;
                    })
                    .slice(0, 7) // Take top 7
                    .map(n => ({
                        headline: n.text,
                        link: n.link,
                        pubDate: n.pubDate ? new Date(n.pubDate).toISOString() : null,
                        source: n.source,
                        sentiment: analyzeSentiment(n.text).sentiment,
                        isHistorical: true,
                        region: n.region || null
                    }));

                // Update cache
                cachedRecentNews = recentPoliticalNews;
                lastNewsCacheTime = now;
                logDebug(`Recent News Calculated: ${recentPoliticalNews.length} items (cached)`);
            } catch (err) {
                logDebug(`ERROR calculating recent news: ${err.message} \n ${err.stack}`);
                // Use cached on error
                if (cachedRecentNews.length > 0) {
                    recentPoliticalNews = cachedRecentNews;
                }
            }
        }

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
            // Use basic rule-based here for speed/cost (no hybrid needed for pre-check)
            const rawSentiment = analyzeSentiment(newsItem.text);
            if (rawSentiment.sentiment === 'neg' && Math.random() > 0.7) {
                // 30% chance to skip dark news and find something else to balance
                const positiveAlternative = availableNews.find(n => analyzeSentiment(n.text).sentiment === 'pos');
                if (positiveAlternative) {
                    newsItem = positiveAlternative;
                    console.log('⚖️ Ethics Auto-Balance: Swapped negative news for positive coverage.');
                }
            }

            // Analyze sentiment with HYBRID SYSTEM (Gemini Escalation)
            sentimentResult = await analyzeSentimentHybrid(newsItem.text);
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

                // NIDA Comparison (Dynamic Data)
                const nidaScore = nidaData[p.id] || 0.5;
                const divergence = ((p.score ?? p.baseScore) - nidaScore).toFixed(1);

                // Google Trends Influence (Search Intent)
                let trendBonus = 0;
                if (trendsData && trendsData[p.id]) {
                    // Trends score is 0-1.
                    // If high usage (> 0.5), give bonus. If low, slight penalty?
                    // "น้ำหนัก 1.2x" -> We use it as a multiplier for the 'drift' or adding a base momentum
                    // Strategy: If Trend > 0.5, add momentum up.
                    const trendStrength = trendsData[p.id];
                    trendBonus = (trendStrength - 0.2) * 1.2; // 1.2x Weight
                    // Example: Trend 0.8 -> (0.6) * 1.2 = +0.72 score
                    // Example: Trend 0.1 -> (-0.1) * 1.2 = -0.12 score
                }

                // HIDDEN SUPPORT LOGIC: If NIDA is significantly higher than AI (> 5%)
                // This means AI is "under-representing" this party (Silent Majority)
                const isUnderValued = (nidaScore - (p.score ?? p.baseScore)) > 5.0;

                // [FIX] Score Decay + Clamping
                // Decay: Pull score back towards baseScore by 2% per tick
                const currentScore = p.score ?? p.baseScore;
                const decayFactor = 0.02;
                const decayedScore = currentScore + (p.baseScore - currentScore) * decayFactor;
                const rawScore = decayedScore + drift + (trendBonus * 0.05);
                // Clamp between 0 and 100
                const clampedScore = Math.max(0, Math.min(100, rawScore));

                return {
                    ...p,
                    score: clampedScore,
                    trend: drift > 0 ? 'up' : 'down',
                    delta: Math.abs(drift).toFixed(2),
                    nidaScore: nidaScore,
                    trendsScore: trendsData ? (trendsData[p.id] * 100).toFixed(0) : 0,
                    divergence: divergence,
                    hiddenSupport: isUnderValued
                };
            });

            // recentPoliticalNews is now computed above
            return {
                timestamp: new Date().toISOString(),
                parties: marketState.sort((a, b) => b.score - a.score),
                sampleSize: consumedNewsLinks.size,
                feedStatus: feedStatus,
                analyzedNews: null,
                recentNews: recentPoliticalNews // CORRECTLY RETURNED
            };
        }

        // Analyze Real News
        const partyId = detectParty(newsItem.text);

        // Calculate Impact based on sentiment score (not just pos/neg)
        let impact = sentimentResult.score * 0.3; // Scale down for stability
        if (sentimentResult.sentiment === 'neu') {
            impact = (Math.random() - 0.5) * 0.1;
        }

        // Regional Weighted Impact
        // If news is local, boost impact for that region's strong parties?
        // Or just trust the general sentiment. For now, we trust the sentiment but
        // maybe local news is more 'trusted' -> higher confidence?
        if (newsItem.type === 'local') {
            impact *= 1.2; // Local news hits harder (more relevant)
        }

        // Apply to Market State
        marketState = marketState.map(p => {
            let drift = (Math.random() - 0.5) * 0.3;

            if (partyId && p.id === partyId) {
                drift += impact;
            }

            // Apply Google Trends Influence here too
            let trendBonus = 0;
            if (trendsData && trendsData[p.id]) {
                const trendStrength = trendsData[p.id];
                trendBonus = (trendStrength - 0.2) * 1.2;
            }

            // [FIX] Score Decay + Clamping
            // Decay: Pull score back towards baseScore by 2% per tick
            const currentScore = p.score ?? p.baseScore;
            const decayFactor = 0.02;
            const decayedScore = currentScore + (p.baseScore - currentScore) * decayFactor;
            const rawScore = decayedScore + drift + (trendBonus * 0.05);
            // Clamp between 0 and 100
            const clampedScore = Math.max(0, Math.min(100, rawScore));

            return {
                ...p,
                score: clampedScore,
                trend: drift > 0 ? 'up' : 'down',
                delta: Math.abs(drift).toFixed(2),
                trendsScore: trendsData ? (trendsData[p.id] * 100).toFixed(0) : 0
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

        // 1. Calculate weighted scores for both systems (Dynamic Data)
        const listScores = marketState.map(p => {
            const nida = nidaData[p.id] || 0.5;
            const sentimentScore = p.score ?? p.baseScore; // AI Sentiment (0-100)
            const wikiIndex = getWikiIndex(p.id);

            // [NEW] Weighted Hybrid Formula
            // Structure: 40% NIDA + 60% AI
            // Inside AI: 75% Sentiment + 25% WikiIndex

            const aiComposite = (sentimentScore * 0.75) + (wikiIndex * 0.25);
            const hybridScore = (nida * 0.40) + (aiComposite * 0.60);

            return {
                id: p.id,
                val: hybridScore,
                // Debug values for UI if needed
                _debug: { nida, sentiment: sentimentScore, wiki: wikiIndex, aiComp: aiComposite }
            };
        });

        const constScores = marketState.map(p => {
            const nida = nidaData[p.id] || 0.5;
            const ai = p.score ?? p.baseScore;
            return { id: p.id, val: (nida * W_CONST_POLL) + (ai * W_CONST_AI) };
        });

        const totalListScore = listScores.reduce((sum, s) => sum + s.val, 0);
        const totalConstScore = constScores.reduce((sum, s) => sum + s.val, 0);

        marketState = marketState.map(p => {
            // NIDA Comparison (Dynamic Data)
            const nidaScore = nidaData[p.id] || 0.5;
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
                wikiIndex: getWikiIndex(p.id).toFixed(1), // Expose for UI
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
                target: impactedParty ? impactedParty.name : "ทั่วไป",
                isGemini: sentimentResult.isGemini || false, // Flag included in response
                ambiguityScore: sentimentResult.ambiguityScore || 0
            },
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
                target: impactedParty ? impactedParty.name : "ทั่วไป",
                isGemini: sentimentResult.isGemini || false, // Flag included in response
                ambiguityScore: sentimentResult.ambiguityScore || 0
            },
            recentNews: recentPoliticalNews, // [FIX] Now included in happy path too!
            error: null
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
