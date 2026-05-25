import React from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function AboutUs() {
    const teamMembers = [
        { name: "Alfi Adriansyah", nim: "2350081106", role: "Backend Developer", desc: "Bertanggung jawab pada arsitektur database dan API Laravel", color: "#2563eb" },
        { name: "Rifky Aditya Kamil", nim: "2350081112", role: "Frontend Developer", desc: "Membangun antarmuka pengguna dengan React dan Tailwind CSS", color: "#10b981" },
        { name: "Muhammad Roihan", nim: "2350081135", role: "Full Stack Developer", desc: "Mengintegrasikan frontend dan backend serta pengujian sistem", color: "#8b5cf6" },
        { name: "Aditya Maulana A", nim: "2350081136", role: "UI/UX Designer", desc: "Merancang desain antarmuka dan pengalaman pengguna", color: "#f59e0b" },
    ];

    const techStack = [
        { name: "Laravel 11", icon: "⚡", color: "bg-red-50 text-red-600" },
        { name: "React 18", icon: "⚛️", color: "bg-blue-50 text-blue-600" },
        { name: "Tailwind CSS", icon: "🎨", color: "bg-cyan-50 text-cyan-600" },
        { name: "Inertia.js", icon: "🔗", color: "bg-purple-50 text-purple-600" },
        { name: "MySQL", icon: "🐬", color: "bg-orange-50 text-orange-600" },
        { name: "Recharts", icon: "📊", color: "bg-emerald-50 text-emerald-600" },
    ];

    return (
        <AppLayout title="About Us">
            {/*ubah font disini bro*/}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                * { transition: all 0.2s ease-in-out; }
                .action-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
                .btn-primary:hover { background: #1d4ed8 !important; transform: scale(1.02); }
                input:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
            `}</style>

            <div className="pb-12">
                {/* SECTION 1 - Hero */}
                <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-24 px-6 text-center rounded-b-[3rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 via-transparent to-transparent"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-4xl font-black shadow-lg mx-auto mb-6 transform -rotate-3">
                            F
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                            FinanceKu
                        </h1>
                        <p className="text-blue-100 text-lg md:text-xl font-medium max-w-xl mx-auto">
                            Solusi cerdas manajemen keuangan pribadi Anda
                        </p>
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 space-y-12">
                    {/* SECTION 2 - Visi & Misi */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-center">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                                👁️
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Visi Kami
                            </h2>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                "Menjadi platform keuangan digital terpercaya
                                yang membantu masyarakat Indonesia mengelola
                                keuangan dengan lebih bijak"
                            </p>
                        </div>
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                                🎯
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Misi Kami
                            </h2>
                            <ul className="space-y-3">
                                {[
                                    "Digitalisasi pencatatan keuangan harian",
                                    "Analisis data melalui representasi visual interaktif",
                                    "Memastikan keamanan dan privasi data pengguna",
                                    "Memberikan antarmuka yang sederhana dan mudah digunakan",
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3 text-slate-600 font-medium"
                                    >
                                        <span className="text-emerald-500 mt-0.5">
                                            ✓
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* SECTION 3 - Tim Pengembang */}
                    <section>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-900">
                                Tim Kami
                            </h2>
                            <p className="text-slate-500 mt-2">
                                Orang-orang hebat di balik berdirinya FinanceKu
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {teamMembers.map((member, idx) => {
                                const initials = member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase();
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                    >
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 transition-transform"
                                            style={{
                                                backgroundColor: member.color,
                                            }}
                                        >
                                            {initials}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-slate-900 leading-none">
                                                    {member.name}
                                                </h3>
                                                <span
                                                    className="px-2.5 py-1 text-xs font-bold rounded-lg self-start sm:self-auto"
                                                    style={{
                                                        backgroundColor: `${member.color}15`,
                                                        color: member.color,
                                                    }}
                                                >
                                                    {member.role}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 font-bold mb-3 font-mono tracking-wider">
                                                NIM: {member.nim}
                                            </p>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                {member.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* SECTION 4 - Tech Stack */}
                    <section className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">
                            Teknologi yang Digunakan
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {techStack.map((tech, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl ${tech.color} font-bold shadow-sm hover:scale-105 transition-transform cursor-default`}
                                >
                                    <span className="text-xl">{tech.icon}</span>
                                    <span>{tech.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 5 - Footer */}
                    <footer className="text-center pt-8 border-t border-slate-200 mt-12 pb-4">
                        <p className="text-slate-500 text-sm font-medium">
                            © 2026 FinanceKu — Program Studi Informatika,
                            Universitas Jenderal Achmad Yani
                        </p>
                    </footer>
                </div>
            </div>
        </AppLayout>
    );
}
