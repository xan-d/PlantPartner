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
            const res = await fetch(`${API_URL}/plants`);
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
            const res = await fetch(`${API_URL}/plants/${id}/water`, { method: "PUT" });
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
            const res = await fetch(`${API_URL}/plants/${id}`, { method: "DELETE" });
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