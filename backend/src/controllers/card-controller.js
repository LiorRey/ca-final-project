import * as cardService from "../services/card-service.js";
import { Card } from "../models/Card.js";

export async function createCard(req, res, next) {
  try {
    const card = await cardService.createCard(req.body);
    res.status(201).json({ card });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

export async function getAllCards(_req, res, next) {
  try {
    const cards = await cardService.getAllCards();
    res.json({ cards });
  } catch (error) {
    next(error);
  }
}

export async function getCardById(req, res, next) {
  try {
    const card = await cardService.getCardById(req.params.id);
    if (!card) return res.status(404).json({ error: "Card not found" });

    res.json({ card });
  } catch (error) {
    next(error);
  }
}

export async function updateCard(req, res, next) {
  try {
    const card = await cardService.updateCard(req.params.id, req.body);
    if (!card) return res.status(404).json({ error: "Card not found" });

    res.json({ card });
  } catch (error) {
    next(error);
  }
}

export async function deleteCard(req, res, next) {
  try {
    const card = await cardService.deleteCard(req.params.id);
    if (!card) return res.status(404).json({ error: "Card not found" });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getCardsByLabel(req, res, next) {
  try {
    const { labelId } = req.params;
    const cards = await Card.find({ labels: labelId }).sort({ createdAt: -1 });
    res.json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    next(error);
  }
}

export async function getCardsByAssignedUser(req, res, next) {
  try {
    const { userId } = req.params;
    const cards = await Card.find({ assignedTo: userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    next(error);
  }
}
