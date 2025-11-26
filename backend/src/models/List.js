import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
  boardId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  position: {
    type: String,
    required: true,
  },
  archivedAt: {
    type: Number,
    default: null,
  },
  deletedAt: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  updatedAt: {
    type: Number,
    default: Date.now,
  },
});

export const List = mongoose.model("List", listSchema);
