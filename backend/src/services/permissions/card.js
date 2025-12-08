import { Card } from "../../models/Card.js";
import { canModifyBoardContent, canViewBoard } from "./board.js";
import createError from "http-errors";

export async function canModifyCard(userId, cardId) {
  const card = await Card.findById(cardId);
  if (!card) throw createError(404, "Card not found");

  return await canModifyBoardContent(userId, card.boardId);
}

export async function canViewCard(userId, cardId) {
  const card = await Card.findById(cardId);
  if (!card) throw createError(404, "Card not found");

  return await canViewBoard(userId, card.boardId);
}
