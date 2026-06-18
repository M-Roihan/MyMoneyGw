import { useState, useRef } from 'react';
import { apiFetch } from '@/utils/api';

export default function UpdatePhotoProfileForm({ onProfileUpdated }) {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            //validasi tipe file
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setErrors({ file: 'Format file harus jpeg, png, jpg, atau gif' });
                return;
            }

            //validasi ukuran file maks 2 mb
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ file: 'Ukuran file tidak boleh lebih dari 2MB' });
                return;
            }

            setErrors({});
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fileInputRef.current?.files?.[0]) {
            setErrors({ file: 'Pilih file terlebih dahulu' });
            return;
        }

        setLoading(true);
        setErrors({});
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('photo_profile', fileInputRef.current.files[0]);

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

            const response = await fetch('/api/profile/photo', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (response.status === 422) {
                const errorMessage = data.message || 'Terjadi kesalahan validasi';
                const errors = data.errors ? Object.values(data.errors).flat().join(', ') : '';
                throw new Error(errors ? `${errorMessage}: ${errors}` : errorMessage);
            }

            if (!response.ok) {
                throw new Error(data.message || `Error: ${response.status} ${response.statusText}`);
            }

            if (data.success) {
                setSuccess(true);
                setSuccessMessage(data.message);
                setPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
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
                <h3 className="text-lg font-semibold text-slate-900">Ubah Foto Profil</h3>
                <p className="text-sm text-slate-600 mt-1">Unggah foto profil baru (jpeg, png, jpg, gif, max 2MB)</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {errors.general}
                    </div>
                )}

                {errors.file && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {errors.file}
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                        {successMessage}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pilih Foto
                    </label>

                    {/* Preview */}
                    {preview && (
                        <div className="mb-4 flex justify-center">
                            <div className="relative w-40 h-40 rounded-lg overflow-hidden border-2 border-blue-400 bg-slate-50">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col w-full h-32 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 cursor-pointer transition">
                            <div className="flex flex-col items-center justify-center pt-7">
                                <svg
                                    className="w-10 h-10 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <p className="pt-1 text-sm tracking-wider text-blue-600 font-medium">
                                    Pilih Foto
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                onChange={handleFileChange}
                                disabled={loading}
                            />
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !preview}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                    {loading ? 'Mengunggah...' : 'Unggah Foto'}
                </button>
            </form>
        </div>
    );
}
