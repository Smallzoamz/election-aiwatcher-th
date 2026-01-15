'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`relative flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300 ${theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-yellow-400'
                    : 'bg-white border-gray-300 hover:bg-gray-100 text-slate-800 shadow-sm'
                }`}
            title={theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                {/* Sun Icon */}
                <Sun
                    className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${theme === 'dark'
                            ? 'opacity-0 rotate-90 scale-0'
                            : 'opacity-100 rotate-0 scale-100'
                        }`}
                />
                {/* Moon Icon */}
                <Moon
                    className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${theme === 'dark'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 -rotate-90 scale-0'
                        }`}
                />
            </div>
        </button>
    );
}
