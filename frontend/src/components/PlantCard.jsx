import React, { useState, useRef } from "react";
import { waterStatus } from "../utils/plantHelpers";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const CARE_LABELS = {
    sun: "☀️ Sun",
    water: "💧 Water Needs",
    temp: "🌡️ Temp Range",
    zones: "🗺️ USDA Zones",
    soil: "🪴 Soil Type",
    toxicity: "⚠️ Toxicity",
    drought: "🏜️ Drought",
    type: "🌿 Plant Type",
    fertilizer: "🧪 Fertilizer",
    pruning: "✂️ Pruning",
    lifespan: "⏳ Lifespan",
    size: "📏 Mature Size",
    ph: "🧬 Soil pH",
    difficulty: "⭐ Difficulty",
};

export default function PlantCard({ plant, onWater, onDelete }) {
    const [watered, setWatered] = useState(false);
    const [pendingWater, setPendingWater] = useState(false);
    const [progress, setProgress] = useState(100);
    const [flipped, setFlipped] = useState(false);
    const [careData, setCareData] = useState(null);
    const [careLoading, setCareLoading] = useState(false);
    const [careError, setCareError] = useState(null);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    if (!plant) return null;

    const daysSinceWatered = typeof plant.lastWatered === 'number'
        ? plant.lastWatered
        : Math.floor((new Date() - new Date(plant.lastWatered)) / (1000 * 60 * 60 * 24));

    const status = waterStatus(daysSinceWatered, plant.waterFreq);
    const waterPct = Math.min(100, Math.round((daysSinceWatered / plant.waterFreq) * 100));

    const greenShades = ["#4A7C59", "#4A7A6B", "#4A6B3A", "#556B4A", "#6B7A3A", "#3D6B4F"];
    const plantColor = greenShades[plant.plantID % greenShades.length];

    function handleWater() {
        setWatered(true);
        onWater && onWater(plant.plantID);
        setTimeout(() => setWatered(false), 2000);
    }

    function truncateText(text, maxChars) {
        if (!text) return "";
        return text.length > maxChars ? text.slice(0, maxChars - 1) + "…" : text;
    }

    async function handleFlip(e) {
        e.stopPropagation();
        if (flipped) {
            setFlipped(false);
            return;
        }
        if (careData) {
            setFlipped(true);
            return;
        }
        if (!plant.careLink) {
            setCareError('No care link set for this plant.');
            setFlipped(true);
            return;
        }
        setCareLoading(true);
        setCareError(null);
        setFlipped(true);
        try {
            const res = await fetch(`${API_URL}/plants/${plant.plantID}/care`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load care info');
            setCareData(data);
        } catch (err) {
            setCareError(err.message);
        } finally {
            setCareLoading(false);
        }
    }

    return (
        <div
            onClick={() => !flipped && navigate(`/plants/${plant.plantID}/edit`)}
            style={{
                width: 220,
                height: 320,
                perspective: 1000,
                cursor: flipped ? "default" : "pointer",
                fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
        >
            {/* Flip container */}
            <div style={{
                width: "100%",
                height: 320,
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1)",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}>

                {/* ── FRONT ── */}
                <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderRadius: 18,
                    boxShadow: "0 4px 24px rgba(60,80,40,0.10), 0 1px 4px rgba(60,80,40,0.08)",
                    border: "1.5px solid #e8e2d4",
                }}>
                    <div style={{ borderRadius: 18, overflow: "hidden", background: "#faf8f3", height: "100%", display: "flex", flexDirection: "column" }}>

                        {/* Image */}
                        <div style={{
                            background: plant.color, height: 90, flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
                        }}>
                            <img src={plant.image} alt={plant.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <span style={{
                                position: "absolute", top: 10, right: 10,
                                background: "rgba(255,255,255,0.2)", color: "#fff",
                                fontSize: 10, fontFamily: "'Helvetica Neue', sans-serif",
                                letterSpacing: "0.08em", padding: "2px 8px",
                                borderRadius: 20, backdropFilter: "blur(6px)",
                                fontWeight: 600, textTransform: "uppercase",
                            }}>{plant.room}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Remove ${plant.name}?`)) {
                                        onDelete && onDelete(plant.plantID);
                                    }
                                }}
                                style={{
                                    position: "absolute", top: 8, left: 8,
                                    background: "rgba(0,0,0,0.35)", border: "none",
                                    borderRadius: "50%", width: 22, height: 22,
                                    color: "#fff", fontSize: 12, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    backdropFilter: "blur(4px)",
                                }}
                            >✕</button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: "8px 4px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
                                <div style={{ width: 6, backgroundColor: plant.color }} />
                                <div style={{ padding: "4px 12px", flex: 1 }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "#2d3a28" }}>
                                        {truncateText(plant.name, 12)} {/* truncate front card name */}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#8a9783", fontStyle: "italic", marginTop: 2 }}>{plant.scientific}</div>
                                </div>
                            </div>

                            <div style={{
                                display: "flex", alignItems: "center", gap: 5,
                                fontSize: 11, color: "#6b7c60",
                                fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 12,
                            }}>
                                <span>☀️</span><span>{plant.light} light</span>
                            </div>

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
                                        height: "100%", width: `${waterPct}%`,
                                        background: `linear-gradient(90deg, #78b88a, ${status.color})`,
                                        borderRadius: 99, transition: "width 0.4s",
                                    }} />
                                </div>
                                <div style={{ fontSize: 10, color: "#aaa", fontFamily: "'Helvetica Neue', sans-serif", marginTop: 3 }}>
                                    {daysSinceWatered}d ago · every {plant.waterFreq}d
                                </div>
                            </div>

                            {/* Care flip button */}
                            <div style={{ textAlign: "center", marginBottom: "auto", fontSize: 11, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1 }}>
                                {plant.careLink ? (
                                    <span
                                        onClick={handleFlip}
                                        style={{ color: "#4a7c59", textDecoration: "underline", cursor: "pointer", fontWeight: 600, lineHeight: 1 }}
                                    >
                                        🌿 View Care Info
                                    </span>
                                ) : (
                                    <span style={{ color: "#ccc", fontStyle: "italic" }}>No Care Link</span>
                                )}
                            </div>

                            {/* Water button */}
                            <div style={{ position: "relative", padding: 2, marginTop: "auto" }}
                                onClick={e => e.stopPropagation()}>
                                {pendingWater && (
                                    <div style={{
                                        position: "absolute", bottom: 0, left: 0,
                                        height: 4, width: `${progress}%`,
                                        background: "#ffffffaa", borderRadius: 4,
                                        transition: "width 0.1s linear",
                                    }} />
                                )}
                                <button
                                    onClick={() => {
                                        if (pendingWater) {
                                            clearInterval(timerRef.current);
                                            setPendingWater(false);
                                            setProgress(100);
                                            return;
                                        }
                                        setPendingWater(true);
                                        let timeLeft = 3000;
                                        const interval = 100;
                                        timerRef.current = setInterval(() => {
                                            timeLeft -= interval;
                                            setProgress((timeLeft / 3000) * 100);
                                            if (timeLeft <= 0) {
                                                clearInterval(timerRef.current);
                                                setPendingWater(false);
                                                setProgress(100);
                                                handleWater();
                                            }
                                        }, interval);
                                    }}
                                    style={{
                                        width: "100%", padding: "7px 0", borderRadius: 10,
                                        border: "none",
                                        background: pendingWater ? "#b65c5c" : watered ? "#5aaa72" : status.urgent ? "#e0654a" : plantColor,
                                        color: "#fff", fontFamily: "'Helvetica Neue', sans-serif",
                                        fontSize: 12, fontWeight: 700, letterSpacing: "0.05em",
                                        cursor: "pointer", transition: "background 0.25s",
                                    }}
                                >
                                    {pendingWater ? "Undo" : watered ? "✓ Watered!" : "Mark as Watered"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BACK ── */}
                <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: 18,
                    border: "1.5px solid #c8d8c0",
                    boxShadow: "0 4px 24px rgba(60,80,40,0.10)",
                    overflow: "hidden",
                    background: "#f5f9f3",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    {/* Back header */}
                    <div style={{
                        background: plant.color || "#4a7c59",
                        padding: "12px 14px 10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0,
                    }}>
                        <div>
                            <div style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: "#2d3a28",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                                {truncateText(plant.name, 12)}
                            </div>
                            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, fontStyle: "italic", fontFamily: "'Helvetica Neue', sans-serif" }}>Care Guide</div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
                            style={{
                                background: "rgba(255,255,255,0.2)", border: "none",
                                borderRadius: "50%", width: 24, height: 24,
                                color: "#fff", fontSize: 13, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >✕</button>
                    </div>

                    {/* Back body */}
                    <div style={{
                        flex: 1, overflowY: "auto", padding: "10px 12px",
                        fontFamily: "'Helvetica Neue', sans-serif",
                    }}>
                        {careLoading && (
                            <div style={{ textAlign: "center", color: "#8a9e80", fontSize: 12, marginTop: 30 }}>
                                🌱 Loading care info...
                            </div>
                        )}
                        {careError && !careLoading && (
                            <div style={{ textAlign: "center", color: "#e07b4a", fontSize: 11, marginTop: 30, padding: "0 8px" }}>
                                {careError}
                            </div>
                        )}
                        {careData && !careLoading && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {Object.entries(careData).map(([key, value]) =>
                                    CARE_LABELS[key] ? (
                                        <div key={key} style={{
                                            background: "#fff", borderRadius: 8,
                                            padding: "5px 10px", border: "1px solid #e8e2d4",
                                        }}>
                                            <div style={{ fontSize: 9, color: "#8a9e80", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                                {CARE_LABELS[key]}
                                            </div>
                                            <div style={{ fontSize: 11, color: "#2d3a28", marginTop: 2 }}>{value}</div>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}