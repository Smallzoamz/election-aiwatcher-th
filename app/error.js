'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log error to console (in production, send to error tracking service)
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <div className="bg-slate-900/80 border border-red-500/50 rounded-lg p-8 max-w-md text-center backdrop-blur">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
                <p className="text-gray-400 mb-6">
                    ระบบพบปัญหาบางอย่าง กรุณาลองใหม่อีกครั้ง
                </p>
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                    <RefreshCw className="w-4 h-4" />
                    ลองใหม่
                </button>
                <p className="text-xs text-gray-600 mt-4">
                    Error: {error.message || 'Unknown error'}
                </p>
            </div>
        </div>
    );
}
