/**
 * Service for handling drag and drop operations
 */

/**
 * Reorders cards within lists based on drag and drop operation
 * @param {Array} lists - Array of list objects
 * @param {string} sourceDroppableId - ID of the source list
 * @param {string} destinationDroppableId - ID of the destination list
 * @param {number} sourceIndex - Index of the card in the source list
 * @param {number} destinationIndex - Index where the card should be placed in the destination list
 * @param {string} draggableId - ID of the card being moved
 * @returns {Array} New array of lists with reordered cards
 */
export function reorderCards(
  lists,
  sourceDroppableId,
  destinationDroppableId,
  sourceIndex,
  destinationIndex,
  draggableId
) {
  // Find source and destination lists
  const sourceListIndex = lists.findIndex(
    list => list.id === sourceDroppableId
  );
  const destinationListIndex = lists.findIndex(
    list => list.id === destinationDroppableId
  );

  // Validate that both lists exist
  if (sourceListIndex === -1 || destinationListIndex === -1) {
    throw new Error("Source or destination list not found");
  }

  const sourceList = lists[sourceListIndex];
  const destinationList = lists[destinationListIndex];

  // Find the card being moved
  const cardToMove = sourceList.cards.find(card => card.id === draggableId);

  if (!cardToMove) {
    throw new Error("Card not found in source list");
  }

  // Create new lists array
  const newLists = [...lists];

  // Moving within the same list
  if (sourceListIndex === destinationListIndex) {
    const newCards = Array.from(sourceList.cards);
    newCards.splice(sourceIndex, 1);
    newCards.splice(destinationIndex, 0, cardToMove);

    newLists[sourceListIndex] = {
      ...sourceList,
      cards: newCards,
    };
  } else {
    // Moving to a different list
    // Remove from source
    const newSourceCards = sourceList.cards.filter(
      (_, index) => index !== sourceIndex
    );

    // Add to destination
    const newDestinationCards = Array.from(destinationList.cards);
    newDestinationCards.splice(destinationIndex, 0, cardToMove);

    newLists[sourceListIndex] = {
      ...sourceList,
      cards: newSourceCards,
    };

    newLists[destinationListIndex] = {
      ...destinationList,
      cards: newDestinationCards,
    };
  }

  return { newLists, cardToMove };
}

/**
 * Reorders lists within a board based on drag and drop operation
 * @param {Array} lists - Array of list objects
 * @param {number} sourceIndex - Index of the list being moved
 * @param {number} destinationIndex - Index where the list should be placed
 * @returns {Object} Object containing the new lists array and the list that was moved
 */
export function reorderLists(lists, sourceIndex, destinationIndex) {
  // Validate indices
  if (
    sourceIndex < 0 ||
    sourceIndex >= lists.length ||
    destinationIndex < 0 ||
    destinationIndex >= lists.length
  ) {
    throw new Error("Invalid source or destination index");
  }

  // Create a new array to avoid mutating the original
  const newLists = Array.from(lists);
  const [listToMove] = newLists.splice(sourceIndex, 1);
  newLists.splice(destinationIndex, 0, listToMove);

  const before = newLists[destinationIndex - 1]?.id || null;
  const after = newLists[destinationIndex + 1]?.id || null;

  return { newLists, listToMove, before, after };
}
