import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { daysSince, waterStatus, CARE_LABELS, truncateText, greenShades } from '../utils/plantHelpers';
import Icon from './Icon';
import useMediaQuery from '../utils/useMediaQuery';
import '../styleSheets/PlantCard.css';

export default function PlantCard({ plant, onDelete, onWater, cardHeight }) {
    const [watered, setWatered] = useState(false);
    const [pendingWater, setPendingWater] = useState(false);
    const [progress, setProgress] = useState(100);
    const [flipped, setFlipped] = useState(false);
    const [careData, setCareData] = useState(null);
    const [careLoading, setCareLoading] = useState(false);
    const [careError, setCareError] = useState(null);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    const isMobile = useMediaQuery('(max-width: 480px)');
    const waterLabel = pendingWater
        ? "Undo"
        : watered
            ? "✓"
            : isMobile
                ? "Water"
                : "Mark as Watered";

    if (!plant) return null;

    const daysSinceWatered = daysSince(plant.lastWatered);
    const status = waterStatus(daysSinceWatered, plant.waterFreq);
    const waterPct = Math.min(100, Math.round((daysSinceWatered / plant.waterFreq) * 100));
    const plantColor = greenShades[plant.plantID % greenShades.length];
    const [notes, setNotes] = useState(plant.notes || '');
    const [notesSaved, setNotesSaved] = useState(false);
    const [notesEditing, setNotesEditing] = useState(false);
    const notesRef = useRef(null);

    function handleWater() {
        setWatered(true);
        onWater && onWater(plant.plantID);
        setTimeout(() => setWatered(false), 2000);
    }

    async function handleFlip(e) {
        e.stopPropagation();
        if (flipped) { setFlipped(false); return; }
        if (careData) { setFlipped(true); return; }
        if (!plant.careLink) {
            setCareError('No care link set for this plant.');
            setFlipped(true);
            return;
        }
        setCareLoading(true);
        setCareError(null);
        setFlipped(true);
        try {
            const res = await fetch(`${API_URL}/api/plants/${plant.plantID}/care`, { credentials: 'include' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load care info');
            setCareData(data);
        } catch (err) {
            setCareError(err.message);
        } finally {
            setCareLoading(false);
        }
    }

    return (
        <div
            style={{ width: "100%", height: cardHeight || "100%" }}
            onClick={() => !flipped && navigate(`/plants/${plant.plantID}/edit`)}
            className={`plant-card ${flipped ? 'is-flipped' : ''}`}
        >
            {/* Flip container */}
            <div className={`flip-container ${flipped ? 'flipped' : ''}`}>

                {/* ── FRONT ── */}
                <div className="card-face card-front">
                    <div className="card-front-inner">

                        {/* Image */}
                        <div className="card-image" style={{ background: plant.color }}>
                            <img src={plant.image} alt={plant.name} />
                            <span className="card-room-badge">{plant.room}</span>
                            <button
                                className="card-delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Remove ${plant.name}?`)) {
                                        onDelete && onDelete(plant.plantID);
                                    }
                                }}
                            >✕</button>
                        </div>

                        {/* Body */}
                        <div className="card-body">
                            <div className="card-name-row">
                                <div className="card-color-bar" style={{ backgroundColor: plant.color }} />
                                <div className="card-name-content">
                                    <div className="card-name">
                                        {isMobile
                                            ? truncateText(plant.name, 10)
                                            : truncateText(plant.name, 18)
                                        }
                                    </div>
                                    <div className="card-scientific">{plant.scientific}</div>
                                </div>
                            </div>

                            <div className="card-light">
                                <span><Icon name="sun" size={16} /></span>
                                <span className="card-light-desc">{plant.light}</span>
                            </div>

                            <div className="card-water-section">
                                <div className="card-water-header">
                                    <span>{isMobile
                                        ? <Icon name="drop" size={16} />
                                        : <><Icon name="drop" size={16} /> Water</>
                                    }</span>
                                    <span style={{ color: status.color, fontWeight: 700 }}>{status.label}</span>
                                </div>
                                <div className="card-water-bar-track">
                                    <div
                                        className="card-water-bar-fill"
                                        style={{
                                            width: `${waterPct}%`,
                                            background: `linear-gradient(90deg, #78b88a, ${status.color})`,
                                        }}
                                    />
                                </div>
                                <div className="card-water-label">
                                    {daysSinceWatered}d ago · every {plant.waterFreq}d
                                </div>
                            </div>

                            <div className="card-actions-row">

                                {/* Water button */}
                                <div className="card-water-btn-wrap" onClick={e => e.stopPropagation()}>
                                    {pendingWater && (
                                        <div className="card-undo-progress" style={{ width: `${progress}%` }} />
                                    )}
                                    <button
                                        className="card-water-btn"
                                        style={{
                                            background: pendingWater
                                                ? "var(--glass-terra-dark)"
                                                : watered
                                                    ? "var(--g-sage)"
                                                    : "var(--g-deep)",
                                        }}
                                        onClick={() => {
                                            if (pendingWater) {
                                                clearInterval(timerRef.current);
                                                setPendingWater(false);
                                                setProgress(100);
                                                return;
                                            }
                                            setPendingWater(true);
                                            let timeLeft = 3000;
                                            const interval = 100;
                                            timerRef.current = setInterval(() => {
                                                timeLeft -= interval;
                                                setProgress((timeLeft / 3000) * 100);
                                                if (timeLeft <= 0) {
                                                    clearInterval(timerRef.current);
                                                    setPendingWater(false);
                                                    setProgress(100);
                                                    handleWater();
                                                }
                                            }, interval);
                                        }}
                                    >
                                        {waterLabel}
                                    </button>
                                </div>

                                {/* Care flip button */}
                                <div className="card-care-link">
                                    {plant.careLink ? (
                                        <button
                                            className="card-care-btn"
                                            onClick={handleFlip}
                                        >
                                            <img
                                                src="/care-info.png"
                                                alt="Care Info"
                                                className="card-care-icon"
                                            />
                                        </button>
                                    ) : (
                                        <span className="inactive">No Care Link</span>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BACK ── */}
                <div className="card-face card-back">
                    <div className="card-back-header" style={{ background: plant.color || "#4a7c59" }}>

                        <div>
                            <div className="card-back-title">{truncateText(plant.name, 18)}</div>
                            <div className="card-back-subtitle">Care Guide</div>
                        </div>
                        <button
                            className="card-back-close"
                            onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
                        >↩</button>
                    </div>

                    <div className="card-back-body">
                        {/* Notes section */}
                        <div className="card-notes-section" onClick={e => e.stopPropagation()}>
                            <button
                                className="card-notes-toggle"
                                onClick={(e) => {
                                    const body = document.getElementById(`notes-${plant.plantID}`);
                                    body.classList.toggle('open');
                                    e.currentTarget.classList.toggle('open');
                                }}
                            >
                                <Icon name="edit" size={14} /> Notes
                            </button>
                            <div id={`notes-${plant.plantID}`} className="card-notes-body">
                                <div
                                    ref={notesRef}
                                    className="card-notes-input"
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="Add a quick note..."
                                    onFocus={() => { notesRef.current.classList.add('editing'); setNotesEditing(true); }}
                                    onBlur={() => {
                                        notesRef.current.classList.remove('editing');
                                        setNotes(notesRef.current.innerText);
                                        setNotesSaved(false);
                                        setNotesEditing(false);
                                    }}
                                >
                                    {notes}
                                </div>
                                {notesEditing && (
                                    <div className="card-notes-footer">
                                        <span className="card-notes-count">{notes.length}/300</span>
                                        <button
                                            className="card-notes-save"
                                            onMouseDown={async (e) => {
                                                e.preventDefault();
                                                const currentNotes = notesRef.current.innerText;
                                                await fetch(`${API_URL}/api/plants/${plant.plantID}/notes`, {
                                                    method: 'PATCH',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    credentials: 'include',
                                                    body: JSON.stringify({ notes: currentNotes }),
                                                });
                                                setNotes(currentNotes);
                                                setNotesSaved(false);
                                                setNotesEditing(false);
                                                notesRef.current.classList.remove('editing');
                                                notesRef.current.blur();
                                            }}
                                        >
                                            {notesSaved ? '✓ Saved!' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {careLoading && (
                            <div className="care-loading"><Icon name="leaf" size={16} /> Loading care info...</div>
                        )}
                        {careError && !careLoading && (
                            <div className="care-error">{careError}</div>
                        )}
                        {careData && !careLoading && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {Object.entries(careData).map(([key, value]) =>
                                    CARE_LABELS[key] ? (
                                        <div key={key} className="care-item">
                                            <div className="care-item-label"><Icon name={CARE_LABELS[key].icon} size={14} /> {CARE_LABELS[key].label}</div>
                                            <div className="care-item-value">{value}</div>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}