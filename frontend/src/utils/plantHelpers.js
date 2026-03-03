export function waterStatus(lastWatered, freq) {
    const ratio = lastWatered / freq;
    if (ratio >= 1) return { label: "Thirsty!", color: "#e04a4a", urgent: true };
    if (ratio >= 0.75) return { label: "Soon", color: "#d4a843", urgent: false };
    return { label: "Good", color: "#5aaa72", urgent: false };
}