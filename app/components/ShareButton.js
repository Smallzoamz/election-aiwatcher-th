'use client';

import { useState } from 'react';
import { Share2, Facebook, MessageCircle, Link2, Check, X } from 'lucide-react';

export default function ShareButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://election-aiwatcher-th.vercel.app';
    const shareTitle = 'TH Election AI Watch - ระบบวิเคราะห์การเลือกตั้งด้วย AI';
    const shareText = 'ติดตามดัชนีความนิยมพรรคการเมืองไทยแบบ Real-time วิเคราะห์ด้วย AI';

    const shareLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Twitter',
            icon: () => (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            color: 'bg-black hover:bg-gray-800',
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        },
        {
            name: 'LINE',
            icon: MessageCircle,
            color: 'bg-green-500 hover:bg-green-600',
            url: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`
        }
    ];

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = (url) => {
        window.open(url, '_blank', 'width=600,height=400');
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Share Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 rounded-lg border border-cyan-500/30 transition-all text-sm font-medium"
                title="แชร์"
            >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">แชร์</span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2">
                        <div className="p-2 border-b border-slate-700 flex items-center justify-between">
                            <span className="text-sm font-medium text-white">แชร์ไปยัง</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-slate-800 rounded"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-2 space-y-1">
                            {shareLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleShare(link.url)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${link.color}`}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.name}
                                </button>
                            ))}

                            {/* Copy Link */}
                            <button
                                onClick={copyLink}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400">คัดลอกแล้ว!</span>
                                    </>
                                ) : (
                                    <>
                                        <Link2 className="w-4 h-4" />
                                        คัดลอกลิงก์
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
