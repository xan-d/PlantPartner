import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import PlantCard from "../components/PlantCard";
import AddPlantCard from "../components/AddPlantCard";

export default function PlantGrid() {
    const navigate = useNavigate();
    const [plants, setPlants] = useState([]);

    useEffect(() => {
        fetchPlants();
    }, []);

    async function fetchPlants() {
        try {
            const res = await fetch(`${API_URL}/api/plants`, { credentials: 'include' });
            if (!res.ok) {
                console.error("Failed to fetch plants", res.status);
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

    async function handleWaterPlant(id) {
        try {
            const res = await fetch(`${API_URL}/api/plants/${id}/water`, {
                credentials: 'include',
                method: "PUT"
            });
            if (!res.ok) return;

            setPlants(prev =>
                prev
                    .map(p => p.plantID === id ? { ...p, lastWatered: 0 } : p)
                    .sort((a, b) => b.lastWatered - a.lastWatered)
            );
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
                setPlants(prev => prev.filter(p => p.plantID !== id));
            } else {
                alert("Failed to delete plant");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete plant");
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
                {plants.map(plant => (
                    <PlantCard
                        key={plant.plantID}
                        plant={plant}
                        onWater={handleWaterPlant}
                        onDelete={handleDelete}
                    />
                ))}
                <AddPlantCard onClick={() => navigate("/plants/add")} />
            </div>
        </div>
    );
}