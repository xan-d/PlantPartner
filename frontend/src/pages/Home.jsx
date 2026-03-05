import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
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
            background: 'linear-gradient(160deg, #f0f5ec 0%, #e8f0e5 100%)',
            borderRadius: 15,
        }}>

            {/* Big emoji */}
            <div style={{ fontSize: 72, marginBottom: 16, lineHeight: 1 }}>🌿</div>

            {/* Title */}
            <h1 style={{
                fontSize: 48,
                color: '#2d3a28',
                margin: '0 0 12px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
            }}>
                PlantPartner
            </h1>

            {/* Subtitle */}
            <p style={{
                fontSize: 18,
                color: '#6b7c60',
                fontStyle: 'italic',
                margin: '0 0 40px',
                maxWidth: 340,
                lineHeight: 1.6,
                fontFamily: "'Georgia', serif",
            }}>
                Keep your plants happy, one drop at a time.
            </p>

            {/* CTA Button */}
            <Link to="/login" style={{
                display: 'inline-block',
                background: '#4a7c59',
                color: '#fff',
                textDecoration: 'none',
                padding: '14px 36px',
                borderRadius: 50,
                fontSize: 15,
                fontFamily: "'Helvetica Neue', sans-serif",
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 18px rgba(74,124,89,0.30)',
                transition: 'transform 0.15s, box-shadow 0.15s',
            }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(74,124,89,0.40)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(74,124,89,0.30)';
                }}
            >
                Get Started
            </Link>

        </div>
        
    );
}