import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';

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
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 md:p-10"
            style={{ backgroundImage: "url('/images/bg-finance.jpg')" }}
        >
            <Head title="Daftar FinanceKu" />

            {/* --- CARD BESAR UTAMA (Parent Glass) --- */}
            <div className="w-full max-w-6xl bg-white/40 backdrop-blur-md border border-white/10 rounded-[40px] shadow-2xl flex flex-col lg:flex-row overflow-hidden">
                
                {/* Bagian Kiri: Teks Penjelasan */}
                <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                            Finance<span className="text-blue-800">Ku.</span>
                        </h1>
                        <div className="w-20 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-2xl font-extrabold text-black leading-relaxed max-w-md">
                            Mulai langkah awal menuju kebebasan finansial. Daftar sekarang dan nikmati kemudahan mencatat setiap transaksi dalam satu aplikasi.
                        </p>
                    </div>
                </div>

                {/* Bagian Kanan: Container Form */}
                <div className="flex-1 p-6 md:p-12 bg-white/5 flex items-center justify-center">
                    
                    {/* --- CARD FORM REGISTRASI (Nested Card) --- */}
                    <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                        <div className="mb-8">
                            <h2 className="text-4xl font-bold text-black">Buat Akun Baru</h2>
                            <p className="text-black text-lg font-medium">Lengkapi data untuk memulai manajemen keuanganmu.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Input Nama */}
                            <div>
                                <label className="block text-sm uppercase tracking-widest font-extrabold text-black mb-1.5 ml-1">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    className={`w-full px-4 py-2.5 font-bold bg-black/10 border rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none transition duration-200 ${errors.name ? 'border-red-500' : 'border-white/10'}`} 
                                />
                                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Input Email */}
                            <div>
                                <label className="block text-sm uppercase tracking-widest font-extrabold text-black mb-1.5 ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    className={`w-full px-4 py-2.5 font-bold bg-black/10 border rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none transition duration-200 ${errors.email ? 'border-red-500' : 'border-white/10'}`} 
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Input Password */}
                            <div>
                                <label className="block text-sm uppercase tracking-widest font-extrabold text-black mb-1.5 ml-1">Password</label>
                                <input 
                                    type="password" 
                                    value={data.password} 
                                    onChange={e => setData('password', e.target.value)} 
                                    className={`w-full px-4 py-2.5 font-bold bg-black/10 border rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none transition duration-200 ${errors.password ? 'border-red-500' : 'border-white/10'}`} 
                                />
                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Input Konfirmasi Password */}
                            <div>
                                <label className="block text-sm uppercase tracking-widest font-extrabold text-black mb-1.5 ml-1">Konfirmasi Password</label>
                                <input 
                                    type="password" 
                                    value={data.password_confirmation} 
                                    onChange={e => setData('password_confirmation', e.target.value)} 
                                    className={`w-full px-4 py-2.5 font-bold bg-black/10 border rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none transition duration-200 ${errors.password ? 'border-red-500' : 'border-white/10'}`}
                                />
                                {errors.password_confirmation && <p className="text-red-400 text-xs mt-1">{errors.password_confirmation}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition duration-300 shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
                            >
                                {processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-black mt-6">
                            Sudah punya akun? <Link href="/login" className="text-blue-500 font-bold hover:underline decoration-blue-500 underline-offset-8">Masuk di sini</Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}