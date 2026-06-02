import React, { useState, useEffect } from "react";
import Toast from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import { apiFetch } from "@/utils/api";

export default function CategoryModal({
    isOpen,
    onClose,
    categories,
    onCategoryChange,
}) {
    const [localCategories, setLocalCategories] = useState(categories || []);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "info",
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmId, setConfirmId] = useState(null);

    const initialForm = {
        name: "",
        type: "pemasukan",
        color: "#3b82f6",
    };
    const [form, setForm] = useState(initialForm);

    const showToast = (message, type = "info") => {
        setToast({ show: true, message, type });
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/categories");
            if (res && res.data) {
                setLocalCategories(res.data);
                if (typeof onCategoryChange === "function")
                    onCategoryChange(res.data);
            }
        } catch (error) {
            console.error(error);
            showToast("Gagal memuat kategori", "error");
        } finally {
            setLoading(false);
        }
    };

    // Keep localCategories in sync when parent `categories` changes
    useEffect(() => {
        setLocalCategories(categories || []);
    }, [categories]);

    // Fetch latest categories whenever modal opens
    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleOpenAddForm = () => {
        setForm(initialForm);
        setIsEditing(false);
        setEditingId(null);
        setShowForm(true);
    };

    const handleOpenEditForm = (category) => {
        setForm({
            name: category.name,
            type: category.type,
            color: category.color || "#3b82f6",
        });
        setIsEditing(true);
        setEditingId(category.id);
        setShowForm(true);
    };

    const handleDeleteClick = (id) => {
        setConfirmId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await apiFetch(`/api/categories/${confirmId}`, {
                method: "DELETE",
            });
            showToast("Kategori berhasil dihapus", "success");
            fetchCategories();
        } catch (e) {
            showToast(e.message, "error");
        } finally {
            setShowConfirm(false);
            setConfirmId(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const url = isEditing
            ? `/api/categories/${editingId}`
            : "/api/categories";
        const method = isEditing ? "PUT" : "POST";

        try {
            await apiFetch(url, {
                method,
                body: JSON.stringify(form),
            });

            showToast(
                isEditing
                    ? "Kategori berhasil diupdate"
                    : "Kategori berhasil ditambahkan",
                "success",
            );
            setShowForm(false);
            fetchCategories();
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-8 m-4 shadow-2xl overflow-y-auto max-h-[90vh]">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Kelola Kategori
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors text-lg"
                        >
                            ✕
                        </button>
                    </div>

                    {toast.show && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast({ ...toast, show: false })}
                        />
                    )}

                    <ConfirmDialog
                        isOpen={showConfirm}
                        title="Hapus Kategori"
                        message="Apakah Anda yakin ingin menghapus kategori ini? Transaksi yang menggunakan kategori ini tidak akan terpengaruh."
                        danger={true}
                        confirmLabel="Hapus"
                        onCancel={() => setShowConfirm(false)}
                        onConfirm={handleConfirmDelete}
                    />

                    {!showForm ? (
                        <>
                            {/* Button Add Category */}
                            <button
                                onClick={handleOpenAddForm}
                                className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors flex items-center gap-2 text-sm"
                            >
                                <span>+</span> Tambah Kategori Baru
                            </button>

                            {/* Categories List */}
                            <div>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-pulse flex flex-col items-center gap-2">
                                            <div className="h-4 w-24 bg-slate-200 rounded"></div>
                                            <span className="text-slate-400 text-sm">
                                                Memuat kategori...
                                            </span>
                                        </div>
                                    </div>
                                ) : localCategories.length === 0 ? (
                                    <div className="text-center py-12 bg-slate-50 rounded-2xl">
                                        <div className="text-4xl mb-3">📁</div>
                                        <p className="font-semibold text-slate-700">
                                            Belum ada kategori
                                        </p>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Tambahkan kategori pertama Anda
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {localCategories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-100/50 transition-all group"
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div
                                                        className="w-4 h-4 rounded"
                                                        style={{
                                                            backgroundColor:
                                                                category.color ||
                                                                "#3b82f6",
                                                        }}
                                                    ></div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-slate-900">
                                                            {category.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {category.type ===
                                                            "pemasukan"
                                                                ? "📥 Pemasukan"
                                                                : "📤 Pengeluaran"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() =>
                                                            handleOpenEditForm(
                                                                category,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                category.id,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Form Add/Edit Category */}
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-5"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Nama Kategori
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Contoh: Makanan, Transport, dll"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
                                    />
                                </div>

                                <div>
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
                                        <option value="pemasukan">
                                            Pemasukan
                                        </option>
                                        <option value="pengeluaran">
                                            Pengeluaran
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Warna
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={form.color}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    color: e.target.value,
                                                })
                                            }
                                            className="w-16 h-10 rounded-lg cursor-pointer border border-slate-200"
                                        />
                                        <div
                                            className="w-12 h-10 rounded-lg border-2 border-slate-200"
                                            style={{
                                                backgroundColor: form.color,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50"
                                    >
                                        {saving
                                            ? "Menyimpan..."
                                            : isEditing
                                              ? "Update"
                                              : "Tambah"}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
