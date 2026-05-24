import React from 'react';

export default function SkeletonTable({ rows = 5 }) {
    return (
        <div className="w-full overflow-x-auto bg-white rounded-3xl shadow-sm border border-slate-200">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div></th>
                        <th className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div></th>
                        <th className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-48 animate-pulse"></div></th>
                        <th className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {Array.from({ length: rows }).map((_, idx) => (
                        <tr key={idx}>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20 animate-pulse"></div></td>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-28 animate-pulse"></div></td>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full max-w-xs animate-pulse"></div></td>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16 animate-pulse"></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
