// lib/ai-engine.js
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
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
    NEWS_RETENTION_HOURS: 48,
};

// ==================== HELPER FUNCTIONS ====================
function logDebug(message) {
    console.log(`[AI-ENGINE] [${new Date().toISOString()}] ${message}`);
}

const HISTORY_LOG_PATH = path.join(process.cwd(), 'analyzed-history.json');
function saveAnalyzedHistory(history) {
    try {
        fs.writeFileSync(HISTORY_LOG_PATH, JSON.stringify(history, null, 2));
    } catch (e) {
        logDebug(`Error saving analyzed history: ${e.message}`);
    }
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
                birthdate: "2 พฤษภาคม 2530",
                education: "ปริญญาตรี คณะวิศวกรรมศาสตร์ (คอมพิวเตอร์) จุฬาลงกรณ์มหาวิทยาลัย",
                career: "ผู้ก่อตั้งและอดีตผู้บริหารบริษัท absolute.mobi (Cloud Solutions), ส.ส. กรุงเทพฯ พรรคก้าวไกล (2562), ผู้นำฝ่ายค้าน (2567)",
                vision: "ขับเคลื่อนประเทศไทยด้วยเทคโนโลยี และโครงสร้างพื้นฐานทางดิจิทัลที่เท่าเทียม",
                bio: "อดีตผู้บริหารบริษัท Cloud Solutions นักเขียนโปรแกรม ผู้นำฝ่ายค้านอายุน้อยที่สุดในประวัติศาสตร์ไทย",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/8/89/Natthaphong_Ruengpanyawut_in_2024.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "ศิริกัญญา ตันสกุล",
                nickname: "คุณไหม",
                position: "รองหัวหน้าพรรค/แคนดิเดตนายกฯ",
                birthdate: "4 เมษายน 2524",
                education: "ปริญญาตรีและโท คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์, ปริญญาโท มหาวิทยาลัยตูลูส (ฝรั่งเศส)",
                career: "นักวิจัยอาวุโส TDRI, ผู้อำนวยการฝ่ายนโยบายพรรคอนาคตใหม่, รองหัวหน้าพรรคก้าวไกลฝ่ายนโยบาย",
                vision: "ทลายทุนผูกขาด ปฏิรูปโครงสร้างเศรษฐกิจเพื่อความเป็นธรรมของทุกคน",
                bio: "อดีตนักวิจัย TDRI ผู้เชี่ยวชาญด้านเศรษฐกิจและนโยบายสาธารณะ",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/d/d2/Sirikanya_Tansakul_in_January_2023.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "วีระยุทธ กาญจน์ชูฉัตร",
                nickname: "ดร.วีระยุทธ",
                position: "แคนดิเดตนายกฯ (ทีมเศรษฐกิจ)",
                birthdate: "พ.ศ. 2524",
                education: "ปริญญาเอก ด้านเศรษฐศาสตร์ จากมหาวิทยาลัยเคมบริดจ์ (อังกฤษ)",
                career: "รองศาสตราจารย์แห่ง National Graduate Institute for Policy Studies (GRIPS) ประเทศญี่ปุ่น, ทีมหน้าฝ่ายนโยบายพรรคประชาชน",
                vision: "สร้างรัฐสวัสดิการและยกระดับอุตสาหกรรมไทยผ่านการวิจัยและพัฒนาสู่มาตรฐานโลก",
                bio: "ผู้เชี่ยวชาญด้านเศรษฐศาสตร์การเมืองระดับโลก ขุนพลเศรษฐกิจคนสำคัญของพรรคประชาชน",
                imageUrl: "https://ui-avatars.com/api/?name=WK&background=F47933&color=fff&size=128&bold=true&font-size=0.4"
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
                birthdate: "พ.ศ. 2522",
                education: "ปริญญาเอก ด้านชีวการแพทย์ (Biomedical Engineering) จากสหรัฐอเมริกา",
                career: "รองอธิการบดีฝ่ายวิจัย ม.มหิดล, ประธานสมาคมวิศวกรรมชีวการแพทย์ไทย, ผู้เชี่ยวชาญ Brain-Computer Interface",
                vision: "ใช้นวัตกรรมและการวิจัย ยกระดับขีดความสามารถในการแข่งขันของประเทศ",
                bio: "หลานทักษิณ ชินวัตร อดีตรองอธิการบดีฝ่ายวิจัย ม.มหิดล ผู้เชี่ยวชาญ Brain-Computer Interface",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/a/ae/Yodchanun_Wongsawat.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "จุลพันธ์ อมรวิวัฒน์",
                nickname: "คุณหนิม",
                position: "หัวหน้าพรรค/แคนดิเดตนายกฯ",
                birthdate: "12 ธันวาคม 2518",
                education: "ปริญญาตรี คณะเศรษฐศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย, ปริญญาโท MBA มหาวิทยาลัยบอสตัน (สหรัฐฯ)",
                career: "ส.ส. เชียงใหม่ หลายสมัย, รมช. คลัง (2566), เลขาธิการพรรคเพื่อไทย",
                vision: "แก้ปัญหาเศรษฐกิจปากท้อง และความยากจนอย่างเป็นระบบผ่านดิจิทัลวอลเล็ต",
                bio: "บุตรชายสมพงษ์ อมรวิวัฒน์ (อดีตหัวหน้าพรรค) อดีต รมช.การคลัง",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/c/c2/Chullaphan_Amornwiwat.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "สุริยะ จึงรุ่งเรืองกิจ",
                nickname: "รองฯ สุริยะ",
                position: "แคนดิเดตนายกฯ/รมว. คมนาคม",
                birthdate: "10 ธันวาคม 2497",
                education: "ปริญญาตรี ด้านวิศวกรรมอุตสาหการ จากมหาวิทยาลัยแคลิฟอร์เนีย เบิร์กลีย์ (สหรัฐฯ)",
                career: "อดีต รมว. อุตสาหกรรม, รมว. คมนาคมหลายสมัย, รองนายกรัฐมนตรี, ผู้บริหารกลุ่มไทยซัมมิท",
                vision: "เชื่อมโลกด้วยโครงสร้างพื้นฐาน และยกระดับโลจิสติกส์ไทยสู่ศูนย์กลางภูมิภาค",
                bio: "ขุนพลเศรษฐกิจพรรคเพื่อไทย ผู้เชี่ยวชาญด้านการจัดระบบคมนาคมและอุตสาหกรรม",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/2/2a/Suriya_Juungrungruangkit_2023.jpg&w=400&h=400&fit=cover"
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
                birthdate: "21 กุมภาพันธ์ 2498",
                education: "นิติศาสตรบัณฑิต มหาวิทยาลัยธรรมศาสตร์, ปริญญาโทกฎหมายเปรียบเทียบจากมหาวิทยาลัยทูเลน (สหรัฐฯ)",
                career: "อดีตผู้พิพากษา, รมว. ยุติธรรม, รมว. พลังงาน (2566), เลขาธิการนายกรัฐมนตรี",
                vision: "รื้อ ลด ปลด สร้าง เพื่อชีวิตที่ดีกว่าของคนไทย และความมั่นคงทางพลังงาน",
                bio: "อดีตผู้พิพากษาและข้าราชการตุลาการ",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/5/52/Pirapan_Salirathavibhaga.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "อรรถวิชช์ สุวรรณภักดี",
                nickname: "คุณเอ๋",
                position: "รองหัวหน้าพรรค/แคนดิเดตนายกฯ",
                birthdate: "26 มีนาคม 2521",
                education: "ปริญญาตรี นิติศาสตร์ มหาวิทยาลัยธรรมศาสตร์, ปริญญาโท กฎหมายการเงิน จากสหรัฐฯ",
                career: "อดีต ส.ส. กรุงเทพฯ, รองหัวหน้าพรรคกล้า, รองหัวหน้าพรรครวมไทยสร้างชาติ",
                vision: "ปฏิรูปกฎหมายเศรษฐกิจและภาษี เพื่อเปิดโอกาสให้คนตัวเล็กและ Startups ไทย",
                bio: "นักกฎหมายเศรษฐกิจรุ่นใหม่ ผู้เชี่ยวชาญการแก้ปัญหาหนี้สินและโครงสร้างภาษี",
                imageUrl: "https://ui-avatars.com/api/?name=AS&background=2D427D&color=fff&size=128&bold=true&font-size=0.4"
            },
            {
                name: "นราพัฒน์ แก้วทอง",
                nickname: "คุณตุ้ม",
                position: "รองหัวหน้าพรรค/แคนดิเดตนายกฯ",
                birthdate: "2 สิงหาคม 2512",
                education: "ปริญญาตรี มหาวิทยาลัยพายัพ, ปริญญาโท บริหารธุรกิจ จากสหรัฐฯ",
                career: "ส.ส. พิจิตร หลายสมัย, อดีตรองหน้าพรรคประชาธิปัตย์, รองหัวหน้าพรรครวมไทยสร้างชาติ",
                vision: "พัฒนาเกษตรกรสู่ผู้ประกอบการ และเสริมสร้างเศรษฐกิจฐานรากในพื้นที่ภาคเหนือ",
                bio: "ขุนพลภาคเหนือของพรรค ผู้เน้นนโยบายปากท้องและเกษตรทันสมัย",
                imageUrl: "https://ui-avatars.com/api/?name=NK&background=2D427D&color=fff&size=128&bold=true&font-size=0.4"
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
                position: "หัวหน้าพรรค/แคนดิเดตนายกฯ (นรม. ปัจจุบัน)",
                birthdate: "13 กันยายน 2509",
                education: "ปริญญาตรี ด้านวิศวกรรมโยธา จากมหาวิทยาลัยโฮฟสตรา (สหรัฐฯ)",
                career: "นายกรัฐมนตรี คนที่ 31-32 (Simulation), รมว. มหาดไทย, รมว. สาธารณสุข",
                vision: "ขับเคลื่อนเศรษฐกิจด้วยนโยบาย 'พูดแล้วทำ' และสร้างความมั่นคงในชีวิตให้คนไทยทุกคน",
                bio: "ผู้นำพรรคภูมิใจไทยที่ก้าวขึ้นเป็นนายกรัฐมนตรีในไทม์ไลน์จำลอง 2569",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/2/2e/Anutin_Charnvirakul_in_October_2023.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "สีหศักดิ์ พวงเกตุแก้ว",
                nickname: "ท่านสีหศักดิ์",
                position: "แคนดิเดตนายกฯ/รมว. ต่างประเทศ",
                birthdate: "21 ธันวาคม 2498",
                education: "ปริญญาตรี รัฐศาสตร์การเมืองการปกครอง, ปริญญาโท ด้านความสัมพันธ์ระหว่างประเทศ จากสหรัฐฯ",
                career: "อดีตปลัดกระทรวงการต่างประเทศ, เอกอัครราชทูตหลายประเทศ, รมว. ต่างประเทศ (2568-2569)",
                vision: "ยกระดับบทบาทไทยในเวทีโลก และสร้างความเชื่อมั่นให้นักลงทุนต่างชาติ",
                bio: "นักการทูตอาวุโสผู้มาเสริมทัพนโยบายต่างประเทศของพรรคภูมิใจไทย",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/e/e0/Sihasak_Phuangketkeow.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "ไชยชนก ชิดชอบ",
                nickname: "นก",
                position: "เลขาธิการพรรค",
                birthdate: "14 กรกฎาคม 2532",
                education: "ปริญญาตรี ด้านการจัดการโรงแรมและธุรกิจท่องเที่ยว จากอังกฤษ",
                career: "อดีตผู้บริหารสโมสรฟุตบอลบุรีรัมย์ ยูไนเต็ด, ส.ส. บุรีรัมย์, เลขาธิการพรรคภูมิใจไทย",
                vision: "ขับเคลื่อนพรรคให้เป็นสถาบันการเมืองรุ่นใหม่ และพัฒนาเศรษฐกิจฐานรากผ่านการท่องเที่ยวและกีฬา",
                bio: "บุตรชายคนโตของเนวิน ชิดชอบ ผู้นำรุ่นใหม่ของพรรคภูมิใจไทย",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/2/28/Chaiyanok_Chidchob.jpg&w=400&h=400&fit=cover"
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
                name: "อภิสิทธิ์ เวชชาชีวะ",
                nickname: "คุณมาร์ค",
                position: "แคนดิเดตนายกฯ",
                birthdate: "3 สิงหาคม 2507",
                education: "ปริญญาตรีและโท ด้านปรัชญา การเมือง และเศรษฐศาสตร์ (PPE) จากมหาวิทยาลัยออกซ์ฟอร์ด (อังกฤษ)",
                career: "นายกรัฐมนตรี คนที่ 27, ผู้นำฝ่ายค้านหลายสมัย, หัวหน้าพรรคประชาธิปัตย์ (2548-2562)",
                vision: "การเมืองที่โปร่งใส เชื่อมั่นในระบวนการประชาธิปไตย และเน้นนโยบายรัฐสวัสดิการแบบยั่งยืน",
                bio: "อดีตนายกรัฐมนตรีผู้กลับมาเสริมทัพแคนดิเดตพรรคในฐานะผู้เชี่ยวชาญด้านเศรษฐกิจและการเมือง",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/4/4b/Abhisit_Vejjajiva_2010.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "กรณ์ จาติกวณิช",
                nickname: "คุณกรณ์",
                position: "แคนดิเดตนายกฯ (ทีมเศรษฐกิจ)",
                birthdate: "19 กุมภาพันธ์ 2507",
                education: "ปริญญาตรี ด้านเศรษฐศาสตร์และการจัดการ จากมหาวิทยาลัยออกซ์ฟอร์ด (อังกฤษ)",
                career: "อดีต รมว. คลัง, ผู้ก่อตั้งพรรคกล้า, หัวหน้าพรรคชาติพัฒนากล้า, ผู้บริหารสถาบันการเงินระดับโลก",
                vision: "เศรษฐกิจยุคใหม่สร้างโอกาสให้ทุกคน และขับเคลื่อนนโยบายเชิงโครงสร้างเพื่อลดความเหลื่อมล้ำ",
                bio: "ผู้เชี่ยวชาญด้านเศรษฐศาสตร์การเงินระดับโลก กลับมาช่วยงานด้านนโยบายเศรษฐกิจของพรรค",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/e/ec/Korn_Chatikavanij.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "ดร.การดี เลียวไพโรจน์",
                nickname: "ดร.การดี",
                position: "แคนดิเดตนายกฯ (ทีมอนาคตศึกษา)",
                birthdate: "พ.ศ. 2520",
                education: "ปริญญาเอก ด้านวิศวกรรมอุตสาหการ (Simulation) จากสหรัฐอเมริกา",
                career: "ประธานเจ้าหน้าที่ฝ่ายอนาคตศึกษา FutureTales Lab, อดีตอาจารย์คณะพาณิชยศาสตร์ฯ มธ.",
                vision: "ออกแบบอนาคตประเทศไทยด้วย Data และ Insight เพื่อรับมือกับการเปลี่ยนแปลงของโลก",
                bio: "ผู้เชี่ยวชาญด้านการวางแผนอนาคตและเทคโนโลยี ผู้นำหญิงรุ่นใหม่ในแคนดิเดตพรรคประชาธิปัตย์",
                imageUrl: "https://ui-avatars.com/api/?name=KD&background=40C0F0&color=fff&size=128&bold=true&font-size=0.4"
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
                education: "โรงเรียนเตรียมทหาร (รุ่นที่ 6), โรงเรียนนายร้อยพระจุลจอมเกล้า (รุ่นที่ 17)",
                career: "ผบ.ทบ., รมว. กลาโหม, รองนายกรัฐมนตรีหลายรัฐมนตรี",
                vision: "ก้าวข้ามความขัดแย้ง พลิกฟื้นเศรษฐกิจ สร้างความกินดีอยู่ดีให้ประชาชน",
                bio: "อดีตรองนายกรัฐมนตรี อดีต ผบ.ทบ.",
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
                education: "ปริญญาตรี ด้านวิศวกรรมไฟฟ้า จากอังกฤษ, ปริญญาโท MBA มหาวิทยาลัยเซนต์จอห์น (สหรัฐฯ)",
                career: "ส.ส. สุพรรณบุรี, รมว. ทรัพยากรธรรมชาติฯ, รมว. การพัฒนาสังคมและความมั่นคงของมนุษย์",
                vision: "แก้ปัญหาสภาวะโลกร้อน และสร้างสังคมที่ยั่งยืนสำหรับคนทุกเจเนอเรชัน",
                bio: "บุตรชายคนเล็กของนายบรรหาร ศิลปอาชา",
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
                education: "ปริญญาตรี สาขาพาณิชยศาสตร์ฯ (การตลาด) จุฬาลงกรณ์มหาวิทยาลัย, ปริญญาโท MBA, ปริญญาเอก พระพุทธศาสนา มจร.",
                career: "อดีต รมว. สาธารณสุข (นโยบาย 30 บาท), รมว. เกษตรฯ, รมว. คมนาคม, พรรคร่วมรัฐบาลหลายสมัย",
                vision: "ดูแลประชาชนตั้งแต่ 'เกิดจนแก่' สร้างโอกาสให้คนตัวเล็กและแก้หนี้สาธารณะ",
                bio: "อดีต รมว.สาธารณสุข ยุค 30 บาท",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Sudarat_Keyuraphan_2019.png/440px-Sudarat_Keyuraphan_2019.png"
            }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=thaisangthai.org&sz=128"
    },
    {
        id: 'srt',
        name: "พรรคเสรีรวมไทย",
        color: '#D4AF37',
        baseScore: 1,
        candidates: [
            {
                name: "พล.ต.อ.เสรีพิศุทธ์ เตมียเวส",
                nickname: "พล.ต.อ.เสรีพิศุทธ์",
                position: "หัวหน้าพรรค",
                birthdate: "3 กันยายน 2491",
                education: "โรงเรียนเตรียมทหาร (รุ่นที่ 8), สถาบันบัณฑิตพัฒนบริหารศาสตร์ (NIDA)",
                career: "ผบ.ตร., ผู้สมัครรับเลือกตั้งผู้ว่าฯ กทม., ส.ส. บัญชีรายชื่อ, วีรบุรุษนาแก",
                vision: "ปราบปรามคอร์รัปชัน แก้ไขกฎหมายที่ไม่เป็นธรรม เพื่อความยุติธรรมของทุกคน",
                bio: "อดีต ผบ.ตร. ฉายาวีรบุรุษนาแก",
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
            {
                name: "ดร.สุชัชวีร์ สุวรรณสวัสดิ์",
                nickname: "ดร.เอ้",
                position: "หัวหน้าพรรค",
                birthdate: "20 เมษายน 2515",
                education: "ปริญญาตรี วิศวกรรมศาสตร์ สจล., ปริญญาโท-เอก ด้านวิศวกรรมศาสตร์โยธาและสิ่งแวดล้อม จาก MIT (สหรัฐฯ)",
                career: "อธิการบดี สจล., นายกสภาวิศวกร, ผู้สมัครผู้ว่าฯ กทม. พรรคประชาธิปัตย์, หัวหน้าพรรคไทยก้าวใหม่",
                vision: "ใช้ความรู้ทางวิศวกรรมและเทคโนโลยีแก้ปัญหาโครงสร้างพื้นฐานและน้ำท่วมให้กรุงเทพฯ และเมืองใหญ่",
                bio: "อดีตอธิการบดี สจล.",
                imageUrl: "https://ui-avatars.com/api/?name=SS&background=0EA5E9&color=fff&size=128&bold=true&font-size=0.4"
            }
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
    {
        id: 'pcc',
        name: "พรรคประชาชาติ",
        color: '#BD9A31',
        baseScore: 3,
        candidates: [
            {
                name: "พ.ต.อ.ทวี สอดส่อง",
                nickname: "ทวี",
                position: "หัวหน้าพรรค/รมว. ยุติธรรม",
                birthdate: "29 กันยายน 2502",
                education: "นิติศาสตรบัณฑิต มหาวิทยาลัยธรรมศาสตร์, ปริญญาโท รัฐประศาสนศาสตร์",
                career: "อดีตเลขาธิการ ศอ.บต., อธิบดีดีเอสไอ (DSI), ส.ส. บัญชีรายชื่อ, รมว. ยุติธรรม",
                vision: "สร้างพหุวัฒนธรรมและสันติภาพในจังหวัดชายแดนใต้ และคืนความยุติธรรมให้ประชาชน",
                bio: "อดีตเลขาธิการ ศอ.บต. ผู้มีบทบาทสำคัญในพื้นที่ภาคใต้",
                imageUrl: "https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/e/ed/Tawee_Sodsong_2023.jpg&w=400&h=400&fit=cover"
            },
            {
                name: "วรวีร์ มะกูดี",
                nickname: "บังยี",
                position: "หัวหน้าฝ่ายยุทธศาสตร์กีฬา/แคนดิเดตนายกฯ",
                birthdate: "29 พฤศจิกายน 2494",
                education: "ปริญญาตรี ด้านพลศึกษา",
                career: "อดีตนายกสมาคมฟุตบอลแห่งประเทศไทย, สมาชิกคณะกรรมการบริหารฟีฟ่า (FIFA), รองหัวหน้าพรรคประชาชาติ",
                vision: "ใช้กีฬาเป็นสะพานเชื่อมความสัมพันธ์และพัฒนาคุณภาพชีวิตเยาวชนทั่วประเทศ",
                bio: "อดีตผู้นำวงการฟุตบอลไทย ผู้รับผิดชอบงานด้านยุทธศาสตร์กีฬาของพรรค",
                imageUrl: "https://ui-avatars.com/api/?name=WM&background=BD9A31&color=fff&size=128&bold=true&font-size=0.4"
            },
            {
                name: "ซูการ์โน มะทา",
                nickname: "เปาะซู",
                position: "รองหัวหน้าพรรค/แคนดิเดตนายกฯ",
                birthdate: "12 ตุลาคม 2507",
                education: "ปริญญาตรี คณะนิติศาสตร์ มหาวิทยาลัยรามคำแหง",
                career: "ส.ส. ยะลา หลายสมัย, ประธาน กมธ. การปกครองรัฐสภา, น้องชายวันมูหะมัดนอร์ มะทา",
                vision: "การกระจายอำนาจสู่ท้องถิ่น และปกป้องสิทธิเสรีภาพของประชาชนภายใต้ความหลากหลาย",
                bio: "ตัวแทนสำคัญของพี่น้องประชาชนในพื้นที่สามจังหวัดชายแดนใต้",
                imageUrl: "https://ui-avatars.com/api/?name=SM&background=BD9A31&color=fff&size=128&bold=true&font-size=0.4"
            }
        ],
        logoUrl: "https://www.google.com/s2/favicons?domain=prachachat.or.th&sz=128"
    },
];

// Remote Data Configuration
const NIDA_DATA_URL = 'https://raw.githubusercontent.com/potatohd-studio/monitor-data/main/nida-data.json';
const FALLBACK_NIDA_DATA = { 'pp': 30.4, 'bjt': 22.1, 'pt': 15.6, 'dem': 12.3, 'utn': 5.0, 'pprp': 2.0, 'pcc': 1.5, 'tst': 1.0, 'cpd': 0.5, 'srt': 0.5 };

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
    { url: 'https://www.bbc.com/thai/index.xml', source: 'BBC News ไทย', type: 'news' },
    { url: 'https://thestandard.co/category/opinion/feed/', source: 'THE STANDARD (Opinion)', type: 'opinion' },
    { url: 'https://pantip.com/forum/rajdamnern/feed', source: 'Pantip (ราชดำเนิน)', type: 'social' },
];

// Thai Rath Opinion RSS is currently 404, removed until updated.
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

    // Use advanced confidence calculation
    const confidence = calculateConfidence(matchedKeywords.length, RSS_FEEDS.length, Math.abs(totalScore));

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
    'pp': ["ประชาชน", "เท้ง", "ปชน", "ศิริกัญญา", "วีระยุทธ", "ก้าวไกล", "ณัฐพงษ์"],
    'pt': ["เพื่อไทย", "แพทองธาร", "ทักษิณ", "ยศชนัน", "จุลพันธ์", "อุ๊งอิ๊ง", "เศรษฐา"],
    'utn': ["รวมไทยสร้างชาติ", "พีระพันธุ์", "รทสช", "ตู่", "ประยุทธ์"],
    'bjt': ["ภูมิใจไทย", "อนุทิน", "ภท", "เสี่ยหนู"],
    'dem': ["ประชาธิปัตย์", "เฉลิมชัย", "ปชป", "มาร์ค", "ชวน"],
    'pprp': ["พลังประชารัฐ", "ประวิตร", "พปชร", "บิ๊กป้อม"],
    'cpd': ["ชาติไทยพัฒนา", "วราวุธ", "บรรหาร"],
    'tst': ["ไทยสร้างไทย", "สุดารัตน์", "หน่อย"],
    'srt': ["เสรีรวมไทย", "เสรีพิศุทธ์", "วีระบุรุษนาแก"],
    'tkm': ["ไทยก้าวใหม่", "สุชัชวีร์", "พี่เอ้", "ดร.เอ้"],
    'okm': ["โอกาสใหม่", "พรรคโอกาสใหม่"],
    'econ': ["พรรคเศรษฐกิจ", "พลเอกรังษี", "รังษี กิติญาณทรัพย์", "เศรษฐกิจไทย"],
    'pcc': ["ประชาชาติ", "ทวี สอดส่อง", "วรวีร์", "ซูการ์โน", "วันนอร์"],
};

