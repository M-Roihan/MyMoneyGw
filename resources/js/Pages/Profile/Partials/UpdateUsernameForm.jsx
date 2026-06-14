import { useState } from 'react';
import { apiFetch } from '@/utils/api';

export default function UpdateUsernameForm({ onProfileUpdated }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccess(false);

        try {
            const response = await apiFetch('/api/profile/username', {
                method: 'PUT',
                body: JSON.stringify({ name }),
            });

            if (response.success) {
                setSuccess(true);
                setSuccessMessage(response.message);
                setName('');
                setTimeout(() => {
                    setSuccess(false);
                    if (onProfileUpdated) {
                        onProfileUpdated();
                    }
                }, 2000);
            }
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Ubah Username</h3>
                <p className="text-sm text-slate-600 mt-1">Perbarui nama pengguna Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {errors.general}
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                        {successMessage}
                    </div>
                )}

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Username Baru
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan username baru"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                    {loading ? 'Menyimpan...' : 'Simpan Username'}
                </button>
            </form>
        </div>
    );
}
