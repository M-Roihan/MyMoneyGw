import React, { useEffect, useState } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger slide-in animation
        requestAnimationFrame(() => {
            setIsVisible(true);
        });

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for slide-out animation before unmounting
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const typeConfig = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-400',
            text: 'text-green-800',
            icon: '✓',
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-400',
            text: 'text-red-800',
            icon: '✗',
        },
        warning: {
            bg: 'bg-amber-50',
            border: 'border-amber-400',
            text: 'text-amber-800',
            icon: '⚠',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-400',
            text: 'text-blue-800',
            icon: 'ℹ',
        },
    };

    const currentStyle = typeConfig[type] || typeConfig.info;

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-300 transform font-['Plus_Jakarta_Sans'] ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <div
                className={`flex items-start gap-3 p-4 rounded-2xl shadow-lg border-l-4 min-w-[300px] ${currentStyle.bg} ${currentStyle.border} ${currentStyle.text}`}
            >
                <div className="flex-shrink-0 mt-0.5 font-bold">
                    {currentStyle.icon}
                </div>
                <div className="flex-1 text-sm font-medium pr-4">
                    {message}
                </div>
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-auto opacity-60 hover:opacity-100 transition-opacity focus:outline-none"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
