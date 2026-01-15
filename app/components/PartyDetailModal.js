'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, Users, Calendar, Globe, ChevronRight, Award } from 'lucide-react';
import { PARTY_DETAILS, CATEGORY_COLORS } from '@/lib/party-data';

export default function PartyDetailModal({ party, isOpen, onClose }) {
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

    if (!mounted || !isOpen || !party) return null;

    const details = PARTY_DETAILS[party.id];

    // If no detailed data, show basic info only
    if (!details) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold text-white mb-4">{party.name}</h2>
                    <p className="text-gray-400">ข้อมูลเพิ่มเติมยังไม่พร้อมใช้งาน</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95">
                {/* Header with Party Color */}
                <div
                    className="relative p-4 sm:p-6 border-b border-slate-700"
                    style={{ background: `linear-gradient(135deg, ${party.color}20 0%, transparent 100%)` }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-start gap-4">
                        {/* Logo */}
                        {party.logoUrl && (
                            <div
                                className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl p-2 shadow-lg flex-shrink-0"
                                style={{ boxShadow: `0 0 30px ${party.color}40` }}
                            >
                                <img src={party.logoUrl} alt={party.name} className="w-full h-full object-contain" />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                                {details.fullName}
                            </h2>
                            <p className="text-sm text-gray-400 mb-2">"{details.slogan}"</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {details.ideology.map((tag, i) => (
                                    <span key={i} className="text-xs px-2 py-0.5 bg-slate-800 text-gray-300 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Current Score */}
                        <div className="text-right hidden sm:block">
                            <div
                                className="text-3xl font-black"
                                style={{ color: party.color }}
                            >
                                {party.score?.toFixed(1) || party.baseScore}%
                            </div>
                            <div className="text-xs text-gray-500">คะแนนปัจจุบัน</div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                        <div className="bg-slate-800/50 rounded-lg p-2">
                            <Calendar className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                            <div className="text-xs text-gray-400">ก่อตั้ง</div>
                            <div className="text-sm font-bold text-white">{details.founded}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-2">
                            <Users className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                            <div className="text-xs text-gray-400">หัวหน้าพรรค</div>
                            <div className="text-sm font-bold text-white truncate">{details.leader}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-2">
                            <Award className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                            <div className="text-xs text-gray-400">ส.ส. (คาดการณ์)</div>
                            <div className="text-sm font-bold text-white">{party.projectedSeats || '—'}</div>
                        </div>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] custom-scrollbar">
                    {/* Top Policies */}
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <ChevronRight className="w-5 h-5 text-cyan-400" />
                        นโยบายเด่น
                    </h3>

                    <div className="space-y-2 mb-6">
                        {details.topPolicies.map((policy, i) => (
                            <div
                                key={i}
                                className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <span className={`text-xs px-2 py-0.5 rounded border ${CATEGORY_COLORS[policy.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                                        {policy.category}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-white text-sm">{policy.title}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{policy.description}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* External Links */}
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        ข้อมูลเพิ่มเติม
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {details.externalLinks.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg border border-cyan-500/30 text-sm font-medium transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Footer with Disclaimer */}
                <div className="p-4 border-t border-slate-700 bg-amber-950/30">
                    <p className="text-xs text-center text-amber-500/90 flex items-center justify-center gap-2">
                        <span>⚠️</span>
                        <span>ข้อมูลนโยบายเป็นการประมาณการเท่านั้น กรุณาตรวจสอบจากเว็บไซต์พรรคอีกครั้ง</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
