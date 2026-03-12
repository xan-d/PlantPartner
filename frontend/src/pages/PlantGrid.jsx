import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

// components
import PlantCard from "../components/PlantCard";
import AddPlantCard from "../components/AddPlantCard";
import Header from "../components/Header";
import '../styleSheets/Tokens.css';
import '../styleSheets/PlantGrid.css';

// utils
import { daysSince } from '../utils/plantHelpers';

export default function PlantGrid({ plants: externalPlants, hideHeader = false }) {
    const navigate = useNavigate();
    const [internalPlants, setInternalPlants] = useState([]);

    const [page, setPage] = useState(0);
    const PLANTS_PER_PAGE = 8;

    const LAYOUTS = [
        { label: "1", cardsPerRow: 1, maxWidth: "520px", cardHeight: 420, gap: 10, padding: 20 },
        { label: "2", cardsPerRow: 2, maxWidth: "420px", cardHeight: 380, gap: 10, padding: 16 },
        { label: "3", cardsPerRow: 3, maxWidth: "320px", cardHeight: 340, gap: 8, padding: 12 },
        { label: "4", cardsPerRow: 4, maxWidth: "260px", cardHeight: 320, gap: 6, padding: 10 },
    ];
    const [layoutIdx, setLayoutIdx] = useState(1);
    const layout = LAYOUTS[layoutIdx];
    const gridTopRef = useRef(null);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const mobileLayouts = windowWidth < 480
        ? LAYOUTS.filter(l => l.label === "1" || l.label === "2")
        : LAYOUTS;

    const [searchTerm, setSearchTerm] = useState('');

    const isControlled = Array.isArray(externalPlants);
    const plants = isControlled ? externalPlants : internalPlants;

    const sortedPlants = useMemo(() => {
        return [...plants].sort((a, b) => {
            const urgencyA = a.lastWatered ? daysSince(a.lastWatered) / a.waterFreq : Infinity;
            const urgencyB = b.lastWatered ? daysSince(b.lastWatered) / b.waterFreq : Infinity;
            return urgencyB - urgencyA;
        });
    }, [plants]);

    useEffect(() => {
        if (!isControlled) fetchPlants();
    }, [isControlled]);

    useEffect(() => setPage(0), [plants.length]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                    prev.map(p => p.plantID === id
                        ? { ...p, lastWatered: new Date().toISOString().split('T')[0] }
                        : p
                    ).sort((a, b) => {
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

    const totalPages = Math.ceil((sortedPlants.length + 1) / PLANTS_PER_PAGE);
    const filteredPlants = sortedPlants.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const itemsThisPage = filteredPlants.slice(
        page * PLANTS_PER_PAGE,
        (page + 1) * PLANTS_PER_PAGE
    );
    const showAddCard = itemsThisPage.length < PLANTS_PER_PAGE || (page === Math.floor(sortedPlants.length / PLANTS_PER_PAGE));

    const btnBase = {
        width: 28, height: 28, borderRadius: 6,
        fontSize: 11, fontWeight: 700, cursor: 'pointer',
        border: '1.5px solid',
    };

    return (
        <>
            {/* Header outside the max-width wrapper so it spans the full viewport */}
            {!hideHeader && <Header />}

            <div ref={gridTopRef} style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Controls bar: pages left, search middle, size right */}
                <div className="toolbar-controls">
                    {/* Controls bar: pages left, search middle, size right */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 20px',
                        marginBottom: 10,
                    }}>

                        {/* Page number buttons — left */}
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    style={{
                                        ...btnBase,
                                        borderColor: page === i ? 'var(--terra-dark)' : '#e8e2d4',
                                        background: page === i ? 'var(--terra-dark)' : '#faf8f3',
                                        color: page === i ? '#fff' : '#6b7c60',
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        {/* Search bar — middle */}
                        <div className="plant-search-wrapper">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
                                placeholder="Search"
                                className="plant-search-input"
                            />
                            <button
                                type="button"
                                className="plant-search-btn"
                                onClick={() => { }}
                            >
                                <img
                                    src="/search-icon.svg"
                                    alt="Search"
                                    width="18"
                                    height="18"
                                />
                            </button>
                        </div>

                        {/* Size toggle — right */}
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {mobileLayouts.map((l, i) => (
                                <button
                                    key={l.label}
                                    onClick={() => setLayoutIdx(i)}
                                    style={{
                                        ...btnBase,
                                        borderColor: layoutIdx === i ? 'var(--terra-dark)' : '#e8e2d4',
                                        background: layoutIdx === i ? 'var(--terra-dark)' : '#faf8f3',
                                        color: layoutIdx === i ? '#fff' : '#6b7c60',
                                    }}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        position: 'relative',   // ensures it's not affected by parent padding
                        left: 0,
                        right: 0,
                        width: '100%',
                        height: '1px',
                        backgroundColor: '#d1d1d1',
                        margin: '0',            // removes default spacing
                    }}
                />

                {/* Plant grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${layout.cardsPerRow}, minmax(0, ${layout.maxWidth}))`,
                        gap: `${layout.gap}px`,
                        padding: `${layout.padding}px`,
                        justifyContent: "center",
                    }}
                >
                    {itemsThisPage.map(plant => (
                        <PlantCard
                            key={plant.plantID}
                            plant={plant}
                            cardHeight={layout.cardHeight}
                            onWater={handleWaterPlant}
                            onDelete={handleDelete}
                        />
                    ))}
                    {showAddCard && <AddPlantCard onClick={() => navigate("/plants/add")} />}
                </div>

            </div>
        </>
    );
}