import React from "react";
import { Link } from "@inertiajs/react";

const colors = {
    primary: "#2563eb",
    danger: "#ef4444",
    textMain: "#0f172a",
    textMuted: "#64748b",
};

export default function Sidebar() {
    return (
        <aside
            style={{
                width: "200px",
                background: "#fff",
                borderRight: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                padding: "32px 20px",
                position: "fixed",
                height: "100vh",
                zIndex: 100,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "40px",
                    padding: "0 12px",
                }}
            >
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        background: "linear-gradient(135deg, #2563eb, #1e40af)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "20px",
                    }}
                >
                    F
                </div>
                <span
                    style={{
                        fontSize: "22px",
                        fontWeight: 800,
                        color: colors.textMain,
                        letterSpacing: "-1px",
                    }}
                >
                    FinanceKu
                </span>
            </div>

            <nav style={{ flex: 1 }}>
                {[
                    { name: "Dashboard", icon: "🏠", active: true },
                    { name: "Transaksi", icon: "📊", active: false },
                    { name: "DompetKu", icon: "💳", active: false },
                    { name: "Tabungan", icon: "🎯", active: false },
                    { name: "Laporan", icon: "📑", active: false },
                ].map((item) => (
                    <div
                        key={item.name}
                        className="sidebar-link"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            padding: "14px 16px",
                            borderRadius: "12px",
                            cursor: "pointer",
                            marginBottom: "4px",
                            color: item.active
                                ? colors.primary
                                : colors.textMuted,
                            fontWeight: item.active ? 700 : 500,
                            background: item.active
                                ? "rgba(37, 99, 235, 0.05)"
                                : "transparent",
                        }}
                    >
                        <span style={{ fontSize: "20px" }}>{item.icon}</span>
                        {item.name}
                    </div>
                ))}
            </nav>

            {/* --- INI BAGIAN TOMBOL LOGOUT --- */}
            <div
                style={{
                    marginTop: "auto",
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: "20px",
                }}
            >
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: "none",
                        background: "#fff1f2",
                        color: colors.danger,
                        fontWeight: 700,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "0.2s",
                    }}
                >
                    <span style={{ fontSize: "18px" }}>🚪</span>
                    Keluar Aplikasi
                </Link>
            </div>
        </aside>
    );
}
