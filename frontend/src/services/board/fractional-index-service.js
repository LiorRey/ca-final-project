import { generateKeyBetween } from "fractional-indexing";

export function generateInitialPositions(count) {
  const positions = [];
  let previousPosition = null;

  for (let i = 0; i < count; i++) {
    const position = generateKeyBetween(previousPosition, null);
    positions.push(position);
    previousPosition = position;
  }

  return positions;
}

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
 * Calculate the new position for moving an item to a specific index
 * @param {Array} items - Array of items with position field (lists, cards, etc.)
 * @param {number} targetIndex - Target index for the moved item
 * @param {string} [movedItemId] - ID of the item being moved (to exclude from calculation)
 * @returns {string} New position string
 */
export function calculateNewPosition(items, targetIndex, movedItemId = null) {
  const relevantItems = movedItemId
    ? items.filter(item => item._id !== movedItemId)
    : items;

  const sortedItems = sortByPosition(relevantItems);

  if (sortedItems.length === 0) {
    return generateKeyBetween(null, null);
  }

  if (targetIndex <= 0) {
    return generatePositionAtStart(sortedItems[0].position);
  }

  if (targetIndex >= sortedItems.length) {
    return generatePositionAtEnd(sortedItems[sortedItems.length - 1].position);
  }

  const beforePosition = sortedItems[targetIndex - 1].position;
  const afterPosition = sortedItems[targetIndex].position;

  return generatePositionBetween(beforePosition, afterPosition);
}

export function sortByPosition(items) {
  return [...items].sort((a, b) => {
    if (a.position < b.position) return -1;
    if (a.position > b.position) return 1;
    return 0;
  });
}
