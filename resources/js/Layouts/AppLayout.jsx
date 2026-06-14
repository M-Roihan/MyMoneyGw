import React, { useState, useEffect } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import { apiFetch } from '@/utils/api';

export default function AppLayout({ children, title }) {
    const { url, props } = usePage();
    const { auth } = props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    const userInitials = auth?.user?.name
        ? auth.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await apiFetch("/api/profile");
                if (response.success) {
                    setUserProfile(response.data);
                }
            } catch (err) {
                console.error("Gagal mengambil profil pengguna:", err.message);
            }
        };

        fetchUserProfile();
    }, []);

    const menuItems = [
        { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
        { name: 'Transaksi', icon: '💳', path: '/transaksi' },
        { name: 'DompetKu', icon: '👛', path: '/dompetku' },
        { name: 'Tabungan', icon: '🎯', path: '/tabungan' },
        { name: 'Laporan', icon: '📊', path: '/laporan' },
        { name: 'About Us', icon: 'ℹ️', path: '/about' },
    ];

    const isActive = (path) => {
        return url.startsWith(path);
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Plus_Jakarta_Sans']">
            {title && <Head title={title} />}

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm text-white font-bold text-xl">
                            F
                        </div>
                        <span className="text-xl font-extrabold text-slate-900 tracking-tight">FinanceKu</span>
                    </div>
                    {/* Mobile close button inside sidebar */}
                    <button 
                        className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
                        onClick={() => setSidebarOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5">
                    {menuItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link 
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                    active 
                                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-50">
                    <Link 
                        href="/profile"
                        className="flex items-center gap-3 px-2 mb-4 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden">
                            {userProfile?.photo_profile ? (
                                <img
                                    src={userProfile.photo_profile}
                                    alt={auth?.user?.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                userInitials
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">{auth?.user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{auth?.user?.email || ''}</p>
                        </div>
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 font-medium transition-colors text-left"
                    >
                        <span className="text-lg">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64 flex flex-col min-h-screen">
                {/* Mobile Header (Hamburger) */}
                <div className="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center px-4 sticky top-0 z-30">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="ml-2 font-bold text-slate-900">{title || 'FinanceKu'}</span>
                </div>

                {/* Page Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
