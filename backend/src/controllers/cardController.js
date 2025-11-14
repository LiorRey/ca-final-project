import Card from '../models/Card.js';

/**
 * Card Controller
 * Handles all card-related business logic
 */

// Create a new card
export const createCard = async (req, res, next) => {
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
};

// Get all cards
export const getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    next(error);
  }
};

// Get card by ID
export const getCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: 'Card not found' });
    }
    res.json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
};

// Update card by ID
export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: 'Card not found' });
    }
    res.json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
};

// Delete card by ID
export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: 'Card not found' });
    }
    res.json({ success: true, message: 'Card deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get cards by label
export const getCardsByLabel = async (req, res, next) => {
  try {
    const { labelId } = req.params;
    const cards = await Card.find({ labels: labelId }).sort({ createdAt: -1 });
    res.json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    next(error);
  }
};

// Get cards assigned to a user
export const getCardsByAssignedUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cards = await Card.find({ assignedTo: userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    next(error);
  }
};
