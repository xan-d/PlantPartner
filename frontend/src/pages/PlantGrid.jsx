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

    function LayoutIcon({ cols }) {
        const count = parseInt(cols, 10);
        const icons = {
            1: (
                <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor">
                    <rect x="1" y="1" width="14" height="5" rx="1" opacity="0.85" />
                    <rect x="1" y="8" width="14" height="5" rx="1" opacity="0.3" />
                </svg>
            ),
            2: (
                <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor">
                    <rect x="1" y="1" width="6" height="5" rx="1" opacity="0.85" />
                    <rect x="9" y="1" width="6" height="5" rx="1" opacity="0.85" />
                    <rect x="1" y="8" width="6" height="5" rx="1" opacity="0.3" />
                    <rect x="9" y="8" width="6" height="5" rx="1" opacity="0.3" />
                </svg>
            ),
            3: (
                <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor">
                    <rect x="1" y="1" width="3.5" height="5" rx="1" opacity="0.85" />
                    <rect x="6.25" y="1" width="3.5" height="5" rx="1" opacity="0.85" />
                    <rect x="11.5" y="1" width="3.5" height="5" rx="1" opacity="0.85" />
                    <rect x="1" y="8" width="3.5" height="5" rx="1" opacity="0.3" />
                    <rect x="6.25" y="8" width="3.5" height="5" rx="1" opacity="0.3" />
                    <rect x="11.5" y="8" width="3.5" height="5" rx="1" opacity="0.3" />
                </svg>
            ),
            4: (
                <svg width="26" height="14" viewBox="0 0 30 14" fill="currentColor">
                    <rect x="0" y="1" width="4" height="5" rx="0.75" opacity="0.85" />
                    <rect x="7" y="1" width="4" height="5" rx="0.75" opacity="0.85" />
                    <rect x="14" y="1" width="4" height="5" rx="0.75" opacity="0.85" />
                    <rect x="21" y="1" width="4" height="5" rx="0.75" opacity="0.85" />
                    <rect x="0" y="8" width="4" height="5" rx="0.75" opacity="0.3" />
                    <rect x="7" y="8" width="4" height="5" rx="0.75" opacity="0.3" />
                    <rect x="14" y="8" width="4" height="5" rx="0.75" opacity="0.3" />
                    <rect x="21" y="8" width="4" height="5" rx="0.75" opacity="0.3" />
                </svg>
            ),
        };

        return <span className="layout-icon" aria-hidden="true">{icons[count] ?? null}</span>;
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
        {!hideHeader && (
            <Header
                searchTerm={searchTerm}
                onSearchChange={val => { setSearchTerm(val); setPage(0); }}
            />
        )}

        <div ref={gridTopRef} style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Toolbar: pagination left, layout right */}
            <div className="toolbar-controls">
                <div className="toolbar-inner">

                    {/* Pagination — segmented control */}
                    {totalPages > 1 && (
                        <div className="seg-control">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`seg-btn ${page === i ? 'seg-btn--active' : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Layout toggle — icon-based segmented control */}
                    <div className="seg-control seg-control--right">
                        {mobileLayouts.map((l, i) => (
                            <button
                                key={l.label}
                                onClick={() => setLayoutIdx(i)}
                                className={`seg-btn ${layoutIdx === i ? 'seg-btn--active' : ''}`}
                                aria-label={`${l.label} columns`}
                                title={`${l.label} columns`}
                            >
                                <LayoutIcon cols={l.label} />
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