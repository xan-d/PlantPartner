import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import '../styleSheets/BugForm.css';

export default function BugReportModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [consoleLogs, setConsoleLogs] = useState([]);

  // Capture console logs
  useEffect(() => {
    const logs = [];
    ["log", "warn", "error"].forEach(method => {
      const original = console[method];
      console[method] = (...args) => {
        logs.push({
          method,
          message: args.map(String).join(" "),
          time: new Date().toISOString()
        });
        // Keep only the last 50
        if (logs.length > 50) logs.shift();
        setConsoleLogs([...logs]);
        original.apply(console, args);
      };
    });
  }, []);

  const submitBug = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/bugs/report-bug`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title || "No title provided",
          description,
          page: window.location.href,
          userAgent: navigator.userAgent,
          console: consoleLogs, // send captured logs
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit bug");

      alert(`Bug submitted! Issue URL: ${data.issueUrl}`);
      setTitle("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error("Failed to submit bug:", err);
      alert("Failed to submit bug");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bug-card">
      <h3>🐞 Report a Bug</h3>
      <form onSubmit={submitBug}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bug title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the problem..."
          rows={4}
          required
        />
        <div className="bug-card-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}