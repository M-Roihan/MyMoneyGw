import { useState, useEffect } from "react";

const categoryColors = {
    Gaji: "#d1fae5",
    Bonus: "#dbeafe",
    Freelance: "#ede9fe",
    Belanja: "#fef3c7",
    Transportasi: "#fee2e2",
    Makan: "#fce7f3",
    Hiburan: "#e0e7ff",
};

const categoryText = {
    Gaji: "#065f46",
    Bonus: "#1e40af",
    Freelance: "#5b21b6",
    Belanja: "#92400e",
    Transportasi: "#991b1b",
    Makan: "#9d174d",
    Hiburan: "#3730a3",
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

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function formatRupiah(amount) {
    return "Rp " + amount.toLocaleString("id-ID");
}

function formatDateLabel(dateStr) {
    const d = new Date(dateStr);
    return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function ArrowUpIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    );
}

function ArrowDownIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            <polyline points="17 18 23 18 23 12" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

function ChevronLeft() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

function ChevronRight() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

function ChevronDown() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function SummaryCard({ label, amount, type }) {
    const isIncome = type === "pemasukan";
    const isBalance = type === "saldo";
    return (
        <div
            style={{
                background: isBalance ? "#111827" : "#fff",
                border: "1.5px solid",
                borderColor: isBalance ? "#111827" : "#f3f4f6",
                borderRadius: "16px",
                padding: "20px 24px",
                flex: 1,
                minWidth: 0,
            }}
        >
            <div
                style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isBalance ? "#9ca3af" : "#6b7280",
                    marginBottom: "10px",
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: isBalance
                        ? "#fff"
                        : isIncome
                          ? "#059669"
                          : "#dc2626",
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "-0.5px",
                }}
            >
                {isBalance ? "" : isIncome ? "+" : "-"}
                {formatRupiah(amount)}
            </div>
        </div>
    );
}

