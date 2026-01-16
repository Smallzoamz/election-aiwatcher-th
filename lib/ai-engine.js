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

// Fallback Data (used if fetch fails)
const FALLBACK_NIDA_DATA = {
    'pp': 30.5,   // Peoples Party (Jan 2026 Poll)
    'bjt': 22.3,  // Bhumjaithai (Major surge after Anutin became PM)
    'pt': 15.0,   // Pheu Thai (Estimated drop)
    'dem': 10.0,  // Democrat
    'utn': 8.0,   // United Thai Nation
    'pprp': 2.0,  // Palang Pracharath
    'cpd': 1.0,   // Chart Thai Pattana
    'tst': 1.5,   // Thai Sang Thai
    'srt': 1.0,   // Seri Ruam Thai
};

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
import { analyzeWithGemini, calculateAmbiguityScore } from './gemini-client.js';

const AMBIGUITY_THRESHOLD = 0.5; // Escalate to Gemini if ambiguity score > 0.5

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

// [Modified simulateMarket]
export async function simulateMarket() {
    // Ensure state is rehydrated from DB
    if (!isInitialized) await rehydrateState();

    try {
        // Fetch Real-time or Cached NIDA Data
        const nidaData = await getNidaData();

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
                    sentiment: analyzeSentiment(n.text).sentiment, // Historical display uses fast rule-based
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

        // 1. Calculate weighted scores for both systems (Dynamic Data)
        const listScores = marketState.map(p => {
            const nida = nidaData[p.id] || 0.5;
            const ai = p.score ?? p.baseScore;
            return { id: p.id, val: (nida * W_LIST_POLL) + (ai * W_LIST_AI) };
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
