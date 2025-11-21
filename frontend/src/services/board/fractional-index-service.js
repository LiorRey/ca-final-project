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
 * @param {Array} lists - Array of lists with position field
 * @param {number} targetIndex - Target index for the moved item
 * @param {string} [movedItemId] - ID of the item being moved (to exclude from calculation)
 * @returns {string} New position string
 */
export function calculateNewPosition(lists, targetIndex, movedItemId = null) {
  const relevantLists = movedItemId
    ? lists.filter(list => list.id !== movedItemId)
    : lists;

  const sortedLists = sortByPosition(relevantLists);

  if (sortedLists.length === 0) {
    return generateKeyBetween(null, null);
  }

  if (targetIndex <= 0) {
    return generatePositionAtStart(sortedLists[0].position);
  }

  if (targetIndex >= sortedLists.length) {
    return generatePositionAtEnd(sortedLists[sortedLists.length - 1].position);
  }

  const beforePosition = sortedLists[targetIndex - 1].position;
  const afterPosition = sortedLists[targetIndex].position;

  return generatePositionBetween(beforePosition, afterPosition);
}

export function sortByPosition(lists) {
  return [...lists].sort((a, b) => {
    if (a.position < b.position) return -1;
    if (a.position > b.position) return 1;
    return 0;
  });
}
