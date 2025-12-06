import createError from "http-errors";
import * as cardService from "../services/card-service.js";
import { Card } from "../models/Card.js";

export async function createCard(req, res) {
  const card = await cardService.createCard(req.body);
  res.status(201).json({ card });
}

export async function getAllCards(_req, res) {
  const cards = await cardService.getAllCards();
  res.json({ cards });
}

export async function getCardById(req, res, next) {
  const card = await cardService.getCardById(req.params.id);
  if (!card) throw createError(404, "Card not found");

  res.json({ card });
}

export async function updateCard(req, res) {
  const card = await cardService.updateCard(req.params.id, req.body);
  if (!card) throw createError(404, "Card not found");

  res.json({ card });
}

export async function deleteCard(req, res) {
  const card = await cardService.deleteCard(req.params.id);
  if (!card) throw createError(404, "Card not found");

  res.status(204).send();
}

export async function getCardsByLabel(req, res) {
  const { labelId } = req.params;
  const cards = await Card.find({ labels: labelId }).sort({ createdAt: -1 });
  res.json({ cards });
}

export async function getCardsByAssignedUser(req, res) {
  const { userId } = req.params;
  const cards = await Card.find({ assignedTo: userId }).sort({
    createdAt: -1,
  });
  res.json({ cards });
}

export async function updateLabels(req, res) {
  const { labelIds } = req.body;
  const card = await cardService.updateCardLabels(req.params.id, labelIds);
  if (!card) throw createError(404, "Card not found");

  res.json({ card });
}

export async function addComment(req, res) {
  const { cardId } = req.params;
  const { text } = req.body;

  const comment = await cardService.addComment(cardId, req.currentUser, text);
  res.status(201).json({ comment });
}

export async function updateComment(req, res) {
  const { cardId, commentId } = req.params;
  const { text } = req.body;

  const comment = await cardService.updateComment(cardId, commentId, text);
  res.json({ comment });
}

export async function deleteComment(req, res) {
  const { cardId, commentId } = req.params;

  await cardService.deleteComment(cardId, commentId);
  res.status(204).send();
}

export async function getComments(req, res) {
  const { cardId } = req.params;

  const comments = await cardService.getComments(cardId);
  res.json({ comments });
}
