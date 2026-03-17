/**
 * RoomGrid.jsx
 * Dashboard widget: a card housing procedurally generated room sub-cards.
 * Each room card shows plant count + overdue badge, and navigates to /rooms/:roomName.
 */

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupPlantsByRoom, getRoomSummaries } from '../utils/roomHelpers';
import { daysSince } from '../utils/plantHelpers';
import { API_URL } from '../config';
import Icon from './Icon';
import '../styleSheets/RoomGrid.css';

export default function RoomGrid({ plants = [] }) {
    const navigate = useNavigate();
    const [formOpen, setFormOpen] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        if (!formOpen) return;
        const handleClick = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                setFormOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [formOpen]);
    const [roomName, setRoomName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const roomSummaries = useMemo(() => {
        const grouped = groupPlantsByRoom(plants);
        return getRoomSummaries(grouped, daysSince);
    }, [plants]);

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        if (!roomName.trim() || submitting) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/api/bugs/room-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ roomName: roomName.trim() }),
            });
            if (res.ok) {
                setSubmitted(true);
                setRoomName('');
                setTimeout(() => { setSubmitted(false); setFormOpen(false); }, 1800);
            }
        } catch { /* silently fail */ }
        finally { setSubmitting(false); }
    };

    if (roomSummaries.length === 0) {
        return (
            <div className="room-grid-section">
                <h2 className="section-title"><Icon name="home" size={20} /> Plants by Room</h2>
                <p className="section-empty">No rooms found. Add a room to your plants to see them grouped here.</p>
            </div>
        );
    }

    const handleRoomClick = (roomName) => {
        // Encode the room name for safe URL usage
        navigate(`/rooms/${encodeURIComponent(roomName)}`);
    };

    return (
        <div className="room-grid-section" style={{ marginBottom: '10px' }}>
            <div className="room-grid-outer-card">
                <h2 className="room-grid-label">
                    <span className="room-grid-label-text"><Icon name="home" size={16} /> Plants by Room</span>
                    <div ref={formRef} className="info-tooltip room-grid-info-tooltip">
                        <span className="info-icon" onClick={() => setFormOpen(f => !f)}>i</span>
                        {formOpen && (
                            <div className="room-request-form-wrap">
                                {submitted ? (
                                    <div className="room-request-success">Request sent!</div>
                                ) : (
                                    <form className="room-request-form" onSubmit={handleSubmitRequest}>
                                        <div className="room-request-title">Request a room icon</div>
                                        <input
                                            className="room-request-input"
                                            type="text"
                                            placeholder="e.g. Sunroom"
                                            value={roomName}
                                            onChange={e => setRoomName(e.target.value)}
                                            maxLength={50}
                                            autoFocus
                                        />
                                        <button
                                            className="room-request-submit"
                                            type="submit"
                                            disabled={submitting || !roomName.trim()}
                                        >
                                            {submitting ? 'Sending...' : 'Submit'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </h2>
                <div className="room-grid">
                    {roomSummaries.map((room) => (
                        <button
                            key={room.name}
                            className="room-card"
                            onClick={() => handleRoomClick(room.name)}
                            aria-label={`View plants in ${room.name}`}
                        >
                            {room.overdueCount > 0 && (
                                <span className="room-card-overdue">
                                    <Icon name="drop" size={12} /> {room.overdueCount}
                                </span>
                            )}
                            <div className="room-card-emoji"><Icon name={room.icon} size={28} /></div>
                            <div className="room-card-name">{room.name}</div>
                            <div className="room-card-count">
                                {room.plants.length} plant{room.plants.length !== 1 ? 's' : ''}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}