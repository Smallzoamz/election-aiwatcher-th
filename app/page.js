'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw, TrendingUp, TrendingDown, Activity, Radio, AlertCircle, Info, ExternalLink, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

// --- CONFIGURATION ---
const ELECTION_DATE = '2026-02-08T08:00:00'; // Election Date: Feb 8, 2569

// --- COMPONENTS ---

// Custom Axis Tick for Chart
const CustomAxisTick = ({ x, y, payload, data }) => {
    const party = data && data.find(p => p.name === payload.value);
    return (
        <g transform={`translate(${x},${y})`}>
            {party && party.logoUrl ? (
                <>
                    <defs>
                        <clipPath id={`circleView-${party.id}`}>
                            <circle cx="0" cy="20" r="18" />
                        </clipPath>
                    </defs>
                    <circle cx="0" cy="20" r="20" fill="white" stroke={party.color} strokeWidth="2" opacity="0.9" />
                    <image
                        x={-18}
                        y={2}
                        width={36}
                        height={36}
                        href={party.logoUrl}
                        clipPath={`url(#circleView-${party.id})`}
                        preserveAspectRatio="xMidYMid slice"
                    />
                </>
            ) : null}
            <text x={0} y={55} dy={0} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight="500">
                {payload.value.replace('พรรค', '')}
            </text>
        </g>
    );
};

