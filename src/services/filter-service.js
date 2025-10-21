export function filterCards(cards, filterBy) {
  if (!cards || !filterBy) return cards;

  const { title = "" } = filterBy;

  if (!title) {
    return cards;
  }

  return cards.filter(card => {
    return card.title?.toLowerCase().includes(title.toLowerCase());
  });
}

export function getFilteredBoard(board, filterBy) {
  if (!board?.lists) return board;

  return {
    ...board,
    lists: board.lists.map(list => ({
      ...list,
      cards: filterCards(list.cards, filterBy),
    })),
  };
}

export function getDefaultFilter() {
  return {
    labels: [],
    title: "",
    includeNoLabels: false,
  };
}
