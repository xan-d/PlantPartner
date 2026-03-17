import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import '../styleSheets/Auth.css';

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
            window.location.href = '/dashboard';
        } catch {
            setError('Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root auth-logo-bg">
            <div className="auth-emoji auth-emoji-bg">
                <img src="/logoWhite.png" alt="logo" className="auth-emoji-img-bg" />
            </div>
            <h1 className="auth-title auth-title-fg">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to check on your plants</p>
            <div className="auth-form">
                <input
                    name="email" type="email" placeholder="Email"
                    value={form.email} onChange={handle}
                    className="auth-input"
                />
                <input
                    name="password" type="password" placeholder="Password"
                    value={form.password} onChange={handle}
                    onKeyDown={e => e.key === 'Enter' && submit()}
                    className="auth-input"
                />
                {error && <p className="auth-error">{error}</p>}
                <button onClick={submit} disabled={loading} className="auth-btn">
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </div>
            <p style={{ marginTop: 24, fontSize: 14, color: '#6b7c60' }}>
                Don't have an account?
                <Link to="/register" className="auth-link">Register</Link>
            </p>
        </div>
    );
}