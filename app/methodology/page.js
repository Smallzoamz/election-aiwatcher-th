import Link from 'next/link';
import { Database, Zap, Brain, Activity, TrendingUp } from 'lucide-react';

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
                        เปิดเผยเบื้องหลังเทคโนโลยีการวิเคราะห์ Data-Driven Election Analysis (v3.2) ที่แม่นยำและรวดเร็วที่สุด
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
                            ผลลัพธ์ที่ได้มาจากการจำลองสถานการณ์และวิเคราะห์แนวโน้มจากโซเชียลมีเดีย+ผลโพลในอดีต
                            <span className="block mt-2 font-medium text-amber-300">ไม่ใช่ผลการเลือกตั้งจริง และไม่สามารถใช้อ้างอิงทางกฎหมายได้</span>
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
                            ประมวลผลข้อมูลใหม่ทุก 3 วินาที ด้วย AI Algorithm ที่ทำงานตลอด 24 ชม. ไม่มีวันหยุด
                        </p>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Brain className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Hybrid Intelligence</h3>
                        <p className="text-slate-400 text-sm">
                            ผสานพลังระหว่างผลโพลสถาบันหลัก (NIDA Poll) กับกระแสโซเชียลมีเดีย (AI Sentiment)
                        </p>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-green-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Database className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">High Performance</h3>
                        <p className="text-slate-400 text-sm">
                            Optimize ด้วย Next.js 16, Lazy Loading และ Database Caching เพื่อความเร็วสูงสุด
                        </p>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="space-y-12">

                    {/* Section 1: Data Sources */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-cyan-400 mb-6 border-b border-slate-800 pb-2">
                            <span className="text-3xl">📡</span> แหล่งข้อมูล (Data Sources)
                        </h2>
                        <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6 lg:p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        สำนักข่าวหลัก (Verified Working)
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            { name: 'มติชนออนไลน์ (การเมือง)', weight: '1.0x', detail: 'เจาะลึกข่าวการเมืองหลัก' },
                                            { name: 'ประชาชาติธุรกิจ (การเมือง)', weight: '1.0x', detail: 'เจาะลึกรัฐบาลและสภา' },
                                            { name: 'มติชน (ทั่วไป)', weight: '0.7x', detail: 'ข่าวกระแสสังคม' },
                                            { name: 'ประชาชาติ (ทั่วไป)', weight: '0.7x', detail: 'ข่าวเศรษฐกิจและการเมือง' },
                                            { name: 'ข่าวสด', weight: '0.9x', detail: 'ข่าวอาชญากรรมและการเมือง' },
                                            { name: 'ประชาไท', weight: '1.3x', detail: 'สื่อทางเลือก / ข่าวสิทธิมนุษยชน' },
                                            { name: 'THE STANDARD', weight: '1.2x', detail: 'สื่อออนไลน์ยุคใหม่' },
                                            { name: 'Bangkok Post', weight: '1.1x', detail: 'ข่าวภาษาอังกฤษ (National)' },
                                        ].map((item, i) => (
                                            <li key={i} className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                                                <span className="text-slate-200 text-sm">{item.name}</span>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-mono text-cyan-400 bg-cyan-900/30 px-1.5 py-0.5 rounded">Weight: {item.weight}</div>
                                                    <div className="text-[9px] text-slate-500 mt-0.5">{item.detail}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <h3 className="text-white font-medium mt-6 mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                        แหล่งข่าวท้องถิ่น (Regional News)
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            { name: 'The Isaan Record', weight: '1.4x', detail: 'ภาคอีสาน (High Impact)' },
                                            { name: 'The Phuket News', weight: '1.3x', detail: 'ภาคใต้ / ภูเก็ต' },
                                            { name: 'Chiang Mai Citylife', weight: '1.3x', detail: 'ภาคเหนือ / เชียงใหม่' },
                                        ].map((item, i) => (
                                            <li key={i} className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                                                <span className="text-slate-200 text-sm">{item.name}</span>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-mono text-orange-400 bg-orange-900/30 px-1.5 py-0.5 rounded">Weight: {item.weight}</div>
                                                    <div className="text-[9px] text-slate-500 mt-0.5">{item.detail}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <h3 className="text-white font-medium mt-6 mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        ระบบกรองคุณภาพ (Data Quality Filters)
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            { name: 'Political Filter', detail: 'กรองเฉพาะข่าวการเมือง 50+ keywords' },
                                            { name: 'Duplicate Filter', detail: 'ลบข่าวหัวซ้ำ (ตรวจ 40 ตัวแรก)' },
                                            { name: 'Victim Context', detail: 'ตรวจจับบริบท "ถูกกระทำ" ส่ง Gemini' },
                                            { name: 'Score Decay', detail: 'ลดความผันผวน 2% ต่อ tick' },
                                            { name: 'Score Clamping', detail: 'จำกัดคะแนน 0-100%' },
                                        ].map((item, i) => (
                                            <li key={i} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                                <span className="text-slate-200">{item.name}</span>
                                                <div className="text-right">
                                                    <div className="text-[10px] text-emerald-400">{item.detail}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mt-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                                                <Zap className="w-4 h-4" />
                                            </div>
                                            <h3 className="font-bold text-white text-sm">AI Transparency Engine</h3>
                                        </div>
                                        <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
                                            เราระบุโมเดลที่ใช้และระบุค่าความมั่นใจ (Confidence) ของการวิเคราะห์เพื่อให้ Papa ตรวจสอบความถูกต้องได้:
                                        </p>
                                        <ul className="space-y-2 text-[10px] text-slate-300">
                                            <li className="flex items-start gap-2">
                                                <span className="text-cyan-400 font-bold">•</span>
                                                <span><strong>Rule Engine:</strong> วิเคราะห์ด้วย Keyword (มั่นใจ 85-95%)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-400 font-bold">•</span>
                                                <span><strong>Gemini 2.0 Flash:</strong> วิเคราะห์ประโยค (มั่นใจ 90-99%)</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                        โซเชียลมีเดีย & เทรนด์ (Trends & Sentiment)
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-orange-900/10 border border-orange-500/20 p-4 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-orange-400">Wikipedia Analytics (Search Trends)</span>
                                                <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">20% Weight</span>
                                            </div>
                                            <p className="text-xs text-orange-200/60">
                                                ติดตามสถิติการเข้าชมหน้าบทความ (Pageviews) แบบ Real-time เพื่อวัดระดับความ "อยากรู้จัก" และความสนใจเชิงลึก
                                            </p>
                                        </div>
                                        <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-blue-400">Social Sentiment (Reddit / BBC Thai)</span>
                                                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">20% Weight (List)</span>
                                            </div>
                                            <p className="text-xs text-blue-200/60">
                                                วิเคราะห์ความรู้สึกจากบอร์ดสนทนาออนไลน์และบทความแสดงทัศนะขยายความจากข่าวหลัก (Opinion Pieces)
                                            </p>
                                        </div>
                                        <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-red-400">NIDA Poll (Ground Truth)</span>
                                                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">50% Weight (Const)</span>
                                            </div>
                                            <p className="text-xs text-red-200/60">
                                                ใช้ผลโพลของสำนักโพลมาตรฐาน (NIDA) เป็นฐานอ้างอิงความจริง (Ground Truth) ร่วมกับข้อมูล Real-time
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Hybrid Calculation */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-purple-400 mb-6 border-b border-slate-800 pb-2">
                            <span className="text-3xl">🧮</span> สูตรคำนวณแบบผสมผสาน (Weighted Hybrid Score)
                        </h2>
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

                            <p className="text-slate-300 mb-8 max-w-3xl relative z-10">
                                เพื่อความแม่นยำสูงสุด พัฒนาการคำนวณให้แยกตามประเภทที่นั่ง ส.ส. เนื่องจากการตัดสินใจของผู้มีสิทธิเลือกตั้งในสองระบบนี้ต่างกัน:
                            </p>

                            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                {/* Party List */}
                                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl" />
                                    <div className="flex items-center gap-3 mb-4">
                                        <TrendingUp className="w-6 h-6 text-purple-400" />
                                        <h3 className="font-bold text-lg text-white">ส.ส. บัญชีรายชื่อ (QWHS)</h3>
                                        <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">100 ที่นั่ง</span>
                                    </div>
                                    <div className="text-sm font-mono space-y-1 mb-4">
                                        <div className="flex justify-between text-slate-400"><span>• Poll Data:</span> <span className="text-white font-bold">30%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• News Sentiment:</span> <span className="text-white font-bold">30%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• Social Signal:</span> <span className="text-white font-bold">20%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• Search Trends:</span> <span className="text-white font-bold">20%</span></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        เน้นการกระจายน้ำหนักเพื่อสะท้อนภาพรวมความนิยมทั้งประเทศ
                                    </p>
                                </div>

                                {/* Constituency */}
                                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-teal-500/30 relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-teal-500/20 rounded-full blur-xl" />
                                    <div className="flex items-center gap-3 mb-4">
                                        <Activity className="w-6 h-6 text-teal-400" />
                                        <h3 className="font-bold text-lg text-white">ส.ส. แบ่งเขต (QWHS)</h3>
                                        <span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full">400 ที่นั่ง</span>
                                    </div>
                                    <div className="text-sm font-mono space-y-1 mb-4">
                                        <div className="flex justify-between text-slate-400"><span>• Poll Data:</span> <span className="text-white font-bold">50%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• News Sentiment:</span> <span className="text-white font-bold">20%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• Social Signal:</span> <span className="text-white font-bold">10%</span></div>
                                        <div className="flex justify-between text-slate-400"><span>• Search Trends:</span> <span className="text-white font-bold">20%</span></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        เน้นน้ำหนักผลโพลรายพื้นที่เพื่อลดความคลาดเคลื่อนจากกระแสออนไลน์ที่ไม่สะท้อนฐานเสียงเขต
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Performance */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-green-400 mb-6 border-b border-slate-800 pb-2">
                            <span className="text-3xl">🚀</span> ประสิทธิภาพระบบ (System Performance)
                        </h2>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                            <p className="text-slate-300 mb-6">
                                เวอร์ชั่น 3.2 ได้รับการปรับปรุงโครงสร้างเพื่อรองรับข้อมูล Real-time Analytics จาก Gemini และ Wikipedia:
                            </p>
                            <ul className="grid md:grid-cols-2 gap-4">
                                <li className="flex items-start gap-3 bg-black/20 p-3 rounded-lg">
                                    <span className="text-green-400 font-bold">✓</span>
                                    <span className="text-sm text-slate-300">
                                        <strong className="text-white block mb-1">Visibility API Optimized</strong>
                                        ระบบจะหยุดดึงข้อมูลชั่วคราวเมื่อผู้ใช้สลับหน้าจอ เพื่อประหยัดดาต้าและแบตเตอรี่
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 bg-black/20 p-3 rounded-lg">
                                    <span className="text-green-400 font-bold">✓</span>
                                    <span className="text-sm text-slate-300">
                                        <strong className="text-white block mb-1">Lazy Loading Components</strong>
                                        โหลดกราฟและส่วนเสริมหนักๆ เฉพาะเมื่อจำเป็น ทำให้หน้าเว็บโหลดเร็วขึ้น 40%
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 bg-black/20 p-3 rounded-lg">
                                    <span className="text-green-400 font-bold">✓</span>
                                    <span className="text-sm text-slate-300">
                                        <strong className="text-white block mb-1">Memoized Calculations</strong>
                                        จดจำผลการคำนวณที่ซ้ำซ้อน ลดภาระเครื่องของผู้ใช้งาน
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 bg-black/20 p-3 rounded-lg">
                                    <span className="text-green-400 font-bold">✓</span>
                                    <span className="text-sm text-slate-300">
                                        <strong className="text-white block mb-1">Database Caching</strong>
                                        เก็บประวัติคะแนนลงฐานข้อมูลเพื่อวิเคราะห์ Trend ระยะยาวได้อย่างแม่นยำ
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-600">
                    <p className="mb-2">© 2026 Bonchon-Studio | TH Election AI Watch v3.2</p>
                    <p className="text-xs">
                        พัฒนาด้วย ❤️ เพื่อประชาธิปไตยไทย
                    </p>
                </footer>
            </div>
        </main>
    );
}
