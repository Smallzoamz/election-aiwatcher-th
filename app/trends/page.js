'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';

// Party colors mapping
const PARTY_COLORS = {
    'pp': '#FF6B00',
    'pt': '#E30613',
    'utn': '#1E3A8A',
    'bjt': '#0B1F4F',
    'dem': '#40C0F0',
    'pprp': '#183E9A',
    'tkm': '#00A86B',
    'okm': '#9333EA',
    'econ': '#059669'
};

const PARTY_NAMES = {
    'pp': 'ประชาชน',
    'pt': 'เพื่อไทย',
    'utn': 'รวมไทยสร้างชาติ',
    'bjt': 'ภูมิใจไทย',
    'dem': 'ประชาธิปัตย์',
    'pprp': 'พลังประชารัฐ',
    'tkm': 'ไทยก้าวใหม่',
    'okm': 'โอกาสใหม่',
    'econ': 'เศรษฐกิจไทย'
};

export default function TrendsPage() {
    const [chartData, setChartData] = useState([]);
    const [partyInfo, setPartyInfo] = useState([]);
    const [days, setDays] = useState(7);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleParties, setVisibleParties] = useState({});
    const [generatedAt, setGeneratedAt] = useState(null);

    // Fetch data when days change
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/history?days=${days}`);
                const data = await res.json();

                if (data.success) {
                    setChartData(data.chartData);
                    setPartyInfo(data.partyInfo);
                    setGeneratedAt(data.generatedAt);

                    // Initialize all parties as visible
                    const visible = {};
                    data.partyInfo.forEach(p => {
                        visible[p.id] = true;
                    });
                    setVisibleParties(visible);
                } else {
                    setError(data.error || 'Failed to load data');
                }
            } catch (err) {
                setError('Connection error');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [days]);

    // Toggle party visibility
    const toggleParty = (partyId) => {
        setVisibleParties(prev => ({
            ...prev,
            [partyId]: !prev[partyId]
        }));
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || payload.length === 0) return null;

        return (
            <div className="trend-tooltip">
                <p className="tooltip-date">{label}</p>
                <div className="tooltip-scores">
                    {payload
                        .filter(p => p.value !== undefined)
                        .sort((a, b) => b.value - a.value)
                        .map((entry, idx) => (
                            <div key={idx} className="tooltip-row">
                                <span
                                    className="tooltip-dot"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="tooltip-party">
                                    {PARTY_NAMES[entry.dataKey] || entry.dataKey}
                                </span>
                                <span className="tooltip-value">{entry.value.toFixed(1)}%</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    };

    return (
        <main className="trends-page">
            {/* Header */}
            <header className="trends-header">
                <div className="header-left">
                    <Link href="/" className="back-link">
                        ← กลับหน้าหลัก
                    </Link>
                    <h1>📈 เทรนด์คะแนนย้อนหลัง</h1>
                </div>
                <div className="header-right">
                    <span className="update-time">
                        อัปเดต: {generatedAt ? new Date(generatedAt).toLocaleString('th-TH') : '-'}
                    </span>
                </div>
            </header>

            {/* Controls */}
            <div className="controls-bar">
                <div className="date-range-buttons">
                    <span className="control-label">ช่วงเวลา:</span>
                    {[7, 14, 30].map(d => (
                        <button
                            key={d}
                            className={`range-btn ${days === d ? 'active' : ''}`}
                            onClick={() => setDays(d)}
                        >
                            {d} วัน
                        </button>
                    ))}
                </div>
            </div>

            {/* Party Filter */}
            <div className="party-filter">
                <span className="control-label">แสดงพรรค:</span>
                <div className="party-chips">
                    {partyInfo.map(party => (
                        <button
                            key={party.id}
                            className={`party-chip ${visibleParties[party.id] ? 'active' : ''}`}
                            style={{
                                '--party-color': party.color,
                                borderColor: visibleParties[party.id] ? party.color : 'transparent',
                                backgroundColor: visibleParties[party.id] ? `${party.color}20` : 'transparent'
                            }}
                            onClick={() => toggleParty(party.id)}
                        >
                            <span
                                className="chip-dot"
                                style={{ backgroundColor: party.color }}
                            />
                            {party.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Area */}
            <div className="chart-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner" />
                        <p>กำลังโหลดข้อมูล...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>❌ {error}</p>
                        <button onClick={() => setDays(days)}>ลองใหม่</button>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="empty-state">
                        <p>📊 ยังไม่มีข้อมูลเทรนด์ในช่วงเวลานี้</p>
                        <p className="sub">ระบบจะเริ่มเก็บข้อมูลเมื่อมีการวิเคราะห์ข่าว</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={450}>
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                domain={[0, 50]}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                                tickFormatter={(v) => `${v}%`}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            {partyInfo.map(party => (
                                visibleParties[party.id] && (
                                    <Line
                                        key={party.id}
                                        type="monotone"
                                        dataKey={party.id}
                                        name={party.name}
                                        stroke={party.color}
                                        strokeWidth={2.5}
                                        dot={false}
                                        activeDot={{ r: 5, strokeWidth: 2 }}
                                    />
                                )
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Data Summary */}
            {!loading && !error && chartData.length > 0 && (
                <div className="data-summary">
                    <p>📊 แสดงข้อมูล {chartData.length} จุด ในช่วง {days} วันที่ผ่านมา</p>
                </div>
            )}

            {/* Footer */}
            <footer className="trends-footer">
                <p>© 2026 Bonchon-Studio | TH Election AI Watch</p>
            </footer>

            <style jsx>{`
                .trends-page {
                    min-height: 100vh;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    padding: 1rem;
                }

                .trends-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border-color);
                }

                .header-left h1 {
                    margin: 0.5rem 0 0;
                    font-size: 1.5rem;
                    background: linear-gradient(135deg, #06b6d4, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .back-link {
                    color: var(--accent-color);
                    text-decoration: none;
                    font-size: 0.9rem;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }

                .back-link:hover {
                    opacity: 1;
                }

                .update-time {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }

                .controls-bar {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .control-label {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin-right: 0.5rem;
                }

                .date-range-buttons {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .range-btn {
                    padding: 0.4rem 0.8rem;
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    background: transparent;
                    color: var(--text-secondary);
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                }

                .range-btn:hover {
                    border-color: var(--accent-color);
                }

                .range-btn.active {
                    background: var(--accent-color);
                    border-color: var(--accent-color);
                    color: white;
                }

                .party-filter {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }

                .party-chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .party-chip {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.35rem 0.7rem;
                    border: 2px solid;
                    border-radius: 20px;
                    background: transparent;
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: all 0.2s;
                    color: var(--text-primary);
                }

                .party-chip:hover {
                    transform: scale(1.02);
                }

                .chip-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }

                .chart-container {
                    background: var(--card-bg);
                    border-radius: 12px;
                    padding: 1.5rem;
                    border: 1px solid var(--border-color);
                    min-height: 480px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .loading-state, .error-state, .empty-state {
                    text-align: center;
                    color: var(--text-secondary);
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid var(--border-color);
                    border-top-color: var(--accent-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .error-state button {
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: var(--accent-color);
                    border: none;
                    border-radius: 6px;
                    color: white;
                    cursor: pointer;
                }

                .empty-state .sub {
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                    opacity: 0.7;
                }

                .data-summary {
                    text-align: center;
                    margin-top: 1rem;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }

                .trends-footer {
                    text-align: center;
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-color);
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }

                /* Tooltip Styles */
                :global(.trend-tooltip) {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 0.75rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }

                :global(.tooltip-date) {
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    font-size: 0.85rem;
                    color: var(--text-primary);
                }

                :global(.tooltip-scores) {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                :global(.tooltip-row) {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.8rem;
                }

                :global(.tooltip-dot) {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                :global(.tooltip-party) {
                    flex: 1;
                    color: var(--text-secondary);
                }

                :global(.tooltip-value) {
                    font-weight: 600;
                    color: var(--text-primary);
                }

                @media (max-width: 768px) {
                    .trends-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .header-left h1 {
                        font-size: 1.25rem;
                    }

                    .party-filter {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .chart-container {
                        padding: 1rem;
                    }
                }
            `}</style>
        </main>
    );
}
