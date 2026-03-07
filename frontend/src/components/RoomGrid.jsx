/**
 * RoomGrid.jsx
 * Dashboard widget: a card housing procedurally generated room sub-cards.
 * Each room card shows plant count + overdue badge, and navigates to /rooms/:roomName.
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupPlantsByRoom, getRoomSummaries } from '../utils/roomHelpers';
import { daysSince } from '../utils/plantHelpers';
import '../styleSheets/RoomGrid.css';

export default function RoomGrid({ plants = [] }) {
    const navigate = useNavigate();

    const roomSummaries = useMemo(() => {
        const grouped = groupPlantsByRoom(plants);
        return getRoomSummaries(grouped, daysSince);
    }, [plants]);

    if (roomSummaries.length === 0) {
        return (
            <div className="room-grid-section">
                <h2 className="section-title">🏠 Plants by Room</h2>
                <p className="section-empty">No rooms found. Add a room to your plants to see them grouped here.</p>
            </div>
        );
    }

    const handleRoomClick = (roomName) => {
        // Encode the room name for safe URL usage
        navigate(`/rooms/${encodeURIComponent(roomName)}`);
    };

    return (
        <div className="room-grid-section" style={{ marginBottom: '20px' }}>
            <div className="room-grid-outer-card">
                <h2 className="section-title">🏠 Plants by Room</h2>
                <div className="room-grid">
                    {roomSummaries.map((room) => (
                        <button
                            key={room.name}
                            className="room-card"
                            onClick={() => handleRoomClick(room.name)}
                            aria-label={`View plants in ${room.name}`}
                        >
                            <div className="room-card-emoji">{room.emoji}</div>
                            <div className="room-card-name">{room.name}</div>
                            <div className="room-card-count">
                                {room.plants.length} plant{room.plants.length !== 1 ? 's' : ''}
                            </div>
                            {room.overdueCount > 0 && (
                                <span className="room-card-badge">
                                    💧 {room.overdueCount} overdue
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}