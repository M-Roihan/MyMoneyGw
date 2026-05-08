import React from 'react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">
                    Selamat Datang di FinanceKu
                </h1>
                <p className="text-gray-600">
                    Jembatan Laravel, React, dan Tailwind CSS berhasil terhubung dengan sempurna!
                </p>
            </div>
        </div>
    );
}