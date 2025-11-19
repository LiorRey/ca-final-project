import Card from "../models/Card.js";

export async function createCard(req, res, next) {
  try {
    const cardData = {
      ...req.body,
      createdAt: req.body.createdAt || Date.now(),
    };
    const card = new Card(cardData);
    await card.save();
    res.status(201).json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
}

export async function getAllCards(_req, res, next) {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    next(error);
  }
}

export async function getCardById(req, res, next) {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }
    res.json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
}

export async function updateCard(req, res, next) {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }
    res.json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
}

export async function deleteCard(req, res, next) {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }
    res.json({ success: true, message: "Card deleted successfully" });
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
