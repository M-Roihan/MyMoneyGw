import React from 'react';

export default function SkeletonCard({ count = 1 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse">
                    <div className="w-full h-4 bg-slate-200 rounded mb-3"></div>
                    <div className="w-3/5 h-8 bg-slate-200 rounded mb-4"></div>
                    <div className="w-2/5 h-3 bg-slate-200 rounded"></div>
                </div>
            ))}
        </>
    );
}
