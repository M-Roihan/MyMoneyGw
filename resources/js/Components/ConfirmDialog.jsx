import React from 'react';

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Konfirmasi',
    onConfirm,
    onCancel,
    danger = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-['Plus_Jakarta_Sans']">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            ></div>

            {/* Modal Card */}
            <div className="relative bg-white rounded-3xl w-full max-w-md p-6 m-4 shadow-2xl transform transition-all">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    {message}
                </p>

                <div className="flex items-center justify-end gap-3 mt-4">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            danger
                                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