function detectParty(text) {
    for (const [id, kw] of Object.entries(PARTY_KEYWORDS)) {
        if (kw.some(k => text.includes(k))) return id;
    }
    return null;
}

function isPoliticalNews(text) {
    if (!text) return false;
    const polKw = [
        "การเมือง", "เลือกตั้ง", "สภา", "รัฐบาล", "ฝ่ายค้าน", "นายก", "รัฐมนตรี", "พรรค",
        "ทุจริต", "ยุบพรรค", "ส.ส.", "ส.ว.", "โพล", "คดี", "ศาลรัฐธรรมนูญ", "กกต.",
        "ชุมนุม", "ประท้วง", "มติ", "พรรคร่วม", "แคนดิเดต"
    ];
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

// Persistent history for analyzed news (Last 7 items)
let analyzedHistory = [];
const MAX_ANALYZED_HISTORY = 7;

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

        // [NEW] Rehydrate analyzed history from local file
        if (fs.existsSync(HISTORY_LOG_PATH)) {
            const historyData = JSON.parse(fs.readFileSync(HISTORY_LOG_PATH, 'utf8'));
            if (Array.isArray(historyData)) {
                analyzedHistory = historyData;
                logDebug(`Rehydrated ${analyzedHistory.length} analyzed history items from local file.`);
            }
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
const NEWS_CACHE_DURATION = 120000; // 2 minutes cache

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
const feedStatuses = {};
// Initialize feedStatuses
RSS_FEEDS.forEach(f => {
    feedStatuses[f.source] = {
        name: f.source,
        status: 'pending',
        items: 0,
        lastFetch: null,
        error: null
    };
});

// Helper: Create a unique key for news (Thai-friendly)
function generateNewsKey(text) {
    if (!text) return 'empty';
    // Use MD5 hash of the normalized headline to ensure Thai characters are preserved and uniqueness is high
    return crypto.createHash('md5').update(text.trim()).digest('hex');
}

// Helper: Fetch with retry and timeout
async function fetchWithRetry(url, options = {}, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(10000) // 10s timeout
            });
            if (response.ok) return response;
            if (response.status === 404) throw new Error('404 Not Found');
            logDebug(`Fetch attempt ${i + 1} failed for ${url}: HTTP ${response.status}`);
        } catch (err) {
            if (i === retries) throw err;
            logDebug(`Retry ${i + 1}/${retries} for ${url} due to: ${err.message}`);
            await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential backoff-ish
        }
    }
}

