import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) return setError(data.error || 'Login failed');
            navigate('/dashboard');
        } catch {
            setError('Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '97vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            padding: '0px', fontFamily: "'Georgia', serif",
            background: 'linear-gradient(160deg, #f0f5ec 0%, #e8f0e5 100%)',
            borderRadius: 15,
        }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
            <h1 style={{ fontSize: 36, color: '#2d3a28', margin: '0 0 8px', fontWeight: 700 }}>
                Welcome Back
            </h1>
            <p style={{ fontSize: 16, color: '#6b7c60', fontStyle: 'italic', margin: '0 0 32px' }}>
                Sign in to check on your plants
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
                <input
                    name="email" type="email" placeholder="Email"
                    value={form.email} onChange={handle}
                    style={inputStyle}
                />
                <input
                    name="password" type="password" placeholder="Password"
                    value={form.password} onChange={handle}
                    onKeyDown={e => e.key === 'Enter' && submit()}
                    style={inputStyle}
                />
                {error && <p style={{ color: '#c0392b', margin: 0, fontSize: 14 }}>{error}</p>}
                <button onClick={submit} disabled={loading} style={btnStyle}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </div>

            <p style={{ marginTop: 24, fontSize: 14, color: '#6b7c60' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#4a7c59', fontWeight: 600 }}>Register</Link>
            </p>
        </div>
    );
}

const inputStyle = {
    padding: '12px 16px', borderRadius: 10, border: '1.5px solid #c8d8c0',
    fontSize: 15, fontFamily: "'Helvetica Neue', sans-serif",
    background: '#fff', outline: 'none', color: '#2d3a28',
};

const btnStyle = {
    background: '#4a7c59', color: '#fff', border: 'none',
    padding: '14px 36px', borderRadius: 50, fontSize: 15,
    fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 700,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    boxShadow: '0 4px 18px rgba(74,124,89,0.30)', cursor: 'pointer',
    marginTop: 4,
};