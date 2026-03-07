/**
 * roomHelpers.js
 * Utility functions for grouping and summarising plants by room.
 */

/**
 * Groups an array of plants by their `room` field.
 * Plants without a room are grouped under "Unassigned".
 *
 * @param {Array} plants
 * @returns {Object} e.g. { "Living Room": [...plants], "Bedroom": [...plants] }
 */
export function groupPlantsByRoom(plants = []) {
    return plants.reduce((acc, plant) => {
        const room = plant.room?.trim() || 'Unassigned';
        if (!acc[room]) acc[room] = [];
        acc[room].push(plant);
        return acc;
    }, {});
}

/**
 * Returns an array of room summary objects, sorted alphabetically
 * with "Unassigned" always last.
 *
 * @param {Object} grouped - result of groupPlantsByRoom()
 * @param {Function} daysSince - imported from plantHelpers
 * @returns {Array} [{ name, plants, overdueCount, emoji }]
 */
export function getRoomSummaries(grouped, daysSince) {
    const ROOM_EMOJIS = {
        'living room':  '🛋️',
        'bedroom':      '🛏️',
        'kitchen':      '🍳',
        'bathroom':     '🚿',
        'office':       '💻',
        'balcony':      '🌇',
        'garden':       '🌳',
        'hallway':      '🚪',
        'dining room':  '🍽️',
        'garage':       '🔧',
        'unassigned':   '📦',
    };

    const getRoomEmoji = (name) => {
        const key = name.toLowerCase();
        for (const [keyword, emoji] of Object.entries(ROOM_EMOJIS)) {
            if (key.includes(keyword)) return emoji;
        }
        return '🪴';
    };

    const entries = Object.entries(grouped).map(([name, plants]) => ({
        name,
        plants,
        overdueCount: plants.filter(p => daysSince(p.lastWatered) >= p.waterFreq).length,
        emoji: getRoomEmoji(name),
    }));

    return entries.sort((a, b) => {
        if (a.name === 'Unassigned') return 1;
        if (b.name === 'Unassigned') return -1;
        return a.name.localeCompare(b.name);
    });
}