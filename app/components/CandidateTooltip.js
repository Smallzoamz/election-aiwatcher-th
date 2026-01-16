'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * CandidateTooltip - Hover card component for candidate information
 * Uses Portal to escape overflow:hidden containers
 */
export default function CandidateTooltip({ candidate, partyColor, children }) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const showTimeoutRef = useRef(null);
    const hideTimeoutRef = useRef(null);

    // Ensure portal is only rendered on client
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const clearTimeouts = useCallback(() => {
        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
            showTimeoutRef.current = null;
        }
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    }, []);

    const updatePosition = useCallback(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top - 8,
                left: rect.left + rect.width / 2
            });
        }
    }, []);

    const showTooltip = useCallback(() => {
        clearTimeouts();
        showTimeoutRef.current = setTimeout(() => {
            updatePosition();
            setIsVisible(true);
        }, 100);
    }, [clearTimeouts, updatePosition]);

    const hideTooltip = useCallback(() => {
        clearTimeouts();
        hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 150);
    }, [clearTimeouts]);

    const handleTriggerEnter = useCallback(() => {
        showTooltip();
    }, [showTooltip]);

    const handleTriggerLeave = useCallback(() => {
        hideTooltip();
    }, [hideTooltip]);

    const handleTooltipEnter = useCallback(() => {
        clearTimeouts();
    }, [clearTimeouts]);

    const handleTooltipLeave = useCallback(() => {
        hideTooltip();
    }, [hideTooltip]);

    // Handle click for mobile toggle
    const handleClick = useCallback((e) => {
        e.stopPropagation();
        if (isVisible) {
            setIsVisible(false);
        } else {
            updatePosition();
            setIsVisible(true);
        }
    }, [isVisible, updatePosition]);

    // Close on scroll
    useEffect(() => {
        if (!isVisible) return;

        const handleScroll = () => setIsVisible(false);
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [isVisible]);

    if (!candidate || typeof candidate === 'string') return <span>{children}</span>;

    const tooltipContent = isVisible && mounted ? createPortal(
        <div
            ref={tooltipRef}
            className="fixed z-[99999] animate-in fade-in slide-in-from-bottom-2 duration-150"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: 'translate(-50%, -100%)'
            }}
            onMouseEnter={handleTooltipEnter}
            onMouseLeave={handleTooltipLeave}
        >
            <div
                className="bg-slate-900 backdrop-blur-md border rounded-xl shadow-2xl p-3 min-w-[220px] max-w-[280px]"
                style={{
                    borderColor: partyColor + '60',
                    boxShadow: `0 4px 30px rgba(0,0,0,0.5), 0 0 20px ${partyColor}20`
                }}
            >
                {/* Arrow */}
                <div
                    className="absolute left-1/2 -bottom-2 w-4 h-4 bg-slate-900 rotate-45 -translate-x-1/2 border-r border-b"
                    style={{ borderColor: partyColor + '60' }}
                />

                {/* Content */}
                <div className="flex gap-3 relative z-10">
                    {/* Avatar */}
                    <div
                        className="w-14 h-14 rounded-full overflow-hidden border-2 shrink-0 shadow-lg"
                        style={{ borderColor: partyColor }}
                    >
                        <img
                            src={candidate.imageUrl}
                            alt={candidate.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm leading-tight truncate">
                            {candidate.name}
                        </h4>
                        {candidate.nickname && candidate.nickname !== '-' && (
                            <p className="text-xs text-slate-400 mt-0.5">
                                "{candidate.nickname}"
                            </p>
                        )}
                        <p
                            className="text-xs font-medium mt-1 px-1.5 py-0.5 rounded inline-block"
                            style={{
                                backgroundColor: partyColor + '30',
                                color: partyColor
                            }}
                        >
                            {candidate.position}
                        </p>
                    </div>
                </div>

                {/* Bio */}
                {candidate.bio && (
                    <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-700 leading-relaxed line-clamp-3">
                        {candidate.bio}
                    </p>
                )}
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            <span
                ref={triggerRef}
                onMouseEnter={handleTriggerEnter}
                onMouseLeave={handleTriggerLeave}
                onClick={handleClick}
                className="cursor-pointer hover:text-white transition-colors underline decoration-dotted underline-offset-2 decoration-slate-600 hover:decoration-slate-400"
            >
                {children}
            </span>
            {tooltipContent}
        </>
    );
}
