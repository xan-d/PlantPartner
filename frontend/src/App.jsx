import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import PlantGrid from "./pages/PlantGrid";
import AddPlant from "./pages/AddPlant";
import Home from "./pages/Home";
import UpdatePlant from './pages/UpdatePlant';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';

export default function App() {
    return (
        <div className="app-container">
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/plants" element={<PlantGrid />} />
                    <Route path="/plants/add" element={<AddPlant />} />
                    <Route path="/plants/:id/edit" element={<UpdatePlant />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/rooms/:roomName" element={<Room />} />
                </Routes>
            </main>
        </div>
    );
}