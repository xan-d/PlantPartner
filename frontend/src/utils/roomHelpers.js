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
    const ROOM_ICONS = {
        'living room':  'sofa',
        'bedroom':      'bed',
        'kitchen':      'bowl',
        'bathroom':     'bathtub',
        'office':       'computer',
        'balcony':      'sun',
        'garden':       'leaf',
        'hallway':      'door',
        'dining room':  'restaurant',
        'garage':       'wrench',
        'unassigned':   'building',
    };

    const getRoomIcon = (name) => {
        const key = name.toLowerCase();
        for (const [keyword, icon] of Object.entries(ROOM_ICONS)) {
            if (key.includes(keyword)) return icon;
        }
        return 'plant';
    };

    const entries = Object.entries(grouped).map(([name, plants]) => ({
        name,
        plants,
        overdueCount: plants.filter(p => daysSince(p.lastWatered) >= p.waterFreq).length,
        icon: getRoomIcon(name),
    }));

    return entries.sort((a, b) => {
        if (a.name === 'Unassigned') return 1;
        if (b.name === 'Unassigned') return -1;
        return a.name.localeCompare(b.name);
    });
}