export function waterStatus(lastWatered, freq) {
    const ratio = lastWatered / freq;
    if (ratio >= 1) return { label: "Thirsty!", color: "#e04a4a", urgent: true };
    if (ratio >= 0.75) return { label: "Soon", color: "#d4a843", urgent: false };
    return { label: "Good", color: "#5aaa72", urgent: false };
}

export function daysSince(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export const CARE_LABELS = {
    sun: "☀️ Sun",
    water: "💧 Water Needs",
    temp: "🌡️ Temp Range",
    zones: "🗺️ USDA Zones",
    soil: "🪴 Soil Type",
    toxicity: "⚠️ Toxicity",
    drought: "🏜️ Drought",
    type: "🌿 Plant Type",
    fertilizer: "🧪 Fertilizer",
    pruning: "✂️ Pruning",
    lifespan: "⏳ Lifespan",
    size: "📏 Mature Size",
    ph: "🧬 Soil pH",
    difficulty: "⭐ Difficulty",
};

export function truncateText(text, maxChars) {
    if (!text) return "";
    return text.length > maxChars ? text.slice(0, maxChars - 1) + "…" : text;
}

export const greenShades = ["#4A7C59", "#4a7a58", "#4A6B3A", "#486843", "#3D6B4F"];

export function daysUntil(dateStr) {
    if (!dateStr) return '';
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getTopThirstyPlants(plants, n = 5) {
    if (!plants || plants.length === 0) return [];

    return [...plants]
        .sort((a, b) => {
            const urgencyA = daysSince(a.lastWatered) / a.waterFreq;
            const urgencyB = daysSince(b.lastWatered) / b.waterFreq;
            return urgencyB - urgencyA;
        })
        .slice(0, n);
}