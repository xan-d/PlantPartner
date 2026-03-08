import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { API_URL } from './config';
import PlantGrid from "./pages/PlantGrid";
import AddPlant from "./pages/AddPlant";
import Home from "./pages/Home";
import UpdatePlant from './pages/UpdatePlant';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';

export default function App() {
    const [authChecked, setAuthChecked] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    async function subscribeToPush() {
        try {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

            const reg = await navigator.serviceWorker.ready;

            // Get existing subscription or create new one
            let sub = await reg.pushManager.getSubscription();
            if (!sub) {
                const { publicKey } = await fetch(`${API_URL}/api/push/vapid-public-key`).then(r => r.json());
                sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: publicKey,
                });
            }

            // Send to backend
            await fetch(`${API_URL}/api/push/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(sub),
            });

            console.log('Push subscription saved!');
        } catch (err) {
            console.error('Push subscription failed:', err);
        }
    }

    useEffect(() => {
        fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })
            .then(res => {
                setLoggedIn(res.ok);
                setAuthChecked(true);
                if (res.ok) subscribeToPush();
            })
            .catch(() => setAuthChecked(true));
    }, []);

    if (!authChecked) return (
        <div style={{
            height: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
            fontFamily: "'Georgia', serif", background: '#f2efe8',
        }}>
            <div style={{ fontSize: 48, animation: 'spin 1.5s linear infinite' }}>🌿</div>
            <p style={{ color: '#6b7c60', fontSize: 14, fontStyle: 'italic' }}>
                Tending to your garden...
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div className="app-container">
            <main>
                <Routes>
                    <Route path="/" element={loggedIn ? <Navigate to="/dashboard" /> : <Home />} />
                    <Route path="/login" element={loggedIn ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/register" element={loggedIn ? <Navigate to="/dashboard" /> : <Register />} />
                    <Route path="/plants" element={loggedIn ? <PlantGrid /> : <Navigate to="/login" />} />
                    <Route path="/plants/add" element={loggedIn ? <AddPlant /> : <Navigate to="/login" />} />
                    <Route path="/plants/:id/edit" element={loggedIn ? <UpdatePlant /> : <Navigate to="/login" />} />
                    <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/rooms/:roomName" element={loggedIn ? <Room /> : <Navigate to="/login" />} />
                </Routes>
            </main>
        </div>
    );
}