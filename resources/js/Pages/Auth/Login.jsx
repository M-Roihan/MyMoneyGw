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
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 md:p-10"
            style={{ backgroundImage: "url('/images/bg-finance.jpg')" }}
        >
            <Head title="Login FinanceKu" />

            <div className="w-full max-w-6xl bg-white/40 backdrop-blur-md border border-white/10 rounded-[40px] shadow-2xl flex flex-col lg:flex-row overflow-hidden">
                
                <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                            Finance<span className="text-blue-800">Ku.</span>
                        </h1>
                        <div className="w-20 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-2xl font-extrabold text-black leading-relaxed max-w-md">
                            Solusi cerdas untuk manajemen keuangan Anda. Pantau arus kas, 
                            simpan riwayat transaksi, dan buat rencana masa depan lebih terarah.
                        </p>
                    </div>
                </div>

                {/* Bagian Kanan: Container Form dengan Background yang Sedikit Berbeda */}
                <div className="flex-1 p-6 md:p-12 bg-white/5 flex items-center justify-center">
                    
                    {/* --- CARD FORM LOGIN (Nested Card) --- */}
                    <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                        <div className="mb-8">
                            <h2 className="text-4xl font-bold text-black">Selamat Datang</h2>
                            <p className="text-black text-lg">Silahkan masuk ke akun Anda</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm uppercase tracking-widest font-extrabold text-black mb-2 ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    className={`w-full px-4 py-3 font-bold bg-black/10 border rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none transition duration-200 ${errors.email ? 'border-red-500' : 'border-white/10'}`} 
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest font-extrabold text-black mb-2 ml-1">Password</label>
                                <input 
                                    type="password" 
                                    value={data.password} 
                                    onChange={e => setData('password', e.target.value)} 
                                    className={`w-full px-4 py-3 font-bold bg-black/10 border rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none transition duration-200 ${errors.password ? 'border-red-500' : 'border-white/10'}`} 
                                />
                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center text-black font-bold cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={data.remember} 
                                        onChange={e => setData('remember', e.target.checked)} 
                                        className="mr-2 rounded border-black/50 bg-transparent text-blue-500 focus:ring-blue-500" 
                                    />
                                    <span className="group-hover:text-blue-500 transition">Ingat Saya</span>
                                </label>
                                <Link href="#" className="text-blue-600 hover:text-blue-300 transition font-medium">Lupa Password?</Link>
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
                            >
                                {processing ? 'Menghubungkan...' : 'Masuk Ke Akun'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-black mt-8">
                            Baru di FinanceKu? <Link href="/register" className="text-blue-500 font-bold hover:underline decoration-blue-500 underline-offset-4">Buat Akun Baru</Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}