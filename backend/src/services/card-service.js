import { Card } from "../models/Card.js";
import { Board } from "../models/Board.js";
import { User } from "../models/User.js";
import { List } from "../models/List.js";
import { calculateNewPosition } from "./position-service.js";
import { getBoardById } from "./board-service.js";
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
  const { title, description, startDate, dueDate } = updateData;
  return await Card.findByIdAndUpdate(
    id,
    { title, description, startDate, dueDate },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function deleteCard(id) {
  return await Card.findByIdAndDelete(id);
}

export async function moveCard(cardId, listId, boardId, targetIndex) {
  const board = await getBoardById(boardId);
  if (!board) {
    throw createError(404, "Board not found");
  }

  const list = await List.findById(listId);
  if (!list) {
    throw createError(404, "List not found");
  }

  if (list.boardId.toString() !== boardId) {
    throw createError(400, "List does not belong to the specified board");
  }

  // Get cards from target list, excluding the card being moved
  // This prevents position calculation conflicts when moving within same list
  let cards = await Card.find({
    listId,
    _id: { $ne: cardId },
  }).sort({ position: 1 });

  let newPosition = calculateNewPosition(cards, targetIndex);

  return await Card.findByIdAndUpdate(
    cardId,
    { position: newPosition, listId, boardId },
    { new: true }
  );
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
      fullname: user.fullname,
    },
    text: text.trim(),
  };

  card.comments.push(newComment);
  await card.save();

  return card;
}

export async function updateComment(cardId, commentId, text) {
  const card = await Card.findById(cardId);
  if (!card) throw createError(404, "Card not found");

  const comment = card.comments.id(commentId);
  if (!comment) throw createError(404, "Comment not found");

  comment.text = text.trim();
  await card.save();

  return card;
}

export async function deleteComment(cardId, commentId) {
  const card = await Card.findById(cardId);
  if (!card) throw createError(404, "Card not found");

  const comment = card.comments.id(commentId);
  if (!comment) throw createError(404, "Comment not found");

  card.comments.pull(commentId);
  await card.save();

  return card;
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
        assignees: {
          userId,
          username: user.username,
          fullname: user.fullname,
        },
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

export async function updateCover(cardId, coverData) {
  const { color, img, textOverlay } = coverData;
  const card = await Card.findByIdAndUpdate(
    cardId,
    {
      $set: {
        "cover.img": img,
        "cover.color": color,
        "cover.textOverlay": textOverlay,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!card) throw createError(404, "Card not found");
  return card;
}

export async function addAttachment(cardId, attachmentData) {
  const { url, name = "", publicId = "" } = attachmentData || {};
  if (!url) throw createError(400, "url is required");

  const card = await Card.findById(cardId);
  if (!card) throw createError(404, "Card not found");

  card.attachments.push({
    url: String(url).trim(),
    name: String(name || "").trim(),
    publicId: String(publicId || "").trim(),
  });
  await card.save();

  return card;
}

export async function removeAttachment(cardId, attachmentId) {
  const card = await Card.findById(cardId);
  if (!card) throw createError(404, "Card not found");

  const attachment = card.attachments.id(attachmentId);
  if (!attachment) throw createError(404, "Attachment not found");

  attachment.deleteOne();
  await card.save();

  return card;
}

export async function copyCard(cardId, copyOptions = {}) {
  const {
    copyLabels = false,
    copyAssignees = false,
    copyComments = false,
    copyDates = false,
    targetListId = null,
    targetBoardId = null,
    targetIndex = null,
    title,
  } = copyOptions;
  const sourceCard = await Card.findById(cardId);
  if (!sourceCard) throw createError(404, "Source card not found");

  let finalBoardId = targetBoardId ?? sourceCard.boardId;
  let finalListId = targetListId ?? sourceCard.listId;
  let targetBoard = null;

  if (targetBoardId && targetBoardId !== sourceCard.boardId) {
    targetBoard = await Board.findById(targetBoardId);
    if (!targetBoard) throw createError(404, "Target board not found");
  }

  const targetCards = await Card.find({ listId: finalListId }).sort({
    position: 1,
  });

  const finalIndex = targetIndex ?? targetCards.length;
  const newPosition = calculateNewPosition(targetCards, finalIndex);

  const copiedCardData = {
    boardId: finalBoardId,
    listId: finalListId,
    title: title ?? sourceCard.title,
    description: sourceCard.description,
    position: newPosition,
  };

  if (copyLabels && sourceCard.labelIds.length > 0) {
    copiedCardData.labelIds = [...sourceCard.labelIds];
  }

  if (copyAssignees && sourceCard.assignees.length > 0) {
    const assigneeUserIds = sourceCard.assignees.map(a => a.userId);
    const users = await User.find({ _id: { $in: assigneeUserIds } });
    const validUserIds = new Set(users.map(u => u._id.toString()));
    let targetBoardMemberIds = null;

    if (targetBoard) {
      targetBoardMemberIds = new Set(
        targetBoard.members.map(m => m.userId.toString())
      );
    }

    const validAssignees = sourceCard.assignees.filter(assignee => {
      const userIdStr = assignee.userId.toString();
      if (!validUserIds.has(userIdStr)) return false;

      // If moving boards, user must be member of target board
      if (targetBoardMemberIds) {
        return targetBoardMemberIds.has(userIdStr);
      }

      return true;
    });

    copiedCardData.assignees = validAssignees;
  }

  if (copyDates) {
    copiedCardData.startDate = sourceCard.startDate;
    copiedCardData.dueDate = sourceCard.dueDate;
  }

  // Create the copied card
  const copiedCard = await Card.create(copiedCardData);

  if (copyComments && sourceCard.comments.length > 0) {
    const copiedComments = sourceCard.comments.map(comment => ({
      author: comment.author,
      text: comment.text,
      isEdited: false,
    }));

    copiedCard.comments = copiedComments;
    await copiedCard.save();
  }

  return copiedCard;
}
