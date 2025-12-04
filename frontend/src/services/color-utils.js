/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} - HSL values {h, s, l}
 */
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 1000) / 10,
    l: Math.round(l * 1000) / 10,
  };
}

/**
 * Convert hex color to HSL
 * @param {string} hex - Hex color (#RRGGBB)
 * @returns {Object} - HSL values {h, s, l}
 */
export function hexToHsl(hex) {
  // Remove # if present
  hex = hex.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return rgbToHsl(r, g, b);
}

/**
 * Set board background color and update CSS custom properties
 * @param {string} color - Hex color
 */
export function setBoardColorVariables(color) {
  const hsl = hexToHsl(color);

  const root = document.documentElement;
  root.style.setProperty("--board-hue", hsl.h);
  root.style.setProperty("--board-saturation", `${hsl.s}%`);
  root.style.setProperty("--board-lightness", `${hsl.l}%`);
}
