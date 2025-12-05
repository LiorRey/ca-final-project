import { Card } from "../../models/Card.js";
import { canModifyBoardContent, canViewBoard } from "./board.js";

export async function canModifyCard(userId, cardId) {
  const card = await Card.findById(cardId);
  if (!card) return false;

  return await canModifyBoardContent(userId, card.boardId);
}

export async function canViewCard(userId, cardId) {
  const card = await Card.findById(cardId);
  if (!card) return false;

  return await canViewBoard(userId, card.boardId);
}
