'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw, TrendingUp, TrendingDown, Activity, Radio, AlertCircle, Info, ExternalLink, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import ShareButton from './components/ShareButton';
import ThemeToggle from './components/ThemeToggle';
import { CandidateLink } from './components/CandidateModal';

// Lazy load heavy components
const PartyDetailModal = dynamic(() => import('./components/PartyDetailModal'), {
    ssr: false,
    loading: () => null
});

// --- CONFIGURATION ---
const ELECTION_DATE = '2026-02-08T08:00:00'; // Election Date: Feb 8, 2569

// Announcement Messages
const ANNOUNCEMENTS = [
    "📢 คำเตือน: ข้อมูลนี้เป็นการประมาณการโดย AI เพื่อการวิจัยเท่านั้น ไม่ใช่ผลการเลือกตั้งจริง",
    "👨‍💻 พัฒนาโดยทีมงาน Bonchon-Studio เพื่อส่งเสริมการเข้าถึงข้อมูล",
    "🗳️ ขอเชิญชวนประชาชนชาวไทยไปใช้สิทธิเลือกตั้ง และ ทำประชามติเพื่ออนาคตของประเทศ"
];

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

// Announcement Switcher Component
const AnnouncementSwitcher = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        }, 5000); // Switch every 5 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex-grow max-w-4xl h-9 overflow-hidden bg-amber-950/20 border border-amber-900/30 rounded-lg flex items-center mx-4 relative group">
            <div className="relative w-full h-full flex items-center justify-center px-4">
                {ANNOUNCEMENTS.map((text, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out px-10 text-center
                            ${i === index
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4 pointer-events-none'
                            }`}
                    >
                        <span className="text-[11px] md:text-xs text-amber-500/90 font-bold uppercase tracking-wider leading-relaxed">
                            {text}
                        </span>
                    </div>
                ))}
            </div>
            {/* Visual Accents */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/20" />
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-500/20" />
        </div>
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
    const [selectedParty, setSelectedParty] = useState(null);

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
        let interval = null;

        const startPolling = () => {
            fetchData();
            interval = setInterval(fetchData, 3000);
        };

        const stopPolling = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        // Visibility API - pause polling when tab is not visible
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPolling();
            } else {
                startPolling();
            }
        };

        // Initial start
        startPolling();
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchData]);

    // Memoize chart data to prevent unnecessary re-renders
    const chartData = useMemo(() => {
        if (!data?.parties) return [];
        return data.parties.slice(0, 5).map(p => ({
            name: p.name,
            score: p.score ?? p.baseScore,
            color: p.color,
            id: p.id,
            logoUrl: p.logoUrl,
            nidaScore: p.nidaScore,
            hiddenSupport: p.hiddenSupport,
            divergence: p.divergence
        }));
    }, [data?.parties]);

    // Memoize top 5 parties
    const topParties = useMemo(() => {
        return data?.parties?.slice(0, 5) || [];
    }, [data?.parties]);

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
        <main className="min-h-screen bg-slate-950 text-white p-2 sm:p-3 md:p-4 lg:p-5 relative overflow-hidden flex flex-col safe-area-padding">
            {/* Background Cyber Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />



            {/* Error Banner */}
            {error && (
                <div className="relative z-30 bg-red-900/50 border border-red-500 rounded-lg p-2 mb-3 flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-200">{error}</p>
                </div>
            )}

            {/* Header */}
            <header className="relative z-20 flex flex-col lg:flex-row items-start lg:items-center justify-between mb-2 border-b border-gray-800 pb-2 gap-2 lg:gap-4 mobile-stack">
                {/* Left: Logo & Status Info */}
                <div className="flex flex-col gap-1 min-w-fit">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 leading-tight">
                        TH ELECTION <span className="text-white">AI WATCH</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <p className="text-gray-400 text-[11px] flex items-center gap-2">
                            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                            วิเคราะห์อารมณ์สังคม ({data?.sampleSize || 0})
                        </p>
                        {data?.feedStatus && (
                            <span className="text-[10px] bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded border border-green-800/50">
                                {data.feedStatus.activeFeeds}/{data.feedStatus.totalFeeds} แหล่งข่าว
                            </span>
                        )}
                        <Link
                            href="/methodology"
                            className="text-[10px] bg-slate-800/80 text-gray-400 hover:text-white px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1 transition-colors"
                        >
                            <Info className="w-3 h-3" />
                            วิธีการคำนวณ
                        </Link>
                        <span className="text-[10px] text-amber-500/70 items-center gap-1 border-l border-slate-800 pl-3 ml-1 hidden xl:flex">
                            <AlertCircle className="w-3 h-3" />
                            ประมาณการเพื่อการวิจัยเท่านั้น ไม่ใช่ผลการเลือกตั้งจริง
                        </span>
                    </div>
                </div>

                {/* Center: Integrated Announcement Switcher - Hide on mobile */}
                <div className="hidden md:block flex-grow">
                    <AnnouncementSwitcher />
                </div>

                {/* Countdown Timer + Actions */}
                <div className="flex items-center gap-2 sm:gap-3 countdown-compact w-full lg:w-auto justify-center lg:justify-end">
                    <ElectionCountdown />
                    <div className="flex items-center gap-2">
                        <ShareButton />
                        <ThemeToggle />
                    </div>
                    <div className="text-right hidden xl:block">
                        <div className="text-xs text-gray-500 font-mono">สถานะระบบ: ออนไลน์</div>
                        <div className="text-xs text-gray-500 font-mono">เวอร์ชัน: 2.1</div>
                    </div>
                </div>
            </header>



            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 items-stretch flex-1 min-h-0 responsive-container">
                {/* Left Column: Rankings */}
                <div className="lg:col-span-1 flex flex-col space-y-2 min-h-0 order-2 lg:order-1">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-cyan-400 shrink-0">
                        <Activity className="w-5 h-5" />
                        ดัชนีความนิยมปัจจุบัน
                    </h2>

                    <div className="flex-1 space-y-2 min-h-0">
                        {data?.parties?.slice(0, 5).map((party, idx) => (
                            <div
                                key={party.id}
                                className="relative bg-slate-900/40 border border-slate-800 p-2 sm:p-3 rounded-xl backdrop-blur-sm hover:border-slate-600 transition-all group overflow-hidden responsive-card flex flex-col justify-center"
                            >

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
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-black text-white/[0.015] pointer-events-none z-0 whitespace-nowrap font-mono select-none">
                                    {party.id.toUpperCase()}
                                </div>

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-start gap-4">
                                        {/* Rank Number */}
                                        <div className="flex flex-col items-center gap-1 mt-1">
                                            <div className="text-lg sm:text-2xl font-black text-slate-700 font-mono italic">#{idx + 1}</div>
                                        </div>

                                        {/* Logo Container */}
                                        {party.logoUrl && (
                                            <div className="relative">
                                                <div
                                                    className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full p-1.5 sm:p-2 shadow-lg flex items-center justify-center shrink-0 border-2 sm:border-4 border-slate-800/50"
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
                                            <h3
                                                className="font-bold text-base sm:text-lg md:text-xl text-white hover:text-cyan-400 transition-colors tracking-tight leading-tight cursor-pointer underline decoration-dotted decoration-slate-600 hover:decoration-cyan-400 underline-offset-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedParty(party);
                                                }}
                                            >
                                                {party.name}
                                            </h3>

                                            {party.candidates && party.candidates.length > 0 && (
                                                <div className="text-xs sm:text-sm text-slate-400 mt-1 flex flex-wrap gap-x-1 gap-y-0.5 hidden sm:flex items-center">
                                                    <span className="text-slate-500 font-medium mr-1">แคนดิเดต:</span>
                                                    {party.candidates.map((candidate, cidx) => (
                                                        <span key={cidx} className="inline-flex items-center">
                                                            <CandidateLink candidate={candidate} party={party}>
                                                                <span className="text-slate-300 hover:text-white">
                                                                    {candidate.name || candidate}
                                                                </span>
                                                            </CandidateLink>
                                                            {cidx < party.candidates.length - 1 && (
                                                                <span className="text-slate-600 mx-0.5">,</span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1 mt-1 sm:mt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                                    <span className="text-slate-500 text-xs">ส.ส. (คาดการณ์)</span>
                                                    <span className="text-white font-mono font-bold">{party.projectedSeats ?? Math.round((party.score ?? party.baseScore) / 100 * 500)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                                    <span className="text-slate-500 text-xs">คะแนนเสียง (คาดการณ์)</span>
                                                    <span className="text-white font-mono font-bold">{party.projectedVotes ?? Math.floor((party.score ?? party.baseScore) / 100 * 39000000).toLocaleString('th-TH')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Score Big Display */}
                                    <div className="text-right flex flex-col items-end">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter" style={{ color: party.color, textShadow: `0 0 30px ${party.color}40` }}>
                                            {(party.score ?? party.baseScore).toFixed(1)}<span className="text-lg align-top opacity-50 ml-0.5">%</span>
                                        </div>

                                        <div className="flex flex-col items-end gap-1.5 mt-1.5">
                                            {/* Trend Prediction Badge */}
                                            {party.trendPrediction && (
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold
                                                    ${party.trendPrediction.prediction === 'up' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                                        party.trendPrediction.prediction === 'down' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                                                            'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}>
                                                    <span className="opacity-60 text-[10px] hidden sm:inline">24ชม.</span>
                                                    <span className="flex items-center gap-0.5">
                                                        {party.trendPrediction.prediction === 'up' ? '▲' : party.trendPrediction.prediction === 'down' ? '▼' : '●'}
                                                        <span className="font-mono">{Math.abs(party.trendPrediction.delta24h).toFixed(2)}%</span>
                                                    </span>
                                                </div>
                                            )}

                                            {/* Current Delta pill */}
                                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${party.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                {party.trend === 'up' ? '▲' : '▼'} {party.delta}%
                                            </div>
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
                <div className="lg:col-span-2 flex flex-col space-y-2 min-h-0 order-1 lg:order-2">

                    {/* Balanced Header for Right Column */}
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-blue-400 shrink-0">
                        <TrendingUp className="w-5 h-5" />
                        วิเคราะห์และกระแสข้อมูล AI
                    </h2>

                    <div className="flex-1 flex flex-col gap-3 min-h-0">
                        {/* Main Chart */}
                        <div className="bg-slate-900/50 border border-slate-800 p-3 sm:p-4 md:p-6 rounded-2xl backdrop-blur chart-container relative overflow-hidden shrink-0">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Activity className="w-24 h-24 text-slate-500" />
                            </div>
                            <h3 className="text-slate-400 mb-6 text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                การกระจายความนิยม (Top 5)
                            </h3>
                            <ResponsiveContainer width="100%" height="90%">
                                <ComposedChart data={chartData} margin={{ bottom: 30, top: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#cbd5e1"
                                        fontSize={12}
                                        interval={0}
                                        tick={<CustomAxisTick data={chartData} />}
                                        height={70}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis stroke="#666" domain={[0, 60]} />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const tooltipData = payload[0].payload;
                                                return (
                                                    <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl min-w-[200px] z-50">
                                                        <p className="font-bold text-white mb-2 text-base">{label}</p>
                                                        {payload.map((entry, index) => (
                                                            <div key={index} className="flex justify-between items-center text-sm mb-1">
                                                                <span style={{ color: entry.stroke || entry.fill }}>
                                                                    {entry.name === 'score' ? 'คะแนน AI (เน็ต)' : 'นิด้าโพล (จริง)'}
                                                                </span>
                                                                <span className="font-mono font-bold text-white ml-4">
                                                                    {parseFloat(entry.value).toFixed(1)}%
                                                                </span>
                                                            </div>
                                                        ))}

                                                        {/* DIVERGENCE ALERT ON HOVER */}
                                                        {tooltipData.hiddenSupport && (
                                                            <div className="mt-3 pt-2 border-t border-slate-700 animate-in fade-in slide-in-from-top-1">
                                                                <div className="flex items-center gap-2 text-amber-500 font-bold text-xs mb-1">
                                                                    <TrendingUp className="w-4 h-4" />
                                                                    <span>ตรวจพบฐานเสียงแฝง!</span>
                                                                </div>
                                                                <div className="text-[10px] text-amber-200/80 leading-relaxed bg-amber-900/20 p-2 rounded border border-amber-900/50">
                                                                    คะแนนจริงสูงกว่ากระแสโซเชียล <span className="text-white font-bold">{Math.abs(tooltipData.divergence)}%</span>
                                                                    <br />(Underlying Support)
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    {/* Main AI Bar */}
                                    <Bar dataKey="score" radius={[4, 4, 0, 0]} name="score">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>

                                    {/* NIDA Comparison Line */}
                                    <Line
                                        type="monotone"
                                        dataKey="nidaScore"
                                        stroke="#fbbf24"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={{ r: 4, fill: '#fbbf24', strokeWidth: 0 }}
                                        name="nidaScore"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>

                        {/* AI Console / News Ticker */}
                        <div className="bg-black border border-green-900/50 rounded-lg p-2 sm:p-3 md:p-4 font-mono text-xs sm:text-sm news-ticker overflow-y-auto relative custom-scrollbar">
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-pulse sticky z-10" />
                            <h3 className="text-green-500 mb-2 flex items-center gap-2 sticky top-0 bg-black/90 pb-2 z-10 border-b border-green-900/50 w-full">
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                กระแสข้อมูล AI (ล่าสุด)
                            </h3>
                            <div className="space-y-4 text-green-300/80 mt-2">
                                {history.length === 0 && !data?.recentNews && (
                                    <div className="text-gray-500 text-center py-8">
                                        กำลังรอข่าวใหม่...
                                    </div>
                                )}
                                {history.length === 0 && data?.recentNews?.length > 0 && (
                                    <>
                                        <div className="text-yellow-500/70 text-xs mb-2">📢 ข่าวการเมืองล่าสุด:</div>
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
                                            </div>
                                        ))}
                                    </>
                                )}
                                {history.slice(-10).reverse().map((tick, i) => (
                                    <div key={i} className="border-l-2 border-green-500 pl-2 animate-in slide-in-from-left duration-300 pb-2 border-b border-green-900/20 last:border-0">
                                        <div className="flex justify-between items-start">
                                            <span className="text-white text-xs opacity-50">[{new Date(tick.timestamp).toLocaleTimeString()}]</span>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-purple-400">[{tick.analyzedNews?.source}]</span>
                                                {tick.analyzedNews?.pubDate && (
                                                    <span className="text-gray-500">
                                                        📅 {new Date(tick.analyzedNews.pubDate).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
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
                                            <span className="text-gray-500">วิเคราะห์: </span>
                                            <span className={`font-bold ${tick.analyzedNews?.sentiment === 'pos' ? 'text-green-400' : tick.analyzedNews?.sentiment === 'neg' ? 'text-red-400' : 'text-yellow-400'}`}>
                                                {tick.analyzedNews?.sentiment === 'pos' ? 'เชิงบวก' : tick.analyzedNews?.sentiment === 'neg' ? 'เชิงลบ' : 'เป็นกลาง'}
                                            </span>
                                            {tick.analyzedNews?.primaryContext && (
                                                <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-700">
                                                    ({tick.analyzedNews.primaryContext.label})
                                                </span>
                                            )}
                                            <span className="text-gray-600"> | ผลกระทบ: {tick.analyzedNews?.target} ({tick.analyzedNews?.impact > 0 ? '+' : ''}{tick.analyzedNews?.impact}%)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Professional Footer - Enhanced */}
            <footer className="relative z-10 mt-4 shrink-0">
                {/* Gradient Border Top */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-4" />

                <div className="max-w-7xl mx-auto px-2 sm:px-4">
                    {/* Disclaimer Box - More Prominent */}
                    <div className="bg-amber-950/40 border border-amber-700/50 rounded-lg p-3 mb-4">
                        <p className="text-xs sm:text-sm text-amber-300 leading-relaxed text-center font-medium">
                            ⚠️ <span className="font-bold">ข้อสงวนสิทธิ์:</span> ข้อมูลนี้เป็นการประมาณการโดยระบบ AI เพื่อการศึกษาและวิจัยเท่านั้น
                            <br className="hidden sm:block" />
                            <span className="text-amber-400/80">ไม่ใช่ผลการเลือกตั้งอย่างเป็นทางการ และไม่ได้รับรองโดยคณะกรรมการการเลือกตั้ง (กกต.) หรือองค์กรใดๆ</span>
                        </p>
                    </div>

                    {/* Main Footer Content */}
                    <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
                            {/* Left: Copyright */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
                                    AI
                                </div>
                                <div>
                                    <div className="font-bold text-white">© 2026 Bonchon-Studio</div>
                                    <div className="text-xs text-slate-400">สงวนลิขสิทธิ์ตามกฎหมาย</div>
                                </div>
                            </div>

                            {/* Center: Links */}
                            <div className="flex items-center gap-4 sm:gap-6">
                                <Link
                                    href="/trends"
                                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    <span>เทรนด์ย้อนหลัง</span>
                                </Link>
                                <Link
                                    href="/methodology"
                                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                                >
                                    <Info className="w-4 h-4" />
                                    <span>วิธีการคำนวณ</span>
                                </Link>
                                <a
                                    href="https://github.com/Smallzoamz/election-aiwatcher-th"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    <span>GitHub</span>
                                </a>
                            </div>

                            {/* Right: Status */}
                            <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                                <div className="text-center">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Version</div>
                                    <div className="font-mono font-bold text-white">2.1</div>
                                </div>
                                <div className="w-px h-8 bg-slate-700" />
                                <div className="text-center">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Status</div>
                                    <div className="flex items-center gap-1.5 text-green-400 font-bold">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        Online
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Credit */}
                    <div className="text-center mt-3 text-xs text-slate-600">
                        Developed with 💙 for Thai Democracy
                    </div>
                </div>
            </footer>

            {/* Party Detail Modal */}
            <PartyDetailModal
                party={selectedParty}
                isOpen={!!selectedParty}
                onClose={() => setSelectedParty(null)}
            />
        </main>
    );
}
