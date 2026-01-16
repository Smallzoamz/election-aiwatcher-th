import Link from 'next/link';
import { FileText, ChevronLeft, AlertTriangle } from 'lucide-react';

export const metadata = {
    title: 'Terms of Service | ข้อตกลงการใช้งาน',
    description: 'ข้อตกลงและเงื่อนไขการใช้งานเว็บไซต์ TH Election AI Watch',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 lg:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    หน้าหลัก
                </Link>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <FileText className="w-8 h-8 text-amber-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Terms of Service</h1>
                    </div>

                    <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-5 mb-10 flex gap-4 items-start">
                        <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                        <p className="text-sm text-amber-200/80">
                            <strong>คำเตือนที่สำคัญ:</strong> ข้อมูลทั้งหมดที่แสดงในเว็บไซต์นี้เป็นข้อมูลที่ได้จากการคำนวณและคาดการณ์ด้วยระบบ AI เพื่อวัตถุประสงค์ในการวิจัยและทดสอบระบบเทคโนโลยีเท่านั้น ไม่ใช่ผลการเลือกตั้งจริง และไม่ควรใช้เป็นข้อมูลอ้างอิงในการตัดสินใจทางการเมืองใดๆ
                        </p>
                    </div>

                    <div className="space-y-8 text-slate-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">1. ขอบเขตการให้บริการ (Scope)</h2>
                            <p>TH Election AI Watch เป็นเครื่องมือวิเคราะห์อารมณ์สังคม (Sentiment Analysis) และดัชนีความนิยมของพรรคการเมืองไทย โดยใช้ชุดข้อมูลจากสำนักข่าวและแหล่งข้อมูลสาธารณะ โดยมีสูตรการให้น้ำหนักคะแนนแปรผันตามประเภทของสำนักข่าวและพื้นที่ภูมิภาค</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">2. ข้อจำกัดความรับผิดชอบ (Disclaimer)</h2>
                            <p>ผู้พัฒนาไม่รับประกันความถูกต้องแม่นยำของข้อมูล 100% เนื่องจากเป็นข้อมูลจำลองจาก AI ข้อมูลอาจมีการเปลี่ยนแปลงหรือคลาดเคลื่อนตามชุดข้อมูลที่ได้รับมาในแต่ละช่วงเวลา ผู้ใช้งานยอมรับความเสี่ยงในการนำข้อมูลไปใช้ประโยชน์ด้วยตนเอง</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">3. การคุ้มครองทรัพย์สินทางปัญญา</h2>
                            <p>โลโก้พรรคการเมืองและเนื้อหาข่าวสารเป็นทรัพย์สินทางปัญญาของพรรคการเมืองและสำนักข่าวที่เป็นเจ้าของ เว็บไซต์นี้อ้างอิงเพื่อวัตถุประสงค์ในการให้ข้อมูลและการวิเคราะห์เท่านั้น โดยมีการระบุแหล่งที่มา (Source Attribution) อย่างชัดเจน</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">4. การปรับปรุงเงื่อนไข</h2>
                            <p>ผู้พัฒนาขอสงวนสิทธิ์ในการเปลี่ยนแปลง แก้ไข หรือปรับปรุงข้อตกลงการใช้งานโดยไม่ต้องแจ้งให้ทราบล่วงหน้า เพื่อให้สอดคล้องกับสถานการณ์และการอัปเดตระบบของ AI</p>
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