// Reliable Fetch using fetch + rss-parser (Server-side)
async function fetchLiveNewsLocal() {
    const now = Date.now();

    if (cachedRecentNews.length > 0 && (now - lastNewsCacheTime < NEWS_CACHE_DURATION)) {
        logDebug(`Returning cached news (${cachedRecentNews.length} items, ${Math.round((now - lastNewsCacheTime) / 1000)}s old)`);
        return cachedRecentNews;
    }

    logDebug("Fetching live news from RSS feeds (via raw fetch)...");
    const parser = new Parser({
        customFields: { item: [['description', 'description'], ['content:encoded', 'content']] }
    });
    const allItems = [];
    const HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9,th;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    };

    // Staggered fetch to avoid burst rate-limits
    await Promise.all(RSS_FEEDS.map(async (feed, idx) => {
        try {
            // Add a staggered delay (300ms per node)
            await new Promise(r => setTimeout(r, idx * 300));

            const response = await fetchWithRetry(feed.url, { headers: HEADERS });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const xml = await response.text();

            // Then, parse the XML string
            const res = await parser.parseString(xml);
            const itemsInFeed = res.items.length;

            feedStatuses[feed.source] = {
                name: feed.source,
                status: 'active',
                items: itemsInFeed,
                lastFetch: new Date().toISOString(),
                error: null
            };

            res.items.forEach(item => {
                const pubDateStr = item.pubDate || item.isoDate;
                const pubDate = new Date(pubDateStr);
                const now = new Date();
                const hoursOld = (now - pubDate) / (1000 * 60 * 60);

                // Filter 1: Time check (48 hours)
                if (hoursOld > ELECTION_CONFIG.NEWS_RETENTION_HOURS) {
                    // logDebug(`Skipping old news [${hoursOld.toFixed(1)}h]: ${item.title}`);
                    return;
                }

                // Filter 2: Political check
                if (!isPoliticalNews(item.title)) {
                    // logDebug(`Skipping non-political news: ${item.title}`);
                    return;
                }

                allItems.push({
                    text: item.title,
                    link: item.link,
                    pubDate: pubDateStr,
                    source: feed.source,
                    type: feed.type || 'news',
                    region: feed.type === 'regional' ? feed.source.split(' ').pop() : (feed.type === 'news' ? 'National' : 'Online'),
                    content: item.content || item.description || ""
                });
            });
        } catch (e) {
            console.error(`Status: ${feed.source} fetch failed: ${e.message}`);
            feedStatuses[feed.source] = {
                name: feed.source,
                status: 'error',
                items: 0,
                lastFetch: new Date().toISOString(),
                error: e.message
            };
        }
    }));

    // [FALLBACK] If no news found from RSS, load from news-db.json
    if (allItems.length === 0) {
        logDebug("⚠️ No news from RSS. Loading from news-db.json fallback.");
        try {
            const dbPath = path.join(process.cwd(), 'news-db.json');
            if (fs.existsSync(dbPath)) {
                const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
                // Flatten party news into items
                Object.entries(dbData).forEach(([key, headlines]) => {
                    headlines.forEach(headline => {
                        allItems.push({
                            text: headline,
                            link: `https://archive.local/${Buffer.from(headline).toString('base64').substring(0, 10)}`,
                            pubDate: new Date().toISOString(),
                            source: 'Local Archive',
                            type: 'news',
                            region: 'National',
                            content: ''
                        });
                    });
                });
                logDebug(`Loaded ${allItems.length} items from fallback database.`);
            }
        } catch (err) {
            logDebug(`Fallback failed: ${err.message}`);
        }
    }

    const seen = new Set();
    const filtered = [];
    const politicalFallback = []; // News that is political but maybe old

    allItems.forEach(item => {
        const key = generateNewsKey(item.text);
        if (seen.has(key)) return;
        seen.add(key);

        const pubDate = new Date(item.pubDate);
        const now = new Date();
        const hoursOld = (now - pubDate) / (1000 * 60 * 60);

        const isPolitical = isPoliticalNews(item.text);

        if (isPolitical) {
            if (hoursOld <= ELECTION_CONFIG.NEWS_RETENTION_HOURS) {
                filtered.push(item);
            } else {
                politicalFallback.push(item);
            }
        }
    });

    // [BEST EFFORT FALLBACK] If less than 7 fresh news, pad with most recent political news
    if (filtered.length < 7 && politicalFallback.length > 0) {
        logDebug(`⚠️ Only ${filtered.length} fresh news (48h). Padding with ${Math.min(7 - filtered.length, politicalFallback.length)} older political news.`);
        politicalFallback.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        const padding = politicalFallback.slice(0, 7 - filtered.length);
        filtered.push(...padding);
    }

    logDebug(`Fetch complete. Total items: ${filtered.length}`);

    // Update cache
    cachedRecentNews = filtered;
    lastNewsCacheTime = Date.now();

    return filtered;
}

