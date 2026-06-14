import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import UpdateUsernameForm from './Partials/UpdateUsernameForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdatePhotoProfileForm from './Partials/UpdatePhotoProfileForm';
import { apiFetch } from '@/utils/api';

export default function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await apiFetch('/api/profile');
            if (response.success) {
                setUserProfile(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdated = () => {
        fetchProfile();
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <AppLayout title="Profil Saya">
                <Head title="Profil Saya" />
                <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin">
                            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <p className="mt-4 text-slate-600">Memuat profil Anda...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Profil Saya">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            `}</style>
            <Head title="Profil Saya" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">Profil Saya</h1>
                        <p className="text-slate-600 mt-2">Kelola informasi akun Anda dengan aman</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {userProfile && (
                        <>
                            {/* Profile Header Card */}
                            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                                <div className="flex flex-col sm:flex-row items-center gap-8">
                                    {/* Photo */}
                                    <div className="flex-shrink-0">
                                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden border-4 border-blue-100 shadow-lg">
                                            {userProfile.photo_profile ? (
                                                <img
                                                    src={userProfile.photo_profile}
                                                    alt={userProfile.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white text-4xl font-bold">
                                                    {userProfile.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h2 className="text-2xl font-bold text-slate-900">{userProfile.name}</h2>
                                        <p className="text-slate-600 mt-1">{userProfile.email}</p>
                                        <p className="text-xs text-slate-500 mt-3">
                                            Anggota sejak {new Date(userProfile.created_at).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Forms Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                {/* Update Photo Profile */}
                                <UpdatePhotoProfileForm onProfileUpdated={handleProfileUpdated} />

                                {/* Update Username */}
                                <UpdateUsernameForm onProfileUpdated={handleProfileUpdated} />
                            </div>

                            {/* Update Password - Full Width */}
                            <UpdatePasswordForm onProfileUpdated={handleProfileUpdated} />
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
