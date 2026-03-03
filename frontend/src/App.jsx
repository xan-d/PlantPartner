/* 
Defines routes and links
*/
import React from 'react';
import { Routes, Route, Link } from "react-router-dom";

import PlantGrid from "./pages/PlantGrid";
import AddPlant from "./pages/AddPlant";
import Home from "./pages/Home"
import UpdatePlant from './pages/UpdatePlant';

//import './App.css';

export default function App() {
  const year = new Date().getFullYear();

  return (
    <div className="app-container">
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plants" element={<PlantGrid />} />
          <Route path="/plants/add" element={<AddPlant />} />
          <Route path="/plants/:id/edit" element={<UpdatePlant />} />
        </Routes>
      </main>
    </div>
  );
}
