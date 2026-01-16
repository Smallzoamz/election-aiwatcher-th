'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, Briefcase, User, Quote } from 'lucide-react';

/**
 * CandidateModal - Beautiful popup modal for candidate biography
 * Features: Large profile photo, party logo background, position badge, bio
 */
export default function CandidateModal({ candidate, party, isOpen, onClose }) {
    const [mounted, setMounted] = useState(false);
    const [imgError, setImgError] = useState(false);

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                style={{
                    borderColor: partyColor + '40',
                    boxShadow: `0 25px 80px -12px ${partyColor}30, 0 0 40px ${partyColor}10`
                }}
            >
                {/* Party Logo Background - Faded */}
                {party.logoUrl && (
                    <div
                        className="absolute top-0 right-0 w-48 h-48 opacity-[0.06] pointer-events-none"
                        style={{
                            backgroundImage: `url(${party.logoUrl})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'top right',
                            transform: 'translate(20%, -20%)'
                        }}
                    />
                )}

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white transition-all z-20 hover:rotate-90 duration-200"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header with Color Gradient */}
                <div
                    className="relative pt-8 pb-6 px-6"
                    style={{
                        background: `linear-gradient(180deg, ${partyColor}15 0%, transparent 100%)`
                    }}
                >
                    {/* Profile Section */}
                    <div className="flex flex-col items-center text-center">
                        {/* Avatar with Glow */}
                        <div className="relative mb-4">
                            <div
                                className="absolute inset-0 rounded-full blur-xl opacity-40"
                                style={{ backgroundColor: partyColor }}
                            />
                            <div
                                className="relative w-28 h-28 rounded-full overflow-hidden border-4 shadow-2xl"
                                style={{
                                    borderColor: partyColor,
                                    boxShadow: `0 0 30px ${partyColor}50`
                                }}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={imgError ? `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=${partyColor.slice(1)}&color=fff&size=128&bold=true` : (candidate.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=${partyColor.slice(1)}&color=fff&size=128&bold=true`)}
                                        alt={candidate.name}
                                        fill
                                        className="object-cover"
                                        unoptimized={true}
                                        onError={() => setImgError(true)}
                                    />
                                </div>
                            </div>
                            {/* Party Badge */}
                            {party.logoUrl && (
                                <div
                                    className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full p-1.5 shadow-lg border-2"
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

                        {/* Name */}
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {candidate.name}
                        </h2>

                        {/* Nickname */}
                        {candidate.nickname && candidate.nickname !== '-' && (
                            <p className="text-base text-slate-400 mb-3 flex items-center gap-1">
                                <Quote className="w-3 h-3 rotate-180" />
                                {candidate.nickname}
                                <Quote className="w-3 h-3" />
                            </p>
                        )}

                        {/* Position Badge */}
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                            style={{
                                backgroundColor: partyColor + '25',
                                color: partyColor,
                                border: `1px solid ${partyColor}50`
                            }}
                        >
                            <Briefcase className="w-4 h-4" />
                            {candidate.position}
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="px-6 pb-6 space-y-3">
                    {/* Birthdate */}
                    {candidate.birthdate && (
                        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                            <div className="text-xs font-semibold text-slate-500 mb-1">📅 วันเกิด</div>
                            <div className="text-slate-200">{candidate.birthdate}</div>
                        </div>
                    )}

                    {/* Education */}
                    {candidate.education && (
                        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                            <div className="text-xs font-semibold text-slate-500 mb-1">🎓 การศึกษา</div>
                            <div className="text-slate-200">{candidate.education}</div>
                        </div>
                    )}

                    {/* Current Position */}
                    {candidate.currentPosition && (
                        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                            <div className="text-xs font-semibold text-slate-500 mb-1">💼 ตำแหน่งปัจจุบัน</div>
                            <div className="text-slate-200">{candidate.currentPosition}</div>
                        </div>
                    )}

                    {/* Bio Summary */}
                    {candidate.bio && (
                        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                            <div className="text-xs font-semibold text-slate-500 mb-1">📋 ประวัติโดยสังเขป</div>
                            <div className="text-slate-300 text-sm leading-relaxed">{candidate.bio}</div>
                        </div>
                    )}

                    {/* Party Info */}
                    <div
                        className="mt-4 flex items-center justify-center gap-3 px-4 py-3 rounded-xl"
                        style={{ backgroundColor: partyColor + '10' }}
                    >
                        <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: partyColor }}
                        />
                        <span className="text-slate-400 text-sm">
                            สังกัด <span className="text-white font-medium">{party.name}</span>
                        </span>
                    </div>
                </div>

                {/* Footer Decoration */}
                <div
                    className="h-1"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${partyColor}, transparent)`
                    }}
                />
            </div>
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
                className="cursor-pointer hover:text-white transition-colors underline decoration-dotted underline-offset-2 hover:decoration-solid"
                style={{
                    textDecorationColor: party?.color + '80',
                    color: 'inherit'
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
