import React, { useState } from "react";

export default function AddPlantCard({ onClick }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: 220,
                borderRadius: 18,
                background: hovered ? "#f0f5ec" : "#faf8f3",
                boxShadow: hovered
                    ? "0 12px 36px rgba(60,80,40,0.18), 0 2px 8px rgba(60,80,40,0.10)"
                    : "0 4px 24px rgba(60,80,40,0.10), 0 1px 4px rgba(60,80,40,0.08)",
                border: "1.5px dashed #c8d8bc",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                fontFamily: "'Georgia', 'Times New Roman', serif",
                cursor: "pointer",
                transition: "transform 0.18s, box-shadow 0.18s, background 0.18s",
                transform: hovered ? "translateY(-6px) rotate(0.5deg)" : "translateY(0) rotate(0deg)",
                minHeight: 240,
            }}
        >
            <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: hovered ? "#d4e8c8" : "#e8f0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                transition: "background 0.18s, transform 0.18s",
                transform: hovered ? "scale(1.12)" : "scale(1)",
            }}>
                🌱
            </div>
            <div style={{ textAlign: "center" }}>
                <div style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#5a7a50",
                    letterSpacing: "-0.01em",
                }}>Add a Plant</div>
                <div style={{
                    fontSize: 11,
                    color: "#8a9e80",
                    fontFamily: "'Helvetica Neue', sans-serif",
                    fontStyle: "italic",
                    marginTop: 3,
                }}>grow your collection</div>
            </div>
        </div>
    );
}