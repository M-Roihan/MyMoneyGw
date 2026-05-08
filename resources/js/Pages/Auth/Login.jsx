import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: "url('/images/bg-finance.jpg')" }}
        >
            <Head title="Login FinanceKu" />
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-blue-600">FinanceKu</h2>
                    <p className="text-gray-500">Silakan masuk ke akun Anda</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            value={data.email} 
                            onChange={e => setData('email', e.target.value)} 
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
                        />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            value={data.password} 
                            onChange={e => setData('password', e.target.value)} 
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`} 
                        />
                        {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-gray-600">
                            <input 
                                type="checkbox" 
                                checked={data.remember} 
                                onChange={e => setData('remember', e.target.checked)} 
                                className="mr-2 rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500" 
                            />
                            Ingat Saya
                        </label>
                        <Link href="#" className="text-sm text-blue-600 hover:underline">Lupa Password?</Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                        {processing ? 'Masuk...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar di sini</Link>
                </p>
            </div>
        </div>
    );
}