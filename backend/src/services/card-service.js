import { Card } from "../models/Card.js";
import { calculateNewPosition } from "./position-service.js";

export async function createCard(cardData) {
  const { boardId, listId, title, description, targetIndex } = cardData;
  let position;
  if (!targetIndex) {
    const cards = await Card.find({ listId }).sort({ position: 1 });
    position = calculateNewPosition(cards, cards.length);
  } else {
    // TODO: implement inserting at specific index
  }
  const card = await Card.create({
    boardId,
    listId,
    title,
    description,
    position,
  });
  return card;
}

export async function getAllCards() {
  return await Card.find();
}

export async function getCardById(id) {
  return await Card.findById(id);
}

export async function updateCard(id, updateData) {
  const { title, description } = updateData;
  return await Card.findByIdAndUpdate(
    id,
    { title, description },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function deleteCard(id) {
  return await Card.findByIdAndDelete(id);
}