export default function AplikasiKeuangan() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [filter, setFilter] = useState("Semua");
    const [search, setSearch] = useState("");
    const [transactions, setTransactions] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        type: "pemasukan",
        category_id: "",
        account_id: "",
        amount: "",
        description: "",
        transaction_date: today.toISOString().split("T")[0],
    });
    const [filterOpen, setFilterOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/transactions");
                if (!response.ok)
                    throw new Error("Gagal mengambil data transaksi");

                const result = await response.json();
                const groupedTx = {};
                result.data.forEach((tx) => {
                    const dateKey = tx.transaction_date;
                    if (!groupedTx[dateKey]) groupedTx[dateKey] = [];
                    groupedTx[dateKey].push({
                        id: tx.id,
                        type: tx.type,
                        category: tx.category?.name || "Uncategorized",
                        account: tx.account?.name || "",
                        amount: parseFloat(tx.amount),
                        description: tx.description,
                        transaction_date: tx.transaction_date,
                        category_id: tx.category_id,
                        account_id: tx.account_id,
                        saving_id: tx.saving_id,
                    });
                });

                setTransactions(groupedTx);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching transactions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [catRes, accRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/accounts"),
                ]);
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData.data || []);
                }
                if (accRes.ok) {
                    const accData = await accRes.json();
                    setAccounts(accData.data || []);
                }
            } catch (err) {
                console.error("Error fetching metadata:", err);
            }
        };

        fetchMetadata();
    }, []);

    const filterOptions = ["Semua", "Pemasukan", "Pengeluaran"];

    function prevMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    }

    function nextMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    }

    const filteredDates = Object.keys(transactions)
        .filter((d) => {
            const date = new Date(d);
            return (
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
            );
        })
        .sort((a, b) => new Date(b) - new Date(a));

    function getTxForDate(dateStr) {
        return (transactions[dateStr] || []).filter((tx) => {
            const matchFilter =
                filter === "Semua" || tx.type === filter.toLowerCase();
            const matchSearch =
                search === "" ||
                tx.description.toLowerCase().includes(search.toLowerCase()) ||
                tx.category.toLowerCase().includes(search.toLowerCase());
            return matchFilter && matchSearch;
        });
    }

    const allTx = Object.values(transactions).flat();
    const totalIncome = allTx
        .filter((t) => t.type === "pemasukan")
        .reduce((s, t) => s + t.amount, 0);
    const totalExpense = allTx
        .filter((t) => t.type === "pengeluaran")
        .reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpense;

    async function handleAddTransaction() {
        if (
            !form.category_id ||
            !form.account_id ||
            !form.amount ||
            !form.description
        ) {
            alert("Mohon isi semua field");
            return;
        }

        try {
            setSaving(true);
            const response = await fetch("/api/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
                body: JSON.stringify({
                    category_id: form.category_id,
                    account_id: form.account_id,
                    type: form.type,
                    amount: parseFloat(form.amount),
                    description: form.description,
                    transaction_date: form.transaction_date,
                    saving_id: form.saving_id || null,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Gagal menyimpan transaksi");
            }

            const result = await response.json();
            const dateKey = result.data.transaction_date;
            const newTx = {
                id: result.data.id,
                type: result.data.type,
                category: result.data.category?.name || "Uncategorized",
                account: result.data.account?.name || "",
                amount: parseFloat(result.data.amount),
                description: result.data.description,
                transaction_date: result.data.transaction_date,
                category_id: result.data.category_id,
                account_id: result.data.account_id,
            };

            setTransactions((prev) => ({
                ...prev,
                [dateKey]: [newTx, ...(prev[dateKey] || [])],
            }));

            setForm({
                type: "pemasukan",
                category_id: "",
                account_id: "",
                amount: "",
                description: "",
                transaction_date: new Date().toISOString().split("T")[0],
            });
            setShowModal(false);
            alert("Transaksi berhasil disimpan!");
        } catch (err) {
            alert("Error: " + err.message);
            console.error("Error saving transaction:", err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f9fafb",
                fontFamily: "'DM Sans', 'Nunito', sans-serif",
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .tx-row:hover { background: #f9fafb !important; }
                .nav-btn:hover { background: #f3f4f6 !important; }
                .filter-opt:hover { background: #f3f4f6 !important; }
                .add-btn:hover { background: #1f2937 !important; }
                .modal-overlay { animation: fadeIn 0.15s ease; }
                .modal-box { animation: slideUp 0.2s ease; }
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
                input:focus, select:focus { outline: none !important; border-color: #111827 !important; }
                input::placeholder { color: #fff !important; }
                input::-webkit-input-placeholder { color: #fff !important; }
                input::-moz-placeholder { color: #fff !important; }
                input:-ms-input-placeholder { color: #fff !important; }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
            `}</style>

            {/* Header */}
            <div
                style={{
                    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
                    borderBottom: "none",
                    padding: "0 32px",
                    height: "64px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    boxShadow: "0 4px 12px rgba(30, 64, 175, 0.2)",
                }}
            >
                <div
                    style={{
                        fontWeight: 800,
                        fontSize: "24px",
                        letterSpacing: "-0.5px",
                        flex: "0 0 auto",
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                    }}
                >
                    <span style={{ color: "#fff" }}>Finance</span>
                    <span style={{ color: "#e0e7ff" }}>Ku</span>
                    <span style={{ color: "#e0e7ff", marginLeft: "2px" }}>.</span>
                </div>
                <div
                    style={{
                        flex: 1,
                        position: "relative",
                        maxWidth: "420px",
                        margin: "0 auto",
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#fff",
                        }}
                    >
                        <SearchIcon />
                    </span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari transaksi..."
                        style={{
                            width: "100%",
                            padding: "9px 14px 9px 38px",
                            border: "1.5px solid rgba(255,255,255,0.2)",
                            borderRadius: "10px",
                            fontSize: "14px",
                            background: "rgba(255,255,255,0.15)",
                            color: "#fff",
                            fontFamily: "inherit",
                        }}
                    />
                </div>
                <div style={{ flex: "0 0 auto", position: "relative" }}>
                    <button
                        onClick={() => setFilterOpen((o) => !o)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "9px 14px",
                            border: "1.5px solid rgba(255,255,255,0.2)",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.15)",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#fff",
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        {filter} <ChevronDown />
                    </button>
                    {filterOpen && (
                        <div
                            style={{
                                position: "absolute",
                                right: 0,
                                top: "calc(100% + 6px)",
                                background: "#fff",
                                border: "1.5px solid #e5e7eb",
                                borderRadius: "10px",
                                minWidth: "140px",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                overflow: "hidden",
                                zIndex: 20,
                            }}
                        >
                            {filterOptions.map((opt) => (
                                <div
                                    key={opt}
                                    className="filter-opt"
                                    onClick={() => {
                                        setFilter(opt);
                                        setFilterOpen(false);
                                    }}
                                    style={{
                                        padding: "10px 16px",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        fontWeight: filter === opt ? 600 : 400,
                                        color: "#111827",
                                    }}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    padding: "28px 24px",
                }}
            >
                {/* Summary Cards */}
                <div
                    style={{
                        display: "flex",
                        gap: "14px",
                        marginBottom: "28px",
                    }}
                >
                    <SummaryCard label="Saldo" amount={balance} type="saldo" />
                    <SummaryCard
                        label="Total Pemasukan"
                        amount={totalIncome}
                        type="pemasukan"
                    />
                    <SummaryCard
                        label="Total Pengeluaran"
                        amount={totalExpense}
                        type="pengeluaran"
                    />
                </div>

                {/* Month Nav + Add Button */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        <span
                            style={{
                                fontWeight: 700,
                                fontSize: "18px",
                                color: "#111827",
                                letterSpacing: "-0.3px",
                                marginRight: "8px",
                            }}
                        >
                            Riwayat Transaksi
                        </span>
                        <button
                            className="nav-btn"
                            onClick={prevMonth}
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                border: "1.5px solid #e5e7eb",
                                background: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#374151",
                            }}
                        >
                            <ChevronLeft />
                        </button>
                        <span
                            style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#374151",
                                minWidth: "100px",
                                textAlign: "center",
                            }}
                        >
                            {MONTHS[currentMonth]} {currentYear}
                        </span>
                        <button
                            className="nav-btn"
                            onClick={nextMonth}
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                border: "1.5px solid #e5e7eb",
                                background: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#374151",
                            }}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                    <button
                        className="add-btn"
                        onClick={() => setShowModal(true)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 20px",
                            background: "#111827",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "background 0.15s",
                        }}
                    >
                        <PlusIcon /> Tambah Transaksi
                    </button>
                </div>

                {/* Transaction List */}
                {loading && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "60px 0",
                            color: "#9ca3af",
                            fontSize: "15px",
                        }}
                    >
                        Loading transaksi...
                    </div>
                )}
                {error && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "20px",
                            background: "#fee2e2",
                            border: "1.5px solid #fca5a5",
                            borderRadius: "12px",
                            color: "#991b1b",
                            fontSize: "14px",
                            marginBottom: "20px",
                        }}
                    >
                        Error: {error}
                    </div>
                )}
                {!loading && filteredDates.length === 0 && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "60px 0",
                            color: "#9ca3af",
                            fontSize: "15px",
                        }}
                    >
                        Tidak ada transaksi di bulan ini.
                    </div>
                )}
                {filteredDates.map((dateStr) => {
                    const txs = getTxForDate(dateStr);
                    if (txs.length === 0) return null;
                    return (
                        <div
                            key={dateStr}
                            style={{
                                background: "#fff",
                                border: "1.5px solid #f3f4f6",
                                borderRadius: "16px",
                                marginBottom: "16px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    padding: "16px 24px 12px",
                                    borderBottom: "1.5px solid #f3f4f6",
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "15px",
                                        color: "#111827",
                                    }}
                                >
                                    {formatDateLabel(dateStr)}
                                </span>
                            </div>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            borderBottom: "1.5px solid #f3f4f6",
                                        }}
                                    >
                                        {[
                                            {
                                                label: "No",
                                                align: "left",
                                                width: "48px",
                                            },
                                            { label: "Tipe", align: "left" },
                                            {
                                                label: "Kategori",
                                                align: "left",
                                            },
                                            { label: "Jumlah", align: "right" },
                                            {
                                                label: "Deskripsi",
                                                align: "left",
                                            },
                                        ].map((h) => (
                                            <th
                                                key={h.label}
                                                style={{
                                                    padding: "10px 12px",
                                                    textAlign: h.align,
                                                    fontSize: "12px",
                                                    fontWeight: 600,
                                                    color: "#9ca3af",
                                                    letterSpacing: "0.05em",
                                                    width: h.width || "auto",
                                                }}
                                            >
                                                {h.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {txs.map((tx, i) => {
                                        const isIncome =
                                            tx.type === "pemasukan";
                                        return (
                                            <tr
                                                key={tx.id}
                                                className="tx-row"
                                                style={{
                                                    borderBottom:
                                                        i < txs.length - 1
                                                            ? "1.5px solid #f9fafb"
                                                            : "none",
                                                    transition:
                                                        "background 0.1s",
                                                }}
                                            >
                                                <td
                                                    style={{
                                                        padding: "14px 12px",
                                                        fontSize: "14px",
                                                        color: "#9ca3af",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {i + 1}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "14px 12px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "8px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: "30px",
                                                                height: "30px",
                                                                borderRadius:
                                                                    "8px",
                                                                background:
                                                                    isIncome
                                                                        ? "#dcfce7"
                                                                        : "#fee2e2",
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                color: isIncome
                                                                    ? "#16a34a"
                                                                    : "#dc2626",
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {isIncome ? (
                                                                <ArrowUpIcon />
                                                            ) : (
                                                                <ArrowDownIcon />
                                                            )}
                                                        </div>
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "14px",
                                                                fontWeight: 600,
                                                                color: isIncome
                                                                    ? "#16a34a"
                                                                    : "#dc2626",
                                                            }}
                                                        >
                                                            {isIncome
                                                                ? "Pemasukan"
                                                                : "Pengeluaran"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "14px 12px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            padding: "4px 12px",
                                                            borderRadius:
                                                                "99px",
                                                            fontSize: "13px",
                                                            fontWeight: 600,
                                                            background:
                                                                categoryColors[
                                                                    tx.category
                                                                ] || "#f3f4f6",
                                                            color:
                                                                categoryText[
                                                                    tx.category
                                                                ] || "#374151",
                                                        }}
                                                    >
                                                        {tx.category}
                                                    </span>
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "14px 12px",
                                                        textAlign: "right",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: 700,
                                                            color: isIncome
                                                                ? "#059669"
                                                                : "#dc2626",
                                                            fontFamily:
                                                                "'DM Mono', monospace",
                                                        }}
                                                    >
                                                        {isIncome ? "+" : "-"}
                                                        {formatRupiah(
                                                            tx.amount,
                                                        )}
                                                    </span>
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "14px 12px",
                                                        fontSize: "14px",
                                                        color: "#374151",
                                                    }}
                                                >
                                                    {tx.description}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 100,
                        backdropFilter: "blur(2px)",
                    }}
                >
                    <div
                        className="modal-box"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#fff",
                            borderRadius: "20px",
                            padding: "32px",
                            width: "100%",
                            maxWidth: "440px",
                            boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "24px",
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: "18px",
                                    fontWeight: 800,
                                    color: "#111827",
                                    letterSpacing: "-0.3px",
                                }}
                            >
                                Tambah Transaksi
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    border: "1.5px solid #e5e7eb",
                                    background: "#fff",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#6b7280",
                                }}
                            >
                                <XIcon />
                            </button>
                        </div>

                        {[
                            {
                                label: "Tipe",
                                key: "type",
                                type: "select",
                                options: [
                                    { v: "pemasukan", l: "Pemasukan" },
                                    { v: "pengeluaran", l: "Pengeluaran" },
                                ],
                            },
                            {
                                label: "Kategori",
                                key: "category_id",
                                type: "select",
                                options: categories.map((c) => ({
                                    v: c.id,
                                    l: c.name,
                                })),
                            },
                            {
                                label: "Akun",
                                key: "account_id",
                                type: "select",
                                options: accounts.map((a) => ({
                                    v: a.id,
                                    l: a.name,
                                })),
                            },
                            {
                                label: "Tanggal",
                                key: "transaction_date",
                                type: "date",
                            },
                            {
                                label: "Jumlah (Rp)",
                                key: "amount",
                                type: "number",
                                placeholder: "cth: 500000",
                            },
                            {
                                label: "Deskripsi",
                                key: "description",
                                type: "text",
                                placeholder: "Keterangan singkat...",
                            },
                        ].map((field) => (
                            <div
                                key={field.key}
                                style={{ marginBottom: "16px" }}
                            >
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: "#374151",
                                        marginBottom: "6px",
                                    }}
                                >
                                    {field.label}
                                </label>
                                {field.type === "select" ? (
                                    <select
                                        value={form[field.key]}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                [field.key]: e.target.value,
                                            }))
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "10px 14px",
                                            border: "1.5px solid #e5e7eb",
                                            borderRadius: "10px",
                                            fontSize: "14px",
                                            color: "#111827",
                                            background: "#f9fafb",
                                            fontFamily: "inherit",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <option value="">
                                            -- Pilih {field.label} --
                                        </option>
                                        {field.options &&
                                            field.options.map((o) => (
                                                <option key={o.v} value={o.v}>
                                                    {o.l}
                                                </option>
                                            ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={form[field.key]}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                [field.key]: e.target.value,
                                            }))
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "10px 14px",
                                            border: "1.5px solid #e5e7eb",
                                            borderRadius: "10px",
                                            fontSize: "14px",
                                            color: "#111827",
                                            background: "#f9fafb",
                                            fontFamily: "inherit",
                                        }}
                                    />
                                )}
                            </div>
                        ))}

                        <button
                            onClick={handleAddTransaction}
                            disabled={saving}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: saving ? "#6b7280" : "#111827",
                                color: "#fff",
                                border: "none",
                                borderRadius: "10px",
                                fontSize: "15px",
                                fontWeight: 700,
                                cursor: saving ? "not-allowed" : "pointer",
                                fontFamily: "inherit",
                                marginTop: "8px",
                                transition: "background 0.15s",
                            }}
                        >
                            {saving ? "Menyimpan..." : "Simpan Transaksi"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
