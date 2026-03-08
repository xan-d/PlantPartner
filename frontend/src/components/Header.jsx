import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import "../App.css";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    async function handleLogout() {
        // Unsubscribe from push notifications
        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            if (sub) {
                await fetch(`${API_URL}/api/push/unsubscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ endpoint: sub.endpoint }),
                });
                await sub.unsubscribe();
            }
        } catch (err) {
            console.error('Push unsubscribe failed:', err);
        }

        // Log out
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        window.location.href = '/login'
    }

    return (
        <header className="header">
            <h1 className="app-title">🌿Plant Partner</h1>

            <div className="menu-container">
                <button
                    className="hamburger"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
                    <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
                    <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
                </button>

                {menuOpen && (
                    <div className="dropdown">
                        <a href="/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>Dashboard</a>
                        <a href="/plants" className="dropdown-item" onClick={() => setMenuOpen(false)}>My Plants</a>
                        <div className="dropdown-divider" />
                        <button className="dropdown-item filter-item" onClick={() => setMenuOpen(false)}>
                            🔍 Filter
                        </button>
                        <div className="dropdown-divider" />
                        <button className="dropdown-item" onClick={handleLogout}
                            style={{ color: '#c0392b' }}>
                            🚪 Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}