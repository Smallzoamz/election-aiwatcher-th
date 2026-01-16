import Link from 'next/link';
import { Shield, ChevronLeft } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy | นโยบายความเป็นส่วนตัว',
    description: 'นโยบายความเป็นส่วนตัวและการจัดการข้อมูลของ TH Election AI Watch',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 lg:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    หน้าหลัก
                </Link>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                            <Shield className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Privacy Policy</h1>
                    </div>

                    <div className="space-y-8 text-slate-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">1. ข้อมูลที่เราเก็บรวบรวม (Data Collection)</h2>
                            <p>เว็บไซต์ TH Election AI Watch เป็นแพลตฟอร์มสำหรับการวิเคราะห์ข้อมูลเพื่อการวิจัย เรามีการเก็บข้อมูลเบื้องต้นดังนี้:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                <li><strong>คุกกี้ (Cookies):</strong> เราใช้คุกกี้เพื่อจำสถานะการตั้งค่าของผู้ใช้ เช่น โหมดสี (Dark/Light mode) และการยอมรับข้อตกลงเบื้องต้นเท่านั้น</li>
                                <li><strong>ข้อมูลทางเทคนิค:</strong> อาจมีการเก็บ Log ของการเข้าถึง (IP Address) โดยระบบของผู้ให้บริการโฮสติ้ง (Vercel) เพื่อความปลอดภัย</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">2. การใช้ข้อมูล (How we use data)</h2>
                            <p>ข้อมูลที่เราวิเคราะห์และแสดงผลมาจากแหล่งข้อมูลสาธารณะ (Public Data Sources) ทั้งหมด เช่น RSS Feed ข่าวสาร, ผลโพล และดัชนีการค้นหา โดย AI จะทำการประมวลผลเพื่อสร้าง "คะแนนความนิยมสมมติ" และไม่มีการเก็บข้อมูลส่วนบุคคลระบุตัวตนจริงของประชาชน</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">3. แหล่งข้อมูลภายนอก (Third-party Data)</h2>
                            <p>เว็บไซต์มีการอ้างอิงและดึงข้อมูลจากแหล่งภายนอก ได้แก่:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4 text-sm">
                                <li>สำนักข่าวหลัก: มติชน, ประชาชาติธุรกิจ, ข่าวสด, ประชาไท, THE STANDARD ฯลฯ</li>
                                <li>แหล่งโพล: NIDA Poll (ผ่านการดึงข้อมูลจาก Public API/JSON)</li>
                                <li>สถิติการค้นหา: Google Trends และ Wikipedia Pageviews</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">4. การรักษาความปลอดภัย (Security)</h2>
                            <p>เราให้ความสำคัญกับการรักษาความปลอดภัยของระบบ และมีการตรวจสอบความปลอดภัยอย่างสม่ำเสมอเพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">5. การติดต่อเรา (Contact Us)</h2>
                            <p>หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อทีมพัฒนา "Bonchon-Studio" ได้ทาง GitHub หรือช่องทางการติดต่ออย่างเป็นทางการของสตูดิโอ</p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 text-center">
                        © 2026 Bonchon-Studio | อัปเดตล่าสุด: 16 มกราคม 2569
                    </div>
                </div>
            </div>
        </div>
    );
}
