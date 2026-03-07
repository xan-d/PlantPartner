import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import Header from '../components/Header';
import { getTopThirstyPlants, daysSince, daysUntil } from '../utils/plantHelpers';
import '../styleSheets/Dashboard.css';
import RoomGrid from '../components/RoomGrid';

export default function Dashboard() {
    const [plants, setPlants] = useState([]);
    const [stats, setStats] = useState({ timesWatered: 0, inspectionDueDate: null });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const [plantsRes, statsRes] = await Promise.all([
                    fetch(`${API_URL}/api/plants`, { credentials: 'include' }),
                    fetch(`${API_URL}/api/user/stats`, { credentials: 'include' }),
                ]);

                console.log('plants status:', plantsRes.status);
                console.log('stats status:', statsRes.status);

                const plantsData = plantsRes.ok ? await plantsRes.json() : [];
                const statsData = statsRes.ok ? await statsRes.json() : { timesWatered: 0, inspectionDueDate: null };

                console.log('plants:', plantsData);
                console.log('stats:', statsData);

                setPlants(plantsData);
                setStats(statsData);
            } catch (err) {
                console.error('Failed to load dashboard data', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const topThirsty = getTopThirstyPlants(plants, 5);
    const overdueCount = plants.filter(p => daysSince(p.lastWatered) >= p.waterFreq).length;
    const daysUntilInspection = stats.inspectionDueDate ? daysUntil(stats.inspectionDueDate) : null;

    const statCards = [
        { icon: '🌿', label: 'Total Plants', value: plants.length },
        { icon: '💧', label: 'Times Watered', value: stats.timesWatered },
        { icon: '🚨', label: 'Overdue for Water', value: overdueCount },
        { icon: '🔍', label: 'Days Until Inspection', value: daysUntilInspection ?? '—' },
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <p>🌱 Loading your garden...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Header />

            <div className="dashboard-content">

                {/* Stat Cards Grid */}
                <div className="stat-grid">
                    {statCards.map(card => (
                        <div key={card.label} className="stat-card">
                            <div className="stat-icon">{card.icon}</div>
                            <div className="stat-value">{card.value}</div>
                            <div className="stat-label">{card.label}</div>
                        </div>
                    ))}
                </div>

                {/* Rooms — full width, prime real estate */}
                <RoomGrid plants={plants} />

                {/* Bottom row — two cards side by side */}
                <div className="dashboard-grid">

                    {/* Top 5 Thirsty Plants */}
                    <div className="dashboard-section">
                        <h2 className="section-title">💧 Needs Water Soon</h2>
                        {topThirsty.length === 0 ? (
                            <p className="section-empty">All plants are happy and hydrated!</p>
                        ) : (
                            <div className="thirsty-list">
                                {topThirsty.map(plant => {
                                    const days = daysSince(plant.lastWatered);
                                    const overdue = days >= plant.waterFreq;
                                    return (
                                        <div
                                            key={plant.plantID}
                                            className="thirsty-item"
                                            onClick={() => navigate(`/plants`)}
                                        >
                                            <img src={plant.image} alt={plant.name} className="thirsty-img" />
                                            <div className="thirsty-info">
                                                <div className="thirsty-name">{plant.name}</div>
                                                <div className="thirsty-meta">
                                                    Last watered {days}d ago · every {plant.waterFreq}d
                                                </div>
                                            </div>
                                            <span className={`thirsty-badge ${overdue ? 'overdue' : 'upcoming'}`}>
                                                {overdue ? 'Overdue' : `${plant.waterFreq - days}d left`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Inspection */}
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">🔍 Plant Inspection</h2>
                            <div className="info-tooltip">
                                <span className="info-icon">i</span>
                                <div className="tooltip-text">
                                    Set a date to remind yourself to check on your plants — take new photos, check for pests, and assess overall health. (Usually ~30 days)
                                </div>
                            </div>
                        </div>
                        {stats.inspectionDueDate ? (
                            <div className="inspection-info">
                                <div className="inspection-countdown">
                                    {daysUntilInspection <= 0
                                        ? '⚠️ Inspection overdue!'
                                        : `${daysUntilInspection} days away`}
                                </div>
                                <div className="inspection-date">
                                    Due: {new Date(stats.inspectionDueDate).toLocaleDateString()}
                                </div>
                            </div>
                        ) : (
                            <p className="section-empty">No inspection date set.</p>
                        )}
                        <div className="inspection-set">
                            <label className="inspection-label">Set next inspection date</label>
                            <input
                                type="date"
                                className="inspection-input"
                                value={stats.inspectionDueDate ? stats.inspectionDueDate.split('T')[0] : ''}
                                onChange={async (e) => {
                                    const newDate = e.target.value;
                                    setStats(prev => ({ ...prev, inspectionDueDate: newDate }));
                                    await fetch(`${API_URL}/api/user/stats`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        credentials: 'include',
                                        body: JSON.stringify({ inspectionDueDate: newDate }),
                                    });
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}