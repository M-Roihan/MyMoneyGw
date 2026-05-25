import React from 'react';

export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 w-full text-center font-['Plus_Jakarta_Sans']">
            {icon && <div className="text-6xl mb-4">{icon}</div>}
            {title && <h3 className="text-xl font-bold text-gray-700 mt-4">{title}</h3>}
            {description && <p className="text-gray-400 text-sm mt-2 text-center max-w-xs">{description}</p>}
            
            {actionLabel && onAction && (
                <button 
                    onClick={onAction}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold rounded-2xl px-6 py-3 mt-6"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
