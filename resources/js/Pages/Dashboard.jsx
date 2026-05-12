import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import "../../css/dashboard.css"; 

const colors = {
    success: "#10b981",
    danger: "#ef4444",
    textMain: "#0f172a",
    textMuted: "#64748b",
};
const MONTHS = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

export default function Dashboard() {
    const [search, setSearch] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({
        type: "pemasukan",
        category_id: "",
        account_id: "",
        amount: "",
        description: "",
        transaction_date: new Date().toISOString().split("T")[0],
    });

    const fetchData = async () => {
        try {
            const [txRes, catRes, accRes] = await Promise.all([
                axios.get("/api/transactions"),
                axios.get("/api/categories"),
                axios.get("/api/accounts"),
            ]);
            setTransactions(txRes.data.data || []);
            setCategories(catRes.data.data || []);
            setAccounts(accRes.data.data || []);
        } catch (error) {
            console.error("Gagal:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalSaldo = transactions.reduce(
        (acc, curr) =>
            curr.type === "pemasukan"
                ? acc + parseFloat(curr.amount)
                : acc - parseFloat(curr.amount),
        0,
    );
    const currentMonthTransactions = transactions.filter(
        (tx) =>
            new Date(tx.transaction_date).getMonth() === currentMonth &&
            new Date(tx.transaction_date).getFullYear() === currentYear,
    );
    const incomeThisMonth = currentMonthTransactions.reduce(
        (acc, curr) =>
            curr.type === "pemasukan" ? acc + parseFloat(curr.amount) : acc,
        0,
    );
    const expenseThisMonth = currentMonthTransactions.reduce(
        (acc, curr) =>
            curr.type === "pengeluaran" ? acc + parseFloat(curr.amount) : acc,
        0,
    );

    const prevMonth = () =>
        currentMonth === 0
            ? (setCurrentMonth(11), setCurrentYear(currentYear - 1))
            : setCurrentMonth(currentMonth - 1);
    const nextMonth = () =>
        currentMonth === 11
            ? (setCurrentMonth(0), setCurrentYear(currentYear + 1))
            : setCurrentMonth(currentMonth + 1);

    const handleSaveTransaction = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await axios.post("/api/transactions", form);
            setShowModal(false);
            setForm({ ...form, amount: "", description: "" });
            fetchData();
        } catch (error) {
            alert("Gagal menyimpan transaksi.");
        } finally {
            setIsSaving(false);
        }
    };

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);

    return (
        <div className="dashboard-wrapper">
            <Sidebar />

            <main className="main-content">
                <Header search={search} setSearch={setSearch} />

                <div className="content-pad">
                    {/* GRID STATISTIK UTAMA */}
                    <div className="grid-3">
                        <div className="action-card card-dark">
                            <p
                                style={{
                                    fontSize: "13px",
                                    opacity: 0.7,
                                    marginBottom: "8px",
                                }}
                            >
                                TOTAL SALDO SAYA
                            </p>
                            <h2 style={{ fontSize: "32px", fontWeight: 800 }}>
                                {formatRupiah(totalSaldo)}
                            </h2>
                            <div
                                style={{
                                    position: "absolute",
                                    right: "-20px",
                                    bottom: "-20px",
                                    width: "100px",
                                    height: "100px",
                                    background: "rgba(37, 99, 235, 0.2)",
                                    borderRadius: "50%",
                                    filter: "blur(30px)",
                                }}
                            ></div>
                        </div>

                        <div className="action-card card-light">
                            <p
                                style={{
                                    fontSize: "13px",
                                    color: colors.textMuted,
                                    marginBottom: "8px",
                                }}
                            >
                                PEMASUKAN {MONTHS[currentMonth].toUpperCase()}
                            </p>
                            <h2
                                style={{
                                    fontSize: "28px",
                                    fontWeight: 800,
                                    color: colors.success,
                                }}
                            >
                                +{formatRupiah(incomeThisMonth)}
                            </h2>
                        </div>

                        <div className="action-card card-light">
                            <p
                                style={{
                                    fontSize: "13px",
                                    color: colors.textMuted,
                                    marginBottom: "8px",
                                }}
                            >
                                PENGELUARAN {MONTHS[currentMonth].toUpperCase()}
                            </p>
                            <h2
                                style={{
                                    fontSize: "28px",
                                    fontWeight: 800,
                                    color: colors.danger,
                                }}
                            >
                                -{formatRupiah(expenseThisMonth)}
                            </h2>
                        </div>
                    </div>

                    {/* GRID TRANSAKSI & TARGET */}
                    <div className="grid-2-sidebar">
                        <section>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "24px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: 800,
                                        }}
                                    >
                                        Riwayat Transaksi
                                    </h3>
                                    <div
                                        className="card-light"
                                        style={{
                                            padding: "4px",
                                            borderRadius: "10px",
                                            display: "flex",
                                        }}
                                    >
                                        <button
                                            onClick={prevMonth}
                                            className="btn-icon"
                                        >
                                            ←
                                        </button>
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: 700,
                                                minWidth: "100px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {MONTHS[currentMonth]} {currentYear}
                                        </span>
                                        <button
                                            onClick={nextMonth}
                                            className="btn-icon"
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="btn-primary"
                                >
                                    <span>+</span> Tambah
                                </button>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                }}
                            >
                                {currentMonthTransactions.length === 0 ? (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "40px",
                                            color: colors.textMuted,
                                            border: "1px dashed #cbd5e1",
                                            borderRadius: "24px",
                                        }}
                                    >
                                        Belum ada transaksi di bulan ini.
                                    </div>
                                ) : (
                                    currentMonthTransactions.map((tx) => (
                                        <div
                                            key={tx.id}
                                            className="action-card tx-item"
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "20px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        borderRadius: "15px",
                                                        background:
                                                            tx.type ===
                                                            "pemasukan"
                                                                ? "#ecfdf5"
                                                                : "#fef2f2",
                                                        color:
                                                            tx.type ===
                                                            "pemasukan"
                                                                ? colors.success
                                                                : colors.danger,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        fontSize: "22px",
                                                    }}
                                                >
                                                    {tx.type === "pemasukan"
                                                        ? "↓"
                                                        : "↑"}
                                                </div>
                                                <div>
                                                    <p
                                                        style={{
                                                            fontWeight: 800,
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        {tx.description}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: "12px",
                                                            color: colors.textMuted,
                                                        }}
                                                    >
                                                        {tx.category?.name} •{" "}
                                                        {tx.account?.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <p
                                                style={{
                                                    fontWeight: 800,
                                                    fontSize: "18px",
                                                    color:
                                                        tx.type === "pemasukan"
                                                            ? colors.success
                                                            : colors.danger,
                                                }}
                                            >
                                                {tx.type === "pemasukan"
                                                    ? "+"
                                                    : "-"}
                                                {formatRupiah(tx.amount)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            {/* MODAL FORM */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "24px",
                            }}
                        >
                            <h2 style={{ fontSize: "20px", fontWeight: 800 }}>
                                Tambah Transaksi
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn-icon"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSaveTransaction}>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    marginBottom: "20px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setForm({ ...form, type: "pemasukan" })
                                    }
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        borderRadius: "12px",
                                        border:
                                            form.type === "pemasukan"
                                                ? `2px solid ${colors.success}`
                                                : "1px solid #e2e8f0",
                                        cursor: "pointer",
                                    }}
                                >
                                    Pemasukan
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setForm({
                                            ...form,
                                            type: "pengeluaran",
                                        })
                                    }
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        borderRadius: "12px",
                                        border:
                                            form.type === "pengeluaran"
                                                ? `2px solid ${colors.danger}`
                                                : "1px solid #e2e8f0",
                                        cursor: "pointer",
                                    }}
                                >
                                    Pengeluaran
                                </button>
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "16px",
                                    marginBottom: "16px",
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Dompet / Akun
                                    </label>
                                    <select
                                        required
                                        className="form-input"
                                        value={form.account_id}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                account_id: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Pilih Akun...</option>
                                        {accounts.map((acc) => (
                                            <option key={acc.id} value={acc.id}>
                                                {acc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Kategori
                                    </label>
                                    <select
                                        required
                                        className="form-input"
                                        value={form.category_id}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                category_id: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Pilih Kategori...
                                        </option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "16px",
                                    marginBottom: "16px",
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Nominal (Rp)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        className="form-input"
                                        value={form.amount}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                amount: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Tanggal
                                    </label>
                                    <input
                                        required
                                        type="date"
                                        className="form-input"
                                        value={form.transaction_date}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                transaction_date:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                <label
                                    style={{
                                        fontSize: "13px",
                                        fontWeight: 700,
                                    }}
                                >
                                    Keterangan
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="form-input"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn-primary"
                                style={{
                                    width: "100%",
                                    justifyContent: "center",
                                }}
                            >
                                {isSaving ? "Menyimpan..." : "Simpan Transaksi"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
