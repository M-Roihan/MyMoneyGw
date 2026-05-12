import React from "react";

const colors = {
    textMain: "#0f172a",
    textMuted: "#64748b",
};

export default function Header({ search, setSearch }) {
    return (
        <header
            style={{
                height: "90px",
                background: "rgba(248, 250, 252, 0.8)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 40px",
                position: "sticky",
                top: 0,
                zIndex: 40,
            }}
        >
            <div>
                <p
                    style={{
                        fontSize: "14px",
                        color: colors.textMuted,
                        fontWeight: 500,
                    }}
                >
                    Halo, Selamat Siang!
                </p>
                <h1
                    style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: colors.textMain,
                    }}
                >
                    Ringkasan Keuangan
                </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        placeholder="Cari apapun..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: "12px 16px 12px 45px",
                            borderRadius: "14px",
                            border: "1px solid #e2e8f0",
                            background: "#fff",
                            width: "260px",
                            fontSize: "14px",
                        }}
                    />
                    <span
                        style={{
                            position: "absolute",
                            left: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    >
                        🔍
                    </span>
                </div>
                <div
                    style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "14px",
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "20px",
                    }}
                >
                    🔔
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        paddingLeft: "12px",
                        borderLeft: "1px solid #e2e8f0",
                    }}
                >
                    <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "14px", fontWeight: 700 }}>
                            Admin Finance
                        </p>
                    </div>
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "16px",
                            background:
                                "linear-gradient(45deg, #cbd5e1, #94a3b8)",
                            border: "2px solid #fff",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}
                    ></div>
                </div>
            </div>
        </header>
    );
}
