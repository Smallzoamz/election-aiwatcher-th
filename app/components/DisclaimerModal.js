'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle, Info, ExternalLink } from 'lucide-react';

export default function DisclaimerModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has accepted disclaimer before
        const hasAccepted = localStorage.getItem('pole_disclaimer_accepted');
        if (!hasAccepted) {
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('pole_disclaimer_accepted', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 rounded-t-2xl flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-white" />
                    <h2 className="text-xl font-bold text-white">ข้อจำกัดความรับผิดชอบ</h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Disclaimer Box */}
                    <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4">
                        <p className="text-amber-200 text-sm leading-relaxed">
                            <strong>⚠️ โปรดทราบ:</strong> ข้อมูลที่แสดงบนเว็บไซต์นี้เป็นเพียง<strong>การประมาณการ</strong>จากการวิเคราะห์ข่าวสารด้วย AI เท่านั้น
                        </p>
                        <ul className="text-amber-200/80 text-sm mt-3 space-y-1 list-disc list-inside">
                            <li>ไม่ใช่การทำนายผลเลือกตั้งจริง</li>
                            <li>ไม่ได้รับรองโดยองค์กรสำรวจความคิดเห็นใดๆ</li>
                            <li>ไม่ควรใช้เป็นข้อมูลอ้างอิงในการตัดสินใจ</li>
                        </ul>
                    </div>

                    {/* Developer Message */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-cyan-400 font-bold mb-2">จากผู้พัฒนา</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    สวัสดีค่ะ! 👋 เว็บไซต์นี้จัดทำขึ้นเพื่อ<strong>สาธิตเทคโนโลยี AI</strong>ในการวิเคราะห์ข่าวสารการเมืองไทย
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    ระบบทำงานโดยการดึงข่าวจากสื่อออนไลน์ 7 แหล่ง แล้วใช้ Sentiment Analysis
                                    วิเคราะห์ว่าข่าวเป็นเชิงบวกหรือเชิงลบต่อพรรคการเมืองใด
                                </p>
                                <p className="text-gray-500 text-xs mt-3">
                                    — พัฒนาโดย Bonchon-Studio 🍗
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Methodology Link */}
                    <a
                        href="/methodology"
                        className="flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        ดูวิธีการคำนวณโดยละเอียด
                    </a>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
                    <button
                        onClick={handleAccept}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        เข้าใจแล้ว ดำเนินการต่อ
                    </button>
                    <p className="text-gray-600 text-xs text-center mt-2">
                        คุณจะไม่เห็นข้อความนี้อีกในครั้งถัดไป
                    </p>
                </div>
            </div>
        </div>
    );
}
