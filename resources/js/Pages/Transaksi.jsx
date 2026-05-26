import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Toast from '../Components/Toast';
import ConfirmDialog from '../Components/ConfirmDialog';
import { formatRupiah, formatDate } from '@/utils/format';
import { apiFetch } from '@/utils/api';

export default function Transaksi() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    
    // Filters
    const [filterType, setFilterType] = useState('Semua');
    const [filterCategory, setFilterCategory] = useState('Semua');
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Modal Form
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    
    const initialForm = {
        type: 'income',
        category_id: '',
        account_id: '',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
    };
    const [form, setForm] = useState(initialForm);

    // Confirm Dialog
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmId, setConfirmId] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [txJson, catJson, accJson] = await Promise.all([
                apiFetch('/api/transactions'),
                apiFetch('/api/categories'),
                apiFetch('/api/accounts')
            ]);
            
            if (txJson) setTransactions(txJson.data || []);
            if (catJson) setCategories(catJson.data || []);
            if (accJson) setAccounts(accJson.data || []);
        } catch (error) {
            console.error(error);
            showToast('Gagal memuat data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Derived Data
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            if (filterType !== 'Semua' && tx.type !== (filterType === 'pemasukan' ? 'income' : 'expense')) return false;
            if (filterCategory !== 'Semua' && String(tx.category_id) !== String(filterCategory)) return false;
            
            if (debouncedSearch) {
                const searchLower = debouncedSearch.toLowerCase();
                if (!tx.description?.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }
            return true;
        });
    }, [transactions, filterType, filterCategory, debouncedSearch]);

    // Handlers
    const handleOpenAdd = () => {
        setForm(initialForm);
        setIsEditing(false);
        setEditingId(null);
        setShowModal(true);
    };

    const handleOpenEdit = (tx) => {
        setForm({
            type: tx.type,
            category_id: tx.category_id || '',
            account_id: tx.account_id || '',
            amount: tx.amount,
            description: tx.description || '',
            transaction_date: tx.transaction_date,
        });
        setIsEditing(true);
        setEditingId(tx.id);
        setShowModal(true);
    };

    const handleDeleteClick = (id) => {
        setConfirmId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await apiFetch(`/api/transactions/${confirmId}`, {
                method: 'DELETE'
            });
            showToast('Transaksi berhasil dihapus', 'success');
            fetchAll();
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setShowConfirm(false);
            setConfirmId(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const url = isEditing ? `/api/transactions/${editingId}` : '/api/transactions';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await apiFetch(url, {
                method,
                body: JSON.stringify(form)
            });

            showToast(isEditing ? 'Transaksi berhasil diupdate' : 'Transaksi berhasil ditambahkan', 'success');
            setShowModal(false);
            fetchAll();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout title="Transaksi">
            {/*ubah font disini bro*/}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                * { transition: all 0.2s ease-in-out; }
                .action-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
                .btn-primary:hover { background: #1d4ed8 !important; transform: scale(1.02); }
                input:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
            `}</style>

            <div className="p-6 lg:p-10">
                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ ...toast, show: false })}
                    />
                )}

                <ConfirmDialog
                    isOpen={showConfirm}
                    title="Hapus Transaksi"
                    message="Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan."
                    danger={true}
                    confirmLabel="Hapus"
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={handleConfirmDelete}
                />

                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Transaksi
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Kelola semua pemasukan dan pengeluaran Anda.
                            </p>
                        </div>
                        <button
                            onClick={handleOpenAdd}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors flex items-center gap-2 text-sm"
                        >
                            <span>+</span> Tambah Transaksi
                        </button>
                    </header>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Filters */}
                        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4 bg-slate-50/50">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari deskripsi..."
                                        value={searchInput}
                                        onChange={(e) =>
                                            setSearchInput(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm"
                                    />
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        🔍
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <select
                                    value={filterType}
                                    onChange={(e) =>
                                        setFilterType(e.target.value)
                                    }
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-medium text-slate-700"
                                >
                                    <option value="Semua">Semua Tipe</option>
                                    <option value="pemasukan">Pemasukan</option>
                                    <option value="pengeluaran">
                                        Pengeluaran
                                    </option>
                                </select>
                                <select
                                    value={filterCategory}
                                    onChange={(e) =>
                                        setFilterCategory(e.target.value)
                                    }
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-medium text-slate-700"
                                >
                                    <option value="Semua">
                                        Semua Kategori
                                    </option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                        <th className="px-6 py-4 whitespace-nowrap">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-4 whitespace-nowrap">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-4 whitespace-nowrap">
                                            Akun
                                        </th>
                                        <th className="px-6 py-4 w-full">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-4 whitespace-nowrap text-right">
                                            Jumlah
                                        </th>
                                        <th className="px-6 py-4 whitespace-nowrap text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-8 text-center text-slate-500 text-sm"
                                            >
                                                <div className="animate-pulse flex flex-col items-center gap-2">
                                                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                                                    <span className="text-slate-400">
                                                        Memuat data...
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTransactions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center text-slate-500 text-sm"
                                            >
                                                <div className="text-4xl mb-3">
                                                    📄
                                                </div>
                                                <p className="font-semibold text-slate-700">
                                                    Tidak ada transaksi
                                                    ditemukan
                                                </p>
                                                <p className="text-slate-400 mt-1">
                                                    Coba sesuaikan filter atau
                                                    tambah transaksi baru.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTransactions.map((tx) => {
                                            const isIncome =
                                                tx.type === "income";
                                            return (
                                                <tr
                                                    key={tx.id}
                                                    className="hover:bg-slate-50/80 transition-colors group"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                                        {formatDate(
                                                            tx.transaction_date,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                                                                isIncome
                                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                                            }`}
                                                        >
                                                            {tx.category
                                                                ?.name ||
                                                                "Uncategorized"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                        {tx.account?.name ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-800">
                                                        {tx.description}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-sm ${
                                                                isIncome
                                                                    ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                                                                    : "bg-rose-100 text-rose-700 border-2 border-rose-300"
                                                            }`}
                                                        >
                                                            <span className="text-lg font-bold">
                                                                {isIncome ? "+" : "-"}
                                                            </span>
                                                            {formatRupiah(
                                                                tx.amount,
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs ${
                                                                isIncome
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                            }`}
                                                        >
                                                            {isIncome ? "📥 Pemasukan" : "📤 Pengeluaran"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Modal Form */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 m-4 shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {isEditing
                                        ? "Edit Transaksi"
                                        : "Tambah Transaksi"}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-5"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                            Tipe
                                        </label>
                                        <select
                                            required
                                            value={form.type}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    type: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                        >
                                            <option value="income">
                                                Pemasukan
                                            </option>
                                            <option value="expense">
                                                Pengeluaran
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                            Kategori
                                        </label>
                                        <select
                                            required
                                            value={form.category_id}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    category_id: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                        >
                                            <option value="">
                                                -- Pilih --
                                            </option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                            Akun
                                        </label>
                                        <select
                                            required
                                            value={form.account_id}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    account_id: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                        >
                                            <option value="">
                                                -- Pilih --
                                            </option>
                                            {accounts.map((a) => (
                                                <option key={a.id} value={a.id}>
                                                    {a.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={form.transaction_date}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    transaction_date:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                            Jumlah (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            required
                                            value={form.amount}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    amount: e.target.value,
                                                })
                                            }
                                            placeholder="0"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                            Deskripsi
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.description}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Keterangan transaksi..."
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50"
                                    >
                                        {saving ? "Menyimpan..." : "Simpan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
