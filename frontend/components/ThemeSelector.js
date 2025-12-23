import { useState, useEffect } from 'react';

const themes = [
    {
        name: 'Blue/Purple',
        id: 'blue-purple',
        primary: '#3b82f6',
        secondary: '#a855f7',
        gradient: 'from-blue-600 to-purple-600',
    },
    {
        name: 'Green/Emerald',
        id: 'green-emerald',
        primary: '#10b981',
        secondary: '#059669',
        gradient: 'from-emerald-600 to-green-600',
    },
    {
        name: 'Orange/Red',
        id: 'orange-red',
        primary: '#f97316',
        secondary: '#ef4444',
        gradient: 'from-orange-600 to-red-600',
    },
    {
        name: 'Pink/Purple',
        id: 'pink-purple',
        primary: '#ec4899',
        secondary: '#a855f7',
        gradient: 'from-pink-600 to-purple-600',
    },
    {
        name: 'Cyan/Blue',
        id: 'cyan-blue',
        primary: '#06b6d4',
        secondary: '#3b82f6',
        gradient: 'from-cyan-600 to-blue-600',
    },
];

export default function ThemeSelector() {
    const [selectedTheme, setSelectedTheme] = useState('blue-purple');

    useEffect(() => {
        const savedTheme = localStorage.getItem('gym-theme') || 'blue-purple';
        setSelectedTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (themeId) => {
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
            document.documentElement.style.setProperty('--theme-primary', theme.primary);
            document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
            document.documentElement.setAttribute('data-theme', themeId);
        }
    };

    const handleThemeChange = (themeId) => {
        setSelectedTheme(themeId);
        localStorage.setItem('gym-theme', themeId);
        applyTheme(themeId);
    };

    return (
        <div className="glass rounded-2xl p-4 mb-6 animate-fade-in">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span className="text-sm font-medium text-slate-300">Theme Color</span>
                </div>
                <div className="flex gap-2">
                    {themes.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            className={`group relative w-10 h-10 rounded-lg transition-all duration-300 ${selectedTheme === theme.id
                                    ? 'ring-2 ring-offset-2 ring-offset-slate-900 scale-110'
                                    : 'hover:scale-105'
                                }`}
                            style={{
                                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                                ringColor: theme.primary,
                            }}
                            title={theme.name}
                        >
                            {selectedTheme === theme.id && (
                                <svg className="w-5 h-5 text-white absolute inset-0 m-auto" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
