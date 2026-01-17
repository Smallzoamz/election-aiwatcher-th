import Link from 'next/link';
import { Database, Zap, Brain, Activity, TrendingUp, ShieldCheck, Scale, History } from 'lucide-react';

export const metadata = {
    title: 'วิธีการคำนวณ | TH Election AI Watch',
    description: 'เจาะลึกเบื้องหลังระบบ AI วิเคราะห์การเลือกตั้งไทย 2569',
};

export default function MethodologyPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="mb-12 border-b border-slate-800 pb-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full -z-10" />
                    <Link
                        href="/"
                        className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-flex items-center gap-1 transition-transform hover:-translate-x-1"
                    >
                        ← กลับหน้าหลัก
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 animate-gradient-x">
                        เจาะลึกระบบ AI อัจฉริยะ
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        เปิดเผยเบื้องหลังเทคโนโลยีการวิเคราะห์ Data-Driven Election Analysis (v4.1) ที่แม่นยำและโปร่งใสที่สุด
                    </p>
                </header>

                {/* Disclaimer */}
                <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-6 mb-12 flex items-start gap-4 shadow-lg shadow-amber-900/10">
                    <div className="p-3 bg-amber-500/10 rounded-lg shrink-0">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <div>
                        <h3 className="text-amber-400 font-bold text-lg mb-1">ข้อจำกัดความรับผิดชอบ (Disclaimer)</h3>
                        <p className="text-amber-200/70 text-sm leading-relaxed">
                            ระบบนี้เป็นการ<strong>สาธิตเทคโนโลยี (Tech Demo)</strong> เพื่อแสดงศักยภาพของ AI ในการประมวลผลข้อมูล Real-time เท่านั้น
                            ผลลัพธ์ที่ได้มาจากความพยายามจำลองสถานการณ์และวิเคราะห์แนวโน้มจากโซเชียลมีเดีย+ผลโพลจริง
                            <span className="block mt-2 font-medium text-amber-300">ไม่ใช่ผลการเลือกตั้งจริง และไม่สามารถใช้อ้างอิงทางกฎหมายหรือการเดิมพันได้</span>
                        </p>
                    </div>
                </div>

                {/* Core Pillars */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Real-time Core</h3>
                        <p className="text-slate-400 text-sm">
                            ประมวลผลข้อมูลใหม่ด้วย AI Algorithm ที่ทำงานตลอด 24 ชม. ตรวจสอบ RSS/Social ทุกๆ 5 นาที
                        </p>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Brain className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Hybrid Intelligence</h3>
                        <p className="text-slate-400 text-sm">
                            ผสานพลังระหว่างผลโพลสถาบันหลัก (NIDA Poll) กับกระแสโซเชียลและข่าว (AI Sentiment)
                        </p>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-green-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Database className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Persistence Memory</h3>
                        <p className="text-slate-400 text-sm">
                            ระบบบันทึกประวัติ (History Persistence) ทำให้ News Ticker ค้างข่าวล่าสุดไว้เสมอแม้เริ่มระบบใหม่
                        </p>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="space-y-12">

                    {/* Section 1: Data Sources */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-cyan-400 mb-6 border-b border-slate-800 pb-2">
                            <span className="text-3xl">📡</span> แหล่งข้อมูลทั้งหมด (Full Data Sources Index)
                        </h2>
                        <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6 lg:p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-white font-medium mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        สำนักข่าวหลัก & บทวิเคราะห์ (7 แหล่ง)
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { name: 'มติชนออนไลน์', detail: 'ข่าวการเมืองกระแสหลัก' },
                                            { name: 'ประชาชาติธุรกิจ', detail: 'เจาะลึกนโยบายและเศรษฐกิจ' },
                                            { name: 'ข่าวสด', detail: 'ประเด็นสังคมและการเมือง' },
                                            { name: 'ประชาไท', detail: 'ข่าวการเมืองภาคประชาชน' },
                                            { name: 'THE STANDARD', detail: 'บทความวิเคราะห์เชิงลึก' },
                                            { name: 'BBC News ไทย', detail: 'บทวิเคราะห์ระดับสากล' },
                                            { name: 'Bangkok Post', detail: 'ข่าวภาษาอังกฤษ (National Coverage)' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
                                                <span className="text-slate-200 text-xs font-bold">{item.name}</span>
                                                <span className="text-[10px] text-slate-500 italic">{item.detail}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <h3 className="text-white font-medium mt-6 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                        ท้องถิ่น & โซเชียลมีเดีย (6 แหล่ง)
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { name: 'The Isaan Record', detail: 'เจาะลึกข่าวภาคอีสาน' },
                                            { name: 'The Phuket News', detail: 'ข่าวภาคใต้และจังหวัดภูเก็ต' },
                                            { name: 'Chiang Mai Citylife', detail: 'ข่าวท้องถิ่นภาคเหนือ' },
                                            { name: 'Pantip (ราชดำเนิน)', detail: 'กระทู้การเมืองยอดนิยม' },
                                            { name: 'Reddit (r/Thailand)', detail: 'กระแสความเห็นต่างชาติและไทย' },
                                            { name: 'THE STANDARD (Opinion)', detail: 'บทความทัศนะจากผู้เชี่ยวชาญ' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
                                                <span className="text-slate-200 text-xs font-bold">{item.name}</span>
                                                <span className="text-[10px] text-orange-400/70 italic">{item.detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-white font-medium mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        ความแม่นยำ & การตรวจสอบ (Audit v3.8)
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Political Keywords Audit', detail: 'กรองข่าวการเมืองด้วย 85+ คีย์เวิร์ด (ทุจริต, ยุบพรรค, ป.ป.ช.)' },
                                            { name: 'URL-Based Deduplication', detail: 'ป้องกันการวิเคราะห์ข่าวซ้ำจาก URL เดิม 100%' },
                                            { name: 'Victim Context Analysis', detail: 'ตรวจจับบริบท "ถูกโจมตี/ถูกกระทำ" เพื่อความยุติธรรม' },
                                            { name: 'Score Decay Logic', detail: 'ลดผลกระทบข่าวเก่าลง 2% ต่อรอบ เพื่อสะท้อนกระแสปัจจุบัน' },
                                            { name: 'History Rehydration', detail: 'โหลดข่าวล่าสุด 7 รายการจากไฟล์ analyzed-history.json อัตโนมัติ' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                                                <div className="text-emerald-400 text-xs font-bold mb-1">{item.name}</div>
                                                <div className="text-[10px] text-slate-400 leading-tight">{item.detail}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <h3 className="text-white font-medium mt-6 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                        ระบบประมวลผลคู่ (Hybrid Engine)
                                    </h3>
                                    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 rounded-xl border border-purple-500/20">
                                        <p className="text-[11px] text-slate-300 leading-relaxed mb-3 font-medium">
                                            เราใช้ระบบประมวลผลร่วมกันระหว่าง <strong>Rule Engine</strong> (วิเคราะห์ไว) และ <strong>Gemini 2.0 API</strong> (วิเคราะห์บทความซับซ้อน)
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] text-purple-400 font-mono">
                                            <span className="bg-purple-900/50 px-2 py-1 rounded">Confidence: 95-99%</span>
                                            <span className="bg-blue-900/50 px-2 py-1 rounded">Model: Flash 2.0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Transparency & Ethics */}
                    <section className="relative">
                        <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none" />
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-blue-400 mb-6 border-b border-slate-800 pb-2">
                            <span className="text-3xl">🛡️</span> ความโปร่งใส & จริยธรรม AI (Ethics Deep-dive)
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-slate-900/60 p-5 rounded-2xl border border-blue-500/20 relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                                    <h3 className="font-bold text-sm text-white">Confidence Levels</h3>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                                    ตัววัดความน่าเชื่อถือของเนื้อหาข่าว ยิ่งมีสำนักข่าวสายหลักรายงานเรื่องเดียวกันหลายแห่ง ระบบจะยิ่งเพิ่มระดับความมั่นใจให้สูงขึ้น เพื่อให้คุณมั่นใจได้ว่าเป็นกระแสสังคมที่เกิดขึ้นจริง
                                </p>
                            </div>
                            <div className="bg-slate-900/60 p-5 rounded-2xl border border-teal-500/20 relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <Scale className="w-5 h-5 text-teal-400" />
                                    <h3 className="font-bold text-sm text-white">Margin of Error</h3>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                    ตัวเลขที่เห็นอาจมีค่าความคลาดเคลื่อนตามหลักสถิติประมาณ ±5% ซึ่งระบบจะประมวลผลให้แม่นยำขึ้นเรื่อยๆ เมื่อมีข้อมูลข่าวสารไหลเข้ามาเพิ่มขึ้นในระบบเพื่อให้สะท้อนความเป็นจริงที่สุด
                                </p>
                            </div>
                            <div className="bg-slate-900/60 p-5 rounded-2xl border border-purple-500/20 relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <History className="w-5 h-5 text-purple-400" />
                                    <h3 className="font-bold text-sm text-white">Data Fairness</h3>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                    AI ของเราถูกฝึกมาให้แยกแยะระหว่าง "การทำผิด" กับ "การถูกพาดพิง" เพื่อป้องกันไม่ให้นักการเมืองหรือพรรคที่ถูกโจมตี หรือถูกกลั่นแกล้งเพียงฝ่ายเดียวต้องเสียคะแนนโดยไม่เป็นธรรม
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Hybrid Calculation */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-purple-400 mb-6 border-b border-slate-800 pb-2">
                            <span className="text-3xl">🧮</span> สูตรคำนวณแบบแยกประเภท (QWHS Calculation)
                        </h2>
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

                            <p className="text-slate-300 mb-8 max-w-3xl relative z-10 text-sm italic">
                                *การคำนวณถูกแยกเป็น 2 ส่วนตามระบบการเลือกตั้งไทย เพื่อให้สะท้อนภาพรวมและความเป็นไปได้ในระดับพื้นที่
                            </p>

                            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                {/* Party List */}
                                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl" />
                                    <div className="flex items-center gap-3 mb-4">
                                        <TrendingUp className="w-6 h-6 text-purple-400" />
                                        <h3 className="font-bold text-lg text-white">ส.ส. บัญชีรายชื่อ (100 ที่นั่ง)</h3>
                                    </div>
                                    <div className="text-sm font-mono space-y-1 mb-4">
                                        <div className="flex justify-between text-slate-400"><span>• Poll Data (Base):</span> <span className="text-white font-bold">40%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• News Sentiment:</span> <span className="text-white font-bold">30%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• Wikipedia Signals:</span> <span className="text-white font-bold">20%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• Social Sentiment:</span> <span className="text-white font-bold">10%</span></div>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed text-center">
                                        เน้นวัดความนิยมในระดับ "กระแสหลักบริษัท" และภาพรวมทั้งประเทศ
                                    </p>
                                </div>

                                {/* Constituency */}
                                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-teal-500/30 relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-teal-500/20 rounded-full blur-xl" />
                                    <div className="flex items-center gap-3 mb-4">
                                        <Activity className="w-6 h-6 text-teal-400" />
                                        <h3 className="font-bold text-lg text-white">ส.ส. แบ่งเขต (400 ที่นั่ง)</h3>
                                    </div>
                                    <div className="text-sm font-mono space-y-1 mb-4">
                                        <div className="flex justify-between text-slate-400"><span>• Poll Data (Base):</span> <span className="text-white font-bold">50%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• News Sentiment:</span> <span className="text-white font-bold">20%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• Wikipedia Signals:</span> <span className="text-white font-bold">20%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• Social Sentiment:</span> <span className="text-white font-bold">10%</span></div>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed text-center">
                                        ให้ความสำคัญกับผลโพลเป็นหลักเพื่อสะท้อนฐานเสียงเดิมในแต่ละเขตพื้นที่
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Performance */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-green-400 mb-6 border-b border-slate-800 pb-2">
                            <span className="text-3xl">🚀</span> ประสิทธิภาพความรวดเร็ว (Speed v3.8)
                        </h2>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                            <ul className="grid md:grid-cols-2 gap-4">
                                <li className="flex items-start gap-3 bg-black/20 p-4 rounded-lg">
                                    <span className="text-green-400 font-bold">✓</span>
                                    <span className="text-sm text-slate-300">
                                        <strong className="text-white block mb-1">Visibility API Optimized</strong>
                                        ระบบจะเข้าสู่โหมดประหยัดพลังงานเพื่อลดภาระเครื่องของผู้ใช้เมื่อสลับไปใช้แอปอื่น หรือไม่ได้มองหน้าจอ
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 bg-black/20 p-4 rounded-lg">
                                    <span className="text-green-400 font-bold">✓</span>
                                    <span className="text-sm text-slate-300">
                                        <strong className="text-white block mb-1">Disk Rehydration</strong>
                                        โหลดข่าวกลับมาจาก Disk ทันที ทำให้ประวัติข่าวค้างอยู่ใน News Ticker ครบถ้วนตั้งแต่วินาทีแรก
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 bg-black/20 p-4 rounded-lg">
                                    <span className="text-green-400 font-bold">✓</span>
                                    <span className="text-sm text-slate-300">
                                        <strong className="text-white block mb-1">Next.js Data Caching</strong>
                                        ใช้ความสามารถในการแคชข้อมูลระดับสูงเพื่อความลื่นไหลในการแสดงกราฟประวัติคะแนนย้อนหลัง
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 bg-black/20 p-4 rounded-lg">
                                    <span className="text-green-400 font-bold">✓</span>
                                    <span className="text-sm text-slate-300">
                                        <strong className="text-white block mb-1">Memoized AI Engine</strong>
                                        จดจำผลการคำนวณที่ซับซ้อนเพื่อลดภาระ CPU และประหยัดแบตเตอรี่
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-600">
                    <p className="mb-2">© 2026 Bonchon-Studio | TH Election AI Watch v4.1 (NIDA Poll 2026 Refresh)</p>
                    <p className="text-xs">
                        พัฒนาโดยสถาปัตยกรรม An An v3.0 | ความโปร่งใสของอัลกอริทึมและจริยธรรมข้อมูลคือหัวใจสำคัญ
                    </p>
                </footer>
            </div>
        </main>
    );
}
