import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Toast from '../Components/Toast';
import ConfirmDialog from '../Components/ConfirmDialog';
import { formatRupiah } from '@/utils/format';
import { apiFetch } from '@/utils/api';

export default function DompetKu() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    // Modal Form
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const initialForm = {
        name: '',
        type: 'cash',
        balance: '',
    };
    const [form, setForm] = useState(initialForm);

    // Confirm Dialog
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmId, setConfirmId] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const json = await apiFetch('/api/accounts');
            if (json) {
                setAccounts(json.data || []);
            }
        } catch (error) {
            console.error(error);
            showToast('Gagal memuat data akun', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const totalSaldo = useMemo(() => {
        return accounts.reduce((acc, curr) => acc + parseFloat(curr.balance || 0), 0);
    }, [accounts]);

    const handleOpenAdd = () => {
        setForm(initialForm);
        setIsEditing(false);
        setEditingId(null);
        setShowModal(true);
    };

    const handleOpenEdit = (acc) => {
        setForm({
            name: acc.name,
            type: acc.type,
            balance: acc.balance,
        });
        setIsEditing(true);
        setEditingId(acc.id);
        setShowModal(true);
    };

    const handleDeleteClick = (id) => {
        setConfirmId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await apiFetch(`/api/accounts/${confirmId}`, {
                method: 'DELETE'
            });
            showToast('Akun berhasil dihapus', 'success');
            fetchAccounts();
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

        const url = isEditing ? `/api/accounts/${editingId}` : '/api/accounts';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await apiFetch(url, {
                method,
                body: JSON.stringify(form)
            });

            showToast(isEditing ? 'Akun berhasil diupdate' : 'Akun berhasil ditambahkan', 'success');
            setShowModal(false);
            fetchAccounts();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'bank': return '🏦';
            case 'e-wallet': return '📱';
            default: return '💵';
        }
    };

    return (
        <AppLayout title="DompetKu">
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
                title="Hapus Akun"
                message="Apakah Anda yakin ingin menghapus akun ini? Transaksi yang terkait mungkin akan kehilangan referensi."
                danger={true}
                confirmLabel="Hapus"
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmDelete}
            />

            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">DompetKu</h1>
                        <p className="text-slate-500 text-sm mt-1">Kelola semua rekening, e-wallet, dan uang tunai Anda.</p>
                    </div>
                    <button 
                        onClick={handleOpenAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-sm transition-colors flex items-center gap-2 text-sm"
                    >
                        <span>+</span> Tambah Akun
                    </button>
                </header>

                {/* Total Saldo Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl p-8 md:p-10 text-white mb-10 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-slate-300 font-medium mb-2 text-sm md:text-base">TOTAL SALDO SEMUA AKUN</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            {loading ? '...' : formatRupiah(totalSaldo)}
                        </h2>
                    </div>
                    {/* Decorative Element */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute left-1/4 bottom-0 w-48 h-48 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-y-1/2"></div>
                </div>

                {/* Grid Akun */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-40"></div>
                        ))}
                    </div>
                ) : accounts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="text-5xl mb-4">💳</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Akun</h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">Anda belum menambahkan akun keuangan apapun. Tambahkan cash, rekening bank, atau e-wallet untuk mulai mencatat transaksi.</p>
                        <button 
                            onClick={handleOpenAdd}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-xl font-bold transition-colors"
                        >
                            Tambah Akun Pertama
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map(acc => (
                            <div 
                                key={acc.id} 
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 relative group"
                            >
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleOpenEdit(acc)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(acc.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        title="Hapus"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                
                                <div className="text-4xl mb-4">{getTypeIcon(acc.type)}</div>
                                
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">{acc.name}</h3>
                                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                        {acc.type}
                                    </span>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">Saldo Tersedia</p>
                                    <p className="text-2xl font-extrabold text-emerald-600">
                                        {formatRupiah(acc.balance)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 m-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {isEditing ? 'Edit Akun' : 'Tambah Akun Baru'}
                            </h2>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Akun</label>
                                <input 
                                    type="text" 
                                    required
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    placeholder="Contoh: BCA Pribadi, Gopay, Dompet"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tipe Akun</label>
                                <select 
                                    required
                                    value={form.type}
                                    onChange={e => setForm({...form, type: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                >
                                    <option value="cash">Cash 💵</option>
                                    <option value="bank">Bank 🏦</option>
                                    <option value="e-wallet">E-Wallet 📱</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Saldo Awal (Rp)</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={form.balance}
                                    onChange={e => setForm({...form, balance: e.target.value})}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                />
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
                                    {saving ? 'Menyimpan...' : 'Simpan'}
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
