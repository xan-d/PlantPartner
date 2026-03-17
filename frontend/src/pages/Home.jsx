import React from 'react';
import { Link } from 'react-router-dom';
import '../styleSheets/Home.css';

export default function Home() {
    return (
        <div className="home-root" style={{ position: 'relative' }}>
            <div className="home-outer-circle"></div>
            <div className="home-circle" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Logo in background */}
                <div className="home-emoji">
                    <img src="/logoWhite.png" alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                {/* Title */}
                <div className="home-title-group">
                    <span className="home-title home-title-plant" style={{ color: '#222', fontWeight: 800 }}>Plant</span>
                    <span className="home-title home-title-partner" style={{ color: '#222', fontWeight: 800 }}>Partner</span>
                </div>
                {/* Subtitle */}
                <p className="app-subtitle">Keep your plants happy, one drop at a time.</p>
                {/* CTA Button */}
                <Link to="/login" className="home-cta-btn">
                    Get Started
                </Link>
            </div>
        </div>
    );
}