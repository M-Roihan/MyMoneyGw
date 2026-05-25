import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Toast from '../Components/Toast';
import ConfirmDialog from '../Components/ConfirmDialog';
import { formatRupiah, formatDate } from '@/utils/format';
import { apiFetch } from '@/utils/api';

export default function Tabungan() {
    const [savings, setSavings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    // Modals
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositId, setDepositId] = useState(null);
    const [depositAmount, setDepositAmount] = useState('');
    const [depositSavingInfo, setDepositSavingInfo] = useState(null);

    // Confirm Dialog
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmId, setConfirmId] = useState(null);

    const initialForm = {
        name: '',
        target_amount: '',
        target_date: '',
    };
    const [form, setForm] = useState(initialForm);

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const fetchSavings = async () => {
        setLoading(true);
        try {
            const json = await apiFetch('/api/savings');
            if (json) {
                setSavings(json.data || []);
            }
        } catch (error) {
            console.error(error);
            showToast('Gagal memuat data tabungan', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavings();
    }, []);

    // Handlers
    const handleOpenAdd = () => {
        setForm(initialForm);
        setIsEditing(false);
        setEditingId(null);
        setShowFormModal(true);
    };

    const handleOpenEdit = (sav) => {
        setForm({
            name: sav.name,
            target_amount: sav.target_amount,
            target_date: sav.target_date || '',
        });
        setIsEditing(true);
        setEditingId(sav.id);
        setShowFormModal(true);
    };

    const handleOpenDeposit = (sav) => {
        setDepositId(sav.id);
        setDepositSavingInfo(sav);
        setDepositAmount('');
        setShowDepositModal(true);
    };

    const handleDeleteClick = (id) => {
        setConfirmId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await apiFetch(`/api/savings/${confirmId}`, {
                method: 'DELETE'
            });
            showToast('Tabungan berhasil dihapus', 'success');
            fetchSavings();
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setShowConfirm(false);
            setConfirmId(null);
        }
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setSaving(true);

        const url = isEditing ? `/api/savings/${editingId}` : '/api/savings';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await apiFetch(url, {
                method,
                body: JSON.stringify(form)
            });

            showToast(isEditing ? 'Tabungan berhasil diupdate' : 'Tabungan berhasil dibuat', 'success');
            setShowFormModal(false);
            fetchSavings();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSubmitDeposit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await apiFetch(`/api/savings/${depositId}/deposit`, {
                method: 'POST',
                body: JSON.stringify({ amount: depositAmount })
            });

            showToast('Setoran berhasil ditambahkan', 'success');
            setShowDepositModal(false);
            fetchSavings();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout title="Tabungan">
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
                title="Hapus Tabungan"
                message="Apakah Anda yakin ingin menghapus target tabungan ini?"
                danger={true}
                confirmLabel="Hapus"
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmDelete}
            />

            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Tabungan Saya</h1>
                        <p className="text-slate-500 text-sm mt-1">Wujudkan impian Anda dengan target tabungan yang jelas.</p>
                    </div>
                    <button 
                        onClick={handleOpenAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors flex items-center gap-2 text-sm"
                    >
                        <span>+</span> Buat Tabungan
                    </button>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse h-48"></div>
                        ))}
                    </div>
                ) : savings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                        <div className="text-6xl mb-4">🏦</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Tabungan</h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">Anda belum memiliki target tabungan. Mulailah merencanakan masa depan keuangan Anda sekarang.</p>
                        <button 
                            onClick={handleOpenAdd}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-xl font-bold transition-colors"
                        >
                            Buat Tabungan Pertama
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savings.map(sav => {
                            const target = parseFloat(sav.target_amount);
                            const current = parseFloat(sav.current_amount);
                            let percent = target > 0 ? (current / target) * 100 : 0;
                            if (percent > 100) percent = 100;
                            
                            let colorClass = 'bg-amber-500';
                            if (percent >= 75) colorClass = 'bg-emerald-500';
                            else if (percent >= 40) colorClass = 'bg-blue-500';

                            return (
                                <div key={sav.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all relative group">
                                    <div className="absolute top-6 right-6 text-2xl opacity-80">🎯</div>
                                    
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 pr-8">{sav.name}</h3>
                                    
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className="font-semibold text-slate-700">{formatRupiah(current)}</span>
                                            <span className="text-slate-500">dari {formatRupiah(target)}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs font-bold text-slate-500">{Math.round(percent)}% Terkumpul</span>
                                            <span className="text-xs text-slate-400 font-medium">🗓 {formatDate(sav.target_date)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-slate-100">
                                        <button 
                                            onClick={() => handleOpenDeposit(sav)}
                                            disabled={percent >= 100}
                                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex-1 ${
                                                percent >= 100 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                            }`}
                                        >
                                            {percent >= 100 ? 'Tercapai 🎉' : 'Setor Dana'}
                                        </button>
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => handleOpenEdit(sav)}
                                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(sav.id)}
                                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                title="Hapus"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Tambah/Edit Tabungan */}
            {showFormModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 m-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {isEditing ? 'Edit Tabungan' : 'Tambah Tabungan Baru'}
                            </h2>
                            <button 
                                onClick={() => setShowFormModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmitForm} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Target</label>
                                <input 
                                    type="text" 
                                    required
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    placeholder="Contoh: Beli Laptop Baru"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Target Jumlah (Rp)</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    required
                                    value={form.target_amount}
                                    onChange={e => setForm({...form, target_amount: e.target.value})}
                                    placeholder="Contoh: 15000000"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Target Tanggal (Opsional)</label>
                                <input 
                                    type="date" 
                                    value={form.target_date}
                                    onChange={e => setForm({...form, target_date: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                                <button 
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
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

            {/* Modal Setor Dana */}
            {showDepositModal && depositSavingInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 m-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Setor Dana</h2>
                            <button 
                                onClick={() => setShowDepositModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-sm font-bold text-slate-700 mb-1">{depositSavingInfo.name}</p>
                            <p className="text-xs text-slate-500 mb-2">
                                Sisa yang dibutuhkan:{' '}
                                <span className="font-bold text-slate-700">
                                    {formatRupiah(Math.max(0, depositSavingInfo.target_amount - depositSavingInfo.current_amount))}
                                </span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmitDeposit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Jumlah Setoran (Rp)</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    max={depositSavingInfo.target_amount - depositSavingInfo.current_amount}
                                    required
                                    value={depositAmount}
                                    onChange={e => setDepositAmount(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                />
                                <p className="text-xs text-slate-400 mt-2">Maksimal setoran tidak boleh melebihi target tabungan.</p>
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                                <button 
                                    type="button"
                                    onClick={() => setShowDepositModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Memproses...' : 'Setor Sekarang'}
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
