import express from 'express';
import {
  createCard,
  getAllCards,
  getCardById,
  updateCard,
  deleteCard,
  getCardsByLabel,
  getCardsByAssignedUser,
} from '../controllers/cardController.js';

const router = express.Router();

// Card routes
router.post('/', createCard);
router.get('/', getAllCards);
router.get('/:id', getCardById);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

// Additional filtered routes
router.get('/label/:labelId', getCardsByLabel);
router.get('/assigned/:userId', getCardsByAssignedUser);

export default router;
