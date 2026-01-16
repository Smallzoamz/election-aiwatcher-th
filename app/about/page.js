import Link from 'next/link';
import { Info, ChevronLeft, Github, Globe, Mail } from 'lucide-react';

export const metadata = {
    title: 'About Us | เกี่ยวกับเรา',
    description: 'ทำความรู้จักกับโครงการ TH Election AI Watch และทีมงาน Bonchon-Studio',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 lg:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    หน้าหลัก
                </Link>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Info className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">เกี่ยวกับโครงการ</h1>
                    </div>

                    <div className="space-y-12 text-slate-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-cyan-500 rounded-full"></span>
                                วิสัยทัศน์ของเรา
                            </h2>
                            <p className="text-lg">
                                **TH Election AI Watch** ถูกสร้างขึ้นเพื่อเป็นโมเดลต้นแบบในการใช้ AI ประมวลผลข้อมูลข่าวสารทางการเมืองที่มีปริมาณมหาศาล เพื่อสรุปออกมาเป็น "ดัชนีความนิยม" ที่เข้าใจง่าย เราต้องการส่งเสริมความโปร่งใสของข้อมูลและการใช้บทวิเคราะห์ที่เป็นกลางจากเครื่องจักร (Algorithm-based Analysis)
                            </p>
                        </section>

                        <section className="grid md:grid-cols-2 gap-8">
                            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                                <h3 className="text-xl font-bold text-cyan-400 mb-4">🤖 AI Analytics</h3>
                                <p className="text-sm">
                                    เราใช้โมเดลภาษาขนาดใหญ่ (LLM) ในการวิเคราะห์อารมณ์ข่าวจาก RSS Feeds ตลอด 24 ชั่วโมง เพื่อตรวจจับความเคลื่อนไหวที่รวดเร็วของสนามเลือกตั้ง
                                </p>
                            </div>
                            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                                <h3 className="text-xl font-bold text-cyan-400 mb-4">📊 Data Democracy</h3>
                                <p className="text-sm">
                                    การเปิดเผยวิธีการคำนวณ (Methodology) อย่างละเอียด เพื่อให้ประชาชนสามารถวิพากษ์วิจารณ์และตรวจสอบความเป็นกลางของระบบได้
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
                                พัฒนาโดย Bonchon-Studio
                            </h2>
                            <p>
                                **Bonchon-Studio** เป็นสตูดิโอพัฒนาเทคโนโลยีขนาดเล็กที่หลงใหลในการสร้างสรรค์ผลงานเพื่อสังคม เรามุ่งเน้นการใช้ Open Data และ AI เพื่อสร้าง Solution ที่มีประโยชน์ต่อการรับรู้ข้อมูลข่าวสาร
                            </p>

                            <div className="flex flex-wrap gap-4 mt-8">
                                <a href="#" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700">
                                    <Github className="w-5 h-5" />
                                    GitHub Project
                                </a>
                                <a href="#" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700">
                                    <Globe className="w-5 h-5" />
                                    Official Web
                                </a>
                                <a href="#" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700">
                                    <Mail className="w-5 h-5" />
                                    Contact Us
                                </a>
                            </div>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 text-center">
                        © 2026 Bonchon-Studio | มุ่งมั่นสร้างสรรค์เพื่ออนาคตประเทศไทย
                    </div>
                </div>
            </div>
        </div>
    );
}
