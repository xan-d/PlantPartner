import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import '../App.css';

// UTILS
import { daysSince } from '../utils/plantHelpers';

const FIELD_STYLE = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: '1.5px solid #e8e2d4',
    background: '#faf8f3',
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: 13,
    color: '#2d3a28',
    boxSizing: 'border-box',
    outline: 'none',
};

const LABEL_STYLE = {
    display: 'block',
    fontSize: 11,
    fontFamily: "'Helvetica Neue', sans-serif",
    color: '#6b7c60',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: 4,
};

export default function UpdatePlant() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [dragging, setDragging] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fileInputRef = useRef();

    const [form, setForm] = useState({
        name: '',
        scientific: '',
        room: '',
        light: 'Indirect',
        lastWatered: '',
        waterFreq: '',
        lastFed: '',
        health: 'happy',
        careLink: '',
        color: '#4a7c59',
    });

    // Fetch existing plant data on mount
    useEffect(() => {
        async function fetchPlant() {
            try {
                const res = await fetch(`${API_URL}/api/plants/${id}`, { credentials: 'include' });
                if (!res.ok) throw new Error('Plant not found');
                const plant = await res.json();

                setForm({
                    name: plant.name || '',
                    scientific: plant.scientific || '',
                    room: plant.room || '',
                    light: plant.light || 'Indirect',
                    lastWatered: daysSince(plant.lastWatered),
                    waterFreq: plant.waterFreq ?? '',
                    lastFed: daysSince(plant.lastFed),
                    health: plant.health || 'happy',
                    careLink: plant.careLink || '',
                    color: plant.color || '#4a7c59',
                });

                if (plant.imageUrl) {
                    setImagePreview(plant.imageUrl);
                }
            } catch (err) {
                setError('Could not load plant data.');
            } finally {
                setLoading(false);
            }
        }
        fetchPlant();
    }, [id]);

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleImageDrop(e) {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    async function handleSubmit() {
        if (!form.name || !form.scientific) {
            setError('Name and scientific name are required.');
            return;
        }
        setSubmitting(true);
        setError(null);

        const formData = new FormData();
        // Only append image if a new one was selected
        if (imageFile) formData.append('image', imageFile);
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));

        try {
            const res = await fetch(`${API_URL}/api/plants/${id}`, {
                method: 'PUT',
                body: formData,
                credentials: 'include' });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                setError(body.error || 'Failed to update plant');
                return;
            }
            navigate('/plants');
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f2efe8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Helvetica Neue', sans-serif",
                color: '#6b7c60',
                fontSize: 14,
            }}>
                Loading plant...
            </div>
        );
    }

    return (
        <div style={{
            height: '97vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0px 0px',
            fontFamily: "'Georgia', serif",
            background: '#f2efe8',
            borderRadius: 15,
        }}>
            <div style={{
                maxWidth: 480,
                margin: '0 auto',
                background: '#faf8f3',
                borderRadius: 20,
                border: '1.5px solid #e8e2d4',
                boxShadow: '0 4px 24px rgba(60,80,40,0.08)',
                padding: '32px 32px',
            }}>
                {/* Header */}
                <h2 style={{
                    fontSize: 26, color: '#2d3a28', fontWeight: 700,
                    margin: '0 0 6px', letterSpacing: '-0.02em',
                }}>✏️ Update Plant</h2>
                <p style={{
                    color: '#8a9e80', fontSize: 13, fontStyle: 'italic',
                    margin: '0 0 28px', fontFamily: "'Helvetica Neue', sans-serif",
                }}>Edit the details for {form.name || 'your plant'}</p>

                {/* Image Drop Zone */}
                <div style={{ marginBottom: 20 }}>
                    <label style={LABEL_STYLE}>Plant Photo</label>
                    <div
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleImageDrop}
                        style={{
                            border: `2px dashed ${dragging ? '#4a7c59' : '#c8d8c0'}`,
                            borderRadius: 12,
                            height: 140,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            background: dragging ? '#eef5eb' : '#f5f7f3',
                            overflow: 'hidden',
                            transition: 'border-color 0.2s, background 0.2s',
                            position: 'relative',
                        }}
                    >
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="preview" style={{
                                    width: '100%', height: '100%', objectFit: 'cover',
                                }} />
                                {/* Hover overlay hint */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(0,0,0,0.35)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    color: '#fff',
                                    fontSize: 12,
                                    fontFamily: "'Helvetica Neue', sans-serif",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                >
                                    Click to replace photo
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#8a9e80' }}>
                                <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
                                <div style={{ fontSize: 12, fontFamily: "'Helvetica Neue', sans-serif" }}>
                                    Drag & drop or click to upload
                                </div>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                    />
                </div>

                {/* Form Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={LABEL_STYLE}>Common Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} style={FIELD_STYLE} placeholder="e.g. Golden Pothos" />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={LABEL_STYLE}>Scientific Name *</label>
                        <input name="scientific" value={form.scientific} onChange={handleChange} style={FIELD_STYLE} placeholder="e.g. Epipremnum aureum" />
                    </div>
                    <div>
                        <label style={LABEL_STYLE}>Room</label>
                        <input name="room" value={form.room} onChange={handleChange} style={FIELD_STYLE} placeholder="e.g. Living Room" />
                    </div>
                    <div>
                        <label style={LABEL_STYLE}>Light</label>
                        <select name="light" value={form.light} onChange={handleChange} style={FIELD_STYLE}>
                            <option>Low</option>
                            <option>Indirect</option>
                            <option>Bright</option>
                            <option>Any</option>
                        </select>
                    </div>
                    <div>
                        <label style={LABEL_STYLE}>Last Watered (days ago)</label>
                        <input name="lastWatered" type="number" min="0" value={form.lastWatered} onChange={handleChange} style={FIELD_STYLE} placeholder="e.g. 2" />
                    </div>
                    <div>
                        <label style={LABEL_STYLE}>Water Every (days)</label>
                        <input name="waterFreq" type="number" min="1" value={form.waterFreq} onChange={handleChange} style={FIELD_STYLE} placeholder="e.g. 7" />
                    </div>
                    <div>
                        <label style={LABEL_STYLE}>Last Fed (days ago)</label>
                        <input name="lastFed" type="number" min="0" value={form.lastFed} onChange={handleChange} style={FIELD_STYLE} placeholder="e.g. 14" />
                    </div>
                    <div>
                        <label style={LABEL_STYLE}>Health</label>
                        <select name="health" value={form.health} onChange={handleChange} style={FIELD_STYLE}>
                            <option value="happy">Happy</option>
                            <option value="okay">Okay</option>
                            <option value="thirsty">Thirsty</option>
                        </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={LABEL_STYLE}>Care Link</label>
                        <input name="careLink" value={form.careLink} onChange={handleChange} style={FIELD_STYLE} placeholder="https://..." />
                    </div>
                    <div>
                        <label style={LABEL_STYLE}>Card Color</label>
                        <input name="color" type="color" value={form.color} onChange={handleChange} style={{ ...FIELD_STYLE, padding: 4, height: 36, cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p style={{
                        color: '#e07b4a', fontSize: 12,
                        fontFamily: "'Helvetica Neue', sans-serif",
                        margin: '0 0 12px',
                    }}>{error}</p>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button
                        onClick={() => navigate('/plants')}
                        style={{
                            flex: 1, padding: '10px 0', borderRadius: 10,
                            border: '1.5px solid #e8e2d4', background: 'transparent',
                            color: '#6b7c60', fontFamily: "'Helvetica Neue', sans-serif",
                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{
                            flex: 2, padding: '10px 0', borderRadius: 10,
                            border: 'none', background: '#4a7c59',
                            color: '#fff', fontFamily: "'Helvetica Neue', sans-serif",
                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            opacity: submitting ? 0.7 : 1,
                        }}
                    >
                        {submitting ? 'Saving...' : '🌿 Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}