import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

// components
import PlantCard from "../components/PlantCard";
import AddPlantCard from "../components/AddPlantCard";
import Header from "../components/Header";

// utils
import { daysSince } from '../utils/plantHelpers';

export default function PlantGrid({ plants: externalPlants, hideHeader = false }) {
    const navigate = useNavigate();
    const [internalPlants, setInternalPlants] = useState([]);

    const [page, setPage] = useState(0);
    const PLANTS_PER_PAGE = 8;

    const SIZES = [
        { label: '1', width: 'min(90vw, 320px)', height: '380px', gap: 6 },
        { label: '2', width: 'min(45vw, 320px)', height: '360px', gap: 4 },
        { label: '3', width: 'min(30vw, 260px)', height: '340px', gap: 2 },
    ];
    const [sizeIdx, setSizeIdx] = useState(1);
    const size = SIZES[sizeIdx];
    const gridTopRef = useRef(null);

    const isControlled = Array.isArray(externalPlants);
    const plants = isControlled ? externalPlants : internalPlants;

    useEffect(() => {
        if (!isControlled) fetchPlants();
    }, [isControlled]);

    useEffect(() => setPage(0), [plants.length]);

    async function fetchPlants() {
        try {
            const res = await fetch(`${API_URL}/api/plants`, { credentials: 'include' });
            if (!res.ok) return setInternalPlants([]);
            const data = await res.json();
            setInternalPlants(data.sort((a, b) => {
                const urgencyA = a.lastWatered ? daysSince(a.lastWatered) / a.waterFreq : Infinity;
                const urgencyB = b.lastWatered ? daysSince(b.lastWatered) / b.waterFreq : Infinity;
                return urgencyB - urgencyA;
            }));
        } catch (err) {
            console.error(err);
            setInternalPlants([]);
        }
    }

    async function handleWaterPlant(id) {
        try {
            const res = await fetch(`${API_URL}/api/plants/${id}/water`, {
                credentials: 'include', method: "PUT"
            });
            if (!res.ok) return;
            if (!isControlled) {
                setInternalPlants(prev =>
                    prev.map(p => p.plantID === id ? { ...p, lastWatered: new Date().toISOString().split('T')[0] } : p)
                        .sort((a, b) => {
                            const urgencyA = a.lastWatered ? daysSince(a.lastWatered) / a.waterFreq : Infinity;
                            const urgencyB = b.lastWatered ? daysSince(b.lastWatered) / b.waterFreq : Infinity;
                            return urgencyB - urgencyA;
                        })
                );
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete(id) {
        try {
            const res = await fetch(`${API_URL}/api/plants/${id}`, {
                credentials: 'include', method: "DELETE"
            });
            if (res.status === 204 && !isControlled) {
                setInternalPlants(prev => prev.filter(p => p.plantID !== id));
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Always add AddPlantCard
    const itemsThisPage = plants.slice(page * PLANTS_PER_PAGE, (page + 1) * PLANTS_PER_PAGE);
    const showAddCard = itemsThisPage.length < PLANTS_PER_PAGE || (page === Math.floor(plants.length / PLANTS_PER_PAGE));

    const totalPages = Math.ceil((plants.length + 1) / PLANTS_PER_PAGE); // +1 for AddCard

    return (
        <div ref={gridTopRef} style={{ fontFamily: "'Georgia', serif" }}>
            {!hideHeader && <Header />}

            {/* Size toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 20, marginBottom: 10 }}>
                {SIZES.map((s, i) => (
                    <button key={s.label} onClick={() => setSizeIdx(i)} style={{
                        width: 28, height: 28, borderRadius: 6,
                        border: '1.5px solid ' + (sizeIdx === i ? '#4a7c59' : '#e8e2d4'),
                        background: sizeIdx === i ? '#4a7c59' : '#faf8f3',
                        color: sizeIdx === i ? '#fff' : '#6b7c60',
                        fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    }}>{s.label}</button>
                ))}
            </div>

            {/* Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", '--card-width': size.width, '--card-height': size.height }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: size.gap, justifyContent: "center" }}>
                    {itemsThisPage.map(plant => (
                        <PlantCard key={plant.plantID} plant={plant} onWater={handleWaterPlant} onDelete={handleDelete} />
                    ))}

                    {showAddCard && <AddPlantCard onClick={() => navigate("/plants/add")} />}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 16 }}>
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 0} style={{
                            background: 'none', border: 'none', fontSize: 40, cursor: page === 0 ? 'default' : 'pointer',
                            color: page === 0 ? '#c8d8c0' : '#4a7c59'
                        }}>‹</button>
                        <span style={{ fontSize: 20, color: '#8a9e80' }}>{page + 1} / {totalPages}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} style={{
                            background: 'none', border: 'none', fontSize: 40, cursor: page >= totalPages - 1 ? 'default' : 'pointer',
                            color: page >= totalPages - 1 ? '#c8d8c0' : '#4a7c59'
                        }}>›</button>
                    </div>
                )}
            </div>
        </div>
    );
}