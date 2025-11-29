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
