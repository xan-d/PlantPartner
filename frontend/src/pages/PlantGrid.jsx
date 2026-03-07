import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

// components
import PlantCard from "../components/PlantCard";
import AddPlantCard from "../components/AddPlantCard";
import Header from "../components/Header";

//utils
import { daysSince } from '../utils/plantHelpers';

export default function PlantGrid() {
    const navigate = useNavigate();
    const [plants, setPlants] = useState([]);

    const [notifyStatus, setNotifyStatus] = useState('default');

    useEffect(() => {
        if ('Notification' in window) {
            setNotifyStatus(Notification.permission);
        }
    }, []);

    async function enableNotifications() {
        try {
            const permission = await Notification.requestPermission();
            setNotifyStatus(permission);
            if (permission !== 'granted') {
                alert('Permission denied: ' + permission);
                return;
            }

            const reg = await navigator.serviceWorker.ready;
            //alert('SW ready: ' + reg.active?.state);

            const { publicKey } = await fetch(`${API_URL}/api/push/vapid-public-key`).then(r => r.json());
            //alert('Got public key');

            const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicKey
            });
            //alert('Subscribed: ' + subscription.endpoint);

            const res = await fetch(`${API_URL}/api/push/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(subscription)
            });
            const data = await res.json();
            //alert('Result: ' + JSON.stringify(data));
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    useEffect(() => {
        fetchPlants();
    }, []);

    async function fetchPlants() {
        try {
            const res = await fetch(`${API_URL}/api/plants`, { credentials: 'include' });
            if (!res.ok) { setPlants([]); return; }
            const data = await res.json();
            setPlants(data.sort((a, b) => {
                const urgencyA = daysSince(a.lastWatered) / a.waterFreq;
                const urgencyB = daysSince(b.lastWatered) / b.waterFreq;
                return urgencyB - urgencyA;
            }));
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

            // increment global(user scope) watered count
            await fetch(`${API_URL}/api/user/stats`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ incrementWatered: true }),
            });

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
            fontFamily: "'Georgia', serif",
        }}>
            {/* Header */}
            {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 6 }}>
                <p style={{
                    color: "#8a9e80", fontSize: 14,
                    fontFamily: "'Helvetica Neue', sans-serif",
                    margin: 0, fontStyle: "italic",
                }}>{plants.length} plants in your collection</p>

                {notifyStatus === 'default' && (
                    <button onClick={enableNotifications} style={{
                        background: "#4a7c59", color: "#fff", border: "none",
                        padding: "6px 16px", borderRadius: 50, fontSize: 11,
                        fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 700,
                        letterSpacing: "0.05em", cursor: "pointer",
                    }}>
                        🔔 Enable Notifications
                    </button>
                )}
                {notifyStatus === 'granted' && (
                    <span style={{ fontSize: 12, color: "#4a7c59", fontFamily: "'Helvetica Neue', sans-serif" }}>
                        🔔 Notifications Enabled
                    </span>
                )}
            </div> */}

            <div>
                <Header />
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