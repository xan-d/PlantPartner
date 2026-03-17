// src/components/Icon.jsx
// Centralized SVG icon component — adjust ICON_DEFAULTS for global size/color/weight.
import React from 'react';

/* ── raw SVG imports (Vite ?raw) ── */
import alarmWarningSvg       from '../assets/icons/alarm-warning-line.svg?raw';
import alertSvg              from '../assets/icons/alert-line.svg?raw';
import bathtubSvg            from '../assets/icons/Bathtub-Shower--Streamline-Atlas.svg?raw';
import bowlSvg               from '../assets/icons/bowl-line.svg?raw';
import bugSvg                from '../assets/icons/bug-line.svg?raw';
import buildingSvg           from '../assets/icons/building-4-line.svg?raw';
import computerSvg           from '../assets/icons/computer-line.svg?raw';
import dnaSvg                from '../assets/icons/dna-line.svg?raw';
import doorSvg               from '../assets/icons/door-line.svg?raw';
import dropSvg               from '../assets/icons/drop-line.svg?raw';
import earthSvg              from '../assets/icons/earth-line.svg?raw';
import editSvg               from '../assets/icons/edit-line.svg?raw';
import homeSvg               from '../assets/icons/home-line.svg?raw';
import bedSvg                from '../assets/icons/hotel-bed-line.svg?raw';
import hourglassSvg          from '../assets/icons/hourglass-line.svg?raw';
import infoFillSvg           from '../assets/icons/information-fill.svg?raw';
import infoSvg               from '../assets/icons/information-line.svg?raw';
import leafSvg               from '../assets/icons/leaf-line.svg?raw';
import notificationSvg       from '../assets/icons/notification-3-line.svg?raw';
import plantSvg              from '../assets/icons/plant-line.svg?raw';
import restaurantSvg         from '../assets/icons/restaurant-line.svg?raw';
import rulerSvg              from '../assets/icons/ruler-line.svg?raw';
import scissorsSvg           from '../assets/icons/scissors-2-line.svg?raw';
import searchSvg             from '../assets/icons/search-line.svg?raw';
import sofaSvg               from '../assets/icons/sofa-line.svg?raw';
import starSvg               from '../assets/icons/star-line.svg?raw';
import sunSvg                from '../assets/icons/sun-line.svg?raw';
import testTubeSvg           from '../assets/icons/test-tube-line.svg?raw';
import thermometerSvg        from '../assets/icons/thermometer-fill.svg?raw';
import wrenchSvg             from '../assets/icons/wrench-line.svg?raw';

/* ── icon registry ── */
const registry = {
  alarmWarning:  alarmWarningSvg,
  alert:         alertSvg,
  bathtub:       bathtubSvg,
  bowl:          bowlSvg,
  bug:           bugSvg,
  building:      buildingSvg,
  computer:      computerSvg,
  dna:           dnaSvg,
  door:          doorSvg,
  drop:          dropSvg,
  earth:         earthSvg,
  edit:          editSvg,
  home:          homeSvg,
  bed:           bedSvg,
  hourglass:     hourglassSvg,
  infoFill:      infoFillSvg,
  info:          infoSvg,
  leaf:          leafSvg,
  notification:  notificationSvg,
  plant:         plantSvg,
  restaurant:    restaurantSvg,
  ruler:         rulerSvg,
  scissors:      scissorsSvg,
  search:        searchSvg,
  sofa:          sofaSvg,
  star:          starSvg,
  sun:           sunSvg,
  testTube:      testTubeSvg,
  thermometer:   thermometerSvg,
  wrench:        wrenchSvg,
};

/* ── Global defaults — tweak these to adjust all icons at once ── */
export const ICON_DEFAULTS = {
  size: 24,
  color: 'currentColor',   // inherits from parent CSS `color`
  strokeWidth: null,        // override stroke-width for stroke-based icons (e.g. Bathtub)
};

/**
 * Inline SVG icon component.
 *
 * @param {string}  name        - key from the registry above
 * @param {number}  [size]      - width & height in px  (default: ICON_DEFAULTS.size)
 * @param {string}  [color]     - CSS color value        (default: ICON_DEFAULTS.color)
 * @param {number}  [strokeWidth] - override stroke-width (default: ICON_DEFAULTS.strokeWidth)
 * @param {string}  [className]
 * @param {object}  [style]
 */
export default function Icon({
  name,
  size,
  color,
  strokeWidth,
  className = '',
  style = {},
}) {
  const s  = size        ?? ICON_DEFAULTS.size;
  const c  = color       ?? ICON_DEFAULTS.color;
  const sw = strokeWidth ?? ICON_DEFAULTS.strokeWidth;

  let svg = registry[name];
  if (!svg) return null;

  // Normalize hardcoded strokes to use currentColor
  svg = svg.replace(/stroke="#000000"/g, 'stroke="currentColor"');

  // Override stroke-width when requested
  if (sw != null) {
    svg = svg.replace(/stroke-width="[^"]*"/g, `stroke-width="${sw}"`);
  }

  // Set dimensions on the root <svg> element
  svg = svg.replace(/width="[^"]*"/, `width="${s}"`);
  svg = svg.replace(/height="[^"]*"/, `height="${s}"`);

  return (
    <span
      className={`icon ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        justifyContent: 'center',
        color: c,
        width: s,
        height: s,
        lineHeight: 1,
        flexShrink: 0,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}