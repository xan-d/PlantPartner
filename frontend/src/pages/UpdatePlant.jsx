// UTILS
import { daysSince } from '../utils/plantHelpers';

export default function UpdatePlant() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [dragging, setDragging] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
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

    async function handleFetchCare() {
        if (!form.careLink) return;
        setFetching(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/plants/care-preview?url=${encodeURIComponent(form.careLink)}`, {
                credentials: 'include',
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                setError(body.error || 'Could not fetch care info');
                return;
            }
            const care = await res.json();
            setForm(prev => ({
                ...prev,
                ...(care.commonName && { name: care.commonName }),
                ...(care.scientificName && { scientific: care.scientificName }),
                ...(care.sun && { light: care.sun }),
            }));

            if (care.imageUrl) {
                setImagePreview(care.imageUrl);
                const proxyUrl = `${API_URL}/api/plants/proxy-image?url=${encodeURIComponent(care.imageUrl)}`;
                const blob = await fetch(proxyUrl, { credentials: 'include' }).then(r => r.blob());
                const file = new File([blob], 'plant-cover.webp', { type: 'image/webp' });
                setImageFile(file);
            }
        } catch (err) {
            setError('Failed to fetch care info');
        } finally {
            setFetching(false);
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
        // only append image if a new one was selected
        if (imageFile) formData.append('image', imageFile);
        Object.entries(form).forEach(([key, val]) => {
            // if we have a new imageFile, don't append the old image URL/path
            if (key === 'image' && imageFile) {
                return;
            }
            formData.append(key, val);
        });

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
            <div className="plant-form-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7c60', fontSize: 14 }}>
                Loading plant...
            </div>
        );
    }

    return (
        <div className="plant-form-root">
            <div className="plant-form-card">
                <h2 className="plant-form-title">✏️ Update Plant</h2>
                <p className="plant-form-subtitle">Edit the details for {form.name || 'your plant'}</p>
                {/* Image Drop Zone */}
                <div className={`plant-form-dropzone${dragging ? ' dragging' : ''}`}
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleImageDrop}
                >
                    {imagePreview ? (
                        <img src={imagePreview} alt="preview" />
                    ) : (
                        <div className="dropzone-hint">
                            <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
                            Drag & drop or click to upload
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                    />
                </div>
                {/* Form Fields */}
                <div className="plant-form-fields">
                    <div className="full-width">
                        <label className="plant-form-label">Common Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} className="plant-form-input" placeholder="e.g. Golden Pothos" />
                    </div>
                    <div className="full-width">
                        <label className="plant-form-label">Scientific Name *</label>
                        <input name="scientific" value={form.scientific} onChange={handleChange} className="plant-form-input" placeholder="e.g. Epipremnum aureum" />
                    </div>
                    <div>
                        <label className="plant-form-label">Room</label>
                        <input name="room" value={form.room} onChange={handleChange} className="plant-form-input" placeholder="e.g. Living Room" />
                    </div>
                    <div>
                        <label className="plant-form-label">Light</label>
                        <select name="light" value={form.light} onChange={handleChange} className="plant-form-select">
                            <option>Low</option>
                            <option>Indirect</option>
                            <option>Bright</option>
                            <option>Any</option>
                        </select>
                    </div>
                    <div>
                        <label className="plant-form-label">Last Watered (days ago)</label>
                        <input name="lastWatered" type="number" min="0" value={form.lastWatered} onChange={handleChange} className="plant-form-input" placeholder="e.g. 2" />
                    </div>
                    <div>
                        <label className="plant-form-label">Water Every (days)</label>
                        <input name="waterFreq" type="number" min="1" value={form.waterFreq} onChange={handleChange} className="plant-form-input" placeholder="e.g. 7" />
                    </div>
                    <div>
                        <label className="plant-form-label">Last Fed (days ago)</label>
                        <input name="lastFed" type="number" min="0" value={form.lastFed} onChange={handleChange} className="plant-form-input" placeholder="e.g. 14" />
                    </div>
                    <div>
                        <label className="plant-form-label">Health</label>
                        <select name="health" value={form.health} onChange={handleChange} className="plant-form-select">
                            <option value="happy">Happy</option>
                            <option value="okay">Okay</option>
                            <option value="thirsty">Thirsty</option>
                        </select>
                    </div>
                    <div className="full-width">
                        <label className="plant-form-label">Care Link</label>
                        <div className="plant-form-care-row">
                            <input
                                name="careLink"
                                value={form.careLink}
                                onChange={handleChange}
                                className="plant-form-input custom-input"
                                placeholder="https://gardenish.co/plants/your-plant"
                                style={{ flex: 1, fontSize: 12, color: '#3d3d3d', fontWeight: 500 }}
                            />
                            <button
                                onClick={handleFetchCare}
                                disabled={!form.careLink || fetching}
                                className="plant-form-care-btn"
                            >
                                {fetching ? '...' : '🔍 Fetch'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="plant-form-label">Card Color</label>
                        <input name="color" type="color" value={form.color} onChange={handleChange} className="plant-form-input plant-form-color" />
                    </div>
                </div>
                {error && <div className="plant-form-error">{error}</div>}
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
                        {submitting ? 'Saving...' : <><img src="/logoWhite.png" alt="logo" style={{ width: 20, height: 20, verticalAlign: 'middle', marginRight: 6 }} />Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    );
}