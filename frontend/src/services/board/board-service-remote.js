import { httpService } from "../http-service";

export const boardService = {
  query,
  getById,
  getFullById,
  // remove,
  // save,
  // updateBoard,
  // getEmptyCard,
  addCard,
  editCard,
  deleteCard,
  // copyCard,
  // moveCard,
  getEmptyList,
  createList,
  // moveList,
  // copyList,
  // archiveList,
  // unarchiveList,
  // moveAllCards,
  // archiveAllCardsInList,
  updateCardLabels,
  createLabel,
  editLabel,
  // deleteLabel,
  // getBoardPreviews,
  // getBoardListPreviews,
};

async function query() {
  const data = await httpService.get("boards");
  return data.boards;
}

async function getById(boardId) {
  const data = await httpService.get(`boards/${boardId}`);
  return data.board;
}

async function getFullById(boardId) {
  const data = await httpService.get(`boards/${boardId}/full`);
  return data.board;
}

// async function remove(boardId) {
//   await httpService.delete(`boards/${boardId}`);
// }

// async function save(board) {
//   if (board._id) {
//     const data = await httpService.put(`boards/${board._id}`, board);
//     return data.board;
//   } else {
//     const data = await httpService.post("boards", board);
//     return data.board;
//   }
// }

// async function updateBoard(boardId, updates) {
//   const data = await httpService.put(`boards/${boardId}`, updates);
//   return data.board;
// }

function getEmptyCard() {
  return {
    _id: crypto.randomUUID(),
    title: "",
    description: "",
    labelIds: [],
    createdAt: null,
    archivedAt: null,
  };
}

async function addCard(boardId, listId, card) {
  const cardData = {
    ...card,
    listId,
    boardId,
  };
  return await httpService.post("cards", cardData);
}

async function editCard(_boardId, card, _listId) {
  return await httpService.put(`cards/${card._id}`, card);
}

async function deleteCard(boardId, cardId, listId) {
  await httpService.delete(`cards/${cardId}`);
  return { cardId };
}

// async function copyCard(copyData, card) {
//   const {
//     destinationBoardId,
//     destinationListId,
//     keepLabels,
//     keepMembers,
//     position,
//     title,
//   } = copyData;

//   const clonedCard = {
//     title,
//     description: card.description,
//     listId: destinationListId,
//     boardId: destinationBoardId,
//     assignedTo: keepMembers ? card.assignedTo : [],
//     labelIds: keepLabels ? card.labelIds : [],
//     position,
//   };

//   const data = await httpService.post("cards", clonedCard);
//   return data.card;
// }

// async function moveCard(moveData, card) {
//   const { destinationListId, destinationBoardId, position } = moveData;

//   const payload = {
//     listId: destinationListId,
//     boardId: destinationBoardId,
//     targetIndex: position,
//   };

//   const data = await httpService.put(`cards/${card._id}/move`, payload);
//   return data.card;
// }

function getEmptyList() {
  return {
    _id: crypto.randomUUID(),
    title: "",
    cards: [],
    archivedAt: null,
    position: null,
  };
}

async function createList(boardId, listData) {
  const payload = {
    ...listData,
    boardId,
  };
  const data = await httpService.post("lists", payload);
  if (!data.list.cards) data.list.cards = [];
  return data;
}

// async function moveList(listId, targetBoardId, targetIndex) {
//   const payload = {
//     boardId: targetBoardId,
//     targetIndex,
//   };
//   const data = await httpService.put(`lists/${listId}/move`, payload);
//   return data.list;
// }

// async function copyList(boardId, listId, newName) {
//   const list = await httpService.get(`lists/${listId}`);
//   const originalList = list.list;

//   const clonedList = {
//     title: newName,
//     boardId,
//   };

//   const createdList = await httpService.post("lists", clonedList);
//   const newList = createdList.list;

//   for (const card of originalList.cards || []) {
//     await httpService.post("cards", {
//       title: card.title,
//       description: card.description,
//       listId: newList._id,
//       boardId,
//       labelIds: card.labelIds,
//       assignedTo: card.assignedTo,
//     });
//   }

//   return newList;
// }

// async function archiveList(boardId, listId) {
//   const data = await httpService.put(`lists/${listId}/archive`);
//   return data.list;
// }

// async function unarchiveList(boardId, listId) {
//   const payload = { archivedAt: null };
//   const data = await httpService.put(`lists/${listId}`, payload);
//   return data.list;
// }

// async function moveAllCards(boardId, sourceListId, targetListId, options = {}) {
//   const sourceList = await httpService.get(`lists/${sourceListId}`);
//   const cards = sourceList.list.cards || [];

//   let targetId = targetListId;
//   if (!targetId) {
//     const newList = await createList(boardId, {
//       title: options.newListTitle || "New List",
//     });
//     targetId = newList._id;
//   }

//   for (const card of cards) {
//     await httpService.put(`cards/${card._id}/move`, {
//       listId: targetId,
//       boardId,
//       targetIndex: 0,
//     });
//   }

//   return { sourceListId, targetListId: targetId };
// }

// async function archiveAllCardsInList(boardId, listId) {
//   const sourceList = await httpService.get(`lists/${listId}`);
//   const cards = sourceList.list.cards || [];

//   for (const card of cards) {
//     if (!card.archivedAt) {
//       await httpService.put(`cards/${card._id}`, {
//         archivedAt: Date.now(),
//       });
//     }
//   }

//   return { listId };
// }

async function updateCardLabels(_boardId, _listId, cardId, updatedCardLabels) {
  const payload = {
    labelIds: updatedCardLabels,
  };
  const data = await httpService.put(`cards/${cardId}`, payload);
  console.log("data card", data);
  return updatedCardLabels;
}

async function createLabel(boardId, label) {
  const data = await httpService.post(`boards/${boardId}/labels`, label);
  return data.label;
}

async function editLabel(boardId, label) {
  const data = await httpService.put(
    `boards/${boardId}/labels/${label._id}`,
    label
  );
  return data.label;
}

// async function deleteLabel(boardId, labelId) {
//   const data = await httpService.delete(`boards/${boardId}/labels/${labelId}`);
//   return data.labels;
// }

// async function getBoardPreviews() {
//   const data = await httpService.get("boards");
//   return data.boards.map(board => ({
//     _id: board._id,
//     title: board.title,
//   }));
// }

// async function getBoardListPreviews(boardId) {
//   const data = await httpService.get("lists", { boardId });
//   return data.lists.map(list => ({
//     _id: list._id,
//     title: list.title,
//     cardCount: list.cards?.length || 0,
//   }));
// }
