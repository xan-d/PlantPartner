/**
 * RoomPage.jsx
 * Displays all plants in a specific room.
 * Reuses PlantGrid.jsx by passing a pre-filtered plant list.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import Header from '../components/Header';
import PlantGrid from './PlantGrid';
import { groupPlantsByRoom, getRoomSummaries } from '../utils/roomHelpers';
import { daysSince } from '../utils/plantHelpers';
import '../styleSheets/Room.css';

export default function RoomPage() {
    const { roomName } = useParams();
    const navigate = useNavigate();
    const decodedRoom = decodeURIComponent(roomName);

    const [allPlants, setAllPlants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPlants() {
            try {
                const res = await fetch(`${API_URL}/api/plants`, { credentials: 'include' });
                const data = res.ok ? await res.json() : [];
                setAllPlants(data);
            } catch (err) {
                console.error('Failed to load plants for room', err);
            } finally {
                setLoading(false);
            }
        }
        fetchPlants();
    }, []);

    const roomPlants = allPlants.filter(p => {
        const plantRoom = p.room?.trim() || 'Unassigned';
        return plantRoom === decodedRoom;
    });

    const overdueCount = roomPlants.filter(p => daysSince(p.lastWatered) >= p.waterFreq).length;
    const healthyCount = roomPlants.length - overdueCount;

    if (loading) {
        return (
            <div className="room-page-loading">
                <p>🌱 Loading room...</p>
            </div>
        );
    }

    return (
        <div className="room-page">
            <Header />
            <div className="room-page-content">

                {/* Room header section — blue background covers title + subtitle + chips */}
                <div className="room-page-header-section">
                    <div className="room-page-header">
                        <h1 className="room-page-title">{decodedRoom}</h1>
                        <p className="room-page-subtitle">
                            {roomPlants.length} plant{roomPlants.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="room-stat-row">
                        <button className="room-back-btn" onClick={() => navigate('/dashboard')}>
                            ← Go Back
                        </button>
                        <div className="room-stat-chip">
                            <span>🌿</span>
                            <span>{roomPlants.length} Total</span>
                        </div>
                        <div className="room-stat-chip healthy">
                            <span>✅</span>
                            <span>{healthyCount} Hydrated</span>
                        </div>
                        {overdueCount > 0 && (
                            <div className="room-stat-chip overdue">
                                <span>💧</span>
                                <span>{overdueCount} Overdue</span>
                            </div>
                        )}
                    </div>

                </div>

                {/* Divider */}
                <hr className="room-divider" />

                {/* Plant grid */}
                {roomPlants.length === 0 ? (
                    <p className="room-page-empty">No plants found in this room.</p>
                ) : (
                    <div className="room-plants-section">
                        <PlantGrid plants={roomPlants} hideHeader={true} />
                    </div>
                )}

            </div>
        </div>
    );
}