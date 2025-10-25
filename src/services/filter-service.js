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

  if (searchParams.has("title")) {
    filterBy.title = searchParams.get("title");
  }

  if (searchParams.has("noMembers")) {
    filterBy.noMembers = searchParams.get("noMembers") === "1";
  }

  if (searchParams.has("members")) {
    const membersParam = searchParams.get("members");
    filterBy.members = membersParam
      .split(",")
      .map(id => id.trim())
      .filter(id => id);
  }

  return filterBy;
}

export function serializeFiltersToSearchParams(filterBy) {
  const searchParams = new URLSearchParams();

  if (filterBy.title) {
    searchParams.set("title", filterBy.title);
  }

  if (filterBy.noMembers) {
    searchParams.set("noMembers", "1");
  }

  if (filterBy.members && filterBy.members.length > 0) {
    searchParams.set("members", filterBy.members.join(","));
  }

  return searchParams;
}
