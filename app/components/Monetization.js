'use client';

import { DollarSign, Zap, ShieldCheck, Mail, Globe, MapPin, ExternalLink } from 'lucide-react';

export default function Monetization() {
    return (
        <div className="space-y-4">
            {/* Support / Donation Box */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <DollarSign className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-white">สนับสนุนเซิร์ฟเวอร์ AI</div>
                        <div className="text-[10px] text-slate-500">ช่วยให้ระบบทำงานได้ 24 ชม.</div>
                    </div>
                </div>
                <button className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 border border-amber-500/30 rounded-lg text-[11px] font-bold transition-all">
                    Support
                </button>
            </div>

            {/* Sponsor / Ad Placeholder */}
            <div className="bg-black/40 border border-dashed border-slate-700 rounded-xl p-8 text-center relative group cursor-pointer hover:border-slate-500 transition-all">
                <div className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-1">Sponsored Section</div>
                <div className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">ติดต่อลงโฆษณา / สนับสนุนโครงการ</div>
                <div className="absolute top-1 right-1">
                    <ExternalLink className="w-3 h-3 text-slate-700" />
                </div>
            </div>

            {/* GEO Status Radar (Visual SEO/GEO Signal) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        <Globe className="w-3 h-3 text-cyan-500" />
                        GEO Intelligence Status
                    </div>
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800 flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span className="text-[10px] text-slate-300">Bangkok Loop</span>
                    </div>
                    <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800 flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-orange-500" />
                        <span className="text-[10px] text-slate-300">Isaan Node</span>
                    </div>
                    <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800 flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        <span className="text-[10px] text-slate-300">South Network</span>
                    </div>
                    <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800 flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-pink-500" />
                        <span className="text-[10px] text-slate-300">North Cluster</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
