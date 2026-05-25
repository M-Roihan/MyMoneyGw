import { useEffect, useMemo, useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Toast from '../Components/Toast';
import { formatRupiah, getGreeting } from '@/utils/format';
import { apiFetch } from '@/utils/api';
// --- KONFIGURASI WARNA PREMIUM ---
const colors = {
    primary: "#2563eb",
    secondary: "#1e293b",
    success: "#10b981",
    danger: "#ef4444",
    background: "#f8fafc",
    card: "#ffffff",
    textMain: "#0f172a",
    textMuted: "#64748b",
};

const categoryStyle = {
    Gaji: { color: "#10b981", bg: "#ecfdf5", icon: "💰" },
    Belanja: { color: "#f59e0b", bg: "#fffbeb", icon: "🛒" },
    Makan: { color: "#ec4899", bg: "#fdf2f8", icon: "🍜" },
    Hiburan: { color: "#6366f1", bg: "#eef2ff", icon: "🎮" },
    Default: { color: "#64748b", bg: "#f1f5f9", icon: "📦" },
};

export default function DashboardPremium() {
    const now = useMemo(() => new Date(), []);
    const [currentMonth] = useState(now.getMonth());
    const [currentYear] = useState(now.getFullYear());

    const greeting = useMemo(() => getGreeting(), []);

    const [showModal, setShowModal] = useState(false);

    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const showToast = (message, type = 'info') => setToast({ show: true, message, type });

    // Data dari backend
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactionsByDate, setTransactionsByDate] = useState({});
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [savings, setSavings] = useState([]);

    const { auth } = usePage().props;
    const user = auth.user;

    // Saldo real-time (polling)
    const [saldo, setSaldo] = useState(null);
    const [saldoError, setSaldoError] = useState(null);
    const [saldoLoading, setSaldoLoading] = useState(true);

    // Form tambah transaksi
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        type: "pemasukan",
        category_id: "",
        account_id: "",
        amount: "",
        description: "",
        transaction_date: now.toISOString().split("T")[0],
        saving_id: null,
    });

    // Header search (sementara hanya untuk transaksi yang render)
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchSaldo = async () => {
            try {
                setSaldoLoading(true);
                setSaldoError(null);

                const json = await apiFetch("/api/summary/saldo");
                if (!json || !json.success) throw new Error("Gagal mengambil saldo");
                setSaldo(json.data || null);
            } catch (e) {
                setSaldoError(e.message || "Terjadi kesalahan");
            } finally {
                setSaldoLoading(false);
            }
        };

        const fetchAll = async () => {
            try {
                setLoading(true);
                setError(null);

                const [txJson, catJson, accJson, savJson] = await Promise.all([
                    apiFetch("/api/transactions"),
                    apiFetch("/api/categories"),
                    apiFetch("/api/accounts"),
                    apiFetch("/api/savings"),
                ]);

                if (!txJson) throw new Error("Gagal mengambil transaksi");
                if (!catJson) throw new Error("Gagal mengambil kategori");
                if (!accJson) throw new Error("Gagal mengambil akun");
                if (!savJson) throw new Error("Gagal mengambil tabungan");

                setCategories(catJson.data || []);
                setAccounts(accJson.data || []);
                setSavings(savJson.data || []);

                const grouped = {};
                (txJson.data || []).forEach((tx) => {
                    const dateKey = tx.transaction_date;
                    if (!grouped[dateKey]) grouped[dateKey] = [];
                    grouped[dateKey].push({
                        id: tx.id,
                        type: tx.type,
                        category: tx.category?.name || "Uncategorized",
                        account: tx.account?.name || "",
                        amount: parseFloat(tx.amount),
                        description: tx.description,
                        transaction_date: tx.transaction_date,
                        category_id: tx.category_id,
                        account_id: tx.account_id,
                        saving_id: tx.saving_id || null,
                    });
                });

                setTransactionsByDate(grouped);
            } catch (e) {
                setError(e.message || "Terjadi kesalahan");
            } finally {
                setLoading(false);
            }
        };

        fetchSaldo();
        fetchAll();

        const intervalId = setInterval(() => {
            fetchSaldo();
        }, 4000);

        return () => clearInterval(intervalId);
    }, []);

    const recentTransactions = useMemo(() => {
        let allTxs = Object.values(transactionsByDate).flat();
        allTxs.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
        
        const q = search.trim().toLowerCase();
        if (q) {
            allTxs = allTxs.filter((tx) =>
                (tx.description || "").toLowerCase().includes(q) ||
                (tx.category || "").toLowerCase().includes(q)
            );
        }
        return allTxs.slice(0, 5);
    }, [transactionsByDate, search]);

    async function handleAddTransaction() {
        if (
            !form.category_id ||
            !form.account_id ||
            !form.amount ||
            !form.description
        ) {
            showToast('Mohon isi semua field yang wajib', 'warning');
            return;
        }

        try {
            setSaving(true);

            const payload = {
                category_id: form.category_id,
                account_id: form.account_id,
                type: form.type,
                amount: parseFloat(form.amount),
                description: form.description,
                transaction_date: form.transaction_date,
                saving_id: form.saving_id || null,
            };

            const result = await apiFetch("/api/transactions", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            const created = result.data;

            const dateKey = created.transaction_date;
            const newTx = {
                id: created.id,
                type: created.type,
                category: created.category?.name || "Uncategorized",
                account: created.account?.name || "",
                amount: parseFloat(created.amount),
                description: created.description,
                transaction_date: created.transaction_date,
                category_id: created.category_id,
                account_id: created.account_id,
                saving_id: created.saving_id || null,
            };

            setTransactionsByDate((prev) => ({
                ...prev,
                [dateKey]: [newTx, ...(prev[dateKey] || [])],
            }));

            setShowModal(false);
            setForm({
                type: "pemasukan",
                category_id: "",
                account_id: "",
                amount: "",
                description: "",
                transaction_date: new Date().toISOString().split("T")[0],
                saving_id: null,
            });

            showToast('Transaksi berhasil disimpan!', 'success');
        } catch (e) {
            showToast(e.message || 'Terjadi kesalahan', 'error');
        } finally {
            setSaving(false);
        }
    }

    return (
        <AppLayout title="Dashboard">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                * { transition: all 0.2s ease-in-out; }
                .action-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
                .btn-primary:hover { background: #1d4ed8 !important; transform: scale(1.02); }
                input:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
            `}</style>
            
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({...toast, show: false})} />}
            
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: colors.background }}>
                
                {/* --- HEADER --- */}
                <header style={{ height: "90px", background: "rgba(248, 250, 252, 0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 40 }}>
                    <div>
                        <p style={{ fontSize: "14px", color: colors.textMuted, fontWeight: 500 }}>Halo, {greeting}!</p>
                        <h1 style={{ fontSize: "20px", fontWeight: 800, color: colors.textMain }}>Ringkasan Keuangan</h1>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <div style={{ position: "relative" }}>
                            <input 
                                type="text" 
                                placeholder="Cari apapun..." 
                                style={{ padding: "12px 16px 12px 45px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#fff", width: "260px", fontSize: "14px" }} 
                            />
                            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}>🔍</span>
                        </div>
                        <div style={{ width: "45px", height: "45px", borderRadius: "14px", background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "20px" }}>🔔</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingLeft: "12px", borderLeft: "1px solid #e2e8f0" }}>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ fontSize: "14px", fontWeight: 700 }}>{user.name}</p>
                                <p style={{ fontSize: "12px", color: colors.textMuted }}>Premium User</p>
                            </div>
                            <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: "linear-gradient(45deg, #cbd5e1, #94a3b8)", border: "2px solid #fff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}></div>
                        </div>
                    </div>
                </header>

                <div style={{ padding: "0 40px 40px 40px" }}>
                    
                    {/* --- KARTU UTAMA (RINGKASAN) --- */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "40px" }}>
                        <div className="action-card" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", padding: "32px", borderRadius: "32px", color: "#fff", position: "relative", overflow: "hidden" }}>
                            <p style={{ fontSize: "14px", opacity: 0.7, marginBottom: "8px", fontWeight: 600 }}>TOTAL SALDO SAYA</p>
                            <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "24px" }}>
                                {saldoLoading ? "..." : saldo ? formatRupiah(saldo.total_saldo) : "Rp 0"}
                            </h2>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <div style={{ padding: "8px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.1)", fontSize: "13px", fontWeight: 600 }}>+2.4% bln ini</div>
                            </div>
                            <div style={{ position: "absolute", right: "-20px", bottom: "-20px", width: "120px", height: "120px", background: "rgba(37, 99, 235, 0.2)", borderRadius: "50%", filter: "blur(40px)" }}></div>
                        </div>

                        {[
                            { label: "PEMASUKAN", amount: saldoLoading ? "..." : saldo ? formatRupiah(saldo.pemasukan) : "Rp 0", color: colors.success, icon: "📈" },
                            { label: "PENGELUARAN", amount: saldoLoading ? "..." : saldo ? formatRupiah(saldo.pengeluaran) : "Rp 0", color: colors.danger, icon: "📉" },
                        ].map((stat) => (
                            <div key={stat.label} className="action-card" style={{ background: "#fff", padding: "32px", borderRadius: "32px", border: "1px solid #e2e8f0" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                    <p style={{ fontSize: "14px", color: colors.textMuted, fontWeight: 700 }}>{stat.label}</p>
                                    <span style={{ fontSize: "24px" }}>{stat.icon}</span>
                                </div>
                                <h2 style={{ fontSize: "28px", fontWeight: 800, color: colors.textMain }}>{stat.amount}</h2>
                                <p style={{ fontSize: "13px", color: stat.color, fontWeight: 600, marginTop: "8px" }}>Lihat detail transaksi →</p>
                            </div>
                        ))}
                    </div>

                    {/* --- TRANSAKSI TERBARU & TARGET --- */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px" }}>
                        
                        <section>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                                <h3 style={{ fontSize: "20px", fontWeight: 800 }}>Transaksi Terakhir</h3>
                                <button className="btn-primary" style={{ padding: "12px 24px", borderRadius: "14px", border: "none", background: colors.primary, color: "#fff", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }} onClick={() => setShowModal(true)}>
                                    <span>+</span> Tambah Baru
                                </button>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {loading && (
                                    <div className="action-card" style={{ padding: "20px 24px", borderRadius: "24px", border: "1px solid #f1f5f9", background: "#fff", color: colors.textMuted }}>
                                        Loading transaksi...
                                    </div>
                                )}
                                {!loading && error && (
                                    <div className="action-card" style={{ padding: "20px 24px", borderRadius: "24px", border: "1px solid #fee2e2", background: "#fff", color: "#b91c1c" }}>
                                        Error: {error}
                                    </div>
                                )}
                                {!loading && !error && recentTransactions.length === 0 && (
                                    <div className="action-card" style={{ padding: "20px 24px", borderRadius: "24px", border: "1px solid #f1f5f9", background: "#fff", color: colors.textMuted }}>
                                        Tidak ada transaksi.
                                    </div>
                                )}
                                {!loading && !error && recentTransactions.map((tx) => {
                                    const styleKey = tx.category in categoryStyle ? tx.category : "Default";
                                    const cs = categoryStyle[styleKey];
                                    const isIncome = tx.type === "pemasukan";

                                    return (
                                        <div
                                            key={tx.id}
                                            className="action-card"
                                            style={{
                                                background: "#fff",
                                                padding: "20px 24px",
                                                borderRadius: "24px",
                                                border: "1px solid #f1f5f9",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                                <div
                                                    style={{
                                                        width: "56px",
                                                        height: "56px",
                                                        borderRadius: "18px",
                                                        background: cs.bg,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "24px",
                                                    }}
                                                >
                                                    {cs.icon}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 800, fontSize: "16px", color: colors.textMain }}>
                                                        {tx.category}
                                                    </p>
                                                    <p style={{ fontSize: "13px", color: colors.textMuted, fontWeight: 500 }}>
                                                        {new Date(tx.transaction_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                        {tx.account ? ` • ${tx.account}` : ""}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <p style={{ fontWeight: 800, fontSize: "18px", color: isIncome ? colors.success : colors.danger }}>
                                                    {isIncome ? "+" : "-"}
                                                    Rp {Math.round(tx.amount).toLocaleString("id-ID")}
                                                </p>
                                                <div style={{ fontSize: "11px", color: colors.textMuted, background: "#f1f5f9", padding: "2px 8px", borderRadius: "6px", display: "inline-block", marginTop: "4px" }}>
                                                    {isIncome ? "Pemasukan" : "Pengeluaran"}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {!loading && !error && recentTransactions.length > 0 && (
                                    <div style={{ textAlign: "center", marginTop: "8px" }}>
                                        <Link href="/transaksi" style={{ color: colors.primary, fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                                            Lihat Semua Transaksi →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </section>

                        <aside style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <div style={{ background: "#fff", padding: "32px", borderRadius: "32px", border: "1px solid #e2e8f0" }}>
                                <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "20px" }}>🎯 Target Tabungan</h3>
                                {loading ? (
                                    <p style={{ fontSize: "14px", color: colors.textMuted }}>Loading...</p>
                                ) : savings.length === 0 ? (
                                    <p style={{ fontSize: "14px", color: colors.textMuted, marginBottom: "24px" }}>Belum ada target tabungan.</p>
                                ) : (
                                    savings.map(saving => {
                                        const percentage = saving.target_amount > 0 ? Math.min(100, Math.round((saving.current_amount / saving.target_amount) * 100)) : 0;
                                        return (
                                            <div key={saving.id} style={{ marginBottom: "24px" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                                    <span style={{ fontSize: "14px", fontWeight: 700 }}>{saving.name}</span>
                                                    <span style={{ fontSize: "14px", fontWeight: 800, color: colors.primary }}>{percentage}%</span>
                                                </div>
                                                <div style={{ height: "12px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                                                    <div style={{ width: `${percentage}%`, height: "100%", background: "linear-gradient(90deg, #2563eb, #60a5fa)", borderRadius: "10px" }}></div>
                                                </div>
                                                <p style={{ fontSize: "12px", color: colors.textMuted, marginTop: "10px" }}>Terkumpul: <b style={{ color: colors.textMain }}>{formatRupiah(saving.current_amount)}</b> / {formatRupiah(saving.target_amount)}</p>
                                            </div>
                                        );
                                    })
                                )}
                                <button style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "none", fontWeight: 700, cursor: "pointer", color: colors.textMain }}>Tambah Tabungan</button>
                            </div>

                            <div style={{ background: "linear-gradient(135deg, #4338ca 0%, #312e81 100%)", padding: "32px", borderRadius: "32px", color: "#fff" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>Butuh Bantuan?</h3>
                                <p style={{ fontSize: "13px", opacity: 0.8, marginBottom: "20px" }}>Hubungi tim support kami jika Anda menemukan kendala.</p>
                                <button style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "#fff", color: "#312e81", fontWeight: 800, fontSize: "13px" }}>Buka Tiket</button>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <footer style={{ marginTop: "auto", padding: "40px", borderTop: "1px solid #e2e8f0", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: colors.textMain }}>FinanceKu v2.4.0</p>
                        <p style={{ fontSize: "12px", color: colors.textMuted }}>© 2026 PT. Keuangan Digital Indonesia. Seluruh hak cipta dilindungi.</p>
                    </div>
                    <div style={{ display: "flex", gap: "32px" }}>
                        {["Kebijakan Privasi", "Syarat & Ketentuan", "Bantuan"].map(link => (
                            <a key={link} href="#" style={{ fontSize: "13px", fontWeight: 600, color: colors.textMuted, textDecoration: "none" }}>{link}</a>
                        ))}
                    </div>
                </footer>

            {/* --- MODAL TAMBAH TRANSAKSI --- */}
            {showModal && (
                <div
                    onClick={() => setShowModal(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 999,
                        backdropFilter: "blur(4px)",
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "100%",
                            maxWidth: 460,
                            background: "#fff",
                            borderRadius: 20,
                            padding: 24,
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 900, color: colors.textMain }}>Tambah Transaksi</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 12,
                                    border: "1px solid #e5e7eb",
                                    background: "#fff",
                                    cursor: "pointer",
                                    color: "#64748b",
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {error && (
                            <div style={{ marginBottom: 14, padding: 12, background: "#fee2e2", borderRadius: 12, color: "#991b1b", fontWeight: 700 }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div style={{ gridColumn: "span 2" }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6, color: colors.textMain }}>Tipe</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", fontWeight: 700 }}
                                >
                                    <option value="pemasukan">Pemasukan</option>
                                    <option value="pengeluaran">Pengeluaran</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6, color: colors.textMain }}>Kategori</label>
                                <select
                                    value={form.category_id}
                                    onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", fontWeight: 700 }}
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6, color: colors.textMain }}>Akun</label>
                                <select
                                    value={form.account_id}
                                    onChange={(e) => setForm((f) => ({ ...f, account_id: e.target.value }))}
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", fontWeight: 700 }}
                                >
                                    <option value="">-- Pilih Akun --</option>
                                    {accounts.map((a) => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6, color: colors.textMain }}>Tanggal</label>
                                <input
                                    type="date"
                                    value={form.transaction_date}
                                    onChange={(e) => setForm((f) => ({ ...f, transaction_date: e.target.value }))}
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", fontWeight: 700 }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6, color: colors.textMain }}>Jumlah (Rp)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.amount}
                                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                                    placeholder="cth: 500000"
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", fontWeight: 700 }}
                                />
                            </div>

                            <div style={{ gridColumn: "span 2" }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6, color: colors.textMain }}>Deskripsi</label>
                                <input
                                    type="text"
                                    value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    placeholder="Keterangan singkat..."
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", fontWeight: 700 }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAddTransaction}
                            disabled={saving}
                            style={{
                                width: "100%",
                                marginTop: 18,
                                padding: "12px 16px",
                                borderRadius: 14,
                                border: "none",
                                cursor: saving ? "not-allowed" : "pointer",
                                background: saving ? "#94a3b8" : colors.primary,
                                color: "#fff",
                                fontWeight: 900,
                                fontSize: 15,
                            }}
                        >
                            {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </div>
            )}

            </div>
        </AppLayout>
    );
}

