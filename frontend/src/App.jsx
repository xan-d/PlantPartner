/* 
Defines routes and links
*/
import React from 'react';
import { Routes, Route, Link } from "react-router-dom";

import PlantGrid from "./components/PlantCard";
import AddPlant from "./components/AddPlant";


import Home from "./pages/HomePage"

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
        </Routes>
      </main>
    </div>
  );
}