// Countdown Timer Component
const ElectionCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0 });

    useEffect(() => {
        const target = new Date(ELECTION_DATE).getTime();

        const calculateTime = () => {
            const now = new Date().getTime();
            const difference = target - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                // Calculate total hours left for urgent check
                const totalHoursLeft = (days * 24) + hours;

                setTimeLeft({
                    days,
                    hours,
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                    totalHours: totalHoursLeft
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0 });
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    const isUrgent = timeLeft.totalHours < 24;
    const digitColor = isUrgent ? 'text-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]';
    const separatorColor = isUrgent ? 'text-red-600' : 'text-slate-500';
    const boxBorder = isUrgent ? 'border-red-900/50 bg-red-950/30' : 'border-slate-700 bg-slate-800';

    const TimeBox = ({ value, label }) => (
        <div className="flex flex-col items-center mx-1">
            <div className={`${boxBorder} border font-mono text-xl md:text-2xl font-bold px-2 md:px-3 py-1 rounded min-w-[3rem] text-center transition-colors duration-500 ${digitColor}`}>
                {String(value).padStart(2, '0')}
            </div>
            <span className={`text-[10px] mt-1 uppercase tracking-wider font-semibold ${isUrgent ? 'text-red-400' : 'text-slate-400'}`}>{label}</span>
        </div>
    );

    return (
        <div className={`flex items-center gap-2 p-2 rounded-lg border backdrop-blur-sm transition-colors duration-500 ${isUrgent ? 'bg-red-950/20 border-red-900/30' : 'bg-slate-900/50 border-slate-800/50'}`}>
            <div className="text-right mr-2 hidden md:block">
                <div className={`text-xs flex items-center justify-end gap-1 ${isUrgent ? 'text-red-400' : 'text-gray-400'}`}>
                    <Calendar className="w-3 h-3" />
                    8 ก.พ. 2569
                </div>
                <div className={`text-[10px] font-bold uppercase ${isUrgent ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                    {isUrgent ? '⚠️ เข้าสู่ช่วงเลือกตั้ง!' : 'นับถอยหลังสู่วันเลือกตั้ง'}
                </div>
            </div>
            <div className="flex">
                <TimeBox value={timeLeft.days} label="วัน" />
                <span className={`font-bold text-xl mt-1 ${separatorColor}`}>:</span>
                <TimeBox value={timeLeft.hours} label="ชม." />
                <span className={`font-bold text-xl mt-1 ${separatorColor}`}>:</span>
                <TimeBox value={timeLeft.minutes} label="นาที" />
                <span className={`font-bold text-xl mt-1 ${separatorColor}`}>:</span>
                <TimeBox value={timeLeft.seconds} label="วินาที" />
            </div>
        </div>
    );
};

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
            <header className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-4 gap-4">
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

                {/* Countdown Timer */}
                <div className="flex items-center gap-4">
                    <ElectionCountdown />
                    <div className="text-right hidden xl:block">
                        <div className="text-xs text-gray-500 font-mono">สถานะระบบ: ออนไลน์</div>
                        <div className="text-xs text-gray-500 font-mono">เวอร์ชัน: 2.1</div>
                    </div>
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
                        {data?.parties?.slice(0, 5).map((party, idx) => (
                            <div key={party.id} className="relative bg-slate-900/40 border border-slate-800 p-4 rounded-xl backdrop-blur-sm hover:border-slate-600 transition-all group overflow-hidden">

                                {/* Background Watermark Logo */}
                                {party.logoUrl && (
                                    <div className="absolute -right-6 -bottom-10 w-48 h-48 opacity-[0.06] pointer-events-none grayscale group-hover:grayscale-0 group-hover:opacity-[0.08] transition-all duration-500 ease-out z-0">
                                        <img
                                            src={party.logoUrl}
                                            alt=""
                                            className="w-full h-full object-contain transform -rotate-12"
                                        />
                                    </div>
                                )}

                                {/* Background Watermark Text (Party ID) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-black text-white/[0.015] pointer-events-none z-0 whitespace-nowrap font-mono select-none select-none">
                                    {party.id.toUpperCase()}
                                </div>

                                {/* Background Gradient Hint */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-10 -mt-10 pointer-events-none z-0" />

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-start gap-4">
                                        {/* Rank Number */}
                                        <div className="flex flex-col items-center gap-1 mt-1">
                                            <div className="text-2xl font-black text-slate-700 font-mono italic">#{idx + 1}</div>
                                        </div>

                                        {/* Logo Container */}
                                        {party.logoUrl && (
                                            <div className="relative">
                                                <div
                                                    className="w-16 h-16 bg-white rounded-full p-2 shadow-lg flex items-center justify-center shrink-0 border-4 border-slate-800/50"
                                                    style={{ borderColor: `${party.color}30`, boxShadow: `0 0 20px ${party.color}20` }}
                                                >
                                                    <img src={party.logoUrl} alt={party.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                                {/* Status Dot */}
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700">
                                                    {party.trend === 'up'
                                                        ? <TrendingUp className="w-3 h-3 text-green-500" />
                                                        : <TrendingDown className="w-3 h-3 text-red-500" />
                                                    }
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-0.5">
                                            <h3 className="font-bold text-xl text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                                                {party.name}
                                            </h3>

                                            {/* Candidates */}
                                            {party.candidates && (
                                                <div className="text-sm text-slate-400 mt-1 flex flex-wrap gap-x-2">
                                                    <span className="text-slate-500 font-medium">แคนดิเดต:</span>
                                                    <span className="text-slate-300">
                                                        {party.candidates.join(", ")}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                                    <span className="text-slate-500 text-xs">ส.ส. คาดการณ์</span>
                                                    <span className="text-white font-mono font-bold">{party.projectedSeats ?? Math.round((party.score ?? party.baseScore) / 100 * 500)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                                    <span className="text-slate-500 text-xs">คะแนนเสียง</span>
                                                    <span className="text-white font-mono font-bold">{party.projectedVotes ?? Math.floor((party.score ?? party.baseScore) / 100 * 39000000).toLocaleString('th-TH')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Score Big Display */}
                                    <div className="text-right">
                                        <div className="text-4xl font-black tracking-tighter" style={{ color: party.color, textShadow: `0 0 30px ${party.color}40` }}>
                                            {(party.score ?? party.baseScore).toFixed(1)}<span className="text-lg align-top opacity-50">%</span>
                                        </div>
                                        {/* Delta pill */}
                                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${party.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {party.trend === 'up' ? '▲' : '▼'} {party.delta}%
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar Bottom */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800/50">
                                    <div
                                        className="h-full transition-all duration-1000 ease-out"
                                        style={{ width: `${party.score}%`, backgroundColor: party.color, boxShadow: `0 0 10px ${party.color}` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Visualization & News */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Main Chart */}
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur h-96 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Activity className="w-24 h-24 text-slate-500" />
                        </div>
                        <h3 className="text-slate-400 mb-6 text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                            การกระจายความนิยม (Top 5)
                        </h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={data?.parties?.slice(0, 5) || []} margin={{ bottom: 30, top: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#cbd5e1"
                                    fontSize={12}
                                    interval={0}
                                    tick={<CustomAxisTick data={data?.parties} />}
                                    height={70}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis stroke="#666" domain={[0, 50]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value, name) => [`${value.toFixed(1)}%`, 'คะแนน']}
                                />
                                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                    {data?.parties?.slice(0, 5).map((entry, index) => (
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
                            {history.length === 0 && !data?.recentNews && (
                                <div className="text-gray-500 text-center py-8">
                                    กำลังรอข่าวใหม่...
                                </div>
                            )}
                            {/* Show recent news when no new analyzed news */}
                            {history.length === 0 && data?.recentNews?.length > 0 && (
                                <>
                                    <div className="text-yellow-500/70 text-xs mb-2">📢 ข่าวการเมืองล่าสุด (24 ชม.):</div>
                                    {data.recentNews.map((news, i) => (
                                        <div key={i} className="border-l-2 border-yellow-600/50 pl-2 pb-2 border-b border-yellow-900/20">
                                            <div className="flex justify-between items-start text-xs">
                                                <span className="text-purple-400">[{news.source}]</span>
                                                {news.pubDate && (
                                                    <span className="text-gray-500">
                                                        📅 {new Date(news.pubDate).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1">
                                                <span className="text-yellow-400">› </span>
                                                <a href={news.link} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-300 hover:underline">
                                                    {news.headline}
                                                </a>
                                            </div>
                                            <span className={`text-xs px-1 rounded ${news.sentiment === 'pos' ? 'bg-green-900/50 text-green-400' : news.sentiment === 'neg' ? 'bg-red-900/50 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                                                {news.sentiment === 'pos' ? '👍 เชิงบวก' : news.sentiment === 'neg' ? '👎 เชิงลบ' : '— เป็นกลาง'}
                                            </span>
                                        </div>
                                    ))}
                                </>
                            )}
                            {history.slice(-7).reverse().map((tick, i) => (
                                <div key={i} className="border-l-2 border-green-500 pl-2 animate-in slide-in-from-left duration-300 pb-2 border-b border-green-900/20 last:border-0">
                                    <div className="flex justify-between items-start">
                                        <span className="text-white text-xs opacity-50">[{new Date(tick.timestamp).toLocaleTimeString()}]</span>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-purple-400">[{tick.analyzedNews?.source}]</span>
                                            {tick.analyzedNews?.pubDate && (
                                                <span className="text-gray-500">
                                                    📅 {new Date(tick.analyzedNews.pubDate).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
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
                                    {/* Context Deep Dive */}
                                    {tick.analyzedNews?.primaryContext && (
                                        <div className="mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${tick.analyzedNews.sentiment === 'neg'
                                                ? 'bg-red-900/50 border border-red-700/50 text-red-300'
                                                : tick.analyzedNews.sentiment === 'pos'
                                                    ? 'bg-green-900/50 border border-green-700/50 text-green-300'
                                                    : 'bg-slate-800 border border-slate-600 text-gray-300'
                                                }`}>
                                                {tick.analyzedNews.sentiment === 'neg' ? '⚠️ สาเหตุ: ' : '✨ เหตุผล: '}
                                                <span className="font-bold">{tick.analyzedNews.primaryContext.label}</span>
                                            </span>
                                        </div>
                                    )}
                                    {/* Show matched keywords */}
                                    {tick.analyzedNews?.keywords?.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {tick.analyzedNews.keywords.slice(0, 5).map((kw, ki) => (
                                                <span
                                                    key={ki}
                                                    className={`text-xs px-1 rounded ${kw.type === 'pos' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}
                                                    title={`Context: ${kw.context}`}
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
