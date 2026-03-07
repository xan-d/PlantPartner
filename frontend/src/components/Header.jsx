import { useState } from "react";
import "../App.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <h1 className="app-title">🌿 PlantPartner</h1>

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
          </div>
        )}
      </div>
    </header>
  );
}