function getFeedStatus() {
    return {
        activeFeeds: RSS_FEEDS.length,
        lastUpdate: new Date().toISOString(),
        nodes: Object.values(feedStatuses)
    };
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
            const headlineKey = generateNewsKey(n.text);
            const linkKey = (n.link || '').split('?')[0].replace(/\/$/, '').trim();

            const isRead = consumed.has(headlineKey) || (linkKey && consumed.has(linkKey));

            const inHistory = analyzedHistory.some(h => {
                const hHeadlineKey = generateNewsKey(h.headline);
                const hLinkKey = (h.link || '').split('?')[0].replace(/\/$/, '').trim();
                return hHeadlineKey === headlineKey || (linkKey && hLinkKey === linkKey);
            });

            return !isRead && !inHistory;
        });

        // Separate Mainstream/Social
        const mainstream = available.filter(n => n.type === 'news');
        const social = available.filter(n => n.type === 'social' || n.type === 'opinion');

        const batchImpacts = {};
        const batchSize = analyzedHistory.length < 10 ? 5 : 3;
        // Batch processing: Take up to batchSize items, but process OLDEST first 
        // within the batch so when they are unshifted, the NEWEST ends up at the top.
        const workQueue = [...mainstream, ...social]
            .sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0)) // Newest first overall
            .slice(0, batchSize)
            .reverse(); // Reverse for batch processing (Oldest first)

        for (const newsItem of workQueue) {
            const headlineKey = generateNewsKey(newsItem.text);
            const sentimentResult = await analyzeSentimentHybrid(newsItem.text, newsItem.content);
            const pId = detectParty(newsItem.text);
            let newsImpact = sentimentResult.score * 0.3;
            if (newsItem.type !== 'news') newsImpact *= 0.5;

            markNewsAsRead(headlineKey, pId, sentimentResult.sentiment, newsImpact);
            if (pId) batchImpacts[pId] = (batchImpacts[pId] || 0) + newsImpact;

            const newHistoryItem = {
                headline: newsItem.text,
                link: newsItem.link,
                pubDate: newsItem.pubDate || new Date().toISOString(),
                sentiment: sentimentResult.sentiment,
                confidence: sentimentResult.confidence,
                modelUsed: sentimentResult.modelUsed,
                source: newsItem.source,
                impact: newsImpact.toFixed(2),
                primaryContext: sentimentResult.primaryContext,
                target: pId ? PARTIES.find(pa => pa.id === pId)?.name : "ทั่วไป",
                timestamp: new Date().toISOString()
            };

            const isDuplicate = analyzedHistory.some(h =>
                (generateNewsKey(h.headline) === headlineKey)
            );

            if (!isDuplicate) {
                analyzedHistory.unshift(newHistoryItem);
                // Final safety sort: Always keep the latest pubDate at the top [v4.4]
                // and then trim to MAX_ANALYZED_HISTORY
                analyzedHistory.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

                if (analyzedHistory.length > MAX_ANALYZED_HISTORY) {
                    analyzedHistory.pop();
                }
            }
        }

        if (workQueue.length > 0) saveAnalyzedHistory(analyzedHistory);

        // Update Market State
        marketState = marketState.map(p => {
            let drift = (Math.random() - 0.5) * 0.2;
            if (batchImpacts[p.id]) drift += batchImpacts[p.id];

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
            const confInterval = calculateConfidenceInterval(news, available.length);
            const moe = confInterval.margin;

            return {
                ...p,
                projectedSeats: seats,
                projectedVotes: Math.floor(share * ELECTION_CONFIG.TOTAL_VOTERS).toLocaleString('th-TH'),
                moe: moe.toFixed(1),
                wikiIndex: wiki.toFixed(1),
                nidaScore: nida,
                isTrending: news > (nida + 5),
                hiddenSupport: nida > (news + 5),
                divergence: (news - nida).toFixed(1),
                trendPrediction: calculateTrendPrediction(p.id)
            };
        });

        saveScoreHistory(marketState);

        return {
            timestamp: new Date().toISOString(),
            parties: marketState.sort((a, b) => b.score - a.score),
            sampleSize: newsList.length,
            feedStatus: getFeedStatus(),
            analyzedNews: (analyzedHistory.length > 0 && analyzedHistory[0].source !== 'Reddit' && analyzedHistory[0].source !== 'Pantip') ? analyzedHistory[0] : null,
            analyzedHistory: analyzedHistory,
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
