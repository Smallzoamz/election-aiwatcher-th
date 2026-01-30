'use client';

import { useState, useEffect } from 'react';
import { X, Calculator, Users, Info, TrendingUp, AlertCircle } from 'lucide-react';

export default function SeatCalculationModal({ parties, isOpen, onClose }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen || !parties || parties.length === 0) return null;

    // คำนวณจำนวน ส.ส. ตามสัดส่วน (Proportional Representation) โดยมี Max Cap ที่ 500
    // ใช้ Largest Remainder Method (Hamilton method) เพื่อให้ผลรวมเท่ากับ 500 พอดี
    const TOTAL_SEATS = 500;

    // คำนวณคะแนนรวมทั้งหมด
    const totalScore = parties.reduce((sum, party) => sum + (party.score ?? party.baseScore), 0);

    // คำนวณ ส.ส. ดิบ (raw seats) สำหรับแต่ละพรรค
    const rawCalculations = parties.map(party => {
        const score = party.score ?? party.baseScore;
        const rawSeats = (score / totalScore) * TOTAL_SEATS;
        const integerPart = Math.floor(rawSeats);
        const remainder = rawSeats - integerPart;
        const percentage = totalScore > 0 ? (score / totalScore * 100).toFixed(2) : 0;

        return {
            ...party,
            rawSeats,
            integerPart,
            remainder,
            percentage,
            originalProjectedSeats: party.projectedSeats ?? Math.round((score / 100) * 500)
        };
    });

    // คำนวณผลรวม ส.ส. เต็ม (integer parts)
    const sumIntegerSeats = rawCalculations.reduce((sum, p) => sum + p.integerPart, 0);

    // จำนวนที่นั่งที่เหลือให้จัดสรรเพิ่ม
    const remainingSeats = TOTAL_SEATS - sumIntegerSeats;

    // จัดเรียงตามเศษส่วนที่เหลือ (remainder) มากไปน้อย
    const sortedByRemainder = [...rawCalculations]
        .map((p, index) => ({ ...p, originalIndex: index }))
        .sort((a, b) => b.remainder - a.remainder);

    // แจกที่นั่งที่เหลือให้กับพรรคที่มีเศษส่วนมากที่สุด
    const seatAllocations = new Array(rawCalculations.length).fill(0);

    // ให้ที่นั่งเต็มก่อน
    rawCalculations.forEach((p, i) => {
        seatAllocations[i] = p.integerPart;
    });

    // แจกที่นั่งที่เหลือตามเศษส่วน
    for (let i = 0; i < remainingSeats; i++) {
        if (sortedByRemainder[i]) {
            seatAllocations[sortedByRemainder[i].originalIndex] += 1;
        }
    }

    // รวมผลลัพธ์สุดท้าย
    const seatCalculations = rawCalculations.map((p, i) => ({
        ...p,
        seats: seatAllocations[i]
    }));

    // เรียงลำดับตามจำนวน ส.ส. มากไปน้อย
    const sortedCalculations = [...seatCalculations].sort((a, b) => b.seats - a.seats);

    // คำนวณผลรวม ส.ส. ที่ได้จากการคำนวณ (ต้องเท่ากับ 500)
    const calculatedTotalSeats = seatCalculations.reduce((sum, p) => sum + p.seats, 0);

    // คำนวณผลรวม ส.ส. จากการคาดการณ์เดิม
    const originalTotalSeats = seatCalculations.reduce((sum, p) => sum + p.originalProjectedSeats, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95">
                {/* Header */}
                <div className="relative p-4 sm:p-6 border-b border-slate-700 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Calculator className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                                สูตรคำนวณ ส.ส. (Proportional)
                            </h2>
                            <p className="text-sm text-gray-400">
                                คำนวณจำนวน ส.ส. จากสัดส่วนคะแนนความนิยมรวม {TOTAL_SEATS} ที่นั่ง
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
                    {/* Warning Banner */}
                    <div className="bg-amber-950/30 border border-amber-700/50 rounded-lg p-3 mb-6">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-200/80">
                                <span className="font-bold text-amber-400">หมายเหตุ:</span> การคาดการณ์นี้เป็นการคำนวณทางคณิตศาสตร์เท่านั้น
                                ไม่ใช่ผลการเลือกตั้งจริง ระบบเลือกตั้งจริงใช้ระบบจัดสรรปันส่วนผสม (MMA)
                                ซึ่งมี ส.ส. เขต 400 คน และ ส.ส. บัญชีรายชื่อ 100 คน
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                <Users className="w-4 h-4" />
                                รวม ส.ส. (คำนวณ)
                            </div>
                            <div className="text-2xl font-bold text-cyan-400">
                                {calculatedTotalSeats} <span className="text-sm text-slate-500">/ {TOTAL_SEATS}</span>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                <TrendingUp className="w-4 h-4" />
                                คะแนนรวมทั้งหมด
                            </div>
                            <div className="text-2xl font-bold text-green-400">
                                {totalScore.toFixed(1)}%
                            </div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                <Info className="w-4 h-4" />
                                ส.ส. เดิม (รวม)
                            </div>
                            <div className="text-2xl font-bold text-amber-400">
                                {originalTotalSeats} <span className="text-sm text-slate-500">/ {TOTAL_SEATS}</span>
                            </div>
                        </div>
                    </div>

                    {/* Formula Explanation */}
                    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-cyan-400" />
                            สูตรการคำนวณ (Largest Remainder Method)
                        </h3>
                        <div className="text-sm text-slate-300 space-y-2">
                            <p className="font-mono text-cyan-300">ขั้นตอนที่ 1: คำนวณ ส.ส. ดิบ</p>
                            <p className="font-mono pl-4">ส.ส. ดิบ = (คะแนนพรรค / คะแนนรวมทั้งหมด) × 500</p>
                            <p className="font-mono text-cyan-300 mt-2">ขั้นตอนที่ 2: แบ่งเป็นจำนวนเต็ม + เศษ</p>
                            <p className="font-mono pl-4">ส.ส. เต็ม = floor(ส.ส. ดิบ)</p>
                            <p className="font-mono pl-4">เศษ = ส.ส. ดิบ - ส.ส. เต็ม</p>
                            <p className="font-mono text-cyan-300 mt-2">ขั้นตอนที่ 3: แจกที่นั่งที่เหลือตามเศษมากสุด</p>
                            <p className="font-mono pl-4">ที่นั่งเหลือ = 500 - ผลรวมส.ส. เต็ม</p>
                            <p className="font-mono pl-4">แจกให้พรรคที่มีเศษมากที่สุดก่อน</p>
                        </div>
                    </div>

                    {/* Seat Distribution Table */}
                    <div className="border border-slate-700 rounded-lg overflow-hidden">
                        <div className="bg-slate-800/50 p-3 border-b border-slate-700">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Users className="w-4 h-4 text-cyan-400" />
                                การจัดสรร ส.ส. ตามสัดส่วน
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-700/50">
                            {sortedCalculations.map((party, idx) => (
                                <div
                                    key={party.id}
                                    className="flex items-center gap-3 p-3 hover:bg-slate-800/30 transition-colors"
                                >
                                    {/* Rank */}
                                    <div className="w-8 text-center text-sm font-bold text-slate-500">
                                        #{idx + 1}
                                    </div>

                                    {/* Party Logo */}
                                    {party.logoUrl && (
                                        <div
                                            className="w-10 h-10 bg-white rounded-lg p-1 flex-shrink-0"
                                            style={{ boxShadow: `0 0 10px ${party.color}30` }}
                                        >
                                            <img
                                                src={party.logoUrl}
                                                alt={party.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    )}

                                    {/* Party Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-white text-sm truncate">
                                            {party.name}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            คะแนน: {(party.score ?? party.baseScore).toFixed(1)}% ({party.percentage}% ของรวม)
                                        </div>
                                    </div>

                                    {/* Seats Comparison */}
                                    <div className="text-right">
                                        <div className="flex items-center gap-3">
                                            {/* Original Projection */}
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500">สูงสุด</div>
                                                <div className="text-sm font-mono text-slate-400">
                                                    {party.originalProjectedSeats}
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <div className="text-slate-600">→</div>

                                            {/* New Calculation */}
                                            <div className="text-right">
                                                <div className="text-xs text-cyan-400">Proportional</div>
                                                <div
                                                    className="text-lg font-bold font-mono"
                                                    style={{ color: party.color }}
                                                >
                                                    {party.seats}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                            ดิบ: {party.rawSeats.toFixed(2)} {party.remainder > 0 && `(+${party.remainder.toFixed(2)} เศษ)`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 bg-blue-950/20 border border-blue-800/30 rounded-lg p-3">
                        <h4 className="text-sm font-bold text-blue-400 mb-2">ทำไมตัวเลขถึงเกิน 500?</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            เมื่อนำคะแนนความนิยมของทุกพรรคมาคำนวณเป็น ส.ส. โดยตรง (สมมติว่าแต่ละพรรคได้ ส.ส.
                            ตามเปอร์เซ็นต์ที่มี) ผลรวมจะเกิน 500 เพราะคะแนนความนิยมรวมกันมากกว่า 100%
                            (เนื่องจากผู้ตอบแบบสอบถามสามารถเลือกได้มากกว่า 1 พรรค หรือมีการเคลื่อนไหวของความนิยม)
                            การคำนวณแบบ Proportional นี้จะช่วยให้เห็นภาพการจัดสรรที่สมดุลกว่า
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
