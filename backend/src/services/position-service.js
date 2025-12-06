import { generateKeyBetween } from "fractional-indexing";

export function generatePositionAtStart(firstPosition) {
  return generateKeyBetween(null, firstPosition);
}

export function generatePositionAtEnd(lastPosition) {
  return generateKeyBetween(lastPosition, null);
}

export function generatePositionBetween(beforePosition, afterPosition) {
  return generateKeyBetween(beforePosition, afterPosition);
}

/**
 * Calculates a new fractional position string for an item being moved to a target index.
 * Uses fractional-indexing helpers to ensure correct ordering and avoid collisions.
 *
 * @param {Array<{position: string}>} items - Array of items (lists/cards), each with a position field.
 * @param {number} targetIndex - The index where the item should be moved.
 * @returns {string} The new fractional position string.
 *
 * Edge cases handled:
 * - Moving to the start: returns a position before the first item.
 * - Moving to the end: returns a position after the last item.
 * - Moving between two items: returns a position between them.
 * - Empty array: returns the initial position.
 */
export function calculateNewPosition(items, targetIndex) {
  let prev = null;
  let next = null;

  if (targetIndex > 0) prev = items[targetIndex - 1];
  if (targetIndex < items.length) next = items[targetIndex];

  if (!prev && next) {
    return generatePositionAtStart(next.position);
  } else if (prev && !next) {
    return generatePositionAtEnd(prev.position);
  } else if (prev && next) {
    return generatePositionBetween(prev.position, next.position);
  } else {
    return generateKeyBetween(null, null);
  }
}
