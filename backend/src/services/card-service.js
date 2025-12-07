import { Card } from "../models/Card.js";
import { Board } from "../models/Board.js";
import { User } from "../models/User.js";
import { calculateNewPosition } from "./position-service.js";
import createError from "http-errors";

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

export async function updateCardLabels(id, labelIds) {
  return await Card.findByIdAndUpdate(
    id,
    { labelIds },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function addComment(cardId, user, text) {
  const card = await Card.findById(cardId);
  if (!card) throw createError(404, "Card not found");

  const newComment = {
    author: {
      userId: user._id,
      username: user.username,
    },
    text: text.trim(),
  };

  card.comments.push(newComment);
  await card.save();

  return card.comments[card.comments.length - 1];
}

export async function updateComment(cardId, commentId, text) {
  const card = await Card.findById(cardId);
  if (!card) throw createError(404, "Card not found");

  const comment = card.comments.id(commentId);
  if (!comment) throw createError(404, "Comment not found");

  comment.text = text.trim();
  await card.save();

  return comment;
}

export async function deleteComment(cardId, commentId) {
  const card = await Card.findById(cardId);
  if (!card) throw createError(404, "Card not found");

  const comment = card.comments.id(commentId);
  if (!comment) throw createError(404, "Comment not found");

  card.comments.pull(commentId);
  await card.save();

  return true;
}

export async function getComments(cardId) {
  const card = await Card.findById(cardId);
  if (!card) {
    throw createError(404, "Card not found");
  }

  return card.comments;
}

export async function addCardAssignee(cardId, userId) {
  const card = await Card.findById(cardId);
  if (!card) throw createError(404, "Card not found");

  const board = await Board.findById(card.boardId);
  if (!board) throw createError(404, "Board not found");

  const user = await User.findById(userId);
  if (!user) throw createError(404, "User not found");

  const isBoardMember = board.members.some(
    member => member.userId.toString() === userId
  );
  if (!isBoardMember) throw createError(400, "User is not a board member");

  const isAlreadyAssigned = card.assignees.some(
    assignee => assignee.userId.toString() === userId
  );
  if (isAlreadyAssigned) {
    throw createError(400, "User is already assigned to this card");
  }

  return await Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        assignees: { userId, username: user.username },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function removeCardAssignee(cardId, userId) {
  return await Card.findByIdAndUpdate(
    cardId,
    {
      $pull: {
        assignees: { userId },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
}
