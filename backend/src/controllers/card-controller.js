import { Card } from "../models/Card.js";

export async function createCard(req, res, next) {
  try {
    const { boardId, listId, title, description, position } = req.body;

    const card = await Card.create({
      boardId,
      listId,
      title,
      description,
      position,
    });
    res.status(201).json({ card });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
  }
}

export async function getAllCards(_req, res, next) {
  try {
    const cards = await Card.find();
    res.json({ cards });
  } catch (error) {
    next(error);
  }
}

export async function getCardById(req, res, next) {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ error: "Card not found" });

    res.json({ card });
  } catch (error) {
    next(error);
  }
}

export async function updateCard(req, res, next) {
  try {
    const { title, description } = req.body;
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { title, description },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!card) return res.status(404).json({ error: "Card not found" });

    res.json({ card });
  } catch (error) {
    next(error);
  }
}

export async function deleteCard(req, res, next) {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
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
