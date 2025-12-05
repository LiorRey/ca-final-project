import { httpService } from "../http-service";

export const boardService = {
  query,
  getById,
  getFullById,
  updateCardLabels,
};

export async function query() {
  try {
    const data = await httpService.get("boards");
    console.log("data query", data);
    return data.boards;
  } catch (error) {
    console.error("Cannot get boards:", error);
    throw error;
  }
}

async function getById(boardId) {
  try {
    const data = await httpService.get(`boards/${boardId}`);
    return data.board;
  } catch (error) {
    console.error("Cannot get board:", error);

    throw error;
  }
}

async function getFullById(boardId) {
  try {
    const data = await httpService.get(`boards/${boardId}/full`);
    console.log("data getFullById", data);
    return data.board;
  } catch (error) {
    console.error("Cannot get full board:", error);
    throw error;
  }
}

async function updateCardLabels(_boardId, _listId, cardId, updatedCardLabels) {
  const payload = {
    labelIds: updatedCardLabels,
  };
  try {
    const data = await httpService.put(`cards/${cardId}`, payload);
    console.log("data card", data);
    return updatedCardLabels;
  } catch (error) {
    console.error("Cannot update card labels:", error);
    throw error;
  }
}
