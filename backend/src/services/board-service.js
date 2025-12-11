import { Board } from "../models/Board.js";

export async function createBoard(data) {
  return await Board.create(data);
}

export async function getAllBoards() {
  return await Board.find();
}

export async function getBoardById(id) {
  return await Board.findById(id);
}

export async function getFullBoardById(id) {
  const board = await Board.findById(id).populate({
    path: "lists",
    options: { sort: { position: 1 } },
    populate: {
      path: "cards",
      options: { sort: { position: 1 } },
    },
  });
  return board;
}

export async function updateBoard(id, data) {
  return await Board.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteBoard(id) {
  return await Board.findByIdAndDelete(id);
}

export async function getBoardLabels(boardId) {
  const board = await Board.findById(boardId);
  if (!board) throw new Error("Board not found");
  return board;
}

export async function addLabelToBoard(boardId, labelData) {
  const board = await Board.findByIdAndUpdate(
    boardId,
    { $push: { labels: labelData } },
    { new: true, runValidators: true }
  );
  return board.labels.at(-1);
}

export async function updateLabelInBoard(boardId, labelId, labelData) {
  const board = await Board.findOneAndUpdate(
    { _id: boardId, "labels._id": labelId },
    {
      $set: {
        "labels.$.title": labelData.title,
        "labels.$.color": labelData.color,
      },
    },
    { new: true, runValidators: true }
  );
  return board.labels.id(labelId);
}

export async function removeLabelFromBoard(boardId, labelId) {
  return await Board.findByIdAndUpdate(
    boardId,
    { $pull: { labels: { _id: labelId } } },
    { new: true }
  );
}
