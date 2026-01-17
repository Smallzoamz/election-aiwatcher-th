'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, Briefcase, User, Quote, GraduationCap, History, Sparkles } from 'lucide-react';

/**
 * CandidateModal - Beautiful popup modal for candidate biography
 * Features: Tabbed interface (Bio/Path), Large profile photo, party logo background, position badge
 */
export default function CandidateModal({ candidate, party, isOpen, onClose }) {
    const [mounted, setMounted] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [activeTab, setActiveTab] = useState('bio'); // 'bio' or 'path'

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

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            return () => window.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, onClose]);

    if (!mounted || !isOpen || !candidate || !party) return null;

    const partyColor = party.color || '#6366f1';

    const tabs = [
        { id: 'bio', label: 'ประวัติ', icon: User },
        { id: 'path', label: 'เส้นทาง', icon: History }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300"
                style={{
                    borderColor: partyColor + '40',
                    boxShadow: `0 25px 80px -12px ${partyColor}40, 0 0 40px ${partyColor}10`
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white transition-all z-20 hover:rotate-90 duration-300 border border-slate-700/50"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Profile Header */}
                <div
                    className="relative pt-10 pb-6 px-6 overflow-hidden"
                    style={{
                        background: `linear-gradient(180deg, ${partyColor}20 0%, transparent 100%)`
                    }}
                >
                    {/* Background Decorative Circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-3xl opacity-20" style={{ backgroundColor: partyColor }} />

                    <div className="flex flex-col items-center text-center relative z-10">
                        {/* Avatar with Status Ring */}
                        <div className="relative mb-4 group">
                            <div
                                className="absolute inset-0 rounded-full blur-2xl opacity-60 animate-pulse"
                                style={{ backgroundColor: partyColor }}
                            />
                            <div
                                className="relative w-32 h-32 rounded-full overflow-hidden border-4 shadow-2xl transition-transform group-hover:scale-105 duration-500"
                                style={{
                                    borderColor: partyColor,
                                    boxShadow: `0 0 30px ${partyColor}50`
                                }}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={imgError ? `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=${partyColor.slice(1)}&color=fff&size=256&bold=true` : (candidate.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=${partyColor.slice(1)}&color=fff&size=256&bold=true`)}
                                        alt={candidate.name}
                                        fill
                                        className="object-cover"
                                        unoptimized={true}
                                        onError={() => setImgError(true)}
                                    />
                                </div>
                            </div>

                            {/* Party Logo Overlay */}
                            {party.logoUrl && (
                                <div
                                    className="absolute -bottom-1 -right-1 w-11 h-11 bg-white rounded-full p-2 shadow-xl border-2 animate-in slide-in-from-bottom-2 duration-500"
                                    style={{ borderColor: partyColor }}
                                >
                                    <img
                                        src={party.logoUrl}
                                        alt={party.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                            {candidate.name}
                        </h2>

                        {candidate.nickname && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-3">
                                <Quote className="w-3 h-3 text-slate-500 opacity-50" />
                                <span>{candidate.nickname}</span>
                                <Quote className="w-3 h-3 text-slate-500 opacity-50" />
                            </div>
                        )}

                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
                            style={{
                                backgroundColor: partyColor + '20',
                                color: partyColor,
                                border: `1px solid ${partyColor}40`
                            }}
                        >
                            <Briefcase className="w-3.5 h-3.5" />
                            {candidate.position}
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex px-6 mb-4">
                    <div className="flex p-1 bg-slate-800/50 rounded-xl border border-slate-700/50 w-full">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-slate-700 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-' + partyColor : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="px-6 pt-6 pb-8 h-[240px] overflow-y-auto custom-scrollbar">
                    {activeTab === 'bio' ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Vision Box */}
                            {candidate.vision && (
                                <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30 relative">
                                    <div className="absolute -top-2 left-4 px-2 bg-slate-900 border border-slate-700 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                        <Sparkles className="w-2.5 h-2.5" /> วิสัยทัศน์
                                    </div>
                                    <p className="text-slate-200 text-sm italic leading-relaxed pt-1">
                                        "{candidate.vision}"
                                    </p>
                                </div>
                            )}

                            {/* Bio details */}
                            <div className="space-y-3">
                                <div className="flex gap-4">
                                    <div className="w-1 bg-slate-800 rounded-full" />
                                    <div className="flex-1">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ประวัติโดยสังเขป</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {candidate.bio || "ไม่ระบุข้อมูลประวัติ"}
                                        </p>
                                    </div>
                                </div>

                                {candidate.birthdate && (
                                    <div className="flex items-center gap-3 bg-slate-800/20 p-3 rounded-xl border border-slate-800/50">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                                            <span className="text-xs">📅</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-medium text-slate-500 uppercase">เกิดเมื่อ</p>
                                            <p className="text-slate-200 text-sm">{candidate.birthdate}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                            {/* Education */}
                            <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <GraduationCap className="w-3.5 h-3.5" /> การศึกษา
                                </h4>
                                <p className="text-slate-200 text-sm leading-relaxed">
                                    {candidate.education || "-"}
                                </p>
                            </div>

                            {/* Career */}
                            <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Briefcase className="w-3.5 h-3.5" /> เส้นทางอาชีพ / ผลงานหลัก
                                </h4>
                                <div className="space-y-2">
                                    {candidate.career ? candidate.career.split(',').map((item, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                                            <p className="text-slate-300 text-sm">{item.trim()}</p>
                                        </div>
                                    )) : "-"}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="px-6 py-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: partyColor }}
                        />
                        <span className="text-slate-500 text-[11px]">
                            สังกัด <span className="text-slate-300 font-medium">{party.shortName || party.name}</span>
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1e293b;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #334155;
                }
            `}</style>
        </div>
    );
}

/**
 * CandidateLink - Clickable text that opens CandidateModal
 */
export function CandidateLink({ candidate, party, children }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!candidate || typeof candidate === 'string') {
        return <span>{children}</span>;
    }

    return (
        <>
            <span
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className="cursor-pointer hover:text-white transition-colors underline decoration-dotted underline-offset-2 hover:decoration-solid font-medium"
                style={{
                    textDecorationColor: party?.color + '80',
                }}
            >
                {children}
            </span>
            {isOpen && typeof document !== 'undefined' && createPortal(
                <CandidateModal
                    candidate={candidate}
                    party={party}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />,
                document.body
            )}
        </>
    );
}
