import Link from 'next/link';

export const metadata = {
    title: 'วิธีการคำนวณ | TH Election AI Watch',
    description: 'อธิบายวิธีการคำนวณดัชนีความนิยมพรรคการเมืองด้วยระบบ AI',
};

export default function MethodologyPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-8 border-b border-gray-800 pb-4">
                    <Link
                        href="/"
                        className="text-cyan-400 hover:text-cyan-300 text-sm mb-2 inline-block"
                    >
                        ← กลับหน้าหลัก
                    </Link>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                        วิธีการคำนวณ
                    </h1>
                    <p className="text-gray-400 mt-2">
                        อธิบายระเบียบวิธีการวิเคราะห์และประมาณการความนิยมพรรคการเมือง
                    </p>
                </header>

                {/* Disclaimer */}
                <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 mb-8">
                    <h3 className="text-amber-200 font-bold mb-2">⚠️ ข้อจำกัดความรับผิดชอบ</h3>
                    <p className="text-amber-200/80 text-sm">
                        ระบบนี้เป็นการ<strong>สาธิตเทคโนโลยี</strong>เท่านั้น ผลลัพธ์ไม่ใช่การทำนายผลเลือกตั้งจริง
                        และไม่ได้รับรองโดยองค์กรสำรวจความคิดเห็นหรือหน่วยงานใดๆ
                    </p>
                </div>

                {/* Methodology Sections */}
                <div className="space-y-8">

                    {/* Data Sources */}
                    <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-cyan-400 mb-4">📡 แหล่งข้อมูล</h2>
                        <p className="text-gray-300 mb-4">
                            ระบบดึงข้อมูลจากหลายแพลตฟอร์มแบบ Real-time:
                        </p>

                        {/* RSS Feeds */}
                        <h3 className="text-white font-medium mb-2 mt-4">📰 RSS Feeds (สื่อข่าว)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            {[
                                { name: 'มติชนออนไลน์ (การเมือง)', weight: '1.0x' },
                                { name: 'ประชาชาติธุรกิจ (การเมือง)', weight: '1.0x' },
                                { name: 'ผู้จัดการออนไลน์ (การเมือง)', weight: '1.2x' },
                                { name: 'มติชน (ทั่วไป)', weight: '0.8x' },
                                { name: 'ประชาชาติ (ทั่วไป)', weight: '0.8x' },
                            ].map((source, i) => (
                                <div key={i} className="bg-slate-800/50 p-3 rounded border border-slate-700">
                                    <div className="font-medium">{source.name}</div>
                                    <div className="text-xs text-gray-500">น้ำหนัก: {source.weight}</div>
                                </div>
                            ))}
                        </div>

                        {/* Social Media */}
                        <h3 className="text-white font-medium mb-2 mt-6">💬 Social Media</h3>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-orange-900/30 p-3 rounded border border-orange-700/50">
                                <div className="font-medium text-orange-300">🌐 Pantip</div>
                                <div className="text-xs text-gray-400">
                                    ห้อง: สินธร, ราชดำเนิน, เฉลิมไทย
                                </div>
                                <div className="text-xs text-gray-500">น้ำหนัก: 1.5x</div>
                            </div>
                            <div className="bg-red-900/30 p-3 rounded border border-red-700/50">
                                <div className="font-medium text-red-300">▶️ YouTube</div>
                                <div className="text-xs text-gray-400">
                                    ช่อง: Thai PBS, PPTV, ไทยรัฐ, ช่อง 3
                                </div>
                                <div className="text-xs text-gray-500">น้ำหนัก: 1.3x</div>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm mt-4">
                            * น้ำหนักที่สูงกว่าหมายถึงแหล่งข่าวที่มีผลกระทบต่อผลลัพธ์มากกว่า
                        </p>
                    </section>

                    {/* Sentiment Analysis */}
                    <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-cyan-400 mb-4">🧠 การวิเคราะห์อารมณ์ (Sentiment Analysis)</h2>
                        <p className="text-gray-300 mb-4">
                            ระบบใช้ Keyword-based Sentiment Analysis ที่มีน้ำหนัก (Weighted) เพื่อประเมินว่าข่าวเป็นเชิงบวก เชิงลบ หรือเป็นกลาง
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-green-900/20 border border-green-700/50 rounded p-4">
                                <h4 className="text-green-400 font-bold mb-2">คำเชิงบวก</h4>
                                <p className="text-gray-400 text-sm">
                                    สำเร็จ, ชนะ, หนุน, เห็นชอบ, ชื่นชม, ก้าวหน้า, แก้ปัญหา, พัฒนา, สนับสนุน...
                                </p>
                            </div>
                            <div className="bg-red-900/20 border border-red-700/50 rounded p-4">
                                <h4 className="text-red-400 font-bold mb-2">คำเชิงลบ</h4>
                                <p className="text-gray-400 text-sm">
                                    ทุจริต, โกง, จับกุม, ค้าน, วิจารณ์, ขัดแย้ง, ประท้วง, ฉาว, โจมตี...
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm">
                            แต่ละคำมีน้ำหนักแตกต่างกัน เช่น "ทุจริต" (2.5x) มีผลกระทบมากกว่า "ค้าน" (1.5x)
                        </p>
                    </section>

                    {/* Score Calculation */}
                    <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-cyan-400 mb-4">📊 การคำนวณคะแนน</h2>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-white font-medium mb-2">1. คะแนนฐาน (Base Score)</h4>
                                <p className="text-gray-400 text-sm">
                                    แต่ละพรรคมีคะแนนฐานเริ่มต้นจากการประมาณการทั่วไป
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">2. ผลกระทบจากข่าว (News Impact)</h4>
                                <p className="text-gray-400 text-sm">
                                    เมื่อมีข่าวเกี่ยวข้องกับพรรคใด คะแนนจะถูกปรับตามอารมณ์ของข่าว
                                    <br />• ข่าวเชิงบวก: +0.5 ถึง +1.5%
                                    <br />• ข่าวเชิงลบ: -0.5 ถึง -1.5%
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">3. Pro-Level Hybrid Calculation (สูตรคำนวณขั้นสูง)</h4>
                                <p className="text-gray-400 text-sm mb-2">
                                    ระบบแยกการคำนวณตามประเภทบัญชีรายชื่อและเขต เพื่อสะท้อนพฤติกรรมการเลือกตั้งจริง:
                                </p>
                                <ul className="text-gray-400 text-sm list-disc list-inside ml-2">
                                    <li>
                                        <strong className="text-cyan-400">ส.ส. บัญชีรายชื่อ (100 ที่นั่ง):</strong> เน้นกระแสพรรค (AI 60% / Poll 40%)
                                    </li>
                                    <li>
                                        <strong className="text-yellow-400">ส.ส. เขต (400 ที่นั่ง):</strong> เน้นตัวบุคคลและความผูกพันพื้นที่ (AI 30% / Poll 70%)
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">4. ฟีเจอร์พิเศษ (Special Insights)</h4>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-lg">📉</span>
                                        <span className="text-gray-400">
                                            <strong className="text-white">Volatility Index:</strong> ตีความกลุ่ม "Neutral News" เป็น "กลุ่มพลังเงียบ/ยังไม่ตัดสินใจ" (Undecided Voter Proxy)
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-lg">🐎</span>
                                        <span className="text-gray-400">
                                            <strong className="text-blue-400">Dark Horse Alert:</strong> ระบบเฝ้าระวังพรรคม้ามืดที่คะแนน AI สูงกว่าโพลอย่างมีนัยสำคัญ (Hidden Momentum)
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Confidence Interval */}
                    <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-cyan-400 mb-4">📏 ช่วงความเชื่อมั่น (Confidence Interval)</h2>
                        <p className="text-gray-300 mb-4">
                            ค่า ±X% ที่แสดงข้างคะแนนแต่ละพรรคหมายถึงช่วงความไม่แน่นอนของการประมาณการ
                        </p>
                        <div className="bg-slate-800/50 p-4 rounded font-mono text-sm">
                            <p className="text-gray-400">สูตรการคำนวณ:</p>
                            <p className="text-cyan-300 mt-2">Margin = 5.0 × √(50 / sampleSize)</p>
                        </div>
                        <p className="text-gray-500 text-sm mt-4">
                            ยิ่งมีข่าวที่วิเคราะห์มากขึ้น ช่วงความเชื่อมั่นจะแคบลง (แม่นยำขึ้น)
                        </p>
                    </section>

                    {/* Limitations */}
                    <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-cyan-400 mb-4">⚠️ ข้อจำกัด</h2>
                        <ul className="text-gray-400 space-y-2 list-disc list-inside">
                            <li>ใช้ Keyword Matching อย่างง่าย ไม่ใช่ Machine Learning ขั้นสูง</li>
                            <li>ไม่ได้พิจารณาบริบทของข่าว (Context) อย่างลึกซึ้ง</li>
                            <li>บาง RSS feeds อาจมี CORS restrictions ทำให้ดึงข้อมูลไม่ได้</li>
                            <li>Pantip ใช้ unofficial API ซึ่งอาจไม่เสถียร</li>
                            <li>YouTube ต้องมี API Key จึงจะทำงานได้ (free tier มี quota จำกัด)</li>
                        </ul>
                    </section>

                </div>

                {/* Footer */}
                <footer className="mt-8 pt-4 border-t border-gray-800 text-center text-gray-600 text-sm">
                    <p>© 2026 Bonchon-Studio | TH Election AI Watch</p>
                    <p className="mt-1">
                        <Link href="/" className="text-cyan-600 hover:text-cyan-400">
                            กลับหน้าหลัก
                        </Link>
                    </p>
                </footer>
            </div>
        </main>
    );
}
