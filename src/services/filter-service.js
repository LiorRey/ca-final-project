export const CURRENT_USER_ID_PLACEHOLDER = "currentUserId";

export function filterCards(cards, filterBy) {
  if (!cards || !filterBy) return cards;

  const { title = "", noMembers = false, members = [] } = filterBy;

  return cards.filter(card => {
    if (title && !card.title?.toLowerCase().includes(title.toLowerCase())) {
      return false;
    }

    const hasNoMembers = !card.assignedTo || card.assignedTo.length === 0;
    const matchesMembers =
      members && members.length > 0
        ? card.assignedTo && members.some(m => card.assignedTo.includes(m))
        : false;

    if (noMembers && members && members.length > 0) {
      return hasNoMembers || matchesMembers;
    }

    if (noMembers) {
      return hasNoMembers;
    }

    if (members && members.length > 0) {
      return matchesMembers;
    }

    return true;
  });
}

export function getFilteredBoard(board, filterBy) {
  if (!board?.lists) return board;

  return {
    ...board,
    lists: board.lists
      .filter(list => !list.archivedAt)
      .map(list => ({
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
    noMembers: false,
    members: [],
  };
}

export function getMembersFilterOptions(members) {
  if (!members) return [];
  return members.map(member => ({
    id: member._id,
    label: member.fullname,
    fullname: member.fullname,
    username: member.username,
  }));
}

export function parseFiltersFromSearchParams(searchParams) {
  const filterBy = getDefaultFilter();
  for (const [key, value] of searchParams.entries()) {
    if (!(key in filterBy)) continue;

    if (typeof filterBy[key] === "boolean") {
      filterBy[key] = value === "1";
    } else if (Array.isArray(filterBy[key])) {
      filterBy[key] = value
        .split(",")
        .map(v => v.trim())
        .filter(v => v);
    } else {
      filterBy[key] = value;
    }
  }

  return filterBy;
}

export function serializeFiltersToSearchParams(filterBy) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(filterBy)) {
    if (Array.isArray(value) && value.length > 0) {
      searchParams.set(key, value.join(","));
    } else if (typeof value === "boolean" && value) {
      searchParams.set(key, "1");
    } else if (typeof value === "string" && value) {
      searchParams.set(key, value);
    }
  }

  return searchParams;
}
