import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

// components
import PlantCard from "../components/PlantCard";
import AddPlantCard from "../components/AddPlantCard";
import Header from "../components/Header";

//utils
import { daysSince, sortPlants } from '../utils/plantHelpers';

// Props:
//   plants     - optional external plant list (e.g. from RoomPage). If omitted, fetches its own.
//   hideHeader - if true, suppresses the Header component (used when embedded in another page)
export default function PlantGrid({ plants: externalPlants, hideHeader = false }) {
    const navigate = useNavigate();
    const [internalPlants, setInternalPlants] = useState([]);
    const [notifyStatus, setNotifyStatus] = useState('default');

    const totalItems = plants.length + (!isControlled ? 1 : 0);

    //limit plants
    const [page, setPage] = useState(0);
    const PLANTS_PER_PAGE = 6;

    // Add this near your other useState hooks
    const SIZES = [
        { label: '1', width: 'min(90vw, 320px)', height: '380px', gap: 6 },
        { label: '2', width: 'min(45vw, 320px)', height: '360px', gap: 4 },
        { label: '3', width: 'min(30vw, 260px)', height: '340px', gap: 2 },
    ];
    const [sizeIdx, setSizeIdx] = useState(1);
    const size = SIZES[sizeIdx];
    const [cardPadding, setCardPadding] = useState(4);

    const gridTopRef = useRef(null);

    // Use external plants if provided, otherwise use internal state
    const isControlled = Array.isArray(externalPlants);
    const plants = isControlled ? externalPlants : internalPlants;

    useEffect(() => {
        if ('Notification' in window) {
            setNotifyStatus(Notification.permission);
        }
    }, []);

    useEffect(() => {
        // Only fetch internally if no external plants were passed
        if (!isControlled) {
            fetchPlants();
        }
    }, [isControlled]);

    useEffect(() => {
        setPage(0);
    }, [plants.length]);

    async function fetchPlants() {
        try {
            const res = await fetch(`${API_URL}/api/plants`, { credentials: 'include' });
            if (!res.ok) { setInternalPlants([]); return; }
            const data = await res.json();
            setInternalPlants(sortPlants(data));
        } catch (err) {
            console.error(err);
            setInternalPlants([]);
        }
    }

    async function handleWaterPlant(id) {
        try {
            const res = await fetch(`${API_URL}/api/plants/${id}/water`, {
                credentials: 'include',
                method: "PUT"
            });
            if (!res.ok) return;

            await fetch(`${API_URL}/api/user/stats`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ incrementWatered: true }),
            });

            // If controlled, parent manages state — nothing to update locally
            if (!isControlled) {
                setInternalPlants(prev =>
                    sortPlants(
                        prev.map(p => p.plantID === id ? { ...p, lastWatered: 0 } : p)
                    )
                );
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete(id) {
        try {
            const res = await fetch(`${API_URL}/api/plants/${id}`, {
                credentials: 'include',
                method: "DELETE"
            });
            if (res.status === 204) {
                if (!isControlled) {
                    setInternalPlants(prev => prev.filter(p => p.plantID !== id));
                }
            } else {
                alert("Failed to delete plant");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete plant");
        }
    }

    return (
        <div ref={gridTopRef} style={{ fontFamily: "'Georgia', serif" }}>

            {!hideHeader && (
                <div>
                    <Header />
                </div>
            )}

            {/* Size toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 20, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: '#8a9e80', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
                    Size
                </span>
                {SIZES.map((s, i) => (
                    <button
                        key={s.label}
                        onClick={() => setSizeIdx(i)}
                        style={{
                            width: 28, height: 28, borderRadius: 6,
                            border: '1.5px solid ' + (sizeIdx === i ? '#4a7c59' : '#e8e2d4'),
                            background: sizeIdx === i ? '#4a7c59' : '#faf8f3',
                            color: sizeIdx === i ? '#fff' : '#6b7c60',
                            fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                justifyContent: "center",
                '--card-width': size.width,
                '--card-height': size.height,
                '--card-padding': `${cardPadding}px`,
            }}>

                <div style={{ display: "flex", flexWrap: "wrap", gap: size.gap, justifyContent: "center" }}>
                    {plants.length === 0 && (
                        <div style={{
                            display: "flex", flexDirection: "column", alignItems: "center",
                            justifyContent: "center", gap: 16, padding: "40px 24px",
                            background: "#faf8f3", borderRadius: 18, border: "1.5px dashed #c8d8c0",
                            width: 220, minHeight: 320, textAlign: "center",
                            fontFamily: "'Georgia', serif",
                        }}>
                            <div style={{ fontSize: 48 }}>🌱</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#2d3a28" }}>
                                Welcome to PlantPartner!
                            </div>
                            <div style={{ fontSize: 12, color: "#8a9e80", fontStyle: "italic", lineHeight: 1.6 }}>
                                You don't have any plants yet. Add your first one to get started!
                            </div>
                            <button
                                onClick={() => navigate("/plants/add")}
                                style={{
                                    background: "#4a7c59", color: "#fff", border: "none",
                                    padding: "8px 20px", borderRadius: 50, fontSize: 12,
                                    fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 700,
                                    letterSpacing: "0.05em", cursor: "pointer",
                                    boxShadow: "0 4px 12px rgba(74,124,89,0.25)",
                                }}
                            >
                                + Add First Plant
                            </button>
                        </div>
                    )}
                    {plants
                        .slice(page * PLANTS_PER_PAGE, (page + 1) * PLANTS_PER_PAGE)
                        .map(plant => (
                            <PlantCard
                                key={plant.plantID}
                                plant={plant}
                                onWater={handleWaterPlant}
                                onDelete={handleDelete}
                            />
                        ))}
                    {!isControlled && (
                        <AddPlantCard onClick={() => navigate("/plants/add")} />
                    )}
                </div>

                {/* Pagination arrows */}
                {plants.length > PLANTS_PER_PAGE && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
                        <button
                            onClick={() => {
                                setPage(p => p - 1);
                                setTimeout(() => gridTopRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
                            }}
                            disabled={page === 0}
                            style={{
                                background: 'none', border: 'none', fontSize: 40, cursor: page === 0 ? 'default' : 'pointer',
                                color: page === 0 ? '#c8d8c0' : '#4a7c59', fontWeight: 700, lineHeight: 1,
                            }}
                        >‹</button>
                        <span style={{ fontSize: 20, color: '#8a9e80', fontFamily: "'Helvetica Neue', sans-serif" }}>
                            {page + 1} / {Math.ceil(plants.length / PLANTS_PER_PAGE)}
                        </span>
                        <button
                            onClick={() => {
                                setPage(p => p + 1);
                                setTimeout(() => gridTopRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
                            }}
                            disabled={(page + 1) * PLANTS_PER_PAGE >= plants.length}
                            style={{
                                background: 'none', border: 'none', fontSize: 40,
                                cursor: (page + 1) * PLANTS_PER_PAGE >= plants.length ? 'default' : 'pointer',
                                color: (page + 1) * PLANTS_PER_PAGE >= plants.length ? '#c8d8c0' : '#4a7c59',
                                fontWeight: 700, lineHeight: 1,
                            }}
                        >›</button>
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: "'Helvetica Neue', sans-serif" }}>
                </div>
            </div>
        </div>
    );
}