import React, { useState, useEffect } from "react";
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function waterStatus(lastWatered, freq) {
    const ratio = lastWatered / freq;
    if (ratio >= 1) return { label: "Thirsty!", color: "#e07b4a", urgent: true };
    if (ratio >= 0.75) return { label: "Soon", color: "#d4a843", urgent: false };
    return { label: "Good", color: "#5aaa72", urgent: false };
}

// ─── PlantCard ────────────────────────────────────────────────────────────────
function PlantCard({ plant, onWater, onDelete }) {
    const [watered, setWatered] = useState(false);
    const status = waterStatus(plant.lastWatered, plant.waterFreq);
    const waterPct = Math.min(100, Math.round((plant.lastWatered / plant.waterFreq) * 100));

    function handleWater() {
        setWatered(true);
        onWater && onWater(plant.plantID);
        setTimeout(() => setWatered(false), 2000);
    }

    return (
        <div style={{
            width: 220,
            borderRadius: 18,
            background: "#faf8f3",
            boxShadow: "0 4px 24px rgba(60,80,40,0.10), 0 1px 4px rgba(60,80,40,0.08)",
            border: "1.5px solid #e8e2d4",
            overflow: "hidden",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            transition: "transform 0.18s, box-shadow 0.18s",
            cursor: "pointer",
            position: "relative",
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px) rotate(-0.5deg)";
                e.currentTarget.style.boxShadow = "0 12px 36px rgba(60,80,40,0.18), 0 2px 8px rgba(60,80,40,0.10)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) rotate(0deg)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(60,80,40,0.10), 0 1px 4px rgba(60,80,40,0.08)";
            }}
        >
            {/* Image */}
            <div style={{
                background: plant.color,
                height: 90,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
            }}>
                <img
                    src={plant.image}
                    alt={plant.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* Room badge */}
                <span style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(255,255,255,0.22)",
                    color: "#fff",
                    fontSize: 10,
                    fontFamily: "'Helvetica Neue', sans-serif",
                    letterSpacing: "0.08em",
                    padding: "2px 8px",
                    borderRadius: 20,
                    backdropFilter: "blur(6px)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                }}>{plant.room}</span>

                {/* Delete button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Remove ${plant.name}?`)) {
                            onDelete && onDelete(plant.plantID);
                        }
                    }}
                    style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        background: "rgba(0,0,0,0.35)",
                        border: "none",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        color: "#fff",
                        fontSize: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(4px)",
                    }}
                    title="Delete plant"
                >
                    ✕
                </button>
            </div>

            {/* Body */}
            <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#2d3a28", lineHeight: 1.2 }}>{plant.name}</div>
                    <div style={{ fontSize: 11, color: "#8a9e80", fontStyle: "italic", marginTop: 2 }}>{plant.scientific}</div>
                </div>

                {/* Light */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: "#6b7c60",
                    fontFamily: "'Helvetica Neue', sans-serif",
                    marginBottom: 12,
                }}>
                    <span>☀️</span>
                    <span>{plant.light} light</span>
                </div>

                {/* Water status */}
                <div style={{ marginBottom: 8 }}>
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        fontSize: 11, fontFamily: "'Helvetica Neue', sans-serif",
                        color: "#6b7c60", marginBottom: 4,
                    }}>
                        <span>💧 Water</span>
                        <span style={{ color: status.color, fontWeight: 700 }}>{status.label}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: "#e8e2d4", overflow: "hidden" }}>
                        <div style={{
                            height: "100%",
                            width: `${waterPct}%`,
                            background: `linear-gradient(90deg, #78b88a, ${status.color})`,
                            borderRadius: 99,
                            transition: "width 0.4s",
                        }} />
                    </div>
                    <div style={{
                        fontSize: 10, color: "#aaa", fontFamily: "'Helvetica Neue', sans-serif", marginTop: 3,
                    }}>{plant.lastWatered}d ago · every {plant.waterFreq}d</div>
                </div>

                {/* Care Link */}
                {plant.careLink && (
                    <a
                        href={plant.careLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: "block",
                            textAlign: "center",
                            fontSize: 11,
                            color: "#aaa",
                            fontFamily: "'Helvetica Neue', sans-serif",
                            textDecoration: "underline",
                            marginBottom: 6,
                        }}
                    >
                        Care Link
                    </a>
                )}

                {/* Water button */}
                <button
                    onClick={handleWater}
                    style={{
                        width: "100%",
                        padding: "7px 0",
                        borderRadius: 10,
                        border: "none",
                        background: watered ? "#5aaa72" : status.urgent ? "#e07b4a" : plant.color,
                        color: "#fff",
                        fontFamily: "'Helvetica Neue', sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        cursor: "pointer",
                        transition: "background 0.25s, transform 0.1s",
                        transform: watered ? "scale(0.97)" : "scale(1)",
                    }}
                >
                    {watered ? "✓ Watered!" : "Mark as Watered"}
                </button>
            </div>
        </div>
    );
}

// ─── AddPlantCard ─────────────────────────────────────────────────────────────
function AddPlantCard({ onClick }) {
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

// ─── PlantGrid ────────────────────────────────────────────────────────────────
export default function PlantGrid() {
    const navigate = useNavigate();
    const [plants, setPlants] = useState([]);

    useEffect(() => {
        fetchPlants();
    }, []);

    async function fetchPlants() {
        try {
            const res = await fetch(`${API_URL}/plants`);
            if (!res.ok) {
                console.error('Failed to fetch plants', res.status);
                setPlants([]);
                return;
            }
            const data = await res.json();
            setPlants(data);
        } catch (err) {
            console.error(err);
            setPlants([]);
        }
    }

    function handleWater(id) {
        setPlants(prev =>
            prev.map(p => p.plantID === id ? { ...p, lastWatered: 0 } : p)
        );
    }

    async function handleDelete(id) {
        try {
            const res = await fetch(`${API_URL}/plants/${id}`, { method: 'DELETE' });
            if (res.status === 204) {
                setPlants(prev => prev.filter(p => p.plantID !== id));
            } else {
                alert('Failed to delete plant');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete plant');
        }
    }

    return (
        <div style={{
            minHeight: "97vh",
            borderRadius: 15,
            background: "#f2efe8",
            backgroundImage: "radial-gradient(circle at 20% 20%, #e8f0e0 0%, transparent 60%), radial-gradient(circle at 80% 80%, #e0eae8 0%, transparent 60%)",
            padding: "24px 0px",
            fontFamily: "'Georgia', serif",
        }}>
            {/* Header */}
            <div style={{ marginBottom: 40, textAlign: "center" }}>
                <h1 style={{
                    fontSize: 36, color: "#2d3a28", fontWeight: 700,
                    margin: 0, letterSpacing: "-0.02em",
                }}>🌿 My Plants</h1>
                <p style={{
                    color: "#8a9e80", fontSize: 14,
                    fontFamily: "'Helvetica Neue', sans-serif",
                    marginTop: 6, fontStyle: "italic",
                }}>{plants.length} plants in your collection</p>
            </div>

            {/* Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
                {plants.map(plant => (
                    <PlantCard key={plant.plantID} plant={plant} onWater={handleWater} onDelete={handleDelete} />
                ))}
                <AddPlantCard onClick={() => navigate('/plants/add')} />
            </div>
        </div>
    );
}