import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "List",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      required: true,
    },
    labelIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    assignees: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        assignedAt: {
          type: Date,
          default: Date.now,
        },
        assignedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Card = mongoose.model("Card", cardSchema);
