import { useState } from 'react';
import { apiFetch } from '@/utils/api';

export default function UpdatePasswordForm({ onProfileUpdated }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccess(false);

        try {
            const response = await apiFetch('/api/profile/password', {
                method: 'PUT',
                body: JSON.stringify({
                    current_password: currentPassword,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            if (response.success) {
                setSuccess(true);
                setSuccessMessage(response.message);
                setCurrentPassword('');
                setPassword('');
                setPasswordConfirmation('');
                setTimeout(() => {
                    setSuccess(false);
                    if (onProfileUpdated) {
                        onProfileUpdated();
                    }
                }, 2000);
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                const validationErrors = Object.values(error.response.data.errors).flat();
                setErrors({ validation: validationErrors });
            } else if (error.errors) {
                const validationErrors = Object.values(error.errors).flat();
                setErrors({ validation: validationErrors });
            } else {
                setErrors({ general: error.message || 'Terjadi kesalahan pada server.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Ubah Password</h3>
                <p className="text-sm text-slate-600 mt-1">Gunakan kombinasi huruf dan angka untuk keamanan yang lebih baik</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {errors.general}
                    </div>
                )}

                {errors.validation && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        <p className="font-semibold mb-1">Gagal memperbarui password:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            {errors.validation.map((pesan, index) => (
                                <li key={index}>{pesan}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                        {successMessage}
                    </div>
                )}

                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-2">
                        Password Saat Ini
                    </label>
                    <div className="relative">
                        <input
                            id="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Masukkan password saat ini"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                        Password Baru
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password baru"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                        Password harus minimal 6 karakter, hanya mengandung huruf dan angka (tidak boleh ada spasi atau simbol)
                    </p>
                </div>

                <div>
                    <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-slate-700 mb-2">
                        Konfirmasi Password
                    </label>
                    <div className="relative">
                        <input
                            id="passwordConfirmation"
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="Konfirmasi password baru"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPasswordConfirmation ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                    {loading ? 'Menyimpan...' : 'Ubah Password'}
                </button>
            </form>
        </div>
    );
}
