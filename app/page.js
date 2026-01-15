'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw, TrendingUp, TrendingDown, Activity, Radio, AlertCircle, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    const [data, setData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/data');

            if (!res.ok) {
                if (res.status === 429) {
                    throw new Error('คำขอมากเกินไป กรุณารอสักครู่');
                }
                throw new Error(`HTTP Error: ${res.status}`);
            }

            const json = await res.json();

            setData(json);
            setError(null);

            setHistory(prev => {
                if (!json.analyzedNews) return prev;

                const updated = prev.length >= 20
                    ? [...prev.slice(1), json]
                    : [...prev, json];
                return updated;
            });

            setLoading(false);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [fetchData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-green-500 flex items-center justify-center font-mono">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>กำลังเริ่มต้นระบบ AI...</p>
                </div>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
                <div className="bg-slate-900/80 border border-red-500/50 rounded-lg p-8 max-w-md text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">ไม่สามารถโหลดข้อมูลได้</h2>
                    <p className="text-gray-400 mb-4">{error}</p>
                    <button
                        onClick={() => { setLoading(true); setError(null); fetchData(); }}
                        className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        ลองใหม่
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6 relative overflow-hidden">
            {/* Background Cyber Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

            {/* Error Banner */}
            {error && (
                <div className="relative z-30 bg-red-900/50 border border-red-500 rounded-lg p-3 mb-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-200">{error}</p>
                </div>
            )}

            {/* Header */}
            <header className="relative z-20 flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                        TH ELECTION <span className="text-white">AI WATCH</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                            วิเคราะห์อารมณ์สังคม (จำนวน: {data?.sampleSize || 0})
                        </p>
                        {data?.feedStatus && (
                            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded border border-green-700">
                                {data.feedStatus.activeFeeds}/{data.feedStatus.totalFeeds} แหล่งข่าว
                            </span>
                        )}
                        <Link
                            href="/methodology"
                            className="text-xs bg-slate-800 text-gray-400 hover:text-white px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1 transition-colors"
                        >
                            <Info className="w-3 h-3" />
                            วิธีการคำนวณ
                        </Link>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 font-mono">สถานะระบบ: ออนไลน์</div>
                    <div className="text-xs text-gray-500 font-mono">เวอร์ชัน: 2.0</div>
                </div>
            </header>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Rankings */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
                        <Activity className="w-5 h-5" />
                        ดัชนีความนิยมปัจจุบัน
                    </h2>

                    <div className="space-y-3">
                        {data?.parties?.map((party, idx) => (
                            <div key={party.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg backdrop-blur hover:border-cyan-500/50 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl font-bold text-gray-600 font-mono">#{idx + 1}</div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-cyan-400 transition-colors">{party.name}</h3>
                                            <div className="text-xs text-gray-400 mt-1 space-y-0.5">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-500">ส.ส. (คาดการณ์):</span>
                                                    <span className="text-white font-mono">{party.projectedSeats ?? Math.round((party.score ?? party.baseScore) / 100 * 500)}</span>
                                                    <span>ที่นั่ง</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-500">คะแนนเสียง (คาดการณ์):</span>
                                                    <span className="text-white font-mono">{party.projectedVotes ?? Math.floor((party.score ?? party.baseScore) / 100 * 39000000).toLocaleString('th-TH')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono font-bold" style={{ color: party.color }}>
                                            {(party.score ?? party.baseScore).toFixed(1)}%
                                        </div>
                                        {/* Confidence Interval */}
                                        {party.confidenceInterval && (
                                            <div className="text-xs text-gray-500 font-mono">
                                                ±{party.confidenceInterval.margin}%
                                            </div>
                                        )}
                                        <div className={`text-xs flex items-center justify-end gap-1 ${party.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                            {party.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {party.delta}%
                                        </div>
                                    </div>
                                </div>
                                {/* Confidence Bar */}
                                {party.confidenceInterval && (
                                    <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${party.score}%`,
                                                backgroundColor: party.color,
                                                opacity: 0.8
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Visualization & News */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Main Chart */}
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg backdrop-blur h-80">
                        <h3 className="text-gray-400 mb-4 text-sm font-mono uppercase">การกระจายความนิยม</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.parties || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                                <YAxis stroke="#666" domain={[0, 50]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value, name) => [`${value.toFixed(1)}%`, 'คะแนน']}
                                />
                                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                    {data?.parties?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* AI Console / News Ticker */}
                    <div className="bg-black border border-green-900/50 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto relative custom-scrollbar">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-pulse sticky z-10" />
                        <h3 className="text-green-500 mb-2 flex items-center gap-2 sticky top-0 bg-black/90 pb-2 z-10 border-b border-green-900/50 w-full">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            กระแสข้อมูล AI (7 เหตุการณ์ล่าสุด)
                        </h3>
                        <div className="space-y-3 text-green-300/80 mt-2">
                            {history.length === 0 && (
                                <div className="text-gray-500 text-center py-8">
                                    กำลังรอข่าวใหม่...
                                </div>
                            )}
                            {history.slice(-7).reverse().map((tick, i) => (
                                <div key={i} className="border-l-2 border-green-500 pl-2 animate-in slide-in-from-left duration-300 pb-2 border-b border-green-900/20 last:border-0">
                                    <div className="flex justify-between items-start">
                                        <span className="text-white text-xs opacity-50">[{new Date(tick.timestamp).toLocaleTimeString()}]</span>
                                        <span className="text-purple-400 text-xs">[{tick.analyzedNews?.source}]</span>
                                    </div>
                                    <div className="mt-1">
                                        <span className="text-cyan-400 font-bold">&gt; </span>
                                        <a href={tick.analyzedNews?.link} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 hover:underline transition-colors">
                                            {tick.analyzedNews?.headline}
                                        </a>
                                    </div>
                                    <div className="mt-1 text-xs flex flex-wrap gap-2 items-center">
                                        <span className="bg-slate-800 text-gray-400 px-1 rounded border border-slate-700" title="AI Confidence Score">
                                            ความมั่นใจ: {tick.analyzedNews?.confidence}%
                                        </span>
                                        <span className="text-gray-500">วิเคราะห์: </span>
                                        <span className={`font-bold ${tick.analyzedNews?.sentiment === 'pos' ? 'text-green-400' : tick.analyzedNews?.sentiment === 'neg' ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {tick.analyzedNews?.sentiment === 'pos' ? 'เชิงบวก' : tick.analyzedNews?.sentiment === 'neg' ? 'เชิงลบ' : 'เป็นกลาง'}
                                        </span>
                                        <span className="text-gray-600"> | ผลกระทบ: {tick.analyzedNews?.target} ({tick.analyzedNews?.impact > 0 ? '+' : ''}{tick.analyzedNews?.impact}%)</span>
                                    </div>
                                    {/* Show matched keywords */}
                                    {tick.analyzedNews?.keywords?.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {tick.analyzedNews.keywords.slice(0, 3).map((kw, ki) => (
                                                <span
                                                    key={ki}
                                                    className={`text-xs px-1 rounded ${kw.type === 'pos' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}
                                                >
                                                    {kw.word}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Disclaimer Footer */}
            <footer className="relative z-10 mt-8 pt-4 border-t border-gray-800">
                <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-3 mb-4">
                    <p className="text-amber-200/80 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                            <strong>ข้อจำกัดความรับผิดชอบ:</strong> ผลลัพธ์ที่แสดงเป็นการ<strong>ประมาณการ</strong>จากการวิเคราะห์ข่าวสารเท่านั้น
                            ไม่ใช่การทำนายผลเลือกตั้งจริง และไม่ได้รับรองโดยองค์กรใดๆ
                            กรุณาใช้วิจารณญาณในการตีความข้อมูล
                        </span>
                    </p>
                </div>
                <div className="text-center text-xs text-gray-600 flex items-center justify-center gap-4">
                    <span>© 2026 Bonchon-Studio</span>
                    <Link href="/methodology" className="text-cyan-600 hover:text-cyan-400 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        วิธีการคำนวณ
                    </Link>
                </div>
            </footer>
        </main>
    );
}
