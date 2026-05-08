import React from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: "url('/images/bg-finance.jpg')" }}
        >
            <Head title="Daftar FinanceKu" />
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">FinanceKu</h2>
                <p className="text-center text-gray-600 mb-8">Buat akun untuk kelola keuanganmu</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} 
                               className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} 
                               className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} 
                               className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                        <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} 
                               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <button type="submit" disabled={processing} 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50">
                        {processing ? 'Mendaftar...' : 'Daftar Sekarang'}
                    </button>
                </form>
            </div>
        </div>
    );
}