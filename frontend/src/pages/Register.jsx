import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import '../styleSheets/Auth.css';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '', displayName: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) return setError(data.error || 'Registration failed');
            navigate('/dashboard');
        } catch {
            setError('Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
                <div className="auth-emoji auth-emoji-bg">
                    <img src="/logoWhite.png" alt="logo" className="auth-emoji-img-bg" />
                </div>
                <h1 className="auth-title auth-title-fg">Create Account</h1>
            <p className="auth-subtitle">Start taking care of your plants</p>
            <div className="auth-form">
                <input
                    name="displayName" type="text" placeholder="Display Name"
                    value={form.displayName} onChange={handle}
                    className="auth-input"
                />
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
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </div>
            <p style={{ marginTop: 24, fontSize: 14, color: '#6b7c60' }}>
                Already have an account?
                <Link to="/login" className="auth-link">Sign in</Link>
            </p>
        </div>
    );
}