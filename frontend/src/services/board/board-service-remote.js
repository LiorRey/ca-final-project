import { httpService } from "../http-service";

export const boardService = {
  query,
  getById,
  getFullById,
};

export async function query() {
  try {
    const data = await httpService.get("boards");
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
    return data.board;
  } catch (error) {
    console.error("Cannot get full board:", error);
    throw error;
  }
}
