import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { apiFetch } from '@/utils/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const formatRupiahFull = (v) => `Rp ${Math.round(v).toLocaleString('id-ID')}`;
const formatRupiahShort = (v) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1).replace('.0', '')}Jt`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}Rb`;
    return v;
};

const renderLegendText = (value, entry) => {
    return <span className="text-slate-600 text-sm font-medium">{value}</span>;
};

export default function Laporan() {
    const [dataSummary, setDataSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [monthFilter, setMonthFilter] = useState('Bulan Ini');

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            try {
                // Kirim filter sebagai query param
                const params = new URLSearchParams({ filter: monthFilter });
                const json = await apiFetch(`/api/dashboard/summary?${params}`);
                if (json && json.success) setDataSummary(json.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [monthFilter]);

    // Data parsing
    const tren6Bulan = dataSummary?.tren_6_bulan || [];
    const pengeluaranPerKategori = dataSummary?.pengeluaran_per_kategori || [];
    
    // Sort descending
    const sortedKategori = useMemo(() => {
        return [...pengeluaranPerKategori].sort((a, b) => b.total - a.total);
    }, [pengeluaranPerKategori]);

    const totalPengeluaranKategori = useMemo(() => {
        return pengeluaranPerKategori.reduce((acc, curr) => acc + parseFloat(curr.total), 0);
    }, [pengeluaranPerKategori]);

    const CustomTooltipBar = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
                    <p className="font-bold text-slate-800 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm font-semibold">
                            {entry.name}: {formatRupiahFull(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const CustomTooltipPie = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const percent = totalPengeluaranKategori > 0 ? (data.total / totalPengeluaranKategori) * 100 : 0;
            return (
                <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-1">
                    <p className="font-bold text-slate-800" style={{ color: data.warna }}>{data.kategori}</p>
                    <p className="text-sm font-semibold text-slate-600">{formatRupiahFull(data.total)}</p>
                    <p className="text-xs text-slate-400">{percent.toFixed(1)}% dari total</p>
                </div>
            );
        }
        return null;
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
        if (percent < 0.05) return null; // Don't show label for very small slices
        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <AppLayout title="Laporan">
            {/*ubah font disini bro*/}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                * { transition: all 0.2s ease-in-out; }
                .action-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
                .btn-primary:hover { background: #1d4ed8 !important; transform: scale(1.02); }
                input:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
            `}</style>

            <div className="p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Laporan Keuangan
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Analisis pemasukan dan pengeluaran Anda.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={monthFilter}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-semibold shadow-sm outline-none"
                            >
                                <option value="Bulan Ini">Bulan Ini</option>
                                <option value="Bulan Lalu">Bulan Lalu</option>
                                <option value="Tahun Ini">Tahun Ini</option>
                            </select>
                        </div>
                    </header>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {/* SECTION 1 - Bar Chart */}
                            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-100">
                                <h2 className="text-lg font-bold text-slate-800 mb-6">
                                    Tren Pemasukan & Pengeluaran
                                </h2>
                                <div className="w-full h-[350px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={tren6Bulan}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 10,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                stroke="#f1f5f9"
                                            />
                                            <XAxis
                                                dataKey="bulan"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: "#64748b",
                                                    fontSize: 12,
                                                }}
                                                dy={10}
                                            />
                                            <YAxis
                                                tickFormatter={
                                                    formatRupiahShort
                                                }
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: "#64748b",
                                                    fontSize: 12,
                                                }}
                                                dx={-10}
                                            />
                                            <RechartsTooltip
                                                content={<CustomTooltipBar />}
                                                cursor={{ fill: "#f8fafc" }}
                                            />
                                            <Legend
                                                wrapperStyle={{
                                                    paddingTop: "20px",
                                                }}
                                                iconType="circle"
                                            />
                                            <Bar
                                                dataKey="pemasukan"
                                                name="Pemasukan"
                                                fill="#3b82f6"
                                                radius={[4, 4, 0, 0]}
                                                barSize={30}
                                            />
                                            <Bar
                                                dataKey="pengeluaran"
                                                name="Pengeluaran"
                                                fill="#ef4444"
                                                radius={[4, 4, 0, 0]}
                                                barSize={30}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* SECTION 2 - Pie Chart */}
                                <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-100 flex flex-col">
                                    <h2 className="text-lg font-bold text-slate-800 mb-6">
                                        Pengeluaran per Kategori Bulan Ini
                                    </h2>
                                    {sortedKategori.length > 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                                            <ResponsiveContainer
                                                width="100%"
                                                height={280}
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={sortedKategori}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={
                                                            renderCustomizedLabel
                                                        }
                                                        outerRadius={110}
                                                        dataKey="total"
                                                        nameKey="kategori"
                                                        stroke="none"
                                                    >
                                                        {sortedKategori.map(
                                                            (entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        entry.warna ||
                                                                        "#64748b"
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </Pie>
                                                    <RechartsTooltip
                                                        content={
                                                            <CustomTooltipPie />
                                                        }
                                                    />

                                                    <Legend
                                                        iconType="circle"
                                                        layout="horizontal"
                                                        verticalAlign="bottom"
                                                        align="center"
                                                        formatter={
                                                            renderLegendText
                                                        }
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                                            Tidak ada data pengeluaran bulan
                                            ini.
                                        </div>
                                    )}
                                </div>

                                {/* SECTION 3 - Summary Table */}
                                <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-100 flex flex-col">
                                    <h2 className="text-lg font-bold text-slate-800 mb-6">
                                        Ringkasan Pengeluaran
                                    </h2>
                                    {sortedKategori.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-slate-100">
                                                        <th className="pb-3 text-xs uppercase tracking-wider font-bold text-slate-500">
                                                            Kategori
                                                        </th>
                                                        <th className="pb-3 text-xs uppercase tracking-wider font-bold text-slate-500 text-right">
                                                            Total Pengeluaran
                                                        </th>
                                                        <th className="pb-3 text-xs uppercase tracking-wider font-bold text-slate-500 text-right">
                                                            Persentase
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {sortedKategori.map(
                                                        (cat, idx) => {
                                                            const pct =
                                                                totalPengeluaranKategori >
                                                                0
                                                                    ? (cat.total /
                                                                          totalPengeluaranKategori) *
                                                                      100
                                                                    : 0;
                                                            return (
                                                                <tr
                                                                    key={idx}
                                                                    className="hover:bg-slate-50 transition-colors"
                                                                >
                                                                    <td className="py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div
                                                                                className="w-3 h-3 rounded-full"
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        cat.warna,
                                                                                }}
                                                                            ></div>
                                                                            <span className="font-semibold text-slate-700 text-sm">
                                                                                {
                                                                                    cat.kategori
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 text-right font-medium text-slate-700 text-sm">
                                                                        {formatRupiahFull(
                                                                            cat.total,
                                                                        )}
                                                                    </td>
                                                                    <td className="py-4 text-right font-bold text-slate-600 text-sm">
                                                                        {pct.toFixed(
                                                                            1,
                                                                        )}
                                                                        %
                                                                    </td>
                                                                </tr>
                                                            );
                                                        },
                                                    )}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="border-t-2 border-slate-100">
                                                        <td className="py-4 font-bold text-slate-900 text-sm">
                                                            Total Keseluruhan
                                                        </td>
                                                        <td className="py-4 text-right font-extrabold text-rose-600 text-sm">
                                                            {formatRupiahFull(
                                                                totalPengeluaranKategori,
                                                            )}
                                                        </td>
                                                        <td className="py-4 text-right font-bold text-slate-900 text-sm">
                                                            100%
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                                            Tidak ada data pengeluaran bulan
                                            ini.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
